#!/usr/bin/env node
/**
 * 萌萌幻奏 account service.
 *
 * - Discord is the only way in. A login succeeds only when the player holds one of
 *   DISCORD_ROLE_ID in guild DISCORD_GUILD_ID; every failure quietly returns to the
 *   public site with no reason given.
 * - A successful login sets a signed session cookie for mistbound.galbands.com and its
 *   subdomains (so ng.mistbound.galbands.com can use it too), then sends the player to ng.
 * - Saves of logged-in players live here, keyed by Discord id. Players who never log in
 *   keep their saves in their own browser; this service never sees them.
 *
 * Mount /account/* behind a same-origin reverse proxy.
 * Zero dependencies: Node 22+ with node:sqlite.
 */
import { createServer } from 'node:http';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SESSION_COOKIE = 'mb_session';
export const STATE_COOKIE = 'mb_oauth';
const DAY = 86400;
const GAME_RE = /^[a-z][a-z0-9-]{0,15}$/;
const SLOT_RE = /^[a-z0-9][a-z0-9_-]{0,31}$/;
const ID_RE = /^\d{5,25}$/;
export const LIMITS = { save: 8 * 1024 * 1024, meta: 2048, slots: 12, total: 64 * 1024 * 1024 };

export function loadConfig(env = process.env) {
  const list = value => String(value || '').split(',').map(item => item.trim()).filter(Boolean);
  const trim = value => String(value).replace(/\/+$/, '');
  return {
    host: env.ACCOUNT_HOST || '127.0.0.1',
    port: Number(env.ACCOUNT_PORT || 18530),
    db: env.ACCOUNT_DB || '/var/lib/mistbound-account/account.db',
    backupDir: env.ACCOUNT_BACKUP_DIR ?? '/var/lib/mistbound-account/backups',
    backupKeep: Number(env.ACCOUNT_BACKUP_KEEP || 7),
    publicOrigin: trim(env.PUBLIC_ORIGIN || 'https://mistbound.galbands.com'),
    ngOrigin: trim(env.NG_ORIGIN || 'https://ng.mistbound.galbands.com'),
    cookieDomain: env.COOKIE_DOMAIN ?? 'mistbound.galbands.com',
    cookieSecure: env.COOKIE_SECURE !== '0',
    sessionSecret: env.SESSION_SECRET || '',
    proxySecret: env.PROXY_SECRET || '',
    sessionDays: Number(env.SESSION_DAYS || 7),
    cookieDays: Number(env.COOKIE_DAYS || env.SESSION_DAYS || 7),
    discord: {
      clientId: env.DISCORD_CLIENT_ID || '',
      clientSecret: env.DISCORD_CLIENT_SECRET || '',
      guildId: env.DISCORD_GUILD_ID || '',
      roleIds: list(env.DISCORD_ROLE_ID),
      api: trim(env.DISCORD_API || 'https://discord.com/api/v10'),
      authorize: env.DISCORD_AUTHORIZE || 'https://discord.com/oauth2/authorize',
    },
  };
}

/** Login is offered only when every piece it needs is configured. */
export const loginReady = config => Boolean(config.discord.clientId && config.discord.clientSecret
  && config.discord.guildId && config.discord.roleIds.length && config.sessionSecret.length >= 32);

const sign = (body, secret) => createHmac('sha256', secret).update(body).digest();
export function signSession(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${sign(body, secret).toString('base64url')}`;
}
/** The payload when the token is genuine and unexpired, otherwise null. */
export function readSession(token, secret, now = Math.floor(Date.now() / 1000)) {
  if (typeof token !== 'string' || token.length > 2048 || !secret) return null;
  const dot = token.indexOf('.');
  if (dot < 1) return null;
  const body = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1), 'base64url');
  const wanted = sign(body, secret);
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) return null;
  let payload;
  try { payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')); } catch { return null; }
  if (payload?.v !== 1 || typeof payload.sub !== 'string' || !ID_RE.test(payload.sub)) return null;
  return payload.exp > now ? payload : null;
}

const safeEqual = (given, wanted) => {
  if (typeof given !== 'string' || typeof wanted !== 'string' || !wanted) return false;
  const a = Buffer.from(given), b = Buffer.from(wanted);
  return a.length === b.length && timingSafeEqual(a, b);
};
function parseCookies(header) {
  const out = {};
  for (const part of String(header || '').split(';')) {
    const at = part.indexOf('=');
    if (at < 1) continue;
    const key = part.slice(0, at).trim();
    if (!(key in out)) out[key] = part.slice(at + 1).trim();
  }
  return out;
}

function openDatabase(file) {
  if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS accounts(
      id TEXT PRIMARY KEY, name TEXT NOT NULL, avatar TEXT,
      created_at INTEGER NOT NULL, last_login INTEGER NOT NULL, logins INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS saves(
      account_id TEXT NOT NULL REFERENCES accounts(id), game TEXT NOT NULL, slot TEXT NOT NULL,
      data TEXT NOT NULL, meta TEXT NOT NULL DEFAULT '{}', size INTEGER NOT NULL, updated_at INTEGER NOT NULL,
      PRIMARY KEY(account_id, game, slot));
    CREATE TABLE IF NOT EXISTS saves_prev(
      account_id TEXT NOT NULL, game TEXT NOT NULL, slot TEXT NOT NULL,
      data TEXT NOT NULL, meta TEXT NOT NULL, size INTEGER NOT NULL, updated_at INTEGER NOT NULL, replaced_at INTEGER NOT NULL,
      PRIMARY KEY(account_id, game, slot));`);
  return db;
}

/** A fixed-window counter per key; enough to blunt hammering from one address or account. */
function createLimiter(now) {
  const hits = new Map();
  return key => (limit, seconds) => {
    const at = now(), row = hits.get(key);
    if (!row || row.reset <= at) { hits.set(key, { count: 1, reset: at + seconds * 1000 }); if (hits.size > 5000) for (const [k, v] of hits) if (v.reset <= at) hits.delete(k); return true; }
    row.count += 1;
    return row.count <= limit;
  };
}

class HttpError extends Error { constructor(status, code) { super(code); this.status = status; this.code = code; } }

function readBody(request, limit) {
  return new Promise((resolveBody, reject) => {
    const declared = Number(request.headers['content-length'] || 0);
    if (declared > limit) { reject(new HttpError(413, 'too-large')); request.resume(); return; }
    const chunks = [];
    let size = 0, failed = false;
    request.on('data', chunk => {
      if (failed) return;
      size += chunk.length;
      if (size > limit) { failed = true; reject(new HttpError(413, 'too-large')); request.resume(); return; }
      chunks.push(chunk);
    });
    request.on('end', () => { if (!failed) resolveBody(Buffer.concat(chunks)); });
    request.on('error', error => { if (!failed) { failed = true; reject(error); } });
  });
}

function send(response, status, body, headers = {}) {
  const text = body === undefined ? '' : JSON.stringify(body);
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', ...headers,
  });
  response.end(text);
}
function redirect(response, location, cookies = []) {
  response.writeHead(302, { Location: location, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', ...(cookies.length ? { 'Set-Cookie': cookies } : {}) });
  response.end();
}

const defaultLog = entry => process.stdout.write(`${JSON.stringify({ t: new Date().toISOString(), ...entry })}\n`);

export function createAccountApp(config, { fetchImpl = globalThis.fetch, log = defaultLog, now = () => Date.now() } = {}) {
  const db = openDatabase(config.db);
  const limit = createLimiter(now);
  const sql = {
    upsertAccount: db.prepare(`INSERT INTO accounts(id,name,avatar,created_at,last_login,logins) VALUES(?,?,?,?,?,1)
      ON CONFLICT(id) DO UPDATE SET name=excluded.name, avatar=excluded.avatar, last_login=excluded.last_login, logins=logins+1`),
    accountExists: db.prepare('SELECT 1 FROM accounts WHERE id=?'),
    list: db.prepare('SELECT slot, meta, size, updated_at FROM saves WHERE account_id=? AND game=? ORDER BY updated_at DESC'),
    get: db.prepare('SELECT slot, data, meta, size, updated_at FROM saves WHERE account_id=? AND game=? AND slot=?'),
    head: db.prepare('SELECT meta, size, updated_at FROM saves WHERE account_id=? AND game=? AND slot=?'),
    count: db.prepare('SELECT COUNT(*) AS n FROM saves WHERE account_id=? AND game=?'),
    total: db.prepare('SELECT COALESCE(SUM(size),0) AS n FROM saves WHERE account_id=?'),
    keepPrevious: db.prepare(`INSERT INTO saves_prev(account_id,game,slot,data,meta,size,updated_at,replaced_at)
      SELECT account_id,game,slot,data,meta,size,updated_at,? FROM saves WHERE account_id=? AND game=? AND slot=?
      ON CONFLICT(account_id,game,slot) DO UPDATE SET data=excluded.data, meta=excluded.meta, size=excluded.size, updated_at=excluded.updated_at, replaced_at=excluded.replaced_at`),
    put: db.prepare(`INSERT INTO saves(account_id,game,slot,data,meta,size,updated_at) VALUES(?,?,?,?,?,?,?)
      ON CONFLICT(account_id,game,slot) DO UPDATE SET data=excluded.data, meta=excluded.meta, size=excluded.size, updated_at=excluded.updated_at`),
    remove: db.prepare('DELETE FROM saves WHERE account_id=? AND game=? AND slot=?'),
  };
  const discord = config.discord;
  const redirectUri = `${config.publicOrigin}/account/callback`;
  const cookie = (name, value, maxAge, path = '/') => [`${name}=${value}`, `Path=${path}`,
    config.cookieDomain ? `Domain=${config.cookieDomain}` : '', 'HttpOnly', config.cookieSecure ? 'Secure' : '',
    'SameSite=Lax', `Max-Age=${maxAge}`].filter(Boolean).join('; ');
  const clearState = cookie(STATE_COOKIE, '', 0, '/account');
  const allowedOrigins = new Set([config.publicOrigin, config.ngOrigin]);
  let lastStamp = 0;
  const stamp = () => { lastStamp = Math.max(now(), lastStamp + 1); return lastStamp; };

  function authorizeUrl(state, prompt) {
    const url = new URL(discord.authorize);
    url.search = new URLSearchParams({ response_type: 'code', client_id: discord.clientId,
      scope: 'identify guilds.members.read', redirect_uri: redirectUri, state, prompt }).toString();
    return url.href;
  }
  async function discordJson(path, init, { missingOk = false } = {}) {
    const response = await fetchImpl(`${discord.api}${path}`, { ...init, signal: AbortSignal.timeout(10000) });
    if (missingOk && (response.status === 404 || response.status === 403)) return null;
    if (!response.ok) throw new HttpError(502, `discord ${path.split('/')[1] || ''} ${response.status}`);
    return response.json();
  }
  function session(request) {
    return readSession(parseCookies(request.headers.cookie)[SESSION_COOKIE], config.sessionSecret, Math.floor(now() / 1000));
  }
  function requireSession(request) {
    const user = session(request);
    if (!user) throw new HttpError(401, 'login-required');
    const expected = request.headers['x-mb-expected-account'];
    if (expected !== undefined && expected !== user.sub) throw new HttpError(401, 'login-required');
    if (!sql.accountExists.get(user.sub)) throw new HttpError(401, 'login-required');
    return user;
  }
  function requireOrigin(request) {
    if (!allowedOrigins.has(String(request.headers.origin || ''))) throw new HttpError(403, 'origin');
  }

  async function login(request, response, url, ip) {
    const to = url.searchParams.get('to') === 'home' ? 'home' : 'ng';
    if (!loginReady(config) || !limit(`login:${ip}`)(30, 600)) return redirect(response, `${config.publicOrigin}/`, [clearState]);
    const state = randomBytes(24).toString('base64url');
    // "none" skips Discord's consent page for returning players; a refusal there retries once with consent.
    return redirect(response, authorizeUrl(state, 'none'), [cookie(STATE_COOKIE, `${state}.${to}.n`, 600, '/account')]);
  }

  async function callback(request, response, url, ip) {
    const [state, to = 'ng', mode = 'n'] = String(parseCookies(request.headers.cookie)[STATE_COOKIE] || '').split('.');
    const home = `${config.publicOrigin}/`;
    const deny = (reason, user) => { log({ event: 'login-denied', reason, user, ip }); return redirect(response, home, [clearState]); };
    if (!loginReady(config)) return deny('not-configured');
    if (!limit(`callback:${ip}`)(30, 600)) return deny('rate-limited');
    if (!state || !safeEqual(url.searchParams.get('state') || '', state)) return deny('state');
    const error = url.searchParams.get('error');
    if (error) {
      if (mode === 'n') {
        const retry = randomBytes(24).toString('base64url');
        return redirect(response, authorizeUrl(retry, 'consent'), [cookie(STATE_COOKIE, `${retry}.${to}.c`, 600, '/account')]);
      }
      return deny(`discord-${error.slice(0, 40)}`);
    }
    const code = url.searchParams.get('code');
    if (!code || code.length > 200) return deny('code');
    let user, member;
    try {
      const grant = await discordJson('/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${Buffer.from(`${discord.clientId}:${discord.clientSecret}`).toString('base64')}` },
        body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri }),
      });
      if (typeof grant?.access_token !== 'string') throw new HttpError(502, 'discord token shape');
      // The Discord token is used for these two reads only and is never stored.
      const auth = { headers: { Authorization: `Bearer ${grant.access_token}` } };
      [user, member] = await Promise.all([
        discordJson('/users/@me', auth),
        discordJson(`/users/@me/guilds/${discord.guildId}/member`, auth, { missingOk: true }),
      ]);
    } catch (failure) {
      return deny(failure instanceof HttpError ? failure.code : `network ${failure.name}`);
    }
    if (!ID_RE.test(String(user?.id || ''))) return deny('user-shape');
    if (!member) return deny('not-member', user.id);
    const roles = Array.isArray(member.roles) ? member.roles.map(String) : [];
    if (!discord.roleIds.some(role => roles.includes(role))) return deny('missing-role', user.id);
    const name = String(user.global_name || user.username || '').slice(0, 40) || '旅人';
    const avatar = /^(a_)?[0-9a-f]{32}$/.test(String(user.avatar || '')) ? user.avatar : null;
    const at = Math.floor(now() / 1000);
    sql.upsertAccount.run(user.id, name, avatar, at, at);
    // After sessionDays the player logs in again, which checks the role again.
    const sessionToken = signSession({ v: 1, sub: user.id, name, av: avatar, iat: at, exp: at + config.sessionDays * DAY }, config.sessionSecret);
    log({ event: 'login', user: user.id, ip });
    return redirect(response, to === 'home' ? home : `${config.ngOrigin}/`, [clearState, cookie(SESSION_COOKIE, sessionToken, config.cookieDays * DAY)]);
  }

  function saveTarget(parts) {
    const [game, slot] = parts;
    if (!GAME_RE.test(game || '') || (slot !== undefined && !SLOT_RE.test(slot))) throw new HttpError(404, 'not-found');
    return { game, slot };
  }
  const metaOf = text => { try { return JSON.parse(text); } catch { return {}; } };

  async function saves(request, response, parts, ip) {
    const user = requireSession(request);
    if (!limit(`saves:${user.sub}`)(300, 600) || !limit(`saves-ip:${ip}`)(600, 600)) throw new HttpError(429, 'rate-limited');
    const { game, slot } = saveTarget(parts);
    if (slot === undefined) {
      if (request.method !== 'GET') throw new HttpError(405, 'method');
      const rows = sql.list.all(user.sub, game);
      return send(response, 200, { game, saves: rows.map(row => ({ slot: row.slot, meta: metaOf(row.meta), size: row.size, updatedAt: row.updated_at })) });
    }
    if (request.method === 'GET') {
      const row = sql.get.get(user.sub, game, slot);
      if (!row) throw new HttpError(404, 'no-save');
      return send(response, 200, { game, slot, meta: metaOf(row.meta), size: row.size, updatedAt: row.updated_at, data: row.data });
    }
    requireOrigin(request);
    if (request.method === 'DELETE') {
      sql.keepPrevious.run(now(), user.sub, game, slot);
      sql.remove.run(user.sub, game, slot);
      return send(response, 200, { ok: true });
    }
    if (request.method !== 'PUT') throw new HttpError(405, 'method');
    if (!String(request.headers['content-type'] || '').startsWith('application/json')) throw new HttpError(415, 'json-only');
    let body;
    try { body = JSON.parse((await readBody(request, LIMITS.save + LIMITS.meta + 4096)).toString('utf8')); }
    catch (failure) { if (failure instanceof HttpError) throw failure; throw new HttpError(400, 'bad-json'); }
    if (typeof body?.data !== 'string' || !body.data) throw new HttpError(400, 'no-data');
    const size = Buffer.byteLength(body.data);
    if (size > LIMITS.save) throw new HttpError(413, 'too-large');
    try { const parsed = JSON.parse(body.data); if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error(); }
    catch { throw new HttpError(400, 'data-not-json'); }
    const meta = JSON.stringify(body.meta && typeof body.meta === 'object' && !Array.isArray(body.meta) ? body.meta : {});
    if (meta.length > LIMITS.meta) throw new HttpError(413, 'meta-too-large');
    const current = sql.head.get(user.sub, game, slot);
    // A writer names the version it last saw; anything else means another device saved in between.
    if (body.base !== undefined && (body.base ?? null) !== (current?.updated_at ?? null)) {
      return send(response, 409, { error: 'conflict', current: current ? { meta: metaOf(current.meta), size: current.size, updatedAt: current.updated_at } : null });
    }
    if (!current && sql.count.get(user.sub, game).n >= LIMITS.slots) throw new HttpError(413, 'too-many-slots');
    if (sql.total.get(user.sub).n - (current?.size || 0) + size > LIMITS.total) throw new HttpError(413, 'quota');
    const updatedAt = stamp();
    db.exec('BEGIN');
    try {
      if (current) sql.keepPrevious.run(updatedAt, user.sub, game, slot);
      sql.put.run(user.sub, game, slot, body.data, meta, size, updatedAt);
      db.exec('COMMIT');
    } catch (failure) { db.exec('ROLLBACK'); throw failure; }
    return send(response, 200, { ok: true, updatedAt, size });
  }

  async function handle(request, response) {
    let url;
    try { url = new URL(request.url, 'http://account.local'); } catch { return send(response, 400, { error: 'bad-url' }); }
    const path = url.pathname;
    if (path === '/account/health') return send(response, 200, { ok: true });
    if (config.proxySecret && !safeEqual(request.headers['x-mb-proxy'], config.proxySecret)) return send(response, 403, { error: 'forbidden' });
    const ip = String(request.headers['x-mb-client-ip'] || request.socket.remoteAddress || '').slice(0, 64);
    try {
      if (path === '/account/login' && request.method === 'GET') return await login(request, response, url, ip);
      if (path === '/account/callback' && request.method === 'GET') return await callback(request, response, url, ip);
      if (path === '/account/me' && request.method === 'GET') {
        const user = session(request);
        return send(response, 200, user
          ? { login: loginReady(config), user: { id: user.sub, name: user.name, avatar: user.av || null }, ng: `${config.ngOrigin}/` }
          : { login: loginReady(config), user: null });
      }
      if (path === '/account/logout' && request.method === 'POST') {
        requireOrigin(request);
        if (request.headers['x-mb-expected-account'] !== undefined) requireSession(request);
        return send(response, 200, { ok: true }, { 'Set-Cookie': [cookie(SESSION_COOKIE, '', 0)] });
      }
      const parts = path.split('/').slice(1);
      if (parts[0] === 'account' && parts[1] === 'saves' && parts.length >= 3 && parts.length <= 4) return await saves(request, response, parts.slice(2), ip);
      return send(response, 404, { error: 'not-found' });
    } catch (failure) {
      if (failure instanceof HttpError) return send(response, failure.status, { error: failure.code });
      log({ event: 'error', path, message: String(failure?.message || failure).slice(0, 200) });
      return send(response, 500, { error: 'server' });
    }
  }

  function backup() {
    if (!config.backupDir || config.db === ':memory:') return null;
    mkdirSync(config.backupDir, { recursive: true });
    const day = new Date(now()).toISOString().slice(0, 10).replaceAll('-', '');
    const file = join(config.backupDir, `account-${day}.db`);
    if (!/^[\w./-]+$/.test(file)) throw new Error('backup path must be plain');
    if (!existsSync(file)) db.exec(`VACUUM INTO '${file}'`);
    const kept = readdirSync(config.backupDir).filter(name => /^account-\d{8}\.db$/.test(name)).sort().reverse();
    for (const old of kept.slice(Math.max(1, config.backupKeep))) rmSync(join(config.backupDir, old), { force: true });
    return file;
  }

  return { handle, backup, db, close: () => db.close() };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const config = loadConfig();
  if (config.sessionSecret.length < 32) { process.stderr.write('SESSION_SECRET must be at least 32 characters\n'); process.exit(1); }
  const app = createAccountApp(config);
  const server = createServer((request, response) => { app.handle(request, response).catch(() => { if (!response.headersSent) send(response, 500, { error: 'server' }); }); });
  server.headersTimeout = 20000; server.requestTimeout = 60000;
  const runBackup = () => { try { app.backup(); } catch (failure) { defaultLog({ event: 'backup-failed', message: String(failure.message).slice(0, 200) }); } };
  runBackup();
  setInterval(runBackup, 6 * 3600 * 1000).unref();
  server.listen(config.port, config.host, () => defaultLog({ event: 'listening', host: config.host, port: config.port, login: loginReady(config) }));
  const stop = () => server.close(() => { app.close(); process.exit(0); });
  process.on('SIGTERM', stop); process.on('SIGINT', stop);
}

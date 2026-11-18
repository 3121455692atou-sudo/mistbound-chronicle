// The account service: Discord login gated on one role, signed sessions, and saves bound to the account.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createAccountApp, loadConfig, readSession, signSession, SESSION_COOKIE, STATE_COOKIE } from '../account/server.mjs';

const SECRET = 'test-session-secret-0123456789-abcdefghijklmnop';
const PROXY = 'test-proxy-secret-0123456789-abcdef';
const ROLE = '1150000000000000001';
const USER = { id: '123456789012345678', username: 'tester', global_name: '测试员', avatar: 'a'.repeat(32) };
const PUBLIC = 'https://mistbound.galbands.com', NG = 'https://ng.mistbound.galbands.com';

function fakeDiscord(behaviour = {}) {
  const calls = [];
  const reply = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  const impl = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    if (behaviour.network) throw new TypeError('fetch failed');
    const path = new URL(url).pathname.replace('/api/v10', '');
    if (path === '/oauth2/token') {
      const body = new URLSearchParams(String(init.body));
      if (body.get('code') !== 'good-code') return reply(400, { error: 'invalid_grant' });
      return reply(200, { access_token: 'discord-access', token_type: 'Bearer', expires_in: 604800 });
    }
    if (init.headers?.Authorization !== 'Bearer discord-access') return reply(401, { message: '401: Unauthorized' });
    if (path === '/users/@me') return reply(200, behaviour.user || USER);
    if (path === `/users/@me/guilds/1100000000000000001/member`) {
      if (behaviour.notMember) return reply(404, { message: 'Unknown Guild', code: 10004 });
      return reply(200, { roles: behaviour.roles || ['1150000000000000999', ROLE], joined_at: '2024-01-01T00:00:00Z' });
    }
    return reply(404, {});
  };
  return { impl, calls };
}

async function startApp({ configured = true, behaviour = {}, env = {}, clock } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'mb-account-'));
  const config = loadConfig({
    ACCOUNT_DB: join(dir, 'account.db'), ACCOUNT_BACKUP_DIR: join(dir, 'backups'),
    SESSION_SECRET: SECRET, PROXY_SECRET: PROXY,
    ...(configured ? { DISCORD_CLIENT_ID: '1400000000000000000', DISCORD_CLIENT_SECRET: 'client-secret', DISCORD_GUILD_ID: '1100000000000000001', DISCORD_ROLE_ID: ROLE } : {}),
    ...env,
  });
  const discord = fakeDiscord(behaviour);
  const logs = [];
  const app = createAccountApp(config, { fetchImpl: discord.impl, log: entry => logs.push(entry), ...(clock ? { now: clock } : {}) });
  const server = createServer((request, response) => app.handle(request, response));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, { method = 'GET', cookie, origin, body, type = 'application/json', proxy = PROXY, headers = {} } = {}) => fetch(base + path, {
    method, redirect: 'manual',
    headers: { ...(proxy ? { 'x-mb-proxy': proxy } : {}), ...(cookie ? { cookie } : {}), ...(origin ? { origin } : {}), ...(body !== undefined ? { 'content-type': type } : {}), 'x-mb-client-ip': '203.0.113.9', ...headers },
    ...(body !== undefined ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
  });
  const close = async () => { await new Promise(resolve => server.close(resolve)); app.close(); rmSync(dir, { recursive: true, force: true }); };
  return { app, config, call, close, logs, discord, dir };
}
const cookieFrom = (response, name) => response.headers.getSetCookie().find(line => line.startsWith(`${name}=`)) || '';
const valueOf = line => line.split(';')[0].split('=').slice(1).join('=');

async function loginFlow(ctx, { code = 'good-code' } = {}) {
  const start = await ctx.call('/account/login');
  assert.equal(start.status, 302);
  const auth = new URL(start.headers.get('location'));
  const stateCookie = cookieFrom(start, STATE_COOKIE);
  const back = await ctx.call(`/account/callback?code=${code}&state=${auth.searchParams.get('state')}`, { cookie: `${STATE_COOKIE}=${valueOf(stateCookie)}` });
  return { start, auth, stateCookie, back, session: valueOf(cookieFrom(back, SESSION_COOKIE)) };
}

test('account service refuses callers without the proxy secret, except the health probe', async () => {
  const ctx = await startApp();
  try {
    assert.equal((await ctx.call('/account/me', { proxy: null })).status, 403);
    assert.equal((await ctx.call('/account/me', { proxy: 'wrong-secret-of-the-same-length-000' })).status, 403);
    assert.equal((await ctx.call('/account/health', { proxy: null })).status, 200);
    assert.equal((await ctx.call('/account/me')).status, 200);
  } finally { await ctx.close(); }
});

test('login is hidden and inert until the Discord app and role are configured', async () => {
  const ctx = await startApp({ configured: false });
  try {
    assert.deepEqual(await (await ctx.call('/account/me')).json(), { login: false, user: null });
    const start = await ctx.call('/account/login');
    assert.equal(start.status, 302);
    assert.equal(start.headers.get('location'), `${PUBLIC}/`);
    assert.equal(ctx.discord.calls.length, 0);
  } finally { await ctx.close(); }
});

test('a member holding the verified role is signed in and sent to ng', async () => {
  const ctx = await startApp();
  try {
    assert.deepEqual(await (await ctx.call('/account/me')).json(), { login: true, user: null });
    const { auth, stateCookie, back, session } = await loginFlow(ctx);
    assert.equal(auth.origin + auth.pathname, 'https://discord.com/oauth2/authorize');
    assert.equal(auth.searchParams.get('client_id'), '1400000000000000000');
    assert.equal(auth.searchParams.get('redirect_uri'), `${PUBLIC}/account/callback`);
    assert.equal(auth.searchParams.get('scope'), 'identify guilds.members.read');
    assert.equal(auth.searchParams.get('prompt'), 'none');
    assert.match(stateCookie, /Domain=mistbound\.galbands\.com; HttpOnly; Secure; SameSite=Lax; Max-Age=600/);
    assert.match(stateCookie, /Path=\/account/);
    assert.equal(back.status, 302);
    assert.equal(back.headers.get('location'), `${NG}/`);
    const sessionLine = cookieFrom(back, SESSION_COOKIE);
    assert.match(sessionLine, /Path=\/; Domain=mistbound\.galbands\.com; HttpOnly; Secure; SameSite=Lax; Max-Age=604800/);
    assert.match(cookieFrom(back, STATE_COOKIE), /Max-Age=0/);
    const payload = readSession(session, SECRET);
    assert.equal(payload.sub, USER.id);
    assert.equal(payload.name, '测试员');
    assert.equal(payload.exp - payload.iat, 7 * 86400);
    const me = await (await ctx.call('/account/me', { cookie: `${SESSION_COOKIE}=${session}` })).json();
    assert.deepEqual(me, { login: true, user: { id: USER.id, name: '测试员', avatar: 'a'.repeat(32) }, ng: `${NG}/` });
    const token = ctx.discord.calls.find(call => call.url.endsWith('/oauth2/token'));
    assert.equal(new URLSearchParams(String(token.init.body)).get('redirect_uri'), `${PUBLIC}/account/callback`);
    assert.match(token.init.headers.Authorization, /^Basic /);
    assert.deepEqual(ctx.logs.map(entry => entry.event), ['login']);
    assert.ok(!JSON.stringify(ctx.logs).includes('discord-access'));
  } finally { await ctx.close(); }
});

test('every refusal returns quietly to the public site without a session or a reason', async () => {
  const cases = [
    ['missing-role', { behaviour: { roles: ['1150000000000000999'] } }],
    ['not-member', { behaviour: { notMember: true } }],
    ['discord oauth2 400', { code: 'bad-code' }],
    ['network TypeError', { behaviour: { network: true } }],
  ];
  for (const [reason, { behaviour, code }] of cases) {
    const ctx = await startApp({ behaviour });
    try {
      const { back } = await loginFlow(ctx, { code });
      assert.equal(back.status, 302, reason);
      assert.equal(back.headers.get('location'), `${PUBLIC}/`, reason);
      assert.equal(cookieFrom(back, SESSION_COOKIE), '', reason);
      assert.match(cookieFrom(back, STATE_COOKIE), /Max-Age=0/, reason);
      assert.equal(await back.text(), '', reason);
      assert.equal(ctx.logs.at(-1).event, 'login-denied');
      assert.equal(ctx.logs.at(-1).reason, reason);
    } finally { await ctx.close(); }
  }
});

test('the callback rejects a forged or missing state and retries a refused silent login once with consent', async () => {
  const ctx = await startApp();
  try {
    const start = await ctx.call('/account/login');
    const state = new URL(start.headers.get('location')).searchParams.get('state');
    const cookie = `${STATE_COOKIE}=${valueOf(cookieFrom(start, STATE_COOKIE))}`;
    const forged = await ctx.call('/account/callback?code=good-code&state=someone-elses-state', { cookie });
    assert.equal(forged.headers.get('location'), `${PUBLIC}/`);
    const noCookie = await ctx.call(`/account/callback?code=good-code&state=${state}`);
    assert.equal(noCookie.headers.get('location'), `${PUBLIC}/`);
    assert.equal(ctx.discord.calls.length, 0);

    const refused = await ctx.call(`/account/callback?error=access_denied&state=${state}`, { cookie });
    const retry = new URL(refused.headers.get('location'));
    assert.equal(retry.searchParams.get('prompt'), 'consent');
    assert.notEqual(retry.searchParams.get('state'), state);
    const retryCookie = `${STATE_COOKIE}=${valueOf(cookieFrom(refused, STATE_COOKIE))}`;
    assert.ok(retryCookie.endsWith('.ng.c'));
    const cancelled = await ctx.call(`/account/callback?error=access_denied&state=${retry.searchParams.get('state')}`, { cookie: retryCookie });
    assert.equal(cancelled.headers.get('location'), `${PUBLIC}/`);
    assert.equal(cookieFrom(cancelled, SESSION_COOKIE), '');
  } finally { await ctx.close(); }
});

test('a tampered, foreign or expired session is no session at all', async () => {
  let clock = Date.parse('2026-11-10T00:00:00Z');
  const ctx = await startApp({ clock: () => clock });
  try {
    const { session } = await loginFlow(ctx);
    const me = cookie => ctx.call('/account/me', { cookie }).then(response => response.json());
    assert.equal((await me(`${SESSION_COOKIE}=${session}`)).user.id, USER.id);
    const [body, sig] = session.split('.');
    const forgedBody = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(body, 'base64url')), sub: '999999999999999999' })).toString('base64url');
    assert.equal((await me(`${SESSION_COOKIE}=${forgedBody}.${sig}`)).user, null);
    assert.equal((await me(`${SESSION_COOKIE}=${signSession({ v: 1, sub: USER.id, exp: 9e9 }, 'another-secret-that-is-long-enough-000000')}`)).user, null);
    clock += 8 * 86400 * 1000;
    assert.equal((await me(`${SESSION_COOKIE}=${session}`)).user, null);
  } finally { await ctx.close(); }
});

test('logout needs a same-site origin and clears the shared cookie', async () => {
  const ctx = await startApp();
  try {
    const { session } = await loginFlow(ctx);
    const cookie = `${SESSION_COOKIE}=${session}`;
    assert.equal((await ctx.call('/account/logout', { method: 'POST', cookie })).status, 403);
    assert.equal((await ctx.call('/account/logout', { method: 'POST', cookie, origin: 'https://evil.example' })).status, 403);
    const out = await ctx.call('/account/logout', { method: 'POST', cookie, origin: NG });
    assert.equal(out.status, 200);
    assert.match(cookieFrom(out, SESSION_COOKIE), /^mb_session=; Path=\/; Domain=mistbound\.galbands\.com; HttpOnly; Secure; SameSite=Lax; Max-Age=0$/);
  } finally { await ctx.close(); }
});

test('cloud saves belong to the logged-in account and refuse stale overwrites', async () => {
  const ctx = await startApp();
  try {
    const { session } = await loginFlow(ctx);
    const cookie = `${SESSION_COOKIE}=${session}`;
    const data = JSON.stringify({ seed: 'dawn', playerId: 'p', turn: 3, revision: 12 });
    const meta = { seed: 'dawn', playerId: 'p', turn: 3, revision: 12 };
    assert.equal((await ctx.call('/account/saves/sfw')).status, 401);
    assert.equal((await ctx.call('/account/saves/sfw/auto', { method: 'PUT', cookie, body: { data, meta } })).status, 403, 'origin required');
    assert.equal((await ctx.call('/account/saves/sfw/auto', { method: 'PUT', cookie, origin: PUBLIC, body: { data, meta }, type: 'text/plain' })).status, 415);
    assert.equal((await ctx.call('/account/saves/sfw/auto', { method: 'PUT', cookie, origin: PUBLIC, body: { data: 'not json', meta } })).status, 400);
    assert.equal((await ctx.call('/account/saves/SFW/auto', { cookie })).status, 404);
    assert.equal((await ctx.call('/account/saves/sfw/bad%2Fslot', { cookie })).status, 404);
    assert.equal((await ctx.call('/account/saves/sfw/auto/extra', { cookie })).status, 404);
    assert.equal((await ctx.call('/account/saves/sfw/auto', { cookie })).status, 404);

    const first = await ctx.call('/account/saves/sfw/auto', { method: 'PUT', cookie, origin: PUBLIC, body: { data, meta, base: null } });
    assert.equal(first.status, 200);
    const { updatedAt } = await first.json();
    const list = await (await ctx.call('/account/saves/sfw', { cookie })).json();
    assert.deepEqual(list.saves, [{ slot: 'auto', meta, size: Buffer.byteLength(data), updatedAt }]);
    const got = await (await ctx.call('/account/saves/sfw/auto', { cookie })).json();
    assert.equal(got.data, data);

    const stale = await ctx.call('/account/saves/sfw/auto', { method: 'PUT', cookie, origin: NG, body: { data, meta, base: null } });
    assert.equal(stale.status, 409);
    assert.deepEqual((await stale.json()).current, { meta, size: Buffer.byteLength(data), updatedAt });
    const next = await ctx.call('/account/saves/sfw/auto', { method: 'PUT', cookie, origin: NG, body: { data: data.replace('12', '13'), meta: { ...meta, revision: 13 }, base: updatedAt } });
    assert.equal(next.status, 200);
    assert.ok((await next.json()).updatedAt > updatedAt);
    const previous = ctx.app.db.prepare('SELECT data FROM saves_prev WHERE account_id=?').get(USER.id);
    assert.equal(previous.data, data, 'the replaced save is kept one step back');

    // Another account sees nothing of it.
    const other = signSession({ v: 1, sub: '223456789012345678', name: 'x', iat: 1, exp: 9e9 }, SECRET);
    assert.equal((await ctx.call('/account/saves/sfw', { cookie: `${SESSION_COOKIE}=${other}` })).status, 401, 'unknown accounts must log in first');

    assert.equal((await ctx.call('/account/saves/sfw/auto', { method: 'DELETE', cookie, origin: PUBLIC })).status, 200);
    assert.equal((await ctx.call('/account/saves/sfw/auto', { cookie })).status, 404);
  } finally { await ctx.close(); }
});

test('an NG tab cannot sync to or sign out a different account after the browser switches sessions', async () => {
  const ctx = await startApp();
  try {
    const { session } = await loginFlow(ctx);
    const cookie = `${SESSION_COOKIE}=${session}`;
    const slot = '/account/saves/ng/auto';
    const local = { data: '{"turn":12}', meta: { turn: 12 }, base: null };
    const stale = { cookie, origin: NG, headers: { 'x-mb-expected-account': '223456789012345678' } };
    assert.equal((await ctx.call(slot, { ...stale, method: 'PUT', body: local })).status, 401);
    assert.equal((await ctx.call('/account/logout', { ...stale, method: 'POST' })).status, 401);
    assert.equal((await ctx.call(slot, { cookie })).status, 404);
    const current = { ...stale, headers: { 'x-mb-expected-account': USER.id } };
    assert.equal((await ctx.call(slot, { ...current, method: 'PUT', body: local })).status, 200);
    assert.equal((await (await ctx.call(slot, current)).json()).data, local.data);
    assert.equal((await ctx.call('/account/saves/sfw/auto', { cookie })).status, 404);
  } finally { await ctx.close(); }
});

test('cloud saves have size and slot limits', async () => {
  const ctx = await startApp();
  try {
    const { session } = await loginFlow(ctx);
    const cookie = `${SESSION_COOKIE}=${session}`;
    const put = (slot, data, meta = {}) => ctx.call(`/account/saves/ng/${slot}`, { method: 'PUT', cookie, origin: NG, body: { data, meta } });
    for (let i = 0; i < 12; i++) assert.equal((await put(`s${i}`, '{"a":1}')).status, 200);
    assert.equal((await put('s12', '{"a":1}')).status, 413, 'a thirteenth slot is refused');
    assert.equal((await put('s0', '{"a":2}')).status, 200, 'an existing slot can still be replaced');
    assert.equal((await put('s1', '{"a":1}', { note: 'x'.repeat(3000) })).status, 413);
    const big = JSON.stringify({ blob: 'x'.repeat(8 * 1024 * 1024) });
    assert.equal((await put('s2', big)).status, 413);
  } finally { await ctx.close(); }
});

test('daily backups are taken once per day and pruned', async () => {
  let clock = Date.parse('2026-11-01T12:00:00Z');
  const ctx = await startApp({ clock: () => clock, env: { ACCOUNT_BACKUP_KEEP: '3' } });
  try {
    for (let day = 0; day < 5; day++) { ctx.app.backup(); ctx.app.backup(); clock += 86400 * 1000; }
    assert.deepEqual(readdirSync(join(ctx.dir, 'backups')).sort(), ['account-20261103.db', 'account-20261104.db', 'account-20261105.db']);
  } finally { await ctx.close(); }
});

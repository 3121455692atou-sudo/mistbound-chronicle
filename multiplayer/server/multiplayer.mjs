#!/usr/bin/env node
import { createServer } from 'node:http';
import { createHmac, randomBytes, timingSafeEqual, scryptSync } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, realpathSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { applyGameAction, createMultiplayerGame, battlePlayer, MP_RULES, bandRoster, bandOptions } from '../web/multiplayer-engine.mjs';
import { readSocial } from '../web/multiplayer-interactions.mjs';
import { COPY, ACCESS_COPY as TEXT, formatCopy, formatAccess } from '../web/multiplayer-copy.mjs';
import { chooseAiAction, chooseAiReply } from './ai.mjs';
import { createAgentAccess, agentCookie, agentRef } from './agent-access.mjs';

export function readSession(token, secret, now = Date.now()) {
  try {
    if (typeof token !== 'string' || token.length > 2048 || secret.length < 32) return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const mac = createHmac('sha256', secret).update(parts[0]).digest();
    const given = Buffer.from(parts[1], 'base64url');
    if (given.length !== mac.length || !timingSafeEqual(mac, given)) return null;
    const data = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
    if (data.v !== 1 || typeof data.sub !== 'string' || !/^\d{5,25}$/.test(data.sub) || !Number.isFinite(data.exp) || data.exp * 1000 <= now) return null;
    return { id: data.sub, name: String(data.name || '旅人').slice(0, 40), expires: data.exp * 1000 };
  } catch { return null; }
}
const cookieToken = (header, name = 'mb_session') => String(header || '').split(';').map(s => s.trim()).find(s => s.startsWith(`${name}=`))?.slice(name.length + 1);
class ApiError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const requireThat = (test, status, code, message) => { if (!test) throw new ApiError(status, code, message); };
const ROOM_RE = /^[A-HJ-NP-Z2-9]{6}$/;
const REQUEST_RE = /^[a-zA-Z0-9_-]{16,80}$/;
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(data));
}
async function bodyOf(req) {
  requireThat(/^application\/json(?:;|$)/i.test(req.headers['content-type'] || ''), 415, 'json-only', '请使用 JSON 请求。');
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    requireThat(size <= 8192, 413, 'too-large', '请求太大。');
    chunks.push(chunk);
  }
  let data;
  try { data = JSON.parse(Buffer.concat(chunks).toString()); }
  catch { throw new ApiError(400, 'bad-json', '请求格式不正确。'); }
  requireThat(data && typeof data === 'object' && !Array.isArray(data), 400, 'bad-json', '请求格式不正确。');
  return data;
}
const PASSWORD_CHARS = 64;
function passwordHash(password, salt = randomBytes(16).toString('hex')) {
  return `${salt}:${scryptSync(password, salt, 32).toString('hex')}`;
}
function passwordMatches(password, hash) {
  const [salt] = hash.split(':');
  const given = Buffer.from(passwordHash(password, salt));
  const expected = Buffer.from(hash);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
export function createMultiplayerApp({
  dbPath = ':memory:', secret, publicOrigin = 'https://mistbound.galbands.com',
  ngOrigin = 'https://ng.mistbound.galbands.com', now = () => Date.now(), log = console.error,
} = {}) {
  if (!secret || secret.length < 32) throw new Error('Multiplayer requires the existing SESSION_SECRET.');
  if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS mp_rooms(code TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS mp_commands(account_id TEXT NOT NULL, request_id TEXT NOT NULL, code TEXT NOT NULL, created_at INTEGER NOT NULL,
      PRIMARY KEY(account_id, request_id));
    CREATE INDEX IF NOT EXISTS mp_commands_time ON mp_commands(created_at);
    CREATE INDEX IF NOT EXISTS mp_rooms_status ON mp_rooms(json_extract(data,'$.status'));
    CREATE TABLE IF NOT EXISTS mp_watchers(code TEXT NOT NULL, account_id TEXT NOT NULL, expires_at INTEGER NOT NULL,
      PRIMARY KEY(code,account_id));
    CREATE INDEX IF NOT EXISTS mp_watchers_account ON mp_watchers(account_id);`);
  const sql = {
    get: db.prepare('SELECT data FROM mp_rooms WHERE code=?'),
    put: db.prepare('INSERT INTO mp_rooms VALUES(?,?,?) ON CONFLICT(code) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at'),
    all: db.prepare('SELECT data FROM mp_rooms ORDER BY updated_at DESC'),
    active: db.prepare("SELECT data FROM mp_rooms WHERE json_extract(data,'$.status') IN ('waiting','playing') ORDER BY updated_at DESC"),
    remove: db.prepare('DELETE FROM mp_rooms WHERE code=?'),
    dedupe: db.prepare('SELECT code FROM mp_commands WHERE account_id=? AND request_id=?'),
    firstCommand: db.prepare('SELECT account_id,created_at FROM mp_commands WHERE code=? ORDER BY created_at,rowid LIMIT 1'),
    done: db.prepare('INSERT INTO mp_commands VALUES(?,?,?,?)'),
    prune: db.prepare('DELETE FROM mp_commands WHERE created_at<?'),
    removeCommands: db.prepare('DELETE FROM mp_commands WHERE code=?'),
    watcher: db.prepare('SELECT expires_at FROM mp_watchers WHERE code=? AND account_id=? AND expires_at>?'),
    watch: db.prepare('INSERT INTO mp_watchers VALUES(?,?,?) ON CONFLICT(code,account_id) DO UPDATE SET expires_at=excluded.expires_at'),
    unwatch: db.prepare('DELETE FROM mp_watchers WHERE code=? AND account_id=?'),
    unwatchAccount: db.prepare('DELETE FROM mp_watchers WHERE account_id=?'),
    closeAudience: db.prepare('DELETE FROM mp_watchers WHERE code=? AND account_id<>?'),
    watchers: db.prepare('SELECT count(*) AS n FROM mp_watchers WHERE code=? AND expires_at>?'),
    watched: db.prepare('SELECT count(*) AS n FROM mp_watchers WHERE account_id=? AND expires_at>?'),
    pruneWatchers: db.prepare('DELETE FROM mp_watchers WHERE expires_at<=? OR code NOT IN (SELECT code FROM mp_rooms)'),
  };
  const agents = createAgentAccess({ db, now, publicOrigin, requireThat });
  const streams = new Map(), rates = new Map();
  let closing = false;
  const read = code => { const row = sql.get.get(code); return row ? JSON.parse(row.data) : null; };
  const all = (includeFinished = false) => (includeFinished ? sql.all : sql.active).all().map(row => JSON.parse(row.data));
  const save = room => { room.updatedAt = now(); sql.put.run(room.code, JSON.stringify(room), room.updatedAt); };
  const cleanPassword = value => {
    requireThat(value === undefined || (typeof value === 'string' && value.length <= PASSWORD_CHARS), 400, 'bad-password', '房间密码最多 64 字。');
    return value || '';
  };
  function rate(id, kind, count, window = 60000) {
    const key = `${id}:${kind}`, at = now();
    let row = rates.get(key);
    if (!row || row.reset <= at) { row = { n: 0, reset: at + window }; rates.set(key, row); }
    requireThat(++row.n <= count, 429, 'rate-limit', '操作太频繁，请稍候再试。');
  }
  function authenticate(req) {
    const token = cookieToken(req.headers.cookie, agentCookie);
    const user = token ? agents.read(token) : readSession(cookieToken(req.headers.cookie), secret, now());
    if (token) requireThat(user, 401, 'agent-session-ended', TEXT.agentExpired);
    requireThat(user, 401, 'login-required', '请先登录 Discord，再进入联机模式。');
    const expected = req.headers['x-mb-expected-account'];
    requireThat(expected === undefined || expected === user.id, 409, 'account-changed', '账号已切换，请刷新页面。');
    return user;
  }
  function editionOf(req) {
    requireThat(['sfw', 'ng'].includes(req.headers['x-mb-edition']), 403, 'bad-edition', '请从游戏站点进入联机模式。');
    return req.headers['x-mb-edition'];
  }
  function getRoom(code, edition) {
    requireThat(ROOM_RE.test(code), 404, 'room-not-found', '房间不存在或已经关闭。');
    const room = read(code);
    requireThat(room, 404, 'room-not-found', '房间不存在或已经关闭。');
    upgradeHostMetadata(room);
    requireThat(room.edition === edition, 409, 'edition-mismatch', `请在${room.edition === 'ng' ? ' NG ' : '普通'}版联机大厅加入这个房间。`);
    requireThat(!room.closed,410,'room-dissolved',TEXT.roomDissolved);
    return room;
  }
  const seatOf = (room, user) => room.seats.find(s => s.account === user.id);
  const isHost = (room, user) => !!room.hostAccount && room.hostAccount === user.id;
  const isCreator = (room, user) => user.kind!=='dot' && !!room.creatorAccount && room.creatorAccount===user.id;
  const canDissolve = (room, user) => isHost(room,user)||isCreator(room,user);
  const watcherOf = (room, user) => room.allowSpectators !== false ? sql.watcher.get(room.code, user.id, now()) : null;
  const isMember = (room, user) => seatOf(room, user) || isHost(room, user) || watcherOf(room, user);
  const audienceCount = room => sql.watchers.get(room.code, now()).n
    + (room.hostRole === 'spectator' && room.hostAccount && !sql.watcher.get(room.code, room.hostAccount, now()) ? 1 : 0);
  function allowRoom(user, code) {
    requireThat(user.kind !== 'dot' || user.roomCode === code, 403, 'agent-room-only', TEXT.agentRoomOnly);
  }
  const activeRoom = (id, except = '') => all().find(room => room.code !== except && room.status !== 'finished'
    && (room.hostAccount === id || room.seats.some(s => s.account === id)));
  const hasStream = (code, id) => [...(streams.get(code) || [])].some(s => s.seatId === id && !s.res.destroyed);
  const aiSeats = room => room.status === 'playing' ? room.seats.filter(s => s.control === 'ai' && room.game.players.some(p => p.id === s.id && p.alive)) : [];
  function upgradeHostMetadata(room) {
    let changed = false;
    const host = room.seats.find(s => s.id === room.hostId);
    for (const [key, value] of Object.entries({
      hostAccount: host?.account || null, hostName: host?.name || COPY.aiBadge,
      hostRole: 'player', allowSpectators: true,
    })) if (!own(room,key)) { room[key]=value; changed=true; }
    if(!own(room,'creatorAccount')) {
      const first=sql.firstCommand.get(room.code);
      // Only a creation-time command proves the creator of an older room.
      // Later joins, invitations and matching display names cannot grant ownership.
      room.creatorAccount=first && /^\d{5,25}$/.test(first.account_id)
        && first.created_at===room.createdAt?first.account_id:null;
      changed=true;
    }
    return changed;
  }
  function updateHost(room) {
    if (room.hostRole === 'spectator' && room.hostAccount && agents.validAccount(room.hostAccount)) return;
    const eligible = s => s.account && agents.validAccount(s.account);
    const incumbent=room.seats.find(s=>s.account===room.hostAccount && eligible(s));
    // Delegating country orders to AI does not delegate room management.
    const host = incumbent || room.seats.find(s=>eligible(s)&&!s.account.startsWith('dot:')) || room.seats.find(eligible);
    room.hostId = host?.id || null; room.hostAccount = host?.account || null;
    room.hostName = host?.name || COPY.aiBadge; room.hostRole = 'player';
  }
  function roomView(room, user) {
    const seat = seatOf(room, user);
    requireThat(isMember(room,user), 403, 'not-a-member', TEXT.watchNotMember);
    return {
      code: room.code, title: room.title, edition: room.edition, map: room.map, capacity: room.capacity,
      hostId: room.hostId, hostName: room.hostName, hostRole: room.hostRole, isHost: isHost(room,user),
      createdByMe:isCreator(room,user),canDissolve:canDissolve(room,user),
      allowSpectators: room.allowSpectators !== false, me: seat?.id || null, role: seat ? 'player' : 'spectator',
      spectators: audienceCount(room), status: room.status, version: room.version,
      turnSeconds: room.turnSeconds, deadline: room.deadline, createdAt: room.createdAt,
      seats: room.seats.map(s => ({ id: s.id, name: s.name, band: s.band, ready: s.ready,
        control: s.control || 'human', aiReason: s.aiReason || null, online: hasStream(room.code, s.id),
        agent: s.account?.startsWith('dot:') || false, agentRef:s.account?.startsWith('dot:')?agentRef(s.account):null })),
      game: room.game, chat: room.chat, chatSeq: room.chatSeq, serverTime: now(),
    };
  }
  function emit(room, removedReason = null) {
    for (const stream of streams.get(room.code) || []) {
      try {
        if(stream.res.destroyed || stream.res.writableEnded)continue;
        if(room.closed) {
          stream.res.write(`event: closed\ndata: ${JSON.stringify({code:room.code,reason:'dissolved'})}\n\n`);
          stream.res.end();continue;
        }
        if (!agents.isValid(stream.user)) {
          stream.res.write('event: expired\ndata: {}\n\n'); stream.res.end(); continue;
        }
        if (!isMember(room, stream.user)) {
          const reason = !stream.seatId ? removedReason : null;
          stream.res.write(`event: removed\ndata: ${JSON.stringify({reason})}\n\n`); stream.res.end(); continue;
        }
        stream.seatId = seatOf(room, stream.user)?.id || null;
        if (stream.res.writableLength > 512 * 1024) { stream.res.destroy(); continue; }
        stream.res.write(`data: ${JSON.stringify(roomView(room, stream.user))}\n\n`);
      } catch { stream.res.destroy(); }
    }
  }
  function message(room, text, user = null, seat = null) {
    room.chatSeq++;
    room.chat.push({ id: room.chatSeq, name: user?.name || '雾海信使', seat: seat?.id || null,
      spectator: !!user && !seat, host: !!user && isHost(room,user),
      agent: user?.kind === 'dot', agentRef:user?.kind==='dot'?agentRef(user.grantId):null,
      text, at: now(), system: !user });
    room.chat = room.chat.slice(-100);
  }
  function setDeadline(room) {
    const actor = room.game && (room.game.battle ? battlePlayer(room.game) : room.game.turnId);
    const ai = room.seats.find(s => s.id === actor)?.control === 'ai';
    room.deadline = room.status === 'playing'
      ? now() + (ai ? 3000 : room.game.battle ? 60000 : room.turnSeconds * 1000) : null;
  }
  function syncStatus(room) {
    if (room.game?.status === 'finished') { room.status = 'finished'; room.deadline = null; }
  }
  function commit(room, user, requestId, write = () => {}, removedReason = null) {
    room.version++;
    db.exec('BEGIN IMMEDIATE');
    try {write();save(room);sql.done.run(user.id,requestId,room.code,now());db.exec('COMMIT');}
    catch (error) { db.exec('ROLLBACK'); throw error; }
    emit(room,removedReason);
  }
  function runAction(room, seat, action) {
    const oldTurn = room.game.turnId, oldBattle = room.game.battle?.id;
    const oldSide = room.game.battle?.playerSide;
    try { room.game = applyGameAction(room.game, seat.id, action); }
    catch (error) { throw new ApiError(400, 'invalid-action', error.message); }
    syncStatus(room);
    if (room.status !== 'playing' || oldTurn !== room.game.turnId || oldBattle !== room.game.battle?.id
      || oldSide !== room.game.battle?.playerSide || ['battleEndTurn', 'battleAutoTurn'].includes(action.type)) setDeadline(room);
  }
  function handToAi(room, seat, reason) {
    seat.control = 'ai'; seat.aiReason = reason;
    const key = reason === 'offline' ? 'offlineToAi' : reason === 'timeout' ? 'timeoutToAi' : 'leaveToAi';
    message(room, reason === 'host-watch' ? formatAccess('hostWatchToAi',{actor:seat.name}) : formatCopy(key, { actor: seat.name }));
    updateHost(room);
    const actor = room.game.battle ? battlePlayer(room.game) : room.game.turnId;
    if (actor === seat.id) setDeadline(room);
  }
  function resumeSeat(room, seat) {
    if (seat.control !== 'ai') return;
    seat.control = 'human'; seat.aiReason = null; seat.lastSeenAt = now();
    updateHost(room);
    message(room, formatCopy('resumeMessage', { actor: seat.name }));
    const actor = room.game.battle ? battlePlayer(room.game) : room.game.turnId;
    if (actor === seat.id) setDeadline(room);
  }
  function presence(code, user, connected = false) {
    if (closing) return;
    const room = read(code), seat = room && seatOf(room, user);
    if(room && !seat && isHost(room,user) && room.status!=='finished') {save(room);return;}
    if (room && !seat) {
      const watcher = watcherOf(room, user);
      if (watcher && watcher.expires_at < now() + 23 * 3600000) sql.watch.run(code, user.id, now() + 86400000);
    }
    if (!seat || room.status === 'finished') return;
    seat.lastSeenAt = now();
    if (connected) seat.connectionSeen = true;
    const restore = connected && room.status === 'playing' && seat.control === 'ai' && seat.aiReason === 'offline';
    if (restore) { resumeSeat(room, seat); room.version++; }
    save(room);
    if (restore) emit(room);
  }
  function tick() {
    releaseExpiredAgents();
    for (const room of all()) {
      if (room.status !== 'playing') continue;
      let changed = false;
      for (const seat of room.seats) {
        if (seat.account && seat.control !== 'ai' && seat.connectionSeen && !hasStream(room.code, seat.id)
          && now() - seat.lastSeenAt >= 45000 && room.game.players.some(p => p.id === seat.id && p.alive)) {
          handToAi(room, seat, 'offline'); changed = true;
        }
      }
      // AI replies to offers even while a human is taking their own turn.
      const offer = readSocial(room.game).offers.find(o => o.expires >= room.game.round
        && room.seats.some(s => s.id === o.to && s.control === 'ai')
        && room.game.players.some(p => p.id === o.from && p.alive)
        && room.game.players.some(p => p.id === o.to && p.alive));
      if (offer) {
        const seat = room.seats.find(s => s.id === offer.to);
        try { runAction(room, seat, { type: 'respondOffer', offerId: offer.id, accept: chooseAiReply(room.game, offer) }); changed = true; }
        catch (error) { log(`multiplayer AI reply: ${error.message}`); }
      }
      if (room.status === 'playing' && room.deadline && now() >= room.deadline) {
        const player = room.game.battle ? battlePlayer(room.game) : room.game.turnId;
        const seat = room.seats.find(s => s.id === player);
        if (!seat) continue;
        try {
          if (seat.control !== 'ai') handToAi(room, seat, 'timeout');
          else {
            const action = chooseAiAction(room.game, seat.id);
            if (action) runAction(room, seat, action);
            setDeadline(room);
          }
          changed = true;
        } catch (error) { log(`multiplayer timeout: ${error.message}`); }
      }
      if (changed) { room.version++; save(room); emit(room); }
    }
  }
  function cleanup() {
    const at = now();
    for (const room of all(true)) {
      const age = room.status === 'waiting' ? 86400000 : room.status === 'finished' ? 7 * 86400000 : 14 * 86400000;
      if (room.updatedAt + age < at) {
        sql.remove.run(room.code); sql.removeCommands.run(room.code);
        for (const s of streams.get(room.code) || []) s.res.end();
      }
    }
    sql.prune.run(at - 7 * 86400000);
    sql.pruneWatchers.run(at);
    agents.cleanup();
    agents.reconcile();
    for (const [key, row] of rates) if (row.reset <= at) rates.delete(key);
  }
  function releaseExpiredAgents() {
    for (const room of all()) {
      let changed = false;
      if(room.hostAccount?.startsWith('dot:') && !agents.validAccount(room.hostAccount)) {
        room.hostAccount=null;room.hostId=null;room.hostRole='player';changed=true;
      }
      for (const seat of [...room.seats]) {
        if (!seat.account?.startsWith('dot:') || agents.validAccount(seat.account)) continue;
        seat.previousAccount = null; seat.account = null;
        if (room.status === 'waiting') {
          room.seats = room.seats.filter(s => s.id !== seat.id); room.seats.forEach(s => { s.ready = false; });
        } else if (room.game.players.some(p => p.id === seat.id && p.alive)) {
          handToAi(room, seat, 'left');
        }
        updateHost(room); changed = true;
      }
      if(changed) {
        updateHost(room);
        if(room.status==='waiting' && !room.seats.length && !room.hostAccount)room.status='finished';
      }
      if (changed) { room.version++; save(room); emit(room); }
    }
    // Revocation also cuts off an already-open spectator stream, without waiting for a game action.
    for (const list of streams.values()) for (const stream of list) {
      if (stream.user.kind === 'dot' && !agents.isValid(stream.user)) {
        sql.unwatch.run(stream.user.roomCode, stream.user.id);
        if(!stream.res.destroyed && !stream.res.writableEnded) {
          stream.res.write('event: expired\ndata: {}\n\n'); stream.res.end();
        }
      }
    }
  }
  async function handle(req, res) {
    try {
      const url = new URL(req.url, 'http://multiplayer.local');
      if (url.pathname === '/multiplayer/api/health' && req.method === 'GET')
        return json(res, 200, { ok: true, version: MP_RULES.version });
      const edition = editionOf(req);
      const origin = edition === 'ng' ? ngOrigin : publicOrigin;
      requireThat(!req.headers.origin || req.headers.origin === origin, 403, 'bad-origin', '请求来源不正确。');
      requireThat(!['cross-site', 'same-site'].includes(req.headers['sec-fetch-site']), 403, 'bad-origin', '请从当前游戏页面操作。');
      if (['/multiplayer/api/agent/redeem','/multiplayer/api/agent/invite-info','/multiplayer/api/agent/logout'].includes(url.pathname)) {
        requireThat(edition === 'sfw', 403, 'agent-normal-only', TEXT.agentNormalOnly);
        requireThat(req.method === 'POST' && req.headers.origin === publicOrigin, 403, 'bad-origin', '请求来源不正确。');
        rate(req.socket.remoteAddress, 'agent-entry', 20);
        const body = await bodyOf(req);
        if(url.pathname.endsWith('/invite-info'))return json(res,200,{invitation:agents.inspect(body.token)});
        if (url.pathname.endsWith('/redeem')) {
          const grant = agents.redeem(body.token,getRoom,body.name);
          res.setHeader('Set-Cookie', agents.cookie(grant.token, grant.expires));
          return json(res, 200, { code: grant.code });
        }
        const user = agents.read(cookieToken(req.headers.cookie, agentCookie));
        if (user) {
          requireThat(req.headers['x-mb-expected-account'] === user.id, 409, 'account-changed', '账号已切换，请刷新页面。');
          agents.end(user); sql.unwatchAccount.run(user.id); releaseExpiredAgents();
          const room=read(user.roomCode);if(room)emit(room);
        }
        res.setHeader('Set-Cookie', agents.cookie());
        return json(res, 200, { ok: true });
      }
      const user = authenticate(req);
      requireThat(user.kind !== 'dot' || edition === 'sfw', 403, 'agent-normal-only', TEXT.agentNormalOnly);
      rate(user.id, 'read', 360);
      if (url.pathname === '/multiplayer/api/boot' && req.method === 'GET') {
        const active = activeRoom(user.id);
        return json(res, 200, { user: { id: user.id, name: user.name, kind: user.kind || 'discord', roomCode: user.roomCode || null,ref:user.ref||null }, edition, rules: MP_RULES,
          activeRoom: active ? { code: active.code, edition: active.edition } : null });
      }
      if (url.pathname === '/multiplayer/api/agent-grants' && req.method === 'GET') {
        requireThat(user.kind !== 'dot', 403, 'agent-human-only', TEXT.agentHumanOnly);
        const code = url.searchParams.get('room');
        return json(res, 200, { grants: agents.list(user, code) });
      }
      if (url.pathname === '/multiplayer/api/rooms' && req.method === 'GET') {
        const rooms = all().filter(r => r.edition === edition && (!user.roomCode || r.code === user.roomCode)
          && (r.status === 'waiting' || r.status === 'playing'))
          .sort((a,b)=>Number(isCreator(b,user))-Number(isCreator(a,user))).slice(0,100);
        return json(res, 200, { rooms: rooms.map(r => ({
          code: r.code, title: r.title, status: r.status,
          count: r.seats.filter(s => s.account && s.control !== 'ai').length,
          capacity: r.game?.players.length || r.capacity, available: aiSeats(r).length,
          map: r.map, locked: !!r.password, joined: !!seatOf(r, user), watching: !!watcherOf(r, user) || (isHost(r,user) && r.hostRole==='spectator'),
          isHost: isHost(r,user), allowSpectators:r.allowSpectators!==false, hostRole:r.hostRole,
          createdByMe:isCreator(r,user),canDissolve:canDissolve(r,user),
          spectators: audienceCount(r), host: r.hostName || COPY.aiBadge,
        })) });
      }
      const match = url.pathname.match(/^\/multiplayer\/api\/rooms\/([A-HJ-NP-Z2-9]{6})(?:\/(events|join|watch|watch-settings|room-settings|dissolve|host-role|leave|resume|ready|settings|kick|start|action|chat))?$/);
      if (match && req.method === 'GET') {
        allowRoom(user, match[1]);
        const room = getRoom(match[1], edition);
        const seat = seatOf(room, user);
        requireThat(isMember(room, user), 403, 'not-a-member', TEXT.watchNotMember);
        if (match[2] !== 'events') return json(res, 200, { room: roomView(room, user) });
        requireThat(!url.searchParams.has('account') || url.searchParams.get('account') === user.id, 409, 'account-changed', '账号已切换，请刷新页面。');
        res.writeHead(200, {
          'Content-Type': 'text/event-stream', 'Cache-Control': 'private, no-store',
          Connection: 'keep-alive', 'X-Accel-Buffering': 'no', 'X-Content-Type-Options': 'nosniff',
        });
        const list = streams.get(room.code) || new Set();
        const existing = [...list].filter(s => s.user.id === user.id);
        // Keep two tabs per account; more tabs replace the oldest connection.
        while (existing.length >= 2) existing.shift().res.end();
        const stream = { res, user, seatId: seat?.id || null };
        list.add(stream); streams.set(room.code, list);
        presence(room.code, user, true);
        const heartbeat = setInterval(() => {
          if (res.destroyed || res.writableEnded) return;
          if (!agents.isValid(user)) { res.write('event: expired\ndata: {}\n\n'); res.end(); }
          else { presence(room.code, user); res.write(': heartbeat\n\n'); }
        }, 15000);
        heartbeat.unref();
        res.on('error', () => res.destroy());
        res.on('close', () => {
          clearInterval(heartbeat); list.delete(stream); if (!list.size) streams.delete(room.code);
          if (!seat || !hasStream(room.code, seat.id)) presence(room.code, user);
        });
        emit(read(room.code));
        return;
      }
      requireThat(req.method === 'POST', 405, 'method', '不支持这个请求。');
      requireThat(req.headers.origin === origin, 403, 'bad-origin', '请求来源不正确。');
      requireThat(req.headers['x-mb-expected-account'] === user.id, 409, 'account-changed', '账号已切换，请刷新页面。');
      const body = await bodyOf(req);
      requireThat(REQUEST_RE.test(body.requestId || ''), 400, 'request-id', '请求编号无效，请刷新重试。');
      const duplicate = sql.dedupe.get(user.id, body.requestId);
      if (duplicate) {
        allowRoom(user, duplicate.code);
        const closed=read(duplicate.code);
        if(closed?.closed && closed.edition===edition)return json(res,200,{room:null,closed:true,duplicate:true});
        const room = getRoom(duplicate.code, edition);
        return json(res, 200, { room: isMember(room, user) ? roomView(room, user) : null, duplicate: true,
          ...(url.pathname==='/multiplayer/api/agent/profile'?{user:{id:user.id,name:user.name,kind:user.kind,roomCode:user.roomCode,ref:user.ref}}:{})});
      }
      rate(user.id, 'write', 120);
      if(url.pathname==='/multiplayer/api/agent/profile') {
        requireThat(user.kind==='dot',403,'agent-profile-only',TEXT.agentProfileOnly);
        rate(user.id,'rename',6);
        const room=read(user.roomCode),member=room&&isMember(room,user);
        const seat=room&&seatOf(room,user);
        let updated;
        const rename=()=>{
          updated=agents.rename(user,body.name);
          if(seat) {
            seat.name=updated.name;
            const country=room.game?.players.find(p=>p.id===seat.id);
            if(country)country.name=updated.name;
          }
          if(room&&isHost(room,user))room.hostName=updated.name;
        };
        if(member)commit(room,user,body.requestId,rename);
        else {
          db.exec('BEGIN IMMEDIATE');
          try{rename();sql.done.run(user.id,body.requestId,user.roomCode,now());db.exec('COMMIT');}
          catch(error){db.exec('ROLLBACK');throw error;}
        }
        return json(res,200,{user:{id:updated.id,name:updated.name,kind:'dot',roomCode:updated.roomCode,ref:updated.ref},
          room:member?roomView(room,user):null});
      }
      if (url.pathname === '/multiplayer/api/agent-grants' || url.pathname==='/multiplayer/api/agent-grants/revoke-all' || /^\/multiplayer\/api\/agent-grants\/[a-f0-9]{24}\/revoke$/.test(url.pathname)) {
        requireThat(user.kind !== 'dot', 403, 'agent-human-only', TEXT.agentHumanOnly);
        if(url.pathname.endsWith('/revoke') || url.pathname.endsWith('/revoke-all')) {
          const revoked=url.pathname.endsWith('/revoke-all')?agents.revokeAll(user):[agents.revoke(user,url.pathname.split('/').at(-2))];
          for(const entry of revoked)sql.unwatchAccount.run(entry.account);
          releaseExpiredAgents();
          for(const code of new Set(revoked.map(r=>r.code))){const room=read(code);if(room)emit(room);}
          return json(res, 200, { ok: true });
        }
        requireThat(edition==='sfw',403,'agent-normal-only',TEXT.agentNormalOnly);
        const room = getRoom(body.code, edition);
        requireThat(seatOf(room, user) || isHost(room,user), 403, 'agent-member-only', TEXT.agentMemberOnly);
        requireThat(room.status !== 'finished', 409, 'game-finished', TEXT.agentAlreadyFinished);
        rate(user.id, 'agent-create', 10);
        let grant;
        db.exec('BEGIN IMMEDIATE');
        try {
          agents.reconcile();grant=agents.create(user,room,body.name,body.replaceId);
          sql.done.run(user.id,body.requestId,room.code,now());db.exec('COMMIT');
        } catch(error){db.exec('ROLLBACK');throw error;}
        return json(res, 201, { grant });
      }
      if (url.pathname === '/multiplayer/api/rooms') {
        requireThat(user.kind !== 'dot', 403, 'agent-room-only', TEXT.agentRoomOnly);
        rate(user.id, 'create', 5);
        const active = activeRoom(user.id);
        requireThat(!active, 409, 'already-in-room', '你已有正在进行中的房间，请先返回原房间或退出对局。');
        requireThat(all().filter(r => r.status !== 'finished').length < 200, 503, 'room-limit', '房间暂时已满，请稍候。');
        requireThat(typeof body.title === 'string' && body.title.trim().length >= 1 && body.title.trim().length <= 30, 400, 'bad-title', '房间名需要 1～30 字。');
        requireThat(own(MP_RULES.maps, body.map), 400, 'bad-map', '请选择有效地图。');
        requireThat([2, 3, 4].includes(body.capacity), 400, 'bad-capacity', '房间人数需要 2～4 人。');
        requireThat([90, 120, 180].includes(body.turnSeconds), 400, 'bad-timer', '请选择有效回合时限。');
        requireThat(body.hostRole===undefined || ['player','spectator'].includes(body.hostRole),400,'bad-host-role',TEXT.badHostRole);
        requireThat(body.allowSpectators===undefined || typeof body.allowSpectators==='boolean',400,'bad-watch-setting',TEXT.badWatchSetting);
        try { bandRoster(body.band); } catch { throw new ApiError(400, 'bad-band', '请选择有效阵容。'); }
        const password = cleanPassword(body.password);
        let code;
        do { code = Array.from(randomBytes(6), n => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[n % 32]).join(''); } while (read(code));
        const seat = { id: 'p1', account: user.id, name: user.name, band: body.band, ready: false,
          control: 'human', lastSeenAt: now(), connectionSeen: false };
        const observing = body.hostRole==='spectator';
        const room = {
          code, edition, title: body.title.trim(), map: body.map, capacity: body.capacity,
          turnSeconds: body.turnSeconds, password: password ? passwordHash(password) : null,
          hostId: observing?null:seat.id, hostAccount:user.id, hostName:user.name, creatorAccount:user.id,
          hostRole:observing?'spectator':'player',allowSpectators:body.allowSpectators!==false,
          seatSeq: observing?0:1, seats: observing?[]:[seat], status: 'waiting', version: 0,
          createdAt: now(), updatedAt: now(), deadline: null, game: null, chat: [], chatSeq: 0,
        };
        message(room, `${user.name}创建了房间。`);
        commit(room, user, body.requestId);
        return json(res, 201, { room: roomView(room, user) });
      }
      requireThat(match && match[2], 404, 'not-found', '接口不存在。');
      allowRoom(user, match[1]);
      const room = getRoom(match[1], edition);
      let operation = match[2];
      let seat = seatOf(room, user);
      if(operation==='dissolve') {
        requireThat(canDissolve(room,user),403,'host-only',TEXT.dissolveOnly);
        room.closed=true;room.closedAt=now();room.closedBy=user.id;room.status='finished';room.deadline=null;
        message(room,formatAccess('dissolveMessage',{actor:user.name}));
        room.hostAccount=null;room.hostId=null;
        for(const member of room.seats){member.account=null;member.previousAccount=null;}
        commit(room,user,body.requestId,()=>{
          agents.closeRoom(room.code);sql.closeAudience.run(room.code,'');
        });
        return json(res,200,{room:null,closed:true});
      }
      if(operation==='host-role') {
        requireThat(isHost(room,user),403,'host-only',TEXT.hostOnly);
        requireThat(['player','spectator'].includes(body.role),400,'bad-host-role',TEXT.badHostRole);
        requireThat(room.status!=='finished',409,'game-finished',COPY.gameFinished);
        if(body.role==='player') {operation='join';body.band??='togenashi';}
        else {
          requireThat(body.version===room.version,409,'stale-version','房间状态已更新，请确认最新状态后再操作。');
          if(seat) {
            room.hostRole='spectator';room.hostId=null;
            if(room.status==='waiting') {
              room.seats=room.seats.filter(s=>s.id!==seat.id);
              room.seats.forEach(s=>{s.ready=false;});
              message(room,formatAccess('hostWatchWaiting',{actor:user.name}));
            } else {
              seat.previousAccount=user.id;seat.account=null;
              if(room.game.players.some(p=>p.id===seat.id&&p.alive))handToAi(room,seat,'host-watch');
            }
            sql.unwatch.run(room.code,user.id);
          }
          commit(room,user,body.requestId);
          return json(res,200,{room:roomView(room,user)});
        }
      }
      if (operation === 'watch') {
        if (seat || isHost(room,user)) return json(res, 200, { room: roomView(room, user) });
        requireThat(room.allowSpectators!==false,403,'spectating-disabled',TEXT.watchClosed);
        requireThat(room.status === 'waiting' || room.game, 409, 'game-finished', COPY.gameFinished);
        if (!watcherOf(room, user)) {
          requireThat(sql.watchers.get(room.code, now()).n < 50, 409, 'watch-limit', TEXT.watchLimit);
          requireThat(sql.watched.get(user.id, now()).n < 8, 409, 'watch-rooms-limit', TEXT.watchRoomsLimit);
          const password = cleanPassword(body.password);
          rate(user.id, 'password', 12);
          requireThat(user.kind === 'dot' || !room.password || passwordMatches(password, room.password), 403, 'wrong-password', '房间密码不正确。');
        }
        sql.watch.run(room.code, user.id, now() + 86400000);
        sql.done.run(user.id, body.requestId, room.code, now());
        emit(room);
        return json(res, 200, { room: roomView(room, user) });
      }
      if (!seat && isHost(room,user) && operation==='leave') {
        room.hostAccount=null;room.hostId=null;room.hostRole='player';
        sql.unwatch.run(room.code,user.id);updateHost(room);
        if(room.status==='waiting'&&!room.seats.length)room.status='finished';
        message(room,`${user.name}离开了房间。`);
        agents.revokeUnused(user.id,room.code);
        commit(room,user,body.requestId);
        return json(res,200,{room:null});
      }
      if (!seat && watcherOf(room, user) && operation === 'leave') {
        sql.unwatch.run(room.code, user.id);
        sql.done.run(user.id, body.requestId, room.code, now());
        emit(room);
        return json(res, 200, { room: null });
      }
      if (operation === 'join') {
        if (seat) {
          if (room.status === 'playing' && seat.control === 'ai') {
            resumeSeat(room, seat); commit(room, user, body.requestId);
          }
          return json(res, 200, { room: roomView(room, user) });
        }
        requireThat(room.status !== 'finished', 409, 'game-finished', COPY.gameFinished);
        requireThat(room.status === 'waiting' ? room.seats.length < room.capacity : aiSeats(room).length > 0,
          409, 'room-full', room.status === 'waiting' ? '房间已经满员。' : COPY.noAiSeat);
        requireThat(!activeRoom(user.id, room.code), 409, 'already-in-room', '你已在其他房间中，请先退出原房间后再加入新房间。');
        const password = cleanPassword(body.password);
        rate(user.id, 'password', 12);
        requireThat(user.kind === 'dot' || isHost(room,user) || watcherOf(room, user) || !room.password || passwordMatches(password, room.password), 403, 'wrong-password', '房间密码不正确。');
        if (room.status === 'waiting') {
          try { bandRoster(body.band); } catch { throw new ApiError(400, 'bad-band', '请选择有效阵容。'); }
          room.seatSeq++;
          seat = { id: `p${room.seatSeq}`, account: user.id, name: user.name, band: body.band, ready: false,
            control: 'human', lastSeenAt: now(), connectionSeen: false };
          room.seats.push(seat); room.seats.forEach(s => { s.ready = false; });
          message(room, `${user.name}加入了房间。`);
        } else {
          const available = aiSeats(room);
          seat = available.find(s => s.previousAccount === user.id) || available[0];
          const country = seat.name;
          // The country, not the controller, owns its roster, resources, AP and battle positions.
          seat.previousAccount = seat.account || seat.previousAccount || null;
          seat.account = user.id; seat.name = user.name; seat.control = 'human'; seat.aiReason = null;
          seat.lastSeenAt = now(); seat.connectionSeen = false;
          room.game.players.find(p => p.id === seat.id).name = user.name;
          updateHost(room);
          const actor = room.game.battle ? battlePlayer(room.game) : room.game.turnId;
          if (actor === seat.id) setDeadline(room);
          message(room, formatCopy('takeoverMessage', { actor: user.name, country }));
        }
        if(isHost(room,user)) {room.hostRole='player';room.hostId=seat.id;room.hostName=user.name;}
        updateHost(room);
        sql.unwatch.run(room.code, user.id);
      } else {
        const hostAdmin = isHost(room,user) && ['start','kick','watch-settings','room-settings'].includes(operation);
        requireThat(seat || hostAdmin || (operation === 'chat' && isMember(room, user)), 403,
          isMember(room,user) ? 'spectator-read-only' : 'not-a-member', isMember(room,user) ? TEXT.watchReadOnly : TEXT.watchNotMember);
        if (seat) seat.lastSeenAt = now();
        // Chat has its own sequence and cannot invalidate a pending game command.
        if (operation === 'chat') {
          rate(user.id, 'chat', 20);
          rate(user.id, 'chat-fast', 2, 1000);
          requireThat(typeof body.text === 'string', 400, 'bad-chat', '消息格式不正确。');
          const text = body.text.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').trim();
          requireThat(text.length >= 1 && text.length <= 300, 400, 'bad-chat', '消息需要 1～300 字。');
          message(room, text, user, seat);
          db.exec('BEGIN IMMEDIATE');
          try { save(room); sql.done.run(user.id, body.requestId, room.code, now()); db.exec('COMMIT'); }
          catch (error) { db.exec('ROLLBACK'); throw error; }
          emit(room);
          return json(res, 200, { room: roomView(room, user) });
        }
        if (operation !== 'resume' && !(operation === 'action' && body.action?.type === 'respondOffer'))
          requireThat(body.version === room.version, 409, 'stale-version', '房间状态已更新，请确认最新状态后再操作。');
        if(operation==='room-settings') {
          requireThat(isHost(room,user),403,'host-only',TEXT.hostOnly);
          requireThat(room.status==='waiting',409,'already-started',TEXT.waitingSettingsOnly);
          const title=body.title===undefined?room.title:body.title;
          const map=body.map===undefined?room.map:body.map;
          const capacity=body.capacity===undefined?room.capacity:body.capacity;
          const seconds=body.turnSeconds===undefined?room.turnSeconds:body.turnSeconds;
          requireThat(typeof title==='string' && title.trim().length>=1 && title.trim().length<=30,400,'bad-title','房间名需要 1～30 字。');
          requireThat(own(MP_RULES.maps,map),400,'bad-map','请选择有效地图。');
          requireThat([2,3,4].includes(capacity),400,'bad-capacity','房间人数需要 2～4 人。');
          requireThat(capacity>=room.seats.length,400,'capacity-too-small',formatAccess('capacityTooSmall',{count:room.seats.length,capacity}));
          requireThat([90,120,180].includes(seconds),400,'bad-timer','请选择有效回合时限。');
          if(title.trim()!==room.title || map!==room.map || capacity!==room.capacity || seconds!==room.turnSeconds) {
            Object.assign(room,{title:title.trim(),map,capacity,turnSeconds:seconds});
            room.seats.forEach(s=>{s.ready=false;});
            message(room,formatAccess('roomSettingsChanged',{actor:user.name}));
          }
        } else if(operation==='watch-settings') {
          requireThat(isHost(room,user),403,'host-only',TEXT.hostOnly);
          requireThat(typeof body.allowSpectators==='boolean',400,'bad-watch-setting',TEXT.badWatchSetting);
          room.allowSpectators=body.allowSpectators;
          if(!room.allowSpectators)sql.closeAudience.run(room.code,room.hostAccount);
        } else if (operation === 'ready' || operation === 'settings') {
          requireThat(room.status === 'waiting', 409, 'already-started', '对局已经开始。');
          if (operation === 'ready') {
            requireThat(typeof body.ready === 'boolean', 400, 'bad-ready', '准备状态无效。');
            seat.ready = body.ready;
          } else {
            try { bandRoster(body.band); } catch { throw new ApiError(400, 'bad-band', '请选择有效阵容。'); }
            seat.band = body.band; seat.ready = false;
          }
        } else if (operation === 'start') {
          requireThat(isHost(room,user), 403, 'host-only', '只有房主能开始对局。');
          requireThat(room.status === 'waiting', 409, 'already-started', '对局已经开始。');
          requireThat((room.seats.length >= 1 || room.hostRole==='spectator') && room.seats.every(s => s.ready),
            400, 'not-ready', room.hostRole==='spectator'?TEXT.hostSpectatorStartHint:COPY.readyStartHint);
          const bands = bandOptions();
          while (room.seats.length < room.capacity) {
            room.seatSeq++;
            const band = bands[randomBytes(4).readUInt32BE() % bands.length].id;
            room.seats.push({ id: `p${room.seatSeq}`, account: null, previousAccount: null,
              name: `${COPY.aiIdleName} ${room.seatSeq}`, band, ready: true, control: 'ai', aiReason: 'empty',
              lastSeenAt: now(), connectionSeen: false });
          }
          const order = room.seats.map(s => ({ ...s, random: randomBytes(4).readUInt32BE() }))
            .sort((a, b) => a.random - b.random);
          room.game = createMultiplayerGame(order, { map: room.map, seed: randomBytes(16).toString('hex') });
          room.status = 'playing'; setDeadline(room);
          message(room, '对局开始，出生点与行动顺序已随机分配。');
        } else if (operation === 'action') {
          requireThat(room.status === 'playing', 409, 'not-playing', '对局尚未开始或已结束。');
          requireThat(seat.control !== 'ai', 409, 'ai-controlled', COPY.resumeRequired);
          runAction(room, seat, body.action);
        } else if (operation === 'resume') {
          requireThat(room.status === 'playing', 409, 'not-playing', '对局尚未开始或已结束。');
          resumeSeat(room, seat);
        } else if (operation === 'kick') {
          requireThat(isHost(room,user) && room.status === 'waiting', 403, 'host-only', '房主只能在准备阶段移出玩家。');
          requireThat(body.seat !== seat?.id && room.seats.some(s => s.id === body.seat), 400, 'bad-seat', '请选择其他玩家。');
          const removed = room.seats.find(s => s.id === body.seat);
          if(removed.account)agents.revokeUnused(removed.account,room.code);
          room.seats = room.seats.filter(s => s.id !== removed.id); room.seats.forEach(s => { s.ready = false; });
          message(room, `${removed.name}已离开房间。`);
        } else if (operation === 'leave') {
          agents.revokeUnused(user.id,room.code);
          if(isHost(room,user)) {room.hostAccount=null;room.hostId=null;room.hostRole='player';}
          if (room.status === 'waiting') {
            room.seats = room.seats.filter(s => s.id !== seat.id);
            room.seats.forEach(s => { s.ready = false; });
            updateHost(room);
            if (!room.seats.length && !room.hostAccount) room.status = 'finished';
          } else {
            seat.previousAccount = user.id;
            seat.account = null;
            if (room.status === 'playing' && room.game.players.some(p => p.id === seat.id && p.alive))
              handToAi(room, seat, 'left');
            updateHost(room);
          }
          message(room, `${user.name}离开了房间。`);
        } else throw new ApiError(404, 'not-found', '接口不存在。');
      }
      commit(room,user,body.requestId,()=>{},
        operation==='watch-settings'&&body.allowSpectators===false?'spectating-disabled':null);
      return json(res, 200, { room: isMember(room, user) ? roomView(room, user) : null });
    } catch (error) {
      if (res.headersSent) { res.end(); return; }
      if (!(error instanceof ApiError)) log(`multiplayer request: ${error.stack || error.message}`);
      json(res, error.status || 500, { error: error.code || 'internal-error', message: error.status ? error.message : '服务器暂时无法处理，请稍候重试。' });
    }
  }
  // Existing games retain their exact world state. New controller metadata is additive.
  for (const room of all()) {
    let changed = upgradeHostMetadata(room);
    for (const seat of room.seats) {
      if (!seat.control) { seat.control = seat.account ? 'human' : 'ai'; changed = true; }
      if (!Number.isFinite(seat.lastSeenAt) || seat.connectionSeen) { seat.lastSeenAt = now(); changed = true; }
    }
    const before=JSON.stringify([room.hostAccount,room.hostId,room.hostName,room.hostRole]);
    updateHost(room);
    if(before!==JSON.stringify([room.hostAccount,room.hostId,room.hostName,room.hostRole]))changed=true;
    if (changed) { room.version++; save(room); }
  }
  cleanup();
  return {
    handle, tick, cleanup, db,
    close() {
      if (closing) return;
      closing = true;
      for (const list of streams.values()) for (const s of list) s.res.end();
      db.close();
    },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(resolve(process.argv[1]))).href) {
  const app = createMultiplayerApp({
    dbPath: process.env.MP_DB || '/var/lib/mistbound-multiplayer/rooms.db',
    secret: process.env.SESSION_SECRET,
    publicOrigin: process.env.PUBLIC_ORIGIN, ngOrigin: process.env.NG_ORIGIN,
  });
  const server = createServer(app.handle);
  const tick = setInterval(app.tick, 1000), cleanup = setInterval(app.cleanup, 3600000);
  server.requestTimeout = 15000; server.headersTimeout = 10000;
  server.listen(Number(process.env.MP_PORT || 18536), process.env.MP_HOST || '127.0.0.1', () => console.log('Mistbound multiplayer ready.'));
  const stop = () => { clearInterval(tick); clearInterval(cleanup); app.close(); server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 5000).unref(); };
  process.on('SIGTERM', stop); process.on('SIGINT', stop);
}

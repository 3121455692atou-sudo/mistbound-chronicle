import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createHmac, randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createMultiplayerApp, readSession } from '../server/multiplayer.mjs';
import { applyGameAction, createMultiplayerGame } from '../web/multiplayer-engine.mjs';
import { interactionText } from '../web/multiplayer-interactions.mjs';

const secret = 'unit-test-only-this-is-not-a-production-key';
const origin = 'https://mistbound.galbands.com';
const ngOrigin = 'https://ng.mistbound.galbands.com';
const tokenFor = (id, at = Date.now()) => {
  const body = Buffer.from(JSON.stringify({ v: 1, sub: String(id), name: `旅人${id}`, exp: Math.floor(at / 1000) + 3600 })).toString('base64url');
  return `${body}.${createHmac('sha256', secret).update(body).digest('base64url')}`;
};
async function inviteAgent(f, room, name = 'Dot') {
  const created = await f.call('100001','/agent-grants',{code:room.code,name});
  assert.equal(created.status,201,JSON.stringify(created.body));
  const token = new URL(created.body.grant.url).hash.slice(5);
  const redeemed = await f.call('100001','/agent/redeem',{token},{headers:{cookie:''}});
  assert.equal(redeemed.status,200,JSON.stringify(redeemed.body));
  const id = `dot:${created.body.grant.id}`;
  const call = (path,body,config={}) => f.call(id,path,body,{...config,headers:{cookie:redeemed.cookie,...config.headers}});
  assert.equal((await call('/boot')).body.user.kind,'dot');
  return {id,call,cookie:redeemed.cookie,grant:created.body.grant};
}
async function fixture(t, options = {}) {
  let clock = Date.now();
  const directory = mkdtempSync(join(tmpdir(), 'mistbound-mp-'));
  let app = createMultiplayerApp({ secret, dbPath: join(directory, 'rooms.db'), now: () => clock, ...options });
  const server = createServer((req, res) => app.handle(req, res));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}/multiplayer/api`;
  const call = async (id, path, body, { edition = 'sfw', headers = {} } = {}) => {
    const response = await fetch(base + path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        cookie: `mb_session=${tokenFor(id, clock)}`, 'x-mb-edition': edition,
        'x-mb-expected-account': String(id), origin: edition === 'ng' ? ngOrigin : origin,
        ...(body === undefined ? {} : { 'content-type': 'application/json' }), ...headers,
      }, body: body === undefined ? undefined : JSON.stringify({ requestId: randomUUID(), ...body }),
    });
    return { status: response.status, body: await response.json(), cookie:response.headers.get('set-cookie')?.split(';')[0] };
  };
  const create = async (id = '100001', values = {}, config = {}) => {
    const result = await call(id, '/rooms', { title: '联机测试', map: 'small', capacity: 2, turnSeconds: 120, band: 'mygo', ...values }, config);
    assert.equal(result.status, 201, JSON.stringify(result.body)); return result.body.room;
  };
  const joinRoom = async (room, id = '200002', values = {}, config = {}) => call(id, `/rooms/${room.code}/join`, { band: 'togenashi', ...values }, config);
  const command = (id, room, type, values = {}) => call(id, `/rooms/${room.code}/${type}`, { version: room.version, ...values });
  const start = async (room, ids = ['100001', '200002']) => {
    for (const id of ids) {
      const result = await command(id, room, 'ready', { ready: true });
      assert.equal(result.status, 200, JSON.stringify(result.body)); room = result.body.room;
    }
    const result = await command(ids[0], room, 'start'); assert.equal(result.status, 200, JSON.stringify(result.body));
    return result.body.room;
  };
  t.after(async () => { app.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); rmSync(directory, { recursive: true, force: true }); });
  return {
    call, create, joinRoom, command, start,
    time(ms) { clock += ms; },
    tick() { app.tick(); },
    restart() { app.close(); app = createMultiplayerApp({ secret, dbPath: join(directory, 'rooms.db'), now: () => clock, ...options }); },
    app: () => app,
    base,
  };
}
test('signed session validation rejects forged, expired and malformed identities', () => {
  const token = tokenFor('100001');
  assert.equal(readSession(token, secret).id, '100001');
  assert.equal(readSession(token + 'x', secret), null);
  assert.equal(readSession(token, secret, Date.now() + 86400000), null);
  assert.equal(readSession('e30.fake', secret), null);
});
test('finished rooms stay readable until retention expiry and are pruned along with deduplication records', async t => {
  const f = await fixture(t);
  let room = await f.create();
  const code = room.code;
  await f.command('100001', room, 'leave');
  const saved = JSON.parse(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(code).data);
  assert.equal(saved.status, 'finished');
  assert.ok(f.app().db.prepare('SELECT count(*) AS n FROM mp_commands WHERE code=?').get(code).n > 0);
  f.app().cleanup();
  assert.ok(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(code));
  assert.equal((await f.call('100001', '/rooms')).body.rooms.length, 0);
  f.time(7 * 86400000 + 1); f.app().cleanup();
  assert.equal(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(code), undefined);
  assert.equal(f.app().db.prepare('SELECT count(*) AS n FROM mp_commands WHERE code=?').get(code).n, 0);
});
test('the service really listens when its entry is launched through a release symlink', { timeout: 10000 }, async t => {
  const directory = mkdtempSync(join(tmpdir(), 'mistbound-mp-entry-'));
  const entry = join(directory, 'current.mjs');
  symlinkSync(fileURLToPath(new URL('../server/multiplayer.mjs', import.meta.url)), entry);
  const child = spawn(process.execPath, [entry], {
    env: { ...process.env, SESSION_SECRET: secret, MP_HOST: '127.0.0.1', MP_PORT: '0', MP_DB: join(directory, 'entry.db') },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  t.after(() => { if (child.exitCode === null) child.kill('SIGKILL'); rmSync(directory, { recursive: true, force: true }); });
  let output = '', errors = '';
  child.stderr.on('data', data => { errors += data.toString(); });
  await new Promise((resolveReady, reject) => {
    child.stdout.on('data', data => { output += data.toString(); if (output.includes('Mistbound multiplayer ready.')) resolveReady(); });
    child.once('error', reject);
    child.once('exit', code => { if (!output.includes('Mistbound multiplayer ready.')) reject(new Error(`Entry exited before listening: ${code}; ${errors}`)); });
  });
  const exit = new Promise(resolveExit => child.once('exit', resolveExit));
  child.kill('SIGTERM'); assert.equal(await exit, 0);
});
test('all room data requires login, expected account and correct origin/edition', async t => {
  const f = await fixture(t);
  let result = await f.call('100001', '/boot', undefined, { headers: { cookie: '' } }); assert.equal(result.status, 401);
  result = await f.call('100001', '/rooms', {}, { headers: { origin: 'https://evil.example' } }); assert.equal(result.status, 403);
  result = await f.call('100001', '/boot', undefined, { headers: { 'x-mb-expected-account': '200002' } }); assert.equal(result.status, 409);
  result = await f.call('100001', '/boot', undefined, { headers: { 'x-mb-edition': 'other' } }); assert.equal(result.status, 403);
  const room = await f.create();
  assert.equal(JSON.stringify(room).includes('100001'), true); // the display name is the only account-shaped data
  assert.equal('account' in room.seats[0], false); assert.equal('password' in room, false);
  result = await f.call('200002', `/rooms/${room.code}`); assert.equal(result.status, 403);
  result = await f.call('100001', `/rooms/${room.code}`, undefined, { edition: 'ng' }); assert.equal(result.status, 409);
  result = await f.call('100001', '/rooms', undefined, { edition: 'ng' }); assert.equal(result.body.rooms.length, 0);
});
test('simultaneous join has one winner, passwords and one active room are enforced', async t => {
  const f = await fixture(t), room = await f.create('100001', { password: '海边的朋友' });
  let result = await f.joinRoom(room, '200002', { password: 'wrong' }); assert.equal(result.status, 403);
  const results = await Promise.all(['200002', '300003'].map(id => f.joinRoom(room, id, { password: '海边的朋友' })));
  assert.equal(results.filter(r => r.status === 200).length, 1); assert.equal(results.filter(r => r.status === 409).length, 1);
  result = await f.call('100001', '/rooms', { title: 'second', map: 'small', capacity: 2, band: 'mygo', turnSeconds: 120 }); assert.equal(result.status, 409);
  const current = (await f.call('100001', `/rooms/${room.code}`)).body.room;
  assert.equal(current.seats.length, 2); assert.equal(JSON.stringify(current).includes('海边的朋友'), false);
});
test('ready and start enforce host, all-ready and stale revisions; joining resets readiness', async t => {
  const f = await fixture(t);
  let room = await f.create('100001', { capacity: 3 });
  room = (await f.command('100001', room, 'ready', { ready: true })).body.room;
  room = (await f.joinRoom(room)).body.room;
  assert.ok(room.seats.every(s => !s.ready));
  let result = await f.command('200002', room, 'start'); assert.equal(result.status, 403);
  result = await f.command('100001', room, 'start'); assert.equal(result.status, 400);
  const before = room;
  room = (await f.command('100001', room, 'ready', { ready: true })).body.room;
  result = await f.command('200002', before, 'ready', { ready: true }); assert.equal(result.status, 409);
  room = (await f.command('200002', room, 'ready', { ready: true })).body.room;
  room = (await f.command('100001', room, 'start')).body.room;
  assert.equal(room.status, 'playing'); assert.equal(room.game.players.length, 3);
  assert.equal(room.seats.filter(s => s.control === 'ai').length, 1); assert.ok(room.deadline);
});
test('duplicate commands and simultaneous clicks cannot double-spend, chat does not conflict', async t => {
  const f = await fixture(t); let room = await f.create();
  room = (await f.joinRoom(room)).body.room; room = await f.start(room);
  const active = room.seats.find(s => s.id === room.game.turnId), id = active.name.replace('旅人', '');
  const player = room.game.players.find(p => p.id === active.id);
  const requestId = randomUUID(), path = `/rooms/${room.code}/action`;
  const command = { version: room.version, requestId, action: { type: 'recruit', key: player.capital } };
  let result = await f.call('200002', `/rooms/${room.code}/chat`, { text: '<img src=x onerror=alert(1)>' });
  assert.equal(result.body.room.version, room.version); assert.equal(result.body.room.chat.at(-1).text, '<img src=x onerror=alert(1)>');
  const both = await Promise.all([f.call(id, path, command), f.call(id, path, command)]);
  assert.equal(both[0].status, 200); assert.equal(both[1].status, 200); assert.ok(both.some(r => r.body.duplicate));
  room = (await f.call(id, `/rooms/${room.code}`)).body.room;
  assert.equal(room.game.players.find(p => p.id === active.id).gold, 33); assert.equal(room.game.ap, 2);
  const oldVersion = room.version;
  const different = await Promise.all([1, 2].map(() => f.call(id, path, { version: oldVersion, action: { type: 'endTurn' } })));
  assert.equal(different.filter(r => r.status === 200).length, 1); assert.equal(different.filter(r => r.status === 409).length, 1);
});
test('room and chat survive process restart, deadlines expire and host transfer works', async t => {
  const f = await fixture(t); let room = await f.create();
  room = (await f.joinRoom(room)).body.room;
  room = (await f.command('100001', room, 'leave')).body.room;
  assert.equal(room, null);
  room = (await f.call('200002', '/boot')).body.activeRoom;
  room = (await f.call('200002', `/rooms/${room.code}`)).body.room;
  assert.equal(room.hostId, room.me);
  room = (await f.joinRoom(room, '300003')).body.room;
  room = await f.start(room, ['200002', '300003']);
  const savedCode = room.code, turn = room.game.turnId;
  f.restart();
  room = (await f.call('200002', `/rooms/${savedCode}`)).body.room;
  assert.equal(room.game.turnId, turn); assert.ok(room.chat.some(m => m.text.includes('开始')));
  f.time(121000); f.tick();
  room = (await f.call('200002', `/rooms/${savedCode}`)).body.room;
  assert.equal(room.seats.find(s => s.id === turn).control, 'ai');
  assert.ok(room.chat.some(m => m.text.includes('超时')));
  for (let i = 0; room.game.turnId === turn && i < 12; i++) {
    f.time(3100); f.tick(); room = (await f.call('200002', `/rooms/${savedCode}`)).body.room;
  }
  assert.notEqual(room.game.turnId, turn);
});
test('SSE requires membership and carries synchronized updates', async t => {
  const f = await fixture(t), room = await f.create();
  const controller = new AbortController();
  t.after(() => controller.abort());
  const response = await fetch(`${f.base}/rooms/${room.code}/events?account=100001`, {
    headers: { cookie: `mb_session=${tokenFor('100001')}`, 'x-mb-edition': 'sfw', origin }, signal: controller.signal,
  });
  assert.equal(response.status, 200); assert.match(response.headers.get('content-type'), /event-stream/);
  const reader = response.body.getReader();
  const first = new TextDecoder().decode((await reader.read()).value);
  assert.match(first, /data: /); assert.match(first, new RegExp(room.code));
  await f.joinRoom(room);
  const second = new TextDecoder().decode((await reader.read()).value);
  assert.match(second, /旅人200002/);
  await reader.cancel(); controller.abort();
});
test('NG rooms use the same room system while edition boundaries remain enforced', async t => {
  const f = await fixture(t); let room = await f.create('100001', {}, { edition: 'ng' });
  assert.equal(room.edition, 'ng');
  const denied = await f.joinRoom(room); assert.equal(denied.status, 409);
  const joined = await f.joinRoom(room, '200002', {}, { edition: 'ng' }); assert.equal(joined.status, 200);
  room = joined.body.room;
  const list = await f.call('100001', '/rooms', undefined, { edition: 'ng' }); assert.equal(list.body.rooms.length, 1);
  const boot = await f.call('100001', '/boot'); assert.equal(boot.body.activeRoom.edition, 'ng');
});
test('one ready host can start with AI countries and another user can join during play', async t => {
  const f = await fixture(t);
  let room = await f.create('100001', { capacity: 4 });
  room = await f.start(room, ['100001']);
  assert.equal(room.game.players.length, 4);
  assert.equal(room.seats.filter(s => s.control === 'ai').length, 3);
  const state = structuredClone(room.game);
  const result = await f.joinRoom(room, '200002', { band: 'kessoku' });
  assert.equal(result.status, 200);
  const after = result.body.room;
  const joined = after.game.players.find(p => p.id === after.me);
  const original = state.players.find(p => p.id === after.me);
  assert.deepEqual({ ...joined, name: original.name }, original);
  assert.deepEqual(after.game.tiles, state.tiles); assert.equal(after.game.ap, state.ap);
  assert.equal(after.game.round, state.round);
  const list = (await f.call('300003', '/rooms')).body.rooms.find(r => r.code === room.code);
  assert.equal(list.status, 'playing'); assert.equal(list.available, 2); assert.equal(list.count, 2);
});
test('leaving keeps the country alive under AI and the former owner can reclaim unchanged state', async t => {
  const f = await fixture(t);
  let room = await f.create('100001', { password: 'private' });
  room = (await f.joinRoom(room, '200002', { password: 'private' })).body.room;
  room = await f.start(room);
  const before = structuredClone(room.game);
  const result = await f.command('100001', room, 'leave');
  assert.equal(result.status, 200); assert.equal(result.body.room, null);
  room = (await f.call('200002', `/rooms/${room.code}`)).body.room;
  assert.equal(room.status, 'playing'); assert.ok(room.game.players.every(p => p.alive));
  assert.equal(room.seats.find(s => s.id === 'p1').control, 'ai');
  assert.deepEqual(room.game, before);
  assert.equal((await f.call('100001', '/boot')).body.activeRoom, null);
  const rejected = await f.joinRoom(room, '300003', { password: 'wrong' });
  assert.equal(rejected.status, 403);
  room = (await f.joinRoom(room, '100001', { password: 'private' })).body.room;
  assert.equal(room.me, 'p1'); assert.equal(room.seats.find(s => s.id === 'p1').control, 'human');
  assert.deepEqual(room.game, before);
  assert.ok(!JSON.stringify(room.seats).includes('previousAccount'));
});
test('two users racing for one AI country cannot both claim it; the former owner loses command access', async t => {
  const f = await fixture(t); let room = await f.create();
  room = (await f.joinRoom(room)).body.room; room = await f.start(room);
  await f.command('100001', room, 'leave');
  const both = await Promise.all(['300003', '400004'].map(id => f.joinRoom(room, id)));
  assert.equal(both.filter(r => r.status === 200).length, 1);
  assert.equal(both.filter(r => r.status === 409).length, 1);
  room = both.find(r => r.status === 200).body.room;
  assert.equal(room.me, 'p1'); assert.equal(room.game.players.length, 2);
  assert.equal((await f.command('100001', room, 'action', { action: { type: 'endTurn' } })).status, 403);
  assert.equal((await f.call('100001', `/rooms/${room.code}`)).status, 403);
});
test('AI actually recruits, moves and advances rounds after all people leave, including after restart', async t => {
  const f = await fixture(t); let room = await f.create();
  room = (await f.joinRoom(room)).body.room; room = await f.start(room);
  const code = room.code, initial = structuredClone(room.game);
  await f.command('100001', room, 'leave');
  room = (await f.call('200002', `/rooms/${code}`)).body.room;
  await f.command('200002', room, 'leave');
  f.restart();
  for (let i = 0; i < 35; i++) { f.time(3100); f.tick(); }
  const stored = JSON.parse(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(code).data);
  assert.ok(stored.game.round > 1);
  assert.ok(stored.seats.every(s => s.control === 'ai'));
  assert.ok(stored.game.players.every(p => p.alive));
  assert.notDeepEqual(stored.game.players.map(p => p.army), initial.players.map(p => p.army));
  assert.ok(stored.game.log.some(e => e.text.includes('开拓')));
});
test('a timed-out player can resume without refreshing AP or giving AI control of the other side', async t => {
  const f = await fixture(t); let room = await f.create();
  room = (await f.joinRoom(room)).body.room; room = await f.start(room);
  const actor = room.game.turnId, account = actor === 'p1' ? '100001' : '200002';
  f.time(121000); f.tick();
  room = (await f.call(account, `/rooms/${room.code}`)).body.room;
  assert.equal(room.seats.find(s => s.id === actor).control, 'ai');
  assert.equal((await f.command(account, room, 'action', { action: { type: 'endTurn' } })).status, 409);
  f.time(3100); f.tick();
  room = (await f.call(account, `/rooms/${room.code}`)).body.room;
  const before = structuredClone(room.game);
  const resumed = await f.call(account, `/rooms/${room.code}/resume`, { version: -999 });
  assert.equal(resumed.status, 200); assert.deepEqual(resumed.body.room.game, before);
  assert.equal(resumed.body.room.seats.find(s => s.id === actor).control, 'human');
});
test('disconnect grace restores an unchanged country on reconnect and server shutdown closes streams safely', async t => {
  const f = await fixture(t); let room = await f.create();
  room = (await f.joinRoom(room)).body.room;
  const controller = new AbortController();
  const stream = async () => fetch(`${f.base}/rooms/${room.code}/events?account=200002`, {
    headers: { cookie: `mb_session=${tokenFor('200002')}`, 'x-mb-edition': 'sfw', origin },
    signal: controller.signal,
  });
  const response = await stream(), reader = response.body.getReader();
  await reader.read();
  room = await f.start(room);
  await reader.cancel();
  await new Promise(resolve => setTimeout(resolve, 20));
  f.time(46000); f.tick();
  room = (await f.call('100001', `/rooms/${room.code}`)).body.room;
  assert.equal(room.seats.find(s => s.id === 'p2').control, 'ai');
  const before = structuredClone(room.game);
  const reconnected = await stream(), secondReader = reconnected.body.getReader();
  await secondReader.read();
  room = (await f.call('200002', `/rooms/${room.code}`)).body.room;
  assert.equal(room.seats.find(s => s.id === 'p2').control, 'human');
  assert.deepEqual(room.game, before);
  await secondReader.cancel(); controller.abort();
});
test('mid-battle AI takeover and replacement retain unit HP, positions and spent actions', async t => {
  const f = await fixture(t); let room = await f.create();
  room = (await f.joinRoom(room)).body.room; room = await f.start(room);
  const row = JSON.parse(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(room.code).data);
  let game = createMultiplayerGame(row.seats, { seed: 'join-battle-test' });
  game.round = 3; game.players[0].army.key = '0,0'; game.players[1].army.key = '1,0';
  Object.assign(game.tiles['0,0'], { owner: 'p1', troops: 0 });
  Object.assign(game.tiles['1,0'], { owner: 'p2', troops: 4 });
  row.game = applyGameAction(game, 'p1', { type: 'moveArmy', key: '1,0' });
  f.app().db.prepare('UPDATE mp_rooms SET data=? WHERE code=?').run(JSON.stringify(row), room.code);
  await f.command('100001', room, 'leave');
  f.time(3100); f.tick();
  room = (await f.call('200002', `/rooms/${room.code}`)).body.room;
  assert.equal(room.game.battle.playerSide, 'defender');
  const battle = structuredClone(room.game.battle);
  assert.ok(battle.units.filter(u => u.side === 'attacker').every(u => u.acted));
  const joined = await f.joinRoom(room, '300003');
  assert.equal(joined.status, 200); assert.equal(joined.body.room.me, 'p1');
  assert.deepEqual(joined.body.room.game.battle, battle);
  assert.equal((await f.command('300003', joined.body.room, 'action', { action: { type: 'battleEndTurn' } })).status, 400);
});
test('interaction results reach both players with distinct NPC perspectives and only the recipient can accept a treaty', async t => {
  const f = await fixture(t); let room = await f.create();
  room = (await f.joinRoom(room)).body.room; room = await f.start(room);
  const actor = room.game.turnId, other = room.game.players.find(p => p.id !== actor);
  const account = actor === 'p1' ? '100001' : '200002', recipient = actor === 'p1' ? '200002' : '100001';
  room = (await f.command(account, room, 'action', { action: { type: 'talk', targetId: other.id, characterId: other.army.heroes[0].id } })).body.room;
  const event = room.game.social.events.at(-1);
  assert.match(interactionText(event, actor), /^你/);
  assert.ok(interactionText(event, other.id).includes('与你'));
  assert.equal((await f.command(account, room, 'action', { action: { type: 'train', targetId: other.id, characterId: other.army.heroes[0].id, stat: 'attack' } })).status, 400);
  room = (await f.command(account, room, 'action', { action: { type: 'offerTrade', targetId: other.id } })).body.room;
  const offer = room.game.social.offers[0], beforeAP = room.game.ap;
  const forged = await f.command(account, room, 'action', { action: { type: 'respondOffer', offerId: offer.id, accept: true } });
  assert.equal(forged.status, 400);
  const accepted = await f.call(recipient, `/rooms/${room.code}/action`, {
    version: -1, action: { type: 'respondOffer', offerId: offer.id, accept: true },
  });
  assert.equal(accepted.status, 200); assert.equal(accepted.body.room.game.ap, beforeAP);
  assert.equal(accepted.body.room.game.social.offers.length, 0);
  const firstView = (await f.call(account, `/rooms/${room.code}`)).body.room;
  assert.deepEqual(firstView.game.social, accepted.body.room.game.social);
  assert.ok(interactionText(firstView.game.social.events.at(-1), actor).includes('→ 你'));
});
test('AI evaluates an incoming proposal during a human turn without consuming that human AP', async t => {
  const f = await fixture(t); let room = await f.create();
  room = await f.start(room, ['100001']);
  for (let i = 0; room.game.turnId !== 'p1' && i < 12; i++) {
    f.time(3100); f.tick(); room = (await f.call('100001', `/rooms/${room.code}`)).body.room;
  }
  assert.equal(room.game.turnId, 'p1');
  room = (await f.command('100001', room, 'action', { action: { type: 'offerTrade', targetId: 'p2' } })).body.room;
  const ap = room.game.ap;
  f.tick();
  room = (await f.call('100001', `/rooms/${room.code}`)).body.room;
  assert.equal(room.game.turnId, 'p1'); assert.equal(room.game.ap, ap);
  assert.equal(room.game.social.offers.length, 0);
  assert.equal(room.game.social.events.at(-1).kind, 'tradeAccepted');
  assert.equal(room.game.social.events.at(-1).actor, 'p2');
});

test('logged-in spectators watch a full room and chat without acquiring a seat or changing the world', async t => {
  const f=await fixture(t);let room=await f.create('100001',{password:'private'});
  room=(await f.joinRoom(room,'200002',{password:'private'})).body.room;room=await f.start(room);
  const before=JSON.parse(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(room.code).data);
  assert.equal((await f.call('300003',`/rooms/${room.code}/watch`,{password:'wrong'})).status,403);
  let result=await f.call('300003',`/rooms/${room.code}/watch`,{password:'private'});
  assert.equal(result.status,200);assert.equal(result.body.room.role,'spectator');assert.equal(result.body.room.me,null);
  assert.equal(result.body.room.spectators,1);assert.equal(result.body.room.seats.length,2);
  assert.deepEqual(JSON.parse(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(room.code).data),before);
  assert.equal((await f.call('300003','/boot')).body.activeRoom,null);
  assert.equal((await f.call('300003',`/rooms/${room.code}`)).status,200);
  for(const op of ['ready','settings','start','kick','resume','action']) {
    const denied=await f.call('300003',`/rooms/${room.code}/${op}`,{version:room.version,ready:true,band:'mygo',seat:'p1',action:{type:'endTurn'},me:'p1',role:'player'});
    assert.equal(denied.status,403,op);assert.equal(denied.body.error,'spectator-read-only');
  }
  result=await f.call('300003',`/rooms/${room.code}/chat`,{text:'<img src=x onerror=alert(1)>'});
  assert.equal(result.status,200);assert.equal(result.body.room.chat.at(-1).spectator,true);
  assert.deepEqual(result.body.room.game,before.game);assert.equal(result.body.room.version,before.version);
  result=await f.call('300003',`/rooms/${room.code}/leave`,{});
  assert.equal(result.body.room,null);
  const after=(await f.call('100001',`/rooms/${room.code}`)).body.room;
  assert.equal(after.spectators,0);assert.deepEqual(after.game,before.game);assert.equal(after.version,before.version);
  assert.ok(after.seats.every(s=>s.control==='human'));
});
test('spectators receive live SSE, survive a restart and do not count as a player connection', async t => {
  const f=await fixture(t);let room=await f.create();
  await f.call('300003',`/rooms/${room.code}/watch`,{});
  const controller=new AbortController();
  const response=await fetch(`${f.base}/rooms/${room.code}/events?account=300003`,{
    signal:controller.signal,headers:{cookie:`mb_session=${tokenFor('300003')}`,'x-mb-edition':'sfw',origin},
  });
  assert.equal(response.status,200);
  const reader=response.body.getReader(),first=new TextDecoder().decode((await reader.read()).value);
  assert.match(first,/"role":"spectator"/);assert.match(first,/"online":false/);
  await f.command('100001',room,'ready',{ready:true});
  const update=new TextDecoder().decode((await reader.read()).value);assert.match(update,/"ready":true/);
  controller.abort();await reader.cancel().catch(()=>{});f.restart();
  assert.equal((await f.call('300003',`/rooms/${room.code}`)).body.room.role,'spectator');
  room=await f.start((await f.call('100001',`/rooms/${room.code}`)).body.room,['100001']);
  f.time(86400001);f.app().cleanup();
  assert.equal((await f.call('300003',`/rooms/${room.code}`)).status,403);
});
test('a spectator can join an available AI country without resetting it or retaining a spectator seat', async t => {
  const f=await fixture(t);let room=await f.create();
  room=await f.start(room,['100001']);
  await f.call('300003',`/rooms/${room.code}/watch`,{});
  const before=structuredClone(room.game.players.find(p=>p.id==='p2'));
  const joined=await f.joinRoom(room,'300003');
  assert.equal(joined.status,200);assert.equal(joined.body.room.role,'player');assert.equal(joined.body.room.me,'p2');
  assert.equal(joined.body.room.spectators,0);
  const after=joined.body.room.game.players.find(p=>p.id==='p2');
  assert.deepEqual({...after,name:before.name},before);
  assert.equal((await f.call('300003','/boot')).body.activeRoom.code,room.code);
});
test('watching needs login, preserves the edition boundary and supports both editions without reserving a player slot', async t => {
  const f=await fixture(t),room=await f.create();
  assert.equal((await f.call('300003',`/rooms/${room.code}/watch`,{},{headers:{cookie:''}})).status,401);
  assert.equal((await f.call('300003',`/rooms/${room.code}/watch`,{},{edition:'ng'})).status,409);
  await f.call('300003',`/rooms/${room.code}/watch`,{});
  const ng=await f.create('300003',{}, {edition:'ng'});
  const watched=await f.call('200002',`/rooms/${ng.code}/watch`,{},{edition:'ng'});
  assert.equal(watched.body.room.role,'spectator');
  assert.equal((await f.call('300003','/boot')).body.activeRoom.edition,'ng');
});
test('Dot invitations require a verified player in a normal room; spectators and other owners cannot manage them', async t => {
  const f=await fixture(t),room=await f.create();
  await f.call('300003',`/rooms/${room.code}/watch`,{});
  assert.equal((await f.call('300003','/agent-grants',{code:room.code,name:'Dot'})).status,403);
  assert.equal((await f.call('100001','/agent-grants',{code:room.code,name:'Dot'},{headers:{cookie:''}})).status,401);
  const ng=await f.create('200002',{}, {edition:'ng'});
  assert.equal((await f.call('200002','/agent-grants',{code:ng.code,name:'Dot'},{edition:'ng'})).status,403);
  const agent=await inviteAgent(f,room);
  assert.equal((await f.call('200002',`/agent-grants/${agent.grant.id}/revoke`,{})).status,404);
  assert.deepEqual((await f.call('200002','/agent-grants')).body.grants,[]);
  assert.equal((await agent.call('/agent-grants')).status,403);
  assert.equal((await agent.call('/agent-grants',{code:room.code,name:'second'})).status,403);
  assert.equal((await f.call('100001','/agent-grants')).body.grants[0].used,true);
  await f.command('100001',room,'leave');
  // Revocation remains available in the lobby even after the issuer has left the room.
  assert.equal((await f.call('100001',`/agent-grants/${agent.grant.id}/revoke`,{})).status,200);
});
test('Dot grants are single-use and store only credential hashes; raced redemption cannot create two sessions', async t => {
  const f=await fixture(t),room=await f.create();
  const created=await f.call('100001','/agent-grants',{code:room.code,name:'Dot'});
  const token=new URL(created.body.grant.url).hash.slice(5);
  const results=await Promise.all([1,2].map(()=>f.call('100001','/agent/redeem',{token},{headers:{cookie:''}})));
  assert.deepEqual(results.map(r=>r.status).sort(),[200,403]);
  const cookie=results.find(r=>r.status===200).cookie;
  const stored=JSON.stringify(f.app().db.prepare('SELECT * FROM mp_agents').all());
  assert.equal(stored.includes(token),false);assert.equal(stored.includes(cookie.split('.')[1]),false);
  assert.equal(new URL(created.body.grant.url).search,'');
  assert.equal((await f.call('100001','/agent/redeem',{token},{headers:{cookie:'',origin:'https://evil.example'}})).status,403);
});
test('Dot identity overrides a coexisting human cookie, cannot enter NG, list other rooms, create rooms or act outside its grant', async t => {
  const f=await fixture(t),room=await f.create(),other=await f.create('200002');
  const agent=await inviteAgent(f,room);
  const boot=await agent.call('/boot');
  assert.equal(boot.body.user.roomCode,room.code);assert.equal(boot.body.user.id,agent.id);
  assert.equal((await agent.call('/rooms')).body.rooms.length,1);
  assert.equal((await agent.call(`/rooms/${other.code}/watch`,{})).body.error,'agent-room-only');
  assert.equal((await agent.call(`/rooms/${other.code}`)).status,403);
  assert.equal((await agent.call('/rooms',{})).status,403);
  assert.equal((await agent.call('/boot',undefined,{edition:'ng'})).body.error,'agent-normal-only');
  const withHuman=await agent.call('/boot',undefined,{edition:'ng',headers:{cookie:`${agent.cookie}; mb_session=${tokenFor('100001')}`}});
  assert.equal(withHuman.status,403);
  const forged=await agent.call('/boot',undefined,{headers:{cookie:agent.cookie+'x'}});
  assert.equal(forged.status,401);
  const ownerView=await f.call('100001',`/rooms/${room.code}`);
  assert.equal(JSON.stringify(ownerView.body).includes(agent.id),false);
});
test('Dot joins password rooms through its explicit room grant and keeps exactly the same player permissions', async t => {
  const f=await fixture(t);let room=await f.create('100001',{password:'secret'});
  const agent=await inviteAgent(f,room);
  let result=await agent.call(`/rooms/${room.code}/join`,{band:'mygo'});
  assert.equal(result.status,200);assert.equal(result.body.room.seats.find(s=>s.id==='p2').agent,true);
  room=(await f.command('100001',result.body.room,'ready',{ready:true})).body.room;
  room=(await agent.call(`/rooms/${room.code}/ready`,{version:room.version,ready:true})).body.room;
  assert.equal((await agent.call(`/rooms/${room.code}/start`,{version:room.version})).status,403);
  room=(await f.command('100001',room,'start')).body.room;
  assert.equal((await agent.call(`/rooms/${room.code}/chat`,{text:'Dot ready'})).body.room.chat.at(-1).agent,true);
  f.restart();assert.equal((await agent.call('/boot')).body.user.kind,'dot');
  if(room.game.turnId==='p2') {
    result=await agent.call(`/rooms/${room.code}/action`,{version:room.version,action:{type:'endTurn'}});
    assert.equal(result.status,200);
  } else assert.equal((await agent.call(`/rooms/${room.code}/action`,{version:room.version,action:{type:'endTurn'}})).status,400);
});
test('revoking a playing Dot session immediately hands its unchanged country to AI and blocks further reads', async t => {
  const f=await fixture(t);let room=await f.create();
  const agent=await inviteAgent(f,room);
  room=(await agent.call(`/rooms/${room.code}/join`,{band:'mygo'})).body.room;
  room=(await f.command('100001',room,'ready',{ready:true})).body.room;
  room=(await agent.call(`/rooms/${room.code}/ready`,{version:room.version,ready:true})).body.room;
  room=(await f.command('100001',room,'start')).body.room;
  const before=structuredClone(room.game);
  const controller=new AbortController();
  const response=await fetch(`${f.base}/rooms/${room.code}/events?account=${agent.id}`,{
    signal:controller.signal,headers:{cookie:agent.cookie,'x-mb-edition':'sfw',origin},
  });
  assert.equal(response.status,200);
  const reader=response.body.getReader();
  await reader.read();
  assert.equal((await f.call('100001',`/agent-grants/${agent.grant.id}/revoke`,{})).status,200);
  const expired=new TextDecoder().decode((await reader.read()).value);
  assert.match(expired,/event: expired/);
  controller.abort();await reader.cancel().catch(()=>{});
  const after=(await f.call('100001',`/rooms/${room.code}`)).body.room;
  assert.deepEqual(after.game,before);assert.equal(after.seats.find(s=>s.id==='p2').control,'ai');
  assert.equal((await agent.call('/boot')).status,401);
  assert.equal((await agent.call(`/rooms/${room.code}/action`,{version:after.version,action:{type:'endTurn'}})).status,401);
});
test('unused invitation expiry, session expiry and logout are enforced independently of Discord sessions', async t => {
  const f=await fixture(t);let room=await f.create();
  const invite=await f.call('100001','/agent-grants',{code:room.code,name:'Old Dot'});
  f.time(30*60000+1);
  assert.equal((await f.call('100001','/agent/redeem',{token:new URL(invite.body.grant.url).hash.slice(5)},{headers:{cookie:''}})).status,403);
  const agent=await inviteAgent(f,room);
  await agent.call(`/rooms/${room.code}/join`,{band:'mygo'});
  f.time(12*3600000+1);f.tick();
  assert.equal((await agent.call('/boot')).status,401);
  room=(await f.call('100001',`/rooms/${room.code}`)).body.room;
  assert.equal(room.seats.length,1);
  const second=await inviteAgent(f,room,'New Dot');
  await second.call(`/rooms/${room.code}/watch`,{});
  assert.equal((await second.call('/agent/logout',{})).status,200);
  assert.equal((await second.call('/boot')).status,401);
  assert.equal((await f.call('100001','/boot')).status,200);
});
test('a spectator host owns a room without occupying a country and keeps it in their active-room slot', async t => {
  const f=await fixture(t),room=await f.create('100001',{hostRole:'spectator',allowSpectators:false});
  assert.equal(room.role,'spectator');assert.equal(room.me,null);assert.equal(room.isHost,true);
  assert.equal(room.hostRole,'spectator');assert.equal(room.hostId,null);assert.equal(room.seats.length,0);
  assert.equal(room.capacity,2);assert.equal(room.spectators,1);assert.equal(room.allowSpectators,false);
  assert.equal('hostAccount' in room,false);
  assert.equal((await f.call('100001','/boot')).body.activeRoom.code,room.code);
  assert.equal((await f.call('100001',`/rooms/${room.code}/watch`,{})).body.room.isHost,true);
  assert.equal((await f.call('200002',`/rooms/${room.code}/watch`,{})).body.error,'spectating-disabled');
  const listed=(await f.call('200002','/rooms')).body.rooms.find(r=>r.code===room.code);
  assert.equal(listed.allowSpectators,false);assert.equal(listed.hostRole,'spectator');assert.equal(listed.count,0);
  assert.equal((await f.call('100001','/rooms',{title:'Other',map:'small',capacity:2,turnSeconds:120,band:'mygo'})).status,409);
  const joined=(await f.joinRoom(room)).body.room;
  assert.equal(joined.isHost,false);assert.equal(joined.me,'p1');assert.equal(joined.seats.length,1);
  assert.equal((await f.command('200002',joined,'start')).status,403);
  assert.equal((await f.command('100001',joined,'start')).status,400);
  const ready=(await f.command('200002',joined,'ready',{ready:true})).body.room;
  const started=(await f.command('100001',ready,'start')).body.room;
  assert.equal(started.game.players.length,2);assert.equal(started.isHost,true);assert.equal(started.me,null);
  assert.equal(started.seats.filter(s=>s.control==='ai').length,1);
  for(const operation of ['ready','resume','action']) {
    const denied=await f.command('100001',started,operation,{ready:true,action:{type:'endTurn'}});
    assert.equal(denied.status,403);assert.equal(denied.body.error,'spectator-read-only');
  }
  const chat=await f.call('100001',`/rooms/${room.code}/chat`,{text:'Host spectating'});
  assert.equal(chat.body.room.chat.at(-1).host,true);assert.equal(chat.body.room.chat.at(-1).spectator,true);
});
test('a spectator host can start an all-AI game, restart and join an unchanged country without losing ownership', async t => {
  const f=await fixture(t);let room=await f.create('100001',{hostRole:'spectator',capacity:4});
  room=(await f.command('100001',room,'start')).body.room;
  assert.equal(room.game.players.length,4);assert.equal(room.seats.filter(s=>s.control==='ai').length,4);
  assert.equal(room.me,null);assert.equal(room.isHost,true);
  const world=structuredClone(room.game);f.restart();
  room=(await f.call('100001',`/rooms/${room.code}`)).body.room;
  assert.equal(room.isHost,true);assert.equal(room.role,'spectator');assert.deepEqual(room.game,world);
  room=(await f.command('100001',room,'host-role',{role:'player'})).body.room;
  assert.equal(room.role,'player');assert.equal(room.isHost,true);assert.equal(room.hostId,room.me);
  const before=world.players.find(p=>p.id===room.me),after=room.game.players.find(p=>p.id===room.me);
  assert.deepEqual({...after,name:before.name},before);assert.equal(room.game.ap,world.ap);
});
test('closing spectators evicts existing viewers over SSE, preserves host and players, and reopening still requires the password', {timeout:10000}, async t => {
  const f=await fixture(t);let room=await f.create('100001',{hostRole:'spectator',password:'private'});
  room=(await f.joinRoom(room,'200002',{password:'private'})).body.room;
  await f.call('300003',`/rooms/${room.code}/watch`,{password:'private'});
  const controllers=[],readers=[];
  for(const id of ['100001','300003']) {
    const controller=new AbortController();controllers.push(controller);
    const response=await fetch(`${f.base}/rooms/${room.code}/events?account=${id}`,{
      signal:controller.signal,headers:{cookie:`mb_session=${tokenFor(id)}`,'x-mb-edition':'sfw',origin},
    });
    assert.equal(response.status,200);
    const reader=response.body.getReader();readers.push(reader);await reader.read();
  }
  const denied=await f.command('200002',room,'watch-settings',{allowSpectators:false});
  assert.equal(denied.status,403);
  room=(await f.command('100001',room,'watch-settings',{allowSpectators:false})).body.room;
  const removed=new TextDecoder().decode((await readers[1].read()).value);
  assert.match(removed,/event: removed/);assert.match(removed,/spectating-disabled/);
  let hostUpdate='';
  while(!hostUpdate.includes('"allowSpectators":false'))hostUpdate+=new TextDecoder().decode((await readers[0].read()).value);
  assert.match(hostUpdate,/"isHost":true/);assert.match(hostUpdate,/"allowSpectators":false/);
  assert.equal(room.spectators,1);assert.equal(room.me,null);assert.equal(room.seats.length,1);
  assert.equal((await f.call('200002',`/rooms/${room.code}`)).status,200);
  assert.equal((await f.call('300003',`/rooms/${room.code}`)).status,403);
  assert.equal((await f.call('300003',`/rooms/${room.code}/watch`,{password:'private'})).body.error,'spectating-disabled');
  room=(await f.command('100001',room,'watch-settings',{allowSpectators:true})).body.room;
  assert.equal((await f.call('300003',`/rooms/${room.code}/watch`,{password:'wrong'})).body.error,'wrong-password');
  assert.equal((await f.call('300003',`/rooms/${room.code}/watch`,{password:'private'})).body.room.role,'spectator');
  for(let i=0;i<controllers.length;i++){controllers[i].abort();await readers[i].cancel().catch(()=>{});}
});
test('a waiting player host can free their seat, retain management, and rejoin only when a real slot is available', async t => {
  const f=await fixture(t);let room=await f.create();
  room=(await f.joinRoom(room)).body.room;
  room=(await f.command('200002',room,'ready',{ready:true})).body.room;
  assert.equal((await f.command('200002',room,'host-role',{role:'spectator',hostAccount:'200002'})).status,403);
  room=(await f.command('100001',room,'host-role',{role:'spectator'})).body.room;
  assert.equal(room.me,null);assert.equal(room.hostRole,'spectator');assert.equal(room.isHost,true);
  assert.equal(room.seats.length,1);assert.ok(room.seats.every(s=>!s.ready));assert.equal(room.seats[0].id,'p2');
  room=(await f.joinRoom(room,'300003')).body.room;
  assert.equal((await f.command('100001',room,'host-role',{role:'player'})).status,409);
  const other=room.seats.find(s=>s.id!=='p2');
  room=(await f.command('100001',room,'kick',{seat:other.id})).body.room;
  room=(await f.command('100001',room,'host-role',{role:'player'})).body.room;
  assert.equal(room.isHost,true);assert.equal(room.role,'player');assert.equal(room.hostId,room.me);
  assert.equal(room.seats.length,2);assert.equal(new Set(room.seats.map(s=>s.id)).size,2);
});
test('a playing host moves to observation under AI and returns without changing any world resources, AP or battlefield', async t => {
  const f=await fixture(t);let room=await f.create();
  room=(await f.joinRoom(room)).body.room;room=await f.start(room);
  const before=structuredClone(room.game);
  room=(await f.command('100001',room,'host-role',{role:'spectator'})).body.room;
  assert.equal(room.me,null);assert.equal(room.isHost,true);assert.equal(room.hostRole,'spectator');
  assert.equal(room.seats.find(s=>s.id==='p1').control,'ai');assert.deepEqual(room.game,before);
  assert.equal((await f.command('100001',room,'action',{action:{type:'endTurn'}})).status,403);
  assert.equal((await f.call('200002',`/rooms/${room.code}`)).body.room.isHost,false);
  room=(await f.command('100001',room,'host-role',{role:'player'})).body.room;
  assert.equal(room.me,'p1');assert.equal(room.isHost,true);assert.deepEqual(room.game,before);
});
test('a spectator host leaving transfers management to a player, and an empty waiting room closes', async t => {
  const f=await fixture(t);let room=await f.create('100001',{hostRole:'spectator'});
  room=(await f.joinRoom(room)).body.room;
  assert.equal((await f.command('100001',room,'leave')).body.room,null);
  room=(await f.call('200002',`/rooms/${room.code}`)).body.room;
  assert.equal(room.isHost,true);assert.equal(room.hostId,room.me);assert.equal(room.hostRole,'player');
  assert.equal((await f.call('100001',`/rooms/${room.code}`)).status,403);
  assert.equal((await f.call('100001','/boot')).body.activeRoom,null);
  const empty=await f.create('100001',{hostRole:'spectator'});
  await f.command('100001',empty,'leave');
  assert.equal(JSON.parse(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(empty.code).data).status,'finished');
});
test('legacy room metadata defaults to open spectators and the original player host without changing the world', async t => {
  const f=await fixture(t);let room=await f.create();
  room=(await f.joinRoom(room)).body.room;room=await f.start(room);
  const saved=JSON.parse(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(room.code).data);
  for(const key of ['hostRole','hostAccount','hostName','allowSpectators'])delete saved[key];
  f.app().db.prepare('UPDATE mp_rooms SET data=? WHERE code=?').run(JSON.stringify(saved),room.code);
  f.restart();
  const migrated=(await f.call('100001',`/rooms/${room.code}`)).body.room;
  assert.equal(migrated.isHost,true);assert.equal(migrated.hostId,'p1');assert.equal(migrated.hostRole,'player');
  assert.equal(migrated.allowSpectators,true);assert.deepEqual(migrated.game,room.game);
});
test('a spectator host may invite Dot, and a revoked Dot spectator host cannot leave orphaned ownership', async t => {
  const f=await fixture(t);let room=await f.create('100001',{hostRole:'spectator'});
  const agent=await inviteAgent(f,room);
  room=(await agent.call(`/rooms/${room.code}/join`,{band:'mygo'})).body.room;
  room=(await agent.call(`/rooms/${room.code}/ready`,{version:room.version,ready:true})).body.room;
  room=(await f.command('100001',room,'start')).body.room;
  await f.command('100001',room,'leave');
  room=(await agent.call(`/rooms/${room.code}`)).body.room;assert.equal(room.isHost,true);
  room=(await agent.call(`/rooms/${room.code}/host-role`,{role:'spectator',version:room.version})).body.room;
  assert.equal(room.me,null);assert.equal(room.isHost,true);
  room=(await f.joinRoom(room,'300003')).body.room;assert.equal(room.isHost,false);
  await f.call('100001',`/agent-grants/${agent.grant.id}/revoke`,{});
  room=(await f.call('300003',`/rooms/${room.code}`)).body.room;
  assert.equal(room.isHost,true);assert.equal(room.hostRole,'player');
  assert.equal((await agent.call('/boot')).status,401);
});
test('NG supports a spectator host and its watch switch while malformed creation settings are rejected', async t => {
  const f=await fixture(t);
  const values={title:'settings',map:'small',capacity:2,turnSeconds:120,band:'mygo'};
  assert.equal((await f.call('100001','/rooms',{...values,hostRole:'admin'})).status,400);
  assert.equal((await f.call('100001','/rooms',{...values,allowSpectators:'true'})).status,400);
  let room=await f.create('100001',{hostRole:'spectator',allowSpectators:false},{edition:'ng'});
  assert.equal(room.isHost,true);assert.equal(room.me,null);
  assert.equal((await f.call('200002',`/rooms/${room.code}/watch`,{},{edition:'ng'})).status,403);
  room=(await f.call('100001',`/rooms/${room.code}/watch-settings`,{version:room.version,allowSpectators:true},{edition:'ng'})).body.room;
  assert.equal((await f.call('200002',`/rooms/${room.code}/watch`,{},{edition:'ng'})).body.room.isHost,false);
});

test('the waiting host changes map and capacity, keeps existing players, resets readiness and admits more people', async t => {
  const f=await fixture(t);let room=await f.create();room=(await f.joinRoom(room)).body.room;
  for(const id of ['100001','200002'])room=(await f.command(id,room,'ready',{ready:true})).body.room;
  const identities=room.seats.map(s=>({id:s.id,name:s.name,band:s.band}));
  room=(await f.command('100001',room,'room-settings',{title:'新地图',map:'medium',capacity:4,turnSeconds:180})).body.room;
  assert.equal(room.map,'medium');assert.equal(room.capacity,4);assert.equal(room.turnSeconds,180);
  assert.equal(room.game,null);assert.deepEqual(room.seats.map(s=>({id:s.id,name:s.name,band:s.band})),identities);
  assert.ok(room.seats.every(s=>!s.ready));
  room=(await f.joinRoom(room,'300003')).body.room;assert.equal(room.seats.length,3);
  assert.equal((await f.command('200002',room,'room-settings',{capacity:4})).status,403);
  assert.equal((await f.command('100001',room,'room-settings',{capacity:2})).body.error,'capacity-too-small');
  assert.equal((await f.command('100001',room,'room-settings',{map:'missing'})).status,400);
  room=await f.start(room,['100001','200002','300003']);
  assert.equal(Object.keys(room.game.tiles).length,169);assert.equal(room.game.players.length,4);
  assert.equal((await f.command('100001',room,'room-settings',{capacity:3})).status,409);
});

test('dissolving a waiting room closes human and assistant SSE, invalidates all issuers and frees their room slots', {timeout:10000}, async t => {
  const f=await fixture(t);let room=await f.create();
  room=(await f.joinRoom(room)).body.room;
  const helper=await inviteAgent(f,room,'小雪');await helper.call(`/rooms/${room.code}/watch`,{});
  const pending=(await f.call('200002','/agent-grants',{code:room.code,name:'另一人的助手'})).body.grant;
  const controllers=[],readers=[];
  for(const [id,cookie] of [['200002',`mb_session=${tokenFor('200002')}`],[helper.id,helper.cookie]]) {
    const controller=new AbortController();controllers.push(controller);
    const response=await fetch(`${f.base}/rooms/${room.code}/events?account=${encodeURIComponent(id)}`,{
      signal:controller.signal,headers:{cookie,'x-mb-edition':'sfw',origin},
    });
    assert.equal(response.status,200);const reader=response.body.getReader();readers.push(reader);await reader.read();
  }
  assert.equal((await f.command('200002',room,'dissolve')).status,403);
  const requestId=randomUUID();
  const ended=await f.call('100001',`/rooms/${room.code}/dissolve`,{version:-99,requestId});
  assert.equal(ended.status,200);assert.equal(ended.body.closed,true);assert.equal(ended.body.room,null);
  for(const reader of readers) {
    let text='';while(!text.includes('event: closed'))text+=new TextDecoder().decode((await reader.read()).value);
    assert.match(text,/dissolved/);
  }
  for(let i=0;i<readers.length;i++){controllers[i].abort();await readers[i].cancel().catch(()=>{});}
  assert.equal((await f.call('100001',`/rooms/${room.code}`)).status,410);
  assert.equal((await f.call('200002',`/rooms/${room.code}/join`,{band:'mygo'})).status,410);
  assert.equal((await helper.call('/boot')).status,401);
  const oldToken=new URL(pending.url).hash.slice(5);
  assert.equal((await f.call('100001','/agent/redeem',{token:oldToken},{headers:{cookie:''}})).status,403);
  assert.equal((await f.call('100001',`/rooms/${room.code}/dissolve`,{requestId})).body.duplicate,true);
  for(const id of ['100001','200002'])assert.equal((await f.call(id,'/boot')).body.activeRoom,null);
  assert.equal((await f.call('100001','/agent-grants')).body.grants.length,0);
  assert.equal((await f.call('200002','/agent-grants')).body.grants.length,0);
  assert.notEqual((await f.create()).code,room.code);
});

test('a spectator host can dissolve a playing room and AI never advances its preserved final snapshot', async t => {
  const f=await fixture(t);let room=await f.create('100001',{hostRole:'spectator'});
  room=(await f.command('100001',room,'start')).body.room;
  const world=structuredClone(room.game);
  assert.equal((await f.command('100001',room,'dissolve')).status,200);
  f.time(30000);f.tick();f.tick();
  const stored=JSON.parse(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(room.code).data);
  assert.equal(stored.closed,true);assert.equal(stored.status,'finished');assert.equal(stored.deadline,null);
  assert.deepEqual(stored.game,world);assert.equal(stored.hostAccount,null);
});

test('leaving an old room invalidates unused links so the new room is never blocked by them', async t => {
  const f=await fixture(t);let old=await f.create('100001',{capacity:4});
  old=(await f.joinRoom(old)).body.room;
  const links=[];
  for(let i=0;i<3;i++)links.push((await f.call('100001','/agent-grants',{code:old.code,name:`Old ${i}`})).body.grant);
  await f.command('100001',old,'leave');
  assert.equal((await f.call('100001',`/rooms/${old.code}`)).status,403);
  assert.equal((await f.call('100001','/agent-grants')).body.grants.length,0);
  const fresh=await f.create();
  for(let i=0;i<3;i++)assert.equal((await f.call('100001','/agent-grants',{code:fresh.code,name:`New ${i}`})).status,201);
  assert.equal((await f.call('100001','/agent-grants',{code:fresh.code,name:'Fourth'})).body.error,'agent-limit');
  for(const grant of links) {
    assert.equal((await f.call('100001','/agent/invite-info',{token:new URL(grant.url).hash.slice(5)},{headers:{cookie:''}})).status,403);
  }
});

test('my invitations span every room and remain revocable after losing room access, including from NG', async t => {
  const f=await fixture(t);let old=await f.create('100001',{capacity:3,title:'旧房间'});
  const helper=await inviteAgent(f,old,'旧角色');
  old=(await helper.call(`/rooms/${old.code}/join`,{band:'mygo'})).body.room;
  old=(await f.joinRoom(old,'200002')).body.room;
  await f.command('100001',old,'leave');
  assert.equal((await f.call('100001',`/rooms/${old.code}`)).status,403);
  assert.equal((await helper.call('/boot')).status,200);
  const fresh=await f.create('100001',{title:'新房间'});
  for(let i=0;i<3;i++)assert.equal((await f.call('100001','/agent-grants',{code:fresh.code,name:`角色${i}`})).status,201);
  const all=(await f.call('100001','/agent-grants')).body.grants;
  assert.equal(all.length,4);assert.ok(all.some(g=>g.code===old.code&&g.roomTitle==='旧房间'&&g.used));
  assert.equal((await f.call('100001',`/agent-grants?room=${old.code}`)).body.grants.length,1);
  assert.equal((await f.call('100001','/agent-grants',undefined,{edition:'ng'})).body.grants.length,4);
  assert.equal((await f.call('100001',`/agent-grants/${helper.grant.id}/revoke`,{},{edition:'ng'})).status,200);
  assert.equal((await helper.call('/boot')).status,401);
  assert.equal((await f.call('100001',`/rooms/${fresh.code}`)).body.room.title,'新房间');
});

test('finished rooms do not consume new-room invitation capacity while an assistant may still read the result', async t => {
  const f=await fixture(t);let room=await f.create();
  const helper=await inviteAgent(f,room);
  room=(await helper.call(`/rooms/${room.code}/join`,{band:'mygo'})).body.room;
  room=(await f.command('100001',room,'ready',{ready:true})).body.room;
  room=(await helper.call(`/rooms/${room.code}/ready`,{version:room.version,ready:true})).body.room;
  room=(await f.command('100001',room,'start')).body.room;
  room=(await f.command('100001',room,'action',{action:{type:'surrender'}})).body.room;
  assert.equal(room.status,'finished');
  assert.equal((await helper.call(`/rooms/${room.code}`)).status,200);
  const old=(await f.call('100001','/agent-grants')).body.grants[0];assert.equal(old.quota,false);
  const fresh=await f.create();
  for(let i=0;i<3;i++)assert.equal((await f.call('100001','/agent-grants',{code:fresh.code,name:`Next ${i}`})).status,201);
});

test('regenerating one unused invitation replaces just that link, preserves quota and cannot kick a claimed assistant', async t => {
  const f=await fixture(t),room=await f.create();
  const grants=[];
  for(let i=0;i<3;i++)grants.push((await f.call('100001','/agent-grants',{code:room.code,name:`角色${i}`})).body.grant);
  const replaced=await f.call('100001','/agent-grants',{code:room.code,name:'小雪',replaceId:grants[0].id});
  assert.equal(replaced.status,201);const current=replaced.body.grant;
  assert.notEqual(current.id,grants[0].id);assert.equal(current.ref.length,8);
  assert.equal((await f.call('100001','/agent-grants')).body.grants.length,3);
  assert.equal((await f.call('100001','/agent/redeem',{token:new URL(grants[0].url).hash.slice(5)},{headers:{cookie:''}})).status,403);
  const info=await f.call('100001','/agent/invite-info',{token:new URL(grants[1].url).hash.slice(5)},{headers:{cookie:''}});
  assert.equal(info.status,200);assert.equal(info.body.invitation.name,'角色1');
  const redeemed=await f.call('100001','/agent/redeem',{token:new URL(current.url).hash.slice(5),name:'雪雪'},{headers:{cookie:''}});
  assert.equal(redeemed.status,200);
  assert.equal((await f.call('100001','/agent-grants',{code:room.code,name:'Again',replaceId:current.id})).body.error,'agent-replace-used');
  const active=await f.call(`dot:${current.id}`,'/boot',undefined,{headers:{cookie:redeemed.cookie}});
  assert.equal(active.status,200);assert.equal(active.body.user.name,'雪雪');
});

test('revoke-all only affects its issuer across all rooms and does not require membership or hosting', async t => {
  const f=await fixture(t);let old=await f.create('100001',{capacity:3});
  const helper=await inviteAgent(f,old);
  old=(await helper.call(`/rooms/${old.code}/join`,{band:'mygo'})).body.room;
  old=(await f.joinRoom(old,'200002')).body.room;
  await f.command('100001',old,'leave');
  const other=(await f.call('200002','/agent-grants',{code:old.code,name:'Other owner'})).body.grant;
  const next=await f.create();await f.call('100001','/agent-grants',{code:next.code,name:'Next'});
  assert.equal((await f.call('100001','/agent-grants/revoke-all',{})).status,200);
  assert.equal((await helper.call('/boot')).status,401);
  assert.equal((await f.call('100001','/agent-grants')).body.grants.length,0);
  assert.ok((await f.call('200002','/agent-grants')).body.grants.some(g=>g.id===other.id));
});

test('a recipient sees the stable invite identity and can rename themselves without changing characters, resources or authority', async t => {
  const f=await fixture(t);let room=await f.create();
  const created=(await f.call('100001','/agent-grants',{code:room.code,name:'受邀小雪'})).body.grant;
  const token=new URL(created.url).hash.slice(5);
  const preview=await f.call('100001','/agent/invite-info',{token},{headers:{cookie:''}});
  assert.equal(preview.status,200);assert.equal(preview.body.invitation.name,'受邀小雪');
  assert.equal(preview.body.invitation.ref,created.ref);assert.equal('owner_id' in preview.body.invitation,false);
  const redeemed=await f.call('100001','/agent/redeem',{token,name:'小雪本人'},{headers:{cookie:''}});
  const id=`dot:${created.id}`,call=(path,body)=>f.call(id,path,body,{headers:{cookie:redeemed.cookie}});
  room=(await call(`/rooms/${room.code}/join`,{band:'mygo'})).body.room;
  room=(await f.command('100001',room,'ready',{ready:true})).body.room;
  room=(await call(`/rooms/${room.code}/ready`,{version:room.version,ready:true})).body.room;
  room=(await f.command('100001',room,'start')).body.room;
  await call(`/rooms/${room.code}/chat`,{text:'改名前的消息'});
  const before=structuredClone(room.game);
  const profile=await call('/agent/profile',{name:'小雪新名字',grantId:'other-account'});
  assert.equal(profile.status,200);assert.equal(profile.body.user.id,id);assert.equal(profile.body.user.ref,created.ref);
  const after=profile.body.room;
  assert.equal(after.seats.find(s=>s.id==='p2').name,'小雪新名字');
  before.players.find(p=>p.id==='p2').name='小雪新名字';assert.deepEqual(after.game,before);
  assert.equal(after.chat.at(-1).name,'小雪本人');
  assert.equal((await f.call('100001','/agent/profile',{name:'Human'})).status,403);
  assert.equal((await call('/agent/profile',{name:''})).status,400);
  const listed=(await f.call('100001','/agent-grants')).body.grants[0];
  assert.equal(listed.issuedName,'受邀小雪');assert.equal(listed.name,'小雪新名字');assert.equal(listed.ref,created.ref);
  f.restart();assert.equal((await call('/boot')).body.user.name,'小雪新名字');
});

test('the creator can close both abandoned assistant-hosted rooms from the lobby while keeping a new room', async t => {
  const f=await fixture(t),abandoned=[];
  for(let index=0;index<2;index++) {
    let room=await f.create('100001',{hostRole:'spectator',password:'not-needed-to-close'});
    const helper=await inviteAgent(f,room,`Helper ${index}`);
    room=(await helper.call(`/rooms/${room.code}/join`,{band:'mygo'})).body.room;
    await f.command('100001',room,'leave');
    assert.equal((await f.call('100001',`/rooms/${room.code}`)).status,403);
    const helperRoom=(await helper.call(`/rooms/${room.code}`)).body.room;
    assert.equal(helperRoom.isHost,true);assert.equal(helperRoom.createdByMe,false);
    assert.equal((await f.call('100001','/boot')).body.activeRoom,null);
    abandoned.push({room,helper});
  }
  const current=await f.create();
  f.restart();
  const list=(await f.call('100001','/rooms')).body.rooms;
  for(const {room,helper} of abandoned) {
    const row=list.find(r=>r.code===room.code);
    assert.equal(row.createdByMe,true);assert.equal(row.canDissolve,true);assert.equal(row.isHost,false);
    assert.equal('creatorAccount' in row,false);
    const stranger=(await f.call('200002','/rooms')).body.rooms.find(r=>r.code===room.code);
    assert.equal(stranger.canDissolve,false);
    assert.equal((await f.call('200002',`/rooms/${room.code}/dissolve`,{creatorAccount:'200002',createdByMe:true})).status,403);
    const ended=await f.call('100001',`/rooms/${room.code}/dissolve`,{});
    assert.equal(ended.status,200);assert.equal(ended.body.closed,true);
    assert.equal((await helper.call('/boot')).status,401);
    assert.equal((await f.call('100001',`/rooms/${room.code}/join`,{band:'mygo'})).status,410);
    assert.equal((await f.call('100001','/boot')).body.activeRoom.code,current.code);
  }
});

test('a former creator only keeps closure authority after management transfers to another human', async t => {
  const f=await fixture(t);let room=await f.create('100001',{password:'private'});
  room=(await f.joinRoom(room,'200002',{password:'private'})).body.room;
  await f.command('100001',room,'leave');
  const current=(await f.call('200002',`/rooms/${room.code}`)).body.room;
  assert.equal(current.isHost,true);assert.equal(current.createdByMe,false);assert.equal(current.canDissolve,true);
  assert.equal((await f.call('100001',`/rooms/${room.code}`)).status,403);
  for(const operation of ['room-settings','start','kick','chat','watch-settings'])
    assert.equal((await f.call('100001',`/rooms/${room.code}/${operation}`,{version:current.version,allowSpectators:false})).status,403);
  assert.equal((await f.call('100001',`/rooms/${room.code}/watch`,{password:'wrong'})).status,403);
  assert.equal((await f.call('100001',`/rooms/${room.code}/dissolve`,{})).status,200);
});

test('a timed-out host keeps room management while their unchanged country is controlled by AI', async t => {
  const f=await fixture(t);let room=await f.create();
  room=(await f.joinRoom(room)).body.room;room=await f.start(room);
  const stored=JSON.parse(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(room.code).data);
  stored.game.turnId=stored.hostId;
  f.app().db.prepare('UPDATE mp_rooms SET data=? WHERE code=?').run(JSON.stringify(stored),room.code);
  const world=structuredClone(stored.game);
  f.time(121000);f.tick();
  room=(await f.call('100001',`/rooms/${room.code}`)).body.room;
  assert.equal(room.seats.find(s=>s.id===room.me).control,'ai');
  assert.equal(room.isHost,true);assert.equal(room.canDissolve,true);assert.deepEqual(room.game,world);
  assert.equal((await f.call('200002',`/rooms/${room.code}`)).body.room.isHost,false);
  assert.equal((await f.command('100001',room,'dissolve')).status,200);
});

test('an offline host keeps ownership across restart and can still explicitly hand management to another human', async t => {
  const f=await fixture(t);let room=await f.create();
  room=(await f.joinRoom(room)).body.room;room=await f.start(room);
  const saved=JSON.parse(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(room.code).data);
  saved.seats.find(s=>s.id===saved.hostId).connectionSeen=true;
  f.app().db.prepare('UPDATE mp_rooms SET data=? WHERE code=?').run(JSON.stringify(saved),room.code);
  f.time(46000);f.tick();
  room=(await f.call('100001',`/rooms/${room.code}`)).body.room;
  assert.equal(room.seats.find(s=>s.id===room.me).aiReason,'offline');assert.equal(room.isHost,true);
  const legacy=JSON.parse(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(room.code).data);
  Object.assign(legacy,{hostAccount:null,hostId:null,hostName:'AI代管',hostRole:'player'});
  f.app().db.prepare('UPDATE mp_rooms SET data=? WHERE code=?').run(JSON.stringify(legacy),room.code);
  f.restart();room=(await f.call('100001',`/rooms/${room.code}`)).body.room;assert.equal(room.isHost,true);
  await f.command('100001',room,'leave');
  const next=(await f.call('200002',`/rooms/${room.code}`)).body.room;
  assert.equal(next.isHost,true);
  const original=(await f.call('100001','/rooms')).body.rooms.find(r=>r.code===room.code);
  assert.equal(original.isHost,false);assert.equal(original.canDissolve,true);
});

test('legacy creator recovery requires the original creation-time command and never guesses from names or later joins', async t => {
  const f=await fixture(t);let room=await f.create('100001',{password:'private'});
  f.time(2000);room=(await f.joinRoom(room,'200002',{password:'private'})).body.room;
  await f.command('100001',room,'leave');
  let saved=JSON.parse(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(room.code).data);
  delete saved.creatorAccount;
  f.app().db.prepare('UPDATE mp_rooms SET data=? WHERE code=?').run(JSON.stringify(saved),room.code);
  f.restart();
  assert.equal((await f.call('100001','/rooms')).body.rooms.find(r=>r.code===room.code).canDissolve,true);
  saved=JSON.parse(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(room.code).data);
  assert.equal(saved.creatorAccount,'100001');
  delete saved.creatorAccount;
  f.app().db.prepare('DELETE FROM mp_commands WHERE code=? AND account_id=?').run(room.code,'100001');
  f.app().db.prepare('UPDATE mp_rooms SET data=? WHERE code=?').run(JSON.stringify(saved),room.code);
  f.restart();
  saved=JSON.parse(f.app().db.prepare('SELECT data FROM mp_rooms WHERE code=?').get(room.code).data);
  assert.equal(saved.creatorAccount,null);
  assert.equal((await f.call('100001','/rooms')).body.rooms.find(r=>r.code===room.code).canDissolve,false);
  assert.equal((await f.call('300003',`/rooms/${room.code}/dissolve`,{creatorAccount:'300003'})).status,403);
});

test('explicitly leaving a closed-watch room is not reported as being evicted by its watch settings', {timeout:10000}, async t => {
  const f=await fixture(t);let room=await f.create('100001',{hostRole:'spectator',allowSpectators:false});
  room=(await f.joinRoom(room)).body.room;
  const controller=new AbortController();t.after(()=>controller.abort());
  const response=await fetch(`${f.base}/rooms/${room.code}/events?account=100001`,{
    headers:{cookie:`mb_session=${tokenFor('100001')}`,'x-mb-edition':'sfw',origin},signal:controller.signal,
  });
  const reader=response.body.getReader();await reader.read();
  await f.command('100001',room,'leave');
  let text='';while(!text.includes('event: removed'))text+=new TextDecoder().decode((await reader.read()).value);
  assert.match(text,/"reason":null/);assert.doesNotMatch(text,/spectating-disabled/);
  await reader.cancel();controller.abort();
});

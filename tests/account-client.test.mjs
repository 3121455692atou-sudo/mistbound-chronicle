// dist/account.mjs: who is logged in, and how this browser's save and the cloud copy are reconciled.
import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchAccount, avatarUrl, planSync, sameStamp, syncMarker, createCloudSync, cloudMeta, loginHref } from '../dist/account.mjs';

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const stamp = (turn, revision, seed = 'dawn') => ({ seed, playerId: 'lord', turn, revision });

test('the login button is offered only when the account service answers with JSON', async () => {
  assert.deepEqual(await fetchAccount(async () => json(200, { login: true, user: null })), { login: true, user: null, ng: null });
  // A static host answers /account/me with the game page or a 404: no button, no user.
  assert.deepEqual(await fetchAccount(async () => new Response('<!doctype html>', { status: 200, headers: { 'content-type': 'text/html' } })), { login: false, user: null, ng: null });
  assert.deepEqual(await fetchAccount(async () => new Response('', { status: 404 })), { login: false, user: null, ng: null });
  assert.deepEqual(await fetchAccount(async () => { throw new TypeError('offline'); }), { login: false, user: null, ng: null });
  const signed = await fetchAccount(async () => json(200, { login: true, user: { id: '123456789012345678', name: '<b>x</b>', avatar: 'javascript:alert(1)' }, ng: 'https://ng.mistbound.galbands.com/' }));
  assert.deepEqual(signed, { login: true, user: { id: '123456789012345678', name: '<b>x</b>', avatar: null }, ng: 'https://ng.mistbound.galbands.com/' });
  assert.equal((await fetchAccount(async () => json(200, { login: true, user: { id: 'not-a-snowflake' } }))).user, null);
  assert.equal(loginHref(), '/account/login?to=ng');
});

test('avatars come from the Discord CDN only, with the default avatar as fallback', () => {
  assert.equal(avatarUrl({ id: '123456789012345678', avatar: 'a'.repeat(32) }), `https://cdn.discordapp.com/avatars/123456789012345678/${'a'.repeat(32)}.png?size=64`);
  assert.match(avatarUrl({ id: '123456789012345678', avatar: null }), /^https:\/\/cdn\.discordapp\.com\/embed\/avatars\/[0-5]\.png$/);
  assert.equal(avatarUrl({ id: '../../x' }), '');
});

test('sync plan: three-way against what this browser last agreed with the cloud', () => {
  const cloud = (turn, revision, updatedAt = 100, seed) => ({ updatedAt, meta: stamp(turn, revision, seed) });
  assert.equal(planSync(null, null), 'same');
  assert.equal(planSync(null, stamp(1, 0)), 'push', 'first upload binds this browser game to the account');
  assert.equal(planSync(cloud(3, 9), null), 'pull', 'a fresh browser takes the cloud game');
  const marker = { updatedAt: 100, stamp: stamp(3, 9) };
  assert.equal(planSync(cloud(3, 9), stamp(3, 9), marker), 'same');
  assert.equal(planSync(cloud(3, 9), stamp(4, 12), marker), 'push', 'only this browser moved on');
  assert.equal(planSync(cloud(5, 20, 200), stamp(3, 9), marker), 'pull', 'only the cloud moved on');
  // Even an undo here (lower revision) is pushed when the cloud did not move: the marker, not the numbers, decides.
  assert.equal(planSync(cloud(3, 9), stamp(3, 8), marker), 'push');
  // Both moved, or first contact: progress decides inside one world, the player decides across worlds.
  assert.equal(planSync(cloud(5, 20, 200), stamp(4, 12), marker), 'pull');
  assert.equal(planSync(cloud(5, 20, 200), stamp(6, 3), marker), 'push');
  assert.equal(planSync(cloud(5, 20), stamp(5, 20)), 'same');
  assert.equal(planSync(cloud(5, 20, 200, 'other'), stamp(4, 12), marker), 'ask');
  assert.ok(sameStamp(cloudMeta({ seed: 'dawn', playerId: 'lord', turn: 3, revision: 9 }), stamp(3, 9)));
});

test('the sync marker is per account and survives broken storage', () => {
  const store = new Map();
  const storage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) };
  const a = syncMarker(storage, '1'), b = syncMarker(storage, '2');
  a.write(5, stamp(1, 1));
  assert.deepEqual(a.read(), { updatedAt: 5, stamp: stamp(1, 1) });
  assert.equal(b.read(), null);
  const broken = syncMarker({ getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } }, '1');
  assert.equal(broken.read(), null);
  assert.doesNotThrow(() => broken.write(1, stamp(1, 1)));
  assert.equal(syncMarker(null, '1').read(), null);
});

test('uploads are debounced, name the version they replace, and stop at a conflict', async () => {
  const calls = [];
  let current = 100;
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, init });
    if (init.method === 'PUT') {
      const body = JSON.parse(init.body);
      if (body.base !== current) return json(409, { error: 'conflict', current: { updatedAt: current, meta: stamp(9, 99, 'other') } });
      current += 1;
      return json(200, { ok: true, updatedAt: current });
    }
    return json(404, {});
  };
  const saved = [], statuses = [];
  const sync = createCloudSync({ fetchImpl, delay: 20, onSaved: (at, meta) => saved.push([at, meta.turn]), onChange: s => statuses.push(s.status) });
  sync.settle(100);
  let turn = 1;
  const payload = () => ({ data: JSON.stringify({ turn }), meta: stamp(turn, turn) });
  sync.schedule(payload); turn = 2; sync.schedule(payload); turn = 3; sync.schedule(payload);
  await new Promise(resolve => setTimeout(resolve, 60));
  const puts = calls.filter(call => call.init.method === 'PUT');
  assert.equal(puts.length, 1, 'three saves in a row make one upload');
  assert.deepEqual(JSON.parse(puts[0].init.body), { data: '{"turn":3}', meta: stamp(3, 3), base: 100 });
  assert.equal(puts[0].url, '/account/saves/sfw/auto');
  assert.deepEqual(saved, [[101, 3]]);
  assert.equal(sync.sync.status, 'synced');

  current = 500; // another device saved meanwhile
  turn = 4; sync.schedule(payload); await sync.flush();
  assert.equal(sync.sync.status, 'conflict');
  assert.equal(sync.sync.held, false);
  assert.deepEqual(sync.sync.conflict, { updatedAt: 500, meta: stamp(9, 99, 'other') });
  turn = 5; sync.schedule(payload); await sync.flush();
  assert.equal(calls.filter(call => call.init.method === 'PUT').length, 2, 'nothing more is sent until the player chooses');
  sync.settle(500); sync.schedule(payload); await sync.flush();
  assert.equal(sync.sync.status, 'synced');
  assert.deepEqual(saved.at(-1), [501, 5]);
  assert.ok(statuses.includes('pending') && statuses.includes('saving') && statuses.includes('conflict'));
});

test('a held sync waits for the player, and an unchanged game uploads nothing', async () => {
  const calls = [];
  const sync = createCloudSync({ fetchImpl: async (url, init = {}) => { calls.push(init.method); return json(200, { ok: true, updatedAt: 7 }); }, delay: 5 });
  sync.hold({ updatedAt: 3, meta: stamp(2, 2) });
  assert.equal(sync.sync.status, 'conflict');
  assert.equal(sync.sync.held, true);
  sync.schedule(() => ({ data: '{}', meta: {} })); await sync.flush();
  assert.deepEqual(calls, []);
  sync.settle(3);
  sync.schedule(() => null); await sync.flush();
  assert.deepEqual(calls, []);
  assert.equal(sync.sync.status, 'synced');
});

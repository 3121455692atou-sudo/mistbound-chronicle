import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createGame, perform, serializeGame, deserializeGame, getStats, getActions, getIncome,
  getWaterClaimQuote, getBridgeQuote, getBridgeTargets, getMarch, getMarchPlan, getTileStats, waterOwner,
  shipQuote, getShipVoyageQuote, TECHNOLOGIES,
} from '../dist/engine.mjs';
import { constructionFactor } from '../dist/campaign.mjs';
import { departureSelection, departureReason } from '../dist/ui-model.mjs';
import { easeTile } from '../dist/realm.mjs';
import { planRetreat } from '../dist/retreat.mjs';

const act = (s, action) => {
  const r = perform(s, action);
  assert.equal(r.ok, true, r.error);
  return r.state;
};
function channel(length = 2) {
  const s = createGame('bridge-channel');
  s.factions.lord.gold = 1000000; s.factions.lord.supply = 1000;
  // Keep every existing capital and character; create an isolated synthetic crossing north of them.
  const bank = s.tiles['1,0'];
  bank.troops = 8;
  for (const t of Object.values(s.tiles)) {
    t.field = t.field.filter(id => id !== 'nina');
    t.garrison = t.garrison.filter(id => id !== 'nina');
  }
  bank.field.push('nina');
  const water = [];
  const template = s.tiles['2,0'];
  for (let i = 0; i < length; i++) {
    const q = 2, r = i, key = `${q},${r}`;
    const old = s.tiles[key];
    assert.ok(!old?.ownerId);
    s.tiles[key] = { ...structuredClone(template), key, q, r, terrainId: 'ocean', ownerId: null,
      troops: 0, food: 0, field: [], garrison: [], building: null, buildingLevel: 0,
      isCapital: false, capitalOf: null, discovered: true };
    water.push(key);
  }
  const q = 3, r = length - 1, toKey = `${q},${r}`;
  assert.ok(!s.tiles[toKey]?.ownerId);
  s.tiles[toKey] = { ...structuredClone(template), key: toKey, q, r, terrainId: 'plains', ownerId: null,
    troops: 0, food: 0, field: [], garrison: [], building: null, buildingLevel: 0,
    isCapital: false, capitalOf: null, discovered: true };
  return { s, water, toKey, fromKey: bank.key };
}
const roundtrip = s => {
  const r = deserializeGame(serializeGame(s));
  assert.equal(r.ok, true, r.error);
  assert.equal(deserializeGame(serializeGame(r.state)).ok, true);
  return r.state;
};
function claimChannel(fixture) {
  let s = fixture.s;
  for (const key of fixture.water) { s.ap = s.maxAP; s = act(s, getWaterClaimQuote(s, key).action); }
  return { ...fixture, s };
}

test('water expansion preserves residents and income, and does not make bare water walkable', () => {
  const { s: before, water, fromKey } = channel();
  const oldStats = getStats(before), oldPeople = Object.values(before.tiles).reduce((n, t) => n + t.troops, 0);
  const quote = getWaterClaimQuote(before, water[0]);
  assert.equal(quote.enabled, true);
  assert.deepEqual(quote.cost, getActions(before, '2,-1').find(a => a.type === 'claim').cost);
  const s = act(before, quote.action);
  assert.equal(waterOwner(s, s.tiles[water[0]]), 'lord');
  assert.equal(s.tiles[water[0]].troops, 0);
  assert.equal(Object.values(s.tiles).reduce((n, t) => n + t.troops, 0), oldPeople);
  assert.deepEqual(getStats(s).administration, oldStats.administration);
  assert.deepEqual(getIncome(s, 'lord'), getIncome(before, 'lord'));
  assert.equal(getMarch(s, fromKey)[water[0]], undefined);
  assert.equal(s.factions.lord.gold, before.factions.lord.gold - quote.cost.gold);
  roundtrip(s);
});

test('a complete bridge connects an island army to a neutral shore through public actions', () => {
  let { s, water, fromKey, toKey } = claimChannel(channel());
  s.ap = s.maxAP;
  const q = getBridgeQuote(s, fromKey, toKey), before = structuredClone(s);
  assert.equal(q.enabled, true, q.reason);
  assert.equal(q.length, 2);
  assert.equal(q.cost.gold, Math.ceil(20 * 2 * constructionFactor(s, s.tiles[fromKey])));
  assert.ok(getBridgeTargets(s, fromKey).includes(toKey));
  s = act(s, q.action);
  assert.equal(before.factions.lord.gold - s.factions.lord.gold, q.cost.gold);
  assert.equal(before.ap - s.ap, q.cost.ap);
  assert.ok(water.every(k => s.tiles[k].bridgeId && s.tiles[k].troops === 0));
  assert.ok(getMarch(s, fromKey)[water.at(-1)] <= 3);
  s = act(s, { type: 'move', fromKey, toKey: water.at(-1), troops: 5, girls: ['nina'] });
  s = act(s, { type: 'claim', key: toKey, fromKey: water.at(-1) });
  assert.equal(s.tiles[toKey].ownerId, 'lord');
  assert.equal(s.tiles[toKey].troops, 2);
  s.tiles[water.at(-1)].marchedTurn = 0;
  const choice = departureSelection(s.tiles[water.at(-1)], s.tiles[toKey], {}, null, { girls: ['nina'] });
  assert.equal(choice.amount, 3);
  assert.equal(departureReason(s, s.tiles[water.at(-1)]), '');
  s = act(s, { type: 'move', fromKey: water.at(-1), toKey, troops: 3, girls: ['nina'] });
  assert.equal(s.tiles[water.at(-1)].troops, 0);
  assert.ok(s.tiles[toKey].field.includes('nina'));
  s = roundtrip(s);
  assert.ok(getMarchPlan(s, toKey, fromKey, { troops: 0, girls: ['nina'] }).path.includes(water[0]));
});

test('full bank-to-bank pricing doubles before existing construction multipliers; partial endpoints and repeats never charge', () => {
  const costs = [];
  for (const length of [2, 3, 4]) {
    let f = claimChannel(channel(length)), s = f.s; s.ap = s.maxAP;
    const q = getBridgeQuote(s, f.fromKey, f.toKey);
    assert.equal(q.length, length);
    assert.equal(q.cost.gold, Math.ceil(20 * 2 ** (length - 1) * constructionFactor(s, s.tiles[f.fromKey])));
    costs.push(q.pricing.lengthMultiplier);
    const unchanged = serializeGame(s);
    const partial = perform(s, { type: 'buildBridge', fromKey: f.fromKey, toKey: f.water[0] });
    assert.equal(partial.ok, false); assert.equal(serializeGame(s), unchanged);
    s = act(s, q.action);
    const paid = serializeGame(s), repeat = perform(s, { type: 'buildBridge', fromKey: f.fromKey, toKey: f.toKey });
    assert.equal(repeat.ok, false); assert.equal(serializeGame(s), paid);
    roundtrip(s);
  }
  assert.deepEqual(costs, [2, 4, 8]);
});

test('foreign, unclaimed, occupied and unaffordable water cannot be turned into a bridge', () => {
  let f = channel();
  assert.equal(getBridgeQuote(f.s, f.fromKey, f.toKey).enabled, false);
  f = claimChannel(f); let s = f.s; s.ap = s.maxAP;
  s.tiles[f.water[0]].waterOwnerId = 'mygo'; s.tiles[f.water[0]].ownerId = 'mygo';
  assert.equal(getBridgeQuote(s, f.fromKey, f.toKey).enabled, false);
  assert.equal(getWaterClaimQuote(s, f.water[0]).enabled, false);
  s.tiles[f.water[0]].waterOwnerId = 'lord'; s.tiles[f.water[0]].ownerId = 'lord';
  s.factions.lord.gold = 0;
  const before = serializeGame(s), r = perform(s, { type: 'buildBridge', fromKey: f.fromKey, toKey: f.toKey });
  assert.equal(r.ok, false); assert.equal(serializeGame(s), before);
});

test('ships retain independent ownership and restore existing water sovereignty when departing', () => {
  let f = claimChannel(channel()), s = f.s; s.ap = s.maxAP;
  s.campaign.research.lord.known = TECHNOLOGIES.map(t => t.id);
  s.tiles[f.fromKey].building = 'shipyard'; s.tiles[f.fromKey].buildingLevel = 1;
  const q = shipQuote(s, f.fromKey, 'cutter', f.water[0]);
  assert.equal(q.enabled, true, q.reason);
  s = act(s, q.action); const ship = Object.values(s.campaign.ships)[0];
  assert.equal(getBridgeQuote(s, f.fromKey, f.toKey).enabled, false);
  const voyage = getShipVoyageQuote(s, ship.id, f.water[1]); assert.equal(voyage.enabled, true);
  s = act(s, voyage.action);
  assert.equal(s.tiles[f.water[0]].ownerId, 'lord');
  assert.equal(s.tiles[f.water[0]].waterOwnerId, 'lord');
  assert.equal(s.tiles[f.water[0]].shipId, undefined);
  roundtrip(s);
});

test('bridge construction undo and corrupt bridge saves preserve the existing save boundary', () => {
  let f = claimChannel(channel()), s = f.s; s.ap = s.maxAP;
  const before = serializeGame(s), q = getBridgeQuote(s, f.fromKey, f.toKey);
  const built = act(s, q.action), undone = act(built, { type: 'undo' });
  assert.ok(f.water.every(k => !undone.tiles[k].bridgeId));
  assert.equal(undone.factions.lord.gold, s.factions.lord.gold);
  const bad = structuredClone(built); bad.campaign.bridges['bridge.1'].path.splice(1, 1);
  assert.equal(deserializeGame(serializeGame(bad)).ok, false);
  assert.equal(serializeGame(s), before);
});

test('water is never a refuge or overflow destination, and occupied bridges cannot become farms', () => {
  const fixture = claimChannel(channel()), { fromKey, toKey, water } = fixture;
  let s = fixture.s;
  for (const tile of Object.values(s.tiles).filter(t => t.ownerId === s.playerId && !t.waterOwnerId)) tile.troops = 100;
  easeTile(s, s.tiles[fromKey]);
  assert.ok(water.every(key => s.tiles[key].troops === 0));
  const retreat = planRetreat(s, fromKey, s.playerId, 10);
  assert.ok(retreat.placements.every(row => !water.includes(row.key)));
  assert.equal(retreat.demobilized, 10);
  s.ap = s.maxAP; s = act(s, getBridgeQuote(s, fromKey, toKey).action);
  s.tiles[water[0]].troops = 3;
  assert.equal(getTileStats(s, water[0]).gold, 0);
  assert.equal(getTileStats(s, water[0]).supply, 0);
  const before = serializeGame(s), farm = perform(s, { type: 'emergencyFarm', key: water[0] });
  assert.equal(farm.ok, false); assert.equal(serializeGame(s), before);
  roundtrip(s);
});

test('a built crossing survives ordinary turn settlement and bare water never develops residents', () => {
  const fixture = claimChannel(channel()), { fromKey, toKey, water } = fixture;
  let s = fixture.s;
  for (const faction of Object.values(s.factions)) faction.graceUntilTurn = 1000;
  const raw = Object.values(s.tiles).find(t => !t.ownerId && t.discovered && ['ocean', 'lake'].includes(t.terrainId));
  s.ap = s.maxAP; s = act(s, getBridgeQuote(s, fromKey, toKey).action);
  for (let i = 0; i < 3; i++) {
    s = act(s, { type: 'endTurn' });
    while (s.turnContinuation && !s.battle) s = act(s, { type: 'endTurn' });
    assert.equal(s.battle, null);
    for (const key of water) { assert.equal(s.tiles[key].troops, 0); assert.equal(s.tiles[key].food, 0); }
    if (raw) assert.equal(s.tiles[raw.key].troops, 0);
    roundtrip(s);
  }
});

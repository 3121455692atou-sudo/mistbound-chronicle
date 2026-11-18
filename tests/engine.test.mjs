import test from 'node:test';
import { war, warAll, seat, elite } from './helpers.mjs';
import assert from 'node:assert/strict';
import { createGame, perform, endTurn, getStats, previewAttack, getActions, getTileStats, validateMod, serializeGame, deserializeGame } from '../dist/engine.mjs';

const copy = state => JSON.parse(JSON.stringify(state));
const successful = result => { assert.equal(result.ok, true, result.error); return result.state; };
function settleBattles(state) {
  for (let encounters = 0; state.battle; encounters++) {
    assert.ok(encounters < 24, 'the pending world turn never finished its encounters');
    if (state.battle.phase !== 'result') state = successful(perform(state, { type: 'battleAuto' }));
    assert.equal(state.battle.phase, 'result');
    state = successful(perform(state, { type: 'finishBattle' }));
    assert.equal(state.status, 'playing');
  }
  return state;
}
const advance = state => settleBattles(successful(endTurn(state)));
const character = { id: 'test.rune', name: '露弥', stats: { attack: 2, defense: 2, scout: 1, economy: 1 } };

test('same seed recreates geography, different seeds change it, and all 18 terrains exist', () => {
  const a = createGame('atlas-a'), b = createGame('atlas-a'), c = createGame('atlas-b');
  assert.deepEqual(a, b);
  assert.equal(Object.keys(a.terrainTypes).length, 18);
  assert.notDeepEqual(Object.values(a.tiles).map(t => t.terrainId), Object.values(c.tiles).map(t => t.terrainId));
  assert.equal(Object.values(a.factions).length, 5);
});

test('a legal frontier claim spends one action and stated resources without changing its input', () => {
  const before = createGame('claim');
  const original = serializeGame(before);
  const result = perform(before, { type: 'claim', key: '1,1' });
  const after = successful(result);
  assert.equal(after.tiles['1,1'].ownerId, before.playerId);
  assert.equal(after.ap, 2);
  assert.equal(after.factions.lord.gold, before.factions.lord.gold - 4);
  assert.equal(after.factions.lord.supply, before.factions.lord.supply - 2);
  assert.equal(serializeGame(before), original);
  assert.equal(getActions(before, '1,1').find(a => a.type === 'claim').enabled, true);
});

test('illegal claims, stale revisions and arbitrary remote exploration are atomic failures', () => {
  const state = createGame('failure');
  const before = serializeGame(state);
  for (const action of [{ type: 'claim', key: '0,-3' }, { type: 'explore', q: 999, r: 999 }, { type: 'recruit', key: '0,0', expectedRevision: 99 }]) {
    const result = perform(state, action);
    assert.equal(result.ok, false);
    assert.equal(result.state, state);
    assert.equal(serializeGame(state), before);
  }
});

test('exploration grows from fog, undo restores budgets, and generated terrain never rerolls', () => {
  const before = createGame('explore');
  const first = successful(perform(before, { type: 'explore', key: '6,0' }));
  assert.ok(Object.keys(first.tiles).length > Object.keys(before.tiles).length);
  assert.ok(getStats(first).discoveredTiles > getStats(before).discoveredTiles);
  const undone = successful(perform(first, { type: 'undo' }));
  assert.equal(undone.ap, before.ap);
  assert.equal(undone.factions.lord.supply, before.factions.lord.supply);
  assert.equal(undone.tiles['6,0'].discovered, false);
  const again = successful(perform(undone, { type: 'explore', key: '6,0' }));
  for (const [key, tile] of Object.entries(first.tiles)) assert.equal(again.tiles[key].terrainId, tile.terrainId);
});

// Boundary fixtures below deliberately arrange local combat positions.
// Campaign longevity tests use unmodified createGame() states and real actions.
function battleFixture() {
  const state = createGame('battle');
  state.turn = 8; warAll(state);
  Object.assign(state.tiles['1,0'], { troops: 10 });
  Object.assign(state.tiles['2,0'], { ownerId: 'mujica', troops: 4, terrainId: 'plains' });
  return state;
}

test('AI attacks exposed player territory instead of only painting empty land', () => {
  const before = createGame('ai-war'); before.turn = 8; warAll(before);
  Object.assign(before.tiles['3,-1'], { ownerId: 'mujica', troops: 20, terrainId: 'plains' });
  Object.assign(before.tiles['2,-1'], { ownerId: 'lord', troops: 1, terrainId: 'plains' });
  const after = advance(before);
  assert.equal(after.tiles['2,-1'].ownerId, 'mujica');
  assert.ok(after.logs.some(event => event.type === 'war'));
  assert.equal(after.history.length, 0);
});

test('nations start neutral: war needs declaring, and an agreed peace stops attacks', () => {
  const quiet = battleFixture();
  delete quiet.relations['lord|mujica'];
  assert.equal(perform(quiet, { type: 'attack', fromKey: '1,0', toKey: '2,0' }).ok, false);
  assert.match(previewAttack(quiet, '1,0', '2,0').reason, /宣战/);
  const before = battleFixture();
  before.relations['lord|mujica'].favor = 40;
  const after = successful(perform(before, { type: 'propose', factionId: 'mujica', kind: 'peace' }));
  assert.equal(after.relations['lord|mujica'].status, 'truce');
  assert.equal(previewAttack(after, '1,0', '2,0').canAttack, false);
  const result = perform(after, { type: 'attack', fromKey: '1,0', toKey: '2,0' });
  assert.equal(result.ok, false);
  assert.equal(result.state, after);
});

test('Mod validation rejects bad references and dangerous IDs without partial application', () => {
  const before = createGame('mod-atomic');
  const original = serializeGame(before);
  const mod = { schemaVersion: 1, id: 'test.atomic', characters: [character], factions: [{ id: 'test.nation', name: '符文邦', color: '#336699', leaderId: 'missing' }] };
  assert.equal(validateMod(mod, before).ok, false);
  const failed = perform(before, { type: 'applyMod', mod });
  assert.equal(failed.ok, false);
  assert.equal(failed.state, before);
  assert.equal(serializeGame(before), original);
  for (const id of ['__proto__', 'constructor', 'prototype']) assert.equal(validateMod({ schemaVersion: 1, id, characters: [{ ...character, id }] }, before).ok, false);
});

test('a hot-loaded nation, character and terrain survive a portable save roundtrip', () => {
  const before = createGame('hotload');
  const mod = { schemaVersion: 1, id: 'test.rune-pack', characters: [character], terrains: [{ id: 'test.silver', name: '银原', color: '#aaaaaa', yield: { gold: 3, supply: 1 }, defense: 2, passable: true }], factions: [{ id: 'test.nation', name: '符文邦', color: '#336699', leaderId: character.id }], tiles: [{ q: 20, r: 20, terrainId: 'test.silver' }] };
  assert.equal(validateMod(mod, before).ok, true);
  const after = successful(perform(before, { type: 'applyMod', mod }));
  assert.equal(after.factions['test.nation'].graceUntilTurn, before.turn + 2);
  assert.equal(after.characters[character.id].name, '露弥');
  assert.equal(after.tiles['20,20'].terrainId, 'test.silver');
  for (const [key, tile] of Object.entries(before.tiles)) {
    assert.equal(after.tiles[key].terrainId, tile.terrainId);
    assert.equal(after.tiles[key].ownerId, tile.ownerId);
    assert.equal(after.tiles[key].troops, tile.troops);
  }
  const loaded = deserializeGame(serializeGame(after));
  assert.equal(loaded.ok, true, loaded.error);
  assert.deepEqual(loaded.state, after);
});

test('updating content requires an explicit replacement flag', () => {
  const before = createGame('replace');
  const updated = { ...before.characters.mana, stats: { attack: 7, defense: 2, scout: 0, economy: 0 } };
  const mod = { schemaVersion: 1, id: 'test.balance', characters: [updated] };
  assert.equal(validateMod(mod, before).ok, false);
  const after = successful(perform(before, { type: 'applyMod', mod: { ...mod, replaceExisting: true } }));
  assert.equal(after.characters.mana.stats.attack, 7);
});

test('terrain hot-replacement cannot invalidate occupied land or its portable save', () => {
  const before = createGame('replace-land');
  const original = serializeGame(before);
  const mod = { schemaVersion: 1, id: 'test.land', replaceExisting: true, terrains: [{ ...before.terrainTypes.plains, passable: false }] };
  assert.equal(validateMod(mod, before).ok, false);
  const failed = perform(before, { type: 'applyMod', mod });
  assert.equal(failed.ok, false);
  assert.equal(serializeGame(failed.state), original);
  assert.equal(deserializeGame(serializeGame(failed.state)).ok, true);
});

test('character replacement cannot inject engine or arbitrary stat fields', () => {
  const before = createGame('replace-safe');
  const mod = { schemaVersion: 1, id: 'test.inject', replaceExisting: true, characters: [{ ...before.characters.mana, isPlayer: true, injected: 'ignored', stats: { ...before.characters.mana.stats, infiniteArmy: true } }] };
  const after = successful(perform(before, { type: 'applyMod', mod }));
  assert.equal(Object.hasOwn(after.characters.mana, 'isPlayer'), false);
  assert.equal(Object.hasOwn(after.characters.mana, 'injected'), false);
  assert.equal(Object.hasOwn(after.characters.mana.stats, 'infiniteArmy'), false);
});

test('malformed saves cannot inject dangling references or inherited object properties', () => {
  const before = createGame('bad-save');
  const invalid = copy(before); invalid.activeHeroId = 'toString'; invalid.recruitedHeroIds.push('toString');
  assert.equal(deserializeGame(serializeGame(invalid)).ok, false);
  const broken = copy(before); broken.tiles['0,0'].terrainId = 'missing';
  assert.equal(deserializeGame(serializeGame(broken)).ok, false);
  assert.equal(deserializeGame('{broken').ok, false);
});

test('save and restore preserve the complete current-turn undo behavior', () => {
  const before = createGame('undo-save');
  const next = successful(perform(before, { type: 'recruit', key: '0,0' }));
  const loaded = deserializeGame(serializeGame(next));
  assert.equal(loaded.ok, true, loaded.error);
  const restored = successful(perform(loaded.state, { type: 'undo' }));
  assert.equal(restored.tiles['0,0'].troops, before.tiles['0,0'].troops);
  assert.equal(restored.ap, before.ap);
  assert.equal(restored.factions.lord.gold, before.factions.lord.gold);
});


// Explicit boundary fixture: one local AI assault is arranged to exercise the
// recovery rule. No long-campaign result is inferred from this fixture.
function capitalAssaultFixture(retainOtherLand) {
  let state = successful(perform(createGame('capital-recovery'), {
    type: 'applyMod',
    mod: { schemaVersion: 1, id: 'test.recovery-content', characters: [character] },
  }));
  state = copy(state);
  state.turn = 8; warAll(state);
  state.history = [];
  Object.assign(state.tiles['0,0'], { troops: 1, garrison: [], field: [] });
  Object.assign(state.tiles['1,0'], {
    ownerId: 'mujica', troops: 30, terrainId: 'plains', building: null, buildingLevel: 0,
  });
  Object.assign(state.tiles['0,1'], retainOtherLand
    ? { troops: 40, building: 'fort', buildingLevel: 1 }
    : { ownerId: null, troops: 0, building: null, buildingLevel: 0 });
  return state;
}

function assertGeographyRetained(before, after) {
  for (const [key, tile] of Object.entries(before.tiles)) {
    assert.ok(after.tiles[key], `existing tile disappeared: ${key}`);
    assert.equal(after.tiles[key].q, tile.q);
    assert.equal(after.tiles[key].r, tile.r);
    assert.equal(after.tiles[key].terrainId, tile.terrainId, `existing terrain rerolled: ${key}`);
    if (tile.discovered) assert.equal(after.tiles[key].discovered, true);
  }
}

test('capital-loss boundary: an actual AI conquest relocates the capital while the same world keeps running', () => {
  const before = capitalAssaultFixture(true);
  const oldCapitalKey = before.factions[before.playerId].capitalKey;
  const after = advance(before);
  assert.equal(after.status, 'playing');
  assert.equal(after.tiles[oldCapitalKey].ownerId, 'mujica');
  assert.equal(after.tiles[oldCapitalKey].isCapital, false);
  assert.equal(after.tiles[oldCapitalKey].formerCapitalOf, before.playerId);
  const capital = after.tiles[after.factions[before.playerId].capitalKey];
  assert.notEqual(capital.key, oldCapitalKey);
  assert.equal(capital.ownerId, before.playerId);
  assert.equal(capital.isCapital, true);
  assert.equal(after.factions[before.playerId].alive, true);
  assertGeographyRetained(before, after);
  assert.deepEqual(after.characters[character.id], before.characters[character.id]);
  assert.equal(after.seed, before.seed);
  assert.equal(deserializeGame(serializeGame(after)).ok, true);
  assert.equal(advance(after).status, 'playing');
});

test('total-loss boundary: an actual AI conquest triggers frontier rebuilding without erasing geography or Mods', () => {
  const before = capitalAssaultFixture(false);
  const oldCapitalKey = before.factions[before.playerId].capitalKey;
  const after = advance(before);
  assert.equal(after.status, 'playing');
  assert.equal(after.tiles[oldCapitalKey].ownerId, 'mujica');
  assert.equal(after.factions[before.playerId].alive, true);
  const newCapital = after.tiles[after.factions[before.playerId].capitalKey];
  assert.equal(newCapital.ownerId, before.playerId);
  assert.equal(newCapital.isCapital, true);
  assert.equal(before.tiles[newCapital.key], undefined, 'rebuilding overwrote an old map coordinate');
  assert.equal(Object.values(after.tiles).filter(tile => tile.ownerId === before.playerId).length, 3);
  assert.ok(getStats(after).progress.rebuilds > getStats(before).progress.rebuilds);
  assertGeographyRetained(before, after);
  assert.deepEqual(after.characters[character.id], before.characters[character.id]);
  assert.deepEqual(after.loadedMods, before.loadedMods);
  assert.equal(after.seed, before.seed);
  assert.equal(deserializeGame(serializeGame(after)).ok, true);
  assert.equal(advance(after).status, 'playing');
});

test('building upgrades are real paid actions, improve tile output and survive portable saves and undo', () => {
  let state = successful(perform(createGame('upgrade'), { type: 'build', key: '0,0', building: 'mine' }));
  let descriptor;
  for (let attempts = 0; attempts < 4; attempts++) {
    descriptor = getActions(state, '0,0').find(action => action.type === 'upgrade');
    assert.ok(descriptor, 'built land has no upgrade action');
    if (descriptor.enabled) break;
    state = advance(state);
  }
  assert.equal(descriptor.enabled, true, descriptor.reason);
  const before = state;
  const beforeYield = getTileStats(before, '0,0');
  const after = successful(perform(before, descriptor.action));
  assert.equal(after.tiles['0,0'].buildingLevel, before.tiles['0,0'].buildingLevel + 1);
  assert.ok(getTileStats(after, '0,0').gold > beforeYield.gold);
  assert.equal(after.ap, before.ap - descriptor.cost.ap);
  assert.equal(after.status, 'playing');
  const loaded = deserializeGame(serializeGame(after));
  assert.equal(loaded.ok, true, loaded.error);
  assert.equal(loaded.state.tiles['0,0'].buildingLevel, after.tiles['0,0'].buildingLevel);
  const undone = successful(perform(loaded.state, { type: 'undo' }));
  assert.equal(undone.tiles['0,0'].buildingLevel, before.tiles['0,0'].buildingLevel);
  assert.deepEqual(getTileStats(undone, '0,0'), beforeYield);
});

test('building-level boundary: a maximum-level structure rejects upgrades atomically', () => {
  const state = successful(perform(createGame('upgrade-cap'), { type: 'build', key: '0,0', building: 'farm' }));
  // Explicit boundary fixture; the ordinary paid upgrade is tested above.
  state.tiles['0,0'].buildingLevel = 5;
  const before = serializeGame(state);
  const descriptor = getActions(state, '0,0').find(action => action.type === 'upgrade');
  assert.ok(!descriptor || !descriptor.enabled);
  const result = perform(state, { type: 'upgrade', key: '0,0' });
  assert.equal(result.ok, false);
  assert.equal(serializeGame(result.state), before);
});

test('chapter boundaries: completing successive expansion plans pays rewards and creates another chapter', () => {
  let state = createGame('chapter-boundary');
  for (let cycle = 0; cycle < 2; cycle++) {
    const plan = getStats(state).progress.plans.find(item => item.id === 'expansion');
    assert.ok(plan && Number.isInteger(plan.target) && plan.target > 0);
    // Explicit near-threshold fixture. The final claim and its reward run through
    // perform; long-game tests separately observe natural chapter completion.
    state = copy(state);
    state.metrics.land = state.milestone.baseline.land + plan.target - 1;
    const target = Object.values(state.tiles).find(tile => tile.terrainId !== 'ruins' && getActions(state, tile.key).some(action => action.type === 'claim' && action.enabled));
    assert.ok(target);
    const descriptor = getActions(state, target.key).find(action => action.type === 'claim');
    const before = state;
    state = successful(perform(before, descriptor.action));
    assert.equal(state.status, 'playing');
    assert.equal(state.milestone.completed, before.milestone.completed + 1);
    assert.equal(state.milestone.level, before.milestone.level + 1);
    assert.equal(state.factions[state.playerId].gold, before.factions[before.playerId].gold - descriptor.cost.gold + plan.reward.gold);
    assert.equal(state.factions[state.playerId].supply, before.factions[before.playerId].supply - descriptor.cost.supply + plan.reward.supply);
    const nextPlans = getStats(state).progress.plans;
    assert.deepEqual(nextPlans.map(item => item.id), ['expansion', 'construction', 'prosperity', 'campaign']);
    assert.ok(nextPlans.every(item => item.target > 0 && item.current >= 0));
  }
  assert.equal(deserializeGame(serializeGame(state)).ok, true);
});

function legacyShape(state, status) {
  // A declared v1 compatibility fixture, intentionally lacking all new fields.
  const legacyKeys = new Set(['schemaVersion', 'seed', 'turn', 'ap', 'maxAP', 'playerId', 'activeHeroId', 'tiles', 'terrainTypes', 'characters', 'factions', 'recruitedHeroIds', 'capturedCapitalIds', 'status', 'victoryType', 'sandbox', 'logs', 'history', 'revision', 'eventSeq', 'truces', 'loadedMods']);
  const legacy = copy(state);
  for (const key of Object.keys(legacy)) if (!legacyKeys.has(key)) delete legacy[key];
  legacy.schemaVersion = 1;
  legacy.status = status;
  legacy.victoryType = status === 'won' ? 'prosperity' : null;
  legacy.sandbox = false;
  legacy.history = [];
  for (const tile of Object.values(legacy.tiles)) { delete tile.buildingLevel; delete tile.formerCapitalOf; }
  if (status === 'lost') {
    for (const tile of Object.values(legacy.tiles)) if (tile.ownerId === legacy.playerId) { tile.ownerId = null; tile.troops = 0; }
    const home = legacy.tiles[legacy.factions[legacy.playerId].capitalKey];
    home.ownerId = 'mujica'; home.troops = 4;
    legacy.factions[legacy.playerId].alive = false;
  }
  return legacy;
}

test('legacy won and lost saves migrate into a playable ongoing world while preserving old content', () => {
  let base = successful(perform(createGame('legacy-world'), { type: 'build', key: '0,0', building: 'farm' }));
  base = successful(perform(base, { type: 'applyMod', mod: { schemaVersion: 1, id: 'test.legacy-mod', characters: [character] } }));
  for (const status of ['won', 'lost']) {
    const before = legacyShape(base, status);
    const loaded = deserializeGame(serializeGame(before));
    assert.equal(loaded.ok, true, `${status}: ${loaded.error}`);
    const after = loaded.state;
    assert.equal(after.status, 'playing');
    assert.equal(after.seed, before.seed);
    assert.equal(after.factions[after.playerId].alive, true);
    assert.equal(after.tiles[after.factions[after.playerId].capitalKey].ownerId, after.playerId);
    assert.equal(after.tiles['0,0'].buildingLevel, 1);
    assert.deepEqual(after.characters[character.id], before.characters[character.id]);
    assert.deepEqual(after.loadedMods, before.loadedMods);
    assertGeographyRetained(before, after);
    assert.ok(getStats(after).progress.plans.length > 0);
    const next = advance(after);
    assert.equal(next.status, 'playing');
    assert.equal(deserializeGame(serializeGame(next)).ok, true);
  }
});

test('former military threshold: two actual capital captures in a declared battle fixture never end the world', () => {
  // Explicit combat-placement fixture, not a claim of a natural two-turn campaign.
  let state = createGame('old-military-threshold');
  state.turn = 8; warAll(state);
  Object.assign(state.tiles['3,-3'], { ownerId: state.playerId, troops: 40, terrainId: 'plains' });
  Object.assign(state.tiles['-3,0'], { ownerId: state.playerId, troops: 40, terrainId: 'plains' });
  for (const key of [state.factions.mujica.capitalKey, state.factions.mygo.capitalKey]) { state.tiles[key].garrison = []; state.tiles[key].field = []; delete state.tiles[key].elite; }
  const firstCapital = state.factions.mujica.capitalKey;
  const secondCapital = state.factions.mygo.capitalKey;
  state = settleBattles(successful(perform(state, { type: 'attack', fromKey: '3,-3', toKey: firstCapital })));
  state = settleBattles(successful(perform(state, { type: 'attack', fromKey: '-3,0', toKey: secondCapital })));
  assert.ok(state.capturedCapitalIds.includes('mujica') && state.capturedCapitalIds.includes('mygo'));
  assert.equal(state.status, 'playing');
  assert.equal(state.victoryType ?? null, null);
  assert.ok(getStats(state).progress.plans.length > 0);
  const next = advance(state);
  assert.equal(next.turn, state.turn + 1);
  assert.equal(next.status, 'playing');
  assert.equal(deserializeGame(serializeGame(next)).ok, true);
});

test('maintenance is visible in net income and an oversized army cannot make balances invalid or stop the clock', () => {
  const before = createGame('maintenance');
  const stats = getStats(before);
  assert.ok(stats.maintenance && stats.maintenance.gold >= 0 && stats.maintenance.supply >= 0);
  const after = advance(before);
  assert.equal(after.factions[before.playerId].gold, Math.max(0, before.factions[before.playerId].gold + stats.income.gold));
  assert.equal(after.factions[before.playerId].supply, Math.max(0, before.factions[before.playerId].supply + stats.income.supply));
  // Explicit insolvency boundary fixture; ordinary campaign upkeep is covered by
  // the real 100-turn playthrough.
  const overextended = copy(before);
  for (const tile of Object.values(overextended.tiles)) if (tile.ownerId === overextended.playerId) tile.troops = 100;
  overextended.factions[overextended.playerId].gold = 0;
  overextended.factions[overextended.playerId].supply = 0;
  const burden = getStats(overextended).maintenance;
  assert.ok(burden.gold > stats.maintenance.gold || burden.supply > stats.maintenance.supply);
  const tick = advance(overextended);
  assert.equal(tick.turn, overextended.turn + 1);
  assert.equal(tick.status, 'playing');
  assert.ok(tick.factions[tick.playerId].gold >= 0 && tick.factions[tick.playerId].supply >= 0);
  assert.equal(deserializeGame(serializeGame(tick)).ok, true);
});

test('loaded-map capacity boundary: AI, a periodic event and player rebuilding do not block turn advancement', () => {
  // Explicit capacity fixture: populate the loaded region to its documented
  // 8000-cell ceiling, then let a real AI attack trigger the recovery path.
  const state = capitalAssaultFixture(false);
  state.turn = 7;
  for (const faction of Object.values(state.factions)) faction.graceUntilTurn = 0;
  let count = Object.keys(state.tiles).length;
  for (let q = 100; count < 8000; q++) {
    for (let r = 100; r < 200 && count < 8000; r++) {
      const key = `${q},${r}`;
      if (state.tiles[key]) continue;
      state.tiles[key] = {
        key, q, r, terrainId: 'plains', ownerId: null, troops: 0, food: 0, garrison: [], field: [],
        building: null, buildingLevel: 0, isCapital: false, capitalOf: null,
        discovered: false, ruinClaimed: false,
      };
      count++;
    }
  }
  assert.equal(deserializeGame(serializeGame(state)).ok, true);
  const after = advance(state);
  assert.equal(after.turn, 8);
  assert.equal(after.status, 'playing');
  assert.equal(Object.keys(after.tiles).length, 8000);
  assert.equal(after.lastWorldEventTurn, 8);
  assert.ok(getStats(after).progress.rebuilds > getStats(state).progress.rebuilds);
  assert.equal(after.tiles[after.factions[after.playerId].capitalKey].ownerId, after.playerId);
  assertGeographyRetained(state, after);
  assert.equal(deserializeGame(serializeGame(after)).ok, true);
});

test('version 2 ongoing-world saves gain tactical roster fields without replacing their content', () => {
  let source = successful(perform(createGame('legacy-persistent-v2'), { type: 'build', key: '0,0', building: 'farm' }));
  source = successful(perform(source, { type: 'applyMod', mod: { schemaVersion: 1, id: 'test.v2-content', characters: [character] } }));
  const before = copy(source);
  // Explicit previous-format fixture, preserving all existing long-world data.
  for (const field of ['companionId', 'characterOwners', 'captives', 'battle', 'turnContinuation']) delete before[field];
  before.rulesVersion = 2; before.history = [];
  const loaded = deserializeGame(serializeGame(before));
  assert.equal(loaded.ok, true, loaded.error);
  const after = loaded.state;
  assert.equal(after.rulesVersion, 9); assert.equal(after.status, 'playing');
  assert.equal(after.activeHeroId, before.activeHeroId);
  assert.equal(after.companionId, 'nina');
  assert.equal(after.characterOwners.rupa, before.playerId);
  assert.equal(after.characterOwners[before.factions.mujica.leaderId], 'mujica');
  assert.deepEqual(after.captives, {}); assert.equal(after.battle, null);
  assert.deepEqual(after.characters[character.id], before.characters[character.id]);
  assert.deepEqual(after.metrics, before.metrics); assert.deepEqual(after.milestone, before.milestone);
  assertGeographyRetained(before, after);
  assert.equal(advance(after).turn, before.turn + 1);
  assert.equal(deserializeGame(serializeGame(after)).ok, true);
});

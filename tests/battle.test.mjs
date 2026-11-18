import test from 'node:test';
import { war, warAll, seat, elite } from './helpers.mjs';
import assert from 'node:assert/strict';
import { createGame, perform, getStats, getBattleOptions, getCaptiveActions, serializeGame, deserializeGame } from '../dist/engine.mjs';

const copy = value => JSON.parse(JSON.stringify(value));
const go = (state, action) => {
  const result = perform(state, action);
  assert.equal(result.ok, true, `${action.type}: ${result.error}`);
  assert.equal(result.state.status, 'playing');
  return result.state;
};
const friendly = state => state.battle.units.filter(unit => unit.side === state.battle.playerSide);
const hostile = state => state.battle.units.filter(unit => unit.side !== state.battle.playerSide);
function reject(state, action) {
  const before = serializeGame(state), result = perform(state, action);
  assert.equal(result.ok, false, `${action.type} unexpectedly succeeded`);
  assert.equal(serializeGame(state), before);
  assert.equal(serializeGame(result.state), before);
}
function settle(state, choice = 'battleAuto', encountered = []) {
  for (let count = 0; state.battle; count++) {
    assert.ok(count < 24, 'world continuation did not finish');
    encountered.push(state.battle.id);
    if (state.battle.phase !== 'result') state = go(state, { type: choice });
    state = go(state, { type: 'finishBattle' });
  }
  return state;
}

// Explicit local-army fixtures make win/loss and edge cases reproducible. Every
// battle, casualty, prisoner and world-turn result still uses public perform().
function join(state, id) {
  state = copy(state);
  state.characterOwners[id] = state.playerId; if (!state.recruitedHeroIds.includes(id)) state.recruitedHeroIds.push(id);
  return state;
}
function deployment(attackingTroops = 18, defendingTroops = 8, seed = 'tactical-fixture') {
  const state = join(createGame(seed), 'nyamu');
  state.companionId = 'nyamu';
  state.turn = 8;
  war(state); seat(state, '1,0', 'rupa', 'nyamu');
  state.history = [];
  state.factions[state.playerId].gold = 200;
  state.factions[state.playerId].supply = 200;
  Object.assign(state.tiles['1,0'], { troops: attackingTroops });
  Object.assign(state.tiles['2,0'], { ownerId: 'mujica', troops: defendingTroops, terrainId: 'plains', building: null, buildingLevel: 0 });
  seat(state, '2,0', 'sakiko', 'umiri', 'mutsumi');
  return state;
}
function enter(state = deployment()) {
  return go(state, { type: 'attack', fromKey: '1,0', toKey: '2,0' });
}
function positionFixture(state = enter()) {
  // Clearly declared tactical placement fixture, used for exact range/path edges.
  state = copy(state);
  for (const tile of state.battle.tiles) Object.assign(tile, { kind: 'plain', walkable: true, defense: 0 });
  friendly(state).forEach((unit, index) => Object.assign(unit, { x: 0, y: index, moved: false, acted: false }));
  hostile(state).forEach((unit, index) => Object.assign(unit, { x: 6, y: index, moved: false, acted: false }));
  return state;
}
function completedLoss(troops = 18, seats = ['rupa', 'nyamu', 'bocchi', 'uika', 'subaru', 'anon']) {
  let state = deployment(troops, 40, 'capture-loss');
  // Six girls fill every squad, so the eighth recruit stays home.
  for (const id of ['bocchi', 'uika', 'subaru', 'mana', 'anon', 'raana']) state = join(state, id);
  state.tiles['1,0'].garrison = []; state.tiles['1,0'].field = []; seat(state, '1,0', ...seats);
  state = enter(state);
  const participantIds = [...state.battle.participantIds.attacker];
  // Declared fixture: those named here fell on the field before the retreat.
  state = copy(state);
  for (const unit of state.battle.units.filter(item => item.characterId && item.side === 'attacker').slice(0, 2)) { unit.hp = 0; unit.soldiers = 0; }
  state = go(state, { type: 'battleRetreat' });
  const result = copy(state.battle.result);
  assert.equal(result.playerWon, false);
  state = go(state, { type: 'finishBattle' });
  return { state, result, participantIds };
}
function completedWin() {
  let state = enter(deployment(80, 2, 'capture-win'));
  const participantIds = [...state.battle.participantIds.defender];
  state = go(state, { type: 'battleAuto' });
  const result = copy(state.battle.result);
  assert.equal(result.playerWon, true);
  state = go(state, { type: 'finishBattle' });
  return { state, result, participantIds };
}


test('attacking opens a separate deterministic 11×8 board with the actual deployed characters', () => {
  const before = deployment(), snapshot = serializeGame(before);
  const state = enter(before), battle = state.battle;
  assert.equal(battle.width, 11); assert.equal(battle.height, 8); assert.equal(battle.tiles.length, 88);
  assert.equal(battle.phase, 'player'); assert.equal(battle.playerSide, 'attacker');
  assert.equal(state.tiles['2,0'].ownerId, 'mujica', 'territory changed before battlefield settlement');
  assert.equal(state.ap, before.ap - 1);
  assert.equal(serializeGame(before), snapshot);
  assert.deepEqual(battle, enter(before).battle);
  for (const side of ['attacker', 'defender']) {
    const units = battle.units.filter(unit => unit.side === side);
    const characters = units.map(unit => unit.characterId).filter(Boolean);
    assert.ok(units.length > 0 && units.length <= 6);
    assert.deepEqual([...battle.participantIds[side]].sort(), [...characters].sort());
    assert.ok(characters.length <= 6);
    assert.ok(units.every(unit => unit.characterId ? unit.rank === 'hero' : unit.kind === 'sazai'), 'squads without a girl must be Sazai');
  }
  assert.equal(new Set(battle.units.map(unit => `${unit.x},${unit.y}`)).size, battle.units.length);
  for (const unit of battle.units) assert.ok(battle.tiles.find(tile => tile.x === unit.x && tile.y === unit.y)?.walkable);
});

test('movement obeys reachable paths, solid barriers, occupied cells and one move per activation', () => {
  const state = positionFixture();
  const unit = friendly(state)[0], ally = friendly(state)[1];
  Object.assign(unit, { x: 1, y: 3, move: 6 });
  for (const tile of state.battle.tiles) if (tile.x === 3) Object.assign(tile, { kind: 'rock', walkable: false });
  const options = getBattleOptions(state, unit.id);
  assert.ok(options.moves.length > 0);
  assert.ok(options.moves.every(cell => cell.x < 3 && cell.cost <= unit.move));
  for (const destination of [{x:3,y:3}, {x:4,y:3}, {x:-1,y:3}, {x:ally.x,y:ally.y}]) {
    reject(state, { type: 'battleMove', unitId: unit.id, ...destination });
  }
  const target = options.moves.find(cell => cell.x !== unit.x || cell.y !== unit.y);
  const after = go(state, { type: 'battleMove', unitId: unit.id, x: target.x, y: target.y });
  const moved = after.battle.units.find(item => item.id === unit.id);
  assert.equal(moved.x, target.x); assert.equal(moved.y, target.y); assert.equal(moved.moved, true);
  assert.equal(getBattleOptions(after, unit.id).moves.length, 0);
  reject(after, { type: 'battleMove', unitId: unit.id, x: 1, y: 3 });
  reject(state, { type: 'battleMove', unitId: hostile(state)[0].id, x: 5, y: 0 });
});

test('attacks enforce range and allegiance and apply the displayed damage exactly once', () => {
  const state = positionFixture(), unit = friendly(state)[0], target = hostile(state)[0];
  Object.assign(unit, { x: 1, y: 3, range: 1 });
  Object.assign(target, { x: 4, y: 3 });
  assert.equal(getBattleOptions(state, unit.id).targets.some(item => item.targetId === target.id), false);
  reject(state, { type: 'battleAttack', unitId: unit.id, targetId: target.id });
  Object.assign(target, { x: 2, y: 3 });
  reject(state, { type: 'battleAttack', unitId: unit.id, targetId: friendly(state)[1].id });
  const preview = getBattleOptions(state, unit.id).targets.find(item => item.targetId === target.id);
  assert.ok(preview && preview.damage > 0);
  const after = go(state, { type: 'battleAttack', unitId: unit.id, targetId: target.id });
  assert.equal(after.battle.units.find(item => item.id === target.id).hp, Math.max(0, target.hp - preview.damage));
  assert.equal(after.battle.units.find(item => item.id === unit.id).acted, true);
  reject(after, { type: 'battleAttack', unitId: unit.id, targetId: target.id });
  assert.equal(getBattleOptions(after, unit.id).moves.length, 0, 'a unit moved again after attacking');
});

test('a ranged unit can attack beyond melee range while an invalid target remains atomic', () => {
  const state = positionFixture(), unit = friendly(state).find(item => item.kind === 'ranger');
  assert.ok(unit, 'the standard three-company army has no ranged company');
  const target = hostile(state)[0];
  Object.assign(unit, { x: 1, y: 3 }); Object.assign(target, { x: 1 + unit.range, y: 3 });
  assert.ok(unit.range > 1);
  const preview = getBattleOptions(state, unit.id).targets.find(item => item.targetId === target.id);
  assert.ok(preview);
  reject(state, { type: 'battleAttack', unitId: unit.id, targetId: 'missing-unit' });
  const after = go(state, { type: 'battleAttack', unitId: unit.id, targetId: target.id });
  assert.equal(after.battle.units.find(item => item.id === target.id).hp, Math.max(0, target.hp - preview.damage));
});

test('offensive skills use their preview, spend the action and cannot be repeated', () => {
  const state = positionFixture(enter(seat(join(deployment(), 'anon'), '1,0', 'anon'))), unit = friendly(state).find(item => item.kind === 'vanguard'), target = hostile(state)[0];
  assert.ok(unit);
  Object.assign(unit, { x: 1, y: 3 }); Object.assign(target, { x: 2, y: 3 });
  const options = getBattleOptions(state, unit.id), preview = options.skillTargets.find(item => item.targetId === target.id);
  assert.equal(options.canSkill, true); assert.ok(preview && preview.damage > 0);
  const after = go(state, { type: 'battleSkill', unitId: unit.id, targetId: target.id });
  const spent = after.battle.units.find(item => item.id === unit.id);
  assert.equal(spent.skillUsed, true); assert.equal(spent.acted, true);
  assert.equal(after.battle.units.find(item => item.id === target.id).hp, Math.max(0, target.hp - preview.damage));
  reject(after, { type: 'battleSkill', unitId: unit.id, targetId: target.id });
});

test('guard skill lasts once per battle while movement and action readiness reset after enemy AI', () => {
  let state = positionFixture(enter(join(deployment(50, 20), 'rupa'))), unit = friendly(state).find(item => item.kind === 'guard');
  assert.ok(unit); Object.assign(unit, { x: 0, y: 7 });
  const unitId = unit.id, round = state.battle.round;
  assert.equal(getBattleOptions(state, unitId).canSkill, true);
  state = go(state, { type: 'battleSkill', unitId });
  assert.equal(state.battle.units.find(item => item.id === unitId).skillUsed, true);
  const beforeAI = state;
  state = go(state, { type: 'battleEndTurn' });
  assert.equal(state.battle.phase, 'player'); assert.equal(state.battle.round, round + 1);
  const next = state.battle.units.find(item => item.id === unitId);
  assert.ok(next.hp > 0); assert.equal(next.skillUsed, true); assert.equal(next.acted, false); assert.equal(next.moved, false);
  assert.equal(getBattleOptions(state, unitId).canSkill, false);
  assert.ok(hostile(state).some(enemy => {
    const old = beforeAI.battle.units.find(item => item.id === enemy.id);
    return enemy.x !== old.x || enemy.y !== old.y || enemy.acted;
  }), 'the opposing AI never moved or acted');
  const living = state.battle.units.filter(item => item.hp > 0);
  assert.equal(new Set(living.map(item => `${item.x},${item.y}`)).size, living.length);
  for (const item of living) assert.ok(state.battle.tiles.find(tile => tile.x === item.x && tile.y === item.y)?.walkable);
});

test('world actions and premature finishing cannot bypass an unfinished battle', () => {
  const state = enter();
  for (const action of [{type:'endTurn'}, {type:'recruit',key:'0,0'}, {type:'undo'}, {type:'finishBattle'}, {type:'applyMod',mod:{schemaVersion:1,id:'blocked.battle',characters:[]}}]) reject(state, action);
  const after = go(state, { type: 'battleWait', unitId: friendly(state)[0].id });
  assert.equal(after.battle.units.find(unit => unit.id === friendly(state)[0].id).acted, true);
});

test('automatic tactics resolve to an explicit result and only finishBattle applies survivors and ownership', () => {
  const before = deployment(80, 2, 'survivor-writeback'), started = enter(before);
  const resultState = go(started, { type: 'battleAuto' }), result = resultState.battle.result;
  assert.equal(resultState.battle.phase, 'result'); assert.equal(result.playerWon, true);
  assert.equal(resultState.tiles['2,0'].ownerId, 'mujica');
  assert.ok(Number.isInteger(result.attackerSurvivors) && result.attackerSurvivors > 0 && result.attackerSurvivors <= before.tiles['1,0'].troops - 1);
  assert.ok(Number.isInteger(result.defenderSurvivors) && result.defenderSurvivors >= 0 && result.defenderSurvivors <= before.tiles['2,0'].troops);
  const after = go(resultState, { type: 'finishBattle' });
  assert.equal(after.battle, null);
  assert.equal(after.tiles['1,0'].troops, 1);
  assert.equal(after.tiles['2,0'].ownerId, before.playerId);
  assert.equal(after.tiles['2,0'].troops, result.attackerSurvivors);
  assert.equal(after.turn, before.turn);
  assert.equal(after.ap, before.ap - 1);
  reject(after, { type: 'finishBattle' });
});

test('defeat captures one or two actual participants and never an undeployed recruited character', () => {
  const {state, result, participantIds} = completedLoss();
  assert.ok(result.capturedCharacterIds.length >= 1 && result.capturedCharacterIds.length <= 2);
  assert.ok(result.capturedCharacterIds.every(id => participantIds.includes(id)));
  assert.equal(participantIds.includes('raana'), false);
  assert.equal(state.captives.raana, undefined);
  for (const id of result.capturedCharacterIds) {
    assert.equal(state.captives[id].captorId, 'mujica');
    assert.equal(state.captives[id].originalFactionId, state.playerId);
  }
  assert.equal(state.status, 'playing');
});

test('a one-soldier deployment cannot capture a companion who had no company in the battle', () => {
  const {state, result, participantIds} = completedLoss(2, ['rupa']);
  assert.equal(participantIds.length, 1);
  assert.deepEqual(result.capturedCharacterIds, participantIds);
  assert.equal(state.captives.nyamu, undefined);
});

test('anyone still standing escapes with the retreat', () => {
  let state = enter(deployment(18, 40, 'clean-retreat'));
  state = go(state, { type: 'battleRetreat' });
  assert.deepEqual(state.battle.result.capturedCharacterIds, []);
});

test('victory captures only deployed opponents and the result does not become a world victory', () => {
  const {state, result, participantIds} = completedWin();
  assert.ok(result.capturedCharacterIds.length >= 1 && result.capturedCharacterIds.length <= 2);
  assert.ok(result.capturedCharacterIds.every(id => participantIds.includes(id)));
  assert.equal(state.captives.tomori, undefined);
  for (const id of result.capturedCharacterIds) assert.equal(state.captives[id].captorId, state.playerId);
  assert.equal(state.status, 'playing'); assert.equal(state.victoryType ?? null, null);
});

test('ransom restores a captured ally at the displayed cost and rejects repeat or unrelated payments', () => {
  const {state: before, result} = completedLoss();
  const characterId = result.capturedCharacterIds[0];
  const descriptor = getCaptiveActions(before, characterId).find(action => action.type === 'ransomCharacter');
  assert.ok(descriptor?.enabled, descriptor?.reason);
  const after = go(before, descriptor.action);
  assert.equal(after.captives[characterId], undefined);
  assert.equal(after.characterOwners[characterId], before.playerId);
  assert.ok(after.recruitedHeroIds.includes(characterId));
  assert.equal(after.factions[after.playerId].gold, before.factions[before.playerId].gold - descriptor.cost.gold);
  assert.equal(after.ap, before.ap - descriptor.cost.ap);
  reject(after, descriptor.action);
  const loaded = deserializeGame(serializeGame(after));
  assert.equal(loaded.ok, true, loaded.error);
});

test('captured enemies may be sent home through an explicit action', () => {
  const {state: before, result} = completedWin(), characterId = result.capturedCharacterIds[0];
  const release = getCaptiveActions(before, characterId).find(action => action.type === 'releaseCaptive');
  assert.ok(release?.enabled);
  reject(before, { type: 'ransomCharacter', characterId });
  const released = go(before, release.action);
  assert.equal(released.captives[characterId], undefined);
  assert.equal(released.characterOwners[characterId], before.captives[characterId].originalFactionId);
  assert.equal(released.factions[before.playerId].gold, before.factions[before.playerId].gold);
  assert.equal(released.ap, before.ap);
  assert.equal(deserializeGame(serializeGame(released)).ok, true);
});

test('taking the captor capital rescues allies who were actually captured in a previous battle', () => {
  const loss = completedLoss(), before = copy(loss.state), prisonerIds = [...loss.result.capturedCharacterIds];
  // Explicit reinforcing-army fixture. Captivity above came from a real retreat;
  // the rescue below is obtained by a new fully resolved tactical battle.
  const capitalKey = before.factions.mujica.capitalKey;
  Object.assign(before.tiles['3,-3'], { ownerId: before.playerId, troops: 80, terrainId: 'plains' });
  Object.assign(before.tiles[capitalKey], { troops: 1, terrainId: 'plains', building: null, buildingLevel: 0 });
  seat(before, capitalKey, 'soyo'); before.characterOwners.soyo = 'mujica';
  let state = go(before, { type: 'attack', fromKey: '3,-3', toKey: capitalKey });
  state = go(state, { type: 'battleAuto' });
  assert.equal(state.battle.result.playerWon, true);
  state = go(state, { type: 'finishBattle' });
  assert.equal(state.tiles[capitalKey].ownerId, before.playerId);
  for (const id of prisonerIds) {
    assert.equal(state.captives[id], undefined);
    assert.equal(state.characterOwners[id], before.playerId);
  }
  assert.equal(state.status, 'playing');
});

test('a nation with no available named characters fields ordinary companies and keeps playing', () => {
  const state = deployment(20, 4, 'no-heroes');
  // Explicit unavailable-roster boundary, without fabricating a battle result.
  for (const characterId of state.recruitedHeroIds) state.captives[characterId] = {
    characterId, captorId: 'mujica', originalFactionId: state.playerId,
    capturedTurn: state.turn, battleId: 'fixture.preexisting-captivity',
  };
  state.activeHeroId = null; state.companionId = null;
  let after = enter(state);
  assert.deepEqual(after.battle.participantIds.attacker, []);
  assert.ok(friendly(after).length > 0);
  assert.ok(friendly(after).every(unit => !unit.characterId));
  after = settle(after);
  assert.equal(after.status, 'playing');
  after = settle(go(after, { type: 'endTurn' }));
  assert.equal(after.turn, state.turn + 1);
  assert.equal(deserializeGame(serializeGame(after)).ok, true);
});

test('mid-battle and result-screen saves preserve the board, consumed actions and deterministic continuation', () => {
  let state = enter(deployment(24, 12, 'battle-portability'));
  const unit = friendly(state)[0], move = getBattleOptions(state, unit.id).moves[0];
  assert.ok(move);
  state = go(state, { type: 'battleMove', unitId: unit.id, x: move.x, y: move.y });
  state = go(state, { type: 'battleWait', unitId: unit.id });
  const loaded = deserializeGame(serializeGame(state));
  assert.equal(loaded.ok, true, loaded.error);
  assert.deepEqual(loaded.state.battle, state.battle);
  assert.deepEqual(loaded.state.turnContinuation, state.turnContinuation);
  const direct = go(state, { type: 'battleAuto' });
  const resumed = go(loaded.state, { type: 'battleAuto' });
  assert.deepEqual(resumed.battle.result, direct.battle.result);
  assert.deepEqual(resumed.battle.units, direct.battle.units);
  const resultReloaded = deserializeGame(serializeGame(resumed));
  assert.equal(resultReloaded.ok, true, resultReloaded.error);
  assert.deepEqual(go(resultReloaded.state, { type: 'finishBattle' }), go(direct, { type: 'finishBattle' }));
});

test('AI invasions open defensive battles and resume the interrupted world turn exactly once', () => {
  const before = createGame('ai-tactical-continuation');
  before.turn = 8; warAll(before);
  Object.assign(before.tiles['3,-1'], { ownerId: 'mujica', troops: 30, terrainId: 'plains' });
  Object.assign(before.tiles['2,-1'], { ownerId: before.playerId, troops: 1, terrainId: 'plains' }); seat(before, '2,-1', 'rupa');
  const expectedGold = before.factions[before.playerId].gold + getStats(before).income.gold;
  let state = go(before, { type: 'endTurn' });
  assert.ok(state.battle, 'AI silently resolved its attack without opening the tactical board');
  assert.equal(state.battle.playerSide, 'defender');
  assert.ok(state.turnContinuation);
  const loaded = deserializeGame(serializeGame(state));
  assert.equal(loaded.ok, true, loaded.error);
  assert.deepEqual(loaded.state.turnContinuation, state.turnContinuation);
  const encountered = [];
  state = settle(loaded.state, 'battleRetreat', encountered);
  assert.equal(encountered.length, 1, 'the player defends at most once a turn');
  assert.equal(new Set(encountered).size, encountered.length);
  assert.equal(state.turn, before.turn + 1);
  assert.equal(state.factions[state.playerId].gold, expectedGold);
  assert.equal(state.ap, state.maxAP);
  assert.ok(!state.turnContinuation);
  assert.equal(state.history.length, 0);
  assert.equal(state.status, 'playing');
  reject(state, { type: 'finishBattle' });
  const next = settle(go(state, { type: 'endTurn' }), 'battleRetreat');
  assert.equal(next.turn, before.turn + 2);
});

test('forest consumes two movement points and rock blocks a ranged line of sight', () => {
  const state = positionFixture(), unit = friendly(state).find(item => item.kind === 'ranger'), target = hostile(state)[0];
  Object.assign(unit, { x: 1, y: 3, move: 3 });
  Object.assign(target, { x: 4, y: 3 });
  const middle = state.battle.tiles.find(tile => tile.x === 2 && tile.y === 3);
  Object.assign(middle, { kind: 'forest', defense: 2 });
  const forestOptions = getBattleOptions(state, unit.id);
  assert.equal(forestOptions.moves.find(cell => cell.x === 2 && cell.y === 3)?.cost, 2);
  assert.equal(forestOptions.moves.find(cell => cell.x === 3 && cell.y === 3)?.cost, 3);
  assert.ok(forestOptions.targets.some(item => item.targetId === target.id));
  Object.assign(middle, { kind: 'rock', walkable: false });
  const blocked = getBattleOptions(state, unit.id);
  assert.equal(blocked.targets.some(item => item.targetId === target.id), false);
  assert.equal(blocked.skillTargets.some(item => item.targetId === target.id), false);
  reject(state, { type: 'battleAttack', unitId: unit.id, targetId: target.id });
  reject(state, { type: 'battleSkill', unitId: unit.id, targetId: target.id });
});

test('a real elimination defeat captures both deployed commanders but no third recruited character', () => {
  let state = deployment(3, 80, 'elimination-capture');
  state = join(state, 'raana');
  state = copy(enter(state));
  state.battle.objective = null; // Declared fixture: this field is decided by elimination.
  const participants = [...state.battle.participantIds.attacker];
  assert.equal(participants.length, 2);
  state = go(state, { type: 'battleAuto' });
  assert.equal(state.battle.result.playerWon, false);
  assert.equal(state.battle.result.reason, 'elimination');
  assert.deepEqual([...state.battle.result.capturedCharacterIds].sort(), participants.sort());
  assert.equal(state.battle.result.attackerSurvivors, 0);
  state = go(state, { type: 'finishBattle' });
  assert.equal(state.captives.raana, undefined);
  for (const id of participants) assert.equal(state.captives[id].captorId, 'mujica');
  assert.equal(state.tiles['1,0'].troops, 1, 'the world source did not retain its home guard');
  assert.equal(state.battle, null);
  assert.equal(state.status, 'playing');
});

test('battle saves reject invalid placement and captives who never participated', () => {
  const state = enter(), overlapping = copy(state);
  overlapping.battle.units[1].x = overlapping.battle.units[0].x;
  overlapping.battle.units[1].y = overlapping.battle.units[0].y;
  assert.equal(deserializeGame(serializeGame(overlapping)).ok, false);
  const excessive = copy(state);
  excessive.battle.units[0].hp = excessive.battle.units[0].maxHp + 1;
  assert.equal(deserializeGame(serializeGame(excessive)).ok, false);
  const ended = go(state, { type: 'battleRetreat' });
  const forged = copy(ended);
  assert.equal(forged.battle.participantIds.attacker.includes('raana'), false);
  forged.battle.result.capturedCharacterIds = ['raana'];
  assert.equal(deserializeGame(serializeGame(forged)).ok, false);
});

test('world fort upgrades add real cover on defensive deployment squares', () => {
  const plain = deployment(18, 8, 'fort-to-battle'), fortified = copy(plain);
  Object.assign(fortified.tiles['2,0'], { building: 'fort', buildingLevel: 3 });
  const a = enter(plain), b = enter(fortified);
  const defenders = hostile(b);
  let improved = 0;
  for (const unit of defenders) {
    const basic = a.battle.tiles.find(tile => tile.x === unit.x && tile.y === unit.y);
    const protectedTile = b.battle.tiles.find(tile => tile.x === unit.x && tile.y === unit.y);
    assert.ok(protectedTile.defense >= basic.defense);
    if (protectedTile.defense > basic.defense) improved++;
  }
  assert.equal(improved, defenders.length, 'the world fort has no effect on the actual tactical defense');
  assert.equal(deserializeGame(serializeGame(b)).ok, true);
});


test('AI does not send a lone named commander against a ready three-company defense', () => {
  // Explicit reproduction of the observed UI opening: the old scalar estimate
  // valued one soldier plus Chili above three defenders, despite Taisi being
  // able to eliminate that sole company immediately with her ranged skill.
  const before = createGame('ai-one-soldier-regression');
  before.turn = 8; warAll(before);
  for (const tile of Object.values(before.tiles)) if (tile.ownerId === 'mujica') tile.troops = 1;
  Object.assign(before.tiles['3,-1'], { ownerId: 'mujica', troops: 2, terrainId: 'plains' });
  Object.assign(before.tiles['2,-1'], { ownerId: before.playerId, troops: 3, terrainId: 'plains', building: null, buildingLevel: 0 });
  for (const id of ['mygo', 'kessoku', 'poppin']) before.factions[id].graceUntilTurn = 99;
  let state = go(before, { type: 'endTurn' });
  if (state.battle) {
    assert.equal(state.battle.playerSide, 'defender');
    assert.ok(state.battle.initialAttackingTroops > 1, 'AI repeated the one-soldier commander sacrifice');
  }
  assert.equal(state.captives.sakiko, undefined);
  state = settle(state);
  assert.equal(state.turn, before.turn + 1);
  assert.equal(state.status, 'playing');
});

import test from 'node:test';
import { war, warAll, seat, elite } from './helpers.mjs';
import assert from 'node:assert/strict';
import { createGame, perform, getCharacter, getStats, serializeGame, deserializeGame } from '../dist/engine.mjs';
import { expToNext, GIFTS, trainCap } from '../dist/growth.mjs';

const go = (state, action) => {
  const result = perform(state, action);
  assert.equal(result.ok, true, `${action.type}: ${result.error}`);
  return result.state;
};
function rich(seed = 'growth') {
  const state = createGame(seed);
  state.factions.lord.gold = 500; state.factions.lord.supply = 200;
  return state;
}
function battleReady(state, troops = 30, foes = 6) {
  state.turn = 8; warAll(state); if (!state.tiles['1,0'].field.length) seat(state, '1,0', 'rupa');
  Object.assign(state.tiles['1,0'], { troops });
  Object.assign(state.tiles['2,0'], { ownerId: 'mujica', troops: foes, terrainId: 'plains', building: null, buildingLevel: 0 }); seat(state, '2,0', 'sakiko');
  return go(state, { type: 'attack', fromKey: '1,0', toKey: '2,0' });
}
function gift(state, id, item) { return perform(state, { type: 'gift', characterId: id, item }); }

test('a real battle pays experience, wins, bond and costs spirit exactly once', () => {
  let state = battleReady(rich());
  state = go(state, { type: 'battleAuto' });
  const before = getCharacter(state, 'rupa').growth, won = state.battle.result.playerWon;
  state = go(state, { type: 'finishBattle' });
  const after = getCharacter(state, 'rupa').growth;
  assert.equal(after.battles, before.battles + 1);
  assert.equal(after.wins, before.wins + (won ? 1 : 0));
  assert.ok(after.exp > before.exp || after.level > before.level);
  assert.ok(after.bond > before.bond);
  assert.equal(after.spirit, before.spirit - 12);
});

test('levelling rolls each stat from the character and logs what rose', () => {
  let state = rich('levels');
  state.growth.rupa.exp = expToNext(1) - 1;
  state.ap = 3;
  state = go(state, { type: 'train', characterId: 'rupa', stat: 'economy' });
  const view = getCharacter(state, 'rupa');
  assert.equal(view.level, 2);
  assert.equal(state.levelLog.at(-1).id, 'rupa');
  assert.ok(state.levelLog.at(-1).gains.length >= 1);
  for (const stat of state.levelLog.at(-1).gains) assert.ok(view.growth.gains[stat] >= 1);
  assert.equal(state.characters.rupa.stats.economy, 1, 'definitions never change, growth lives in the save');
  assert.ok(view.stats.economy >= 2);
});

test('training is capped, tiring, paid for, and undoable', () => {
  let state = rich('training');
  const cap = trainCap(1, 0), before = state.factions.lord.gold;
  state = go(state, { type: 'train', characterId: 'rupa', stat: 'attack' });
  assert.ok(state.factions.lord.gold < before);
  assert.equal(getCharacter(state, 'rupa').growth.trained.attack, 1);
  assert.equal(getCharacter(state, 'rupa').growth.spirit, 55);
  assert.equal(cap, 1);
  assert.equal(perform(state, { type: 'train', characterId: 'rupa', stat: 'attack' }).ok, false);
  const undone = go(state, { type: 'undo' });
  assert.equal(undone.factions.lord.gold, before);
  state.growth.rupa.spirit = 10;
  assert.equal(perform(state, { type: 'train', characterId: 'rupa', stat: 'defense' }).ok, false);
});

test('talking is once a turn and every girl has one favourite gift to find', () => {
  let state = rich('gifts');
  state = go(state, { type: 'talk', characterId: 'rupa' });
  assert.equal(perform(state, { type: 'talk', characterId: 'rupa' }).ok, false);
  const like = getCharacter(state, 'rupa').likes, other = GIFTS.find(item => item.id !== like).id;
  const plain = gift(state, 'rupa', other), loved = gift(state, 'rupa', like);
  assert.equal(plain.detail.liked, false); assert.equal(loved.detail.liked, true);
  assert.ok(getCharacter(loved.state, 'rupa').growth.bond > getCharacter(plain.state, 'rupa').growth.bond);
  assert.equal(getCharacter(loved.state, 'rupa').growth.knownLike, true);
  assert.equal(gift(loved.state, 'rupa', like).ok, false, 'one gift per girl per turn');
});

test('perks open at their level, one per tier, and reach the battlefield', () => {
  let state = rich('perks');
  state.characterOwners.anon = 'lord'; state.recruitedHeroIds.push('anon'); state.companionId = 'anon';
  state.growth.anon = { ...getCharacter(state, 'anon').growth, level: 4 };
  assert.equal(perform(state, { type: 'choosePerk', characterId: 'anon', tier: 0, perk: 'v_charge' }).ok, false);
  state.growth.anon.level = 5;
  assert.deepEqual(getCharacter(state, 'anon').pending, [0]);
  assert.equal(perform(state, { type: 'choosePerk', characterId: 'anon', tier: 0, perk: 'r_long' }).ok, false, 'another role\'s perk');
  state = go(state, { type: 'choosePerk', characterId: 'anon', tier: 0, perk: 'v_charge' });
  assert.equal(perform(state, { type: 'choosePerk', characterId: 'anon', tier: 0, perk: 'v_reap' }).ok, false);
  seat(state, '1,0', 'rupa', 'anon');
  state = battleReady(state);
  const unit = state.battle.units.find(item => item.characterId === 'anon');
  assert.equal(unit.move, 5);
});

test('posts raise income but keep the girl off the field, and the leader cannot hold one', () => {
  let state = rich('posts');
  state.characterOwners.anon = 'lord'; state.recruitedHeroIds.push('anon'); seat(state, '0,0', 'anon');
  assert.equal(perform(state, { type: 'assignPost', post: 'finance', characterId: 'rupa' }).ok, false);
  const before = getStats(state).income.gold;
  state = go(state, { type: 'assignPost', post: 'finance', characterId: 'anon' });
  assert.equal(getStats(state).income.gold, before + getCharacter(state, 'anon').stats.economy);
  state = battleReady(state);
  assert.equal(state.battle.units.some(unit => unit.characterId === 'anon'), false);
});

test('a charming recruiter improves the chance of meeting a girl', () => {
  let state = rich('envoy');
  state.characterOwners.anon = 'lord'; state.recruitedHeroIds.push('anon'); seat(state, '0,0', 'anon');
  const before = getStats(state).girlRate;
  state = go(state, { type: 'assignPost', post: 'envoy', characterId: 'anon' });
  assert.ok(getStats(state).girlRate > before);
});

test('rival nations grow on their own and pick their own perks', () => {
  let state = createGame('ai-growth');
  state.growth.sakiko = { ...getCharacter(state, 'sakiko').growth, level: 4, exp: expToNext(4) - 1 };
  state.turn = 8; warAll(state); if (!state.tiles['1,0'].field.length) seat(state, '1,0', 'rupa');
  for (const faction of Object.values(state.factions)) faction.graceUntilTurn = 99;
  state = go(state, { type: 'endTurn' });
  while (state.battle) state = go(state, { type: state.battle.phase === 'result' ? 'finishBattle' : 'battleAuto' });
  assert.equal(getCharacter(state, 'sakiko').growth.level, 5);
  assert.ok(getCharacter(state, 'sakiko').growth.perks[0], 'AI chose a perk for her');
});

test('growth, posts and pair history survive a save round trip', () => {
  let state = rich('roundtrip');
  state = go(state, { type: 'train', characterId: 'rupa', stat: 'charm' });
  const loaded = deserializeGame(serializeGame(state));
  assert.equal(loaded.ok, true, loaded.error);
  assert.deepEqual(loaded.state.growth, state.growth);
  assert.deepEqual(loaded.state.posts, state.posts);
});

test('finished dialogue is remembered and its effect is bounded', () => {
  let state = rich('dialogue');
  state = go(state, { type: 'dialogueDone', id: 'x.y', who: 'rupa', effect: { gold: 100000, bond: 5 } });
  assert.equal(state.factions.lord.gold, 700);
  assert.equal(getCharacter(state, 'rupa').growth.bond, 5);
  assert.ok(state.storySeen.includes('x.y'));
});

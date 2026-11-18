import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyGameAction, createMultiplayerGame, bandOptions, bandRoster, adjacent,
  distance, incomeFor, MP_RULES, battlePlayer,
} from '../web/multiplayer-engine.mjs';
import { createTacticalBattle, performVersusTactical, tacticalOptions, validateTactical, tacticalForceSummary } from '../web/battle.mjs';

const seats = n => Array.from({ length: n }, (_, i) => ({ id: `p${i + 1}`, name: `旅人${i + 1}`, band: bandOptions()[i].id }));
const newGame = (n = 2, map = 'small') => createMultiplayerGame(seats(n), { map, seed: 'regression-test' });
const act = (game, action, id = game.turnId) => applyGameAction(game, id, action);
function fightFixture() {
  const game = newGame(), [a, b] = game.players;
  game.round = 3; a.army.key = '0,0'; b.army.key = '1,0';
  Object.assign(game.tiles['0,0'], { owner: a.id, troops: 0 });
  Object.assign(game.tiles['1,0'], { owner: b.id, troops: 4 });
  return act(game, { type: 'moveArmy', key: '1,0' });
}
test('finite maps and symmetric equal starts for 2, 3 and 4 players', () => {
  for (let n = 2; n <= 4; n++) for (const map of ['small', 'medium']) {
    const game = newGame(n, map), radius = MP_RULES.maps[map].radius;
    assert.equal(Object.keys(game.tiles).length, MP_RULES.maps[map].tiles);
    const profiles = game.players.map(p => {
      const tiles = Object.values(game.tiles).filter(t => t.owner === p.id);
      assert.equal(tiles.length, 7); assert.equal(distance(game.tiles[p.capital], { q: 0, r: 0 }), radius - 1);
      return { gold: p.gold, supply: p.supply, troops: p.army.troops, terrain: tiles.map(t => t.terrain).sort(), income: incomeFor(game, p) };
    });
    profiles.forEach(profile => assert.deepEqual(profile, profiles[0]));
  }
});
test('every selectable band has the same four combat profiles including undersized casts', () => {
  const baseline = bandRoster(bandOptions()[0].id);
  const summary = lineup => tacticalForceSummary({ troops: 18, characters: lineup, trainingLevel: 5 });
  const expected = summary(baseline);
  for (const band of bandOptions()) {
    const roster = bandRoster(band.id);
    assert.equal(roster.length, 4);
    assert.deepEqual(roster.map(h => ({ role: h.role, stats: h.stats, fx: h.fx, group: h.group })), baseline.map(h => ({ role: h.role, stats: h.stats, fx: h.fx, group: h.group })));
    const actual = summary(roster);
    for (const key of ['rating', 'hp', 'pressure', 'durability', 'squads']) assert.equal(actual[key], expected[key], `${band.id}:${key}`);
  }
});
test('commands are immutable, reject out-of-turn/invalid/over-map moves, and spend exactly once', () => {
  const game = newGame(), original = structuredClone(game), player = game.players[0];
  const key = adjacent(game.tiles[player.capital])[0];
  assert.throws(() => act(game, { type: 'moveArmy', key }, 'p2'), /轮到/);
  assert.throws(() => act(game, { type: 'moveArmy', key: '999,999' }), /相邻/);
  const moved = act(game, { type: 'moveArmy', key });
  assert.deepEqual(game, original);
  assert.equal(moved.ap, 2); assert.equal(moved.players[0].supply, 43); assert.equal(moved.players[0].army.key, key);
  assert.equal(Object.keys(moved.tiles).length, 91);
  assert.throws(() => act(game, { type: 'build', key, building: '__proto__' }), /建筑无效/);
});
test('recruiting, garrisons, construction caps, insufficient funds and AP are authoritative', () => {
  let game = newGame(), player = game.players[0], key = player.capital;
  game = act(game, { type: 'recruit', key }); assert.equal(game.players[0].army.troops, 24); assert.equal(game.players[0].gold, 33);
  game = act(game, { type: 'recruit', key }); game = act(game, { type: 'recruit', key });
  assert.equal(game.ap, 0); assert.throws(() => act(game, { type: 'muster', key }), /指令/);
  game.ap = 3; game.players[0].army.troops = 40;
  assert.throws(() => act(game, { type: 'recruit', key }), /上限/);
  game.players[0].gold = 0;
  assert.throws(() => act(game, { type: 'build', key: adjacent(game.tiles[key])[0], building: 'farm' }), /不足/);
  game.players[0].gold = 100; game.players[0].supply = 100;
  const farm = adjacent(game.tiles[key])[0];
  game = act(game, { type: 'build', key: farm, building: 'farm' });
  game = act(game, { type: 'build', key: farm, building: 'farm' });
  assert.throws(() => act(game, { type: 'build', key: farm, building: 'farm' }), /2 级/);
  assert.equal(game.tiles[farm].level, 2);
});
test('income is settled once after all players act, opening truce and round limits hold', () => {
  let game = newGame(4), originalGold = game.players.map(p => p.gold);
  for (let n = 0; n < 3; n++) game = act(game, { type: 'endTurn' });
  assert.equal(game.round, 1); assert.deepEqual(game.players.map(p => p.gold), originalGold);
  game = act(game, { type: 'endTurn' }); assert.equal(game.round, 2);
  assert.ok(game.players.every((p, i) => p.gold > originalGold[i]));
  const enemy = Object.values(game.tiles).find(t => t.owner === 'p2');
  game.players[0].army.key = adjacent(enemy).find(key => game.tiles[key]);
  assert.throws(() => act(game, { type: 'moveArmy', key: enemy.key }), /前 2 轮/);
  game = newGame(4); game.round = 40;
  for (let n = 0; n < 4; n++) game = act(game, { type: 'endTurn' });
  assert.equal(game.status, 'finished'); assert.equal(game.round, 40); assert.equal(game.winners.length, 4);
});
test('PvP handoff never makes opponent moves and resets only the incoming side', () => {
  const battle = createTacticalBattle({ id: 'test', seed: 'test', attackerId: 'p1', defenderId: 'p2', playerId: 'p1', terrainId: 'plains', attackingTroops: 18, defendingTroops: 18, attackerCharacters: bandRoster('mygo'), defenderCharacters: bandRoster('togenashi') });
  const positions = battle.units.map(u => ({ id: u.id, x: u.x, y: u.y, hp: u.hp }));
  const ended = performVersusTactical(battle, { type: 'battleEndTurn' });
  assert.equal(ended.ok, true); assert.equal(ended.battle.playerSide, 'defender'); assert.equal(ended.battle.round, 1);
  assert.deepEqual(ended.battle.units.map(u => ({ id: u.id, x: u.x, y: u.y, hp: u.hp })), positions);
  assert.ok(ended.battle.units.filter(u => u.side === 'attacker').every(u => u.acted));
  assert.ok(ended.battle.units.filter(u => u.side === 'defender').every(u => !u.acted));
  const back = performVersusTactical(ended.battle, { type: 'battleEndTurn' });
  assert.equal(back.battle.playerSide, 'attacker'); assert.equal(back.battle.round, 2);
  assert.equal(performVersusTactical(battle, { type: 'battleAuto' }).ok, false);
});
test('manual movement/attacks, wrong-side ownership and 40-round PvP settlement', () => {
  let game = fightFixture();
  assert.equal(game.battleContext.versus, true);
  assert.throws(() => act(game, { type: 'battleEndTurn' }, 'p2'), /等待/);
  const own = game.battle.units.find(u => u.side === 'attacker');
  const move = tacticalOptions(game.battle, own.id).moves[0];
  game = act(game, { type: 'battleMove', unitId: own.id, x: move.x, y: move.y });
  assert.equal(game.battle.units.find(u => u.id === own.id).x, move.x);
  const positions = battle => battle.units.filter(u => u.side === 'defender').map(u => ({ id: u.id, x: u.x, y: u.y, hp: u.hp }));
  const before = positions(game.battle);
  game = act(game, { type: 'battleEndTurn' });
  assert.equal(battlePlayer(game), 'p2'); assert.deepEqual(positions(game.battle), before);
  for (let n = 0; game.battle && n < 90; n++) {
    game = act(game, { type: 'battleEndTurn' }, battlePlayer(game));
    if (game.battle) assert.equal(validateTactical(game.battle).ok, true, validateTactical(game.battle).errors.join(';'));
  }
  assert.equal(game.battle, null); assert.equal(game.lastBattle.reason, 'stalemate');
  assert.equal(game.turnId, 'p1'); assert.equal(game.ap, 2);
});
test('PvP auto-turn completes valid combat without giving one user opponent control', () => {
  let game = fightFixture(), actions = 0;
  while (game.battle && actions++ < 90) {
    const player = battlePlayer(game);
    game = act(game, { type: 'battleAutoTurn' }, player);
    if (game.battle) assert.equal(validateTactical(game.battle).ok, true, validateTactical(game.battle).errors.join(';'));
  }
  assert.ok(actions < 90); assert.equal(game.battle, null); assert.ok(game.lastBattle.winner);
  assert.ok(game.players.every(p => p.army.troops >= 0 && p.army.troops <= 40));
  assert.throws(() => act(game, { type: 'moveArmy', key: '1,0' }), /已经进攻|相邻/);
});
test('unguarded capitals can be captured, defeated users cannot act, surrender advances safely', () => {
  let game = newGame(3); game.round = 3;
  const [a, b] = game.players;
  a.army.key = adjacent(game.tiles[b.capital]).find(k => game.tiles[k]);
  b.army.key = b.capital; b.army.troops = 0; game.tiles[b.capital].troops = 0;
  // Heroes remain a real defence even with no Sazai; move the army away to test an unguarded capital.
  b.army.key = adjacent(game.tiles[b.capital])[0];
  game = act(game, { type: 'moveArmy', key: b.capital });
  assert.equal(game.players[1].alive, false); assert.equal(game.tiles[b.capital].owner, a.id);
  assert.equal(game.status, 'playing'); assert.throws(() => act(game, { type: 'endTurn' }, b.id), /退出/);
  game = act(game, { type: 'surrender' }, a.id);
  assert.equal(game.status, 'finished'); assert.deepEqual(game.winners, ['p3']);
});
test('surrender in a live battle settles it before eliminating the player', () => {
  const game = act(fightFixture(), { type: 'surrender' }, 'p1');
  assert.equal(game.battle, null); assert.equal(game.players[0].alive, false);
  assert.equal(game.status, 'finished'); assert.deepEqual(game.winners, ['p2']);
});

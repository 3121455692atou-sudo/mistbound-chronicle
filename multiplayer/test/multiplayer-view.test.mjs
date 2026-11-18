import test from 'node:test';
import assert from 'node:assert/strict';
import { createMultiplayerGame, applyGameAction } from '../web/multiplayer-engine.mjs';
import { presentationState } from '../web/multiplayer-view.mjs';

function room() {
  const seats = ['p1','p2'].map(id => ({ id, name: `${id}国`, band: 'mygo', control: 'human' }));
  return { me: 'p1', seats, status: 'playing', version: 8,
    game: createMultiplayerGame(seats, { seed: 'original-ui-adapter' }) };
}
function battleRoom() {
  const source = room(); source.game.round = 3;
  source.game.players[0].army.key = '0,0'; source.game.players[1].army.key = '1,0';
  Object.assign(source.game.tiles['0,0'], { owner: 'p1', troops: 0 });
  Object.assign(source.game.tiles['1,0'], { owner: 'p2', troops: 4 });
  source.game = applyGameAction(source.game, 'p1', { type: 'moveArmy', key: '1,0' });
  return source;
}
test('original map receives the exact finite world, own-country flags and separate same-character identities', () => {
  const source = room(), before = structuredClone(source), view = presentationState(source);
  assert.equal(Object.keys(view.tiles).length, 91);
  assert.equal(view.factions.p1.isPlayer, true); assert.equal(view.factions.p2.isPlayer, false);
  const otherView = presentationState({ ...source, me: 'p2' });
  assert.equal(otherView.factions.p2.color, view.factions.p1.color);
  assert.notEqual(otherView.factions.p1.color, otherView.factions.p2.color);
  assert.equal(view.tiles[source.game.players[0].capital].name, 'p1国');
  const heroId = source.game.players[0].army.heroes[0].id;
  assert.notEqual(view.characters[`p1|${heroId}`], view.characters[`p2|${heroId}`]);
  view.characters[`p1|${heroId}`].stats.attack = 77;
  view.tiles[source.game.players[0].capital].troops = 99;
  assert.deepEqual(source, before);
});
test('battle viewer uses their own side while command eligibility follows the authoritative actor', () => {
  const source = battleRoom(), before = structuredClone(source);
  const attacker = presentationState(source);
  assert.equal(attacker.battle.phase, 'player'); assert.equal(attacker.battle.playerSide, 'attacker');
  const defender = presentationState({ ...source, me: 'p2' });
  assert.equal(defender.battle.phase, 'enemy'); assert.equal(defender.battle.playerSide, 'defender');
  assert.ok(defender.battle.units.filter(u => u.characterId).every(u => u.characterId.startsWith(
    u.side === 'attacker' ? 'p1|' : 'p2|')));
  defender.battle.units[0].hp = 0;
  assert.deepEqual(source, before);
  source.game = applyGameAction(source.game, 'p1', { type: 'battleEndTurn' });
  const next = presentationState({ ...source, me: 'p2' });
  assert.equal(next.battle.phase, 'player'); assert.equal(next.battle.playerSide, 'defender');
});
test('AI-controlled and third-country viewers remain unable to command the original battle UI', () => {
  const source = battleRoom();
  source.seats[0].control = 'ai';
  assert.equal(presentationState(source).battle.phase, 'enemy');
  assert.equal(presentationState({ ...source, me: 'p3' }).battle.phase, 'enemy');
  source.status = 'finished'; source.seats[0].control = 'human';
  assert.equal(presentationState(source).battle.phase, 'enemy');
});
test('spectators inspect either country and battlefield side without gaining command eligibility or mutating the room', () => {
  const source=battleRoom();source.me=null;source.role='spectator';
  const before=structuredClone(source);
  for(const id of ['p1','p2']) {
    const view=presentationState(source,id);
    assert.equal(view.observer,true);assert.equal(view.playerId,id);assert.equal(view.factions[id].isPlayer,true);
    assert.equal(view.battle.phase,'enemy');assert.equal(view.battle.playerSide,id==='p1'?'attacker':'defender');
  }
  assert.deepEqual(source,before);
});

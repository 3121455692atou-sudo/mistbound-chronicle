import test from 'node:test';
import assert from 'node:assert/strict';
import { applyGameAction, createMultiplayerGame, adjacent, incomeFor } from '../web/multiplayer-engine.mjs';
import { interactionText, readAffinity, readDiplomacy } from '../web/multiplayer-interactions.mjs';
import { chooseAiAction, chooseAiReply } from '../server/ai.mjs';
const fresh = () => createMultiplayerGame([
  { id: 'p1', name: '甲国', band: 'mygo' }, { id: 'p2', name: '乙国', band: 'mygo' },
], { seed: 'interactions' });
const act = (game, action, id = game.turnId) => applyGameAction(game, id, action);
test('identical character IDs in two countries keep affinity, training and both viewer perspectives separate', () => {
  let game = fresh(), id = game.players[0].army.heroes[0].id;
  game = act(game, { type: 'talk', targetId: 'p2', characterId: id });
  assert.equal(readAffinity(game, 'p1', 'p2', id), 3);
  assert.equal(readAffinity(game, 'p1', 'p1', id), 0);
  assert.equal(readAffinity(game, 'p2', 'p2', id), 0);
  const event = game.social.events.at(-1);
  assert.match(interactionText(event, 'p1'), /^你与乙国/);
  assert.match(interactionText(event, 'p2'), /^甲国与你/);
  assert.throws(() => act(game, { type: 'talk', targetId: 'p1', characterId: id }), /本轮/);
  const original = structuredClone(game);
  assert.throws(() => act(game, { type: 'train', targetId: 'p2', characterId: id, stat: 'attack' }), /本国/);
  assert.deepEqual(game, original);
  game = act(game, { type: 'train', targetId: 'p1', characterId: id, stat: 'attack' });
  assert.equal(game.players[0].army.heroes[0].stats.attack, 5);
  assert.equal(game.players[1].army.heroes[0].stats.attack, 4);
  assert.equal(game.players[0].gold, 25); assert.equal(game.players[0].supply, 37); assert.equal(game.ap, 2);
});
test('gift and diplomacy charge real resources once, enforce per-round limits and reflect recipient effects', () => {
  let game = fresh(), hero = game.players[1].army.heroes[1];
  game = act(game, { type: 'gift', targetId: 'p2', characterId: hero.id });
  assert.equal(game.players[0].gold, 35); assert.equal(game.ap, 2);
  assert.equal(readAffinity(game, 'p1', 'p2', hero.id), 8);
  assert.throws(() => act(game, { type: 'gift', targetId: 'p2', characterId: hero.id }), /本轮/);
  game = act(game, { type: 'diplomaticGift', targetId: 'p2' });
  assert.equal(game.players[0].gold, 15); assert.equal(game.players[1].gold, 65);
  assert.equal(readDiplomacy(game, 'p1', 'p2').favor, 8);
  assert.throws(() => act(game, { type: 'diplomaticGift', targetId: 'p2' }), /本轮/);
  assert.throws(() => act(game, { type: 'train', targetId: 'p1', characterId: hero.id, stat: 'defense' }), /不足/);
});
test('training has a per-round limit and a permanent two-point cap per stat', () => {
  let game = fresh(), hero = game.players[0].army.heroes[0].id;
  game.players[0].gold = 200; game.players[0].supply = 200;
  game = act(game, { type: 'train', targetId: 'p1', characterId: hero, stat: 'attack' });
  assert.throws(() => act(game, { type: 'train', targetId: 'p1', characterId: hero, stat: 'defense' }), /本轮/);
  game = act(game, { type: 'endTurn' }); game = act(game, { type: 'endTurn' });
  game = act(game, { type: 'train', targetId: 'p1', characterId: hero, stat: 'attack' });
  game = act(game, { type: 'endTurn' }); game = act(game, { type: 'endTurn' });
  assert.throws(() => act(game, { type: 'train', targetId: 'p1', characterId: hero, stat: 'attack' }), /上限/);
  assert.equal(game.players[0].army.heroes[0].stats.attack, 6);
});
test('only the recipient may reply; peace prevents new invasions and expires without cancelling current battles', () => {
  let game = fresh(); game.round = 3;
  game = act(game, { type: 'offerPeace', targetId: 'p2' });
  const offerId = game.social.offers[0].id;
  assert.throws(() => act(game, { type: 'respondOffer', offerId, accept: true }, 'p1'), /失效|不存在/);
  game = act(game, { type: 'respondOffer', offerId, accept: true }, 'p2');
  assert.equal(game.turnId, 'p1'); assert.equal(game.ap, 2);
  const target = Object.values(game.tiles).find(t => t.owner === 'p2');
  game.players[0].army.key = adjacent(target).find(k => game.tiles[k]);
  assert.throws(() => act(game, { type: 'moveArmy', key: target.key }), /停战/);
  game.round = 7;
  game = act(game, { type: 'moveArmy', key: target.key });
  assert.ok(game.battle || game.lastBattle);
  const battle = structuredClone(game.battle);
  assert.throws(() => act(game, { type: 'talk', targetId: 'p2', characterId: game.players[1].army.heroes[0].id }), /战/);
  assert.deepEqual(game.battle, battle);
});
test('accepted trade produces exactly five settlements and duplicate/rejected/expired offers cannot pay twice', () => {
  let game = fresh();
  const original = incomeFor(game, game.players[0]).gold;
  game = act(game, { type: 'offerTrade', targetId: 'p2' });
  assert.throws(() => act(game, { type: 'offerTrade', targetId: 'p2' }), /等待/);
  const id = game.social.offers[0].id;
  game = act(game, { type: 'respondOffer', offerId: id, accept: true }, 'p2');
  assert.throws(() => act(game, { type: 'respondOffer', offerId: id, accept: true }, 'p2'), /失效|不存在/);
  for (let i = 0; i < 6; i++) {
    const before = game.players[0].gold;
    game = act(game, { type: 'endTurn' }); game = act(game, { type: 'endTurn' });
    assert.equal(game.players[0].gold - before, original + (i < 5 ? 3 : 0));
  }
  game = act(game, { type: 'offerPeace', targetId: 'p2' });
  const pending = game.social.offers.at(-1); game.round = pending.expires + 1;
  assert.throws(() => act(game, { type: 'respondOffer', offerId: pending.id, accept: true }, 'p2'), /失效/);
});
test('a pending peace offer accepted during combat preserves the existing battlefield exactly', () => {
  let game = fresh(); game.round = 3;
  game = act(game, { type: 'offerPeace', targetId: 'p2' });
  const offerId = game.social.offers[0].id;
  const target = Object.values(game.tiles).find(t => t.owner === 'p2');
  game.players[0].army.key = adjacent(target).find(k => game.tiles[k]);
  game = act(game, { type: 'moveArmy', key: target.key });
  assert.ok(game.battle);
  const before = structuredClone({ battle: game.battle, context: game.battleContext, ap: game.ap, turnId: game.turnId });
  game = act(game, { type: 'respondOffer', offerId, accept: true }, 'p2');
  assert.deepEqual({ battle: game.battle, context: game.battleContext, ap: game.ap, turnId: game.turnId }, before);
  assert.equal(readDiplomacy(game, 'p1', 'p2').truceUntil, 6);
});
test('AI decisions use ordinary valid commands and both sides finish a deterministic match', () => {
  let game = fresh(), commands = 0;
  while (game.status === 'playing' && commands++ < 1500) {
    const player = game.battle ? game.battle[game.battle.playerSide === 'attacker' ? 'attackerId' : 'defenderId'] : game.turnId;
    const action = chooseAiAction(game, player);
    assert.ok(action); game = act(game, action, player);
    assert.ok(game.players.every(p => p.gold >= 0 && p.supply >= 0 && p.army.troops <= 40));
  }
  assert.equal(game.status, 'finished');
  assert.ok(commands < 1500); assert.ok(game.battleSeq > 0);
  assert.ok(game.social.events.some(e => e.kind === 'trainRecord' || e.kind === 'talkRecord'));
  const offerGame = fresh();
  assert.equal(chooseAiReply(offerGame, { kind: 'trade', from: 'p1', to: 'p2' }), true);
});

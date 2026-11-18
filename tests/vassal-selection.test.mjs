import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, perform, getVassalCharacterQuote, serializeGame, deserializeGame } from '../dist/engine.mjs';
const subject = () => {
  const s = createGame('select-tribute');
  s.relations['lord|mygo'] = { status: 'vassal', favor: 70, until: 0, since: 1, trade: false, talkTurn: 0 };
  return s;
};
test('a chosen nonleader joins without replacing the vassal representative or changing its fee', () => {
  const s = subject(), representative = s.factions.mygo.leaderId;
  const id = getVassalCharacterQuote(s, 'mygo').candidates.find(id => id !== representative);
  const q = getVassalCharacterQuote(s, 'mygo', id), before = serializeGame(s);
  assert.equal(q.enabled, true, q.reason); assert.deepEqual(q.cost, { ap: 1, gold: 0, supply: 0 });
  const r = perform(s, q.action); assert.equal(r.ok, true, r.error);
  assert.equal(r.detail.characterId, id);
  assert.equal(r.state.factions.mygo.leaderId, representative);
  assert.equal(r.state.characterOwners[id], 'lord');
  assert.equal(r.state.ap, s.ap - 1);
  assert.equal(r.state.factions.lord.gold, s.factions.lord.gold);
  assert.equal(r.state.factions.mygo.liberty, 25);
  assert.equal(serializeGame(s), before);
  assert.equal(deserializeGame(serializeGame(r.state)).ok, true);
});
test('the old action without a character still selects the representative and finds a successor', () => {
  const s = subject(), old = s.factions.mygo.leaderId;
  const r = perform(s, { type: 'requisitionLeader', factionId: 'mygo' });
  assert.equal(r.ok, true, r.error);
  assert.equal(r.detail.characterId, old);
  assert.notEqual(r.state.factions.mygo.leaderId, old);
});
test('wrong members, explicit null, stale quotes and the last member reject without payment', () => {
  let s = subject();
  for (const characterId of ['rupa', 'missing', null]) {
    const before = serializeGame(s), r = perform(s, { type: 'requisitionLeader', factionId: 'mygo', characterId });
    assert.equal(r.ok, false); assert.equal(serializeGame(s), before);
  }
  const stale = getVassalCharacterQuote(s, 'mygo');
  s.revision++;
  assert.equal(perform(s, stale.action).ok, false);
  for (;;) {
    const q = getVassalCharacterQuote(s, 'mygo');
    if (q.candidates.length === 1) {
      const before = serializeGame(s), r = perform(s, q.action);
      assert.equal(q.enabled, false); assert.equal(r.ok, false); assert.equal(serializeGame(s), before); break;
    }
    const r = perform(s, q.action); assert.equal(r.ok, true, r.error); s = r.state;
  }
});

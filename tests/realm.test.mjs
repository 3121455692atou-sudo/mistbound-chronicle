import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, perform, getTileStats, getArmy, getActions, getRelation, getStats, escapeRisk, diplomacyQuote, serializeGame, deserializeGame, previewAttack, MAX_SEATS } from '../dist/engine.mjs';
import { war, seat, elite } from './helpers.mjs';

const go = (state, action) => { const result = perform(state, action); assert.equal(result.ok, true, result.error); return result.state; };
const copy = value => structuredClone(value);

test('the default start is the whole of Girls Band Cry with Rupa in front', () => {
  const state = createGame('guide');
  assert.equal(state.activeHeroId, 'rupa');
  assert.deepEqual(state.tiles['0,0'].garrison, ['rupa'], 'one holds the capital');
  assert.deepEqual(state.tiles['0,0'].field, ['nina', 'momoka', 'subaru', 'tomo'], 'the rest are ready to march');
  assert.equal(state.factions.togenashi, undefined);
  assert.ok(state.factions.poppin.alive, 'another group takes over the empty homeland');
  assert.equal(state.tiles['0,0'].elite.R, 1);
  assert.equal(state.factions.lord.sazai, undefined);
  assert.equal(deserializeGame(serializeGame(state)).ok, true);
});

test('settlers are real people taken from the neighbouring tile', () => {
  const state = createGame('settle'), before = state.tiles['0,0'].troops;
  const after = go(state, { type: 'claim', key: '1,1', fromKey: '1,0' });
  assert.equal(after.tiles['1,1'].troops, 2);
  assert.equal(after.tiles['1,0'].troops, 1);
  assert.equal(after.tiles['0,0'].troops, before);
  const thin = copy(state);
  for (const key of ['0,0', '1,0', '0,1']) thin.tiles[key].troops = 2;
  assert.equal(perform(thin, { type: 'claim', key: '1,1' }).ok, false);
  assert.match(getActions(thin, '1,1').find(action => action.type === 'claim').reason, /3 人/);
});

test('people run the tile: too few hands earn less and block upgrades', () => {
  const state = createGame('hands');
  Object.assign(state.tiles['1,0'], { building: 'farm', buildingLevel: 2 });
  const need = getTileStats(state, '1,0').need;
  state.tiles['1,0'].troops = need;
  const full = getTileStats(state, '1,0').supply;
  state.tiles['1,0'].troops = 1;
  assert.ok(getTileStats(state, '1,0').supply < full);
  state.factions.lord.gold = 200; state.factions.lord.supply = 200;
  assert.equal(perform(state, { type: 'upgrade', key: '1,0' }).ok, false);
  state.tiles['0,1'].troops = 2;
  assert.equal(perform(state, { type: 'build', key: '0,1', building: 'mine' }).ok, false);
});

test('tiles grow on their own harvest until housing runs out', () => {
  let state = createGame('grow');
  const start = state.tiles['0,1'].troops, housing = getTileStats(state, '0,1').housing;
  for (let i = 0; i < 6; i++) { state = go(state, { type: 'endTurn' }); while (state.battle) state = go(go(state, { type: 'battleAuto' }), { type: 'finishBattle' }); }
  assert.ok(state.tiles['0,1'].troops > start);
  const full = copy(state);
  full.tiles['0,1'].troops = housing; full.tiles['0,1'].food = 0;
  const next = go(full, { type: 'endTurn' });
  assert.equal(next.tiles['0,1'].troops, housing);
  assert.equal(perform(full, { type: 'recruit', key: '0,1' }).ok, false);
});

test('a girl either holds a tile or marches: only those on the march can leave', () => {
  let state = createGame('stance');
  state = go(state, { type: 'stance', characterId: 'nina', stay: true });
  assert.deepEqual(state.tiles['0,0'].garrison, ['rupa', 'nina']);
  state = go(state, { type: 'stance', characterId: 'rupa', stay: false });
  assert.deepEqual(state.tiles['0,0'].garrison, ['nina']);
  assert.ok(state.tiles['0,0'].field.includes('rupa'));
  assert.equal(perform(state, { type: 'stance', characterId: 'rupa', stay: false }).ok, false);
  state = go(state, { type: 'move', fromKey: '0,0', toKey: '1,0', troops: 2 });
  assert.deepEqual(state.tiles['0,0'].garrison, ['nina'], 'whoever is stationed stays put');
  assert.ok(state.tiles['1,0'].field.includes('rupa'));
  const army = getArmy(state, '1,0');
  assert.ok(army.marching.includes('rupa'));
  assert.equal(deserializeGame(serializeGame(state)).ok, true);
});

test('stationed girls still defend, and a girl alone can march', () => {
  let state = createGame('alone');
  state.tiles['0,0'].troops = 1;
  state = go(state, { type: 'move', fromKey: '0,0', toKey: '1,0', troops: 0, girls: ['nina'] });
  assert.ok(state.tiles['1,0'].field.includes('nina'));
  assert.equal(state.tiles['0,0'].troops, 1);
  assert.equal(previewAttack(state, '1,0', '0,0').canAttack, false);
});

test('without girls the rarest Sazai take the field first', () => {
  const state = createGame('rarest');
  state.turn = 8; war(state);
  Object.assign(state.tiles['1,0'], { troops: 20 }); elite(state, '1,0', { R: 1, SSR: 1, SR: 1 });
  Object.assign(state.tiles['2,0'], { ownerId: 'mujica', troops: 5, terrainId: 'plains', building: null, buildingLevel: 0 }); seat(state, '2,0', 'sakiko');
  const battle = go(state, { type: 'attack', fromKey: '1,0', toKey: '2,0' }).battle;
  assert.deepEqual(battle.units.filter(unit => unit.side === 'attacker').map(unit => unit.rank), ['SSR', 'SR', 'R', 'N', 'N', 'N']);
});

test('an army marches through its own land and carries its leaders', () => {
  let state = createGame('march');
  Object.assign(state.tiles['-1,1'], { ownerId: 'lord', troops: 1, terrainId: 'plains' });
  state = go(state, { type: 'move', fromKey: '0,0', toKey: '0,1', troops: 5, girls: ['nina', 'momoka'] });
  assert.equal(state.tiles['0,1'].troops, 8);
  assert.deepEqual(state.tiles['0,1'].field, ['nina', 'momoka']);
  assert.deepEqual(state.tiles['0,0'].field, ['subaru', 'tomo'], 'whoever was not picked stays behind');
  assert.equal(state.tiles['0,1'].elite.R, 1);
  assert.equal(state.tiles['0,0'].elite, undefined);
  assert.equal(state.ap, 3, 'marching spends supply, not orders');
  assert.equal(perform(state, { type: 'move', fromKey: '0,1', toKey: '-1,1', troops: 2 }).ok, false, 'one march a turn');
});

test('land cut off from the capital earns nothing and leaves after two turns', () => {
  let state = createGame('enclave');
  state.turn = 9;
  const far = ['-1,2', '-2,2'];
  for (const key of far) Object.assign(state.tiles[key], { ownerId: 'lord', troops: 4, terrainId: 'plains', discovered: true });
  for (const key of ['-1,1', '0,1']) Object.assign(state.tiles[key], { ownerId: null, troops: 0 });
  state = go(state, { type: 'stance', characterId: 'nina', stay: true });
  assert.equal(state.tiles['-1,2'].cutSince, 9);
  assert.equal(getTileStats(state, '-1,2').gold, 0);
  assert.equal(perform(state, { type: 'recruit', key: '-1,2' }).ok, false);
  assert.ok(state.notices.some(item => item.kind === 'cut'));
  for (let i = 0; i < 2; i++) { state = go(state, { type: 'endTurn' }); while (state.battle) state = go(go(state, { type: 'battleAuto' }), { type: 'finishBattle' }); }
  assert.equal(state.tiles['-1,2'].ownerId, null);
  assert.equal(state.tiles['-1,2'].troops, 4, 'the people stay on as natives');
  assert.equal(deserializeGame(serializeGame(state)).ok, true);
});

test('a tile with only Sazai is taken without a fight, half its people staying', () => {
  let state = createGame('occupy');
  state.turn = 8; war(state);
  Object.assign(state.tiles['1,0'], { troops: 4 });
  Object.assign(state.tiles['2,0'], { ownerId: 'mujica', troops: 10, terrainId: 'plains', building: null, buildingLevel: 0 });
  assert.equal(previewAttack(state, '1,0', '2,0').occupy, true);
  const home = state.tiles['3,-4'].troops + state.tiles['4,-3'].troops + state.tiles['4,-4'].troops;
  state = go(state, { type: 'attack', fromKey: '1,0', toKey: '2,0' });
  assert.equal(state.battle, null);
  assert.equal(state.tiles['2,0'].ownerId, 'lord');
  assert.equal(state.tiles['2,0'].troops, 8);
  assert.equal(state.tiles['3,-4'].troops + state.tiles['4,-3'].troops + state.tiles['4,-4'].troops, home + 5);
  assert.equal(perform(state, { type: 'attack', fromKey: '2,0', toKey: '3,0' }).ok, false, 'an army attacks once a turn');
  assert.equal(deserializeGame(serializeGame(state)).ok, true);
});

test('a girl on the tile means a real battle', () => {
  const state = createGame('defended');
  state.turn = 8; war(state);
  Object.assign(state.tiles['1,0'], { troops: 10 });
  Object.assign(state.tiles['2,0'], { ownerId: 'mujica', troops: 4, terrainId: 'plains', building: null, buildingLevel: 0 }); seat(state, '2,0', 'sakiko');
  assert.ok(go(state, { type: 'attack', fromKey: '1,0', toKey: '2,0' }).battle);
});

test('losing the capital moves the court to a fortress', () => {
  let state = createGame('fort-capital');
  state.turn = 8; war(state);
  Object.assign(state.tiles['3,-3'], { ownerId: 'lord', troops: 80, terrainId: 'plains' });
  Object.assign(state.tiles['3,-4'], { building: 'fort', buildingLevel: 1, troops: 6 });
  const capital = state.factions.mujica.capitalKey;
  state.tiles[capital].garrison = []; state.tiles[capital].field = []; delete state.tiles[capital].elite;
  state = go(state, { type: 'attack', fromKey: '3,-3', toKey: capital });
  assert.equal(state.battle, null, 'characterless non-fort capital is occupied directly');
  assert.equal(state.factions.mujica.capitalKey, '3,-4');
  assert.equal(state.factions.mujica.alive, true);
  assert.equal(state.tiles['4,-3'].ownerId, 'mujica');
});

test('with no fortress left, the whole country falls with its capital', () => {
  let state = createGame('fall');
  state.turn = 8; war(state);
  Object.assign(state.tiles['3,-3'], { ownerId: 'lord', troops: 80, terrainId: 'plains' });
  const capital = state.factions.mujica.capitalKey;
  state.tiles[capital].garrison = []; state.tiles[capital].field = []; delete state.tiles[capital].elite;
  state = go(state, { type: 'attack', fromKey: '3,-3', toKey: capital });
  assert.equal(state.battle, null, 'characterless non-fort capital is occupied directly');
  assert.equal(state.factions.mujica.alive, false);
  for (const key of ['3,-4', '4,-3', capital]) assert.equal(state.tiles[key].ownerId, 'lord');
  assert.equal(state.characterOwners.sakiko, null);
  assert.ok(state.notices.some(item => item.kind === 'nation'));
  assert.equal(deserializeGame(serializeGame(state)).ok, true);
});

test('any of the four bands can start, under a name of your own', () => {
  for (const band of ['togenashi', 'mygo', 'mujica', 'kessoku']) {
    const state = createGame('band', { band, name: '  星之国  ' });
    assert.equal(state.factions.lord.name, '星之国');
    assert.equal(state.factions[band], undefined);
    assert.equal(state.factions.poppin.alive, true);
    assert.ok(state.recruitedHeroIds.length >= 4);
    assert.ok(state.recruitedHeroIds.every(id => state.characters[id].group === band && state.characterOwners[id] === 'lord'));
    assert.equal(state.activeHeroId, state.factions.lord.leaderId);
    assert.equal(deserializeGame(serializeGame(state)).ok, true);
  }
});

const fogEdge = state => Object.values(state.tiles).filter(tile => !tile.discovered && getActions(state, tile.key).some(action => action.type === 'explore' && action.enabled)).sort((a, b) => a.key.localeCompare(b.key))[0];
function discover(state) {
  for (let i = 0; i < 12; i++) {
    state.turn = 4 + i * 4; state.ap = 3; state.lastBirthTurn = 0; state.fogRolls = 3; state.factions.lord.supply = 50;
    for (const faction of Object.values(state.factions)) faction.graceUntilTurn = 99;
    const result = go(state, { type: 'explore', key: fogEdge(state).key });
    state = result;
    const born = Object.values(state.factions).find(faction => faction.foundedTurn === state.turn && !faction.isPlayer);
    if (born) return { state, born };
  }
  assert.fail('exploring never found a nation');
}

test('a nation does not exist until exploration finds it, and is sized around the player', () => {
  const weak = createGame('arrive'), strong = createGame('arrive');
  for (const tile of Object.values(strong.tiles)) if (tile.ownerId === 'lord') tile.troops = 90;
  assert.equal(weak.factions.roselia, undefined);
  let idle = weak;
  for (let i = 0; i < 12; i++) { idle = go(idle, { type: 'endTurn' }); while (idle.battle) idle = go(go(idle, { type: 'battleAuto' }), { type: 'finishBattle' }); }
  assert.equal(idle.factions.roselia, undefined, 'time alone brings no one out of the fog');
  const a = discover(weak), b = discover(strong);
  const land = run => Object.values(run.state.tiles).filter(tile => tile.ownerId === run.born.id);
  const people = run => land(run).reduce((sum, tile) => sum + tile.troops, 0);
  assert.ok(land(a).length >= 3);
  assert.ok(people(b) > people(a) * 2, 'a stronger player finds a stronger nation');
  assert.ok(land(b).some(tile => tile.discovered), 'part of it has been seen');
  assert.ok(land(b).some(tile => !tile.discovered), 'and the rest is still in the fog');
  assert.equal(getRelation(b.state, b.born.id).met, true);
  assert.ok(b.state.notices.some(item => item.kind === 'nation'));
  assert.equal(deserializeGame(serializeGame(b.state)).ok, true);
});

test('talks show their reasoning and answer by it', () => {
  let state = createGame('talks');
  const view = getRelation(state, 'mujica');
  assert.equal(view.status, 'neutral');
  assert.ok(view.offers.some(offer => offer.kind === 'pact'));
  state.relations['lord|mujica'] = { status: 'neutral', favor: 40, until: 0, since: 1, trade: false, talkTurn: 0 };
  const quote = diplomacyQuote(state, 'mujica', 'pact');
  assert.equal(quote.willing, quote.score >= quote.need);
  state = go(state, { type: 'propose', factionId: 'mujica', kind: 'trade' });
  assert.equal(state.relations['lord|mujica'].trade, true);
  assert.equal(perform(state, { type: 'propose', factionId: 'mujica', kind: 'pact' }).ok, false, 'one talk a turn');
});

test('the end of opening peace and any declaration reach the player as notices', () => {
  let state = createGame('notice');
  state.turn = 7;
  for (const faction of Object.values(state.factions)) faction.graceUntilTurn = 8;
  state = go(state, { type: 'endTurn' });
  while (state.battle) state = go(go(state, { type: 'battleAuto' }), { type: 'finishBattle' });
  assert.ok(state.notices.some(item => item.kind === 'era'));
  assert.notEqual(previewAttack(state, '1,0', '2,0').canAttack, true);
  state.relations['lord|mujica'] = { status: 'pact', favor: 0, until: 30, since: 1, trade: false, talkTurn: 0 };
  const broke = go(state, { type: 'declareWar', factionId: 'mujica' });
  assert.equal(broke.relations['lord|mujica'].status, 'war');
  assert.ok(broke.relations['lord|mygo'].favor <= (state.relations['lord|mygo']?.favor ?? 10) - 10 + 10);
});

test('an older save moves its Sazai and party onto the map', () => {
  const save = JSON.parse(serializeGame(createGame('old')));
  save.rulesVersion = 5; save.truces = { 'lord|mygo': 99 };
  for (const tile of Object.values(save.tiles)) { delete tile.garrison; delete tile.field; delete tile.food; delete tile.elite; }
  for (const faction of Object.values(save.factions)) faction.sazai = { R: 1, SR: 2, SSR: 0 };
  delete save.relations; delete save.notices; delete save.inbox;
  const result = deserializeGame(JSON.stringify(save));
  assert.equal(result.ok, true, result.error);
  assert.equal(result.state.rulesVersion, 9);
  assert.equal(result.state.tiles['0,0'].elite.SR, 2);
  assert.ok(result.state.tiles['0,0'].garrison.includes('rupa'));
  assert.deepEqual(result.state.tiles['1,0'].field, []);
  assert.equal(result.state.relations['lord|mygo'].status, 'truce');
});

test('free characters have one home: fallen commanders go free, then nations can claim them', () => {
  let state = createGame('free');
  state.turn = 8; war(state);
  Object.assign(state.tiles['3,-3'], { ownerId: 'lord', troops: 80, terrainId: 'plains' });
  const capital = state.factions.mujica.capitalKey;
  seat(state, '4,-3', 'sakiko');
  state.tiles[capital].garrison = []; state.tiles[capital].field = []; delete state.tiles[capital].elite;
  state.captives.umiri = { characterId: 'umiri', captorId: 'lord', originalFactionId: 'mujica', capturedTurn: 7, battleId: 'x' };
  state = go(state, { type: 'attack', fromKey: '3,-3', toKey: capital });
  assert.equal(state.battle, null, 'characterless non-fort capital is occupied directly');
  assert.equal(state.characterOwners.sakiko, null, 'not captured, so she is free');
  assert.equal(state.characterOwners.umiri, 'mujica', 'a prisoner stays a prisoner');
  assert.equal(getStats(state).recruitPool, Object.keys(state.characters).filter(id => state.characterOwners[id] === null && !state.captives[id]).length);
  state.captives.umiri && (state = go(state, { type: 'releaseCaptive', characterId: 'umiri' }));
  assert.equal(state.characterOwners.umiri, null, 'with her country gone she has no one to return to');
});

test('a nation found in the fog may already have free characters, who then cannot be recruited', () => {
  const state = createGame('draft');
  for (const tile of Object.values(state.tiles)) if (tile.ownerId === 'lord') tile.troops = 95;
  const before = getStats(state).recruitPool, run = discover(state);
  const crew = Object.keys(run.state.characters).filter(id => run.state.characterOwners[id] === run.born.id);
  assert.ok(crew.some(id => run.state.characters[id].group !== run.born.id), 'somebody from outside signed up');
  assert.ok(getStats(run.state).recruitPool < before);
  for (const id of crew) assert.notEqual(run.state.characterOwners[id], null);
});

test('AI nations settle fights by comparing strength, with no board, and can take prisoners', () => {
  let state = createGame('clash');
  state.turn = 8; war(state, 'mujica', 'mygo'); war(state, 'mujica', 'lord');
  for (const faction of Object.values(state.factions)) if (faction.id !== 'mujica') faction.graceUntilTurn = 0;
  state.factions.mujica.graceUntilTurn = 0;
  for (const key of ['-3,0', '-2,0']) Object.assign(state.tiles[key], { ownerId: 'mujica', troops: 60, terrainId: 'plains' });
  seat(state, '-3,0', 'sakiko', 'umiri', 'mutsumi');
  const capital = state.factions.mygo.capitalKey;
  Object.assign(state.tiles['-4,1'] ?? {}, {});
  state.tiles[capital].troops = 3; state.factions.mujica.supply = 500; state.factions.mujica.gold = 500;
  state = go(state, { type: 'endTurn' });
  while (state.battle) state = go(go(state, { type: 'battleAuto' }), { type: 'finishBattle' });
  assert.equal(state.tiles[capital].ownerId, 'mujica');
  assert.ok(state.turn === 9);
  assert.ok(Object.values(state.captives).some(item => item.captorId === 'mujica'), 'the winner took a prisoner');
  assert.equal(deserializeGame(serializeGame(state)).ok, true);
});

test('workshop content joins a new run: characters go free and nations wait in the fog', () => {
  const mod = { schemaVersion: 1, id: 'my.pack', name: '星潮', characters: [{ id: 'my.queen', name: '月汐', title: '执旗者', color: '#8c7da6', stats: { attack: 2, defense: 2, scout: 1, economy: 1 }, description: '来自彼端。' }], factions: [{ id: 'my.nation', name: '星潮王庭', color: '#8c7da6', leaderId: 'my.queen', personality: 'balanced' }] };
  const state = createGame('modded', { mods: [mod] });
  assert.equal(state.factions['my.nation'], undefined, 'nothing exists until it is found');
  assert.equal(state.characterOwners['my.queen'], null);
  const run = discover(state);
  assert.equal(run.born.id, 'my.nation');
  assert.equal(run.born.leaderId, 'my.queen');
  assert.equal(run.state.characterOwners['my.queen'], 'my.nation');
  assert.equal(deserializeGame(serializeGame(run.state)).ok, true);
});

test('over a long run every character keeps exactly one home', () => {
  let state = createGame('one-home');
  for (let i = 0; i < 70; i++) {
    state = go(state, { type: 'endTurn' });
    while (state.battle) state = go(go(state, { type: 'battleAuto' }), { type: 'finishBattle' });
    for (const item of [...state.inbox]) state = go(state, { type: 'answerOffer', id: item.id, accept: false });
    const seated = Object.values(state.tiles).flatMap(tile => [...tile.garrison, ...tile.field]);
    assert.equal(new Set(seated).size, seated.length, `turn ${state.turn}: seated twice`);
    for (const tile of Object.values(state.tiles)) for (const id of [...tile.garrison, ...tile.field]) assert.equal(state.characterOwners[id], tile.ownerId, `turn ${state.turn}: ${id} on foreign land`);
    for (const id of state.recruitedHeroIds) assert.ok(state.characterOwners[id] === 'lord', `turn ${state.turn}: ${id} is listed as ours but belongs to ${state.characterOwners[id]}`);
    for (const captive of Object.values(state.captives)) assert.equal(state.characterOwners[captive.characterId], captive.originalFactionId);
  }
  assert.equal(deserializeGame(serializeGame(state)).ok, true);
});

test('prisoners can be talked round, sent home, sold back, and may slip away', () => {
  let state = createGame('jail');
  const capture = id => { state.characterOwners[id] = 'mujica'; state.captives[id] = { characterId: id, captorId: 'lord', originalFactionId: 'mujica', capturedTurn: 1, battleId: 'x' }; };
  for (const id of ['sakiko', 'umiri', 'mutsumi']) { for (const tile of Object.values(state.tiles)) { tile.garrison = tile.garrison.filter(item => item !== id); tile.field = tile.field.filter(item => item !== id); } capture(id); }
  state.factions.lord.gold = 200; state.factions.mujica.gold = 200;
  // Rules9 positive negotiation case: Sakiko is an ordinary member of a peaceful
  // government here, not its saved leader. Leader refusal has separate tests.
  state.factions.mujica.leaderId = 'mutsumi';
  const before = state.factions.lord.gold;
  state = go(state, { type: 'persuade', characterId: 'sakiko', way: 'gift' });
  assert.ok(state.captives.sakiko.progress > 0);
  assert.equal(state.factions.lord.gold, before - 15);
  assert.equal(perform(state, { type: 'persuade', characterId: 'sakiko', way: 'talk' }).ok, false, 'once a turn');
  const risk = escapeRisk(state, 'umiri');
  const pressureBranch = go(structuredClone(state), { type: 'persuade', characterId: 'umiri', way: 'press' });
  assert.ok(escapeRisk(pressureBranch, 'umiri') > risk, 'pressure builds a grudge');
  state.captives.sakiko.progress = 96; state.captives.sakiko.talkTurn = 0;
  state = go(state, { type: 'persuade', characterId: 'sakiko', way: 'gift' });
  assert.equal(state.characterOwners.sakiko, 'mujica', 'preparation never autojoins');
  assert.equal(state.captives.sakiko.progress, 100);
  state = go(state, { type: 'recruitCaptive', characterId: 'sakiko' });
  assert.equal(state.characterOwners.sakiko, 'lord');
  assert.ok(state.recruitedHeroIds.includes('sakiko'));
  assert.equal(state.captives.sakiko, undefined);
  const gold = state.factions.lord.gold;
  state = go(state, { type: 'sellCaptive', characterId: 'umiri' });
  assert.ok(state.factions.lord.gold > gold);
  assert.equal(state.characterOwners.umiri, 'mujica');
  state.captives.mutsumi.grudge = 100;
  let ran = false;
  for (let i = 0; i < 40 && !ran; i++) { state = go(state, { type: 'endTurn' }); while (state.battle) state = go(go(state, { type: 'battleAuto' }), { type: 'finishBattle' }); ran = !state.captives.mutsumi; if (state.captives.mutsumi) state.captives.mutsumi.grudge = 100; }
  assert.ok(ran, 'an angry prisoner gets away eventually');
  assert.ok(state.notices.some(item => /逃跑/.test(item.text)));
  assert.equal(deserializeGame(serializeGame(state)).ok, true);
});

test('land decides what can be built on it', () => {
  const state = createGame('land');
  state.factions.lord.gold = 200; state.factions.lord.supply = 200;
  const built = terrainId => { Object.assign(state.tiles['1,0'], { terrainId, building: null, buildingLevel: 0, troops: 6 }); return getActions(state, '1,0').filter(action => action.type === 'build').map(action => action.action.building).sort(); };
  assert.deepEqual(built('hills'), ['fort', 'quarry']);
  assert.deepEqual(built('forest'), ['fort', 'lumber']);
  assert.deepEqual(built('ruins'), ['camp', 'fort']);
  assert.deepEqual(built('snow'), ['fort']);
  assert.ok(built('plains').includes('farm'));
  Object.assign(state.tiles['1,0'], { terrainId: 'hills' });
  assert.equal(perform(state, { type: 'build', key: '1,0', building: 'farm' }).ok, false);
  const after = go(state, { type: 'build', key: '1,0', building: 'quarry' });
  assert.equal(getTileStats(after, '1,0').fullGold, getTileStats(state, '1,0').fullGold + 4);
  assert.equal(deserializeGame(serializeGame(after)).ok, true);
});

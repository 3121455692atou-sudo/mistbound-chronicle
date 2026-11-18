import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workspace = mkdtempSync(resolve(tmpdir(), 'mistbound-cli-'));
after(() => rmSync(workspace, { recursive: true, force: true }));

function run(args, input) {
  const child = spawnSync(process.execPath, ['tools/cli.mjs', ...args], {
    cwd: project, input, encoding: 'utf8', timeout: 60000, maxBuffer: 8 * 1024 * 1024,
  });
  assert.equal(child.error, undefined, child.error?.message);
  let data;
  try { data = JSON.parse(child.stdout); }
  catch { assert.fail(`CLI stdout must be JSON.\nstdout=${child.stdout}\nstderr=${child.stderr}`); }
  return { code: child.status, data, stderr: child.stderr };
}

function success(args, input) {
  const result = run(args, input);
  assert.equal(result.code, 0, JSON.stringify(result));
  assert.equal(result.data.ok, true, JSON.stringify(result.data));
  return result.data;
}

function init(name, seed = 'cli-regression') {
  const file = resolve(workspace, `${name}.json`);
  success(['init', '--seed', seed, '--out', file]);
  return file;
}

function inspect(file) {
  return success(['inspect', '--save', file, '--full']).state;
}

function action(file, value) {
  return success(['action', '--save', file, '--json', JSON.stringify(value)]);
}

function reachBattle(file) {
  // Paid actions follow a visible frontier, never editing the world or assuming AI leaves 3,0 vacant.
  action(file, { type: 'move', fromKey: '0,0', toKey: '1,0', troops: 8 });
  action(file, { type: 'claim', key: '2,0' });
  action(file, { type: 'endTurn' });
  let report = success(['inspect', '--save', file, '--full']);
  if (!report.battle) action(file, { type: 'move', fromKey: '1,0', toKey: '2,0', troops: Math.min(8, report.state.tiles['1,0'].troops - 1) });
  report = success(['inspect', '--save', file, '--full']);
  while (!report.battle && report.game.turn < 8) {
    action(file, { type: 'endTurn' });
    report = success(['inspect', '--save', file, '--full']);
  }
  const steps = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
  for (let attempts = 0; !report.battle && attempts < 12; attempts++) {
    const state = report.state;
    if (state.ap < 1) { action(file, { type: 'endTurn' }); report=success(['inspect','--save',file,'--full']); continue; }
    const candidates = Object.values(state.tiles).filter(t => t.ownerId === state.playerId && t.field.length && t.foughtTurn !== state.turn)
      .flatMap(from => steps.map(([q,r]) => ({ from, to: state.tiles[`${from.q+q},${from.r+r}`] })))
      .filter(({to}) => to?.discovered && to.ownerId && to.ownerId !== state.playerId)
      .sort((a,b) => Number(b.to.isCapital)-Number(a.to.isCapital) || b.from.troops-a.from.troops);
    const pick = candidates[0];
    if (pick) {
      const relation = state.relations[[state.playerId,pick.to.ownerId].sort().join('|')];
      if (relation?.status !== 'war') action(file, { type: 'declareWar', factionId: pick.to.ownerId });
      action(file, { type: 'attack', fromKey: pick.from.key, toKey: pick.to.key });
    } else action(file, { type: 'endTurn' });
    report = success(['inspect', '--save', file, '--full']);
    if (!report.battle && report.game.ap === 0) { action(file, { type: 'endTurn' }); report=success(['inspect','--save',file,'--full']); }
  }
  assert.equal(report.battle?.phase, 'player', 'normal frontier actions should enter a tactical battle');
  return report;
}

function assertExistingTilesPreserved(before, after) {
  for (const [key, tile] of Object.entries(before.tiles)) {
    const { discovered, ...existing } = tile;
    const { discovered: revealed, ...current } = after.tiles[key] || {};
    assert.deepEqual(current, existing, `existing terrain or ownership changed: ${key}`);
    if (discovered) assert.equal(revealed, true, `discovery regressed: ${key}`);
  }
}

test('help and unknown commands expose machine-readable results', () => {
  assert.ok(success(['help']).commands['apply-mod']);
  const invalid = run(['not-a-command']);
  assert.equal(invalid.code, 1);
  assert.equal(invalid.data.ok, false);
  assert.equal(invalid.data.code, 'UNKNOWN_COMMAND');
});

test('initialization round-trips and refuses accidental overwrite', () => {
  const first = init('initial-a');
  const second = init('initial-b');
  const state = inspect(first);
  assert.equal(state.schemaVersion, 1);
  assert.deepEqual(state.tiles, inspect(second).tiles);
  const bytes = readFileSync(first, 'utf8');
  const denied = run(['init', '--seed', 'another-seed', '--out', first]);
  assert.equal(denied.code, 1);
  assert.equal(denied.data.code, 'FILE_EXISTS');
  assert.equal(readFileSync(first, 'utf8'), bytes);
});

test('a generated character can be added to a save and reloaded', () => {
  const save = init('character-save');
  const mod = resolve(workspace, 'iris.mod.json');
  success(['create-character', '--id', 'test.iris', '--name', '伊莉丝', '--scout', '2', '--out', mod]);
  success(['validate-mod', '--mod', mod, '--save', save]);
  success(['apply-mod', '--save', save, '--mod', mod]);
  const state = inspect(save);
  assert.equal(state.characters['test.iris'].name, '伊莉丝');
  assert.equal(state.characters['test.iris'].stats.scout, 2);
});

test('a generated faction joins midgame with its own valid leader and preserves old tiles', () => {
  const save = init('faction-save');
  success(['action', '--save', save, '--json', '{"type":"endTurn"}']);
  const before = inspect(save);
  const mod = resolve(workspace, 'tide.mod.json');
  success(['create-faction', '--id', 'test.tide', '--name', '银潮同盟', '--leader-name', '瑟琳', '--personality', 'builder', '--out', mod]);
  success(['apply-mod', '--save', save, '--mod', mod]);
  const after = inspect(save);
  assert.equal(after.turn, before.turn);
  assert.equal(after.factions['test.tide'].leaderId, 'test.tide.leader');
  assert.ok(Object.values(after.tiles).some(tile => tile.ownerId === 'test.tide' && tile.isCapital));
  assertExistingTilesPreserved(before, after);
});

test('duplicate and broken-reference Mods leave the input file byte-identical', () => {
  const save = init('rejection-save');
  const mod = resolve(project, 'examples/faction.mod.json');
  success(['apply-mod', '--save', save, '--mod', mod]);
  const before = readFileSync(save, 'utf8');
  const duplicate = run(['apply-mod', '--save', save, '--mod', mod]);
  assert.equal(duplicate.code, 1);
  assert.equal(duplicate.data.ok, false);
  assert.equal(readFileSync(save, 'utf8'), before);
  const invalidPath = resolve(workspace, 'invalid.mod.json');
  writeFileSync(invalidPath, JSON.stringify({ schemaVersion: 1, id: 'test.broken', name: 'Broken reference', factions: [{ id: 'test.unknown', name: 'Unknown', color: '#90aabb', leaderId: 'does.not.exist' }] }));
  const invalid = run(['apply-mod', '--save', save, '--mod', invalidPath]);
  assert.equal(invalid.code, 1);
  assert.equal(invalid.data.code, 'INVALID_MOD');
  assert.equal(readFileSync(save, 'utf8'), before);
});

test('action accepts stdin, upgrades buildings, and rejected input never writes', () => {
  const save = init('action-save');
  const turn = inspect(save).turn;
  success(['action', '--save', save, '--stdin'], '{"type":"endTurn"}');
  assert.equal(inspect(save).turn, turn + 1);
  success(['action', '--save', save, '--json', '{"type":"build","key":"0,0","building":"farm"}']);
  success(['action', '--save', save, '--json', '{"type":"upgrade","key":"0,0"}']);
  const tileDetail = success(['inspect', '--save', save, '--tile', '0,0']);
  assert.equal(tileDetail.tile.buildingLevel, 2);
  assert.equal(tileDetail.tileStats.buildingLevel, 2);
  const before = readFileSync(save, 'utf8');
  const invalidJSON = run(['action', '--save', save, '--json', '{']);
  assert.equal(invalidJSON.code, 1);
  assert.equal(invalidJSON.data.code, 'INVALID_JSON');
  const illegalAction = run(['action', '--save', save, '--json', '{"type":"build","key":"9999,9999","building":"farm"}']);
  assert.equal(illegalAction.code, 1);
  assert.equal(illegalAction.data.code, 'GAME_RULE_REJECTED');
  assert.equal(readFileSync(save, 'utf8'), before);
});

test('frontier expansion preserves every existing tile through serialization', () => {
  const save = init('expansion-save');
  const before = inspect(save);
  success(['action', '--save', save, '--json', '{"type":"expand","radius":2}']);
  const after = inspect(save);
  assert.ok(Object.keys(after.tiles).length > Object.keys(before.tiles).length);
  assertExistingTilesPreserved(before, after);
});

test('simulate advances real engine turns and writes a separate branch', () => {
  const save = init('simulate-save');
  const before = inspect(save);
  const bytes = readFileSync(save, 'utf8');
  const output = resolve(workspace, 'simulated.json');
  const result = success(['simulate', '--save', save, '--turns', '5', '--out', output]);
  assert.equal(result.policy, 'hold');
  assert.equal(result.battlePolicy, 'engine-auto');
  assert.equal(result.turnsAdvanced, 5);
  assert.equal(result.stoppedBecause, 'requested_turns_completed');
  assert.equal(readFileSync(save, 'utf8'), bytes);
  const after = inspect(output);
  assert.equal(after.turn - before.turn, result.turnsAdvanced);
  assert.notDeepEqual(after.tiles, before.tiles, 'AI turns should change the world');
});

test('example packs validate and invalid generated values are rejected by the engine', () => {
  for (const file of ['character.mod.json', 'faction.mod.json', 'terrain.mod.json']) {
    success(['validate-mod', '--mod', resolve(project, 'examples', file)]);
  }
  const out = resolve(workspace, 'invalid-character.mod.json');
  const invalid = run(['create-character', '--id', 'test.invalid', '--name', 'Invalid', '--scout', '3', '--out', out]);
  assert.equal(invalid.code, 1);
  assert.equal(invalid.data.code, 'INVALID_MOD');
  assert.equal(existsSync(out), false);
});

test('simulate keeps the same world running over consecutive long commands', () => {
  const save = init('long-world', 'cli-persistent-world');
  const initial = inspect(save);
  const first = success(['simulate', '--save', save, '--turns', '40']);
  assert.equal(first.turnsAdvanced, 40);
  assert.equal(first.game.status, 'playing');
  const second = success(['simulate', '--save', save, '--turns', '40']);
  assert.equal(second.turnsAdvanced, 40);
  const after = inspect(save);
  assert.equal(after.turn, initial.turn + 80);
  assert.equal(after.seed, initial.seed);
  assert.equal(after.playerId, initial.playerId);
  assert.equal(after.status, 'playing');
  for (const id of Object.keys(initial.characters)) assert.ok(after.characters[id], `original character lost: ${id}`);
});

test('legacy v1 save flags migrate into the same continuing world', () => {
  const original = JSON.parse(readFileSync(resolve(project, 'tools/fixtures/legacy-v1.json'), 'utf8'));
  for (const status of ['playing', 'won', 'lost']) {
    const file = resolve(workspace, `legacy-${status}.json`);
    const legacy = structuredClone(original);
    legacy.status = status;
    legacy.victoryType = status === 'won' ? 'prosperity' : null;
    writeFileSync(file, JSON.stringify(legacy));
    const migrated = inspect(file);
    assert.equal(migrated.status, 'playing');
    assert.equal(migrated.rulesVersion, 9);
    assert.equal(migrated.seed, original.seed);
    assert.equal(migrated.playerId, original.playerId);
    for (const [key, tile] of Object.entries(original.tiles)) {
      assert.equal(migrated.tiles[key].terrainId, tile.terrainId, `legacy terrain changed: ${key}`);
      assert.equal(migrated.tiles[key].ownerId, tile.ownerId, `legacy owner changed: ${key}`);
    }
    const result = success(['simulate', '--save', file, '--turns', '2']);
    assert.equal(result.turnsAdvanced, 2);
    assert.equal(result.game.seed, original.seed);
    assert.equal(result.game.status, 'playing');
  }
});

test('an active battlefield saves, exposes legal moves, and resumes through public CLI actions', () => {
  const save = init('battle-save', 'cli-tactical-frontier');
  const entered = reachBattle(save);
  const initialUnits = Array.isArray(entered.battle.units) ? entered.battle.units : Object.values(entered.battle.units);
  const movesAway = item => {
    const unit = initialUnits.find(candidate => candidate.id === item.unitId);
    return item.options.moves?.filter(point => point.x !== unit.x || point.y !== unit.y) || [];
  };
  const entry = entered.actionableUnits.find(item => movesAway(item).length);
  assert.ok(entry, 'inspect should expose a movable friendly unit from the engine');
  const move = movesAway(entry)[0];
  action(save, { type: 'battleMove', unitId: entry.unitId, x: move.x, y: move.y });
  const afterMove = success(['inspect', '--save', save, '--full']);
  const units = Array.isArray(afterMove.battle.units) ? afterMove.battle.units : Object.values(afterMove.battle.units);
  const unit = units.find(item => item.id === entry.unitId);
  assert.equal(unit.x, move.x);
  assert.equal(unit.y, move.y);
  assert.equal(afterMove.game.turn, entered.game.turn, 'a tactical move must not advance the world turn');
  const bytes = readFileSync(save, 'utf8');
  const illegal = run(['action', '--save', save, '--json', JSON.stringify({ type: 'battleMove', unitId: entry.unitId, x: -999, y: -999 })]);
  assert.equal(illegal.code, 1);
  assert.equal(readFileSync(save, 'utf8'), bytes);
  const output = resolve(workspace, 'after-battle.json');
  const simulation = success(['simulate', '--save', save, '--turns', '2', '--out', output]);
  assert.equal(simulation.turnsAdvanced, 2);
  assert.ok(simulation.battlesResolved >= 1);
  assert.ok(simulation.tacticalCommands >= 2);
  const completed = success(['inspect', '--save', output, '--full']);
  assert.equal(completed.battle, null);
  assert.equal(completed.game.turn, entered.game.turn + 2);
  assert.equal(completed.game.seed, entered.game.seed);
  assert.equal(readFileSync(save, 'utf8'), bytes);
});

test('battle captives come from the losing participants and survive a file round-trip', () => {
  const save = init('captive-save', 'cli-captive-frontier');
  const entered = reachBattle(save);
  const participants = new Set(entered.battle.participantIds[entered.battle.playerSide]);
  assert.ok(participants.size > 0, 'the test requires actual named participants');
  const fixture = JSON.parse(readFileSync(save, 'utf8'));
  const fallen = fixture.battle.units.find(unit => unit.characterId && unit.side === fixture.battle.playerSide);
  fallen.hp = 0; fallen.soldiers = 0; // Declared fixture: she fell before the retreat.
  fixture.characterOwners.anon = fixture.playerId; fixture.recruitedHeroIds.push('anon'); // Somebody stays free, so she can be taken.
  writeFileSync(save, JSON.stringify(fixture));
  action(save, { type: 'battleRetreat' });
  const result = success(['inspect', '--save', save, '--full']);
  assert.equal(result.battle.phase, 'result');
  assert.equal(result.battle.result.playerWon, false);
  action(save, { type: 'finishBattle' });
  const settled = success(['inspect', '--save', save, '--full']);
  const captured = settled.captives.filter(item => participants.has(item.characterId));
  assert.ok(captured.length >= 1 && captured.length <= Math.min(2, participants.size));
  for (const captive of captured) {
    assert.equal(captive.originalFactionId, entered.game.playerId);
    assert.notEqual(captive.captorId, entered.game.playerId);
    assert.ok(Object.hasOwn(captive, 'actions'), 'inspect should expose engine-authoritative captive actions');
  }
  const copy = resolve(workspace, 'captives-imported.json');
  writeFileSync(copy, readFileSync(save));
  const reloaded = success(['inspect', '--save', copy, '--full']);
  assert.deepEqual(reloaded.state.captives, settled.state.captives);
  assert.deepEqual(reloaded.state.characterOwners, settled.state.characterOwners);
  assert.equal(reloaded.game.seed, entered.game.seed);
});

test('public CLI recovery and food purchase work with zero orders and preserve rejected-save bytes', () => {
  const file=init('zero-orders-food','cli-food-recovery');
  for(const key of ['0,0','1,0','0,1']) action(file,{type:'emergencyFarm',key});
  const before=inspect(file);assert.equal(before.ap,0);
  action(file,{type:'buySupply',amount:3});
  const bought=inspect(file);assert.equal(bought.ap,0);
  assert.equal(bought.factions.lord.supply,before.factions.lord.supply+3);
  assert.equal(bought.factions.lord.gold,before.factions.lord.gold-12);
  action(file,{type:'demobilize',key:'0,0',troops:1});
  const cut=inspect(file);assert.equal(cut.ap,0);assert.equal(cut.tiles['0,0'].troops,bought.tiles['0,0'].troops-1);
  const bytes=readFileSync(file,'utf8');
  const rejected=run(['action','--save',file,'--json',JSON.stringify({type:'buySupply',amount:1.5})]);
  assert.equal(rejected.code,1);assert.equal(readFileSync(file,'utf8'),bytes);
  action(file,{type:'undo'});assert.equal(inspect(file).tiles['0,0'].troops,bought.tiles['0,0'].troops);
});

test('inspect selection returns directly executable troops and named-party action',()=>{
  const file=init('selected-party','cli-selection');const bytes=readFileSync(file,'utf8');
  const preview=success(['inspect','--save',file,'--tile','1,0','--from','0,0','--troops','2','--girls','nina']);
  const move=preview.actions.find(a=>a.type==='move');assert.equal(move.enabled,true);assert.equal(move.action.troops,2);assert.deepEqual(move.action.girls,['nina']);assert.equal(readFileSync(file,'utf8'),bytes);
  action(file,move.action);const state=inspect(file);assert.ok(state.tiles['1,0'].field.includes('nina'));assert.ok(state.tiles['0,0'].field.includes('momoka'));assert.equal(success(['version']).rulesVersion,10);
  const stable=readFileSync(file,'utf8');for(const extra of [['--troops','-1'],['--girls','unknown'],['--girls','momoka,momoka']]){assert.equal(run(['inspect','--save',file,'--tile','1,0','--from','0,0',...extra]).code,1);assert.equal(readFileSync(file,'utf8'),stable);}
});

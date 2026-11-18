#!/usr/bin/env node
/**
 * Mistbound Chronicle: dependency-free CLI over the browser's game engine.
 * stdout is always JSON. Rejected actions never write to a save.
 */
import { readFile, writeFile, mkdir, rename, link, unlink } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { randomBytes } from 'node:crypto';
import {
  createGame, perform, getStats, getTileStats, getActions, getBattleOptions, getCaptiveActions, getCaptiveStatus, RULES_VERSION,
  serializeGame, deserializeGame, validateMod,
} from '../dist/engine.mjs';

const VERSION = '0.2.0';
const booleanFlags = new Set(['help', 'version', 'full', 'force', 'replace', 'stdin']);
const commands = {
  init: ['seed', 'out', 'force'],
  inspect: ['save', 'full', 'tile', 'from', 'troops', 'girls'],
  action: ['save', 'json', 'action-file', 'stdin', 'out'],
  simulate: ['save', 'turns', 'out'],
  'validate-mod': ['mod', 'file', 'save'],
  'create-character': ['id', 'name', 'title', 'color', 'portrait', 'description', 'trait', 'attack', 'defense', 'scout', 'economy', 'pack-id', 'pack-name', 'replace', 'save', 'out', 'force'],
  'create-faction': ['id', 'name', 'color', 'personality', 'leader-id', 'leader-name', 'title', 'portrait', 'description', 'trait', 'attack', 'defense', 'scout', 'economy', 'pack-id', 'pack-name', 'save', 'out', 'force'],
  'apply-mod': ['save', 'mod', 'file', 'out'],
};

class CliError extends Error {
  constructor(code, message, details) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

function emit(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function parseArgs(argv) {
  let command = argv[0] || 'help';
  if (command === '-h' || command === '--help') return { command: 'help', options: {} };
  if (command === '--version') return { command: 'version', options: {} };
  const options = {};
  for (let i = 1; i < argv.length; i++) {
    let argument = argv[i];
    if (argument === '-h') argument = '--help';
    if (!argument.startsWith('--')) throw new CliError('INVALID_ARGUMENT', `未知参数：${argument}。请使用 --参数 值。`);
    const separator = argument.indexOf('=');
    const key = argument.slice(2, separator < 0 ? undefined : separator);
    if (Object.hasOwn(options, key)) throw new CliError('DUPLICATE_ARGUMENT', `参数 --${key} 重复。`);
    if (booleanFlags.has(key)) {
      if (separator >= 0) throw new CliError('INVALID_ARGUMENT', `--${key} 是开关，不需要值。`);
      options[key] = true;
    } else if (separator >= 0) {
      options[key] = argument.slice(separator + 1);
    } else {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) throw new CliError('MISSING_ARGUMENT', `缺少 --${key} 的值。`);
      options[key] = argv[++i];
    }
  }
  if (options.help) return { command: 'help', options: { for: command } };
  if (options.version) return { command: 'version', options: {} };
  if (!Object.hasOwn(commands, command) && command !== 'help' && command !== 'version') {
    throw new CliError('UNKNOWN_COMMAND', `未知命令：${command}。运行 node tools/cli.mjs help 查看命令。`);
  }
  const allowed = new Set(commands[command] || []);
  for (const key of Object.keys(options)) {
    if (!allowed.has(key)) throw new CliError('UNKNOWN_OPTION', `${command} 不支持 --${key}。`);
  }
  return { command, options };
}

function required(options, key) {
  if (typeof options[key] !== 'string' || !options[key].trim()) {
    throw new CliError('MISSING_ARGUMENT', `缺少 --${key}。`);
  }
  return options[key];
}

function integer(options, key, fallback, min = -Infinity, max = Infinity) {
  const value = options[key] === undefined ? fallback : Number(options[key]);
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    const range = Number.isFinite(min) && Number.isFinite(max) ? `${min} 到 ${max} 之间的整数` : '安全范围内的整数';
    throw new CliError('INVALID_NUMBER', `--${key} 必须为${range}。`);
  }
  return value;
}

function parseJSON(text, label) {
  try { return JSON.parse(text); }
  catch (error) { throw new CliError('INVALID_JSON', `${label} 不是有效 JSON：${error.message}`); }
}

async function readJSON(file, label = '文件') {
  return parseJSON(await readFile(resolve(file), 'utf8'), label);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

async function loadSave(file) {
  const result = deserializeGame(await readFile(resolve(file), 'utf8'));
  if (!result?.ok) throw new CliError('INVALID_SAVE', result?.error || '存档未通过引擎校验。');
  return result.state;
}

async function optionalSave(options) {
  return options.save ? loadSave(options.save) : undefined;
}

async function atomicWrite(file, text, overwrite) {
  const absolute = resolve(file);
  await mkdir(dirname(absolute), { recursive: true });
  const temporary = resolve(dirname(absolute), `.${basename(absolute)}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`);
  try {
    await writeFile(temporary, text, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
    if (overwrite) {
      await rename(temporary, absolute);
    } else {
      // A hard link makes a new-file write refuse concurrent or existing targets.
      await link(temporary, absolute);
      await unlink(temporary);
    }
  } catch (error) {
    if (error.code === 'EEXIST') throw new CliError('FILE_EXISTS', `${absolute} 已存在；新建文件需要另选路径，或显式加 --force。`);
    throw error;
  } finally {
    await unlink(temporary).catch(() => {});
  }
  return absolute;
}

async function saveState(state, file, overwrite = true) {
  const text = serializeGame(state);
  if (typeof text !== 'string') throw new CliError('ENGINE_CONTRACT', 'serializeGame 必须返回 JSON 字符串。');
  const roundTrip = deserializeGame(text);
  if (!roundTrip?.ok) throw new CliError('INVALID_ENGINE_SAVE', roundTrip?.error || '引擎生成的存档无法读回。');
  return atomicWrite(file, `${text.trimEnd()}\n`, overwrite);
}

function summary(state) {
  return {
    schemaVersion: state.schemaVersion,
    rulesVersion: state.rulesVersion,
    seed: state.seed,
    turn: state.turn,
    ap: state.ap,
    maxAP: state.maxAP,
    playerId: state.playerId,
    activeHeroId: state.activeHeroId,
    companionId: state.companionId ?? null,
    status: state.status,
    revision: state.revision,
    counts: {
      tiles: Object.keys(state.tiles).length,
      factions: Object.keys(state.factions).length,
      characters: Object.keys(state.characters).length,
      terrainTypes: Object.keys(state.terrainTypes).length,
      captives: Object.keys(state.captives || {}).length,
    },
    stats: getStats(state),
  };
}

function inspectBattle(state) {
  if (!state.battle) return { battle: null, actionableUnits: [], battleActions: [] };
  const battle = state.battle;
  const units = Array.isArray(battle.units) ? battle.units : Object.values(battle.units || {});
  const actionableUnits = battle.phase === 'player' ? units
    .filter(unit => unit.side === battle.playerSide && unit.hp > 0)
    .map(unit => ({ unitId: unit.id, characterId: unit.characterId ?? null, options: getBattleOptions(state, unit.id) }))
    .filter(item => item.options.ok && (item.options.moves?.length || item.options.targets?.length || item.options.canSkill || item.options.canWait)) : [];
  const battleActions = battle.phase === 'result'
    ? [{ type: 'finishBattle' }]
    : [{ type: 'battleEndTurn' }, { type: 'battleAuto' }, { type: 'battleRetreat' }];
  return { battle, actionableUnits, battleActions };
}

function inspectCaptives(state) {
  return Object.values(state.captives || {}).map(captive => ({
    ...captive,
    name: state.characters[captive.characterId]?.name || captive.characterId,
    isPlayerCharacter: captive.originalFactionId === state.playerId,
    isHeldByPlayer: captive.captorId === state.playerId,
    status: getCaptiveStatus(state, captive.characterId),
    actions: getCaptiveActions(state, captive.characterId),
  }));
}

function accepted(result) {
  if (!result?.ok || !result.state) {
    throw new CliError('GAME_RULE_REJECTED', result?.error || '该指令未通过游戏规则校验。', result?.detail);
  }
  return result;
}

function checkMod(mod, state) {
  const result = validateMod(mod, state);
  if (!result?.ok) throw new CliError('INVALID_MOD', 'Mod 未通过引擎校验。', { errors: result?.errors || ['未知校验错误'] });
  return result;
}

function character(options, id, name) {
  const definition = {
    id,
    name,
    title: options.title || '边境来客',
    color: options.color || '#80bdb2',
    stats: {
      attack: integer(options, 'attack', 3),
      defense: integer(options, 'defense', 2),
      scout: integer(options, 'scout', 1),
      economy: integer(options, 'economy', 2),
    },
    description: options.description || '从迷雾彼端抵达的旅人，以自己的专长参与诸国的未来。',
  };
  if (options.portrait) definition.portrait = options.portrait;
  if (options.trait) definition.trait = options.trait;
  return definition;
}

function pack(options, id, name) {
  return {
    schemaVersion: 1,
    id: options['pack-id'] || `user.${id}`,
    name: options['pack-name'] || `${name} · 内容包`,
    replaceExisting: Boolean(options.replace),
  };
}

async function outputMod(command, mod, options) {
  checkMod(mod, await optionalSave(options));
  const file = options.out ? await atomicWrite(options.out, `${JSON.stringify(mod, null, 2)}\n`, Boolean(options.force)) : null;
  return { ok: true, command, file, mod };
}

function help(command) {
  const reference = {
    init: 'init --seed mistbound --out saves/world.json [--force]',
    inspect: 'inspect --save saves/world.json [--full | --tile 0,0 --from 1,0 [--troops 2 --girls nina,momoka|none]]',
    action: 'action --save saves/world.json (--json JSON | --action-file action.json | --stdin) [--out saves/next.json]',
    simulate: 'simulate --save saves/world.json --turns 5 [--out saves/after.json]',
    'validate-mod': 'validate-mod --mod examples/faction.mod.json [--save saves/world.json]',
    'create-character': 'create-character --id user.iris --name 伊莉丝 [--attack 3 --defense 2 --scout 1 --economy 2] [--out mods/iris.json]',
    'create-faction': 'create-faction --id user.tide --name 银潮同盟 [--leader-name 瑟琳 --personality builder] [--out mods/tide.json]',
    'apply-mod': 'apply-mod --save saves/world.json --mod mods/tide.json [--out saves/expanded.json]',
  };
  return {
    ok: true,
    name: 'Mistbound Chronicle CLI',
    version: VERSION,
    rulesVersion: RULES_VERSION,
    usage: 'node tools/cli.mjs <command> [options]',
    commands: command && reference[command] ? { [command]: reference[command] } : reference,
    notes: [
      '所有结果均为 JSON；成功退出码 0，失败退出码 1。',
      'action、apply-mod、simulate 未给 --out 时原子更新 --save 指定文件。',
      'init 和生成器写入已有文件需要显式 --force。',
      'simulate 在世界地图上暂不主动行动；遇到战场时通过 battleAuto 与 finishBattle 自动指挥并结算，直到请求的世界回合数真正推进。',
      'inspect 返回当前战场、引擎给出的可行动单位与合法选项，以及俘虏和可用处置指令。',
      '长期世界没有获胜终局；阶段目标与国土变化不会截停 simulate。',
      '游戏规则、Mod 校验和存档序列化全部调用 dist/engine.mjs。',
      'create-faction 默认同时创建领袖；--leader-id 可引用已有角色。',
      '浏览器存档与 CLI 存档格式相同，可在网页的存档导入/导出之间往返。规则8导出需本版继续。',
      'inspect 的 --troops 与 --girls 指定出征选择；--girls none 不带角色，返回的 action 可直接执行。',
    ],
  };
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (command === 'help') return help(options.for);
  if (command === 'version') return { ok: true, version: VERSION, rulesVersion: RULES_VERSION };

  if (command === 'init') {
    const state = createGame(options.seed || 'mistbound');
    const file = await saveState(state, options.out || 'mistbound.save.json', Boolean(options.force));
    return { ok: true, command, file, game: summary(state) };
  }

  if (command === 'inspect') {
    const file = resolve(required(options, 'save'));
    const state = await loadSave(file);
    const selection = {};
    if (options.troops !== undefined || options.girls !== undefined) {
      if (!options.tile || !options.from) throw new CliError('SELECTION_TARGET', '选兵预览需要 --tile 与 --from。');
      if (options.troops !== undefined) {
        const troops = Number(options.troops);
        if (!Number.isInteger(troops) || troops < 0 || troops > 99) throw new CliError('SELECTION_TROOPS', '--troops 必须为0到99的整数。');
        selection.troops = troops;
      }
      if (options.girls !== undefined) {
        const girls = options.girls === 'none' ? [] : String(options.girls).split(',').map(id => id.trim());
        if (new Set(girls).size !== girls.length || girls.some(id => !id || !state.tiles[options.from]?.field?.includes(id))) throw new CliError('SELECTION_GIRLS', '--girls 只能选择出发地随军角色，不能重复。');
        selection.girls = girls;
      }
    }
    const result = { ok: true, command, file, game: summary(state), ...inspectBattle(state), captives: inspectCaptives(state) };
    if (options.full) result.state = state;
    if (options.tile) {
      result.tile = state.tiles[options.tile] || null;
      result.tileStats = getTileStats(state, options.tile);
      result.actions = getActions(state, options.tile, options.from, selection);
    }
    result.recentEvents = state.logs.slice(-8);
    return result;
  }

  if (command === 'action') {
    const input = required(options, 'save');
    const sources = [options.json !== undefined, options['action-file'] !== undefined, Boolean(options.stdin)].filter(Boolean).length;
    if (sources !== 1) throw new CliError('ACTION_SOURCE', '请在 --json、--action-file、--stdin 中选一种指令输入。');
    let action;
    if (options.stdin) action = parseJSON(await readStdin(), '标准输入');
    else if (options['action-file']) action = await readJSON(options['action-file'], '指令文件');
    else action = parseJSON(options.json, '指令');
    const state = await loadSave(input);
    const result = accepted(perform(state, action));
    const file = await saveState(result.state, options.out || input);
    return { ok: true, command, action, file, detail: result.detail ?? null, game: summary(result.state), recentEvents: result.state.logs.slice(-4) };
  }

  if (command === 'simulate') {
    const input = required(options, 'save');
    let state = await loadSave(input);
    const turns = integer(options, 'turns', 5, 1, 500);
    const initialTurn = state.turn;
    const targetTurn = initialTurn + turns;
    let battlesResolved = 0;
    let tacticalCommands = 0;
    let steps = 0;
    const stepLimit = (turns + 1) * 1000;
    while (state.turn < targetTurn || state.battle) {
      if (++steps > stepLimit) throw new CliError('SIMULATION_STALLED', '战场连续执行过多指令，模拟未完成；原存档尚未写入。');
      let action;
      if (state.battle) {
        if (state.battle.phase === 'result') action = { type: 'finishBattle' };
        else if (state.battle.phase === 'player') action = { type: 'battleAuto' };
        else throw new CliError('ENGINE_CONTRACT', `未知战场阶段：${String(state.battle.phase)}`);
      } else action = { type: 'endTurn' };
      state = accepted(perform(state, action)).state;
      if (action.type === 'finishBattle') battlesResolved++;
      if (action.type !== 'endTurn') tacticalCommands++;
    }
    const file = await saveState(state, options.out || input);
    return {
      ok: true, command, file, policy: 'hold', battlePolicy: 'engine-auto', battlesResolved, tacticalCommands,
      turnsRequested: turns, turnsAdvanced: state.turn - initialTurn,
      stoppedBecause: 'requested_turns_completed',
      game: summary(state), recentEvents: state.logs.slice(-12),
    };
  }

  if (command === 'validate-mod') {
    const path = options.mod || options.file;
    if (!path) throw new CliError('MISSING_ARGUMENT', '缺少 --mod。');
    const mod = await readJSON(path, 'Mod');
    const result = validateMod(mod, await optionalSave(options));
    if (!result.ok) process.exitCode = 1;
    return { ...result, command, file: resolve(path), modId: mod?.id ?? null };
  }

  if (command === 'create-character') {
    const id = required(options, 'id');
    const name = required(options, 'name');
    const mod = { ...pack(options, id, name), characters: [character(options, id, name)] };
    return outputMod(command, mod, options);
  }

  if (command === 'create-faction') {
    const id = required(options, 'id');
    const name = required(options, 'name');
    const leaderId = options['leader-id'] || `${id}.leader`;
    const mod = {
      ...pack(options, id, name),
      factions: [{ id, name, color: options.color || '#80bdb2', leaderId, personality: options.personality || 'balanced' }],
    };
    if (!options['leader-id']) {
      mod.characters = [character(options, leaderId, options['leader-name'] || `${name}执政官`)];
    }
    return outputMod(command, mod, options);
  }

  if (command === 'apply-mod') {
    const input = required(options, 'save');
    const path = options.mod || options.file;
    if (!path) throw new CliError('MISSING_ARGUMENT', '缺少 --mod。');
    const mod = await readJSON(path, 'Mod');
    const state = await loadSave(input);
    checkMod(mod, state);
    const result = accepted(perform(state, { type: 'applyMod', mod }));
    const file = await saveState(result.state, options.out || input);
    return { ok: true, command, modId: mod.id, file, detail: result.detail ?? null, game: summary(result.state), recentEvents: result.state.logs.slice(-5) };
  }
}

main().then(emit).catch(error => {
  process.exitCode = 1;
  emit({ ok: false, error: error.message || String(error), code: error.code || 'CLI_ERROR', ...(error.details === undefined ? {} : { detail: error.details }) });
});

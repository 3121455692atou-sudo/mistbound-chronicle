import { CHARACTER_DEFINITIONS, STARTER_BANDS, GROUPS } from './content.mjs?v=1118-1603';
import { createTacticalBattle, performTactical, performVersusTactical } from './battle.mjs?v=1118-1603';
import { INTERACTION_TYPES, performInteraction, isTruce, tradeIncome } from './multiplayer-interactions.mjs?v=1118-1603';
import { COPY } from './multiplayer-copy.mjs?v=1118-1603';

export const MP_RULES = Object.freeze({
  version: 1, actions: 3, maxRounds: 40, protectionRounds: 2,
  gold: 45, supply: 45, army: 18, maxArmy: 40, maxGarrison: 12,
  recruit: { count: 6, gold: 12, supply: 8 },
  build: { farm: { gold: 18, supply: 4 }, mine: { gold: 18, supply: 4 }, fort: { gold: 22, supply: 6 } },
  maps: { small: { name: '雾海前线', radius: 5, tiles: 91 }, medium: { name: '四境群岛', radius: 7, tiles: 169 } },
});
export const ROLES = ['vanguard', 'ranger', 'guard', 'support'];
export const ROLE_NAMES = { vanguard: '先锋', ranger: '游击', guard: '卫戍', support: '鼓舞' };
export const COLORS = ['#edbd62', '#78bcf0', '#de91cf', '#8fd4b3'];
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const copy = value => structuredClone(value);
const check = (condition, text) => { if (!condition) throw new Error(text); };
export const keyOf = (q, r) => `${q},${r}`;
export const distance = (a, b) => Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.q + a.r - b.q - b.r));
export const adjacent = tile => [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]].map(([q, r]) => keyOf(tile.q + q, tile.r + r));

export function bandRoster(band) {
  check(typeof band === 'string' && own(STARTER_BANDS, band), '请选择有效阵容。');
  const spec = STARTER_BANDS[band], group = spec.group || band;
  const members = spec.members || CHARACTER_DEFINITIONS.filter(c => c.group === group).map(c => c.id);
  const ids = [spec.leader, ...members.filter(id => id !== spec.leader)].slice(0, 4);
  // Small works use the same four seats; an additional Sazai officer fills a missing seat.
  return ROLES.map((role, index) => {
    const source = CHARACTER_DEFINITIONS.find(c => c.id === ids[index]);
    return {
      id: source?.id || `officer${index}`, name: source?.name || '罪袋军官',
      portrait: source?.portrait || null, role, group: 'multiplayer', level: 1,
      stats: { attack: 4, defense: 4, scout: 3, economy: 3, charm: 3 },
      fx: {}, pals: [], bondTier: 0, morale: 0,
    };
  });
}
export const bandOptions = () => Object.entries(STARTER_BANDS).map(([id, spec]) => ({
  id, name: spec.label || GROUPS[spec.group || id] || id,
  leader: CHARACTER_DEFINITIONS.find(c => c.id === spec.leader)?.portrait || spec.leader,
}));
export const bandName = id => bandOptions().find(b => b.id === id)?.name || id;
const roll = (seed, text) => {
  let n = 2166136261;
  for (const c of `${seed}|${text}`) { n ^= c.charCodeAt(0); n = Math.imul(n, 16777619); }
  return (n >>> 0) / 4294967296;
};
function note(game, text) {
  game.log.push({ round: game.round, text });
  game.log = game.log.slice(-60);
}
export const currentPlayer = game => game.players.find(p => p.id === game.turnId);
export const battlePlayer = game => {
  if (!game.battle) return null;
  return game.battle[game.battle.playerSide === 'attacker' ? 'attackerId' : 'defenderId'];
};
export function score(game, player) {
  return Object.values(game.tiles).filter(t => t.owner === player.id).length * 3
    + (player.alive ? 15 : 0) + Math.floor(player.army.troops / 4);
}
export function createMultiplayerGame(seats, { map = 'small', seed = 'mistbound-online' } = {}) {
  check(Array.isArray(seats) && seats.length >= 2 && seats.length <= 4, '需要 2～4 位玩家。');
  check(own(MP_RULES.maps, map), '地图不存在。');
  check(new Set(seats.map(s => s.id)).size === seats.length, '玩家重复。');
  const radius = MP_RULES.maps[map].radius, d = radius - 1;
  const positions = seats.length === 2 ? [[d, 0], [-d, 0]]
    : seats.length === 3 ? [[d, 0], [-d, d], [0, -d]]
      : [[d, 0], [0, d], [-d, 0], [0, -d]];
  const game = {
    version: MP_RULES.version, map, seed, radius, round: 1, ap: MP_RULES.actions,
    turnId: seats[0].id, tiles: {}, players: [], status: 'playing',
    battle: null, battleContext: null, lastBattle: null, winners: [], log: [], battleSeq: 0,
  };
  for (let q = -radius; q <= radius; q++) for (let r = -radius; r <= radius; r++) {
    if (distance({ q, r }, { q: 0, r: 0 }) > radius) continue;
    // Dihedral symmetry: every spawn has identical terrain and distances to the centre.
    const orbit = [Math.abs(q), Math.abs(r), Math.abs(q + r)].sort((a, b) => a - b).join(',');
    const terrain = ['plains', 'forest', 'hills'][Math.floor(roll(seed, orbit) * 3)];
    const key = keyOf(q, r);
    game.tiles[key] = { key, q, r, terrain, owner: null, troops: 0, building: null, level: 0, capital: null };
  }
  seats.forEach((seat, index) => {
    const [q, r] = positions[index], capital = keyOf(q, r);
    const player = {
      id: seat.id, name: String(seat.name).slice(0, 40), band: seat.band, color: COLORS[index],
      capital, gold: MP_RULES.gold, supply: MP_RULES.supply, alive: true,
      army: { key: capital, troops: MP_RULES.army, heroes: bandRoster(seat.band), foughtRound: 0 },
    };
    for (const key of [capital, ...adjacent({ q, r })]) {
      const tile = game.tiles[key];
      check(tile && !tile.owner, '出生点发生重叠。');
      tile.owner = player.id; tile.troops = 2;
    }
    Object.assign(game.tiles[capital], { capital: player.id, building: 'capital', level: 1, terrain: 'plains', troops: 4 });
    game.players.push(player);
  });
  note(game, '雾海战局开始。前 2 轮休战；每人每轮 3 条指令，攻占首都可淘汰对方。');
  return game;
}
function finishIfNeeded(game) {
  const alive = game.players.filter(p => p.alive);
  if (alive.length <= 1) {
    game.status = 'finished'; game.winners = alive.map(p => p.id);
    note(game, alive.length ? `${alive[0].name}赢得了这场战局。` : '战局以平局结束。');
    return true;
  }
  return false;
}
function eliminate(game, player) {
  player.alive = false; player.army.troops = 0;
  for (const tile of Object.values(game.tiles).filter(t => t.owner === player.id)) {
    Object.assign(tile, { owner: null, troops: 0, capital: null });
    if (tile.building === 'capital') { tile.building = null; tile.level = 0; }
  }
  note(game, `${player.name}退出了领土争夺。`);
}
export function incomeFor(game, player, settlementRound = game.round + 1) {
  const tiles = Object.values(game.tiles).filter(t => t.owner === player.id);
  const upkeep = Math.ceil(player.army.troops / 6) + Math.floor(tiles.reduce((n, t) => n + t.troops, 0) / 12);
  return {
    gold: 8 + tiles.length + tiles.reduce((n, t) => n + (t.building === 'mine' ? t.level * 4 : 0), 0) + tradeIncome(game, player.id, settlementRound),
    supply: 10 + tiles.length + tiles.reduce((n, t) => n + (t.building === 'farm' ? t.level * 4 : 0), 0) - upkeep,
    upkeep,
  };
}
function advanceTurn(game) {
  if (finishIfNeeded(game)) return;
  const previous = game.players.findIndex(p => p.id === game.turnId);
  let next = (previous + 1) % game.players.length;
  while (!game.players[next].alive) next = (next + 1) % game.players.length;
  if (next <= previous) {
    if (game.round >= MP_RULES.maxRounds) {
      const alive = game.players.filter(p => p.alive);
      const best = Math.max(...alive.map(p => score(game, p)));
      game.status = 'finished'; game.winners = alive.filter(p => score(game, p) === best).map(p => p.id);
      note(game, '达到 40 轮，按领土、首都和军队积分结算；同分玩家并列。');
      return;
    }
    game.round++;
    for (const player of game.players.filter(p => p.alive)) {
      const income = incomeFor(game, player, game.round);
      player.gold = Math.min(999, player.gold + income.gold);
      player.supply = Math.max(0, Math.min(999, player.supply + income.supply));
      if (player.supply === 0) player.army.troops = Math.max(0, player.army.troops - 2);
    }
    note(game, `第 ${game.round} 轮：各国收入已统一结算。`);
  }
  game.turnId = game.players[next].id; game.ap = MP_RULES.actions;
}
function pay(game, player, cost) {
  check(game.ap > 0, '本回合的指令已用完，请结束回合。');
  check(player.gold >= (cost.gold || 0) && player.supply >= (cost.supply || 0), '金币或补给不足。');
  game.ap--; player.gold -= cost.gold || 0; player.supply -= cost.supply || 0;
}
function settleBattle(game) {
  const battle = game.battle, context = game.battleContext;
  if (battle.phase !== 'result') return;
  const attacker = game.players.find(p => p.id === battle.attackerId);
  const defender = game.players.find(p => p.id === battle.defenderId);
  const target = game.tiles[battle.toKey];
  const won = battle.result.winnerSide === 'attacker';
  attacker.army.troops = battle.result.attackerSurvivors;
  if (context.defendingArmy) {
    defender.army.troops = Math.min(MP_RULES.maxArmy, battle.result.defenderSurvivors);
    target.troops = 0;
    if (won) defender.army.key = defender.capital;
  } else target.troops = battle.result.defenderSurvivors;
  if (won) {
    const capitalOwner = target.capital;
    if (capitalOwner) eliminate(game, defender);
    Object.assign(target, { owner: attacker.id, troops: 0, capital: null });
    if (target.building === 'capital') { target.building = 'fort'; target.level = 1; }
    attacker.army.key = target.key;
    note(game, `${attacker.name}攻占 ${target.key}${capitalOwner ? '，敌方首都失守' : ''}。`);
  } else note(game, `${attacker.name}进攻 ${target.key}失利，部队退回出发地。`);
  game.lastBattle = {
    id: battle.id, round: game.round, attacker: attacker.name, defender: defender?.name || '中立守军',
    winner: won ? attacker.name : defender?.name || '中立守军',
    reason: battle.result.reason, log: battle.log.slice(-12),
  };
  game.battle = null; game.battleContext = null;
  finishIfNeeded(game);
}
function beginBattle(game, player, target) {
  const defender = game.players.find(p => p.id === target.owner);
  const defendingArmy = defender?.alive && defender.army.key === target.key;
  const defendingTroops = target.troops + (defendingArmy ? defender.army.troops : 0);
  game.battleSeq++;
  game.battle = createTacticalBattle({
    id: `online-${game.battleSeq}`, seed: game.seed, playerId: player.id,
    attackerId: player.id, defenderId: defender?.id || 'neutral',
    fromKey: player.army.key, toKey: target.key, terrainId: target.terrain,
    attackingTroops: player.army.troops, defendingTroops,
    sourceTroopsBefore: player.army.troops,
    attackerCharacters: player.army.heroes, defenderCharacters: defendingArmy ? defender.army.heroes : [],
    attackerTrainingLevel: 5, defenderTrainingLevel: 5,
    defenseBonus: target.building === 'fort' ? target.level * 2 : target.capital ? 2 : 0,
  });
  game.battleContext = { defendingArmy: !!defendingArmy, versus: !!defender };
  player.army.foughtRound = game.round;
  note(game, `${player.name}向 ${defender?.name || '中立守军'}发起进攻。战场期间暂停领土操作。`);
  settleBattle(game);
}
/** All commands are server-owned, immutable, and never accept a client-provided game snapshot. */
export function applyGameAction(source, playerId, action) {
  check(source?.version === MP_RULES.version && source.status === 'playing', '这场对局已经结束。');
  check(action && typeof action.type === 'string', '指令无效。');
  const game = copy(source), player = game.players.find(p => p.id === playerId);
  check(player?.alive, '你已经退出这场领土争夺。');
  if (action.type === 'surrender') {
    // A battle result must be committed before removing its participants.
    if (game.battle && [game.battle.attackerId, game.battle.defenderId].includes(playerId)) {
      const battle = game.battle;
      battle.playerSide = playerId === battle.attackerId ? 'attacker' : 'defender';
      const result = performTactical(battle, { type: 'battleRetreat' });
      game.battle = result.battle; settleBattle(game);
    }
    if (player.alive) eliminate(game, player);
    if (!finishIfNeeded(game) && game.turnId === playerId) advanceTurn(game);
    return game;
  }
  if (INTERACTION_TYPES.has(action.type)) return performInteraction(game, player, action, pay);
  if (game.battle) {
    check(playerId === battlePlayer(game), '请等待对方完成战场行动。');
    const allowed = ['battleMove', 'battleFace', 'battleAttack', 'battleSkill', 'battleWait', 'battleEndTurn', 'battleRetreat', 'battleAutoTurn'];
    check(allowed.includes(action.type) || (!game.battleContext.versus && action.type === 'battleAuto'), '战场进行中，请先完成战斗。');
    const previousSide = game.battle.playerSide;
    const result = game.battleContext.versus
      ? performVersusTactical(game.battle, action)
      : performTactical(game.battle, action.type === 'battleAutoTurn' ? { type: 'battleEndTurn' } : action);
    check(result.ok, result.error);
    game.battle = result.battle;
    game.battleHandoff = previousSide !== game.battle.playerSide || ['battleEndTurn', 'battleAutoTurn'].includes(action.type);
    settleBattle(game);
    return game;
  }
  check(game.turnId === playerId, '还没有轮到你行动。');
  if (action.type === 'endTurn') { advanceTurn(game); return game; }
  const tile = game.tiles[action.key], army = player.army;
  if (action.type === 'moveArmy') {
    check(tile && adjacent(game.tiles[army.key]).includes(tile.key), '军队每次只能前进到相邻地块。');
    check(army.troops >= 4, '至少需要 4 名士兵才能出发。');
    check(tile.owner === playerId || game.round > MP_RULES.protectionRounds || !tile.owner, '前 2 轮不能进攻其他玩家。');
    check(tile.owner === playerId || !isTruce(game, playerId, tile.owner), COPY.treatyBlocksAttack);
    check(tile.owner === playerId || army.foughtRound !== game.round, '军队本轮已经进攻过；下轮才能再次进攻。');
    pay(game, player, { supply: 2 });
    if (tile.owner !== playerId && (tile.capital || tile.troops > 0 || game.players.some(p => p.alive && p.id === tile.owner && p.army.key === tile.key))) {
      beginBattle(game, player, tile);
    } else {
      check(!tile.capital || tile.owner === playerId, '敌方首都必须经过战斗。');
      const claimed = !tile.owner;
      tile.owner = playerId; army.key = tile.key;
      if (claimed) note(game, `${player.name}开拓了 ${tile.key}。`);
    }
  } else if (action.type === 'recruit') {
    check(tile?.owner === playerId, '只能在己方领土征募。');
    const destination = army.key === tile.key ? army : tile;
    const cap = destination === army ? MP_RULES.maxArmy : MP_RULES.maxGarrison;
    check(destination.troops + MP_RULES.recruit.count <= cap, `兵力已接近上限（军队 ${MP_RULES.maxArmy}／驻军 ${MP_RULES.maxGarrison}）。`);
    pay(game, player, MP_RULES.recruit); destination.troops += MP_RULES.recruit.count;
  } else if (action.type === 'muster') {
    check(tile?.owner === playerId && army.key === tile.key, '军队必须在己方地块才能整编。');
    check(tile.troops > 0 && army.troops < MP_RULES.maxArmy, '这里没有可编入军队的驻军，或军队已满。');
    pay(game, player, {});
    const amount = Math.min(tile.troops, MP_RULES.maxArmy - army.troops);
    tile.troops -= amount; army.troops += amount;
  } else if (action.type === 'garrison') {
    check(tile?.owner === playerId && army.key === tile.key, '军队必须驻在这里才能分兵。');
    check(army.troops >= 10 && tile.troops + 6 <= MP_RULES.maxGarrison, '分兵需要军队至少 10 人，且驻军还能容纳 6 人。');
    pay(game, player, {}); army.troops -= 6; tile.troops += 6;
  } else if (action.type === 'build') {
    check(tile?.owner === playerId && !tile.capital, '请选择己方的非首都领土。');
    check(own(MP_RULES.build, action.building), '建筑无效。');
    check(!tile.building || (tile.building === action.building && tile.level < 2), '已有其他建筑，或建筑已达到 2 级。');
    pay(game, player, MP_RULES.build[action.building]);
    tile.building = action.building; tile.level++;
  } else throw new Error('不支持的联机指令。');
  return game;
}

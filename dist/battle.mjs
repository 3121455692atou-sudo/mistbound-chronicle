import { C } from './campaign-copy.mjs?v=1118-1603';
import {AIRCRAFT_MODELS} from './transport.mjs?v=1118-1603';
// Deterministic, DOM-free tactical combat. The world engine commits its result once.
const copy = value => JSON.parse(JSON.stringify(value));
const key = (x, y) => `${x},${y}`;
const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const other = side => side === 'attacker' ? 'defender' : 'attacker';
const alive = unit => unit.hp > 0;
export const BATTLE_WIDTH = 11, BATTLE_HEIGHT = 8, MAX_SQUADS = 6;
export const MAX_DEFENDER_COVER = 5;
const HOLD_ROUNDS = 3, FLAG_HEAL = 4;
/** The flag: hold it three rounds to win, but the count only starts with round three, so nobody wins a foot race
 * before the armies have met. `road` is the longest walk (in movement points of the slowest squad) either side
 * may need from its own edge to a square beside the flag, and `gap` the most one side's walk may exceed the other's. */
export const OBJECTIVE_RULES = Object.freeze({ hold: HOLD_ROUNDS, from: 3, road: 6, gap: 3 });
/** Board terrain. `block` stops everyone; `only` lists who can enter at all. */
export const BATTLE_TERRAIN = {
  deck: { name: C.navalBattle, cost: 1, cover: 0 },
  deckCover: { name: C.deckCover, cost: 1, cover: 2 },
  rigging: { name: C.rigging, cost: 2, cover: 1 },
  cargo: { name: C.cargo, cost: 2, cover: 3, sight: true },
  slipperyDeck: { name: C.slipperyDeck, cost: 1, cover: 0, weak: 1 },
  cloud: { name: C.cloud, cost: 1, cover: 2, sight: true },
  turbulence: { name: C.turbulence, cost: 2, cover: 0, weak: 1 },
  updraft: { name: C.updraft, cost: 1, cover: 0 },
  sky: { name: C.airBattle, cost: 1, cover: 0 },
  plain: { name: '平地', cost: 1, cover: 0 },
  forest: { name: '树林', cost: 2, cover: 2, note: '提供隐蔽，通常能避开 2 格外的普通远程攻击' },
  hill: { name: '高地', cost: 1, cover: 1, note: '站在上面远程射程 +1，向低处目标攻击伤害 +1' },
  rock: { name: '岩壁', block: true, sight: true, cover: 0, note: '谁都过不去，并且会挡住远程视线' },
  water: { name: '深水', block: true, cover: 0, note: '水域阻隔，谁都过不去' },
  lava: { name: '熔岩', block: true, cover: 0, note: '滚烫熔岩，谁都过不去' },
  shallow: { name: '浅滩', cost: 2, cover: 0, weak: 1, note: '浅滩泥泞，站在这里受到的伤害额外 +1' },
  bridge: { name: '桥', cost: 1, cover: 0 },
  fort: { name: '据点', cost: 1, cover: 2, note: '第 3 轮起开始计数，占满 3 轮获胜；相邻有敌人时暂停计数与回血' },
  swamp: { name: '沼泽', cost: 3, cover: 0, weak: 1, only: ['vanguard', 'ranger', 'support'], note: '只有先锋、游击和鼓舞能进；站在此处受到的伤害 +1' },
  cliff: { name: '断崖', cost: 2, cover: 3, only: ['ranger'], note: '只有游击爬得上去，站在此处时远程射程 +1' },
  thorns: { name: '荆棘', cost: 2, cover: 1, only: ['vanguard', 'sazai'], note: '荆棘丛生，只有先锋和罪袋闯得过去' },
  ice: { name: '冰面', cost: 1, cover: 0, weak: 1, note: '湿滑冰面，站在这里受到的伤害额外 +1' },
  ruin: { name: '废墟', cost: 2, cover: 1, sight: true, note: '可以穿行，但会挡住远程攻击的视线' },
};
const terrainOf = tile => BATTLE_TERRAIN[tile?.kind] || BATTLE_TERRAIN.plain;
const openToAll = kind => !BATTLE_TERRAIN[kind]?.block && !BATTLE_TERRAIN[kind]?.only;
const canEnter = (tile, unit) => Boolean(tile?.walkable) && (!terrainOf(tile).only || terrainOf(tile).only.includes(unit.kind));
/** Facing runs east, south, west, north; a hit lands on the front, side or back of whoever takes it. */
const FACINGS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const faceIndex = (dx, dy) => Math.abs(dx) >= Math.abs(dy) ? (dx >= 0 ? 0 : 2) : (dy >= 0 ? 1 : 3);
const ANGLE_NAME = { front: '正面', side: '侧击', back: '背刺' };
const WALL_ANGLE_NAME = { front: '正面', side: '侧面', back: '背面' };
function hitAngle(unit, target) {
  const turn = (faceIndex(unit.x - target.x, unit.y - target.y) - (target.facing ?? 0) + 4) % 4;
  return turn === 0 ? 'front' : turn === 2 ? 'back' : 'side';
}
/** A wall has its own fixed map orientation, independent of the occupant's
 * facing. Both armies use the same wall geometry after taking the square. */
function breastworkCover(tile, source) {
  if (!tile?.siegeCover) return { cover: 0, angle: null };
  const angle = hitAngle(source, { ...tile, facing: tile.siegeFacing });
  return { angle, cover: angle === 'front' ? tile.siegeCover : angle === 'side' ? Math.floor(tile.siegeCover / 2) : 0 };
}
export function tacticalSiegeProfile(value = 0) {
  const level = Math.max(0, Math.min(5, Math.floor(Number(value) || 0)));
  return level ? { level, cover: Math.ceil(level / 2), facing: 2 } : null;
}
const foesBeside = (battle, unit) => battle.units.filter(other2 => alive(other2) && other2.side !== unit.side && distance(other2, unit) === 1);
/** Moving next to an enemy ends the move, except for skirmishers. */
const pinned = (battle, unit, x, y) => unit.kind !== 'ranger' && !unit.fx?.woods && battle.units.some(other2 => alive(other2) && other2.side !== unit.side && Math.abs(other2.x - x) + Math.abs(other2.y - y) === 1);
const classes = {
  vanguard: { name: '先锋队', move: 4, range: 1, power: 3, skillLabel: '破阵突击', skillDescription: '消耗技能次数：对相邻敌人造成额外 4 点伤害，并忽略 1 点掩护。' },
  ranger: { name: '游击队', move: 3, range: 3, power: 0, skillLabel: '穿云远射', skillDescription: '消耗技能次数：攻击 4 格内可见敌人，额外造成 3 点伤害，忽略地形掩护和树林隐蔽。' },
  guard: { name: '卫戍队', move: 3, range: 1, power: 2, skillLabel: '固守阵地', skillDescription: '消耗技能次数：自身恢复 6 点生命，且在下次己方行动前减免 3 点伤害。' },
  support: { name: '鼓舞队', move: 3, range: 2, power: 1, skillLabel: '鼓舞', skillDescription: '消耗技能次数：为 2 格内的一支友军恢复 10 点生命。' },
  sazai: { name: '罪袋队', move: 3, range: 1, power: 1, skillLabel: '', skillDescription: '罪袋没有技能，但他们不会抱怨。' },
};
// Named girls average 3 attack and 2 defense, so SSR lands exactly on their average and no higher.
export const SAZAI_RANKS = {
  N: { name: 'N 级罪袋', power: 0, hp: 0 }, R: { name: 'R 级罪袋', power: 1, hp: 6 },
  SR: { name: 'SR 级罪袋', power: 2, hp: 12 }, SSR: { name: 'SSR 级罪袋', power: 3, hp: 18 },
};
export const MAX_ARMY_TRAINING = 30;
const REGULAR_ROLES = ['vanguard', 'ranger', 'guard', 'support', 'vanguard', 'ranger'];
/** The same national training table applies to both sides. It is fixed before a battle starts. */
export function regularTrainingProfile(value = 1) {
  const level = Math.max(1, Math.min(MAX_ARMY_TRAINING, Math.floor(Number(value) || 1)));
  const attack = Math.floor((level - 1) * .65), defense = Math.floor((level - 1) * .45), mixed = level >= 5;
  return { level, attack, defense, hpBonus: defense * 2, powerBonus: Math.floor(attack / 2), mixed, roles: mixed ? [...REGULAR_ROLES] : ['sazai'] };
}
const RARE_ORDER = ['SSR', 'SR', 'R'];
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const tileAt = (battle, x, y) => battle.tiles.find(tile => tile.x === x && tile.y === y);
const unitAt = (battle, x, y) => battle.units.find(unit => alive(unit) && unit.x === x && unit.y === y);
const addLog = (battle, text) => { battle.log.push(text); battle.log = battle.log.slice(-100); };
const rankOf = unit => unit.rank || (unit.characterId ? 'hero' : 'N');
function roll(seed, ...parts) {
  const value = [seed, ...parts].join('|');
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

function soldiersOf(unit) { return unit.hp > 0 ? Math.min(unit.initialSoldiers, Math.ceil(unit.hp / unit.maxHp * unit.initialSoldiers)) : 0; }
function lineOfSight(battle, from, to) {
  let x = from.x, y = from.y;
  const dx = Math.abs(to.x - x), dy = Math.abs(to.y - y), sx = x < to.x ? 1 : -1, sy = y < to.y ? 1 : -1;
  let error = dx - dy;
  while (x !== to.x || y !== to.y) {
    const doubled = error * 2;
    if (doubled > -dy) { error -= dy; x += sx; }
    if (doubled < dx) { error += dx; y += sy; }
    if ((x !== to.x || y !== to.y) && terrainOf(tileAt(battle, x, y)).sight) return false;
  }
  return true;
}
const visibleFrom = (battle, from, to, ignoreForest = false) => lineOfSight(battle, from, to)
  && (ignoreForest || from.fx?.sight || tileAt(battle, to.x, to.y)?.kind !== 'forest' || distance(from, to) <= 2);
const stepCost = (tile, unit) => tile.kind === 'updraft' ? 1 : tile.kind === 'forest' && unit?.fx?.woods ? 1 : terrainOf(tile).cost || 1;
function walkFrom(battle, unit) {
  const costs = new Map([[key(unit.x, unit.y), 0]]), queue = [{ x: unit.x, y: unit.y, cost: 0 }];
  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift();
    if (current.cost !== costs.get(key(current.x, current.y))) continue;
    if (current.cost > 0 && pinned(battle, unit, current.x, current.y)) continue;
    for (const [dx, dy] of directions) {
      const x = current.x + dx, y = current.y + dy, tile = tileAt(battle, x, y);
      if (!canEnter(tile, unit)) continue;
      const blocker = unitAt(battle, x, y);
      if (blocker) continue;
      const cost = current.cost + stepCost(tile, unit);
      if (cost > Math.max(1, unit.move - (unit.suppressed || 0)) || (costs.get(key(x, y)) ?? Infinity) <= cost) continue;
      costs.set(key(x, y), cost); queue.push({ x, y, cost });
    }
  }
  return [...costs].filter(([position]) => position !== key(unit.x, unit.y)).map(([position, cost]) => { const [x, y] = position.split(',').map(Number); return { x, y, cost }; });
}
const spent = unit => unit.acted && (unit.moved || !unit.fx?.kite);
function reachable(battle, unit) { return unit.moved || spent(unit) || !alive(unit) ? [] : walkFrom(battle, unit); }
/** High ground lengthens ranged attacks. */
const rangeFrom = (battle, unit, base = unit.range) => base + (base >= 2 && ['hill', 'cliff'].includes(tileAt(battle, unit.x, unit.y)?.kind) ? 1 : 0);
/** Cells a blow from any of these origins could land on, by the same range, sight and forest rules as an attack. */
function strikeCells(battle, unit, origins, withRangedSkill) {
  const cells = new Set();
  for (const origin of origins) {
    const range = rangeFrom(battle, { ...unit, ...origin }), rangedSkill = withRangedSkill && unit.kind === 'ranger' && !unit.skillUsed;
    for (const tile of battle.tiles) {
      const reach = distance(origin, tile);
      if (!tile.walkable || !reach || !lineOfSight(battle, origin, tile)) continue;
      if (!flightArc(unit, origin, tile)) continue;
      const ordinary = reach <= range && (unit.fx?.sight || tile.kind !== 'forest' || reach <= 2);
      if (ordinary || (rangedSkill && reach <= 4)) cells.add(key(tile.x, tile.y));
    }
  }
  return [...cells].map(position => { const [x, y] = position.split(',').map(Number); return { x, y }; });
}
/** Every cell this unit could hit on its next action; the UI draws it when an enemy is selected. */
export function tacticalThreat(battle, unitId) {
  const unit = battle?.units.find(item => item.id === unitId);
  if (!unit || !alive(unit)) return [];
  return strikeCells(battle, unit, [{ x: unit.x, y: unit.y }, ...walkFrom(battle, unit)], true);
}
/** Cells an ordinary attack from one spot could land on: where the unit stands, or `at`, a cell it can still
 * walk to this turn (the board previews it before the move). Empty once it has attacked or for any other spot. */
export function tacticalAttackReach(battle, unitId, at = null) {
  const unit = battle?.units.find(item => item.id === unitId);
  if (!unit || !alive(unit) || unit.acted || battle.phase !== 'player') return [];
  const here = !at || (at.x === unit.x && at.y === unit.y);
  if (!here && !reachable(battle, unit).some(cell => cell.x === at.x && cell.y === at.y)) return [];
  return strikeCells(battle, unit, [here ? { x: unit.x, y: unit.y } : { x: at.x, y: at.y }], false);
}
function rankPower(unit) {
  const rank = rankOf(unit);
  return rank === 'hero' ? 2 + Math.floor(unit.stats.attack / 2) : SAZAI_RANKS[rank].power + (unit.trainingLevel ? Math.floor(unit.stats.attack / 2) : 0);
}
/** Shared, deterministic pre-battle roster. No player-relative scaling is used. */
function forceRoster(total, characters = [], roster = {}, trainingLevel = 1) {
  const training = regularTrainingProfile(trainingLevel), rareCount = RARE_ORDER.reduce((sum, rank) => sum + (roster?.[rank] || 0), 0);
  const count = Math.min(MAX_SQUADS, Math.max(total, characters.length + rareCount)), heroes = characters.slice(0, count), rares = [];
  for (const rank of RARE_ORDER) for (let i = 0; i < (roster?.[rank] || 0) && heroes.length + rares.length < count; i++) rares.push(rank);
  return Array.from({ length: count }, (_, index) => {
    const character = heroes[index] || null, rank = character ? 'hero' : rares[index - heroes.length] || 'N';
    const kind = character ? (classes[character.role] && character.role !== 'sazai' ? character.role : ['vanguard', 'ranger', 'guard'][index % 3]) : training.mixed ? REGULAR_ROLES[(index - heroes.length) % REGULAR_ROLES.length] : 'sazai';
    const stats = character ? { ...character.stats } : { attack: training.attack, defense: training.defense, scout: 0, economy: 0 };
    const initialSoldiers = Math.floor(total / count) + (index < total % count ? 1 : 0), fx = character?.fx || {};
    const bonus = character ? 14 + stats.defense * 2 + (fx.hp || 0) : SAZAI_RANKS[rank].hp + training.hpBonus;
    return { character, rank, kind, stats, initialSoldiers, fx, maxHp: initialSoldiers * 8 + bonus, training };
  });
}
/** Transparent estimate, not a win prediction. Pressure is full-strength frontal
 * damage before enemy armour; ranged units are evaluated at range. Durability
 * adds four ordinary frontal hits' worth of armour to actual starting HP. Skills,
 * flanks, healing, formation, terrain routes and objective play are not predicted. */
export function tacticalForceSummary({ troops = 0, characters = [], roster = {}, trainingLevel = 1, morale = 0, defenseBonus = 0 } = {}) {
  const cover = Math.min(MAX_DEFENDER_COVER, Math.ceil(Math.max(0, defenseBonus) / 2));
  const units = forceRoster(troops, characters, roster, trainingLevel).map(squad => {
    const { character, rank, kind, stats, initialSoldiers, fx, maxHp, training } = squad;
    const power = Math.max(1, 2 + classes[kind].power + (character ? 2 + Math.floor(stats.attack / 2) : SAZAI_RANKS[rank].power + training.powerBonus) + Math.ceil(initialSoldiers / 2) + (character?.morale || 0) + morale + (fx.power || 0));
    const armor = Math.floor(stats.defense / 3) + (kind === 'guard' ? 3 : 0) + cover;
    return { kind, rank, characterId: character?.id || null, soldiers: initialSoldiers, hp: maxHp, power, armor };
  });
  const hp = units.reduce((sum, unit) => sum + unit.hp, 0), pressure = units.reduce((sum, unit) => sum + unit.power, 0);
  const durability = hp + units.reduce((sum, unit) => sum + unit.armor * 4, 0);
  return { troops, squads: units.length, heroes: units.filter(unit => unit.characterId).length, trainingLevel: regularTrainingProfile(trainingLevel).level,
    hp, pressure, durability, rating: Math.round(Math.sqrt(durability * pressure)), cover, units };
}
/** Fighting beside someone from the same group is worth up to 2 extra damage. */
function resonance(battle, unit, omittedSupportId = null) {
  if (!unit.group && !unit.pals?.length) return 0;
  return Math.min(2, battle.units.filter(other2 => other2 !== unit && other2.id !== omittedSupportId && alive(other2) && other2.side === unit.side && distance(other2, unit) === 1 && (other2.group === unit.group || unit.pals?.includes(other2.characterId))).length);
}
/** One blow, itemised: every number that goes into it, so the screen can show where the damage comes from. */
function strikeReport(battle, unit, target, skill = false, omittedSupportId = null) {
  const spot = tileAt(battle, target.x, target.y), own = tileAt(battle, unit.x, unit.y), spec = classes[unit.kind], fx = unit.fx || {};
  const lines = [], add = (label, value) => { if (value) lines.push({ label, value }); };
  const beside = (center, test) => battle.units.some(other2 => other2.id !== center.id && alive(other2) && distance(other2, center) === 1 && test(other2));
  const melee = distance(unit, target) === 1, angle = hitAngle(unit, target), foes = foesBeside(battle, target), surrounded = foes.length >= 3;
  // Ranged mobility and safe attacks trade raw power for reach; being caught
  // in melee costs another two power, so skirmishers need a front line.
  add('基础', 2 + spec.power + rankPower(unit) - (unit.kind === 'ranger' && melee ? 2 : 0));
  add('人数', Math.ceil(soldiersOf(unit) / 2));
  add('同队共鸣', resonance(battle, unit, omittedSupportId));
  add(unit.morale > 0 ? '状态好' : '疲劳', unit.morale || 0);
  add(unit.front > 0 ? '多路进军' : '补给断绝', unit.front || 0);
  if (angle !== 'front') add(ANGLE_NAME[angle], (angle === 'back' ? 4 : 2) / (melee ? 1 : 2));
  if (melee && foes.some(other2 => other2.id !== unit.id && other2.x === 2 * target.x - unit.x && other2.y === 2 * target.y - unit.y)) add('夹击', 2);
  if (surrounded) add('包围', 2);
  if (unit.kind === 'vanguard' && melee && (unit.charged || 0) >= 3) add('冲锋', 2);
  if (['hill', 'cliff'].includes(own?.kind) && !['hill', 'cliff'].includes(spot?.kind)) add('居高临下', 1);
  add(terrainOf(spot).name + '易伤', terrainOf(spot).weak || 0);
  if (beside(unit, other2 => other2.id !== omittedSupportId && other2.side === unit.side && (other2.kind === 'support' || other2.fx?.cheer))) add('鼓舞', 1);
  add('科技', battle.tech?.[unit.side]?.attack || 0);
  add('天赋', (fx.power || 0) + (fx.flank && beside(target, other2 => other2.side === unit.side) ? fx.flank : 0) + (fx.last && unit.hp < unit.maxHp / 2 ? fx.last : 0) + (fx.first && target.hp === target.maxHp ? fx.first : 0));
  if (skill && unit.kind === 'vanguard') add('破阵突击', 4);
  if (skill && unit.kind === 'ranger') add('穿云远射', 3);
  const guardCut = [];
  const cut = (label, value) => { if (value) guardCut.push({ label, value: -value }); };
  if (!(skill && unit.kind === 'ranger')) {
    cut(spot?.fortified ? '工事掩护' : terrainOf(spot).name + '掩护', Math.max(0, (spot?.defense || 0) - (spot?.siegeCover || 0)));
    if (spot?.siegeCover) {
      const wall = breastworkCover(spot, unit);
      guardCut.push({ label: `胸墙${WALL_ANGLE_NAME[wall.angle]}掩护`, value: wall.cover ? -wall.cover : 0 });
    }
  }
  cut('防御', Math.floor(target.stats.defense / 3));
  cut('科技', battle.tech?.[target.side]?.defense || 0);
  if (target.kind === 'guard' && !target.plane) cut(angle === 'front' ? '卫戍盾墙' : '卫戍', angle === 'front' ? 3 : 1);
  cut('护盾', target.shield || 0);
  cut(C.brace, target.braced ? 2 : 0);
  if (target.fx?.root && ['fort', 'hill'].includes(spot?.kind)) cut('扎根', target.fx.root);
  if (beside(target, other2 => other2.id !== omittedSupportId && other2.side === target.side && other2.fx?.aura)) cut('守护光环', 1);
  let blocked = -guardCut.reduce((sum, line) => sum + line.value, 0);
  const breakthrough = skill && unit.kind === 'vanguard' ? Math.min(1, blocked) : 0;
  blocked -= breakthrough;
  const piercing = Math.min(fx.pierce || 0, blocked);
  blocked -= piercing;
  add('破阵破甲', breakthrough); add('穿透', piercing);
  const gross = lines.reduce((sum, line) => sum + (['穿透', '破阵破甲'].includes(line.label) ? 0 : line.value), 0);
  return { rawDamage: Math.max(1, gross - blocked), damage: Math.min(target.hp, Math.max(1, gross - blocked)), lines: [...lines, ...guardCut], angle, surrounded };
}
const damageFor = (battle, unit, target, skill = false) => strikeReport(battle, unit, target, skill).damage;
/** What the target hits back with, and the first authoritative reason it cannot.
 * Reactions do not spend the target's ordinary action or one-use skill. */
function counterFor(battle, unit, target, report, omittedSupportId = null) {
  const blocked = counterReason => ({ counter: 0, counterReason });
  if (report.damage >= target.hp && !(target.fx?.undying && !target.undyingUsed)) return blocked('defeated');
  if (report.angle === 'back') return blocked('back');
  if (report.surrounded) return blocked('surrounded');
  if (!flightArc(target, target, unit)) return blocked('range');
  if (distance(unit, target) > rangeFrom(battle, target)) return blocked('range');
  if (!visibleFrom(battle, target, unit)) return blocked('visibility');
  // Preview the surviving defender and the attacker's actual post-strike facing.
  // Apply the counter multiplier before the HP cap, or counters can never kill.
  const survivor = { ...target, hp: Math.max(1, target.hp - report.damage) };
  const facingAttacker = { ...unit, facing: faceIndex(target.x - unit.x, target.y - unit.y) };
  return { counter: Math.min(unit.hp, Math.max(1, Math.ceil(strikeReport(battle, survivor, facingAttacker, false, omittedSupportId).rawDamage * (target.fx?.counter ? .75 : .5)))), counterReason: null };
}
function targetsFor(battle, unit, skill = false) {
  if (unit.acted || !alive(unit) || (skill && (unit.skillUsed || !classes[unit.kind].skillLabel))) return [];
  if (skill && unit.kind === 'guard') return [{ targetId: unit.id, unitId: unit.id, heal: Math.min(6, unit.maxHp - unit.hp), shield: 3 }];
  if (skill && unit.kind === 'support') {
    const reach = 2 + (unit.fx?.healRange || 0), amount = 10 + (unit.fx?.healPlus || 0);
    return battle.units.filter(ally => alive(ally) && ally.side === unit.side && distance(unit, ally) <= reach && ally.hp < ally.maxHp).map(ally => ({ targetId: ally.id, unitId: ally.id, heal: Math.min(amount, ally.maxHp - ally.hp), shield: 0 }));
  }
  const range = unit.plane ? 8 : skill && unit.kind === 'ranger' ? 4 : rangeFrom(battle, unit);
  return battle.units.filter(target => {
    // Counters, attack previews and movement hints share the same visibility.
    return flightArc(unit, unit, target) && alive(target) && target.side !== unit.side && distance(unit, target) <= range && visibleFrom(battle, unit, target, skill);
  }).map(target => {
    const report = strikeReport(battle, unit, target, skill);
    const reaction = skill ? { counter: 0, counterReason: 'skill' } : counterFor(battle, unit, target, report);
    return { targetId: target.id, unitId: target.id, damage: report.damage, canDefeat: report.damage >= target.hp && !(target.fx?.undying && !target.undyingUsed), angle: report.angle, lines: report.lines, ...reaction };
  });
}
export function tacticalOptions(battle, unitId) {
  const unit = battle?.units.find(item => item.id === unitId);
  if (!battle || !unit) return { ok: false, reason: '请选择战场上的分队。', moves: [], targets: [], skillTargets: [], canSkill: false, canWait: false, skillLabel: '', skillDescription: '' };
  const spec = classes[unit.kind];
  const reason = battle.phase !== 'player' ? '战斗已经结算。' : unit.side !== battle.playerSide ? '这支分队由对方指挥。' : !alive(unit) ? '这支分队已经退出战斗。' : spent(unit) ? '这支分队本轮已经完成行动。' : '';
  // Mark the squares a blow could be landed from, so a good position shows before the unit walks there.
  const moves = reason ? [] : reachable(battle, unit).map(cell => ({ ...cell, angle: bestAngleFrom(battle, unit, cell) }));
  return { ok: !reason, reason, unitId, moves, targets: reason ? [] : targetsFor(battle, unit),
    skillLabel: spec.skillLabel, skillDescription: spec.skillDescription, skillTargets: reason ? [] : targetsFor(battle, unit, true),
    canSkill: !reason && !unit.skillUsed && targetsFor(battle, unit, true).length > 0, canWait: !reason };
}
export function tacticalSuppressPreview(battle,unitId,targetId){
  const unit=battle?.units.find(u=>u.id===unitId),target=battle?.units.find(u=>u.id===targetId);
  const enabled=Boolean(unit&&target&&unit.side===battle.playerSide&&battle.phase==='player'&&targetsFor(battle,unit).some(t=>t.targetId===targetId));
  return {enabled,damage:enabled?Math.min(target.hp,Math.max(1,Math.ceil(strikeReport(battle,unit,target,false).rawDamage*.6))):0};
}
/** Read-only explanation for inspecting a target that has no attack button.
 * Use the same range, visibility and target rules as the actual action. */
export function tacticalTargetStatus(battle, unitId, targetId, { skill = false } = {}) {
  const options = tacticalOptions(battle, unitId), unit = battle?.units.find(item => item.id === unitId);
  const target = battle?.units.find(item => item.id === targetId);
  const fail = (code, reason, extra = {}) => ({ enabled: false, code, reason, ...extra });
  if (!options.ok) return fail('unit', options.reason);
  if (!target || !alive(target)) return fail('target', '目标已经退出战斗。');
  if (unit.acted) return fail('acted', '这支分队本轮已攻击；请换一支分队，或结束我方回合。');
  if (skill && unit.skillUsed) return fail('skill-spent', '这支分队本场已用过技能，可以改用普通攻击。');
  const targets = skill ? options.skillTargets : options.targets;
  if (targets.some(item => (item.targetId || item.unitId) === targetId)) return { enabled: true, code: 'ready', reason: '' };
  if (skill && unit.kind === 'guard') return fail('self-only', '坚守技能只作用于自己，点击技能即可施放。');
  if (skill && unit.kind === 'support') {
    if (target.side !== unit.side) return fail('ally-only', '鼓舞技能用于己方受伤分队；攻击敌军请先关闭技能模式。');
    if (target.hp >= target.maxHp) return fail('full-health', '这支友军生命已满，不需要治疗。');
    const reach = 2 + (unit.fx?.healRange || 0), gap = distance(unit, target);
    return fail('range', `目标距离 ${gap} 格，治疗范围 ${reach} 格；请先靠近。`, { distance: gap, range: reach });
  }
  if (unit.plane && !flightArc(unit, unit, target)) return fail('facing', C.airCombatDetail);
  if (target.side === unit.side) return fail('friendly', '普通攻击不能以己方分队为目标。');
  const reach = skill && unit.kind === 'ranger' ? 4 : rangeFrom(battle, unit), gap = distance(unit, target);
  if (gap > reach) return fail('range', `目标距离 ${gap} 格，当前射程 ${reach} 格；请先靠近或换一支分队。`, { distance: gap, range: reach });
  if (!lineOfSight(battle, unit, target)) return fail('sight', '地形遮挡视线；调整站位后才能攻击。');
  if (!visibleFrom(battle, unit, target, skill)) return fail('forest', '目标被树林掩蔽；靠近至 2 格内，或使用可无视树林的能力。');
  return fail('unavailable', '当前无法攻击这个目标；红框才是可攻击的目标。');
}
function bestAngleFrom(battle, unit, cell) {
  const probe = { ...unit, x: cell.x, y: cell.y };
  let best = null;
  for (const target of battle.units) {
    if (!alive(target) || target.side === unit.side || distance(probe, target) > rangeFrom(battle, probe) || !visibleFrom(battle, probe, target)) continue;
    const angle = hitAngle(probe, target);
    if (angle === 'back') return 'back';
    if (angle === 'side') best = 'side';
  }
  return best;
}
/** Everything currently acting on a unit, with where it comes from. */
export function tacticalStatus(battle, unitId) {
  const unit = battle?.units.find(item => item.id === unitId);
  if (!unit || !alive(unit)) return [];
  const chips = [], push = (text, good, why) => chips.push({ text, good, why }), tile = tileAt(battle, unit.x, unit.y), land = terrainOf(tile);
  if (unit.trainingLevel) push(`常备军 Lv ${unit.trainingLevel}`, true, `统军 ${unit.stats.attack}、守备 ${unit.stats.defense}；本场使用开战前的全国训练等级，双方规则相同`);
  if (unit.morale > 0) push(`状态好 +${unit.morale}`, true, '干劲高，伤害更高');
  if (unit.morale < 0) push(`疲劳 ${unit.morale}`, false, '太累了，伤害降低');
  if (unit.front > 0) push(`多路进军 +${unit.front}`, true, '大地图上从多块领土同时进攻');
  if (unit.front < 0) push(`补给断绝 ${unit.front}`, false, '这块地和首都断了联系');
  const terrainDefense = Math.max(0, (tile?.defense || 0) - (tile?.siegeCover || 0));
  if (terrainDefense) push(`${tile.fortified ? '工事' : land.name} 防+${terrainDefense}`, true, tile.fortified ? '守军依托工事' : land.note || '地形掩护');
  if (tile?.siegeCover) push(`胸墙 正面防+${tile.siegeCover}`, true, `朝向固定为进攻方出发侧；侧面减伤 ${Math.floor(tile.siegeCover / 2)}，背面为 0。双方均可占用，转身不会转动胸墙；穿云远射无视胸墙。`);
  if (land.weak) push(`${land.name} 易伤+${land.weak}`, false, land.note);
  const pals = resonance(battle, unit); if (pals) push(`共鸣 +${pals}`, true, '身边有同团体的队友');
  if (battle.units.some(other2 => other2.id !== unit.id && alive(other2) && other2.side === unit.side && distance(other2, unit) === 1 && (other2.kind === 'support' || other2.fx?.cheer))) push('鼓舞 +1', true, '身边有鼓舞队');
  if ((unit.charged || 0) >= 3 && unit.kind === 'vanguard') push('冲锋 +2', true, '这轮走了 3 格以上');
  if (unit.shield) push(`护盾 ${unit.shield}`, true, '受到的伤害减少');
  const foes = foesBeside(battle, unit);
  if (foes.length >= 3) push('被包围', false, '受到伤害 +2，不能反击');
  else if (foes.length && unit.kind !== 'ranger') push('被牵制', false, '身边有敌人，走一步就得停');
  return chips;
}
/** v1 only knows whether contact happened. Never infer individual history for
 * it (or for older, untracked battles) from HP, positions, rounds or logs. */
function recordContact(battle, source, target) {
  const ledger = battle.progression;
  if (![1, 2].includes(ledger?.version)) return;
  ledger.hostileContact = true;
  if (ledger.version === 2 && !ledger.contacts.some(link => link.sourceId === source.id && link.targetId === target.id)) ledger.contacts.push({ sourceId: source.id, targetId: target.id });
}
function recordSupport(battle, source, target, kind) {
  const ledger = battle.progression;
  if (ledger?.version !== 2) return;
  if (!ledger.supports.some(link => link.sourceId === source.id && link.targetId === target.id && link.kind === kind)) ledger.supports.push({ sourceId: source.id, targetId: target.id, kind });
}
const hpAfterHit = (unit, damage) => damage >= unit.hp && unit.fx?.undying && !unit.undyingUsed ? 1 : Math.max(0, unit.hp - damage);
/** Attribute only passive support that changes this resolved exchange. The
 * same authoritative strike/counter formulas are queried with one provider's
 * resonance/cheer/aura omitted; positions, flank/surround rules and RNG do not
 * change. Compare HP, counter occurrence and the one-use undying resource;
 * equal HP alone must not hide a charge that was preserved or consumed. */
function recordPassiveSupport(battle, unit, target, skill, choice) {
  if (battle.progression?.version !== 2) return;
  // The inputs are still pre-hit. Mirror strike()'s lethal-hit checks without
  // mutating a charge; a zero counter leaves the living actor's flag unchanged.
  const undyingUsedAfterHit = (recipient, damage) => Boolean(recipient.undyingUsed || (damage >= recipient.hp && recipient.fx?.undying && !recipient.undyingUsed));
  const outcome = option => [hpAfterHit(target, option.damage), hpAfterHit(unit, option.counter || 0), Boolean(option.counter),
    undyingUsedAfterHit(target, option.damage), undyingUsedAfterHit(unit, option.counter || 0)];
  const actual = outcome(choice);
  for (const source of battle.units) {
    if (source === unit || source === target || !alive(source)) continue;
    const recipient = source.side === unit.side ? unit : target;
    if (distance(source, recipient) !== 1) continue;
    const report = strikeReport(battle, unit, target, skill, source.id);
    const reaction = skill ? { counter: 0 } : counterFor(battle, unit, target, report, source.id);
    const without = outcome({ ...report, ...reaction });
    if (actual.some((value, index) => value !== without[index])) recordSupport(battle, source, recipient, 'passive');
  }
}
export function tacticalGrowthSuppressed(battle) {
  return [1, 2].includes(battle?.progression?.version) && battle.progression.hostileContact === false
    && battle.playerSide === 'attacker' && battle.result?.reason === 'retreat';
}
export function tacticalGrowthLimited(battle) {
  return battle?.progression?.version === 2 && battle.progression.hostileContact === true
    && battle.playerSide === 'attacker' && battle.result?.reason === 'retreat';
}
/** null means the original whole-party policy; [] means no-contact suppression.
 * Support attaches directly to a combatant, never through a chain of helpers. */
export function tacticalGrowthParticipants(battle) {
  if (tacticalGrowthSuppressed(battle)) return [];
  if (!tacticalGrowthLimited(battle)) return null;
  const combatants = new Set(battle.progression.contacts.flatMap(link => [link.sourceId, link.targetId]));
  return [...new Set([...combatants, ...battle.progression.supports.filter(link => combatants.has(link.targetId)).map(link => link.sourceId)])];
}
function finalize(battle, winnerSide, reason) {
  if (battle.phase === 'result') return;
  // An immediate surrender/retreat may expose a surviving participant to capture too.
  const loserSide = other(winnerSide);
  const fallen = battle.units.filter(unit => unit.side === loserSide && unit.characterId && (!alive(unit) || reason === 'retreat' && roll(battle.seed, battle.id, battle.round, unit.id, 'surrender') < .15 + (1 - unit.hp / unit.maxHp) * .2)).map(unit => unit.characterId).sort();
  const lostSazai = { attacker: {}, defender: {} };
  for (const unit of battle.units) {
    const rank = rankOf(unit);
    if (!alive(unit) && RARE_ORDER.includes(rank)) lostSazai[unit.side][rank] = (lostSazai[unit.side][rank] || 0) + 1;
  }
  battle.phase = 'result';
  battle.result = { winnerSide, winnerId: winnerSide === 'attacker' ? battle.attackerId : battle.defenderId,
    loserId: loserSide === 'attacker' ? battle.attackerId : battle.defenderId, playerWon: winnerSide === battle.playerSide, reason,
    attackerSurvivors: battle.units.filter(unit => unit.side === 'attacker').reduce((sum, unit) => sum + soldiersOf(unit), 0),
    defenderSurvivors: battle.units.filter(unit => unit.side === 'defender').reduce((sum, unit) => sum + soldiersOf(unit), 0),
    capturedCharacterIds: fallen.slice(0, 2), rescuedCharacterIds: [], lostSazai };
  if (tacticalGrowthSuppressed(battle)) battle.result.growthSuppressed = 'no-contact-retreat';
  if (tacticalGrowthLimited(battle)) battle.result.growthLimited = 'participants-only-retreat';
  addLog(battle, reason === 'retreat' ? '我方撤离战场，幸存军士返回驻地。' : reason === 'stalemate' ? '战线长期僵持，进攻方撤离。' : reason === 'objective' ? `${battle.result.playerWon ? '我方' : '对方'}守住据点 ${HOLD_ROUNDS} 轮，战场已定。` : `${battle.result.playerWon ? '我方' : '对方'}取得这场战斗的胜利。`);
}
function checkEnd(battle) {
  if (!battle.units.some(unit => alive(unit) && unit.side === 'attacker')) finalize(battle, 'defender', 'elimination');
  else if (!battle.units.some(unit => alive(unit) && unit.side === 'defender')) finalize(battle, 'attacker', 'elimination');
}
/** Girls lead first, then rare Sazai, then ordinary N squads fill whatever is left. */
function makeUnits(side, total, characters, roster, tiles, trainingLevel = 1) {
  const lineup = forceRoster(total, characters, roster, trainingLevel), count = lineup.length, units = [];
  if (count <= 0) return units;
  const placed = new Set();
  const spot = index => {
    const wanted = Math.round((index + .5) * BATTLE_HEIGHT / count - .5), columns = side === 'attacker' ? [1, 0, 2] : [BATTLE_WIDTH - 2, BATTLE_WIDTH - 1, BATTLE_WIDTH - 3];
    for (const x of columns) for (const offset of [0, 1, -1, 2, -2, 3, -3, 4, -4]) {
      const y = wanted + offset, tile = tiles.find(item => item.x === x && item.y === y);
      if (tile?.walkable && !placed.has(key(x, y))) { placed.add(key(x, y)); return { x, y }; }
    }
    throw new Error('战场没有可部署的位置。');
  };
  for (let index = 0; index < count; index++) {
    const { initialSoldiers, character, rank, kind, stats, fx, maxHp, training } = lineup[index];
    units.push({ id: `${side === 'attacker' ? 'a' : 'd'}${index + 1}`, side, ...spot(index), kind, rank, group: character?.group || null,
      name: character ? `${character.name} · ${classes[kind].name}` : training.level > 1 ? `${SAZAI_RANKS[rank].name} · Lv ${training.level} ${classes[kind].name}` : `${SAZAI_RANKS[rank].name}队`, characterId: character?.id || null,
      hp: maxHp, maxHp, soldiers: initialSoldiers, initialSoldiers,
      move: classes[kind].move + (fx.move || 0), range: classes[kind].range + (fx.range || 0), moved: false, acted: false, skillUsed: false, skillLeft: (fx.skill || 0) + (character?.bondTier >= 3 ? 1 : 0), shield: character?.bondTier >= 2 ? 2 : 0, kills: 0,
      level: character ? character.level || 1 : training.level, ...(!character && training.level > 1 ? { trainingLevel: training.level } : {}), morale: character?.morale || 0, front: 0, charged: 0, facing: side === 'attacker' ? 0 : 2, fx, pals: character?.pals || [], stats });
  }
  return units;
}
const THEMES = { plains: 'plain', meadow: 'plain', ruins: 'ruin', forest: 'forest', pine: 'forest', jungle: 'forest', mountain: 'pass', hills: 'pass', volcanic: 'volcano', crystal: 'pass', coast: 'river', wetland: 'swamp', oasis: 'river', lake: 'river', desert: 'open', salt: 'open', snow: 'snow', tundra: 'snow' };
/** Reserve two infantry approaches first, then build terrain around them. Mirrored obstacles keep both
 * deployments fair; seeded forks, groves, crossings and perches make each field a tactical place. */
function layBattlefield(terrainId, seed) {
  const W = BATTLE_WIDTH, H = BATTLE_HEIGHT, theme = THEMES[terrainId] || 'plain', cells = new Map(), roads = new Set();
  const pick = (salt, n) => Math.floor(roll(seed, terrainId, salt) * n);
  const [upper, lower] = [[2, 5], [2, 4], [3, 5]][pick('fork', 3)];
  const flag = { x: 5, y: upper === 3 ? 4 : lower === 4 ? 3 : 3 + pick('flag', 2) };
  const wing = pick('wing', 2) ? 1 : 6, perchX = 1 + Math.abs(flag.y - wing);
  const reserve = (x, y) => { roads.add(key(x, y)); cells.set(key(x, y), 'plain'); };
  // The exit column lets each squad go around stationary friends in its deployment column.
  for (let y = 0; y < H; y++) for (const x of [0, 1, 2, W - 3, W - 2, W - 1]) reserve(x, y);
  for (const y of [upper, lower]) for (let x = 2; x < W - 2; x++) reserve(x, y);
  for (let y = upper; y <= lower; y++) reserve(5, y);
  for (const [dx, dy] of [[0, 0], ...directions]) reserve(flag.x + dx, flag.y + dy);
  // A firing lane from each flanking hill; cover around it still breaks other sight lines.
  for (let y = wing + Math.sign(flag.y - wing); y !== flag.y; y += Math.sign(flag.y - wing)) {
    const x = Math.round(perchX + (5 - perchX) * (y - wing) / (flag.y - wing));
    reserve(x, y); reserve(W - 1 - x, y);
  }
  const put = (x, y, kind, replaceRoad = false) => {
    for (const cx of new Set([x, W - 1 - x])) {
      if (cx < 2 || cx > W - 3 || y < 0 || y >= H) continue;
      if (roads.has(key(cx, y)) && !replaceRoad) continue;
      cells.set(key(cx, y), kind);
    }
  };
  const stamp = (x, y, kind, shape) => { for (const [dx, dy] of shape) put(x + dx, y + dy, kind); };
  // Grow connected patches rather than scattering single trees and puddles.
  const grow = (kind, target, salt) => {
    let count = [...cells.values()].filter(value => value === kind).length;
    while (count < target) {
      const candidates = [];
      for (let y = 0; y < H; y++) for (let x = 3; x <= 5; x++) {
        const position = key(x, y);
        if (roads.has(position) || cells.has(position)) continue;
        const touching = directions.filter(([dx, dy]) => cells.get(key(x + dx, y + dy)) === kind).length;
        candidates.push({ x, y, score: touching * 2 + roll(seed, salt, x, y) });
      }
      candidates.sort((a, b) => b.score - a.score || a.y - b.y || a.x - b.x);
      if (!candidates.length) break;
      put(candidates[0].x, candidates[0].y, kind);
      count = [...cells.values()].filter(value => value === kind).length;
    }
  };
  const elbow = [[0, 0], [1, 0], [0, 1], [0, 2]];
  const pool = [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]];
  if (theme === 'pass') {
    // A split ridge: infantry can use either pass; skirmishers can climb the shoulders.
    for (let y = 0; y < H; y++) put(5, y, 'rock');
    for (const y of [0, 7]) put(4, y, 'rock');
    for (const y of [1, 6]) put(4, y, 'cliff');
    grow('forest', 2 + 2 * pick('shelter', 2), 'shelter');
  } else if (theme === 'swamp') {
    // Dry causeways cross two reed basins. Lighter squads may cut through the reeds.
    stamp(3, 0, 'swamp', pool); stamp(3, 5, 'swamp', pool);
    put(5, wing, 'shallow'); put(4, 7 - wing, 'shallow');
    grow('swamp', 16 + 2 * pick('reeds', 2), 'reeds');
    grow('forest', 4, 'islands');
    for (const y of [upper, lower]) put(3, y, 'bridge', true);
  } else if (theme === 'volcano') {
    // Two lava tongues split the advance; the dry inner loop stays open to flanking.
    stamp(3, 0, 'lava', elbow); stamp(3, 5, 'lava', elbow);
    put(5, wing, 'rock'); put(4, 7 - wing, 'cliff');
    grow('lava', 10 + 2 * pick('flow', 2), 'flow');
  } else if (theme === 'snow') {
    // The fast ice crossing is exposed (+1 damage); woods and ridges offer a covered detour.
    stamp(3, 0, 'ice', pool); stamp(3, 5, 'ice', pool);
    for (const x of [3, 4]) put(x, pick('frozen-lane', 2) ? upper : lower, 'ice', true);
    put(4, wing, 'rock'); grow('forest', 4 + 2 * pick('windbreak', 2), 'windbreak');
  } else if (theme === 'ruin') {
    // Broken courtyards: L-shaped walls hide advances, with two gates and a side alley.
    stamp(3, 0, 'ruin', elbow); stamp(3, 5, 'ruin', elbow);
    put(3, flag.y, 'ruin'); put(5, wing, 'rock');
    grow('ruin', 12 + 2 * pick('courts', 2), 'courts');
    put(4, 7 - wing, 'thorns');
  } else if (theme === 'river') {
    // The objective sits on a bridgehead, not behind one compulsory bridge.
    for (let y = 0; y < H; y++) cells.set(key(5, y), roads.has(key(5, y)) ? 'bridge' : 'water');
    put(5, wing, 'bridge'); put(5, 7 - wing, 'shallow');
    for (const y of [wing, 7 - wing]) put(4, y, 'shallow');
    stamp(3, pick('bank', 2) ? 0 : 5, 'forest', elbow);
    grow('forest', 6 + 2 * pick('grove', 2), 'banks');
  } else if (theme === 'forest') {
    // Woodland belts frame two clearings; thorn gaps and a lookout reward specialist squads.
    stamp(3, 0, 'forest', pool); stamp(3, 5, 'forest', pool);
    put(5, wing, 'rock'); put(4, 7 - wing, 'thorns');
    grow('forest', 16 + 2 * pick('groves', 2), 'groves');
  } else if (theme === 'open') {
    // Dune ridges face across exposed low ground; rock screens provide a way around the crossfire.
    for (const y of [1, 6]) put(4, y, 'hill');
    put(4, pick('screen', 2) ? 0 : 7, 'rock'); put(5, wing, 'rock');
    put(4, 7 - wing, 'cliff');
    grow('hill', 8 + 2 * pick('dunes', 2), 'dunes');
  } else {
    // Hedgerows protect the approach to an open crossroads, rather than filling it with obstacles.
    stamp(3, pick('hedge', 2) ? 0 : 5, 'forest', elbow);
    put(5, wing, 'rock'); put(4, 7 - wing, 'thorns');
    grow('forest', 6 + 2 * pick('grove', 3), 'hedges');
  }
  // A screen near each approach creates a real fork or a covered advance, close enough to matter.
  // It occupies the gap BETWEEN the reserved lanes, never the only way to the objective.
  const screenY = [flag.y, flag.y - 1, flag.y + 1].find(y => !roads.has(key(3, y)));
  const screen = { pass: 'rock', volcano: 'lava', ruin: 'ruin', open: 'rock' }[theme] || 'forest';
  put(3, screenY, screen);
  // Covered gates cost two movement points: a fast melee squad cannot cross the whole empty
  // midfield and get behind a slower defender in one leap. The other lane remains available.
  const gate = ['river', 'swamp'].includes(theme) ? 'shallow' : ['open', 'volcano', 'ruin'].includes(theme) ? 'ruin' : 'forest';
  for (const y of [upper, lower]) put(3, y, gate, true);
  // Both hills can shoot toward the objective, but neither sits on the objective itself.
  put(perchX, wing, 'hill', true);
  if (pick('second-perch', 2)) put(4, 7 - wing, 'hill', true);
  if (pick('approach-cover', 2)) put(2, 7 - wing, 'hill', true);
  // Solid ridges need usable shoulders too, so the far corners never feed into two slow gates in a row.
  if (['pass', 'volcano'].includes(theme)) {
    for (const y of [1, 6]) put(3, y, 'hill', true);
    for (const y of [...(upper === 3 ? [2] : []), ...(lower === 4 ? [5] : [])]) {
      put(3, y, 'hill', true); put(4, y, 'hill', true);
    }
  }
  if (theme === 'volcano') grow('lava', 8, 'outer-flow');
  cells.set(key(flag.x, flag.y), 'fort');
  const tiles = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const kind = cells.get(key(x, y)) || 'plain';
    tiles.push({ x, y, kind, walkable: !BATTLE_TERRAIN[kind].block, defense: BATTLE_TERRAIN[kind].cover });
  }
  return { tiles, objective: { x: flag.x, y: flag.y, holder: null, hold: 0 }, theme };
}
export function createTacticalBattle(options) {
  const environment = ['sea', 'air'].includes(options.environment) ? options.environment : 'land';
  const { tiles, objective, theme } = environment === 'land' ? layBattlefield(options.terrainId, `${options.seed}|${options.id}`) : laySpecialField(environment, `${options.seed}|${options.id}`);
  const profile = environment === 'land' ? tacticalSiegeProfile(options.siegeLevel) : null;
  let siege = null;
  if (profile) {
    // Add positions near the real fight, without erasing terrain, blocking a
    // route, moving the flag or granting either side initial objective progress.
    const works = tiles.filter(tile => tile.x > objective.x && tile.x <= objective.x + 3 && distance(tile, objective) <= 4 && tile.walkable && openToAll(tile.kind))
      .sort((a, b) => distance(a, objective) - distance(b, objective) || a.x - b.x || a.y - b.y).slice(0, 3);
    for (const tile of works) { tile.siegeCover = profile.cover; tile.siegeFacing = profile.facing; tile.defense += profile.cover; }
    siege = { ...profile, cells: works.map(({ x, y }) => ({ x, y })) };
  }
  const training = { attacker: regularTrainingProfile(options.attackerTrainingLevel).level, defender: regularTrainingProfile(options.defenderTrainingLevel).level };
  const units = [...makeUnits('attacker', options.attackingTroops, options.attackerCharacters || [], options.attackerRoster, tiles, training.attacker), ...makeUnits('defender', options.defendingTroops, options.defenderCharacters || [], options.defenderRoster, tiles, training.defender)];
  if (environment === 'air') for (const unit of units) {
    unit.nativeFlight = Boolean(unit.characterId && options.innateFlyIds?.includes(unit.characterId));
    if (!unit.nativeFlight) { const model=options.aircraft?.[unit.characterId]||AIRCRAFT_MODELS.lightPlane;unit.plane=true;unit.aircraftModelId=model.id;unit.pilotAttack=unit.stats.attack;unit.stats.attack=Math.min(99,unit.stats.attack+model.attack);unit.stats.defense=model.defense;unit.move=Math.min(9,model.speed);unit.range=8;unit.maxHp=unit.initialSoldiers*8+26+model.defense*2;unit.hp=unit.maxHp;unit.shield=0; }
  }
  for (const unit of units) unit.front = (unit.side === 'attacker' ? options.attackerMorale : options.defenderMorale) || 0;
  const defenderCover = Math.min(MAX_DEFENDER_COVER, Math.ceil((options.defenseBonus || 0) / 2));
  for (const unit of units.filter(item => item.side === 'defender')) {
    const tile = tiles.find(item => item.x === unit.x && item.y === unit.y);
    tile.defense += defenderCover; tile.fortified = defenderCover > 0;
  }
  const battle = { id: options.id, seed: options.seed, mission: options.mission === undefined ? 'conquest' : options.mission, training, playerSide: options.playerId === options.attackerId ? 'attacker' : 'defender',
    attackerId: options.attackerId, defenderId: options.defenderId, fromKey: options.fromKey, toKey: options.toKey,
    initialAttackingTroops: options.attackingTroops, initialDefendingTroops: options.defendingTroops, sourceTroopsBefore: options.sourceTroopsBefore,
    environment, width: BATTLE_WIDTH, height: BATTLE_HEIGHT, terrainId: options.terrainId, theme, defenderCover, round: 1, phase: 'player', tiles, units, objective,
    participantIds: { attacker: units.filter(unit => unit.side === 'attacker' && unit.characterId).map(unit => unit.characterId), defender: units.filter(unit => unit.side === 'defender' && unit.characterId).map(unit => unit.characterId) },
    progression: { version: 2, hostileContact: false, contacts: [], supports: [] },
    log: ['选择我方分队，先移动，再攻击或使用一次性的指挥技能。'], result: null, ...(siege ? { siege } : {}),
    ...(options.tech && (options.tech.attacker?.attack || options.tech.attacker?.defense || options.tech.defender?.attack || options.tech.defender?.defense) ? { tech: { attacker: { attack: options.tech.attacker?.attack || 0, defense: options.tech.attacker?.defense || 0 }, defender: { attack: options.tech.defender?.attack || 0, defense: options.tech.defender?.defense || 0 } } } : {}) };
  checkEnd(battle);
  if (defenderCover) addLog(battle, `守军依托领土地形与工事：部署格掩护 +${defenderCover}。离开部署格后按新地形计算。`);
  if (siege?.cells.length) addLog(battle, `${siege.level} 级要塞在据点旁设有 ${siege.cells.length} 处胸墙：朝进攻方出发侧减伤 ${siege.cover}，侧面 ${Math.floor(siege.cover / 2)}、背面 0；双方均可占用，穿云远射可穿透。`);
  return battle;
}
/** The flag heals whoever stands on it, and holding it long enough ends the fight. */
function tickObjective(battle) {
  for (const unit of battle.units.filter(item => alive(item) && item.fx?.regen)) for (const ally of battle.units.filter(item => alive(item) && item.side === unit.side && distance(item, unit) === 1)) {
    const previousHp = ally.hp;
    ally.hp = Math.min(ally.maxHp, ally.hp + unit.fx.regen); ally.soldiers = soldiersOf(ally);
    if (ally.hp > previousHp) recordSupport(battle, unit, ally, 'regen');
  }
  const flag = battle.objective;
  if (!flag || battle.phase === 'result') return;
  const unit = unitAt(battle, flag.x, flag.y);
  if (!unit) { flag.holder = null; flag.hold = 0; return; }
  // An enemy right beside the flag contests it: the count stops until they are driven off.
  const contested = battle.units.some(other2 => alive(other2) && other2.side !== unit.side && distance(other2, flag) === 1);
  // The first rounds are for getting there: whoever stands on the flag holds it and is healed, but nothing is counted yet.
  const early = battle.round < OBJECTIVE_RULES.from;
  if (early) { flag.holder = unit.side; flag.hold = 0; }
  else if (flag.holder !== unit.side) { flag.hold = contested ? 0 : 1; flag.holder = unit.side; }
  else if (!contested) flag.hold++;
  flag.contested = contested;
  if (!contested && unit.hp < unit.maxHp) { unit.hp = Math.min(unit.maxHp, unit.hp + FLAG_HEAL); unit.soldiers = soldiersOf(unit); }
  addLog(battle, early ? `${unit.name}先站上了据点；第 ${OBJECTIVE_RULES.from} 轮起才开始计数。` : contested ? `${unit.name}守在据点上，但周围还有敌人，占领进度暂停（${flag.hold} / ${HOLD_ROUNDS}）。` : `${unit.name}占据据点（${flag.hold} / ${HOLD_ROUNDS}）。`);
  if (flag.hold >= HOLD_ROUNDS) finalize(battle, unit.side, 'objective');
}
function strike(battle, unit, targetId, skill = false) {
  const choice = targetsFor(battle, unit, skill).find(item => item.targetId === targetId);
  assert(choice, '目标不在有效范围内，或本回合已经行动。');
  if (skill && unit.kind === 'guard') {
    unit.hp = Math.min(unit.maxHp, unit.hp + 6); unit.soldiers = soldiersOf(unit); unit.shield = 3;
    if (choice.heal > 0) recordSupport(battle, unit, unit, 'heal');
    addLog(battle, `${unit.name}固守阵地，恢复 ${choice.heal} 生命并获得 3 点减伤。`);
  } else if (skill && unit.kind === 'support') {
    const ally = battle.units.find(item => item.id === targetId);
    ally.hp = Math.min(ally.maxHp, ally.hp + choice.heal); ally.soldiers = soldiersOf(ally);
    if (choice.heal > 0) recordSupport(battle, unit, ally, 'heal');
    if (unit.fx?.encore && ally !== unit) { ally.acted = false; ally.moved = false; }
    addLog(battle, `${unit.name}发动鼓舞，${ally.name}恢复 ${choice.heal} 生命。`);
  } else {
    // This is a valid hostile strike, shared by manual play and Auto. Record
    // contact before damage: shields/undying must not erase a real encounter.
    // Never manufacture a known history for an imported older battle.
    const target = battle.units.find(item => item.id === targetId);
    recordContact(battle, unit, target);
    recordPassiveSupport(battle, unit, target, skill, choice);
    const lethal = target.hp - choice.damage <= 0;
    unit.facing = faceIndex(target.x - unit.x, target.y - unit.y);
    battle.fx = [...(battle.fx || []), { id: target.id, amount: choice.damage, tag: choice.angle === 'front' ? '' : ANGLE_NAME[choice.angle], kill: lethal }].slice(-16);
    if (lethal && target.fx?.undying && !target.undyingUsed) { target.undyingUsed = true; target.hp = 1; addLog(battle, `${target.name}撑住了最后一口气！`); }
    else target.hp -= choice.damage;
    target.soldiers = soldiersOf(target);
    if (target.hp <= 0) unit.kills = (unit.kills || 0) + 1;
    addLog(battle, `${unit.name}${skill ? `使用${classes[unit.kind].skillLabel}` : choice.angle === 'front' ? '攻击' : `${ANGLE_NAME[choice.angle]}`}${target.name}，造成 ${choice.damage} 点伤害${target.hp <= 0 ? '，对方分队退出战斗' : ''}。`);
    if (target.hp > 0 && choice.counter) {
      recordContact(battle, target, unit);
      if (choice.counter >= unit.hp && unit.fx?.undying && !unit.undyingUsed) { unit.undyingUsed = true; unit.hp = 1; }
      else unit.hp = Math.max(0, unit.hp - choice.counter);
      if (!alive(unit)) target.kills = (target.kills || 0) + 1;
      unit.soldiers = soldiersOf(unit);
      battle.fx.push({ id: unit.id, amount: choice.counter, tag: '反击', kill: unit.hp <= 0 });
      addLog(battle, `${target.name}反击，造成 ${choice.counter} 点伤害。`);
    }
  }
  const reaped = unit.fx?.reap && !unit.reapUsed && battle.units.find(item => item.id === targetId)?.hp <= 0;
  if (!unit.fx?.kite) unit.moved = true;
  unit.acted = true;
  if (reaped && alive(unit)) { unit.acted = false; unit.moved = true; unit.reapUsed = true; addLog(battle, `${unit.name}乘胜追击！`); }
  if (skill) { if (unit.skillLeft > 0) unit.skillLeft--; else unit.skillUsed = true; }
  checkEnd(battle);
}
function moveUnit(battle, unit, x, y) {
  assert(reachable(battle, unit).some(cell => cell.x === x && cell.y === y), '该位置不可达、被占据或已超出移动范围。');
  unit.facing = faceIndex(x - unit.x, y - unit.y); unit.charged = distance(unit, { x, y });
  unit.x = x; unit.y = y; unit.moved = true;
  for (const watcher of battle.units.filter(other2 => alive(other2) && other2.side !== unit.side && other2.overwatch)) {
    if (!flightArc(watcher, watcher, unit) || distance(watcher, unit) > rangeFrom(battle, watcher) || !visibleFrom(battle, watcher, unit)) continue;
    watcher.overwatch = false; scaledHit(battle,watcher,unit,.65,C.overwatch);
    checkEnd(battle); if (!alive(unit) || battle.phase === 'result') break;
  }
  addLog(battle, `${unit.name}移动至 ${x + 1},${y + 1}。`);
}
/** Reduced attacks still respect survival traits, causal support and real kill credit. */
function scaledHit(battle,source,target,scale,tag){
  const damage=Math.min(target.hp,Math.max(1,Math.ceil(strikeReport(battle,source,target,false).rawDamage*scale)));
  recordContact(battle,source,target);
  if(battle.progression?.version===2)for(const supporter of battle.units){
    if(supporter===source||supporter===target||!alive(supporter))continue;
    const recipient=supporter.side===source.side?source:target;
    if(distance(supporter,recipient)!==1)continue;
    const without=Math.min(target.hp,Math.max(1,Math.ceil(strikeReport(battle,source,target,false,supporter.id).rawDamage*scale)));
    if(hpAfterHit(target,damage)!==hpAfterHit(target,without)||(damage>=target.hp)!==(without>=target.hp))recordSupport(battle,supporter,recipient,'passive');
  }
  const remaining=hpAfterHit(target,damage);
  if(remaining===1&&damage>=target.hp&&target.fx?.undying&&!target.undyingUsed)target.undyingUsed=true;
  target.hp=remaining;target.soldiers=soldiersOf(target);
  if(target.hp<=0)source.kills=(source.kills||0)+1;
  battle.fx=[...(battle.fx||[]),{id:target.id,amount:damage,tag,kill:target.hp<=0}].slice(-16);
  addLog(battle,source.name+' · '+tag);
}
function resetSide(battle, side) {
  for (const unit of battle.units.filter(item => item.side === side && alive(item))) { unit.moved = false; unit.acted = false; unit.shield = 0; unit.braced = false; unit.overwatch = false; unit.turned = false; unit.suppressed = Math.max(0, (unit.suppressed || 0) - 1); unit.reapUsed = false; unit.charged = 0; }
}
function targetValue(option, unit) {
  return option.damage + (option.canDefeat ? 18 : 0) - option.counter - (option.counter >= unit.hp ? 24 : 0);
}
function bestTarget(options, battle, unit) {
  return [...options].sort((a, b) => targetValue(b, unit) - targetValue(a, unit) || battle.units.find(item => item.id === a.targetId).hp - battle.units.find(item => item.id === b.targetId).hp)[0];
}
// Actual walking distance, not straight-line distance: units must go around
// water, cliffs and walls instead of oscillating at the closest blocked edge.
function strategicDistances(battle, unit, goals) {
  const costs = new Map(), queue = [];
  for (const goal of goals) { costs.set(key(goal.x, goal.y), 0); queue.push({ x: goal.x, y: goal.y, cost: 0 }); }
  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift();
    if (current.cost !== costs.get(key(current.x, current.y))) continue;
    for (const [dx, dy] of directions) {
      const x = current.x + dx, y = current.y + dy, tile = tileAt(battle, x, y);
      if (!canEnter(tile, unit)) continue;
      const cost = current.cost + stepCost(tileAt(battle, current.x, current.y), unit);
      if (cost >= (costs.get(key(x, y)) ?? Infinity)) continue;
      costs.set(key(x, y), cost); queue.push({ x, y, cost });
    }
  }
  return cell => costs.get(key(cell.x, cell.y)) ?? Infinity;
}
function kiteAfterAttack(battle, unit) {
  if (!unit.fx?.kite || !unit.acted || unit.moved || !alive(unit) || battle.phase === 'result') return;
  const enemies = battle.units.filter(enemy => alive(enemy) && enemy.side !== unit.side), flag = battle.objective;
  if (!enemies.length || (flag && distance(unit, flag) === 0)) return;
  const holder = flag && unitAt(battle, flag.x, flag.y);
  if (holder?.side !== unit.side && flag?.hold >= HOLD_ROUNDS - 1 && distance(unit, flag) <= 1) return;
  const score = cell => Math.min(6, ...enemies.map(enemy => distance(cell, enemy))) * 3 + (tileAt(battle, cell.x, cell.y)?.defense || 0)
    - (flag ? distance(cell, flag) * .2 : 0);
  const here = score(unit), best = reachable(battle, unit).sort((a, b) => score(b) - score(a) || a.cost - b.cost || a.y - b.y || a.x - b.x)[0];
  if (best && score(best) > here + 1) {
    moveUnit(battle, unit, best.x, best.y);
    const near = [...enemies].sort((a, b) => distance(a, unit) - distance(b, unit))[0];
    // Turning is also free for the player after moving. Do not retreat with the
    // skirmisher's back needlessly pointed at the unit pursuing it.
    unit.facing = faceIndex(near.x - unit.x, near.y - unit.y);
  }
}
function autoSide(battle, side) {
  const roster = battle.units.filter(item => item.side === side && alive(item));
  // Reap and encore really grant another action. Bounded follow-up passes also
  // handle a late healer restoring an earlier unit in the initiative order.
  for (let pass = 0; pass <= MAX_SQUADS; pass++) for (const unit of roster) {
    if (battle.phase === 'result') return;
    if (unit.acted || !alive(unit)) continue;
    const flag = battle.objective, holder = flag && unitAt(battle, flag.x, flag.y);
    const enemyFlag = holder && holder.side !== side;
    const urgentFlag = enemyFlag && flag.holder !== side && flag.hold >= HOLD_ROUNDS - 1;
    let anchor = flag && distance(unit, flag) === 0;
    // Deny an imminent loss even if a more tempting wounded enemy is elsewhere.
    // Standing adjacent contests the flag, so a guard need not kill its holder.
    if (urgentFlag) {
      if (distance(unit, flag) <= 1) anchor = true;
      else if (!unit.moved) {
        const contest = reachable(battle, unit).filter(cell => distance(cell, flag) <= 1)
          .sort((a, b) => (tileAt(battle, b.x, b.y)?.defense || 0) - (tileAt(battle, a.x, a.y)?.defense || 0) || a.cost - b.cost || a.y - b.y || a.x - b.x)[0];
        if (contest) { moveUnit(battle, unit, contest.x, contest.y); anchor = true; }
      }
    }
    const lethal = targetsFor(battle, unit).some(option => option.canDefeat && option.counter < unit.hp);
    if (unit.kind === 'guard' && !unit.skillUsed && unit.hp <= unit.maxHp / 2 && !lethal) { strike(battle, unit, unit.id, true); continue; }
    if (unit.kind === 'support' && !unit.skillUsed) {
      const hurt = targetsFor(battle, unit, true).sort((a, b) => b.heal - a.heal)[0];
      if (hurt && hurt.heal >= 8) { strike(battle, unit, hurt.targetId, true); continue; }
    }
    const offensive = unit.kind === 'guard' || unit.kind === 'support' ? () => [] : () => targetsFor(battle, unit, true);
    // Look for the square that lands the best blow: behind or beside a foe if possible, and clear of a heavy reply.
    if (!unit.moved && !anchor) {
      const here = { x: unit.x, y: unit.y, facing: unit.facing, charged: unit.charged }, value = () => Math.max(-Infinity, ...[...targetsFor(battle, unit), ...offensive()].map(item => targetValue(item, unit)));
      let best = null, bestScore = value();
      for (const cell of reachable(battle, unit)) {
        Object.assign(unit, cell, { charged: distance(here, cell), facing: faceIndex(cell.x - here.x, cell.y - here.y) });
        const score = value() + (tileAt(battle, cell.x, cell.y)?.defense || 0) * .5;
        Object.assign(unit, here);
        if (score > bestScore + .5) { bestScore = score; best = cell; }
      }
      if (best) moveUnit(battle, unit, best.x, best.y);
    }
    let skills = offensive(), attacks = targetsFor(battle, unit);
    if (!skills.length && !attacks.length && !unit.moved && !anchor) {
      const enemies = battle.units.filter(target => target.side !== side && alive(target));
      const moves = reachable(battle, unit);
      const towardEnemy = strategicDistances(battle, unit, enemies);
      const towardFlag = strategicDistances(battle, unit, battle.objective ? [battle.objective] : []);
      const score = cell => Math.min(towardEnemy(cell) * 10, towardFlag(cell) * 8) - (tileAt(battle, cell.x, cell.y)?.defense || 0);
      moves.sort((a, b) => score(a) - score(b) || a.cost - b.cost || a.y - b.y || a.x - b.x);
      if (moves.length) moveUnit(battle, unit, moves[0].x, moves[0].y);
      skills = offensive(); attacks = targetsFor(battle, unit);
    }
    const skill = bestTarget(skills, battle, unit), attack = bestTarget(attacks, battle, unit);
    // Save a once-per-battle skill when an ordinary blow already does the same
    // job without retaliation. A preview never claims to kill an unused undying.
    if (skill && (!attack || targetValue(skill, unit) > targetValue(attack, unit) + .5)) strike(battle, unit, skill.targetId, true);
    else if (attack) strike(battle, unit, attack.targetId);
    else if (skill) strike(battle, unit, skill.targetId, true);
    else {
      unit.moved = true; unit.acted = true;
      const near = battle.units.filter(target => target.side !== side && alive(target)).sort((a, b) => distance(a, unit) - distance(b, unit))[0];
      if (near) unit.facing = faceIndex(near.x - unit.x, near.y - unit.y);
    }
    kiteAfterAttack(battle, unit);
  }
}
function finishPlayerRound(battle) {
  for (const unit of battle.units.filter(item => item.side === battle.playerSide && alive(item))) { unit.acted = true; unit.moved = true; }
  const enemySide = other(battle.playerSide);
  resetSide(battle, enemySide);
  autoSide(battle, enemySide);
  if (battle.phase === 'result') return;
  tickObjective(battle);
  if (battle.phase === 'result') return;
  battle.round++;
  if (battle.round > 40) { finalize(battle, 'defender', 'stalemate'); return; }
  resetSide(battle, battle.playerSide);
  addLog(battle, `第 ${battle.round} 轮：我方行动。`);
}
export function performTactical(battle, action) {
  try {
    assert(battle?.phase === 'player', '当前没有待指挥的战斗。');
    const next = copy(battle);
    next.fx = [];
    if (action.type === 'battleFace') {
      const unit = next.units.find(item => item.id === action.unitId);
      assert(unit && alive(unit) && unit.side === next.playerSide, '请选择我方仍在作战的分队。');
      assert(Number.isInteger(action.facing) && action.facing >= 0 && action.facing < FACINGS.length, '朝向无效。');
      assert(!unit.plane || !unit.acted && !unit.turned, C.invalidAction);
      if (unit.plane) unit.turned = true;
      unit.facing = action.facing;
      return { ok: true, battle: next };
    }
    if (action.type === 'battleRetreat') finalize(next, other(next.playerSide), 'retreat');
    else if (action.type === 'battleEndTurn') finishPlayerRound(next);
    else if (action.type === 'battleAuto') {
      let safety = 0;
      while (next.phase === 'player' && safety++ < 45) { autoSide(next, next.playerSide); if (next.phase === 'player') finishPlayerRound(next); }
      assert(next.phase === 'result', '自动指挥尚未结束。');
    } else {
      const unit = next.units.find(item => item.id === action.unitId);
      assert(unit && alive(unit) && unit.side === next.playerSide, '请选择我方仍在作战的分队。');
      assert(['battleMove', 'battleWait'].includes(action.type) ? !spent(unit) : !unit.acted, '该分队本轮已经完成行动。');
      if (action.type === 'battleMove') moveUnit(next, unit, action.x, action.y);
      else if (action.type === 'battleAttack') strike(next, unit, action.targetId, false);
      else if (action.type === 'battleSkill') strike(next, unit, action.targetId || (unit.kind === 'guard' ? unit.id : ''), true);
      else if (action.type === 'battleBrace') { unit.braced = true; unit.moved = true; unit.acted = true; addLog(next, unit.name + ' · ' + C.brace); }
      else if (action.type === 'battleOverwatch') { unit.overwatch = true; unit.moved = true; unit.acted = true; addLog(next, unit.name + ' · ' + C.overwatch); }
      else if (action.type === 'battleSuppress') {
        const target = next.units.find(item => item.id === action.targetId);
        assert(targetsFor(next, unit).some(t => t.targetId === action.targetId), C.invalidAction);
        scaledHit(next,unit,target,.6,C.suppress);target.suppressed=2;unit.facing=faceIndex(target.x-unit.x,target.y-unit.y);
        unit.acted = true; unit.moved = true; checkEnd(next);
      }
      else if (action.type === 'battleWait') { unit.moved = true; unit.acted = true; addLog(next, `${unit.name}原地待命。`); }
      else throw new Error('不支持的战场指令。');
    }
    return { ok: true, battle: next };
  } catch (error) { return { ok: false, battle, error: error.message }; }
}
/** Multiplayer uses the same movement, damage and skills, but never plays the opponent's orders. */
export function performVersusTactical(battle, action) {
  if (!['battleEndTurn', 'battleAutoTurn'].includes(action.type)) {
    if (!['battleMove', 'battleFace', 'battleAttack', 'battleSkill', 'battleWait', 'battleRetreat'].includes(action.type))
      return { ok: false, battle, error: '联机战场不支持这条指令。' };
    return performTactical(battle, action);
  }
  try {
    assert(battle?.phase === 'player', '当前没有待指挥的战斗。');
    const next = copy(battle), side = next.playerSide;
    next.fx = [];
    if (action.type === 'battleAutoTurn') autoSide(next, side);
    if (next.phase === 'result') return { ok: true, battle: next };
    for (const unit of next.units.filter(item => item.side === side && alive(item))) {
      unit.acted = true; unit.moved = true;
    }
    if (side === 'defender') {
      tickObjective(next);
      if (next.phase === 'result') return { ok: true, battle: next };
      next.round++;
      if (next.round > 40) {
        finalize(next, 'defender', 'stalemate');
        return { ok: true, battle: next };
      }
    }
    next.playerSide = other(side);
    resetSide(next, next.playerSide);
    addLog(next, `第 ${next.round} 轮：${next.playerSide === 'attacker' ? '进攻方' : '防守方'}行动。`);
    return { ok: true, battle: next };
  } catch (error) { return { ok: false, battle, error: error.message }; }
}
export function validateTactical(battle) {
  const errors = [];
  const int = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;
  if (!battle || typeof battle !== 'object') return { ok: false, errors: ['战场无效。'] };
  if (battle.mission !== undefined && !['conquest', 'raid'].includes(battle.mission)) errors.push('战场任务无效。');
  if (battle.progression !== undefined && (!battle.progression || typeof battle.progression !== 'object' || Array.isArray(battle.progression) || ![1, 2].includes(battle.progression.version) || typeof battle.progression.hostileContact !== 'boolean')) errors.push('战场成长参与记录无效。');
  if (battle.tech !== undefined && (!battle.tech || typeof battle.tech !== 'object' || ['attacker', 'defender'].some(side => !int(battle.tech[side]?.attack, 0, 6) || !int(battle.tech[side]?.defense, 0, 6)))) errors.push('战场科技加成无效。');
  if (battle.training !== undefined && (!battle.training || typeof battle.training !== 'object' || ['attacker', 'defender'].some(side => !int(battle.training[side], 1, MAX_ARMY_TRAINING)))) errors.push('战场训练等级无效。');
  if (!int(battle.width, 7, 16) || !int(battle.height, 7, 16) || !['player', 'result'].includes(battle.phase) || !['attacker', 'defender'].includes(battle.playerSide) || !int(battle.round, 1, 41)) errors.push('战场尺寸、回合或阶段无效。');
  if (!Array.isArray(battle.tiles) || battle.tiles.length !== battle.width * battle.height || !Array.isArray(battle.units) || battle.units.length > 12 || !Array.isArray(battle.log) || battle.log.length > 100) return { ok: false, errors: [...errors, '战场地块、分队或日志无效。'] };
  const coordinates = new Set(), occupied = new Set(), ids = new Set();
  for (const tile of battle.tiles) {
    if (!int(tile?.x, 0, battle.width - 1) || !int(tile?.y, 0, battle.height - 1) || !Object.hasOwn(BATTLE_TERRAIN, tile.kind) || typeof tile.walkable !== 'boolean' || !int(tile.defense, 0, 8) || coordinates.has(key(tile.x, tile.y))) errors.push('战场地形数据无效。');
    if (tile.siegeCover !== undefined || tile.siegeFacing !== undefined) {
      if (!battle.siege || !int(tile.siegeCover, 1, 3) || tile.siegeFacing !== 2 || !tile.walkable || tile.defense < tile.siegeCover) errors.push('胸墙格数据无效。');
    }
    coordinates.add(key(tile.x, tile.y));
  }
  if (battle.siege !== undefined) {
    const siege = battle.siege, works = battle.tiles.filter(tile => tile.siegeCover !== undefined);
    if (!siege || !int(siege.level, 1, 5) || siege.cover !== Math.ceil(siege.level / 2) || siege.facing !== 2 || !Array.isArray(siege.cells) || siege.cells.length > 3 || siege.cells.length !== works.length || siege.cells.some(cell => !cell || !int(cell.x, 0, battle.width - 1) || !int(cell.y, 0, battle.height - 1)) || new Set(siege.cells.map(cell => key(cell.x, cell.y))).size !== works.length
      || works.some(tile => tile.siegeCover !== siege.cover || tile.siegeFacing !== siege.facing || !siege.cells.some(cell => cell.x === tile.x && cell.y === tile.y))) errors.push('围城胸墙记录无效。');
  }
  for (const unit of battle.units) {
    if (!unit || typeof unit.id !== 'string' || ids.has(unit.id) || !['attacker', 'defender'].includes(unit.side) || !classes[unit.kind] || !int(unit.x, 0, battle.width - 1) || !int(unit.y, 0, battle.height - 1) || !int(unit.hp, 0, unit.maxHp) || !int(unit.maxHp, 6, 900) || !int(unit.initialSoldiers, 0, 100) || unit.maxHp < unit.initialSoldiers * 8 || unit.soldiers !== soldiersOf(unit) || !['hero', 'N', 'R', 'SR', 'SSR'].includes(rankOf(unit))) { errors.push('战场分队数据无效。'); continue; }
    if (!unit.stats || ['attack', 'defense', 'scout', 'economy'].some(stat => !int(unit.stats[stat], 0, 99)) || !int(unit.move, 1, 9) || !int(unit.range, 1, 9) || ['moved', 'acted', 'skillUsed'].some(field => typeof unit[field] !== 'boolean') || !int(unit.shield, 0, 3)) errors.push('战场分队能力无效。');
    if(['braced','overwatch','turned','plane','nativeFlight'].some(field=>unit[field]!==undefined&&typeof unit[field]!=='boolean')||unit.suppressed!==undefined&&!int(unit.suppressed,0,2))errors.push('campaign.tacticalStatus');
    if (unit.plane) {const model=AIRCRAFT_MODELS[unit.aircraftModelId];if(battle.environment!=='air'||!model||!int(unit.pilotAttack,0,99)||unit.stats.defense!==model.defense||unit.stats.attack!==Math.min(99,unit.pilotAttack+model.attack)||unit.move!==Math.min(9,model.speed)||unit.range!==8||unit.maxHp!==unit.initialSoldiers*8+26+model.defense*2)errors.push('transport.aircraftStats');}
    if (unit.trainingLevel !== undefined && !unit.plane) {
      const trained = regularTrainingProfile(unit.trainingLevel);
      if (!int(unit.trainingLevel, 2, MAX_ARMY_TRAINING) || unit.characterId !== null || rankOf(unit) === 'hero' || unit.level !== unit.trainingLevel || unit.stats?.attack !== trained.attack || unit.stats?.defense !== trained.defense || unit.stats?.scout !== 0 || unit.stats?.economy !== 0 || unit.maxHp !== unit.initialSoldiers * 8 + (SAZAI_RANKS[rankOf(unit)]?.hp || 0) + trained.hpBonus || !trained.roles.includes(unit.kind) || Object.keys(unit.fx || {}).length || unit.move !== classes[unit.kind]?.move || unit.range !== classes[unit.kind]?.range) errors.push('常备军训练记录无效。');
    }
    if (!unit.characterId && (unit.trainingLevel || 1) !== (battle.training?.[unit.side] || 1)) errors.push('常备军等级与开战记录不一致。');
    ids.add(unit.id);
    if (alive(unit)) {
      if (!tileAt(battle, unit.x, unit.y)?.walkable || occupied.has(key(unit.x, unit.y))) errors.push('分队位置互相重叠或不可通行。');
      occupied.add(key(unit.x, unit.y));
    }
  }
  for (const side of ['attacker', 'defender']) {
    const actual = battle.units.filter(unit => unit.side === side && unit.characterId).map(unit => unit.characterId).sort();
    if (!Array.isArray(battle.participantIds?.[side]) || JSON.stringify([...battle.participantIds[side]].sort()) !== JSON.stringify(actual) || new Set(actual).size !== actual.length || actual.length > MAX_SQUADS) errors.push('参战角色名单无效。');
    if (battle.units.filter(unit => unit.side === side).reduce((sum, unit) => sum + unit.initialSoldiers, 0) !== (side === 'attacker' ? battle.initialAttackingTroops : battle.initialDefendingTroops)) errors.push('初始兵力与战场分队不一致。');
  }
  if (battle.progression?.version === 2) {
    const ledger = battle.progression, units = new Map(battle.units.map(unit => [unit?.id, unit]));
    const shape = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === keys.length && keys.every(field => Object.hasOwn(value, field));
    const contacts = Array.isArray(ledger.contacts) ? ledger.contacts : [], supports = Array.isArray(ledger.supports) ? ledger.supports : [];
    const combatants = new Set(), seenContact = new Set(), seenSupport = new Set();
    let invalid = !shape(ledger, ['version', 'hostileContact', 'contacts', 'supports']) || !Array.isArray(ledger.contacts) || !Array.isArray(ledger.supports) || contacts.length > 72 || supports.length > 432 || ledger.hostileContact !== (contacts.length > 0);
    for (const link of contacts) {
      const source = units.get(link?.sourceId), target = units.get(link?.targetId), key = JSON.stringify([link?.sourceId, link?.targetId]);
      if (!shape(link, ['sourceId', 'targetId']) || !source || !target || source.side === target.side || seenContact.has(key)) invalid = true;
      else { combatants.add(source.id); combatants.add(target.id); }
      seenContact.add(key);
    }
    for (const link of supports) {
      const source = units.get(link?.sourceId), target = units.get(link?.targetId), key = JSON.stringify([link?.sourceId, link?.targetId, link?.kind]);
      if (!shape(link, ['sourceId', 'targetId', 'kind']) || !source || !target || source.side !== target.side || seenSupport.has(key)) invalid = true;
      else if (link.kind === 'heal') {
        // A legitimate heal may predate the recipient's first recorded contact.
        // Keep the source history, but do not use it as a support chain or proof
        // of hostile contact. Eligibility is anchored at settlement instead.
        if (source.kind !== 'support' && !(source.kind === 'guard' && source.id === target.id)) invalid = true;
      } else if (link.kind === 'regen') {
        if (source.id === target.id || !(source.fx?.regen > 0)) invalid = true;
      } else if (link.kind === 'passive') {
        const resonanceSource = (target.group || target.pals?.length) && (source.group === target.group || target.pals?.includes(source.characterId));
        if (source.id === target.id || !combatants.has(target.id) || !(resonanceSource || source.kind === 'support' || source.fx?.cheer || source.fx?.aura)) invalid = true;
      } else invalid = true;
      seenSupport.add(key);
    }
    if (invalid) errors.push('战场逐队参与来源记录无效。');
  }
  if (battle.phase === 'result' && (!battle.result || !['attacker', 'defender'].includes(battle.result.winnerSide) || !Array.isArray(battle.result.capturedCharacterIds) || battle.result.capturedCharacterIds.length > 2 || !int(battle.result.attackerSurvivors, 0, battle.initialAttackingTroops) || !int(battle.result.defenderSurvivors, 0, battle.initialDefendingTroops))) errors.push('战场结果无效。');
  else if (battle.phase === 'result') {
    const result = battle.result, loserSide = other(result.winnerSide), participants = battle.participantIds?.[loserSide] || [];
    if (result.growthSuppressed !== (tacticalGrowthSuppressed(battle) ? 'no-contact-retreat' : undefined)) errors.push('战场成长结算与参与记录不一致。');
    if (result.growthLimited !== (tacticalGrowthLimited(battle) ? 'participants-only-retreat' : undefined)) errors.push('战场成长范围与逐队参与记录不一致。');
    const expectedCaptures = Math.min(2, battle.units.filter(unit => unit.side === loserSide && unit.characterId && (!alive(unit) || result.reason === 'retreat')).length);
    if (result.winnerId !== (result.winnerSide === 'attacker' ? battle.attackerId : battle.defenderId) || result.loserId !== (loserSide === 'attacker' ? battle.attackerId : battle.defenderId) || result.playerWon !== (result.winnerSide === battle.playerSide) || !['retreat', 'elimination', 'stalemate', 'objective'].includes(result.reason)) errors.push('战场结果的胜负阵营无效。');
    if (result.capturedCharacterIds.length > expectedCaptures || new Set(result.capturedCharacterIds).size !== result.capturedCharacterIds.length || result.capturedCharacterIds.some(id => !participants.includes(id))) errors.push('俘虏必须来自本场失败方的实际参战角色。');
    if (result.attackerSurvivors !== battle.units.filter(unit => unit.side === 'attacker').reduce((sum, unit) => sum + soldiersOf(unit), 0) || result.defenderSurvivors !== battle.units.filter(unit => unit.side === 'defender').reduce((sum, unit) => sum + soldiersOf(unit), 0) || !battle.units.some(unit => unit.side === result.winnerSide && alive(unit))) errors.push('战场存活兵力与结果不一致。');
  }
  if (battle.phase === 'player' && battle.result !== null) errors.push('未结束战斗不能预先写入结果。');
  return { ok: errors.length === 0, errors };
}

function flightArc(unit, origin, target) {
  if (!unit.plane) return true;
  const [dx, dy] = FACINGS[unit.facing ?? 0], x = target.x - origin.x, y = target.y - origin.y;
  return dx ? y === 0 && x * dx > 0 : x === 0 && y * dy > 0;
}
function laySpecialField(environment, seed) {
  const tiles = [], objective = { x: 5, y: 3, holder: null, hold: 0 };
  for (let y = 0; y < BATTLE_HEIGHT; y++) for (let x = 0; x < BATTLE_WIDTH; x++) {
    const mirrored = Math.min(x, BATTLE_WIDTH - 1 - x), value = roll(seed, mirrored, y, environment);
    let kind = environment === 'air' ? 'sky' : 'deck';
    if (x > 2 && x < 8 && Math.abs(y - 3) > 1) kind = environment === 'air' ? value < .25 ? 'cloud' : value < .45 ? 'turbulence' : 'updraft' : value < .25 ? 'cargo' : value < .5 ? 'rigging' : 'slipperyDeck';
    if (environment === 'sea' && x > 2 && x < 8 && y === 2 && x !== 5) kind = 'deckCover';
    if (x === objective.x && y === objective.y) kind = 'fort';
    tiles.push({ x, y, kind, walkable: true, defense: BATTLE_TERRAIN[kind].cover });
  }
  return { tiles, objective, theme: environment };
}

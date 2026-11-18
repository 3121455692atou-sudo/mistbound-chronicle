// Character growth. Everything here is data plus pure functions, so adding a stat,
// a perk or a title never touches the engine's control flow.
import { CHARACTER_QUIRKS } from './quirk-table.mjs?v=1118-1603';

/** Live stats. To open a reserved slot, move it here and read it where it should matter. */
export const STATS = [
  { id: 'attack', name: '统军', about: '攻击伤害' },
  { id: 'defense', name: '守备', about: '生命上限和减伤' },
  { id: 'scout', name: '探险', about: '探索时揭开的范围', cap: 3 },
  { id: 'economy', name: '经营', about: '领军或任职时增加收入' },
  { id: 'charm', name: '魅力', about: '提高招募时遇到少女的概率，增强牢房劝说的交涉效果。' },
];
export const RESERVED_STATS = [{ id: 'wit', name: '智略' }, { id: 'luck', name: '运势' }, { id: 'art', name: '才艺' }];
/** Personal traits follow from who she is, so a new character gets one with no extra work. */
export const TRAITS = [
  { id: 't_power', name: '猛将', desc: '伤害 +1', test: s => s.attack >= 5, fx: { power: 1 } },
  { id: 't_wall', name: '铁壁', desc: '生命 +10', test: s => s.defense >= 4, fx: { hp: 10 } },
  { id: 't_scout', name: '探路', desc: '移动 +1', test: s => s.scout >= 2, fx: { move: 1 } },
  { id: 't_gold', name: '理财', desc: '在麾下时每回合金币 +2', test: s => s.economy >= 4, eco: { gold: 2 } },
  { id: 't_star', name: '人气', desc: '招募遇到少女的概率 +0.2%', test: s => s.charm >= 5, eco: { girl: 0.002 } },
  { id: 't_all', name: '多面手', desc: '获得经验 +30%', test: s => Math.max(s.attack, s.defense, s.economy) <= 3, eco: { exp: 0.3 } },
];
export const traitsOf = stats => TRAITS.filter(trait => trait.test({ charm: 0, ...stats }));
/** Signature traits (专属词条). Every character carries exactly one. They never touch battle numbers:
 * each changes how the realm runs depending on where she is — in the realm at all, leading it, holding
 * an office, stationed on a tile, or marching with an army — so who you have and where you put her matters.
 * `stat` is the strong suit that makes a girl likely to have it; the engine reads `id`. */
export const QUIRKS = [
  { id: 'q_gold', stat: 'economy', where: 'realm', name: '生财', desc: '只要在己方麾下，每回合额外获得 2 金币', eco: { gold: 2 } },
  { id: 'q_shop', stat: 'economy', where: 'seat', name: '行商', desc: '驻扎在商站、矿场、渔港或考古营地时，该地每回合金币产出 +3' },
  { id: 'q_build', stat: 'economy', where: 'seat', name: '监工', desc: '她驻扎的地块，建造和升级建筑只收七成金币' },
  { id: 'q_ledger', stat: 'economy', where: 'post', name: '管家', desc: '任财务官时每回合金币 +2，任军需官时每回合补给 +2' },
  { id: 'q_grain', stat: 'defense', where: 'realm', name: '屯田', desc: '在麾下时每回合补给 +2', eco: { supply: 2 } },
  { id: 'q_farm', stat: 'defense', where: 'seat', name: '农学', desc: '驻扎在农庄、伐木场或渔港时，该地每回合补给产出 +3' },
  { id: 'q_drill', stat: 'defense', where: 'seat', name: '练兵', desc: '她驻扎的地块，每次征募多 2 名罪袋' },
  { id: 'q_warden', stat: 'defense', where: 'capital', name: '典狱', desc: '她在首都时，牢里俘虏的逃跑风险降低 5%' },
  { id: 'q_march', stat: 'attack', where: 'army', name: '急行军', desc: '随编队行动时，该编队每回合可用行军路程 +1' },
  { id: 'q_baggage', stat: 'attack', where: 'army', name: '辎重', desc: '随编队行动时，该编队行军不消耗补给' },
  { id: 'q_van', stat: 'attack', where: 'army', name: '先锋', desc: '随编队行动时，该编队每回合首次进攻不消耗指令' },
  { id: 'q_loot', stat: 'attack', where: 'army', name: '掠夺', desc: '随编队行动时，该编队劫掠带回的资源多一半' },
  { id: 'q_scout', stat: 'scout', where: 'lead', name: '斥候', desc: '领军时探索范围 +1' },
  { id: 'q_pioneer', stat: 'scout', where: 'lead', name: '拓荒', desc: '由她领军时，开拓地块只花一半金币' },
  { id: 'q_road', stat: 'scout', where: 'office', name: '筑路', desc: '领军或担任官员时，修路不消耗指令' },
  { id: 'q_plan', stat: 'charm', where: 'office', name: '运筹', desc: '由她领军或任职时每回合指令 +1。多个运筹不叠加，全国每回合只多1道指令' },
  { id: 'q_idol', stat: 'charm', where: 'realm', name: '招牌', desc: '在麾下时，招募遇到少女的概率额外 +0.3%', eco: { girl: 0.003 } },
  { id: 'q_tongue', stat: 'charm', where: 'lead', name: '说客', desc: '由她领军时，在牢房每次交涉多积累 8 点交涉准备' },
  { id: 'q_envoy', stat: 'charm', where: 'lead', name: '亲善', desc: '领军时寒暄好感 +2；送礼基础好感 +2，实际加多少看当前金额按钮上的数字' },
  { id: 'q_muse', stat: 'charm', where: 'tile', name: '开心果', desc: '与她处于同一地块的同伴，每回合多恢复 4 点干劲' },
];
/** Where a signature trait takes effect, in the words the character page uses. */
export const QUIRK_PLACES = { realm: '在麾下就生效', seat: '驻扎时生效', post: '任职时生效', capital: '在首都时生效', army: '随编队时生效', lead: '领军时生效', office: '领军或任职时生效', tile: '同一地块生效' };
const QUIRK_BY_ID = new Map(QUIRKS.map(quirk => [quirk.id, quirk]));
const QUIRK_ORDER = ['attack', 'defense', 'economy', 'charm', 'scout'];
const QUIRK_USUAL = { attack: [2.8, 1.25], defense: [2.2, .85], economy: [1.8, 1.25], charm: [3.9, 1.3], scout: [1.15, .62] };
const quirkCache = new Map();
function quirkHash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d); h ^= h >>> 15;
  return h >>> 0;
}
/** Her signature trait: the one a definition names (`quirk`), then the shipped table (quirk-table.mjs,
 * chosen from her original work), otherwise one that fits her two strongest suits, picked by her id so
 * it never changes between saves. Workshop characters without a `quirk` get the last kind. */
export function quirkOf(character) {
  if (!character || typeof character.id !== 'string' || character.quirk === 'none') return null;
  if (QUIRK_BY_ID.has(character.quirk)) return QUIRK_BY_ID.get(character.quirk);
  if (Object.hasOwn(CHARACTER_QUIRKS, character.id) && QUIRK_BY_ID.has(CHARACTER_QUIRKS[character.id])) return QUIRK_BY_ID.get(CHARACTER_QUIRKS[character.id]);
  const stats = character.stats || {}, key = `${character.id}|${QUIRK_ORDER.map(id => stats[id] || 0).join(',')}`;
  if (quirkCache.has(key)) return quirkCache.get(key);
  // "Strong suit" means stronger than girls usually are at it: almost everybody is charming, few can count.
  const weight = id => ((stats[id] || 0) - QUIRK_USUAL[id][0]) / QUIRK_USUAL[id][1];
  const ranked = [...QUIRK_ORDER].sort((a, b) => weight(b) - weight(a) || QUIRK_ORDER.indexOf(a) - QUIRK_ORDER.indexOf(b));
  const of = stat => QUIRKS.filter(quirk => quirk.stat === stat);
  const pool = [...of(ranked[0]), ...of(ranked[0]), ...of(ranked[1]).filter(quirk => quirk.id !== 'q_plan')];
  const quirk = pool[quirkHash(`quirk:${character.id}`) % pool.length];
  if (quirkCache.size > 4000) quirkCache.clear();
  quirkCache.set(key, quirk);
  return quirk;
}
export const quirkById = id => QUIRK_BY_ID.get(id) || null;
/** Empty equipment and story shelves the character page already draws. */
export const RESERVED_SLOTS = [{ id: 'gear1', name: '装备一' }, { id: 'gear2', name: '装备二' }, { id: 'gear3', name: '饰品' }];

export const MAX_LEVEL = 30;
export const expToNext = level => 30 + level * 20;
export const PERK_LEVELS = [5, 10, 15, 20];
export const BOND_TIERS = [
  { at: 0, name: '初识', reward: '' },
  { at: 20, name: '熟悉', reward: '每项特训上限 +1' },
  { at: 50, name: '信任', reward: '开战时获得 2 点护盾' },
  { at: 80, name: '默契', reward: '技能次数 +1' },
  { at: 100, name: '托付', reward: '每回合金币 +2，升级更容易涨属性' },
];
export const bondTier = bond => BOND_TIERS.reduce((tier, row, index) => bond >= row.at ? index : tier, 0);

export const GIFTS = [
  { id: 'sweet', name: '甜点' }, { id: 'tea', name: '好茶' }, { id: 'book', name: '书' },
  { id: 'tool', name: '保养工具' }, { id: 'plush', name: '玩偶' }, { id: 'snack', name: '零食' },
];
export const GIFT_COST = 8;
/** Early gifts still help her settle in; deeper trust takes shared time as well as presents. */
export const giftBondGain = (bond, liked = false) => Math.min(100 - bond, Math.max(1, Math.floor((liked ? 14 : 6) / (bond >= 80 ? 6 : bond >= 50 ? 4 : bond >= 20 ? 2 : 1))));

/** Girls of a nation's group that stay out of it when it arrives, so they stay recruitable. */
export const POSTS = [
  { id: 'finance', name: '财务官', stat: 'economy', about: '每点经营让每回合金币 +1' },
  { id: 'logistics', name: '军需官', stat: 'economy', about: '每点经营让每回合补给 +1' },
  { id: 'envoy', name: '招募官', stat: 'charm', about: '魅力计入招募，遇到少女的概率更高' },
  { id: 'strategist', name: '军师', stat: 'scout', about: '替领主分担政务：每回合指令 +1' },
];

const v = (id, name, desc, fx) => ({ id, name, desc, fx });
export const PERKS = {
  vanguard: [
    [v('v_charge', '猛冲', '移动 +1', { move: 1 }), v('v_reap', '乘胜追击', '击倒敌人后本轮可再行动一次', { reap: 1 })],
    [v('v_flank', '夹击', '目标旁边有友军时伤害 +2', { flank: 2 }), v('v_break', '破甲', '攻击无视 2 点防御', { pierce: 2 })],
    [v('v_last', '背水一战', '生命低于一半时伤害 +4', { last: 4 }), v('v_more', '连斩', '技能次数 +1', { skill: 1 })],
  ],
  ranger: [
    [v('r_long', '远射', '射程 +1', { range: 1 }), v('r_light', '轻装', '移动 +1，树林不减速', { move: 1, woods: 1 })],
    [v('r_first', '先手', '打满血目标时伤害 +3', { first: 3 }), v('r_eye', '鹰眼', '无视树林隐蔽，无视 1 点防御', { sight: 1, pierce: 1 })],
    [v('r_kite', '打了就跑', '先攻击也还能移动', { kite: 1 }), v('r_more', '再来一发', '技能次数 +1', { skill: 1 })],
  ],
  guard: [
    [v('g_wall', '铁壁', '生命 +14', { hp: 14 }), v('g_bite', '反击', '被近身攻击后还击一半伤害', { counter: 1 })],
    [v('g_aura', '掩护', '相邻友军受到的伤害 -1', { aura: 1 }), v('g_root', '扎根', '站在据点或高地时防御 +2', { root: 2 })],
    [v('g_undying', '不倒', '每场一次，致命伤害时保留 1 点生命', { undying: 1 }), v('g_more', '再筑一层', '技能次数 +1', { skill: 1 })],
  ],
  support: [
    [v('s_far', '传声', '鼓舞距离 +1', { healRange: 1 }), v('s_strong', '大声点', '鼓舞恢复量 +6', { healPlus: 6 })],
    [v('s_field', '随队', '每轮结束时相邻友军恢复 3 生命', { regen: 3 }), v('s_cheer', '打气', '相邻友军伤害 +1', { cheer: 1 })],
    [v('s_more', '安可', '技能次数 +1', { skill: 1 }), v('s_again', '再演一场', '鼓舞后目标可以再行动一次', { encore: 1 })],
  ],
};
export const COMMON_PERKS = [
  { id: 'c_gold', name: '生财', desc: '在麾下时每回合金币 +3', eco: { gold: 3 } },
  { id: 'c_food', name: '屯粮', desc: '在麾下时每回合补给 +3', eco: { supply: 3 } },
  { id: 'c_exp', name: '好学', desc: '获得经验 +50%', eco: { exp: 0.5 } },
  { id: 'c_star', name: '名气', desc: '招募遇到少女的概率 +0.3%', eco: { girl: 0.003 } },
];
export function perkChoices(role, tier) {
  if (tier === 3) return COMMON_PERKS;
  return PERKS[role]?.[tier] || PERKS.vanguard[tier];
}
const ALL_PERKS = new Map([...Object.values(PERKS).flat(2), ...COMMON_PERKS].map(perk => [perk.id, perk]));
export const perkById = id => ALL_PERKS.get(id);
/** Merges the battle effects of a character's perks into one flat object. */
export function perkFx(ids = [], baseStats = null) {
  const fx = {}, sources = [...ids.map(perkById), ...(baseStats ? traitsOf(baseStats) : [])];
  for (const source of sources) for (const [key, value] of Object.entries(source?.fx || {})) fx[key] = (fx[key] || 0) + value;
  return fx;
}
export const perkEco = (ids, key, baseStats = null) => [...ids.map(perkById), ...(baseStats ? traitsOf(baseStats) : [])].reduce((sum, source) => sum + (source?.eco?.[key] || 0), 0);

/** Badges read from a character's record. They carry no rules, they are the story of that save. */
export const TITLES = [
  { name: '初阵', test: g => g.battles >= 1 }, { name: '老兵', test: g => g.battles >= 15 }, { name: '百战', test: g => g.battles >= 50 },
  { name: '击倒王', test: g => g.kills >= 20 }, { name: '战场噩梦', test: g => g.kills >= 60 },
  { name: '历劫归来', test: g => g.captured >= 3 }, { name: '越狱专家', test: g => (g.extra?.escapeCount || 0) >= 2 },
  { name: '平安归来', test: g => g.rescued >= 2 },
  { name: '特训狂人', test: g => g.trainCount >= 10 }, { name: '被宠坏了', test: g => g.gifts >= 10 },
  { name: '领主的朋友', test: g => g.bond >= 50 }, { name: '常胜', test: g => g.wins >= 10 },
];
export const titlesOf = growth => TITLES.filter(title => title.test(growth)).map(title => title.name);

export const newGrowth = turn => ({ level: 1, exp: 0, bond: 0, spirit: 70, trained: {}, gains: {}, perks: [], joined: turn, battles: 0, wins: 0, kills: 0, captured: 0, rescued: 0, trainCount: 0, gifts: 0, knownLike: false, extra: {} });
export const trainCap = (level, bond) => 1 + Math.floor(level / 5) + (bondTier(bond) >= 1 ? 1 : 0);
export const trainCost = growth => ({ ap: 1, gold: Math.min(40, 6 + Object.values(growth.trained).reduce((a, b) => a + b, 0) * 3), supply: 0 });
/** Fire Emblem style: each stat rolls its own chance, and strong suits grow faster. */
export const growthRate = (stat, base, bond) => stat === 'scout' ? 8 : Math.min(85, 15 + base * 11 + (bondTier(bond) >= 4 ? 10 : 0));
/** Maps a current stat into a battle morale step. */
export const moraleOf = spirit => spirit >= 80 ? 1 : spirit <= 30 ? -1 : 0;
export const pendingPerkTiers = growth => PERK_LEVELS.map((level, tier) => ({ level, tier })).filter(row => growth.level >= row.level && !growth.perks[row.tier]).map(row => row.tier);

/** Read-only guidance from the same progression functions used by execution. */
export function trainingLimitNote(v,stat){
  if((v.stats[stat.id]||0)>=(stat.cap??99))return '这项能力到顶了';
  const g=v.growth,trained=g.trained[stat.id]||0;
  if(trained<trainCap(g.level,g.bond))return '';
  let next=null;
  for(let level=g.level+1;level<=MAX_LEVEL;level++){
    if(trainCap(level,g.bond)>trained){next=level;break;}
  }
  const bond=g.bond<20&&trainCap(g.level,20)>trained;
  if(next!==null){
    let xp=-g.exp;
    for(let level=g.level;level<next;level++)xp+=expToNext(level);
    return `到 ${next} 级可再练，还需 ${Math.max(0,xp)} 经验${bond?'；信赖到 20 也可再练':''}。实战或尚未满额的特训获得经验；演习不提供经验。`;
  }
  if(!bond&&g.bond<20){
    for(let level=g.level+1;level<=MAX_LEVEL;level++){
      if(trainCap(level,20)<=trained)continue;
      let xp=-g.exp;
      for(let current=g.level;current<level;current++)xp+=expToNext(current);
      return `到 ${level} 级且信赖到 20 可再练，还需 ${Math.max(0,xp)} 经验。实战或尚未满额的特训获得经验；演习不提供经验。`;
    }
  }
  return bond?'等级已到上限；信赖到 20 可再练':'这项特训已到最终上限';
}

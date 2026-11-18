// The tech tree and the wonders: pure data plus the words that describe each effect.
// Every effect key here is read by a rule somewhere (campaign.mjs techEffect); nothing is decorative.
// Ids from the first test build are kept (agriculture, accounting, administration, metallurgy, industry,
// navigation, shipbuilding, combustion, aeronautics, banking, monetary, trade, logistics, civilService, telecom)
// so saves and unlock checks stay valid.

export const TECH_BRANCHES = Object.freeze([
  { id: 'agri', name: '农业', color: '#8fd16a', icon: 'wheat' },
  { id: 'econ', name: '商贸', color: '#ffc83d', icon: 'coin' },
  { id: 'civic', name: '行政', color: '#7cc7ff', icon: 'scroll' },
  { id: 'industry', name: '工业', color: '#d9a066', icon: 'castle' },
  { id: 'military', name: '军事', color: '#ff7a64', icon: 'sword' },
  { id: 'seaair', name: '海空', color: '#9db7ff', icon: 'compass' },
]);

// Price and time by tier; a tech's own number nudges around these.
export const TIER_PRICE = [0, 25, 55, 110, 190, 320, 520, 800];
export const TIER_TURNS = [0, 2, 3, 3, 4, 5, 6, 7];

// [id, name, branch, tier, prerequisites, effects, unlocks, line]
// Every prerequisite sits exactly one tier earlier, so the tree draws as straight rows with short elbows between
// neighbouring columns (内政 → 科技), the way a Civ-style tree reads: no line ever crosses a card.
const RAW = [
  // 农业
  ['agriculture', '农学', 'agri', 1, [], { supplyYield: .1 }, [], '把田种明白：每块地都多收一点。'],
  ['irrigation', '灌溉', 'agri', 2, ['agriculture'], { supplyYield: .1, housing: 1 }, ['wonder:hangingGardens'], '水渠通到哪，人就住到哪。'],
  ['cropRotation', '轮作', 'agri', 3, ['irrigation'], { growth: .25, supplyCap: 3 }, [], '地力不再耗尽，人口长得更快。'],
  ['granary', '粮仓', 'agri', 4, ['cropRotation'], { supplyYield: .1, supplyCap: 3 }, [], '丰年存下来，荒年不慌。'],
  ['fertilizer', '化肥', 'agri', 5, ['granary', 'steam'], { supplyYield: .15, housing: 1 }, [], '工厂的副产品撒进田里。'],
  ['mechanizedFarming', '农机', 'agri', 6, ['fertilizer', 'combustion'], { supplyYield: .15, growth: .25 }, [], '一个人种过去十个人的地。'],
  // 商贸
  ['accounting', '记账', 'econ', 1, [], { goldYield: .1, buildCost: .95 }, [], '账算清楚，钱就多出来了。'],
  ['markets', '集市', 'econ', 2, ['accounting'], { tradeGold: 1, sellRate: .1 }, ['wonder:grandBazaar'], '通商的国家每回合多付一枚；卖粮更值钱。'],
  ['banking', '银行业', 'econ', 3, ['markets'], { interestCost: .8 }, ['building:bank', 'policy:bond'], '能发国债，利息更低。'],
  ['trade', '远洋贸易', 'econ', 4, ['banking', 'shipbuilding'], { tradeGold: 2, settlement: 20 }, [], '别国开始用你的钱结账。'],
  ['monetary', '货币政策', 'econ', 5, ['trade', 'civilService'], { inflationRate: .8 }, ['building:centralBank', 'policy:tighten', 'policy:rate'], '中央银行，利率由你定。'],
  ['stockMarket', '证券交易所', 'econ', 6, ['monetary', 'parliament'], { goldYield: .1, bondLimit: .5 }, [], '国债额度 +50%，资本流动起来。'],
  ['globalFinance', '金融霸权', 'econ', 7, ['stockMarket'], { settlement: 25, seigniorage: 1 }, [], '本币结算越多，铸币税翻倍。'],
  // 行政
  ['codeOfLaws', '律令', 'civic', 1, [], { capitalDecay: .9 }, [], '远方也守同一部法：首都控制力衰减 −10%。'],
  ['administration', '行政学', 'civic', 2, ['codeOfLaws', 'accounting'], { cityDecay: .9 }, ['action:city', 'wonder:greatLibrary'], '可以建城，城市控制衰减 −10%。'],
  ['postal', '驿站', 'civic', 3, ['administration'], { digestion: -3, march: 1 }, [], '新领土消化快 3 回合，行军路程 +1。'],
  ['civilService', '文官制度', 'civic', 4, ['postal', 'banking'], { capitalDecay: .85, cityLiberty: -1 }, ['building:administrativeHall', 'wonder:starStage'], '行政厅：每座 0.25 指令。'],
  ['parliament', '议会', 'civic', 5, ['civilService'], { ap: 1, vassalLiberty: -1 }, [], '每回合指令 +1，附庸更安分。'],
  ['federalism', '联邦制', 'civic', 6, ['parliament'], { cityDecay: .8, controlFloor: .05, integration: .75 }, [], '城市自治，整合附庸更快。'],
  ['telecom', '电信', 'civic', 7, ['federalism', 'assemblyLine'], { ap: 1 }, ['wonder:wonder', 'model:longRangePlane'], '命令瞬间传遍全国：指令 +1。'],
  // 工业
  ['metallurgy', '冶金', 'industry', 1, [], { buildCost: .95 }, ['building:workshop'], '工坊：金币 +5。'],
  ['engineering', '工程学', 'industry', 2, ['metallurgy'], { roadCost: .7 }, ['wonder:ironCitadel'], '修路费 −30%。'],
  ['industry', '工业化', 'industry', 3, ['engineering', 'markets'], { buildCost: .9 }, ['building:factory'], '工厂：金币 +12、补给 +2。'],
  ['steam', '蒸汽机', 'industry', 4, ['industry'], { roadCost: .8, march: 1 }, [], '铁路一样的路：修路更便宜，行军路程 +1。'],
  ['combustion', '内燃机', 'industry', 5, ['steam'], { vehicleCost: .9 }, ['model:transportShip'], '运输船；船和飞机造价 −10%。'],
  ['assemblyLine', '流水线', 'industry', 6, ['combustion'], { buildCost: .85, upkeepCost: .85 }, [], '建造费、维护费都降下来。'],
  ['electrification', '电气化', 'industry', 7, ['assemblyLine', 'federalism'], { goldYield: .1, supplyYield: .1 }, [], '夜里也在生产。'],
  // 军事
  ['drill', '操练', 'military', 1, [], { recruitCost: .85 }, [], '征募费 −15%。'],
  ['fortification', '筑城术', 'military', 2, ['drill'], { fortDefense: 1 }, ['wonder:ironCitadel'], '要塞防御 +1。'],
  ['logistics', '后勤', 'military', 3, ['fortification', 'administration'], { supplyCap: 4 }, ['model:liner'], '每块地补给上限 +4；远洋轮船。'],
  ['gunpowder', '火器', 'military', 4, ['logistics', 'industry'], { attack: 1 }, [], '战斗攻击 +1。'],
  ['generalStaff', '参谋部', 'military', 5, ['gunpowder'], { defense: 1, autoBattle: .1 }, [], '战斗防御 +1；自由部队自动结算战力 +10%。'],
  ['mechanization', '机械化', 'military', 6, ['generalStaff', 'combustion'], { attack: 1, march: 1 }, [], '战斗攻击 +1，行军路程 +1。'],
  ['combinedArms', '联合作战', 'military', 7, ['mechanization', 'aeronautics'], { attack: 1, defense: 1 }, [], '陆海空协同：攻防各 +1。'],
  // 海空
  ['navigation', '航海', 'seaair', 2, ['metallurgy'], { tradeGold: 1 }, ['wonder:greatLighthouse'], '海上商路：通商国每回合 +1 金。'],
  ['shipbuilding', '造船', 'seaair', 3, ['navigation', 'engineering'], {}, ['building:shipyard', 'model:cutter'], '船厂（要先有工厂）和快艇。'],
  ['oceanLiner', '远洋航运', 'seaair', 4, ['shipbuilding', 'logistics'], { seaSpeed: 1 }, [], '船速 +1。'],
  ['harborWorks', '港务', 'seaair', 5, ['oceanLiner', 'trade'], { tradeGold: 1, goldYield: .05 }, [], '港口吞吐翻番：通商国 +1 金，金产 +5%。'],
  ['aeronautics', '航空', 'seaair', 6, ['harborWorks', 'combustion'], {}, ['building:airfield', 'model:lightPlane'], '机场（要先有工厂）和轻型机。'],
  ['fighters', '战斗机', 'seaair', 7, ['aeronautics', 'mechanization'], { airSpeed: 1 }, ['model:fighter'], '战斗机；飞机航速 +1。'],
];

const NUDGE = { agriculture: .9, accounting: 1, codeOfLaws: 1, metallurgy: 1.1, drill: .9, navigation: .9, markets: 1, irrigation: 1, administration: 1.1, engineering: 1, fortification: .9, banking: 1.05, cropRotation: .95, postal: .9, industry: 1.1, logistics: 1, shipbuilding: 1.15, telecom: 1.15, globalFinance: 1.1, combinedArms: 1.05, electrification: 1.05, harborWorks: 1 };

export const TECH_TREE = Object.freeze(RAW.map(([id, name, branch, tier, prerequisites, effects, unlocks, line]) => Object.freeze({
  id, name, branch, tier, prerequisites, effects: Object.freeze(effects), unlocks, line,
  gold: Math.round(TIER_PRICE[tier] * (NUDGE[id] || 1)), turns: TIER_TURNS[tier],
})));

// Wonders: one of each per nation. Built like any building (the 建设 ring), unlocked by a technology.
export const WONDERS = Object.freeze({
  hangingGardens: { name: '空中花园', tech: 'irrigation', gold: 520, supply: 60, upkeep: 7, effects: { supplyYield: .15, housing: 1 }, line: '全国粮产 +15%，每块地住房 +1。' },
  greatLibrary: { name: '大书库', tech: 'administration', gold: 600, supply: 40, upkeep: 8, effects: { researchCost: .8, researchTurns: -1 }, line: '研究费 −20%，每项研究少 1 回合（至少 1 回合）。' },
  grandBazaar: { name: '大巴扎', tech: 'markets', gold: 640, supply: 30, upkeep: 8, effects: { tradeGold: 2, goldYield: .05, sellRate: .1 }, line: '通商国每回合 +2 金，金产 +5%，卖粮更值钱。' },
  greatLighthouse: { name: '大灯塔', tech: 'navigation', gold: 560, supply: 40, upkeep: 7, coastal: true, effects: { seaSpeed: 1, tradeGold: 1 }, line: '船速 +1，通商国每回合 +1 金。须建在海边。' },
  ironCitadel: { name: '铁壁城', tech: 'fortification', also: 'engineering', gold: 760, supply: 80, upkeep: 10, effects: { fortDefense: 2, defense: 1 }, line: '要塞防御 +2，所有战斗防御 +1。' },
  starStage: { name: '星光大舞台', tech: 'civilService', gold: 1100, supply: 60, upkeep: 14, effects: { cityLiberty: -2, favorDrift: 1 }, line: '城市独立倾向每回合 −2；见过的国家好感每回合 +1（到 +30 为止）。' },
  wonder: { name: '万国议政院', tech: 'telecom', gold: 2400, supply: 150, upkeep: 35, effects: { ap: 1 }, line: '指令 +1；6 格内控制力 +10%，城市更安分。' },
});

/** How an effect reads on a node or a card. */
const pct = n => `${Math.round(Math.abs(n) * 100)}%`;
const minus = n => `−${pct(1 - n)}`;
const EFFECT_TEXT = {
  supplyYield: n => `粮产 +${pct(n)}`,
  goldYield: n => `金产 +${pct(n)}`,
  buildCost: n => `建造费 ${minus(n)}`,
  roadCost: n => `修路费 ${minus(n)}`,
  recruitCost: n => `征募费 ${minus(n)}`,
  vehicleCost: n => `船和飞机造价 ${minus(n)}`,
  upkeepCost: n => `建筑维护 ${minus(n)}`,
  researchCost: n => `研究费 ${minus(n)}`,
  researchTurns: n => `研究少 ${-n} 回合`,
  interestCost: n => `国债利息 ${minus(n)}`,
  inflationRate: n => `通胀 ${minus(n)}`,
  capitalDecay: n => `首都控制衰减 ${minus(n)}`,
  cityDecay: n => `城市控制衰减 ${minus(n)}`,
  controlFloor: n => `最低控制力 +${pct(n)}`,
  digestion: n => `新领土消化 ${n} 回合`,
  integration: n => `整合附庸时间 ${minus(n)}`,
  cityLiberty: n => `城市独立倾向 ${n}/回合`,
  vassalLiberty: n => `附庸独立倾向 ${n}/回合`,
  ap: n => `每回合指令 +${n}`,
  housing: n => `每块地住房 +${n}`,
  growth: n => `人口增长 +${pct(n)}`,
  supplyCap: n => `补给上限 +${n}`,
  march: n => `行军路程 +${n}`,
  tradeGold: n => `每个通商国 +${n} 金`,
  settlement: n => `本币结算 +${n}`,
  seigniorage: () => '铸币税翻倍',
  bondLimit: n => `国债额度 +${pct(n)}`,
  sellRate: n => `卖粮价 +${pct(n)}`,
  attack: n => `战斗攻击 +${n}`,
  defense: n => `战斗防御 +${n}`,
  fortDefense: n => `要塞防御 +${n}`,
  autoBattle: n => `自动结算战力 +${pct(n)}`,
  seaSpeed: n => `船速 +${n}`,
  airSpeed: n => `航速 +${n}`,
  favorDrift: n => `各国好感 +${n}/回合`,
};
export function effectLines(effects = {}) {
  return Object.entries(effects).map(([key, value]) => EFFECT_TEXT[key]?.(value)).filter(Boolean);
}
const UNLOCK_TEXT = {
  'building:bank': '银行', 'building:centralBank': '中央银行', 'building:administrativeHall': '行政厅', 'building:workshop': '工坊', 'building:factory': '工厂',
  'building:shipyard': '船厂', 'building:airfield': '机场', 'policy:bond': '国债', 'policy:tighten': '回笼货币', 'policy:rate': '调利率', 'action:city': '建城',
  'model:cutter': '快艇', 'model:transportShip': '运输船', 'model:liner': '远洋轮船', 'model:lightPlane': '轻型机', 'model:fighter': '战斗机', 'model:longRangePlane': '远航机',
};
export function unlockLines(unlocks = []) {
  return unlocks.map(id => id.startsWith('wonder:') ? `奇观 · ${WONDERS[id.slice(7)]?.name || ''}` : UNLOCK_TEXT[id]).filter(Boolean);
}

const TECH_INDEX = new Map(TECH_TREE.map(tech => [tech.id, tech]));
export const techNode = id => TECH_INDEX.get(id) || null;
/** Effects that multiply (prices, decay); everything else adds up. */
export const MULTIPLY_EFFECTS = new Set(['roadCost', 'buildCost', 'recruitCost', 'vehicleCost', 'upkeepCost', 'researchCost', 'interestCost', 'inflationRate', 'capitalDecay', 'cityDecay', 'integration']);
const WONDER_KEYS = new Set(Object.values(WONDERS).flatMap(w => Object.keys(w.effects)));
/** The wonders a nation holds and keeps supplied (cut-off land does not count).
 * Indexed once per state and event: every rule that builds, takes or cuts land writes a log line, which moves eventSeq. */
const wonderIndex = new WeakMap();
export function ownedWonders(state, id) {
  if (!state?.tiles) return [];
  const sig = `${state.revision}|${state.turn}|${state.eventSeq}`;
  let entry = wonderIndex.get(state);
  if (!entry || entry.sig !== sig) {
    const map = new Map();
    for (const key in state.tiles) {
      const tile = state.tiles[key];
      if (!tile?.ownerId || !WONDERS[tile.building] || tile.cutSince !== undefined) continue;
      if (!map.has(tile.ownerId)) map.set(tile.ownerId, []);
      map.get(tile.ownerId).push(tile.building);
    }
    entry = { sig, map }; wonderIndex.set(state, entry);
  }
  return entry.map.get(id) || [];
}
/** What a nation's technologies (and, unless told otherwise, its wonders) add up to for one effect. */
export function techEffect(state, key, id = state?.playerId, base = MULTIPLY_EFFECTS.has(key) ? 1 : 0, { wonders = true } = {}) {
  const multiply = MULTIPLY_EFFECTS.has(key);
  let value = base;
  const add = effect => { if (typeof effect === 'number') value = multiply ? value * effect : value + effect; };
  for (const techId of state?.campaign?.research?.[id]?.known || []) add(TECH_INDEX.get(techId)?.effects?.[key]);
  if (wonders && WONDER_KEYS.has(key)) for (const wonderId of ownedWonders(state, id)) add(WONDERS[wonderId].effects[key]);
  return value;
}

// Single-player campaign rules. Pure quotes are shared by the map, treasury and engine.
import { C, say } from './campaign-copy.mjs?v=1118-1603';
import { CHARACTER_MOBILITY } from './character-mobility.mjs?v=1118-1603';
import { migrateTransport, transportBudget } from './transport.mjs?v=1118-1603';
import { TECH_TREE, TECH_BRANCHES, WONDERS, techEffect, techNode, ownedWonders, effectLines, unlockLines } from './techtree.mjs?v=1118-1603';
import { DUTIES, dutyControl } from './duties.mjs?v=1118-1603';
import { EARTH, earthCanalName } from './earth.mjs?v=1118-1603';
import { walkable } from './waters.mjs?v=1118-1603';
export { TECH_TREE, TECH_BRANCHES, WONDERS, techEffect, techNode, ownedWonders, effectLines, unlockLines };

export const CAMPAIGN_VERSION = 2;
export const CANAL_RULES = Object.freeze({ turns: 3, gold: 120, supply: 12, ap: 2, tollGold: 4 });
export const CIVIC_RULES = Object.freeze({
  baseAP: 8, maxAP: 16, cityGold: 120, citySupply: 15, cityUpkeep: 3, citySpacing: 3,
  capitalDecay: .08, cityControl: .9, cityDecay: .07, vassalControl: .8, minimumControl: .15,
  digestion: 10, cityExpansionEvery: 6, annexTurns: 24, annexFavor: 70, annexLiberty: 35,
  tribute: .8, landSpeed: 3, seaSpeed: 5, airSpeed: 7,
});
const STEPS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
export const distance = (a, b) => Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.q + a.r - b.q - b.r));
export const adjacentKeys = tile => STEPS.map(([q, r]) => `${tile.q + q},${tile.r + r}`);
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const byOwner = (state, id) => Object.values(state.tiles).filter(t => t.ownerId === id && !t.shipId && walkable(state, t));
export const relationKey = (a, b) => [a, b].sort().join('|');
export const subjectOf = (state, id) => id !== state.playerId && state.relations?.[relationKey(state.playerId, id)]?.status === 'vassal';
export const membersOf = (state, id) => Object.keys(state.characters).filter(who => state.characterOwners[who] === id && !state.captives[who] && !state.campaign?.prison?.[who] && !(Array.isArray(state.wall) && state.wall.some(e => e?.id === who)));
export const techOf = (state, id = state.playerId) => state.campaign?.research?.[id] || { known: [], active: null };
export const hasTech = (state, tech, id = state.playerId) => techOf(state, id).known.includes(tech);
export const citiesOf = (state, id = state.playerId) => Object.values(state.campaign?.cities || {}).filter(city => city.ownerId === id && state.tiles[city.key]?.ownerId === id);
export const mayorCity = (state, who) => Object.values(state.campaign?.cities || {}).find(city => city.mayorId === who) || null;
export const mobilityOf = (state, who) => {
  const def = CHARACTER_MOBILITY[who] || {};
  return { air: Boolean(def.canFly || def.equipmentFly), sea: Boolean(def.canOcean), source: def };
};
export const TECHNOLOGIES = TECH_TREE.map(tech => Object.freeze({ ...tech, description: tech.line }));
export const techById = id => techNode(id);
export const ADVANCED_BUILDINGS = {
  workshop: { tech: 'metallurgy', gold: 65, supply: 8, upkeep: 2, yield: { gold: 5, supply: 0 } },
  factory: { tech: 'industry', requires: 'workshop', gold: 180, supply: 18, upkeep: 5, yield: { gold: 12, supply: 2 } },
  shipyard: { tech: 'shipbuilding', requires: 'factory', gold: 240, supply: 20, upkeep: 5, yield: { gold: 5, supply: 0 }, coastal: true },
  airfield: { tech: 'aeronautics', requires: 'factory', gold: 420, supply: 35, upkeep: 8, yield: { gold: 3, supply: 0 } },
  bank: { tech: 'banking', requires: 'mine', gold: 140, supply: 8, upkeep: 3, yield: { gold: 9, supply: 0 } },
  centralBank: { tech: 'monetary', requires: 'bank', gold: 600, supply: 30, upkeep: 12, yield: { gold: 5, supply: 0 }, unique: true },
  administrativeHall: { tech: 'civilService', gold: 420, supply: 25, upkeep: 10, yield: { gold: 0, supply: 0 } },
};
for (const [id, w] of Object.entries(WONDERS)) ADVANCED_BUILDINGS[id] = { tech: w.tech, also: w.also, gold: w.gold, supply: w.supply, upkeep: w.upkeep, yield: { gold: 0, supply: 0 }, unique: true, wonder: true, coastal: Boolean(w.coastal), effects: w.effects };
export function migrateCampaign(state) {
  if (!state.campaign) {
    state.campaign = { version: CAMPAIGN_VERSION, cities: {}, canals: {}, research: {}, economies: {}, prison: {}, armies: {}, occupations: [], integrations: {} };
    if (state.rulesVersion < 11) {
      const used = Math.max(0, (state.maxAP || 3) - (state.ap || 0));
      state.maxAP = CIVIC_RULES.baseAP; state.ap = Math.max(0, state.maxAP - used * 2);
    }
  }
  if (state.campaign.version === 1) state.campaign.version = CAMPAIGN_VERSION;
  state.campaign.canals ||= {};
  migrateTransport(state);
  for (const faction of Object.values(state.factions || {})) {
    state.campaign.research[faction.id] ||= { known: [], active: null };
    state.campaign.economies[faction.id] ||= { money: 40, prices: 100, inflation: 0, credit: 80, debt: 0, liquidity: 60, exchange: 100, settlement: 0, lastPolicy: 0 };
  }
  for (const [id, record] of Object.entries(state.campaign.prison || {})) {
    if (!state.characters[id]) continue;
    state.characterOwners[id] = null; delete state.captives[id];
    state.recruitedHeroIds = state.recruitedHeroIds.filter(who => who !== id);
    for (const tile of Object.values(state.tiles)) {
      tile.field = (tile.field || []).filter(who => who !== id);
      tile.garrison = (tile.garrison || []).filter(who => who !== id);
    }
  }
  return state;
}
/** How many turns new land takes to settle in; 驿站 shortens it. */
export const digestionTurns = (state, id) => Math.max(3, CIVIC_RULES.digestion + techEffect(state, 'digestion', id));
export function controlAt(state, tile) {
  if (!tile?.ownerId) return { value: 0, percent: 0, source: null, digestion: 0 };
  if (tile.shipId) return { value: 1, percent: 100, source: tile.key, digestion: 0 };
  const id = tile.ownerId, faction = state.factions[id], capital = state.tiles[faction?.capitalKey];
  const subject = subjectOf(state, id);
  const capitalDecay = CIVIC_RULES.capitalDecay * techEffect(state, 'capitalDecay', id), cityDecay = CIVIC_RULES.cityDecay * techEffect(state, 'cityDecay', id), floor = CIVIC_RULES.minimumControl + techEffect(state, 'controlFloor', id);
  let value = capital ? (subject ? CIVIC_RULES.vassalControl : 1) - distance(tile, capital) * capitalDecay : floor;
  let source = capital?.key || null;
  for (const city of citiesOf(state, id)) {
    const staffed = city.mayorId && state.characterOwners[city.mayorId] === id && !state.captives[city.mayorId];
    const power = (staffed ? CIVIC_RULES.cityControl : .55) - distance(tile, state.tiles[city.key]) * cityDecay;
    if (power > value) { value = power; source = city.key; }
  }
  const wonder=state.tiles[faction?.wonderKey];
  if(wonder?.ownerId===id&&wonder.building==='wonder'&&wonder.cutSince===undefined&&distance(tile,wonder)<=6)value+=.1;
  value += dutyControl(state, tile); // 差事·治理
  const digestion = tile.acquiredTurn === undefined ? 0 : Math.max(0, digestionTurns(state, id) - (state.turn - tile.acquiredTurn));
  const penalty = digestion * .025 + (faction?.capitalRecoveryUntil > state.turn ? .05 : 0);
  value = tile.cutSince !== undefined ? 0 : clamp(value - penalty, floor, subject ? CIVIC_RULES.vassalControl : 1);
  return { value, percent: Math.round(value * 100), source, digestion };
}
export function constructionFactor(state, tile, id = tile?.ownerId || state.playerId) {
  const money = state.campaign?.economies?.[id], control = controlAt(state, tile).value;
  return (1 + (1 - control) * 1.5) * Math.max(1, (money?.prices || 100) / 100) * techEffect(state, 'buildCost', id);
}
/** How many separate non-adjacent ocean arcs border a passable land hex (2+ means a canal can join them). */
export function canalSides(state, tile, requireDiscovered = false) {
  if (!tile || tile.shipId || tile.terrainId === 'ocean' || tile.terrainId === 'lake' || !state.terrainTypes?.[tile.terrainId]?.passable) return 0;
  const ring = STEPS.map(([dq, dr]) => {
    const n = state.tiles?.[`${tile.q + dq},${tile.r + dr}`];
    if (n) return (!requireDiscovered || n.discovered) && n.terrainId === 'ocean';
    if (requireDiscovered || !state.world?.origin) return false;
    const row = state.world.origin.row + tile.r + dr, col = state.world.origin.col - Math.floor(state.world.origin.row / 2) + (tile.q + dq) + Math.floor(row / 2);
    return EARTH.codes[EARTH.grid[row]?.[col]] === 'ocean';
  });
  if (ring.every(Boolean)) return 0;
  return ring.reduce((sum, v, i) => sum + (v && !ring[(i + 5) % 6] ? 1 : 0), 0);
}
export function defaultCanalName(state, tile) {
  if (!tile) return C.canal;
  if (state.world?.origin) {
    const row = state.world.origin.row + tile.r, col = state.world.origin.col - Math.floor(state.world.origin.row / 2) + tile.q + Math.floor(row / 2);
    const named = earthCanalName(col, row);
    if (named) return named;
  }
  if (state.campaign?.cities?.[tile.key]?.name) return `${state.campaign.cities[tile.key].name}${C.canal}`;
  return `${C.canal} ${tile.key}`;
}
export const canalsOf = (state, id = state.playerId) => Object.values(state.campaign?.canals || {}).filter(c => state.tiles?.[c.key]?.ownerId === id);
export function canalQuote(state, key, id = state.playerId) {
  const tile = state.tiles?.[key], faction = state.factions?.[id], existing = state.campaign?.canals?.[key];
  const arcs = canalSides(state, tile, id === state.playerId);
  const cost = { ap: id === state.playerId ? CANAL_RULES.ap : 0, gold: tile ? Math.ceil(CANAL_RULES.gold * constructionFactor(state, tile, id)) : CANAL_RULES.gold, supply: CANAL_RULES.supply };
  const name = existing?.name || defaultCanalName(state, tile);
  const reason = state.battle || (id === state.playerId && state.turnContinuation) ? C.invalidAction
    : !tile || tile.ownerId !== id || tile.shipId || !state.terrainTypes?.[tile.terrainId]?.passable || arcs < 2 ? C.canalInvalid
    : existing ? C.canalBusy
    : !hasTech(state, 'shipbuilding', id) ? C.researchBlocked
    : tile.cutSince !== undefined ? C.invalidAction
    : (id === state.playerId && state.ap < cost.ap) || !faction || faction.gold < cost.gold || faction.supply < cost.supply ? say('canalCost', cost) : '';
  return { key, name, arcs, turns: CANAL_RULES.turns, existing: existing || null, enabled: !reason, reason, cost, action: { type: 'buildCanal', key } };
}
export function productionFactor(state, tile, kind) {
  if (tile.shipId) return 0;
  const control = controlAt(state, tile).value, id = tile.ownerId;
  const technology = 1 + techEffect(state, kind === 'supply' ? 'supplyYield' : 'goldYield', id);
  const prices = state.campaign?.economies?.[id]?.prices || 100;
  // Real purchasing power falls with sustained inflation; production cannot turn negative.
  const liquidity = state.campaign?.economies?.[id]?.liquidity || 60;
  const rate = kind === 'gold' ? 1 - .05 * (state.campaign?.economies?.[id]?.rate || 0) : 1;
  return control * technology * rate * (.85 + liquidity / 100 * .15) / (kind==='supply'?1:Math.pow(Math.max(1,prices/100),.35));
}
export function campaignBudget(state, id = state.playerId) {
  const tiles = byOwner(state, id), cities = citiesOf(state, id), money = state.campaign?.economies?.[id];
  const advanced = Math.round(tiles.reduce((sum, t) => sum + (ADVANCED_BUILDINGS[t.building]?.upkeep || 0), 0) * techEffect(state, 'upkeepCost', id));
  const settle = digestionTurns(state, id), digestion = tiles.reduce((sum,t)=>sum+(t.acquiredTurn!==undefined&&state.turn-t.acquiredTurn<settle?1:0),0);
  const interest = money?.debt ? Math.ceil(money.debt * (.015 + (100 - money.credit) * .0008) * techEffect(state, 'interestCost', id)) : 0;
  const vehicles = transportBudget(state, id);
  const digestionCost=Math.ceil(digestion*.35),capitalRecovery=state.factions[id]?.capitalRecoveryUntil>state.turn?4:0;
  const upkeep = advanced + cities.length * CIVIC_RULES.cityUpkeep + digestionCost + interest + vehicles.gold + capitalRecovery;
  const starter = Math.max(0, 6 - Math.floor(Math.max(0, state.turn - 8) / 5) - Math.floor(Math.max(0, tiles.length - 4) / 2));
  const hallFraction = tiles.filter(t => t.building === 'administrativeHall' && t.cutSince === undefined).length * .25, techAP = Math.round(techEffect(state, 'ap', id, 0, { wonders: false }));
  const wonderAP=tiles.some(t=>t.building==='wonder'&&t.cutSince===undefined)?1:0;
  return { upkeep, advanced, cities: cities.length * CIVIC_RULES.cityUpkeep, digestion, digestionCost, capitalRecovery, interest, vehicles, starter, hallFraction, hallAP: Math.floor(hallFraction), wonderAP, techAP };
}
export function researchQuote(state, techId, id = state.playerId) {
  const tech = TECHNOLOGIES.find(t => t.id === techId), record = techOf(state, id), faction = state.factions[id];
  const cost = { ap: 2, gold: tech ? Math.ceil(tech.gold * Math.max(1, (state.campaign?.economies?.[id]?.prices || 100) / 100) * techEffect(state, 'researchCost', id)) : 0, supply: 0 };
  const turns = tech ? Math.max(1, tech.turns + Math.round(techEffect(state, 'researchTurns', id))) : 0;
  const reason = !tech || record.known.includes(techId) ? C.completed : record.active ? C.researchBusy
    : tech.prerequisites.some(p => !record.known.includes(p)) || faction.gold < cost.gold ? C.researchBlocked
      : id === state.playerId && state.ap < cost.ap ? say('apNeed', { ap: cost.ap, left: state.ap }) : '';
  const missing = tech ? tech.prerequisites.filter(p => !record.known.includes(p)) : [];
  return { ...tech, turns, missing, enabled: !reason, reason, cost, known: record.known.includes(techId), active: record.active?.id === techId, action: { type: 'research', techId } };
}
export function advancedBuildingReason(state, tile, buildingId) {
  const spec = ADVANCED_BUILDINGS[buildingId], id = tile?.ownerId;
  if (!spec) return '';
  if (!hasTech(state, spec.tech, id) || spec.also && !hasTech(state, spec.also, id)) return C.researchBlocked;
  const own = byOwner(state, id);
  if (spec.requires && !own.some(t => t.building === spec.requires || (spec.requires === 'market' && t.building === 'port'))) return C.researchBlocked;
  if (spec.unique && own.some(t => t.building === buildingId)) return C.invalidAction;
  if (spec.coastal && tile.terrainId !== 'coast' && !adjacentKeys(tile).some(key => state.tiles[key]?.terrainId === 'ocean')) return C.vehicleInvalid;
  return '';
}
export function cityQuote(state, key, mayorId) {
  const tile = state.tiles[key], cities = citiesOf(state), who = state.characters[mayorId];
  const cost = { ap: 2, gold: tile ? Math.ceil(CIVIC_RULES.cityGold * constructionFactor(state, tile)) : CIVIC_RULES.cityGold, supply: CIVIC_RULES.citySupply };
  const reason = !tile || tile.ownerId !== state.playerId || tile.isCapital || state.campaign?.cities[key] || !state.terrainTypes[tile.terrainId]?.passable ? C.cityInvalid
    : !hasTech(state, 'administration') ? C.researchBlocked
    : cities.some(city => distance(tile, state.tiles[city.key]) < CIVIC_RULES.citySpacing) ? say('citySpacing', { distance: CIVIC_RULES.citySpacing })
    : !who || !membersOf(state, state.playerId).includes(mayorId) ? C.cityMayorRequired
    : mayorId === state.activeHeroId || mayorId === state.companionId || Object.values(state.posts).includes(mayorId) || Object.values(state.envoys).includes(mayorId) || mayorCity(state, mayorId) ? C.mayorBusy
    : ![...(tile.field || []), ...(tile.garrison || [])].includes(mayorId) ? C.mayorOnSite
    : state.ap < cost.ap ? say('apNeed', { ap: cost.ap, left: state.ap })
    : state.factions[state.playerId].gold < cost.gold || state.factions[state.playerId].supply < cost.supply ? say('cityCost', cost) : '';
  return { enabled: !reason, reason, cost, key, mayorId, action: { type: 'foundCity', key, mayorId } };
}
export function productivePotential(state, id = state.playerId) {
  return Math.max(40, Math.round(byOwner(state,id).reduce((sum,tile)=>sum+(12+(tile.building?(tile.buildingLevel||1)*6:0))*controlAt(state,tile).value,0)+citiesOf(state,id).length*20));
}
export function economyView(state, id = state.playerId) {
  const data = state.campaign?.economies?.[id] || { money: 40, prices: 100, inflation: 0, credit: 80, debt: 0, liquidity: 60, exchange: 100, settlement: 0, lastPolicy: 0 };
  const productive = productivePotential(state,id);
  const limit = Math.max(30, Math.floor(productive * data.credit / 70 * (1 + techEffect(state, 'bondLimit', id))));
  const policies = ['mint', 'bond', 'repay', 'tighten'].map(kind => {
    const amount = kind === 'repay' ? Math.min(50, data.debt) : kind === 'tighten' ? 40 : kind === 'mint' ? Math.max(15, Math.floor(productive * .3)) : Math.min(80, Math.max(0, limit - data.debt));
    const cost = { ap: 1, gold: kind === 'repay' || kind === 'tighten' ? amount : 0, supply: 0 };
    const locked = kind === 'tighten' && !hasTech(state, 'monetary', id) || kind === 'bond' && !hasTech(state, 'banking', id);
    const reason = locked ? `${C.technology} · ${C[(kind==='bond'?'banking':'monetary')+'Name']}` : data.lastPolicy === state.turn ? C.currencyOnce
      : kind === 'bond' && (amount < 10 || data.credit < 25) || kind === 'repay' && amount < 1 ? C.creditLimit
      : state.factions[id].gold < cost.gold ? C.creditLimit
      : id === state.playerId && state.ap < 1 ? say('apNeed', { ap: 1, left: state.ap }) : '';
    return { kind, amount, cost, enabled: !reason, reason, action: { type: 'currencyPolicy', kind } };
  });
  const bank = byOwner(state, id).some(t => t.building === 'centralBank' && t.cutSince === undefined), rateLocked = !hasTech(state, 'monetary', id) || !bank;
  const rateReason = rateLocked ? (hasTech(state, 'monetary', id) ? C.rateNeedsBank : `${C.technology} · ${C.monetaryName}`) : data.lastPolicy === state.turn ? C.currencyOnce : id === state.playerId && state.ap < 1 ? say('apNeed', { ap: 1, left: state.ap }) : '';
  const rate = { value: data.rate || 0, locked: rateLocked, reason: rateReason, cost: { ap: 1, gold: 0, supply: 0 } };
  const partners = Object.entries(state.relations || {}).filter(([key, rel]) => key.split('|').includes(id) && rel.trade).length;
  return { ...data, productive, limit, policies, rate, partners, seigniorage: seigniorageOf(state, id), sell: sellSupplyQuote(state, 10, id) };
}
/** 铸币税: when partners settle trade in your money, a slice of it is yours. 金融霸权 doubles it. */
export function seigniorageOf(state, id = state.playerId) {
  const data = state.campaign?.economies?.[id];
  if (!data || !state.factions[id]?.alive) return 0;
  const partners = Object.entries(state.relations || {}).filter(([key, rel]) => key.split('|').includes(id) && rel.trade).length;
  return Math.floor(data.settlement / 100 * partners * 3 * (1 + techEffect(state, 'seigniorage', id)));
}
/** 卖粮: surplus grain sold abroad. A dear currency sells for less; markets and the bazaar pay more.
 * The more a nation dumps in one turn, the lower the price it gets (market saturation, floor half price). */
export function sellSupplyQuote(state, amount = 10, id = state.playerId) {
  const data = state.campaign?.economies?.[id], faction = state.factions[id];
  const sold = data?.sold?.turn === state.turn ? data.sold.amount : 0;
  const base = .6 * (1 + techEffect(state, 'sellRate', id)) * clamp(100 / (data?.exchange || 100), .7, 1.4);
  const saturation = Math.max(.5, 1 - (sold + amount / 2) / 1200);
  const rate = base * saturation, gold = Math.floor(amount * rate), cost = { ap: 1, gold: 0, supply: amount };
  const reason = !Number.isInteger(amount) || amount < 1 || amount > 100000 ? C.invalidAction : !faction || faction.supply < amount ? say('sellShort', { supply: amount }) : id === state.playerId && state.ap < 1 ? say('apNeed', { ap: 1, left: state.ap }) : '';
  return { amount, gold, rate, base, sold, cost, enabled: !reason, reason, action: { type: 'sellSupply', amount } };
}
/** How much grain a nation can spare: everything above three turns of upkeep and twenty in hand. */
export function spareSupply(state, id = state.playerId) {
  const faction = state.factions[id];
  return Math.max(0, (faction?.supply || 0) - 20);
}
export function armyProfile(state, key, girls = state.tiles[key]?.field || [], troops = 0) {
  const record = state.campaign?.armies?.[key] || {}, travel = 'land';
  const allAir = girls.length > 0 && girls.every(id => mobilityOf(state, id).air), allSea = girls.length > 0 && girls.every(id => mobilityOf(state, id).sea || mobilityOf(state, id).air);
  const native = troops === 0 && (travel === 'air' ? allAir : travel === 'sea' ? allSea : true);
  const seats = travel === 'air' ? (record.planes || 0) : (record.ships || 0) * 24;
  const need = troops + girls.filter(id => travel === 'air' ? !mobilityOf(state, id).air : !mobilityOf(state, id).sea && !mobilityOf(state, id).air).length;
  const capable = travel === 'land' || native || seats >= need;
  const owner = state.tiles[key]?.ownerId, march = owner ? Math.round(techEffect(state, 'march', owner)) : 0;
  return { ...record, mode: record.mode || 'main', travel, native, seats, need, capable, speed: (travel === 'air' ? CIVIC_RULES.airSpeed : travel === 'sea' ? CIVIC_RULES.seaSpeed : CIVIC_RULES.landSpeed) + march };
}
const stepPrice = (state, tile, profile) => profile.travel === 'air' ? 1 : profile.travel === 'sea' && tile.terrainId === 'ocean' ? 1 : tile.road ? .5 : 1 + Math.floor(state.terrainTypes[tile.terrainId].defense / 2);
export function campaignRoute(state, fromKey, toKey, { girls, troops = 0, waypoints = [], roads = false } = {}) {
  const from = state.tiles[fromKey], to = state.tiles[toKey], id = from?.ownerId;
  if (!from || !to || !to.discovered || !id || !Array.isArray(waypoints) || waypoints.length > 16) return null;
  const profile = roads ? { travel: 'land', capable: true } : armyProfile(state, fromKey, girls, troops);
  if (!profile.capable) return null;
  const pass = tile => {
    if (!tile?.discovered) return false;
    if (roads) return tile.ownerId === id && walkable(state, tile);
    if (profile.travel === 'air') return true;
    if (tile.shipId) return false;
    return walkable(state, tile);
  };
  const targetKeys = [...waypoints, toKey], path = [fromKey];
  let total = 0;
  for (const destination of targetKeys) {
    const start = path.at(-1), cost = new Map([[start, 0]]), before = new Map(), done = new Set(), queue = [start];
    if (!pass(state.tiles[destination])) return null;
    while (queue.length && done.size <= 8000) {
      queue.sort((a, b) => cost.get(a) - cost.get(b) || a.localeCompare(b));
      const key = queue.shift();
      if (done.has(key)) continue;
      done.add(key);
      if (key === destination) break;
      for (const nearKey of adjacentKeys(state.tiles[key])) {
        const tile = state.tiles[nearKey];
        if (!pass(tile) || done.has(nearKey)) continue;
        // Foreign land is never silently traversed. Only a declared enemy endpoint may be entered.
        if(!roads&&(!tile.ownerId||tile.ownerId!==id&&state.relations?.[relationKey(id,tile.ownerId)]?.status!=='war'))continue;
        const next = cost.get(key) + stepPrice(state, tile, profile);
        if (next >= (cost.get(nearKey) ?? Infinity)) continue;
        cost.set(nearKey, next); before.set(nearKey, key); queue.push(nearKey);
      }
    }
    if (!done.has(destination)) return null;
    const leg = [destination];
    while (leg[0] !== start) { const previous = before.get(leg[0]); if (!previous) return null; leg.unshift(previous); }
    path.push(...leg.slice(1)); total += cost.get(destination);
  }
  return { path, cost: total, profile, turns: Math.max(1, Math.ceil(total / (profile.speed || 3))) };
}
/** One tile of new road: the same price whether it is built alone or as part of a long road. Rough land and weak control cost more. */
export function roadTileCost(state, tile, id = state.playerId) {
  const terrain = state.terrainTypes[tile?.terrainId];
  const base = (terrain ? 6 + Math.max(0, terrain.defense) * 2 : 6) * constructionFactor(state, tile, id) * roadDiscount(state, id);
  return { ap: 0, gold: Math.ceil(base), supply: 1 };
}
/** Technologies that make roads cheaper (filled in by the tech tree). */
export function roadDiscount(state, id = state.playerId) {
  return techEffect(state, 'roadCost', id, 1);
}
/** The road a builder would lay from one own tile to another: cheapest to build, reusing roads already there. */
export function roadPath(state, fromKey, toKey, id = state.playerId) {
  const from = state.tiles[fromKey], to = state.tiles[toKey];
  const pass = tile => tile?.discovered && tile.ownerId === id && !tile.shipId && tile.cutSince === undefined && walkable(state, tile);
  if (!pass(from) || !pass(to)) return null;
  const price = tile => tile.road ? .05 : roadTileCost(state, tile, id).gold;
  const cost = new Map([[fromKey, from.road ? 0 : price(from)]]), before = new Map(), done = new Set(), queue = [fromKey];
  while (queue.length && done.size <= 8000) {
    queue.sort((a, b) => cost.get(a) - cost.get(b) || a.localeCompare(b));
    const key = queue.shift();
    if (done.has(key)) continue;
    done.add(key);
    if (key === toKey) break;
    for (const nearKey of adjacentKeys(state.tiles[key])) {
      const tile = state.tiles[nearKey];
      if (!pass(tile) || done.has(nearKey)) continue;
      const next = cost.get(key) + price(tile);
      if (next >= (cost.get(nearKey) ?? Infinity)) continue;
      cost.set(nearKey, next); before.set(nearKey, key); queue.push(nearKey);
    }
  }
  if (!done.has(toKey)) return null;
  const path = [toKey];
  while (path[0] !== fromKey) { const previous = before.get(path[0]); if (!previous) return null; path.unshift(previous); }
  return path;
}
/** A long road from one tile to another, priced tile by tile. Roads never cost commands. */
export function roadRouteQuote(state, fromKey, toKey) {
  const id = state.playerId, path = roadPath(state, fromKey, toKey, id) || [];
  const keys = path.filter(key => !state.tiles[key].road);
  const cost = keys.reduce((sum, key) => { const part = roadTileCost(state, state.tiles[key], id); return { ap: 0, gold: sum.gold + part.gold, supply: sum.supply + part.supply }; }, { ap: 0, gold: 0, supply: 0 });
  const faction = state.factions[id];
  const busy = state.battle || state.turnContinuation;
  const reason = busy ? '请先完成当前战场与战争阶段。' : !path.length ? C.roadInvalid : !keys.length ? C.roadAlready
    : faction.gold < cost.gold || faction.supply < cost.supply ? say('roadShort', { gold: Math.max(0, cost.gold - faction.gold), supply: Math.max(0, cost.supply - faction.supply) }) : '';
  return { enabled: !reason, reason, cost, keys, path, existing: path.length - keys.length, action: { type: 'roadRoute', fromKey, toKey } };
}
/** Land an army of this nation may enter today: its own, or a nation it is at war with. */
export const marchableFor = (state, id, tile) => Boolean(tile && (tile.ownerId === id || tile.ownerId && state.relations?.[relationKey(id, tile.ownerId)]?.status === 'war'));
/** A planning route over any known land, whoever owns it: where an army would go if nothing stood in the way.
 * Roads count half, rough land more, like a real march. Waypoints are visited in order. */
export function planPath(state, fromKey, toKey, waypoints = [], id = state.tiles[fromKey]?.ownerId) {
  const pass = tile => Boolean(tile?.discovered && !tile.shipId && walkable(state, tile));
  if (!state.tiles[fromKey] || !pass(state.tiles[toKey]) || !Array.isArray(waypoints) || waypoints.length > 16) return null;
  // Land not yet open to us costs a little extra, so a plan keeps to our own roads as long as it can.
  const price = tile => (tile.road ? .5 : 1 + Math.floor((state.terrainTypes[tile.terrainId]?.defense || 0) / 2)) + (id && !marchableFor(state, id, tile) ? .35 : 0);
  const path = [fromKey]; let total = 0;
  for (const destination of [...waypoints, toKey]) {
    const start = path.at(-1);
    if (destination === start) continue;
    if (!pass(state.tiles[destination])) return null;
    const cost = new Map([[start, 0]]), before = new Map(), done = new Set(), queue = [start];
    while (queue.length && done.size <= 8000) {
      queue.sort((a, b) => cost.get(a) - cost.get(b) || a.localeCompare(b));
      const key = queue.shift();
      if (done.has(key)) continue;
      done.add(key);
      if (key === destination) break;
      for (const nearKey of adjacentKeys(state.tiles[key])) {
        const tile = state.tiles[nearKey];
        if (!pass(tile) || done.has(nearKey)) continue;
        const next = cost.get(key) + price(tile);
        if (next >= (cost.get(nearKey) ?? Infinity)) continue;
        cost.set(nearKey, next); before.set(nearKey, key); queue.push(nearKey);
      }
    }
    if (!done.has(destination)) return null;
    const leg = [destination];
    while (leg[0] !== start) { const previous = before.get(leg[0]); if (!previous) return null; leg.unshift(previous); }
    path.push(...leg.slice(1)); total += cost.get(destination);
  }
  return { path, cost: total };
}
/** Why a planned route stops where it does, in words, or '' when it is clear all the way. */
export function planBlocker(state, id, path) {
  const at = path.findIndex((key, i) => i > 0 && !marchableFor(state, id, state.tiles[key]));
  if (at < 0) return { at: -1, reach: path, text: '' };
  const tile = state.tiles[path[at]], owner = tile.ownerId ? state.factions[tile.ownerId] : null;
  return { at, reach: path.slice(0, at), stopKey: path[at], text: owner ? `前面是${owner.name}的地，宣战后才能过去` : `前面 ${tile.key} 是无主地，开拓后会接着走` };
}
/** A long march order: the full way through own and enemy land when there is one; otherwise the planned way,
 * walked as far as it can be today, waiting at the edge until the land ahead is claimed or war is declared. */
export function routeQuote(state, fromKey, toKey, selection = {}) {
  const route = campaignRoute(state, fromKey, toKey, selection), tile = state.tiles[fromKey], id = tile?.ownerId;
  const action = { type: 'setArmyObjective', fromKey, toKey, girls: selection.girls || tile?.field || [], troops: selection.troops || 0, waypoints: selection.waypoints || [] };
  if (route || tile?.ownerId !== state.playerId) {
    const reason = !route || tile?.ownerId !== state.playerId ? C.objectiveInvalid : fromKey === toKey ? C.objectiveReached : '';
    return { ...route, enabled: !reason, reason, partial: false, blocker: '', reach: route?.path || [], action };
  }
  const plan = fromKey === toKey ? null : planPath(state, fromKey, toKey, selection.waypoints || []);
  if (!plan) return { path: [], cost: 0, turns: 0, enabled: false, reason: C.objectiveInvalid, partial: false, blocker: '', reach: [], action };
  const speed = armyProfile(state, fromKey, selection.girls || tile.field, selection.troops || 0).speed || 3, stop = planBlocker(state, id, plan.path);
  return { path: plan.path, cost: plan.cost, turns: Math.max(1, Math.ceil(plan.cost / speed)), enabled: true, reason: '', partial: true, blocker: stop.text, reach: stop.reach, stopKey: stop.stopKey, action };
}
export function annexConditions(state, id) {
  const relation = state.relations?.[relationKey(state.playerId, id)], faction = state.factions[id], active = state.campaign?.integrations?.[id];
  const peace = nation => !Object.entries(state.relations || {}).some(([key, rel]) => key.split('|').includes(nation) && rel.status === 'war' && key.split('|').every(who => state.factions[who]?.alive));
  const liberty = faction?.liberty || 0, served = state.turn - (relation?.since || state.turn);
  const reason = !faction?.alive || relation?.status !== 'vassal' ? C.annexBlocked : !peace(id) || !peace(state.playerId) ? C.needPeace
    : served < CIVIC_RULES.annexTurns || relation.favor < CIVIC_RULES.annexFavor || liberty >= CIVIC_RULES.annexLiberty ? C.annexBlocked
    : !active && Object.keys(state.campaign?.integrations || {}).length ? C.annexBlocked : '';
  const tiles = byOwner(state, id).length, turns = Math.max(6, Math.round(Math.max(8, tiles * 2) * techEffect(state, 'integration', state.playerId)));
  return { enabled: !reason, reason, served, favor: relation?.favor || 0, liberty, turns, active, cost: { ap: 1, gold: 40 + tiles * 10, supply: 0 }, upkeep: Math.max(3, Math.ceil(tiles * 1.5)) };
}
export function economyTick(state, id) {
  const data = state.campaign.economies[id], tiles = byOwner(state, id), faction = state.factions[id];
  if (!data || !faction.alive) return;
  const productive = productivePotential(state,id), coverage = data.money / productive;
  const rate = data.rate || 0, fiscalStress = data.debt / Math.max(40, productive), inflation = (coverage > 1.35 ? (coverage - 1.35) * 7 : -1.5) + (rate < 0 ? 1.2 : rate > 0 ? -1.5 : 0);
  const centralBank=tiles.some(t=>t.building==='centralBank'&&t.cutSince===undefined);
  const panic = data.credit < 30 ? (30 - data.credit) * (centralBank ? .15 : .25) : 0;
  // A currency others hold soaks up part of its own inflation (霸权输出通胀); 货币政策 steadies it further.
  const exported = data.settlement >= 50 ? .75 : 1, steady = techEffect(state, 'inflationRate', id);
  data.inflation = Math.round(clamp((data.inflation * .65 + inflation + panic) * (inflation + panic > 0 ? steady * exported : 1), -3, 80) * 10) / 10;
  data.prices = Math.round(clamp(data.prices * (1 + data.inflation / 100), 80, 100000));
  data.credit = clamp(Math.round(data.credit + ((coverage<=1.1&&fiscalStress<.5)||data.inflation < 5 && fiscalStress < 1 ? 1 : -Math.min(8, Math.ceil(data.inflation / 12 + fiscalStress))) + (rate > 0 ? 1 : 0)), 5, 100);
  if(centralBank&&data.inflation<10)data.credit=Math.min(100,data.credit+1);
  data.liquidity = clamp(Math.round(70 + Math.min(20, coverage * 10) - Math.max(0, data.inflation) * .8 - fiscalStress * 8), 5, 100);
  if(centralBank)data.liquidity=Math.min(100,data.liquidity+10);
  data.exchange = Math.round(clamp(10000 / data.prices * (.45 + data.credit / 150), 1, 200));
  const tradePartners = Object.entries(state.relations).filter(([key, rel]) => key.split('|').includes(id) && rel.trade).length;
  // Nations bound by treaty to settle in this currency (和约「用你的钱结账」) count while the trade lasts.
  const unions = Object.entries(state.campaign.currencyUnions || {}).filter(([other, hegemon]) => hegemon === id && state.relations?.[relationKey(id, other)]?.trade).length;
  data.settlement = clamp(Math.round(techEffect(state, 'settlement', id) + tradePartners * 4 + unions * 10 + (centralBank ? 15 : 0) + (data.credit - 80) / 2 - data.inflation), 0, 100);
  // Supply follows real output; no minting policy creates goods or people.
}
export function campaignErrors(state) {
  const c = state.campaign, errors = [], object = value => value && typeof value === 'object' && !Array.isArray(value);
  if (!object(c) || c.version !== CAMPAIGN_VERSION) return [C.invalidAction];
  for (const key of ['cities', 'research', 'economies', 'prison', 'armies', 'integrations']) if (!object(c[key])) errors.push(`campaign.${key}`);
  if (errors.length) return errors;
  if (c.duties !== undefined) {
    const jobs = new Set(DUTIES.map(duty => duty.id)), worked = new Set();
    if (!object(c.duties) || Object.keys(c.duties).length > 300) errors.push('campaign.duties');
    else for (const [id, duty] of Object.entries(c.duties)) {
      if (!state.characters?.[id] || !object(duty) || typeof duty.key !== 'string' || !state.tiles?.[duty.key] || !jobs.has(duty.job) || !Number.isInteger(duty.since) || duty.since < 1 || duty.since > state.turn || worked.has(duty.key)) errors.push(`campaign.duties.${id}`);
      worked.add(duty?.key);
    }
  }
  const taken = new Set(), techIds = new Set(TECHNOLOGIES.map(t => t.id));
  for (const [key, city] of Object.entries(c.cities)) {
    if (!object(city) || key !== city.key || !state.tiles[key] || !state.factions[city.ownerId] || typeof city.name !== 'string' || city.name.length > 80 || !Number.isInteger(city.liberty) || city.liberty < 0 || city.liberty > 100 || !Number.isInteger(city.foundedTurn) || city.foundedTurn > state.turn) errors.push('campaign.city');
    if (city.mayorId && (!state.characters[city.mayorId] || taken.has(city.mayorId) || state.captives[city.mayorId] || c.prison[city.mayorId] || state.characterOwners[city.mayorId] !== city.ownerId || Object.values(state.posts).includes(city.mayorId) || Object.values(state.envoys).includes(city.mayorId))) errors.push('campaign.mayor');
    taken.add(city.mayorId);
  }
  for (const [id, record] of Object.entries(c.research)) {
    if (!state.factions[id] || !object(record) || !Array.isArray(record.known) || record.known.length > TECHNOLOGIES.length || new Set(record.known).size !== record.known.length || record.known.some(tech => !techIds.has(tech))) { errors.push('campaign.research'); continue; }
    if (record.queue !== undefined && (!Array.isArray(record.queue) || record.queue.length > TECHNOLOGIES.length || new Set(record.queue).size !== record.queue.length || record.queue.some(tech => !techIds.has(tech) || record.known.includes(tech)))) errors.push('campaign.researchQueue');
    if (record.active && (!techIds.has(record.active.id) || !Number.isInteger(record.active.remaining) || record.active.remaining < 1 || record.active.remaining > 12 || record.known.includes(record.active.id) || TECHNOLOGIES.find(t => t.id === record.active.id).prerequisites.some(p => !record.known.includes(p)))) errors.push('campaign.activeResearch');
  }
  for (const [id, data] of Object.entries(c.economies)) if (!state.factions[id] || !object(data) || ['money', 'prices', 'credit', 'debt', 'liquidity', 'exchange', 'settlement', 'lastPolicy'].some(k => !Number.isInteger(data[k]) || data[k] < 0 || data[k] > 1000000000) || !Number.isFinite(data.inflation) || data.inflation < -3 || data.inflation > 80 || data.credit > 100 || data.liquidity > 100 || data.settlement > 100 || data.rate !== undefined && ![-1, 0, 1].includes(data.rate)) errors.push('campaign.economy');
  for (const [id, record] of Object.entries(c.prison)) if (!state.characters[id] || !object(record) || !Number.isInteger(record.turn) || record.turn < 1 || record.turn > state.turn || (record.captorId !== undefined && !state.factions[record.captorId]) || state.characterOwners[id] !== null || state.captives[id] || state.recruitedHeroIds.includes(id) || Object.values(state.tiles).some(t => [...t.field, ...t.garrison].includes(id))) errors.push('campaign.prison');
  if (c.canals !== undefined) {
    if (!object(c.canals) || Object.keys(c.canals).length > 300) errors.push('campaign.canals');
    else for (const [key, canal] of Object.entries(c.canals)) {
      const tile = state.tiles?.[key];
      if (!object(canal) || canal.key !== key || !tile || tile.shipId || !state.terrainTypes?.[tile.terrainId]?.passable || !['building', 'open'].includes(canal.status) || !Number.isInteger(canal.remaining) || canal.remaining < 0 || canal.remaining > 12 || (canal.status === 'open' && canal.remaining !== 0) || (canal.status === 'building' && canal.remaining < 1) || typeof canal.name !== 'string' || !canal.name || canal.name.length > 80 || (canal.ownerId !== null && canal.ownerId !== undefined && !state.factions[canal.ownerId]) || !Number.isInteger(canal.builtTurn) || canal.builtTurn < 1 || canal.builtTurn > state.turn) errors.push(`campaign.canals.${key}`);
    }
  }
  for (const [key, army] of Object.entries(c.armies)) {
    if (!state.tiles[key] || !object(army) || !['main', 'free'].includes(army.mode || 'main') || !['land', 'sea', 'air'].includes(army.travel || 'land') || ['ships', 'planes'].some(k => army[k] !== undefined && (!Number.isInteger(army[k]) || army[k] < 0 || army[k] > 200))) errors.push('campaign.army');
    if (army.goal && (!state.tiles[army.goal.toKey] || !Array.isArray(army.goal.girls) || army.goal.girls.some(id => !state.characters[id]) || !Number.isInteger(army.goal.troops) || army.goal.troops < 0 || army.goal.troops > 99 || !Array.isArray(army.goal.waypoints) || army.goal.waypoints.length > 16 || army.goal.waypoints.some(key => !state.tiles[key]))) errors.push('campaign.goal');
  }
  if (c.reparations !== undefined && (!Array.isArray(c.reparations) || c.reparations.length > 100 || c.reparations.some(r => !state.factions[r?.from] || !state.factions[r?.to] || !(r.share > 0 && r.share <= 1) || !Number.isInteger(r.until)))) errors.push('campaign.reparations');
  if (c.currencyUnions !== undefined && (!object(c.currencyUnions) || Object.entries(c.currencyUnions).some(([a, b]) => !state.factions[a] || !state.factions[b]))) errors.push('campaign.currencyUnions');
  if (!Array.isArray(c.occupations) || c.occupations.length > 100 || c.occupations.some(o => !state.factions[o.factionId] || !Array.isArray(o.keys) || o.keys.some(key => !state.tiles[key]) || !Array.isArray(o.members) || o.members.some(id => !state.characters[id]))) errors.push('campaign.occupations');
  for (const [id, job] of Object.entries(c.integrations)) if (!state.factions[id] || !object(job) || !Number.isInteger(job.progress) || !Number.isInteger(job.total) || job.progress < 0 || job.progress > job.total || job.total < 8 || job.total > 16000) errors.push('campaign.integration');
  return errors;
}

import { C, say } from './campaign-copy.mjs?v=1118-1603';
import { F, feedbackText } from './feedback-copy.mjs?v=1118-1603';
import { BRIDGE_RULES, isWater, isBridge, walkable, marchGuard, waterOwner, waterClaimPlan, bridgePlans, bridgePlan, reconcileWater, waterErrors } from './waters.mjs?v=1118-1603';
export { BRIDGE_RULES, isWater, isBridge, walkable, waterOwner } from './waters.mjs?v=1118-1603';
import { AIRCRAFT_MODELS, SHIP_MODELS, usableAirport, parkedPlanes, flightSite, aircraftQuote, shipQuote, shipRoute, boardQuote as independentBoardQuote, flightQuote, flightPath, transportErrors, shipSpeed, planeSpeed, canPassCanal } from './transport.mjs?v=1118-1603';
export { AIRCRAFT_MODELS, SHIP_MODELS, usableAirport, parkedPlanes, aircraftQuote, shipQuote, shipRoute, flightQuote, canPassCanal } from './transport.mjs?v=1118-1603';
import { ADVANCED_BUILDINGS, CIVIC_RULES, CANAL_RULES, TECHNOLOGIES, migrateCampaign, campaignErrors, controlAt, productionFactor, constructionFactor, campaignBudget, researchQuote, economyView, economyTick, cityQuote, citiesOf, mayorCity, canalSides, canalQuote, canalsOf, defaultCanalName, membersOf, hasTech, techOf, advancedBuildingReason, mobilityOf, armyProfile, campaignRoute, routeQuote, roadRouteQuote, roadTileCost, roadPath, techEffect, techById, seigniorageOf, sellSupplyQuote, digestionTurns, planPath, planBlocker, annexConditions } from './campaign.mjs?v=1118-1603';
export { CANAL_RULES, controlAt, campaignBudget, researchQuote, economyView, cityQuote, citiesOf, mayorCity, canalSides, canalQuote, canalsOf, defaultCanalName, membersOf, hasTech, techOf, mobilityOf, armyProfile, routeQuote, roadRouteQuote, roadTileCost, roadPath, techEffect, techById, seigniorageOf, sellSupplyQuote, spareSupply, TECHNOLOGIES, TECH_BRANCHES, WONDERS, effectLines, unlockLines, ownedWonders } from './campaign.mjs?v=1118-1603';
import { planRetreat } from './retreat.mjs?v=1118-1603';
import { TERRAIN_DEFINITIONS, CHARACTER_DEFINITIONS, FACTION_DEFINITIONS, BUILDINGS, STARTING_OWNERS, STARTER_BANDS, GACHA, ARRIVALS, ARRIVAL_EVERY } from './content.mjs?v=1118-1603';
import { STATS, MAX_LEVEL, GIFTS, GIFT_COST, giftBondGain, POSTS, bondTier, expToNext, newGrowth, trainingLimitNote, trainCap, trainCost, growthRate, moraleOf, perkFx, perkEco, perkChoices, PERK_LEVELS, pendingPerkTiers, quirkOf } from './growth.mjs?v=1118-1603';
import { createTacticalBattle, tacticalOptions, tacticalThreat, tacticalAttackReach, tacticalStatus, tacticalForceSummary, tacticalSiegeProfile, performTactical, validateTactical, tacticalGrowthSuppressed, tacticalGrowthLimited, tacticalGrowthParticipants, MAX_SQUADS, SAZAI_RANKS, MAX_ARMY_TRAINING, regularTrainingProfile } from './battle.mjs?v=1118-1603';
import { STORY_EVENTS, RECRUIT_LINES, SAZAI_LINES } from './story.mjs?v=1118-1603';
import { MAX_SEATS, MARCH_BUDGET, CUT_GRACE, MIGRANTS, MIN_SOURCE, MIN_BUILD, SUPPLY_RULES, supplyParts, supplyLimit, supplyRoom, easeTile, housingOf, handsNeeded, marchCost, growthTarget, growthGain, partsOf, sameLand, marchReach, marchSources, marchRoute, canBuildOnTerrain } from './realm.mjs?v=1118-1603';
import { EDICTS, EDICT_SLOTS, edictSlots, hasEdict } from './edicts.mjs?v=1118-1603';
import { DUTIES, DUTY_RULES, dutyById, dutiesOf, onDuty, dutyAt, dutyEffect, tileDuty, dutyLine } from './duties.mjs?v=1118-1603';
import { EARTH, earthTerrain, earthRegion, earthCanalName } from './earth.mjs?v=1118-1603';
export { EARTH, earthCanalName };
export { DUTIES, DUTY_RULES, dutyAt, dutyEffect, dutyLine, onDuty, tileDuty };
export { EDICTS, EDICT_SLOTS } from './edicts.mjs?v=1118-1603';

import { previewRecovery, applyRecovery, chooseRecovery, getArmyProtectionSites } from './recovery.mjs?v=1118-1603';
import { CAPTIVITY_VERSION, CAPTIVITY_RULES, CAPTIVE_METHODS, migrateCaptivity, registerCapture, recordCaptivityExit, isOnParole, paroleOf, captivityEscape, ransomQuote, captiveGoodwill, persuasionQuote, applyPersuasion, captiveAccessionQuote, getCaptiveStatus, captivityErrors, reviewTurnOf, extensionQuote } from './captivity.mjs?v=1118-1603';
export { CAPTIVITY_RULES, getCaptiveStatus, captiveAllegiance, captiveAccessionQuote } from './captivity.mjs?v=1118-1603';
import { FORT_GARRISON, fortNetwork, fortStatus, fortCover, fortConstructionCost, fortLevelProfile } from './fortification.mjs?v=1118-1603';
import { selectNpcRepresentatives } from './world-details.mjs?v=1118-1603';
import { MILITARY_RULES, militaryStatus, militaryBudget, replaceMilitaryBudgetSite, serviceRoster, serviceTraining } from './military.mjs?v=1118-1603';
export { MILITARY_RULES } from './military.mjs?v=1118-1603';
export const getMilitaryStatus = militaryStatus;
export const getMilitaryBudget = militaryBudget;
export const getWarAccessReason = (state,a,b)=>peaceReason(state,a,b);
export const getFortNetwork = fortNetwork;
export const getFortStatus = fortStatus;

export { BUILDINGS, GACHA, STARTER_BANDS } from './content.mjs?v=1118-1603';
export { SAZAI_RANKS } from './battle.mjs?v=1118-1603';
export { MAX_SEATS, MARCH_BUDGET, CUT_GRACE, MIGRANTS, MIN_SOURCE, MIN_BUILD, SUPPLY_RULES } from './realm.mjs?v=1118-1603';
export const ENGINE_VERSION = 1;
export const RULES_VERSION = 11;
export const PROSPERITY_GOLD_CHAPTERS = 3;
export const DIRECTIONS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
const MAX_TILES = 8000;
const MAX_CUSTOM_EVENTS = 10000;
const MAX_ARRIVAL_QUEUE = 16000; // At most 1000 Mod packages of 16 factions each.
const RARE_RANKS = ['R', 'SR', 'SSR'];
const OPENING_PEACE = 8, FIRST_DISCOVERY_TURN = 4, TRUCE_TURNS = 6, PACT_TURNS = 12, TRADE_GOLD = 2;
/** Commands per turn: three to begin with, more as the realm grows and as people take work off the lord. */
export const COMMAND_RULES = Object.freeze({ base: 8, realm: Object.freeze([]), max: 16 });
const MAX_MARCH_ORDERS = 48, MUSTER_SPARE_SOURCES = 12, MUSTER_SPARE_MIN = 3;
/** Diplomacy beyond war and peace: war score buys terms, vassals pay and follow, envoys warm a court. */
export const DIPLOMACY_RULES = Object.freeze({
  score: Object.freeze({ tile: 6, capital: 25, battle: 4, captive: 5, raid: 3 }),
  terms: Object.freeze({ gold: 20, land: 30, landStep: 15, landMax: 4, vassal: 60, vassalSmall: 40, vassalSmallTiles: 3, pay: -20 }),
  vassalTribute: .8, annexTurns: 24, annexFavor: 70, annexGoldPerTile: 8,
  envoyBase: 40, envoyPerCharm: 5, envoyMax: 75, unjustWar: -8, capitalFall: -6, insultTurns: 12, grudgeFavor: -30, notes: 8,
  giftSoftCap: 25, giftCap: 40,
});
const ELITE_ZERO = Object.freeze({ R: 0, SR: 0, SSR: 0 });
const DEFAULT_GROWTH = Object.freeze(newGrowth(0));
const BATTLE_ACTIONS = new Set(['battleBrace', 'battleOverwatch', 'battleSuppress', 'battleMove', 'battleFace', 'battleAttack', 'battleSkill', 'battleWait', 'battleEndTurn', 'battleAuto', 'battleRetreat', 'finishBattle']);
const clone = value => JSON.parse(JSON.stringify(value));
const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const isObject = value => !!value && typeof value === 'object' && !Array.isArray(value);
const integer = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;
const validId = id => typeof id === 'string' && /^[a-zA-Z0-9_.:-]{1,64}$/.test(id) && !['__proto__', 'constructor', 'prototype'].includes(id);
const validColor = value => typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
const validName = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 80;
const coordValid = n => integer(n, -10000, 10000);
export const tileKey = (q, r) => `${q},${r}`;
export const hexDistance = (a, b = { q: 0, r: 0 }) => Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.q + a.r - b.q - b.r));
export const neighbors = tile => DIRECTIONS.map(([dq, dr]) => ({ q: tile.q + dq, r: tile.r + dr, key: tileKey(tile.q + dq, tile.r + dr) }));

/* 世界地图 (2026-11-15): the real world on the hex grid (dist/earth.mjs). The start cell is (0, 0); a tile (q, r)
 * is the grid cell that many steps away. Off the grid there is no land and no fog: the world simply ends. */
export const WORLD_STARTS = EARTH.starts;
export function worldCellOf(state, q, r) {
  const origin = state?.world?.origin;
  if (!origin) return null;
  const row = origin.row + r, col = origin.col - Math.floor(origin.row / 2) + q + Math.floor(row / 2);
  return row >= 0 && row < EARTH.rows && col >= 0 && col < EARTH.cols ? { col, row } : null;
}
/** True everywhere on an endless map; on the world map, only on the grid. */
export const inWorld = (state, q, r) => !state?.world || worldCellOf(state, q, r) !== null;
const worldTerrainAt = (state, q, r) => { const cell = worldCellOf(state, q, r); return cell ? earthTerrain(cell.col, cell.row) : null; };
/** The named region of a tile on the world map ('' elsewhere): 华北平原, 撒哈拉, 安第斯… */
export function worldRegion(state, q, r) { const cell = worldCellOf(state, q, r); return cell ? earthRegion(cell.col, cell.row) : ''; }
/** Could a nation stand on this cell? A tile decides for itself; an ungenerated world-map cell asks the map. */
const landHere = (state, q, r) => { const tile = state.tiles[tileKey(q, r)]; if (tile) return !!state.terrainTypes[tile.terrainId]?.passable; if (!inWorld(state, q, r)) return false; if (!state.world) return true; const id = worldTerrainAt(state, q, r); return !!id && !!state.terrainTypes[id]?.passable; };
function requireThat(test, message) { if (!test) throw new Error(message); }
function mapById(items) { return Object.fromEntries(items.map(item => [item.id, clone(item)])); }
function hash(seed, q, r, salt = '') {
  const value = `${seed}|${q}|${r}|${salt}`;
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}
function hexArea(q, r, radius) {
  const cells = [];
  for (let dq = -radius; dq <= radius; dq++) {
    for (let dr = Math.max(-radius, -dq - radius); dr <= Math.min(radius, -dq + radius); dr++) cells.push({ q: q + dq, r: r + dr });
  }
  return cells;
}
function generatedTerrain(state, q, r) {
  if (state.world) return worldTerrainAt(state, q, r) || 'ocean';
  if (state.terrainTypes.ocean && hexDistance({ q, r }) > 6 && hash(state.seed, Math.floor(q / 5), Math.floor(r / 5), 'ocean') < .22) return 'ocean';
  const biomes = [ ['plains', 'meadow', 'hills', 'forest'], ['pine', 'tundra', 'snow', 'mountain'], ['desert', 'oasis', 'salt', 'ruins'], ['forest', 'jungle', 'wetland', 'coast'], ['hills', 'volcanic', 'crystal', 'mountain'] ];
  const base = biomes[Math.floor(hash(state.seed, Math.floor(q / 4), Math.floor(r / 4), 'biome') * biomes.length)];
  const available = Object.keys(state.terrainTypes);
  const custom = available.filter(id => !TERRAIN_DEFINITIONS.some(t => t.id === id));
  const roll = hash(state.seed, q, r, 'terrain');
  if (custom.length && roll > 0.85) return custom[Math.floor(hash(state.seed, q, r, 'custom') * custom.length)];
  if (roll < 0.045 && state.terrainTypes.lake) return 'lake';
  const pool = roll < 0.72 ? base.filter(id => own(state.terrainTypes, id)) : available;
  return (pool.length ? pool : available)[Math.floor(hash(state.seed, q, r, 'choice') * (pool.length || available.length))];
}
function ensureTile(state, q, r, discovered = false) {
  requireThat(coordValid(q) && coordValid(r) && inWorld(state, q, r), '地块坐标超出范围。');
  const key = tileKey(q, r);
  if (!own(state.tiles, key)) {
    requireThat(Object.keys(state.tiles).length < MAX_TILES, '当前加载区已达地块容量，新地区暂缓生成；经营、战争与回合推进仍可继续。');
    state.tiles[key] = { key, q, r, terrainId: generatedTerrain(state, q, r), ownerId: null, troops: 0, food: 0, garrison: [], field: [], building: null, buildingLevel: 0, isCapital: false, capitalOf: null, discovered: !!discovered, ruinClaimed: false };
  } else if (discovered) state.tiles[key].discovered = true;
  return state.tiles[key];
}
function maybeTile(state, q, r, discovered = false) {
  if (!coordValid(q) || !coordValid(r) || !inWorld(state, q, r)) return null;
  if (!own(state.tiles, tileKey(q, r)) && Object.keys(state.tiles).length >= MAX_TILES) return null;
  return ensureTile(state, q, r, discovered);
}
function revealArea(state, q, r, radius) {
  let revealed = 0;
  for (const cell of hexArea(q, r, radius)) {
    const before = state.tiles[tileKey(cell.q, cell.r)];
    const wasDiscovered = !!before?.discovered;
    const tile = maybeTile(state, cell.q, cell.r, true);
    if (tile && !wasDiscovered) revealed++;
  }
  for (const cell of hexArea(q, r, radius + 1)) maybeTile(state, cell.q, cell.r, false);
  return revealed;
}
const betweenOtherNations = (state, parties) => parties.filter(Boolean).length > 1 && !parties.includes(state.playerId);
function log(state, text, type = 'info', parties = []) {
  state.eventSeq = (state.eventSeq || 0) + 1;
  state.logs.push({ id: state.eventSeq, turn: state.turn, text, type, ...(betweenOtherNations(state, parties) ? { npcOnly: true } : {}) });
  state.logs = state.logs.slice(-80);
}
const eliteOf = tile => tile.elite || ELITE_ZERO;
function addElite(tile, rank, amount = 1) {
  const next = { ...eliteOf(tile) }; next[rank] = Math.max(0, Math.min(99, next[rank] + amount));
  if (RARE_RANKS.some(item => next[item])) tile.elite = next; else delete tile.elite;
}
function eliteTransferPlan(from, to, enabled = true) {
  const source = eliteOf(from), target = eliteOf(to), moved = {}, retained = {};
  for (const rank of RARE_RANKS) {
    moved[rank] = enabled ? Math.min(source[rank], Math.max(0, 99 - target[rank])) : 0;
    retained[rank] = source[rank] - moved[rank];
  }
  return { moved, retained };
}
function mergeElite(to, from) {
  const transfer = eliteTransferPlan(from, to);
  for (const rank of RARE_RANKS) if (transfer.moved[rank]) addElite(to, rank, transfer.moved[rank]);
  if (RARE_RANKS.some(rank => transfer.retained[rank])) from.elite = { ...transfer.retained }; else delete from.elite;
  return transfer;
}
function factionElites(state, factionId) {
  const total = { R: 0, SR: 0, SSR: 0 };
  for (const tile of Object.values(state.tiles).filter(t=>t.ownerId===factionId)) for (const rank of RARE_RANKS) total[rank] += eliteOf(tile)[rank];
  return total;
}
/* A girl is either stationed in a tile's buildings (holds it, cannot leave) or on the march with the army there (free to go). */
const girlsOn = tile => [...(tile.garrison || []), ...(tile.field || [])];
function stationOf(state, id) { const flight=Object.values(state.campaign?.flights||{}).find(f=>f.pilotIds.includes(id));if(flight)return flightSite(state,flight.id);const guest=Object.entries(state.campaign?.airportGuests||{}).find(([,ids])=>ids.includes(id));if(guest)return {key:guest[0],ownerId:state.characterOwners[id],field:guest[1],garrison:[],troops:0};return Object.values(state.tiles).find(tile => tile.garrison?.includes(id) || tile.field?.includes(id)) || null; }
const isPosted = (state, id) => Object.values(state.posts || {}).includes(id) || Object.values(state.envoys || {}).includes(id) || onDuty(state, id);
/** Whoever has no place yet joins the people at home: holding the capital if nobody does, otherwise on the march. */
function seatAtHome(state, id) {
  const owner = state.characterOwners[id], home = state.tiles[state.factions[owner]?.capitalKey];
  if (home?.ownerId !== owner || stationOf(state, id) || isPosted(state, id) || !canServe(state, id, owner)) return;
  if (!home.garrison.length) home.garrison.push(id); else home.field.push(id);
  // A same-turn capture/return cannot refresh a combatant by teleporting her
  // home. As with ordinary retreats and spent-army moves, the receiving army
  // keeps that turn's exhaustion. Existing history also covers delayed seating
  // after capital loss/rebuilding, without adding parole or a new save field.
  const captivity = state.captureHistory?.[id];
  if (captivity?.lastCaptureTurn === state.turn && captivity.lastExitTurn === state.turn && captivity.lastOutcome !== 'captured') {
    home.marchedTurn = state.turn; home.foughtTurn = state.turn;
  }
}
function syncGarrisons(state) {
  const seen = new Set([...Object.values(state.campaign?.flights||{}).flatMap(f=>f.pilotIds),...Object.values(state.campaign?.airportGuests||{}).flat()]);
  const keep = (tile, id) => {
    if (seen.has(id) || !tile.ownerId || !canServe(state, id, tile.ownerId) || isPosted(state, id)) return false;
    seen.add(id); return true;
  };
  for (const tile of Object.values(state.tiles)) {
    if (tile.garrison?.length) tile.garrison = tile.garrison.filter(id => keep(tile, id)).slice(0, MAX_SEATS);
    if (tile.field?.length) tile.field = tile.field.filter(id => keep(tile, id));
  }
  // Nobody is left in limbo: anyone without a place walks back to the capital.
  for (const id of state.recruitedHeroIds || []) if (!seen.has(id)) seatAtHome(state, id);
}
function growthOf(state, id) { return state.growth?.[id] || DEFAULT_GROWTH; }
function ensureGrowth(state, id) { return state.growth[id] ||= newGrowth(state.turn); }
function currentStats(character, growth) {
  const stats = { ...character.stats };
  for (const stat of STATS) stats[stat.id] = Math.min(stat.cap ?? 99, (character.stats?.[stat.id] || 0) + (growth.gains[stat.id] || 0) + (growth.trained[stat.id] || 0));
  return stats;
}
const palsOf = (state, id) => Object.entries(state.pairs || {}).filter(([key, count]) => count >= 5 && key.split('|').includes(id)).map(([key]) => key.split('|').find(other => other !== id));
/** A character as she is right now: definition plus everything this save has done to her. */
function heroView(state, id) {
  const character = state.characters[id], growth = growthOf(state, id);
  return { ...character, stats: currentStats(character, growth), level: growth.level, spirit: growth.spirit, bondTier: bondTier(growth.bond), morale: moraleOf(growth.spirit), fx: perkFx(growth.perks, character.stats), pals: palsOf(state, id) };
}
export function getCharacter(state, id) {
  if (state.campaign?.prison?.[id]) return null;
  if (!own(state.characters, id)) return null;
  const growth = growthOf(state, id), view = heroView(state, id), owner = state.characterOwners[id];
  return { ...view, growth, owner, quirk: quirkOf(state.characters[id]), quirkNow: quirkStatus(state, id), captive: state.captives[id] || null, captivity: getCaptiveStatus(state, id), need: expToNext(growth.level), likes: likeOf(id), pending: owner === state.playerId ? pendingPerkTiers(growth) : [], trainCap: trainCap(growth.level, growth.bond), trainCost: trainCostOf(state, growth),
    post: Object.keys(state.posts || {}).find(post => state.posts[post] === id) || null, duty: dutiesOf(state)[id] ? { ...dutiesOf(state)[id] } : null, envoy: Object.keys(state.envoys || {}).find(where => state.envoys[where] === id) || null, station: stationOf(state, id)?.key || null, stance: stationOf(state, id)?.garrison?.includes(id) ? 'garrison' : 'field', canTalk: state.talkTurn !== state.turn, canGift: growth.giftTurn !== state.turn, giftGains: { plain: giftBondGain(growth.bond), liked: giftBondGain(growth.bond, true) } };
}
/** 兴学 takes three tenths off the tuition. */
function trainCostOf(state, growth) { const cost = trainCost(growth); return hasEdict(state, 'school') ? { ...cost, gold: Math.ceil(cost.gold * .7) } : cost; }
function likeOf(id) { return (GIFTS[Math.floor(hash('likes', 0, 0, id) * GIFTS.length)] || GIFTS[0]).id; }
function addBond(state, id, amount) { const growth = ensureGrowth(state, id); growth.bond = Math.max(0, Math.min(100, growth.bond + amount)); }
function autoPerks(state, id) {
  const growth = ensureGrowth(state, id), role = state.characters[id]?.role || 'vanguard';
  for (const tier of pendingPerkTiers(growth)) {
    const options = perkChoices(role, tier);
    growth.perks[tier] = options[Math.floor(hash(state.seed, tier, 0, id) * options.length)].id;
  }
}
function gainExp(state, id, amount) {
  const character = state.characters[id];
  if (!character) return;
  const growth = ensureGrowth(state, id);
  growth.exp += Math.round(amount * (1 + perkEco(growth.perks, 'exp', character.stats) + (hasEdict(state, 'school', state.characterOwners[id]) ? .25 : 0)));
  while (growth.level < MAX_LEVEL && growth.exp >= expToNext(growth.level)) {
    growth.exp -= expToNext(growth.level); growth.level++;
    const picks = STATS.filter(stat => (character.stats?.[stat.id] || 0) + (growth.gains[stat.id] || 0) + (growth.trained[stat.id] || 0) < (stat.cap ?? 99) && hash(state.seed, growth.level, 0, `${id}:${stat.id}`) * 100 < growthRate(stat.id, character.stats?.[stat.id] || 0, growth.bond)).map(stat => stat.id);
    if (!picks.length) picks.push(['attack', 'defense', 'economy', 'charm'].sort((a, b) => (character.stats?.[b] || 0) - (character.stats?.[a] || 0))[0]);
    for (const stat of picks) growth.gains[stat] = (growth.gains[stat] || 0) + 1;
    if (state.characterOwners[id] === state.playerId) {
      state.levelSeq = (state.levelSeq || 0) + 1;
      state.levelLog = [...(state.levelLog || []), { seq: state.levelSeq, id, level: growth.level, gains: picks, perk: PERK_LEVELS.includes(growth.level) }].slice(-30);
    } else autoPerks(state, id);
  }
  if (growth.level >= MAX_LEVEL) growth.exp = 0;
}
function getHero(state, factionId) {
  const primary = factionId === state.playerId ? state.activeHeroId : state.factions[factionId]?.leaderId;
  const characterId = canServe(state, primary, factionId) ? primary : factionId === state.playerId ? null : Object.keys(state.characters).find(id => canServe(state, id, factionId));
  return characterId && own(state.characters, characterId) ? heroView(state, characterId) : { id: null, name: '罪袋们', stats: { attack: 0, defense: 0, scout: 0, economy: 0, charm: 0 } };
}
/** Where this turn's commands come from, itemised: the dial shows the total, the 内政 page shows the parts. */
export function getCommandPlan(state) {
  const tiles = factionTiles(state, state.playerId).length, parts = [{ id: 'base', label: '领主亲政', value: COMMAND_RULES.base }];
  const realm = COMMAND_RULES.realm.filter(size => tiles >= size).length;
  if (realm) parts.push({ id: 'realm', label: `疆域 ${tiles} 块`, value: realm });
  const strategist = state.posts?.strategist;
  if (strategist && canServe(state, strategist, state.playerId)) parts.push({ id: 'strategist', label: `军师 ${state.characters[strategist].name}`, value: 1 });
  if (officeQuirk(state, 'q_plan')) parts.push({ id: 'quirk', label: '词条 · 运筹', value: 1 });
  if (hasEdict(state, 'court')) parts.push({ id: 'edict', label: '国策 · 勤政', value: 1 });
  const hall = campaignBudget(state);
  if (hall.hallFraction) parts.push({ id: 'administrativeHall', label: C.administrativeHallName, value: hall.hallAP, fraction: hall.hallFraction });
  if (hall.wonderAP) parts.push({ id: 'wonder', label: C.wonderName, value: hall.wonderAP });
  if (hall.techAP) parts.push({ id: 'tech', label: '科技 · 议会与电信', value: hall.techAP });
  const total = Math.min(COMMAND_RULES.max, parts.reduce((sum, part) => sum + part.value, 0));
  return { total, parts, tiles, nextRealm: COMMAND_RULES.realm.find(size => tiles < size) || null, strategist: Boolean(parts.some(part => part.id === 'strategist')) };
}
/** How far the army leaving a tile walks this turn: 急行军 in the party and the 驿传 edict each add a point. */
function marchBudgetOf(state, tile, girls = tile?.field || []) {
  return armyProfile(state, tile?.key, girls).speed + (armyQuirk(state, tile, 'q_march', girls) ? 1 : 0) + (hasEdict(state, 'relay', tile?.ownerId) ? 1 : 0);
}
const marchSupplyOf = (state, tile, girls = tile?.field || []) => armyQuirk(state, tile, 'q_baggage', girls) ? 0 : 1;
/** Administrative offices are at the capital; appointment is not a recall/teleport command. */
export function getPostQuote(state, postId, characterId) {
  const post = POSTS.find(item => item.id === postId), held = Object.values(state.posts || {}).includes(characterId);
  const tile = characterId ? stationOf(state, characterId) : null, home = state.factions[state.playerId]?.capitalKey;
  const reason = state.battle || state.turnContinuation ? '请先完成当前战场与战争阶段。'
    : !post ? '没有这个职位。' : characterId === null ? ''
    : !canServe(state, characterId, state.playerId) ? '只有可用的己方角色能任职。'
    : characterId === state.activeHeroId ? '领军不能兼任职位。'
    : Object.values(state.envoys || {}).includes(characterId) ? '她正在别国出使，先召回。'
    : !held && tile?.key !== home ? `先让角色沿己方道路返回首都 ${home}，才能任职。` : '';
  return { post: postId, characterId, enabled: !reason, reason, cost: { ap: 0, gold: 0, supply: 0 }, action: { type: 'assignPost', post: postId, characterId }, capitalKey: home };
}
function canServe(state, characterId, factionId) {
  return !!characterId && own(state.characters, characterId) && state.characterOwners?.[characterId] === factionId && !state.captives?.[characterId] && !state.campaign?.prison?.[characterId] && !isOnParole(state, characterId);
}
/* Signature traits (专属词条, growth.mjs QUIRKS). Each helper answers one question about where she is. */
const quirkIs = (state, id, quirk) => quirkOf(state.characters[id])?.id === quirk;
/** A girl marching with this army has the trait. `girls` is the part of the army that actually goes. */
function armyQuirk(state, tile, quirk, girls = tile?.field || []) {
  return Boolean(tile?.ownerId) && girls.some(id => canServe(state, id, tile.ownerId) && quirkIs(state, id, quirk));
}
/** A girl stationed in this tile's buildings has the trait. */
function seatQuirk(state, tile, quirk) {
  return Boolean(tile?.ownerId) && (tile.garrison || []).some(id => canServe(state, id, tile.ownerId) && quirkIs(state, id, quirk));
}
/** The player's leader has the trait. */
const leadQuirk = (state, quirk) => canServe(state, state.activeHeroId, state.playerId) && quirkIs(state, state.activeHeroId, quirk);
/** The player's leader or one of her office holders has the trait. */
function officeQuirk(state, quirk) {
  return leadQuirk(state, quirk) || Object.values(state.posts || {}).some(id => id && canServe(state, id, state.playerId) && quirkIs(state, id, quirk));
}
/** Is her signature trait at work right now, and if not, the one move that would switch it on. Null for somebody else's girl. */
function quirkStatus(state, id) {
  const quirk = quirkOf(state.characters[id]);
  if (!quirk || state.characterOwners[id] !== state.playerId) return null;
  if (!canServe(state, id, state.playerId)) return { active: false, tip: '她现在不能任事，词条暂时不生效。' };
  const at = stationOf(state, id), seated = Boolean(at?.garrison?.includes(id)), marching = Boolean(at?.field?.includes(id));
  const post = Object.keys(state.posts || {}).find(key => state.posts[key] === id) || null, leads = state.activeHeroId === id;
  const on = { active: true, tip: '' }, off = tip => ({ active: false, tip });
  switch (quirk.where) {
    case 'realm': return on;
    case 'army': return marching ? on : off('她现在留在驻地。点地图上的编队旗，再点她的头像让她随队，词条才生效。');
    case 'seat': {
      if (!seated) return off(post ? '她正在任职，不驻扎。卸任后让她驻扎到合适的地块，词条才生效。' : '她现在随编队行军。点地块，在「驻扎」里把她留在驻地，词条才生效。');
      const sites = quirk.id === 'q_shop' ? GOLD_SITES : quirk.id === 'q_farm' ? FOOD_SITES : null;
      return !sites || sites.includes(at.building) ? on : off(`她驻扎的地方没有对口的建筑。换到${sites.map(key => BUILDINGS[key]?.name || key).join('、')}，词条才生效。`);
    }
    case 'capital': return at?.isCapital && at.capitalOf === state.playerId ? on : off('她不在首都。回到首都，词条才生效。');
    case 'post': return ['finance', 'logistics'].includes(post) ? on : off('在角色页「任用」里让她当财务官或军需官，词条才生效。');
    case 'lead': return leads ? on : off('在角色页「任用」里让她当领军，词条才生效。');
    case 'office': return leads || post ? on : off('在角色页「任用」里让她领军或任职，词条才生效。');
    case 'tile': return at && new Set(girlsOn(at)).size > 1 ? on : off('她身边没有别的同伴。让她和别人待在同一块地，词条才生效。');
    default: return on;
  }
}
/** Per-turn or per-roll bonuses a character brings just by serving: perks, stat traits and her signature trait. */
function ecoOf(state, id, key) {
  const character = state.characters[id];
  return perkEco(growthOf(state, id).perks, key, character.stats) + (quirkOf(character)?.eco?.[key] || 0);
}
const GOLD_SITES = ['mine', 'quarry', 'port', 'camp'], FOOD_SITES = ['farm', 'lumber', 'port'];
function leaveOffices(state, id) {
  if (!id) return;
  for (const post of Object.keys(state.posts || {})) if (state.posts[post] === id) state.posts[post] = null;
}
function normalizeParty(state) {
  for (const id of Object.keys(state.characters)) if (!own(state.characterOwners, id)) state.characterOwners[id] = null;
  const available = state.recruitedHeroIds.filter(id => canServe(state, id, state.playerId)), free = available.filter(id => !onDuty(state, id));
  if (!available.includes(state.activeHeroId)) state.activeHeroId = free[0] || available[0] || null;
  if (state.companionId !== null && (!available.includes(state.companionId) || state.companionId === state.activeHeroId)) state.companionId = free.find(id => id !== state.activeHeroId) || available.find(id => id !== state.activeHeroId) || null;
  for (const post of Object.keys(state.posts || {})) if (state.posts[post] && (!available.includes(state.posts[post]) || [state.activeHeroId, state.companionId].includes(state.posts[post]))) state.posts[post] = null;
  for (const [where, who] of Object.entries(state.envoys || {})) if (!available.includes(who) || [state.activeHeroId, state.companionId].includes(who) || !state.factions[where]?.alive) delete state.envoys[where];
  settleDuties(state);
  syncGarrisons(state);
}
/** 差事 that can no longer stand end here: she leads, follows the lead, holds a post, is an envoy or a mayor, flies, marches,
 *  cannot serve, or the land is no longer ours. A girl whose duty ends walks home (syncGarrisons seats her). With `tell`,
 *  the player hears about duties lost with their land. */
function settleDuties(state, tell = false) {
  const c = state.campaign;
  if (!c?.duties) return;
  const roles = new Set([state.activeHeroId, state.companionId, ...Object.values(state.posts || {}), ...Object.values(state.envoys || {}), ...citiesOf(state).map(city => city.mayorId)].filter(Boolean));
  const busy = new Set([...Object.values(c.flights || {}).flatMap(f => f.pilotIds || []), ...Object.values(c.airportGuests || {}).flat(), ...marchOrdersOf(state).flatMap(order => order.girls || [])]);
  for (const [id, duty] of Object.entries(c.duties)) {
    const tile = state.tiles[duty?.key], serve = canServe(state, id, state.playerId), lost = !tile || tile.ownerId !== state.playerId || Boolean(tile.shipId);
    if (serve && !lost && !roles.has(id) && !busy.has(id) && dutyById(duty.job)) continue;
    delete c.duties[id];
    if (tell && serve && lost && state.characters[id]) notice(state, 'land', `${state.characters[id].name}管事的那块地没了，她回到了首都。`);
  }
  if (!Object.keys(c.duties).length) delete c.duties;
}
/** Who actually fights from a tile: the girls stationed there, nobody else. */
function armyOf(state, tile) { return girlsOn(tile).filter(id => canServe(state, id, tile.ownerId)).map(id => heroView(state, id)); }
/** NPCs choose from the commanders actually present, by the same one-squad
 * rating the public force summary uses. Player order and explicit choices are
 * authoritative; choosing never moves, levels or creates anyone. */
function combatIds(state, ids, factionId, explicit = false) {
  const ready = ids.filter(id => canServe(state, id, factionId));
  if (explicit || factionId === state.playerId) return ready.slice(0, MAX_SQUADS);
  return ready.map((id, index) => ({ id, index, score: tacticalForceSummary({ troops: 1, characters: [heroView(state, id)] }).rating }))
    .sort((a, b) => b.score - a.score || a.index - b.index).slice(0, MAX_SQUADS).map(item => item.id);
}
function attackingIds(state, tile, selected) {
  return combatIds(state, Array.isArray(selected) ? tile.field.filter(id => selected.includes(id)) : tile.field, tile.ownerId, Array.isArray(selected));
}
/** Line-up an army would field, in order: girls, then the rarest Sazai, then plain squads. */
export function getArmy(state, key, soldiers) {
  const tile = state.tiles[key];
  if (!tile) return null;
  const girls = girlsOn(tile).filter(id => tile.ownerId && canServe(state, id, tile.ownerId)), elite = serviceRoster(state, tile);
  const total = soldiers ?? tile.troops, rares = [];
  for (const rank of ['SSR', 'SR', 'R']) for (let i = 0; i < elite[rank]; i++) rares.push(rank);
  const leaders = [...combatIds(state, girls, tile.ownerId).map(id => ({ kind: 'girl', id })), ...rares.map(rank => ({ kind: 'sazai', rank }))].slice(0, MAX_SQUADS);
  const squads = Math.min(MAX_SQUADS, Math.max(total, leaders.length));
  while (leaders.length < squads) leaders.push({ kind: 'sazai', rank: 'N' });
  return { key, troops: tile.troops, girls, stationed: [...(tile.garrison || [])], marching: [...(tile.field || [])], elite: { ...eliteOf(tile) }, availableElite: elite, military: militaryStatus(state, tile), leaders, seats: MAX_SEATS, marched: tile.marchedTurn === state.turn };
}
function releaseCharacter(state, characterId, reason = '获释', outcome = 'rescued', options = {}) {
  const captive = state.captives[characterId];
  if (!captive) return false;
  const home = freeCaptive(state, characterId, outcome, options);
  if (state.pendingEvent && !storyEventReady(state, getPendingEvent(state))) state.pendingEvent = null;
  const text = `${state.characters[characterId].name}${reason}，${home ? `回到${state.factions[home].name}` : '故国已亡，成了自由角色'}。`;
  recordChronicle(state, text, 'rescue', captive.originalFactionId, [captive.captorId, captive.originalFactionId]);
  if (outcome === 'rescued' && captive.originalFactionId === state.playerId) notice(state, 'character', text);
  normalizeParty(state);
  return true;
}
function releasePrisonersOf(state, factionId, reason) {
  const ids = Object.values(state.captives).filter(captive => captive.captorId === factionId).map(captive => captive.characterId);
  for (const id of ids) releaseCharacter(state, id, reason);
  const freedExec = [];
  for (const [id, rec] of Object.entries(state.campaign?.prison || {})) {
    if ((rec.captorId || state.playerId) !== factionId) continue;
    delete state.campaign.prison[id];
    const home = rec.originalFactionId && rec.originalFactionId !== factionId && state.factions[rec.originalFactionId]?.alive ? rec.originalFactionId : null;
    state.characterOwners[id] = home;
    if (home === state.playerId && !state.recruitedHeroIds.includes(id)) state.recruitedHeroIds.push(id);
    if (home) seatAtHome(state, id);
    const charName = state.characters[id]?.name || id;
    const text = `${say('prisonFreed', { name: charName })}（${home ? `回到${state.factions[home].name}` : '成为自由旅人'}）`;
    recordChronicle(state, text, 'rescue', rec.originalFactionId || factionId, [factionId, rec.originalFactionId]);
    if (home === state.playerId || !betweenOtherNations(state, [factionId, rec.originalFactionId])) notice(state, 'character', text);
    freedExec.push(id);
  }
  if (freedExec.length) normalizeParty(state);
  return [...ids, ...freedExec];
}
const persuasionBonus = state => (leadQuirk(state, 'q_tongue') ? 8 : 0) + (hasEdict(state, 'mercy') ? 6 : 0);
export function getCaptiveActions(state, characterId) {
  const captive = state.captives[characterId];
  if (!captive) return [];
  const actions = [];
  const add = (label, type, cost, description = '', effects = {}, block = '', extra = {}) => {
    const reason = state.battle || state.turnContinuation ? '请先完成当前战场与战争阶段。' : block || affordable(state, cost);
    actions.push({ type, label, cost, description, effects, enabled: !reason, reason, action: { type, characterId, ...extra } });
  };
  const ransom = ransomQuote(state, characterId), status = getCaptiveStatus(state, characterId);
  const returnExhausted = captive.capturedTurn === state.turn;
  const returnNote = returnExhausted ? '本回合刚被俘，接收她的军团本回合不能再次行军或出征，下回合恢复。' : '';
  const favor = outcome => Math.min(captiveGoodwill(state, characterId, outcome), 100 - readRelation(state, captive.captorId, captive.originalFactionId).favor);
  if (captive.originalFactionId === state.playerId && captive.captorId !== state.playerId) add(ransom.freeReturn ? '按原约接回' : '赎回角色', 'ransomCharacter', { ap: 2, gold: ransom.amount, supply: 0 }, ransom.description + returnNote, { gold: -ransom.amount, returnExhausted }, ransom.reason);
  if (captive.captorId === state.playerId) {
    for (const way of CAPTIVE_METHODS) {
      const quote = persuasionQuote(state, characterId, way, getHero(state, state.playerId).stats.charm, persuasionBonus(state));
      add(quote.label, 'persuade', quote.cost, quote.description, { progress: quote.progress, progressGain: quote.progressGain, grudge: quote.grudge, grudgeChange: quote.grudgeChange, watch: quote.watch, watchChange: quote.watchChange, escapeRisk: quote.escapeRisk, joined: false, prepared: quote.prepared, allegiance: quote.allegiance }, quote.reason, { way });
    }
    const accession = captiveAccessionQuote(state, characterId);
    add('提出归附条件', 'recruitCaptive', accession.cost, accession.description, { joined: true, accession }, accession.reason, { expectedRevision: state.revision });
    add('加强看守', 'secureCaptive', { ap: 0, gold: CAPTIVITY_RULES.securityGold, supply: CAPTIVITY_RULES.securitySupply }, `预付 ${CAPTIVITY_RULES.securityTurns} 回合护卫费用，逃跑风险降低 12 个百分点（最低 2%），不增加怨气。`, { securityUntil: state.turn + CAPTIVITY_RULES.securityTurns, escapeRisk: captivityEscape(state, characterId, { securityUntil: state.turn + CAPTIVITY_RULES.securityTurns }).risk }, status.security.remaining ? `专门护卫仍有效，还剩 ${status.security.remaining} 回合。` : '');
    const extension = extensionQuote(state, characterId);
    add(`续押 ${extension.turns} 回合`, 'extendCaptive', extension.cost, `关押满期会经审查假释归国。付一笔续押费，把审查从第 ${extension.reviewTurn} 回合推迟到第 ${extension.nextReviewTurn} 回合；她的怨气 +${extension.grudgeChange}，每续一次贵 ${CAPTIVITY_RULES.extendGoldStep} 金币（最高 ${CAPTIVITY_RULES.extendGoldMax}）。`, { reviewTurn: extension.nextReviewTurn, grudge: extension.grudge, grudgeChange: extension.grudgeChange }, extension.reason);
    const goodwillNote = amount => amount ? `两国好感 +${amount}；同一角色与关押国 ${CAPTIVITY_RULES.goodwillCooldownTurns} 回合内不重复获得好感。` : '近期已获得过善意回报，本次不重复增加好感。';
    add('无条件释放', 'releaseCaptive', { ap: 0, gold: 0, supply: 0 }, `${state.factions[captive.originalFactionId]?.alive ? `立即自由归国。${returnNote || '可重新部署。'}` : '故国已亡，获释后成为自由旅人，之后可通过招募再遇见。'}${goodwillNote(favor('released'))}`, { favor: favor('released'), returnExhausted });
    add('假释归国', 'paroleCaptive', { ap: 0, gold: 0, supply: 0 }, `回国休整 ${CAPTIVITY_RULES.paroleTurns} 回合，期间不能出战、任职或特训，届满自动恢复；不损失属性。${goodwillNote(favor('paroled'))}`, { favor: favor('paroled'), paroleUntil: state.turn + CAPTIVITY_RULES.paroleTurns }, state.factions[captive.originalFactionId]?.alive ? '' : '故国已亡，可无条件释放为自由角色。');
    if (state.factions[captive.originalFactionId]?.alive) add(ransom.freeReturn ? '按原约遣返' : `议定赎金 ${ransom.amount} 金`, 'sellCaptive', { ap: 0, gold: 0, supply: 0 }, (ransom.freeReturn ? ransom.description : `我方收取 ${ransom.amount} 金币，由对方支付。${ransom.description.replace(/^本次支付\s+\d+\s+金币；/, '')}`) + returnNote, { gold: ransom.amount, favor: favor('ransomed'), returnExhausted }, ransom.reason);
  }
  return actions;
}
/** The same bounded percentage is displayed and used by deterministic turn rolls. */
export function escapeRisk(state, id) { return captivityEscape(state, id).risk; }
/** Everything the prison roster needs for its one-tap orders: who lacks a guard detail, whose review
 * is close, what each batch costs and how many of them the treasury covers right now. Pure. */
export function getPrisonPlan(state) {
  const held = Object.values(state.captives || {}).filter(captive => captive.captorId === state.playerId);
  const faction = state.factions[state.playerId] || { gold: 0, supply: 0 };
  const reason = state.battle || state.turnContinuation ? '请先完成当前战场与战争阶段。' : '';
  const batch = (ids, price, empty) => {
    let gold = faction.gold, supply = faction.supply;
    const ready = [], cost = { ap: 0, gold: 0, supply: 0 };
    for (const id of ids) {
      const each = price(id);
      if (gold < each.gold || supply < each.supply) continue;
      gold -= each.gold; supply -= each.supply; cost.gold += each.gold; cost.supply += each.supply; ready.push(id);
    }
    const full = ids.reduce((sum, id) => { const each = price(id); return { gold: sum.gold + each.gold, supply: sum.supply + each.supply }; }, { gold: 0, supply: 0 });
    return { ids, ready, total: ids.length, cost, full, reason: !ids.length ? empty : !ready.length ? `金币或补给不够：全部要 ${full.gold} 金币${full.supply ? `、${full.supply} 补给` : ''}。` : '' };
  };
  const byRisk = (a, b) => escapeRisk(state, b) - escapeRisk(state, a) || a.localeCompare(b);
  const unguarded = held.filter(captive => (captive.securityUntil || 0) <= state.turn).map(captive => captive.characterId).sort(byRisk);
  const due = held.map(captive => extensionQuote(state, captive.characterId)).filter(quote => quote.due && !quote.reason).sort((a, b) => a.left - b.left || a.characterId.localeCompare(b.characterId));
  const security = { gold: CAPTIVITY_RULES.securityGold, supply: CAPTIVITY_RULES.securitySupply };
  return { reason, held: held.map(captive => captive.characterId), guarded: held.length - unguarded.length,
    secure: batch(unguarded, () => security, held.length ? '所有俘虏都有专门护卫了。' : '牢里没有俘虏。'),
    extend: batch(due.map(quote => quote.characterId), id => extensionQuote(state, id).cost, held.length ? `没有俘虏在 ${CAPTIVITY_RULES.extendWindow} 回合内到期。` : '牢里没有俘虏。'),
    soonest: held.length ? Math.min(...held.map(captive => Math.max(0, reviewTurnOf(captive) - state.turn))) : null,
    autoSecure: Boolean(state.prison?.autoSecure), securityTurns: CAPTIVITY_RULES.securityTurns };
}
/** The start of the player's turn in the cells: renew guard details if that is the standing order,
 * and say in good time whose detention is about to be reviewed, so nobody "just becomes paroled". */
function tendPrison(state) {
  const held = Object.values(state.captives).filter(captive => captive.captorId === state.playerId), faction = state.factions[state.playerId];
  if (state.prison?.autoSecure && held.length) {
    let renewed = 0, unpaid = 0;
    for (const captive of held.filter(item => (item.securityUntil || 0) <= state.turn).sort((a, b) => escapeRisk(state, b.characterId) - escapeRisk(state, a.characterId) || a.characterId.localeCompare(b.characterId))) {
      if (faction.gold - CAPTIVITY_RULES.securityGold < CAPTIVITY_RULES.autoSecureGoldFloor || faction.supply - CAPTIVITY_RULES.securitySupply < CAPTIVITY_RULES.autoSecureSupplyFloor) { unpaid++; continue; }
      faction.gold -= CAPTIVITY_RULES.securityGold; faction.supply -= CAPTIVITY_RULES.securitySupply;
      captive.securityUntil = Math.min(Number.MAX_SAFE_INTEGER, state.turn + CAPTIVITY_RULES.securityTurns); renewed++;
    }
    if (renewed) log(state, `长期看守：给 ${renewed} 名俘虏续上专门护卫，支出 ${renewed * CAPTIVITY_RULES.securityGold} 金币、${renewed * CAPTIVITY_RULES.securitySupply} 补给。`, 'character');
    if (unpaid) notice(state, 'jail', `国库快见底了，${unpaid} 名俘虏这回合没有续上专门护卫（长期看守会留下 ${CAPTIVITY_RULES.autoSecureGoldFloor} 金币、${CAPTIVITY_RULES.autoSecureSupplyFloor} 补给）。`);
  }
  const due = held.filter(captive => reviewTurnOf(captive) - state.turn === CAPTIVITY_RULES.reviewWarnTurns);
  if (due.length) notice(state, 'jail', `${due.map(captive => state.characters[captive.characterId].name).join('、')}的关押还剩 ${CAPTIVITY_RULES.reviewWarnTurns} 回合到期，到期会假释归国。想留下就去牢房续押，或者趁现在招降、议赎。`);
}
function freeCaptive(state, id, outcome = 'escaped', options = {}) {
  const captive = state.captives[id], home = state.factions[captive.originalFactionId]?.alive ? captive.originalFactionId : null;
  recordCaptivityExit(state, id, outcome, options);
  const growth = ensureGrowth(state, id); growth.rescued = Math.min(Number.MAX_SAFE_INTEGER, (growth.rescued || 0) + 1);
  if (outcome === 'escaped') { growth.extra ||= {}; growth.extra.escapeCount = state.captureHistory[id].escapes; }
  delete state.captives[id];
  state.characterOwners[id] = home;
  if (home === state.playerId && !state.recruitedHeroIds.includes(id)) state.recruitedHeroIds.push(id);
  if (home) seatAtHome(state, id);
  return home;
}
function joinCaptor(state, id) {
  const captive = state.captives[id], captor = captive.captorId;
  recordCaptivityExit(state, id, 'joined');
  delete state.captives[id];
  state.characterOwners[id] = captor; ensureGrowth(state, id).joined = state.turn;
  if (captor === state.playerId && !state.recruitedHeroIds.includes(id)) state.recruitedHeroIds.push(id);
  if (captor !== state.playerId) state.recruitedHeroIds = state.recruitedHeroIds.filter(who => who !== id);
  if (state.pendingEvent && !storyEventReady(state, getPendingEvent(state))) state.pendingEvent = null;
  seatAtHome(state, id);
  recordChronicle(state, `${state.characters[id].name}归顺了${state.factions[captor].name}。`, 'character', captor, [captor, captive.originalFactionId]);
}
/** Executes the pure contract; NPC callers spend one of their existing action slots. */
function admitCaptive(state, id, useAP = true) {
  const captive = state.captives[id], quote = captiveAccessionQuote(state, id);
  requireThat(captive && quote?.enabled, quote?.reason || '当前无法提出归附条件。');
  const captorId = captive.captorId;
  pay(state, quote.cost, captorId, useAP);
  joinCaptor(state, id);
  log(state, `${state.factions[captorId].name}支付 ${quote.cost.gold} 金币安置费，${state.characters[id].name}接受归附条件。`, 'character', [captorId, captive.originalFactionId]);
  return { characterId: id, joined: true, cost: { ...quote.cost } };
}
/** One paid/limited negotiation or admission replaces one ordinary NPC action.
 * No new persistent allowance, free parallel talks, or out-of-budget joins. */
function aiCaptivityStep(state, factionId) {
  const captives = Object.values(state.captives).filter(captive => captive.captorId === factionId
    && state.turn - captive.capturedTurn >= (captive.originalFactionId === state.playerId ? 12 : 8));
  for (const captive of captives) {
    const quote = captiveAccessionQuote(state, captive.characterId);
    if (!quote?.enabled) continue;
    admitCaptive(state, captive.characterId, false);
    if (captive.originalFactionId === state.playerId) notice(state, 'character', `${state.characters[captive.characterId].name}在长期交涉后接受了${state.factions[factionId].name}的归附条件；对方支付了 ${quote.cost.gold} 金币安置费。`);
    return true;
  }
  for (const captive of captives) {
    const quote = persuasionQuote(state, captive.characterId, 'talk', getHero(state, factionId).stats.charm);
    if (quote.reason || affordable(state, quote.cost, factionId, false)) continue;
    pay(state, quote.cost, factionId, false);
    applyPersuasion(state, captive.characterId, quote);
    return true;
  }
  if (state.factions[factionId]?.personality === 'aggressive' && state.campaign?.prison) {
    for (const captive of captives) {
      const id = captive.characterId, orig = captive.originalFactionId;
      if (!orig || orig === state.playerId || state.campaign.prison[id]) continue;
      if (!atWar(state, factionId, orig) || readRelation(state, factionId, orig).favor > -45) continue;
      if (hash(state.seed, state.turn, 0, `ai-exec:${factionId}:${id}`) >= .28) continue;
      state.campaign.prison[id] = { turn: state.turn, originalFactionId: orig, captorId: factionId };
      delete state.captives[id]; state.characterOwners[id] = null;
      for (const tile of Object.values(state.tiles)) { tile.garrison = tile.garrison.filter(who => who !== id); tile.field = tile.field.filter(who => who !== id); }
      for (const fid of feudFactionsForCharacter(state, id, orig, factionId)) {
        relationOf(state, factionId, fid).favor = -100;
        if (state.factions[fid]?.alive && !atWar(state, factionId, fid)) startWar(state, fid, factionId, `${state.factions[factionId].name}处决了${state.characters[id].name}，此仇不死不休！`, true, null, 'feud');
      }
      recordChronicle(state, `${state.factions[factionId].name}将俘虏${state.characters[id].name}关入死牢处决，双方结下不死不休之仇。`, 'capture', orig, [factionId, orig]);
      return true;
    }
  }
  return false;
}
function captureCharacter(state, id, captorId, originalFactionId, battleId) {
  const growth = ensureGrowth(state, id), detail = registerCapture(state, id, captorId, originalFactionId, battleId);
  scoreWar(state, captorId, originalFactionId, DIPLOMACY_RULES.score.captive);
  if (state.pendingEvent && !storyEventReady(state, getPendingEvent(state))) state.pendingEvent = null;
  growth.captured = detail.captures;
  if (detail.afterEscape) recordChronicle(state, `${state.characters[id].name}逃脱后再次被同一国家俘获，警戒升至 ${detail.watch} 级；警戒会随时间和照护消退。`, 'capture', originalFactionId, [captorId, originalFactionId]);
  const captor = state.factions[captorId];
  if (detail.afterEscape && captorId !== state.playerId && captor.gold >= CAPTIVITY_RULES.securityGold + 20 && captor.supply >= CAPTIVITY_RULES.securitySupply + 10) {
    pay(state, { gold: CAPTIVITY_RULES.securityGold, supply: CAPTIVITY_RULES.securitySupply }, captorId, false);
    detail.captive.securityUntil = Math.min(Number.MAX_SAFE_INTEGER, state.turn + CAPTIVITY_RULES.securityTurns);
  }
  return detail;
}
export function getBattleOptions(state, unitId) { return tacticalOptions(state.battle, unitId); }
export function getBattleThreat(state, unitId) { return tacticalThreat(state.battle, unitId); }
export function getBattleReach(state, unitId, at = null) { return tacticalAttackReach(state.battle, unitId, at); }
export function getBattleStatus(state, unitId) { return tacticalStatus(state.battle, unitId); }
function factionTiles(state, factionId) { return Object.values(state.tiles).filter(t => t.ownerId === factionId && !t.shipId && walkable(state, t)); }
/** Production has no dependency on defense or fort-network descriptions. Keep
 * one formula for both the full public tile view and repeated economy reads. */
function tileProduction(state, tile) {
  if (tile.bridgeId || tile.waterOwnerId && !tile.shipId) return { gold: 0, supply: 0, fullGold: 0, fullSupply: 0, need: 0, cut: tile.cutSince !== undefined };
  const terrain = state.terrainTypes[tile.terrainId], building = BUILDINGS[tile.building];
  const buildingLevel = building ? (tile.buildingLevel || 1) : 0;
  const fullGold = terrain.yield.gold + (tile.isCapital ? 2 : 0) + (building?.yield.gold ? building.yield.gold + 2 * (buildingLevel - 1) : 0);
  const fullSupply = terrain.yield.supply + (tile.isCapital ? 1 : 0) + (building?.yield.supply ? building.yield.supply + 2 * (buildingLevel - 1) : 0);
  const need = handsNeeded(tile), share = tile.ownerId ? Math.min(1, tile.troops / need) : 1, cut = tile.cutSince !== undefined;
  return { gold: cut ? 0 : Math.round(fullGold * share * productionFactor(state, tile, 'gold')), supply: cut ? 0 : Math.round(fullSupply * share * productionFactor(state, tile, 'supply')), fullGold, fullSupply, need, cut };
}
export function getTileStats(state, key) {
  return tileStats(state, state.tiles[key]);
}
/** 补给上限 for the screen: the limit and where it comes from, how much room is left, and who goes home tonight.
 * `arriving` counts girls about to march in, so an army is quoted the room its own baggage brings. */
export function getSupply(state, key, { arriving = 0 } = {}) {
  const tile = state.tiles[key];
  if (!tile) return null;
  const led = new Set(girlsOn(tile)).size + Math.max(0, arriving), limit = supplyLimit(state, tile, led), over = Math.max(0, tile.troops - limit);
  return { key, limit, parts: supplyParts(state, tile, led), people: tile.troops, room: Math.max(0, limit - tile.troops), over, leaving: over ? Math.ceil(over / SUPPLY_RULES.drift) : 0 };
}
function tileStats(state, tile) {
  if (!tile) return null;
  const terrain = state.terrainTypes[tile.terrainId], building = BUILDINGS[tile.building];
  const buildingLevel = building ? (tile.buildingLevel || 1) : 0;
  const fort = fortStatus(state, tile), support = fortCover(state, tile);
  const buildingDefense = building ? (fort?.mothballed ? 1 : building.defense + (building.defense ? buildingLevel - 1 : 0) + (tile.building === 'fort' && tile.ownerId ? Math.round(techEffect(state, 'fortDefense', tile.ownerId)) : 0)) : 0;
  const supportDefense = tile.building === 'fort' ? 0 : support.defense;
  const { gold, supply, fullGold, fullSupply, need, cut } = tileProduction(state, tile);
  // total: everything this tile sends to the treasury — the number the map and the tile card show.
  const extra = tile.ownerId ? tileExtras(state, tile) : { gold: 0, supply: 0 }, duty = tileDuty(state, tile);
  const total = { gold: gold + extra.gold + (duty?.gold || 0), supply: supply + extra.supply + (duty?.supply || 0) };
  return { gold, supply, total, extra, duty, fullGold, fullSupply, need, people: tile.troops, housing: housingOf(state, tile), food: tile.food || 0, foodGain: tile.ownerId && !cut ? growthGain(state, tile, supply) : 0, foodTarget: growthTarget(tile.troops), march: marchCost(state, tile), cut, cutLeft: cut ? Math.max(1, tile.cutSince + CUT_GRACE - state.turn) : 0,
    control: controlAt(state, tile), city: state.campaign?.cities?.[tile.key] || null, defense: terrain.defense + buildingDefense + supportDefense, terrainDefense: terrain.defense, buildingDefense, supportDefense, protectedBy: support.protectedBy, fort, buildingLevel, buildingName: building?.name || '' };
}
export function getIncome(state, factionId, tiles, includeTribute = true) {
  const income = { gold: getHero(state, factionId).stats.economy + campaignBudget(state, factionId).starter, supply: 0 };
  for (const [id, growth] of Object.entries(state.growth || {})) {
    if (!canServe(state, id, factionId)) continue;
    income.gold += ecoOf(state, id, 'gold') + (bondTier(growth.bond) >= 4 ? 2 : 0);
    income.supply += ecoOf(state, id, 'supply');
  }
  if (factionId === state.playerId) {
    if (state.posts?.finance && canServe(state, state.posts.finance, factionId)) income.gold += heroView(state, state.posts.finance).stats.economy + (quirkIs(state, state.posts.finance, 'q_ledger') ? 2 : 0);
    if (state.posts?.logistics && canServe(state, state.posts.logistics, factionId)) income.supply += heroView(state, state.posts.logistics).stats.economy + (quirkIs(state, state.posts.logistics, 'q_ledger') ? 2 : 0);
  }
  for (const tile of tiles === undefined ? factionTiles(state, factionId) : tiles) {
    const values = tileIncome(state, tile);
    income.gold += values.gold; income.supply += values.supply;
  }
  for (const [key, relation] of Object.entries(state.relations || {})) if (relation.trade && key.split('|').includes(factionId)) income.gold += tradeIncome(state,factionId,key) + (hasEdict(state, 'trade', factionId) ? 1 : 0);
  income.gold += seigniorageOf(state, factionId);
  if (factionId === state.playerId) for (const vassal of vassalsOf(state)) { const tribute = tributeResources(state, vassal); income.gold += tribute.gold; income.supply += tribute.supply; }
  if (includeTribute && isVassal(state, factionId)) { income.gold -= Math.floor(Math.max(0, income.gold) * CIVIC_RULES.tribute); income.supply -= Math.floor(Math.max(0, income.supply) * CIVIC_RULES.tribute); }
  return income;
}
/** What a working site adds beyond its own production: a specialist stationed in it and national edicts. */
function tileExtras(state, tile) {
  if (!tile?.ownerId || tile.cutSince !== undefined) return { gold: 0, supply: 0 };
  const canalGold = state.campaign?.canals?.[tile.key]?.status === 'open' ? CANAL_RULES.tollGold : 0;
  if (!tile.building) return { gold: canalGold, supply: 0 };
  return { gold: canalGold + (GOLD_SITES.includes(tile.building) ? (seatQuirk(state, tile, 'q_shop') ? 3 : 0) + (tile.building !== 'port' && hasEdict(state, 'trade', tile.ownerId) ? 1 : 0) : 0),
    supply: FOOD_SITES.includes(tile.building) ? (seatQuirk(state, tile, 'q_farm') ? 3 : 0) + (hasEdict(state, 'farm', tile.ownerId) ? 1 : 0) : 0 };
}
/** Everything one tile sends to the treasury. The single authority for national income and the
 * incremental fiscal ledger, so a sale or withdrawal accounts for the extras it removes. */
function tileIncome(state, tile) {
  const production = tileProduction(state, tile), extra = tileExtras(state, tile), duty = tileDuty(state, tile);
  return { gold: production.gold + extra.gold + (duty?.gold || 0), supply: production.supply + extra.supply + (duty?.supply || 0) };
}
export function getTileExtras(state, key) { return tileExtras(state, state.tiles[key]); }
/** What signature traits and edicts add on top of plain tile yields, itemised for the treasury page. */
export function getIncomeExtras(state, factionId = state.playerId) {
  const rows = [], add = (label, gold, supply) => { if (gold || supply) rows.push({ label, gold, supply }); };
  let traitGold = 0, traitSupply = 0, bondGold = 0;
  for (const [id, growth] of Object.entries(state.growth || {})) {
    if (!canServe(state, id, factionId)) continue;
    traitGold += ecoOf(state, id, 'gold'); traitSupply += ecoOf(state, id, 'supply'); bondGold += bondTier(growth.bond) >= 4 ? 2 : 0;
  }
  add(C.openingGrantName,campaignBudget(state,factionId).starter,0);
  add('同伴的词条与天赋', traitGold, traitSupply); add('托付的信赖', bondGold, 0);
  let seatGold = 0, seatSupply = 0, edictGold = 0, edictSupply = 0, canalGold = 0;
  const farmEdict = hasEdict(state, 'farm', factionId), tradeEdict = hasEdict(state, 'trade', factionId);
  for (const tile of factionTiles(state, factionId)) {
    const extra = tileExtras(state, tile);
    if (!extra.gold && !extra.supply) continue;
    const toll = state.campaign?.canals?.[tile.key]?.status === 'open' ? CANAL_RULES.tollGold : 0;
    const gold = tradeEdict && tile.building && GOLD_SITES.includes(tile.building) && tile.building !== 'port' ? 1 : 0, supply = farmEdict && tile.building && FOOD_SITES.includes(tile.building) ? 1 : 0;
    canalGold += toll; edictGold += gold; edictSupply += supply; seatGold += extra.gold - gold - toll; seatSupply += extra.supply - supply;
  }
  const trades = Object.entries(state.relations || {}).filter(([key, relation]) => relation.trade && key.split('|').includes(factionId)).length;
  add('驻扎的行商与农学', seatGold, seatSupply); add(C.canalTollName, canalGold, 0); add('国策', edictGold + (tradeEdict ? trades : 0), edictSupply); add('通商协定',Object.entries(state.relations).filter(([key,rel])=>rel.trade&&key.split('|').includes(factionId)).reduce((sum,[key])=>sum+tradeIncome(state,factionId,key),0),0);
  let dutyGold = 0, dutySupply = 0;
  if (factionId === state.playerId) for (const tile of factionTiles(state, factionId)) { const duty = tileDuty(state, tile); dutyGold += duty?.gold || 0; dutySupply += duty?.supply || 0; }
  add('差事', dutyGold, dutySupply);
  add(C.seigniorageName, seigniorageOf(state, factionId), 0);
  if(factionId===state.playerId){const tribute=vassalsOf(state).map(v=>tributeResources(state,v));add(C.vassal,tribute.reduce((sum,v)=>sum+v.gold,0),tribute.reduce((sum,v)=>sum+v.supply,0));}
  return rows;
}
/** Administration softens developed empires without capping treasury; poor new land can be costly. */
function realmScale(state, factionId) {
  return 1 + Math.max(0, factionTiles(state, factionId).length - 12) / 24;
}
function administrationFromTotals(tileCount, levels, rawGold) {
  const baseGold = Math.max(0, Math.floor(tileCount / 5) + Math.floor(levels / 5) - 1);
  const efficiency = 1 / Math.sqrt(1 + Math.max(0, tileCount - 12) / 24);
  const gold = Math.floor(Math.max(0, rawGold - baseGold) * (1 - efficiency));
  return { efficiency, gold, baseGold, rawGold };
}
function getAdministration(state, factionId, tiles = factionTiles(state, factionId), rawGold) {
  const levels = tiles.reduce((sum, tile) => sum + (tile.building ? tile.buildingLevel || 1 : 0), 0);
  return administrationFromTotals(tiles.length, levels, rawGold === undefined ? getIncome(state, factionId).gold : rawGold);
}
function constructionCost(state, tile, buildingId, factionId = state.playerId) {
  const building = BUILDINGS[buildingId], scale = Math.sqrt(realmScale(state, factionId));
  const base = Math.max(4, building.gold - Math.min(4, Math.floor(getHero(state, factionId).stats.economy / 2)));
  const cost = { ap: 2, gold: building.gold === 0 ? 0 : Math.ceil(base * scale * constructionFactor(state, tile, factionId)), supply: building.supply };
  return siteDiscount(state, tile, buildingId, factionId, buildingId === 'fort' ? fortConstructionCost(state, factionId, cost) : cost);
}
function improvementCost(state, tile, factionId = state.playerId) {
  const level = tile.buildingLevel || 1;
  return siteDiscount(state, tile, tile.building, factionId, { ap: 2, gold: Math.ceil((6 + level * 5 + (tile.building === 'fort' ? 8 : 0)) * Math.sqrt(realmScale(state, factionId)) * constructionFactor(state, tile, factionId)), supply: level + (tile.building === 'fort' ? 2 : 0) });
}
/** 监工 stationed on the site and the 筑城 edict each take three tenths off the gold; they do not stack past half. */
function siteDiscount(state, tile, buildingId, factionId, cost) {
  const cuts = (tile.ownerId === factionId && seatQuirk(state, tile, 'q_build') ? 1 : 0) + (buildingId === 'fort' && hasEdict(state, 'wall', factionId) ? 1 : 0);
  return cuts && cost.gold ? { ...cost, gold: Math.max(1, Math.ceil(cost.gold * (cuts > 1 ? .5 : .7))) } : cost;
}
const sitePriceKey=(state,tile,id)=>`${constructionFactor(state,tile,id)}:${Number(tile.ownerId===id&&seatQuirk(state,tile,'q_build'))}`;
/** Read-only explanation of the existing quote. Charging remains exclusively in the original actions. */
export function getExpenseBreakdown(state, input = {}, quotedCost) {
  const action = input.action || input, id = state.playerId, tile = state.tiles[action.key || action.fromKey];
  const rows = [], children = [], notes = [];
  let cost = quotedCost || input.cost || {}, formula = '';
  const row = (label, value, op = '') => rows.push({ label: F[label] || label, value, op });
  const land = () => factionTiles(state, id).length;
  const construction = () => {
    row('control', 1 + (1 - controlAt(state, tile, id).value) * 1.5, '×');
    row('prices', Math.max(1, (state.campaign?.economies?.[id]?.prices || 100) / 100), '×');
    row('tech', techEffect(state, 'buildCost', id), '×');
  };
  const type = action.type;
  if ((type === 'build' && BUILDINGS[action.building] || type === 'upgrade' && tile?.building) && tile) {
    const upgrade = type === 'upgrade', building = BUILDINGS[upgrade ? tile.building : action.building], level = tile.buildingLevel || 1;
    const heroCut = Math.min(4, Math.floor(getHero(state, id).stats.economy / 2));
    const base = upgrade ? 6 + level * 5 + (tile.building === 'fort' ? 8 : 0) : building.gold === 0 ? 0 : Math.max(4, building.gold - heroCut);
    const scale = Math.sqrt(realmScale(state, id)), factor = constructionFactor(state, tile, id);
    row('base', upgrade ? base : `${building.gold} → ${base}`);
    if (upgrade) row('level', level); else if (building.gold) row('hero', heroCut, '−');
    row('land_count', land()); row('realm', scale, '×'); construction();
    const fortExtra = !upgrade && building.id === 'fort' ? fortConstructionCost(state, id, { gold: 0, supply: 0 }).gold : 0;
    const cuts = Number(tile.ownerId === id && seatQuirk(state, tile, 'q_build')) + Number(building.id === 'fort' && hasEdict(state, 'wall', id));
    const discount = cuts > 1 ? .5 : cuts ? .7 : 1;
    if (fortExtra) row('fort_extra', fortExtra, '+');
    if (cuts) row('site', discount, '×');
    cost = upgrade ? improvementCost(state, tile) : constructionCost(state, tile, building.id);
    formula = `${cuts ? '⌈(' : ''}⌈${base} × ${scale} × ${factor}⌉${fortExtra ? ` + ${fortExtra}` : ''}${cuts ? `) × ${discount}⌉` : ''}`;
    if (!base) formula = '0';
  } else if (type === 'buildBridge') {
    const q = getBridgeQuote(state, action.fromKey, action.toKey);
    cost = q.cost; row('base', BRIDGE_RULES.baseGold); row('quantity', q.length);
    row('bridge_length', q.pricing.lengthMultiplier, '×'); construction();
    formula = `⌈${BRIDGE_RULES.baseGold} × ${BRIDGE_RULES.growth}^(${q.length} − 1) × ${q.pricing.constructionFactor}⌉`;
    notes.push(F.bridge_rule);
  } else if (type === 'claim') {
    cost = claimCost(state, id); row('base', 4); row('land_count', land());
    const pioneer = leadQuirk(state, 'q_pioneer');
    if (pioneer) row('pioneer', .5, '×');
    formula = `${pioneer ? '⌈(' : ''}4 + ⌊${land()} ÷ 4⌋${pioneer ? ') × 0.5⌉' : ''}`;
  } else if (type === 'gacha') {
    const q = getRecruitQuote(state, action.count ?? 1), count = q.count, drawn = state.gachaCount, base = count === 10 ? GACHA.tenCost.gold / 10 : GACHA.cost.gold;
    cost = q.cost; row('base', base); row('quantity', count); row('land_count', land()); row('realm', q.empireScale, '×');
    const multipliers = Array.from({ length: count }, (_, i) => 1 + Math.floor((drawn + i) / 100) * .1);
    row('draws', [...new Set(multipliers)].join(' → '), '×');
    formula = multipliers.map(m => `⌈${base} × ${q.empireScale} × ${m}⌉`).join(' + ');
    notes.push(F.recruit_each);
  } else if (type === 'buySupply') {
    const q = getSupplyQuote(state, action.amount ?? 20), scale = Math.pow(realmScale(state, id), .25), exchange = state.campaign?.economies?.[id]?.exchange || 100;
    cost = q.cost; row('base', 4); row('land_count', land()); row('realm', scale, '×');
    row('exchange', Math.max(.8, 100 / exchange), '×'); row('unit', q.unitGold); row('quantity', q.amount);
    formula = `⌈4 × ${scale} × ${Math.max(.8, 100 / exchange)}⌉ × ${q.amount}`;
  } else if (type === 'research') {
    const q = researchQuote(state, action.techId);
    cost = q.cost; row('base', techById(action.techId)?.gold || 0);
    row('prices', Math.max(1, (state.campaign?.economies?.[id]?.prices || 100) / 100), '×');
    row('tech', techEffect(state, 'researchCost', id), '×');
  } else if ((type === 'foundCity' || type === 'buildCanal') && tile) {
    const q = type === 'foundCity' ? cityQuote(state, tile.key, action.mayorId) : canalQuote(state, tile.key);
    cost = q.cost; row('base', type === 'foundCity' ? CIVIC_RULES.cityGold : CANAL_RULES.gold); construction();
  } else if (type === 'moveCapital') {
    cost = getMoveCapitalQuote(state, action.key).cost;
    row('base', 180); row('land_count', land()); row('unit', 5);
    formula = `180 + ${land()} × 5`;
  } else if (type === 'annexVassal') {
    const q = getAnnexQuote(state, action.factionId);
    cost = q.cost; row('base', 40); row('land_count', q.tiles); row('unit', 10);
    formula = `40 + ${q.tiles} × 10`;
    notes.push(feedbackText('integration_note', { gold: q.upkeep }));
  } else if (type === 'buildShip' || type === 'buyAircraft') {
    const q = type === 'buildShip' ? shipQuote(state, action.key, action.modelId, action.launchKey) : aircraftQuote(state, action.key, action.modelId, action.count ?? 1);
    cost = q.cost; row('base', q.model?.gold || 0); row('quantity', q.count || 1);
    row('prices', Math.max(1, (state.campaign?.economies?.[id]?.prices || 100) / 100), '×');
    row('tech', techEffect(state, 'vehicleCost', id), '×');
  } else if (type === 'roadRoute' || type === 'road') {
    const q = type === 'roadRoute' ? roadRouteQuote(state, action.fromKey, action.toKey) : { keys: tile ? [tile.key] : [], cost: tile ? roadTileCost(state, tile) : cost };
    cost = q.cost;
    for (const key of q.keys || []) {
      const site = state.tiles[key], price = roadTileCost(state, site), base = 6 + Math.max(0, state.terrainTypes[site.terrainId]?.defense || 0) * 2;
      children.push({ label: key, cost: price, rows: [
        { label: F.road_terrain, value: base }, { label: F.control, value: 1 + (1 - controlAt(state, site).value) * 1.5, op: '×' },
        { label: F.prices, value: Math.max(1, (state.campaign?.economies?.[id]?.prices || 100) / 100), op: '×' },
        { label: F.tech, value: techEffect(state, 'buildCost', id) * techEffect(state, 'roadCost', id), op: '×' }
      ] });
    }
    row('quantity', children.length);
  } else if (type === 'trainArmy') {
    const q = getArmyTrainingQuote(state), scale = Math.sqrt(1 + Math.max(0, land() - 12) / 16), war = hasEdict(state, 'war') ? .7 : 1;
    cost = q.cost; row('training_level', q.nextLevel); row('base', 18 + q.nextLevel * 5); row('land_count', land()); row('realm', scale, '×'); row(EDICTS.find(e => e.id === 'war').name, war, '×');
  } else if (type === 'train' && state.growth[action.characterId]) {
    const growth = state.growth[action.characterId], count = Object.values(growth.trained).reduce((a, b) => a + b, 0);
    cost = trainCostOf(state, growth); row('training_count', count); row('base', trainCost(growth).gold);
    row(EDICTS.find(e => e.id === 'school').name, hasEdict(state, 'school') ? .7 : 1, '×');
  } else if (type === 'recruit') {
    cost = recruitCost(state); row('base', 5); row('tech', techEffect(state, 'recruitCost', id), '×');
  } else if (type === 'militaryMode') {
    const q = getMilitaryQuote(state, action.key, action.reserve); cost = q.cost;
    row('regular', action.reserve ? 0 : q.before.nominal.regularGold);
    row('rare', action.reserve ? 0 : q.before.nominal.rareGold); row('quantity', action.reserve ? 0 : MILITARY_RULES.mobilizationTurns);
  } else if (type === 'currencyPolicy') {
    const view = economyView(state), q = action.kind === 'rate' ? view.rate : view.policies.find(p => p.kind === action.kind);
    if (q) cost = q.cost;
    row('policy_amount', q?.amount || 0); notes.push(F.policy_help);
  } else {
    row('current_quote', cost.gold || 0);
  }
  return { cost, rows, children, formula, notes };
}

/** The ledger uses exactly the production and maintenance authorities used at settlement. */
export function getFinanceBreakdown(state) {
  const id = state.playerId, tiles = factionTiles(state, id), stats = getStats(state), gross = getIncome(state, id, tiles);
  const sources = [], add = (label, gold, supply = 0, detail) => { if (gold || supply) sources.push({ label, gold, supply, ...(detail ? { detail } : {}) }); };
  add(F.income_hero, getHero(state, id).stats.economy);
  let postsGold = 0, postsSupply = 0;
  if (state.posts?.finance && canServe(state, state.posts.finance, id)) postsGold = heroView(state, state.posts.finance).stats.economy + (quirkIs(state, state.posts.finance, 'q_ledger') ? 2 : 0);
  if (state.posts?.logistics && canServe(state, state.posts.logistics, id)) postsSupply = heroView(state, state.posts.logistics).stats.economy + (quirkIs(state, state.posts.logistics, 'q_ledger') ? 2 : 0);
  add(F.income_posts, postsGold, postsSupply);
  const groups = new Map();
  for (const tile of tiles) {
    const label = BUILDINGS[tile.building]?.name || state.terrainTypes[tile.terrainId]?.name || tile.key;
    if (!groups.has(label)) groups.set(label, { label, gold: 0, supply: 0, count: 0 });
    const row = groups.get(label), production = tileProduction(state, tile);
    row.gold += production.gold; row.supply += production.supply; row.count++;
  }
  const production = [...groups.values()];
  add(F.income_tiles, production.reduce((s, r) => s + r.gold, 0), production.reduce((s, r) => s + r.supply, 0), production);
  for (const extra of getIncomeExtras(state)) add(extra.label, extra.gold, extra.supply);
  const upkeep = stats.maintenance, civic = upkeep.civic, military = upkeep.military;
  const money = state.campaign?.economies?.[id], vehicles = civic.vehicles;
  const boats = Object.values(state.campaign?.ships || {}).filter(s => s.ownerId === id), planes = Object.values(state.campaign?.planes || {}).filter(s => s.ownerId === id);
  const advanced = new Map();
  for (const tile of tiles) if (ADVANCED_BUILDINGS[tile.building]?.upkeep) {
    const row = advanced.get(tile.building) || { label: BUILDINGS[tile.building]?.name || tile.building, count: 0, base: ADVANCED_BUILDINGS[tile.building].upkeep };
    row.count++; advanced.set(tile.building, row);
  }
  return { gross, net: stats.income, sources, upkeep, administration: { ...stats.administration, land: tiles.length, levels: tiles.reduce((sum, t) => sum + (t.building ? t.buildingLevel || 1 : 0), 0) },
    military, forts: { network: stats.fortNetwork, cost: upkeep.forts, sites: tiles.filter(t => t.building === 'fort' && !t.fortMothballed).map(t => ({ key: t.key, level: t.buildingLevel || 1, ...fortStatus(state, t).upkeep })), discount: hasEdict(state, 'wall', id) ? .5 : 1, discountName: EDICTS.find(e => e.id === 'wall').name },
    food: { troops: tiles.reduce((s, t) => s + t.troops, 0), land: tiles.length, cost: upkeep.supply - upkeep.forts.supply - (vehicles.supply || 0) },
    conditional: Object.keys(state.campaign?.integrations || {}).map(factionId => {
      const q = annexConditions(state, factionId);
      return { label: `${C.integration} · ${state.factions[factionId]?.name || factionId}`, cost: { ap: 1, gold: q.upkeep, supply: 0 }, enabled: q.enabled, reason: q.reason };
    }),
    civic: { ...civic, advancedSites: [...advanced.values()], upkeepFactor: techEffect(state, 'upkeepCost', id), cityCount: citiesOf(state).length, cityUnit: CIVIC_RULES.cityUpkeep,
      debt: money?.debt || 0, credit: money?.credit ?? 80, interestRate: .015 + (100 - (money?.credit ?? 80)) * .0008, interestFactor: techEffect(state, 'interestCost', id),
      ships: boats.length, planes: planes.length, shipTroops: boats.reduce((s, b) => s + (state.tiles[b.key]?.troops || 0), 0) } };
}
/** Local upgrade effects share production/housing authorities with settlement and
 * the tile view. Only a shallow next-level tile is needed; no world copy, action,
 * history change or national-income calculation belongs in a map quote. */
function ordinaryUpgradePreview(state, tile) {
  const building = BUILDINGS[tile?.building], level = tile?.buildingLevel || 1;
  if (!tile?.discovered || tile.ownerId !== state.playerId || !building || building.id === 'fort' || level >= (building.maxLevel || 5)) return null;
  const snapshot = current => ({ level: current.buildingLevel || 1, residents: current.troops,
    housing: housingOf(state, current), production: tileProduction(state, current) });
  const before = snapshot(tile), after = snapshot({ ...tile, buildingLevel: level + 1 });
  return { kind: 'building-upgrade', building: { id: building.id, name: building.name }, before, after,
    productionFalls: after.production.gold < before.production.gold || after.production.supply < before.production.supply,
    nextFullProductionShortage: Math.max(0, after.production.need - after.residents) };
}
/** Lightweight upgrade quote for map badges; skips movement, rally and national
 * budgets. Ordinary effects cost two local production reads; fort detail remains
 * selected-only in getActions. Hidden land never exposes its building or yield. */
export function getUpgradeQuote(state, key) {
  const tile = state.tiles[key], level = tile?.buildingLevel || 1, building = tile?.discovered ? BUILDINGS[tile.building] : null;
  const cost = building ? improvementCost(state, tile) : { ap: 2, gold: 0, supply: 0 };
  const reason = state.battle || state.turnContinuation ? '请先完成当前战场与战争阶段。'
    : tile?.ownerId !== state.playerId ? '请选择自己的领土。' : !tile.discovered ? '请先探索此地。' : !building ? '请先建造建筑。'
    : level >= (building.maxLevel || 5) ? '建筑已达等级上限。' : tile.cutSince !== undefined ? '和首都失联'
    : tile.troops < handsNeeded(tile) ? `要 ${handsNeeded(tile)} 人` : affordable(state, cost);
  const effects = ordinaryUpgradePreview(state, tile);
  return { key, level: building ? level : 0, nextLevel: building ? Math.min(building.maxLevel || 5, level + 1) : 0,
    label: building ? `升级${building.name} · ${level}→${Math.min(building.maxLevel || 5, level + 1)}` : '升级建筑',
    enabled: !reason, reason, cost, action: { type: 'upgrade', key }, ...(effects ? { effects } : {}) };
}
export function boardQuote(state,shipId,shoreKey,ids=[],troops=0,unload=false){
  const quote=independentBoardQuote(state,shipId,shoreKey,ids,troops,unload);
  if(quote.enabled&&unload&&troops>supplyRoom(state,state.tiles[shoreKey],ids.length))return {...quote,enabled:false,reason:say('shoreCapacity',{room:supplyRoom(state,state.tiles[shoreKey],ids.length)})};
  return quote;
}
/** Shared execution/UI/AI quote. Prices depend on realm size and past draws, never saved gold. */
export function getRecruitQuote(state, count = 1, factionId = state.playerId) {
  requireThat(count === 1 || count === 10, '招募数量只能是 1 或 10。');
  requireThat(own(state.factions, factionId), '招募国家不存在。');
  const drawn = factionId === state.playerId ? state.gachaCount : state.factions[factionId].gachaCount || 0;
  const empireScale = Math.pow(realmScale(state, factionId), .25), drawScale = 1 + Math.floor(drawn / 100) * .1;
  const base = count === 10 ? GACHA.tenCost.gold / 10 : GACHA.cost.gold;
  let gold = 0;
  for (let index = 0; index < count; index++) gold += Math.ceil(base * empireScale * (1 + Math.floor((drawn + index) / 100) * .1) - 1e-9);
  return { count, cost: { ap: 2, gold, supply: 0 }, empireScale, drawScale };
}
/** Food imports are a scalable upkeep sink and a zero-AP escape for a solvent, hungry realm. */
export function getSupplyQuote(state, amount = 20, factionId = state.playerId) {
  requireThat(integer(amount, 1, 1000), '采购补给数量必须为 1 到 1000 的整数。');
  requireThat(own(state.factions, factionId), '采购国家不存在。');
  const unitGold = Math.ceil(4 * Math.pow(realmScale(state, factionId), .25) * Math.max(.8,100/(state.campaign?.economies?.[factionId]?.exchange||100)) - 1e-9);
  return { amount, unitGold, cost: { ap: 0, gold: amount * unitGold, supply: 0 } };
}
/** What the fort network really costs each turn: 筑城 halves the bill. */
function fortUpkeep(state, factionId) {
  const network = fortNetwork(state, factionId).upkeep;
  return hasEdict(state, 'wall', factionId) ? { gold: Math.ceil(network.gold / 2), supply: Math.ceil(network.supply / 2) } : network;
}
function maintenance(state, factionId, detailed = false, economy) {
  const tiles = economy === undefined ? factionTiles(state, factionId) : economy.tiles;
  const troops = tiles.reduce((sum, tile) => sum + tile.troops, 0);
  const levels = tiles.reduce((sum, tile) => sum + (tile.building ? tile.buildingLevel || 1 : 0), 0);
  const administration = economy === undefined ? getAdministration(state, factionId, tiles) : economy.administration;
  const forts = fortUpkeep(state, factionId);
  const military = militaryBudget(state, factionId, detailed);
  const civic = campaignBudget(state, factionId);
  return { civic, gold: administration.baseGold + administration.gold + forts.gold + military.gold + civic.upkeep, supply: Math.max(0, Math.floor(troops / 4) + Math.floor(tiles.length / 6) - 1) + forts.supply + (civic.vehicles?.supply || 0), forts, military };
}

/** A local reversible commitment, quoted from the same budget used at settlement. */
export function getMilitaryQuote(state, key, reserve, factionId = state.playerId) {
  const tile = state.tiles[key], before = militaryStatus(state, tile), budgetBefore = militaryBudget(state, factionId, false);
  const valid = typeof reserve === 'boolean', activating = valid && !reserve;
  const cost = { ap: activating ? 1 : 0, gold: activating ? (before?.nominal.gold || 0) * MILITARY_RULES.mobilizationTurns : 0, supply: 0 };
  const after = tile && valid ? militaryStatus(state, { ...tile, militaryReserve: reserve, militaryReadyTurn: activating ? state.turn + MILITARY_RULES.preparationTurns : 0 }) : null;
  const budgetAfter = tile?.ownerId === factionId && valid ? replaceMilitaryBudgetSite(budgetBefore, before, after) : budgetBefore;
  const reason = state.battle || (state.turnContinuation && factionId === state.playerId) ? '请先完成当前战场与战争阶段。'
    : tile?.ownerId !== factionId || !tile.shipId && !walkable(state, tile) ? '请选择本国驻地。' : !valid ? '请选择执勤或后备。'
    : reserve === before.reserve ? '驻地编制没有变化。'
    : reserve && tile.foughtTurn === state.turn ? '本回合已经作战，需先结算军费；下回合可免费转后备。'
    : activating && tile.cutSince !== undefined ? '失联驻地无法整备。' : affordable(state, cost, factionId, factionId === state.playerId);
  return { key, reserve, before, after, budgetBefore, budgetAfter, cost, enabled: !reason, reason,
    rules: MILITARY_RULES, upkeepDelta: budgetAfter.gold - budgetBefore.gold,
    label: reserve ? '转为后备 · 停止军费' : '整备执勤 · 下回合生效',
    description: '后备不减居民生产，保留角色、等级与稀有库存；英雄照常行动，但其随军稀有队不出战。整备费为本地两回名义军费，不抵扣后续维护；整备期间仍收军费。每地最多六队稀有编制，优先 SSR，其余库存免军费。',
    action: { type: 'militaryMode', key, reserve, expectedRevision: state.revision } };
}
function setMilitaryMode(state, key, reserve, factionId = state.playerId) {
  const quote = getMilitaryQuote(state, key, reserve, factionId);
  requireThat(quote.enabled, quote.reason); pay(state, quote.cost, factionId, factionId === state.playerId);
  const tile = state.tiles[key]; tile.militaryReserve = reserve; tile.militaryReadyTurn = reserve ? 0 : quote.after.readyTurn;
  log(state, `${state.factions[factionId].name}的 ${key} ${reserve ? '转为后备：普通军队按 Lv 1、稀有队停止出战' : `支付 ${quote.cost.gold} 金币整备，第 ${quote.after.readyTurn} 回合执勤`}；居民生产与英雄保留，全军维护 ${quote.budgetBefore.gold} → ${quote.budgetAfter.gold} 金币/回合。`, 'army');
  return quote;
}
/** Rear sites first, using only discovered neighboring threats for the player.
 * Capital and real field formations survive longest. No units are deleted. */
function militaryPriority(state, tile, factionId) {
  const threats = neighbors(tile).filter(point => { const near = state.tiles[point.key]; return near?.ownerId && near.ownerId !== factionId && (factionId !== state.playerId || near.discovered) && atWar(state, factionId, near.ownerId); }).length;
  return (tile.isCapital ? 100000 : 0) + threats * 10000 + girlsOn(tile).length * 1000 + tile.troops;
}
function settleMilitaryBudget(state, factionId) {
  const faction = state.factions[factionId], gross = getIncome(state, factionId), changed = [];
  const upkeep = maintenance(state, factionId), fixedGold = upkeep.gold - upkeep.military.gold;
  let budget = upkeep.military;
  const candidates = factionTiles(state, factionId).filter(tile => !tile.militaryReserve && militaryStatus(state, tile).nominal.gold > 0)
    .sort((a, b) => militaryPriority(state, a, factionId) - militaryPriority(state, b, factionId) || a.key.localeCompare(b.key));
  for (const tile of candidates) {
    if (faction.gold + gross.gold >= fixedGold + budget.gold) break;
    const before = militaryStatus(state, tile);
    tile.militaryReserve = true; tile.militaryReadyTurn = 0;
    budget = replaceMilitaryBudgetSite(budget, before, militaryStatus(state, tile)); changed.push(tile.key);
  }
  if (changed.length) {
    const names = changed.slice(0, 24).join('、') + (changed.length > 24 ? `等 ${changed.length} 处驻地` : '');
    const text = `${faction.name}军费预算不足，${names} 转为后备：普通军队按 Lv 1、稀有队暂不出战，防守减弱；居民、英雄、已学训练与稀有库存保留，可逐地重新整备。`;
    log(state, text, 'economy'); if (factionId === state.playerId) notice(state, 'land', text, { key: changed[0], militarySites: [...changed] });
  }
  return changed;
}
export function militaryMoveReason(state, fromKey, toKey, troops) {
  const from = state.tiles[fromKey], to = state.tiles[toKey];
  if (!(troops > 0) || !from || !to || from.ownerId !== to.ownerId) return '';
  return !militaryStatus(state, from).ready && !militaryStatus(state, to).reserve
    ? '后备或整备中的兵员不能直接并入执勤驻地；请先整备出发地，或先将目的地转为后备。' : '';
}
/** Safe batch convenience: exactly the same free stand-down, with its complete
 * effect list quoted first. A small late empire must not require 70 clicks. */
export function getMilitaryStandDownPlan(state) {
  const owned = factionTiles(state, state.playerId), guards = new Map(getArmyProtectionSites(state).map(site => [site.key, site]));
  const before = militaryBudget(state, state.playerId, false), affected = [], protectedSites = [];
  let after = before;
  for (const tile of owned) {
    const site = militaryStatus(state, tile); if (site.reserve || !site.nominal.gold) continue;
    const guard = guards.get(tile.key), visibleWar = neighbors(tile).some(point => { const near = state.tiles[point.key]; return near?.discovered && near.ownerId && near.ownerId !== state.playerId && atWar(state, state.playerId, near.ownerId); });
    // Reuse the existing recovery/rally definition of capital, main army,
    // heroes, forts and committed movement. Only hide unknown enemy borders.
    const protectionCodes = (guard?.protectionCodes || []).filter(code => code !== 'warBorder' || visibleWar);
    const reasons = protectionCodes.map(code => guard.protectionReasons[guard.protectionCodes.indexOf(code)]);
    // Service-only guard: preserve the capped rare commitment, including paid
    // preparation. Individual stand-down and fiscal stop-loss remain available.
    if (RARE_RANKS.reduce((sum, rank) => sum + site.prepared[rank], 0) === MAX_SQUADS) {
      protectionCodes.push('fullRare');
      reasons.push(`满编稀有队（${MAX_SQUADS} 队${site.ready ? '' : '，整备中'}）`);
    }
    if (reasons.length) { protectedSites.push({ key: tile.key, protectionCodes, reasons }); continue; }
    const next = militaryStatus(state, { ...tile, militaryReserve: true, militaryReadyTurn: 0 });
    affected.push({ key: tile.key, before: site, after: next });
    after = replaceMilitaryBudgetSite(after, site, next);
  }
  const reason = state.battle || state.turnContinuation ? '请先完成当前战场与战争阶段。' : !affected.length ? '当前没有可安全转为后备的后方驻地；仍可逐地查看。' : '';
  return { enabled: !reason, reason, affected, protectedSites, budgetBefore: before, budgetAfter: after, saving: before.gold - after.gold,
    cost: { ap: 0, gold: 0, supply: 0 }, action: { type: 'standDownRear', expectedRevision: state.revision },
    description: '仅把列出的后方驻地转为后备；普通军队按 Lv 1、稀有队停止出战，生产与英雄不变。保护首都、英雄驻地、主力军、满编稀有队（含整备中）、执勤要塞、可见交战边防和本回合已行动驻地；未发现的敌情不作为保证。' };
}
/** No unpaid fort network: unstaffed and rear forts are sealed first, never deleted. */
function settleFortBudget(state, factionId) {
  const faction = state.factions[factionId], income = getIncome(state, factionId), sealed = [];
  const priority = tile => (tile.isCapital ? 100000 : 0) + (tile.troops >= FORT_GARRISON ? 1000 : 0) + neighbors(tile).filter(point => { const owner = state.tiles[point.key]?.ownerId; return owner && owner !== factionId && !peaceReason(state, factionId, owner); }).length * 100 + tile.troops;
  const forts = factionTiles(state, factionId).filter(tile => tile.building === 'fort' && !tile.fortMothballed).sort((a, b) => priority(a) - priority(b) || a.key.localeCompare(b.key));
  while (forts.length) {
    const cost = maintenance(state, factionId);
    if (faction.gold + income.gold >= cost.gold && faction.supply + income.supply >= cost.supply) break;
    const tile = forts.shift(); tile.fortMothballed = true; sealed.push(tile.key);
  }
  if (sealed.length) {
    log(state, `${faction.name}因维护预算不足封存 ${sealed.length} 座要塞（${sealed.join('、')}），城墙与驻军保留，可在资源恢复后重新整备。`, 'economy');
    if (factionId === state.playerId) notice(state, 'land', `维护预算不足，${sealed.length} 座要塞停止执勤；防区已取消，可补给后启用。`, { key: sealed[0] });
  }
  return sealed;
}

/** A current bill may consume savings, but can never be silently written off.
 * The caller already applied ordinary military and fort stop-loss. */
function fiscalReportErrors(report, state) {
  const errors = [], validKey = key => typeof key === 'string' && own(state.tiles, key);
  if (!isObject(report) || !integer(report.turn, 1, state.turn) || !Array.isArray(report.sales) || report.sales.length > MAX_TILES * 5 || !Array.isArray(report.withdrawals) || report.withdrawals.length > MAX_TILES) return ['财政收缩清单无效。'];
  const snapshotValid = row => isObject(row) && ['gold','grossGold','upkeepGold','shortfall'].every(k => integer(row[k], 0, Number.MAX_SAFE_INTEGER)) && ['netGold','netSupply','goldAfterSettlement'].every(k => integer(row[k], -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
    && row.netGold === row.grossGold - row.upkeepGold && row.goldAfterSettlement === row.gold + row.netGold && row.shortfall === Math.max(0, -row.goldAfterSettlement);
  if (!snapshotValid(report.before) || !snapshotValid(report.after) || report.before.shortfall <= 0 || report.after.shortfall !== 0) errors.push('财政收缩收支记录无效。');
  for (const row of report.sales) if (!isObject(row) || !validKey(row.key) || !['building','road','elite','plane','ship'].includes(row.asset) || typeof row.label !== 'string' || row.label.length > 120 || !integer(row.gold, 0, Number.MAX_SAFE_INTEGER)
    || (row.asset === 'elite' && (!RARE_RANKS.includes(row.rank) || !integer(row.amount, 1, 99)))) errors.push('财政变卖记录无效。');
  if (!integer(report.emergencyMint || 0, 0, Number.MAX_SAFE_INTEGER) || !integer(report.defaultedDebt || 0, 0, 1000000000) || !integer(report.refundGold, 0, Number.MAX_SAFE_INTEGER) || report.refundGold !== report.sales.reduce((sum, row) => sum + (row?.gold || 0), 0) || report.after?.gold !== report.before?.gold + report.refundGold + (report.emergencyMint || 0)) errors.push('财政变卖回收总额无效。');
  for (const row of report.withdrawals) {
    if (!isObject(row) || !validKey(row.key) || !['troops','leftResidents','placed','demobilized'].every(k => integer(row[k], 0, 100)) || row.leftResidents > 1 || row.placed + row.demobilized + row.leftResidents !== row.troops
      || !Array.isArray(row.heroes) || row.heroes.length > 1000 || row.heroes.some(id => !own(state.characters, id)) || new Set(row.heroes).size !== row.heroes.length
      || (row.refugeKey !== null && !validKey(row.refugeKey)) || !Array.isArray(row.placements) || row.placements.length > MAX_TILES || !Array.isArray(row.elitePlacements) || row.elitePlacements.length > MAX_TILES * 3
      || !isObject(row.lostElite) || RARE_RANKS.some(rank => !integer(row.lostElite[rank], 0, 99))) { errors.push('财政撤出记录无效。'); continue; }
    if (row.placements.some(p => !isObject(p) || !validKey(p.key) || !integer(p.troops, 1, 100)) || row.placements.reduce((sum,p)=>sum+(p?.troops||0),0)!==row.placed) errors.push('财政人员安置记录无效。');
    if (row.elitePlacements.some(p => !isObject(p) || !validKey(p.key) || !RARE_RANKS.includes(p.rank) || !integer(p.count, 1, 99))) errors.push('财政队伍安置记录无效。');
  }
  return errors;
}

function fiscalSnapshot(state, factionId) {
  const faction = state.factions[factionId], gross = getIncome(state, factionId), upkeep = maintenance(state, factionId);
  return { gold: faction.gold, grossGold: gross.gold, upkeepGold: upkeep.gold,
    shortfall: Math.max(0, upkeep.gold - faction.gold - gross.gold),
    netGold: gross.gold - upkeep.gold, netSupply: gross.supply - upkeep.supply,
    goldAfterSettlement: faction.gold + gross.gold - upkeep.gold };
}
function fiscalAssetOrder(state, factionId) {
  const assets = [], home = state.tiles[state.factions[factionId].capitalKey];
  for (const tile of factionTiles(state, factionId)) {
    const location = Number(tile.isCapital) * 100000 + girlsOn(tile).length * 1000 - hexDistance(tile, home);
    for (const [index, rank] of ['R', 'SR', 'SSR'].entries()) if (tile.elite?.[rank] > 0) assets.push({ key: tile.key, asset: 'elite', rank, order: index, location });
    if (tile.road) assets.push({ key: tile.key, asset: 'road', order: 3, location });
    if (tile.building && !BUILDINGS[tile.building]?.emergency && raidSalvage(tile).gold > 0) {
      const production = tileProduction(state, tile);
      assets.push({ key: tile.key, asset: 'building', order: 4, location,
        productive: production.gold + production.supply * 2 });
    }
  }
  return assets.sort((a, b) => a.order - b.order || (a.productive || 0) - (b.productive || 0) || a.location - b.location || a.key.localeCompare(b.key));
}
/** Reverse breadth-first spanning forest order removes leaves, never the capital.
 * Remaining connected land keeps a path to its original component root. */
function fiscalWithdrawalOrder(state, factionId) {
  const land = new Map(factionTiles(state, factionId).map(tile => [tile.key, tile])), home = state.factions[factionId].capitalKey;
  const seen = new Set(), rows = [];
  const roots = [home, ...[...land.keys()].sort()];
  for (const root of roots) {
    if (!land.has(root) || seen.has(root)) continue;
    const queue = [{ key: root, depth: 0 }]; seen.add(root);
    for (let i = 0; i < queue.length; i++) {
      const row = queue[i], tile = land.get(row.key); rows.push({ ...row, tile });
      for (const point of neighbors(tile)) if (land.has(point.key) && !seen.has(point.key)) { seen.add(point.key); queue.push({ key: point.key, depth: row.depth + 1 }); }
    }
  }
  return rows.filter(row => row.key !== home).sort((a, b) => b.depth - a.depth || girlsOn(a.tile).length - girlsOn(b.tile).length || tileProduction(state, a.tile).gold - tileProduction(state, b.tile).gold || a.key.localeCompare(b.key)).map(row => row.key);
}
function withdrawFiscalLand(state, factionId, key, ledger = null) {
  const tile = state.tiles[key], faction = state.factions[factionId], home = state.tiles[faction.capitalKey];
  requireThat(tile?.ownerId === factionId && key !== faction.capitalKey, '财政收缩只能撤出非首都领土。');
  const troops = tile.troops, heroes = girlsOn(tile), elite = { ...ELITE_ZERO, ...tile.elite };
  // Compulsory fiscal withdrawal is not a back door from reserve to active service.
  // Reuse the capacity planner, excluding destinations the ordinary readiness rule forbids.
  const survivors = Math.max(0, troops - 1);
  let plan = { placed: 0, demobilized: 0, placements: [], elitePlacements: [], demobilizedElites: { ...ELITE_ZERO }, refugeKey: home.key };
  if (survivors || Object.values(elite).some(n => n)) {
    const tiles = { [key]: tile }, ready = militaryStatus(state,tile).ready;
    // Initial commitments block refuge; this atomic settlement's own acted
    // markers do not exhaust a receiving site's remaining real capacity.
    // Core-first capacity set: do not repeatedly move refugees into outer land
    // that is next in the contraction order. The shared planner still applies
    // exact per-site ordinary/rare capacity to this deterministic eligible prefix.
    const candidates = ledger?.refuges || new Set(Object.keys(state.tiles));
    let remaining = survivors;
    for (const candidate of candidates) {
      const near = state.tiles[candidate];
      if (near.ownerId !== factionId || near.key === key || !near.shipId && !walkable(state, near) || (ledger ? ledger.initialCommitted.has(candidate) : near.foughtTurn === state.turn || near.marchedTurn === state.turn)) { if (ledger) candidates.delete(candidate); continue; }
      if (!ready && !near.militaryReserve) continue;
      if (near.troops >= 100 && !Object.values(elite).some(n=>n)) { if (ledger) candidates.delete(candidate); continue; }
      if (near.troops < 100 || Object.values(elite).some(n=>n)) { tiles[near.key]=near; remaining-=Math.max(0,100-near.troops); }
      if (remaining <= 0 && !Object.values(elite).some(n=>n)) break;
    }
    plan = planRetreat({ ...state, tiles }, key, factionId, survivors, elite);
  }
  const affected = [...new Set([key, ...(heroes.length ? [home.key] : []), ...plan.placements.map(row => row.key), ...plan.elitePlacements.map(row => row.key)])];
  const previous = ledger && affected.map(k => ({ key: k, production: tileIncome(state, state.tiles[k]), military: militaryStatus(state, state.tiles[k]) }));
  const lostLevels = tile.building ? tile.buildingLevel || 1 : 0;
  for (const placement of plan.placements) { const to = state.tiles[placement.key]; to.troops = placement.after; to.marchedTurn = state.turn; to.foughtTurn = state.turn; }
  for (const placement of plan.elitePlacements) { const to = state.tiles[placement.key]; addElite(to, placement.rank, placement.count); to.marchedTurn = state.turn; to.foughtTurn = state.turn; }
  // Named characters return directly to the retained capital even when all ordinary
  // refugee slots are full. They do not create troops or activate rare service.
  home.field.push(...heroes); if (heroes.length) { home.marchedTurn = state.turn; home.foughtTurn = state.turn; }
  tile.ownerId = null; tile.troops = troops > 0 ? 1 : 0; tile.garrison = []; tile.field = []; delete tile.elite;
  tile.food = 0; delete tile.cutSince; tile.militaryReserve = true; tile.militaryReadyTurn = 0;
  tile.marchedTurn = state.turn; tile.foughtTurn = state.turn;
  if (factionId === state.playerId) tile.fiscalReclaim = true;
  if (ledger) {
    ledger.count--; ledger.levels -= lostLevels; ledger.troops -= tile.troops + plan.demobilized;
    for (const old of previous) {
      const after = state.tiles[old.key], production = old.key === key ? { gold: 0, supply: 0 } : tileIncome(state, after);
      ledger.gross.gold += production.gold - old.production.gold; ledger.gross.supply += production.supply - old.production.supply;
      // Treat a removed service site as an uncharged row for the monetary delta;
      // site-count fields are not used by this temporary settlement ledger.
      ledger.military = replaceMilitaryBudgetSite(ledger.military, old.military, militaryStatus(state, after));
    }
  }
  return { key, troops, leftResidents: tile.troops, placed: plan.placed, demobilized: plan.demobilized,
    heroes, refugeKey: heroes.length ? home.key : plan.refugeKey,
    placements: plan.placements.map(row => ({ key: row.key, troops: row.troops })),
    elitePlacements: plan.elitePlacements.map(row => ({ key: row.key, rank: row.rank, count: row.count })),
    lostElite: plan.demobilizedElites };
}
function settleFiscalBankruptcy(state, factionId) {
  const before = fiscalSnapshot(state, factionId), sales = [], withdrawals = [];
  if (!before.shortfall) return null;
  const faction = state.factions[factionId]; let current = before;
  // Independent vehicle assets are sold before productive land. Flying planes
  // cannot be landed or scrapped by the treasury; only parked aircraft qualify.
  for (const kind of ['plane', 'ship']) {
    const inventory = state.campaign[kind === 'plane' ? 'planes' : 'ships'];
    for (const vehicle of Object.values(inventory).filter(v => v.ownerId === factionId && (kind !== 'plane' || !v.flightId))) {
      if (!current.shortfall) break;
      const key = kind === 'plane' ? vehicle.airportKey : vehicle.key;
      const quote = scrapTransport(state, kind, vehicle.id, factionId, true);
      sales.push({ key, asset: kind, label: quote.name, gold: quote.gold });
      current = fiscalSnapshot(state, factionId);
    }
  }
  const land = factionTiles(state, factionId), upkeep = maintenance(state, factionId);
  // Preserve all national/non-local income (characters, posts and trade) once;
  // liquidation changes only this site's production, development and service.
  const ledger = { count: land.length, levels: land.reduce((sum,t)=>sum+(t.building?t.buildingLevel||1:0),0),
    troops: land.reduce((sum,t)=>sum+t.troops,0), gross: getIncome(state,factionId), military: upkeep.military, forts: upkeep.forts,
    initialCommitted: new Set(land.filter(t=>t.foughtTurn===state.turn||t.marchedTurn===state.turn).map(t=>t.key)) };
  for (const asset of fiscalAssetOrder(state, factionId)) {
    if (!current.shortfall) break;
    const action = { type: 'liquidate', key: asset.key, asset: asset.asset,
      ...(asset.asset === 'elite' ? { rank: asset.rank, amount: Math.min(state.tiles[asset.key].elite[asset.rank], Math.max(1, Math.ceil(current.shortfall / LIQUIDATION_RARE_VALUES[asset.rank]))) } : {}) };
    const tile = state.tiles[asset.key], productionBefore = tileIncome(state,tile), militaryBefore = militaryStatus(state,tile);
    const levelsBefore = tile.building ? tile.buildingLevel || 1 : 0;
    const removedActiveFort = asset.asset === 'building' && tile.building === 'fort' && !tile.fortMothballed;
    const quote = executeLiquidation(state, action, factionId, { settlement: true, detailed: false });
    const productionAfter = tileIncome(state,tile);
    ledger.gross.gold += productionAfter.gold - productionBefore.gold;
    ledger.gross.supply += productionAfter.supply - productionBefore.supply;
    ledger.levels += (tile.building ? tile.buildingLevel || 1 : 0) - levelsBefore;
    ledger.military = replaceMilitaryBudgetSite(ledger.military,militaryBefore,militaryStatus(state,tile));
    // Normally all unaffordable forts are already sealed. If a caller retains
    // an active fort, removing it changes the whole network's excess surcharge.
    if (removedActiveFort) ledger.forts = fortUpkeep(state,factionId);
    sales.push({ key: asset.key, asset: asset.asset, ...(asset.rank ? { rank: asset.rank, amount: action.amount } : {}), label: quote.label, gold: quote.refund.gold });
    current = fiscalSnapshot(state, factionId);
  }
  if (current.shortfall) {
    requireThat(ledger.forts.gold === 0 && ledger.forts.supply === 0, '仍有可变卖要塞，不能提前收缩国土。');
    ledger.refuges = new Set([...land].sort((a,b)=>hexDistance(a,state.tiles[faction.capitalKey])-hexDistance(b,state.tiles[faction.capitalKey])||a.key.localeCompare(b.key)).map(t=>t.key));
    for (const key of fiscalWithdrawalOrder(state, factionId)) {
      if (!current.shortfall) break;
      withdrawals.push(withdrawFiscalLand(state, factionId, key, ledger));
      cleanCampaignAssignments(state);
      current = fiscalSnapshot(state, factionId);
    }
  }
  // An insolvent sovereign defaults before resorting to compulsory money issue.
  // The last resort pays the nominal bill, at explicit credit and inflation cost.
  const economy = state.campaign.economies[factionId];
  let defaultedDebt = 0, emergencyMint = 0;
  if (current.shortfall && economy.debt) {
    defaultedDebt = economy.debt; economy.debt = 0; economy.credit = 5;
    economy.prices = Math.min(100000, Math.ceil(economy.prices * 1.3));
    for (const other of Object.values(state.factions)) if (other.alive && other.id !== factionId) changeFavor(state, factionId, other.id, -25, C.credit);
    log(state, say('defaultDone', { name: faction.name, debt: defaultedDebt }), 'economy');
    current = fiscalSnapshot(state, factionId);
  }
  if (current.shortfall) {
    // Inflation changes purchasing power, so calculate the final bill after
    // applying the crisis and issue exactly the remaining nominal shortfall.
    economy.credit = 5; economy.inflation = Math.min(80, economy.inflation + 20);
    economy.prices = Math.min(100000, Math.ceil(economy.prices * 1.2));
    current = fiscalSnapshot(state, factionId); emergencyMint = current.shortfall;
    faction.gold += emergencyMint; economy.money = Math.min(1000000000, economy.money + emergencyMint);
    log(state, say('emergencyMintDone', { name: faction.name, gold: emergencyMint }), 'economy');
    current = fiscalSnapshot(state, factionId);
  }
  requireThat(JSON.stringify(current) === JSON.stringify(fiscalSnapshot(state, factionId)), '财政收缩账目不一致，结算未执行。');
  // Finite fallback: a capital-only realm has no land/development base levy.
  // Failure is explicit and atomic through perform; never mint money or forgive a bill.
  requireThat(current.shortfall === 0, '财政收缩后仍无法支付维护，结算未执行。');
  const report = { turn: state.turn, before, after: current, sales, withdrawals, defaultedDebt, emergencyMint,
    refundGold: sales.reduce((sum, row) => sum + row.gold, 0) };
  faction.fiscalReport = report;
  const text = `${faction.name}维护缺口 ${before.shortfall} 金币，折价变卖 ${sales.length} 项资产回收 ${report.refundGold} 金币、撤出 ${withdrawals.length} 块非首都领土；首都与角色保留，容量不足的普通军士会退役。未支付维护不会被免除。`;
  log(state, text, 'economy');
  if (factionId === state.playerId) notice(state, 'land', text, { fiscalTurn: state.turn });
  return report;
}
/** Historical fiscal losses never count again as new expansion, even after a
 * different owner held them. Infrastructure/ruin provenance stays independent. */
function creditTerritory(state, tile) { if (!tile.fiscalReclaim) state.metrics.land++; }

function netIncome(state, factionId) {
  const income = getIncome(state, factionId), upkeep = maintenance(state, factionId);
  return { gold: income.gold - upkeep.gold, supply: income.supply - upkeep.supply };
}
export function getRecoveryPlan(state, action) { return previewRecovery(state, action, state.playerId, netIncome); }
function progressPlans(state) {
  const chapter = state.milestone.level;
  const reward = { gold: 12 + 2 * Math.min(chapter, 20), supply: 6 + Math.min(chapter, 10) };
  const delta = id => Math.max(0, state.metrics[id] - state.milestone.baseline[id]);
  return [
    { id: 'expansion', label: '开拓或夺取新领土', current: delta('land'), target: 4 + Math.min(chapter - 1, 8), reward },
    { id: 'construction', label: '建造或升级建筑', current: delta('infrastructure'), target: 3 + Math.min(Math.floor((chapter - 1) / 2), 5), reward },
    { id: 'prosperity', label: '积累领地净收入', current: delta('wealth'), target: 60 + 20 * Math.min(chapter - 1, 17), reward: { ...reward, gold: chapter <= PROSPERITY_GOLD_CHAPTERS ? reward.gold : 0 }, description: chapter <= PROSPERITY_GOLD_CHAPTERS ? '前三章保留开局金币奖励。' : '按战后领地的产出扣除行政开销。补给耗尽或财政崩溃的回合不计；财政达标给予补给。' },
    { id: 'campaign', label: '完成首都攻占战役', current: delta('conquests'), target: 1 + Math.min(Math.floor((chapter - 1) / 5), 2), reward },
  ];
}
function recordChronicle(state, text, type, factionId = null, parties = []) {
  state.chronicle.push({ turn: state.turn, text, type, factionId, ...(betweenOtherNations(state, parties) ? { npcOnly: true } : {}) });
  if (state.chronicle.length > 500) {
    const earlier = state.chronicle.shift();
    state.chronicleArchive ||= { entries: 0, firstTurn: earlier.turn, lastTurn: earlier.turn, byType: {} };
    state.chronicleArchive.entries++; state.chronicleArchive.lastTurn = earlier.turn;
    state.chronicleArchive.byType[earlier.type] = (own(state.chronicleArchive.byType, earlier.type) ? state.chronicleArchive.byType[earlier.type] : 0) + 1;
  }
  log(state, text, type, parties);
}
function chooseCapital(state, factionId, tile) {
  const faction = state.factions[factionId];
  for (const old of Object.values(state.tiles)) if (old.capitalOf === factionId && old.key !== tile.key) {
    old.isCapital = false; old.formerCapitalOf = factionId; old.capitalOf = null;
  }
  tile.isCapital = true; tile.capitalOf = factionId;
  faction.capitalKey = tile.key; faction.alive = true;
  faction.capitalHistory ||= [];
  if (faction.capitalHistory.at(-1) !== tile.key) {
    if (faction.capitalHistory.length) faction.capitalMoves = (faction.capitalMoves || 0) + 1;
    faction.capitalHistory.push(tile.key); faction.capitalHistory = faction.capitalHistory.slice(-64);
  }
}
function rebuildFaction(state, factionId, forced = false) {
  const faction = state.factions[factionId];
  if (!faction.isPlayer && !membersOf(state, factionId).length && !Object.keys(state.characters).some(id => state.characters[id].group === factionId && state.characterOwners[id] === null && !state.captives[id] && !state.campaign?.prison?.[id])) return false;
  let cells = [];
  if (Object.keys(state.tiles).length + 7 <= MAX_TILES) {
    const center = frontierCenter(state, 1);
    revealArea(state, center.q, center.r, 1);
    cells = [ensureTile(state, center.q, center.r, true), ensureTile(state, center.q + 1, center.r, true), ensureTile(state, center.q, center.r + 1, true)];
    for (const tile of cells) if (!state.terrainTypes[tile.terrainId].passable) tile.terrainId = 'plains';
  } else {
    const possible = Object.values(state.tiles).filter(tile => !tile.isCapital && state.terrainTypes[tile.terrainId].passable && (!tile.ownerId || forced));
    possible.sort((a, b) => (a.ownerId ? 1 : 0) - (b.ownerId ? 1 : 0) || hexDistance(b) - hexDistance(a) || a.troops - b.troops);
    if (!possible.length && forced) {
      const refuge = Object.values(state.tiles).find(tile => !tile.isCapital);
      if (refuge) { refuge.terrainId = 'plains'; refuge.refugeConverted = true; possible.push(refuge); }
    }
    if (!possible.length) return false;
    cells = [possible[0], ...neighbors(possible[0]).map(p => state.tiles[p.key]).filter(tile => tile && !tile.ownerId && state.terrainTypes[tile.terrainId].passable).slice(0, 2)];
  }
  const isPlayer = factionId === state.playerId;
  faction.gold = isPlayer ? Math.max(12, Math.floor(faction.gold * 0.65)) : 22;
  faction.supply = isPlayer ? Math.max(10, Math.floor(faction.supply * 0.65)) : 16;
  faction.graceUntilTurn = state.turn + 2; faction.revivals = (faction.revivals || 0) + 1;
  for (const [index, tile] of cells.entries()) {
    tile.ownerId = factionId; tile.troops = index ? 3 : Math.min(20, 8 + Math.floor(state.turn / 12)); tile.discovered = true;
  }
  chooseCapital(state, factionId, cells[0]);
  for (const id of Object.keys(state.characters)) if (state.characters[id].group === factionId && state.characterOwners[id] === null && !state.captives[id] && !state.campaign?.prison?.[id]) state.characterOwners[id] = factionId;
  for (const id of Object.keys(state.characterOwners)) if (state.characterOwners[id] === factionId) seatAtHome(state, id);
  if (isPlayer) state.exileCount++;
  if (!isPlayer && isBloodFeud(state, factionId)) enforceBloodFeudWar(state, factionId, '刚在边疆复兴便誓报同伴遭处决之仇！');
  recordChronicle(state, `${faction.name}${isPlayer ? '带着流亡者在边疆重建' : '在边疆复兴'}，新都 ${cells[0].key}，保护至第 ${faction.graceUntilTurn} 回合。`, isPlayer ? 'exile' : 'revival', factionId);
  return true;
}
function notice(state, kind, text, extra = {}) {
  state.noticeSeq = (state.noticeSeq || 0) + 1;
  state.notices = [...(state.notices || []), { id: state.noticeSeq, turn: state.turn, kind, text, ...extra }].slice(-40);
}
/** 补给上限 at nightfall: every tile holding more people than it can feed sends some of them to the land next door.
 * The same rule for every nation; only the player is told. */
function easeSupply(state) {
  let sites = 0, people = 0;
  for (const key of Object.keys(state.tiles).sort()) {
    const tile = state.tiles[key];
    if (!tile.ownerId || !state.factions[tile.ownerId]?.alive) continue;
    const gone = easeTile(state, tile);
    if (gone && tile.ownerId === state.playerId) { sites++; people += gone; }
  }
  if (sites) {
    const text = `${sites} 处驻地超出补给上限，${people} 人分散到了附近的地块。要塞、道路和带队的同伴能让一块地多养些人。`;
    notice(state, 'land', text); log(state, text, 'army');
  }
}
/** Members of a fallen nation scatter; they can be met again through recruitment. */
function scatterMembers(state, factionId) {
  for (const [id, owner] of Object.entries(state.characterOwners)) if (owner === factionId && !state.captives[id] && !Object.values(state.captives).some(item => item.characterId === id)) state.characterOwners[id] = null;
}
/** Only land still joined to the capital is really governed. */
function syncControl(state, faction) {
  const fresh = [];
  for (const part of partsOf(state, faction.id)) {
    const core = part.some(tile => tile.key === faction.capitalKey || citiesOf(state, faction.id).some(city => city.key === tile.key && city.mayorId));
    for (const tile of part) {
      if (core) delete tile.cutSince;
      else if (tile.cutSince === undefined) { tile.cutSince = state.turn; fresh.push(tile); }
    }
  }
  if (fresh.length && faction.isPlayer) notice(state, 'cut', `${fresh.length} 块领土和首都断了联系：不产出、不增长。${CUT_GRACE} 回合内打通，否则它们会脱离你。`, { key: fresh[0].key });
}
/** A nation the player was fighting has just gone under. The war ends with it, and the player must hear it now — why, by
 *  whose hand, where her land went and who of hers is still in the player's cells — not find out later from the chronicle.
 *  Shown at the start of the player's turn as a scene (line 'over'), and kept in the record like any notice. */
function tellWarOver(state, faction, byId, outcome) {
  const player = state.playerId, relation = state.relations?.[pairKey(player, faction.id)];
  if (faction.isPlayer || byId === player || relation?.status !== 'war') return;
  const by = byId && state.factions[byId] ? state.factions[byId].name : '', since = relation.war?.since ?? relation.since;
  const held = Object.entries(state.captives || {}).filter(([, c]) => c?.originalFactionId === faction.id && c.captorId === player).length;
  const cause = outcome === 'dissolved' ? `${faction.name}的人都被俘或离散了，国家就此解散`
    : by ? `${by}攻下了${faction.name}的首都，${faction.name}亡国了` : `${faction.name}失去了全部国土，亡国了`;
  const land = outcome === 'dissolved' ? '她留下的地成了无主地，派人就能去开拓。'
    : outcome === 'taken' ? `她剩下的地全归了${by}。` : '她的地已经被各国分完了。';
  notice(state, 'peace', `${cause}。你们从第 ${since} 回合打起的这场仗随之结束。${land}${held ? `你牢里还关着她的 ${held} 人，可以招降或放走。` : ''}`,
    { factionId: faction.id, line: 'over', ...(by ? { byId } : {}), ...(faction.capitalKey && state.tiles[faction.capitalKey] ? { key: faction.capitalKey } : {}) });
}
function reconcileFactions(state, quiet = false) {
  dissolveEmptyNations(state);
  for (const faction of Object.values(state.factions)) {
    if (!faction.isPlayer && !membersOf(state, faction.id).length) continue;
    const owned = factionTiles(state, faction.id);
    const current = state.tiles[faction.capitalKey];
    if (owned.length && current?.ownerId === faction.id && current.isCapital && current.capitalOf === faction.id) { faction.alive = true; syncControl(state, faction); continue; }
    const conqueror = current?.ownerId && current.ownerId !== faction.id ? current.ownerId : null;
    const parties = [faction.id, conqueror], foreignFall = betweenOtherNations(state, parties);
    for (const tile of Object.values(state.tiles)) if (tile.capitalOf === faction.id) { tile.isCapital = false; tile.formerCapitalOf = faction.id; tile.capitalOf = null; }
    const forts = owned.filter(tile => fortStatus(state, tile)?.refuge);
    // A government needs a fortress to fall back on. Without one, the whole country goes with the capital.
    let tookAll = false;
    if (owned.length && !forts.length && !quiet) {
      tookAll = Boolean(conqueror);
      for (const tile of owned) {
        tile.acquiredTurn = state.turn;
        tile.ownerId = conqueror; tile.garrison = []; tile.field = []; tile.food = 0; delete tile.elite; delete tile.cutSince;
        // Annexed residents are not the conquering field army, and their old
        // government's paid service cannot activate the new owner's training.
        tile.militaryReserve = true; tile.militaryReadyTurn = 0;
        if (conqueror === state.playerId) { tile.discovered = true; creditTerritory(state, tile); }
      }
      recordChronicle(state, `${faction.name}丢了首都，又没有完成整备且驻有至少 4 人的要塞可退，全部领土${conqueror ? `归了${state.factions[conqueror].name}` : '四分五裂'}。`, 'dormant', faction.id, parties);
      if (faction.isPlayer) notice(state, 'cut', `首都失守，又没有完成整备且驻有至少 4 人的要塞可退，全部领土都没了。大家逃到边疆重新开始。`);
      else if (conqueror === state.playerId) notice(state, 'nation', `${faction.name}没有可用要塞，首都一丢，${owned.length} 块领土全归了你。新归附驻地先转为后备，生产不变，可逐地整备。`);
      else if (!foreignFall) notice(state, 'nation', `${faction.name}亡国了，没被俘虏的成员成了自由角色。`);
      owned.length = 0;
    }
    if (owned.length) {
      const parts = partsOf(state, faction.id), sizeOf = tile => parts.find(part => part.includes(tile)).length;
      const seats = (forts.length ? forts : owned).sort((a, b) => sizeOf(b) - sizeOf(a) || b.troops - a.troops || (b.buildingLevel || 0) - (a.buildingLevel || 0) || a.key.localeCompare(b.key));
      chooseCapital(state, faction.id, seats[0]);
      if (!quiet) recordChronicle(state, `${faction.name}迁都到要塞 ${seats[0].key}，其余国土与政权继续存在。`, 'migration', faction.id, parties);
      if (!quiet && faction.isPlayer) notice(state, 'cut', `首都丢了！朝廷迁到了要塞 ${seats[0].key}，只有连着新都的领土还听你的。`, { key: seats[0].key });
      syncControl(state, faction);
    } else {
      if (faction.alive) {
        if (!quiet) tellWarOver(state, faction, conqueror, tookAll ? 'taken' : 'lost');
        faction.defeats = (faction.defeats || 0) + 1; faction.lastDefeatedTurn = state.turn;
        if (!quiet) recordChronicle(state, `${faction.name}暂时失去全部国土，其历史与人物被保留。`, 'dormant', faction.id, parties);
        if (!quiet && !faction.isPlayer && !foreignFall) notice(state, 'nation', `${faction.name}失去了全部国土。`, { factionId: faction.id });
      }
      faction.alive = false; faction.capitalKey = null;
      releasePrisonersOf(state, faction.id, '因关押国失去领土而获释');
      if (!faction.isPlayer) scatterMembers(state, faction.id);
      if (!faction.isPlayer) {
        // Sea tiles are assets, not a surviving government. A fallen country
        // cannot remain alive through an unmanned boat or a flight inventory.
        for (const flight of Object.values(state.campaign?.flights || {}).filter(f => f.ownerId === faction.id)) {
          for (const id of flight.planeIds) delete state.campaign.planes[id];
          delete state.campaign.flights[flight.id];
        }
        for (const plane of Object.values(state.campaign?.planes || {}).filter(p => p.ownerId === faction.id)) {
          const airport = state.tiles[plane.airportKey];
          if (conqueror && airport?.ownerId === conqueror && airport.building === 'airfield') plane.ownerId = conqueror;
          else delete state.campaign.planes[plane.id];
        }
        for (const ship of Object.values(state.campaign?.ships || {}).filter(v => v.ownerId === faction.id)) {
          const boat = state.tiles[ship.key];
          boat.field = []; boat.garrison = [];
          if (conqueror) { ship.ownerId = conqueror; boat.ownerId = conqueror; boat.militaryReserve = true; }
          else { boat.ownerId = null; boat.troops = 0; delete boat.shipId; delete state.campaign.ships[ship.id]; }
        }
      }
      if (faction.id === state.playerId) requireThat(rebuildFaction(state, faction.id, true), '没有可供流亡者建立营地的地块。');
    }
  }
}
/** Land cut off for too long stops answering: it joins whoever surrounds it, or goes its own way. */
function settleCutOff(state) {
  for (const faction of Object.values(state.factions).filter(item => item.alive)) {
    for (const part of partsOf(state, faction.id)) {
      if (part.some(tile => tile.key === faction.capitalKey)) continue;
      const since = Math.min(...part.map(tile => tile.cutSince ?? state.turn));
      if (state.turn + 1 - since < CUT_GRACE) continue;
      const tally = {};
      for (const tile of part) for (const point of neighbors(tile)) {
        const owner = state.tiles[point.key]?.ownerId;
        if (owner && owner !== faction.id && relationOf(state, faction.id, owner).status === 'war') tally[owner] = (tally[owner] || 0) + 1;
      }
      const heir = Object.keys(tally).sort((a, b) => tally[b] - tally[a] || a.localeCompare(b))[0] || null;
      const home = state.tiles[faction.capitalKey];
      for (const tile of part) {
        const girls = girlsOn(tile); tile.garrison = []; tile.field = []; delete tile.elite; delete tile.cutSince; tile.food = 0;
        tile.ownerId = heir; tile.marchedTurn = state.turn;
        tile.militaryReserve = true; tile.militaryReadyTurn = 0;
        if (home) home.field.push(...girls);
        if (heir === state.playerId) { tile.discovered = true; creditTerritory(state, tile); }
      }
      const text = `${part.length} 块失联的${faction.name}领土${heir ? `归附了${state.factions[heir].name}` : '宣布自立，变成了无主之地'}。${heir ? '新归附驻地先转为后备，生产不变，可逐地整备。' : ''}`;
      recordChronicle(state, text, 'war', faction.id, [faction.id, heir]);
      if (faction.isPlayer || heir === state.playerId) notice(state, 'land', text, { key: part[0].key });
    }
  }
}
function checkProgress(state, settledTurn = null) {
  state.status = 'playing';
  reconcileFactions(state);
  normalizeParty(state);
  if (state.inbox.length) state.inbox = state.inbox.filter(item => currentOffer(state, item));
  const faction = state.factions[state.playerId];
  if (settledTurn !== null && faction.supply > 0 && faction.fiscalReport?.turn !== settledTurn && faction.lastDefeatedTurn !== settledTurn) {
    // Assess the realm that survived the turn. Paid military upkeep remains a
    // real treasury expense; it does not subtract from late chapter progress.
    const { rawGold, baseGold, gold } = getAdministration(state, state.playerId);
    state.metrics.wealth += Math.max(0, rawGold - baseGold - gold);
  }
  const ready = progressPlans(state).filter(plan => plan.current >= plan.target);
  const completed = ready.find(plan => plan.id !== 'prosperity') || ready[0];
  if (completed) {
    faction.gold += completed.reward.gold; faction.supply += completed.reward.supply;
    recordChronicle(state, `第 ${state.milestone.level} 章「${completed.label}」完成，金币 +${completed.reward.gold}、补给 +${completed.reward.supply}。新的阶段已经开始。`, 'milestone', state.playerId);
    state.milestone.completed++; state.milestone.level++;
    state.milestone.baseline = completed.id === 'prosperity'
      ? { ...state.milestone.baseline, wealth: state.metrics.wealth }
      : { ...state.metrics };
  }
}
function pairKey(a, b) { return [a, b].sort().join('|'); }
const STATUS_NAME = { neutral: '和平', war: '交战', truce: '休战', pact: '互不侵犯', ally: '同盟', vassal: '附庸' };
const clampFavor = value => Math.max(-100, Math.min(100, Math.round(value)));
function freshRelation(state, a, b) { return { status: 'neutral', favor: Math.round(hash(state.seed, 0, 0, pairKey(a, b)) * 20) - 10, until: 0, since: state.turn, trade: false, talkTurn: 0 }; }
function relationOf(state, a, b) { return state.relations[pairKey(a, b)] ||= freshRelation(state, a, b); }
const readRelation = (state, a, b) => state.relations?.[pairKey(a, b)] || freshRelation(state, a, b);
const atWar = (state, a, b) => readRelation(state, a, b).status === 'war';
/** Favor moves for a reason, and the player's side of every relation remembers the last few reasons. */
function changeFavor(state, a, b, amount, why = '') {
  const relation = relationOf(state, a, b), before = relation.favor;
  relation.favor = clampFavor(relation.favor + amount);
  const delta = relation.favor - before;
  if (!delta || !why || ![a, b].includes(state.playerId)) return;
  const notes = relation.notes || [], last = notes.at(-1);
  if (last && last.why === why && state.turn - last.turn <= 12) { last.delta += delta; last.turn = state.turn; if (!last.delta) notes.pop(); }
  else notes.push({ turn: state.turn, delta, why });
  relation.notes = notes.slice(-DIPLOMACY_RULES.notes);
}
/** The war between the player and this nation, as the player sees it: positive means the player is winning. */
function warRecord(state, enemyId) {
  const relation = state.relations?.[pairKey(state.playerId, enemyId)];
  if (relation?.status !== 'war' || enemyId === state.playerId) return null;
  return relation.war ||= { by: null, cb: 'conquest', since: relation.since, score: 0 };
}
function addWarScore(state, enemyId, amount) {
  const war = warRecord(state, enemyId);
  if (war) war.score = Math.max(-100, Math.min(100, war.score + amount));
}
/** A gain for `winner` over `loser`: only wars the player is in keep a score. */
function scoreWar(state, winner, loser, amount) {
  if (winner === state.playerId) addWarScore(state, loser, amount); else if (loser === state.playerId) addWarScore(state, winner, -amount);
}
const isVassal = (state, factionId) => factionId !== state.playerId && state.relations?.[pairKey(state.playerId, factionId)]?.status === 'vassal';
const vassalsOf = state => Object.values(state.factions).filter(faction => faction.alive && isVassal(state, faction.id));
/** What a vassal sends this turn: a fifth of its gold income, never more than it can spare after its own bills. */
function tributeOf(state, faction) {
  return tributeResources(state, faction).gold;
}
/** Non-captor nations bound to a character's starter band / group leader enter eternal blood feud while held in execution. */
export function feudFactionsForCharacter(state, id, fromFactionId = null, captorId = state?.playerId) {
  if (!state?.factions || !id) return [];
  const targets = new Set();
  const addFaction = fid => {
    if (fid && fid !== captorId && own(state.factions, fid)) targets.add(fid);
  };
  let matchedBand = null;
  for (const bandId of Object.keys(STARTER_BANDS)) {
    if (starterBandMembers(bandId).includes(id)) { matchedBand = bandId; break; }
  }
  if (matchedBand) {
    const spec = STARTER_BANDS[matchedBand], leaderId = spec.leader, homelandId = spec.group || matchedBand;
    if (leaderId !== state.factions?.[captorId]?.leaderId && state.characterOwners?.[leaderId] !== captorId) {
      addFaction(matchedBand);
      addFaction(homelandId);
      for (const faction of Object.values(state.factions)) {
        if (faction.id !== captorId && (faction.leaderId === leaderId || state.characterOwners?.[leaderId] === faction.id)) addFaction(faction.id);
      }
    }
  } else {
    const charGroup = state.characters?.[id]?.group;
    if (!charGroup || state.factions?.[captorId]?.leaderId !== id) {
      addFaction(charGroup);
      addFaction(fromFactionId);
    }
  }
  if (captorId === state.playerId) for (const fid of [...targets]) if (state.factions[fid]?.isPlayer) targets.delete(fid);
  return [...targets];
}
export function feudTargetNames(state, id, fromFactionId = null) {
  if (!state || !id) return [];
  const player = state.playerId, names = new Set();
  for (const fid of feudFactionsForCharacter(state, id, fromFactionId, player)) {
    if (state.factions?.[fid]?.name) names.add(state.factions[fid].name);
  }
  let matchedBand = null;
  for (const bandId of Object.keys(STARTER_BANDS)) {
    if (starterBandMembers(bandId).includes(id)) { matchedBand = bandId; break; }
  }
  if (matchedBand) {
    const spec = STARTER_BANDS[matchedBand], leaderId = spec.leader, homelandId = spec.group || matchedBand;
    if (leaderId !== state.factions?.[player]?.leaderId && state.characterOwners?.[leaderId] !== player) {
      for (const def of [...FACTION_DEFINITIONS, ...ARRIVALS]) {
        if (!def.isPlayer && (def.id === matchedBand || def.id === homelandId || def.leaderId === leaderId)) names.add(def.name);
      }
    }
  }
  return [...names];
}
function hasFeudAgainst(state, captorId, victimFactionId) {
  if (!captorId || !victimFactionId || captorId === victimFactionId || !state?.factions?.[captorId] || !state?.factions?.[victimFactionId]) return false;
  const inPrison = Object.entries(state.campaign?.prison || {}).some(([cid, rec]) => (rec.captorId || state.playerId) === captorId && feudFactionsForCharacter(state, cid, rec.originalFactionId, captorId).includes(victimFactionId));
  if (inPrison) return true;
  return Array.isArray(state.wall) && state.wall.some(entry => entry?.id && (entry.captorId || state.playerId) === captorId && feudFactionsForCharacter(state, entry.id, entry.fromFactionId, captorId).includes(victimFactionId));
}
function hasFeudBetween(state, a, b) {
  return hasFeudAgainst(state, a, b) || hasFeudAgainst(state, b, a);
}
export function isBloodFeud(state, factionId, otherFactionId = state?.playerId) {
  if (!factionId || !otherFactionId || factionId === otherFactionId || !state?.factions?.[factionId] || !state?.factions?.[otherFactionId]) return false;
  return hasFeudBetween(state, otherFactionId, factionId);
}
function enforceBloodFeudWar(state, factionId, reasonText) {
  const faction = state.factions?.[factionId];
  if (!faction || faction.isPlayer) return;
  changeFavor(state, state.playerId, factionId, -200, '处决同团成员');
  cancelOffersBetween(state, state.playerId, factionId);
  if (state.envoys?.[factionId]) { const envoy = state.envoys[factionId]; delete state.envoys[factionId]; seatAtHome(state, envoy); }
  if (!faction.alive) return;
  if (!atWar(state, state.playerId, factionId)) {
    startWar(state, factionId, state.playerId, reasonText, false, null, 'feud');
  } else {
    const war = warRecord(state, factionId);
    if (war) war.cb = 'feud';
  }
  relationOf(state, state.playerId, factionId).favor = -100;
}
function graceBlock(state, a, b) {
  if (hasFeudBetween(state, a, b)) return '';
  const until = Math.max(state.factions[a]?.graceUntilTurn || 0, state.factions[b]?.graceUntilTurn || 0);
  return state.turn < until ? `第 ${until} 回合之前谁也不能开战。` : '';
}
/** Why a cannot attack b right now; empty when it can. */
function peaceReason(state, a, b) {
  const grace = graceBlock(state, a, b);
  if (grace) return grace;
  const relation = readRelation(state, a, b);
  if (relation.status === 'war') return '';
  if (relation.status === 'neutral') return '双方还没开战，要先宣战。';
  return `双方${STATUS_NAME[relation.status]}中${relation.until ? `，到第 ${relation.until} 回合` : ''}，要先撕约宣战。`;
}
function powerOf(state, factionId) {
  const tiles = factionTiles(state, factionId), elite = factionElites(state, factionId);
  const girls = Object.keys(state.characters).filter(id => canServe(state, id, factionId)).length;
  return tiles.reduce((sum, tile) => sum + tile.troops, 0) + elite.R * 2 + elite.SR * 4 + elite.SSR * 6 + girls * 6;
}
const bordering = (state, a, b) => factionTiles(state, a).some(tile => neighbors(tile).some(point => state.tiles[point.key]?.ownerId === b));
function currentOffer(state, item) {
  if (!state.factions[item.from]?.alive || item.turn < state.turn - 1 || isBloodFeud(state, item.from)) return false;
  const relation = readRelation(state, state.playerId, item.from);
  if (item.turn < relation.since) return false;
  if (item.kind === 'peace') return relation.status === 'war';
  if (item.kind === 'pact') return ['neutral', 'truce'].includes(relation.status);
  if (item.kind === 'ally') return !['war', 'ally'].includes(relation.status);
  if (item.kind === 'trade') return relation.status !== 'war' && !relation.trade;
  return item.kind === 'tribute' && relation.status === 'neutral';
}
function cancelOffersBetween(state, a, b) {
  const other = a === state.playerId ? b : b === state.playerId ? a : null;
  if (other) state.inbox = state.inbox.filter(item => item.from !== other);
}
function startWar(state, a, b, reason, quiet = false, allyId = null, cb = null) {
  const relation = relationOf(state, a, b), broke = ['pact', 'truce', 'ally', 'vassal'].includes(relation.status);
  // Snapshot only an actual player call to arms. Neither loading nor rendering
  // reconstructs missing history, and treaties still use the normal war rules.
  const obligation = allyId && a === state.playerId ? { ...relation } : null;
  Object.assign(relation, { status: 'war', since: state.turn, until: 0, trade: false });
  cancelOffersBetween(state, a, b);
  if ([a, b].includes(state.playerId)) {
    relation.war = { by: a, cb: cb || (allyId ? 'ally' : 'conquest'), since: state.turn, score: 0 };
    // An envoy does not stay in a court at war with her own.
    const other = a === state.playerId ? b : a;
    if (state.envoys?.[other]) { const envoy = state.envoys[other]; delete state.envoys[other]; seatAtHome(state, envoy); }
  }
  changeFavor(state, a, b, -30, '开战');
  const nameA = state.factions[a].name, nameB = state.factions[b].name;
  const effects = obligation ? `同盟参战：${state.factions[allyId].name}遭${nameB}宣战，你已自动向${nameB}宣战。${broke ? `与${nameB}的${STATUS_NAME[obligation.status]}已撕毁。` : '此前没有条约，无撕约处罚。'}${obligation.trade ? '双方通商已中断。' : '双方原本未通商。'}双方好感 ${obligation.favor} → ${relation.favor}。${broke ? '撕约另使其他现存国家对你好感 -10（最低 -100）。' : ''}` : '';
  recordChronicle(state, `${nameA}向${nameB}宣战：${reason}${effects ? ` ${effects}` : ''}`, 'war', a, [a, b, allyId]);
  if (broke) for (const other of Object.values(state.factions)) if (other.alive && ![a, b].includes(other.id)) changeFavor(state, a, other.id, -10, '撕毁条约');
  // A war of plain conquest worries everyone who is watching; a stated grievance does not.
  if (a === state.playerId && !allyId && (cb || 'conquest') === 'conquest') for (const other of Object.values(state.factions)) if (other.alive && ![a, b].includes(other.id) && factionTiles(state, other.id).some(tile => tile.discovered)) changeFavor(state, a, other.id, DIPLOMACY_RULES.unjustWar, '无端开战');
  if (b === state.playerId) notice(state, 'war', `${nameA}向你宣战：${reason}`, { factionId: a, line: 'declare' });
  else if (allyId === state.playerId) notice(state, 'war', `${nameA}履行了与你的同盟，向${nameB}宣战。`, { factionId: a });
  if (obligation) notice(state, 'war', effects, { factionId: b, allyId });
  // An ally answers the call.
  if (!quiet) for (const other of Object.values(state.factions)) {
    const bond = readRelation(state, b, other.id).status;
    if (!other.alive || [a, b].includes(other.id) || !['ally', 'vassal'].includes(bond) || readRelation(state, a, other.id).status === 'war') continue;
    startWar(state, other.id, a, bond === 'vassal' ? (other.id === state.playerId ? `保护附庸${nameB}。` : `随宗主${nameB}应战。`) : `履行与${nameB}的同盟。`, true, b);
  }
  // Vassals march with their overlord's own wars too.
  if (!quiet && a === state.playerId) for (const vassal of vassalsOf(state)) if (vassal.id !== b && readRelation(state, vassal.id, b).status !== 'war') startWar(state, vassal.id, b, `随宗主${nameA}出征。`, true, a);
}
function endWar(state, a, b, status, turns) {
  const relation = relationOf(state, a, b);
  if (relation.status !== status) cancelOffersBetween(state, a, b);
  Object.assign(relation, { status, since: state.turn, until: turns ? state.turn + turns : 0 });
  delete relation.war;
  if(status==='vassal'){const id=a===state.playerId?b:a;state.factions[id].liberty=Math.max(25,state.factions[id].liberty||0);for(const tile of factionTiles(state,id)){tile.militaryReserve=true;tile.militaryReadyTurn=0;}}
  if (a !== state.playerId && b !== state.playerId) recordChronicle(state, `${state.factions[a].name}与${state.factions[b].name}达成${STATUS_NAME[status]}。`, 'diplomacy', a, [a, b]);
}
/** The other side's reasoning, shown to the player as is. */
export function diplomacyQuote(state, factionId, kind) {
  if (isBloodFeud(state, factionId)) return { kind, score: -999, need: 0, lines: [['不死不休', -999]], willing: false };
  if (kind === 'chat') return { kind, score: 0, need: 0, lines: [], willing: true };
  const me = state.playerId, relation = readRelation(state, me, factionId), faction = state.factions[factionId];
  const mine = frontierMusterPower(state, me), theirs = Math.max(1, frontierMusterPower(state, factionId)), ratio = mine / theirs;
  const lines = [['好感', relation.favor]], push = (label, value) => { if (value) lines.push([label, Math.round(value)]); };
  push({ aggressive: '好战', builder: '求稳' }[faction.personality] || '', { aggressive: -10, builder: 10 }[faction.personality] || 0);
  let need = 0;
  if (kind === 'peace') { need = 0; push('打了很久', Math.min(20, (state.turn - relation.since) * 2)); push(ratio > 1.3 ? '你比她强' : ratio < .77 ? '她比你强' : '', ratio > 1.3 ? 20 : ratio < .77 ? -20 : 0); const score = relation.war?.score || 0; push(score > 0 ? '战况对你有利' : score < 0 ? '战况对她有利' : '', Math.round(score / 2)); }
  if (kind === 'trade') need = 10;
  if (kind === 'pact') { need = 25; push(ratio > 1.3 ? '她怕你' : '', ratio > 1.3 ? 10 : 0); if (Object.values(state.factions).some(other => other.alive && other.id !== factionId && atWar(state, factionId, other.id))) push('她腹背受敌', 15); }
  if (kind === 'ally') { need = 60; push(relation.status === 'pact' ? '已有条约' : '', relation.status === 'pact' ? 10 : 0); push(relation.trade ? '正在通商' : '', relation.trade ? 5 : 0); }
  if (kind === 'demand') { need = 50; lines.length = 0; lines.push(['实力对比', Math.round(ratio * 25)]); }
  const score = lines.reduce((sum, [, value]) => sum + value, 0);
  return { kind, score, need, lines: lines.filter(([label]) => label), willing: score >= need };
}
/** Grounds for war the player can state. A stated grievance spares the −8 that plain conquest costs with every watching court. */
export function getWarReasons(state, factionId) {
  const relation = readRelation(state, state.playerId, factionId), rules = DIPLOMACY_RULES;
  const held = Object.values(state.captives || {}).filter(captive => captive.captorId === factionId && captive.originalFactionId === state.playerId).length;
  const lost = factionTiles(state, factionId).filter(tile => tile.claim !== undefined).length;
  const insulted = relation.insultTurn !== undefined && state.turn - relation.insultTurn <= rules.insultTurns;
  return [
    { id: 'rescue', name: '营救同伴', valid: held > 0, desc: held ? `她们关着我方 ${held} 位同伴。` : '她们没有关押我方同伴。' },
    { id: 'reclaim', name: '收复失地', valid: lost > 0, desc: lost ? `她们占着我方丢掉的 ${lost} 块地。` : '她们没有占着我方丢掉的土地。' },
    { id: 'insult', name: '回敬勒索', valid: insulted, desc: insulted ? `第 ${relation.insultTurn} 回合她们上门索要进贡。` : `近 ${rules.insultTurns} 回合她们没有向我方索贡。` },
    { id: 'grudge', name: '清算旧怨', valid: relation.favor <= rules.grudgeFavor, desc: relation.favor <= rules.grudgeFavor ? `好感 ${relation.favor}，积怨已深。` : `好感跌到 ${rules.grudgeFavor} 以下才算旧怨。` },
    { id: 'conquest', name: '无端开战', valid: true, unjust: true, desc: `没有理由也能打，但所有见过的国家好感 ${rules.unjustWar}。` },
  ];
}
/** How this nation looks at the player right now, in one word and one line. It mirrors what the nation's own decisions use. */
function attitudeOf(state, factionId) {
  if (isBloodFeud(state, factionId)) return { id: 'feud', name: '不死不休', hint: '你处决了她们的同伴，此仇不共戴天，绝无议和与往来可能。' };
  const faction = state.factions[factionId], relation = readRelation(state, state.playerId, factionId);
  const mine = Math.max(1, frontierMusterPower(state, state.playerId)), theirs = frontierMusterPower(state, factionId), ratio = theirs / mine, favor = relation.favor;
  if (relation.status === 'war') return { id: 'war', name: '交战', hint: (relation.war?.score || 0) >= 20 ? '战况对你有利，可以开价议和。' : (relation.war?.score || 0) <= -20 ? '战况对她有利，她可能开价要你赔款。' : '胜负未分。打下地块、赢下战斗、俘虏她的人都会涨战争分数。' };
  if (relation.status === 'vassal') return { id: 'vassal', name: '臣属', hint: favor < 0 ? '她心里不服：你要是显得弱，她会找机会脱离。' : '按时进贡，随你出战。' };
  if (relation.status === 'ally') return { id: 'ally', name: '盟友', hint: '谁向你们任何一方宣战，另一方都会参战。' };
  if (faction.personality === 'aggressive' && ratio >= 1.5 && relation.status === 'neutral' && bordering(state, state.playerId, factionId)) return { id: 'covet', name: '觊觎', hint: '她比你强，又好战，还挨着你：随时可能索要进贡或宣战。' };
  if (favor <= -40) return { id: 'hostile', name: '敌视', hint: '她恨你，会去找同样恨你的国家结盟。' };
  if (ratio <= .67 && favor < 25) return { id: 'afraid', name: '畏惧', hint: '她怕你：更愿意签互不侵犯，也更想找靠山。' };
  if (favor >= 60) return { id: 'close', name: '亲密', hint: '可以谈结盟了。' };
  if (favor >= 25) return { id: 'friendly', name: '友好', hint: '通商和互不侵犯都好谈。' };
  return { id: 'neutral', name: favor < -15 ? '冷淡' : '观望', hint: favor < -15 ? '送礼、寒暄或派使节能慢慢缓和。' : '没什么想法。好感到 10 可以通商，25 可以谈条约。' };
}
/** The land this nation would hand over, nearest the player's border first. Each tile handed over brings the next into reach. */
function cessionTiles(state, factionId, count) {
  const mine = new Set(factionTiles(state, state.playerId).map(tile => tile.key)), picked = [];
  const pool = factionTiles(state, factionId).filter(tile => !tile.isCapital);
  while (picked.length < count) {
    const touching = tile => neighbors(tile).filter(point => mine.has(point.key)).length;
    const next = pool.filter(tile => !mine.has(tile.key) && touching(tile) > 0).sort((a, b) => touching(b) - touching(a) || a.troops - b.troops || a.key.localeCompare(b.key))[0];
    if (!next) break;
    picked.push(next.key); mine.add(next.key);
  }
  return picked;
}
/** The peace the war score buys. Every term says what it needs and what it does; she answers by the score alone, no hidden roll. */
export function getPeaceTerms(state, factionId) {
  const faction = state.factions[factionId], relation = readRelation(state, state.playerId, factionId), me = state.factions[state.playerId];
  if (!faction?.alive || faction.isPlayer || relation.status !== 'war') return null;
  const feud = isBloodFeud(state, factionId);
  const rules = DIPLOMACY_RULES.terms, score = relation.war?.score || 0, talked = relation.talkTurn === state.turn;
  const block = feud ? '血海深仇，不死不休，绝不议和。' : state.ap < 1 ? say('apNeed', { ap: 1, left: state.ap }) : state.battle || state.turnContinuation ? '请先完成当前战场与战争阶段。' : talked ? '这回合已经谈过了。' : '';
  const white = diplomacyQuote(state, factionId, 'peace'), lands = factionTiles(state, factionId).length;
  const tiles = Math.max(0, Math.min(rules.landMax, 1 + Math.floor((score - rules.land) / rules.landStep))), ceded = score >= rules.land ? cessionTiles(state, factionId, tiles) : [];
  const gold = Math.min(faction.gold, Math.max(0, 8 + score)), vassalNeed = lands <= rules.vassalSmallTiles ? rules.vassalSmall : rules.vassal;
  const pay = Math.min(me.gold, 10 + Math.abs(Math.min(0, score)));
  const term = (id, name, need, reason, desc, effects = {}) => ({ id, name, need, enabled: !block && !reason, reason: block || reason, desc, effects, action: { type: 'makePeace', factionId, term: id } });
  return { factionId, score, since: relation.war?.since ?? relation.since, cb: relation.war?.cb || 'conquest', by: relation.war?.by || null, truce: TRUCE_TURNS,
    terms: [
      term('white', '停战', 0, white.willing ? '' : `她还不肯罢手（意愿 ${white.score}，要到 0）。`, `各自收兵，休战 ${TRUCE_TURNS} 回合，谁也不赔。`, { lines: white.lines, score: white.score }),
      term('gold', '索赔', rules.gold, score < rules.gold ? `战争分数要到 ${rules.gold}。` : gold < 1 ? '她的国库是空的。' : '', `她赔 ${gold} 金币，然后休战 ${TRUCE_TURNS} 回合。`, { gold }),
      term('land', '割地', rules.land, score < rules.land ? `战争分数要到 ${rules.land}。` : !ceded.length ? '她没有挨着你的非首都领土。' : '', ceded.length ? `她割让 ${ceded.length} 块挨着你的领土（${ceded.join('、')}），然后休战 ${TRUCE_TURNS} 回合。每多 ${rules.landStep} 分多割一块，最多 ${rules.landMax} 块。` : `她割让挨着你的领土。每多 ${rules.landStep} 分多割一块，最多 ${rules.landMax} 块。`, { tiles: ceded }),
      term('vassal', '臣服', vassalNeed, score < vassalNeed ? `战争分数要到 ${vassalNeed}${lands <= rules.vassalSmallTiles ? '' : `（她只剩 ${rules.vassalSmallTiles} 块地以下时只要 ${rules.vassalSmall}）`}。` : '', `${C.libertyDetail} ${C.annexDetail}`, { tribute: tributeOf(state, faction) }),
      term('pay', '赔款求和', rules.pay, score > rules.pay ? `战况没有那么糟：战争分数跌到 ${rules.pay} 以下她才肯收钱罢兵。` : pay < 5 ? '你的金币连赔款都凑不出。' : '', `你赔 ${pay} 金币，换休战 ${TRUCE_TURNS} 回合。`, { gold: -pay }),
    ] };
}
export function getPeaceDealQuote(state, factionId, selection = {}) {
  const sheet = getPeaceTerms(state, factionId), faction = state.factions[factionId], rules = DIPLOMACY_RULES.terms;
  if (!sheet) return { enabled: false, reason: C.invalidAction, options: [], action: null, cost: { ap: 1 } };
  const tiles = Array.isArray(selection.tiles) ? selection.tiles : [], gold = selection.gold === true, vassal = selection.vassal === true;
  const options = cessionTiles(state, factionId, rules.landMax);
  const connected = new Set(factionTiles(state, state.playerId).map(t => t.key)), remaining = [...tiles];
  while (remaining.length) {
    const index = remaining.findIndex(key => state.tiles[key] && neighbors(state.tiles[key]).some(p => connected.has(p.key)));
    if (index < 0) break; connected.add(remaining.splice(index, 1)[0]);
  }
  const points = (gold ? rules.gold : 0) + (tiles.length ? rules.land + (tiles.length - 1) * rules.landStep : 0) + (vassal ? sheet.terms.find(t => t.id === 'vassal').need : 0);
  const white = !gold && !vassal && !tiles.length;
  const reason = new Set(tiles).size !== tiles.length || tiles.length > rules.landMax || tiles.some(key => !options.includes(key)) || remaining.length || vassal && tiles.length ? C.batchInvalid
    : white && !sheet.terms.find(t => t.id === 'white').enabled ? sheet.terms.find(t => t.id === 'white').reason
    : points > Math.max(0, sheet.score) ? `${C.peaceScore} ${points} / ${sheet.score}`
    : sheet.terms.find(t => t.id === (vassal ? 'vassal' : gold ? 'gold' : tiles.length ? 'land' : 'white'))?.reason || affordable(state, { ap: 1 });
  return { factionId, enabled: !reason, reason, score: sheet.score, points, options, gold: gold ? sheet.terms.find(t => t.id === 'gold').effects.gold : 0, tiles, vassal, cost: { ap: 1, gold: 0, supply: 0 }, action: { type: 'peaceDeal', factionId, selection: { tiles, gold, vassal }, expectedRevision: state.revision } };
}
/* ---------- 议和条约 (2026-11-15). Terms combine like a treaty and are paid for with war score. Land is priced as a share of
   the giver's realm (a city or a developed tile weighs more), so a late-game rout can take a third of a large nation while a
   tiny one cannot be swallowed for free. Behind in the war, the same sheet becomes what you offer her to stop. ---------- */
const TREATY = Object.freeze({ gold: 12, installments: 15, installmentShare: .3, installmentTurns: 12, perCaptive: 5, trade: 8, giveTrade: 5, perFort: 4, alliances: 10, techBase: 6, techTier: 2, pay: Object.freeze({ '0.25': 8, '0.5': 16, '1': 30 }), minTile: 3 });
function treatyTileValue(state, tile) { return 1 + (tile.building ? (tile.buildingLevel || 1) * .5 : 0) + (state.campaign?.cities?.[tile.key] ? 2 : 0) + Math.min(2, (tile.troops || 0) / 25); }
function treatyLand(state, fromId, toId) {
  const land = factionTiles(state, fromId).filter(tile => !tile.shipId), total = land.reduce((sum, tile) => sum + treatyTileValue(state, tile), 0) || 1;
  // Only land joined to the receiver, directly or through other land in the same treaty, can change hands.
  const held = new Set(factionTiles(state, toId).map(tile => tile.key)), open = new Set(), queue = [...held];
  for (let i = 0; i < queue.length; i++) for (const p of neighbors(state.tiles[queue[i]])) { const tile = state.tiles[p.key]; if (tile?.ownerId === fromId && !tile.isCapital && !tile.shipId && walkable(state, tile) && !open.has(tile.key)) { open.add(tile.key); queue.push(tile.key); } }
  const points = Object.fromEntries([...open].map(key => state.tiles[key]).map(tile => [tile.key, Math.max(TREATY.minTile, Math.round(treatyTileValue(state, tile) / total * 100))]));
  const share = Object.fromEntries(land.map(tile => [tile.key, treatyTileValue(state, tile) / total]));
  // Only land that touches the receiver (or land already being handed over in the same treaty) can change hands.
  const reachable = keys => { const held = new Set(factionTiles(state, toId).map(tile => tile.key)), left = [...keys]; let moved = true; while (moved && left.length) { moved = false; for (let i = 0; i < left.length; i++) if (neighbors(state.tiles[left[i]]).some(p => held.has(p.key))) { held.add(left[i]); left.splice(i, 1); moved = true; i--; } } return !left.length; };
  return { options: Object.keys(points), points, share, reachable };
}
function bestTechGap(state, fromId, toId) {
  const known = new Set(state.campaign?.research?.[toId]?.known || []);
  return (state.campaign?.research?.[fromId]?.known || []).map(id => techById(id)).filter(t => t && !known.has(t.id) && t.prerequisites.every(p => known.has(p))).sort((a, b) => b.tier - a.tier || b.gold - a.gold)[0] || null;
}
/** What a treaty with this nation would do and cost in war score. draft: { tiles:[], gold, installments, vassal, captives, trade, forts, tech, alliances, pay:0|.25|.5|1 } */
export function getTreatyQuote(state, factionId, draft = {}) {
  const sheet = getPeaceTerms(state, factionId), faction = state.factions[factionId], me = state.factions[state.playerId];
  if (!sheet || !faction) return { enabled: false, reason: '双方现在没有在交战。', items: [], land: null, points: 0, score: 0, demand: true, action: null };
  const score = sheet.score, demand = score > 0, relation = readRelation(state, state.playerId, factionId), items = [];
  const item = (id, name, points, detail, reason = '') => items.push({ id, name, points, detail, enabled: !reason, reason, on: Boolean(draft[id]) && !reason });
  let land;
  if (demand) {
    const gold = Math.floor(faction.gold * .5), perTurn = Math.floor(Math.max(0, netIncome(state, factionId).gold) * TREATY.installmentShare);
    item('gold', '赔款', TREATY.gold, `她交出国库的一半：${gold} 金`, gold < 5 ? '她的国库快空了。' : '');
    item('installments', '分期赔偿', TREATY.installments, `之后 ${TREATY.installmentTurns} 回合，她每回合交出三成收入（现在约 ${perTurn} 金）`, perTurn < 1 ? '她现在没有正收入。' : '');
    const vassalNeed = sheet.terms.find(t => t.id === 'vassal')?.need || DIPLOMACY_RULES.terms.vassal;
    item('vassal', '臣服', vassalNeed, '她成为你的附庸：每回合上缴八成产出，随你出战');
    const mine = Object.entries(state.captives || {}).filter(([, c]) => c.captorId === factionId && c.originalFactionId === state.playerId).map(([id]) => id);
    item('captives', '放回俘虏', TREATY.perCaptive * Math.max(1, mine.length), mine.length ? `她关着的 ${mine.map(id => state.characters[id]?.name).join('、')} 回来` : '', mine.length ? '' : '她没有关着你的人。');
    item('trade', '本币通商', TREATY.trade, '两国通商，她的贸易改用你的货币：本币结算 +10', relation.trade ? '你们已经在通商。' : '');
    const mineKeys = new Set(factionTiles(state, state.playerId).map(t => t.key)), forts = factionTiles(state, factionId).filter(t => t.building === 'fort' && neighbors(t).some(p => mineKeys.has(p.key)));
    item('forts', '拆掉边境要塞', TREATY.perFort * Math.max(1, forts.length), forts.length ? `拆掉挨着你的 ${forts.length} 座要塞` : '', forts.length ? '' : '她挨着你的地方没有要塞。');
    const tech = bestTechGap(state, factionId, state.playerId);
    item('tech', '交出科技', tech ? TREATY.techBase + tech.tier * TREATY.techTier : TREATY.techBase, tech ? `你学会「${tech.name}」` : '', tech ? '' : '她没有你能直接学的科技。');
    const allies = Object.entries(state.relations || {}).filter(([key, rel]) => key.split('|').includes(factionId) && !key.split('|').includes(state.playerId) && rel.status === 'ally').length;
    item('alliances', '退出她的同盟', TREATY.alliances, allies ? `她和 ${allies} 个国家的同盟作废` : '', allies ? '' : '她没有盟友。');
    land = treatyLand(state, factionId, state.playerId);
  } else {
    const options = [.25, .5, 1].map(share => ({ share, gold: Math.floor(me.gold * share), points: TREATY.pay[String(share)] }));
    const pay = options.find(o => o.share === draft.pay) || null;
    items.push({ id: 'pay', name: '赔款', points: pay?.points || 0, detail: pay ? `你交出 ${pay.gold} 金` : '交出国库的一部分', enabled: me.gold >= 5, reason: me.gold >= 5 ? '' : '你的金币不够。', on: Boolean(pay) && me.gold >= 5, options });
    const hers = Object.entries(state.captives || {}).filter(([, c]) => c.captorId === state.playerId && c.originalFactionId === factionId).map(([id]) => id);
    item('captives', '放回她的人', TREATY.perCaptive * Math.max(1, hers.length), hers.length ? `${hers.map(id => state.characters[id]?.name).join('、')} 回去` : '', hers.length ? '' : '你没有关着她的人。');
    const tech = bestTechGap(state, state.playerId, factionId);
    item('tech', '交出科技', tech ? TREATY.techBase + tech.tier * TREATY.techTier : TREATY.techBase, tech ? `她学会「${tech.name}」` : '', tech ? '' : '没有她能直接学的科技。');
    item('trade', '通商', TREATY.giveTrade, '两国开始通商', relation.trade ? '你们已经在通商。' : '');
    land = treatyLand(state, state.playerId, factionId);
  }
  const tiles = Array.isArray(draft.tiles) ? draft.tiles.filter(key => land.points[key]) : [];
  const landPoints = tiles.reduce((sum, key) => sum + land.points[key], 0), landShare = tiles.reduce((sum, key) => sum + land.share[key], 0);
  const points = items.filter(i => i.on).reduce((sum, i) => sum + i.points, 0) + landPoints;
  const need = Math.abs(score), anything = points > 0;
  const white = sheet.terms.find(t => t.id === 'white');
  const reason = isBloodFeud(state, factionId) ? '血海深仇，不死不休，绝不议和。' : state.ap < 1 ? say('apNeed', { ap: 1, left: state.ap }) : sheet.terms[0]?.reason && /回合|战场/.test(sheet.terms[0].reason) && !sheet.terms[0].enabled ? sheet.terms[0].reason
    : tiles.length && !land.reachable(tiles) ? '割让的地要连着接收方的领土。'
    : draft.vassal && tiles.length && demand ? '臣服和割地二选一：附庸保留自己的领土。'
    : demand ? (points > need ? `条款要 ${points} 分，你只有 ${need} 分。` : !anything && white && !white.enabled && score <= 0 ? white.reason : '')
      : score === 0 && !anything ? (white?.enabled ? '' : white?.reason || '她还不想停。') : points < need ? `给她的只值 ${points} 分，要凑够 ${need} 分她才肯停。` : '';
  const clean = { tiles, ...Object.fromEntries(items.filter(i => i.on && i.id !== 'pay').map(i => [i.id, true])), ...(draft.pay && items.find(i => i.id === 'pay')?.on ? { pay: draft.pay } : {}) };
  return { factionId, score, demand, need, points, items, land: { ...land, tiles, landPoints, landShare }, enabled: !reason, reason, cost: { ap: 1, gold: 0, supply: 0 }, action: { type: 'treaty', factionId, draft: clean, expectedRevision: state.revision } };
}
/** Installments and currency terms that outlive the treaty. */
function tickTreaties(state) {
  // Saves without any treaty stay byte-identical: the list exists only while someone is paying.
  const c = state.campaign; if (!c?.reparations) return;
  c.reparations = c.reparations.filter(r => r.until >= state.turn && state.factions[r.from]?.alive && state.factions[r.to]?.alive);
  if (!c.reparations.length) { delete c.reparations; return; }
  for (const r of c.reparations) {
    const paid = Math.min(state.factions[r.from].gold, Math.floor(Math.max(0, netIncome(state, r.from).gold) * r.share));
    if (paid > 0) { state.factions[r.from].gold -= paid; state.factions[r.to].gold += paid; }
  }
}
/** Posting a resident envoy: free, like an office, and she has to be at the capital to be sent. */
export function getEnvoyQuote(state, factionId, characterId) {
  const faction = state.factions[factionId], relation = readRelation(state, state.playerId, factionId), current = state.envoys?.[factionId] || null;
  const tile = characterId ? stationOf(state, characterId) : null, home = state.factions[state.playerId]?.capitalKey, elsewhere = characterId ? Object.entries(state.envoys || {}).find(([where, who]) => who === characterId && where !== factionId) : null;
  const reason = state.battle || state.turnContinuation ? '请先完成当前战场与战争阶段。'
    : !faction?.alive || faction.isPlayer ? '请选择仍存在的其他国家。'
    : isBloodFeud(state, factionId) ? '血海深仇，不死不休，无法派驻使节。'
    : characterId === null ? (current ? '' : '这里没有派驻使节。')
    : !factionTiles(state, factionId).some(item => item.discovered) ? '还没遇见她们。'
    : relation.status === 'war' ? '交战中不能派驻使节。'
    : !canServe(state, characterId, state.playerId) ? '只有可用的己方角色能出使。'
    : characterId === state.activeHeroId ? '领军不能出使。' : characterId === state.companionId ? '副将不能出使。'
    : Object.values(state.posts || {}).includes(characterId) ? '她正担任职位，先卸任。'
    : current === characterId ? '她已经在那里了。'
    : !elsewhere && tile?.key !== home ? `先让她回到首都 ${home}，才能出使。` : '';
  const effect = characterId && !reason ? envoyEffect({ ...state, envoys: { ...(state.envoys || {}), [factionId]: characterId } }, factionId, characterId) : current ? envoyEffect(state, factionId, current) : null;
  return { factionId, characterId, current, enabled: !reason, reason, effect, cost: { ap: 0, gold: 0, supply: 0 }, action: { type: 'assignEnvoy', factionId, characterId } };
}
/** Folding a loyal vassal into the realm: time served, real goodwill, and a price by her size. */
export function getVassalCharacterQuote(state, factionId, characterId = undefined) {
  const faction = state.factions[factionId], candidates = faction ? membersOf(state, factionId) : [];
  const id = characterId === undefined ? faction?.leaderId : characterId, cost = { ap: 1, gold: 0, supply: 0 };
  const reason = state.battle || state.turnContinuation ? C.invalidAction
    : !faction?.alive || !isVassal(state, factionId) || !candidates.includes(id) ? F.vassal_invalid
      : candidates.length < 2 ? F.vassal_last
        : Object.values(state.campaign?.flights || {}).some(f => f.pilotIds.includes(id)) ? F.vassal_busy
          : affordable(state, cost);
  return { factionId, characterId: id, candidates, cost, liberty: 25, enabled: !reason, reason,
    action: { type: 'requisitionLeader', factionId, characterId: id, expectedRevision: state.revision } };
}
export function getAnnexQuote(state, factionId) {
  const quote = annexConditions(state, factionId);
  const reason = quote.reason || (quote.active ? `${C.integration} ${quote.active.progress}/${quote.active.total}` : affordable(state, quote.cost));
  return { ...quote, factionId, tiles: factionTiles(state, factionId).length, girls: membersOf(state, factionId).length, enabled: !reason && !quote.active, reason, action: { type: 'annexVassal', factionId, expectedRevision: state.revision } };
}
export function getMoveCapitalQuote(state,key) {
  const city=state.campaign.cities[key],tile=state.tiles[key],me=state.factions[state.playerId];
  const cost={ap:2,gold:180+factionTiles(state,state.playerId).length*5,supply:20};
  const reason=state.battle||state.turnContinuation?C.invalidAction:tile?.ownerId!==state.playerId||city?.ownerId!==state.playerId||!city.mayorId||city.liberty>=35||tile.isCapital?C.capitalInvalid
    :Object.values(state.factions).some(f=>f.alive&&atWar(state,state.playerId,f.id))?C.needPeace
    :me.capitalRecoveryUntil>state.turn?say('capitalCooldown',{turns:me.capitalRecoveryUntil-state.turn}):affordable(state,cost);
  return {enabled:!reason,reason,cost,action:{type:'moveCapital',key,expectedRevision:state.revision}};
}

const KIND_NAME = { chat: '寒暄', peace: '停战', trade: '通商', pact: '互不侵犯', ally: '结盟', demand: '索要进贡', gift: '送礼' };
export const GIFT_TIERS = [[10, 6], [25, 14], [50, 25]];
export const DEMAND_INTERVAL = 6;
/** One quote for the existing gift slips and the real payment. Money opens a court, not lasting trust. */
function diplomaticGifts(state, factionId, relation) {
  const faction = state.factions[factionId], mine = state.factions[state.playerId], rules = DIPLOMACY_RULES, feud = isBloodFeud(state, factionId);
  const scale = Math.sqrt(Math.max(realmScale(state, state.playerId), realmScale(state, factionId)));
  const warmer = leadQuirk(state, 'q_envoy') ? 2 : 0, met = factionTiles(state, factionId).some(tile => tile.discovered);
  return GIFT_TIERS.map(([baseGold, baseFavor]) => {
    const gold = Math.ceil(baseGold * scale);
    const favor = Math.max(0, Math.min(rules.giftCap - relation.favor, Math.floor((baseFavor + warmer) / (relation.favor >= rules.giftSoftCap ? 2 : 1))));
    return { gold, favor, enabled: !feud && faction.alive && relation.talkTurn !== state.turn && met && mine.gold >= gold && favor > 0 };
  });
}
const moodOf = relation => relation.status === 'war' || relation.favor < -20 ? 'angry' : relation.favor < 25 ? 'calm' : 'normal';
/** Everything the talks screen needs about one nation. */
export function getRelation(state, factionId) {
  const faction = state.factions[factionId], relation = readRelation(state, state.playerId, factionId);
  if (!faction || faction.isPlayer) return null;
  const met = factionTiles(state, factionId).some(tile => tile.discovered), talked = relation.talkTurn === state.turn, grace = graceBlock(state, state.playerId, factionId), feud = isBloodFeud(state, factionId);
  const offers = [];
  const offer = (kind, reason = '') => {
    const quote = diplomacyQuote(state, factionId, kind), block = state.ap < 1 ? say('apNeed', { ap: 1, left: state.ap }) : !faction.alive ? '这个国家当前没有可会谈的政府。' : feud ? '血海深仇，不死不休。' : reason || (talked ? '这回合已经谈过了。' : !met ? '还没遇见她们。' : '');
    offers.push({ kind, label: KIND_NAME[kind], ...quote, cost: { ap: 1, gold: 0, supply: 0 }, enabled: !block, reason: block,
      ...(kind === 'demand' ? { effects: { gold: Math.min(20, faction.gold), favor: -10, demandUntil: state.turn + DEMAND_INTERVAL, interval: DEMAND_INTERVAL } } : {}) });
  };
  offer('chat');
  const vassal = relation.status === 'vassal';
  if (relation.status === 'war') offer('peace');
  else {
    if (!relation.trade) offer('trade');
    if (['neutral', 'truce'].includes(relation.status)) offer('pact');
    if (relation.status !== 'ally' && !vassal) offer('ally');
    if (!vassal) offer('demand', (relation.demandUntil || 0) > state.turn ? `上次进贡后需休整，到第 ${relation.demandUntil} 回合才能再次索取。` : faction.gold < 1 ? '对方国库没有可支付的金币。' : '');
  }
  const envoy = state.envoys?.[factionId] || null;
  return { factionId, status: relation.status, statusName: feud && relation.status === 'war' ? '不死不休' : STATUS_NAME[relation.status], bloodFeud: feud, favor: relation.favor, until: relation.until, since: relation.since, trade: relation.trade, mood: moodOf(relation), met, talked, grace, offers,
    canDeclare: relation.status !== 'war' && !vassal && !grace && met, breaksTreaty: ['pact', 'truce', 'ally'].includes(relation.status), borders: bordering(state, state.playerId, factionId), power: frontierMusterPower(state, factionId), myPower: frontierMusterPower(state, state.playerId), gifts: diplomaticGifts(state, factionId, relation),
    // Everything below is the deeper layer: why she feels this way, what a war is worth, what ties bind.
    attitude: attitudeOf(state, factionId), notes: (relation.notes || []).map(note => ({ ...note })).reverse(),
    war: relation.status === 'war' ? { score: relation.war?.score || 0, cb: relation.war?.cb || 'conquest', by: relation.war?.by || null, since: relation.war?.since ?? relation.since } : null,
    peace: getPeaceTerms(state, factionId), reasons: relation.status !== 'war' && !vassal ? getWarReasons(state, factionId) : [],
    vassal: vassal ? { since: relation.since, liberty: faction.liberty || 0, resources: tributeResources(state, faction), tribute: tributeOf(state, faction), annex: getAnnexQuote(state, factionId) } : null,
    envoy: envoy ? { characterId: envoy, ...envoyEffect(state, factionId, envoy) } : null };
}
function affordable(state, cost, factionId = state.playerId, useAP = true) {
  const faction = state.factions[factionId];
  if (useAP && state.ap < (cost.ap || 0)) return say('apNeed', { ap: cost.ap, left: state.ap });
  if (faction.gold < (cost.gold || 0)) return `需要 ${cost.gold} 金币。`;
  if (faction.supply < (cost.supply || 0)) return `需要 ${cost.supply} 补给。`;
  return '';
}
function pay(state, cost, factionId = state.playerId, useAP = true) {
  requireThat(!affordable(state, cost, factionId, useAP), affordable(state, cost, factionId, useAP));
  state.factions[factionId].gold -= cost.gold || 0;
  state.factions[factionId].supply -= cost.supply || 0;
  if (useAP) state.ap -= cost.ap || 0;
}
function playerTile(state, key) {
  const tile = state.tiles[key];
  requireThat(tile?.ownerId === state.playerId, '请选择自己的领土。');
  return tile;
}
function coordinateFromAction(action) {
  if (typeof action.key === 'string' && /^-?\d+,-?\d+$/.test(action.key)) {
    const [q, r] = action.key.split(',').map(Number);
    requireThat(coordValid(q) && coordValid(r), '地块坐标无效。');
    return { q, r, key: tileKey(q, r) };
  }
  requireThat(coordValid(action.q) && coordValid(action.r), '需要 key:"q,r" 或整数 q、r。');
  return { q: action.q, r: action.r, key: tileKey(action.q, action.r) };
}

export function starterBandMembers(band = 'togenashi') {
  const chosen = own(STARTER_BANDS, band) ? band : 'togenashi', spec = STARTER_BANDS[chosen], group = spec.group || chosen;
  const rest = (spec.members || CHARACTER_DEFINITIONS.filter(character => character.group === group).map(character => character.id)).filter(id => id !== spec.leader);
  return [spec.leader, ...rest];
}

/** Which start the world map opens on: the one asked for, else one the seed picks. */
function earthStart(seed, start) {
  const spec = EARTH.starts.find(item => item.id === start) || EARTH.starts[Math.floor(hash(seed, 0, 0, 'earth-start') * EARTH.starts.length)];
  return { map: 'earth', start: spec.id, origin: { col: spec.col, row: spec.row } };
}
/** 世界地图 opening: the lord on the start cell, each first neighbour 4–6 steps away on land she can walk to,
 * as far from the others as the land allows; an island start borrows the nearest other land. Three tiles each. */
function earthHomes(state, ids) {
  const order = ['meadow', 'plains', 'forest', 'coast', 'hills', 'pine', 'jungle', 'wetland', 'oasis', 'tundra', 'desert', 'ruins', 'salt', 'volcanic', 'crystal', 'snow', 'mountain'];
  const terrain = (q, r) => worldTerrainAt(state, q, r), rank = (q, r) => { const i = order.indexOf(terrain(q, r)); return i < 0 ? 99 : i; };
  const passable = (q, r) => { const id = terrain(q, r); return !!id && !!state.terrainTypes[id]?.passable; };
  const reach = new Map([[tileKey(0, 0), { q: 0, r: 0 }]]), queue = [{ q: 0, r: 0 }];
  while (queue.length) for (const next of neighbors(queue.shift())) {
    if (reach.has(next.key) || hexDistance(next) > 9 || !passable(next.q, next.r)) continue;
    reach.set(next.key, { q: next.q, r: next.r }); queue.push(next);
  }
  const taken = new Set(), homes = {}, capitals = [];
  const room = cell => neighbors(cell).filter(next => passable(next.q, next.r) && !taken.has(next.key));
  const claim = (id, center) => {
    const cells = [center, ...room(center).sort((a, b) => rank(a.q, a.r) - rank(b.q, b.r) || hash(state.seed, a.q, a.r, 'home') - hash(state.seed, b.q, b.r, 'home')).slice(0, 2)];
    for (const cell of cells) taken.add(tileKey(cell.q, cell.r));
    homes[id] = cells.map(cell => [cell.q, cell.r]); capitals.push(center);
  };
  claim(ids[0], { q: 0, r: 0 });
  const anyLand = hexArea(0, 0, 24).filter(cell => inWorld(state, cell.q, cell.r) && passable(cell.q, cell.r));
  for (const id of ids.slice(1)) {
    let best = null;
    for (const [pool, gapMin, far] of [[[...reach.values()], 4, 6], [[...reach.values()], 4, 8], [[...reach.values()], 3, 9], [anyLand, 3, 24]]) {
      for (const cell of pool) {
        const d = hexDistance(cell), gap = Math.min(...capitals.map(c => hexDistance(cell, c)));
        if (d < 3 || d > far || gap < gapMin || taken.has(tileKey(cell.q, cell.r)) || room(cell).length < 2) continue;
        const score = Math.min(gap, 7) * 10 - Math.abs(d - 5) * 4 - d * (pool === anyLand ? 3 : 0) - rank(cell.q, cell.r) * .4 + hash(state.seed, cell.q, cell.r, id);
        if (!best || score > best.score) best = { cell, score };
      }
      if (best) break;
    }
    requireThat(best, '世界地图上找不到足够的陆地开局。');
    claim(id, best.cell);
  }
  return homes;
}
export function createGame(seed = 'mistbound', { band = 'togenashi', name = null, mods = [], map = 'endless', start = null } = {}) {
  const normalizedSeed = String(seed).slice(0, 128) || 'mistbound';
  // The chosen band becomes the player's people; if it was one of the four starting homelands, the first arrival takes over their old home.
  const chosen = own(STARTER_BANDS, band) ? band : 'togenashi', guide = STARTER_BANDS[chosen].leader;
  const standIn = FACTION_DEFINITIONS.some(definition => !definition.isPlayer && definition.id === chosen) ? ARRIVALS[0] : null;
  const party = starterBandMembers(chosen);
  const nationName = String(name ?? '').trim().slice(0, 16);
  const owners = Object.fromEntries(CHARACTER_DEFINITIONS.map(character => [character.id, STARTING_OWNERS[character.id] || null]));
  for (const id of party) owners[id] = 'lord';
  if (standIn) for (const character of CHARACTER_DEFINITIONS) if (character.group === standIn.id && !standIn.wanderers?.includes(character.id)) owners[character.id] = standIn.id;
  const world = map === 'earth' ? earthStart(normalizedSeed, start) : null;
  const state = {
    schemaVersion: 1, rulesVersion: RULES_VERSION, seed: normalizedSeed, turn: 1, ap: 8, maxAP: 8, playerId: 'lord', activeHeroId: guide, companionId: null, ...(world ? { world } : {}),
    tiles: {}, terrainTypes: mapById(TERRAIN_DEFINITIONS), characters: mapById(CHARACTER_DEFINITIONS), factions: {},
    recruitedHeroIds: party, capturedCapitalIds: [], status: 'playing',
    logs: [], history: [], revision: 0, eventSeq: 0, relations: {}, notices: [], noticeSeq: 0, inbox: [], arrivalQueue: [], lastBirthTurn: 0, fogRolls: 0, loadedMods: [],
    metrics: { land: 0, infrastructure: 0, wealth: 0, conquests: 0 }, milestone: { level: 1, completed: 0, baseline: { land: 0, infrastructure: 0, wealth: 0, conquests: 0 } },
    chronicle: [], chronicleArchive: { entries: 0, firstTurn: 0, lastTurn: 0, byType: {} }, exileCount: 0, lastWorldEventTurn: 0,
    characterOwners: owners, captives: {}, captivityVersion: CAPTIVITY_VERSION, captureHistory: {}, battle: null, turnContinuation: null,
    management: { mode: 'off', reserve: 20 }, gachaCount: 0, storySeen: [], pendingEvent: null, customEvents: [], growth: {}, pairs: {}, posts: Object.fromEntries(POSTS.map(post => [post.id, null])), talkTurn: 0, arrivalIndex: standIn || chosen === ARRIVALS[0]?.id ? 1 : 0, levelSeq: 0, levelLog: [],
    marchOrders: [], orderSeq: 0, edicts: [], prison: { autoSecure: false }, envoys: {},
  };
  for (const [id, owner] of Object.entries(owners)) if (owner) state.growth[id] = newGrowth(1);
  const nations = [...FACTION_DEFINITIONS.filter(definition => definition.id !== chosen).map(definition => definition.isPlayer ? { ...definition, leaderId: guide, name: nationName || definition.name } : definition), ...(standIn ? [{ id: standIn.id, name: standIn.name, color: standIn.color, leaderId: standIn.leaderId, personality: standIn.personality, isPlayer: false }] : [])];
  for (const definition of nations) {
    state.factions[definition.id] = { ...clone(definition), gold: definition.isPlayer ? 28 : 22, supply: definition.isPlayer ? 18 : 16, alive: true, graceUntilTurn: OPENING_PEACE, capitalKey: null, capitalHistory: [], capitalMoves: 0, defeats: 0, revivals: 0, foundedTurn: 1 };
  }
  // New worlds only: the seed picks among actual owned, available members. This
  // changes neither their ownership/station nor the player's chosen guide.
  for (const [id, leaderId] of Object.entries(selectNpcRepresentatives(state))) state.factions[id].leaderId = leaderId;
  revealArea(state, 0, 0, world ? 6 : 5);
  const startTerrain = world ? [] : [
    [0, 0, 'plains'], [1, 0, 'meadow'], [0, 1, 'forest'], [-1, 0, 'hills'], [1, -1, 'coast'], [2, -1, 'ruins'],
    [2, 0, 'oasis'], [0, 2, 'jungle'], [-1, 2, 'wetland'], [-2, 1, 'pine'], [-2, 0, 'mountain'], [0, -2, 'tundra'],
    [1, -2, 'snow'], [2, -2, 'crystal'], [-1, -1, 'desert'], [3, -2, 'volcanic'], [-2, 2, 'salt'], [0, -3, 'lake'],
  ];
  for (const [q, r, terrainId] of startTerrain) ensureTile(state, q, r).terrainId = terrainId;
  const fixedHomes = { lord: [[0, 0], [1, 0], [0, 1]], mujica: [[4, -4], [3, -4], [4, -3]], kessoku: [[4, 0], [5, 0], [5, -1]], mygo: [[-4, 0], [-5, 0], [-5, 1]], togenashi: [[-4, 4], [-3, 4], [-4, 5]] };
  if (standIn) { fixedHomes[standIn.id] = fixedHomes[chosen]; delete fixedHomes[chosen]; }
  // On the world map the four first neighbours stand wherever the real land around the start allows.
  const homes = world ? earthHomes(state, Object.keys(fixedHomes)) : fixedHomes;
  for (const [id, cells] of Object.entries(homes)) {
    cells.forEach(([q, r], index) => {
      const tile = ensureTile(state, q, r, true);
      if (!state.terrainTypes[tile.terrainId].passable) tile.terrainId = 'plains';
      tile.ownerId = id; tile.troops = index === 0 ? (id === 'lord' ? 9 : 7) : 3;
      if (index === 0) { chooseCapital(state, id, tile); tile.elite = id === 'lord' ? { R: 1, SR: 0, SSR: 0 } : { R: 2, SR: 1, SSR: 0 }; }
    });
  }
  for (const id of [...party, ...Object.keys(state.characterOwners)]) if (state.characterOwners[id]) seatAtHome(state, id);
  log(state, `${state.characters[guide].name}陪你从一座小城开始。先让相邻地块的人移民开拓，再建设经济或招募。`, 'guide');
  log(state, `第 ${OPENING_PEACE} 回合之前谁也不能开战，之后要先宣战才能打。`, 'diplomacy');
  // Workshop content is chosen before a run starts: characters wander free, nations wait their turn in the fog.
  for (const mod of mods) {
    if (!validateMod(mod, state).ok) continue;
    for (const character of mod.characters || []) {
      state.characters[character.id] = normalizeCharacter(character);
      if (!own(state.characterOwners, character.id)) state.characterOwners[character.id] = null;
    }
    for (const terrain of mod.terrains || []) state.terrainTypes[terrain.id] = normalizeTerrain(terrain);
    state.customEvents.push(...clone(mod.events || []));
    state.arrivalQueue.push(...clone(mod.factions || []));
    state.loadedMods.push({ id: mod.id, name: mod.name || mod.id, turn: 1 });
  }
  migrateCampaign(state);
  return state;
}

/** Land from a mod has no list to be on, so anything goes there. */
export function canBuild(state, tile, id) {
  return !isWater(tile) && canBuildOnTerrain(tile, id) && !advancedBuildingReason(state, tile, id);
}
/** A bounded domestic planner: it spends the same AP and prices as clicking each project. */
function developmentChoice(state, mode, reserve) {
  const faction = state.factions[state.playerId], owned = factionTiles(state, state.playerId);
  const income = getIncome(state, state.playerId), upkeep = maintenance(state, state.playerId), netFood = income.supply - upkeep.supply;
  const urgentFood = netFood < 2 || faction.supply < Math.max(12, -netFood * 4), choices = [];
  const needFort = !owned.some(tile => tile.building === 'fort') && owned.length >= 4 && !urgentFood;
  const weights = urgentFood || mode === 'supply' ? { gold: 1, supply: 8 } : mode === 'economy' ? { gold: 4, supply: 1 } : { gold: 3, supply: 2 };
  for (const tile of owned) {
    if (tile.cutSince !== undefined) continue;
    const before = getTileStats(state, tile.key);
    const options = (!tile.building || BUILDINGS[tile.building]?.emergency) && tile.troops >= MIN_BUILD
      ? Object.values(BUILDINGS).filter(building => !building.emergency && canBuild(state, tile, building.id)).map(building => ({ action: { type: 'build', key: tile.key, building: building.id }, cost: constructionCost(state, tile, building.id), building: building.id, level: 1 }))
      : tile.building && (tile.buildingLevel || 1) < (BUILDINGS[tile.building].maxLevel || 5) && tile.troops >= handsNeeded(tile)
        ? [{ action: { type: 'upgrade', key: tile.key }, cost: improvementCost(state, tile), building: tile.building, level: (tile.buildingLevel || 1) + 1 }] : [];
    for (const option of options) {
      if (affordable(state, option.cost) || faction.gold - option.cost.gold < reserve) continue;
      const changed = { ...tile, building: option.building, buildingLevel: option.level };
      const tiles = Object.create(state.tiles); tiles[tile.key] = changed;
      const after = getTileStats({ ...state, tiles }, tile.key), goldGain = after.gold - before.gold, supplyGain = after.supply - before.supply;
      const fort = option.building === 'fort' && needFort && !tile.isCapital;
      const score = fort ? 100 : (goldGain * weights.gold + supplyGain * weights.supply) / Math.max(1, option.cost.gold + option.cost.supply * 3);
      if (score <= 0 || (mode === 'supply' && supplyGain <= 0 && !fort)) continue;
      choices.push({ ...option, score, label: `${tile.key} · ${option.action.type === 'build' ? '建造' : '升级'}${BUILDINGS[option.building].name}${option.action.type === 'upgrade' ? ` ${option.level}级` : ''}` });
    }
  }
  choices.sort((a, b) => b.score - a.score || a.action.key.localeCompare(b.action.key) || a.building.localeCompare(b.building));
  return choices[0] || null;
}
function developmentSettings(state, options = {}) {
  const mode = options.mode ?? (state.management?.mode === 'off' ? 'balanced' : state.management?.mode) ?? 'balanced';
  const reserve = options.reserve ?? state.management?.reserve ?? 20;
  requireThat(['balanced', 'economy', 'supply'].includes(mode), '请选择均衡、经济或补给内政方针。');
  requireThat(integer(reserve, 0, 1000000000), '保留金币必须为 0 到 10亿之间的整数。');
  return { mode, reserve };
}
export function getDevelopmentPlan(state, options = {}) {
  const { mode, reserve } = developmentSettings(state, options), actions = [], cost = { ap: 0, gold: 0, supply: 0 };
  if (state.battle || state.turnContinuation) return { actions, cost, mode, reserve };
  const next = { ...state, tiles: { ...state.tiles }, factions: { ...state.factions, [state.playerId]: { ...state.factions[state.playerId] } } };
  for (let step = 0; step < 3 && next.ap; step++) {
    const pick = developmentChoice(next, mode, reserve);
    if (!pick) break;
    actions.push({ action: pick.action, label: pick.label, cost: pick.cost });
    pay(next, pick.cost);
    next.tiles[pick.action.key] = { ...next.tiles[pick.action.key], building: pick.building, buildingLevel: pick.level };
    for (const key of Object.keys(cost)) cost[key] += pick.cost[key] || 0;
  }
  return { actions, cost, mode, reserve };
}
function developRealm(state, options = {}) {
  const plan = getDevelopmentPlan(state, options);
  for (const item of plan.actions) { executeAction(state, item.action); checkProgress(state); }
  return plan;
}
export function getMapTiles(state) { return Object.values(state.tiles).sort((a, b) => a.r - b.r || a.q - b.q); }
export function getStats(state) {
  const tiles = factionTiles(state, state.playerId);
  const faction = state.factions[state.playerId];
  const buildings = tiles.filter(t => !!t.building).length;
  const capturedCapitals = state.capturedCapitalIds.length;
  // This private dataflow lives only inside this synchronous query, never on state.
  const gross = getIncome(state, state.playerId, tiles);
  const administration = getAdministration(state, state.playerId, tiles, gross.gold);
  const upkeep = maintenance(state, state.playerId, true, { tiles, administration });
  const buildingLevels = tiles.reduce((sum, tile) => sum + (tile.building ? tile.buildingLevel || 1 : 0), 0);
  return {
    territories: tiles.length, troops: Object.values(state.tiles).filter(t=>t.ownerId===state.playerId).reduce((sum,t)=>sum+t.troops,0), buildings, capturedCapitals,
    gold: faction.gold, supply: faction.supply, income: { gold: gross.gold - upkeep.gold, supply: gross.supply - upkeep.supply }, maintenance: upkeep,
    supplyMarket: getSupplyQuote(state, 20), armyTraining: armyTrainingQuote(state, state.playerId, { land: tiles.length, gross, upkeep }), administration, management: { ...(state.management || { mode: 'off', reserve: 20 }) },
    factionsAlive: Object.values(state.factions).filter(f => f.alive).length,
    discoveredTiles: Object.values(state.tiles).filter(t => t.discovered).length, canUndo: state.history.length > 0,
    progress: { chapter: state.milestone.level, completed: state.milestone.completed, plans: progressPlans(state), reward: progressPlans(state)[0].reward, nextWorldEventTurn: (Math.floor(state.turn / 8) + 1) * 8, rebuilds: state.exileCount, buildingLevels },
    sazai: { N: Object.values(state.tiles).filter(t=>t.ownerId===state.playerId).reduce((sum,t)=>sum+t.troops,0), ...factionElites(state, state.playerId) }, forts: tiles.filter(t => t.building === 'fort').length, fortNetwork: fortNetwork(state, state.playerId), capitalBare: !girlsOn(state.tiles[faction.capitalKey] || {}).length, cutOff: tiles.filter(t => t.cutSince !== undefined).length, recruitPool: wanderers(state).length, gachaCount: state.gachaCount, girlRate: girlRate(state), posts: state.posts, talkLeft: state.talkTurn !== state.turn,
    party: { heroId: state.activeHeroId, companionId: state.companionId, availableIds: state.recruitedHeroIds.filter(id => canServe(state, id, state.playerId)), paroledIds: state.recruitedHeroIds.filter(id => state.characterOwners[id] === state.playerId && isOnParole(state, id)), imprisonedIds: Object.values(state.captives).filter(captive => captive.originalFactionId === state.playerId).map(captive => captive.characterId), heldIds: Object.values(state.captives).filter(captive => captive.captorId === state.playerId).map(captive => captive.characterId) },
  };
}

function wanderers(state) { return Object.keys(state.characters).filter(id => state.characterOwners[id] === null && !state.captives[id] && !state.campaign?.prison?.[id]); }
function regularGuardOf(state, tile, defense) {
  if(tile?.shipId)return tile.troops>0;
  if (!tile?.ownerId || tile.building !== 'fort') return false;
  const service = militaryStatus(state, tile);
  return tile.troops > 0 || (service.ready && RARE_RANKS.some(rank => service.available[rank] > 0));
}
/** The shared non-character guard rule. UI and both sides' real attacks use it. */
export function getRegularGuard(state, key) {
  const tile = state.tiles[key];
  return Boolean(tile?.ownerId) && regularGuardOf(state, tile, getTileStats(state, key));
}
function combatActionCost(state, factionId, useAP, selected) {
  const vanguard = useAP && factionId === state.playerId ? selected.find(id => quirkIs(state, id, 'q_van') && growthOf(state, id).vanTurn !== state.turn) || null : null;
  return { vanguard, cost: { ap: vanguard ? 0 : 2, gold: 0, supply: hasEdict(state, 'war', factionId) ? 0 : 2 } };
}
function calculateBattle(state, fromKey, toKey, troops, factionId = state.playerId, useAP = true, girls = undefined) {
  const from = state.tiles[fromKey], to = state.tiles[toKey];
  requireThat(from && to, '请选择有效的出征地与目标地块。');
  requireThat(from.ownerId === factionId, '出征地必须属于己方。');
  requireThat(to.ownerId && to.ownerId !== factionId, '进攻目标必须属于其他国家。');
  requireThat(walkable(state, to) || to.shipId, '无法向湖泊进军。');
  requireThat(hexDistance(from, to) === 1, '只能进攻相邻地块。');
  requireThat(!useAP || to.discovered, '请先探索目标地块。');
  const selected = attackingIds(state, from, girls), defenders = combatIds(state, girlsOn(to), to.ownerId);
  const attackingTroops = troops === undefined ? from.troops - (from.shipId ? 0 : marchGuard(from)) : troops, marching = selected.length;
  requireThat(attackingTroops !== 0 || marching > 0, '尚未选择出征军士或同伴。');
  requireThat(integer(attackingTroops, marching ? 0 : 1, 100), '至少需要 2 名驻军才能出征，出征时必须保留 1 名守军。');
  requireThat(attackingTroops <= from.troops - (from.shipId ? 0 : marchGuard(from)), '出征地必须保留至少 1 名守军。');
  requireThat(!to.shipId || from.shipId, C.shipOcean);
  const best = (tile, stat) => Math.max(0, ...armyOf(state, tile).map(hero => hero.stats[stat]));
  const attackPower = attackingTroops + Math.max(0, ...from.field.map(id => heroView(state, id).stats.attack));
  const defensePower = to.troops + getTileStats(state, to.key).defense + best(to, 'defense');
  // Pressing from several sides, or hitting land cut off from home, shows up as battle morale.
  const defense = getTileStats(state, to.key);
  const regularGuard = regularGuardOf(state, to, defense);
  const occupy = !armyOf(state, to).length && !regularGuard;
  const flank = Math.min(2, neighbors(to).filter(point => { const tile = state.tiles[point.key]; return tile?.ownerId === factionId && (walkable(state, tile) || tile.shipId); }).length - 1), isolated = to.cutSince !== undefined ? 1 : 0, stranded = from.cutSince !== undefined ? 1 : 0;
  const willWin = attackPower > defensePower;
  const attackerLoss = willWin ? Math.min(attackingTroops - 1, Math.ceil(defensePower * 0.45)) : Math.min(attackingTroops, Math.max(1, Math.ceil(defensePower * 0.55)));
  const defenderLoss = willWin ? to.troops : Math.min(Math.max(0, to.troops - 1), Math.max(1, Math.floor(attackPower * 0.4)));
  const { vanguard, cost } = combatActionCost(state, factionId, useAP, selected);
  const reason = peaceReason(state, factionId, to.ownerId) || (from.foughtTurn === state.turn ? '这支军队这回合打过了。' : '') || affordable(state, cost, factionId, useAP);
  const attacker = tacticalForceSummary({ troops: attackingTroops, characters: selected.map(id => heroView(state, id)), roster: serviceRoster(state, from), trainingLevel: serviceTraining(state, from), morale: flank - stranded });
  const defender = tacticalForceSummary({ troops: to.troops, characters: defenders.map(id => heroView(state, id)), roster: serviceRoster(state, to), trainingLevel: serviceTraining(state, to), morale: -isolated, defenseBonus: defense.defense });
  return { ok: true, canAttack: !reason, reason, fromKey, toKey, attackingTroops, attackPower, defensePower, willWin, attackerLoss, defenderLoss, survivors: attackingTroops - attackerLoss, targetRemaining: to.troops - defenderLoss, cost, vanguard, flank, isolated, stranded, occupy, protectedBy: defense.protectedBy, supportDefense: defense.supportDefense, regularGuard,
    commanders: { attacker: selected, defender: defenders },
    forces: { attacker, defender, ratio: attacker.rating / Math.max(1, defender.rating), approximate: true }, siege: defense.fort?.siegeReady ? tacticalSiegeProfile(defense.fort.level) : null };
}
export function previewAttack(state, fromKey, toKey, troops, girls) {
  try { return calculateBattle(state, fromKey, toKey, troops, state.playerId, true, girls); }
  catch (error) { return { ok: false, canAttack: false, error: error.message, reason: error.message }; }
}
/** Salvage uses the cheapest uninflated investment, never today's empire price or treasury.
 * Rebuilding and raiding the same site always destroys value, including after conquest. */
function raidSalvage(tile) {
  const building = BUILDINGS[tile?.building], level = tile?.buildingLevel || 1;
  if (!building) return { gold: 0, supply: 0 };
  let gold = building.emergency ? 0 : Math.max(4, building.gold - 4), supply = building.supply;
  for (let prior = 1; prior < level; prior++) { gold += 6 + prior * 5; supply += prior; }
  return { gold: Math.floor(gold * .35), supply: Math.floor(supply * .5) };
}
/** Fixed residual asset value. Services, characters and spent consumables are not assets. */
export const LIQUIDATION_RARE_VALUES = Object.freeze({ R: 1, SR: 3, SSR: 5 });
function liquidationQuote(state, action, factionId = state.playerId, { settlement = false, detailed = true } = {}) {
  const key = action?.key, tile = typeof key === 'string' && own(state.tiles, key) ? state.tiles[key] : null;
  const asset = action?.asset, rank = action?.rank, amount = action?.amount;
  let reason = !state.factions[factionId] || !tile || tile.ownerId !== factionId ? '请选择本国资产。'
    : !settlement && (state.battle || state.turnContinuation) ? '请先完成当前战场与战争阶段。'
    : !settlement && !tile.discovered ? '请先探索此地。'
    : !settlement && tile.foughtTurn === state.turn ? '本回合作战后需先结算维护，下回合可变卖。'
    : !settlement && action.expectedRevision !== state.revision ? '局势已变化，请重新确认。' : '';
  const candidate = tile ? { ...tile, elite: { ...(tile.elite || {}) } } : null;
  let gold = 0, label = '';
  if (!reason) {
    if (asset === 'building') {
      const building = own(BUILDINGS, tile.building) && BUILDINGS[tile.building], level = tile.buildingLevel;
      if (!building || !Number.isInteger(level) || level < 1 || level > (building.maxLevel || 5)) reason = '这里没有可变卖的建筑。';
      else {
        gold = raidSalvage(tile).gold; label = `${level} 级${building.name}`;
        candidate.infrastructurePeak = Math.max(tile.infrastructurePeak || 0, level);
        candidate.building = null; candidate.buildingLevel = 0;
        delete candidate.fortMothballed; delete candidate.fortReadyTurn;
      }
    } else if (asset === 'road') {
      if (tile.road !== true) reason = '这里没有道路。';
      else { gold = Math.floor((6 + Math.max(0, state.terrainTypes[tile.terrainId].defense) * 2) * .35); label = '道路'; delete candidate.road; }
    } else if (asset === 'elite') {
      if (!own(LIQUIDATION_RARE_VALUES, rank) || !Number.isSafeInteger(amount) || amount < 1 || !Number.isSafeInteger(tile.elite?.[rank]) || amount > tile.elite[rank]) reason = '请选择有效稀有队伍与数量。';
      else { gold = amount * LIQUIDATION_RARE_VALUES[rank]; label = `${amount} 队 ${rank}`; candidate.elite[rank] -= amount; }
    } else reason = '请选择建筑、道路或稀有队伍。';
  }
  if (!reason && (!Number.isSafeInteger(gold) || state.factions[factionId].gold > Number.MAX_SAFE_INTEGER - gold)) reason = '资源库存已达安全存档上限。';
  const cost = { ap: 0, gold: 0, supply: 0 }, refund = { gold: reason ? 0 : gold, supply: 0 };
  const quotedAction = { type: 'liquidate', key, asset, ...(asset === 'elite' ? { rank, amount } : {}), expectedRevision: state.revision };
  if (reason) return { enabled: false, reason, cost, refund, action: quotedAction };
  // Compact menu discovery shares every guard, but never computes world previews.
  if (!detailed) return { enabled: true, reason: '', label, cost, refund, action: quotedAction };
  const projected = { ...state, tiles: { ...state.tiles, [key]: candidate } };
  const snapshot = world => ({ gold: state.factions[factionId].gold, supply: state.factions[factionId].supply,
    elite: { ...(world.tiles[key].elite || {}) }, road: !!world.tiles[key].road, residents: world.tiles[key].troops, stats: tileStats(world, world.tiles[key]), netIncome: netIncome(world, factionId), maintenance: maintenance(world, factionId) });
  const before = snapshot(state), after = snapshot(projected); after.gold += gold;
  const defenseChanges = factionTiles(state, factionId).filter(t => settlement || t.discovered).map(t => ({ key: t.key, before: tileStats(state, t).defense, after: tileStats(projected, projected.tiles[t.key]).defense })).filter(t => t.before !== t.after);
  return { enabled: true, reason: '', label, cost, refund, before, after, defenseChanges, action: quotedAction };
}
export function getLiquidationQuote(state, action, factionId = state.playerId) { return liquidationQuote(state, action, factionId); }
function executeLiquidation(state, action, factionId = state.playerId, options = {}) {
  const quote = liquidationQuote(state, action, factionId, options); requireThat(quote.enabled, quote.reason);
  const tile = state.tiles[action.key];
  if (action.asset === 'building') {
    tile.infrastructurePeak = Math.max(tile.infrastructurePeak || 0, tile.buildingLevel);
    tile.building = null; tile.buildingLevel = 0; delete tile.fortMothballed; delete tile.fortReadyTurn;
  } else if (action.asset === 'road') delete tile.road;
  else tile.elite[action.rank] -= action.amount;
  state.factions[factionId].gold += quote.refund.gold;
  return quote;
}
export function previewRaid(state, fromKey, toKey, troops, girls) {
  const preview = previewAttack(state, fromKey, toKey, troops, girls), tile = state.tiles[toKey];
  const reason = preview.reason || preview.error || (!tile?.building ? '这里没有可劫掠的建筑。' : '');
  return { ...preview, canAttack: Boolean(preview.ok && !reason), reason, mission: 'raid', building: tile?.building || null, level: tile?.buildingLevel || 0, loot: raidLoot(state, state.tiles[fromKey], tile) };
}
/** Salvage, plus half again when a 掠夺 girl marches with the raiders. */
function raidLoot(state, from, to) {
  const loot = raidSalvage(to);
  return armyQuirk(state, from, 'q_loot') ? { gold: Math.floor(loot.gold * 1.5), supply: Math.floor(loot.supply * 1.5) } : loot;
}
function plunderBuilding(state, from, to, factionId) {
  requireThat(to.building, '这里没有可劫掠的建筑。');
  const building = to.building, level = to.buildingLevel || 1, loot = raidLoot(state, from, to), faction = state.factions[factionId];
  requireThat(faction.gold <= Number.MAX_SAFE_INTEGER - loot.gold && faction.supply <= Number.MAX_SAFE_INTEGER - loot.supply, '资源库存已达安全存档上限。');
  // A ruined fort remains a historical capital site, but loses its fortification.
  // Credited infrastructure survives destruction, so a rebuild cannot farm milestones.
  to.infrastructurePeak = Math.max(to.infrastructurePeak || 0, level);
  to.building = null; to.buildingLevel = 0; to.food = 0;
  faction.gold += loot.gold; faction.supply += loot.supply; from.foughtTurn = state.turn;
  scoreWar(state, factionId, to.ownerId, DIPLOMACY_RULES.score.raid);
  log(state, `${faction.name}劫掠 ${to.key}，摧毁 ${level} 级${BUILDINGS[building].name}，回收 ${loot.gold} 金币、${loot.supply} 补给后撤回；土地归属不变。`, 'war', [factionId, to.ownerId]);
  if (to.ownerId === state.playerId) notice(state, 'land', `${to.key} 的${BUILDINGS[building].name}被劫掠摧毁，可重建或免费改作应急田圃。`, { key: to.key });
  return { raided: true, fromKey: from.key, toKey: to.key, building, level, loot };
}
/** Apply compulsory retreat to real capacity and account for every ordinary or rare survivor. */
function evacuateDefenders(state, originKey, factionId, survivors, girls = [], fleeing = {}) {
  const plan = planRetreat(state, originKey, factionId, survivors, fleeing.elite || {});
  const rested = tile => { tile.marchedTurn = state.turn; tile.foughtTurn = state.turn; };
  for (const placement of plan.placements) { const tile = state.tiles[placement.key]; tile.troops = placement.after; rested(tile); }
  for (const placement of plan.elitePlacements) { const tile = state.tiles[placement.key]; addElite(tile, placement.rank, placement.count); rested(tile); }
  const refuge = state.tiles[plan.refugeKey];
  if (refuge && girls.length) { refuge.field.push(...girls); rested(refuge); }
  const rare = Object.values(fleeing.elite || {}).reduce((n,v) => n+v,0), lostRare = Object.values(plan.demobilizedElites).reduce((n,v) => n+v,0);
  if (survivors || rare) {
    const destinations = plan.placements.map(item => `${item.key}（${item.troops}人）`).join('、');
    log(state, `${state.factions[factionId].name}从 ${originKey} 撤离 ${survivors} 名幸存军士${destinations ? `，安置到 ${destinations}` : ''}${plan.demobilized ? `；驻地容量不足，${plan.demobilized} 人退役离队` : ''}${rare ? `；稀有分队安置 ${rare-lostRare} 队${lostRare ? `，容量不足解散 ${lostRare} 队` : ''}` : ''}。接收撤军的军团本回合不能再次行军或出征。`, 'war');
    if (factionId === state.playerId && (plan.demobilized || lostRare)) notice(state, 'land', `撤退军队遇到容量不足：${plan.placed} 人转移至其他驻地，${plan.demobilized} 人退役离队${lostRare ? `，${lostRare} 支稀有分队解散` : ''}。`, { key: plan.refugeKey || originKey });
  }
  return plan;
}
/** Taking a capital frightens every court that hears of it. */
function capitalDread(state, fallenId) {
  for (const other of Object.values(state.factions)) if (other.alive && !other.isPlayer && other.id !== fallenId && !isVassal(state, other.id) && factionTiles(state, other.id).some(tile => tile.discovered)) changeFavor(state, state.playerId, other.id, DIPLOMACY_RULES.capitalFall, '攻陷别国首都');
}
/** A winning army moves in; whoever is left on the other side falls back to the nearest land still theirs. */
function takeTile(state, from, to, factionId, soldiers, staying, leaving, leaders) {
  let nation = null;
  if (to.shipId) {
    const room = Math.max(0, SHIP_MODELS[state.campaign.ships[to.shipId].modelId].capacity - leaders.length - staying);
    const boarding = Math.min(soldiers, room);
    from.troops += soldiers - boarding;
    soldiers = boarding;
  }
  if (factionId === state.playerId && to.isCapital && to.capitalOf === to.ownerId) rememberOccupation(state, to.ownerId, to.key);
  const defenderId = to.ownerId, refugees = { elite: to.elite }, girls = girlsOn(to).filter(id => canServe(state, id, defenderId));
  scoreWar(state, factionId, defenderId, to.isCapital && to.capitalOf === defenderId ? DIPLOMACY_RULES.score.capital : DIPLOMACY_RULES.score.tile);
  // Land the player lost stays a grievance until it is back; land the player takes stops being one.
  if (defenderId === state.playerId) to.claim = state.turn; else if (factionId === state.playerId) delete to.claim;
  const rescued = to.isCapital && to.capitalOf === defenderId ? Object.values(state.captives).filter(captive => captive.captorId === defenderId).map(captive => captive.characterId) : [];
  if(state.campaign?.armies?.[from.key]&&(state.campaign.armies[from.key].goal?(state.campaign.armies[from.key].goal.girls.some(id=>leaders.includes(id))||!state.campaign.armies[from.key].goal.girls.length&&!from.field.length):leaders.length||!from.field.length)){state.campaign.armies[to.key]=state.campaign.armies[from.key];delete state.campaign.armies[from.key];}
  from.field = from.field.filter(id => !leaders.includes(id)); from.foughtTurn = state.turn;
  if (to.building === 'fort') to.fortReadyTurn = state.turn + 2;
  to.militaryReserve = Boolean(from.militaryReserve); to.militaryReadyTurn = from.militaryReadyTurn || 0;
  to.acquiredTurn = state.turn;
  to.ownerId = factionId; if (to.shipId) Object.assign(state.campaign.ships[to.shipId],{ownerId:factionId,movedTurn:state.turn,goal:null}); to.troops = Math.max(to.shipId ? 0 : 1, Math.min(100, staying + soldiers)); to.food = 0; to.garrison = []; to.field = [...leaders]; delete to.elite; delete to.cutSince; to.marchedTurn = state.turn; to.foughtTurn = state.turn;
  if (from.elite) mergeElite(to, from);
  evacuateDefenders(state, to.key, defenderId, leaving, girls, refugees);
  if (factionId === state.playerId) {
    creditTerritory(state, to);
    const known = new Set(Object.values(state.tiles).filter(tile => tile.discovered).map(tile => tile.key));
    revealArea(state, to.q, to.r, 1);
    nation = fogBirth(state, Object.values(state.tiles).filter(tile => tile.discovered && !known.has(tile.key)).map(tile => tile.key));
    changeFavor(state, factionId, defenderId, -4, '夺取领土');
  }
  if (to.isCapital && to.capitalOf === defenderId) {
    if (factionId === state.playerId) { state.metrics.conquests++; if (!state.capturedCapitalIds.includes(defenderId)) state.capturedCapitalIds.push(defenderId); capitalDread(state, defenderId); }
    recordChronicle(state, `${state.factions[factionId].name}占领了${state.factions[defenderId].name}的首都 ${to.key}。`, 'war', defenderId, [factionId, defenderId]);
    for (const id of rescued) releaseCharacter(state, id, '在首都解放后获救');
  }
  return nation;
}
/** Land handed over at the peace table: half the people leave with their nation's girls and rare squads, the rest stay on as subjects. */
function cedeTile(state, tile, toId) {
  const fromId = tile.ownerId, girls = girlsOn(tile).filter(id => canServe(state, id, fromId)), refugees = { elite: tile.elite }, leaving = Math.floor(tile.troops / 2);
  if (tile.building === 'fort') tile.fortReadyTurn = state.turn + 2;
  tile.acquiredTurn = state.turn;
  tile.ownerId = toId; tile.troops = Math.max(1, tile.troops - leaving); tile.food = 0; tile.garrison = []; tile.field = []; delete tile.elite; delete tile.cutSince; delete tile.claim;
  tile.militaryReserve = true; tile.militaryReadyTurn = 0;
  evacuateDefenders(state, tile.key, fromId, leaving, girls, refugees);
  if (toId === state.playerId) { tile.discovered = true; creditTerritory(state, tile); revealArea(state, tile.q, tile.r, 1); }
}
/** No serviceable character, standing force or legacy site guard: direct civilian occupation. */
function occupyTile(state, outcome, factionId, leaders) {
  const from = state.tiles[outcome.fromKey], to = state.tiles[outcome.toKey], defenderId = to.ownerId, residents = to.troops, leaving = Math.floor(residents / 2);
  from.troops -= outcome.attackingTroops;
  if (!to.isCapital) log(state, `${state.factions[factionId].name}占领了 ${to.key}，这里没有可参战守备，没有发生战斗。`, 'war', [factionId, defenderId]);
  const nation = takeTile(state, from, to, factionId, outcome.attackingTroops, residents - leaving, leaving, leaders);
  if (defenderId === state.playerId) notice(state, 'land', `${state.factions[factionId].name}占领了 ${to.key}：那里没有可参战守备，敌军直接进城了。`, { key: to.key });
  checkProgress(state);
  return { occupied: true, fromKey: from.key, toKey: to.key, nation };
}
/** What a force is worth when two AI nations settle things without a board. */
function clashStrength(state, tile, soldiers, leaders = null, bonus = 0) {
  const girls = combatIds(state, leaders || girlsOn(tile), tile.ownerId).map(id => heroView(state, id));
  const training = regularTrainingProfile(serviceTraining(state, tile));
  // Reserves behind the six deployed slots add no hidden power. The public
  // summary and real tactical battle share this same hero/rare/ordinary roster.
  const units = tacticalForceSummary({ troops: soldiers, characters: girls, roster: serviceRoster(state, tile), trainingLevel: training.level }).units;
  const regulars = units.filter(unit => !unit.characterId);
  const rarePower = regulars.reduce((sum, unit) => sum + ({ R: 2, SR: 4, SSR: 6 }[unit.rank] || 0), 0);
  const trained = regulars.length * (training.attack + training.defense + training.level - 1 + (training.mixed ? 2 : 0));
  return soldiers + rarePower + girls.reduce((sum, hero) => sum + 6 + hero.stats.attack + hero.stats.defense + hero.level, 0) + trained + bonus;
}
const holdBonus = (state, tile) => getTileStats(state, tile.key).defense * 2 + (tile.isCapital ? 5 : 0);
/** AI against AI: the bigger number wins. Fallen commanders may be taken; the rest get away. */
function clash(state, outcome, factionId, leaders, mission = 'conquest') {
  const from = state.tiles[outcome.fromKey], to = state.tiles[outcome.toKey], defenderId = to.ownerId;
  const attack = clashStrength(state, from, outcome.attackingTroops, leaders, outcome.flank * 3) * clashTech(state, factionId, 'attack'), defend = clashStrength(state, to, to.troops, null, holdBonus(state, to)) * clashTech(state, defenderId, 'defense');
  const attackRoll = .85 + hash(state.seed, state.turn, state.eventSeq, 'clash.attack.' + to.key) * .3, defendRoll = .85 + hash(state.seed, state.turn, state.eventSeq, 'clash.defend.' + to.key) * .3;
  const won = attack * attackRoll > defend * defendRoll, ratio = Math.min(attack, defend) / Math.max(1, attack, defend);
  const hurt = count => Math.min(Math.max(0, count - 1), Math.ceil(count * .5 * ratio));
  const defenders = outcome.commanders.defender;
  const winnerId = won ? factionId : defenderId, loserId = won ? defenderId : factionId, winners = won ? leaders : defenders, losers = won ? defenders : leaders, tag = `clash.${state.turn}.${state.eventSeq + 1}.${to.key}`;
  let taken = losers.filter((id, index) => canServe(state, id, loserId) && hash(state.seed, state.turn, index, tag) < .6).slice(0, 2);
  if(loserId===state.playerId&&!state.recruitedHeroIds.some(id=>canServe(state,id,state.playerId)&&!taken.includes(id)))taken=taken.slice(1);
  for (const id of taken) {
    captureCharacter(state, id, winnerId, loserId, tag);
    recordChronicle(state, `${state.characters[id].name}被${state.factions[winnerId].name}俘虏了。`, 'capture', loserId, [winnerId, loserId]);
  }
  for (const id of [...winners, ...losers]) {
    if (taken.includes(id) || !own(state.characters, id)) continue;
    const growth = ensureGrowth(state, id), victor = winners.includes(id);
    growth.battles++; growth.wins += victor ? 1 : 0; gainExp(state, id, victor ? 30 : 15);
  }
  from.foughtTurn = state.turn; to.foughtTurn = state.turn;
  // Snapshot before captures: removing a hero must not retroactively deploy a reserve.
  const beaten = won ? to : from, deployed = won ? outcome.forces.defender.units : outcome.forces.attacker.units;
  const rare = deployed.find(unit => ['SSR', 'SR', 'R'].includes(unit.rank))?.rank;
  if (rare) addElite(beaten, rare, -1);
  let raid = null;
  if (won && mission === 'raid') {
    from.troops -= hurt(outcome.attackingTroops);
    to.troops = Math.max(1, Math.floor(to.troops * .3));
    raid = plunderBuilding(state, from, to, factionId);
  } else if (won) {
    const soldiers = outcome.attackingTroops - hurt(outcome.attackingTroops), leaving = Math.floor(to.troops * .3);
    from.troops -= outcome.attackingTroops;
    if (!to.isCapital) log(state, `${state.factions[factionId].name}打下了${state.factions[defenderId].name}的 ${to.key}。`, 'war', [factionId, defenderId]);
    takeTile(state, from, to, factionId, soldiers, 0, leaving, leaders.filter(id => !taken.includes(id)));
  } else {
    from.troops = Math.max(1, from.troops - Math.ceil(outcome.attackingTroops * .7)); from.foughtTurn = state.turn;
    to.troops -= hurt(to.troops);
    log(state, `${state.factions[defenderId].name}挡住了${state.factions[factionId].name}对 ${to.key} 的进攻。`, 'war', [factionId, defenderId]);
  }
  checkProgress(state);
  return { clash: true, won, attack, defend, fromKey: from.key, toKey: to.key, ...(raid || {}) };
}
function resolveBattle(state, fromKey, toKey, troops, factionId = state.playerId, useAP = true, girls = undefined, mission = 'conquest') {
  const outcome = calculateBattle(state, fromKey, toKey, troops, factionId, useAP, girls);
  requireThat(outcome.canAttack, outcome.reason);
  requireThat(mission !== 'raid' || state.tiles[toKey].building, '这里没有可劫掠的建筑。');
  pay(state, outcome.cost, factionId, useAP);
  if (outcome.vanguard) ensureGrowth(state, outcome.vanguard).vanTurn = state.turn;
  const from = state.tiles[fromKey], to = state.tiles[toKey], defenderId = to.ownerId;
  const leaders = outcome.commanders.attacker;
  if (outcome.occupy && mission === 'raid') { const detail = plunderBuilding(state, from, to, factionId); if (factionId === state.playerId) changeFavor(state, factionId, defenderId, -4, '劫掠'); return detail; }
  if (outcome.occupy) return occupyTile(state, outcome, factionId, leaders);
  if (factionId===state.playerId&&armyMode(state,fromKey)==='free'||defenderId===state.playerId&&armyMode(state,toKey)==='free'||factionId!==state.playerId&&defenderId!==state.playerId) return clash(state, outcome, factionId, leaders, mission);
  const battle = createTacticalBattle({ id: `battle.${state.turn}.${state.revision}.${state.eventSeq + 1}.${fromKey}.${toKey}`, seed: state.seed,
    mission, environment: state.campaign?.armies?.[fromKey]?.travel === 'air' || state.campaign?.armies?.[toKey]?.travel === 'air' ? 'air' : to.terrainId === 'ocean' || from.terrainId === 'ocean' ? 'sea' : 'land', innateFlyIds: Object.keys(state.characters).filter(id => mobilityOf(state, id).air), siegeLevel: outcome.siege?.level || 0,
    attackerId: factionId, defenderId, fromKey, toKey, playerId: [factionId, defenderId].includes(state.playerId) ? state.playerId : factionId,
    attackingTroops: outcome.attackingTroops, defendingTroops: to.troops, sourceTroopsBefore: from.troops, terrainId: to.terrainId,
    attackerTrainingLevel: serviceTraining(state, from), defenderTrainingLevel: serviceTraining(state, to),
    defenseBonus: getTileStats(state, toKey).defense, attackerCharacters: leaders.map(id => heroView(state, id)), defenderCharacters: outcome.commanders.defender.map(id => heroView(state, id)),
    attackerRoster: serviceRoster(state, from), defenderRoster: serviceRoster(state, to), attackerMorale: outcome.flank - outcome.stranded, defenderMorale: -outcome.isolated,
    tech: { attacker: combatTech(state, factionId), defender: combatTech(state, defenderId) } });
  if (factionId === state.playerId) changeFavor(state, factionId, defenderId, -4, '进攻');
  if (defenderId === state.playerId && state.turnContinuation) state.turnContinuation.defended = true;
  state.battle = battle; state.history = [];
  decorateBattleResult(state, battle);
  log(state, `${state.factions[factionId].name}与${state.factions[defenderId].name}在 ${to.key} 交战，请指挥战场分队。`, 'war');
  return { battleId: battle.id, startedBattle: true, fromKey, toKey };
}
function decorateBattleResult(state, battle) {
  if (battle.phase !== 'result') return;
  const result = battle.result, loserSide = result.winnerSide === 'attacker' ? 'defender' : 'attacker';
  result.capturedCharacterIds = result.capturedCharacterIds.filter(id => battle.participantIds[loserSide].includes(id) && canServe(state, id, result.loserId));
  // The player always keeps somebody: the last free girl gets away.
  if (result.loserId === state.playerId) {
    const free = state.recruitedHeroIds.filter(id => canServe(state, id, state.playerId) && !result.capturedCharacterIds.includes(id));
    if (!free.length) result.capturedCharacterIds = result.capturedCharacterIds.filter(id => id !== (result.capturedCharacterIds.includes(state.activeHeroId) ? state.activeHeroId : result.capturedCharacterIds[0]));
  }
  const to = battle.flightCombat ? null : state.tiles[battle.toKey];
  result.rescuedCharacterIds = battle.mission !== 'raid' && result.winnerSide === 'attacker' && to?.isCapital && to.capitalOf === battle.defenderId ? Object.values(state.captives).filter(captive => captive.captorId === battle.defenderId).map(captive => captive.characterId) : [];
}
function commitBattleResult(state, battle) {
  if (battle.flightCombat) return commitFlightBattle(state, battle);
  requireThat(battle.phase === 'result' && battle.result, '战斗尚未结束。');
  const result = battle.result, from = state.tiles[battle.fromKey], to = state.tiles[battle.toKey];
  const growthSuppressed = tacticalGrowthSuppressed(battle);
  const growthParticipants = tacticalGrowthParticipants(battle);
  const earnsGrowth = unit => growthParticipants === null || growthParticipants.includes(unit.id);
  const growthNote = growthSuppressed ? ' 未交战便撤退：双方不获得战斗经验、羁绊或共同作战次数；出战、胜负记录与疲劳照常结算。'
    : tacticalGrowthLimited(battle) ? ' 主动进攻后撤退：双方仅实际交战或有效支援的角色获得经验与羁绊，共同作战次数只计这些同伴；出战、胜负记录与疲劳照常结算。' : '';
  const known = battle.mission !== 'raid' && battle.attackerId === state.playerId && result.winnerSide === 'attacker' ? new Set(Object.values(state.tiles).filter(tile => tile.discovered).map(tile => tile.key)) : null;
  requireThat(from?.ownerId === battle.attackerId && to?.ownerId === battle.defenderId && from.troops === battle.sourceTroopsBefore && to.troops === battle.initialDefendingTroops, '战场与世界驻军状态不一致，无法重复结算。');
  for (const [side, tile] of [['attacker', from], ['defender', to]]) for (const [rank, count] of Object.entries(result.lostSazai?.[side] || {})) addElite(tile, rank, -count);
  scoreWar(state, result.winnerId, result.loserId, DIPLOMACY_RULES.score.battle);
  let raid = null;
  if (result.winnerSide === 'attacker' && battle.mission === 'raid') {
    from.troops -= battle.initialAttackingTroops - result.attackerSurvivors;
    // A raid destroys military resistance and the building, not the last civilian household.
    // Keep the same one-resident recovery floor used by other defensive outcomes.
    to.troops = Math.max(to.shipId ? 0 : 1, result.defenderSurvivors);
    raid = plunderBuilding(state, from, to, battle.attackerId);
  } else if (result.winnerSide === 'attacker') {
    const fleeing = { girls: girlsOn(to), elite: to.elite }, taken = new Set(result.capturedCharacterIds), went = battle.participantIds.attacker, marched = from.field.filter(id => went.includes(id) && !taken.has(id));
    const standing = { R: 0, SR: 0, SSR: 0 };
    for (const unit of battle.units) if (unit.side === 'attacker' && unit.hp > 0 && own(standing, unit.rank)) standing[unit.rank]++;
    if(state.campaign?.armies?.[from.key]&&(state.campaign.armies[from.key].goal?(state.campaign.armies[from.key].goal.girls.some(id=>marched.includes(id))||!state.campaign.armies[from.key].goal.girls.length&&!from.field.length):marched.length||!from.field.length)){state.campaign.armies[to.key]=state.campaign.armies[from.key];delete state.campaign.armies[from.key];}
    if(battle.attackerId===state.playerId&&to.isCapital)rememberOccupation(state,battle.defenderId,to.key);
    const boarding = to.shipId ? Math.min(result.attackerSurvivors, Math.max(0, SHIP_MODELS[state.campaign.ships[to.shipId].modelId].capacity - marched.length)) : result.attackerSurvivors;
    from.troops -= battle.initialAttackingTroops - (result.attackerSurvivors - boarding); from.field = from.field.filter(id => !marched.includes(id));
    scoreWar(state, battle.attackerId, battle.defenderId, to.isCapital && to.capitalOf === battle.defenderId ? DIPLOMACY_RULES.score.capital : DIPLOMACY_RULES.score.tile);
    if (battle.defenderId === state.playerId) to.claim = state.turn; else if (battle.attackerId === state.playerId) delete to.claim;
    if (to.building === 'fort') to.fortReadyTurn = state.turn + 2;
    to.militaryReserve = Boolean(from.militaryReserve); to.militaryReadyTurn = from.militaryReadyTurn || 0;
    to.acquiredTurn = state.turn;
    to.ownerId = battle.attackerId; if (to.shipId) Object.assign(state.campaign.ships[to.shipId],{ownerId:battle.attackerId,movedTurn:state.turn,goal:null}); to.troops = Math.max(to.shipId ? 0 : 1, boarding); to.food = 0; to.garrison = []; to.field = marched; delete to.elite; delete to.cutSince; to.marchedTurn = state.turn; to.foughtTurn = state.turn;
    for (const rank of RARE_RANKS) { const moved = Math.min(standing[rank], eliteOf(from)[rank]); if (moved) { addElite(from, rank, -moved); addElite(to, rank, moved); } }
    result.evacuation = evacuateDefenders(state, to.key, battle.defenderId, result.defenderSurvivors, fleeing.girls, fleeing);
    if (battle.attackerId === state.playerId) { creditTerritory(state, to); revealArea(state, to.q, to.r, 1); }
    if (to.isCapital && to.capitalOf === battle.defenderId) {
      if (battle.attackerId === state.playerId) {
        state.metrics.conquests++;
        if (!state.capturedCapitalIds.includes(battle.defenderId)) state.capturedCapitalIds.push(battle.defenderId);
        capitalDread(state, battle.defenderId);
      }
      recordChronicle(state, `${state.factions[battle.attackerId].name}攻占了${state.factions[battle.defenderId].name}的首都 ${to.key}。`, 'war', battle.defenderId);
      for (const id of result.rescuedCharacterIds) releaseCharacter(state, id, '在首都解放后获救');
    } else log(state, `${state.factions[battle.attackerId].name}控制 ${to.key}，幸存 ${result.attackerSurvivors} 名军士。`, 'war');
  } else {
    from.troops -= battle.initialAttackingTroops - result.attackerSurvivors;
    to.troops = Math.max(to.shipId ? 0 : 1, result.defenderSurvivors);
    log(state, `${state.factions[battle.defenderId].name}守住 ${to.key}，进攻方 ${result.attackerSurvivors} 名军士撤回驻地。${growthNote}`, 'war');
  }
  from.foughtTurn = state.turn; to.foughtTurn = state.turn;
  const fighters = battle.units.filter(unit => unit.characterId && own(state.characters, unit.characterId));
  for (const unit of fighters) {
    const growth = ensureGrowth(state, unit.characterId), won = unit.side === result.winnerSide;
    growth.battles++; growth.wins += won ? 1 : 0; growth.kills += unit.kills || 0; growth.spirit = Math.max(0, growth.spirit - 12);
    const ours = state.characterOwners[unit.characterId] === state.playerId;
    if (earnsGrowth(unit)) {
      gainExp(state, unit.characterId, (18 + (won ? 14 : 4) + (unit.kills || 0) * 12) * (ours ? 1 : 0.5));
      if (ours) addBond(state, unit.characterId, won ? 2 : 1);
    }
  }
  const mine = fighters.filter(unit => unit.side === battle.playerSide && earnsGrowth(unit)).map(unit => unit.characterId);
  for (let a = 0; a < mine.length; a++) for (let b = a + 1; b < mine.length; b++) state.pairs[pairKey(mine[a], mine[b])] = (state.pairs[pairKey(mine[a], mine[b])] || 0) + 1;
  for (const id of result.capturedCharacterIds) {
    if (!canServe(state, id, result.loserId)) continue;
    captureCharacter(state, id, result.winnerId, result.loserId, battle.id);
    recordChronicle(state, `${state.characters[id].name}在本场战斗后被${state.factions[result.winnerId].name}俘获。`, 'capture', result.loserId);
    if (result.winnerId === state.playerId) changeFavor(state, state.playerId, result.loserId, -15, '俘虏了她们的人');
    if (result.winnerId === state.playerId) notice(state, 'jail', `俘虏了${state.characters[id].name}。点这里处理，可以劝降、送回去或换赎金。`);
  }
  checkProgress(state);
  const nation = known ? fogBirth(state, Object.values(state.tiles).filter(tile => tile.discovered && !known.has(tile.key)).map(tile => tile.key)) : null;
  return { ...result, battleId: battle.id, nation, ...(raid || {}) };
}

function normalizeCharacter(character) {
  return { id: character.id, name: character.name.trim(), group: character.group || null, specialty: character.specialty || '', role: character.role || null, title: character.title || '来自雾境的旅人', color: character.color || '#a5b8bd', portrait: character.portrait || '', description: character.description || '', trait: character.trait || '自定义角色', stats: { attack: character.stats.attack, defense: character.stats.defense, scout: character.stats.scout, economy: character.stats.economy, charm: character.stats.charm || 0 } };
}
function normalizeTerrain(terrain) {
  return { id: terrain.id, name: terrain.name.trim(), color: terrain.color, icon: terrain.icon || terrain.name[0], yield: { gold: terrain.yield.gold, supply: terrain.yield.supply }, defense: terrain.defense, passable: terrain.passable, description: terrain.description || '' };
}
function characterErrors(value, at) {
  const errors = [];
  if (!isObject(value)) return [`${at} 必须是角色对象。`];
  if (!validId(value.id)) errors.push(`${at}.id 无效。`);
  if (!validName(value.name)) errors.push(`${at}.name 需要 1–80 个字符。`);
  if (value.color !== undefined && !validColor(value.color)) errors.push(`${at}.color 必须为 #rrggbb。`);
  if (value.stats?.charm !== undefined && !integer(value.stats.charm, 0, 12)) errors.push(`${at}.stats.charm 超出允许范围。`);
  if (value.role !== undefined && value.role !== null && !['vanguard', 'ranger', 'guard', 'support'].includes(value.role)) errors.push(`${at}.role 需要为 vanguard、ranger、guard 或 support。`);
  if (!isObject(value.stats)) errors.push(`${at}.stats 缺失。`);
  else for (const stat of ['attack', 'defense', 'scout', 'economy']) if (!integer(value.stats[stat], 0, stat === 'scout' ? 2 : 12)) errors.push(`${at}.stats.${stat} 超出允许范围。`);
  for (const field of ['title', 'description', 'trait', 'portrait']) if (value[field] !== undefined && (typeof value[field] !== 'string' || value[field].length > 4000)) errors.push(`${at}.${field} 需要不超过 4000 字符的文本。`);
  if (typeof value.portrait === 'string' && /^\s*(?:javascript|vbscript|data:text):/i.test(value.portrait)) errors.push(`${at}.portrait 不是可用图像地址。`);
  return errors;
}
function terrainErrors(value, at) {
  const errors = [];
  if (!isObject(value)) return [`${at} 必须是地形对象。`];
  if (!validId(value.id)) errors.push(`${at}.id 无效。`);
  if (!validName(value.name)) errors.push(`${at}.name 无效。`);
  if (!validColor(value.color)) errors.push(`${at}.color 必须为 #rrggbb。`);
  if (!isObject(value.yield) || !integer(value.yield.gold, 0, 8) || !integer(value.yield.supply, 0, 8)) errors.push(`${at}.yield 的 gold/supply 必须是 0–8 整数。`);
  if (!integer(value.defense, 0, 8)) errors.push(`${at}.defense 必须是 0–8 整数。`);
  if (typeof value.passable !== 'boolean') errors.push(`${at}.passable 必须是布尔值。`);
  for (const field of ['icon', 'description']) if (value[field] !== undefined && (typeof value[field] !== 'string' || value[field].length > 4000)) errors.push(`${at}.${field} 需要有效文本。`);
  return errors;
}
function storyEventErrors(event, at, characters) {
  const line = item => isObject(item) && (item.speaker === null || validId(item.speaker) && characters.has(item.speaker)) && typeof item.text === 'string' && item.text.length <= 400 && (item.expr === undefined || typeof item.expr === 'string' && item.expr.length <= 80);
  if (!isObject(event) || !validId(event.id) || !validName(event.title) || !Array.isArray(event.requires) || event.requires.length > 1000 || event.requires.some(id => !validId(id) || !characters.has(id)) || !integer(event.minTurn, 1, 100000)) return [`${at} 需要有效的 id、title、角色引用 requires 与 minTurn。`];
  if (!Array.isArray(event.lines) || !event.lines.length || event.lines.length > 100 || !event.lines.every(line) || !Array.isArray(event.choices) || !event.choices.length || event.choices.length > 4 || !event.choices.every(choice => isObject(choice) && validName(choice.label) && line(choice.reply) && (choice.effect === undefined || (isObject(choice.effect) && ['gold', 'supply', 'troops'].every(field => choice.effect[field] === undefined || integer(choice.effect[field], -200, 200)) && (choice.effect.sazai === undefined || ['N', 'R', 'SR', 'SSR'].includes(choice.effect.sazai)))))) return [`${at} 的台词、角色引用或选项无效。`];
  return [];
}
function wandererErrors(faction, at, characters) {
  if (faction.wanderers === undefined) return [];
  const ids = faction.wanderers;
  return !Array.isArray(ids) || ids.length > 1000 || ids.some(id => !validId(id) || !characters.has(id)) || new Set(ids).size !== ids.length
    ? [`${at}.wanderers 必须是不重复的已知角色 ID 数组。`] : [];
}
export function validateMod(mod, state) {
  const errors = [];
  if (!isObject(mod)) return { ok: false, errors: ['Mod 必须是 JSON 对象。'] };
  if (mod.schemaVersion !== 1) errors.push('schemaVersion 必须为 1。');
  if (!validId(mod.id)) errors.push('Mod id 需要 1–64 个字母、数字、点、冒号、下划线或连字符。');
  if (mod.name !== undefined && !validName(mod.name)) errors.push('Mod name 无效。');
  if (mod.replaceExisting !== undefined && typeof mod.replaceExisting !== 'boolean') errors.push('replaceExisting 必须是布尔值。');
  const limits = { characters: 128, terrains: 64, factions: 16, tiles: 300, events: 200 };
  for (const [key, limit] of Object.entries(limits)) if (mod[key] !== undefined && (!Array.isArray(mod[key]) || mod[key].length > limit)) errors.push(`${key} 必须是至多 ${limit} 项的数组。`);
  const eventCharacters = new Set([...Object.keys(state?.characters || mapById(CHARACTER_DEFINITIONS)), ...(Array.isArray(mod.characters) ? mod.characters.map(character => character?.id) : [])]);
  const eventIds = new Set(storyEvents(state || { customEvents: [] }).map(event => event?.id));
  if ((state?.customEvents?.length || 0) + (Array.isArray(mod.events) ? mod.events.length : 0) > MAX_CUSTOM_EVENTS) errors.push('单局自定义事件数量超过容量。');
  for (const [index, event] of (Array.isArray(mod.events) ? mod.events : []).entries()) {
    const at = `events[${index}]`;
    errors.push(...storyEventErrors(event, at, eventCharacters));
    if (isObject(event) && validId(event.id)) {
      if (eventIds.has(event.id)) errors.push(`${at}.id 与已有事件重复。`);
      eventIds.add(event.id);
    }
  }
  if (errors.length) return { ok: false, errors };
  if (state?.loadedMods.some(item => item.id === mod.id) && !mod.replaceExisting) errors.push('这个 Mod 已加载；更新时请设置 replaceExisting:true。');
  const characters = new Set(Object.keys(state?.characters || mapById(CHARACTER_DEFINITIONS)));
  const terrains = new Set(Object.keys(state?.terrainTypes || mapById(TERRAIN_DEFINITIONS)));
  const factions = new Set(Object.keys(state?.factions || mapById(FACTION_DEFINITIONS)));
  for (const [listName, ids, validator] of [['characters', characters, characterErrors], ['terrains', terrains, terrainErrors]]) {
    const seen = new Set();
    for (const [index, definition] of (mod[listName] || []).entries()) {
      errors.push(...validator(definition, `${listName}[${index}]`));
      if (!isObject(definition)) continue;
      if (seen.has(definition.id)) errors.push(`${listName} 出现重复 id:${definition.id}。`);
      if (ids.has(definition.id) && !mod.replaceExisting) errors.push(`${definition.id} 已存在；修改需要 replaceExisting:true。`);
      if (listName === 'characters' && state && own(state.characters, definition.id)) {
        const perks = state.growth?.[definition.id]?.perks;
        if (Array.isArray(perks) && perks.some((perk, tier) => perk !== null && !perkChoices(definition.role || null, tier)?.some(choice => choice.id === perk))) errors.push(`角色 ${definition.id} 已学天赋与新职业不兼容，请保留原职业。`);
      }
      if (listName === 'terrains' && definition.passable === false && state && Object.values(state.tiles).some(tile => tile.ownerId && tile.terrainId === definition.id)) errors.push(`地形 ${definition.id} 已承载国土，不能更新为不可通行。`);
      seen.add(definition.id); ids.add(definition.id);
    }
  }
  for (const [index, faction] of (mod.factions || []).entries()) {
    const at = `factions[${index}]`;
    if (!isObject(faction)) { errors.push(`${at} 必须是对象。`); continue; }
    if (!validId(faction.id)) errors.push(`${at}.id 无效。`);
    if (!validName(faction.name)) errors.push(`${at}.name 无效。`);
    if (!validColor(faction.color)) errors.push(`${at}.color 必须为 #rrggbb。`);
    if (!characters.has(faction.leaderId)) errors.push(`${at}.leaderId 引用了不存在的角色。`);
    if (state?.characterOwners?.[faction.leaderId] && state.characterOwners[faction.leaderId] !== faction.id) errors.push(`${at}.leaderId 已效忠其他国家，请为新国指定未归属的新角色。`);
    if (state?.captives?.[faction.leaderId]) errors.push(`${at}.leaderId 仍被俘虏，不能建立新国家。`);
    if (state?.campaign?.prison?.[faction.leaderId]) errors.push(`${at}.leaderId 已关入肖申克监狱，不能建立新国家。`);
    if (state && isOnParole(state, faction.leaderId)) errors.push(`${at}.leaderId 正在假释休整，届满后才能建立新国家。`);
    if (faction.personality !== undefined && !['aggressive', 'balanced', 'builder'].includes(faction.personality)) errors.push(`${at}.personality 无效。`);
    errors.push(...wandererErrors(faction, at, characters));
    if (factions.has(faction.id)) errors.push(`国家 ${faction.id} 已存在，不能覆盖既有国家。`);
    factions.add(faction.id);
  }
  const newTiles = new Set();
  for (const [index, tile] of (mod.tiles || []).entries()) {
    const at = `tiles[${index}]`;
    if (!isObject(tile)) { errors.push(`${at} 必须是地块对象。`); continue; }
    if (!coordValid(tile.q) || !coordValid(tile.r)) errors.push(`${at} 的 q/r 必须为 -10000–10000 整数。`);
    const key = tileKey(tile.q, tile.r);
    if (state?.tiles[key] || newTiles.has(key)) errors.push(`${at} 会覆盖已有地块 ${key}。`);
    newTiles.add(key);
    if (!terrains.has(tile.terrainId)) errors.push(`${at}.terrainId 不存在。`);
    if (tile.ownerId !== undefined && tile.ownerId !== null && !factions.has(tile.ownerId)) errors.push(`${at}.ownerId 不存在。`);
    if (tile.ownerId && state?.factions[tile.ownerId]?.alive === false) errors.push(`${at} 不能分配给已灭亡的国家。`);
    if (tile.troops !== undefined && !integer(tile.troops, 0, 100)) errors.push(`${at}.troops 必须是 0–100 整数。`);
    const definition = (mod.terrains || []).find(t => t?.id === tile.terrainId) || state?.terrainTypes[tile.terrainId] || TERRAIN_DEFINITIONS.find(t => t.id === tile.terrainId);
    if (tile.ownerId && definition?.passable === false) errors.push(`${at} 的不可通行地形不能成为领土。`);
    if (!tile.ownerId && tile.troops > 0) errors.push(`${at} 的中立地块不能设置军队。`);
  }
  if (characters.size > 1000 || terrains.size > 256 || factions.size > 100) errors.push('内容超过原型容量：最多 1000 角色、256 地形与 100 国家。');
  if (state && state.loadedMods.length >= 1000 && !state.loadedMods.some(item => item.id === mod.id)) errors.push('单局最多加载 1000 个 Mod 包。');
  return { ok: errors.length === 0, errors };
}

function frontierCenter(state, radius = 2) {
  const offset = (state.revision + Object.keys(state.factions).length) % DIRECTIONS.length;
  const extent = Math.max(4, ...Object.values(state.tiles).filter(t => t.discovered).map(t => hexDistance(t)));
  for (let attempt = 0; attempt < 200; attempt++) {
    const distance = extent + radius + 1 + attempt * 2;
    for (let directionIndex = 0; directionIndex < 6; directionIndex++) {
      const direction = DIRECTIONS[(offset + directionIndex) % 6];
      const center = { q: direction[0] * distance, r: direction[1] * distance };
      if (hexArea(center.q, center.r, radius).every(cell => coordValid(cell.q) && coordValid(cell.r) && !own(state.tiles, tileKey(cell.q, cell.r)) && landHere(state, cell.q, cell.r))) return center;
    }
  }
  // Very distant imported tiles need not push every possible new capital beyond the coordinate limit.
  for (const edge of Object.values(state.tiles).filter(tile => tile.discovered).sort((a, b) => hexDistance(b) - hexDistance(a))) {
    for (const [dq, dr] of DIRECTIONS) {
      const center = { q: edge.q + dq * (radius + 2), r: edge.r + dr * (radius + 2) };
      if (hexArea(center.q, center.r, radius).every(cell => coordValid(cell.q) && coordValid(cell.r) && !own(state.tiles, tileKey(cell.q, cell.r)) && landHere(state, cell.q, cell.r))) return center;
    }
  }
  if (state.world) for (let row = 0; row < EARTH.rows; row++) for (let col = 0; col < EARTH.cols; col++) {
    // The world map is finite: any untouched patch of land anywhere on it will do.
    const origin = state.world.origin, r = row - origin.row, q = col - origin.col + Math.floor(origin.row / 2) - Math.floor(row / 2);
    if (hexArea(q, r, radius).every(cell => !own(state.tiles, tileKey(cell.q, cell.r)) && landHere(state, cell.q, cell.r))) return { q, r };
  }
  throw new Error('找不到足够的空白边疆。');
}

/** A campaign can mobilize a few armies, not every farmer and every collected character at once. */
function frontierMusterPower(state, factionId = state.playerId) {
  return factionTiles(state, factionId).filter(tile => tile.cutSince === undefined).map(tile => {
    const girls = (tile.field || []).filter(id => canServe(state, id, factionId)).slice(0, MAX_SQUADS);
    const training = regularTrainingProfile(serviceTraining(state, tile)), elite = serviceRoster(state, tile), regulars = Math.max(0, Math.min(MAX_SQUADS - girls.length, Math.max(tile.troops - girls.length, elite.R + elite.SR + elite.SSR)));
    let power = Math.max(0, tile.troops - Math.max(1, handsNeeded(tile))), seats = MAX_SQUADS - girls.length;
    for (const id of girls) {
      const stats = heroView(state, id).stats;
      power += Math.min(30, 6 + Math.floor((stats.attack + stats.defense) / 4));
    }
    for (const [rank, weight] of [['SSR', 6], ['SR', 4], ['R', 2]]) {
      const count = Math.min(seats, elite[rank]); seats -= count; power += count * weight;
    }
    power += regulars * (Math.floor((training.attack + training.defense) / 4) + Math.floor((training.level - 1) / 10) + (training.mixed ? 2 : 0));
    return power;
  }).sort((a, b) => b - a).slice(0, 3).reduce((sum, value) => sum + value, 0);
}
function frontierTarget(state, salt) {
  // The explicit 360-point ceiling keeps new wars compact (at most 19 tiles); it is not a promise
  // to match an entire empire followed by silently truncating thousands of troops at tile caps.
  return Math.max(40, Math.min(360, Math.round(frontierMusterPower(state) * (.75 + hash(state.seed, state.turn, state.revision, salt) * .5))));
}
function frontierSize(target) { return target <= 65 ? 3 : Math.max(7, Math.min(19, Math.round(target / 18))); }

function armyMentors(state, factionId) {
  return Object.keys(state.characters).filter(id => canServe(state, id, factionId))
    .sort((a, b) => growthOf(state, b).level - growthOf(state, a).level).slice(0, MAX_SQUADS);
}
function mentorLevel(total, count) { return Math.max(1, Math.min(MAX_ARMY_TRAINING, Math.round(total / Math.max(1, count)))); }
function armyMentorLevel(state, factionId) {
  const mentors = armyMentors(state, factionId);
  return mentorLevel(mentors.reduce((sum, id) => sum + growthOf(state, id).level, 0), mentors.length);
}
/** Pure explanation of the same eligible mentors and rounded cap used by training. */
export function getArmyMentorGuidance(state, factionId = state.playerId) {
  const ids = armyMentors(state, factionId), members = ids.map(id => {
    const g = growthOf(state, id);
    return { id, name: state.characters[id].name, level: g.level,
      expRemaining: g.level >= MAX_LEVEL ? 0 : Math.max(0, expToNext(g.level) - g.exp) };
  });
  const total = members.reduce((sum, m) => sum + m.level, 0);
  const level = regularTrainingProfile(state.factions[factionId]?.armyTrainingLevel).level;
  const mentorCap = mentorLevel(total, members.length), nextLevel = Math.min(MAX_ARMY_TRAINING, level + 1);
  let requiredTotal = null;
  if (members.length && level < MAX_ARMY_TRAINING) {
    for (let n = 0; n <= members.length * MAX_LEVEL; n++) {
      if (mentorLevel(n, members.length) >= nextLevel) { requiredTotal = n; break; }
    }
  }
  return { members, total, level, mentorCap, cap: Math.max(level, mentorCap), nextLevel,
    maxLevel: MAX_ARMY_TRAINING, requiredTotal, missingTotal: requiredTotal === null ? null : Math.max(0, requiredTotal - total) };
}
/** An old save's absent training level means the unchanged level-one ordinary army. */
export function getArmyTrainingQuote(state, factionId = state.playerId) {
  return armyTrainingQuote(state, factionId);
}
// Only getStats supplies same-invocation economy facts; public quotes always read fresh.
function armyTrainingQuote(state, factionId, economy) {
  const faction = state.factions[factionId], level = regularTrainingProfile(faction?.armyTrainingLevel).level;
  const cap = Math.max(level, armyMentorLevel(state, factionId)), nextLevel = Math.min(MAX_ARMY_TRAINING, level + 1);
  const land = economy === undefined ? factionTiles(state, factionId).length : economy.land, scale = Math.sqrt(1 + Math.max(0, land - 12) / 16);
  const cost = { ap: 2, gold: Math.ceil((18 + nextLevel * 5) * scale * (hasEdict(state, 'war', factionId) ? .7 : 1)), supply: 2 + Math.floor(nextLevel / 5) };
  const capital = state.tiles[faction?.capitalKey];
  const reason = !faction?.alive || capital?.ownerId !== factionId ? '需要仍在治理的首都。'
    : state.battle || (state.turnContinuation && factionId === state.playerId) ? '请先完成当前战场与战争阶段。'
    : level >= MAX_ARMY_TRAINING ? '常备军训练已达 30 级。'
    : level >= cap ? `需要更高等级的角色指导；目前指导上限为 ${cap} 级。`
    : affordable(state, cost, factionId, factionId === state.playerId);
  // Summary shape and identity differ from getStats' detailed military budget.
  const militaryBefore = economy === undefined ? militaryBudget(state, factionId, false)
    : (({ sites, ...summary }) => summary)(economy.upkeep.military);
  const militaryAfter = militaryBudget({ ...state, factions: { ...state.factions, [factionId]: { ...faction, armyTrainingLevel: nextLevel } } }, factionId, false);
  const netIncomeBefore = economy === undefined ? netIncome(state, factionId)
    : { gold: economy.gross.gold - economy.upkeep.gold, supply: economy.gross.supply - economy.upkeep.supply };
  const netIncomeAfter = { ...netIncomeBefore, gold: netIncomeBefore.gold - (militaryAfter.gold - militaryBefore.gold) };
  return { factionId, level, cap, maxLevel: MAX_ARMY_TRAINING, nextLevel, cost, enabled: !reason, reason,
    militaryBefore, militaryAfter, upkeepDelta: militaryAfter.gold - militaryBefore.gold, netIncomeBefore, netIncomeAfter,
    effects: regularTrainingProfile(level), nextEffects: regularTrainingProfile(nextLevel) };
}
function trainArmy(state, factionId = state.playerId) {
  const quote = getArmyTrainingQuote(state, factionId);
  requireThat(quote.enabled, quote.reason);
  pay(state, quote.cost, factionId, factionId === state.playerId);
  state.factions[factionId].armyTrainingLevel = quote.nextLevel;
  state.factions[factionId].regularCommand = true;
  log(state, `${state.factions[factionId].name}的常备军训练提升至 ${quote.nextLevel} 级${quote.nextLevel === 5 ? '，开始采用混编军种' : ''}。`, 'army');
  return { factionId, level: quote.nextLevel, cost: quote.cost, effects: quote.nextEffects };
}

/** Founding includes an economy, not merely an oversized army and a few turns' starvation buffer. */
function establishFrontierFaction(state, definition, cells, crew, target, discovered = false) {
  const past = state.factions[definition.id], chief = crew.includes(definition.leaderId) ? definition.leaderId : crew[0] || null;
  const faction = state.factions[definition.id] = {
    ...(past || { capitalHistory: [], capitalMoves: 0, defeats: 0, foundedTurn: state.turn }),
    id: definition.id, name: definition.name, color: definition.color, leaderId: chief, regularCommand: true,
    personality: definition.personality || 'balanced', isPlayer: false, alive: true,
    gold: 22 + Math.floor(target / 3), supply: 16, graceUntilTurn: state.turn + 2, capitalKey: null,
    revivals: past ? (past.revivals || 0) + 1 : 0,
  };
  const level = armyMentorLevel(state, state.playerId);
  // Founding is a one-time officer-training snapshot. Neither future player growth nor each new
  // battle silently changes it; the player can purchase the exact same training through trainArmy.
  faction.armyTrainingLevel = level;
  for (const id of crew) {
    state.characterOwners[id] = definition.id;
    const growth = ensureGrowth(state, id);
    for (let i = 0; growth.level < level && i < MAX_LEVEL; i++) gainExp(state, id, expToNext(growth.level));
  }
  const land = cells.map((cell, index) => {
    const tile = ensureTile(state, cell.q, cell.r, discovered);
    if (!state.terrainTypes[tile.terrainId].passable) tile.terrainId = 'plains';
    Object.assign(tile, { ownerId: definition.id, troops: 4, food: 0, garrison: [], field: [], building: null, buildingLevel: 0 });
    delete tile.elite; delete tile.cutSince; delete tile.marchedTurn; delete tile.foughtTurn;
    if (!index) chooseCapital(state, definition.id, tile);
    return tile;
  });
  const home = land[0], fort = land.length >= 7 ? land[1] : null;
  for (const tile of land) {
    if (tile === fort || (tile === home && target >= 90)) {
      tile.building = 'fort'; tile.buildingLevel = target >= 180 ? 2 : 1;
    } else {
      const building = Object.values(BUILDINGS).filter(item => item.yield.supply > 0 && canBuild(state, tile, item.id))
        .sort((a, b) => b.yield.supply - a.yield.supply || b.yield.gold - a.yield.gold)[0];
      if (building) { tile.building = building.id; tile.buildingLevel = 1; }
    }
  }
  const rank = target >= 180 ? 'SSR' : target >= 80 ? 'SR' : 'R';
  addElite(home, rank, Math.max(1, Math.min(MAX_SQUADS, Math.ceil(target / 60))));
  if (fort) addElite(fort, rank, Math.min(3, Math.ceil(target / 100)));
  const elites = land.reduce((sum, tile) => sum + eliteOf(tile).R * 2 + eliteOf(tile).SR * 4 + eliteOf(tile).SSR * 6, 0);
  // The court will sit at home: its baggage counts toward what the capital can feed.
  const roomOf = tile => supplyRoom(state, tile, tile === home ? Math.min(MAX_SQUADS, crew.length) : 0);
  let remaining = Math.max(land.length * 4, Math.min(land.length * 100, target - Math.min(MAX_SQUADS, crew.length) * 6 - elites)) - land.length * 4;
  remaining = Math.max(0, Math.min(remaining, land.reduce((sum, tile) => sum + roomOf(tile), 0)));
  for (const [tile, share] of [[home, .35], [fort, .2]]) if (tile) {
    const amount = Math.min(remaining, roomOf(tile), Math.round((remaining + land.length * 4) * share));
    tile.troops += amount; remaining -= amount;
  }
  while (remaining > 0) for (const tile of land) if (remaining > 0 && roomOf(tile) > 0) { tile.troops++; remaining--; }
  for (const id of crew) seatAtHome(state, id);

  const netFood = () => getIncome(state, definition.id).supply - maintenance(state, definition.id).supply;
  // Staffing is included in getTileStats, so an empty level-five farm is not counted as a full harvest.
  while (netFood() < 3) {
    const upgrades = land.filter(tile => BUILDINGS[tile.building]?.yield.supply > 0 && tile.buildingLevel < (BUILDINGS[tile.building].maxLevel || 5)).map(tile => {
      const before = getTileStats(state, tile.key).supply;
      tile.buildingLevel++; const gain = getTileStats(state, tile.key).supply - before; tile.buildingLevel--;
      return { tile, gain };
    }).sort((a, b) => b.gain - a.gain || a.tile.buildingLevel - b.tile.buildingLevel);
    if (!upgrades.length) break;
    upgrades[0].tile.buildingLevel++;
  }
  // A small or barren remaining frontier may support less than the intended muster. Respect that
  // carrying capacity instead of creating a faction whose initial troops immediately desert.
  while (netFood() < 0) {
    // Shed unneeded village reserves first, retaining productive hands and the actual field army.
    const priority = tile => tile.troops > handsNeeded(tile)
      ? 10000 + (tile.isCapital ? 0 : tile.building === 'fort' ? 1000 : 2000) + tile.troops - handsNeeded(tile)
      : tile.troops;
    const tile = [...land].sort((a, b) => priority(b) - priority(a))[0];
    if (tile.troops <= 1) break;
    tile.troops--;
  }
  faction.supply = Math.max(16, maintenance(state, definition.id).supply * 6);
  for (const tile of land) for (const point of neighbors(tile)) maybeTile(state, point.q, point.r, false);
  return faction;
}
function spawnFaction(state, definition) {
  requireThat(!state.characterOwners[definition.leaderId] || state.characterOwners[definition.leaderId] === definition.id, '这位角色已经效忠其他国家。');
  requireThat(!state.campaign?.prison?.[definition.leaderId], C.prisonDetail);
  requireThat(!state.captives[definition.leaderId], '被俘角色不能建立新国家。');
  requireThat(!isOnParole(state, definition.leaderId), '假释休整中的角色暂时不能建立新国家。');
  const target = frontierTarget(state, `${definition.id}:mod-size`), count = frontierSize(target), radius = count > 7 ? 2 : 1;
  requireThat(Object.keys(state.tiles).length + count <= MAX_TILES, '当前加载区暂不容纳新的国家区域，仍可发展既有世界与复兴已有国家。');
  const center = frontierCenter(state, radius);
  const cells = hexArea(center.q, center.r, radius).sort((a, b) => hexDistance(a, center) - hexDistance(b, center) || a.q - b.q || a.r - b.r).slice(0, count);
  const capitalKey = tileKey(center.q, center.r);
  establishFrontierFaction(state, definition, cells, [definition.leaderId], target, true);
  revealArea(state, center.q, center.r, radius);
  recordChronicle(state, `${definition.name}从迷雾中加入世界，首都位于 ${capitalKey}，享有两回合保护期。`, 'diplomacy', definition.id);
  return { factionId: definition.id, centerKey: capitalKey, q: center.q, r: center.r };
}
function applyModInternal(state, mod) {
  const validation = validateMod(mod, state);
  requireThat(validation.ok, validation.errors.join('\n'));
  state.customEvents.push(...clone(mod.events || []));
  for (const character of mod.characters || []) {
    state.characters[character.id] = normalizeCharacter(character);
    if (!own(state.characterOwners, character.id)) state.characterOwners[character.id] = null;
  }
  for (const terrain of mod.terrains || []) state.terrainTypes[terrain.id] = normalizeTerrain(terrain);
  const spawnedFactions = (mod.factions || []).map(faction => spawnFaction(state, faction));
  for (const definition of mod.tiles || []) {
    // A new nation's generated capital area must not silently overwrite a supplied tile either.
    requireThat(!state.tiles[tileKey(definition.q, definition.r)], `地块 ${definition.q},${definition.r} 与新国家生成区冲突，请换一组坐标。`);
    const tile = ensureTile(state, definition.q, definition.r, true);
    tile.terrainId = definition.terrainId; tile.ownerId = definition.ownerId || null; tile.troops = definition.ownerId ? Math.max(1, definition.troops || 1) : 0;
  }
  for (const definition of mod.tiles || []) for (const cell of neighbors(definition)) maybeTile(state, cell.q, cell.r, false);
  state.loadedMods = state.loadedMods.filter(item => item.id !== mod.id);
  state.loadedMods.push({ id: mod.id, name: mod.name || mod.id, turn: state.turn });
  log(state, `已加载「${mod.name || mod.id}」：${mod.characters?.length || 0} 角色、${mod.terrains?.length || 0} 地形、${mod.factions?.length || 0} 国家、${mod.tiles?.length || 0} 地块。`, 'mod');
  return { modId: mod.id, spawnedFactions };
}

/** Migrants walk over from next door; anyone already living there stays. */
function settle(tile, source, factionId) {
  // Cut-off neutral land retains its residents. Never exceed the per-tile save limit or
  // delete overflowing migrants: people who cannot fit stay at the source.
  const migrants = Math.max(0, Math.min(MIGRANTS, 100 - tile.troops));
  source.troops -= migrants; tile.militaryReserve = Boolean(source.militaryReserve); tile.militaryReadyTurn = source.militaryReadyTurn || 0; tile.troops += migrants; tile.ownerId = factionId; tile.food = 0;
  return migrants;
}
function recruitCost(state, factionId = state?.playerId) { return { ap: 2, gold: Math.max(1, Math.round(5 * (state ? techEffect(state, 'recruitCost', factionId) : 1))), supply: 2 }; }
/** Battle-wide bonuses a nation's technology and wonders give its side in a tactical fight. */
function combatTech(state, factionId) { return factionId ? { attack: Math.round(techEffect(state, 'attack', factionId)), defense: Math.round(techEffect(state, 'defense', factionId)) } : { attack: 0, defense: 0 }; }
/** The same in an automatic clash: each point is worth 6%, and 参谋部 adds its own edge. */
function clashTech(state, factionId, side) { if (!factionId) return 1; return 1 + .06 * techEffect(state, side, factionId) + techEffect(state, 'autoBattle', factionId); }
function recruitAmount(state, tile) { return Math.max(0, Math.min(4 + (seatQuirk(state, tile, 'q_drill') ? 2 : 0), housingOf(state, tile) - tile.troops, 100 - tile.troops)); }
function moveStack(state, from, to, troops, girls = undefined, options = {}) {
  // A standing march order was checked end to end when it was given; its nightly stops are not transfers.
  if (!options.transit) requireThat(!militaryMoveReason(state, from.key, to.key, troops), militaryMoveReason(state, from.key, to.key, troops));
  const going = Array.isArray(girls) ? from.field.filter(id => girls.includes(id)) : [...from.field];
  from.troops -= troops; to.troops += troops;
  for (const id of going) { to.field.push(id); ensureGrowth(state, id).movedTurn = state.turn; }
  from.field = from.field.filter(id => !going.includes(id));
  if (state.campaign?.armies?.[from.key] && (going.length || !from.field.length)) { state.campaign.armies[to.key] = state.campaign.armies[from.key]; delete state.campaign.armies[from.key]; }
  const eliteTransfer = options.elites !== false && troops > 0 ? mergeElite(to, from) : eliteTransferPlan(from, to, false);
  to.marchedTurn = state.turn;
  // Moving survivors must not reset their once-per-turn battle limit.
  if (from.foughtTurn === state.turn) to.foughtTurn = state.turn;
  return eliteTransfer;
}
/** Nations keep their girls with the army nearest a war, or at home in peacetime. */
function aiDeploy(state, faction) {
  const free = Object.keys(state.characters).filter(id => canServe(state, id, faction.id) && !stationOf(state, id));
  const land = factionTiles(state, faction.id).filter(tile => tile.cutSince === undefined), home = state.tiles[faction.capitalKey];
  // Fill a vacant home seat only from people actually here or not yet stationed.
  // Distant commanders must march back normally; regular capital guards buy time.
  if (home && !home.garrison.length) {
    const next = home.field.shift() || free.shift();
    if (next) home.garrison.push(next);
  }
  if (!free.length) return;
  const score = tile => neighbors(tile).some(point => { const owner = state.tiles[point.key]?.ownerId; return owner && owner !== faction.id && atWar(state, faction.id, owner); }) ? 1000 + tile.troops : tile.isCapital ? 500 : tile.troops;
  land.sort((a, b) => score(b) - score(a) || a.key.localeCompare(b.key));
  if (land[0]) land[0].field.push(...free);
}
/** Pay for ordinary training from the same quote as the player. A cash reserve
 * and a three-turn food buffer come first; no stats are matched to the player. */
function aiTrainArmy(state, faction, foodNet) {
  const quote = getArmyTrainingQuote(state, faction.id);
  if (!quote.enabled || faction.armyTrainingTurn === state.turn) return false;
  const netGold = getIncome(state, faction.id).gold - maintenance(state, faction.id).gold;
  const reserve = Math.max(24, -(netGold - quote.upkeepDelta) * 4);
  if (netGold < quote.upkeepDelta) return false;
  if (faction.gold < quote.cost.gold + reserve || faction.supply < quote.cost.supply + Math.max(10, -foodNet * 3)) return false;
  trainArmy(state, faction.id); faction.armyTrainingTurn = state.turn; return true;
}
/** A peaceful cash-starved nation must be able to save for its next action.
 * Solvency alone permits zero-net upkeep to consume every coin indefinitely.
 * Release one paid, ready formation through the same voluntary quote, rear first;
 * keep war service and already-paid preparation intact. No cash or units are created. */
function aiMilitaryLiquidityStep(state, faction, owned, income) {
  if (faction.gold >= 5 || income.gold > 0 || Object.values(state.factions).some(other => other.alive && other.id !== faction.id && atWar(state, faction.id, other.id))) return false;
  const candidates = owned.filter(tile => militaryStatus(state, tile).ready)
    .sort((a, b) => militaryPriority(state, a, faction.id) - militaryPriority(state, b, faction.id) || a.key.localeCompare(b.key));
  for (const tile of candidates) {
    const quote = getMilitaryQuote(state, tile.key, true, faction.id);
    if (!quote.enabled || quote.upkeepDelta >= 0) continue;
    setMilitaryMode(state, tile.key, true, faction.id); return true;
  }
  return false;
}
/** Reopen one meaningful formation through the player's exact paid quote.
 * This consumes one existing national action, never a free world-tick action. */
function aiMilitaryStep(state, faction, owned) {
  const income = netIncome(state, faction.id);
  if (aiMilitaryLiquidityStep(state, faction, owned, income)) return true;
  const candidates = owned.filter(tile => tile.militaryReserve && tile.cutSince === undefined && militaryStatus(state, tile).nominal.gold > 0
    && (tile.isCapital || neighbors(tile).some(point => { const owner = state.tiles[point.key]?.ownerId; return owner && owner !== faction.id && atWar(state, faction.id, owner); })))
    .sort((a, b) => militaryPriority(state, b, faction.id) - militaryPriority(state, a, faction.id) || a.key.localeCompare(b.key));
  for (const tile of candidates) {
    const quote = getMilitaryQuote(state, tile.key, false, faction.id);
    if (!quote.enabled || income.gold < quote.upkeepDelta || faction.gold < quote.cost.gold + Math.max(20, quote.budgetAfter.gold * 3)) continue;
    setMilitaryMode(state, tile.key, false, faction.id); return true;
  }
  return false;
}
/** Economic recovery can reopen a useful fort, at the same 6 gold/2 supply and
 * one strategic order as fortMode(false). Reopening must be sustainable, staffed
 * and within the active network, not a loophole around the total fort count. */
function aiReactivateFort(state, faction, owned, foodNet) {
  const network = fortNetwork(state, faction.id), cost = { ap: 2, gold: 6, supply: 2 };
  if (network.active >= network.capacity || faction.gold < cost.gold + 20 || faction.supply < cost.supply + 10) return false;
  const netGold = getIncome(state, faction.id).gold - maintenance(state, faction.id).gold;
  const sites = owned.filter(tile => tile.building === 'fort' && tile.fortMothballed && tile.cutSince === undefined && tile.troops >= FORT_GARRISON)
    .map(tile => {
      const beside = neighbors(tile).map(point => state.tiles[point.key]).filter(Boolean);
      const defended = beside.filter(near => near.ownerId === faction.id).length;
      const threatened = beside.some(near => near.ownerId && near.ownerId !== faction.id && atWar(state, faction.id, near.ownerId));
      return { tile, score: (tile.isCapital ? 20 : 0) + (threatened ? 12 : 0) + defended + (!network.active ? 8 : 0) };
    }).filter(item => item.score > 2).sort((a, b) => b.score - a.score || a.tile.key.localeCompare(b.tile.key));
  for (const { tile } of sites) {
    const tiles = { ...state.tiles, [tile.key]: { ...tile, fortMothballed: false } }, projected = fortNetwork({ ...state, tiles }, faction.id);
    const gold = projected.upkeep.gold - network.upkeep.gold, supply = projected.upkeep.supply - network.upkeep.supply;
    if (netGold < gold || foodNet < supply + 1 || faction.gold < cost.gold + Math.max(20, projected.upkeep.gold * 4) || faction.supply < cost.supply + Math.max(10, projected.upkeep.supply * 4)) continue;
    pay(state, cost, faction.id, false); tile.fortMothballed = false; tile.fortReadyTurn = state.turn + 1;
    log(state, `${faction.name}重新整备 ${tile.key} 要塞，支出 6 金币、2 补给，下回合恢复防区。`, 'build');
    return true;
  }
  return false;
}
/** Invest in a useful existing fort only after paying normal development prices
 * and checking the upgraded network's ongoing upkeep. One purchase per world
 * turn prevents discretionary wall building from using both strategic orders. */
function aiUpgradeFort(state, faction, owned, foodNet) {
  const network = fortNetwork(state, faction.id);
  if (faction.fortUpgradeTurn === state.turn || network.excess > 0 || foodNet < 1) return false;
  const netGold = getIncome(state, faction.id).gold - maintenance(state, faction.id).gold;
  const sites = owned.filter(tile => tile.building === 'fort' && (tile.buildingLevel || 1) < (BUILDINGS.fort.maxLevel || 5) && tile.troops >= handsNeeded(tile) && fortStatus(state, tile)?.operational)
    .map(tile => ({ tile, threatened: neighbors(tile).some(point => { const owner = state.tiles[point.key]?.ownerId; return owner && owner !== faction.id && atWar(state, faction.id, owner); }) }))
    .filter(item => item.tile.isCapital || item.threatened)
    .sort((a, b) => Number(b.threatened) - Number(a.threatened) || Number(b.tile.isCapital) - Number(a.tile.isCapital) || (a.tile.buildingLevel || 1) - (b.tile.buildingLevel || 1) || a.tile.key.localeCompare(b.tile.key));
  for (const { tile } of sites) {
    const cost = improvementCost(state, tile, faction.id), level = (tile.buildingLevel || 1) + 1;
    const tiles = { ...state.tiles, [tile.key]: { ...tile, buildingLevel: level } }, projected = fortNetwork({ ...state, tiles }, faction.id);
    const gold = projected.upkeep.gold - network.upkeep.gold, supply = projected.upkeep.supply - network.upkeep.supply;
    if (netGold < gold || foodNet < supply + 1 || faction.gold < cost.gold + Math.max(24, projected.upkeep.gold * 4) || faction.supply < cost.supply + Math.max(12, projected.upkeep.supply * 4) || affordable(state, cost, faction.id, false)) continue;
    pay(state, cost, faction.id, false); tile.buildingLevel = level; faction.fortUpgradeTurn = state.turn;
    log(state, `${faction.name}将 ${tile.key} 要塞升至 ${level} 级，支出 ${cost.gold} 金币、${cost.supply} 补给。`, 'build');
    return true;
  }
  return false;
}
/** Reverse own-land route distances, using the same terrain movement prices.
 * A reserve cannot teleport across disconnected territory or an enemy tile. */
function aiRouteCosts(state, factionId, goals) {
  const costs = new Map(), queue = [];
  for (const tile of goals) { costs.set(tile.key, 0); queue.push(tile.key); }
  while (queue.length) {
    queue.sort((a, b) => costs.get(a) - costs.get(b));
    const key = queue.shift(), tile = state.tiles[key];
    for (const point of neighbors(tile)) {
      const near = state.tiles[point.key];
      if (near?.ownerId !== factionId || near.cutSince !== undefined) continue;
      const cost = costs.get(key) + marchCost(state, tile);
      if (cost >= (costs.get(near.key) ?? Infinity)) continue;
      costs.set(near.key, cost); queue.push(near.key);
    }
  }
  return tile => costs.get(tile.key) ?? Infinity;
}
/** Concentrate a real field army before farming unguarded border tiles. Reserves
 * preserve productive workers; marches cost supply and obey marchedTurn, but
 * use no strategic order, exactly like the player's public move action. */
function aiMusterArmy(state, faction, owned, opponents) {
  if (!opponents.length || faction.supply < 3) return false;
  const hostile = new Set(opponents.map(other => other.id));
  const front = owned.filter(tile => tile.cutSince === undefined && neighbors(tile).some(p => hostile.has(state.tiles[p.key]?.ownerId)));
  if (!front.length) return false;
  const armies = owned.filter(tile => tile.cutSince === undefined && tile.field.length && tile.foughtTurn !== state.turn)
    .sort((a, b) => b.field.length - a.field.length || b.troops - a.troops || a.key.localeCompare(b.key));
  const anchor = armies[0] || [...front].sort((a, b) => b.troops - a.troops || a.key.localeCompare(b.key))[0];
  const nearFoes = neighbors(anchor).map(p => state.tiles[p.key]).filter(tile => hostile.has(tile?.ownerId));
  const desired = Math.min(supplyLimit(state, anchor), Math.max(20, Math.min(90, Math.max(0, ...nearFoes.map(tile => tile.troops)) + 10)));
  if (anchor.troops < desired) {
    const toward = aiRouteCosts(state, faction.id, [anchor]), transfers = [];
    for (const from of owned) {
      if (from === anchor || from.cutSince !== undefined || from.marchedTurn === state.turn || from.foughtTurn === state.turn) continue;
      // Keep another independent commander army intact rather than robbing its soldiers.
      if (from.field.length && from.field.length + anchor.field.length > MAX_SQUADS) continue;
      const keep = Math.max(1, handsNeeded(from), from.isCapital ? 6 : 0), surplus = from.troops - keep;
      if (surplus < 3) continue;
      const dest = Object.keys(marchReach(state, from.key, faction.id)).map(key => state.tiles[key])
        .filter(tile => !militaryMoveReason(state, from.key, tile.key, 1) && tile.cutSince === undefined && toward(tile) < toward(from) && supplyRoom(state, tile, from.field.length) >= 3 && (!tile.field.length || tile === anchor))
        .sort((a, b) => toward(a) - toward(b) || a.troops - b.troops || a.key.localeCompare(b.key))[0];
      if (!dest) continue;
      const troops = Math.min(surplus, supplyRoom(state, dest, from.field.length), dest === anchor ? desired - anchor.troops : surplus);
      if (troops >= 3) transfers.push({ from, dest, troops, score: (dest === anchor ? 100 : 0) + troops - toward(dest) });
    }
    const pick = transfers.sort((a, b) => b.score - a.score || a.from.key.localeCompare(b.from.key))[0];
    if (pick) {
      pay(state, { gold: 0, supply: 1 }, faction.id, false);
      moveStack(state, pick.from, pick.dest, pick.troops); return true;
    }
  }
  if (front.includes(anchor) || anchor.marchedTurn === state.turn || anchor.troops < 10) return false;
  const towardFront = aiRouteCosts(state, faction.id, front);
  const dest = Object.keys(marchReach(state, anchor.key, faction.id)).map(key => state.tiles[key])
    .filter(tile => !militaryMoveReason(state, anchor.key, tile.key, 1) && tile.cutSince === undefined && towardFront(tile) < towardFront(anchor) && supplyRoom(state, tile, anchor.field.length) >= 4)
    .sort((a, b) => towardFront(a) - towardFront(b) || b.troops - a.troops || a.key.localeCompare(b.key))[0];
  if (!dest) return false;
  const troops = Math.min(anchor.troops - Math.max(1, handsNeeded(anchor)), supplyRoom(state, dest, anchor.field.length));
  if (troops < 4) return false;
  pay(state, { gold: 0, supply: 1 }, faction.id, false); moveStack(state, anchor, dest, troops); return true;
}
function offerToPlayer(state, from, kind, extra = {}) {
  const relation = relationOf(state, state.playerId, from);
  if (!currentOffer(state, { from, kind, turn: state.turn })) return;
  if ((relation.offerCooldowns?.[kind] || 0) > state.turn) return;
  if (state.inbox.some(item => item.from === from) || state.inbox.length >= 2) return;
  state.noticeSeq = (state.noticeSeq || 0) + 1;
  state.inbox = [...state.inbox, { id: state.noticeSeq, from, kind, turn: state.turn, ...extra }];
}
/** Nations recruit exactly as the player does: gold for a draw, mostly Sazai, and a girl only once in a long while. */
function aiRecruit(state, faction) {
  for (let draw = 0; draw < 2; draw++) {
    const foodNet = getIncome(state, faction.id).supply - maintenance(state, faction.id).supply;
    // Two N draws can add six mouths. Keep a short food buffer before optional recruitment.
    if (faction.supply === 0 || (foodNet < 2 && faction.supply < Math.max(8, (2 - foodNet) * 3))) break;
    const cost = getRecruitQuote(state, 1, faction.id).cost.gold;
    if (faction.gold < cost * (draw ? 8 : 3)) break;
    faction.gold -= cost; faction.gachaCount = (faction.gachaCount || 0) + 1;
    let value = hash(state.seed, state.turn, draw, `gacha:${faction.id}`), result = 'N';
    for (const [kind, rate] of GACHA.rates) { if (value < rate) { result = kind; break; } value -= rate; }
    const pool = wanderers(state);
    if (result === 'girl' && !pool.length) result = 'SSR';
    if (result !== 'girl') { grantSazai(state, faction.id, result); continue; }
    const kin = pool.filter(id => state.characters[id].group === faction.id), list = kin.length ? kin : pool, id = list[Math.floor(hash(state.seed, state.turn, draw + 1, `girl:${faction.id}`) * list.length)];
    state.characterOwners[id] = faction.id; ensureGrowth(state, id).joined = state.turn;
    recordChronicle(state, `${state.characters[id].name}加入了${faction.name}。`, 'character', faction.id);
  }
}
/** Nations make their own wars and peace, and tell the player why. */
function aiDiplomacy(state, faction) {
  if (state.turn < OPENING_PEACE || faction.diplomacyTurn === state.turn) return;
  faction.diplomacyTurn = state.turn;
  aiRecruit(state, faction);
  const id = faction.id, player = state.playerId, roll = salt => hash(state.seed, state.turn, 0, `${id}:${salt}`), mine = frontierMusterPower(state, id);
  // Diplomacy changes relations, never land ownership. This summary belongs to
  // this call only, after recruitment, and is discarded before the next AI act.
  const land = factionTiles(state, id), borderOwners = new Set();
  for (const tile of land) for (const point of neighbors(tile)) borderOwners.add(state.tiles[point.key]?.ownerId);
  const others = Object.values(state.factions).filter(other => other.alive && other.id !== id), wars = others.filter(other => atWar(state, id, other.id));
  for (const other of wars) {
    const weary = state.turn - readRelation(state, id, other.id).since;
    if (other.isPlayer) {
      if (isBloodFeud(state, id)) continue;
      // The war score is the player's; she reads it from her own side of the table.
      const score = -(readRelation(state, id, player).war?.score || 0);
      if (weary >= 4 && mine < frontierMusterPower(state, player) * .9 && roll('sue') < .4) offerToPlayer(state, id, 'peace');
      else if (weary >= 3 && score <= -40 && roll('yield') < .45) offerToPlayer(state, id, 'peace', { pays: Math.min(faction.gold, 10 + Math.floor(-score / 2)) });
      else if (weary >= 3 && score >= 30 && roll('dictate') < .3) offerToPlayer(state, id, 'peace', { gold: Math.min(60, 10 + Math.floor(score / 2)) });
    }
    else if (!hasFeudBetween(state, id, other.id) && weary >= 6 && roll(`peace:${other.id}`) < .3) endWar(state, id, other.id, 'truce', TRUCE_TURNS);
  }
  const relationToMe = readRelation(state, id, player);
  if (relationToMe.status === 'vassal') {
    // A vassal makes no wars of her own. One who resents a weak overlord walks away.
    if (relationToMe.favor <= -20 && mine >= frontierMusterPower(state, player) * 1.5 && roll('secede') < .25) {
      endWar(state, id, player, 'neutral', 0); changeFavor(state, id, player, -10, '脱离附庸');
      recordChronicle(state, `${faction.name}宣布不再做${state.factions[player].name}的附庸。`, 'diplomacy', id, [id, player]);
      notice(state, 'nation', `${faction.name}脱离了附庸关系：她比你强，又对你不满。`, { factionId: id });
    } else if (!relationToMe.trade && relationToMe.favor >= 10 && roll('trade') < .15) offerToPlayer(state, id, 'trade');
    return;
  }
  if (!atWar(state, id, player) && state.factions[player]?.alive && land.some(tile => tile.discovered)) {
    if (!relationToMe.trade && relationToMe.favor >= 10 && roll('trade') < .15) offerToPlayer(state, id, 'trade');
    else if (relationToMe.status === 'neutral' && (relationToMe.favor >= 25 || wars.length) && roll('pact') < .12) offerToPlayer(state, id, 'pact');
    else if (['neutral', 'pact'].includes(relationToMe.status) && relationToMe.favor >= 60 && roll('ally') < .1) offerToPlayer(state, id, 'ally');
    else if (relationToMe.status === 'neutral' && faction.personality === 'aggressive' && mine >= frontierMusterPower(state, player) * 1.5 && borderOwners.has(player) && roll('tribute') < .2) {
      const sent = state.inbox.length;
      offerToPlayer(state, id, 'tribute', { gold: Math.max(10, Math.min(30, Math.floor(state.factions[player].gold * .4))) });
      if (state.inbox.length > sent) relationOf(state, id, player).insultTurn = state.turn; // A demand for tribute is a grievance the player may answer later.
    }
    // Those who hate a stronger player find each other: an alliance of the aggrieved.
    if (relationToMe.favor <= -40 && state.turn >= 30 && frontierMusterPower(state, player) >= mine * 1.3 && roll('league') < .12) {
      const partner = others.filter(other => !other.isPlayer && !isVassal(state, other.id) && ['neutral', 'pact', 'truce'].includes(readRelation(state, id, other.id).status) && readRelation(state, other.id, player).favor <= -25 && readRelation(state, other.id, player).status !== 'ally')
        .sort((a, b) => readRelation(state, a.id, player).favor - readRelation(state, b.id, player).favor || a.id.localeCompare(b.id))[0];
      if (partner) {
        endWar(state, id, partner.id, 'ally', 0);
        if (land.some(tile => tile.discovered) || factionTiles(state, partner.id).some(tile => tile.discovered)) notice(state, 'nation', `${faction.name}和${partner.name}结盟了：两国都对你不满，向其中一国开战，另一国也会参战。`, { factionId: id });
      }
    }
  }
  if (wars.length >= (faction.personality === 'aggressive' ? 2 : 1)) return;
  const chance = { aggressive: .3, builder: .05 }[faction.personality] ?? .14;
  const targets = others.filter(other => readRelation(state, id, other.id).status === 'neutral' && !graceBlock(state, id, other.id) && borderOwners.has(other.id))
    .map(other => ({ other, ratio: mine / Math.max(1, frontierMusterPower(state, other.id)), favor: readRelation(state, id, other.id).favor }))
    .map(item => ({ ...item, score: item.ratio - item.favor / 60 + roll(item.other.id) / 2 })).sort((a, b) => b.score - a.score);
  const pick = targets[0];
  if (!pick || pick.score < 1.05 || roll('war') > chance) return;
  startWar(state, id, pick.other.id, pick.ratio > 1.5 ? '看你们兵力空虚，这块地我们要了。' : pick.favor < -25 ? '新账旧账一起算。' : '国境挤到一起，总要分个高下。');
}
/** Target value is strategic, with bounded rewards for a safe fight. A 99:1
 * empty province must not outrank a reachable capital or useful enemy army just
 * because dividing by a tiny defender explodes the estimate. Same objectives
 * for every nation; no bonus for attacking the human player. */
function aiAttackScore(state, preview, attackerRating, defenderRating) {
  const target = state.tiles[preview.toKey], from = state.tiles[preview.fromKey];
  const home = state.tiles[state.factions[target.ownerId]?.capitalKey];
  const advantage = 8 * Math.max(-1, Math.min(2, attackerRating / Math.max(1, defenderRating) - 1));
  const infrastructure = target.building && !BUILDINGS[target.building].emergency ? Math.min(12, 4 + (target.buildingLevel || 1) * 2) : 0;
  const approach = home ? 3 * Math.max(-1, Math.min(1, hexDistance(from, home) - hexDistance(target, home))) : 0;
  return (target.isCapital ? 100 : 0) + (!preview.occupy ? 24 : 0) + infrastructure + approach + advantage;
}
const AI_FREE_SUPPLY = 'supply-import';
/** A zero-stock balanced food budget cannot fund even a productive project.
 * Buy only that project's inputs plus one buffer, and execute it atomically.
 * Called after ordinary/free recovery; no subsidy or recurring deficit bailout. */
function aiFoodBootstrapPlan(state, faction, owned, saving = false) {
  if (faction.supply !== 0 || (!saving && faction.gold <= 20) || faction.aiSupplyPurchaseTurn === state.turn || netIncome(state, faction.id).supply !== 0) return null;
  const choices = [], builds = new Map(), upgrades = new Map(), imports = new Map();
  // Prices share the canonical authorities; no state changes until selection.
  const cached = (map, key, quote) => { if (!map.has(key)) map.set(key, quote()); return map.get(key); };
  for (const tile of owned) {
    if (tile.cutSince !== undefined) continue;
    const candidates = [];
    if ((!tile.building || BUILDINGS[tile.building]?.emergency) && tile.troops >= MIN_BUILD) {
      for (const building of Object.values(BUILDINGS)) if (!building.emergency && building.yield.supply > 0 && canBuild(state, tile, building.id)) {
        candidates.push({ building: building.id, level: 1, cost: cached(builds, `${sitePriceKey(state,tile,faction.id)}:${building.id}`, () => constructionCost(state, tile, building.id, faction.id)) });
      }
    }
    const existing = BUILDINGS[tile.building], level = tile.buildingLevel || 1;
    if (existing?.yield.supply > 0 && level < (existing.maxLevel || 5) && tile.troops >= handsNeeded(tile)) {
      candidates.push({ building: tile.building, level: level + 1, cost: cached(upgrades, `${sitePriceKey(state,tile,faction.id)}:${tile.building}:${level}`, () => improvementCost(state, tile, faction.id)) });
    }
    for (const project of candidates) {
      const amount = (project.cost.supply || 0) + 1;
      if (amount > 1000) continue;
      const quote = cached(imports, amount, () => getSupplyQuote(state, amount, faction.id)), total = quote.cost.gold + project.cost.gold;
      if (!saving && faction.gold < total + 20) continue;
      // Food is additive per tile. These non-fort projects change neither
      // population, territory count, nor fort upkeep; national perks stay fixed.
      const projected = { ...tile, building: project.building, buildingLevel: project.level };
      if (tileProduction(state, projected).supply <= tileProduction(state, tile).supply) continue;
      choices.push({ tile, ...project, quote, total });
    }
  }
  choices.sort((a,b) => a.total-b.total || a.tile.key.localeCompare(b.tile.key) || a.building.localeCompare(b.building));
  // Independently confirm the winner against the full national authority.
  // The local filter is equivalent under current additive food/upkeep rules.
  // Future non-local production or upkeep changes must revalidate this filter.
  let choice;
  for (const candidate of choices) {
    const tiles = { ...state.tiles }; tiles[candidate.tile.key] = { ...candidate.tile, building: candidate.building, buildingLevel: candidate.level };
    if (netIncome({ ...state, tiles }, faction.id).supply > 0) { choice = candidate; break; }
  }
  return choice || null;
}
function aiFoodBootstrap(state, faction, owned) {
  const choice = aiFoodBootstrapPlan(state, faction, owned);
  if (!choice) return false;
  pay(state, choice.quote.cost, faction.id, false); faction.supply += choice.quote.amount;
  pay(state, choice.cost, faction.id, false);
  choice.tile.building = choice.building; choice.tile.buildingLevel = choice.level;
  faction.aiSupplyPurchaseTurn = state.turn;
  return true;
}
/** Peaceful food recovery protects a concrete priced project, not idle cash.
 * No permanent policy flag: re-evaluate current production, quotes and war state.
 * null means no special policy; false waits without consuming an AI order. */
function aiFoodRecoverySavingsStep(state, faction, owned) {
  if (faction.supply !== 0 || Object.values(state.factions).some(other => other.alive && other.id !== faction.id && atWar(state, faction.id, other.id))) return null;
  const income = netIncome(state, faction.id);
  if (income.supply !== 0) return null;
  const plan = aiFoodBootstrapPlan(state, faction, owned, true);
  if (!plan || faction.gold >= plan.total + 20) return null;
  if (income.gold > 0) return false; // Save real earnings before discretionary remobilization.
  // A site's nominal military bill is an upper bound on its possible saving.
  // Reject impossible/committed sites before the full national quote scan.
  const candidates = owned.filter(tile => {
    if (tile.foughtTurn === state.turn) return false;
    const status = militaryStatus(state, tile);
    return status.ready && income.gold + status.nominal.gold > 0;
  })
    .sort((a,b) => militaryPriority(state,a,faction.id)-militaryPriority(state,b,faction.id) || a.key.localeCompare(b.key));
  for (const tile of candidates) {
    const quote = getMilitaryQuote(state, tile.key, true, faction.id);
    if (!quote.enabled || quote.cost.gold || quote.cost.supply || quote.upkeepDelta >= 0 || income.gold - quote.upkeepDelta <= 0) continue;
    setMilitaryMode(state, tile.key, true, faction.id); return true;
  }
  return null;
}
function aiStep(state, factionId) {
  const faction = state.factions[factionId];
  const owned = factionTiles(state, factionId);
  if (!owned.length || !faction.alive) return false;
  aiDeploy(state, faction);
  // Every personality must feed its army before discretionary recruitment/expansion.
  const foodNet = getIncome(state, factionId).supply - maintenance(state, factionId).supply;
  if ((foodNet < 0 && faction.supply < Math.max(8, -foodNet * 3)) || faction.supply === 0) {
    const foodGain = (tile, building, level) => tileProduction(state, { ...tile, building, buildingLevel: level }).supply - tileProduction(state, tile).supply;
    const foodUpgradeCosts = new Map(), foodBuildCosts = new Map();
    const foodBuildCost = (tile, buildingId) => {
      const key = `${sitePriceKey(state,tile,factionId)}:${buildingId}`;
      if (!foodBuildCosts.has(key)) foodBuildCosts.set(key, constructionCost(state, tile, buildingId, factionId));
      return foodBuildCosts.get(key);
    };
    const foodUpgradeCost = tile => {
      const key = `${sitePriceKey(state,tile,factionId)}:${tile.building}:${tile.buildingLevel || 1}`;
      if (!foodUpgradeCosts.has(key)) foodUpgradeCosts.set(key, improvementCost(state, tile, factionId));
      return foodUpgradeCosts.get(key);
    };
    const foodSites = owned.filter(tile => (!tile.building || BUILDINGS[tile.building]?.emergency) && tile.troops >= MIN_BUILD && tile.cutSince === undefined)
      .flatMap(tile => Object.values(BUILDINGS).filter(b => !b.emergency && b.yield.supply > 0 && canBuild(state, tile, b.id) && faction.gold>0 && !affordable(state, foodBuildCost(tile, b.id), factionId, false)).map(b => ({tile,b,gain:foodGain(tile,b.id,1)}))).filter(item => item.gain > 0)
      .sort((a,b) => b.gain / b.b.gold - a.gain / a.b.gold);
    if (foodSites.length) {
      const {tile,b} = foodSites[0]; pay(state,constructionCost(state,tile,b.id,factionId),factionId,false); tile.building=b.id; tile.buildingLevel=1; return true;
    }
    const upgrade = owned.filter(tile => BUILDINGS[tile.building]?.yield.supply > 0 && (tile.buildingLevel || 1) < (BUILDINGS[tile.building].maxLevel || 5) && tile.cutSince === undefined && tile.troops >= handsNeeded(tile))
      .find(tile => faction.gold>0 && !affordable(state,foodUpgradeCost(tile),factionId,false) && foodGain(tile,tile.building,(tile.buildingLevel || 1)+1) > 0);
    if (upgrade) { const level=upgrade.buildingLevel||1; pay(state,improvementCost(state,upgrade,factionId),factionId,false); upgrade.buildingLevel=level+1; return true; }
    // Preserve an affordable field army while permanent production is blocked. Imports use
    // exactly the player's quote, leave a small cash reserve, and buy only a short deficit buffer.
    if (foodNet < 0 && faction.aiSupplyPurchaseTurn !== state.turn) {
      const unitGold = getSupplyQuote(state, 1, factionId).unitGold;
      const wanted = Math.max(12, -foodNet * 3) - faction.supply;
      const amount = Math.min(1000, wanted, Math.floor(Math.max(0, faction.gold - 20) / unitGold));
      if (amount >= Math.max(4, -foodNet)) {
        const quote = getSupplyQuote(state, amount, factionId);
        pay(state, quote.cost, factionId, false); faction.supply += amount;
        faction.aiSupplyPurchaseTurn = state.turn;
        return AI_FREE_SUPPLY;
      }
    }
    const recovery = chooseRecovery(state, factionId, netIncome);
    if (recovery) { pay(state, recovery.cost, factionId, false); applyRecovery(state, recovery); return true; }
    if (aiFoodBootstrap(state, faction, owned)) return true;
    const saving = aiFoodRecoverySavingsStep(state, faction, owned);
    if (saving !== null) return saving;
  }
  const others = Object.values(state.factions).filter(f => f.alive && f.id !== factionId);
  if (aiMilitaryStep(state, faction, owned)) return true;
  const opponents = others.filter(f => !peaceReason(state, factionId, f.id));
  const enemyHomes = (opponents.length ? opponents : others).map(f => state.tiles[f.capitalKey]).filter(Boolean);
  const ownCapital = state.tiles[faction.capitalKey];
  const closest = tile => enemyHomes.length ? Math.min(...enemyHomes.map(other => hexDistance(tile, other))) : hexDistance(tile, ownCapital);
  const mustered = aiMusterArmy(state, faction, owned, opponents);
  const attacks = [];
  const siegePreparations = [];
  for (const from of owned) for (const point of neighbors(from)) {
    const to = state.tiles[point.key];
    if (!to?.ownerId || to.ownerId === factionId || (from.troops < 2 && !from.field.length) || peaceReason(state, factionId, to.ownerId)) continue;
    try {
      const preview = calculateBattle(state, from.key, to.key, undefined, factionId, false);
      const onBoard = to.ownerId === state.playerId;
      if (onBoard && state.turnContinuation?.defended && !preview.occupy) continue; // At most one playable defence each world turn.
      const attackerRating = onBoard ? preview.forces.attacker.rating ** 2 : clashStrength(state, from, preview.attackingTroops, from.field, preview.flank * 3);
      const defenderRating = onBoard ? preview.forces.defender.rating ** 2 : clashStrength(state, to, to.troops, null, holdBonus(state, to));
      const threshold = faction.personality === 'aggressive' ? 0.92 : faction.personality === 'builder' ? 1.2 : 1.05;
      const reasonableAttack = preview.occupy || (onBoard ? preview.attackingTroops >= Math.ceil(to.troops * 0.65) && attackerRating >= defenderRating * threshold : attackerRating > defenderRating * threshold);
      if (preview.canAttack && reasonableAttack) attacks.push({ ...preview, score: aiAttackScore(state, preview, attackerRating, defenderRating) });
      else if (preview.canAttack && to.isCapital && from.troops < 36 && recruitAmount(state, from) > 0) siegePreparations.push({ from, target: to, deficit: 1 - attackerRating / Math.max(1, defenderRating) });
    } catch { /* An unusable adjacent tile does not stop the nation. */ }
  }
  const decisiveAttack = attacks.some(attack => state.tiles[attack.toKey].isCapital || !attack.occupy);
  if (!decisiveAttack && aiReactivateFort(state, faction, owned, foodNet)) return true;
  if (!decisiveAttack && aiTrainArmy(state, faction, foodNet)) return true;
  if (!decisiveAttack && aiUpgradeFort(state, faction, owned, foodNet)) return true;
  // An army beside an enemy capital should prepare a siege, rather than endlessly
  // exchanging cheap border provinces with a third nation.
  if (siegePreparations.length && !attacks.some(attack => state.tiles[attack.toKey].isCapital) && !affordable(state, { gold: 5, supply: 2 }, factionId, false)) {
    siegePreparations.sort((a, b) => a.deficit - b.deficit || a.from.key.localeCompare(b.from.key));
    pay(state, { gold: 5, supply: 2 }, factionId, false); siegePreparations[0].from.troops += recruitAmount(state, siegePreparations[0].from); return true;
  }
  if (attacks.length) {
    attacks.sort((a, b) => b.score - a.score || a.toKey.localeCompare(b.toKey));
    const pick = attacks[0], target = state.tiles[pick.toKey], goal = 18 + Math.min(12, Math.floor(frontierMusterPower(state, factionId) / 20));
    const mission = owned.length >= goal && target.building && !BUILDINGS[target.building].emergency && !target.isCapital && hash(state.seed, state.turn, state.revision, `raid:${factionId}:${target.key}`) < .6 ? 'raid' : 'conquest';
    resolveBattle(state, pick.fromKey, pick.toKey, pick.attackingTroops, factionId, false, undefined, mission); return true;
  }
  const network = fortNetwork(state, factionId);
  if (owned.length >= 4 && network.total < network.capacity && foodNet >= 2 && faction.supply >= 12) {
    const site = owned.filter(tile => !tile.building && !tile.isCapital && tile.troops >= Math.max(MIN_BUILD, FORT_GARRISON) && tile.cutSince === undefined)
      .sort((a, b) => Number(neighbors(b).some(p => state.tiles[p.key]?.ownerId === factionId && state.tiles[p.key].isCapital)) - Number(neighbors(a).some(p => state.tiles[p.key]?.ownerId === factionId && state.tiles[p.key].isCapital)) || closest(a) - closest(b) || b.troops - a.troops || a.key.localeCompare(b.key))[0];
    const fortress = site && constructionCost(state, site, 'fort', factionId);
    if (site && faction.gold >= fortress.gold + 20 && !affordable(state, fortress, factionId, false)) {
      pay(state, fortress, factionId, false); site.building = 'fort'; site.buildingLevel = 1; site.fortReadyTurn = state.turn + 1; return true;
    }
  }
  const front = owned.filter(tile => tile.cutSince === undefined && neighbors(tile).some(p => { const t = state.tiles[p.key]; return t?.ownerId && t.ownerId !== factionId && !peaceReason(state, factionId, t.ownerId); }))
    .sort((a, b) => b.field.length - a.field.length || b.troops - a.troops || a.key.localeCompare(b.key));
  const musterSite = front.find(tile => recruitAmount(state, tile) > 0 && tile.troops < Math.max(20, Math.min(90, Math.max(...neighbors(tile).map(p => (state.tiles[p.key]?.ownerId !== factionId ? state.tiles[p.key]?.troops || 0 : 0))) + 10)));
  if (musterSite && faction.supply >= Math.max(6, -foodNet * 2) && !affordable(state, { gold: 5, supply: 2 }, factionId, false)) {
    pay(state, { gold: 5, supply: 2 }, factionId, false); musterSite.troops += recruitAmount(state, musterSite); return true;
  }
  const landGoal = 18 + Math.min(12, Math.floor(frontierMusterPower(state, factionId) / 20));
  const develops = owned.length >= landGoal || faction.personality === 'builder' || (faction.personality === 'balanced' && state.turn % 4 === 0);
  if (develops && !front.length && faction.gold >= 16) {
    const site = !ownCapital.building ? ownCapital : owned.find(tile => !tile.building && tile.troops >= MIN_BUILD && tile.cutSince === undefined);
    if (site) {
      const wanted = foodNet < 3 ? 'farm' : 'mine';
      const buildingId = canBuild(state, site, wanted) ? wanted : Object.keys(BUILDINGS).find(id => id !== 'fort' && !BUILDINGS[id].emergency && canBuild(state, site, id)) || 'fort';
      const building = BUILDINGS[buildingId];
      const cost = constructionCost(state, site, buildingId, factionId);
      if (!affordable(state, cost, factionId, false)) {
        if (buildingId === 'fort' && (network.total >= network.capacity || foodNet < 2 || faction.supply < cost.supply + 8)) return false;
        pay(state, cost, factionId, false); site.building = buildingId; site.buildingLevel = 1; if (buildingId === 'fort') site.fortReadyTurn = state.turn + 1; return true;
      }
    }
  }
  if (develops && !front.length) {
    const upgradeCosts = new Map();
    const improvements = owned.filter(tile => tile.building && (tile.buildingLevel || 1) < (BUILDINGS[tile.building].maxLevel || 5) && tile.cutSince === undefined && tile.troops >= handsNeeded(tile))
      .map(tile => {
        if(faction.gold===0)return null;
        const level = tile.buildingLevel || 1, key = `${sitePriceKey(state,tile,factionId)}:${tile.building}:${level}`;
        // Control differs by tile, so a quote may only be reused at that site.
        if (!upgradeCosts.has(key)) upgradeCosts.set(key, improvementCost(state, tile, factionId));
        const cost = upgradeCosts.get(key);
        if (affordable(state, cost, factionId, false)) return null;
        // Scoring only uses production; defense-network previews are irrelevant.
        const before = tileProduction(state, tile), after = tileProduction(state, { ...tile, buildingLevel: level + 1 });
        return { tile, cost, gain: after.gold - before.gold + (after.supply - before.supply) * (foodNet < 3 ? 3 : 1) };
      }).filter(item => item && item.gain > 0)
      .sort((a, b) => b.gain / b.cost.gold - a.gain / a.cost.gold || a.tile.key.localeCompare(b.tile.key));
    if (improvements.length) { const { tile, cost } = improvements[0]; pay(state, cost, factionId, false); tile.buildingLevel++; return true; }
  }
  const moves = [];
  for (const from of owned.filter(t => t.troops >= 5 && t.marchedTurn !== state.turn)) for (const point of neighbors(from)) {
    const to = state.tiles[point.key], keep = Math.max(1, handsNeeded(from));
    const amount = to?.ownerId === factionId ? Math.min(from.troops - keep, supplyRoom(state, to, from.field.length)) : 0;
    if (amount > 0 && amount >= Math.min(3, from.troops - keep) && !militaryMoveReason(state, from.key, to.key, 1) && closest(to) < closest(from)) moves.push({ from, to, keep, amount, score: closest(from) - closest(to) + from.troops / 20 });
  }
  if (!mustered && moves.length && opponents.length && faction.supply >= 3) {
    moves.sort((a, b) => b.score - a.score || a.to.key.localeCompare(b.to.key));
    pay(state, { gold: 0, supply: 1 }, factionId, false); moveStack(state, moves[0].from, moves[0].to, moves[0].amount);
  }
  if (owned.length < landGoal && !affordable(state, claimCost(state, factionId), factionId, false)) {
    const options = [];
    for (const from of owned.filter(item => item.troops >= MIN_SOURCE && item.cutSince === undefined)) for (const point of neighbors(from)) {
      const tile = maybeTile(state, point.q, point.r, false);
      if (!tile || tile.ownerId || !state.terrainTypes[tile.terrainId].passable) continue;
      const terrain = state.terrainTypes[tile.terrainId];
      const advanceWeight = faction.personality === 'builder' ? 1 : faction.personality === 'aggressive' ? 3.5 : 2.5;
      options.push({ tile, from, score: -closest(tile) * advanceWeight + terrain.yield.gold + terrain.yield.supply + from.troops / 6 + tile.troops + hash(state.seed, tile.q, tile.r, factionId) });
    }
    if (options.length) {
      options.sort((a, b) => b.score - a.score);
      pay(state, claimCost(state, factionId), factionId, false);
      settle(options[0].tile, options[0].from, factionId); return true;
    }
  }
  const strongest = [...owned].filter(tile => tile.troops < housingOf(state, tile) && tile.cutSince === undefined).sort((a, b) => closest(a) - closest(b) || a.troops - b.troops)[0];
  if (strongest && !affordable(state, { gold: 5, supply: 2 }, factionId, false)) {
    pay(state, { gold: 5, supply: 2 }, factionId, false); strongest.troops += recruitAmount(state, strongest); return true;
  }
  return false;
}

function storyEvents(state) { return [...STORY_EVENTS, ...(state.customEvents || [])]; }
function storyEventCast(event) {
  const ids = new Set(Array.isArray(event?.requires) ? event.requires : []);
  for (const line of event?.lines || []) if (line?.speaker) ids.add(line.speaker);
  for (const choice of event?.choices || []) if (choice?.reply?.speaker) ids.add(choice.reply.speaker);
  return [...ids];
}
function storyEventReady(state, event) {
  return Boolean(event && storyEventCast(event).every(id => canServe(state, id, state.playerId)));
}
/** Sandbox vignettes: at most one waits at a time, and each plays once per world. */
function pickStoryEvent(state) {
  if (state.pendingEvent || state.battle || hash(state.seed, state.turn, 0, 'story') > 0.45) return;
  const open = storyEvents(state).filter(event => !state.storySeen.includes(event.id) && state.turn >= event.minTurn && storyEventReady(state, event));
  if (!open.length) return;
  open.sort((a, b) => hash(state.seed, state.turn, 0, a.id) - hash(state.seed, state.turn, 0, b.id));
  state.pendingEvent = open[0].id;
}
export function getPendingEvent(state) { return storyEvents(state).find(event => event.id === state.pendingEvent) || null; }
// Optional paid choices spend their complete pre-choice resource costs. This is
// not a global rule for involuntary narrative losses or troop casualties.
const dialogueEffectValue = (value, limit) => Math.max(-limit, Math.min(limit, Math.trunc(Number(value) || 0)));
function paidChoiceQuote(state, effect, fields = {}) {
  const cost = { gold: Math.max(0, -(effect.gold || 0)), supply: Math.max(0, -(effect.supply || 0)) };
  const reason = affordable(state, cost, state.playerId, false);
  return { ...fields, enabled: !reason, reason, cost, effect };
}
export function getDialogueChoiceQuote(state, { id, effect } = {}) {
  const zero = { gold: 0, supply: 0, bond: 0 };
  if (typeof id !== 'string' || id.length > 120) return { enabled: false, reason: '对话编号无效。', cost: { gold: 0, supply: 0 }, effect: zero, alreadySeen: false };
  if (state.storySeen.includes(id)) return { enabled: true, reason: '', cost: { gold: 0, supply: 0 }, effect: zero, alreadySeen: true };
  const raw = isObject(effect) ? effect : {};
  const normalized = { gold: dialogueEffectValue(raw.gold, 200), supply: dialogueEffectValue(raw.supply, 200), bond: dialogueEffectValue(raw.bond, 30) };
  return paidChoiceQuote(state, normalized, { alreadySeen: false });
}
export function getStoryChoiceQuote(state, { choice, expectedEventId } = {}) {
  const event = getPendingEvent(state), denied = reason => ({ enabled: false, reason, cost: { gold: 0, supply: 0 }, eventId: event?.id || null, effect: {} });
  if (!event) return denied('当前没有待处理的事件。');
  if (expectedEventId !== undefined && expectedEventId !== event.id) return denied('事件已变化，请重新选择。');
  const selected = event.choices[choice];
  if (!selected) return denied('这个选项不存在。');
  return paidChoiceQuote(state, selected.effect || {}, { eventId: event.id });
}
export function getStoryForfeitQuote(state, { expectedEventId } = {}) {
  const event = getPendingEvent(state), cost = { gold: 0, supply: 0 };
  let reason = !event ? '当前没有待处理的事件。' : expectedEventId !== event.id ? '事件已变化，请重新选择。' : '';
  if (!reason && (!Array.isArray(event.choices) || !event.choices.length)) reason = '这个事件没有可选择的结果。';
  if (!reason && event.choices.some((choice, index) => getStoryChoiceQuote(state, { choice: index, expectedEventId }).enabled)) reason = '仍有可以承担的选项，请选择一个结果。';
  return { enabled: !reason, reason, cost, eventId: event?.id || null };
}

function grantSazai(state, factionId, rank) {
  const home = state.tiles[state.factions[factionId].capitalKey];
  // New Sazai report to the capital, which takes them in up to what it can feed (its 补给上限).
  const requested = rank === 'N' ? GACHA.troopsPerN : 1, capacity = rank === 'N' ? (home ? supplyLimit(state, home) : 100) : 99;
  const before = home ? rank === 'N' ? home.troops : eliteOf(home)[rank] : 0;
  if (home) {
    if (rank === 'N') home.troops = Math.max(home.troops, Math.min(capacity, home.troops + GACHA.troopsPerN));
    else addElite(home, rank);
  }
  const after = home ? rank === 'N' ? home.troops : eliteOf(home)[rank] : before;
  return { rank, requested, accepted: after - before, overflow: requested - (after - before), capacity, before, after };
}
export function girlRate(state) {
  const base = GACHA.rates.find(([kind]) => kind === 'girl')[1];
  const envoy = state.posts?.envoy && canServe(state, state.posts.envoy, state.playerId) ? heroView(state, state.posts.envoy).stats.charm : 0;
  const fame = Object.keys(state.growth || {}).reduce((sum, id) => sum + (canServe(state, id, state.playerId) ? ecoOf(state, id, 'girl') : 0), 0);
  return Math.min(GACHA.girlCap, base + getHero(state, state.playerId).stats.charm * 0.0005 + envoy * 0.001 + fame);
}
function drawRecruit(state, salt) {
  let value = hash(state.seed, state.turn, state.gachaCount, salt);
  for (const [result, rate] of GACHA.rates) { const chance = result === 'girl' ? girlRate(state) : rate; if (value < chance) return result; value -= chance; }
  return 'N';
}
/** A connected patch touching the discovery, including already-loaded neutral land at map capacity. */
function frontierCells(state, fresh, count, idle) {
  const home = state.tiles[state.factions[state.playerId].capitalKey], seen = new Set(fresh), room = MAX_TILES - Object.keys(state.tiles).length;
  const edges = (idle ? Object.values(state.tiles).filter(tile => tile.discovered && neighbors(tile).some(point => state.tiles[point.key]?.ownerId === state.playerId)) : fresh.map(key => state.tiles[key]))
    .filter(tile => tile && !tile.ownerId && !tile.isCapital && state.terrainTypes[tile.terrainId].passable)
    .sort((a, b) => hexDistance(b, home) - hexDistance(a, home) || a.key.localeCompare(b.key));
  const radius = count > 7 ? 2 : 1;
  let best = [];
  for (const edge of edges.slice(0, 48)) {
    const directions = [...DIRECTIONS].sort((a, b) => hexDistance({ q: edge.q + b[0] * radius, r: edge.r + b[1] * radius }, home) - hexDistance({ q: edge.q + a[0] * radius, r: edge.r + a[1] * radius }, home));
    for (const [dq, dr] of [...directions, [0, 0]]) {
      const center = { q: edge.q + dq * radius, r: edge.r + dr * radius }, visited = new Set(), cells = [], queue = [edge];
      let added = 0;
      while (queue.length && cells.length < count) {
        queue.sort((a, b) => hexDistance(a, center) - hexDistance(b, center) || a.q - b.q || a.r - b.r);
        const cell = queue.shift(), key = tileKey(cell.q, cell.r), tile = state.tiles[key];
        if (visited.has(key)) continue;
        visited.add(key);
        if (!coordValid(cell.q) || !coordValid(cell.r) || !inWorld(state, cell.q, cell.r) || hexDistance(cell, center) > radius) continue;
        if (tile ? tile.ownerId || tile.isCapital || (!idle && tile.discovered && !seen.has(key)) || !state.terrainTypes[tile.terrainId].passable : added >= room || !landHere(state, cell.q, cell.r)) continue;
        cells.push({ q: cell.q, r: cell.r }); if (!tile) added++;
        queue.push(...neighbors(cell));
      }
      cells.sort((a, b) => hexDistance(a, center) - hexDistance(b, center) || a.q - b.q || a.r - b.r);
      if (cells.length > best.length) best = cells;
      if (best.length === count) return best;
    }
  }
  return best.length >= 3 ? best : [];
}
/** Discovery creates a compact rival. Late quiet campaigns can resettle neutral frontiers too. */
function fogBirth(state, fresh = []) {
  const idle = !fresh.length;
  if (state.turn < FIRST_DISCOVERY_TURN || state.turn - (state.lastBirthTurn || 0) < ARRIVAL_EVERY * (idle ? 3 : 1)) return null;
  if (idle && (state.turn < 40 || Object.values(state.factions).filter(faction => faction.alive && !faction.isPlayer).length >= 3)) return null;
  // A group added explicitly as a Mod may already be alive when its old queue entry is reached.
  while (state.arrivalQueue?.length && state.factions[state.arrivalQueue[0].id]?.alive) state.arrivalQueue.shift();
  const starterGroup = state.characters?.[state.recruitedHeroIds?.[0]]?.group;
  while (ARRIVALS[state.arrivalIndex] && (state.factions[ARRIVALS[state.arrivalIndex].id]?.alive || (ARRIVALS[state.arrivalIndex].id === starterGroup && !STARTER_BANDS[starterGroup]?.members))) state.arrivalIndex++;
  const queued = state.arrivalQueue?.[0], listed = ARRIVALS[state.arrivalIndex];
  const gone = Object.values(state.factions).filter(faction => !faction.alive && !faction.isPlayer);
  const next = queued || listed, roomForNation = Object.keys(state.factions).length < 100;
  const definition = next && (state.factions[next.id] || roomForNation) ? next : gone[Math.floor(hash(state.seed, state.turn, 0, 'return') * gone.length)];
  if (!definition || !wanderers(state).length) return null;
  state.fogRolls = (state.fogRolls || 0) + 1;
  if (hash(state.seed, state.turn, state.revision, 'fog-birth') > .4 + state.fogRolls * .2) return null;
  const target = frontierTarget(state, 'birth-size'), cells = frontierCells(state, fresh, frontierSize(target), idle);
  if (!cells.length) return null;
  const free = id => state.characterOwners[id] === null && !state.captives[id] && !state.campaign?.prison?.[id], roll = salt => hash(state.seed, state.turn, 0, `${definition.id}:${salt}`);
  const members = Object.keys(state.characters).filter(id => state.characters[id].group === definition.id && free(id));
  if (free(definition.leaderId) && !members.includes(definition.leaderId)) members.unshift(definition.leaderId);
  const leader = members.includes(definition.leaderId) ? definition.leaderId : members[0] || null;
  const kin = members.filter(id => !definition.wanderers?.includes(id) || id === leader);
  const others = Object.keys(state.characters).filter(id => free(id) && !kin.includes(id)).sort((a, b) => roll(a) - roll(b));
  const crew = [...kin, ...others.slice(0, Math.min(3, Math.floor(roll('hires') * 2) + Math.floor(target / 150)))];
  if (!crew.length) return null;
  // A country needs at least one available character.
  // Neither an owned girl nor a prisoner is borrowed, cloned, or silently taken from the player.
  const past = state.factions[definition.id];
  establishFrontierFaction(state, definition, cells, crew, target);
  if (definition === queued) state.arrivalQueue.shift(); else if (definition === listed) state.arrivalIndex++;
  state.lastBirthTurn = state.turn; state.fogRolls = 0;
  recordChronicle(state, `${idle ? '边疆出现了' : '探索时发现了'}${past ? '复国的' : '新的'}国家：${definition.name}。`, 'diplomacy', definition.id);
  notice(state, 'nation', idle ? `${definition.name}在无主边疆建立了新国，享有两回合保护期。` : `在迷雾里发现了${definition.name}。她们的领土大半还在雾中。`, { factionId: definition.id });
  return definition.id;
}
function recruitOnce(state) {
  const pool = wanderers(state);
  let result = drawRecruit(state, 'recruit');
  if (result === 'girl' && !pool.length) result = 'SSR';
  state.gachaCount++;
  if (result === 'girl') {
    const id = pool[Math.floor(hash(state.seed, state.turn, state.gachaCount, 'who') * pool.length)], character = state.characters[id];
    state.characterOwners[id] = state.playerId; state.recruitedHeroIds.push(id); ensureGrowth(state, id).joined = state.turn; seatAtHome(state, id);
    recordChronicle(state, `${character.name}听到招募的消息，加入了${state.factions[state.playerId].name}！`, 'character', state.playerId);
    normalizeParty(state);
    return { result, characterId: id, line: RECRUIT_LINES[id] || `${character.name}加入了队伍。` };
  }
  const receipt = grantSazai(state, state.playerId, result);
  const line = SAZAI_LINES[Math.floor(hash(state.seed, state.turn, state.gachaCount, 'line') * SAZAI_LINES.length)];
  log(state, `抽中了 ${SAZAI_RANKS[result].name}，${result === 'N' ? '首都驻军' : result + ' 库存'}实际 +${receipt.accepted}${receipt.overflow ? `；容量不足，${receipt.overflow} ${result === 'N' ? '人' : '队'}未入库` : ''}。`, 'army');
  return { result, line, receipt };
}
function periodicWorldEvent(state) {
  if (state.turn % 8 !== 0 || state.lastWorldEventTurn === state.turn) return;
  state.lastWorldEventTurn = state.turn;
  // A wandering girl may find her way home; otherwise only the player's recruiters can reach her.
  const homeward = wanderers(state).filter(id => Object.values(state.factions).some(faction => faction.alive && !faction.isPlayer && faction.id === state.characters[id].group));
  if (homeward.length && hash(state.seed, state.turn, 0, 'homeward') < 0.35) {
    const id = homeward[Math.floor(hash(state.seed, state.turn, 1, 'homeward') * homeward.length)], home = state.characters[id].group;
    state.characterOwners[id] = home;
    recordChronicle(state, `${state.characters[id].name}结束流浪，回到了${state.factions[home].name}。`, 'character', home);
    return;
  }
  const faction = state.factions[state.playerId], cycle = Math.floor(state.turn / 8);
  if (cycle % 3 === 0) {
    const reward = 8 + Math.min(20, factionTiles(state, state.playerId).length); faction.supply += reward;
    recordChronicle(state, `边疆丰收：补给 +${reward}。下一轮世界变化将在八回合后到来。`, 'event');
  } else if (cycle % 3 === 1) {
    const reward = 10 + Math.min(20, factionTiles(state, state.playerId).filter(tile => tile.building).length); faction.gold += reward;
    recordChronicle(state, `新商路开通：金币 +${reward}。`, 'event');
  } else {
    const cost = Math.min(8, Math.floor(faction.gold * 0.1)); faction.gold -= cost;
    recordChronicle(state, `边境设施维护：支出 ${cost} 金币，各地继续运转。`, 'event');
  }
}
/** Treaties run out, neighbours rub along or rub each other the wrong way. */
function tickRelations(state) {
  const player = state.playerId;
  for (const [key, relation] of Object.entries(state.relations)) {
    const [a, b] = key.split('|');
    if (!state.factions[a]?.alive || !state.factions[b]?.alive) { if (relation.status !== 'neutral') Object.assign(relation, { status: 'neutral', until: 0, trade: false }); delete relation.war; continue; }
    if ([a, b].includes(player)) {
      const other = a === player ? b : a;
      if (isBloodFeud(state, other)) {
        relation.favor = -100;
        if (relation.status !== 'war') enforceBloodFeudWar(state, other, '血海深仇，不死不休！');
        continue;
      }
    } else if (hasFeudBetween(state, a, b)) {
      relation.favor = -100;
      if (relation.status !== 'war') startWar(state, a, b, '同伴遭处决之仇，不死不休！', true, null, 'feud');
      continue;
    }
    if (relation.until && relation.until <= state.turn) {
      const was = STATUS_NAME[relation.status];
      Object.assign(relation, { status: 'neutral', until: 0, since: state.turn });
      if ([a, b].includes(player)) notice(state, 'peace', `与${state.factions[a === player ? b : a].name}的${was}到期了，恢复和平。`, { factionId: a === player ? b : a });
    }
    if (relation.trade && state.turn % 2 === 0) changeFavor(state, a, b, 1, '通商往来');
    if (relation.status === 'war' && state.turn % 2 === 0) changeFavor(state, a, b, -1, '战事拖延');
    if (relation.status !== 'war' && relation.favor > 0 && state.turn % 6 === 0) changeFavor(state, a, b, -1, '时间冲淡');
  }
  // Resident envoys: a little warmer every turn, up to what her charm can carry.
  for (const [factionId, id] of Object.entries(state.envoys || {})) {
    const quote = envoyEffect(state, factionId, id);
    if (!quote) { delete state.envoys[factionId]; seatAtHome(state, id); continue; }
    if (quote.gain > 0) changeFavor(state, player, factionId, quote.gain, '使节往来');
  }
}
/** What a resident envoy does each turn in a court: +1 favor, +1 more for great charm, +1 for 亲善, up to a ceiling set by her charm. */
function envoyEffect(state, factionId, id) {
  const faction = state.factions[factionId], relation = readRelation(state, state.playerId, factionId);
  if (!faction?.alive || faction.isPlayer || !canServe(state, id, state.playerId) || relation.status === 'war') return null;
  const charm = heroView(state, id).stats.charm, cap = Math.min(DIPLOMACY_RULES.envoyMax, DIPLOMACY_RULES.envoyBase + charm * DIPLOMACY_RULES.envoyPerCharm) + (relation.status === 'vassal' ? 20 : 0);
  const speed = 1 + (charm >= 5 ? 1 : 0) + (quirkIs(state, id, 'q_envoy') ? 1 : 0);
  return { characterId: id, cap, speed, gain: Math.max(0, Math.min(speed, cap - relation.favor)) };
}
function resumeTurn(state) {
  const continuation = state.turnContinuation;
  requireThat(continuation && continuation.startedTurn === state.turn, '战争阶段记录无效。');
  while (continuation.factionIndex < continuation.factionIds.length) {
    const faction = state.factions[continuation.factionIds[continuation.factionIndex]];
    if (faction?.alive && !faction.isPlayer) {
      aiDiplomacy(state, faction);
      let usedFreeSupplyRetry = false;
      while (continuation.actionIndex < 4) {
        continuation.actionIndex++;
        const acted = aiCaptivityStep(state, faction.id) || aiTransportStep(state,faction) || aiStep(state, faction.id);
        // Imports use the public zero-AP quote. At most one import per nation
        // per world turn may retry this slot, including across a saved battle.
        // The local boolean also bounds the loop if a future free action is buggy.
        if (acted === AI_FREE_SUPPLY && !usedFreeSupplyRetry) { usedFreeSupplyRetry = true; continuation.actionIndex--; continue; }
        if (state.battle) return { turn: state.turn, income: continuation.income, pendingBattle: true, battleId: state.battle.id };
        if (!acted || !faction.alive) break;
      }
    }
    continuation.factionIndex++; continuation.actionIndex = 0;
  }
  const income = continuation.income;
  state.turnContinuation = null; state.turn++;
  state.maxAP = getCommandPlan(state).total; state.ap = state.maxAP;
  tendPrison(state);
  runMarchOrders(state);
  tickCampaign(state);
  runCampaignOrders(state);
  tickTransport(state);
  settleDuties(state, true);
  const explored = autoExplore(state);
  periodicWorldEvent(state);
  tickRelations(state);
  if (state.turn === OPENING_PEACE) notice(state, 'era', `开局保护期结束。各国仍是和平关系，但从现在起谁都可以宣战。在“诸国”里能看到关系和好感。`);
  checkProgress(state, continuation.deferredProsperity ? continuation.startedTurn : null);
  fogBirth(state, []);
  pickStoryEvent(state);
  return { turn: state.turn, income, turnCompleted: true, ...(explored ? { explored } : {}) };
}
/** Exploring costs one command and nothing else. */
const EXPLORE_COST = Object.freeze({ ap: 1, gold: 0, supply: 0 });
export const AUTO_EXPLORE_MAX = 4;
const exploreRadius = state => 1 + getHero(state, state.playerId).stats.scout + (leadQuirk(state, 'q_scout') ? 1 : 0);
function exploreCell(state, cell) {
  pay(state, EXPLORE_COST);
  const radius = exploreRadius(state), known = new Set(Object.values(state.tiles).filter(tile => tile.discovered).map(tile => tile.key));
  const revealed = revealArea(state, cell.q, cell.r, radius);
  requireThat(revealed > 0, '当前没有可继续揭示的新地块；仍可经营既有国土与推进回合。');
  log(state, `${getHero(state, state.playerId).name}揭开了 ${revealed} 块未知土地。`, 'explore');
  const nation = fogBirth(state, Object.values(state.tiles).filter(tile => tile.discovered && !known.has(tile.key)).map(tile => tile.key));
  return { revealed, centerKey: cell.key, radius, nation };
}
const earlierRank = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i]; return false; };
/** Where automatic exploration goes next: fog on the explored edge, nearest the capital first, single fog pockets last. */
/* ------------------------------------------------------------------ 差事 ------------------------------------------------------------------
   A girl who is not out fighting can work a piece of the player's land (duties.mjs has the jobs). Sending her costs one
   command; changing her job on the same land and calling her back are free. */
const dutyTerrainName = (state, tile) => state.terrainTypes[tile?.terrainId]?.name || tile?.key || '';
/** Why she cannot take a duty right now, or '' when she can (wherever she is). */
function dutyBlock(state, id) {
  if (!canServe(state, id, state.playerId)) return '她现在不能出来做事。';
  if (id === state.activeHeroId) return '领军要带兵，不能去管事。';
  if (id === state.companionId) return '她是领军的副手，先换个副手。';
  if (Object.values(state.posts || {}).includes(id)) return '她在任职（财务官、军需官这类），先卸任。';
  if (Object.values(state.envoys || {}).includes(id)) return '她在出使，先召回。';
  if (mayorCity(state, id)) return '她是市长，离不开她的城。';
  const c = state.campaign;
  if ([...Object.values(c?.flights || {}).flatMap(f => f.pilotIds || []), ...Object.values(c?.airportGuests || {}).flat()].includes(id)) return '她在飞机上。';
  if (marchOrdersOf(state).some(order => (order.girls || []).includes(id))) return '她在有远行目标的编队里，先取消目标或换人。';
  return '';
}
/** Where she is now, in words. */
function dutyWhere(state, id) {
  const duty = dutiesOf(state)[id];
  if (duty) return `在${dutyTerrainName(state, state.tiles[duty.key])}${dutyById(duty.job)?.name || ''}`;
  const tile = Object.values(state.tiles).find(t => (t.garrison || []).includes(id) || (t.field || []).includes(id));
  if (!tile) return '';
  return `${tile.isCapital && tile.ownerId === state.playerId ? '首都' : dutyTerrainName(state, tile)}${(tile.garrison || []).includes(id) ? '驻守' : '待命'}`;
}
/** A tile's control, output and room for people, worked out once per plan (a long game has many tiles and many girls). */
function dutyTileFacts(state, tile, cache) {
  let facts = cache?.get(tile.key);
  if (!facts) { facts = { control: controlAt(state, tile).value, made: tileProduction(state, tile), room: getSupply(state, tile.key)?.room || 0 }; cache?.set(tile.key, facts); }
  return facts;
}
/** How much one duty on one tile is worth, in gold a turn (grain counts more when grain is short). */
function dutyScore(state, tile, effect, grainShort, cache) {
  if (!effect?.value) return 0;
  if (effect.gold) return effect.gold;
  if (effect.supply) return effect.supply * (grainShort ? 1.4 : .8);
  if (effect.control) {
    const facts = dutyTileFacts(state, tile, cache), gain = Math.min(1 - facts.control, effect.control);
    return gain > 0 ? (facts.made.gold + facts.made.supply * (grainShort ? 1.4 : .8)) * gain / Math.max(.15, facts.control) : 0;
  }
  if (effect.growth) return dutyTileFacts(state, tile, cache).room > 0 ? effect.growth * .3 : 0;
  return 0;
}
const dutyLand = state => factionTiles(state, state.playerId).filter(t => t.discovered && t.cutSince === undefined && state.terrainTypes[t.terrainId]?.passable);
/** 差事 quote: one girl, one tile, one job. */
export function getDutyQuote(state, key, characterId, job) {
  const tile = state.tiles[key], duty = dutyById(job), mine = dutiesOf(state)[characterId], same = mine?.key === key;
  const cost = { ap: same ? 0 : DUTY_RULES.ap, gold: 0, supply: 0 };
  const effect = tile && duty ? dutyEffect(state, tile, characterId, job) : null;
  const reason = !tile || tile.ownerId !== state.playerId || !tile.discovered || tile.shipId || !state.terrainTypes[tile.terrainId]?.passable ? '只能派到自己的地上。'
    : tile.cutSince !== undefined ? '这块地和首都断了联系，先打通。'
    : !duty || !state.characters[characterId] ? C.invalidAction
    : dutyBlock(state, characterId)
    || (same && mine.job === job ? '她已经在做这项差事。' : '')
    || (!effect.value ? `她的${duty.statName}是 0，做这个没用。` : '')
    || (state.ap < cost.ap ? say('apNeed', { ap: cost.ap, left: state.ap }) : '');
  const current = tile ? dutyAt(state, key) : null;
  return { enabled: !reason, reason, cost, key, characterId, job, effect, line: dutyLine(effect, tile && effect?.control ? controlAt(state, tile).percent : null),
    replaces: current && current.id !== characterId ? current.id : null, where: dutyWhere(state, characterId), action: { type: 'assignDuty', key, characterId, job } };
}
/** Who could work this tile, each with her best job here, best first. */
export function getDutyCandidates(state, key) {
  const tile = state.tiles[key];
  if (!tile || tile.ownerId !== state.playerId) return [];
  const grainShort = getStats(state).income.supply < 3, here = dutyAt(state, key), cache = new Map();
  return state.recruitedHeroIds.filter(id => !dutyBlock(state, id) && id !== here?.id).map(id => {
    const jobs = DUTIES.map(duty => { const effect = dutyEffect(state, tile, id, duty.id); return { job: duty.id, effect, score: dutyScore(state, tile, effect, grainShort, cache) }; }).sort((a, b) => b.score - a.score);
    return { id, name: state.characters[id].name, where: dutyWhere(state, id), onDuty: Boolean(dutiesOf(state)[id]), best: jobs[0], jobs };
  }).sort((a, b) => Number(a.onDuty) - Number(b.onDuty) || b.best.score - a.best.score || a.id.localeCompare(b.id));
}
/** Girls with nothing to do. A battle seats at most six girls a side, so every army in the field keeps its six strongest
 *  (that is a full squad), and so do a war border and wherever the leader stands; a quiet garrison keeps only the first
 *  guard of the capital or a fort. Everyone else is idle. Leaders, deputies, officers, envoys, mayors, fliers and marchers
 *  never are. */
export function getIdleCharacters(state) {
  const tiles = factionTiles(state, state.playerId);
  const front = new Set(tiles.filter(tile => neighbors(tile).some(point => { const owner = state.tiles[point.key]?.ownerId; return owner && owner !== state.playerId && relationOf(state, state.playerId, owner).status === 'war'; })).map(tile => tile.key));
  const power = id => { const v = heroView(state, id).stats; return (v.attack || 0) + (v.defense || 0); }, keep = new Set(), placed = new Set();
  const strongest = list => [...list].sort((a, b) => power(b) - power(a) || a.localeCompare(b)).slice(0, MAX_SEATS);
  for (const tile of tiles) {
    const serve = id => canServe(state, id, state.playerId), field = (tile.field || []).filter(serve), garrison = (tile.garrison || []).filter(serve);
    [...field, ...garrison].forEach(id => placed.add(id));
    if (front.has(tile.key) || [...field, ...garrison].includes(state.activeHeroId)) strongest([...field, ...garrison]).forEach(id => keep.add(id));
    else {
      strongest(field).forEach(id => keep.add(id));
      if ((tile.isCapital || tile.building === 'fort') && garrison[0]) keep.add(garrison[0]);
    }
  }
  return state.recruitedHeroIds.filter(id => placed.has(id) && !keep.has(id) && !dutyBlock(state, id) && !dutiesOf(state)[id]);
}
/** 一键安排: every idle girl to the tile and job where she adds the most, one girl per tile, no more than the commands left. */
export function getDutyPlan(state, limit = Math.floor(state.ap / DUTY_RULES.ap)) {
  const idle = getIdleCharacters(state), worked = new Set(Object.values(dutiesOf(state)).map(duty => duty.key)), land = dutyLand(state).filter(tile => !worked.has(tile.key)), grainShort = getStats(state).income.supply < 3, options = [], cache = new Map();
  for (const id of idle) for (const tile of land) for (const duty of DUTIES) {
    const effect = dutyEffect(state, tile, id, duty.id), score = dutyScore(state, tile, effect, grainShort, cache);
    if (score >= 1) options.push({ characterId: id, key: tile.key, job: duty.id, effect, score: Math.round(score * 10) / 10 });
  }
  options.sort((a, b) => b.score - a.score || a.characterId.localeCompare(b.characterId) || a.key.localeCompare(b.key) || a.job.localeCompare(b.job));
  const girls = new Set(), tiles = new Set(), plan = [];
  for (const option of options) {
    if (plan.length >= Math.max(0, limit)) break;
    if (girls.has(option.characterId) || tiles.has(option.key)) continue;
    girls.add(option.characterId); tiles.add(option.key);
    plan.push({ ...option, name: state.characters[option.characterId].name, line: dutyLine(option.effect, option.effect.control ? controlAt(state, state.tiles[option.key]).percent : null) });
  }
  return { idle: idle.length, land: land.length, limit: Math.max(0, limit), plan, cost: { ap: plan.length * DUTY_RULES.ap, gold: 0, supply: 0 }, action: plan.length ? { type: 'assignDuties', plan: plan.map(({ characterId, key, job }) => ({ characterId, key, job })) } : null };
}
function putOnDuty(state, id, key, job) {
  const c = state.campaign, before = dutyAt(state, key);
  c.duties ||= {};
  if (before && before.id !== id) delete c.duties[before.id];
  for (const tile of Object.values(state.tiles)) {
    if (tile.garrison?.includes(id)) tile.garrison = tile.garrison.filter(x => x !== id);
    if (tile.field?.includes(id)) tile.field = tile.field.filter(x => x !== id);
  }
  c.duties[id] = { key, job, since: state.turn };
  if (before && before.id !== id) seatAtHome(state, before.id);
  log(state, `${state.characters[id].name}去${dutyTerrainName(state, state.tiles[key])} ${key} ${dutyById(job).name}：${dutyLine(dutyEffect(state, state.tiles[key], id, job))}。`, 'economy');
}
export function autoExploreTarget(state) {
  const faction = state.factions[state.playerId], home = state.tiles[faction?.capitalKey] || Object.values(state.tiles).find(tile => tile.ownerId === state.playerId) || { q: 0, r: 0 };
  const radius = exploreRadius(state);
  let best = null;
  for (const tile of Object.values(state.tiles)) {
    if (tile.discovered || !neighbors(tile).some(p => state.tiles[p.key]?.discovered)) continue;
    let fog = 0;
    for (const cell of hexArea(tile.q, tile.r, radius)) if (coordValid(cell.q) && coordValid(cell.r) && inWorld(state, cell.q, cell.r) && !state.tiles[tileKey(cell.q, cell.r)]?.discovered) fog++;
    const rank = [fog <= 1 ? 1 : 0, hexDistance(tile, home), -fog, tile.key];
    if (!best || earlierRank(rank, best.rank)) best = { tile, rank };
  }
  return best?.tile || null;
}
/** The standing order 每回合自动探索: at the start of a turn, spend up to the set number of commands on fog. */
function autoExplore(state) {
  const want = Math.min(state.management?.explore || 0, state.ap);
  const done = { spent: 0, revealed: 0, nations: [] };
  for (let i = 0; i < want; i++) {
    const tile = autoExploreTarget(state);
    if (!tile || affordable(state, EXPLORE_COST)) break;
    const result = exploreCell(state, tile);
    done.spent++; done.revealed += result.revealed; if (result.nation) done.nations.push(result.nation);
  }
  if (done.spent) log(state, `自动探索花了 ${done.spent} 令，揭开 ${done.revealed} 块土地。`, 'explore');
  return done.spent ? done : null;
}
/** 余令探索: the switch is on and the turn ends with commands left — every one left goes into the fog,
 * nearest the capital first (the same order as 每回合自动探索). 托管 has already spent what it wanted. */
function exploreLeftover(state) {
  if (!state.management?.exploreLeft || state.ap < EXPLORE_COST.ap) return null;
  const done = { spent: 0, revealed: 0, nations: [] };
  while (state.ap >= EXPLORE_COST.ap) {
    const tile = autoExploreTarget(state);
    if (!tile || affordable(state, EXPLORE_COST)) break;
    const result = exploreCell(state, tile);
    done.spent++; done.revealed += result.revealed; if (result.nation) done.nations.push(result.nation);
  }
  if (done.spent) log(state, `回合结束前，剩下的 ${done.spent} 令拿去探索，揭开 ${done.revealed} 块土地。`, 'explore');
  // A nation met in the fog joins this very world turn, so it needs its research and economy records now.
  if (done.nations.length) migrateCampaign(state);
  return done.spent ? done : null;
}
function prepareFiscalSettlement(state) {
  reconcileFactions(state);
  settleCutOff(state);
  reconcileFactions(state);
  if (state.management?.mode && state.management.mode !== 'off' && state.ap) {
    const developed = developRealm(state, state.management);
    if (developed.actions.length) log(state, `内政托管完成 ${developed.actions.length} 项建设，支出 ${developed.cost.gold} 金币、${developed.cost.supply} 补给。`, 'build');
  }
  // Only current demands can start a war. An earlier demand cannot override a new treaty.
  const unanswered = state.inbox;
  state.inbox = [];
  for (const item of unanswered) if (currentOffer(state, item)) {
    const relation = relationOf(state, state.playerId, item.from); relation.offerCooldowns ||= {}; relation.offerCooldowns[item.kind] = state.turn + 2;
    if (item.kind === 'tribute' && !graceBlock(state, item.from, state.playerId)) startWar(state, item.from, state.playerId, '进贡的要求被无视了。');
  }
  for (const faction of Object.values(state.factions).filter(f => f.alive)) { settleMilitaryBudget(state, faction.id); settleFortBudget(state, faction.id); }
  return Object.values(state.factions).filter(f => f.alive).map(f => ({ factionId: f.id, report: settleFiscalBankruptcy(state, f.id) }));
}
/** On-demand end-turn/finance forecast. It consumes no random generator or
 * original state; the same pre-settlement path handles management and expiring offers. */
export function getFiscalRecoveryPlan(state, factionId = state.playerId) {
  if (!state.factions[factionId]?.alive || state.battle || state.turnContinuation) return { needed: false, report: null, reason: '请先完成当前战场与战争阶段。', revision: state.revision };
  const next = clone({ ...state, history: [], logs: [], notices: [], chronicle: [] });
  const plans = prepareFiscalSettlement(next), report = plans.find(row => row.factionId === factionId)?.report || null;
  return { needed: Boolean(report), report, reason: '', revision: state.revision };
}
function advanceTurn(state) {
  if (state.turnContinuation) return resumeTurn(state);
  prepareFiscalSettlement(state);
  const leftExplored = exploreLeftover(state);
  const playerGross = getIncome(state, state.playerId), playerUpkeep = maintenance(state, state.playerId);
  const playerIncome = { gold: playerGross.gold - playerUpkeep.gold, supply: playerGross.supply - playerUpkeep.supply, people: 0 };
  // Quoted before anybody is paid, so the treasury page, the player's income and what each vassal hands over agree.
  const tributes = vassalsOf(state).map(vassal => ({ id: vassal.id, ...tributeResources(state, vassal) })).filter(row => row.gold > 0 || row.supply > 0);
  for (const faction of Object.values(state.factions).filter(f => f.alive)) {
    const income = getIncome(state, faction.id), upkeep = maintenance(state, faction.id);
    const supplyAfter = faction.supply + income.supply - upkeep.supply;
    requireThat(faction.gold + income.gold >= upkeep.gold, '维护尚未支付，结算未执行。');
    faction.gold = faction.gold + income.gold - upkeep.gold; faction.supply = Math.max(0, supplyAfter);
    if (supplyAfter < 0) {
      let shortage = Math.min(10, -supplyAfter);
      for (const tile of factionTiles(state, faction.id).sort((a, b) => b.troops - a.troops)) {
        if (!shortage) break;
        const lost = Math.min(shortage, Math.max(0, tile.troops - 1)); tile.troops -= lost; shortage -= lost;
      }
      if (faction.isPlayer) log(state, '补给不足，部分罪袋离开了；农庄和控制人数能缓解压力。', 'economy');
    }
  }
  // Subjects retain 20% in getIncome; the player receives the matching 80% once.
  if (tributes.length) log(state, `附庸进贡：${tributes.map(row => `${state.factions[row.id].name} ${row.gold} 金`).join('、')}。`, 'economy');
  for (const faction of Object.values(state.factions).filter(f => f.alive && f.supply > 0)) for (const tile of factionTiles(state, faction.id)) {
    if (tile.cutSince !== undefined) continue;
    if (tile.troops >= housingOf(state, tile)) { tile.food = 0; continue; }
    tile.food = (tile.food || 0) + growthGain(state, tile, tileProduction(state, tile).supply);
    if (tile.food >= growthTarget(tile.troops)) { tile.food -= growthTarget(tile.troops); tile.troops = Math.min(100, tile.troops + 1); if (faction.isPlayer) playerIncome.people++; }
  }
  easeSupply(state);
  for (const growth of Object.values(state.growth)) growth.spirit = Math.min(100, growth.spirit + 8);
  // 开心果: whoever shares a tile with her rests better. One cheerful girl is enough; she cheers herself up too.
  for (const tile of Object.values(state.tiles)) {
    const girls = tile.ownerId ? girlsOn(tile).filter(id => canServe(state, id, tile.ownerId)) : [];
    if (girls.length > 1 && girls.some(id => quirkIs(state, id, 'q_muse'))) for (const id of girls) { const growth = ensureGrowth(state, id); growth.spirit = Math.min(100, growth.spirit + 4); }
  }
  // Every release path retains the same history. No escape or recapture grants
  // experience, bond or permanent stats, and every detention has a humane review.
  for (const captive of Object.values(state.captives)) {
    const id = captive.characterId, mine = captive.captorId === state.playerId, ours = captive.originalFactionId === state.playerId;
    if (state.turn >= reviewTurnOf(captive)) {
      releaseCharacter(state, id, `经定期审查获释，休整 ${CAPTIVITY_RULES.paroleTurns} 回合`, 'paroled');
      if (mine || ours) notice(state, 'peace', `${state.characters[id].name}结束了长期关押，假释休整至第 ${paroleOf(state, id).until} 回合，不损失属性。`);
      continue;
    }
    if (hash(state.seed, state.turn, 3, `escape:${id}`) * 100 < escapeRisk(state, id)) {
      const home = freeCaptive(state, id, 'escaped');
      recordChronicle(state, `${state.characters[id].name}逃出了${state.factions[captive.captorId].name}的关押营地，逃脱经历已记入履历。`, 'rescue', captive.captorId, [captive.captorId, captive.originalFactionId]);
      if (mine) notice(state, 'land', `俘虏${state.characters[id].name}逃跑了${home ? `，回到了${state.factions[home].name}` : ''}；近期再捕会加强警戒。`);
      if (ours) notice(state, 'peace', `${state.characters[id].name}逃回来了！`);
      continue;
    }
    // Negotiation now consumes one normal NPC action in resumeTurn, after the
    // same escape/review checks. Readiness alone never transfers ownership.
  }
  if (state.turn % 8 === 0) for (const id of Object.keys(state.growth)) if (state.characterOwners[id] && state.characterOwners[id] !== state.playerId && !state.captives[id]) gainExp(state, id, 45);
  const deferredProsperity = state.milestone.level > PROSPERITY_GOLD_CHAPTERS;
  if (!deferredProsperity) state.metrics.wealth += Math.max(0, playerIncome.gold);
  log(state, `领地净收入：金币 ${playerIncome.gold >= 0 ? '+' : ''}${playerIncome.gold}，补给 ${playerIncome.supply >= 0 ? '+' : ''}${playerIncome.supply}。`, 'economy');
  state.turnContinuation = { startedTurn: state.turn, stage: 'ai', factionIds: Object.values(state.factions).filter(faction => !faction.isPlayer).map(faction => faction.id), factionIndex: 0, actionIndex: 0, income: playerIncome, ...(deferredProsperity ? { deferredProsperity } : {}) };
  const result = resumeTurn(state);
  return leftExplored ? { ...result, leftExplored } : result;
}

function executeAction(state, action) {
  if (action.characterId && mayorCity(state, action.characterId) && ['stance', 'assignPost', 'assignEnvoy', 'setHero', 'setCompanion'].includes(action.type)) requireThat(false, C.mayorBusy);
  const type = action.type;
  if (type === 'liquidate') return executeLiquidation(state, action);
  if (BATTLE_ACTIONS.has(type)) {
    requireThat(state.battle, '当前没有待处理的战场。');
    if (type === 'finishBattle') {
      requireThat(state.battle.phase === 'result', '请先完成战斗或选择撤退。');
      const battle = state.battle; state.battle = null;
      const result = commitBattleResult(state, battle);
      const resumed = state.turnContinuation ? resumeTurn(state) : null;
      return { result, resumed };
    }
    const result = performTactical(state.battle, action);
    requireThat(result.ok, result.error);
    state.battle = result.battle; decorateBattleResult(state, state.battle);
    return { battleId: state.battle.id, phase: state.battle.phase, result: state.battle.result };
  }
  const transport = executeTransportAction(state, action);
  if (transport !== undefined) return transport;
  const civic = executeCampaignAction(state, action);
  if (civic !== undefined) return civic;
  if (type === 'endTurn') return advanceTurn(state);
  if (type === 'continue') return { longTerm: true };
  if (type === 'explore') {
    const cell = coordinateFromAction(action);
    const existing = state.tiles[cell.key];
    requireThat(!existing?.discovered, '此地已经探索。');
    requireThat(inWorld(state, cell.q, cell.r), '那里已是世界的尽头。');
    requireThat(neighbors(cell).some(p => state.tiles[p.key]?.discovered), '只能从已探索区域的边缘深入迷雾。');
    return exploreCell(state, cell);
  }
  if (type === 'setLeftoverExplore') {
    requireThat(typeof action.on === 'boolean', '余令探索只能开或关。');
    state.management = { ...(state.management || { mode: 'off', reserve: 20 }), exploreLeft: true };
    if (!action.on) delete state.management.exploreLeft;
    return { exploreLeft: action.on };
  }
  if (type === 'setAutoExplore') {
    requireThat(Number.isInteger(action.amount) && action.amount >= 0 && action.amount <= AUTO_EXPLORE_MAX, `每回合自动探索只能设 0 到 ${AUTO_EXPLORE_MAX} 令。`);
    state.management = { ...(state.management || { mode: 'off', reserve: 20 }), explore: action.amount };
    if (!action.amount) delete state.management.explore;
    return { explore: action.amount };
  }
  if (type === 'claim') {
    const cell = coordinateFromAction(action), tile = state.tiles[cell.key];
    if (isWater(tile) && !isBridge(state, tile)) {
      const quote = getWaterClaimQuote(state, cell.key);
      requireThat(quote.enabled, quote.reason); pay(state, quote.cost);
      tile.waterOwnerId = state.playerId;
      if (!tile.shipId) { tile.ownerId = state.playerId; tile.militaryReserve = true; tile.militaryReadyTurn = 0; }
      const known = new Set(Object.values(state.tiles).filter(item => item.discovered).map(item => item.key));
      revealArea(state, tile.q, tile.r, 1);
      const nation = fogBirth(state, Object.values(state.tiles).filter(item => item.discovered && !known.has(item.key)).map(item => item.key));
      log(state, feedbackText('water_claim_done', { key: tile.key }), 'expand');
      return { key: tile.key, water: true, cost: quote.cost, nation };
    }
    requireThat(tile?.discovered, '请先探索此地。');
    requireThat(!tile.ownerId, '这块土地已有归属。');
    requireThat(walkable(state, tile), '湖泊不能被开拓。');
    requireThat(neighbors(tile).some(p => state.tiles[p.key]?.ownerId === state.playerId && walkable(state, state.tiles[p.key])), '只能开拓与国土相邻的空地。');
    const source = migrationSource(state, tile, action.fromKey);
    requireThat(source, `相邻地块人手不够：要有一块至少 ${MIN_SOURCE} 人的地才能迁出 ${MIGRANTS} 人。`);
    pay(state, claimCost(state, state.playerId));
    const migrants = settle(tile, source, state.playerId);
    creditTerritory(state, tile);
    let bonus = 0;
    if (tile.terrainId === 'ruins' && !tile.ruinClaimed) { bonus = 6; state.factions[state.playerId].gold += bonus; tile.ruinClaimed = true; }
    const known = new Set(Object.values(state.tiles).filter(item => item.discovered).map(item => item.key));
    revealArea(state, tile.q, tile.r, 1);
    const nation = fogBirth(state, Object.values(state.tiles).filter(item => item.discovered && !known.has(item.key)).map(item => item.key));
    log(state, `${migrants} 人从 ${source.key} 迁到了${state.terrainTypes[tile.terrainId].name}${bonus ? '，并在遗迹中发现 6 金币' : ''}。`, 'expand');
    return { key: tile.key, bonus, fromKey: source.key, migrants, nation };
  }
  if (type === 'buildBridge') {
    const quote = getBridgeQuote(state, action.fromKey, action.toKey);
    requireThat(quote.enabled, quote.reason); pay(state, quote.cost);
    const c = state.campaign, id = `bridge.${c.bridgeSeq = (c.bridgeSeq || 0) + 1}`;
    c.bridges ||= {};
    c.bridges[id] = { id, ownerId: state.playerId, fromKey: quote.fromKey, toKey: quote.toKey,
      path: [...quote.path], length: quote.length, gold: quote.cost.gold, builtTurn: state.turn };
    for (const key of quote.path.slice(1, -1)) {
      const tile = state.tiles[key];
      Object.assign(tile, { bridgeId: id, ownerId: state.playerId, waterOwnerId: state.playerId,
        troops: 0, food: 0, field: [], garrison: [], militaryReserve: true, militaryReadyTurn: 0 });
    }
    state.metrics.infrastructure++;
    log(state, feedbackText('bridge_done', { length: quote.length }), 'build');
    return { bridgeId: id, path: quote.path, length: quote.length, cost: quote.cost };
  }
  if (type === 'recruit') {
    const tile = playerTile(state, coordinateFromAction(action).key);
    requireThat(tile.cutSince === undefined, '这块地和首都断了联系，没法征募。');
    requireThat(tile.troops < 100, '单个地块最多容纳 100 名军士。');
    requireThat(tile.troops < housingOf(state, tile), `住房满了（${housingOf(state, tile)} 人）。把人调走，或者修建筑扩容。`);
    const amount = recruitAmount(state, tile);
    pay(state, recruitCost(state)); tile.troops += amount;
    log(state, `在 ${tile.key} 征募了 ${amount} 名 N 级罪袋。`, 'army'); return { troops: amount, key: tile.key };
  }
  if (['demobilize', 'relief', 'emergencyFarm'].includes(type)) {
    const plan = getRecoveryPlan(state, action);
    requireThat(plan.ok, plan.reason); pay(state, plan.cost); applyRecovery(state, plan);
    if (type === 'emergencyFarm') state.tiles[plan.key].infrastructurePeak = Math.max(state.tiles[plan.key].infrastructurePeak || 0, plan.replacedBuilding ? plan.replacedLevel : 0);
    log(state, type === 'emergencyFarm' ? `${plan.key} 改作应急田圃，未退还原建筑费用。` : `遣散 ${plan.removed} 名军士，预计补给净收入 ${plan.supplyBefore} → ${plan.supplyAfter}。`, 'economy');
    return plan;
  }
  if (type === 'build') {
    const tile = playerTile(state, coordinateFromAction(action).key), building = BUILDINGS[action.building];
    requireThat(building && !building.emergency, '请选择普通建筑；应急田圃请使用救急开垦。'); requireThat(!tile.building || BUILDINGS[tile.building]?.emergency, '这块土地已有建筑。');
    requireThat(canBuild(state, tile, building.id), `${state.terrainTypes[tile.terrainId].name}上不能修${building.name}。`);
    requireThat(tile.cutSince === undefined, '这块地和首都断了联系，没法动工。');
    requireThat(tile.troops >= MIN_BUILD, `人手不够：至少 ${MIN_BUILD} 人才能动工。`);
    const cost = constructionCost(state, tile, building.id);
    const credited = tile.infrastructurePeak ?? (tile.building === 'garden' ? 0 : tile.buildingLevel || 0);
    pay(state, cost); tile.building = building.id; tile.buildingLevel = 1; tile.infrastructurePeak = Math.max(1, credited);
    delete tile.fortMothballed; delete tile.fortReadyTurn;
    if (building.id === 'fort') tile.fortReadyTurn = state.turn + 1;
    if(building.id==='wonder')state.factions[state.playerId].wonderKey=tile.key;
    if (credited < 1) state.metrics.infrastructure++;
    log(state, `${building.name}已建成：${building.description}。`, 'build'); return { key: tile.key, building: building.id };
  }
  if (type === 'upgrade') {
    const tile = playerTile(state, coordinateFromAction(action).key);
    requireThat(tile.building, '请先建造建筑。');
    const level = tile.buildingLevel || 1;
    requireThat(level < (BUILDINGS[tile.building].maxLevel || 5), '建筑已达等级上限，可以继续经营其他地块。');
    requireThat(tile.cutSince === undefined, '这块地和首都断了联系，没法动工。');
    requireThat(tile.troops >= handsNeeded(tile), `人手不够：这里要 ${handsNeeded(tile)} 人才能升级。`);
    const cost = improvementCost(state, tile);
    const credited = tile.infrastructurePeak ?? level;
    pay(state, cost); tile.buildingLevel = level + 1; tile.infrastructurePeak = Math.max(level + 1, credited);
    if (level + 1 > credited) state.metrics.infrastructure++;
    log(state, `${BUILDINGS[tile.building].name}提升至 ${tile.buildingLevel} 级。`, 'build');
    return { key: tile.key, building: tile.building, buildingLevel: tile.buildingLevel };
  }
  if (type === 'rally') {
    const plan = getRallyPlan(state, action.key, action.amount, { scope: action.scope });
    requireThat(plan.enabled, plan.reason); pay(state, plan.cost);
    for (const source of plan.sources) moveStack(state, state.tiles[source.fromKey], state.tiles[plan.key], source.troops, [], { elites: false });
    log(state, `${plan.sources.length} 处${plan.scope === 'all-forces' ? '驻地' : '后方'}调来 ${plan.troops} 名军士，集结于 ${plan.key}；原地保留生产人手与守备，角色和稀有队伍未动。`, 'army');
    return plan;
  }
  if (type === 'fortMode') {
    const tile = playerTile(state, action.key), status = fortStatus(state, tile);
    requireThat(status, '这里没有要塞。');
    requireThat(typeof action.mothball === 'boolean', '请选择执勤或封存。');
    requireThat(action.mothball !== status.mothballed, '要塞状态没有变化。');
    requireThat(action.mothball || tile.cutSince === undefined, '失联要塞无法重新整备。');
    pay(state, action.mothball ? { ap: 0, gold: 0, supply: 0 } : { ap: 2, gold: 6, supply: 2 });
    tile.fortMothballed = action.mothball;
    if (!action.mothball) tile.fortReadyTurn = state.turn + 1;
    log(state, `${tile.key} 要塞${action.mothball ? '已封存：停止维护，也不再保护邻地或接纳迁都' : '开始整备，下回合完成；至少 4 人并与首都连通后恢复防区'}。`, 'build');
    return { key: tile.key, mothballed: tile.fortMothballed, fort: fortStatus(state, tile) };
  }
  if (type === 'road') {
    const quote = getRoadQuote(state, action.key);
    requireThat(quote.enabled, quote.reason);
    pay(state, quote.cost); state.tiles[action.key].road = true;
    log(state, `${action.key} 修成道路，己方行军经过只需 0.5 路程。`, 'build');
    return { key: action.key, cost: quote.cost };
  }
  if (type === 'attack') return resolveBattle(state, action.fromKey, action.toKey, action.troops, state.playerId, true, action.girls);
  if (type === 'raid') return resolveBattle(state, action.fromKey, action.toKey, action.troops, state.playerId, true, action.girls, 'raid');
  if (type === 'trainArmy') return trainArmy(state);
  if (type === 'militaryMode') return setMilitaryMode(state, action.key, action.reserve);
  if (type === 'standDownRear') {
    const plan = getMilitaryStandDownPlan(state); requireThat(plan.enabled, plan.reason);
    for (const site of plan.affected) { state.tiles[site.key].militaryReserve = true; state.tiles[site.key].militaryReadyTurn = 0; }
    log(state, `后方 ${plan.affected.length} 处驻地转为后备（${plan.affected.slice(0, 24).map(site => site.key).join('、')}${plan.affected.length > 24 ? '等' : ''}）；全军维护 ${plan.budgetBefore.gold} → ${plan.budgetAfter.gold} 金币/回合。普通军队按 Lv 1、稀有队暂不出战，生产、人口与英雄保留。`, 'army');
    return plan;
  }
  if (type === 'move') {
    const from = playerTile(state, action.fromKey), to = playerTile(state, action.toKey);
    requireThat(from.key !== to.key, '军队已经在这里了。');
    requireThat(from.marchedTurn !== state.turn, '这支军队这回合已经走过了。');
    const going = Array.isArray(action.girls) ? from.field.filter(id => action.girls.includes(id)) : from.field;
    const budget = marchBudgetOf(state, from, going);
    requireThat(own(marchReach(state, from.key, from.ownerId, budget), to.key), `太远了：军队一回合走 ${budget} 点路程，只能穿过自己的领土。更远的地方可以下远行令，分几回合走到。`);
    const troops = action.troops === undefined ? Math.max(0, from.troops - marchGuard(from)) : action.troops;
    requireThat(integer(troops, going.length ? 0 : 1, from.bridgeId ? 100 : 99) && troops <= from.troops - marchGuard(from), '调兵时必须保留至少 1 名守军。');
    const room = supplyRoom(state, to, going.length);
    requireThat(troops <= room, `${to.key} 的补给只够再进 ${room} 人。要塞、道路和带队的同伴都能让一块地多养些人。`);
    requireThat(!militaryMoveReason(state, from.key, to.key, troops), militaryMoveReason(state, from.key, to.key, troops));
    pay(state, { ap: 0, gold: 0, supply: marchSupplyOf(state, from, going) }); const eliteTransfer = moveStack(state, from, to, troops, action.girls);
    log(state, `${troops} 名军士由 ${from.key} 调往 ${to.key}。`, 'army'); return { troops, fromKey: from.key, toKey: to.key, eliteTransfer };
  }
  if (type === 'marchOrder') {
    const detail = issueMarchOrder(state, action);
    log(state, detail.arrived ? `${detail.troops} 名军士由 ${detail.fromKey} 调往 ${detail.toKey}。` : `下达远行令：从 ${detail.fromKey} 去 ${detail.toKey}，第 ${detail.arrivesTurn} 回合前后到。${detail.movedNow ? `今天先走到 ${detail.key}。` : '下回合开始时出发。'}`, 'army');
    return detail;
  }
  if (type === 'cancelMarch') {
    const before = marchOrdersOf(state), id = action.id;
    if(typeof id==='string'&&id.startsWith('campaign:')) {
      const key=id.slice('campaign:'.length);
      requireThat(state.campaign.armies[key]?.goal,C.objectiveInvalid);
      return executeCampaignAction(state,{type:'cancelArmyObjective',key});
    }
    requireThat(before.some(order => order.id === id), '这道远行令已经不在了。');
    state.marchOrders = before.filter(order => order.id !== id);
    log(state, '取消了一道远行令，队伍留在原地。', 'army');
    return { id };
  }
  if (type === 'muster') {
    const plan = getMusterPlan(state, action.toKey, { troops: action.troops, spare: action.spare, sources: action.sources });
    requireThat(plan.enabled, plan.reason);
    const done = [];
    // Re-quote each party against the world as the earlier ones leave it: supply and room run down.
    for (const item of [...plan.armies, ...plan.spareSources]) {
      const quote = getMarchPlan(state, item.fromKey, plan.toKey, { troops: Math.min(item.troops, Math.max(0, state.tiles[item.fromKey].troops - 1)), girls: item.girls });
      if (!quote.enabled) continue;
      done.push(issueMarchOrder(state, quote.action));
    }
    requireThat(done.length > 0, '没有队伍能动身。');
    log(state, `会师 ${plan.toKey}：${done.filter(item => item.girls.length).length} 支编队${done.some(item => !item.girls.length) ? `和 ${done.filter(item => !item.girls.length).length} 处富余罪袋` : ''}动身，${done.filter(item => item.arrived).length} 支已到。`, 'army');
    return { toKey: plan.toKey, parties: done, arrived: done.filter(item => item.arrived).length, lastTurn: Math.max(...done.map(item => item.arrivesTurn)) };
  }
  if (type === 'enactEdict') {
    const quote = getEdictQuote(state, action.id, action.replace);
    requireThat(quote.enabled, quote.reason);
    pay(state, quote.cost);
    const list = (state.edicts || []).filter(id => id !== quote.replace);
    state.edicts = [...list, quote.id]; state.edictTurn = state.turn;
    log(state, `颁布国策「${quote.name}」${quote.replace ? `，废止「${EDICTS.find(edict => edict.id === quote.replace).name}」` : ''}：${quote.desc}。`, 'build');
    return { id: quote.id, replace: quote.replace, edicts: [...state.edicts] };
  }
  if (type === 'repealEdict') {
    requireThat((state.edicts || []).includes(action.id), '这条国策没有在施行。');
    state.edicts = state.edicts.filter(id => id !== action.id);
    log(state, `废止国策「${EDICTS.find(edict => edict.id === action.id).name}」。`, 'build');
    return { id: action.id, edicts: [...state.edicts] };
  }
  if (type === 'stance') {
    const id = action.characterId, name = state.characters[id]?.name, tile = stationOf(state, id);
    requireThat(canServe(state, id, state.playerId) && tile, '只能安排麾下可用的角色。');
    if (action.stay) {
      requireThat(tile.field.includes(id), `${name}已经在驻扎了。`);
      requireThat(tile.garrison.length < MAX_SEATS, `这里的 ${MAX_SEATS} 个驻扎席位满了。`);
      tile.field = tile.field.filter(item => item !== id); tile.garrison.push(id);
    } else {
      requireThat(tile.garrison.includes(id), `${name}已经在行军了。`);
      tile.garrison = tile.garrison.filter(item => item !== id); tile.field.push(id);
    }
    return { characterId: id, key: tile.key, stay: Boolean(action.stay) };
  }
  if (type === 'train') {
    const id = action.characterId, growth = ensureGrowth(state, id), stat = STATS.find(item => item.id === action.stat);
    requireThat(canServe(state, id, state.playerId), '只能特训麾下可用的角色。');
    requireThat(stat, '这项能力不能特训。');
    requireThat((growth.trained[stat.id] || 0) < trainCap(growth.level, growth.bond), trainingLimitNote({ ...heroView(state,id), growth },stat));
    requireThat(heroView(state, id).stats[stat.id] < (stat.cap ?? 99), '这项能力已到上限。');
    requireThat(growth.spirit >= 20, `${state.characters[id].name}太累了，先休息几回合。`);
    pay(state, trainCostOf(state, growth));
    growth.trained[stat.id] = (growth.trained[stat.id] || 0) + 1; growth.spirit -= 15; growth.trainCount++;
    addBond(state, id, 2); gainExp(state, id, 20);
    log(state, `${state.characters[id].name}完成了${stat.name}特训。`, 'character');
    return { characterId: id, stat: stat.id };
  }
  if (type === 'talk') {
    const id = action.characterId;
    requireThat(canServe(state, id, state.playerId), '只能和麾下可用的角色谈话。');
    requireThat(state.talkTurn !== state.turn, '这回合已经谈过话了。');
    state.talkTurn = state.turn; addBond(state, id, 3);
    const growth = ensureGrowth(state, id); growth.spirit = Math.min(100, growth.spirit + 6);
    return { characterId: id };
  }
  if (type === 'gift') {
    const id = action.characterId, growth = ensureGrowth(state, id);
    requireThat(canServe(state, id, state.playerId), '只能送礼给麾下可用的角色。');
    requireThat(GIFTS.some(item => item.id === action.item), '没有这种礼物。');
    requireThat(growth.giftTurn !== state.turn, '这回合已经给她送过礼了。');
    pay(state, { ap: 0, gold: GIFT_COST, supply: 0 });
    const liked = action.item === likeOf(id);
    growth.giftTurn = state.turn; growth.gifts++; growth.spirit = Math.min(100, growth.spirit + 10);
    if (liked) growth.knownLike = true;
    addBond(state, id, giftBondGain(growth.bond, liked));
    return { characterId: id, liked };
  }
  if (type === 'choosePerk') {
    const id = action.characterId, growth = ensureGrowth(state, id), tier = action.tier;
    requireThat(canServe(state, id, state.playerId), '只能为麾下可用的角色选择天赋。');
    requireThat(pendingPerkTiers(growth).includes(tier), '这一档天赋现在不能选。');
    const option = perkChoices(state.characters[id].role, tier).find(item => item.id === action.perk);
    requireThat(option, '没有这个天赋。');
    growth.perks[tier] = option.id;
    log(state, `${state.characters[id].name}学会了「${option.name}」。`, 'character');
    return { characterId: id, perk: option.id };
  }
  if (type === 'assignPost') {
    const post = POSTS.find(item => item.id === action.post), id = action.characterId;
    const quote = getPostQuote(state, action.post, id);
    requireThat(quote.enabled, quote.reason);
    if (id !== null) {
      requireThat(canServe(state, id, state.playerId), '只有麾下可用的角色能任职。');
      requireThat(id !== state.activeHeroId, '领军不能兼任职位。');
      for (const key of Object.keys(state.posts)) if (state.posts[key] === id) state.posts[key] = null;
      if (state.companionId === id) state.companionId = null;
    }
    state.posts[post.id] = id;
    return { post: post.id, characterId: id };
  }
  if (type === 'dialogueDone') {
    const quote = getDialogueChoiceQuote(state, action);
    requireThat(quote.enabled, quote.reason);
    if (quote.alreadySeen) return { id: action.id, alreadySeen: true };
    const effect = quote.effect, faction = state.factions[state.playerId];
    pay(state, quote.cost, state.playerId, false);
    faction.gold += Math.max(0, effect.gold); faction.supply += Math.max(0, effect.supply);
    // Keep the original raw truthiness gate, including zero-valued normalization.
    if (typeof action.who === 'string' && own(state.characters, action.who) && isObject(action.effect) && action.effect.bond) addBond(state, action.who, effect.bond);
    state.storySeen = [...state.storySeen, action.id].slice(-4000);
    return { id: action.id };
  }
  if (type === 'buySupply') {
    const quote = getSupplyQuote(state, action.amount === undefined ? 20 : action.amount), faction = state.factions[state.playerId];
    requireThat(faction.supply <= Number.MAX_SAFE_INTEGER - quote.amount, '补给库存已达安全存档上限。');
    pay(state, quote.cost); faction.supply += quote.amount;
    log(state, `采购 ${quote.amount} 补给，支出 ${quote.cost.gold} 金币。`, 'economy');
    return quote;
  }
  if (type === 'setManagement') {
    requireThat(['off', 'balanced', 'economy', 'supply'].includes(action.mode), '内政方针无效。');
    const settings = developmentSettings(state, { ...action, mode: action.mode === 'off' ? 'balanced' : action.mode });
    state.management = { ...(state.management?.explore ? { explore: state.management.explore } : {}), ...(state.management?.exploreLeft ? { exploreLeft: true } : {}), mode: action.mode, reserve: settings.reserve };
    return { management: { ...state.management } };
  }
  if (type === 'develop') {
    const plan = developRealm(state, action);
    requireThat(plan.actions.length > 0, '当前没有符合方针与保留金币的可执行建设。');
    return plan;
  }
  if (type === 'gacha') {
    const count = action.count ?? 1, ten = count === 10;
    pay(state, getRecruitQuote(state, count).cost);
    if (ten) return { results: Array.from({ length: 10 }, () => recruitOnce(state)) };
    return recruitOnce(state);
  }
  if (type === 'storyChoice') {
    const event = getPendingEvent(state);
    requireThat(event, '当前没有待处理的事件。');
    if (action.forfeit === true) {
      requireThat(!own(action, 'choice'), '放弃事件不能同时选择收益。');
      const quote = getStoryForfeitQuote(state, action);
      requireThat(quote.enabled, quote.reason);
      state.storySeen.push(event.id); state.pendingEvent = null;
      log(state, `事件「${event.title}」：无力承担本次事件，放弃收益。`, 'story');
      return { eventId: event.id, forfeited: true, effect: {}, appliedEffect: { gold: 0, supply: 0, troops: 0 } };
    }
    const quote = getStoryChoiceQuote(state, action);
    requireThat(quote.enabled, quote.reason);
    const choice = event.choices[action.choice];
    const faction = state.factions[state.playerId], effect = quote.effect, home = state.tiles[faction.capitalKey];
    const before = { gold: faction.gold, supply: faction.supply, troops: home?.troops || 0 };
    pay(state, quote.cost, state.playerId, false);
    faction.gold += Math.max(0, effect.gold || 0); faction.supply += Math.max(0, effect.supply || 0);
    if (effect.troops && home) home.troops = Math.max(1, Math.min(100, home.troops + effect.troops));
    if (effect.sazai) grantSazai(state, state.playerId, effect.sazai);
    for (const id of event.requires) addBond(state, id, 3);
    state.storySeen.push(event.id); state.pendingEvent = null;
    log(state, `事件「${event.title}」：${choice.label}。`, 'story');
    return { eventId: event.id, effect, appliedEffect: { gold: faction.gold - before.gold, supply: faction.supply - before.supply, troops: (home?.troops || 0) - before.troops } };
  }
  if (type === 'assignHero') {
    requireThat(state.recruitedHeroIds.includes(action.characterId), '请先邀请这位角色加入。');
    requireThat(canServe(state, action.characterId, state.playerId), '被俘或已效忠其他国家的角色不能上场。');
    requireThat(state.activeHeroId !== action.characterId, '这位角色正在统领国家。');
    requireThat(!Object.values(state.envoys || {}).includes(action.characterId), '她正在别国出使，先召回。');
    pay(state, { ap: 2, gold: 0, supply: 0 });
    if (state.companionId === action.characterId) state.companionId = canServe(state, state.activeHeroId, state.playerId) ? state.activeHeroId : null;
    leaveOffices(state, action.characterId);
    state.activeHeroId = action.characterId;
    log(state, `${state.characters[action.characterId].name}接过了统领之旗。`, 'character'); return { characterId: action.characterId };
  }
  if (type === 'assignCompanion') {
    requireThat(action.characterId === null || (state.recruitedHeroIds.includes(action.characterId) && canServe(state, action.characterId, state.playerId)), '副将必须是可用的己方角色。');
    requireThat(action.characterId !== state.activeHeroId || action.characterId === null, '统领与副将不能是同一人。');
    requireThat(action.characterId !== state.companionId, '副将阵容没有变化。');
    pay(state, { ap: 2, gold: 0, supply: 0 }); leaveOffices(state, action.characterId); state.companionId = action.characterId;
    log(state, action.characterId ? `${state.characters[action.characterId].name}担任随军副将。` : '副将席位暂时空缺，普通军官接替指挥。', 'character');
    return { companionId: state.companionId };
  }
  if (type === 'persuade') {
    const id = action.characterId, captive = state.captives[id], option = getCaptiveActions(state, id).find(item => item.type === type && item.action.way === action.way);
    requireThat(captive?.captorId === state.playerId && option, '无法对这位角色执行当前俘虏操作。');
    requireThat(option.enabled, option.reason);
    const quote = persuasionQuote(state, id, action.way, getHero(state, state.playerId).stats.charm, persuasionBonus(state));
    pay(state, quote.cost);
    applyPersuasion(state, id, quote);
    return { characterId: id, way: action.way, joined: false, prepared: quote.prepared, progressGain: quote.progressGain, grudgeChange: quote.grudgeChange, escapeRisk: quote.escapeRisk };
  }
  if (type === 'recruitCaptive') {
    requireThat(state.captives[action.characterId]?.captorId === state.playerId, '只能招揽本国关押的角色。');
    return admitCaptive(state, action.characterId);
  }
  if (type === 'secureCaptive') {
    const id = action.characterId, option = getCaptiveActions(state, id).find(item => item.type === type);
    requireThat(option, '无法对这位角色执行当前俘虏操作。'); requireThat(option.enabled, option.reason);
    pay(state, option.cost); state.captives[id].securityUntil = option.effects.securityUntil;
    return { characterId: id, securityUntil: option.effects.securityUntil, escapeRisk: escapeRisk(state, id) };
  }
  if (type === 'extendCaptive') {
    const id = action.characterId, option = getCaptiveActions(state, id).find(item => item.type === type);
    requireThat(state.captives[id]?.captorId === state.playerId && option, '无法对这位角色执行当前俘虏操作。'); requireThat(option.enabled, option.reason);
    pay(state, option.cost);
    const captive = state.captives[id];
    captive.extended = (captive.extended || 0) + CAPTIVITY_RULES.extendTurns; captive.grudge = option.effects.grudge;
    log(state, `${state.characters[id].name}续押 ${CAPTIVITY_RULES.extendTurns} 回合，审查推迟到第 ${reviewTurnOf(captive)} 回合。`, 'character');
    return { characterId: id, reviewTurn: reviewTurnOf(captive), grudge: captive.grudge, cost: option.cost };
  }
  if (type === 'secureCaptives' || type === 'extendCaptives') {
    const plan = getPrisonPlan(state), list = type === 'secureCaptives' ? plan.secure : plan.extend;
    requireThat(!plan.reason, plan.reason);
    requireThat(list.ready.length > 0, list.reason || '现在没有可以处理的俘虏。');
    const done = [];
    for (const id of list.ready) {
      const option = getCaptiveActions(state, id).find(item => item.type === (type === 'secureCaptives' ? 'secureCaptive' : 'extendCaptive'));
      if (!option?.enabled) continue;
      pay(state, option.cost);
      const captive = state.captives[id];
      if (type === 'secureCaptives') captive.securityUntil = option.effects.securityUntil;
      else { captive.extended = (captive.extended || 0) + CAPTIVITY_RULES.extendTurns; captive.grudge = option.effects.grudge; }
      done.push(id);
    }
    requireThat(done.length > 0, '现在没有可以处理的俘虏。');
    log(state, type === 'secureCaptives' ? `给 ${done.length} 名俘虏安排了专门护卫。` : `${done.length} 名俘虏续押 ${CAPTIVITY_RULES.extendTurns} 回合。`, 'character');
    return { characterIds: done, cost: { ...list.cost }, skipped: list.total - done.length };
  }
  if (type === 'setPrisonPolicy') {
    requireThat(typeof action.autoSecure === 'boolean', '请选择是否自动续看守。');
    state.prison = { ...(state.prison || {}), autoSecure: action.autoSecure };
    log(state, action.autoSecure ? '牢房改为长期看守：护卫到期时自动续上。' : '牢房恢复手动安排护卫。', 'character');
    return { prison: { ...state.prison } };
  }
  if (type === 'sellCaptive') {
    const id = action.characterId, captive = state.captives[id], option = getCaptiveActions(state, id).find(item => item.type === type);
    requireThat(captive?.captorId === state.playerId && option, '无法对这位角色执行当前俘虏操作。'); requireThat(option.enabled, option.reason);
    const nation = state.factions[captive.originalFactionId], paid = option.effects.gold;
    nation.gold -= paid; state.factions[state.playerId].gold += paid;
    changeFavor(state, state.playerId, nation.id, option.effects.favor, '议定赎金送还俘虏');
    freeCaptive(state, id, 'ransomed', { gold: paid, goodwill: option.effects.favor > 0 });
    recordChronicle(state, paid ? `${nation.name}付了 ${paid} 金币，赎回了${state.characters[id].name}。` : `${state.characters[id].name}按仍有效的原赎金协议免费归国，没有重复支付。`, 'rescue', nation.id);
    return { characterId: id, gold: paid, favor: option.effects.favor };
  }
  if (['ransomCharacter', 'releaseCaptive', 'paroleCaptive'].includes(type)) {
    const option = getCaptiveActions(state, action.characterId).find(item => item.type === type);
    requireThat(option, '无法对这位角色执行当前俘虏操作。'); requireThat(option.enabled, option.reason);
    pay(state, option.cost);
    const captive = state.captives[action.characterId];
    if (type === 'ransomCharacter') {
      state.factions[captive.captorId].gold += option.cost.gold;
      releaseCharacter(state, action.characterId, option.cost.gold ? '通过赎金安全归来' : '按原赎金协议免费归来', 'ransomed', { gold: option.cost.gold });
    } else {
      changeFavor(state, state.playerId, captive.originalFactionId, option.effects.favor, type === 'paroleCaptive' ? '假释送还俘虏' : '无条件释放俘虏');
      releaseCharacter(state, action.characterId, type === 'paroleCaptive' ? `获假释，回国休整 ${CAPTIVITY_RULES.paroleTurns} 回合` : '被无条件送回', type === 'paroleCaptive' ? 'paroled' : 'released', { goodwill: option.effects.favor > 0 });
    }
    return { characterId: action.characterId, action: type, favor: option.effects.favor || 0, parole: paroleOf(state, action.characterId) };
  }
  if (type === 'declareWar') {
    const faction = state.factions[action.factionId], view = getRelation(state, action.factionId);
    requireThat(faction?.alive && !faction.isPlayer, '请选择仍存在的其他国家。');
    requireThat(!view.grace, view.grace);
    requireThat(view.met, '还没遇见她们。');
    requireThat(view.status !== 'war', '双方已经在交战了。');
    requireThat(view.status !== 'vassal', '她是你的附庸。要开战得先解除附庸关系。');
    const reasons = getWarReasons(state, faction.id), cb = action.cb === undefined ? reasons.find(item => item.valid) : reasons.find(item => item.id === action.cb);
    requireThat(cb?.valid, '这个宣战理由现在站不住脚。');
    pay(state, { ap: 1 });
    startWar(state, state.playerId, faction.id, view.breaksTreaty ? '撕毁了条约。' : cb.id === 'conquest' ? '领主下了决心。' : `${cb.name}。`, false, null, cb.id);
    return { factionId: faction.id, broke: view.breaksTreaty, cb: cb.id };
  }
  if (type === 'treaty') {
    const quote = getTreatyQuote(state, action.factionId, action.draft || {});
    requireThat(quote.enabled, quote.reason);
    const faction = state.factions[action.factionId], me = state.factions[state.playerId], relation = relationOf(state, state.playerId, faction.id), d = quote.action.draft, done = [];
    pay(state, quote.cost); relation.talkTurn = state.turn;
    if (quote.demand) {
      if (d.gold) { const paid = Math.min(faction.gold, Math.floor(faction.gold * .5)); faction.gold -= paid; me.gold += paid; done.push(`赔款 ${paid} 金`); }
      if (d.installments) { state.campaign.reparations = [...(state.campaign.reparations || []), { from: faction.id, to: state.playerId, share: TREATY.installmentShare, until: state.turn + TREATY.installmentTurns }]; done.push(`分期赔偿 ${TREATY.installmentTurns} 回合`); }
      if (d.captives) for (const [id, c] of Object.entries({ ...state.captives })) if (c.captorId === faction.id && c.originalFactionId === state.playerId) { releaseCharacter(state, id, '按和约获释', 'released'); done.push(`${state.characters[id].name}获释`); }
      if (d.trade) { relation.trade = true; (state.campaign.currencyUnions ||= {})[faction.id] = state.playerId; done.push('通商，用你的钱结账'); }
      if (d.forts) { const mineKeys = new Set(factionTiles(state, state.playerId).map(t => t.key)); for (const t of factionTiles(state, faction.id)) if (t.building === 'fort' && neighbors(t).some(p => mineKeys.has(p.key))) { t.building = null; t.buildingLevel = 0; delete t.fortReadyTurn; delete t.fortMothballed; } done.push('拆掉边境要塞'); }
      if (d.tech) { const tech = bestTechGap(state, faction.id, state.playerId); if (tech) { state.campaign.research[state.playerId].known.push(tech.id); done.push(`学会「${tech.name}」`); } }
      if (d.alliances) { for (const [key, rel] of Object.entries(state.relations)) if (key.split('|').includes(faction.id) && !key.split('|').includes(state.playerId) && rel.status === 'ally') Object.assign(rel, { status: 'neutral', since: state.turn, until: 0 }); done.push('她退出同盟'); }
      for (const key of d.tiles || []) cedeTile(state, state.tiles[key], state.playerId);
      if (d.tiles?.length) done.push(`割让 ${d.tiles.length} 块地`);
      endWar(state, state.playerId, faction.id, d.vassal ? 'vassal' : 'truce', d.vassal ? 0 : TRUCE_TURNS);
      if (d.vassal) done.push('臣服');
      changeFavor(state, state.playerId, faction.id, -Math.min(40, 5 + Math.round(quote.points / 3)), '战败的和约');
    } else {
      if (d.pay) { const paid = Math.floor(me.gold * d.pay); me.gold -= paid; faction.gold += paid; done.push(`赔她 ${paid} 金`); }
      if (d.captives) for (const [id, c] of Object.entries({ ...state.captives })) if (c.captorId === state.playerId && c.originalFactionId === faction.id) { releaseCharacter(state, id, '按和约获释', 'released'); done.push(`${state.characters[id].name}回国`); }
      if (d.tech) { const tech = bestTechGap(state, state.playerId, faction.id); if (tech) { state.campaign.research[faction.id].known.push(tech.id); done.push(`她学会「${tech.name}」`); } }
      if (d.trade) { relation.trade = true; done.push('两国通商'); }
      for (const key of d.tiles || []) cedeTile(state, state.tiles[key], faction.id);
      if (d.tiles?.length) done.push(`割给她 ${d.tiles.length} 块地`);
      endWar(state, state.playerId, faction.id, 'truce', TRUCE_TURNS);
      changeFavor(state, state.playerId, faction.id, 4, '求和');
    }
    normalizeParty(state);
    recordChronicle(state, `与${faction.name}议和：${done.join('、') || '各自收兵'}，休战 ${TRUCE_TURNS} 回合。`, 'diplomacy', faction.id, [state.playerId, faction.id]);
    return { factionId: faction.id, demand: quote.demand, points: quote.points, done };
  }
  if (type === 'makePeace') {
    const faction = state.factions[action.factionId], sheet = faction && getPeaceTerms(state, action.factionId), term = sheet?.terms.find(item => item.id === action.term);
    requireThat(faction?.alive && !faction.isPlayer && sheet, '双方现在没有在交战。');
    requireThat(term, '没有这项议和条款。'); requireThat(term.enabled, term.reason);
    const relation = relationOf(state, state.playerId, faction.id), me = state.factions[state.playerId];
    pay(state, { ap: 1 });
    relation.talkTurn = state.turn;
    let detail = {};
    if (term.id === 'gold') { const paid = Math.min(term.effects.gold, faction.gold); faction.gold -= paid; me.gold += paid; detail = { gold: paid }; }
    if (term.id === 'pay') { const paid = Math.min(-term.effects.gold, me.gold); me.gold -= paid; faction.gold += paid; detail = { gold: -paid }; }
    if (term.id === 'land') { for (const key of term.effects.tiles) cedeTile(state, state.tiles[key], state.playerId); detail = { tiles: [...term.effects.tiles] }; }
    endWar(state, state.playerId, faction.id, term.id === 'vassal' ? 'vassal' : 'truce', term.id === 'vassal' ? 0 : TRUCE_TURNS);
    changeFavor(state, state.playerId, faction.id, { white: 0, gold: -5, land: -10 * (detail.tiles?.length || 1), vassal: -15, pay: 5 }[term.id], { gold: '战败赔款', land: '战败割地', vassal: '被迫臣服', pay: '收下了赔款' }[term.id] || '');
    const text = { white: `与${faction.name}停战。`, gold: `${faction.name}赔款 ${detail.gold} 金币，两国休战。`, land: `${faction.name}割让 ${detail.tiles?.length} 块领土，两国休战。`, vassal: `${faction.name}向${me.name}臣服，成为附庸。`, pay: `向${faction.name}赔款 ${-detail.gold} 金币，换来休战。` }[term.id];
    recordChronicle(state, text, 'diplomacy', faction.id, [state.playerId, faction.id]);
    return { factionId: faction.id, term: term.id, ...detail };
  }
  if (type === 'assignDuty') {
    const quote = getDutyQuote(state, action.key, action.characterId, action.job);
    requireThat(quote.enabled, quote.reason); pay(state, quote.cost);
    putOnDuty(state, action.characterId, action.key, action.job);
    normalizeParty(state);
    return { characterId: action.characterId, key: action.key, job: action.job, replaced: quote.replaces, effect: quote.effect };
  }
  if (type === 'assignDuties') {
    const plan = action.plan;
    requireThat(Array.isArray(plan) && plan.length >= 1 && plan.length <= 100 && plan.every(item => item && typeof item === 'object'), C.invalidAction);
    requireThat(new Set(plan.map(item => item.characterId)).size === plan.length && new Set(plan.map(item => item.key)).size === plan.length, C.invalidAction);
    requireThat(state.ap >= plan.length * DUTY_RULES.ap, say('apNeed', { ap: plan.length * DUTY_RULES.ap, left: state.ap }));
    for (const item of plan) {
      const quote = getDutyQuote(state, item.key, item.characterId, item.job);
      requireThat(quote.enabled, `${state.characters[item.characterId]?.name || ''}：${quote.reason}`);
      pay(state, quote.cost); putOnDuty(state, item.characterId, item.key, item.job);
    }
    normalizeParty(state);
    return { count: plan.length };
  }
  if (type === 'recallDuty') {
    const duty = dutiesOf(state)[action.characterId];
    requireThat(duty, '她没有在做差事。');
    delete state.campaign.duties[action.characterId];
    if (!Object.keys(state.campaign.duties).length) delete state.campaign.duties;
    seatAtHome(state, action.characterId); normalizeParty(state);
    log(state, `${state.characters[action.characterId].name}从${dutyTerrainName(state, state.tiles[duty.key])}回来了。`, 'economy');
    return { characterId: action.characterId, key: duty.key };
  }
  if (type === 'assignEnvoy') {
    const quote = getEnvoyQuote(state, action.factionId, action.characterId);
    requireThat(quote.enabled, quote.reason);
    state.envoys ||= {};
    const before = state.envoys[action.factionId] || null;
    if (action.characterId === null) delete state.envoys[action.factionId];
    else {
      for (const [where, who] of Object.entries(state.envoys)) if (who === action.characterId) delete state.envoys[where];
      for (const tile of Object.values(state.tiles)) { if (tile.garrison?.includes(action.characterId)) tile.garrison = tile.garrison.filter(id => id !== action.characterId); if (tile.field?.includes(action.characterId)) tile.field = tile.field.filter(id => id !== action.characterId); }
      state.envoys[action.factionId] = action.characterId;
    }
    if (before && before !== action.characterId) seatAtHome(state, before);
    normalizeParty(state);
    log(state, action.characterId ? `${state.characters[action.characterId].name}出使${state.factions[action.factionId].name}。` : `召回了驻${state.factions[action.factionId].name}的使节。`, 'diplomacy');
    return { factionId: action.factionId, characterId: action.characterId, recalled: before && before !== action.characterId ? before : null };
  }
  if (type === 'annexVassal') {
    const quote = getAnnexQuote(state, action.factionId);
    requireThat(quote.enabled && !quote.active, quote.reason || C.annexBlocked); pay(state, quote.cost);
    state.campaign.integrations[action.factionId] = { progress: 0, total: quote.turns };
    log(state, say('annexStarted', { name: state.factions[action.factionId].name }), 'diplomacy');
    return quote;
  }
  if (type === 'releaseVassal') {
    const faction = state.factions[action.factionId];
    requireThat(faction?.alive && isVassal(state, faction.id), '她不是你的附庸。');
    endWar(state, state.playerId, faction.id, 'neutral', 0);
    changeFavor(state, state.playerId, faction.id, 10, '解除附庸');
    recordChronicle(state, `${state.factions[state.playerId].name}解除了与${faction.name}的附庸关系。`, 'diplomacy', faction.id, [state.playerId, faction.id]);
    return { factionId: faction.id };
  }
  if (type === 'propose') {
    const faction = state.factions[action.factionId], view = faction && getRelation(state, action.factionId), offer = view?.offers.find(item => item.kind === action.kind);
    requireThat(faction?.alive && !faction.isPlayer, '请选择仍存在的其他国家。');
    requireThat(offer, '现在提不了这件事。'); requireThat(offer.enabled, offer.reason);
    pay(state, { ap: 1 });
    const relation = relationOf(state, state.playerId, faction.id), accepted = offer.willing;
    let paid = 0;
    relation.talkTurn = state.turn;
    if (accepted) {
      if (offer.kind === 'peace') endWar(state, state.playerId, faction.id, 'truce', TRUCE_TURNS);
      if (offer.kind === 'pact') endWar(state, state.playerId, faction.id, 'pact', PACT_TURNS);
      if (offer.kind === 'ally') endWar(state, state.playerId, faction.id, 'ally', 0);
      if (offer.kind === 'trade') relation.trade = true;
      if (offer.kind === 'demand') { paid = offer.effects.gold; faction.gold -= paid; state.factions[state.playerId].gold += paid; changeFavor(state, state.playerId, faction.id, -10, '被索要进贡'); relation.demandUntil = state.turn + DEMAND_INTERVAL; }
      if (offer.kind !== 'demand') changeFavor(state, state.playerId, faction.id, offer.kind === 'chat' ? 2 + (leadQuirk(state, 'q_envoy') ? 2 : 0) : 3, offer.kind === 'chat' ? '寒暄' : `谈成${offer.label}`);
    } else changeFavor(state, state.playerId, faction.id, -(offer.kind === 'demand' ? 12 : 2), offer.kind === 'demand' ? '拒绝了进贡要求' : `回绝了${offer.label}`);
    log(state, offer.kind === 'chat' ? `和${faction.name}寒暄了几句。` : `向${faction.name}提出${offer.label}：${accepted ? `对方同意了${offer.kind === 'demand' ? `，实际收到 ${paid} 金币；第 ${relation.demandUntil} 回合可再次索取` : ''}` : '对方拒绝了'}。`, 'diplomacy');
    return { factionId: faction.id, kind: offer.kind, accepted, ...(offer.kind === 'demand' ? { gold: paid, demandUntil: relation.demandUntil || 0 } : {}) };
  }
  if (type === 'sendGift') {
    const faction = state.factions[action.factionId];
    requireThat(faction?.alive && !faction.isPlayer, '请选择仍存在的其他国家。');
    requireThat(!isBloodFeud(state, action.factionId), '血海深仇，不死不休，对方拒收礼金。');
    const relation = relationOf(state, state.playerId, action.factionId), tier = diplomaticGifts(state, faction.id, relation).find(gift => gift.gold === action.gold);
    requireThat(tier, '没有这档礼金。');
    requireThat(getRelation(state, action.factionId).met, '还没遇见她们。');
    requireThat(relation.talkTurn !== state.turn, '这回合已经谈过了。');
    requireThat(tier.favor > 0, `送礼最多只能让好感涨到 ${DIPLOMACY_RULES.giftCap}。想继续提升，可以去谈话或派使节。`);
    pay(state, { ap: 1, gold: tier.gold, supply: 0 });
    faction.gold += tier.gold; changeFavor(state, state.playerId, faction.id, tier.favor, '收到礼金'); relation.talkTurn = state.turn;
    log(state, `向${faction.name}送去 ${tier.gold} 金币，好感 +${tier.favor}。`, 'diplomacy');
    return { factionId: faction.id, favor: relation.favor };
  }
  if (type === 'answerOffer') {
    requireThat(typeof action.accept === 'boolean', '请明确选择接受或拒绝提议。');
    const item = state.inbox.find(entry => entry.id === action.id);
    requireThat(item && currentOffer(state, item), '这份提议已经过期了。');
    state.inbox = state.inbox.filter(entry => entry !== item);
    const faction = state.factions[item.from], relation = relationOf(state, state.playerId, item.from), mine = state.factions[state.playerId], name = faction.name;
    if (!action.accept) { relation.offerCooldowns ||= {}; relation.offerCooldowns[item.kind] = state.turn + 4; }
    if (action.accept) {
      if (item.kind === 'peace') endWar(state, state.playerId, item.from, 'truce', TRUCE_TURNS);
      if (item.kind === 'pact') endWar(state, state.playerId, item.from, 'pact', PACT_TURNS);
      if (item.kind === 'ally') endWar(state, state.playerId, item.from, 'ally', 0);
      if (item.kind === 'trade') relation.trade = true;
      if (item.kind === 'tribute') { requireThat(mine.gold >= item.gold, `金币不够，要 ${item.gold} 金。`); mine.gold -= item.gold; faction.gold += item.gold; }
      // A peace letter may carry terms: gold the player must pay, or gold she offers to end it.
      if (item.kind === 'peace' && item.gold) { requireThat(mine.gold >= item.gold, `金币不够，她要 ${item.gold} 金才肯停战。`); mine.gold -= item.gold; faction.gold += item.gold; }
      if (item.kind === 'peace' && item.pays) { const paid = Math.min(item.pays, faction.gold); faction.gold -= paid; mine.gold += paid; }
      changeFavor(state, state.playerId, item.from, 5, '接受了她的提议');
      log(state, `接受了${name}的提议${item.kind === 'peace' && item.gold ? `，支付 ${item.gold} 金币` : item.kind === 'peace' && item.pays ? '，收下了她的赔款' : ''}。`, 'diplomacy');
    } else if (item.kind === 'tribute') startWar(state, item.from, state.playerId, '进贡的要求被拒绝了。');
    else { changeFavor(state, state.playerId, item.from, -3, '拒绝了她的提议'); log(state, `拒绝了${name}的提议。`, 'diplomacy'); }
    return { id: item.id, from: item.from, kind: item.kind, accepted: Boolean(action.accept) };
  }
  if (type === 'applyMod') return applyModInternal(state, action.mod);
  if (type === 'addCharacter') {
    const character = action.character;
    return applyModInternal(state, { schemaVersion: 1, id: `runtime.character.${state.revision}`, name: character?.name || '新角色', characters: [character] });
  }
  if (type === 'addFaction') {
    const definition = action.definition;
    return applyModInternal(state, { schemaVersion: 1, id: `runtime.faction.${state.revision}`, name: definition?.name || '新国家', factions: [definition] });
  }
  if (type === 'expand') {
    const radius = action.radius === undefined ? 2 : action.radius;
    requireThat(integer(radius, 1, 3), '扩展半径需要为 1–3。');
    const center = action.q === undefined && action.r === undefined ? frontierCenter(state, radius) : { q: action.q, r: action.r };
    requireThat(coordValid(center.q) && coordValid(center.r) && inWorld(state, center.q, center.r), '扩展坐标无效。');
    if (action.terrainId !== undefined) requireThat(own(state.terrainTypes, action.terrainId), '扩展地形不存在。');
    const before = new Set(Object.keys(state.tiles));
    const revealed = revealArea(state, center.q, center.r, radius);
    requireThat(revealed > 0, '当前加载区没有可增加的空地；既有世界与回合仍可继续。');
    if (action.terrainId) for (const cell of hexArea(center.q, center.r, radius)) {
      const tile = state.tiles[tileKey(cell.q, cell.r)]; if (tile && !before.has(tile.key)) tile.terrainId = action.terrainId;
    }
    log(state, `雾境延展：${revealed} 块土地加入世界。既有领土保持原样。`, 'world');
    return { centerKey: tileKey(center.q, center.r), q: center.q, r: center.r, revealed, radius };
  }
  throw new Error(`不支持的行动：${String(type)}。`);
}

export function perform(state, action) {
  try {
    requireThat(isObject(action) && typeof action.type === 'string', '行动必须是带 type 的对象。');
    if (action.expectedRevision !== undefined) requireThat(action.expectedRevision === state.revision, '存档版本已变化，请重新读取后再行动。');
    requireThat(!state.battle || BATTLE_ACTIONS.has(action.type) || action.type === 'dialogueDone', '请先完成当前战场；战斗中仍可保存或导出存档。');
    requireThat(!state.turnContinuation || state.battle || action.type === 'endTurn', '战争阶段尚未结束，请继续推进回合。');
    if (action.type === 'undo') {
      requireThat(state.history.length > 0, '当前回合没有可撤销的行动。');
      const previous = clone(state.history[state.history.length - 1]);
      previous.history = clone(state.history.slice(0, -1));
      // Keep generated geography, while reverting discovery, ownership and resources.
      for (const tile of Object.values(state.tiles)) if (!own(previous.tiles, tile.key)) previous.tiles[tile.key] = { ...clone(tile), discovered: false, ownerId: null, troops: 0, food: 0, garrison: [], field: [], building: null, buildingLevel: 0, isCapital: false, capitalOf: null };
      previous.revision = state.revision + 1;
      log(previous, '已撤销上一步行动。', 'info');
      return { ok: true, state: previous, detail: { undone: true } };
    }
    // Every other action replaces history below. Clone all current JSON fields
    // in their original key order, without serializing the discarded undo trail.
    const next = action.type === 'dialogueDone' ? clone(state) : clone({ ...state, history: [] });
    const persistent = BATTLE_ACTIONS.has(action.type) || ['endTurn', 'applyMod', 'addCharacter', 'addFaction', 'expand', 'continue', 'gacha', 'storyChoice', 'declareWar', 'propose', 'sendGift', 'answerOffer', 'makePeace', 'annexVassal', 'releaseVassal', 'permanentImprison', 'executeCaptive', 'occupationChoice', 'currencyPolicy', 'requisitionLeader', 'peaceDeal', 'treaty', 'interceptFlight', 'sailShip'].includes(action.type);
    if (action.type === 'dialogueDone') { /* leaves the undo trail alone */ }
    else if (persistent) next.history = [];
    else { const snapshot = clone({ ...state, history: [] }); next.history = [...state.history.slice(-2), snapshot]; }
    migrateCampaign(next);
    const detail = executeAction(next, action);
    if (!next.battle) { cleanCampaignAssignments(next); dissolveEmptyNations(next); }
    reconcileWater(next);
    if (detail?.nation) next.history = []; // Meeting a nation cannot be taken back.
    next.revision = state.revision + 1;
    // This terminal no-benefit fallback must not itself trigger chapter rewards.
    if (!(action.type === 'storyChoice' && detail?.forfeited === true)) checkProgress(next);
    return { ok: true, state: next, detail };
  } catch (error) { if(typeof process!=='undefined'&&process.env.CAMPAIGN_TRACE)console.error(error.stack);return { ok: false, state, error: error?.message || '行动失败。' }; }
}
export function endTurn(state) { return perform(state, { type: 'endTurn' }); }

function scrapTransport(state, kind, id, ownerId, forced = false) {
  const c = state.campaign, inventory = kind === 'plane' ? c.planes : c.ships, vehicle = inventory[id];
  requireThat(vehicle?.ownerId === ownerId, C.notOwned);
  const model = (kind === 'plane' ? AIRCRAFT_MODELS : SHIP_MODELS)[vehicle.modelId], tile = state.tiles[kind === 'plane' ? vehicle.airportKey : vehicle.key];
  requireThat(tile && (kind === 'plane' ? !vehicle.flightId : forced || !tile.troops && !girlsOn(tile).length), C.vehicleBusy);
  const gold = Math.floor(model.gold * .25);
  if (kind === 'ship') {
    const home = state.tiles[state.factions[ownerId].capitalKey];
    if (forced) {
      home.field.push(...girlsOn(tile));
      home.troops = Math.min(100, home.troops + tile.troops);
      home.foughtTurn = state.turn;
    }
    Object.assign(tile, { ownerId: null, troops: 0, field: [], garrison: [], food: 0 });
    delete tile.shipId; delete tile.elite; delete tile.cutSince;
    delete c.armies[tile.key];
  }
  delete inventory[id]; state.factions[ownerId].gold += gold;
  log(state, say('scrapVehicleDone', { name: model.name, gold }), 'economy');
  return { name: model.name, gold };
}
function executeTransportAction(state, action) {
  const c = state.campaign, type = action.type;
  if (type === 'scrapAircraft' || type === 'scrapShip') return scrapTransport(state, type === 'scrapAircraft' ? 'plane' : 'ship', action.vehicleId, state.playerId);
  if (type === 'buyAircraft') {
    const quote = aircraftQuote(state, action.key, action.modelId, action.count ?? 1);
    requireThat(quote.enabled, quote.reason); pay(state, quote.cost);
    const ids = [];
    for (let i = 0; i < quote.count; i++) {
      const id = `plane.${++c.planeSeq}`;
      c.planes[id] = { id, modelId: quote.model.id, ownerId: state.playerId, airportKey: action.key, flightId: null }; ids.push(id);
    }
    log(state, say('planeBought', { name: quote.model.name, key: action.key }), 'army');
    return { planeIds: ids, cost: quote.cost };
  }
  if (type === 'buildShip') {
    const quote = shipQuote(state, action.key, action.modelId, action.launchKey);
    requireThat(quote.enabled, quote.reason); pay(state, quote.cost);
    const id = `ship.${++c.shipSeq}`, tile = state.tiles[quote.launchKey];
    c.ships[id] = { id, modelId: quote.model.id, ownerId: state.playerId, key: tile.key, goal: null, movedTurn: 0, mode: 'main' };
    Object.assign(tile, { shipId: id, ownerId: state.playerId, troops: 0, field: [], garrison: [], food: 0, building: null, buildingLevel: 0, militaryReserve: true, militaryReadyTurn: 0 });
    log(state, say('shipCreated', { name: quote.model.name, key: tile.key }), 'army');
    return { shipId: id, key: tile.key, cost: quote.cost };
  }
  if (type === 'boardShip' || type === 'disembarkShip') {
    const quote = boardQuote(state, action.shipId, action.shoreKey, action.characterIds || [], action.troops || 0, type === 'disembarkShip');
    requireThat(quote.enabled, quote.reason);
    const ship = c.ships[action.shipId], boat = state.tiles[ship.key], shore = state.tiles[action.shoreKey], from = quote.unload ? boat : shore, to = quote.unload ? shore : boat;
    from.troops -= quote.troops; to.troops += quote.troops;
    if(quote.troops>0)mergeElite(to,from);
    from.field = from.field.filter(id => !quote.ids.includes(id)); from.garrison = from.garrison.filter(id => !quote.ids.includes(id));
    to.field.push(...quote.ids);
    for (const id of quote.ids) ensureGrowth(state, id).movedTurn = state.turn;
    if (from.foughtTurn === state.turn) to.foughtTurn = state.turn;
    if (quote.unload) to.marchedTurn = state.turn;
    return quote;
  }
  if (type === 'shoreLanding') {
    const ship = c.ships[action.shipId], boat = state.tiles[ship?.key], shore = state.tiles[action.shoreKey];
    const ids = action.characterIds || [], troops = action.troops ?? 0;
    requireThat(ship?.ownerId === state.playerId && shore?.discovered && walkable(state, shore) && hexDistance(boat, shore) === 1, C.shoreInvalid);
    if (shore.ownerId === state.playerId) return executeTransportAction(state, { ...action, type: 'disembarkShip' });
    requireThat(Array.isArray(ids) && new Set(ids).size === ids.length && ids.every(id => boat.field.includes(id) && canServe(state, id, state.playerId)) && integer(troops, 0, boat.troops) && ids.length + troops > 0, C.invalidAction);
    requireThat(boat.foughtTurn !== state.turn && ids.every(id => !mayorCity(state, id)), C.invalidAction);
    if (shore.ownerId) {
      requireThat(atWar(state, state.playerId, shore.ownerId), C.shoreInvalid);
      return resolveBattle(state, boat.key, shore.key, troops, state.playerId, true, ids);
    }
    requireThat(troops >= 1 && troops <= supplyRoom(state, shore, ids.length), C.shipFull);
    pay(state, { ap: 2, supply: 2 });
    boat.troops -= troops; boat.field = boat.field.filter(id => !ids.includes(id));
    Object.assign(shore, { ownerId: state.playerId, troops, field: [...ids], garrison: [], acquiredTurn: state.turn, marchedTurn: state.turn, militaryReserve: true, militaryReadyTurn: 0 });
    if (troops) mergeElite(shore, boat);
    boat.foughtTurn = state.turn; creditTerritory(state, shore);
    revealArea(state, shore.q, shore.r, 1);
    return { key: shore.key, landed: true };
  }
  if (type === 'sailShip' || type === 'setShipGoal') {
    const ship = c.ships[action.shipId];
    requireThat(ship?.ownerId === state.playerId, C.notOwned);
    if (action.toKey === null && type === 'setShipGoal') { ship.goal = null; delete ship.blocked; return { shipId: ship.id }; }
    const route = shipRoute(state, ship.id, action.toKey);
    requireThat(route && route.path.length > 1, C.shipOcean);
    if (type === 'setShipGoal') { ship.goal = action.toKey; delete ship.blocked; return { shipId: ship.id, ...route }; }
    return sailShip(state, ship, action.toKey);
  }
  if (type === 'setShipMode') {
    const ship = c.ships[action.shipId]; requireThat(ship?.ownerId === state.playerId && ['main', 'free'].includes(action.mode), C.invalidAction);
    ship.mode = action.mode; return { shipId: ship.id, mode: ship.mode };
  }
  if (type === 'launchFlight' || type === 'launchNativeFlight') {
    requireThat(!action.troops, C.flightNoTroops);
    const quote = flightQuote(state, action.fromKey, action.toKey, action.pilotIds, action.planeIds || [], type === 'launchNativeFlight', id => mobilityOf(state, id).air, action.loiter ?? false);
    requireThat(quote.enabled, quote.reason); pay(state, quote.cost);
    const from = state.tiles[action.fromKey], id = `flight.${++c.flightSeq}`;
    from.field = from.field.filter(who => !action.pilotIds.includes(who)); from.garrison = from.garrison.filter(who => !action.pilotIds.includes(who));
    if(c.airportGuests[action.fromKey])c.airportGuests[action.fromKey]=c.airportGuests[action.fromKey].filter(who=>!action.pilotIds.includes(who));
    const flight = { id, ownerId: state.playerId, fromKey: from.key, key: from.key, toKey: action.toKey, pilotIds: [...action.pilotIds], planeIds: [...(action.planeIds || [])], native: type === 'launchNativeFlight', loiter: action.loiter ?? false, path: quote.path, cursor: 0, speed: quote.speed, lastMoveTurn: 0 };
    c.flights[id] = flight;
    if (!flight.native) for (const planeId of flight.planeIds) { c.planes[planeId].airportKey = null; c.planes[planeId].flightId = id; }
    log(state, say('flightStarted', { count: flight.pilotIds.length, key: flight.toKey }), 'army');
    stepFlight(state, flight, false);
    return { flightId: id, landed: !c.flights[id], toKey: action.toKey };
  }
  if (type === 'divertFlight') {
    const flight = c.flights[action.flightId], to = state.tiles[action.toKey];
    const loiter = action.loiter ?? flight?.loiter ?? false;
    requireThat(flight?.ownerId === state.playerId && typeof loiter === 'boolean' && (loiter || action.toKey !== flight.fromKey), C.airportUnavailable);
    requireThat(loiter ? to?.discovered : flight.native ? to?.ownerId === state.playerId && state.terrainTypes[to.terrainId].passable : usableAirport(state, action.toKey), C.airportUnavailable);
    const path = flightPath(state, flight.key, action.toKey); requireThat(path, C.objectiveInvalid);
    flight.path = path; flight.cursor = 0; flight.toKey = action.toKey; flight.loiter = loiter; delete flight.blocked;
    return { flightId: flight.id, toKey: action.toKey };
  }
  if (type === 'interceptFlight') {
    const mine = c.flights[action.flightId], enemy = c.flights[action.enemyFlightId];
    requireThat(mine?.ownerId === state.playerId && mine.foughtTurn!==state.turn && enemy && atWar(state, mine.ownerId, enemy.ownerId) && hexDistance(state.tiles[mine.key], state.tiles[enemy.key]) <= 1, C.invalidAction);
    const blocked=peaceReason(state,mine.ownerId,enemy.ownerId);requireThat(!blocked,blocked);
    pay(state, { ap: 2, supply: 2 }); beginFlightBattle(state, mine, enemy);
    return { startedBattle: true, battleId: state.battle.id };
  }
  return undefined;
}
export function getShipVoyageQuote(state,shipId,toKey,ownerId=state.playerId) {
  const ship=state.campaign.ships[shipId],boat=state.tiles[ship?.key],target=state.tiles[toKey],route=ship&&shipRoute(state,shipId,toKey);
  const enemy=Boolean(target?.shipId&&target.ownerId!==ownerId),reachable=Boolean(route&&route.path.length-1<=shipSpeed(state,ship));
  const battleCost=enemy&&reachable?combatActionCost(state,ownerId,ownerId===state.playerId,attackingIds(state,boat)).cost:{ap:0,gold:0,supply:0};
  const cost={...battleCost,supply:battleCost.supply+1};
  const reason=!ship||ship.ownerId!==ownerId?C.notOwned:!route||route.path.length<2?C.shipOcean
    :ship.movedTurn===state.turn?C.invalidAction
    :enemy?peaceReason(state,ownerId,target.ownerId)||(!boat.troops&&!boat.field.length?C.invalidAction:'')||(reachable&&boat.foughtTurn===state.turn?C.invalidAction:'')||affordable(state,cost,ownerId,ownerId===state.playerId)
      :affordable(state,cost,ownerId,ownerId===state.playerId);
  return {enabled:!reason,reason,cost,path:route?.path||[],turns:route?.turns||0,action:{type:'sailShip',shipId,toKey}};
}
function sailShip(state, ship, toKey, automatic=false) {
  const quote=getShipVoyageQuote(state,ship.id,toKey,ship.ownerId);
  if(!quote.enabled&&automatic){ship.blocked=quote.reason;return {shipId:ship.id,blocked:quote.reason};}
  requireThat(quote.enabled,quote.reason);delete ship.blocked;
  const route = {path:quote.path}, model = SHIP_MODELS[ship.modelId];
  let key = ship.key, fought = false;
  const limit = Math.min(route.path.length - 1, shipSpeed(state, ship));
  pay(state, { supply: 1 }, ship.ownerId, false);
  for (let i = 1; i <= limit; i++) {
    let nextKey = route.path[i];
    if (state.tiles[nextKey]?.terrainId !== 'ocean') {
      let j = i + 1;
      while (j < route.path.length && state.tiles[route.path[j]]?.terrainId !== 'ocean') j++;
      if (j >= route.path.length || j > limit || state.tiles[route.path[j]]?.shipId) break;
      i = j; nextKey = route.path[j];
    }
    const from = state.tiles[key], to = state.tiles[nextKey];
    if (to.shipId) {
      if (to.ownerId === ship.ownerId || !atWar(state, ship.ownerId, to.ownerId) || !from.field.length && !from.troops) break;
      state.campaign.armies[from.key] = { mode: ship.mode || 'main', travel: 'land' };
      resolveBattle(state, from.key, to.key, from.troops, ship.ownerId, ship.ownerId === state.playerId, from.field);
      fought = true; break;
    }
    const passengers = { troops: from.troops, field: [...from.field], garrison: [...from.garrison], elite: from.elite ? { ...from.elite } : undefined, foughtTurn: from.foughtTurn };
    Object.assign(to, { shipId: ship.id, ownerId: ship.ownerId, troops: passengers.troops, field: passengers.field, garrison: passengers.garrison, food: 0, building: null, buildingLevel: 0, militaryReserve: true, militaryReadyTurn: 0, marchedTurn: state.turn });
    if (passengers.elite) to.elite = passengers.elite;
    if (passengers.foughtTurn) to.foughtTurn = passengers.foughtTurn;
    Object.assign(from, { ownerId: null, troops: 0, field: [], garrison: [], food: 0 });
    delete from.shipId; delete from.elite; delete from.cutSince; delete from.marchedTurn; delete from.foughtTurn;
    if (state.campaign.armies[key]) { state.campaign.armies[nextKey] = state.campaign.armies[key]; delete state.campaign.armies[key]; }
    ship.key = nextKey; key = nextKey;
  }
  ship.movedTurn = state.turn;
  // A voyage longer than one turn keeps going by itself: the destination becomes the ship's standing goal.
  if (!automatic && !fought && ship.key !== toKey) ship.goal = toKey;
  if (ship.key === ship.goal) ship.goal = null;
  return { shipId: ship.id, key: ship.key, fought, arrived: ship.key === toKey };
}
function stepFlight(state, flight, charge = true) {
  if (flight.lastMoveTurn === state.turn || !flight.pilotIds.length || state.battle) return;
  const faction = state.factions[flight.ownerId];
  if (charge && faction.supply < flight.pilotIds.length) { flight.blocked = C.vehicleLocked; return; }
  if (charge) pay(state, { supply: flight.pilotIds.length }, flight.ownerId, false);
  flight.lastMoveTurn = state.turn;
  delete flight.blocked;
  for (let moved = 0; moved < flight.speed && flight.cursor < flight.path.length - 1; moved++) {
    flight.cursor++; flight.key = flight.path[flight.cursor];
    if(flight.ownerId===state.playerId)state.tiles[flight.key].discovered=true;
    const enemy = Object.values(state.campaign.flights).find(other => other.id !== flight.id && other.key === flight.key && !peaceReason(state,flight.ownerId,other.ownerId));
    if (enemy && [flight.ownerId, enemy.ownerId].includes(state.playerId)) { beginFlightBattle(state, flight, enemy); return; }
  }
  if (flight.key !== flight.toKey) return;
  if (flight.loiter) { flight.blocked = C.patrolHolding; return; }
  const destination = state.tiles[flight.toKey], canLand = flight.native ? destination?.ownerId === flight.ownerId && state.terrainTypes[destination.terrainId].passable : usableAirport(state, flight.toKey, flight.ownerId);
  if (!canLand) { flight.blocked = C.flightWaiting; return; }
  if(destination.ownerId===flight.ownerId)destination.field.push(...flight.pilotIds);else (state.campaign.airportGuests[destination.key]||=[]).push(...flight.pilotIds);
  for (const id of flight.pilotIds) ensureGrowth(state, id).movedTurn = state.turn;
  for (const id of flight.planeIds) { const plane = state.campaign.planes[id]; plane.airportKey = destination.key; plane.flightId = null; }
  destination.marchedTurn = state.turn;
  delete state.campaign.flights[flight.id];
  if (flight.ownerId === state.playerId) notice(state, 'land', say('flightLanded', { count: flight.pilotIds.length, key: destination.key }), { key: destination.key });
}
function beginFlightBattle(state, attacker, defender) {
  attacker.foughtTurn=state.turn; defender.foughtTurn=state.turn;
  const modelFor = flight => Object.fromEntries(flight.pilotIds.map((id, i) => [id, flight.native ? null : AIRCRAFT_MODELS[state.campaign.planes[flight.planeIds[i]].modelId]]));
  const aircraft = { ...modelFor(attacker), ...modelFor(defender) };
  const battle = createTacticalBattle({ id: `air.${state.turn}.${state.revision}.${attacker.id}.${defender.id}`, seed: state.seed,
    environment: 'air', aircraft, innateFlyIds: [...(attacker.native ? attacker.pilotIds : []), ...(defender.native ? defender.pilotIds : [])],
    attackerId: attacker.ownerId, defenderId: defender.ownerId, playerId: state.playerId, fromKey: attacker.key, toKey: defender.key,
    sourceTroopsBefore: 0, attackingTroops: 0, defendingTroops: 0, terrainId: 'ocean',
    attackerCharacters: attacker.pilotIds.map(id => heroView(state, id)), defenderCharacters: defender.pilotIds.map(id => heroView(state, id)) });
  battle.flightCombat = { attacker: attacker.id, defender: defender.id };
  state.battle = battle; state.history = []; decorateBattleResult(state, battle);
}
function commitFlightBattle(state, battle) {
  const result = battle.result, refs = battle.flightCombat;
  requireThat(refs && state.campaign.flights[refs.attacker] && state.campaign.flights[refs.defender], C.invalidAction);
  for (const side of ['attacker', 'defender']) {
    const flight = state.campaign.flights[refs[side]], survivingPilots = [], survivingPlanes = [];
    for (let index = 0; index < flight.pilotIds.length; index++) {
      const id = flight.pilotIds[index], planeId = flight.planeIds[index], unit = battle.units.find(u => u.characterId === id && u.side === side), captured = result.capturedCharacterIds.includes(id);
      const growth = ensureGrowth(state, id); growth.battles++; if (result.winnerSide === side) growth.wins++;
      if (captured) captureCharacter(state, id, result.winnerId, result.loserId, battle.id);
      growth.spirit=Math.max(0,growth.spirit-12);
      const earned=!tacticalGrowthSuppressed(battle)&&(!tacticalGrowthLimited(battle)||tacticalGrowthParticipants(battle).includes(unit?.id));
      if(earned){gainExp(state,id,(18+(result.winnerSide===side?14:4)+(unit?.kills||0)*12)*(flight.ownerId===state.playerId?1:.5));if(flight.ownerId===state.playerId)addBond(state,id,result.winnerSide===side?2:1);}
      if (unit?.hp > 0 && !captured) { survivingPilots.push(id); if (planeId) survivingPlanes.push(planeId); }
      else {
        if (planeId) delete state.campaign.planes[planeId];
        if (!captured) { const home = state.tiles[state.factions[flight.ownerId]?.capitalKey]; if (home) home.field.push(id); }
      }
    }
    flight.pilotIds = survivingPilots; flight.planeIds = survivingPlanes;
    flight.speed = (flight.native ? 7 : Math.min(...survivingPlanes.map(id => AIRCRAFT_MODELS[state.campaign.planes[id].modelId].speed))) + Math.round(techEffect(state, 'airSpeed', flight.ownerId));
    if (!survivingPilots.length) delete state.campaign.flights[flight.id];
  }
  scoreWar(state, result.winnerId, result.loserId, DIPLOMACY_RULES.score.battle);
  normalizeParty(state); dissolveEmptyNations(state);
  return { ...result, battleId: battle.id };
}
function tickTransport(state) {
  for (const ship of Object.values(state.campaign.ships)) {
    if (ship.goal && ship.movedTurn !== state.turn) {
      sailShip(state, ship, ship.goal,true);
      if (state.battle) return;
    }
  }
  for (const flight of Object.values(state.campaign.flights)) { stepFlight(state, flight); if (state.battle) return; }
}
/** NPC infrastructure, aircraft and ships pay the same prices and occupy ordinary strategic actions. */
function aiTransportStep(state, faction) {
  const c=state.campaign, owned=factionTiles(state,faction.id), prices=Math.max(1,(c.economies[faction.id]?.prices||100)/100);
  const needs=['workshop','factory','shipyard','airfield'];
  if(faction.gold>100)for(const id of needs){
    if(owned.some(t=>t.building===id)||!owned.some(t=>canBuild(state,t,id)))continue;
    const site=owned.filter(t=>!t.building&&t.troops>=6&&canBuild(state,t,id)).sort((a,b)=>Number(b.isCapital)-Number(a.isCapital)||b.troops-a.troops)[0];
    if(!site)continue;
    const cost=constructionCost(state,site,id,faction.id);
    if(faction.gold<cost.gold+40||faction.supply<cost.supply+15)continue;
    pay(state,cost,faction.id,false);site.building=id;site.buildingLevel=1;
    return true;
  }
  const airports=owned.filter(t=>t.building==='airfield');
  for(const flight of Object.values(c.flights).filter(f=>f.ownerId===faction.id&&f.loiter&&f.key===f.toKey)){
    const destination=airports.find(t=>t.key!==flight.fromKey);
    if(destination&&state.turn%4===0){
      const path=flightPath(state,flight.key,destination.key);
      if(path){flight.path=path;flight.cursor=0;flight.toKey=destination.key;flight.loiter=false;delete flight.blocked;return true;}
    }
  }
  if(airports.length===1&&hasTech(state,'aeronautics',faction.id)&&faction.gold>650){
    const site=owned.find(t=>!t.building&&t.troops>=6&&canBuild(state,t,'airfield'));
    if(site){const cost=constructionCost(state,site,'airfield',faction.id);if(!affordable(state,cost,faction.id,false)){pay(state,cost,faction.id,false);site.building='airfield';site.buildingLevel=1;return true;}}
  }
  for(const airport of airports){
    const parked=parkedPlanes(state,airport.key,faction.id);
    if(!parked.length&&hasTech(state,'aeronautics',faction.id)&&faction.gold>=80*prices+40&&faction.supply>=20){
      pay(state,{gold:Math.ceil(80*prices),supply:5},faction.id,false);
      const id=`plane.${++c.planeSeq}`;c.planes[id]={id,ownerId:faction.id,modelId:'lightPlane',airportKey:airport.key,flightId:null};return true;
    }
    const pilot=airport.field.find(id=>canServe(state,id,faction.id))||airport.garrison.find(id=>canServe(state,id,faction.id));
    const patrol=airports.length>=2&&Object.values(state.factions).find(f=>f.alive&&!peaceReason(state,faction.id,f.id));
    const to=patrol?state.tiles[patrol.capitalKey]:airports.find(t=>t.key!==airport.key);
    if(pilot&&ensureGrowth(state,pilot).movedTurn!==state.turn&&parked.length&&to&&faction.supply>15&&state.turn%3===0){
      const path=flightPath(state,airport.key,to.key);if(!path)continue;
      const id=`flight.${++c.flightSeq}`,plane=parked[0];
      airport.field=airport.field.filter(who=>who!==pilot);airport.garrison=airport.garrison.filter(who=>who!==pilot);
      plane.airportKey=null;plane.flightId=id;c.flights[id]={id,ownerId:faction.id,fromKey:airport.key,key:airport.key,toKey:to.key,pilotIds:[pilot],planeIds:[plane.id],native:false,loiter:Boolean(patrol),path,cursor:0,speed:AIRCRAFT_MODELS[plane.modelId].speed,lastMoveTurn:0};
      stepFlight(state,c.flights[id]);return true;
    }
  }
  if(hasTech(state,'shipbuilding',faction.id)&&faction.gold>=260&&faction.supply>=25){
    c.canals ||= {};
    const isthmus=owned.find(t=>!c.canals[t.key]&&t.troops>=6&&canalSides(state,t,false)>=2);
    if(isthmus){const q=canalQuote(state,isthmus.key,faction.id);if(q.enabled){pay(state,q.cost,faction.id,false);c.canals[isthmus.key]={key:isthmus.key,name:q.name,status:'building',remaining:q.turns,ownerId:faction.id,builtTurn:state.turn};return true;}}
  }
  for(const yard of owned.filter(t=>t.building==='shipyard')){
    const water=neighbors(yard).map(p=>state.tiles[p.key]).find(t=>t?.terrainId==='ocean'&&!t.shipId&&!t.ownerId);
    if(water&&!Object.values(c.ships).some(s=>s.ownerId===faction.id)&&faction.gold>=Math.ceil(120*prices)+40&&faction.supply>=30){
      pay(state,{gold:Math.ceil(120*prices),supply:12},faction.id,false);
      const id=`ship.${++c.shipSeq}`;c.ships[id]={id,ownerId:faction.id,key:water.key,modelId:'cutter',mode:'main',movedTurn:0,goal:null};
      Object.assign(water,{shipId:id,ownerId:faction.id,troops:0,field:[],garrison:[],militaryReserve:true,militaryReadyTurn:0});
      return true;
    }
  }
  for(const ship of Object.values(c.ships).filter(s=>s.ownerId===faction.id)){
    const boat=state.tiles[ship.key],capacity=SHIP_MODELS[ship.modelId].capacity;
    if(!boat.field.length&&!boat.troops){
      const shore=neighbors(boat).map(p=>state.tiles[p.key]).find(t=>t?.ownerId===faction.id&&state.terrainTypes[t.terrainId].passable&&t.troops>=4);
      if(shore){const id=shore.field.find(who=>canServe(state,who,faction.id)),troops=Math.min(capacity-(id?1:0),Math.max(0,shore.troops-2));shore.troops-=troops;boat.troops+=troops;if(id){shore.field=shore.field.filter(who=>who!==id);boat.field.push(id);}return true;}
    }
    if(ship.movedTurn!==state.turn&&faction.supply>10){
      const enemies=Object.values(c.ships).filter(s=>!peaceReason(state,faction.id,s.ownerId));
      const target=enemies.find(s=>shipRoute(state,ship.id,s.key));
      if(target){sailShip(state,ship,target.key,true);return true;}
    }
  }
  return false;
}

function tributeResources(state, faction) {
  const raw = getIncome(state, faction.id, undefined, false);
  return { gold: Math.floor(Math.max(0, raw.gold) * CIVIC_RULES.tribute), supply: Math.floor(Math.max(0, raw.supply) * CIVIC_RULES.tribute) };
}
function cleanCampaignAssignments(state) {
  if (!state.campaign) return;
  for(const [id,flight] of Object.entries(state.campaign.flights))if(!state.factions[flight.ownerId]?.alive){for(const planeId of flight.planeIds)delete state.campaign.planes[planeId];for(const who of flight.pilotIds)if(!state.captives[who])state.characterOwners[who]=null;delete state.campaign.flights[id];}
  for (const [key, ids] of Object.entries(state.campaign.airportGuests)) {
    const tile = state.tiles[key], keep = [], returnHome = [];
    for (const id of ids) {
      const owner = state.characterOwners[id];
      if (!canServe(state, id, owner)) continue;
      if (tile?.ownerId === owner && tile.building === 'airfield') tile.field.push(id);
      else if (usableAirport(state, key, owner)) keep.push(id);
      else returnHome.push(id);
    }
    if (keep.length) state.campaign.airportGuests[key] = keep; else delete state.campaign.airportGuests[key];
    for (const id of returnHome) seatAtHome(state, id);
  }
  for (const [id,plane] of Object.entries(state.campaign.planes)) if (!plane.flightId) {const at=state.tiles[plane.airportKey];if(at?.building!=='airfield')delete state.campaign.planes[id];else if(at.ownerId!==plane.ownerId&&!['ally','vassal'].includes(readRelation(state,plane.ownerId,at.ownerId)?.status))plane.ownerId=at.ownerId;}
  for (const [key, city] of Object.entries(state.campaign.cities)) {
    if (state.tiles[key]?.ownerId !== city.ownerId) { delete state.campaign.cities[key]; continue; }
    if (city.mayorId && (!canServe(state, city.mayorId, city.ownerId) || stationOf(state, city.mayorId)?.key !== key)) city.mayorId = null;
  }
  for (const [key, canal] of Object.entries(state.campaign.canals || {})) {
    const tile = state.tiles[key];
    if (!tile || tile.terrainId === 'ocean' || tile.terrainId === 'lake') { delete state.campaign.canals[key]; continue; }
    canal.ownerId = tile.ownerId || null;
  }
  for (const [key, army] of Object.entries(state.campaign.armies)) if (state.tiles[key]?.ownerId !== state.playerId || !state.tiles[key].field.length && !state.tiles[key].troops && !army.goal && !army.ships && !army.planes) delete state.campaign.armies[key];
}
/** Never let a troop-only NPC government survive capture, pool exhaustion, load or frontier birth. */
function dissolveEmptyNations(state) {
  for (const faction of Object.values(state.factions)) {
    if (faction.isPlayer || !faction.alive || membersOf(state, faction.id).length) continue;
    const conquest = state.campaign?.occupations.find(o => o.factionId === faction.id && o.turn === state.turn);
    tellWarOver(state, faction, conquest ? state.playerId : null, 'dissolved');
    for (const tile of factionTiles(state, faction.id)) {
      tile.ownerId = conquest ? state.playerId : null;
      if (conquest) { tile.acquiredTurn = state.turn; tile.discovered = true; creditTerritory(state, tile); }
      tile.isCapital = false; tile.formerCapitalOf = faction.id; tile.capitalOf = null;
      tile.field = []; tile.garrison = []; tile.militaryReserve = true; tile.militaryReadyTurn = 0; delete tile.cutSince;
    }
    for (const ship of Object.values(state.campaign?.ships||{}).filter(v=>v.ownerId===faction.id)) {const tile=state.tiles[ship.key];if(tile){tile.ownerId=null;tile.troops=0;tile.field=[];tile.garrison=[];delete tile.shipId;}delete state.campaign.ships[ship.id];}
    // The last character can be captured on a capital which has already changed
    // hands. That tile is outside factionTiles, but its old capital stamp must go.
    for (const tile of Object.values(state.tiles)) if (tile.capitalOf === faction.id) {
      tile.isCapital = false; tile.formerCapitalOf = faction.id; tile.capitalOf = null;
    }
    for (const plane of Object.values(state.campaign?.planes || {})) if (plane.ownerId === faction.id) delete state.campaign.planes[plane.id];
    for (const flight of Object.values(state.campaign?.flights || {})) if (flight.ownerId === faction.id) delete state.campaign.flights[flight.id];
    faction.alive = false; faction.capitalKey = null; faction.lastDefeatedTurn = state.turn;
    releasePrisonersOf(state, faction.id, C.emptyNation);
    if (state.campaign?.integrations) delete state.campaign.integrations[faction.id];
    recordChronicle(state, `${faction.name}：${C.emptyNation}`, 'dormant', faction.id);
  }
}
function rememberOccupation(state, factionId, key) {
  if (!state.campaign || state.campaign.occupations.some(o => o.factionId === factionId && o.turn === state.turn)) return;
  const faction = state.factions[factionId];
  state.campaign.occupations.push({ factionId, capitalKey: key, keys: factionTiles(state, factionId).map(t => t.key), members: membersOf(state, factionId), turn: state.turn, gold: faction.gold, supply: faction.supply });
  state.campaign.occupations = state.campaign.occupations.slice(-100);
}
function finishIntegration(state, factionId) {
  const faction = state.factions[factionId], me = state.factions[state.playerId], joined = [], formerCities=Object.values(state.campaign.cities).filter(city=>city.ownerId===factionId);
  for (const tile of factionTiles(state, factionId)) {
    tile.ownerId = state.playerId; tile.isCapital = false; tile.formerCapitalOf = factionId; tile.capitalOf = null;
    tile.discovered = true; tile.acquiredTurn = state.turn; tile.militaryReserve = true; tile.militaryReadyTurn = 0;
    delete tile.cutSince; delete tile.claim; creditTerritory(state, tile);
  }
  for (const id of membersOf(state, factionId)) {
    state.characterOwners[id] = state.playerId; ensureGrowth(state, id).joined = state.turn;
    if (!state.recruitedHeroIds.includes(id)) state.recruitedHeroIds.push(id);
    joined.push(id);
  }
  for (const city of formerCities) { city.ownerId = state.playerId; city.liberty = Math.max(25, city.liberty); }
  for (const ship of Object.values(state.campaign.ships)) if (ship.ownerId === factionId) { ship.ownerId = state.playerId; state.tiles[ship.key].ownerId = state.playerId; }
  for (const plane of Object.values(state.campaign.planes)) if (plane.ownerId === factionId) plane.ownerId = state.playerId;
  for (const flight of Object.values(state.campaign.flights)) if (flight.ownerId === factionId) flight.ownerId = state.playerId;
  me.gold += faction.gold; me.supply += faction.supply; faction.gold = 0; faction.supply = 0;
  faction.alive = false; faction.capitalKey = null; faction.lastDefeatedTurn = state.turn;
  releasePrisonersOf(state, factionId, '因关押国已被整合');
  if (state.envoys[factionId]) { const id = state.envoys[factionId]; delete state.envoys[factionId]; seatAtHome(state, id); }
  Object.assign(relationOf(state, state.playerId, factionId), { status: 'neutral', until: 0, since: state.turn, trade: false });
  delete state.campaign.integrations[factionId];
  for (const other of Object.values(state.factions)) if (other.alive && !other.isPlayer && other.id !== factionId) {
    changeFavor(state, state.playerId, other.id, isVassal(state, other.id) ? -15 : -10, C.annex);
    if (isVassal(state, other.id)) other.liberty = Math.min(100, (other.liberty || 0) + 12);
  }
  cleanCampaignAssignments(state); syncGarrisons(state); normalizeParty(state);
  notice(state, 'nation', say('annexDone', { name: faction.name }));
  return { factionId, joined };
}
/** Additive campaign actions use the original transaction, undo and persistence path. */
function executeCampaignAction(state, action) {
  const c = state.campaign, me = state.factions[state.playerId], type = action.type;
  if (type === 'peaceDeal') {
    const quote = getPeaceDealQuote(state, action.factionId, action.selection);
    requireThat(quote.enabled, quote.reason); pay(state, quote.cost);
    const faction = state.factions[action.factionId], relation = relationOf(state, state.playerId, faction.id);
    const paid = Math.min(faction.gold, quote.gold); faction.gold -= paid; me.gold += paid;
    for (const key of quote.tiles) cedeTile(state, state.tiles[key], state.playerId);
    endWar(state, state.playerId, faction.id, quote.vassal ? 'vassal' : 'truce', quote.vassal ? 0 : TRUCE_TURNS);
    relation.talkTurn = state.turn;
    changeFavor(state, state.playerId, faction.id, -(quote.tiles.length * 8 + (paid ? 5 : 0) + (quote.vassal ? 15 : 0)), C.peacePackage);
    recordChronicle(state, `${C.peacePackage} · ${faction.name} · ${quote.points} · ${paid} · ${quote.tiles.join('、')}`, 'diplomacy', faction.id, [state.playerId, faction.id]);
    return { factionId: faction.id, gold: paid, tiles: quote.tiles, vassal: quote.vassal, points: quote.points };
  }
  if (type === 'batchDiplomacy') {
    const ids = action.factionIds;
    requireThat(Array.isArray(ids) && ids.length > 0 && ids.length <= 100 && new Set(ids).size === ids.length, C.batchEmpty);
    requireThat(['chat', 'trade', 'pact', 'ally'].includes(action.kind), C.batchInvalid);
    requireThat(state.ap >= ids.length, say('apNeed', { ap: ids.length, left: state.ap }));
    const quotes = ids.map(id => getRelation(state, id)?.offers.find(o => o.kind === action.kind));
    requireThat(quotes.every(o => o?.enabled), C.batchInvalid);
    const results = ids.map(factionId => executeAction(state, { type: 'propose', factionId, kind: action.kind }));
    log(state, say('batchDone', { count: results.length }), 'diplomacy');
    return { results, cost: { ap: ids.length } };
  }
  if (type === 'queueResearch') {
    const ids = action.techIds, record = c.research[state.playerId];
    requireThat(Array.isArray(ids) && ids.length >= 1 && ids.length <= TECHNOLOGIES.length && new Set(ids).size === ids.length && ids.every(id => techById(id)), C.invalidAction);
    const have = new Set([...record.known, ...(record.active ? [record.active.id] : [])]);
    for (const id of ids) { requireThat(!have.has(id), C.completed); requireThat(techById(id).prerequisites.every(p => have.has(p)), C.researchBlocked); have.add(id); }
    record.queue = [...ids];
    if (!record.active) {
      const quote = researchQuote(state, record.queue[0]);
      requireThat(quote.enabled, quote.reason); pay(state, quote.cost);
      record.active = { id: quote.id, remaining: quote.turns }; record.queue.shift();
      log(state, say('researchStarted', { name: quote.name, turns: quote.turns }), 'economy');
    }
    if (!record.queue.length) delete record.queue;
    return { active: record.active?.id || null, queue: [...(record.queue || [])] };
  }
  if (type === 'research') {
    const quote = researchQuote(state, action.techId);
    requireThat(quote.enabled, quote.reason); pay(state, quote.cost);
    c.research[state.playerId].active = { id: action.techId, remaining: quote.turns };
    log(state, say('researchStarted', { name: quote.name, turns: quote.turns }), 'economy');
    return quote;
  }
  if (type === 'foundCity') {
    const quote = cityQuote(state, action.key, action.mayorId);
    requireThat(quote.enabled, quote.reason); pay(state, quote.cost);
    const tile = state.tiles[action.key], name = typeof action.name === 'string' && action.name.trim() ? action.name.trim().slice(0, 32) : `${C.city} ${Object.keys(c.cities).length + 1}`;
    tile.field = tile.field.filter(id => id !== action.mayorId);
    if (!tile.garrison.includes(action.mayorId)) tile.garrison.push(action.mayorId);
    c.cities[action.key] = { key: action.key, ownerId: state.playerId, name, mayorId: action.mayorId, liberty: 0, foundedTurn: state.turn };
    log(state, say('cityFounded', { city: name, name: state.characters[action.mayorId].name }), 'build');
    return { city: c.cities[action.key], cost: quote.cost };
  }
  if (type === 'appointMayor') {
    const city = c.cities[action.key], tile = playerTile(state, action.key), id = action.characterId;
    requireThat(city?.ownerId === state.playerId && canServe(state, id, state.playerId), C.cityMayorRequired);
    requireThat(![state.activeHeroId, state.companionId, ...Object.values(state.posts), ...Object.values(state.envoys)].includes(id) && (!mayorCity(state, id) || mayorCity(state, id)?.key === action.key), C.mayorBusy);
    requireThat(girlsOn(tile).includes(id), C.mayorOnSite);
    if (city.mayorId && city.mayorId !== id) {
      tile.garrison = tile.garrison.filter(who => who !== city.mayorId); tile.field.push(city.mayorId);
    }
    tile.field = tile.field.filter(who => who !== id);
    if (!tile.garrison.includes(id)) tile.garrison.push(id);
    city.mayorId = id;
    return { city };
  }
  if (type === 'moveCapital') {
    const city = c.cities[action.key], tile = playerTile(state, action.key);
    const quote=getMoveCapitalQuote(state,action.key); requireThat(quote.enabled,quote.reason);
    const cost = quote.cost;
    pay(state, cost);
    const old = state.tiles[me.capitalKey], oldLead = state.activeHeroId;
    chooseCapital(state, state.playerId, tile); me.capitalRecoveryUntil = state.turn + 8;
    // Moving the government is costly and also moves the player's office, not the field army.
    if (old && oldLead && girlsOn(old).includes(oldLead)) {
      old.garrison = old.garrison.filter(id => id !== oldLead); old.field = old.field.filter(id => id !== oldLead); tile.garrison.push(oldLead);
    }
    log(state, say('capitalMoved', { city: city.name }), 'build');
    return { key: action.key, cost };
  }
  if (type === 'sellSupply') {
    const quote = sellSupplyQuote(state, action.amount);
    requireThat(quote.enabled, quote.reason); pay(state, quote.cost); me.gold += quote.gold;
    const data = c.economies[state.playerId]; data.sold = { turn: state.turn, amount: quote.sold + quote.amount };
    log(state, say('sellDone', { supply: quote.amount, gold: quote.gold }), 'economy');
    return { sold: quote.amount, gold: quote.gold, cost: quote.cost };
  }
  if (type === 'currencyPolicy' && action.kind === 'rate') {
    const view = economyView(state), data = c.economies[state.playerId];
    requireThat([-1, 0, 1].includes(action.value), C.invalidAction);
    requireThat(!view.rate.reason, view.rate.reason);
    requireThat(action.value !== (data.rate || 0), C.invalidAction);
    pay(state, view.rate.cost); data.rate = action.value; data.lastPolicy = state.turn;
    log(state, say('rateDone', { name: ({ '-1': '宽松', 0: '中性', 1: '紧缩' })[action.value] }), 'economy');
    return { policy: 'rate', value: action.value };
  }
  if (type === 'currencyPolicy') {
    const view = economyView(state), quote = view.policies.find(p => p.kind === action.kind), data = c.economies[state.playerId];
    requireThat(quote?.enabled, quote?.reason || C.invalidAction); pay(state, quote.cost);
    const amount = quote.amount;
    if (action.kind === 'mint') { me.gold += amount; data.money += amount; data.credit = Math.max(5, data.credit - 3); }
    if (action.kind === 'bond') { me.gold += amount; data.debt += amount; data.money += amount; data.credit = Math.max(5, data.credit - 1); }
    if (action.kind === 'repay') { data.debt -= amount; data.credit = Math.min(100, data.credit + 3); }
    if (action.kind === 'tighten') { data.money = Math.max(20, data.money - amount); data.inflation = Math.max(-3, data.inflation - 4); data.credit = Math.min(100, data.credit + 2); }
    data.lastPolicy = state.turn;
    log(state, say(action.kind + 'Done', { gold: amount }), 'economy');
    return { policy: action.kind, amount };
  }
  if (type === 'permanentImprison' || type === 'executeCaptive') {
    const id = action.characterId, captive = state.captives[id];
    const owned = !captive && own(state.characters, id) && state.characterOwners[id] === state.playerId && id !== state.activeHeroId && !Object.values(c.flights).some(f => f.pilotIds.includes(id));
    requireThat(action.confirm === true && (captive?.captorId === state.playerId || owned) && !c.prison[id], C.prisonInvalid);
    const fromFactionId = captive ? captive.originalFactionId : (state.characters[id]?.group || null);
    c.prison[id] = { turn: state.turn, originalFactionId: fromFactionId, captorId: state.playerId };
    delete state.captives[id]; state.characterOwners[id] = null;
    state.recruitedHeroIds = state.recruitedHeroIds.filter(who => who !== id);
    leaveOffices(state, id);
    if (c.duties) delete c.duties[id];
    for (const [nation, who] of Object.entries(state.envoys)) if (who === id) delete state.envoys[nation];
    for (const [key, list] of Object.entries(c.airportGuests)) { c.airportGuests[key] = list.filter(who => who !== id); if (!c.airportGuests[key].length) delete c.airportGuests[key]; }
    for (const tile of Object.values(state.tiles)) { tile.garrison = tile.garrison.filter(who => who !== id); tile.field = tile.field.filter(who => who !== id); }
    for (const city of Object.values(c.cities)) if (city.mayorId === id) city.mayorId = null;
    state.history = [];
    const feudTargets = feudFactionsForCharacter(state, id, fromFactionId, state.playerId);
    const feudReason = `${state.factions[state.playerId].name}将${state.characters[id].name}处决关入肖申克监狱，此仇不死不休！`;
    for (const fid of feudTargets) enforceBloodFeudWar(state, fid, feudReason);
    normalizeParty(state);
    log(state, say('prisonDone', { name: state.characters[id].name }), 'character');
    recordChronicle(state, say('prisonDone', { name: state.characters[id].name }), 'capture', fromFactionId || state.playerId, [state.playerId, fromFactionId]);
    return { characterId: id, permanent: true, feudFactions: feudTargets };
  }
  if (type === 'buildCanal') {
    const quote = canalQuote(state, action.key);
    requireThat(quote.enabled, quote.reason); pay(state, quote.cost);
    const name = typeof action.name === 'string' && action.name.trim() ? action.name.trim().slice(0, 32) : quote.name;
    c.canals ||= {};
    c.canals[action.key] = { key: action.key, name, status: 'building', remaining: quote.turns, ownerId: state.playerId, builtTurn: state.turn };
    log(state, say('canalStarted', { name, turns: quote.turns }), 'build');
    return { canal: c.canals[action.key], cost: quote.cost };
  }
  if (type === 'roadRoute') {
    const quote = roadRouteQuote(state, action.fromKey, action.toKey);
    requireThat(quote.enabled, quote.reason); pay(state, quote.cost);
    for (const key of quote.keys) state.tiles[key].road = true;
    log(state, say('roadDone', { count: quote.keys.length, gold: quote.cost.gold }), 'build');
    return quote;
  }
  if (type === 'setArmyMode' || type === 'setArmyObjective' || type === 'cancelArmyObjective') {
    const key = action.fromKey || action.key, tile = playerTile(state, key);
    const record = c.armies[key] ||= { mode: 'main', travel: 'land', ships: 0, planes: 0 };
    if (type === 'setArmyMode') {
      requireThat(['main', 'free'].includes(action.mode), C.invalidAction); record.mode = action.mode;
      record.strategy = action.strategy === 'open' ? 'open' : 'capital'; record.enemyId = state.factions[action.enemyId]?.alive ? action.enemyId : null;
      return { key, mode: record.mode };
    }
    if (type === 'cancelArmyObjective') { delete record.goal; return { key }; }
    requireThat(Array.isArray(action.girls) && action.girls.every(id => tile.field.includes(id)) && integer(action.troops, action.girls.length ? 0 : 1, Math.max(0, tile.troops - marchGuard(tile))), C.invalidAction);
    requireThat(action.girls.every(id => !mayorCity(state, id)), C.mayorBusy);
    const quote = routeQuote(state, key, action.toKey, action);
    requireThat(quote.enabled, quote.reason);
    requireThat(!militaryMoveReason(state, key, key, action.troops), militaryMoveReason(state, key, key, action.troops));
    dropOrdersFor(state, key, action.girls);
    record.goal = { toKey: action.toKey, girls: [...action.girls], troops: action.troops, waypoints: [...(action.waypoints || [])], issuedTurn: state.turn };
    log(state, say('objectiveDone', { key: action.toKey }), 'army');
    return { key, goal: record.goal };
  }
  if (type === 'occupationChoice') {
    const occupation = c.occupations.find(o => o.factionId === action.factionId), faction = state.factions[action.factionId];
    requireThat(occupation && occupation.turn === state.turn && !faction.alive, C.invalidAction);
    requireThat(['annex', 'vassal'].includes(action.choice), C.invalidAction);
    if (action.choice === 'vassal') {
      const members = occupation.members.filter(id => state.characterOwners[id] === null && !state.captives[id] && !c.prison[id]);
      requireThat(members.length, C.leaderLast);
      const keys = occupation.keys.filter(key => state.tiles[key]?.ownerId === state.playerId);
      requireThat(keys.includes(occupation.capitalKey), C.invalidAction);
      const home = state.tiles[occupation.capitalKey], relocated = [];
      // The victorious main army returns to nearby own land before restoring the subject capital.
      for (const key of keys) for (const id of girlsOn(state.tiles[key]).filter(id => state.characterOwners[id] === state.playerId)) relocated.push(id);
      const refuge = factionTiles(state, state.playerId).find(t => !keys.includes(t.key) && t.isCapital) || factionTiles(state, state.playerId).find(t => !keys.includes(t.key));
      requireThat(refuge || !relocated.length, C.invalidAction);
      for (const key of keys) {
        const tile = state.tiles[key]; tile.field = []; tile.garrison = []; tile.ownerId = faction.id; tile.acquiredTurn = state.turn; tile.militaryReserve = true;
        if (c.cities[key]) delete c.cities[key];
      }
      if (refuge) refuge.field.push(...new Set(relocated));
      faction.leaderId = members.includes(faction.leaderId) ? faction.leaderId : members[0]; faction.liberty = 25;
      chooseCapital(state, faction.id, home);
      for (const id of members) { state.characterOwners[id] = faction.id; seatAtHome(state, id); }
      endWar(state, state.playerId, faction.id, 'vassal', 0);
      cleanCampaignAssignments(state); normalizeParty(state);
    }
    c.occupations = c.occupations.filter(o => o !== occupation);
    return { factionId: faction.id, choice: action.choice };
  }
  if (type === 'requisitionLeader') {
    const faction = state.factions[action.factionId];
    const quote = getVassalCharacterQuote(state, action.factionId, action.characterId);
    requireThat(quote.enabled, quote.reason);
    const members = quote.candidates, id = quote.characterId;
    pay(state, quote.cost); leaveOffices(state, id);
    for (const tile of Object.values(state.tiles)) { tile.field = tile.field.filter(who => who !== id); tile.garrison = tile.garrison.filter(who => who !== id); }
    state.characterOwners[id] = state.playerId; state.recruitedHeroIds.push(id); ensureGrowth(state, id).joined = state.turn;
    if (faction.leaderId === id) faction.leaderId = members.find(who => who !== id);
    faction.liberty = Math.min(100, (faction.liberty || 0) + 25);
    seatAtHome(state, id); normalizeParty(state);
    return { characterId: id, liberty: faction.liberty };
  }
  return undefined;
}
function tickCampaign(state) {
  const c = state.campaign;
  cleanCampaignAssignments(state);
  tickTreaties(state);
  for (const faction of Object.values(state.factions).filter(f => f.alive)) {
    economyTick(state, faction.id);
    const record = c.research[faction.id];
    if (record.active && --record.active.remaining <= 0) {
      const id = record.active.id; record.known.push(id); record.active = null;
      if (faction.isPlayer) notice(state, 'world', say('researchDone', { name: TECHNOLOGIES.find(t => t.id === id).name }));
    }
    // 排队研究: the next one starts by itself once it is affordable; it pays gold, never commands.
    if (!record.active && record.queue?.length) {
      record.queue = record.queue.filter(id => !record.known.includes(id));
      // A queue saved before the tree was redrawn can name a tech whose new prerequisite is missing: learn that first.
      const order = [], seen = new Set(record.known), visit = techId => { if (seen.has(techId) || !techById(techId)) return; seen.add(techId); for (const p of techById(techId).prerequisites) visit(p); order.push(techId); };
      record.queue.forEach(visit); record.queue = order;
      const next = techById(record.queue[0]);
      if (next && next.prerequisites.every(p => record.known.includes(p))) {
        const quote = researchQuote(state, next.id, faction.id), price = { ap: 0, gold: quote.cost.gold, supply: 0 };
        if (faction.gold >= price.gold) {
          pay(state, price, faction.id, false); record.active = { id: next.id, remaining: quote.turns }; record.queue.shift();
          if (faction.isPlayer) notice(state, 'world', say('researchStarted', { name: next.name, turns: quote.turns }));
        }
      } else if (!next) record.queue = [];
      if (!record.queue.length) delete record.queue;
    }
    if (!faction.isPlayer && !record.active && faction.gold >= 50) {
      // Each nation leans toward the branches that suit it, cheapest first, with a seeded nudge so neighbours differ.
      const lean = { builder: ['industry', 'agri'], aggressive: ['military', 'industry'], balanced: ['econ', 'civic'] }[faction.personality] || ['econ', 'agri'];
      const choices = TECHNOLOGIES.map(t => researchQuote(state, t.id, faction.id)).filter(q => q.enabled && faction.gold >= q.cost.gold + 25);
      const score = q => q.tier * 10 - (lean.includes(q.branch) ? 8 : 0) + hash(state.seed, faction.id, q.id, 'npc-research') * 6;
      const quote = choices.sort((a, b) => score(a) - score(b))[0];
      if (quote) { pay(state, quote.cost, faction.id, false); record.active = { id: quote.id, remaining: quote.turns }; }
    }
    // 星光大舞台: met nations warm up a little every turn, up to +30.
    if (faction.isPlayer && techEffect(state, 'favorDrift', faction.id) > 0) for (const other of Object.values(state.factions)) {
      if (!other.alive || other.isPlayer) continue;
      const rel = relationOf(state, faction.id, other.id);
      if (rel.met !== false && rel.status !== 'war' && rel.favor < 30) changeFavor(state, faction.id, other.id, 1, '星光大舞台');
    }
    if (isVassal(state, faction.id)) {
      const rel = relationOf(state, state.playerId, faction.id), me = state.factions[state.playerId], theirs = factionTiles(state, faction.id).length, ours = factionTiles(state, state.playerId).length;
      const pressure = (faction.gold < 5 ? 1 : 0) + (rel.favor < 0 ? 1 : 0) + (theirs > ours * .6 ? 1 : 0);
      faction.liberty = Math.max(0, Math.min(100, (faction.liberty || 0) + pressure - (rel.favor >= 40 ? 1 : 0) - (state.envoys[faction.id] ? 1 : 0) + Math.round(techEffect(state, 'vassalLiberty', state.playerId))));
      if (faction.liberty >= 90 && theirs >= Math.max(2, ours * .4) && state.turn - rel.since > 12) {
        endWar(state, state.playerId, faction.id, 'neutral', 0); changeFavor(state, state.playerId, faction.id, -25, C.liberty);
        delete c.integrations[faction.id]; notice(state, 'nation', `${faction.name} · ${C.liberty} 100%`);
      }
    }
  }
  for (const city of Object.values(c.cities)) {
    const tile = state.tiles[city.key], growth = city.mayorId ? state.growth[city.mayorId] : null, owner = state.factions[city.ownerId];
    const capital = state.tiles[owner.capitalKey], far = capital ? hexDistance(tile, capital) : 0, bonded = growth?.bond === 100;
    if (growth && far > 6 && (state.turn - city.foundedTurn) > 0 && (state.turn - city.foundedTurn) % 8 === 0) growth.bond = Math.max(0, growth.bond - 1);
    const foreignProsperity = Math.max(0, ...Object.values(state.factions).filter(f => f.alive && f.id !== city.ownerId).map(f => f.gold / Math.max(1, factionTiles(state, f.id).length)));
    const prosperity = owner.gold / Math.max(1, factionTiles(state, city.ownerId).length);
    const unrest = (state.campaign.economies[city.ownerId]?.inflation || 0) > 20 ? 1 : 0;
    const pressure = !city.mayorId ? 3 : bonded ? -5 : (foreignProsperity > prosperity * 1.5 + 15 ? 1 : 0) + (growth.bond < 40 ? 1 : -1) + (controlAt(state, tile).percent < 45 ? 1 : 0) + unrest + Math.round(techEffect(state, 'cityLiberty', city.ownerId));
    const wonder=state.tiles[owner.wonderKey],civicRelief=wonder?.ownerId===city.ownerId&&wonder.building==='wonder'&&wonder.cutSince===undefined?1:0;
    city.liberty = Math.max(0, Math.min(100, city.liberty + pressure-civicRelief));
    if (!bonded && city.liberty >= 95 && city.mayorId && !tile.isCapital && state.turn - city.foundedTurn > 20) {
      const id = `city.${city.key.replace(',', ':')}.${city.foundedTurn}`, mayor = city.mayorId;
      const district = factionTiles(state, city.ownerId).filter(t => !t.isCapital && hexDistance(t, tile) <= 1 && !Object.values(c.cities).some(other => other.key === t.key && other !== city));
      const definition = { id, name: city.name, leaderId: mayor, color: state.characters[mayor].color, personality: 'builder', isPlayer: false, alive: true, gold: 10, supply: 10, capitalKey: city.key, capitalHistory: [], capitalMoves: 0, defeats: 0, revivals: 0, foundedTurn: state.turn, graceUntilTurn: state.turn + 2 };
      if (Object.keys(state.factions).length < 100) {
        state.factions[id] = definition;
        for (const t of district) { t.ownerId = id; t.field = t.field.filter(who => who === mayor); t.garrison = t.garrison.filter(who => who === mayor); }
        state.characterOwners[mayor] = id; state.recruitedHeroIds = state.recruitedHeroIds.filter(who => who !== mayor); city.ownerId = id; city.liberty = 0;
        chooseCapital(state, id, tile); migrateCampaign(state); syncGarrisons(state);
        notice(state, 'nation', `${city.name} · ${C.liberty} 100%`);
      }
    }
    if (city.mayorId && state.turn % CIVIC_RULES.cityExpansionEvery === city.foundedTurn % CIVIC_RULES.cityExpansionEvery) autoCityExpand(state, city);
  }
  for (const canal of Object.values(c.canals || {})) {
    const tile = state.tiles[canal.key];
    canal.ownerId = tile?.ownerId || null;
    if (canal.status === 'building' && tile?.ownerId && tile.cutSince === undefined && --canal.remaining <= 0) {
      canal.status = 'open'; canal.remaining = 0; canal.builtTurn = state.turn;
      if (tile.ownerId === state.playerId) { revealArea(state, tile.q, tile.r, 1); notice(state, 'world', say('canalDone', { name: canal.name }), { key: canal.key }); }
      recordChronicle(state, `${state.factions[tile.ownerId].name}凿通了${canal.name}（${canal.key}），两侧海域自此贯通。`, 'build', tile.ownerId);
    }
  }
  for (const [id, job] of Object.entries(c.integrations)) {
    const quote = annexConditions(state, id);
    if (!quote.enabled || state.factions[state.playerId].gold < quote.upkeep || state.ap < 1) continue;
    pay(state, { ap: 1, gold: quote.upkeep }); job.progress++;
    if (job.progress >= job.total) finishIntegration(state, id);
  }
  c.occupations = c.occupations.filter(o => o.turn === state.turn && !state.factions[o.factionId]?.alive);
}
function autoCityExpand(state, city) {
  const owner = state.factions[city.ownerId];
  if (!owner?.alive || !city.mayorId) return;
  const region = factionTiles(state, city.ownerId).filter(t => hexDistance(t, state.tiles[city.key]) <= 3);
  for (const from of region.sort((a, b) => b.troops - a.troops)) {
    if (from.troops < MIN_SOURCE) continue;
    const to = neighbors(from).map(p => state.tiles[p.key]).find(t => t?.discovered && !t.ownerId && state.terrainTypes[t.terrainId].passable && hexDistance(t, state.tiles[city.key]) <= 4);
    if (!to) continue;
    const cost = claimCost(state, city.ownerId);
    if (owner.gold < cost.gold + 20 || owner.supply < cost.supply + 10) return;
    pay(state, cost, city.ownerId, false); settle(to, from, city.ownerId); to.acquiredTurn = state.turn;
    if (city.ownerId === state.playerId) creditTerritory(state, to);
    return;
  }
}
function runCampaignOrders(state) {
  if (state.battle) return;
  for (const [startKey, initial] of Object.entries({ ...state.campaign.armies })) {
    let record = initial, from = state.tiles[startKey];
    if (!record.goal && record.mode === 'free' && record.enemyId && from?.ownerId === state.playerId && atWar(state, state.playerId, record.enemyId)) {
      const goals = factionTiles(state, record.enemyId).filter(t => t.discovered && (record.strategy !== 'open' || !t.isCapital && !t.building && !getRegularGuard(state,t.key) && !armyOf(state,t).length));
      goals.sort((a, b) => record.strategy === 'open' ? hexDistance(from, a) - hexDistance(from, b) : Number(b.isCapital) - Number(a.isCapital) || hexDistance(from, a) - hexDistance(from, b));
      const target = goals.find(t => campaignRoute(state, startKey, t.key, { girls: from.field, troops: Math.max(0, from.troops - handsNeeded(from)) }));
      if (target) record.goal = { toKey: target.key, girls: [...from.field], troops: Math.max(0, from.troops - handsNeeded(from)), waypoints: [], issuedTurn: state.turn };
    }
    const goal = record.goal;
    if (!goal || from?.ownerId !== state.playerId || from.marchedTurn === state.turn) continue;
    const girls = goal.girls.filter(id => from.field.includes(id) && canServe(state, id, state.playerId));
    const troops = Math.max(0, Math.min(goal.troops, from.troops - marchGuard(from))), profile = armyProfile(state, from.key, girls, troops);
    if (!girls.length && !troops || !profile.capable) continue;
    const waypoints = goal.waypoints.filter(key => key !== from.key);
    let route = campaignRoute(state, from.key, goal.toKey, { girls, troops, waypoints });
    if (route) delete goal.blocked;
    else {
      // A planned order through land not yet open to us: walk to the edge and wait there until it is claimed or war is declared.
      const plan = profile.travel === 'land' ? planPath(state, from.key, goal.toKey, waypoints) : null, stop = plan ? planBlocker(state, state.playerId, plan.path) : null;
      goal.blocked = stop?.text || C.objectiveInvalid;
      if (!stop || stop.reach.length < 2) continue;
      route = { path: stop.reach };
    }
    let remaining = profile.speed, currentKey = from.key;
    for (const key of route.path.slice(1)) {
      const to = state.tiles[key], step = profile.travel === 'air' || profile.travel === 'sea' && to.terrainId === 'ocean' ? 1 : marchCost(state, to);
      if (step > remaining || state.factions[state.playerId].supply < 1) break;
      if (to.ownerId && to.ownerId !== state.playerId) {
        if (peaceReason(state,state.playerId,to.ownerId) || state.ap < 2 || from.foughtTurn === state.turn) break;
        const result = resolveBattle(state, from.key, to.key, troops, state.playerId, true, girls);
        if (state.battle) return;
        if (!result.won && !result.occupied || to.ownerId !== state.playerId) break;
        currentKey = to.key; break;
      }
      const room = supplyRoom(state, to, girls.length);
      if (room < troops || !to.ownerId && to.terrainId !== 'ocean' && troops < 1) { goal.blocked = C.vehicleCapacity; break; }
      if (!to.ownerId) { to.ownerId = state.playerId; to.acquiredTurn = state.turn; creditTerritory(state, to); }
      pay(state, { supply: 1 }, state.playerId, false);
      from.troops -= troops; to.troops += troops;
      from.field = from.field.filter(id => !girls.includes(id)); to.field.push(...girls);
      if (troops) mergeElite(to, from);
      if (from.foughtTurn === state.turn) to.foughtTurn = state.turn;
      to.marchedTurn = state.turn; remaining -= step; currentKey = to.key; from = to;
      if (goal.waypoints[0] === key) goal.waypoints.shift();
      if (key === goal.toKey || remaining <= 0) break;
    }
    if (currentKey !== startKey) {
      const dest = state.campaign.armies[currentKey];
      if (dest && dest !== record) { goal.blocked = C.vehicleCapacity; continue; }
      delete state.campaign.armies[startKey]; state.campaign.armies[currentKey] = record;
      goal.girls = girls; goal.troops = Math.min(troops, Math.max(0, state.tiles[currentKey].troops - 1));
    }
    if (currentKey === goal.toKey) { delete record.goal; notice(state, 'land', say('objectiveReached', { key: currentKey }), { key: currentKey }); }
  }
}

/* ---------------------------------------------------------------------------------------------
   Standing march orders (远行令) and musters (会师).
   A move reaches only what an army walks in one turn. A march order names any tile joined to the
   army by the player's own land: the army takes the first day's walk at once and the rest at the
   start of each following turn, without being asked again. An order follows its girls, so moving
   or fighting with that army by hand does not lose the destination; an order for Sazai alone
   stays with the tile it stopped on. A muster gives every army such an order to one place.
   --------------------------------------------------------------------------------------------- */
const marchOrdersOf = state => Array.isArray(state.marchOrders) ? state.marchOrders : [];
/** Where an order's army is right now, and who of it is still marching. Null when nothing is left to move. */
function locateOrder(state, order) {
  if (order.girls.length) {
    for (const id of order.girls) {
      if (!canServe(state, id, state.playerId)) continue;
      const tile = stationOf(state, id);
      if (tile?.ownerId === state.playerId && tile.field.includes(id)) return { tile, girls: order.girls.filter(who => tile.field.includes(who) && canServe(state, who, state.playerId)) };
    }
    return null;
  }
  const tile = state.tiles[order.key];
  return tile?.ownerId === state.playerId ? { tile, girls: [] } : null;
}
/** The nights a route takes for one party: each stop is the farthest tile of the day that has room for everyone. */
function marchStops(state, route, budget, troops, girls = 0) {
  const stops = [];
  let start = 0;
  while (start < route.path.length - 1) {
    let spent = 0, reach = start, fit = -1;
    for (let i = start + 1; i < route.path.length; i++) {
      const tile = state.tiles[route.path[i]], step = marchCost(state, tile);
      if (spent + step > budget && spent > 0) break;
      spent += step; reach = i;
      if (supplyRoom(state, tile, girls) >= troops) fit = i;
    }
    start = fit > start ? fit : reach;
    stops.push(route.path[start]);
  }
  return stops;
}
/** Quote for marching an army to any own tile it can walk to. `direct` means one turn is enough. */
export function getMarchPlan(state, fromKey, toKey, selection = {}) {
  const from = state.tiles[fromKey], to = state.tiles[toKey];
  const girls = Array.isArray(selection.girls) ? (from?.field || []).filter(id => selection.girls.includes(id)) : [...(from?.field || [])];
  const troops = selection.troops === undefined ? Math.max(0, (from?.troops || 0) - marchGuard(from)) : selection.troops;
  const faction = state.factions[state.playerId];
  let reason = state.battle || state.turnContinuation ? '请先完成当前战场与战争阶段。'
    : from?.ownerId !== state.playerId || !to?.discovered || to.ownerId !== state.playerId ? '远行只能在自己的领土之间。'
    : fromKey === toKey ? '军队已经在这里了。'
    : !integer(troops, girls.length ? 0 : 1, from.bridgeId ? 100 : 99) || troops > from.troops - marchGuard(from) ? (from.bridgeId ? C.invalidAction : girls.length ? '出发地要留 1 名守军，带兵数不能超过剩下的人。' : '至少带 1 名罪袋或 1 位同伴，出发地还要留 1 名守军。')
    : militaryMoveReason(state, fromKey, toKey, troops);
  const budget = from ? marchBudgetOf(state, from, girls) : MARCH_BUDGET, supply = from ? marchSupplyOf(state, from, girls) : 1;
  const route = reason ? null : marchRoute(state, fromKey, toKey, state.playerId, budget);
  if (!reason && !route) reason = '两地之间没有连着的己方领土，走不过去。';
  const stops = route ? marchStops(state, route, budget, troops, girls.length) : [];
  const direct = stops.length === 1;
  const waiting = Boolean(route) && (from.marchedTurn === state.turn ? '这支军队本回合已经走过，下回合开始时出发。' : faction.supply < supply ? '补给不够今天的行军，等有粮了自动出发。' : '');
  const startsNow = Boolean(route) && !waiting, room = startsNow ? supplyRoom(state, state.tiles[stops[0]], girls.length) : 0;
  if (!reason && !waiting && Math.min(troops, room) < 1 && !girls.length) reason = `${stops[0]} 的补给已经满了，罪袋进不去。`;
  if (!reason && marchOrdersOf(state).filter(order => !(order.girls.some(id => girls.includes(id)) || (!order.girls.length && !girls.length && order.key === fromKey))).length >= MAX_MARCH_ORDERS && !direct) reason = `远行令最多 ${MAX_MARCH_ORDERS} 道，先取消几道。`;
  return { fromKey, toKey, girls, troops, budget, enabled: !reason, reason, waiting: waiting || '', startsNow, direct,
    path: route?.path || [], stops, turns: stops.length, arrivesTurn: route ? state.turn + stops.length - (startsNow ? 1 : 0) : null,
    firstStop: stops[0] || null, carriedNow: startsNow ? Math.min(troops, Math.max(0, room)) : 0, supplyPerDay: supply,
    cost: { ap: 0, gold: 0, supply: startsNow ? supply : 0 },
    action: { type: 'marchOrder', fromKey, toKey, troops, ...(Array.isArray(selection.girls) ? { girls } : {}) } };
}
/** Every standing order as the map and the army card show it: where it is, where it goes, how long. */
export function getMarchOrders(state) {
  const legacy = marchOrdersOf(state).map(order => {
    const at = locateOrder(state, order), to = state.tiles[order.toKey];
    if (!at || to?.ownerId !== state.playerId) return { ...order, girls: at?.girls || [], key: at?.tile.key || order.key, path: [], stops: [], turns: null, blocked: !at ? '这支队伍已经不在行军了。' : '目的地不在我方手里了。' };
    const budget = marchBudgetOf(state, at.tile, at.girls), route = at.tile.key === order.toKey ? { path: [order.toKey] } : marchRoute(state, at.tile.key, order.toKey, state.playerId, budget);
    const stops = route && route.path.length > 1 ? marchStops(state, route, budget, order.troops, order.girls.length) : [];
    return { ...order, key: at.tile.key, girls: at.girls, path: route?.path || [], stops, turns: route ? stops.length : null, arrivesTurn: route ? state.turn + stops.length : null, blocked: route ? '' : '去那里的路被切断了。' };
  });
  const campaign=Object.entries(state.campaign?.armies||{}).filter(([key,record])=>record.goal&&state.tiles[key]?.ownerId===state.playerId).map(([key,record])=>{
    const goal=record.goal,quote=routeQuote(state,key,goal.toKey,goal);
    return {...goal,id:`campaign:${key}`,key,path:quote.path||[],stops:[],turns:quote.turns||null,blocked:goal.blocked||quote.reason||''};
  });
  return [...legacy,...campaign];
}
function dropOrdersFor(state, key, girls) {
  state.marchOrders = marchOrdersOf(state).filter(order => !(order.girls.some(id => girls.includes(id)) || (!order.girls.length && !girls.length && order.key === key)));
  for(const [at,record] of Object.entries(state.campaign?.armies||{}))if(record.goal&&(record.goal.girls.some(id=>girls.includes(id))||!record.goal.girls.length&&!girls.length&&at===key))delete record.goal;
}
/** One day's walk of a standing order. Returns what happened, for the turn report. */
function stepOrder(state, order, at) {
  const from = at.tile, girls = at.girls, budget = marchBudgetOf(state, from, girls), supply = marchSupplyOf(state, from, girls), faction = state.factions[state.playerId];
  const route = marchRoute(state, from.key, order.toKey, state.playerId, budget);
  if (!route) return { cut: true };
  if (faction.supply < supply) return { hungry: true };
  let troops = Math.max(0, Math.min(order.troops, from.troops - marchGuard(from)));
  const stop = state.tiles[marchStops(state, route, budget, troops, girls.length)[0]];
  const carried = Math.max(0, Math.min(troops, supplyRoom(state, stop, girls.length)));
  if (!girls.length && carried < 1) return { full: stop.key };
  pay(state, { ap: 0, gold: 0, supply }, state.playerId, false);
  moveStack(state, from, stop, carried, girls, { elites: false, transit: true });
  // The rare squads that set out with this army keep walking with it; the ones that live here stay.
  const elite = { ...ELITE_ZERO, ...(order.elite || {}) }, moved = { R: 0, SR: 0, SSR: 0 };
  if (carried > 0) for (const rank of RARE_RANKS) {
    moved[rank] = Math.min(elite[rank], eliteOf(from)[rank], 99 - eliteOf(stop)[rank]);
    if (moved[rank]) { addElite(from, rank, -moved[rank]); addElite(stop, rank, moved[rank]); }
  }
  order.elite = moved; order.key = stop.key;
  const left = order.troops - carried; order.troops = carried;
  return { moved: true, stop: stop.key, arrived: stop.key === order.toKey, left };
}
/** Start of the player's turn: every standing order walks its next day. */
function runMarchOrders(state) {
  const orders = marchOrdersOf(state);
  if (!orders.length) return;
  const keep = [], arrived = [], trouble = [], name = order => order.girls.length ? `${state.characters[order.girls[0]]?.name || '编队'}${order.girls.length > 1 ? `等 ${order.girls.length} 位` : ''}` : `${order.troops} 名罪袋`;
  let hungry = 0;
  for (const order of orders) {
    const at = locateOrder(state, order), to = state.tiles[order.toKey];
    if (!at) continue; // Stationed, captured or gone: the order simply ends with the army.
    order.girls = order.girls.length ? at.girls : []; order.key = at.tile.key;
    if (to?.ownerId !== state.playerId) { trouble.push(`${name(order)}的远行取消：目的地 ${order.toKey} 已经不在我方手里。`); continue; }
    if (at.tile.key === order.toKey) continue;
    const step = stepOrder(state, order, at);
    if (step.cut) { trouble.push(`${name(order)}的远行取消：去 ${order.toKey} 的路被切断了。`); continue; }
    if (step.hungry) { hungry++; keep.push(order); continue; }
    if (step.full) { trouble.push(`${name(order)}被堵在 ${order.key}：前面的 ${step.full} 住满了，下回合再试。`); keep.push(order); continue; }
    if (step.left > 0) trouble.push(`${name(order)}经过的地块住不下，${step.left} 名罪袋留在了后面。`);
    if (step.arrived) arrived.push({ text: name(order), key: order.toKey });
    else if (order.girls.length || order.troops > 0) keep.push(order);
  }
  state.marchOrders = keep;
  if (arrived.length) {
    const places = [...new Set(arrived.map(item => item.key))];
    notice(state, 'land', `远行抵达：${arrived.map(item => item.text).join('、')}到了 ${places.join('、')}。`, { key: places[0] });
    log(state, `${arrived.length} 支远行的队伍抵达目的地。`, 'army');
  }
  if (hungry) trouble.push(`补给不够，${hungry} 支远行的队伍原地待命。`);
  if (trouble.length) notice(state, 'land', trouble.slice(0, 6).join(' '), keep[0] ? { key: keep[0].key } : {});
}
/** Gives the order and walks the first day at once when the army still can. */
function issueMarchOrder(state, action) {
  const plan = getMarchPlan(state, action.fromKey, action.toKey, { troops: action.troops, girls: action.girls });
  requireThat(plan.enabled, plan.reason);
  const from = state.tiles[plan.fromKey];
  dropOrdersFor(state, plan.fromKey, plan.girls);
  let key = plan.fromKey, carried = plan.troops, elite = { ...ELITE_ZERO }, movedNow = false;
  if (plan.startsNow) {
    const stop = state.tiles[plan.firstStop];
    carried = plan.carriedNow;
    pay(state, plan.cost);
    const transfer = moveStack(state, from, stop, carried, plan.girls, { transit: true });
    elite = { ...ELITE_ZERO, ...transfer.moved }; key = stop.key; movedNow = true;
  } else if (plan.troops > 0) {
    // Not walking today: the rare squads that will go are the ones a move from here would take.
    elite = { ...ELITE_ZERO, ...eliteTransferPlan(from, state.tiles[plan.firstStop], true).moved };
  }
  const arrived = key === plan.toKey;
  let order = null;
  if (!arrived) {
    state.orderSeq = (state.orderSeq || 0) + 1;
    order = { id: state.orderSeq, key, toKey: plan.toKey, girls: [...plan.girls], troops: carried, elite, turn: state.turn };
    state.marchOrders = [...marchOrdersOf(state), order];
  }
  return { fromKey: plan.fromKey, toKey: plan.toKey, key, girls: plan.girls, troops: carried, movedNow, arrived, turns: plan.turns, arrivesTurn: plan.arrivesTurn, orderId: order?.id || null, left: plan.troops - carried };
}
/** A muster (会师): every army, and if asked the spare Sazai of the realm, set out for one tile.
 * Armies keep the people their tiles need (`troops: 'safe'`), or bring nobody (`'none'`). Pure quote. */
export function getMusterPlan(state, toKey, options = {}) {
  const target = state.tiles[toKey], mode = options.troops === undefined ? 'safe' : options.troops, wanted = Array.isArray(options.sources) ? new Set(options.sources) : null;
  let reason = state.battle || state.turnContinuation ? '请先完成当前战场与战争阶段。'
    : !target?.discovered || target.ownerId !== state.playerId ? '会师地点要选自己的地块。'
    : target.cutSince !== undefined ? '那里和首都失联，没法会师。'
    : !['safe', 'none'].includes(mode) ? '请选择带上富余罪袋，或只让同伴动身。' : '';
  const armies = [], spare = [], skipped = [];
  // The meeting place feeds more as the girls arrive: each party is quoted the room its own baggage brings.
  let coming = 0, led = 0;
  const roomFor = girls => target ? Math.max(0, supplyLimit(state, target, new Set(girlsOn(target)).size + led + girls) - target.troops - coming) : 0;
  if (!reason) {
    const keepOf = tile => { const fort = fortStatus(state, tile); return Math.max(1, handsNeeded(tile), fort && !fort.mothballed ? FORT_GARRISON : 0); };
    const tiles = factionTiles(state, state.playerId).filter(tile => tile.key !== toKey && tile.cutSince === undefined && (!wanted || wanted.has(tile.key)));
    const quote = (tile, girls, want) => {
      let troops = Math.max(0, Math.min(want, roomFor(girls.length)));
      let plan = getMarchPlan(state, tile.key, toKey, { troops, girls });
      // Reserve soldiers may not join a garrison on duty: the girls still answer the call on their own.
      if (!plan.enabled && troops > 0 && girls.length) { troops = 0; plan = getMarchPlan(state, tile.key, toKey, { troops, girls }); }
      return plan;
    };
    for (const tile of tiles.filter(item => item.field.length).sort((a, b) => b.field.length - a.field.length || b.troops - a.troops || a.key.localeCompare(b.key))) {
      const plan = quote(tile, tile.field, mode === 'safe' ? tile.troops - keepOf(tile) : 0);
      if (!plan.enabled) { skipped.push({ fromKey: tile.key, girls: [...tile.field], reason: plan.reason }); continue; }
      coming += plan.troops; led += plan.girls.length; armies.push(plan);
    }
    if (options.spare) for (const tile of tiles.filter(item => !item.field.length && item.troops - keepOf(item) >= MUSTER_SPARE_MIN).sort((a, b) => (b.troops - keepOf(b)) - (a.troops - keepOf(a)) || a.key.localeCompare(b.key)).slice(0, MUSTER_SPARE_SOURCES)) {
      if (roomFor(0) < 1) break;
      const plan = quote(tile, [], tile.troops - keepOf(tile));
      if (!plan.enabled || plan.troops < 1) continue;
      coming += plan.troops; spare.push(plan);
    }
    if (!armies.length && !spare.length) reason = skipped[0]?.reason || '没有可以动身的编队：都已经在这里，或者走不过来。';
  }
  const all = [...armies, ...spare];
  return { toKey, mode, spare: Boolean(options.spare), enabled: !reason, reason, armies, spareSources: spare, skipped,
    girls: armies.reduce((sum, plan) => sum + plan.girls.length, 0), troops: all.reduce((sum, plan) => sum + plan.troops, 0),
    lastTurn: all.length ? Math.max(...all.map(plan => plan.arrivesTurn)) : null, arriveNow: all.filter(plan => plan.direct && plan.startsNow).length,
    cost: { ap: 0, gold: 0, supply: all.reduce((sum, plan) => sum + plan.cost.supply, 0) },
    action: { type: 'muster', toKey, troops: mode, spare: Boolean(options.spare), ...(wanted ? { sources: [...wanted] } : {}) } };
}

/** Enacting an edict: one command and a fee that grows with the realm, one change a turn. Repealing is free. */
export function getEdictQuote(state, id, replace = null) {
  const edict = EDICTS.find(item => item.id === id), active = state.edicts || [], slots = edictSlots(state);
  const cost = { ap: 2, gold: Math.ceil(24 * Math.sqrt(realmScale(state, state.playerId))), supply: 0 };
  const swap = replace && active.includes(replace) ? replace : null;
  const reason = state.battle || state.turnContinuation ? '请先完成当前战场与战争阶段。'
    : !edict ? '没有这条国策。' : active.includes(id) ? '这条国策已经在施行了。'
    : slots < 1 ? `第 ${EDICT_SLOTS[0]} 话起才能颁布国策。`
    : state.edictTurn === state.turn ? '这回合已经改过国策了，下回合再议。'
    : active.length >= slots && !swap ? (slots < EDICT_SLOTS.length ? `国策栏满了（${slots} 条）。先废止一条，或等第 ${EDICT_SLOTS[slots]} 话开下一栏。` : `国策栏满了（${slots} 条），先废止一条。`)
    : affordable(state, cost);
  return { id, name: edict?.name || '', desc: edict?.desc || '', replace: swap, slots, active: [...active], cost, enabled: !reason, reason, action: { type: 'enactEdict', id, ...(swap ? { replace: swap } : {}) } };
}
/** Gather ordinary reserves; important armies are sources only after explicit opt-in. */
export function getRallyPlan(state, key, amount, options = {}) {
  const target = state.tiles[key], capacity = target ? supplyRoom(state, target) : 0;
  const scope = options?.scope === undefined ? 'reserves' : options.scope;
  const requested = amount === undefined ? capacity : amount, sources = [], protectedSources = [], blockedSources = [];
  let reason = state.battle || state.turnContinuation ? '请先完成当前战场与战争阶段。'
    : target?.ownerId !== state.playerId ? '请选择己方集结地。'
    : target.cutSince !== undefined ? '失联地区无法集中补给。'
    : capacity < 1 ? `此地已经达到补给上限（${supplyLimit(state, target)} 人）。`
    : !integer(requested, 1, 100) ? '集结人数必须为 1 到 100。'
    : !['reserves', 'all-forces'].includes(scope) ? '请选择仅调后方预备兵，或明确允许主力与守军增援。' : '';
  let left = Math.min(capacity, requested), money = state.factions[state.playerId]?.supply || 0, canIncludeProtected = false;
  if (!reason) {
    const routes = marchSources(state, key), guards = new Map(getArmyProtectionSites(state).map(site => [site.key, site]));
    const candidates = Object.entries(routes).map(([sourceKey, route]) => ({ tile: state.tiles[sourceKey], route }))
      .filter(({tile}) => tile.cutSince === undefined && tile.marchedTurn !== state.turn && tile.foughtTurn !== state.turn)
      .map(({tile, route}) => {
        const fort = fortStatus(state, tile), guard = guards.get(tile.key);
        return { tile, keep: Math.max(1, handsNeeded(tile), fort && !fort.mothballed ? FORT_GARRISON : 0), route, militaryReason: militaryMoveReason(state, tile.key, key, 1),
          protectionCodes: guard?.protectionCodes || [], protectionReasons: guard?.protectionReasons || [] };
      })
      .filter(item => item.route !== undefined && item.tile.troops > item.keep)
      .sort((a, b) => (b.tile.troops - b.keep) - (a.tile.troops - a.keep) || a.route - b.route || a.tile.key.localeCompare(b.tile.key));
    for (const item of candidates) if (item.militaryReason) blockedSources.push({ fromKey: item.tile.key, troopsBefore: item.tile.troops, available: item.tile.troops - item.keep, reason: item.militaryReason });
    else if (item.protectionCodes.length) {
      canIncludeProtected = true;
      if (scope === 'reserves') protectedSources.push({ fromKey: item.tile.key, troopsBefore: item.tile.troops, troops: 0, remain: item.tile.troops,
        available: item.tile.troops - item.keep, route: item.route, protectionCodes: item.protectionCodes,
        protectionReasons: item.protectionReasons, reason: item.protectionReasons.join('；') });
    }
    for (const item of candidates) {
      if (left < 1 || sources.length >= 8 || sources.length >= money) break;
      if (item.militaryReason) continue;
      if (scope === 'reserves' && item.protectionCodes.length) continue;
      const troops = Math.min(left, item.tile.troops - item.keep);
      sources.push({ fromKey: item.tile.key, troopsBefore: item.tile.troops, troops, remain: item.tile.troops - troops, route: item.route,
        protectionCodes: item.protectionCodes, protectionReasons: item.protectionReasons, overridden: item.protectionCodes.length > 0 });
      left -= troops;
    }
    if (!sources.length) reason = money < 1 ? '至少需要 1 补给才能调动一支部队。' : blockedSources.length ? blockedSources[0].reason
      : protectedSources.length ? '附近富余兵员属于受保护的主力或守军；如需调动，请先查看预览并明确允许重要军队增援。'
      : '附近没有未行动的富余军士；会保留生产人手、要塞驻军、角色和稀有队伍。';
  }
  const troops = sources.reduce((sum, source) => sum + source.troops, 0);
  // The interface may open a non-executing preview to explain protected armies
  // even when the safe action is disabled. Only an explicit new scope can use them.
  const previewAvailable = !reason || blockedSources.length > 0 || protectedSources.length > 0 && money >= 1;
  return { key, scope, enabled: !reason, reason, previewAvailable, canIncludeProtected, sources, protectedSources, blockedSources,
    overriddenSources: sources.filter(source => source.overridden), troops, requested,
    shortfall: integer(requested, 1, 100) ? Math.max(0, Math.min(capacity, requested) - troops) : 0, cost: { ap: 0, gold: 0, supply: sources.length }, after: (target?.troops || 0) + troops,
    action: { type: 'rally', key, amount: requested, scope, expectedRevision: state.revision } };
}

/** Read-only staffing forecast; no rewards, history, RNG or action submission.
 * Copy the complete tile table so national authorities see the entire realm.
 * Only implicated tiles are mutable; rally carries no heroes or rare units. */
export function getStaffingQuote(state,key,kind){
  const tile=state.tiles[key],cost=recruitCost(state);
  let quote;
  if(kind==='rally')quote=getRallyPlan(state,key,Math.max(1,Math.min(100,handsNeeded(tile||{})-(tile?.troops||0))),{scope:'reserves'});
  else if(kind==='recruit'){
    const reason=state.battle||state.turnContinuation?'请先完成当前战场与战争阶段。'
      :!tile?.discovered||tile.ownerId!==state.playerId?'请选择己方地块。'
      :tile.cutSince!==undefined?'和首都失联':tile.troops>=housingOf(state,tile)?'住房满了'
      :tile.troops>=100?'军队已经达到上限。':affordable(state,cost);
    quote={enabled:!reason,reason,cost,action:{type:'recruit',key}};
  }else return {enabled:false,reason:'请选择征募或集结。'};
  if(!tile?.discovered||tile.ownerId!==state.playerId)return {...quote,enabled:false,reason:'请选择己方地块。'};
  if(!quote.enabled)return {...quote,delta:null};
  const projected={...state,tiles:{...state.tiles}};
  const affected=new Set([key,...(quote.sources||[]).map(source=>source.fromKey)]);
  for(const affectedKey of affected)projected.tiles[affectedKey]=clone(state.tiles[affectedKey]);
  if(kind==='rally')for(const source of quote.sources)moveStack(projected,projected.tiles[source.fromKey],projected.tiles[key],source.troops,[],{elites:false});
  else projected.tiles[key].troops+=recruitAmount(state,tile);
  const before=netIncome(state,state.playerId),after=netIncome(projected,state.playerId);
  return {...quote,before,after,afterResidents:projected.tiles[key].troops,delta:{gold:after.gold-before.gold,supply:after.supply-before.supply}};
}

export function getRoadQuote(state, key, factionId = state.playerId) {
  const tile = state.tiles[key], terrain = state.terrainTypes[tile?.terrainId];
  const cost = tile ? roadTileCost(state, tile, factionId) : { ap: 0, gold: 6, supply: 1 };
  const reason = state.battle || state.turnContinuation ? '请先完成当前战场与战争阶段。'
    : !tile?.discovered ? '请先探索此地。' : !walkable(state, tile) ? '湖泊无法修路。'
    : tile.road ? '这里已有道路。' : tile.ownerId && tile.ownerId !== factionId ? '只能在己方或无主地块修路。'
    : tile.ownerId === factionId && tile.cutSince !== undefined ? '与首都失联，不能动工。'
    : !tile.ownerId && !neighbors(tile).some(point => state.tiles[point.key]?.ownerId === factionId) ? '无主地块必须紧邻己方领土。'
    : affordable(state, cost, factionId, factionId === state.playerId);
  return { key, cost, enabled: !reason, reason, marchCost: 0.5, action: { type: 'road', key } };
}

/** Selected-fort planning only. The map-badge quote above remains unchanged.
 * An upgrade changes just this tile's level: residents, readiness, connectivity,
 * fort count and excess stay fixed. Pass one shallow tile to the same tile/fort
 * authorities; do not clone a world, execute an action, or simulate net income. */
export function getFortUpgradePreview(state, key) {
  const tile = state.tiles[key], level = tile?.buildingLevel || 1;
  if (tile?.ownerId !== state.playerId || tile.building !== 'fort' || level >= (BUILDINGS.fort.maxLevel || 5)) return null;
  const candidate = { ...tile, buildingLevel: level + 1 };
  const snapshot = current => {
    const stats = tileStats(state, current), fort = stats.fort, front = fort.profile.siege.cover;
    const nominalWall = { front, side: Math.floor(front / 2), rear: 0 };
    return { level: stats.buildingLevel, residents: current.troops, housing: stats.housing,
      production: tileProduction(state, current), mapDefense: stats.defense,
      deploymentCover: tacticalForceSummary({ defenseBonus: stats.defense }).cover,
      fort, readyTurn: current.fortReadyTurn ?? null, nominalWall,
      activeWall: fort.siegeReady ? { ...nominalWall } : { front: 0, side: 0, rear: 0 },
      nominalNeighborCover: fort.cover, activeNeighborCover: fort.operational ? fort.cover : 0 };
  };
  const before = snapshot(tile), after = snapshot(candidate), networkBefore = fortNetwork(state, tile.ownerId);
  // Only this active fort's upkeep changes; the surcharge on other forts is fixed.
  const networkAfter = { ...networkBefore, upkeep: {
    gold: networkBefore.upkeep.gold + after.fort.upkeep.gold - before.fort.upkeep.gold,
    supply: networkBefore.upkeep.supply + after.fort.upkeep.supply - before.fort.upkeep.supply,
  } };
  const nextStep = candidate.buildingLevel < (BUILDINGS.fort.maxLevel || 5) ? {
    level: candidate.buildingLevel, nextLevel: candidate.buildingLevel + 1,
    cost: improvementCost(state, candidate), requiredResidents: handsNeeded(candidate),
  } : null;
  let nextBreakpoint = null;
  // This is a nominal wall/support breakpoint, never a promise of active cover,
  // more protected neighbors, affordable purchases, or faster construction.
  if (after.nominalWall.front === before.nominalWall.front && after.nominalNeighborCover === before.nominalNeighborCover) {
    for (let next = candidate.buildingLevel + 1; next <= (BUILDINGS.fort.maxLevel || 5); next++) {
      const profile = fortLevelProfile(next);
      if (profile.siege.cover > after.nominalWall.front || profile.cover > after.nominalNeighborCover) {
        nextBreakpoint = { level: next, wallFront: profile.siege.cover, neighborCover: profile.cover };
        break;
      }
    }
  }
  return { kind: 'fort-upgrade', before, after, networkBefore, networkAfter, nextStep, nextBreakpoint,
    neighborRange: 1, deploymentUnchanged: before.deploymentCover === after.deploymentCover,
    productionFalls: after.production.gold < before.production.gold || after.production.supply < before.production.supply,
    nextFullProductionShortage: Math.max(0, after.production.need - after.residents) };
}

export function getActions(state, key, fromKey, selection = {}) {
  if (state.battle || state.turnContinuation) return [];
  const tile = state.tiles[key];
  if (!tile) return [];
  const descriptors = [];
  const add = (label, action, cost, reason = '') => {
    const error = reason || affordable(state, cost);
    const descriptor = { type: action.type, label, enabled: !error, reason: error, cost, action }; descriptors.push(descriptor); return descriptor;
  };
  if (!tile.discovered) {
    add('探索迷雾', { type: 'explore', key }, EXPLORE_COST, neighbors(tile).some(p => state.tiles[p.key]?.discovered) ? '' : '请从已探索区域边缘继续前进。');
    return descriptors;
  }
  if (isWater(tile) && !isBridge(state, tile)) {
    if (waterOwner(state, tile) !== state.playerId) {
      const quote = getWaterClaimQuote(state, key), claim = add(F.water_claim, quote.action, quote.cost, quote.reason);
      claim.effects = quote.effects;
    }
    return descriptors;
  }
  if (!tile.ownerId) {
    const source = migrationSource(state, tile), passable = walkable(state, tile), touching = neighbors(tile).some(p => state.tiles[p.key]?.ownerId === state.playerId && walkable(state, state.tiles[p.key]));
    const claim = add('开拓领土', { type: 'claim', key, fromKey: source?.key }, claimCost(state, state.playerId), !passable ? '湖泊无法驻军。' : !touching ? '需要与自己的领土相邻。' : !source ? `相邻地块要有 ${MIN_SOURCE} 人` : '');
    claim.effects = { fromKey: source?.key || null, migrants: source ? Math.min(MIGRANTS, 100 - tile.troops) : 0, housing: housingOf(state, tile) };
  }
  if ((!tile.ownerId || tile.ownerId === state.playerId) && !tile.road && walkable(state, tile)) {
    const quote = getRoadQuote(state, key); add('修筑道路 · 行军 0.5', quote.action, quote.cost, quote.reason);
  }
  if (tile.ownerId === state.playerId) {
    const assets = [...(tile.building ? [{ asset: 'building' }] : []), ...(tile.road ? [{ asset: 'road' }] : []), ...RARE_RANKS.filter(rank => tile.elite?.[rank] > 0).map(rank => ({ asset: 'elite', rank, amount: 1 }))];
    for (const asset of assets) { const quote = liquidationQuote(state, { type: 'liquidate', key, ...asset, expectedRevision: state.revision }, state.playerId, { detailed: false }); const entry = add('变卖资产', quote.action, quote.cost, quote.reason); entry.effects = quote; }
    const cut = tile.cutSince !== undefined, housing = housingOf(state, tile);
    const military = getMilitaryQuote(state, key, !militaryStatus(state, tile).reserve);
    const service = add(military.label, military.action, military.cost, military.reason); service.effects = military;
    const rally = getRallyPlan(state, key);
    const rallyAction = add(`就近集结${rally.troops ? ` +${rally.troops} 军士` : ''}`, rally.action, rally.cost, rally.reason); rallyAction.effects = { sources: rally.sources, troops: rally.troops, after: rally.after, protectedSources: rally.protectedSources, previewAvailable: rally.previewAvailable, canIncludeProtected: rally.canIncludeProtected, preserves: '首都、主力、同伴驻地、交战边防、未封存要塞；生产人手、角色与稀有队伍' };
    if (!tile.bridgeId) add(`征募 N 级罪袋 +${recruitAmount(state, tile)}`, { type: 'recruit', key }, recruitCost(state), cut ? '和首都失联' : tile.troops >= housing ? '住房满了' : tile.troops >= 100 ? '军队已经达到上限。' : '');
    for (const building of Object.values(BUILDINGS).filter(item => !item.emergency && canBuild(state, tile, item.id))) {
      const cost = constructionCost(state, tile, building.id);
      const replaced = BUILDINGS[tile.building]?.emergency ? { id: tile.building, name: BUILDINGS[tile.building].name, level: tile.buildingLevel || 1 } : null;
      const choice = add(replaced ? `改建${building.name} · 替换${replaced.name}` : `建造${building.name}`, { type: 'build', key, building: building.id }, cost, tile.building && !BUILDINGS[tile.building].emergency ? '此地已有建筑。' : cut ? '和首都失联' : tile.troops < MIN_BUILD ? `建造至少需要 ${MIN_BUILD} 人` : '');
      // Only local facts are added to the quote. Reuse the income authority on a
      // shallow candidate, without running an action or another world/economy copy.
      const candidate = { ...tile, building: building.id, buildingLevel: 1, fortMothballed: false, fortReadyTurn: state.turn + 1 };
      choice.effects = { replacedBuilding: replaced, building: { id: building.id, name: building.name, level: 1 },
        residents: tile.troops, constructionWorkers: MIN_BUILD, productionBefore: tileProduction(state, tile), productionAfter: tileProduction(state, candidate) };
      if (building.id === 'fort') {
        const after = { ...state, tiles: { ...state.tiles, [key]: candidate } };
        Object.assign(choice.effects, { upkeepBefore: fortNetwork(state, state.playerId).upkeep, upkeepAfter: fortNetwork(after, state.playerId).upkeep, garrison: FORT_GARRISON, readyTurn: state.turn + 1, cover: 1 });
      }
    }
    if (tile.building) {
      const quote = getUpgradeQuote(state, key);
      const upgrade = add(quote.label, quote.action, quote.cost, quote.reason);
      if (quote.effects) upgrade.effects = quote.effects;
      if (tile.building === 'fort') {
        const effects = getFortUpgradePreview(state, key);
        if (effects) upgrade.effects = effects;
      }
    }
    if (tile.building === 'fort') {
      const status = fortStatus(state, tile), mothball = !status.mothballed;
      add(mothball ? '封存要塞 · 停止维护' : '启用要塞 · 下回合整备完成', { type: 'fortMode', key, mothball }, mothball ? { ap: 0, gold: 0, supply: 0 } : { ap: 2, gold: 6, supply: 2 }, !mothball && cut ? '失联要塞无法重新整备。' : '');
    }
    add('遣散 1 名军士', { type: 'demobilize', key }, { ap: 0, gold: 0, supply: 0 }, tile.troops < 2 ? '必须保留至少 1 名居民。' : '');
    add('改作应急田圃', { type: 'emergencyFarm', key }, { ap: 1, gold: 0, supply: 0 }, tile.bridgeId ? F.bridge_no_build : tile.building === 'garden' ? '这里已经是应急田圃。' : cut ? '和首都失联' : tile.troops < 1 ? '至少需要 1 名居民。' : '');
    if (fromKey && fromKey !== key && state.tiles[fromKey]?.ownerId === state.playerId) {
      const from = state.tiles[fromKey];
      const selectedGirls = Array.isArray(selection.girls) ? from.field.filter(id => selection.girls.includes(id)) : from.field;
      const room = supplyRoom(state, tile, selectedGirls.length), moving = selection.troops ?? Math.max(0, Math.min(from.troops - marchGuard(from), room));
      const budget = marchBudgetOf(state, from, selectedGirls), reach = marchReach(state, fromKey, from.ownerId, budget);
      const reason = from.marchedTurn === state.turn ? '这支军队这回合走过了。' : from.troops < marchGuard(from) ? '出发地需留守 1 名军士，请先补充驻军。' : !own(reach, key) ? `目标超出 ${budget} 路程，只能穿过己方领土。` : moving === 0 && !selectedGirls.length ? '尚未选择出征军士或同伴。' : !integer(moving, selectedGirls.length ? 0 : 1, Math.max(0, from.troops - marchGuard(from))) ? '出发地需留守 1 名军士，请调整出征人数。' : moving > room ? `目标的补给只够再进 ${room} 人。` : '';
      const movement = add('调兵至此', { type: 'move', fromKey, toKey: key, troops: moving, ...(Array.isArray(selection.girls) ? { girls: selection.girls } : {}) }, { ap: 0, gold: 0, supply: marchSupplyOf(state, from, selectedGirls) }, reason || militaryMoveReason(state, fromKey, key, moving));
      movement.effects = { eliteTransfer: eliteTransferPlan(from, tile, moving > 0) };
    }
  } else if (tile.ownerId && fromKey) {
    const preview = previewAttack(state, fromKey, key, selection.troops, selection.girls);
    const chosen = { ...(selection.troops !== undefined ? { troops: selection.troops } : {}), ...(Array.isArray(selection.girls) ? { girls: state.tiles[fromKey]?.field.filter(id => selection.girls.includes(id)) || [] } : {}) };
    add('进入战棋战场', { type: 'attack', fromKey, toKey: key, ...chosen }, { ap: 2, gold: 0, supply: 2 }, preview.reason || preview.error || '');
    if (tile.building) add('劫掠建筑后撤回', { type: 'raid', fromKey, toKey: key, ...chosen }, { ap: 2, gold: 0, supply: 2 }, preview.reason || preview.error || '');
  }
  return descriptors;
}
const claimCost = (state, factionId) => { const gold = 4 + Math.floor(factionTiles(state, factionId).length / 4); return { ap: 2, gold: factionId === state.playerId && leadQuirk(state, 'q_pioneer') ? Math.ceil(gold / 2) : gold, supply: 2 }; };
export function getWaterClaimQuote(state, key) {
  const quote = waterClaimPlan(state, key, claimCost(state, state.playerId));
  const reason = state.battle || state.turnContinuation ? C.invalidAction : quote.reason || affordable(state, quote.cost);
  return { ...quote, enabled: !reason, reason };
}
export function getBridgeTargets(state, fromKey) {
  return [...bridgePlans(state, fromKey).keys()];
}
export function getBridgeQuote(state, fromKey, toKey) {
  const from = state.tiles[fromKey], factor = from?.ownerId === state.playerId ? constructionFactor(state, from) : 1;
  const quote = bridgePlan(state, fromKey, toKey, factor);
  const reason = state.battle || state.turnContinuation ? C.invalidAction : quote.reason || affordable(state, quote.cost);
  return { ...quote, enabled: !reason, reason };
}
function migrationSource(state, tile, fromKey) {
  const sources = neighbors(tile).map(point => state.tiles[point.key]).filter(item => item?.ownerId === state.playerId && walkable(state, item) && item.cutSince === undefined && item.troops >= MIN_SOURCE).sort((a, b) => b.troops - a.troops || a.key.localeCompare(b.key));
  return sources.find(item => item.key === fromKey) || sources[0] || null;
}
/** Own tiles the army on this tile reaches this turn. `girls` narrows it to the part that would go. */
export const getMarch = (state, key, girls) => { const tile = state.tiles[key]; return marchReach(state, key, tile?.ownerId, marchBudgetOf(state, tile, Array.isArray(girls) ? (tile?.field || []).filter(id => girls.includes(id)) : tile?.field)); };
export const getMarchBudget = (state, key, girls) => { const tile = state.tiles[key]; return marchBudgetOf(state, tile, Array.isArray(girls) ? (tile?.field || []).filter(id => girls.includes(id)) : tile?.field); };

export function serializeGame(state) {
  let serialized = JSON.stringify(state, null, 2);
  if (serialized.length <= 20000000) return serialized;
  // Formatting must not discard a full undo trail that fits the input character budget.
  serialized = JSON.stringify(state);
  if (serialized.length <= 20000000) return serialized;
  // Only a genuinely oversized full save uses the existing explicit history fallback.
  return JSON.stringify({ ...state, history: [], historyTrimmed: true });
}
function migrateLongTerm(state, withHistory = true) {
  if (!isObject(state) || state.schemaVersion !== 1) return state;
  requireThat(state.rulesVersion === undefined || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(state.rulesVersion), '不支持这个规则版本。');
  for (const field of ['tiles', 'factions', 'characters', 'terrainTypes']) requireThat(isObject(state[field]), `存档 ${field} 无效。`);
  const legacy = state.rulesVersion === undefined || state.rulesVersion === 1;
  const legacyRoles = ![8, 9].includes(state.rulesVersion);
  const legacyTactics = ![3, 4, 5, 6, 7, 8, 9].includes(state.rulesVersion), legacyLand = ![6, 7, 8, 9].includes(state.rulesVersion);
  migrateCampaign(state);
  state.rulesVersion = RULES_VERSION;
  state.management ||= { mode: 'off', reserve: 20 };
  // Fill absent legacy shelves only. Do not reset malformed current progress.
  if (legacyRoles) {
    if (state.growth === undefined) state.growth = {};
    if (isObject(state.growth)) for (const growth of Object.values(state.growth)) if (isObject(growth)) {
      for (const [field, value] of Object.entries(newGrowth(0))) if (!own(growth, field)) growth[field] = value;
    }
    if (state.talkTurn === undefined) state.talkTurn = 0;
    if (state.levelSeq === undefined) state.levelSeq = 0;
    if (state.levelLog === undefined) state.levelLog = [];
    if (state.customEvents === undefined) state.customEvents = [];
    if (state.notices === undefined) state.notices = [];
    if (state.inbox === undefined) state.inbox = [];
    if (state.arrivalQueue === undefined) state.arrivalQueue = [];
    if (state.noticeSeq === undefined) state.noticeSeq = Math.max(0, ...[...(Array.isArray(state.notices) ? state.notices : []), ...(Array.isArray(state.inbox) ? state.inbox : [])].map(item => Number.isSafeInteger(item?.id) && item.id > 0 ? item.id : 0));
  }
  state.pairs ||= {}; state.posts ||= Object.fromEntries(POSTS.map(post => [post.id, null])); state.arrivalIndex ??= 0;
  state.gachaCount ??= 0; state.storySeen ||= []; state.pendingEvent ??= null;
  if (['won', 'lost', 'playing'].includes(state.status)) state.status = 'playing';
  delete state.victoryType; delete state.sandbox;
  state.metrics ||= { land: 0, infrastructure: 0, wealth: 0, conquests: Array.isArray(state.capturedCapitalIds) ? state.capturedCapitalIds.length : 0 };
  state.milestone ||= { level: 1, completed: 0, baseline: { ...state.metrics } };
  state.chronicle ||= []; state.chronicleArchive ||= { entries: 0, firstTurn: 0, lastTurn: 0, byType: {} };
  state.exileCount ??= 0; state.lastWorldEventTurn ??= Math.floor(state.turn / 8) * 8;
  if (legacyTactics) {
    state.characterOwners = Object.fromEntries(Object.keys(state.characters).map(id => [id, null]));
    for (const faction of Object.values(state.factions)) if (isObject(faction) && own(state.characters, faction.leaderId)) state.characterOwners[faction.leaderId] = faction.id;
    for (const id of state.recruitedHeroIds || []) if (own(state.characters, id)) state.characterOwners[id] = state.playerId;
    state.captives = {}; state.battle = null; state.turnContinuation = null;
    state.companionId = (state.recruitedHeroIds || []).find(id => id !== state.activeHeroId && own(state.characters, id)) || null;
  }
  // Characters added in later versions simply turn up, unowned, in older worlds.
  for (const definition of CHARACTER_DEFINITIONS) if (!own(state.characters, definition.id)) { state.characters[definition.id] = clone(definition); if (isObject(state.characterOwners)) state.characterOwners[definition.id] = null; }
  for (const tile of Object.values(state.tiles)) if (isObject(tile) && tile.buildingLevel === undefined) tile.buildingLevel = tile.building ? 1 : 0;
  for (const faction of Object.values(state.factions)) if (isObject(faction)) {
    faction.capitalHistory ||= faction.capitalKey ? [faction.capitalKey] : [];
    faction.capitalMoves ??= 0; faction.defeats ??= 0; faction.revivals ??= 0; faction.foundedTurn ??= 1;
  }
  state.relations ||= {};
  for (const tile of Object.values(state.tiles)) if (isObject(tile)) { tile.garrison ||= []; tile.field ||= []; }
  if (legacyLand) {
    for (const [key, until] of Object.entries(state.truces || {})) if (until > state.turn) state.relations[key] = { status: 'truce', favor: 0, until, since: state.turn, trade: false, talkTurn: 0 };
    delete state.truces;
    for (const tile of Object.values(state.tiles)) if (isObject(tile)) { tile.food ??= 0; tile.garrison ||= []; }
    for (const faction of Object.values(state.factions)) if (isObject(faction)) {
      const home = state.tiles[faction.capitalKey];
      if (home && faction.sazai) for (const rank of RARE_RANKS) if (faction.sazai[rank]) addElite(home, rank, faction.sazai[rank]);
      delete faction.sazai;
    }
  }
  if (legacy && state.factions[state.playerId] && Array.isArray(state.logs) && Array.isArray(state.chronicle)) reconcileFactions(state, true);
  if (legacyTactics || legacyRoles) normalizeParty(state);
  if (legacyLand && isObject(state.characterOwners)) for (const id of [state.activeHeroId, ...Object.keys(state.characters)]) if (state.characterOwners[id]) seatAtHome(state, id);
  migrateCaptivity(state);
  if (withHistory && Array.isArray(state.history) && state.history.length <= 3) for (const snapshot of state.history) migrateLongTerm(snapshot, false);
  return state;
}
function menuRecordErrors(state) {
  const errors = [], noticeIds = new Set(), eventIds = new Set(STORY_EVENTS.map(event => event.id));
  const queuedCharacters = new Set(Object.keys(state.characters));
  if (state.arrivalQueue.length > MAX_ARRIVAL_QUEUE) errors.push('待登场国家数量超过容量。');
  else for (const [index, faction] of state.arrivalQueue.entries()) {
    if (!isObject(faction) || !validId(faction.id) || !validName(faction.name) || !validColor(faction.color) || !queuedCharacters.has(faction.leaderId)
      || (faction.personality !== undefined && !['aggressive', 'balanced', 'builder'].includes(faction.personality))) {
      errors.push(`待登场国家 ${index} 的定义或领袖引用无效。`); continue;
    }
    errors.push(...wandererErrors(faction, `待登场国家 ${index}`, queuedCharacters));
  }
  if (!integer(state.noticeSeq, 0, Number.MAX_SAFE_INTEGER)) errors.push('通知序号无效。');
  if (state.inbox.length > 2) errors.push('外交来信数量超过容量。');
  for (const item of state.inbox) {
    if (!isObject(item) || !integer(item.id, 1, state.noticeSeq) || !own(state.factions, item.from) || item.from === state.playerId || !['peace', 'pact', 'ally', 'trade', 'tribute'].includes(item.kind) || !integer(item.turn, 1, state.turn) || (item.kind === 'tribute' && !integer(item.gold, 1, Number.MAX_SAFE_INTEGER)) || (item.gold !== undefined && !integer(item.gold, 0, Number.MAX_SAFE_INTEGER)) || (item.pays !== undefined && (item.kind !== 'peace' || !integer(item.pays, 0, Number.MAX_SAFE_INTEGER)))) { errors.push('外交来信记录或国家引用无效。'); continue; }
    if (noticeIds.has(item.id)) errors.push('通知或外交来信编号重复。');
    noticeIds.add(item.id);
  }
  if (state.notices.length > 40) errors.push('通知记录数量超过容量。');
  for (const item of state.notices) {
    if (!isObject(item) || !integer(item.id, 1, state.noticeSeq) || !integer(item.turn, 1, state.turn) || !['land', 'nation', 'cut', 'war', 'world', 'jail', 'peace', 'era', 'character'].includes(item.kind) || typeof item.text !== 'string' || item.text.length > 10000 || (item.key !== undefined && !own(state.tiles, item.key)) || (item.factionId !== undefined && !own(state.factions, item.factionId)) || (item.line !== undefined && (!['declare', 'over'].includes(item.line) || !own(state.factions, item.factionId))) || (item.byId !== undefined && !own(state.factions, item.byId))) { errors.push('通知记录或目标引用无效。'); continue; }
    if (item.allyId !== undefined && (item.kind !== 'war' || item.line !== undefined || !own(state.factions, item.allyId) || !own(state.factions, item.factionId) || [state.playerId, item.factionId].includes(item.allyId) || item.factionId === state.playerId)) errors.push('同盟参战通知的国家引用无效。');
    if (item.fiscalTurn !== undefined && (item.kind !== 'land' || !integer(item.fiscalTurn, 1, state.turn))) errors.push('财政通知回合无效。');
    if (item.militarySites !== undefined && (item.kind !== 'land' || !Array.isArray(item.militarySites) || item.militarySites.length < 1 || item.militarySites.length > MAX_TILES || item.militarySites.some(key => !own(state.tiles, key)) || new Set(item.militarySites).size !== item.militarySites.length)) errors.push('军费止损通知的驻地列表无效。');
    if (noticeIds.has(item.id)) errors.push('通知或外交来信编号重复。');
    noticeIds.add(item.id);
  }
  if (state.customEvents.length > MAX_CUSTOM_EVENTS) errors.push('自定义事件数量超过容量。');
  else {
    const characters = new Set(Object.keys(state.characters));
    for (const [index, event] of state.customEvents.entries()) {
      errors.push(...storyEventErrors(event, `自定义事件 ${index}`, characters));
      if (isObject(event) && validId(event.id)) {
        if (eventIds.has(event.id)) errors.push('自定义事件编号重复。');
        eventIds.add(event.id);
      }
    }
  }
  if (state.pendingEvent !== null && !eventIds.has(state.pendingEvent)) errors.push('待处理事件引用无效。');
  return errors;
}
function growthErrors(state) {
  const errors = [], statIds = new Set(STATS.map(stat => stat.id));
  if (!integer(state.talkTurn, 0, state.turn) || !integer(state.levelSeq, 0, Number.MAX_SAFE_INTEGER)) errors.push('角色交谈或成长序号无效。');
  if (state.levelLog.length > 30 || state.levelLog.some(item => !isObject(item) || !own(state.characters, item.id) || !integer(item.seq, 1, state.levelSeq) || !integer(item.level, 2, MAX_LEVEL) || !Array.isArray(item.gains) || item.gains.length > STATS.length || item.gains.some(stat => !statIds.has(stat)) || new Set(item.gains).size !== item.gains.length || typeof item.perk !== 'boolean')) errors.push('角色升级提示记录无效。');
  for (const [id, growth] of Object.entries(state.growth)) {
    if (!validId(id) || !own(state.characters, id) || !isObject(growth)) { errors.push(`角色 ${id} 的成长记录无效。`); continue; }
    if (!integer(growth.level, 1, MAX_LEVEL) || !integer(growth.exp, 0, Number.MAX_SAFE_INTEGER) || !integer(growth.bond, 0, 100) || !integer(growth.spirit, 0, 100)) errors.push(`角色 ${id} 的等级、经验或状态无效。`);
    for (const [field, cap] of [['trained', trainCap(MAX_LEVEL, 100)], ['gains', MAX_LEVEL - 1]]) {
      if (!isObject(growth[field]) || Object.entries(growth[field]).some(([stat, value]) => !statIds.has(stat) || !integer(value, 0, cap))) errors.push(`角色 ${id} 的 ${field} 属性记录无效。`);
    }
    if (!Array.isArray(growth.perks) || growth.perks.length > PERK_LEVELS.length || growth.perks.some((perk, tier) => perk !== null && (typeof perk !== 'string' || growth.level < PERK_LEVELS[tier] || !perkChoices(state.characters[id]?.role, tier)?.some(choice => choice.id === perk)))) errors.push(`角色 ${id} 的技能选择记录无效。`);
    for (const field of ['battles', 'wins', 'kills', 'captured', 'rescued', 'trainCount', 'gifts']) if (!integer(growth[field], 0, Number.MAX_SAFE_INTEGER)) errors.push(`角色 ${id} 的 ${field} 次数记录无效。`);
    if (!integer(growth.joined, 0, state.turn) || ['giftTurn', 'movedTurn', 'vanTurn'].some(field => own(growth, field) && !integer(growth[field], 0, state.turn))) errors.push(`角色 ${id} 的成长回合记录无效。`);
    if (typeof growth.knownLike !== 'boolean' || !isObject(growth.extra) || (own(growth.extra || {}, 'escapeCount') && !integer(growth.extra.escapeCount, 0, Number.MAX_SAFE_INTEGER))) errors.push(`角色 ${id} 的成长附加记录无效。`);
    // Unknown top-level/extra metadata stays opaque, not a live rule or stat.
  }
  return errors;
}
function saveErrors(state, includeHistory = true) {
  const errors = [];
  if (!isObject(state)) return ['存档必须是 JSON 对象。'];
  if (state.schemaVersion !== 1) errors.push('存档 schemaVersion 不受支持。');
  if (state.rulesVersion !== RULES_VERSION) errors.push('存档规则版本无效。');
  if (state.world !== undefined && !(isObject(state.world) && Object.keys(state.world).length === 3 && state.world.map === 'earth' && EARTH.starts.some(item => item.id === state.world.start) && isObject(state.world.origin) && Object.keys(state.world.origin).length === 2 && integer(state.world.origin.col, 0, EARTH.cols - 1) && integer(state.world.origin.row, 0, EARTH.rows - 1))) errors.push('世界地图记录无效。');
  if (!isObject(state.management) || !['off', 'balanced', 'economy', 'supply'].includes(state.management.mode) || !integer(state.management.reserve, 0, 1000000000) || state.management.explore !== undefined && !integer(state.management.explore, 1, AUTO_EXPLORE_MAX) || state.management.exploreLeft !== undefined && state.management.exploreLeft !== true) errors.push('内政托管记录无效。');
  if (!isObject(state.growth) || !isObject(state.pairs) || !isObject(state.posts) || !integer(state.arrivalIndex, 0, 1000) || !Array.isArray(state.levelLog)) errors.push('角色成长记录无效。');
  if (!integer(state.gachaCount, 0, Number.MAX_SAFE_INTEGER) || !Array.isArray(state.storySeen) || !Array.isArray(state.customEvents) || (state.pendingEvent !== null && typeof state.pendingEvent !== 'string')) errors.push('招募或事件记录无效。');
  if (typeof state.seed !== 'string' || state.seed.length > 128) errors.push('世界种子无效。');
  if (!integer(state.turn, 1, Number.MAX_SAFE_INTEGER) || !integer(state.maxAP, COMMAND_RULES.base, COMMAND_RULES.max) || !integer(state.ap, 0, state.maxAP) || !integer(state.revision, 0, Number.MAX_SAFE_INTEGER)) errors.push('回合、行动点或版本无效。');
  if (state.marchOrders !== undefined && (!Array.isArray(state.marchOrders) || state.marchOrders.length > MAX_MARCH_ORDERS || !integer(state.orderSeq, 0, Number.MAX_SAFE_INTEGER) || new Set(state.marchOrders.map(order => order?.id)).size !== state.marchOrders.length
    || state.marchOrders.some(order => !isObject(order) || !integer(order.id, 1, state.orderSeq) || !isObject(state.tiles) || !own(state.tiles, order.key) || !own(state.tiles, order.toKey) || !Array.isArray(order.girls) || order.girls.length > 1000 || order.girls.some(id => typeof id !== 'string' || !isObject(state.characters) || !own(state.characters, id)) || !integer(order.troops, 0, 99) || !integer(order.turn, 1, state.turn)
      || (order.elite !== undefined && (!isObject(order.elite) || RARE_RANKS.some(rank => !integer(order.elite[rank], 0, 99))))))) errors.push('远行令记录无效。');
  if (state.edicts !== undefined && (!Array.isArray(state.edicts) || state.edicts.length > EDICT_SLOTS.length || new Set(state.edicts).size !== state.edicts.length || state.edicts.some(id => !EDICTS.some(edict => edict.id === id)) || (state.edictTurn !== undefined && !integer(state.edictTurn, 0, state.turn)))) errors.push('国策记录无效。');
  if (state.prison !== undefined && (!isObject(state.prison) || typeof state.prison.autoSecure !== 'boolean')) errors.push('牢房方针记录无效。');
  if (state.envoys !== undefined) {
    const posted = isObject(state.envoys) ? Object.values(state.envoys) : null;
    if (!posted || isObject(state.factions) && Object.keys(state.envoys).some(id => !own(state.factions, id) || id === state.playerId) || posted.some(id => typeof id !== 'string') || new Set(posted).size !== posted.length
      || isObject(state.posts) && posted.some(id => Object.values(state.posts).includes(id) || [state.activeHeroId, state.companionId].includes(id))) errors.push('使节派驻记录无效。');
  }
  if (state.status !== 'playing') errors.push('战局状态无效。');
  for (const field of ['tiles', 'factions', 'characters', 'terrainTypes', 'relations', 'metrics', 'milestone', 'chronicleArchive', 'characterOwners', 'captives']) if (!isObject(state[field])) errors.push(`${field} 缺失或无效。`);
  for (const field of ['recruitedHeroIds', 'capturedCapitalIds', 'logs', 'history', 'loadedMods', 'chronicle', 'notices', 'inbox', 'arrivalQueue']) if (!Array.isArray(state[field])) errors.push(`${field} 缺失或无效。`);
  if (errors.length) return errors;
  errors.push(...campaignErrors(state));
  errors.push(...transportErrors(state));
  errors.push(...waterErrors(state));
  errors.push(...menuRecordErrors(state));
  if (Object.keys(state.tiles).length > MAX_TILES || Object.keys(state.characters).length > 1000 || Object.keys(state.factions).length > 100 || Object.keys(state.terrainTypes).length > 256) errors.push('存档内容超过原型容量。');
  if (!own(state.factions, state.playerId) || !state.factions[state.playerId]?.isPlayer) errors.push('玩家国家引用无效。');
  if (state.activeHeroId !== null && (!state.recruitedHeroIds.includes(state.activeHeroId) || !canServe(state, state.activeHeroId, state.playerId))) errors.push('当前统领不可用。');
  if (state.companionId !== null && (!state.recruitedHeroIds.includes(state.companionId) || !canServe(state, state.companionId, state.playerId) || state.companionId === state.activeHeroId)) errors.push('当前副将不可用或重复。');
  for (const [id, character] of Object.entries(state.characters)) { if (id !== character.id) errors.push('角色键与 id 不一致。'); errors.push(...characterErrors(character, `角色 ${id}`)); }
  errors.push(...growthErrors(state));
  for (const [id, terrain] of Object.entries(state.terrainTypes)) { if (id !== terrain.id) errors.push('地形键与 id 不一致。'); errors.push(...terrainErrors(terrain, `地形 ${id}`)); }
  for (const [id, faction] of Object.entries(state.factions)) {
    if (!isObject(faction) || !validId(id) || faction.id !== id || !validName(faction.name) || !validColor(faction.color) || !(own(state.characters, faction.leaderId) || (!faction.isPlayer && faction.regularCommand === true && faction.leaderId === null))) { errors.push(`国家 ${id} 定义无效。`); continue; }
    if (faction.fiscalReport !== undefined) errors.push(...fiscalReportErrors(faction.fiscalReport, state));
    if (faction.gachaCount !== undefined && !integer(faction.gachaCount, 0, Number.MAX_SAFE_INTEGER)) errors.push(`国家 ${id} 招募记录无效。`);
    if (faction.regularCommand !== undefined && typeof faction.regularCommand !== 'boolean') errors.push(`国家 ${id} 指挥记录无效。`);
    if (faction.armyTrainingLevel !== undefined && !integer(faction.armyTrainingLevel, 1, MAX_ARMY_TRAINING)) errors.push(`国家 ${id} 常备军训练等级无效。`);
    if (faction.fortUpgradeTurn !== undefined && !integer(faction.fortUpgradeTurn, 1, state.turn)) errors.push(`国家 ${id} 要塞升级回合无效。`);
    if (faction.aiSupplyPurchaseTurn !== undefined && !integer(faction.aiSupplyPurchaseTurn, 1, state.turn)) errors.push(`国家 ${id} 补给采购回合无效。`);
    if (!integer(faction.gold, 0, Number.MAX_SAFE_INTEGER) || !integer(faction.supply, 0, Number.MAX_SAFE_INTEGER) || typeof faction.alive !== 'boolean' || typeof faction.isPlayer !== 'boolean' || !integer(faction.graceUntilTurn, 0, Number.MAX_SAFE_INTEGER)) errors.push(`国家 ${id} 状态无效。`);
    const capital = state.tiles[faction.capitalKey];
    if (faction.alive && (!capital?.isCapital || capital.capitalOf !== id || capital.ownerId !== id)) errors.push(`国家 ${id} 的首都引用无效。`);
    if (!faction.alive && (faction.capitalKey !== null || Object.values(state.tiles).some(tile => tile.ownerId === id))) errors.push(`休眠国家 ${id} 的领土状态无效。`);
    if (!Array.isArray(faction.capitalHistory) || faction.capitalHistory.length > 64 || faction.capitalHistory.some(key => !state.tiles[key]) || !integer(faction.capitalMoves, 0, Number.MAX_SAFE_INTEGER) || !integer(faction.defeats, 0, Number.MAX_SAFE_INTEGER) || !integer(faction.revivals, 0, Number.MAX_SAFE_INTEGER)) errors.push(`国家 ${id} 的历史记录无效。`);
  }
  for (const [key, tile] of Object.entries(state.tiles)) {
    if (!isObject(tile) || !coordValid(tile.q) || !coordValid(tile.r) || key !== tileKey(tile.q, tile.r) || tile.key !== key || !own(state.terrainTypes, tile.terrainId) || !inWorld(state, tile.q, tile.r)) { errors.push(`地块 ${key} 定义无效。`); continue; }
    if (tile.ownerId !== null && !own(state.factions, tile.ownerId)) errors.push(`地块 ${key} 所属国家不存在。`);
    if (!Array.isArray(tile.garrison) || !Array.isArray(tile.field) || tile.garrison.length > MAX_SEATS || girlsOn(tile).some(item => !own(state.characters, item)) || !integer(tile.food, 0, 100000) || (tile.elite !== undefined && RARE_RANKS.some(rank => !integer(tile.elite[rank], 0, 99)))) errors.push(`地块 ${key} 的驻军记录无效。`);
    if (!integer(tile.troops, 0, 100) || typeof tile.discovered !== 'boolean' || typeof tile.isCapital !== 'boolean' || (tile.building !== null && !BUILDINGS[tile.building])) errors.push(`地块 ${key} 状态无效。`);
    if (tile.militaryReserve !== undefined && typeof tile.militaryReserve !== 'boolean') errors.push(`地块 ${key} 军事编制无效。`);
    if (tile.militaryReadyTurn !== undefined && !integer(tile.militaryReadyTurn, 0, state.turn + 1)) errors.push(`地块 ${key} 军事整备回合无效。`);
    if (tile.militaryReserve && tile.militaryReadyTurn) errors.push(`地块 ${key} 后备驻地不能同时整备。`);
    if (tile.road !== undefined && typeof tile.road !== 'boolean') errors.push(`地块 ${key} 道路记录无效。`);
    if (tile.fortMothballed !== undefined && typeof tile.fortMothballed !== 'boolean') errors.push(`地块 ${key} 要塞状态无效。`);
    if (tile.fortReadyTurn !== undefined && !integer(tile.fortReadyTurn, 0, state.turn + 2)) errors.push(`地块 ${key} 要塞整备记录无效。`);
    if (tile.fiscalReclaim !== undefined && typeof tile.fiscalReclaim !== 'boolean') errors.push(`地块 ${key} 财政收缩记录无效。`);
    if (tile.infrastructurePeak !== undefined && !integer(tile.infrastructurePeak, 0, 5)) errors.push(`地块 ${key} 建设记录无效。`);
    if (tile.claim !== undefined && !integer(tile.claim, 1, state.turn)) errors.push(`地块 ${key} 失地记录无效。`);
    if (!integer(tile.buildingLevel, tile.building ? 1 : 0, tile.building ? (BUILDINGS[tile.building]?.maxLevel || 5) : 0)) errors.push(`地块 ${key} 建筑等级无效。`);
    if (tile.isCapital && (!own(state.factions, tile.capitalOf) || tile.ownerId !== tile.capitalOf || state.factions[tile.capitalOf].capitalKey !== key)) errors.push(`地块 ${key} 的首都标记无效。`);
    if (tile.ownerId && !walkable(state, tile) && tile.terrainId !== 'ocean' && !(isWater(tile) && tile.waterOwnerId === tile.ownerId)) errors.push(`领土 ${key} 的地形不可通行。`);
  }
  if (isObject(state.posts)) {
    const ids = Object.values(state.posts).filter(id => id !== null);
    if (Object.keys(state.posts).some(post => !POSTS.some(item => item.id === post)) || ids.some(id => !canServe(state, id, state.playerId) || [state.activeHeroId, state.companionId].includes(id)) || new Set(ids).size !== ids.length) errors.push('职位归属、兼任或重复任职记录无效。');
  }
  for (const id of state.recruitedHeroIds) if (!own(state.characters, id)) errors.push('议会角色引用无效。');
  const stationed = [...Object.values(state.tiles).flatMap(girlsOn), ...Object.values(state.campaign.flights).flatMap(f=>f.pilotIds),...Object.values(state.campaign.airportGuests).flat()];
  if (new Set(stationed).size !== stationed.length) errors.push('同一角色出现在多个地块。');
  for (const tile of Object.values(state.tiles)) if (girlsOn(tile).some(id => state.characterOwners[id] !== tile.ownerId)) errors.push(`地块 ${tile.key} 驻有别国角色。`);
  if (new Set(state.recruitedHeroIds).size !== state.recruitedHeroIds.length) errors.push('议会角色记录重复。');
  for (const id of Object.keys(state.characters)) if (!own(state.characterOwners, id)) errors.push(`角色 ${id} 缺少归属记录。`);
  for (const [id, ownerId] of Object.entries(state.characterOwners)) if (!own(state.characters, id) || (ownerId !== null && !own(state.factions, ownerId))) errors.push(`角色 ${id} 的国家归属无效。`);
  for (const [id, captive] of Object.entries(state.captives)) {
    if (!isObject(captive) || captive.characterId !== id || !own(state.characters, id) || !own(state.factions, captive.captorId) || !own(state.factions, captive.originalFactionId) || captive.captorId === captive.originalFactionId || !state.factions[captive.captorId].alive || state.characterOwners[id] !== captive.originalFactionId || !integer(captive.capturedTurn, 1, state.turn) || typeof captive.battleId !== 'string') errors.push(`俘虏 ${id} 记录无效。`);
  }
  errors.push(...captivityErrors(state));
  if (state.battle !== null) {
    const validation = validateTactical(state.battle);
    errors.push(...validation.errors);
    if (validation.ok) {
      const battle = state.battle, from = battle.flightCombat ? flightSite(state,battle.flightCombat.attacker) : state.tiles[battle.fromKey], to = battle.flightCombat ? flightSite(state,battle.flightCombat.defender) : state.tiles[battle.toKey];
      if (battle.flightCombat) {
        if (battle.environment !== 'air') errors.push('transport.airBattle');
        for (const side of ['attacker', 'defender']) {
          const flight=state.campaign.flights[battle.flightCombat[side]];
          if(!flight || JSON.stringify([...flight.pilotIds].sort())!==JSON.stringify([...battle.participantIds[side]].sort())) { errors.push('transport.airParticipants'); continue; }
          for(const unit of battle.units.filter(u=>u.side===side)){
            const index=flight.pilotIds.indexOf(unit.characterId),plane=state.campaign.planes[flight.planeIds[index]];
            if(index<0||Boolean(unit.nativeFlight)!==flight.native||Boolean(unit.plane)===flight.native||!flight.native&&(unit.aircraftModelId!==plane?.modelId||unit.pilotAttack!==heroView(state,unit.characterId).stats.attack))errors.push('transport.aircraftRoster');
          }
        }
      }
      if (!battle.flightCombat && battle.training && (battle.training.attacker !== serviceTraining(state, from) || battle.training.defender !== serviceTraining(state, to))) errors.push('战场训练快照与国家记录不一致。');
      for (const [side, tile, troops] of [['attacker', from, battle.initialAttackingTroops], ['defender', to, battle.initialDefendingTroops]]) {
        if (!tile || battle.flightCombat) continue;
        const characters = (battle.participantIds?.[side] || []).map(id => heroView(state, id));
        const expected = tacticalForceSummary({ troops, characters, roster: serviceRoster(state, tile), trainingLevel: serviceTraining(state, tile) }).units;
        const actual = battle.units.filter(unit => unit.side === side);
        // Dead tactical units remain in the battle until commit; include them.
        // World inventory is likewise unchanged until finishBattle. Checking
        // only training was insufficient at Lv1 with rare service disabled.
        for (const rank of RARE_RANKS) if (actual.filter(unit => unit.rank === rank).length !== expected.filter(unit => unit.rank === rank).length) {
          errors.push('战场稀有编制与驻地执勤记录不一致。'); break;
        }
      }
      if (battle.mission === 'raid' && !to?.building) errors.push('劫掠战场的目标建筑不存在。');
      if (!own(state.factions, battle.attackerId) || !own(state.factions, battle.defenderId) || ![battle.attackerId, battle.defenderId].includes(state.playerId) || battle.playerSide !== (battle.attackerId === state.playerId ? 'attacker' : 'defender')) errors.push('战场阵营与玩家归属不一致。');
      if (from?.ownerId !== battle.attackerId || to?.ownerId !== battle.defenderId || from?.troops !== battle.sourceTroopsBefore || to?.troops !== battle.initialDefendingTroops || !integer(battle.initialAttackingTroops, 0, 99) || (battle.initialAttackingTroops && !from?.shipId && battle.initialAttackingTroops >= (from?.troops || 0))) errors.push('战场与世界驻军不一致。');
      for (const unit of battle.units) if (unit.characterId && !canServe(state, unit.characterId, unit.side === 'attacker' ? battle.attackerId : battle.defenderId)) errors.push('战场包含不可用或归属错误的角色。');
      if (battle.phase === 'result') {
        const expectedRescues = battle.mission !== 'raid' && battle.result.winnerSide === 'attacker' && to?.isCapital && to.capitalOf === battle.defenderId ? Object.values(state.captives).filter(captive => captive.captorId === battle.defenderId).map(captive => captive.characterId).sort() : [];
        if (!Array.isArray(battle.result.rescuedCharacterIds) || JSON.stringify([...battle.result.rescuedCharacterIds].sort()) !== JSON.stringify(expectedRescues)) errors.push('战场营救名单与关押记录不一致。');
      }
    }
  }
  if (state.turnContinuation !== null) {
    const pending = state.turnContinuation;
    if (pending?.deferredProsperity !== undefined && pending.deferredProsperity !== true) errors.push('战争阶段财政进度记录无效。');
    if (!isObject(pending) || pending.stage !== 'ai' || pending.startedTurn !== state.turn || !Array.isArray(pending.factionIds) || pending.factionIds.length > 100 || pending.factionIds.some(id => !own(state.factions, id) || id === state.playerId) || new Set(pending.factionIds).size !== pending.factionIds.length || !integer(pending.factionIndex, 0, pending.factionIds.length) || !integer(pending.actionIndex, 0, 4) || !isObject(pending.income) || !integer(pending.income.gold, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) || !integer(pending.income.supply, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)) errors.push('战争阶段续行记录无效。');
    else if (state.battle && (state.battle.attackerId !== pending.factionIds[pending.factionIndex] || state.battle.playerSide !== 'defender' || pending.actionIndex < 1)) errors.push('当前战斗与等待中的国家行动不一致。');
  } else if (state.battle?.playerSide === 'defender' && !state.battle.flightCombat) errors.push('防守战缺少战争阶段续行记录。');
  for (const id of state.capturedCapitalIds) if (!own(state.factions, id) || id === state.playerId) errors.push('征服记录无效。');
  if (new Set(state.capturedCapitalIds).size !== state.capturedCapitalIds.length) errors.push('征服记录重复。');
  if (state.logs.length > 80 || state.logs.some(item => !isObject(item) || typeof item.text !== 'string' || item.text.length > 10000 || !integer(item.turn, 1, Number.MAX_SAFE_INTEGER))) errors.push('事件日志无效。');
  if (state.chronicle.length > 500 || state.chronicle.some(item => !isObject(item) || typeof item.text !== 'string' || item.text.length > 10000 || typeof item.type !== 'string' || !integer(item.turn, 1, Number.MAX_SAFE_INTEGER))) errors.push('编年史记录无效。');
  if (!integer(state.chronicleArchive.entries, 0, Number.MAX_SAFE_INTEGER) || !isObject(state.chronicleArchive.byType) || Object.values(state.chronicleArchive.byType).some(value => !integer(value, 0, Number.MAX_SAFE_INTEGER))) errors.push('早期历史统计无效。');
  if (!integer(state.exileCount, 0, Number.MAX_SAFE_INTEGER) || !integer(state.lastWorldEventTurn, 0, state.turn)) errors.push('世界事件记录无效。');
  if (!integer(state.milestone.level, 1, Number.MAX_SAFE_INTEGER) || !integer(state.milestone.completed, 0, Number.MAX_SAFE_INTEGER) || !isObject(state.milestone.baseline)) errors.push('阶段计划无效。');
  for (const metric of ['land', 'infrastructure', 'wealth', 'conquests']) if (!integer(state.metrics[metric], 0, Number.MAX_SAFE_INTEGER) || !integer(state.milestone.baseline?.[metric], 0, state.metrics[metric])) errors.push(`阶段累计值 ${metric} 无效。`);
  if (state.loadedMods.length > 1000 || state.loadedMods.some(item => !isObject(item) || !validId(item.id))) errors.push('Mod 记录无效。');
  for (const [key, relation] of Object.entries(state.relations)) {
    const ids = key.split('|');
    if (isObject(relation) && relation.demandUntil !== undefined && !integer(relation.demandUntil, 0, state.turn + DEMAND_INTERVAL)) errors.push('外交进贡间隔记录无效。');
    if (isObject(relation) && relation.offerCooldowns !== undefined && (!isObject(relation.offerCooldowns) || Object.entries(relation.offerCooldowns).some(([kind, until]) => !['peace', 'pact', 'ally', 'trade', 'tribute'].includes(kind) || !integer(until, 0, state.turn + 4)))) errors.push('外交提议冷却记录无效。');
    if (ids.length !== 2 || ids.some(id => !own(state.factions, id)) || !isObject(relation) || !own(STATUS_NAME, relation.status) || !integer(relation.favor, -100, 100) || !integer(relation.until, 0, Number.MAX_SAFE_INTEGER)) errors.push('外交记录无效。');
    else if ((relation.status === 'vassal' && !ids.includes(state.playerId))
      || (relation.notes !== undefined && (!Array.isArray(relation.notes) || relation.notes.length > DIPLOMACY_RULES.notes || relation.notes.some(note => !isObject(note) || !integer(note.turn, 1, state.turn) || !integer(note.delta, -200, 200) || typeof note.why !== 'string' || note.why.length > 40)))
      || (relation.war !== undefined && (!isObject(relation.war) || relation.status !== 'war' || !integer(relation.war.score, -100, 100) || !integer(relation.war.since, 0, state.turn) || !(relation.war.by === null || own(state.factions, relation.war.by)) || typeof relation.war.cb !== 'string' || relation.war.cb.length > 20))
      || (relation.insultTurn !== undefined && !integer(relation.insultTurn, 1, state.turn))) errors.push('外交明细、战争或附庸记录无效。');
  }
  if (state.history.length > 3) errors.push('撤销历史过长。');
  if (includeHistory) for (const snapshot of state.history) {
    if (!isObject(snapshot) || !Array.isArray(snapshot.history) || snapshot.history.length) { errors.push('撤销快照结构无效。'); continue; }
    errors.push(...saveErrors(snapshot, false).map(e => `撤销快照：${e}`));
    if (snapshot.turn !== state.turn) errors.push('不能跨回合撤销。');
  }
  return errors;
}
export function deserializeGame(text) {
  try {
    requireThat(typeof text === 'string' && text.length <= 20000000, '存档必须是小于 20 MB 的 JSON 文本。');
    const state = JSON.parse(text);
    requireThat(isObject(state) && [10, RULES_VERSION].includes(state.rulesVersion), `当前测试版只支持规则 10 或 ${RULES_VERSION} 的存档；请保留原文件。`);
    if (state.rulesVersion === 10) { migrateCampaign(state); state.rulesVersion = RULES_VERSION; for (const snapshot of state.history || []) { migrateCampaign(snapshot); snapshot.rulesVersion = RULES_VERSION; } }
    state.terrainTypes.ocean ||= clone(TERRAIN_DEFINITIONS.find(t => t.id === 'ocean'));
    if (!state.campaign || state.campaign.version===1) migrateCampaign(state);
    for(const snapshot of state.history||[])if(!snapshot.campaign||snapshot.campaign.version===1)migrateCampaign(snapshot);
    const errors = saveErrors(state);
    requireThat(errors.length === 0, errors.slice(0, 12).join('\n'));
    cleanCampaignAssignments(state); dissolveEmptyNations(state);
    state.inbox = state.inbox.filter(item => currentOffer(state, item));
    return { ok: true, state };
  } catch (error) { return { ok: false, state: null, error: error?.message || '存档读取失败。' }; }
}

function tradeIncome(state,id,key){const other=key.split('|').find(who=>who!==id),mine=state.campaign?.economies?.[id],theirs=state.campaign?.economies?.[other];const rate=Math.sqrt((mine?.exchange||100)/(theirs?.exchange||100));return Math.max(1,Math.round(TRADE_GOLD*Math.min(1.8,Math.max(.6,rate))+Math.round(techEffect(state,'tradeGold',id))+(mine?.settlement>=50?1:0)));}

function armyMode(state,key){const ship=state.tiles[key]?.shipId;return ship?state.campaign.ships[ship]?.mode||'main':state.campaign.armies[key]?.mode||'main';}

// Recovery changes ordinary troops or the selected building, never characters,
// elite units, territory, treasury, or milestones. The engine owns payment,
// logging, undo and action revisions; this module plans against that same state.
import { BUILDINGS } from './content.mjs?v=1118-1603';
import { F } from './feedback-copy.mjs?v=1118-1603';
import { MIN_BUILD, handsNeeded, housingOf, partsOf, sameLand, canBuildOnTerrain } from './realm.mjs?v=1118-1603';

const RECOVERY_TYPES = new Set(['demobilize', 'relief', 'emergencyFarm']);
const RELIEF_SCOPES = new Set(['reserves', 'all-forces']);
const STEPS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
// An unofficered main stack still needs a guard. Protect the largest stacks
// and over-housing musters, but do not mistake every small village for an army.
const MAIN_ARMY_MIN = 12;
const PROTECTION_REASONS = {
  selected: '手动保留地块', capital: '首都守军', heroes: '角色带领或驻守',
  mainArmy: '主力军（至少 12 人，兵力居首或超过驻地住房）', warBorder: '交战边境守军',
  fort: '未封存要塞驻军', committed: '本回合已行军或作战',
};
const ownTiles = (state, factionId) => Object.values(state.tiles).filter(tile => tile.ownerId === factionId);
const troopsOf = (state, factionId) => ownTiles(state, factionId).reduce((total, tile) => total + tile.troops, 0);
const tileRecord = tile => ({ troops: tile.troops, building: tile.building, buildingLevel: tile.buildingLevel });
const sameRecord = (tile, record) => tile.troops === record.troops && tile.building === record.building && tile.buildingLevel === record.buildingLevel;

function changedTile(tile, next) {
  return { key: tile.key, ownerId: tile.ownerId, before: tileRecord(tile), after: { ...tileRecord(tile), ...next } };
}

function projection(state, changes) {
  const projected = { ...state, tiles: { ...state.tiles } };
  for (const change of changes) projected.tiles[change.key] = { ...state.tiles[change.key], ...change.after };
  return projected;
}

function reliefOptions(state, action, factionId) {
  const scope = action.scope === undefined ? 'reserves' : action.scope;
  if (!RELIEF_SCOPES.has(scope)) return { error: '请选择保留防线，或明确选择全军裁减。' };
  const preserveConstruction = action.preserveConstruction === undefined ? true : action.preserveConstruction;
  if (typeof preserveConstruction !== 'boolean') return { error: '请选择是否保留建造人手。' };
  const keys = action.protectedKeys === undefined ? [] : action.protectedKeys;
  if (!Array.isArray(keys) || keys.some(key => typeof key !== 'string' || state.tiles[key]?.ownerId !== factionId)) return { error: '保留名单只能包含己方地块，请重新选择。' };
  return { scope, preserveConstruction, protectedKeys: [...new Set(keys)].sort((a, b) => a.localeCompare(b)) };
}

// Keep an existing construction crew, not a promise of free or immediately affordable building.
// cutSince is the build action's connection gate. The player's fog never grants new eligibility.
function constructionReady(state, tile, factionId) {
  return tile.troops >= MIN_BUILD && (!tile.building || BUILDINGS[tile.building]?.emergency)
    && tile.cutSince === undefined && state.terrainTypes[tile.terrainId]?.passable
    && (factionId !== state.playerId || tile.discovered)
    && Object.values(BUILDINGS).some(building => !building.emergency && canBuildOnTerrain(tile, building.id));
}

function reliefSites(state, factionId, scope, protectedKeys, preserveConstruction = true) {
  const tiles = ownTiles(state, factionId).sort((a, b) => a.key.localeCompare(b.key));
  const largest = tiles.reduce((maximum, tile) => Math.max(maximum, tile.troops), 0);
  const selected = new Set(protectedKeys), capital = state.factions[factionId].capitalKey;
  return tiles.map(tile => {
    const protectionCodes = [];
    if (selected.has(tile.key)) protectionCodes.push('selected');
    if (tile.key === capital || tile.isCapital) protectionCodes.push('capital');
    if (tile.field?.length || tile.garrison?.length) protectionCodes.push('heroes');
    if (tile.troops >= MAIN_ARMY_MIN && (tile.troops === largest || tile.troops > housingOf(state, tile))) protectionCodes.push('mainArmy');
    // Use the actual diplomatic status, not merely a foreign neighbor. A war
    // remains worth defending during its opening grace period as well.
    if (STEPS.some(([dq, dr]) => {
      const owner = state.tiles[`${tile.q + dq},${tile.r + dr}`]?.ownerId;
      return owner && owner !== factionId && state.relations?.[[factionId, owner].sort().join('|')]?.status === 'war';
    })) protectionCodes.push('warBorder');
    // Preserve the whole garrison, including a fort being prepared or awaiting
    // reinforcement. Sealing a fort is a separate, explicit zero-cost action.
    if (tile.building === 'fort' && !tile.fortMothballed) protectionCodes.push('fort');
    if (tile.marchedTurn === state.turn || tile.foughtTurn === state.turn) protectionCodes.push('committed');
    const protectedSite = selected.has(tile.key) || scope === 'reserves' && protectionCodes.length > 0;
    const productionWorkersNeeded = Math.max(1, handsNeeded(tile)), readyForConstruction = Boolean(constructionReady(state, tile, factionId));
    const workersNeeded = Math.max(productionWorkersNeeded, preserveConstruction && readyForConstruction ? MIN_BUILD : 0);
    const workersKept = Math.min(tile.troops, workersNeeded);
    const troopsAfter = protectedSite ? tile.troops : workersKept;
    const removed = tile.troops - troopsAfter, overridden = removed > 0 && !protectedSite && protectionCodes.length > 0;
    const protectionReasons = protectionCodes.map(code => PROTECTION_REASONS[code]);
    return {
      key: tile.key, troopsBefore: tile.troops, troopsAfter, removed, workersNeeded, workersKept, productionWorkersNeeded,
      constructionReady: readyForConstruction,
      constructionWorkersKept: !protectedSite && preserveConstruction && readyForConstruction ? Math.max(0, MIN_BUILD - productionWorkersNeeded) : 0,
      losesConstruction: readyForConstruction && troopsAfter < MIN_BUILD,
      militaryReserve: Math.max(0, tile.troops - workersNeeded), protected: protectedSite,
      protectionCodes, protectionReasons, overridden,
      reason: protectedSite ? protectionReasons.join('；') : overridden ? `全军裁减将减少：${protectionReasons.join('；')}`
        : readyForConstruction && troopsAfter < MIN_BUILD ? '保留生产人手；裁减后不足 3 人，不能建造普通建筑'
        : preserveConstruction && readyForConstruction && productionWorkersNeeded < MIN_BUILD ? '保留生产和建造人手，至少 3 人可动工'
        : removed > 0 ? '后方富余兵员，保留现有生产人手' : '没有超出生产需求的兵员',
    };
  });
}

/** Shared read-only army guards for safe batch conveniences such as rallying. */
export function getArmyProtectionSites(state, factionId = state.playerId) {
  return reliefSites(state, factionId, 'reserves', []).map(site => ({
    key: site.key, protectionCodes: site.protectionCodes, protectionReasons: site.protectionReasons,
  }));
}

function reliefOverview(state, factionId, options) {
  const sites = reliefSites(state, factionId, options.scope, options.protectedKeys, options.preserveConstruction);
  const affectedSites = sites.filter(site => site.removed > 0), protectedSites = sites.filter(site => site.protected);
  return {
    ...options, sites, affectedSites, protectedSites, overriddenSites: sites.filter(site => site.overridden),
    militaryReserves: sites.reduce((sum, site) => sum + site.militaryReserve, 0),
    protectedReserves: protectedSites.reduce((sum, site) => sum + site.militaryReserve, 0),
    constructionReadyBefore: sites.filter(site => site.constructionReady).length,
    constructionReadyAfter: sites.filter(site => site.constructionReady && !site.losesConstruction).length,
    constructionRetainedSites: sites.filter(site => site.constructionWorkersKept > 0),
    constructionRetainedWorkers: sites.reduce((sum, site) => sum + site.constructionWorkersKept, 0),
    constructionLostSites: sites.filter(site => site.losesConstruction),
  };
}

/**
 * Pure preview. measureIncome must return the engine's NET {gold, supply}, not
 * its gross harvest. Explicit demobilize.troops removes that many N troops;
 * its default is one. Relief keeps every existing production worker and, by
 * default, existing ordinary construction crews and all identified armies and defenses.
 * preserveConstruction:false is an independent, explicit emergency choice. Only all-forces scope
 * overrides those automatic guards. Explicit protectedKeys always win.
 */
export function previewRecovery(state, action, factionId = state.playerId, measureIncome) {
  const type = action?.type, cost = { ap: type === 'emergencyFarm' ? 1 : 0, gold: 0, supply: 0 };
  const invalid = (reason, detail = {}) => ({ ok: false, reason, type, key: action?.key, factionId, removed: 0, changes: [], cost, ...detail });
  if (!RECOVERY_TYPES.has(type)) return invalid('没有这种救急行动。');
  if (!state.factions[factionId]?.alive) return invalid('这个国家当前没有可经营的领地。');
  if (action.expectedRevision !== undefined && action.expectedRevision !== state.revision) return invalid('存档版本已变化，请重新查看救急方案。');
  if (typeof measureIncome !== 'function') throw new TypeError('Recovery previews require the engine net-income reader.');
  const changes = [];
  let overview = null, emptyReliefReason = '';

  if (type === 'relief') {
    const options = reliefOptions(state, action, factionId);
    if (options.error) return invalid(options.error);
    overview = reliefOverview(state, factionId, options);
    for (const site of overview.affectedSites) changes.push(changedTile(state.tiles[site.key], { troops: site.troopsAfter }));
    if (!changes.length) emptyReliefReason = overview.protectedReserves > 0
      ? '可裁减兵员都在保留名单或防线中；不会自动遣散这些军队。'
      : '没有超出生产或保留建造所需的人手；不会自动遣散这些人员。';
    // No crew tradeoff and no changes: preserve the cheap no-op path used by AI.
    if (!changes.length && !overview.constructionRetainedWorkers) return invalid(emptyReliefReason, overview);
  } else {
    const tile = state.tiles[action.key];
    if (!tile || tile.ownerId !== factionId) return invalid('请选择己方领土。');
    if (type === 'demobilize') {
      const removed = action.troops === undefined ? 1 : action.troops;
      if (!Number.isInteger(removed) || removed < 1 || removed > tile.troops - 1) return invalid('遣散人数必须为正整数，而且必须保留至少 1 名居民。');
      changes.push(changedTile(tile, { troops: tile.troops - removed }));
    } else {
      const home = state.tiles[state.factions[factionId].capitalKey];
      if (tile.bridgeId) return invalid(F.bridge_no_build);
      if (tile.building === 'garden') return invalid('这里已经是应急田圃。');
      if (tile.troops < BUILDINGS.garden.minHands) return invalid('应急田圃至少需要 1 名居民。');
      if (tile.cutSince !== undefined || home?.ownerId !== factionId || !sameLand(state, tile, home)) return invalid('这块地和首都断了联系，没法开垦应急田圃。');
      changes.push(changedTile(tile, { building: 'garden', buildingLevel: 1 }));
    }
  }

  const projected = projection(state, changes), before = measureIncome(state, factionId), after = measureIncome(projected, factionId);
  const troopsBefore = troopsOf(state, factionId), troopsAfter = troopsOf(projected, factionId);
  let constructionTradeoff = null;
  if (overview) {
    const alternative = reliefOverview(state, factionId, { ...overview, preserveConstruction: !overview.preserveConstruction });
    const alternativeChanges = alternative.affectedSites.map(site => changedTile(state.tiles[site.key], { troops: site.troopsAfter }));
    const alternativeIncome = JSON.stringify(alternativeChanges) === JSON.stringify(changes) ? after : measureIncome(projection(state, alternativeChanges), factionId);
    const retained = overview.preserveConstruction ? overview : alternative;
    const incomeWithCrews = overview.preserveConstruction ? after : alternativeIncome, incomeWithoutCrews = overview.preserveConstruction ? alternativeIncome : after;
    constructionTradeoff = { sites: retained.constructionRetainedSites.length, workers: retained.constructionRetainedWorkers,
      incomeWithCrews: { ...incomeWithCrews }, incomeWithoutCrews: { ...incomeWithoutCrews },
      extraSupplySaving: incomeWithoutCrews.supply - incomeWithCrews.supply, extraGoldSaving: incomeWithoutCrews.gold - incomeWithCrews.gold };
  }
  return {
    ok: !emptyReliefReason, reason: emptyReliefReason, type, key: action.key, factionId, revision: state.revision,
    cost, changes, removed: troopsBefore - troopsAfter, troopsBefore, troopsAfter,
    supplyBefore: before.supply, supplyAfter: after.supply, goldBefore: before.gold, goldAfter: after.gold,
    incomeBefore: { ...before }, incomeAfter: { ...after },
    remainingDeficit: { gold: Math.max(0, -after.gold), supply: Math.max(0, -after.supply) },
    action: { type, ...(type === 'relief' ? { scope: overview.scope, preserveConstruction: overview.preserveConstruction, protectedKeys: [...overview.protectedKeys] }
      : { key: action.key, ...(type === 'demobilize' ? { troops: troopsBefore - troopsAfter } : {}) }), expectedRevision: state.revision },
    ...(overview || {}), ...(constructionTradeoff ? { constructionTradeoff } : {}),
    ...(type === 'relief' ? {} : { tileTroopsBefore: state.tiles[action.key].troops, tileTroopsAfter: projected.tiles[action.key].troops }),
    ...(type === 'emergencyFarm' ? { replacedBuilding: state.tiles[action.key].building, replacedLevel: state.tiles[action.key].buildingLevel } : {}),
  };
}

/** Apply a freshly checked plan to the engine's working copy, with no refunds. */
export function applyRecovery(state, plan) {
  if (!plan?.ok || !RECOVERY_TYPES.has(plan.type) || !plan.changes?.length) throw new Error(plan?.reason || '救急方案无效。');
  if (plan.revision !== state.revision) throw new Error('存档版本已变化，请重新查看救急方案。');
  if (plan.type === 'relief') {
    const options = reliefOptions(state, plan, plan.factionId);
    if (options.error) throw new Error(options.error);
    const current = reliefOverview(state, plan.factionId, options);
    const expected = current.affectedSites.map(site => changedTile(state.tiles[site.key], { troops: site.troopsAfter }));
    // Recheck all classifications before mutating any tile. Besides revision
    // checks this catches newly stationed heroes, war declarations, fort modes
    // and changed main armies even in direct helper callers using mutable data.
    if (JSON.stringify(current.sites) !== JSON.stringify(plan.sites) || JSON.stringify(expected) !== JSON.stringify(plan.changes)) throw new Error('领地或驻防状态已变化，请重新查看救急方案。');
  }
  const seen = new Set();
  // Validate the entire batch before changing anything, including duplicate
  // targets. Replaying the same plan must not silently remove more people.
  for (const change of plan.changes) {
    const tile = state.tiles[change.key];
    if (seen.has(change.key) || !tile || tile.ownerId !== plan.factionId || tile.ownerId !== change.ownerId || !sameRecord(tile, change.before)) throw new Error('领地状态已变化，请重新查看救急方案。');
    seen.add(change.key);
    if (!Number.isInteger(change.after.troops) || change.after.troops < 1 || change.after.troops > tile.troops) throw new Error('救急行动必须保留居民，且不能凭空增加人口。');
    if (plan.type === 'emergencyFarm') {
      if (tile.building === 'garden' || change.after.troops !== tile.troops || change.after.building !== 'garden' || change.after.buildingLevel !== 1) throw new Error('应急田圃方案无效。');
    } else {
      if (change.after.troops >= tile.troops || change.after.building !== tile.building || change.after.buildingLevel !== tile.buildingLevel) throw new Error('遣散方案无效。');
      if (plan.type === 'relief' && change.after.troops < Math.max(1, handsNeeded(tile))) throw new Error('批量纾困不能遣散生产人员。');
    }
  }
  for (const change of plan.changes) Object.assign(state.tiles[change.key], {
    troops: change.after.troops, building: change.after.building, buildingLevel: change.after.buildingLevel,
  });
  return plan;
}

/** Same rescue rules for AI, after affordable normal agriculture is considered. */
export function chooseRecovery(state, factionId, measureIncome) {
  const relief = previewRecovery(state, { type: 'relief' }, factionId, measureIncome);
  if (relief.ok && relief.supplyAfter > relief.supplyBefore) return relief;
  const capitalKey = state.factions[factionId]?.capitalKey;
  const connected = partsOf(state, factionId).find(part => part.some(tile => tile.key === capitalKey)) || [];
  // Rank locally before asking for an exact whole-country quote. Large saves
  // must not scan all national income once for every possible garden.
  const candidates = connected.filter(tile => tile.troops >= 1 && tile.building !== 'garden' && tile.cutSince === undefined)
    .map(tile => {
      const terrain = state.terrainTypes[tile.terrainId], building = BUILDINGS[tile.building];
      const land = terrain.yield.supply + (tile.isCapital ? 1 : 0);
      const full = land + (building?.yield.supply ? building.yield.supply + 2 * ((tile.buildingLevel || 1) - 1) : 0);
      const supply = Math.round(full * Math.min(1, tile.troops / handsNeeded(tile)));
      return { tile, gain: land + BUILDINGS.garden.yield.supply - supply, lostGold: building?.yield.gold || 0 };
    })
    .filter(candidate => candidate.gain > 0)
    .sort((a, b) => b.gain - a.gain || a.lostGold - b.lostGold || a.tile.key.localeCompare(b.tile.key));
  for (const { tile } of candidates) {
    const plan = previewRecovery(state, { type: 'emergencyFarm', key: tile.key }, factionId, measureIncome);
    if (plan.ok && plan.supplyAfter > plan.supplyBefore) return plan;
  }
  return null;
}

// Pure strategic fort rules. Both sides pay the same network upkeep and need real residents.
import { tacticalSiegeProfile } from './battle.mjs?v=1118-1603';
import { walkable } from './waters.mjs?v=1118-1603';
const STEPS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
const keyOf = (q, r) => `${q},${r}`;
export const FORT_GARRISON = 4;
const operational = (state, tile) => Boolean(tile?.ownerId) && tile.building === 'fort' && !tile.fortMothballed && (tile.fortReadyTurn || 0) <= state.turn && tile.troops >= FORT_GARRISON && tile.cutSince === undefined;

/** Shared level facts, separate from whether this particular fort is operational.
 * The tactical module remains the authority for physical breastwork geometry. */
export function fortLevelProfile(value = 0) {
  const siege = tacticalSiegeProfile(value);
  if (!siege) return null;
  const level = siege.level;
  return { level, cover: Math.min(3, Math.ceil(level / 2)), siege,
    baseUpkeep: { gold: 2 + level, supply: Math.ceil(level / 2) } };
}

export function fortNetwork(state, factionId) {
  const land = Object.values(state.tiles).filter(tile => tile.ownerId === factionId && (tile.shipId || walkable(state, tile)));
  const forts = land.filter(tile => tile.building === 'fort');
  const active = forts.filter(tile => !tile.fortMothballed);
  const capacity = 1 + Math.floor(land.filter(tile => tile.cutSince === undefined).length / 12);
  const excess = Math.max(0, active.length - capacity);
  const upkeep = active.reduce((cost, tile) => {
    const profile = fortLevelProfile(tile.buildingLevel || 1);
    cost.gold += profile.baseUpkeep.gold + excess * 2;
    cost.supply += profile.baseUpkeep.supply;
    return cost;
  }, { gold: 0, supply: 0 });
  return { total: forts.length, active: active.length, operational: forts.filter(tile => operational(state, tile)).length, mothballed: forts.length - active.length, capacity, excess, upkeep };
}

export function fortStatus(state, tileOrKey) {
  const tile = typeof tileOrKey === 'string' ? state.tiles[tileOrKey] : tileOrKey;
  if (!tile || tile.building !== 'fort') return null;
  const level = tile.buildingLevel || 1, network = fortNetwork(state, tile.ownerId), profile = fortLevelProfile(level);
  const owned = Boolean(tile.ownerId), mothballed = Boolean(tile.fortMothballed), ready = (tile.fortReadyTurn || 0) <= state.turn;
  const staffed = tile.troops >= FORT_GARRISON, connected = tile.cutSince === undefined;
  // A local guard is real people, not the fort's regional command network.
  // Preparation or mothballing disables specialist works, never the garrison.
  const localDefense = owned && staffed, siegeReady = localDefense && !mothballed && ready;
  const reason = !owned ? '无主的要塞没有执勤军队，不能掩护邻地或接纳迁都。'
    : mothballed ? '已封存：不收维护费，也不能掩护邻地或接纳迁都。'
    : !ready ? `整备中：本回合战争阶段仍无胸墙；第 ${tile.fortReadyTurn} 回合完成整备。`
    : !staffed ? `缺驻军：至少 ${FORT_GARRISON} 人才有防区与迁都保障。`
    : !connected ? '与首都失联：只能依城防守，无法掩护邻地。' : '';
  return {
    level, owned, mothballed, ready, staffed, connected, garrison: FORT_GARRISON, profile, nextProfile: level < 5 ? fortLevelProfile(level + 1) : null,
    localDefense, siegeReady, operational: siegeReady && connected,
    refuge: siegeReady,
    cover: profile.cover,
    upkeep: !owned || mothballed ? { gold: 0, supply: 0 } : { gold: profile.baseUpkeep.gold + network.excess * 2, supply: profile.baseUpkeep.supply },
    reason, capacity: network.capacity, excess: network.excess,
  };
}

/** One supporting fort is enough. Adjacent forts never multiply cover. */
export function fortCover(state, tileOrKey) {
  const tile = typeof tileOrKey === 'string' ? state.tiles[tileOrKey] : tileOrKey;
  if (!tile?.ownerId || tile.cutSince !== undefined) return { defense: 0, protectedBy: [] };
  const sources = STEPS.map(([dq, dr]) => state.tiles[keyOf(tile.q + dq, tile.r + dr)])
    .filter(near => near?.ownerId === tile.ownerId && operational(state, near))
    .sort((a, b) => (b.buildingLevel || 1) - (a.buildingLevel || 1) || a.key.localeCompare(b.key));
  return { defense: sources.length ? fortLevelProfile(sources[0].buildingLevel || 1).cover : 0, protectedBy: sources.map(source => source.key) };
}

export function fortConstructionCost(state, factionId, baseCost) {
  const network = fortNetwork(state, factionId), overflow = Math.max(0, network.total + 1 - network.capacity);
  return { ...baseCost, gold: baseCost.gold + 6 + network.total * 3 + overflow * 6, supply: baseCost.supply + 3 };
}

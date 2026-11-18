// Water sovereignty is separate from a ship's temporary occupation of its cell.
// Completed bridges use the ordinary ground-army rules, without creating land or residents.
import { F } from './feedback-copy.mjs?v=1118-1603';

export const BRIDGE_RULES = Object.freeze({ baseGold: 20, growth: 2, ap: 2 });
const STEPS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
const nextTo = tile => STEPS.map(([q, r]) => `${tile.q + q},${tile.r + r}`);
export const isWater = tile => tile?.terrainId === 'ocean' || tile?.terrainId === 'lake';
export const isBridge = (state, tile) => {
  const path = state.campaign?.bridges?.[tile?.bridgeId]?.path;
  return Array.isArray(path) && path.includes(tile.key);
};
export const walkable = (state, tile) => Boolean(tile && (state.terrainTypes?.[tile.terrainId]?.passable || isBridge(state, tile)));
export const marchGuard = tile => tile?.bridgeId ? 0 : 1;
export function waterOwner(state, tile) {
  if (!isWater(tile)) return null;
  const id = isBridge(state, tile) ? tile.ownerId : tile.waterOwnerId;
  return state.factions?.[id]?.alive ? id : null;
}
export const territoryOwner = (state, tile) => isWater(tile) ? waterOwner(state, tile) || tile.ownerId : tile?.ownerId;

export function waterClaimPlan(state, key, cost, id = state.playerId) {
  const tile = state.tiles[key], owner = waterOwner(state, tile);
  const touching = tile && nextTo(tile).some(k => {
    const near = state.tiles[k];
    return waterOwner(state, near) === id || near?.ownerId === id && !near.shipId && walkable(state, near);
  });
  const reason = !tile?.discovered || !isWater(tile) || tile.bridgeId ? F.bridge_invalid
    : owner === id ? F.water_owned : owner || tile.shipId && tile.ownerId !== id ? F.water_foreign
      : !touching ? F.water_adjacent : '';
  return { key, enabled: !reason, reason, cost, action: { type: 'claim', key }, effects: { water: true, migrants: 0 } };
}

/** One BFS finds every opposite bank; opening the map picker never runs a BFS per cell. */
export function bridgePlans(state, fromKey, id = state.playerId) {
  const from = state.tiles[fromKey], targets = new Map();
  if (!from?.discovered || from.ownerId !== id || from.shipId || isWater(from) || !walkable(state, from)) return targets;
  const before = new Map(), seen = new Set([fromKey]), queue = [fromKey];
  for (let head = 0; head < queue.length && head < 8000; head++) {
    const key = queue[head];
    for (const next of nextTo(state.tiles[key])) {
      const tile = state.tiles[next];
      if (!tile?.discovered || tile.shipId || tile.bridgeId || next === fromKey) continue;
      if (!isWater(tile)) {
        if (key === fromKey || !walkable(state, tile) || targets.has(next)) continue;
        const path = [key];
        while (path[0] !== fromKey) path.unshift(before.get(path[0]));
        targets.set(next, [...path, next]);
      } else if (waterOwner(state, tile) === id && !seen.has(next)) {
        seen.add(next); before.set(next, key); queue.push(next);
      }
    }
  }
  return targets;
}

export function bridgePlan(state, fromKey, toKey, constructionFactor = 1, id = state.playerId) {
  const from = state.tiles[fromKey], to = state.tiles[toKey];
  const existing = Object.values(state.campaign?.bridges || {}).some(b =>
    b.fromKey === fromKey && b.toKey === toKey || b.fromKey === toKey && b.toKey === fromKey);
  const invalid = !from?.discovered || from.ownerId !== id || from.shipId || isWater(from) || !walkable(state, from)
    || !to?.discovered || toKey === fromKey || to.shipId || isWater(to) || !walkable(state, to);
  const path = invalid || existing ? [] : bridgePlans(state, fromKey, id).get(toKey) || [];
  const length = Math.max(0, path.length - 2), multiplier = length ? BRIDGE_RULES.growth ** (length - 1) : 0;
  const base = BRIDGE_RULES.baseGold * multiplier, computed = Math.ceil(base * constructionFactor);
  const safe = Number.isSafeInteger(computed) && computed >= 0 && Number.isFinite(constructionFactor) && constructionFactor > 0;
  const cost = { ap: BRIDGE_RULES.ap, gold: safe ? computed : Number.MAX_SAFE_INTEGER, supply: 0 };
  const reason = invalid ? F.bridge_invalid : existing ? F.bridge_existing : !length ? F.bridge_path : !safe ? F.bridge_long : '';
  return { fromKey, toKey, path, length, enabled: !reason, reason, cost,
    pricing: { base: BRIDGE_RULES.baseGold, length, lengthMultiplier: multiplier, constructionFactor },
    action: { type: 'buildBridge', fromKey, toKey, expectedRevision: state.revision } };
}

/** Called at action boundaries, including falls of governments. Ships never carry sovereignty with them. */
export function reconcileWater(state) {
  for (const tile of Object.values(state.tiles)) {
    if (tile.bridgeId) {
      if (tile.ownerId) tile.waterOwnerId = tile.ownerId; else delete tile.waterOwnerId;
    } else if (tile.waterOwnerId && !state.factions[tile.waterOwnerId]?.alive) {
      if (!tile.shipId) tile.ownerId = null;
      delete tile.waterOwnerId;
    } else if (tile.waterOwnerId && !tile.shipId) {
      tile.ownerId = tile.waterOwnerId;
    }
  }
}

/** Additive validation: worlds without water claims or bridge records are unchanged. */
export function waterErrors(state) {
  const errors = [], bridges = state.campaign?.bridges;
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  if (bridges !== undefined && (!object(bridges) || Object.keys(bridges).length > 8000)) return ['campaign.bridges'];
  if (state.campaign?.bridgeSeq !== undefined && (!Number.isSafeInteger(state.campaign.bridgeSeq) || state.campaign.bridgeSeq < 0)) errors.push('campaign.bridgeSeq');
  const used = new Set();
  for (const [id, bridge] of Object.entries(bridges || {})) {
    if (!object(bridge) || bridge.id !== id || !/^bridge\.\d+$/.test(id) || !state.factions[bridge.ownerId]
      || !Array.isArray(bridge.path) || bridge.path.length < 3 || bridge.path.length > 8000
      || new Set(bridge.path).size !== bridge.path.length || bridge.fromKey !== bridge.path[0] || bridge.toKey !== bridge.path.at(-1)
      || bridge.length !== bridge.path.length - 2 || !Number.isSafeInteger(bridge.gold) || bridge.gold < 0
      || !Number.isInteger(bridge.builtTurn) || bridge.builtTurn < 1 || bridge.builtTurn > state.turn
      || Number(id.slice(7)) > (state.campaign.bridgeSeq || 0)) { errors.push('campaign.bridge'); continue; }
    for (let i = 0; i < bridge.path.length; i++) {
      const key = bridge.path[i], tile = state.tiles[key];
      if (!tile || i && !nextTo(state.tiles[bridge.path[i - 1]]).includes(key)) { errors.push('campaign.bridgePath'); break; }
      if (i === 0 || i === bridge.path.length - 1) {
        if (isWater(tile) || !state.terrainTypes[tile.terrainId]?.passable) errors.push('campaign.bridgeBank');
      } else {
        if (used.has(key) || !isWater(tile) || tile.bridgeId !== id || tile.shipId || tile.building) errors.push('campaign.bridgeCell');
        used.add(key);
      }
    }
  }
  for (const tile of Object.values(state.tiles)) {
    if (tile.bridgeId !== undefined && (!used.has(tile.key) || !bridges?.[tile.bridgeId])) errors.push('campaign.bridgeReference');
    if (tile.waterOwnerId === undefined) continue;
    if (!isWater(tile) || !state.factions[tile.waterOwnerId] || !tile.discovered
      || !tile.shipId && !tile.bridgeId && (tile.ownerId !== tile.waterOwnerId || tile.troops || tile.field.length || tile.garrison.length || tile.building))
      errors.push('campaign.waterClaim');
  }
  return errors;
}

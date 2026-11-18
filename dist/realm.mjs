import {SHIP_MODELS} from './transport.mjs?v=1118-1603';
import {C} from './campaign-copy.mjs?v=1118-1603';
import { techEffect } from './techtree.mjs?v=1118-1603';
import { dutyGrowth } from './duties.mjs?v=1118-1603';
import { walkable } from './waters.mjs?v=1118-1603';
// Pure rules about land: how many people a tile holds, what they produce and how far they walk.
import { BUILDINGS, TERRAIN_DEFINITIONS } from './content.mjs?v=1118-1603';

export const MAX_SEATS = 6, MARCH_BUDGET = 3, CUT_GRACE = 2, MIGRANTS = 2, MIN_SOURCE = 3, MIN_BUILD = 3;
const STEPS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
const nextTo = tile => STEPS.map(([dq, dr]) => `${tile.q + dq},${tile.r + dr}`);

/** Rich farmland houses many, rugged land few; the capital and buildings add room. */
export function housingOf(state, tile) {
  if(tile.shipId)return SHIP_MODELS[state.campaign.ships[tile.shipId]?.modelId]?.capacity||8;
  if (tile.bridgeId || !walkable(state, tile)) return 0;
  const terrain = state.terrainTypes[tile.terrainId], level = tile.building ? tile.buildingLevel || 1 : 0;
  const land = Math.max(4, 6 + 2 * terrain.yield.supply - terrain.defense);
  const built = tile.building === 'farm' ? 2 * level : tile.building === 'fort' ? 2 * level : level;
  return land + (tile.isCapital ? 6 : 0) + built + (tile.ownerId ? Math.round(techEffect(state, 'housing', tile.ownerId)) : 0);
}
/** 补给上限: how many people a tile can keep fed where they stand. The land and what is built on it set the local
 * figure, a road or a fort brings more in, and every girl on the tile comes with a squad's worth of baggage.
 * Nothing may be marched, rallied or mustered in above it; whoever ends up above it anyway drifts home. */
export const SUPPLY_RULES = Object.freeze({ land: 16, perHousing: 2, road: 8, fort: 8, capital: 20, girl: 10, girls: 6, max: 100, drift: 5 });
const girlsHere = tile => new Set([...(tile.garrison || []), ...(tile.field || [])]).size;
/** The limit itemised, for the screen: [{ id, label, value }]. `girls` overrides who is counted (an army about to arrive). */
export function supplyParts(state, tile, girls = girlsHere(tile)) {
  if(tile.shipId)return [{id:'ship',label:C.capacity,value:Math.max(0,(SHIP_MODELS[state.campaign.ships[tile.shipId]?.modelId]?.capacity||8)-girls)}];
  const level = tile.building === 'fort' ? tile.buildingLevel || 1 : 0, led = Math.max(0, Math.min(SUPPLY_RULES.girls, girls));
  return [
    { id: 'land', label: '地力与住房', value: SUPPLY_RULES.land + SUPPLY_RULES.perHousing * housingOf(state, tile) },
    ...(tile.road ? [{ id: 'road', label: '道路', value: SUPPLY_RULES.road }] : []),
    ...(level ? [{ id: 'fort', label: `要塞 Lv ${level}`, value: SUPPLY_RULES.fort * level }] : []),
    ...(tile.isCapital ? [{ id: 'capital', label: '首都', value: SUPPLY_RULES.capital }] : []),
    ...(tile.ownerId && techEffect(state, 'supplyCap', tile.ownerId) ? [{ id: 'tech', label: '科技', value: Math.round(techEffect(state, 'supplyCap', tile.ownerId)) }] : []),
    ...(led ? [{ id: 'girls', label: `同伴 ${led} 人`, value: SUPPLY_RULES.girl * led }] : []),
  ];
}
export function supplyLimit(state, tile, girls) {
  return Math.min(SUPPLY_RULES.max, supplyParts(state, tile, girls).reduce((sum, part) => sum + part.value, 0));
}
/** How many more people fit; `arriving` girls are counted on top of the ones already here. */
export function supplyRoom(state, tile, arriving = 0) {
  return Math.max(0, supplyLimit(state, tile, girlsHere(tile) + arriving) - tile.troops);
}
/** Tonight's walk home from an overfull tile: a fifth of the surplus (at least one) spreads over the nearest
 * connected own land that still has room, ring by ring. Nobody is lost; with nowhere to go they stay put.
 * Returns how many left. */
export function easeTile(state, tile) {
  const over = tile.troops - supplyLimit(state, tile);
  if (over <= 0 || !tile.ownerId || tile.cutSince !== undefined) return 0;
  let left = Math.ceil(over / SUPPLY_RULES.drift);
  const seen = new Set([tile.key]), queue = [tile];
  for (let head = 0; head < queue.length && left > 0 && seen.size <= 90; head++) {
    for (const key of nextTo(queue[head]).sort()) {
      const near = state.tiles[key];
      if (seen.has(key) || near?.ownerId !== tile.ownerId || near.cutSince !== undefined || !near.shipId && !walkable(state, near)) continue;
      seen.add(key); queue.push(near);
      const taken = Math.min(left, supplyRoom(state, near));
      if (taken > 0) { near.troops += taken; left -= taken; }
      if (!left) break;
    }
  }
  const gone = Math.ceil(over / SUPPLY_RULES.drift) - left;
  tile.troops -= gone;
  return gone;
}
/** People a tile needs before it produces at full strength. */
export function handsNeeded(tile) { return tile.bridgeId ? 0 : BUILDINGS[tile.building]?.minHands ?? (2 + 2 * (tile.building ? tile.buildingLevel || 1 : 0) + (tile.isCapital ? 2 : 0)); }
export const marchCost = (state, tile) => tile.road ? 0.5 : 1 + Math.floor(state.terrainTypes[tile.terrainId].defense / 2);
export const growthTarget = people => 5 + 2 * people;
/** Food per turn into a tile's store: its own harvest plus any farm next door. */
export function growthGain(state, tile, harvest) {
  if (tile.bridgeId || !walkable(state, tile)) return 0;
  let gain = 1 + Math.max(0, harvest);
  for (const key of nextTo(tile)) { const near = state.tiles[key]; if (near?.ownerId === tile.ownerId && near.building === 'farm') gain += near.buildingLevel || 1; }
  gain += dutyGrowth(state, tile); // 差事·征募
  return tile.ownerId ? Math.round(gain * (1 + techEffect(state, 'growth', tile.ownerId))) : gain;
}
/** A nation's land split into pieces that touch each other. */
export function partsOf(state, factionId) {
  const left = new Map(Object.values(state.tiles).filter(tile => tile.ownerId === factionId && !tile.shipId && walkable(state, tile)).map(tile => [tile.key, tile])), parts = [];
  while (left.size) {
    const [first] = left.values(), part = [], stack = [first];
    left.delete(first.key);
    while (stack.length) {
      const tile = stack.pop();
      part.push(tile);
      for (const key of nextTo(tile)) if (left.has(key)) { stack.push(left.get(key)); left.delete(key); }
    }
    parts.push(part);
  }
  return parts;
}
export function sameLand(state, a, b) {
  if (!a || !b || a.ownerId !== b.ownerId) return false;
  return partsOf(state, a.ownerId).some(part => part.includes(a) && part.includes(b));
}
/** Own tiles an army can reach this turn, walking only through its own land. */
export function marchReach(state, fromKey, factionId = state.tiles[fromKey]?.ownerId, budget = MARCH_BUDGET) {
  const from = state.tiles[fromKey], cost = new Map([[fromKey, 0]]), queue = [fromKey];
  if (!from || from.shipId || !walkable(state, from)) return {};
  while (queue.length) {
    queue.sort((a, b) => cost.get(a) - cost.get(b));
    const key = queue.shift(), tile = state.tiles[key];
    for (const next of nextTo(tile)) {
      const near = state.tiles[next];
      if (near?.ownerId !== factionId || near.shipId || !walkable(state, near)) continue;
      const total = cost.get(key) + marchCost(state, near);
      if (total > budget || total >= (cost.get(next) ?? Infinity)) continue;
      cost.set(next, total); queue.push(next);
    }
  }
  cost.delete(fromKey);
  return Object.fromEntries(cost);
}
/** The cheapest walk between two of a nation's tiles through its own land, cut into the turns it takes.
 * `stops` are where the army rests each night; the last one is the destination. Null when the two
 * tiles are not joined by that nation's land. A prefix of a cheapest path is itself cheapest, so each
 * stop is inside what marchReach allows from the stop before it. */
export function marchRoute(state, fromKey, toKey, factionId = state.tiles[fromKey]?.ownerId, budget = MARCH_BUDGET) {
  const from = state.tiles[fromKey], to = state.tiles[toKey];
  if (!from || !to || fromKey === toKey || from.ownerId !== factionId || to.ownerId !== factionId || from.shipId || to.shipId || !walkable(state, from) || !walkable(state, to)) return null;
  const cost = new Map([[fromKey, 0]]), before = new Map(), settled = new Set(), heap = [[0, 0, fromKey]];
  let serial = 0;
  const push = item => { heap.push(item); let i = heap.length - 1; while (i > 0) { const up = (i - 1) >> 1; if (heap[up][0] < item[0] || (heap[up][0] === item[0] && heap[up][1] < item[1])) break; heap[i] = heap[up]; i = up; } heap[i] = item; };
  const pop = () => {
    const top = heap[0], last = heap.pop();
    if (heap.length) { let i = 0; for (;;) { let child = i * 2 + 1; if (child >= heap.length) break; if (child + 1 < heap.length && (heap[child + 1][0] < heap[child][0] || (heap[child + 1][0] === heap[child][0] && heap[child + 1][1] < heap[child][1]))) child++; if (last[0] < heap[child][0] || (last[0] === heap[child][0] && last[1] < heap[child][1])) break; heap[i] = heap[child]; i = child; } heap[i] = last; }
    return top;
  };
  while (heap.length) {
    const [, , key] = pop();
    if (settled.has(key)) continue;
    settled.add(key);
    if (key === toKey) break;
    for (const next of nextTo(state.tiles[key])) {
      const near = state.tiles[next];
      if (near?.ownerId !== factionId || near.shipId || settled.has(next) || !walkable(state, near)) continue;
      const total = cost.get(key) + marchCost(state, near);
      if (total >= (cost.get(next) ?? Infinity)) continue;
      cost.set(next, total); before.set(next, key); push([total, ++serial, next]);
    }
  }
  if (!settled.has(toKey)) return null;
  const path = [toKey];
  while (path[0] !== fromKey) path.unshift(before.get(path[0]));
  const stops = [];
  let spent = 0;
  for (let i = 1; i < path.length; i++) {
    const step = marchCost(state, state.tiles[path[i]]);
    if (spent + step > budget && spent > 0) { stops.push(path[i - 1]); spent = 0; }
    spent += step;
  }
  stops.push(toKey);
  return { path, cost: cost.get(toKey), stops, turns: stops.length };
}
export const buildingOf = tile => BUILDINGS[tile.building] || null;

/** Shared construction terrain authority. Mod land keeps the existing unrestricted rule. */
export function canBuildOnTerrain(tile, id) {
  if (tile.bridgeId) return false;
  const building = BUILDINGS[id];
  return Boolean(building) && (!building.terrains || building.terrains.includes(tile.terrainId) || !TERRAIN_DEFINITIONS.some(terrain => terrain.id === tile.terrainId));
}


/** Reverse Dijkstra: sources that can reach a target, using forward destination terrain costs. */
export function marchSources(state, toKey, factionId = state.tiles[toKey]?.ownerId, budget = MARCH_BUDGET) {
  const target = state.tiles[toKey]; if (!target || target.ownerId !== factionId || !walkable(state, target)) return {};
  const cost = new Map([[toKey, 0]]), queue = [toKey];
  while (queue.length) {
    queue.sort((a, b) => cost.get(a) - cost.get(b));
    const key = queue.shift(), tile = state.tiles[key];
    for (const next of nextTo(tile)) {
      const near = state.tiles[next]; if (near?.ownerId !== factionId || near.shipId || !walkable(state, near)) continue;
      const total = cost.get(key) + marchCost(state, tile);
      if (total > budget || total >= (cost.get(next) ?? Infinity)) continue;
      cost.set(next, total); queue.push(next);
    }
  }
  cost.delete(toKey); return Object.fromEntries(cost);
}

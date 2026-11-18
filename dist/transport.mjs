// Vehicles are assets in their own right. Ships are moving tiles; planes live in airport inventories.
import { C, say } from './campaign-copy.mjs?v=1118-1603';
import { CHARACTER_MOBILITY } from './character-mobility.mjs?v=1118-1603';
import { techEffect } from './techtree.mjs?v=1118-1603';
import { walkable } from './waters.mjs?v=1118-1603';
const directions = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
const near = tile => directions.map(([q, r]) => `${tile.q + q},${tile.r + r}`);
const distance = (a, b) => Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.q + a.r - b.q - b.r));
const has = (state, id, owner = state.playerId) => state.campaign?.research?.[owner]?.known?.includes(id);
const relation = (state, a, b) => state.relations?.[[a, b].sort().join('|')]?.status;
const charactersAt = tile => [...(tile?.field || []), ...(tile?.garrison || [])];
export const AIRCRAFT_MODELS = Object.freeze({
  lightPlane: { id: 'lightPlane', name: C.lightPlaneName, description: C.lightPlaneDesc, tech: 'aeronautics', speed: 7, attack: 2, defense: 4, gold: 80, supply: 5 },
  fighter: { id: 'fighter', name: C.fighterName, description: C.fighterDesc, tech: 'fighters', also: 'aeronautics', speed: 9, attack: 4, defense: 6, gold: 160, supply: 10 },
  longRangePlane: { id: 'longRangePlane', name: C.longRangePlaneName, description: C.longRangePlaneDesc, tech: 'telecom', speed: 12, attack: 3, defense: 5, gold: 240, supply: 15 },
});
export const SHIP_MODELS = Object.freeze({
  cutter: { id: 'cutter', name: C.cutterName, description: C.cutterDesc, tech: 'shipbuilding', speed: 5, capacity: 8, gold: 120, supply: 12 },
  transportShip: { id: 'transportShip', name: C.transportShipName, description: C.transportShipDesc, tech: 'combustion', also: 'shipbuilding', speed: 6, capacity: 24, gold: 260, supply: 24 },
  liner: { id: 'liner', name: C.linerName, description: C.linerDesc, tech: 'logistics', also: 'shipbuilding', speed: 7, capacity: 48, gold: 520, supply: 40 },
});
/** A ship's speed: its model, plus 远洋航运 and the great lighthouse. */
export const shipSpeed = (state, ship) => (SHIP_MODELS[ship?.modelId]?.speed || 5) + Math.round(techEffect(state, 'seaSpeed', ship?.ownerId));
/** A plane's speed in the air: its model plus 战斗机 doctrine. */
export const planeSpeed = (state, ownerId, modelId) => (AIRCRAFT_MODELS[modelId]?.speed || 7) + Math.round(techEffect(state, 'airSpeed', ownerId));
export function migrateTransport(state) {
  const c = state.campaign;
  c.planes ||= {}; c.ships ||= {}; c.flights ||= {}; c.airportGuests ||= {};
  c.planeSeq ??= 0; c.shipSeq ??= 0; c.flightSeq ??= 0;
}
export function usableAirport(state, key, ownerId = state.playerId) {
  const tile = state.tiles[key];
  return Boolean(tile?.building === 'airfield' && tile.ownerId && state.factions[tile.ownerId]?.alive && (tile.ownerId === ownerId || ['ally', 'vassal'].includes(relation(state, ownerId, tile.ownerId))));
}
export const parkedPlanes = (state, key, ownerId = state.playerId) => Object.values(state.campaign.planes).filter(plane => plane.airportKey === key && plane.ownerId === ownerId && !plane.flightId);
export function flightSite(state, id) {
  const f = state.campaign.flights[id];
  return f ? { ...f, field: f.pilotIds, garrison: [], troops: 0, terrainId: 'ocean', isCapital: false, building: null, militaryReserve: true, militaryReadyTurn: 0 } : null;
}
export function aircraftQuote(state, key, modelId, count = 1) {
  const model = AIRCRAFT_MODELS[modelId], tile = state.tiles[key], faction = state.factions[state.playerId], prices = state.campaign.economies[state.playerId]?.prices || 100;
  const cost = { ap: 2, gold: model && Number.isInteger(count) ? Math.ceil(model.gold * count * Math.max(1, prices / 100) * techEffect(state, 'vehicleCost', state.playerId)) : 0, supply: (model?.supply || 0) * count };
  const reason = !model || !Number.isInteger(count) || count < 1 || count > 12 || Object.keys(state.campaign.planes).length + count > 1000 ? C.invalidAction
    : tile?.ownerId !== state.playerId || tile.building !== 'airfield' || !has(state, model.tech) || model.also && !has(state, model.also) ? C.vehicleLocked
    : state.ap < 2 || faction.gold < cost.gold || faction.supply < cost.supply ? say('transportPurchase', { name: model.name, ...cost }) : '';
  return { model, count, key, enabled: !reason, reason, cost, action: { type: 'buyAircraft', key, modelId, count } };
}
export function shipQuote(state, key, modelId, launchKey = null) {
  const model = SHIP_MODELS[modelId], tile = state.tiles[key], prices = state.campaign.economies[state.playerId]?.prices || 100;
  const water = tile ? near(tile).map(k => state.tiles[k]).filter(t => t?.terrainId === 'ocean' && !t.shipId && !t.bridgeId && (!t.ownerId || t.waterOwnerId === state.playerId)) : [];
  const target = water.find(t => t.key === launchKey) || (!launchKey ? water[0] : null);
  const cost = { ap: 2, gold: Math.ceil((model?.gold || 0) * Math.max(1, prices / 100) * techEffect(state, 'vehicleCost', state.playerId)), supply: model?.supply || 0 };
  const faction = state.factions[state.playerId];
  const reason = !model || Object.keys(state.campaign.ships).length>=1000 || tile?.ownerId !== state.playerId || tile.building !== 'shipyard' || !has(state, model.tech) || model.also && !has(state, model.also) ? C.shipNotReady
    : !target ? C.shipOcean : state.ap < 2 || faction.gold < cost.gold || faction.supply < cost.supply ? say('transportPurchase', { name: model.name, ...cost }) : '';
  return { model, key, launchKey: target?.key || null, enabled: !reason, reason, cost, action: { type: 'buildShip', key, modelId, launchKey: target?.key } };
}
export function canPassCanal(state, tile, ownerId = state.playerId) {
  const canal = state.campaign?.canals?.[tile?.key];
  if (!tile?.discovered || canal?.status !== 'open' || tile.cutSince !== undefined) return false;
  return !tile.ownerId || tile.ownerId === ownerId || relation(state, ownerId, tile.ownerId) !== 'war';
}
export function shipRoute(state, shipId, toKey) {
  const ship = state.campaign.ships[shipId], start = state.tiles[ship?.key], goal = state.tiles[toKey];
  if (!ship || !start || goal?.terrainId !== 'ocean' || !goal.discovered || goal.bridgeId) return null;
  const before = new Map(), seen = new Set([start.key]), queue = [start.key];
  for (let i = 0; i < queue.length && queue.length <= 8000; i++) {
    const key = queue[i], cur = state.tiles[key]; if (key === toKey) break;
    for (const next of near(cur)) {
      const tile = state.tiles[next];
      const isCanal = tile?.terrainId !== 'ocean' && canPassCanal(state, tile, ship.ownerId);
      if (!tile?.discovered || tile.bridgeId || (tile.terrainId !== 'ocean' && !isCanal) || seen.has(next)) continue;
      if (isCanal && (next === toKey || cur.terrainId !== 'ocean')) continue;
      if (tile.shipId && (next !== toKey || cur.terrainId !== 'ocean')) continue;
      if (tile.shipId && next === toKey && (tile.ownerId === ship.ownerId || relation(state, ship.ownerId, tile.ownerId) !== 'war')) continue;
      seen.add(next); before.set(next, key); queue.push(next);
    }
  }
  if (!seen.has(toKey)) return null;
  const path = [toKey]; while (path[0] !== start.key) path.unshift(before.get(path[0]));
  return { path, turns: Math.ceil((path.length - 1) / shipSpeed(state, ship)) };
}
export function boardQuote(state, shipId, shoreKey, ids = [], troops = 0, unload = false) {
  const ship = state.campaign.ships[shipId], boat = state.tiles[ship?.key], shore = state.tiles[shoreKey], from = unload ? boat : shore, to = unload ? shore : boat, model = SHIP_MODELS[ship?.modelId];
  const people = (boat?.troops || 0) + charactersAt(boat).length, count = troops + ids.length;
  const reason = !ship || ship.ownerId !== state.playerId || !shore || shore.ownerId !== state.playerId || !walkable(state, shore) || distance(boat, shore) !== 1 ? C.shipCoast
    : !Array.isArray(ids) || ids.length > 1000 || new Set(ids).size !== ids.length || !Number.isInteger(troops) || troops < 0 || troops > Math.max(0, (from?.troops || 0) - (unload ? 0 : 1)) || !count || ids.some(id => !charactersAt(from).includes(id) || state.captives[id] || state.campaign.prison[id] || (Array.isArray(state.wall) && state.wall.some(e => e?.id === id)) || Object.values(state.posts).includes(id) || Object.values(state.envoys).includes(id) || Object.values(state.campaign.cities).some(city => city.mayorId === id)) ? C.invalidAction
    : !unload && people + count > model.capacity ? C.shipFull : unload && to.troops + troops > 100 ? C.shipFull : '';
  return { enabled: !reason, reason, shipId, shoreKey, ids, troops, unload, capacity: model?.capacity || 0, people, cost: { ap: 0, gold: 0, supply: 0 }, action: { type: unload ? 'disembarkShip' : 'boardShip', shipId, shoreKey, characterIds: ids, troops } };
}
export function flightPath(state, fromKey, toKey) {
  const from = state.tiles[fromKey], to = state.tiles[toKey]; if (!from || !to) return null;
  const path = [fromKey]; let here = from;
  while (here.key !== toKey && path.length <= 10000) {
    const candidates = near(here).map(k => state.tiles[k]).filter(t => t && distance(t, to) < distance(here, to));
    candidates.sort((a, b) => distance(a, to) - distance(b, to) || a.key.localeCompare(b.key));
    if (!candidates[0]) return null;
    here = candidates[0]; path.push(here.key);
  }
  return path.at(-1) === toKey ? path : null;
}
export function flightQuote(state, fromKey, toKey, pilotIds = [], planeIds = [], native = false, mobility = () => false, loiter = false) {
  const from = state.tiles[fromKey], to = state.tiles[toKey], c = state.campaign;
  const atSource=[...charactersAt(from),...(c.airportGuests[fromKey]||[])];
  const validPilots = Array.isArray(pilotIds) && pilotIds.length > 0 && pilotIds.length <= 6 && new Set(pilotIds).size === pilotIds.length && pilotIds.every(id => atSource.includes(id) && state.characterOwners[id] === state.playerId && !state.captives[id] && !c.prison[id] && !(Array.isArray(state.wall) && state.wall.some(e => e?.id === id)) && state.growth[id]?.movedTurn !== state.turn && !Object.values(state.posts).includes(id) && !Object.values(state.envoys).includes(id) && !Object.values(c.cities).some(city => city.mayorId === id));
  const validPlanes = Array.isArray(planeIds) && planeIds.length === pilotIds.length && new Set(planeIds).size === planeIds.length && planeIds.every(id => c.planes[id]?.airportKey === fromKey && c.planes[id]?.ownerId === state.playerId && !c.planes[id].flightId);
  const path = from && to ? flightPath(state, fromKey, toKey) : null;
  const reason = !validPilots || typeof loiter !== 'boolean' || (!native&&!usableAirport(state,fromKey)||native&&from?.ownerId!==state.playerId) || fromKey === toKey ? C.planeChoose
    : native && (planeIds.length || pilotIds.some(id => !mobility(id))) || !native && !validPlanes ? C.planeUnavailable
      : loiter ? !to?.discovered ? C.objectiveInvalid : ''
        : native ? !to || to.ownerId !== state.playerId || !state.terrainTypes[to.terrainId]?.passable ? C.airportUnavailable : ''
          : !usableAirport(state, toKey) ? C.airportUnavailable : '';
  const speed = (native ? 7 : Math.min(...planeIds.map(id => AIRCRAFT_MODELS[c.planes[id]?.modelId]?.speed || 7))) + Math.round(techEffect(state, 'airSpeed', state.playerId)), cost = { ap: 0, gold: 0, supply: pilotIds.length };
  const block = reason || (!path ? C.objectiveInvalid : state.factions[state.playerId].supply < cost.supply ? C.vehicleLocked : '');
  return { enabled: !block, reason: block, path: path || [], speed, turns: path ? Math.ceil((path.length - 1) / speed) : 0, cost, action: { type: native ? 'launchNativeFlight' : 'launchFlight', fromKey, toKey, pilotIds, planeIds, loiter } };
}
export function transportBudget(state, ownerId) {
  const planes = Object.values(state.campaign?.planes || {}).filter(p => p.ownerId === ownerId).length, ships = Object.values(state.campaign?.ships || {}).filter(s => s.ownerId === ownerId).length;
  const troops = Object.values(state.campaign?.ships || {}).filter(s => s.ownerId === ownerId).reduce((sum, s) => sum + (state.tiles[s.key]?.troops || 0), 0);
  return { gold: ships * 2 + planes, supply: ships + Math.ceil(troops / 4) };
}
export function transportErrors(state) {
  const c = state.campaign, errors = [], object = v => v && typeof v === 'object' && !Array.isArray(v), occupied = new Set(), pilots = new Set(), guests = new Set();
  if (!object(c.planes) || !object(c.ships) || !object(c.flights) || !object(c.airportGuests) || ['planeSeq', 'shipSeq', 'flightSeq'].some(k => !Number.isSafeInteger(c[k]) || c[k] < 0) || Object.keys(c.planes).length > 1000 || Object.keys(c.ships).length > 1000 || Object.keys(c.flights).length > 1000) return ['transport.inventory'];
  for (const [key, ids] of Object.entries(c.airportGuests)) {
    if (!state.tiles[key] || !Array.isArray(ids)) { errors.push('transport.guests'); continue; }
    for (const id of ids) {
      if (!state.characters[id] || state.captives[id] || c.prison[id] || guests.has(id) || !usableAirport(state,key,state.characterOwners[id]) || Object.values(state.tiles).some(t=>charactersAt(t).includes(id))) errors.push('transport.guests');
      guests.add(id);
    }
  }
  for (const [id, p] of Object.entries(c.planes)) {
    if (!p || p.id !== id || !AIRCRAFT_MODELS[p.modelId] || !state.factions[p.ownerId] || (p.flightId ? !c.flights[p.flightId]?.planeIds.includes(id) || p.airportKey !== null : !state.tiles[p.airportKey])) errors.push('transport.plane');
  }
  for (const [id, s] of Object.entries(c.ships)) {
    const tile = state.tiles[s.key], model = SHIP_MODELS[s.modelId];
    if (!s || s.id !== id || !model || !state.factions[s.ownerId]?.alive || !['main','free'].includes(s.mode) || !Number.isInteger(s.movedTurn) || s.movedTurn<0 || s.movedTurn>state.turn || !tile || tile.shipId !== id || tile.terrainId !== 'ocean' || tile.ownerId !== s.ownerId || occupied.has(s.key) || tile.troops + charactersAt(tile).length > model.capacity || s.goal && !state.tiles[s.goal]) errors.push('transport.ship');
    occupied.add(s.key);
  }
  for (const [id, f] of Object.entries(c.flights)) {
    if (!f || f.id !== id || !state.factions[f.ownerId] || !state.tiles[f.key] || !state.tiles[f.fromKey] || !state.tiles[f.toKey] || !Array.isArray(f.path) || f.path.length > 10000 || f.path.some(k => !state.tiles[k]) || !Number.isInteger(f.cursor) || f.cursor < 0 || f.cursor >= f.path.length || f.path[f.cursor] !== f.key || !Array.isArray(f.pilotIds) || !Array.isArray(f.planeIds) || f.pilotIds.length > 6 || !f.pilotIds.length || !f.native && f.pilotIds.length !== f.planeIds.length) { errors.push('transport.flight'); continue; }
    for (const pilot of f.pilotIds) {
      if (!state.characters[pilot] || state.characterOwners[pilot] !== f.ownerId || state.captives[pilot] || c.prison[pilot] || pilots.has(pilot) || guests.has(pilot) || Object.values(state.tiles).some(t => charactersAt(t).includes(pilot))) errors.push('transport.pilot');
      pilots.add(pilot);
    }
    if (!f.native && f.planeIds.some(pid => c.planes[pid]?.flightId !== id || c.planes[pid]?.ownerId !== f.ownerId)) errors.push('transport.flightPlanes');
    if(f.native&&f.pilotIds.some(id=>!CHARACTER_MOBILITY[id]?.canFly&&!CHARACTER_MOBILITY[id]?.equipmentFly))errors.push('transport.nativeFlight');
    const speed=f.native?7:Math.min(...f.planeIds.map(pid=>AIRCRAFT_MODELS[c.planes[pid]?.modelId]?.speed||0)),boost=Number.isInteger(f.speed)?f.speed-speed:-1;
    if(typeof f.native!=='boolean'||f.loiter!==undefined&&typeof f.loiter!=='boolean'||f.native&&f.planeIds.length||new Set(f.planeIds).size!==f.planeIds.length||boost<0||boost>2||!Number.isInteger(f.lastMoveTurn)||f.lastMoveTurn<0||f.lastMoveTurn>state.turn||f.foughtTurn!==undefined&&(!Number.isInteger(f.foughtTurn)||f.foughtTurn<1||f.foughtTurn>state.turn)||f.path.some((key,i)=>i>0&&distance(state.tiles[key],state.tiles[f.path[i-1]])!==1))errors.push('transport.flightPath');
  }
  for (const tile of Object.values(state.tiles)) if (tile.shipId && c.ships[tile.shipId]?.key !== tile.key) errors.push('transport.shipTile');
  return errors;
}

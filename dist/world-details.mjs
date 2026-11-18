// New-world selection and small, read-only aftermath summaries. This module never
// changes ownership, growth, history, saves, or a UI queue.
import { getCaptiveStatus, isOnParole } from './captivity.mjs?v=1118-1603';

const count = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
const colorOf = faction => /^#[0-9a-f]{6}$/i.test(faction?.color || '') ? faction.color : '#a5b8bd';
const INVOLVING_ACTIONS = new Set(['attack', 'finishBattle', 'endTurn']);
function seededChoice(seed, factionId, length) {
  let value = 2166136261;
  for (const char of `${seed}|new-world-representative|${factionId}`) {
    value ^= char.codePointAt(0); value = Math.imul(value, 16777619);
  }
  value ^= value >>> 16; value = Math.imul(value, 0x7feb352d); value ^= value >>> 15;
  return Math.floor((value >>> 0) / 4294967296 * length);
}

/** Only createGame applies this map. A representative is an existing available
 * member, not permission to recruit a wanderer, move a unit, or change a save. */
export function selectNpcRepresentatives(state) {
  const selected = {};
  for (const faction of Object.values(state.factions || {}).sort((a, b) => a.id.localeCompare(b.id))) {
    if (faction.id === state.playerId || faction.isPlayer || !faction.alive) continue;
    const available = Object.keys(state.characters || {}).filter(id => state.characterOwners?.[id] === faction.id
      && !state.captives?.[id] && !isOnParole(state, id)).sort();
    if (available.length) selected[faction.id] = available[seededChoice(state.seed, faction.id, available.length)];
  }
  return selected;
}

function captureContext(state, characterId) {
  const captive = state.captives?.[characterId], character = state.characters?.[characterId];
  if (!captive || !character || ![captive.captorId, captive.originalFactionId].includes(state.playerId)) return null;
  const captor = state.factions?.[captive.captorId], faction = state.factions?.[captive.originalFactionId];
  if (!captor || !faction) return null;
  const status = getCaptiveStatus(state, characterId);
  const latest = [...status.recentEvents].reverse().find(event => event.type === 'captured'
    && event.turn === captive.capturedTurn && event.captorId === captive.captorId
    && event.originalFactionId === captive.originalFactionId);
  // Legacy aggregate totals do not establish a prior escape or a prior captor.
  const recaptured = latest?.repeated === true, afterEscape = recaptured && latest?.afterEscape === true;
  return { captive, character, captor, faction, status, recaptured, afterEscape };
}

/** Plain text only. Historical escapes are mentioned only when the captivity
 * lifecycle recorded this exact capture as following a recent same-captor escape. */
export function getCaptureLines(state, characterId) {
  const context = captureContext(state, characterId);
  if (!context) return [];
  const { character, captor, captive, status, recaptured, afterEscape } = context;
  const lines = [`${character.name}被${captor.name}俘获。`];
  if (afterEscape) lines.push(`近期逃脱后又被同一国家俘获，当前再捕警戒 ${status.watch} 级；警戒会随时间和照护消退。`);
  else if (recaptured) lines.push(`双方已有过关押与交涉，这次再捕已记入履历。累计被俘 ${status.captures} 次。`);
  else if (status.captures > 1) lines.push(`履历累计被俘 ${status.captures} 次；本次关押单独记录。`);
  if (status.historyIncomplete) lines.push('旧履历不完整，仅保留已知次数与事件。');
  lines.push(captive.captorId === state.playerId
    ? '可在俘虏页查看交涉与遣返选择；被俘不会永久削减角色属性。'
    : '可在俘虏页查看赎回条件与看守情况；被俘不会永久削减角色属性。');
  return lines;
}

function fallContext(before, after, factionId) {
  const previous = before.factions?.[factionId], faction = after.factions?.[factionId];
  if (!previous?.alive || !faction || count(faction.defeats) <= count(previous.defeats)
    || !Number.isSafeInteger(faction.lastDefeatedTurn) || faction.lastDefeatedTurn < before.turn
    || faction.lastDefeatedTurn > after.turn) return null;
  const oldCapital = previous.capitalKey, oldTile = before.tiles?.[oldCapital], newTile = after.tiles?.[oldCapital];
  const conquerorId = oldTile?.ownerId === factionId && newTile?.ownerId && newTile.ownerId !== factionId
    && after.factions?.[newTile.ownerId] ? newTile.ownerId : null;
  if (factionId !== after.playerId && conquerorId !== after.playerId) return null;
  const returned = faction.alive && count(faction.revivals) > count(previous.revivals);
  if (faction.alive && !returned) return null;
  // Use the representative immediately BEFORE the fall, before members scatter.
  // An obsolete foreign-owned leader pointer never borrows that character back.
  const speakerId = before.characterOwners?.[previous.leaderId] === factionId
    && before.characters?.[previous.leaderId] ? previous.leaderId : null;
  return { previous, faction, conquerorId, returned, speakerId };
}

export function getFallLines(before, after, factionId) {
  const context = fallContext(before, after, factionId);
  if (!context) return [];
  const { previous, faction, conquerorId, returned } = context;
  const lines = [`${previous.name}暂时失去全部国土${conquerorId ? `，旧都由${after.factions[conquerorId].name}控制` : ''}。`];
  if (count(faction.defeats) > 1) lines.push(`这是这个国家记录中的第 ${faction.defeats} 次失国，先前的经历仍留在历史中。`);
  if (returned) lines.push(`幸存者已在 ${faction.capitalKey} 重建，人物与历史继续保留。`);
  else lines.push('人物与历史仍然保留；未被俘的成员散入雾海，之后仍可能相遇。');
  return lines;
}

/** A single committed action's aftermath, never an import/history backlog.
 * UI owners may combine these into one nonblocking report. Nothing is persisted. */
export function getWorldDetails(before, after, action = {}) {
  const empty = { captures: [], falls: [] };
  if (!before || !after || !INVOLVING_ACTIONS.has(action.type) || before === after
    || before.playerId !== after.playerId || before.seed !== after.seed
    || !Number.isSafeInteger(before.revision) || after.revision !== before.revision + 1
    || after.turn < before.turn || after.turn > before.turn + 1) return empty;
  const captures = [];
  for (const characterId of Object.keys(after.captives || {}).sort()) {
    const context = captureContext(after, characterId);
    if (!context) continue;
    const { captive, character, faction, status, recaptured, afterEscape } = context;
    const previousCaptures = getCaptiveStatus(before, characterId)?.captures || 0;
    if (status.captures <= previousCaptures || captive.capturedTurn < before.turn || captive.capturedTurn > after.turn) continue;
    captures.push({ kind: 'capture', id: `capture:${characterId}:${captive.captorId}:${captive.capturedTurn}:${captive.battleId}`,
      turn: captive.capturedTurn, characterId, factionId: captive.originalFactionId, captorId: captive.captorId,
      speakerId: characterId, speakerName: character.name, factionName: faction.name, color: colorOf(faction),
      title: `${character.name} · ${afterEscape ? '逃脱后再捕' : recaptured ? '再次被俘' : '被俘'}`,
      captures: status.captures, recaptured, afterEscape, historyIncomplete: status.historyIncomplete,
      lines: getCaptureLines(after, characterId) });
  }
  const falls = [];
  for (const factionId of Object.keys(after.factions || {}).sort()) {
    const context = fallContext(before, after, factionId);
    if (!context) continue;
    const { previous, faction, conquerorId, returned, speakerId } = context;
    falls.push({ kind: 'fall', id: `fall:${factionId}:${faction.defeats}:${faction.lastDefeatedTurn}`,
      turn: faction.lastDefeatedTurn, factionId, conquerorId, speakerId,
      speakerName: speakerId ? before.characters[speakerId].name : '常备军指挥部',
      factionName: previous.name, color: colorOf(previous), title: `${previous.name} · ${returned ? '流亡重建' : '暂时退场'}`,
      defeats: faction.defeats, returned, lines: getFallLines(before, after, factionId) });
  }
  return { captures, falls };
}

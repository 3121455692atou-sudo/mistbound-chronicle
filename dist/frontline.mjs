/** Read-only frontier facts and shortcuts. No AI intent, combat odds or world mutation. */
import { getActions, getMarch, getRallyPlan } from './engine.mjs?v=1118-1603';
import { marchSources } from './realm.mjs?v=1118-1603';
import { actionCost, departureReason } from './ui-model.mjs?v=1118-1603';

const STEPS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
const nearby = tile => STEPS.map(([q, r]) => `${tile.q + q},${tile.r + r}`);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

/** Discovery is checked before reading another tile's owner or forces. */
export function visibleWarNeighbors(state, key) {
  const tile = state.tiles?.[key];
  if (!tile?.discovered) return [];
  const neighbors = [];
  for (const nextKey of nearby(tile)) {
    const next = state.tiles[nextKey];
    if (!next?.discovered || !next.ownerId || next.ownerId === state.playerId) continue;
    const faction = state.factions[next.ownerId];
    if (!faction?.alive || state.relations?.[[state.playerId, faction.id].sort().join('|')]?.status !== 'war') continue;
    neighbors.push({ key: next.key, factionId: faction.id, name: faction.name, troops: next.troops,
      companions: (next.field?.length || 0) + (next.garrison?.length || 0) });
  }
  return neighbors.sort((a, b) => b.troops - a.troops || b.companions - a.companions || a.key.localeCompare(b.key));
}

/** The existing rally guard uses actual war borders. Do not echo its fog-dependent
 * availability or protection reasons in this new summary. The ordinary preview
 * remains reachable, but the compact summary makes no availability claim. */
function rallyTouchesFog(state, key) {
  return Object.keys(marchSources(state, key)).some(sourceKey => {
    const source = state.tiles[sourceKey];
    return !source?.discovered || nearby(source).some(nextKey => !state.tiles[nextKey]?.discovered);
  });
}

function rallyChoice(state, tile, supplied) {
  if (rallyTouchesFog(state, tile.key)) return { enabled: null, previewAvailable: true, reason: '打开集结预览，查看当前人数与条件。' };
  const quote = supplied || getRallyPlan(state, tile.key), effects = quote.effects || quote;
  // Never forward raw protectedSources, source names or protection reasons.
  const result = { enabled: quote.enabled, previewAvailable: quote.enabled || Boolean(effects.previewAvailable),
    troops: quote.enabled ? effects.troops : 0, cost: quote.cost };
  result.reason = quote.enabled ? '' : tile.troops >= 100 ? '本地已满 100 人。'
    : tile.cutSince !== undefined ? '本地失联，无法集中补给。'
    : (state.factions[state.playerId]?.supply || 0) < 1 ? '至少需要 1 补给。'
    : '当前没有可调的后方预备兵。';
  return result;
}

function moveChoice(state, tile) {
  const blocked = departureReason(state, tile) || (tile.troops < 1 ? '出发地须留守 1 名军士，当前无法行军。' : '');
  if (blocked) return { enabled: false, reason: blocked };
  const routes = getMarch(state, tile.key), candidates = Object.keys(routes)
    .filter(key => state.tiles[key]?.discovered && state.tiles[key].ownerId === state.playerId)
    .map(key => ({ key, war: visibleWarNeighbors(state, key).length, capacity: 100 - state.tiles[key].troops, route: routes[key] }))
    // This is a destination example, not a safety rating: prefer no known war
    // adjacency, then enough room, then a shorter route. Quotes decide legality.
    .sort((a, b) => Number(a.war > 0) - Number(b.war > 0)
      || Math.min(b.capacity, tile.troops - 1) - Math.min(a.capacity, tile.troops - 1)
      || a.route - b.route || a.key.localeCompare(b.key));
  for (const candidate of candidates) {
    // A full destination with no marching companion cannot fit a single soldier.
    if (candidate.capacity < 1 && !tile.field?.length) continue;
    const quote = getActions(state, candidate.key, tile.key).find(action => action.type === 'move');
    if (!quote?.enabled) continue;
    return { enabled: true, toKey: candidate.key, troops: quote.action.troops,
      companions: tile.field?.length || 0, stationed: tile.garrison?.length || 0,
      remaining: tile.troops - quote.action.troops, warNeighbors: candidate.war,
      cost: quote.cost, action: quote.action };
  }
  return { enabled: false, reason: '当前行军范围内没有可用的己方目的地。' };
}

/** Expensive authoritative quotes are restricted to the selected owned tile.
 * The caller supplies its already-computed rally descriptor when available. */
export function getFrontlineReport(state, key, { rallyAction = null, includeChoices = true, expansion = false } = {}) {
  if (state.battle || state.turnContinuation) return null;
  const tile = state.tiles?.[key], neighbors = visibleWarNeighbors(state, key);
  if (!neighbors.length) return null;
  const own = tile.ownerId === state.playerId;
  if (!own && !expansion) return null;
  return { key, own, capital: own && state.factions[state.playerId]?.capitalKey === key, expansion: !own, troops: own ? tile.troops : null,
    companions: own ? (tile.field?.length || 0) + (tile.garrison?.length || 0) : null,
    neighbors, rally: own && includeChoices ? rallyChoice(state, tile, rallyAction) : null,
    move: own && includeChoices ? moveChoice(state, tile) : null };
}

export function frontlineReportHtml(report) {
  if (!report) return '';
  const { neighbors, rally, move } = report, largest = neighbors[0], mostCompanions = Math.max(...neighbors.map(neighbor => neighbor.companions));
  const heading = report.expansion ? '目标周边交战领土' : report.capital ? '首都 · 交战边境' : '交战边境';
  const roster = neighbors.map(neighbor => `<li>${esc(neighbor.name)} · ${esc(neighbor.key)}：${neighbor.troops} 军士 / ${neighbor.companions} 同伴</li>`).join('');
  let choices = '';
  if (rally) {
    choices += `<p>${rally.enabled ? `后方集结 +${rally.troops} 军士 · ${esc(actionCost(rally.cost))}` : `后方集结：${esc(rally.reason)}`}</p>`;
    if (rally.previewAvailable) choices += `<button type="button" data-frontline-rally="${esc(report.key)}">集结预览</button>`;
  }
  if (move) {
    choices += move.enabled
      ? `<p>转移示例 → ${esc(move.toKey)}：${move.troops} 军士 / ${move.companions} 随军同伴 · ${esc(actionCost(move.cost))}<br>原地留 ${move.remaining} 军士 / ${move.stationed} 驻扎同伴${move.warNeighbors ? '；目的地仍有交战邻地。' : '；目的地暂无已知交战邻地。'}</p><button type="button" data-frontline-from="${esc(report.key)}" data-frontline-to="${esc(move.toKey)}">转移预览</button>`
      : `<p>暂不能转移：${esc(move.reason)}</p>`;
  }
  if (rally && move) choices += '<small>集结与转移是备选；集结后本地本回合不能继续行军。预览不执行。</small>';
  return `<section class="frontline-notice" aria-label="${heading}"><b>${heading} · ${neighbors.length} 处</b>${report.own ? `<p>本地 ${report.troops} 军士 / ${report.companions} 同伴</p>` : '<p>当前已知邻地如下，战后归属可能变化。</p>'}<details><summary title="军士与同伴的最大值可能来自不同地块，展开查看明细。">各地最多 ${largest.troops} 军士 / ${mostCompanions} 同伴（分别统计）</summary><ul>${roster}</ul></details>${choices}<small>仅列已探索邻地，不预测进攻、胜负或安全。</small></section>`;
}

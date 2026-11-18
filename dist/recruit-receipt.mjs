/** Presentation only: consume the engine's receipt, never infer nominal rewards as received. */
export function recruitReceiptText(results = []) {
  const totals = new Map();
  for (const result of results) {
    const r = result.receipt;
    if (!r || !['N', 'R', 'SR', 'SSR'].includes(r.rank)) continue;
    const total = totals.get(r.rank) || { accepted: 0, overflow: 0 };
    total.accepted += r.accepted; total.overflow += r.overflow; totals.set(r.rank, total);
  }
  const received = [], missed = [];
  for (const rank of ['N', 'R', 'SR', 'SSR']) {
    const total = totals.get(rank); if (!total) continue;
    const name = rank === 'N' ? '首都驻军' : `${rank} 库存`;
    received.push(`${name} +${total.accepted}`);
    if (total.overflow) missed.push(`${rank === 'N' ? '普通军士' : rank} ${total.overflow}${rank === 'N' ? '人' : '队'}`);
  }
  return received.length ? `实际入库：${received.join('，')}${missed.length ? `；容量不足，${missed.join('、')}未入库` : ''}。` : '';
}
/** `limit` is the capital's 补给上限 as the engine quotes it; without one the save limit of 100 is shown. */
export function recruitCapacityText(state, limit = 100) {
  const home = state.tiles[state.factions[state.playerId].capitalKey];
  return `首都容量：驻军 ${home?.troops || 0}/${Number.isInteger(limit) ? limit : 100}；${['R','SR','SSR'].map(rank => `${rank} ${home?.elite?.[rank] || 0}/99`).join('，')}。超出容量的部分不入库，仍按原价收费；少女加入不受此限制。`;
}

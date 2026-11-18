const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
export function fiscalReportHtml(report, offset = 0, {settled=false} = {}) {
  const rows = [
    ...report.sales.map(row => `${row.key}：变卖 ${row.label}，回收 ${row.gold} 金币`),
    ...report.withdrawals.map(row => `${row.key}：撤出领土，${row.placed} 人安置、${row.demobilized} 人退役、${row.leftResidents} 人留居；${row.heroes.length} 名角色回首都${Object.values(row.lostElite).some(n=>n)?`，容量不足解散 ${Object.entries(row.lostElite).filter(([,n])=>n).map(([rank,n])=>`${n} 队 ${rank}`).join('、')}`:''}`),
  ];
  const start = Math.max(0, Math.min(Math.floor(offset / 100) * 100, Math.max(0, Math.floor((rows.length - 1) / 100) * 100)));
  return `<p class="recovery-warning">本次维护缺口 <b>${report.before.shortfall}</b> 金币。已先停止付不起的军费与要塞执勤，仍不足时${settled?'已':'将'}折价变卖资产；没有资产可卖时，撤出外围非首都领土。首都与角色保留，但建筑、库存和领土会实际损失。</p><p>变卖 ${report.sales.length} 项，回收 ${report.refundGold} 金币；撤出 ${report.withdrawals.length} 块领土。${settled?'本次维护支付后':'预计支付本次维护后'}剩余 <b>${report.after.goldAfterSettlement}</b> 金币，之后金币净收入 <b>${report.after.netGold}</b> / 回合。此处不含随后战争、事件和其他国家行动。</p><ul class="military-site-list">${rows.slice(start,start+100).map(row=>`<li>${esc(row)}</li>`).join('')}</ul>${rows.length>100?`<p>损失清单 ${start+1}–${Math.min(start+100,rows.length)} / ${rows.length}</p><div class="form-actions"><button class="small-button secondary" id="fiscal-prev" ${start===0?'disabled':''}>上一页</button><button class="small-button secondary" id="fiscal-more" ${start+100>=rows.length?'disabled':''}>下一页</button></div>`:''}<p class="form-hint">回收价格低于建设或取得成本。重新占回财政收缩丢失的土地不会再次领取开拓奖励。${settled?'这是已结算清单，不含随后局势变化。':'可先取消结束回合，自行调整军费、变卖资产或改善收入。'}</p>`;
}

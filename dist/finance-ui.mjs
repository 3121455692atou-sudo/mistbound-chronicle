// Disclosure belongs to the existing amount/ledger row, never a separate control.
import { F, feedbackText } from './feedback-copy.mjs?v=1118-1603';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const number = value => typeof value === 'number' ? value.toLocaleString('zh-CN', { maximumFractionDigits: 4 }) : String(value);
const amount = (gold = 0, supply = 0) => [gold ? `${number(gold)} 金` : '', supply ? `${number(supply)} 粮` : ''].filter(Boolean).join(' · ') || '0';
const lines = rows => rows.map(row => `<span class="fee-line"><span>${esc(row.label)}</span><b>${esc(row.op || '')}${esc(number(row.value))}</b></span>`).join('');
export function expenseDetailsHtml(report) {
  const formula = report.formula.replace(/\d+\.\d{5,}/g, value => number(Number(value)));
  return `${lines(report.rows)}${report.children.map(child => `<span class="fee-child"><b>${esc(child.label)} · ${esc(amount(child.cost.gold, child.cost.supply))}</b>${lines(child.rows)}</span>`).join('')}${formula ? `<span class="fee-formula">${esc(formula)} = ${esc(number(report.cost.gold || 0))}</span>` : ''}${report.notes.map(note => `<span class="fee-note">${esc(note)}</span>`).join('')}<span class="fee-line fee-total"><span>${esc(F.total)}</span><b>${esc(amount(report.cost.gold, report.cost.supply))} · ${report.cost.ap || 0} 令</b></span>${report.rows.length > 1 ? `<span class="fee-note">${esc(F.round_explain)}</span>` : ''}`;
}
let disclosureSeq = 0;
export function feeDisclosureHtml(summary, body) {
  const id = `fee-body-${++disclosureSeq}`;
  return `<span class="fee-disclosure"><span class="fee-summary" role="button" tabindex="0" aria-expanded="false" aria-controls="${id}" title="${esc(F.cost_details)}" data-fee-toggle>${summary}</span><span class="fee-body" id="${id}" data-fee-body hidden>${body}</span></span>`;
}
export function installFeeDisclosure(root) {
  const toggle = event => {
    const summary = event.target.closest?.('[data-fee-toggle]');
    if (!summary || event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    event.preventDefault(); event.stopPropagation();
    const body = summary.parentElement.querySelector('[data-fee-body]'), open = summary.getAttribute('aria-expanded') !== 'true';
    summary.setAttribute('aria-expanded', String(open)); body.hidden = !open;
  };
  root.addEventListener('click', toggle, true);
  root.addEventListener('keydown', toggle, true);
}
const ledgerRow = (label, value, body, cls = '') => `<details class="finance-row ${cls}"><summary><span>${esc(label)}</span><b>${esc(value)}</b></summary><div class="finance-body">${body}</div></details>`;
const receipt = rows => lines(rows.map(([label, value]) => ({ label, value })));
export function financeLedgerHtml(report, civicName) {
  const { gross, net, sources, administration: a, military: m, forts: f, food, civic: c } = report;
  const income = sources.map(row => row.detail ? ledgerRow(row.label, `+${amount(row.gold, row.supply)}`, row.detail.map(site => `<span class="fee-line"><span>${esc(site.label)} ×${site.count}</span><b>${esc(amount(site.gold, site.supply))}</b></span>`).join('')) : `<span class="fee-line"><span>${esc(row.label)}</span><b>+${esc(amount(row.gold, row.supply))}</b></span>`).join('');
  let html = ledgerRow(F.income_details, `+${amount(gross.gold, gross.supply)}`, income);
  if (a.baseGold) html += ledgerRow(F.admin_base, `−${number(a.baseGold)} 金`, receipt([[F.land_count, a.land], [F.building_levels, a.levels]]) + `<span class="fee-formula">⌊${a.land} ÷ 5⌋ + ⌊${a.levels} ÷ 5⌋ − 1 = ${number(a.baseGold)}</span><p>${esc(F.land_note)}</p>`);
  if (a.gold) html += ledgerRow('行政支出', `−${number(a.gold)} 金`, receipt([[F.land_count, a.land], [F.admin_efficiency, `${number(a.efficiency * 100)}%`], [F.income_details, gross.gold], [F.admin_base, a.baseGold]]) + `<p>${esc(feedbackText('admin_example', { gross: number(gross.gold), base: number(a.baseGold), taxable: number(Math.max(0, gross.gold - a.baseGold)), rate: number((1 - a.efficiency) * 100), fee: number(a.gold) }))}</p><p>${esc(F.admin_explain)}</p><p>${esc(F.land_note)}</p>`);
  const fortSites = resource => f.sites.map(site => `<span class="fee-line"><span>${esc(site.key)} · Lv ${site.level}</span><b>${number(site[resource] - (resource === 'gold' ? f.network.excess * 2 : 0))}</b></span>`).join('');
  const fortDiscount = f.discount !== 1 ? receipt([[f.discountName, `×${f.discount}`]]) : '';
  if (f.cost.gold) html += ledgerRow('要塞维护', `−${number(f.cost.gold)} 金`, fortSites('gold') + receipt([[F.forts, `${f.network.excess} × 2 × ${f.network.active} = ${f.network.excess * 2 * f.network.active}`]]) + fortDiscount);
  if (f.cost.supply) html += ledgerRow('要塞用粮', `−${number(f.cost.supply)} 粮`, fortSites('supply') + fortDiscount);
  if (m.gold) html += ledgerRow('军费（补贴后）', `−${number(m.gold)} 金`, receipt([[F.regular, m.regularGold], [F.rare, m.rareGold], [F.allowance, `−${m.allowanceUsed}`], [F.tech, `×${m.logistics}`]]) + `<span class="fee-formula">⌈(${m.regularGold} + ${m.rareGold} − ${m.allowanceUsed}) × ${m.logistics}⌉ = ${number(m.gold)}</span>` + m.sites.filter(site => site.upkeep.gold).map(site => `<span class="fee-line"><span>${esc(site.key)} · ${site.residents} 人 · Lv ${site.learnedLevel}</span><b>${number(site.upkeep.gold)}</b></span>`).join(''));
  if (c.upkeep) {
    const advanced = c.advancedSites.map(site => `${site.label} ${site.count} × ${site.base}`).join(' + ') || '0';
    const civic = receipt([[F.advanced, `${advanced} × ${number(c.upkeepFactor)} → ${c.advanced}`], [F.city_count, `${c.cityCount} × ${c.cityUnit} = ${c.cities}`], [F.occupation, `⌈${c.digestion} × 0.35⌉ = ${c.digestionCost}`], [F.debt, c.debt], [F.credit, c.credit], [F.interest_rate, `${number(c.interestRate * 100)}% × ${number(c.interestFactor)}`], ['利息', `⌈${c.debt} × ${number(c.interestRate)} × ${number(c.interestFactor)}⌉ = ${c.interest}`], [F.ship_upkeep, `${c.ships} × 2 = ${c.ships * 2}`], [F.plane_upkeep, `${c.planes} × 1 = ${c.planes}`], [F.recovery, c.capitalRecovery]]);
    html += ledgerRow(civicName, `−${number(c.upkeep)} 金`, civic);
  }
  if (food.cost) html += ledgerRow(F.expense_food, `−${number(food.cost)} 粮`, `<span class="fee-formula">⌊${food.troops} ÷ 4⌋ + ⌊${food.land} ÷ 6⌋ − 1 = ${number(food.cost)}</span><p>${esc(F.food_formula)}</p>`);
  if (c.vehicles.supply) html += ledgerRow(F.ship_food, `−${number(c.vehicles.supply)} 粮`, `<span class="fee-formula">${c.ships} + ⌈${c.shipTroops} ÷ 4⌉ = ${number(c.vehicles.supply)}</span>`);
  const netGold = `${net.gold >= 0 ? '+' : ''}${number(net.gold)}`;
  html += report.conditional?.length ? ledgerRow('每回合净金币', netGold, report.conditional.map(row => `<span class="fee-line"><span>${esc(row.label)}</span><b>${number(row.cost.gold)} 金 · ${row.cost.ap} 令</b></span><p>${esc(feedbackText('integration_note', { gold: number(row.cost.gold) }))}</p>${row.reason ? `<p>${esc(row.reason)}</p>` : ''}`).join(''), 'net') : `<div class="net"><span>每回合净金币</span><b>${netGold}</b></div>`;
  html += `<div class="net"><span>每回合净补给</span><b>${net.supply >= 0 ? '+' : ''}${number(net.supply)}</b></div>`;
  return html;
}

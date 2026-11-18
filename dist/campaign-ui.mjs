// Single-player additions, placed where a player looks for them (2026-11 overhaul):
//   · places on the map → the tile ring (建城 / 市长 / 迁都 / 造船 / 造飞机 / 起飞), with the form in the card beside the ring;
//   · research → 内政「科技」tab, also one tap from the 研究 badge under the treasury;
//   · money → 内政「国库」tab, under the ledger;
//   · cities → 内政「建设」tab lists them, tapping one goes to it on the map;
//   · the Shawshank roster → the prison page.
// There is no separate 国政 page any more. Every button goes through the shared engine (undo, saves, CLI).
import * as E from './engine.mjs?v=1118-1603';
import { C, say } from './campaign-copy.mjs?v=1118-1603';
import { F, feedbackText } from './feedback-copy.mjs?v=1118-1603';
import { TECH_BRANCHES, techNode, effectLines, unlockLines, mobilityOf } from './campaign.mjs?v=1118-1603';
import { AIRCRAFT_MODELS, SHIP_MODELS, parkedPlanes, usableAirport, aircraftQuote, shipQuote, flightQuote, flightPath } from './transport.mjs?v=1118-1603';
import { registerTileAction, registerCaptiveAction, registerSheetAction } from './extensions.mjs?v=1118-1603';

export function campaignBudgetHtml(state, esc = String) {
  const budget = E.campaignBudget(state);
  if (!budget.upkeep) return '';
  const rows = [[C.cities, budget.cities], [C.industrialUpkeep, budget.advanced], [C.occupationUpkeep, budget.digestionCost], [C.interest, budget.interest], [C.vehicleUpkeepName, budget.vehicles.gold], [C.capitalRecovery, budget.capitalRecovery]];
  return `<details class="campaign-budget"><summary>${esc(C.civicUpkeepName)}</summary><dl>${rows.filter(([, n]) => n).map(([label, n]) => `<div><dt>${esc(label)}</dt><dd>−${n} ${esc(C.gold)}</dd></div>`).join('')}</dl>${budget.hallFraction ? `<p>${esc(C.administrativeHallName)} · ${budget.hallFraction.toFixed(2)} ${esc(C.actions)}</p>` : ''}</details>`;
}

export function installCampaignUI(ctx) {
  const { getState, run, esc, icon, toast, portrait, priceHtml, beginMapPick, tileName, goToTile, showGarrison } = ctx;
  const face = id => portrait(getState().characters[id], 'smile') || 'assets/sazai.webp';
  const name = id => getState().characters[id]?.name || '';
  const branchOf = id => TECH_BRANCHES.find(b => b.id === id) || TECH_BRANCHES[0];
  const burst = (id, label, ok, cls = '') => `<button class="cs-burst small ${cls}" id="${id}" ${ok ? '' : 'aria-disabled="true"'}><span>${esc(label)}</span></button>`;
  const shake = el => { if (!el) return; el.classList.remove('nudge'); void el.offsetWidth; el.classList.add('nudge'); };
  // A burst that does nothing when disabled except say why.
  const onBurst = (el, reason, go) => { if (!el) return; el.onclick = e => { if (e.detail > 1) return; if (el.getAttribute('aria-disabled') === 'true') { toast(reason() || '现在还不行。', true); shake(el); return; } go(); }; };
  const TIER = ['一', '二', '三', '四', '五', '六', '七'];

  /* ------------------------------------------------------------------ 科技 ------------------------------------------------------------------
     Read the way Hearts of Iron IV and Civilization VI lay out research. Every tech is a card (name, turns and gold, little
     marks for what it unlocks) on a grid: on a computer the six branches stand side by side as columns with their own colour
     band and the tiers run downwards, so the whole tree fits the page; on a phone the tiers run sideways and the tree scrolls,
     branch labels staying put. Each prerequisite sits exactly one tier earlier, so a line is either straight along its branch
     or one right-angled step in the gap between two tiers — no line crosses a card, lines leaving one card share their run.
     Lines are drawn after the cards are laid out, from where the cards really are, so any screen size and zoom lines up.
     Tapping a card lights its whole road in gold with step numbers sitting whole on the card's corner; the strip on top shows
     what is being learned and what comes next; the card under it says what the picked tech does, with one burst. */
  let techPick = null, techLines = [];
  const UNLOCK_ICON = { building: 'castle', model: 'compass', wonder: 'laurel', policy: 'coin', action: 'flag' };
  const UNLOCK_KIND = { building: '建筑', model: '载具', wonder: '奇观', policy: '国策', action: '新命令' };
  /** Everything that must be learned, in order, to reach a tech (the tech itself last). */
  function pathTo(state, id) {
    const record = E.techOf(state), seen = new Set(), order = [];
    const visit = techId => { if (seen.has(techId) || record.known.includes(techId) || record.active?.id === techId) return; seen.add(techId); for (const p of techNode(techId)?.prerequisites || []) visit(p); order.push(techId); };
    visit(id);
    return order;
  }
  const have = (record, id) => record.known.includes(id) || record.active?.id === id;
  /** A polyline with rounded corners. */
  function roundPath(points, r = 8) {
    const f = n => Math.round(n * 10) / 10;
    let d = `M${f(points[0][0])} ${f(points[0][1])}`;
    for (let i = 1; i < points.length - 1; i++) {
      const [px, py] = points[i - 1], [cx, cy] = points[i], [nx, ny] = points[i + 1];
      const lin = Math.hypot(cx - px, cy - py), lout = Math.hypot(nx - cx, ny - cy), k = Math.min(r, lin / 2, lout / 2);
      if (!lin || !lout || k < .5) { d += ` L${f(cx)} ${f(cy)}`; continue; }
      d += ` L${f(cx - (cx - px) / lin * k)} ${f(cy - (cy - py) / lin * k)} Q${f(cx)} ${f(cy)} ${f(cx + (nx - cx) / lout * k)} ${f(cy + (ny - cy) / lout * k)}`;
    }
    const [lx, ly] = points.at(-1);
    return `${d} L${f(lx)} ${f(ly)}`;
  }
  /** Lines from where the cards are. "Main" is the direction tiers advance (down on a computer, right on a phone), "cross" the
   *  other one. A line leaves the earlier card's far side, turns once in the gap between the two tiers and enters the later
   *  card's near side. In one gap, lines that would overlap get separate tracks unless they leave the same card or enter the
   *  same card (those share one run, like a branch); tracks are ordered so lines heading the same way never cross. */
  function drawTechLines(tree) {
    const svg = tree?.querySelector?.('.tt-edges');
    if (!svg || !tree.offsetWidth || typeof getComputedStyle !== 'function') return;
    const down = getComputedStyle(tree).getPropertyValue('--flow').trim() !== 'right';
    const box = {}; tree.querySelectorAll('.tt-node').forEach(n => { box[n.dataset.tech] = { x: n.offsetLeft, y: n.offsetTop, w: n.offsetWidth, h: n.offsetHeight }; });
    const M = b => down ? { s: b.y, e: b.y + b.h, c: b.x + b.w / 2 } : { s: b.x, e: b.x + b.w, c: b.y + b.h / 2 };
    const edges = techLines.filter(l => box[l.from] && box[l.to]).map(l => { const a = M(box[l.from]), b = M(box[l.to]); return { ...l, m1: a.e, m2: b.s, c1: a.c, c2: b.c }; });
    const gaps = new Map();
    for (const e of edges) if (Math.abs(e.c1 - e.c2) > 1) { const g = Math.round((e.m1 + e.m2) / 2); if (!gaps.has(g)) gaps.set(g, []); gaps.get(g).push(e); }
    for (const list of gaps.values()) {
      list.sort((p, q) => Math.abs(q.c2 - q.c1) - Math.abs(p.c2 - p.c1) || Math.min(p.c1, p.c2) - Math.min(q.c1, q.c2) || p.from.localeCompare(q.from));
      const tracks = [];
      for (const e of list) {
        const lo = Math.min(e.c1, e.c2), hi = Math.max(e.c1, e.c2);
        let t = tracks.findIndex(track => track.every(o => o.from === e.from || o.to === e.to || Math.max(o.c1, o.c2) < lo - 6 || Math.min(o.c1, o.c2) > hi + 6));
        if (t < 0) { t = tracks.length; tracks.push([]); }
        tracks[t].push(e);
      }
      // Lines going towards larger cross values that start lower sit later; lines going the other way that start higher sit later.
      const key = track => track.reduce((sum, e) => sum + (e.c2 > e.c1 ? -e.c1 : e.c1 + 100000), 0) / track.length;
      tracks.sort((p, q) => key(p) - key(q)).forEach((track, i) => track.forEach(e => { e.track = i; e.tracks = tracks.length; }));
    }
    const P = (m, c) => down ? [c, m] : [m, c];
    const paths = edges.map(e => {
      if (e.track === undefined) return { ...e, d: roundPath([P(e.m1, e.c1), P(e.m2, e.c2)]) };
      const span = e.m2 - e.m1, step = Math.min(8, (span - 10) / Math.max(1, e.tracks - 1)), g = (e.m1 + e.m2) / 2 + (e.track - (e.tracks - 1) / 2) * step;
      return { ...e, d: roundPath([P(e.m1, e.c1), P(g, e.c1), P(g, e.c2), P(e.m2, e.c2)]) };
    });
    // Each branch gets a soft band behind its cards, so a column (or row) reads as one family.
    const bands = new Map();
    tree.querySelectorAll('.tt-node').forEach(n => { const b = box[n.dataset.tech], lane = n.style.getPropertyValue('--lane'), now = bands.get(lane) || { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity, c: n.style.getPropertyValue('--c') }; now.x1 = Math.min(now.x1, b.x); now.y1 = Math.min(now.y1, b.y); now.x2 = Math.max(now.x2, b.x + b.w); now.y2 = Math.max(now.y2, b.y + b.h); bands.set(lane, now); });
    const W = tree.scrollWidth, H = tree.scrollHeight, rank = { dim: 0, '': 1, lit: 2, road: 3 };
    svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.style.width = `${W}px`; svg.style.height = `${H}px`;
    svg.innerHTML = `<g class="tt-bands">${[...bands.values()].map(b => `<rect x="${b.x1 - 6}" y="${b.y1 - 6}" width="${b.x2 - b.x1 + 12}" height="${b.y2 - b.y1 + 12}" rx="8" style="fill:${b.c}" />`).join('')}</g>`
      + paths.sort((p, q) => rank[p.cls] - rank[q.cls]).map(e => e.cls === 'road' ? `<path class="road-under" d="${e.d}" /><path class="road" d="${e.d}" />` : `<path class="${e.cls}" d="${e.d}" />`).join('');
  }
  function techHtml(state) {
    const record = E.techOf(state), active = record.active ? techNode(record.active.id) : null, queue = record.queue || [];
    if (!techPick || !techNode(techPick)) techPick = record.active?.id || queue[0] || E.TECHNOLOGIES.map(t => E.researchQuote(state, t.id)).find(q => q.enabled)?.id || 'agriculture';
    const quotes = Object.fromEntries(E.TECHNOLOGIES.map(t => [t.id, E.researchQuote(state, t.id)]));
    const path = pathTo(state, techPick), road = new Set(path), focus = road.size > 0 && !quotes[techPick].known;
    // Known techs that feed the road stay bright too: the player sees what is already in hand.
    const feeds = new Set(); for (const id of road) for (const p of techNode(id).prerequisites) if (have(record, p)) feeds.add(p);
    techLines = E.TECHNOLOGIES.flatMap(tech => tech.prerequisites.map(p => {
      const onRoad = focus && road.has(tech.id) && (road.has(p) || feeds.has(p)), lit = record.known.includes(p) && have(record, tech.id);
      return { from: p, to: tech.id, cls: onRoad ? 'road' : lit ? 'lit' : focus ? 'dim' : '' };
    }));
    const laneOf = tech => TECH_BRANCHES.findIndex(b => b.id === tech.branch) + 2;
    const nodes = E.TECHNOLOGIES.map(tech => {
      const q = quotes[tech.id], b = branchOf(tech.branch), step = path.indexOf(tech.id), queued = queue.indexOf(tech.id);
      const status = q.known ? 'known' : q.active ? 'active' : q.missing.length ? 'locked' : 'ready';
      const dim = focus && !road.has(tech.id) && !feeds.has(tech.id);
      const badge = focus && step >= 0 && path.length > 1 ? `<em class="tt-step">${step + 1}</em>` : queued >= 0 ? `<em class="tt-q" title="排队第 ${queued + 1} 项">${queued + 1}</em>` : '';
      const meta = q.known ? '已掌握' : q.active ? `还剩${record.active.remaining}回合` : `${q.turns}回合·${q.cost.gold}金`;
      const bar = q.active ? `<i class="tt-bar"><u style="width:${Math.max(8, Math.round((1 - record.active.remaining / Math.max(1, q.turns)) * 100))}%"></u></i>` : '';
      const kinds = [...new Set(tech.unlocks.map(u => u.split(':')[0]))].filter(k => UNLOCK_ICON[k]).slice(0, 2);
      const marks = kinds.length ? `<span class="tt-un" title="解锁${kinds.map(k => UNLOCK_KIND[k]).join('、')}">${kinds.map(k => icon(UNLOCK_ICON[k])).join('')}</span>` : '';
      return `<button class="tt-node ${status}${techPick === tech.id ? ' on' : ''}${dim ? ' dim' : ''}${focus && road.has(tech.id) ? ' road' : ''}" type="button" data-tech="${tech.id}" style="--lane:${laneOf(tech)};--tier:${tech.tier + 1};--c:${b.color}" aria-pressed="${techPick === tech.id}" aria-label="${esc(tech.name)}，${esc(meta)}"><span class="tt-ic">${q.known ? icon('check') : icon(b.icon)}</span><span class="tt-tx"><b>${esc(tech.name)}</b><small>${esc(meta)}</small></span>${marks}${bar}${badge}</button>`;
    }).join('');
    const lanes = TECH_BRANCHES.map((b, i) => `<span class="tt-lane" style="--lane:${i + 2};--c:${b.color}">${icon(b.icon)}<b>${esc(b.name)}</b></span>`).join('');
    const tiers = TIER.map((t, i) => `<span class="tt-tier" style="--tier:${i + 2}"><b>${t}</b><small>阶</small></span>`).join('');
    const chip = id => `<button class="tt-qchip" type="button" data-tech="${id}" style="--c:${branchOf(techNode(id).branch).color}">${esc(techNode(id).name)}</button>`;
    const now = active
      ? `<div class="tt-now" style="--c:${branchOf(active.branch).color}"><span class="tt-ic">${icon(branchOf(active.branch).icon)}</span><div class="tt-nowtx"><b>正在研究 · ${esc(active.name)}</b><i class="tt-bar"><u style="width:${Math.max(8, Math.round((1 - record.active.remaining / Math.max(1, quotes[active.id].turns)) * 100))}%"></u></i><small>还剩 ${record.active.remaining} 回合</small></div>${queue.length ? `<div class="tt-queue"><small>接着学</small>${queue.map(chip).join('<i aria-hidden="true">›</i>')}</div>` : '<small class="tt-queue none">学完后没有排队的：点一张卡，按“排进队列”。</small>'}</div>`
      : `<div class="tt-now idle"><b>还没有在研究</b><small>点树上的一张卡，它要走的路会亮起来；按卡下面的按钮就排好队。</small></div>`;
    const legend = `<p class="tt-legend"><span class="k">已掌握</span><span class="r">能学</span><span class="l">缺前置</span><span class="u">${icon('castle')}建筑 ${icon('compass')}载具 ${icon('laurel')}奇观 ${icon('coin')}国策 ${icon('flag')}命令</span></p>`;
    const tree = `<div class="tt-board"><div class="tt-tree"><svg class="tt-edges" aria-hidden="true"></svg><span class="tt-corner"></span>${lanes}${tiers}${nodes}</div></div>`;
    return `<div class="tt${focus ? ' focus' : ''}" id="tech-root">${now}${techCard(state, quotes, path)}${tree}${legend}</div>`;
  }
  function techCard(state, quotes, path) {
    const tech = techNode(techPick), q = quotes[techPick], record = E.techOf(state), b = branchOf(tech.branch), busy = Boolean(record.active);
    const effects = effectLines(tech.effects), unlocks = unlockLines(tech.unlocks);
    let label = '研究！', ok = q.enabled, need = '', price = q, priceOpts = {};
    if (q.known) { label = '已掌握'; ok = false; }
    else if (q.active) { label = '研究中'; ok = false; }
    else if (q.missing.length || busy) {
      ok = true; label = busy ? '排进队列' : '排队研究';
      const steps = path.length, gold = path.reduce((sum, id) => sum + (quotes[id]?.cost.gold || 0), 0), turns = path.reduce((sum, id) => sum + (quotes[id]?.turns || 0), 0);
      const before = steps > 1 ? `要先学 ${steps - 1} 项（树上 1→${steps}）` : '';
      // What this press spends now: nothing while something else is being learned, else the first step. Later steps pay their gold when they start, never commands.
      if (busy) { price = {}; priceOpts = { noAp: '现在不花' }; need = `排在「${techNode(record.active.id).name}」后面。${before ? `${before}，` : ''}一共 ${gold} 金、约 ${turns} 回合；轮到哪项付哪项的金，不花指令。`; }
      else { price = quotes[path[0]] || q; need = `${before}。现在先学「${techNode(path[0]).name}」，其余轮到时自动开始；一共 ${gold} 金、约 ${turns} 回合，之后不花指令。`; }
    }
    const status = q.known ? '已掌握' : q.active ? `研究中 · 还剩 ${record.active.remaining} 回合` : `${q.turns} 回合`;
    const why = !ok && !q.known && !q.active ? q.reason : '';
    const pre = tech.prerequisites.length ? `<p class="tt-pre"><small>前置</small>${tech.prerequisites.map(p => `<button type="button" data-tech="${p}" class="${have(record, p) ? 'ok' : ''}">${have(record, p) ? icon('check') : ''}${esc(techNode(p).name)}</button>`).join('')}</p>` : '';
    const chips = effects.length || unlocks.length ? `<div class="tt-chips">${effects.map(line => `<span class="fx">${esc(line)}</span>`).join('')}${unlocks.map(line => `<span class="un">${esc(line)}</span>`).join('')}</div>` : '';
    return `<aside class="tt-card" style="--c:${b.color}"><span class="tt-ic big">${q.known ? icon('check') : icon(b.icon)}</span><header title="${esc(tech.line)}"><h3>${esc(tech.name)}</h3><small>${esc(b.name)} · 第${TIER[tech.tier - 1]}阶 · ${esc(status)}</small>${need || why ? '' : `<p class="tt-line">${esc(tech.line)}</p>`}</header><div class="tt-mid">${chips}${pre}${need ? `<p class="tt-need">${esc(need)}</p>` : ''}${why ? `<p class="tt-why">${esc(why)}</p>` : ''}</div><div class="tt-foot">${q.known || q.active ? '' : priceHtml(price, priceOpts)}${burst('tech-go', label, ok)}</div></aside>`;
  }
  function bindTech(root, refresh) {
    root.querySelectorAll('[data-tech]').forEach(b => b.onclick = () => { techPick = b.dataset.tech; refresh(); });
    onBurst(root.querySelector('#tech-go'), () => E.researchQuote(getState(), techPick).reason, () => {
      const s = getState(), q = E.researchQuote(s, techPick), record = E.techOf(s), plan = pathTo(s, techPick);
      if (q.enabled && !record.active) { const r = run(q.action); if (r?.ok) toast(`开始研究「${q.name}」，${q.turns} 回合后完成。`); refresh(); return; }
      const r = run({ type: 'queueResearch', techIds: plan });
      if (r?.ok) toast(record.active ? `排好了 ${plan.length} 项，${techNode(record.active.id).name}之后自动接上。` : `开始研究「${techNode(plan[0]).name}」，后面 ${plan.length - 1} 项自动接上。`);
      refresh();
    });
    const tree = root.querySelector('.tt-tree');
    if (!tree) return;
    drawTechLines(tree);
    // Fonts and the page zoom settle after the first paint; redraw whenever the tree changes size.
    if (typeof ResizeObserver === 'function' && !tree.techWatch) { tree.techWatch = new ResizeObserver(() => drawTechLines(tree)); tree.techWatch.observe(tree); }
    // On a phone the tree scrolls sideways: keep the picked card in view.
    const board = root.querySelector('.tt-board'), node = root.querySelector('.tt-node.on');
    if (board && node && board.scrollWidth > board.clientWidth + 4 && board.dataset.placed !== techPick) {
      board.dataset.placed = techPick;
      const left = node.offsetLeft, right = left + node.offsetWidth;
      if (left < board.scrollLeft + 50 || right > board.scrollLeft + board.clientWidth - 8) board.scrollLeft = Math.max(0, left - board.clientWidth / 2 + node.offsetWidth / 2);
    }
  }

  /* ------------------------------------------------------------------ 货币 ------------------------------------------------------------------ */
  let moneyPick = 'sell', sellAmount = 10;
  const tone = (good, bad) => good ? 'good' : bad ? 'bad' : '';
  function moneyHtml(state) {
    const v = E.economyView(state), policies = Object.fromEntries(v.policies.map(p => [p.kind, p]));
    const spare = E.spareSupply(state), amounts = [...new Set([10, 50, 200, spare].filter(n => n >= 1 && n <= Math.max(10, spare)))].sort((a, b) => a - b);
    if (!amounts.includes(sellAmount)) sellAmount = amounts[0] || 10;
    v.sell = E.sellSupplyQuote(state, sellAmount);
    const stats = [
      ['通胀', `${v.inflation > 0 ? '+' : ''}${v.inflation.toFixed(1)}%`, tone(v.inflation <= 3, v.inflation > 8), '每回合物价涨多少。超过 20% 城市会躁动。'],
      ['物价', v.prices, tone(v.prices <= 110, v.prices > 150), '建造、研究、造船都按物价涨价；金产也会被物价吃掉一部分。'],
      ['信用', v.credit, tone(v.credit >= 70, v.credit < 40), '信用越高，国债额度越大、利息越低；跌破 30 会恐慌。'],
      ['汇率', (v.exchange / 100).toFixed(2), tone(v.exchange >= 100, v.exchange < 70), '本币越硬，买粮越便宜、通商收入越多，卖粮反而换得少。'],
      ['流动性', `${v.liquidity}%`, tone(v.liquidity >= 70, v.liquidity < 45), '钱转得动，产出才满。'],
      ['国债', `${v.debt}/${v.limit}`, tone(!v.debt, v.debt > v.limit * .7), '已借/额度。每回合付利息。'],
      ['本币结算', `${v.settlement}%`, tone(v.settlement >= 50, false), `通商的国家用你的钱结账的比例。到 50% 能输出一部分通胀；铸币税每回合 +${v.seigniorage}。`],
    ];
    const acts = [
      ['sell', '卖粮', `+${v.sell.gold}金`, v.sell.enabled, v.sell.reason, `卖掉 ${v.sell.amount} 补给，换 ${v.sell.gold} 金币（每粮 ${v.sell.rate.toFixed(2)} 金）。同一回合卖得越多越便宜（最多降到一半）；集市、大巴扎卖得更贵；本币越硬卖得越少。${v.sell.sold ? `这回合已经卖了 ${v.sell.sold}。` : ''}`, v.sell.cost],
      ...['mint', 'bond', 'repay', 'tighten'].map(kind => {
        const p = policies[kind];
        const text = { mint: `印 ${p.amount} 金币直接花。物价会涨、信用 −3；一直印会恶性通胀。`, bond: `借 ${p.amount} 金币，记在国债上，每回合付利息。信用越高能借越多。`, repay: `还 ${p.amount} 国债，信用 +3。`, tighten: `收回 ${p.amount} 金币的货币，通胀 −4，信用 +2。` }[kind];
        return [kind, C[kind], kind === 'repay' || kind === 'tighten' ? `−${p.amount}金` : `+${p.amount}金`, p.enabled, p.reason, text, p.cost];
      }),
    ];
    const ratePick = typeof moneyPick === 'number' ? moneyPick : null, picked = acts.find(a => a[0] === moneyPick) || acts[0];
    const rates = [[-1, '宽松', '金产 +5%，通胀每回合 +1.2'], [0, '中性', '不额外影响'], [1, '紧缩', '金产 −5%，通胀每回合 −1.5，信用每回合 +1']];
    const rateRow = `<div class="mn-rate" role="group" aria-label="利率"><b>利率</b>${rates.map(([value, label]) => `<button class="${v.rate.value === value ? 'now' : ''} ${ratePick === value ? 'on' : ''}" data-rate="${value}" aria-pressed="${ratePick === value}">${label}</button>`).join('')}${v.rate.locked ? `<small>${esc(v.rate.reason)}</small>` : ''}</div>`;
    let cap;
    if (ratePick !== null) {
      const [, label, text] = rates.find(r => r[0] === ratePick), same = ratePick === v.rate.value;
      cap = `<div class="cs-cap"><div><h3>利率：${label}</h3><p>${esc(text)}。一回合只能动一次货币政策。</p><p>${priceHtml({cost:v.rate.cost,action:{type:'currencyPolicy',kind:'rate'}})}</p>${same ? '<small>现在就是这一档。</small>' : v.rate.reason ? `<small class="warn">${esc(v.rate.reason)}</small>` : ''}</div>${burst('money-go', '调利率！', !same && !v.rate.reason)}</div>`;
    } else cap = `<div class="cs-cap"><div><h3>${esc(picked[1])}</h3><p>${esc(picked[5])}</p>${picked[0] === 'sell' ? `<p class="mn-amounts">${amounts.map(n => `<button data-sell="${n}" aria-pressed="${n === sellAmount}">${n === spare && n > 200 ? `全部余粮 ${n}` : n}</button>`).join('')}</p>` : ''}<p>${priceHtml({cost:picked[6],action:picked[0]==='sell'?{type:'sellSupply',amount:v.sell.amount}:{type:'currencyPolicy',kind:picked[0]}})}</p>${picked[3] ? '' : `<small class="warn">${esc(picked[4])}</small>`}</div>${burst('money-go', `${picked[1]}！`, picked[3])}</div>`;
    return `<section class="governance-panel gv-sec gv-money" id="gov-money"><h3>货币与财政</h3><div class="mn-stats">${stats.map(([label, value, cls, hint]) => `<span class="${cls}" title="${esc(hint)}"><b>${esc(String(value))}</b><small>${esc(label)}</small></span>`).join('')}</div><details class="cs-fold mn-say"><summary>${esc(moneyLine(v))}</summary><p>${esc(F.price_explain)}</p><p>${esc(F.money_explain)}</p></details><div class="cs-acts mn-acts">${acts.map(([kind, label, short, enabled]) => `<button class="hx cs-act ${moneyPick === kind ? 'on' : ''} ${enabled ? '' : 'off'}" data-money="${kind}" aria-pressed="${moneyPick === kind}"><b>${esc(label)}</b><small>${esc(short)}</small></button>`).join('')}</div>${rateRow}${cap}</section>`;
  }
  function moneyLine(v) {
    if (v.inflation > 20) return `通胀 ${v.inflation.toFixed(0)}%：城市开始躁动，赶紧回笼货币或调高利率。`;
    if (v.credit < 35) return `信用只剩 ${v.credit}：先还债，别再印钱。`;
    if (v.debt > v.limit * .7) return `国债快到额度了（${v.debt}/${v.limit}），利息在吃收入。`;
    if (v.settlement >= 50) return `${v.settlement}% 的通商用你的钱结账：每回合铸币税 +${v.seigniorage}，一部分通胀也会被别国分担。`;
    if (v.inflation <= 1 && v.credit >= 70) return '物价稳、信用好：缺钱时可以放心借一点国债，或者卖掉多余的粮。';
    return '物价和信用都还行。缺钱先卖粮或借国债，少印钞。';
  }
  function bindMoney(root, refresh) {
    root.querySelectorAll('[data-money]').forEach(b => b.onclick = () => { moneyPick = b.dataset.money; refresh(); });
    root.querySelectorAll('[data-rate]').forEach(b => b.onclick = () => { moneyPick = Number(b.dataset.rate); refresh(); });
    root.querySelectorAll('[data-sell]').forEach(b => b.onclick = () => { sellAmount = Number(b.dataset.sell); refresh(); });
    onBurst(root.querySelector('#money-go'), () => {
      const v = E.economyView(getState());
      if (typeof moneyPick === 'number') return v.rate.reason || (moneyPick === v.rate.value ? '现在就是这一档。' : '');
      return moneyPick === 'sell' ? E.sellSupplyQuote(getState(), sellAmount).reason : v.policies.find(p => p.kind === moneyPick)?.reason;
    }, () => {
      const v = E.economyView(getState());
      if (typeof moneyPick === 'number') { const r = run({ type: 'currencyPolicy', kind: 'rate', value: moneyPick }); if (r?.ok) toast(`利率改成${['宽松', '中性', '紧缩'][moneyPick + 1]}了。`); refresh(); return; }
      if (moneyPick === 'sell') { const q = E.sellSupplyQuote(getState(), sellAmount), r = run(q.action); if (r?.ok) toast(`卖了 ${q.amount} 补给，进账 ${q.gold} 金币。`); refresh(); return; }
      const p = v.policies.find(x => x.kind === moneyPick), r = run(p.action); if (r?.ok) toast(say(moneyPick + 'Done', { gold: p.amount })); refresh();
    });
  }

  /* ------------------------------------------------------------------ 城市（内政·建设） ------------------------------------------------------------------ */
  function cityListHtml(state) {
    const cities = E.citiesOf(state), hasAdmin = E.hasTech(state, 'administration'), canals = E.canalsOf(state);
    const rows = cities.map(city => {
      const tile = state.tiles[city.key], mayor = state.characters[city.mayorId], control = E.controlAt(state, tile).percent;
      return `<button class="city-card" data-city-go="${esc(city.key)}"><span class="city-face">${mayor ? `<img src="${esc(face(city.mayorId))}" alt="" />` : '<i>?</i>'}</span><span class="city-text"><b>${esc(city.name)}</b><small>${mayor ? `市长 ${esc(mayor.name)}` : '没有市长！'} · 控制 ${control}%</small><i class="city-lib" style="--p:${city.liberty}%"><u></u></i><small>独立倾向 ${city.liberty}%</small></span>${icon('arrow')}</button>`;
    }).join('');
    const canalRows = canals.map(canal => `<button class="city-card" data-city-go="${esc(canal.key)}"><span class="city-face"><i>${icon('canal')}</i></span><span class="city-text"><b>${esc(canal.name)}</b><small>${canal.status === 'open' ? `已通航 · 通行税 +${E.CANAL_RULES.tollGold}金` : `施工中 · 还剩 ${canal.remaining} 回合`} · ${esc(canal.key)}</small></span>${icon('arrow')}</button>`).join('');
    const canalBox = canals.length ? `<section class="governance-panel gv-cities"><h3>运河<small>${canals.length} 条</small></h3><div class="city-cards">${canalRows}</div></section>` : '';
    return `<section class="governance-panel gv-cities"><h3>城市<small>${cities.length} 座</small></h3>${rows ? `<div class="city-cards">${rows}</div>` : ''}${hasAdmin ? `<button class="gv-link" type="button" data-city-map>${icon('map')}在地图上挑地方建城<span>›</span></button><p class="form-hint">城市中心控制力 90%，往外每格 −7%：离首都越远，建城越划算。</p>` : `<button class="gv-link" type="button" data-city-tech>${icon('spark')}先研究「行政学」才能建城<span>›</span></button>`}</section>${canalBox}`;
  }
  function bindCityList(root) {
    root.querySelectorAll('[data-city-go]').forEach(b => b.onclick = () => goToTile(b.dataset.cityGo));
    const map = root.querySelector('[data-city-map]'); if (map) map.onclick = () => ctx.cityOnMap?.(true);
    const tech = root.querySelector('[data-city-tech]'); if (tech) tech.onclick = () => ctx.openTech('administration');
  }

  /* ------------------------------------------------------------------ 地块花瓣：城市 ------------------------------------------------------------------ */
  const mayorPick = new Map();
  const mayorCandidates = (state, key) => {
    const tile = state.tiles[key];
    return [...(tile?.field || []), ...(tile?.garrison || [])].filter(id => state.characterOwners[id] === state.playerId && !state.captives[id] && !state.campaign.prison[id] && !(Array.isArray(state.wall) && state.wall.some(e => e?.id === id)) && id !== state.activeHeroId && id !== state.companionId && !Object.values(state.posts || {}).includes(id) && !Object.values(state.envoys || {}).includes(id) && !(E.mayorCity(state, id) && E.mayorCity(state, id).key !== key));
  };
  const facesHtml = (ids, chosen, attr) => `<div class="rf-faces">${ids.map(id => `<button class="rf-face ${id === chosen ? 'on' : ''}" ${attr}="${esc(id)}" aria-pressed="${id === chosen}"><i><img src="${esc(face(id))}" alt="" /></i><b>${esc(name(id))}</b></button>`).join('')}</div>`;
  const ownLand = (state, tile) => tile?.ownerId === state.playerId && !tile.shipId && state.terrainTypes[tile.terrainId]?.passable;
  registerTileAction({
    id: 'realm.bridge', label: F.bridge, icon: 'map', group: 'build', rank: 4.5,
    when: c => ownLand(c.state, c.tile) && E.getBridgeTargets(c.state, c.tile.key).length > 0,
    detail: F.bridge_details,
    run: c => {
      const fromKey = c.key, targets = new Set(E.getBridgeTargets(getState(), fromKey));
      beginMapPick({
        kind: 'bridge', icon: 'map', title: F.bridge, subtitle: tileName(getState().tiles[fromKey]), from: fromKey,
        eligible: tile => targets.has(tile.key), instruction: F.bridge_pick, why: () => F.bridge_pick,
        preview: key => E.getBridgeQuote(getState(), fromKey, key),
        render: (tile, q) => tile ? `<h4>${esc(tileName(tile))}<small>${esc(tile.key)}</small></h4><p>${esc(feedbackText('bridge_span', { length: q.length }))}</p><p>${priceHtml(q)}</p><p class="cs-hint">${esc(F.bridge_details)} ${esc(F.bridge_ship)}</p>${q.reason ? `<p class="alarm">${esc(q.reason)}</p>` : ''}` : `<h4>${esc(F.bridge_pick)}</h4><p class="cs-hint">${esc(F.bridge_details)}</p>`,
        confirmLabel: F.bridge,
        onPick: key => {
          const q = E.getBridgeQuote(getState(), fromKey, key);
          if (!q.enabled) { toast(q.reason, true); return; }
          const r = run(q.action); if (r.ok) toast(feedbackText('bridge_done', { length: q.length }));
        }
      });
    }
  });
  registerTileAction({
    id: 'realm.city', label: '建城', icon: 'castle', group: 'build', rank: .5,
    when: c => ownLand(c.state, c.tile) && !c.tile.isCapital && !c.state.campaign.cities[c.tile.key],
    short: c => E.hasTech(c.state, 'administration') ? `${E.cityQuote(c.state, c.tile.key, '').cost.gold}金` : '要行政学',
    detail: '把这里建成城市：控制力从 90% 起算，往外每格 −7%；在场的一位同伴当市长。',
    form: c => {
      const state = getState(), key = c.key, ids = mayorCandidates(state, key);
      if (!ids.includes(mayorPick.get(key))) mayorPick.set(key, ids[0] || '');
      const chosen = mayorPick.get(key), q = E.cityQuote(state, key, chosen);
      const body = !E.hasTech(state, 'administration') ? `<p class="rf-say">要先研究「行政学」。</p><button class="cs-link" data-rf-tech>去研究 ${icon('arrow')}</button>`
        : !ids.length ? `<p class="rf-say">这里没有能当市长的同伴：先让一位同伴驻扎或行军到这里（领军、副将、任职的人不行）。</p><button class="cs-link" data-rf-garrison>去驻扎 ${icon('arrow')}</button>`
          : `<p class="rf-say">点一位当市长。信赖满的市长永远不会因为别国更富而闹独立。</p>${facesHtml(ids, chosen, 'data-rf-mayor')}`;
      return {
        html: `${body}<div class="rf-foot">${priceHtml(q)}${burst('rf-go', '建城！', q.enabled)}</div>${q.enabled || !ids.length || !E.hasTech(state, 'administration') ? '' : `<p class="alarm">${esc(q.reason)}</p>`}`,
        bind: root => {
          root.querySelectorAll('[data-rf-mayor]').forEach(b => b.onclick = () => { mayorPick.set(key, b.dataset.rfMayor); c.refresh(); });
          const g = root.querySelector('[data-rf-garrison]'); if (g) g.onclick = () => showGarrison(key);
          const t = root.querySelector('[data-rf-tech]'); if (t) t.onclick = () => ctx.openTech('administration');
          onBurst(root.querySelector('#rf-go'), () => E.cityQuote(getState(), key, mayorPick.get(key)).reason, () => {
            const r = run(E.cityQuote(getState(), key, mayorPick.get(key)).action);
            if (r?.ok) toast(`${tileName(getState().tiles[key])}建成城市了，市长 ${name(mayorPick.get(key))}。`);
          });
        },
      };
    },
  });
  registerTileAction({
    id: 'realm.canal', label: '运河', icon: 'canal', group: 'build', rank: .45,
    when: c => ownLand(c.state, c.tile) && (Boolean(c.state.campaign.canals?.[c.tile.key]) || E.canalSides(c.state, c.tile, false) >= 2),
    short: c => {
      const canal = c.state.campaign.canals?.[c.tile.key];
      if (canal) return canal.status === 'open' ? `+${E.CANAL_RULES.tollGold}金·通航` : `剩${canal.remaining}回合`;
      return E.hasTech(c.state, 'shipbuilding') ? `${E.canalQuote(c.state, c.tile.key).cost.gold}金` : '要造船术';
    },
    detail: C.canalDetail,
    form: c => {
      const state = getState(), key = c.key, canal = state.campaign.canals?.[key];
      if (canal) {
        const msg = canal.status === 'open'
          ? `「${canal.name}」已全线贯通：两侧海域舰船可直接通行，每回合额外征收通行税 +${E.CANAL_RULES.tollGold} 金币（与交战国敌舰封锁）。`
          : `「${canal.name}」正在开凿船闸，还剩 ${canal.remaining} 回合完工（需保持与首都连通）。`;
        return { html: `<p class="rf-say">${esc(msg)}</p>`, bind: () => {} };
      }
      const q = E.canalQuote(state, key);
      if (!E.hasTech(state, 'shipbuilding')) {
        return {
          html: `<p class="rf-say">两侧紧邻互不相连的海域，可开凿「${esc(q.name)}」，但要先研究「造船术」。</p><button class="cs-link" data-rf-canal-tech>去研究 ${icon('arrow')}</button>`,
          bind: root => { const t = root.querySelector('[data-rf-canal-tech]'); if (t) t.onclick = () => ctx.openTech('shipbuilding'); },
        };
      }
      return {
        html: `<p class="rf-say">在此处地峡开凿「<b>${esc(q.name)}</b>」：工期 ${q.turns} 回合，完工后打通两侧海域供舰船直航，并每回合带来 +${E.CANAL_RULES.tollGold} 金币通行税。</p><div class="rf-foot">${priceHtml(q)}${burst('rf-go', '开凿运河！', q.enabled)}</div>${q.enabled ? '' : `<p class="alarm">${esc(q.reason)}</p>`}`,
        bind: root => onBurst(root.querySelector('#rf-go'), () => E.canalQuote(getState(), key).reason, () => {
          const quote = E.canalQuote(getState(), key), r = run(quote.action);
          if (r?.ok) toast(say('canalStarted', { name: quote.name, turns: quote.turns }));
        }),
      };
    },
  });
  registerTileAction({
    id: 'realm.mayor', label: '市长', icon: 'heroes', group: 'build', rank: .4,
    when: c => Boolean(c.state.campaign.cities[c.tile.key]) && c.tile.ownerId === c.state.playerId,
    short: c => { const city = c.state.campaign.cities[c.tile.key]; return city.mayorId ? name(city.mayorId) : '空缺！'; },
    detail: '换一位在场的同伴当市长。',
    form: c => {
      const state = getState(), key = c.key, city = state.campaign.cities[key], ids = mayorCandidates(state, key).filter(id => id !== city.mayorId);
      if (!ids.includes(mayorPick.get(key))) mayorPick.set(key, ids[0] || '');
      const chosen = mayorPick.get(key), control = E.controlAt(state, state.tiles[key]).percent, bond = city.mayorId ? state.growth?.[city.mayorId]?.bond ?? 0 : 0;
      const now = city.mayorId ? `<p class="rf-say">现任 <b>${esc(name(city.mayorId))}</b> · 信赖 ${bond} · 控制 ${control}% · 独立倾向 ${city.liberty}%${bond >= 100 ? ' · 她不会闹独立' : ''}</p>` : '<p class="alarm">没有市长：独立倾向每回合 +3。</p>';
      return {
        html: `${now}${ids.length ? facesHtml(ids, chosen, 'data-rf-mayor') : '<p class="rf-say">这里没有别的同伴能接任：先让她们驻扎到这里。</p>'}<div class="rf-foot">${priceHtml({ ap: 0 })}${burst('rf-go', '任命！', Boolean(chosen))}</div>`,
        bind: root => {
          root.querySelectorAll('[data-rf-mayor]').forEach(b => b.onclick = () => { mayorPick.set(key, b.dataset.rfMayor); c.refresh(); });
          onBurst(root.querySelector('#rf-go'), () => '先点一位同伴。', () => { const r = run({ type: 'appointMayor', key, characterId: mayorPick.get(key) }); if (r?.ok) toast(`${name(mayorPick.get(key))}当上了市长。`); });
        },
      };
    },
  });
  registerTileAction({
    id: 'realm.capital', label: '迁都', icon: 'flag', group: 'build', rank: 6,
    when: c => Boolean(c.state.campaign.cities[c.tile.key]) && c.tile.ownerId === c.state.playerId && !c.tile.isCapital,
    short: c => { const q = E.getMoveCapitalQuote(c.state, c.tile.key); return q.enabled ? `${q.cost.gold}金` : '条件不够'; },
    detail: '把首都搬到这座城市：控制力中心跟着走。',
    form: c => {
      const q = E.getMoveCapitalQuote(getState(), c.key);
      return {
        html: `<p class="rf-say">首都搬到这里，控制力从这里起算；之后 8 回合是恢复期（控制 −5%、每回合多花 4 金）。要和平、要有市长、动乱低。</p><div class="rf-foot">${priceHtml(q)}${burst('rf-go', '迁都！', q.enabled, 'red')}</div>${q.enabled ? '' : `<p class="alarm">${esc(q.reason)}</p>`}`,
        bind: root => onBurst(root.querySelector('#rf-go'), () => E.getMoveCapitalQuote(getState(), c.key).reason, () => { const r = run(E.getMoveCapitalQuote(getState(), c.key).action); if (r?.ok) toast(`首都迁到了 ${tileName(getState().tiles[c.key])}。`); }),
      };
    },
  });

  /* ------------------------------------------------------------------ 地块花瓣：船厂、机场 ------------------------------------------------------------------ */
  const modelPick = new Map();
  const modelHexes = (models, chosen, quoteOf) => `<div class="rf-models">${models.map(m => { const q = quoteOf(m.id); return `<button class="rf-model ${m.id === chosen ? 'on' : ''} ${q.enabled ? '' : 'off'}" data-rf-model="${m.id}" aria-pressed="${m.id === chosen}"><img src="assets/buildings/${m.art}.webp" alt="" /><b>${esc(m.name)}</b><small>${esc(m.stat)}</small></button>`; }).join('')}</div>`;
  registerTileAction({
    id: 'realm.ship', label: '造船', icon: 'compass', group: 'army', rank: .5,
    when: c => c.tile.building === 'shipyard' && c.tile.ownerId === c.state.playerId,
    short: c => { const n = Object.values(c.state.campaign.ships).filter(s => s.ownerId === c.state.playerId).length; return n ? `已有 ${n} 艘` : '快艇起'; },
    detail: '在船厂旁的海面下水一艘船。船是地图上单独的单位：点它出航、装人、登陆。',
    form: c => {
      const state = getState(), key = c.key, models = Object.values(SHIP_MODELS).map(m => ({ ...m, art: 'ship', stat: `${m.capacity} 人 · 航速 ${m.speed}` }));
      if (!modelPick.has('ship:' + key)) modelPick.set('ship:' + key, models.find(m => shipQuote(state, key, m.id).enabled)?.id || models[0].id);
      const chosen = modelPick.get('ship:' + key), q = shipQuote(state, key, chosen);
      return {
        html: `${modelHexes(models, chosen, id => shipQuote(state, key, id))}<p class="rf-say">${esc(SHIP_MODELS[chosen].description || '')}</p><div class="rf-foot">${priceHtml(q)}${burst('rf-go', '造船！', q.enabled)}</div>${q.enabled ? '' : `<p class="alarm">${esc(q.reason)}</p>`}`,
        bind: root => {
          root.querySelectorAll('[data-rf-model]').forEach(b => b.onclick = () => { modelPick.set('ship:' + key, b.dataset.rfModel); c.refresh(); });
          onBurst(root.querySelector('#rf-go'), () => shipQuote(getState(), key, modelPick.get('ship:' + key)).reason, () => {
            const quote = shipQuote(getState(), key, modelPick.get('ship:' + key)), r = run(quote.action);
            if (r?.ok) { toast(`${quote.model.name}下水了，就在 ${quote.launchKey}。点船就能出航、装人。`); ctx.focusShip?.(quote.launchKey); }
          });
        },
      };
    },
  });
  const planeCount = new Map();
  registerTileAction({
    id: 'realm.plane', label: '造飞机', icon: 'upload', group: 'army', rank: .6,
    when: c => c.tile.building === 'airfield' && c.tile.ownerId === c.state.playerId,
    short: c => `停 ${parkedPlanes(c.state, c.tile.key).length} 架`,
    detail: '飞机停在机场里，一架坐一位同伴。',
    form: c => {
      const state = getState(), key = c.key, models = Object.values(AIRCRAFT_MODELS).map(m => ({ ...m, art: 'airplane', stat: `航速 ${m.speed} · 攻 +${m.attack} · 防 ${m.defense}` }));
      if (!modelPick.has('plane:' + key)) modelPick.set('plane:' + key, models.find(m => aircraftQuote(state, key, m.id, 1).enabled)?.id || models[0].id);
      const chosen = modelPick.get('plane:' + key), count = planeCount.get(key) || 1, q = aircraftQuote(state, key, chosen, count);
      return {
        html: `${modelHexes(models, chosen, id => aircraftQuote(state, key, id, 1))}<div class="rf-count"><span>数量</span><button data-rf-count="-1" ${count <= 1 ? 'disabled' : ''} aria-label="少一架">−</button><b>${count}</b><button data-rf-count="1" ${count >= 6 ? 'disabled' : ''} aria-label="多一架">+</button><small>机场里停着 ${parkedPlanes(state, key).length} 架</small></div><div class="rf-foot">${priceHtml(q)}${burst('rf-go', '造飞机！', q.enabled)}</div>${q.enabled ? '' : `<p class="alarm">${esc(q.reason)}</p>`}`,
        bind: root => {
          root.querySelectorAll('[data-rf-model]').forEach(b => b.onclick = () => { modelPick.set('plane:' + key, b.dataset.rfModel); c.refresh(); });
          root.querySelectorAll('[data-rf-count]').forEach(b => b.onclick = () => { planeCount.set(key, Math.max(1, Math.min(6, (planeCount.get(key) || 1) + Number(b.dataset.rfCount)))); c.refresh(); });
          onBurst(root.querySelector('#rf-go'), () => aircraftQuote(getState(), key, modelPick.get('plane:' + key), planeCount.get(key) || 1).reason, () => {
            const quote = aircraftQuote(getState(), key, modelPick.get('plane:' + key), planeCount.get(key) || 1), r = run(quote.action);
            if (r?.ok) toast(`${quote.count} 架${quote.model.name}停进了机场。`);
          });
        },
      };
    },
  });
  // 起飞: from an airfield (planes) or from any tile where a girl can fly on her own. Pick who, then tap the landing field.
  const pilotPick = new Map();
  const pilotsAt = (state, key, native) => {
    const tile = state.tiles[key];
    return [...(tile?.field || []), ...(tile?.garrison || []), ...(state.campaign.airportGuests?.[key] || [])].filter(id => state.characterOwners[id] === state.playerId && !state.captives[id] && state.growth?.[id]?.movedTurn !== state.turn && !Object.values(state.posts || {}).includes(id) && !Object.values(state.envoys || {}).includes(id) && !E.mayorCity(state, id) && (!native || mobilityOf(state, id).air));
  };
  function launchForm(c, native) {
    const state = getState(), key = c.key, planes = native ? [] : parkedPlanes(state, key).sort((a, b) => AIRCRAFT_MODELS[b.modelId].speed - AIRCRAFT_MODELS[a.modelId].speed);
    const ids = pilotsAt(state, key, native), limit = native ? 6 : Math.min(6, planes.length);
    if (!pilotPick.has(key)) pilotPick.set(key, ids.slice(0, Math.min(1, limit)));
    const picked = pilotPick.get(key).filter(id => ids.includes(id)).slice(0, limit); pilotPick.set(key, picked);
    const reason = !ids.length ? (native ? '这里没有会飞的同伴。' : '机场里没有能起飞的同伴：先让她们驻扎到这里。') : !native && !planes.length ? '机场里没有停着的飞机：先造飞机。' : !picked.length ? '点一位同伴。' : '';
    return {
      html: `<p class="rf-say">${native ? '会飞的同伴不用飞机，按自己的攻防出战。' : `一架飞机坐一位，自动分配最快的飞机（${planes.length} 架可用）。`}</p>${ids.length ? `<div class="rf-faces">${ids.map(id => `<button class="rf-face ${picked.includes(id) ? 'on' : ''}" data-rf-pilot="${esc(id)}" aria-pressed="${picked.includes(id)}"><i><img src="${esc(face(id))}" alt="" /></i><b>${esc(name(id))}</b></button>`).join('')}</div>` : ''}<div class="rf-foot">${priceHtml({ supply: picked.length })}${burst('rf-go', '选降落点', !reason)}</div>${reason ? `<p class="alarm">${esc(reason)}</p>` : ''}`,
      bind: root => {
        root.querySelectorAll('[data-rf-pilot]').forEach(b => b.onclick = () => {
          const list = pilotPick.get(key) || [], id = b.dataset.rfPilot;
          pilotPick.set(key, list.includes(id) ? list.filter(x => x !== id) : [...list, id].slice(-limit)); c.refresh();
        });
        onBurst(root.querySelector('#rf-go'), () => reason, () => { const who = [...pilotPick.get(key)]; pickFlight(key, native, who, planes.slice(0, who.length).map(p => p.id)); });
      },
    };
  }
  /** After the pilots: tap where to land (or, for a patrol, any sky), see the path and the days, fly. */
  function pickFlight(fromKey, native, pilotIds, planeIds, loiter = false, onCancel = null) {
    const state = getState();
    const can = t => loiter ? t.discovered && t.key !== fromKey : native ? t.ownerId === state.playerId && state.terrainTypes[t.terrainId]?.passable && t.key !== fromKey : usableAirport(state, t.key) && t.key !== fromKey;
    const quote = key => flightQuote(getState(), fromKey, key, pilotIds, planeIds, native, id => mobilityOf(getState(), id).air, loiter);
    beginMapPick({
      kind: 'flight', icon: 'compass', title: loiter ? '巡航空域' : native ? '飞到哪里' : '降落到哪个机场', subtitle: pilotIds.map(name).join('、'), from: fromKey,
      eligible: can, why: () => loiter ? '迷雾里的天空去不了。' : native ? '降落要选己方陆地；想飞去其他空域可点下方「改成巡航空域」。' : '飞机只能降落在己方或盟友的机场。',
      preview: quote,
      route: q => q?.path?.length > 1 ? { from: q.path[0], to: q.path.at(-1), kind: 'far', path: q.path, stops: [] } : null,
      render: (tile, q) => tile ? `<h4>${loiter ? '巡航' : '飞往'} ${esc(tileName(tile))}<small>${esc(tile.key)}</small></h4><p>航速 ${q.speed} · ${q.turns} 回合到${loiter ? '，之后在那里盘旋侦察/拦截' : ''}</p><p>${priceHtml(q)}</p>${q.enabled ? '' : `<p class="alarm">${esc(q.reason)}</p>`}` : `<h4>点地图上的${loiter ? '任意已探明空域' : native ? '己方土地' : '机场'}</h4><p>${loiter ? '白框是能飞往盘旋的空域，不限地形与国界。' : native ? '白框是能落的己方土地；想跨海或去别处侦察可点「改成巡航空域」。' : '白框是能降落的机场。没有第二个机场就改成巡航。'}</p>`,
      foot: () => `<div class="ap-mini-row"><button class="ap-mini" id="flight-mode">${loiter ? (native ? '改成降落己方陆地' : '改成降落机场') : '改成巡航空域'}</button></div>`,
      bind: box => { const m = box.querySelector('#flight-mode'); if (m) m.onclick = () => pickFlight(fromKey, native, pilotIds, planeIds, !loiter, onCancel); },
      confirmLabel: '起飞！',
      onPick: key => { const q = quote(key), r = run(q.action); if (r?.ok) toast(`起飞了：${q.turns} 回合后${loiter ? '到达空域' : '降落'}。`); },
      onCancel: onCancel || (() => goToTile(fromKey)),
    });
  }
  function flightInfo(fromKey, preferredIds = null) {
    const state = getState(), tile = state.tiles[fromKey];
    if (!tile || tile.ownerId !== state.playerId || tile.shipId) return { available: false, ready: false, native: false, pilots: [], planes: [] };
    const planes = tile.building === 'airfield' ? parkedPlanes(state, fromKey).sort((a, b) => AIRCRAFT_MODELS[b.modelId].speed - AIRCRAFT_MODELS[a.modelId].speed) : [];
    const here = [...(tile.field || []), ...(tile.garrison || []), ...(state.campaign.airportGuests?.[fromKey] || [])];
    const scope = preferredIds?.length ? preferredIds.filter(id => here.includes(id)) : here;
    const anyNativeCapable = scope.some(id => mobilityOf(state, id).air);
    const nativeReady = pilotsAt(state, fromKey, true).filter(id => scope.includes(id));
    const planeReady = planes.length ? pilotsAt(state, fromKey, false).filter(id => scope.includes(id)) : [];
    if (nativeReady.length && !(planes.length && !anyNativeCapable)) return { available: true, ready: true, native: true, pilots: nativeReady.slice(0, 6), planes: [] };
    if (planes.length && planeReady.length) {
      const who = planeReady.slice(0, Math.min(6, planes.length));
      return { available: true, ready: true, native: false, pilots: who, planes: planes.slice(0, who.length).map(p => p.id) };
    }
    if (anyNativeCapable || tile.building === 'airfield') {
      const moved = scope.some(id => state.growth?.[id]?.movedTurn === state.turn);
      const why = tile.building === 'airfield' && !planes.length && !anyNativeCapable ? '机场里还没有停放的飞机：先在「建设 → 造飞机」造一架。'
        : moved ? '她本回合已经行动过了，下回合再起飞。' : '当前角色任职/出使中，暂时不能起飞。';
      return { available: true, ready: false, native: anyNativeCapable, pilots: [], planes: [], reason: why };
    }
    return { available: false, ready: false, native: false, pilots: [], planes: [], reason: '她不会凭空飞行：需先研究「航空学」、建造「机场」并造飞机。' };
  }
  function startFlight(fromKey, preferredIds = null, onCancel = null) {
    const info = flightInfo(fromKey, preferredIds);
    if (!info.ready) { toast(info.reason || '现在不能起飞。', true); return false; }
    const state = getState();
    const hasLanding = info.native
      ? Object.values(state.tiles).some(t => t.ownerId === state.playerId && state.terrainTypes[t.terrainId]?.passable && t.key !== fromKey)
      : Object.values(state.tiles).some(t => usableAirport(state, t.key) && t.key !== fromKey);
    pickFlight(fromKey, info.native, info.pilots, info.planes, !hasLanding, onCancel);
    return true;
  }
  registerTileAction({ id: 'realm.launch', label: '起飞', icon: 'compass', group: 'army', rank: .7,
    when: c => c.tile.building === 'airfield' && c.tile.ownerId === c.state.playerId, short: c => `${parkedPlanes(c.state, c.tile.key).length} 架可用`,
    detail: '选同伴坐飞机，再点降落的机场。', form: c => launchForm(c, false) });
  registerTileAction({ id: 'realm.fly', label: '飞行', icon: 'compass', group: 'army', rank: .8,
    when: c => c.tile.ownerId === c.state.playerId && c.tile.building !== 'airfield' && pilotsAt(c.state, c.tile.key, true).length > 0,
    short: c => `${pilotsAt(c.state, c.tile.key, true).length} 位会飞`, detail: '会飞的同伴不用飞机，直接飞去别处。', form: c => launchForm(c, true) });

  /** A flight in the air: tap a field to divert, or intercept an enemy beside it. */
  const hexGap = (a, b) => a && b ? Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.q + a.r - b.q - b.r)) : 99;
  function commandFlight(id) {
    const state = getState(), f = state.campaign.flights[id];
    if (!f || f.ownerId !== state.playerId) return false;
    const enemies = Object.values(state.campaign.flights).filter(o => o.ownerId !== state.playerId && E.getRelation(state, o.ownerId)?.status === 'war' && hexGap(state.tiles[f.key], state.tiles[o.key]) <= 1);
    const can = t => f.loiter ? t.discovered : f.native ? t.ownerId === state.playerId && state.terrainTypes[t.terrainId]?.passable : usableAirport(state, t.key);
    beginMapPick({
      kind: 'flight', icon: 'compass', title: '飞行中', subtitle: f.pilotIds.map(name).join('、'), from: f.key, initial: f.toKey,
      eligible: can, why: () => f.native ? '只能落在自己的陆地上。' : '只能改降己方或盟友的机场。',
      preview: key => { const path = flightPath(getState(), f.key, key); return { enabled: Boolean(path), reason: path ? '' : '飞不过去。', path: path || [], turns: path ? Math.ceil((path.length - 1) / f.speed) : 0 }; },
      render: (tile, q) => `${f.blocked ? `<p class="alarm">${esc(f.blocked)}</p>` : ''}<h4>${tile ? `改${f.loiter ? '飞' : '降'} ${esc(tileName(tile))}` : '点地图改航线'}<small>现在在 ${esc(f.key)}</small></h4><p>${tile ? `${q.turns} 回合到` : `原计划飞往 ${esc(f.toKey)}`} · 每回合每人 1 补给</p>`,
      foot: () => enemies.length ? `<div class="ap-mini-row">${enemies.map(o => `<button class="ap-mini red" data-intercept="${esc(o.id)}">拦截 ${esc(getState().factions[o.ownerId]?.name || '')}</button>`).join('')}</div>` : '',
      bind: box => box.querySelectorAll('[data-intercept]').forEach(b => b.onclick = () => { const r = run({ type: 'interceptFlight', flightId: id, enemyFlightId: b.dataset.intercept }); if (r?.ok && !getState().battle) toast('拦截了。'); }),
      confirmLabel: '改航！',
      onPick: key => { const r = run({ type: 'divertFlight', flightId: id, toKey: key, loiter: Boolean(f.loiter) }); if (r?.ok) toast('改航了。'); },
    });
    return true;
  }

  /* ------------------------------------------------------------------ 牢房：肖申克 ------------------------------------------------------------------ */
  const adultActive = s => Boolean(s?.adult?.nsfw || (typeof localStorage !== 'undefined' && localStorage?.getItem?.('mistbound.nsfw') === 'on'));
  function shawshankFeudNote(state, id, fromFactionId) {
    const names = E.feudTargetNames(state, id, fromFactionId);
    return names.length ? ` ⚠️ 将与「${names.join('、')}」结下不死不休之仇（立即开战且永不议和）。` : '';
  }
  function prisonRosterHtml(state, { always = false } = {}) {
    const entries = Object.entries(state.campaign?.prison || {});
    if (!entries.length && !always) return '';
    return `<section class="shawshank"><h3><img src="assets/buildings/shawshank.webp" alt="" />肖申克监狱<small>${entries.length} 人 · 关押国灭亡则重归自由</small></h3>${entries.length ? `<div class="shaw-row">${entries.map(([id, rec]) => {
      const captorId = rec.captorId || state.playerId, mine = captorId === state.playerId;
      const note = mine ? `第 ${rec.turn} 回合入狱` : `${state.factions[captorId]?.name || captorId}关押 · 灭其国可解救`;
      return `<span class="shaw-face"><i><img src="${esc(face(id))}" alt="" /></i><b>${esc(name(id))}</b><small>${esc(note)}</small></span>`;
    }).join('')}</div>` : '<p class="form-hint">当前暂无收押角色。可在俘虏界面或同伴「任用」中将角色处决收押至此。</p>'}</section>`;
  }
  registerCaptiveAction({
    id: 'campaign.shawshank', label: C.imprison, icon: 'lock',
    when: c => { const s = c?.state || getState(); return !adultActive(s) && s?.captives?.[c.characterId]?.captorId === s?.playerId; },
    enabled: c => { const s = c?.state || getState(); return Boolean(s && !s.battle && !s.turnContinuation && !s.campaign?.prison?.[c.characterId]); },
    reason: () => '请先完成当前战场与战争阶段。',
    detail: c => {
      const s = c?.state || getState(), cap = s.captives[c.characterId];
      return `直接把俘虏${name(c.characterId)}处决关进肖申克监狱（无需先招募）：关押期间无法招降、赎回或逃脱；唯有关押国灭亡后她才会重归自由。${shawshankFeudNote(s, c.characterId, cap?.originalFactionId)}按下去不能撤销。`;
    },
    run: c => {
      const s = c?.state || getState(), who = name(c.characterId), targets = E.feudTargetNames(s, c.characterId, s.captives[c.characterId]?.originalFactionId);
      const r = c.dispatch({ type: 'permanentImprison', characterId: c.characterId, confirm: true });
      if (r?.ok) toast(`${who}已被处决关进肖申克监狱。${targets.length ? `与${targets.join('、')}结下不死不休之仇！` : ''}`);
      return r;
    },
  });
  registerSheetAction({
    id: 'campaign.fly.duty', tab: 'duty', label: '起飞', icon: 'compass', rank: .2,
    when: c => {
      const s = c?.state; if (!s || s.characterOwners?.[c.characterId] !== s.playerId || s.captives?.[c.characterId]) return false;
      if (mobilityOf(s, c.characterId).air) return true;
      const t = Object.values(s.tiles).find(x => (x.field || []).includes(c.characterId) || (x.garrison || []).includes(c.characterId));
      return Boolean(t?.building === 'airfield' && parkedPlanes(s, t.key).length);
    },
    enabled: c => {
      const s = c?.state, id = c.characterId; if (!s || s.battle || s.turnContinuation) return false;
      const t = Object.values(s.tiles).find(x => x.ownerId === s.playerId && ((x.field || []).includes(id) || (x.garrison || []).includes(id)));
      return Boolean(t && flightInfo(t.key, [id]).ready);
    },
    reason: c => {
      const s = c?.state, id = c.characterId;
      if (!s || s.battle || s.turnContinuation) return '请先完成当前战场与战争阶段。';
      if (Object.values(s.campaign?.flights || {}).some(f => f.pilotIds.includes(id))) return '她已经在空中飞行了。';
      const t = Object.values(s.tiles).find(x => x.ownerId === s.playerId && ((x.field || []).includes(id) || (x.garrison || []).includes(id)));
      if (!t) return '她正在差事或任职中，需先在己方地块待命或驻守才能起飞。';
      return flightInfo(t.key, [id]).reason || '现在还不能起飞。';
    },
    detail: c => mobilityOf(c.state, c.characterId).air
      ? `${name(c.characterId)}天生具备飞行能力：无需机场即可跨山越海降落任意己方陆地，或巡航已探明空域（每次起飞仅消耗 1 补给，不花指令）。`
      : `让${name(c.characterId)}从当前机场驾驶飞机起飞，前往其他机场或巡航空域。`,
    run: c => {
      const s = getState(), id = c.characterId;
      const t = Object.values(s.tiles).find(x => x.ownerId === s.playerId && ((x.field || []).includes(id) || (x.garrison || []).includes(id)));
      if (!t) { toast('未找到角色所在己方地块。', true); return { ok: false }; }
      if (typeof document !== 'undefined') document.getElementById('close-modal')?.click();
      startFlight(t.key, [id]);
      return { ok: false };
    },
  });
  registerSheetAction({
    id: 'campaign.shawshank.duty', tab: 'duty', label: '处决入狱', icon: 'lock',
    when: c => !adultActive(c?.state) && c.state.characterOwners?.[c.characterId] === c.state.playerId && c.characterId !== c.state.activeHeroId && !c.state.captives?.[c.characterId],
    enabled: c => !c.state.battle && !c.state.turnContinuation && !Object.values(c.state.campaign?.flights || {}).some(f => f.pilotIds.includes(c.characterId)),
    reason: c => Object.values(c.state.campaign?.flights || {}).some(f => f.pilotIds.includes(c.characterId)) ? C.vehicleBusy : '请先完成当前战场与战争阶段。',
    detail: c => `将${name(c.characterId)}处决关入肖申克监狱（唯有关押国灭亡才会重归自由）。${shawshankFeudNote(c.state, c.characterId, c.state.characters[c.characterId]?.group)}按下去不能撤销。`,
    run: c => {
      const s = getState(), who = name(c.characterId), targets = E.feudTargetNames(s, c.characterId, s.characters[c.characterId]?.group);
      const r = c.dispatch({ type: 'permanentImprison', characterId: c.characterId, confirm: true });
      if (r?.ok) toast(`${who}被关进了肖申克监狱。${targets.length ? `与${targets.join('、')}结下不死不休之仇！` : ''}`);
      return r;
    },
  });

  /* ------------------------------------------------------------------ 罪袋定位 ------------------------------------------------------------------ */
  let sazaiCursor = -1;
  function locateSazai() {
    const state = getState(), rank = t => (t.elite?.SSR || 0) * 100 + (t.elite?.SR || 0) * 10 + (t.elite?.R || 0);
    const keys = Object.values(state.tiles).filter(t => t.ownerId === state.playerId && rank(t) > 0).sort((a, b) => rank(b) - rank(a) || a.key.localeCompare(b.key)).map(t => t.key);
    if (!keys.length) { toast('现在没有稀有罪袋。'); return; }
    sazaiCursor = (sazaiCursor + 1) % keys.length;
    const key = keys[sazaiCursor], tile = state.tiles[key];
    goToTile(key, { look: true });
    toast(`稀有罪袋 ${sazaiCursor + 1}/${keys.length}：${tileName(tile)} ${key} · ${['SSR', 'SR', 'R'].filter(r => tile.elite?.[r]).map(r => `${r}×${tile.elite[r]}`).join(' ')}${tile.shipId ? '（在船上）' : ''}。再点一次看下一处。`);
  }

  return { techHtml, bindTech, moneyHtml, bindMoney, cityListHtml, bindCityList, prisonRosterHtml, locateSazai, commandFlight, flightInfo, startFlight, setTechPick: id => { techPick = id; } };
}

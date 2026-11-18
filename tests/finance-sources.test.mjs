import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, perform, serializeGame, getActions, getStats, getIncome, getFinanceBreakdown, getExpenseBreakdown,
  getRecruitQuote, getSupplyQuote, getArmyTrainingQuote, getAnnexQuote, researchQuote, TECHNOLOGIES } from '../dist/engine.mjs';
import { financeLedgerHtml, feeDisclosureHtml, expenseDetailsHtml } from '../dist/finance-ui.mjs';
import { F } from '../dist/feedback-copy.mjs';

function developed(seed, count) {
  const s = createGame(seed);
  for (const tile of Object.values(s.tiles).filter(t => !t.ownerId && s.terrainTypes[t.terrainId]?.passable).slice(0, count)) {
    Object.assign(tile, { ownerId: s.playerId, discovered: true, troops: 8, building: 'quarry', buildingLevel: 3 });
  }
  s.factions[s.playerId].gold = 10000000; s.factions[s.playerId].supply = 100000;
  s.campaign.economies[s.playerId].prices = 275;
  s.campaign.economies[s.playerId].exchange = 65;
  s.campaign.economies[s.playerId].debt = 1500;
  s.campaign.economies[s.playerId].credit = 50;
  return s;
}
test('all disclosed sources reconcile with the real settlement on small and developed realms', () => {
  for (const count of [0, 15, 50]) {
    const s = developed(`finance-${count}`, count), before = serializeGame(s), report = getFinanceBreakdown(s), stats = getStats(s);
    const sum = report.sources.reduce((v, row) => ({ gold: v.gold + row.gold, supply: v.supply + row.supply }), { gold: 0, supply: 0 });
    assert.deepEqual(sum, getIncome(s, s.playerId));
    assert.deepEqual(report.net, stats.income);
    assert.equal(sum.gold - report.upkeep.gold, report.net.gold);
    assert.equal(sum.supply - report.upkeep.supply, report.net.supply);
    assert.equal(report.civic.upkeep, report.civic.advanced + report.civic.cities + report.civic.digestionCost + report.civic.interest + report.civic.vehicles.gold + report.civic.capitalRecovery);
    assert.equal(report.food.cost + report.forts.cost.supply + report.civic.vehicles.supply, report.upkeep.supply);
    assert.equal(serializeGame(s), before, 'reading money sources must never change the save');
    const html = financeLedgerHtml(report, '民政');
    assert.ok(!/<details[^>]*\sopen(?:\s|>)/.test(html));
    assert.ok(html.includes(F.land_note) || count === 0);
  }
});
test('administration remains uncapped and uses the same full-income formula', () => {
  const s = developed('admin-sources', 60);
  for (const t of Object.values(s.tiles).filter(t => t.ownerId === s.playerId && !t.isCapital)) Object.assign(t, { building: 'quarry', buildingLevel: 5, troops: 40 });
  s.characters[s.activeHeroId].stats.economy = 99;
  const r = getFinanceBreakdown(s), a = r.administration;
  assert.equal(a.gold, Math.floor(Math.max(0, r.gross.gold - a.baseGold) * (1 - a.efficiency)));
  assert.ok(a.gold > 100, 'the explanation must not introduce the rejected fee cap');
  assert.equal(a.land, getStats(s).territories);
});
test('one-time explanations retain canonical prices and the public action debits those prices', () => {
  const s = developed('paid-sources', 16);
  const cases = [
    [{ type: 'gacha', count: 10 }, getRecruitQuote(s, 10)],
    [{ type: 'buySupply', amount: 37 }, getSupplyQuote(s, 37)],
    [{ type: 'trainArmy' }, getArmyTrainingQuote(s)],
    ...TECHNOLOGIES.slice(0, 4).map(tech => [{ type: 'research', techId: tech.id }, researchQuote(s, tech.id)]),
  ];
  for (const [action, quote] of cases) {
    const before = serializeGame(s), explanation = getExpenseBreakdown(s, action, quote.cost);
    assert.deepEqual(explanation.cost, quote.cost);
    assert.equal(serializeGame(s), before);
    if (quote.enabled === false) continue;
    const r = perform(s, action); assert.equal(r.ok, true, r.error);
    assert.equal(s.factions[s.playerId].gold - r.state.factions[s.playerId].gold, quote.cost.gold);
    assert.equal(s.ap - r.state.ap, quote.cost.ap);
  }
  const key = s.factions[s.playerId].capitalKey;
  for (const quote of getActions(s, key).filter(q => ['build', 'upgrade', 'recruit', 'road'].includes(q.type))) {
    assert.deepEqual(getExpenseBreakdown(s, quote).cost, quote.cost);
  }
});
test('disclosure uses the original amount as its only control and starts hidden', () => {
  const s = createGame('disclosure'), q = getSupplyQuote(s, 20);
  const report = getExpenseBreakdown(s, { type: 'buySupply', amount: 20 }, q.cost);
  const html = feeDisclosureHtml('80 金', expenseDetailsHtml(report));
  assert.ok(html.includes('aria-expanded="false"'));
  assert.ok(html.includes('data-fee-body hidden'));
  assert.equal((html.match(/role="button"/g) || []).length, 1);
  assert.ok(!html.includes('<button'), 'no separate expansion button');
  assert.ok(html.includes(F.exchange));
  const unknown = expenseDetailsHtml(getExpenseBreakdown(s, { gold: 17, ap: 1 }));
  assert.ok(!unknown.includes(F.fixed_explain), 'unknown prices must not be described as fixed');
});

test('integration startup and later progress costs remain separate from ordinary net income', () => {
  const s = createGame('integration-sources');
  s.turn = 30; s.factions.lord.gold = 10000;
  s.relations['lord|mygo'] = { status: 'vassal', favor: 90, until: 0, since: 1, trade: false, talkTurn: 0 };
  const q = getAnnexQuote(s, 'mygo'), start = getExpenseBreakdown(s, q);
  assert.equal(q.enabled, true, q.reason); assert.deepEqual(start.cost, q.cost);
  const r = perform(s, q.action); assert.equal(r.ok, true, r.error);
  assert.equal(s.factions.lord.gold - r.state.factions.lord.gold, q.cost.gold);
  const report = getFinanceBreakdown(r.state);
  assert.equal(report.conditional.length, 1);
  assert.deepEqual(report.conditional[0].cost, { ap: 1, gold: q.upkeep, supply: 0 });
  assert.deepEqual(report.net, getStats(r.state).income);
  const html = financeLedgerHtml(report, '民政');
  assert.ok(html.includes('未计入国库显示的每回合固定净收入'));
  assert.ok(!/<details[^>]*\sopen(?:\s|>)/.test(html));
});

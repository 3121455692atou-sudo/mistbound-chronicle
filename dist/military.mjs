// Visible local service commitments. Inventory and learned national training
// are durable; standing service is optional and never deletes either.
import { MAX_SQUADS, regularTrainingProfile } from './battle.mjs?v=1118-1603';
import { walkable } from './waters.mjs?v=1118-1603';

export const MILITARY_RULES = Object.freeze({ allowance: 6, residentsPerCadre: 20,
  rareGold: Object.freeze({ R: 1, SR: 3, SSR: 6 }), mobilizationTurns: 2, preparationTurns: 1 });
const ZERO = Object.freeze({ R: 0, SR: 0, SSR: 0 });
const ORDER = ['SSR', 'SR', 'R'];

export function militaryStatus(state, tileOrKey) {
  const tile = typeof tileOrKey === 'string' ? state.tiles[tileOrKey] : tileOrKey;
  if (!tile) return null;
  const owned = Boolean(tile.ownerId), reserve = Boolean(tile.militaryReserve);
  const learnedLevel = regularTrainingProfile(state.factions[tile.ownerId]?.armyTrainingLevel).level;
  const tier = learnedLevel < 3 ? 0 : 1 + Math.floor((learnedLevel - 3) / 4);
  const regularGold = Math.ceil(tile.troops / MILITARY_RULES.residentsPerCadre) * tier;
  const stock = { ...ZERO, ...tile.elite }, prepared = { ...ZERO };
  let seats = MAX_SQUADS;
  for (const rank of ORDER) { prepared[rank] = Math.min(seats, stock[rank]); seats -= prepared[rank]; }
  const rareGold = ORDER.reduce((sum, rank) => sum + prepared[rank] * MILITARY_RULES.rareGold[rank], 0);
  const readyTurn = tile.militaryReadyTurn || 0, ready = owned && !reserve && readyTurn <= state.turn;
  return { key: tile.key, owned, reserve, ready, readyTurn, learnedLevel, effectiveLevel: ready ? learnedLevel : 1,
    tier, residents: tile.troops, cadres: Math.ceil(tile.troops / MILITARY_RULES.residentsPerCadre),
    stock, prepared, available: ready ? { ...prepared } : { ...ZERO },
    storedReserve: Object.fromEntries(ORDER.map(rank => [rank, stock[rank] - prepared[rank]])),
    nominal: { gold: regularGold + rareGold, regularGold, rareGold },
    upkeep: { gold: owned && !reserve ? regularGold + rareGold : 0, supply: 0 },
    reason: !owned ? '无主驻地不承担军费。' : reserve ? '后备：居民与英雄照常行动；普通军队按 Lv 1，稀有队暂不参战。'
      : !ready ? `整备中：第 ${readyTurn} 回合恢复军训与稀有队，整备期间仍支付军费。` : '',
  };
}

export function militaryBudget(state, factionId = state.playerId, detailed = true) {
  const sites = Object.values(state.tiles).filter(tile => tile.ownerId === factionId && (tile.shipId || walkable(state, tile))).map(tile => militaryStatus(state, tile));
  const regularGold = sites.reduce((sum, site) => sum + (site.reserve ? 0 : site.nominal.regularGold), 0);
  const rareGold = sites.reduce((sum, site) => sum + (site.reserve ? 0 : site.nominal.rareGold), 0);
  const nominalGold = regularGold + rareGold, allowanceUsed = Math.min(MILITARY_RULES.allowance, nominalGold);
  const logistics = state.campaign?.research?.[factionId]?.known.includes('logistics') ? .85 : 1;
  return { factionId, logistics, gold: Math.ceil((nominalGold - allowanceUsed) * logistics), supply: 0, regularGold, rareGold, nominalGold,
    allowance: MILITARY_RULES.allowance, allowanceUsed, ...(detailed ? { sites } : {}),
    active: sites.filter(site => !site.reserve).length, reserve: sites.filter(site => site.reserve).length,
    preparing: sites.filter(site => !site.reserve && !site.ready).length,
  };
}

/** Replace one local row in a summary; no projected-world copy or second scan. */
export function replaceMilitaryBudgetSite(budget, before, after) {
  const regularGold = budget.regularGold - (before.reserve ? 0 : before.nominal.regularGold) + (after.reserve ? 0 : after.nominal.regularGold);
  const rareGold = budget.rareGold - (before.reserve ? 0 : before.nominal.rareGold) + (after.reserve ? 0 : after.nominal.rareGold);
  const nominalGold = regularGold + rareGold, allowanceUsed = Math.min(budget.allowance, nominalGold);
  return { ...budget, regularGold, rareGold, nominalGold, allowanceUsed, gold: Math.ceil((nominalGold - allowanceUsed) * (budget.logistics || 1)),
    active: budget.active - Number(!before.reserve) + Number(!after.reserve),
    reserve: budget.reserve - Number(before.reserve) + Number(after.reserve),
    preparing: budget.preparing - Number(!before.reserve && !before.ready) + Number(!after.reserve && !after.ready) };
}

export const serviceRoster = (state, tile) => militaryStatus(state, tile)?.available || { ...ZERO };
export const serviceTraining = (state, tile) => militaryStatus(state, tile)?.effectiveLevel || 1;

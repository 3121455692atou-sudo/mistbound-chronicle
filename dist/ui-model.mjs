/** Read-only presentation helpers. Legality and spending remain in engine.mjs. */
export function battleCoachText(step, options, fallback) {
  if (step !== 'b_attack' || options?.targets?.length) return fallback;
  if (!options?.ok || !options?.canWait) return '当前分队本轮已行动完。点其他我方角色或按 N 换队；各队行动完后，点右下角圆盘「结束行动」进入下一轮，再寻找红框目标。';
  return options.moves?.length
    ? '当前分队身边还没有红框敌人。先沿蓝格靠近（点蓝格按圆盘「移动」或快速双击蓝格），或点其他角色 / 按 N 换队；各队行动完点右下角圆盘「结束行动」。'
    : '当前没有可用移动，也没有可攻击目标。点其他角色或按 N 推进其他分队，再点右下角圆盘「结束行动」进入下一轮。下一轮继续靠近，红框出现后再攻击。';
}
export function battleCoachAdvances(step, action, battle) {
  if (step === 'b_move') return action.type === 'battleMove';
  if (step === 'b_face') return action.type === 'battleFace';
  if (step === 'b_skill') return action.type === 'battleSkill';
  if (step === 'b_flag') return action.type === 'battleMove' && Boolean(battle?.objective && action.x === battle.objective.x && action.y === battle.objective.y);
  if (step !== 'b_attack') return false;
  if (action.type === 'battleAttack') return true;
  return action.type === 'battleSkill' && Boolean(battle?.units.some(unit => unit.id === action.targetId && unit.side !== battle.playerSide));
}

export function actionCost(cost = {}) {
  return [`${Number(cost.ap) || 0} 指令`, cost.gold ? `${cost.gold} 金币` : '', cost.supply ? `${cost.supply} 补给` : ''].filter(Boolean).join(' · ');
}

export function disabledReason(state, action = {}) {
  if (action.enabled) return '';
  const cost = action.cost || {}, faction = state.factions?.[state.playerId] || {}, missing = [];
  if (state.ap < (cost.ap || 0)) missing.push(`指令不足：需要 ${cost.ap}，剩余 ${state.ap}`);
  if (faction.gold < (cost.gold || 0)) missing.push(`金币不足：还差 ${cost.gold - faction.gold}`);
  if (faction.supply < (cost.supply || 0)) missing.push(`补给不足：还差 ${cost.supply - faction.supply}`);
  const reason = String(action.reason || '').trim();
  return [reason, ...missing.filter(text => !reason.includes(text.split('：')[0]))].filter(Boolean).join('；') || '当前条件不满足。';
}

export function departureReason(state, tile) {
  if (!tile || tile.ownerId !== state.playerId) return '只能从己方领土出发。';
  if (state.battle || state.turnContinuation) return '先处理当前战斗和回合事件。';
  if (tile.marchedTurn === state.turn) return '这支军队本回合已经行军，下一回合恢复。';
  if (!tile.bridgeId && tile.troops < 1) return '出发地须留守 1 名居民，请先补充驻军。';
  if (tile.troops < (tile.bridgeId ? 1 : 2) && !tile.field?.length) return '出发地须留守 1 名居民；需要至少 2 名军士，或一位行军中的同伴。';
  if ((state.factions?.[state.playerId]?.supply || 0) < 1) return '行军至少需要 1 份补给，可在内政中购买。';
  return '';
}

export function readyArmies(state, { all = false } = {}) {
  return Object.values(state.tiles || {}).filter(tile => !departureReason(state, tile) && (all || tile.field?.length || tile.troops >= 6))
    .sort((a, b) => (b.field?.length || 0) - (a.field?.length || 0) || b.troops - a.troops || a.key.localeCompare(b.key));
}

export function troopSelection(home, target, requested, { attack = false, girls = home?.field || [], room } = {}) {
  // `room` is the engine's quote of what the destination can still feed (its 补给上限); without one the save limit applies.
  const space = Number.isFinite(room) ? Math.max(0, room) : 100 - (target?.troops || 0);
  const max = Math.max(0, Math.min((home?.troops || 0) - (home?.bridgeId ? 0 : 1), attack ? 100 : space));
  const min = girls.length ? 0 : 1;
  const parsed = Number(requested);
  const amount = requested === null || requested === undefined || !Number.isFinite(parsed) ? max : Math.max(0, Math.min(max, Math.trunc(parsed)));
  return { min, max, amount, remaining: (home?.troops || 0) - amount, valid: max >= min && amount >= min && (amount > 0 || girls.length > 0) };
}

/** A reversible UI preset, not a rule. The caller supplies the authoritative tile
 * stats; troopSelection still enforces only the existing display bounds. */
export function departureSelection(home, target, stats, requested, { attack = false, girls = home?.field || [], room } = {}) {
  const residents = home?.troops || 0;
  const reserve = home?.bridgeId ? 0 : Math.min(residents, Math.max(1, stats?.need || 1, stats?.fort?.garrison || 1));
  const rare = ['R', 'SR', 'SSR'].some(rank => (home?.elite?.[rank] || 0) > 0);
  const regular = troopSelection(home, target, Math.max(0, residents - reserve), { attack, girls, room });
  // A rare source needs an explicit UI choice before this preview can depart.
  // Its public move command couples rares to a positive regular count.
  const defaultAmount = regular.amount;
  const parsed = Number(requested), manual = requested !== null && requested !== undefined && Number.isFinite(parsed);
  return { ...troopSelection(home, target, manual ? parsed : defaultAmount, { attack, girls, room }),
    reserve, regularAmount: regular.amount, defaultAmount, rare, manual };
}

/** Real rare participation/transfer from the engine's current quote, not the slider. */
export function rareDepartureRequired(home, { attack = false, transfer, preview } = {}) {
  if (!attack) return Object.values(transfer?.moved || {}).some(n => n > 0);
  if (!preview?.ok) return false;
  if (preview.occupy) return ['R', 'SR', 'SSR'].some(rank => (home?.elite?.[rank] || 0) > 0);
  return Boolean(preview.forces?.attacker?.units?.some(unit => ['R', 'SR', 'SSR'].includes(unit.rank)));
}

export function nextKey(keys, current, direction = 1) {
  if (!keys.length) return null;
  const index = keys.indexOf(current);
  if (index < 0) return direction < 0 ? keys.at(-1) : keys[0];
  return keys[(index + direction + keys.length) % keys.length];
}

const xml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
const portraits = new Map();
/** A deliberate, legible portrait fallback, also usable by canvas without external assets. */
export function fallbackPortrait(name = '军士', color = '#7096b1') {
  const safeColor = /^#[\da-f]{3,8}$/i.test(color) ? color : '#7096b1', initials = [...String(name || '军士')].slice(0, 2).join(''), key = `${initials}|${safeColor}`;
  if (!portraits.has(key)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="400" viewBox="0 0 280 400"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${safeColor}"/><stop offset="1" stop-color="#152537"/></linearGradient></defs><rect width="280" height="400" rx="24" fill="url(#g)"/><path d="M0 300 280 120v280H0Z" fill="#0b1320" opacity=".25"/><circle cx="140" cy="91" r="58" fill="#142033" stroke="#f0dbac" stroke-width="3"/><text x="140" y="106" text-anchor="middle" fill="#fff3dc" font-family="sans-serif" font-size="40" font-weight="700">${xml(initials)}</text><path d="M59 342v-90a81 81 0 0 1 162 0v90" fill="#162a3b" stroke="${safeColor}" stroke-width="4"/><path d="m101 240 39 37 39-37-16 80h-46Z" fill="#eed9aa" opacity=".7"/><path d="m22 373 118-19 118 19" fill="none" stroke="#f0dbac" stroke-width="2"/></svg>`;
    portraits.set(key, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  }
  return portraits.get(key);
}

/** Optional shortcut only; results still run the exact normal tactical auto-combat. */
export function smallSkirmishInfo(state){
  const battle=state?.battle,target=state?.tiles?.[battle?.toKey];
  if(!battle||battle.phase!=='player'||!target||target.isCapital||!battle.units?.length)return null;
  if(battle.units.some(unit=>unit.characterId||unit.rank!=='N'))return null;
  const count=side=>battle.units.filter(unit=>unit.side===side).reduce((sum,unit)=>sum+(unit.initialSoldiers||0),0);
  const attacker=count('attacker'),defender=count('defender');
  return attacker>=1&&defender>=1&&attacker<=8&&defender<=8&&attacker+defender<=12?{attacker,defender}:null;
}

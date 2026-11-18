// Humane, nonsexual captivity rules. Quotes are pure; lifecycle writes happen only
// inside the engine's copied transaction. No permanent combat-stat penalties.
import { quirkOf } from './growth.mjs?v=1118-1603';
export const CAPTIVITY_VERSION = 1;
export const CAPTIVITY_RULES = Object.freeze({
  historyLimit: 12, watchMax: 3, watchDecayTurns: 6, recentEscapeTurns: 12,
  securityTurns: 4, securityGold: 8, securitySupply: 2,
  paroleTurns: 3, ransomProtectionTurns: 12, goodwillCooldownTurns: 12,
  reviewTurns: 24, joinGrudgeLimit: 40, admissionBaseGold: 20, admissionGoldPerLevel: 2,
  // A detention can be renewed near its review: a fee that climbs each time, and she likes it less.
  extendTurns: 12, extendWindow: 12, extendGold: 10, extendGoldStep: 5, extendGoldMax: 40, extendGrudge: 10, extendMax: 1200,
  reviewWarnTurns: 3, autoSecureGoldFloor: 20, autoSecureSupplyFloor: 10,
});
const MAX = Number.MAX_SAFE_INTEGER;
const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
const own = (value, key) => Object.prototype.hasOwnProperty.call(value || {}, key);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const count = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
const plus = value => Math.min(MAX, count(value) + 1);
const later = (turn, duration) => Math.min(MAX, turn + duration);
const copy = value => JSON.parse(JSON.stringify(value));
const OUTCOMES = ['captured', 'escaped', 'released', 'ransomed', 'paroled', 'rescued', 'joined'];
const TOTALS = ['captures', 'recaptures', 'escapes', 'releases', 'ransoms', 'rescues', 'joins', 'legacyCaptures'];
const METHODS = Object.freeze({
  talk: { label: '好言相劝', gold: 0, supply: 0, progress: 10, grudge: -4 },
  gift: { label: '送礼示好', gold: 15, supply: 0, progress: 22, grudge: -8 },
  press: { label: '严正交涉', gold: 0, supply: 0, progress: 26, grudge: 22 },
  care: { label: '照护与和解', gold: 6, supply: 2, progress: 6, grudge: -18 },
});
export const CAPTIVE_METHODS = Object.freeze(Object.keys(METHODS));

function freshPair(turn = 0) {
  return { captures: 0, recaptures: 0, escapes: 0, watch: 0, watchTurn: turn,
    lastExitTurn: 0, lastOutcome: 'captured', ransomUntil: 0, goodwillUntil: 0 };
}
function legacyRecord(state, id) {
  const captive = state.captives?.[id], captures = Math.max(count(state.growth?.[id]?.captured), captive ? 1 : 0);
  const record = { captures, recaptures: 0, escapes: 0, releases: 0, ransoms: 0, rescues: 0, joins: 0,
    legacyCaptures: captures, lastCaptureTurn: captive?.capturedTurn || 0, lastExitTurn: 0,
    lastOutcome: captive ? 'captured' : null, paroleUntil: 0, paroleBy: null, byCaptor: {}, events: [] };
  if (captive) {
    record.byCaptor[captive.captorId] = { ...freshPair(captive.capturedTurn), captures: 1 };
    record.events.push({ type: 'captured', turn: captive.capturedTurn, captorId: captive.captorId, originalFactionId: captive.originalFactionId });
  }
  return record;
}
function readRecord(state, id) { return state.captureHistory?.[id] || legacyRecord(state, id); }
function ensureRecord(state, id) {
  state.captureHistory ||= {};
  return state.captureHistory[id] ||= legacyRecord(state, id);
}
function readPair(state, id, captorId) { return readRecord(state, id).byCaptor[captorId] || freshPair(); }
function ensurePair(record, captorId) { return record.byCaptor[captorId] ||= freshPair(); }
function event(record, captive, type, turn, extra = {}) {
  record.events = [...record.events, { type, turn, captorId: captive.captorId, originalFactionId: captive.originalFactionId, ...extra }].slice(-CAPTIVITY_RULES.historyLimit);
}

/** Old totals survive, but unknown historical escapes or captors are never invented.
 * Missing per-character records are lazy-compatible with old mods/fixtures. Existing
 * versioned values are not normalized: validation must reject malformed data. */
export function migrateCaptivity(state) {
  if (state.captivityVersion === undefined) {
    state.captivityVersion = CAPTIVITY_VERSION;
    if (state.captureHistory === undefined) state.captureHistory = {};
  }
  if (state.captivityVersion !== CAPTIVITY_VERSION || !object(state.captureHistory)) return;
  for (const id of Object.keys(state.characters || {})) {
    if (!own(state.captureHistory, id) && (state.captives?.[id] || count(state.growth?.[id]?.captured))) state.captureHistory[id] = legacyRecord(state, id);
  }
}
export function paroleOf(state, id) {
  const record = state.captureHistory?.[id];
  return { until: record?.paroleUntil || 0, remaining: Math.max(0, (record?.paroleUntil || 0) - state.turn), by: record?.paroleBy || null };
}
export const isOnParole = (state, id) => paroleOf(state, id).remaining > 0;
export function alertnessOf(state, id, captorId = state.captives?.[id]?.captorId) {
  const pair = readPair(state, id, captorId);
  return Math.max(0, pair.watch - Math.floor(Math.max(0, state.turn - pair.watchTurn) / CAPTIVITY_RULES.watchDecayTurns));
}

/** Called for both tactical captures and AI clashes, once per actual capture. */
export function registerCapture(state, id, captorId, originalFactionId, battleId) {
  if (state.captives[id] || isOnParole(state, id)) throw new Error('这位角色当前不能再次被俘。');
  const record = ensureRecord(state, id), pair = ensurePair(record, captorId);
  const recaptured = pair.captures > 0;
  const afterEscape = pair.lastOutcome === 'escaped' && state.turn - pair.lastExitTurn <= CAPTIVITY_RULES.recentEscapeTurns;
  const watch = clamp(alertnessOf(state, id, captorId) + (afterEscape ? 1 : 0), 0, CAPTIVITY_RULES.watchMax);
  record.captures = plus(record.captures);
  if (recaptured) { record.recaptures = Math.min(MAX - 1, plus(record.recaptures)); pair.recaptures = Math.min(MAX - 1, plus(pair.recaptures)); }
  pair.captures = plus(pair.captures); pair.watch = watch; pair.watchTurn = state.turn; pair.lastOutcome = 'captured';
  record.lastCaptureTurn = state.turn; record.lastOutcome = 'captured'; record.paroleUntil = 0; record.paroleBy = null;
  const captive = { characterId: id, captorId, originalFactionId, capturedTurn: state.turn, battleId,
    progress: 0, grudge: afterEscape ? 8 : 0, talkTurn: 0, securityUntil: 0, recaptureAfterEscape: afterEscape };
  state.captives[id] = captive;
  event(record, captive, 'captured', state.turn, { repeated: recaptured, afterEscape });
  return { captive, captures: record.captures, recaptured, afterEscape, watch };
}

/** Records the reason before the engine changes ownership/removes the captive. */
export function recordCaptivityExit(state, id, outcome, { gold = 0, goodwill = false } = {}) {
  const captive = state.captives[id];
  if (!captive || !OUTCOMES.includes(outcome) || outcome === 'captured') throw new Error('俘虏去向无效。');
  const record = ensureRecord(state, id), pair = ensurePair(record, captive.captorId);
  const field = { escaped: 'escapes', released: 'releases', paroled: 'releases', ransomed: 'ransoms', rescued: 'rescues', joined: 'joins' }[outcome];
  record[field] = plus(record[field]); record.lastExitTurn = state.turn; record.lastOutcome = outcome;
  pair.lastExitTurn = state.turn; pair.lastOutcome = outcome;
  if (outcome === 'escaped') pair.escapes = plus(pair.escapes);
  if (outcome === 'ransomed' && gold > 0) pair.ransomUntil = later(state.turn, CAPTIVITY_RULES.ransomProtectionTurns);
  if (goodwill) pair.goodwillUntil = later(state.turn, CAPTIVITY_RULES.goodwillCooldownTurns);
  record.paroleUntil = outcome === 'paroled' ? later(state.turn, CAPTIVITY_RULES.paroleTurns) : 0;
  record.paroleBy = outcome === 'paroled' ? captive.captorId : null;
  event(record, captive, outcome, state.turn, outcome === 'ransomed' ? { gold } : {});
  return { ...paroleOf(state, id), outcome };
}

export function captivityEscape(state, id, overrides = {}) {
  const captive = state.captives?.[id];
  if (!captive) return { risk: 0, breakdown: [] };
  const home = state.tiles[state.factions[captive.captorId]?.capitalKey];
  const guards = home?.ownerId === captive.captorId
    ? [...(home.garrison || []), ...(home.field || [])].filter(who => state.characterOwners[who] === captive.captorId && !state.captives[who] && !isOnParole(state, who)).length : 0;
  const pair = readPair(state, id, captive.captorId), watch = overrides.watch ?? alertnessOf(state, id);
  const secured = (overrides.securityUntil ?? captive.securityUntil ?? 0) > state.turn;
  // 典狱: a warden among the people actually at the capital. 怀柔: the player's own edict.
  const warden = home?.ownerId === captive.captorId && [...(home.garrison || []), ...(home.field || [])].some(who => state.characterOwners[who] === captive.captorId && !state.captives[who] && !isOnParole(state, who) && quirkOf(state.characters[who])?.id === 'q_warden');
  const mercy = captive.captorId === state.playerId && Array.isArray(state.edicts) && state.edicts.includes('mercy');
  const breakdown = [
    { label: '基础机会', value: 8 },
    { label: '怨气', value: Math.round((overrides.grudge ?? captive.grudge ?? 0) / 4) },
    { label: '熟悉看守路线', value: Math.min(6, pair.escapes * 2) },
    { label: '首都守备', value: -Math.min(5, guards + Math.floor((home?.ownerId === captive.captorId ? home.troops : 0) / 8)) },
    { label: '再捕警戒', value: -watch * 4 },
    { label: '专门护卫', value: secured ? -12 : 0 },
    ...(warden ? [{ label: '典狱坐镇', value: -5 }] : []),
    ...(mercy ? [{ label: '国策 · 怀柔', value: -4 }] : []),
  ];
  return { risk: clamp(breakdown.reduce((sum, item) => sum + item.value, 0), 2, 40), breakdown };
}
/** The turn a detention is reviewed: 24 turns after capture, later for each renewal. */
export const reviewTurnOf = captive => later(captive.capturedTurn, CAPTIVITY_RULES.reviewTurns + count(captive.extended));
/** Renewing a detention: only the captor, only close to the review, dearer every time. Pure quote. */
export function extensionQuote(state, id) {
  const captive = state.captives?.[id];
  if (!captive) return null;
  const times = Math.floor(count(captive.extended) / CAPTIVITY_RULES.extendTurns), left = Math.max(0, reviewTurnOf(captive) - state.turn);
  const cost = { ap: 0, gold: Math.min(CAPTIVITY_RULES.extendGoldMax, CAPTIVITY_RULES.extendGold + CAPTIVITY_RULES.extendGoldStep * times), supply: 0 };
  const grudge = clamp(count(captive.grudge) + CAPTIVITY_RULES.extendGrudge, 0, 100);
  const reason = left > CAPTIVITY_RULES.extendWindow ? `还有 ${left} 回合才到期，剩 ${CAPTIVITY_RULES.extendWindow} 回合以内再续押。`
    : count(captive.extended) + CAPTIVITY_RULES.extendTurns > CAPTIVITY_RULES.extendMax ? '已经续押到上限了。' : '';
  return { characterId: id, cost, turns: CAPTIVITY_RULES.extendTurns, times, left, reviewTurn: reviewTurnOf(captive), nextReviewTurn: later(reviewTurnOf(captive), CAPTIVITY_RULES.extendTurns),
    grudge, grudgeChange: grudge - count(captive.grudge), reason, due: left <= CAPTIVITY_RULES.extendWindow };
}
export function ransomQuote(state, id) {
  const captive = state.captives?.[id];
  if (!captive) return null;
  const payer = state.factions[captive.originalFactionId], pair = readPair(state, id, captive.captorId);
  const base = 20 + clamp(count(state.growth?.[id]?.level) || 1, 1, 30) * 3;
  const freeReturn = pair.ransomUntil > state.turn;
  const amount = freeReturn ? 0 : captive.originalFactionId === state.playerId ? base : Math.min(payer?.gold || 0, base);
  const reason = !payer?.alive ? '故国已经失去领土，无法支付赎金。' : !freeReturn && amount < 5 ? `${payer.name}目前拿不出最低 5 金币赎金。` : '';
  return { base, amount, payerId: captive.originalFactionId, protectedUntil: pair.ransomUntil, freeReturn, reason,
    description: freeReturn ? `原赎金协议有效至第 ${pair.ransomUntil} 回合，本次免费遣返，不再次支付赎金。` : `本次支付 ${amount} 金币；随后 ${CAPTIVITY_RULES.ransomProtectionTurns} 回合内被同一国家再捕，可按原约免费遣返。` };
}
export function captiveGoodwill(state, id, outcome) {
  const captive = state.captives?.[id];
  if (!captive || readPair(state, id, captive.captorId).goodwillUntil > state.turn) return 0;
  return outcome === 'paroled' ? 12 : outcome === 'released' ? 8 : outcome === 'ransomed' && !ransomQuote(state, id).freeReturn ? 2 : 0;
}
/** Allegiance is a public world condition, not affection or a hidden acceptance roll.
 * Player realms use the saved government representative's content group because
 * their faction ID is always "lord". Changing the active field hero cannot change
 * this identity. Mods use their explicit group/faction IDs; no history is invented. */
export function captiveAllegiance(state, id) {
  const captive = state.captives?.[id];
  if (!captive) return null;
  const origin = state.factions[captive.originalFactionId], character = state.characters[id];
  const originAlive = !!origin?.alive, leader = origin?.leaderId === id;
  const group = character?.group, playerGroup = origin?.isPlayer ? state.characters[origin.leaderId]?.group : null;
  const coreMember = typeof group === 'string' && !!group && (group === captive.originalFactionId || !!playerGroup && group === playerGroup);
  const escapedFromCaptor = readPair(state, id, captive.captorId).escapes > 0;
  const relation = state.relations?.[[captive.captorId, captive.originalFactionId].sort().join('|')];
  const atWar = relation?.status === 'war', conditions = [];
  if (originAlive && leader) conditions.push({ code: 'living-origin-leader', reason: '仍承担故国领袖职责，故国存在期间拒绝转投。' });
  if (originAlive && escapedFromCaptor) conditions.push({ code: 'escaped-from-captor', reason: '曾逃离本国关押，故国存在期间拒绝本国招揽；释放再捕不会清除履历。' });
  if (originAlive && coreMember && atWar) conditions.push({ code: 'core-member-at-war', reason: '仍牵挂故国同团成员，交战期间暂不考虑转投；和平后可重新查看条件。' });
  return { eligible: conditions.length === 0, code: conditions[0]?.code || 'open', reason: conditions[0]?.reason || '', conditions,
    facts: { originalFactionId: captive.originalFactionId, captorId: captive.captorId, originAlive, leader, coreMember, escapedFromCaptor, atWar },
    label: conditions.length ? conditions[0].code === 'core-member-at-war' ? '暂不考虑转投' : '拒绝转投' : '愿意听取条件' };
}

/** Authoritative, pure accession contract shared by UI, public action and NPCs.
 * Readiness never changes ownership. A separate paid action does that exactly once. */
export function captiveAccessionQuote(state, id) {
  const captive = state.captives?.[id], allegiance = captiveAllegiance(state, id);
  if (!captive || !allegiance) return null;
  const level = clamp(count(state.growth?.[id]?.level) || 1, 1, 30);
  const cost = { ap: 1, gold: CAPTIVITY_RULES.admissionBaseGold + CAPTIVITY_RULES.admissionGoldPerLevel * level, supply: 0 };
  const prepared = (captive.progress || 0) >= 100 && (captive.grudge || 0) <= CAPTIVITY_RULES.joinGrudgeLimit;
  const ready = allegiance.eligible && prepared;
  const phaseReason = state.battle || state.turnContinuation && captive.captorId === state.playerId ? '请先完成当前战场与战争阶段。' : '';
  const preparationReason = (captive.progress || 0) < 100 ? '交涉准备尚未达到 100。' : (captive.grudge || 0) > CAPTIVITY_RULES.joinGrudgeLimit ? '怨气仍高于 40，可先照护与和解。' : '';
  const apReason = captive.captorId === state.playerId && state.ap < cost.ap ? '指令用完了，点右下角的圆盘进入下一回合。' : '';
  const budgetReason = (state.factions[captive.captorId]?.gold || 0) < cost.gold ? `需要 ${cost.gold} 金币。` : '';
  const reason = phaseReason || allegiance.reason || preparationReason || apReason || budgetReason;
  return { ...allegiance, prepared, ready, enabled: !reason, reason, preparationReason, budgetReason, cost,
    label: allegiance.eligible ? prepared ? '提出归附条件' : '尚待交涉准备' : allegiance.label,
    description: `${allegiance.reason || '交涉准备达到 100 且怨气不高于 40 后，可另行提出归附条件。'}安置费为 20 + 等级 × 2 金币，最高 80；本次 ${cost.gold} 金币、1 指令。只在成功加入时一次支付，不自动加入，不损失原有属性与履历。`,
    action: { type: 'recruitCaptive', characterId: id, expectedRevision: state.revision } };
}

export function persuasionQuote(state, id, way, charm = 0, bonus = 0) {
  const captive = state.captives?.[id], method = METHODS[way];
  if (!captive || !method) return null;
  const allegiance = captiveAllegiance(state, id), treatment = way === 'care';
  const watch = alertnessOf(state, id), loyalty = Math.min(8, Math.floor(count(state.growth?.[id]?.bond) / 25) * 2);
  const resistance = watch * 3 + loyalty + Math.floor((captive.grudge || 0) / 20);
  const gain = treatment || !allegiance.eligible ? 0 : clamp(method.progress + Math.min(10, Math.max(0, Math.floor(charm)) * 2) - resistance, 4, 32) + Math.max(0, Math.floor(bonus));
  const progress = Math.min(100, (captive.progress || 0) + gain), grudge = clamp((captive.grudge || 0) + method.grudge, 0, 100);
  const nextWatch = treatment ? Math.max(0, watch - 1) : watch;
  const reason = captive.talkTurn === state.turn ? '这回合已经交谈或照护过了。' : !treatment ? allegiance.reason || ((captive.progress || 0) >= 100 && (captive.grudge || 0) <= CAPTIVITY_RULES.joinGrudgeLimit ? '交涉准备已经完成，请另行提出归附条件。' : '') : '';
  return { way, label: method.label, cost: { ap: treatment ? 0 : 1, gold: method.gold, supply: method.supply },
    progress, progressGain: progress - (captive.progress || 0), grudge, grudgeChange: grudge - (captive.grudge || 0),
    watch: nextWatch, watchChange: nextWatch - watch, resistance,
    escapeRisk: captivityEscape(state, id, { grudge, watch: nextWatch }).risk,
    joined: false, prepared: progress >= 100 && grudge <= CAPTIVITY_RULES.joinGrudgeLimit, allegiance, reason,
    description: `${treatment ? '照护不增加交涉准备，不改变归附立场，也不会自动加入' : `交涉准备 +${progress - (captive.progress || 0)}`}，怨气 ${grudge - (captive.grudge || 0) >= 0 ? '+' : ''}${grudge - (captive.grudge || 0)}${treatment ? nextWatch < watch ? '，再捕警戒降低一级' : '，当前无额外警戒' : ''}。${allegiance.reason || '准备达 100 且怨气不高于 40 后，仍需另行支付安置费并确认归附。'}` };
}
export function applyPersuasion(state, id, quote) {
  const captive = state.captives[id];
  captive.talkTurn = state.turn; captive.progress = quote.progress; captive.grudge = quote.grudge;
  if (quote.way === 'care') {
    const pair = ensurePair(ensureRecord(state, id), captive.captorId);
    pair.watch = quote.watch; pair.watchTurn = state.turn;
  }
}

/** Safe, purpose-built UI data. Never forwards unrelated legacy growth metadata. */
export function getCaptiveStatus(state, id) {
  if (!own(state.characters, id)) return null;
  const captive = state.captives?.[id], record = readRecord(state, id), escape = captivityEscape(state, id);
  const securityUntil = captive?.securityUntil || 0;
  return { characterId: id, captures: record.captures, recaptures: record.recaptures, escapes: record.escapes,
    releases: record.releases, ransoms: record.ransoms, rescues: record.rescues, joins: record.joins,
    historyIncomplete: record.legacyCaptures > 0, recentEvents: copy(record.events), parole: paroleOf(state, id),
    held: !!captive, heldTurns: captive ? Math.max(0, state.turn - captive.capturedTurn) : 0,
    progress: captive?.progress || 0, grudge: captive?.grudge || 0, watch: captive ? alertnessOf(state, id) : 0,
    recaptureAfterEscape: !!captive?.recaptureAfterEscape,
    security: { until: securityUntil, remaining: Math.max(0, securityUntil - state.turn), label: securityUntil > state.turn ? '专门护卫' : '常规看守' },
    escapeRisk: escape.risk, escapeBreakdown: escape.breakdown, ransom: ransomQuote(state, id),
    reviewTurn: captive ? reviewTurnOf(captive) : null, reviewLeft: captive ? Math.max(0, reviewTurnOf(captive) - state.turn) : 0,
    extended: count(captive?.extended), extension: captive ? extensionQuote(state, id) : null,
    joinGrudgeLimit: CAPTIVITY_RULES.joinGrudgeLimit, progressLabel: '交涉准备', accession: captiveAccessionQuote(state, id) };
}

export function captivityErrors(state) {
  const errors = [], int = (n, low, high = MAX) => Number.isSafeInteger(n) && n >= low && n <= high;
  if (state.captivityVersion !== CAPTIVITY_VERSION || !object(state.captureHistory)) return ['俘虏履历版本或记录无效。'];
  if (Object.keys(state.captureHistory).length > 1000) errors.push('俘虏履历超过容量。');
  for (const [id, record] of Object.entries(state.captureHistory)) {
    const at = `角色 ${id} 的俘虏履历`;
    if (!own(state.characters, id) || !object(record)) { errors.push(`${at}无效。`); continue; }
    if (TOTALS.some(key => !int(record[key], 0)) || TOTALS.filter(key => key !== 'captures').some(key => record[key] > record.captures) || record.recaptures > Math.max(0, record.captures - 1)) errors.push(`${at}次数无效。`);
    if (!int(record.lastCaptureTurn, 0, state.turn) || !int(record.lastExitTurn, 0, state.turn) || !(record.lastOutcome === null || OUTCOMES.includes(record.lastOutcome))) errors.push(`${at}时间或去向无效。`);
    if (!int(record.paroleUntil, 0, later(state.turn, CAPTIVITY_RULES.paroleTurns)) || !(record.paroleBy === null || own(state.factions, record.paroleBy)) || (record.paroleUntil && record.paroleBy === null) || (record.paroleUntil > state.turn && (state.captives[id] || record.lastOutcome !== 'paroled'))) errors.push(`${at}假释记录无效。`);
    if (!object(record.byCaptor) || Object.keys(record.byCaptor).length > 100) errors.push(`${at}关押方记录无效。`);
    else {
      for (const [captorId, pair] of Object.entries(record.byCaptor)) {
        if (!own(state.factions, captorId) || !object(pair) || !int(pair.captures, 1, record.captures) || !int(pair.recaptures, 0, Math.max(0, pair.captures - 1)) || !int(pair.escapes, 0, pair.captures) || !int(pair.watch, 0, CAPTIVITY_RULES.watchMax) || !int(pair.watchTurn, 0, state.turn) || !int(pair.lastExitTurn, 0, state.turn) || !OUTCOMES.includes(pair.lastOutcome) || !int(pair.ransomUntil, 0, later(state.turn, CAPTIVITY_RULES.ransomProtectionTurns)) || !int(pair.goodwillUntil, 0, later(state.turn, CAPTIVITY_RULES.goodwillCooldownTurns))) errors.push(`${at}关押方 ${captorId} 无效。`);
      }
      const pairs = Object.values(record.byCaptor);
      if (pairs.reduce((sum, pair) => sum + count(pair?.captures), 0) > record.captures || pairs.reduce((sum, pair) => sum + count(pair?.escapes), 0) !== record.escapes || pairs.reduce((sum, pair) => sum + count(pair?.recaptures), 0) !== record.recaptures) errors.push(`${at}总数与各国记录不一致。`);
    }
    const captive = state.captives?.[id];
    if (['escapes', 'releases', 'ransoms', 'rescues', 'joins'].reduce((sum, key) => sum + count(record[key]), 0) > record.captures - (captive ? 1 : 0)) errors.push(`${at}去向次数超过被俘次数。`);
    if (captive && (record.lastOutcome !== 'captured' || record.lastCaptureTurn !== captive.capturedTurn || record.byCaptor?.[captive.captorId]?.lastOutcome !== 'captured')) errors.push(`${at}与当前关押状态不一致。`);
    if (!Array.isArray(record.events) || record.events.length > CAPTIVITY_RULES.historyLimit || record.events.some((item, index) => !object(item) || !OUTCOMES.includes(item.type) || !int(item.turn, 1, state.turn) || (index && record.events[index - 1]?.turn > item.turn) || !own(state.factions, item.captorId) || !own(state.factions, item.originalFactionId) || item.captorId === item.originalFactionId || (item.gold !== undefined && !int(item.gold, 0, 110)) || (item.repeated !== undefined && typeof item.repeated !== 'boolean') || (item.afterEscape !== undefined && typeof item.afterEscape !== 'boolean'))) errors.push(`${at}事件记录无效。`);
  }
  for (const [id, captive] of Object.entries(state.captives || {})) {
    if (!object(captive)) continue; // The engine validates the required base shape.
    if (['progress', 'grudge'].some(key => captive[key] !== undefined && !int(captive[key], 0, 100)) || (captive.talkTurn !== undefined && !int(captive.talkTurn, 0, state.turn)) || (captive.securityUntil !== undefined && !int(captive.securityUntil, 0, later(state.turn, CAPTIVITY_RULES.securityTurns))) || (captive.recaptureAfterEscape !== undefined && typeof captive.recaptureAfterEscape !== 'boolean') || (captive.extended !== undefined && (!int(captive.extended, 0, CAPTIVITY_RULES.extendMax) || captive.extended % CAPTIVITY_RULES.extendTurns !== 0))) errors.push(`俘虏 ${id} 的交涉或看守记录无效。`);
  }
  for (const tile of Object.values(state.tiles || {})) if ([...(tile.garrison || []), ...(tile.field || [])].some(id => state.captives?.[id] || isOnParole(state, id))) errors.push(`地块 ${tile.key} 不应部署被俘或假释休整中的角色。`);
  return errors;
}

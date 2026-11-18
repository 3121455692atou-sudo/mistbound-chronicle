// 差事 (2026-11-15): girls who are not out fighting work a piece of the player's land, so a big roster is not a bench.
// One girl per tile. On duty she leaves every army and garrison, so she never fights there; one of her stats becomes output:
//   经营 (经营)  more gold          屯田 (守备)  more grain
//   治理 (魅力)  more control there: output rises with it and building gets cheaper
//   征募 (统军)  people there grow faster
// Pure rules: the engine applies them (income, control, growth), the UI quotes them. Only the player's nation uses duties.
import { STATS } from './growth.mjs?v=1118-1603';

export const DUTIES = Object.freeze([
  Object.freeze({ id: 'manage', name: '经营', stat: 'economy', statName: '经营', icon: 'coin', about: '每回合多产金币' }),
  Object.freeze({ id: 'farm', name: '屯田', stat: 'defense', statName: '守备', icon: 'wheat', about: '每回合多产粮' }),
  Object.freeze({ id: 'govern', name: '治理', stat: 'charm', statName: '魅力', icon: 'crest', about: '控制力提高：产出跟着涨，建造更便宜' }),
  Object.freeze({ id: 'muster', name: '征募', stat: 'attack', statName: '统军', icon: 'recruit', about: '人口长得更快' }),
]);
export const DUTY_RULES = Object.freeze({ ap: 1, control: .04 });
export const dutyById = id => DUTIES.find(duty => duty.id === id) || null;
export const dutiesOf = state => state?.campaign?.duties || {};
export const onDuty = (state, id) => Boolean(id && dutiesOf(state)[id]);
/** Who works this tile, if anyone. */
export function dutyAt(state, key) {
  for (const [id, duty] of Object.entries(dutiesOf(state))) if (duty.key === key) return { id, ...duty };
  return null;
}
/** Her stat as it is now (definition + growth + training), the same way her sheet shows it. */
export function dutyStat(state, id, stat) {
  const character = state.characters?.[id], growth = state.growth?.[id], cap = STATS.find(item => item.id === stat)?.cap ?? 99;
  if (!character) return 0;
  return Math.max(0, Math.min(cap, (character.stats?.[stat] || 0) + (growth?.gains?.[stat] || 0) + (growth?.trained?.[stat] || 0)));
}
// A tile with any building on it has a workshop, a granary, a store to run: one more there.
const built = tile => Boolean(tile?.building);
/** What one girl doing one job on one tile adds: gold and grain per turn, control as a fraction, growth as food per turn. */
export function dutyEffect(state, tile, id, job) {
  const duty = dutyById(job), value = duty ? dutyStat(state, id, duty.stat) : 0, half = value ? Math.ceil(value / 2) : 0;
  return {
    job, value,
    gold: job === 'manage' && value ? half + (built(tile) ? 1 : 0) : 0,
    supply: job === 'farm' && value ? half + (built(tile) ? 1 : 0) : 0,
    control: job === 'govern' ? Math.round(DUTY_RULES.control * value * 100) / 100 : 0,
    growth: job === 'muster' ? value : 0,
  };
}
/** The duty working this tile, as an effect, or nothing. Cut-off land and land no longer the player's give nothing. */
export function tileDuty(state, tile) {
  if (!tile?.ownerId || tile.ownerId !== state.playerId || tile.cutSince !== undefined || tile.shipId) return null;
  const duty = dutyAt(state, tile.key);
  return duty ? { id: duty.id, ...dutyEffect(state, tile, duty.id, duty.job) } : null;
}
export const dutyControl = (state, tile) => tileDuty(state, tile)?.control || 0;
export const dutyGrowth = (state, tile) => tileDuty(state, tile)?.growth || 0;
/** One line for a duty's effect, the way the UI says it. */
export function dutyLine(effect, before = null) {
  if (!effect) return '';
  if (effect.gold) return `金币 +${effect.gold}/回合`;
  if (effect.supply) return `粮 +${effect.supply}/回合`;
  if (effect.control) return before === null ? `控制力 +${Math.round(effect.control * 100)}%` : `控制力 ${before}% → ${Math.min(100, before + Math.round(effect.control * 100))}%`;
  if (effect.growth) return `人口增长 +${effect.growth}/回合`;
  return '这项她做不来（数值是 0）';
}

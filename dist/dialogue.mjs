// Finds written dialogue for a slot. UI only: rules never depend on it, so a missing
// or broken file just means the game falls back to ordinary lines.
import { SLOTS } from './slots.mjs?v=1118-1603';

let entries = [];
export async function loadDialogues() {
  try {
    const list = await (await fetch('dialogue/manifest.json')).json();
    const files = await Promise.all(list.map(name => fetch(`dialogue/${name}`).then(response => response.json()).catch(() => [])));
    entries = files.flat().filter(entry => SLOTS[entry?.slot] && Array.isArray(entry.lines) && entry.lines.length);
  } catch { entries = []; }
  return entries.length;
}
export const dialogueCount = id => entries.filter(entry => entry.who === id).length;
const matches = (rule, value) => rule === undefined || rule === '*' || rule === value;
const DOMESTIC_SLOTS = new Set(['turn.random', 'join.first', 'join.reunion', 'talk.daily', 'gift.normal', 'gift.loved', 'bond.tier', 'level.milestone', 'perk.chosen', 'post.assigned']);
export function dialogueCast(entry) {
  const ids = new Set();
  if (entry?.who && entry.who !== '*') ids.add(entry.who);
  if (entry?.with && entry.with !== '*') ids.add(entry.with);
  for (const line of entry?.lines || []) if (line?.speaker) ids.add(line.speaker);
  for (const choice of entry?.choices || []) if (choice?.reply?.speaker) ids.add(choice.reply.speaker);
  return [...ids];
}
/** Everyday scenes: anything whose cast is all present in our realm and which has not played yet. */
export function findEveryday(present, seen = []) {
  const here = new Set(present);
  const options = entries.filter(entry => entry.slot === 'turn.random' && !seen.includes(entry.id) && dialogueCast(entry).every(id => here.has(id)));
  return options[Math.floor(Math.random() * options.length)] || null;
}
/** The most specific unseen entry wins; `repeat` entries may play again. */
export function findDialogue(slot, context, seen = []) {
  const here = context?.present ? new Set(context.present) : null;
  const options = entries.filter(entry => entry.slot === slot && matches(entry.who, context?.who) && matches(entry.with, context?.with) && matches(entry.group, context?.group) && (entry.param === undefined || entry.param === context?.param) && (entry.repeat || !seen.includes(entry.id)) && (!here || !DOMESTIC_SLOTS.has(slot) || dialogueCast(entry).every(id => here.has(id))));
  const score = entry => (entry.who && entry.who !== '*' ? 4 : 0) + (entry.with && entry.with !== '*' ? 2 : 0) + (entry.param !== undefined ? 1 : 0);
  options.sort((a, b) => score(b) - score(a));
  const best = options.filter(entry => score(entry) === score(options[0] || {}));
  return best[Math.floor(Math.random() * best.length)] || null;
}

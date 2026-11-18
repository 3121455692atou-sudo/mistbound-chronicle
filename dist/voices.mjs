// Situational lines. Picking is UI-only, so it may be random; the rules never read it.
import { BARKS } from './barks.mjs?v=1118-1603';

const recent = new Map();
function pick(pool, key) {
  if (!pool?.length) return null;
  const used = recent.get(key) || [], fresh = pool.filter(line => !used.includes(line.text));
  const list = fresh.length ? fresh : pool, line = list[Math.floor(Math.random() * list.length)];
  used.push(line.text);
  // Remember almost the whole pool, so a line only comes back after the others have played.
  recent.set(key, used.slice(-Math.max(1, pool.length - 1)));
  return line;
}
export const voiceLine = (id, trigger) => pick(BARKS[id]?.[trigger], `${id}:${trigger}`);
/** A line for two girls sharing the field, when either has something to say about the other. */
export function teamLine(ids) {
  const pairs = [];
  for (const id of ids) for (const other of ids) if (id !== other && BARKS[id]?.team?.[other]?.length) pairs.push([id, other]);
  if (!pairs.length) return null;
  const [id, other] = pairs[Math.floor(Math.random() * pairs.length)];
  const line = pick(BARKS[id].team[other], `${id}+${other}`);
  return line && { id, ...line };
}

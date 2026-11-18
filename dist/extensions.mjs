/**
 * Extension slots: places where later features add a button without touching the screen that shows it.
 *
 *   registerTileAction    the tile ring: joins the 建设 or 军务 sub-ring of the player's own tiles
 *   registerBondAction    a girl's 相处 page: hexes in the 互动 row under the gift flower
 *   registerCaptiveAction the prison cell (and the full prison roster): hexes next to 劝说 / 赎回 / 释放 …
 *   registerSheetAction   any page of the character sheet (能力 / 天赋 / 相处 / 任用)
 *
 * Every slot uses the game's one interaction: tap a hex → the narration box says what will happen →
 * the burst button does it. Nothing registered means nothing shown; no empty placeholders reach players.
 *
 * A definition:
 *   {
 *     id: 'date.walk',                 // unique, stable
 *     label: '散步',                   // ≤ 4 characters reads best on a hex
 *     icon: 'heart',                   // a name from icons.mjs
 *     group: 'army',                   // registerTileAction only: 'build' (default) or 'army'
 *     tab: 'bond',                     // registerSheetAction only: 'grow' | 'perk' | 'bond' | 'duty'
 *     when: ctx => true,               // show at all?
 *     enabled: ctx => true,            // tappable? (or a boolean)
 *     reason: ctx => '这回合散过步了',  // why not, shown when disabled
 *     detail: ctx => '信赖 +4 · 1 指令',// the narration box line before confirming
 *     cost: { ap: 1, gold: 0, supply: 0 },
 *     run: ctx => ctx.dispatch({ type: 'walk', characterId: ctx.characterId }),
 *     // registerTileAction only: instead of run, form: ctx => ({ html, bind(root) }) turns the card beside the ring into
 *     // this order's form (who, which model, the price) with its own burst; short: ctx => '120金' is the petal's small line.
 *   }
 *
 * ctx always carries { state, dispatch, toast, refresh } plus the subject: { tile, key } for tiles,
 * { characterId, hero, view } for girls and captives. dispatch(action) goes through the shared
 * engine (undo, autosave, CLI parity), so a new state change belongs in engine.mjs as a new action
 * type first, and the button here only sends it. A run() that only opens a dialogue or a scene may
 * skip dispatch.
 */
const slots = { tile: [], bond: [], captive: [], sheet: [] };

function register(kind, def) {
  if (!def || typeof def.id !== 'string' || !def.id || typeof def.label !== 'string' || typeof def.run !== 'function' && typeof def.form !== 'function')
    throw new TypeError('扩展按钮需要 id、label 和 run（或 form）。');
  const list = slots[kind], at = list.findIndex(item => item.id === def.id);
  if (at >= 0) list.splice(at, 1, def); else list.push(def);
  return () => { const i = list.indexOf(def); if (i >= 0) list.splice(i, 1); };
}
export const registerTileAction = def => register('tile', def);
export const registerBondAction = def => register('bond', def);
export const registerCaptiveAction = def => register('captive', def);
export const registerSheetAction = def => register('sheet', def);

const value = (field, ctx, fallback) => typeof field === 'function' ? field(ctx) : field ?? fallback;
function resolve(kind, ctx, filter = () => true) {
  const out = [];
  for (const def of slots[kind]) {
    try {
      if (!filter(def) || !value(def.when, ctx, true)) continue;
      const enabled = Boolean(value(def.enabled, ctx, true));
      out.push({ ...def, enabled, reason: enabled ? '' : String(value(def.reason, ctx, '现在不行。')), detail: String(value(def.detail, ctx, '') || ''), short: String(value(def.short, ctx, '') || ''), cost: value(def.cost, ctx, {}) || {} });
    } catch (error) { console.error(`扩展 ${def.id} 出错`, error); }
  }
  return out;
}
/** Resolved tile orders for a tile context: { state, tile, own, discovered }. */
export const tileExtensions = ctx => ctx.own ? resolve('tile', ctx) : [];
export const bondExtensions = ctx => resolve('bond', ctx);
export const captiveExtensions = ctx => resolve('captive', ctx);
export const sheetExtensions = (tab, ctx) => resolve('sheet', ctx, def => (def.tab || 'bond') === tab);
/** For tests and the console: what is registered right now. */
export const listExtensions = () => Object.fromEntries(Object.entries(slots).map(([kind, list]) => [kind, list.map(item => item.id)]));

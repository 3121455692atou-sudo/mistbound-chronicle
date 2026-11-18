import {BUILDINGS} from './content.mjs?v=1118-1603';

// Presentation only. The names/glyphs are the rule definitions; these accents do
// not replace faction colours or claim anything about income or affordability.
export const BUILDING_MARKS = Object.freeze({
  garden: Object.freeze({accent: '#b4dc86', shape: 'plot'}),
  farm: Object.freeze({accent: '#82d4b0', shape: 'roof'}),
  mine: Object.freeze({accent: '#f1a7ce', shape: 'ticket'}),
  quarry: Object.freeze({accent: '#afbfed', shape: 'diamond'}),
  lumber: Object.freeze({accent: '#99cfa2', shape: 'hex'}),
  port: Object.freeze({accent: '#82d9e6', shape: 'round'}),
  camp: Object.freeze({accent: '#cdb0ed', shape: 'tent'}),
  fort: Object.freeze({accent: '#f4a48e', shape: 'shield'}),
  workshop: Object.freeze({accent: '#99cfa2', shape: 'roof'}),
  factory: Object.freeze({accent: '#afbfed', shape: 'diamond'}),
  shipyard: Object.freeze({accent: '#82d9e6', shape: 'round'}),
  airfield: Object.freeze({accent: '#afbfed', shape: 'ticket'}),
  bank: Object.freeze({accent: '#f1a7ce', shape: 'ticket'}),
  centralBank: Object.freeze({accent: '#f1a7ce', shape: 'hex'}),
  administrativeHall: Object.freeze({accent: '#cdb0ed', shape: 'shield'}),
  wonder: Object.freeze({accent: '#e8c15a', shape: 'round'}),
});

/** No hidden tile, capital-art name, cost, yield or guessed operational status. */
export function buildingLabelModel(tile, {visible = true, zoom = 1, layer = 'terrain', focused = false} = {}) {
  if (!visible || !tile || tile.discovered === false) return null;
  const id = typeof tile.building === 'string' ? tile.building : tile.building?.id;
  const definition = Object.hasOwn(BUILDINGS, id) ? BUILDINGS[id] : null;
  const mark = BUILDING_MARKS[id];
  if (!definition || !mark || (layer !== 'terrain' && !focused)) return null;
  const level = Number.isInteger(tile.buildingLevel) && tile.buildingLevel > 0 ? tile.buildingLevel : 1;
  // These are explicit stored states, not a duplicate of the engine's staffing,
  // fort-readiness, maintenance or production calculations.
  const states = [];
  if (tile.cutSince !== undefined) states.push('失联');
  if (id === 'fort' && tile.fortMothballed === true) states.push('封存');
  const detail = focused || zoom >= 1.6;
  return {id, name: definition.name, glyph: definition.icon, ...mark, level,
    capital: Boolean(tile.isCapital), detail, states,
    text: `${definition.name} ${level}级${states.length ? ` · ${states.join(' · ')}` : ''}`,
    compactLevel: zoom >= 1 && level > 1 ? String(level) : '',
    compactState: states.length ? '!' : '',
  };
}

export function rectanglesOverlap(a, b, gap = 2) {
  return Math.abs(a.x - b.x) < (a.w + b.w) / 2 + gap && Math.abs(a.y - b.y) < (a.h + b.h) / 2 + gap;
}

function touchesQuiet(box, quiet) {
  const dx = Math.max(Math.abs(quiet.x - box.x) - box.w / 2, 0);
  const dy = Math.max(Math.abs(quiet.y - box.y) - box.h / 2, 0);
  return dx * dx + dy * dy < quiet.r * quiet.r;
}

/** Deterministic screen-space culling; no labels add a pointer target. */
export function layoutBuildingLabels(items, {reserved = [], quiet = null, bounds = null} = {}) {
  const placed = [];
  const ordered = [...items].sort((a, b) => b.rank - a.rank || a.key.localeCompare(b.key));
  for (const item of ordered) {
    for (const option of item.options) {
      if (bounds && (option.x - option.w / 2 < bounds.left || option.x + option.w / 2 > bounds.right || option.y - option.h / 2 < bounds.top || option.y + option.h / 2 > bounds.bottom)) continue;
      if (quiet?.card && rectanglesOverlap(option, quiet.card)) continue;
      if (quiet && !item.selected && touchesQuiet(option, quiet)) continue;
      if (reserved.some(box => rectanglesOverlap(option, box)) || placed.some(box => rectanglesOverlap(option, box))) continue;
      placed.push({...item, ...option});
      break;
    }
  }
  return placed;
}

/** Declared fixtures: put two nations at war and seat girls on a tile without playing it out. */
export function war(state, a = 'lord', b = 'mujica') {
  state.relations[[a, b].sort().join('|')] = { status: 'war', favor: -30, until: 0, since: state.turn, trade: false, talkTurn: 0 };
  return state;
}
export function warAll(state) {
  for (const faction of Object.values(state.factions)) if (!faction.isPlayer) war(state, state.playerId, faction.id);
  return state;
}
export function seat(state, key, ...ids) {
  for (const tile of Object.values(state.tiles)) { tile.garrison = tile.garrison.filter(id => !ids.includes(id)); tile.field = tile.field.filter(id => !ids.includes(id)); }
  state.tiles[key].field.push(...ids);
  return state;
}
export function elite(state, key, value) { state.tiles[key].elite = { R: 0, SR: 0, SSR: 0, ...value }; return state; }
/** Switch every signature trait (专属词条) off in this save, for fixtures whose numbers are about something else. */
export function plainTraits(state) { for (const character of Object.values(state.characters)) character.quirk = 'none'; return state; }

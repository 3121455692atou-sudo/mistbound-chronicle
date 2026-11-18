import { CHARACTER_DEFINITIONS, TERRAIN_DEFINITIONS } from './content.mjs?v=1118-1603';
import { battlePlayer, COLORS } from './multiplayer-engine.mjs?v=1118-1603';

export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const portraitUrl = hero => hero?.portrait ? `assets/portraits/${encodeURIComponent(hero.portrait)}/smile.webp` : 'assets/sazai.webp';
const definitions = new Map(CHARACTER_DEFINITIONS.map(hero => [hero.id, hero]));
export const characterView = (hero, owner) => ({ ...definitions.get(hero.id), ...structuredClone(hero), id: `${owner}|${hero.id}`, sourceId: hero.id, ownerId: owner });

/** Rendering adapter only. Original WorldMap and BattleUI receive copies, never authority over a room. */
export function presentationState(room, viewpoint = room?.me) {
  if (!room?.game) return { tiles: {}, characters: {}, factions: {}, terrainTypes: {}, battle: null };
  const game = room.game, characters = {}, factions = {}, tiles = {};
  const observer = room.role === 'spectator' || !room.me;
  const viewId = observer ? (game.players.find(p => p.id === viewpoint) || game.players.find(p => p.alive) || game.players[0]).id : room.me;
  let otherColor = 1;
  for (const player of game.players) {
    factions[player.id] = { id: player.id, name: player.name, color: player.id === viewId ? COLORS[0] : COLORS[otherColor++],
      isPlayer: player.id === viewId, capitalKey: player.capital };
    for (const hero of player.army.heroes) {
      const view = characterView(hero, player.id);
      characters[view.id] = view;
    }
  }
  for (const tile of Object.values(game.tiles)) tiles[tile.key] = {
    key: tile.key, q: tile.q, r: tile.r, terrainId: tile.terrain, ownerId: tile.owner,
    discovered: true, troops: tile.troops, building: tile.building, buildingLevel: tile.level,
    isCapital: !!tile.capital, name: tile.capital ? game.players.find(p => p.id === tile.capital)?.name || tile.key : tile.key, garrison: [], field: [],
  };
  for (const player of game.players.filter(p => p.alive)) {
    if (tiles[player.army.key]) tiles[player.army.key].field = player.army.heroes.map(h => `${player.id}|${h.id}`);
  }
  let battle = null;
  if (game.battle) {
    battle = structuredClone(game.battle);
    const viewerSide = viewId === battle.attackerId ? 'attacker' : viewId === battle.defenderId ? 'defender' : null;
    const controller = room.seats.find(s => s.id === room.me);
    const canCommand = !observer && room.status === 'playing' && battlePlayer(game) === room.me && controller?.control !== 'ai';
    battle.playerSide = viewerSide || battle.playerSide;
    battle.phase = canCommand ? 'player' : 'enemy';
    for (const unit of battle.units) if (unit.characterId)
      unit.characterId = `${unit.side === 'attacker' ? battle.attackerId : battle.defenderId}|${unit.characterId}`;
  }
  return { playerId: viewId, observer, turn: game.round, revision: room.version, tiles, characters, factions, battle,
    terrainTypes: Object.fromEntries(TERRAIN_DEFINITIONS.map(t => [t.id, t])), notices: [] };
}

/** Same mangaPage structure as the single-player app; its original comic-ui.css / saga.css own the layout. */
export function mangaPage({ title, ribbon = '', lead, line = '', paper = '', cls = '' }) {
  const s = String(title ?? ''), chars = [...s];
  const head = /^[\x20-\x7e]+$/.test(s) ? `<h2 style="--n:${chars.length}">${esc(s)}</h2>` : `<h2 class="cs-v" style="--n:${chars.length}">${chars.map(ch => `<i${ch === '·' ? ' class="dot"' : ''}>${esc(ch)}</i>`).join('')}</h2>`;
  return `<div class="cs page ${esc(cls)}" style="--hero:${esc(lead?.color || '#ffc83d')};--pop:#3d6f8e">
    <div class="cs-stage"><div class="cs-frame"><i></i></div><div class="cs-girl"><img class="cs-art" src="${portraitUrl(lead)}" alt="${esc(lead?.name || '')}"></div></div>
    <header class="cs-id">${head}</header>
    ${ribbon ? `<span class="cs-ribbon"><b>${esc(ribbon)}</b></span>` : ''}
    <div class="cs-say always"><div class="bubble"><b>${esc(lead?.name || '')}</b><p>${esc(line)}</p></div></div>
    <div class="cs-leafwrap"><section class="cs-leaf">${paper}</section></div>
  </div>`;
}

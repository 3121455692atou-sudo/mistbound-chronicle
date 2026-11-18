import { applyGameAction, adjacent, distance, battlePlayer } from '../web/multiplayer-engine.mjs';

/** Deterministic AI submits the same validated commands as people. It never writes a game snapshot. */
export function chooseAiAction(game, playerId) {
  const player = game.players.find(p => p.id === playerId && p.alive);
  if (!player || game.status !== 'playing') return null;
  if (game.battle) return battlePlayer(game) === playerId
    ? { type: game.battleContext.versus ? 'battleAutoTurn' : 'battleAuto' } : null;
  if (game.turnId !== playerId) return null;
  const legal = action => {
    try { applyGameAction(game, playerId, action); return action; } catch { return null; }
  };
  if (!game.ap) return { type: 'endTurn' };
  const army = player.army, here = game.tiles[army.key];
  const talk = legal({ type: 'talk', targetId: player.id, characterId: army.heroes[0].id });
  if (talk) return talk;
  if (here.troops > 0 && army.troops <= 34) {
    const muster = legal({ type: 'muster', key: here.key });
    if (muster) return muster;
  }
  if (army.troops <= 28) {
    const recruit = legal({ type: 'recruit', key: here.key });
    if (recruit) return recruit;
  }
  if (player.gold >= 60 && player.supply >= 20) {
    for (const hero of army.heroes) {
      const train = legal({ type: 'train', targetId: player.id, characterId: hero.id, stat: 'attack' });
      if (train) return train;
    }
  }
  if (player.supply < 12) {
    for (const tile of Object.values(game.tiles).filter(t => t.owner === playerId && !t.capital && !t.building)) {
      const build = legal({ type: 'build', key: tile.key, building: 'farm' });
      if (build) return build;
    }
  }
  const enemies = game.players.filter(p => p.alive && p.id !== playerId);
  const homeThreat = enemies.some(p => distance(game.tiles[p.army.key], game.tiles[player.capital]) <= 2 && p.army.troops >= 10);
  const target = homeThreat && distance(here, game.tiles[player.capital]) > 1 ? game.tiles[player.capital]
    : game.tiles[enemies.sort((a, b) => distance(here, game.tiles[a.capital]) - distance(here, game.tiles[b.capital]))[0]?.capital];
  if (target) {
    const currentDistance = distance(here, target);
    const candidates = adjacent(here).map(key => game.tiles[key]).filter(Boolean)
      .sort((a, b) => distance(a, target) - distance(b, target) || Number(!!a.owner) - Number(!!b.owner));
    for (const tile of candidates) {
      // Do not bounce between friendly squares just to consume the remaining AP.
      if (tile.owner === playerId && distance(tile, target) >= currentDistance) continue;
      const move = legal({ type: 'moveArmy', key: tile.key });
      if (move) return move;
    }
  }
  if (player.gold >= 40) {
    for (const tile of Object.values(game.tiles).filter(t => t.owner === playerId && !t.capital && !t.building)) {
      const build = legal({ type: 'build', key: tile.key, building: player.supply < 25 ? 'farm' : 'mine' });
      if (build) return build;
    }
  }
  return { type: 'endTurn' };
}

export function chooseAiReply(game, offer) {
  const from = game.players.find(p => p.id === offer.from), target = game.players.find(p => p.id === offer.to);
  if (!from?.alive || !target?.alive) return false;
  const key = [from.id, target.id].sort().join('|'), relation = game.social?.relations?.[key];
  const favor = relation?.favor || 0;
  if (offer.kind === 'trade') return favor >= -10;
  const nearVictory = target.army.troops > from.army.troops * 1.5
    && distance(game.tiles[target.army.key], game.tiles[from.capital]) <= 3;
  return favor >= 8 || (!nearVictory && favor >= -10);
}

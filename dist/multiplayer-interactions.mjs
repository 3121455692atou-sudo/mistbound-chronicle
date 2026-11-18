import { COPY, formatCopy } from './multiplayer-copy.mjs?v=1118-1603';

export const INTERACTION_TYPES = new Set(['talk', 'gift', 'train', 'visit', 'diplomaticGift', 'offerPeace', 'offerTrade', 'respondOffer']);
const check = (condition, text) => { if (!condition) throw new Error(text); };
export const relationKey = (a, b) => [a, b].sort().join('|');
export function socialOf(game) {
  game.social ||= { relations: {}, affinity: {}, cooldowns: {}, offers: [], events: [], sequence: 0 };
  return game.social;
}
export const readSocial = game => game.social || { relations: {}, affinity: {}, cooldowns: {}, offers: [], events: [], sequence: 0 };
export const readAffinity = (game, actor, owner, hero) => readSocial(game).affinity[`${actor}|${owner}|${hero}`]?.bond || 0;
export const readDiplomacy = (game, a, b) => readSocial(game).relations[relationKey(a, b)] || { favor: 0, truceUntil: 0, tradeUntil: 0 };
export const isTruce = (game, a, b) => !!a && !!b && (readDiplomacy(game, a, b).truceUntil || 0) >= game.round;
export function tradeIncome(game, playerId, settlementRound = game.round + 1) {
  return Object.entries(readSocial(game).relations).filter(([key, relation]) =>
    key.split('|').includes(playerId) && relation.tradeUntil >= settlementRound
    && key.split('|').every(id => game.players.some(p => p.id === id && p.alive))).length * 3;
}
function record(game, kind, actor, target, extra = {}) {
  const social = socialOf(game);
  social.sequence++;
  social.events.push({ id: social.sequence, round: game.round, kind, actor: actor.id,
    actorName: actor.name, target: target.id, targetName: target.name, ...extra });
  social.events = social.events.slice(-100);
}
export function interactionText(event, viewer) {
  const values = {
    actor: event.actor === viewer ? '你' : event.actorName,
    target: event.target === viewer ? '你' : event.targetName,
    hero: event.heroName || '', stat: event.stat === 'attack' ? '攻击' : '防御',
  };
  const text = formatCopy(event.kind, values);
  return /Accepted$|Rejected$/.test(event.kind) ? `${values.actor} → ${values.target}：${text}` : text;
}
export function performInteraction(game, actor, action, pay) {
  const social = socialOf(game);
  const cooldownMessage = formatCopy('interactionCooldown', { actor: '你' });
  if (action.type === 'respondOffer') {
    check(typeof action.accept === 'boolean', COPY.noOffer);
    const offer = social.offers.find(o => o.id === action.offerId && o.to === actor.id && o.expires >= game.round);
    const from = offer && game.players.find(p => p.id === offer.from && p.alive);
    check(offer && from, COPY.noOffer);
    const relation = social.relations[relationKey(from.id, actor.id)] ||= { favor: 0, truceUntil: 0, tradeUntil: 0 };
    if (action.accept) {
      if (offer.kind === 'peace') relation.truceUntil = game.round + 3;
      else relation.tradeUntil = game.round + 5;
      relation.favor = Math.min(100, relation.favor + 5);
    } else relation.favor = Math.max(-100, relation.favor - 2);
    social.offers = social.offers.filter(o => o.id !== offer.id);
    record(game, offer.kind + (action.accept ? 'Accepted' : 'Rejected'), actor, from);
    return game;
  }
  check(game.turnId === actor.id, COPY.needOwnTurn);
  check(!game.battle, COPY.activeBattleInteraction);
  const target = game.players.find(p => p.id === action.targetId && p.alive);
  check(target, COPY.noSuchTarget);
  const cooldowns = social.cooldowns[actor.id] ||= {};
  if (['talk', 'gift', 'train'].includes(action.type)) {
    const hero = target.army.heroes.find(h => h.id === action.characterId);
    check(hero, COPY.noSuchHero);
    const affinity = social.affinity[`${actor.id}|${target.id}|${hero.id}`] ||= { bond: 0, giftRound: 0 };
    if (action.type === 'talk') {
      check(cooldowns.talk !== game.round, cooldownMessage);
      cooldowns.talk = game.round;
      affinity.bond = Math.min(100, affinity.bond + 3);
      record(game, 'talkRecord', actor, target, { heroName: hero.name, characterId: hero.id });
    } else if (action.type === 'gift') {
      check(affinity.giftRound !== game.round, cooldownMessage);
      pay(game, actor, { gold: 10 });
      affinity.giftRound = game.round; affinity.bond = Math.min(100, affinity.bond + 8);
      record(game, 'giftRecord', actor, target, { heroName: hero.name, characterId: hero.id });
    } else {
      check(target.id === actor.id, COPY.ownTrainingOnly);
      check(['attack', 'defense'].includes(action.stat), COPY.ownTrainingOnly);
      check(cooldowns.train !== game.round, cooldownMessage);
      hero.trained ||= { attack: 0, defense: 0 };
      check((hero.trained[action.stat] || 0) < 2, COPY.trainingCap);
      pay(game, actor, { gold: 20, supply: 8 });
      cooldowns.train = game.round;
      hero.trained[action.stat]++; hero.stats[action.stat]++;
      record(game, 'trainRecord', actor, target, { heroName: hero.name, characterId: hero.id, stat: action.stat });
    }
    return game;
  }
  check(target.id !== actor.id, COPY.noSuchTarget);
  const relation = social.relations[relationKey(actor.id, target.id)] ||= { favor: 0, truceUntil: 0, tradeUntil: 0 };
  if (action.type === 'visit' || action.type === 'diplomaticGift') {
    const key = `${action.type}|${target.id}`;
    check(cooldowns[key] !== game.round, cooldownMessage);
    pay(game, actor, action.type === 'diplomaticGift' ? { gold: 20 } : {});
    cooldowns[key] = game.round;
    relation.favor = Math.min(100, relation.favor + (action.type === 'visit' ? 3 : 8));
    if (action.type === 'diplomaticGift') target.gold = Math.min(999, target.gold + 20);
    record(game, action.type === 'visit' ? 'visitRecord' : 'diplomaticGiftRecord', actor, target);
  } else {
    const kind = action.type === 'offerPeace' ? 'peace' : 'trade';
    check(['offerPeace', 'offerTrade'].includes(action.type), COPY.interactionUnavailable);
    check(kind !== 'peace' || relation.truceUntil < game.round, COPY.alreadyTruce);
    check(!social.offers.some(o => o.kind === kind && o.expires >= game.round
      && relationKey(o.from, o.to) === relationKey(actor.id, target.id)), COPY.offerAlreadyPending);
    pay(game, actor, {});
    social.sequence++;
    social.offers.push({ id: social.sequence, kind, from: actor.id, to: target.id, expires: game.round + 2 });
    social.offers = social.offers.filter(o => o.expires >= game.round).slice(-24);
    record(game, kind + 'OfferRecord', actor, target);
  }
  return game;
}

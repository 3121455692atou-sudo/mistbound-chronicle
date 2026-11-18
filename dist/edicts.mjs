// National edicts (国策). A late-game layer with no upkeep in clicks: the lord picks a few standing
// policies and the whole realm follows them. Data only; the engine reads `id` where an edict matters.
export const EDICTS = [
  { id: 'farm', name: '重农', icon: 'wheat', desc: '己方所有农庄、渔港与伐木场，每座每回合补给 +1' },
  { id: 'trade', name: '重商', icon: 'coin', desc: '商站、矿场、考古营地每座每回合金币 +1，每份通商协定再 +1 金币' },
  { id: 'relay', name: '驿传', icon: 'map', desc: '所有编队每回合可用行军路程 +1，能走得更远' },
  { id: 'court', name: '勤政', icon: 'scroll', desc: '己方每回合获得的指令 +1' },
  { id: 'war', name: '尚武', icon: 'sword', desc: '进攻与劫掠不花补给，常备军训练只收七成金币' },
  { id: 'mercy', name: '怀柔', icon: 'handshake', desc: '俘虏逃跑风险降低 4%，每次交涉多积累 6 点交涉准备' },
  { id: 'school', name: '兴学', icon: 'book', desc: '全员获得的经验 +25%，特训只收七成金币' },
  { id: 'wall', name: '筑城', icon: 'fort', desc: '要塞维护费减半，修建和升级要塞只收七成金币' },
];
/** The chapters (第 N 话) that open the first, second and third edict slot. */
export const EDICT_SLOTS = [3, 7, 12];
const BY_ID = new Map(EDICTS.map(edict => [edict.id, edict]));
export const edictById = id => BY_ID.get(id) || null;
export const edictSlots = state => EDICT_SLOTS.filter(chapter => (state.milestone?.level || 1) >= chapter).length;
/** Edicts belong to the player's realm only; other nations are run by simpler rules. */
export const hasEdict = (state, id, factionId = state.playerId) => factionId === state.playerId && Array.isArray(state.edicts) && state.edicts.includes(id);

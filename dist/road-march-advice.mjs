/** One useful road for an already selected march. Advisory, never executes. */
import {getActions,getMarch,getRoadQuote,MARCH_BUDGET} from './engine.mjs?v=1118-1603';
import {marchSources} from './realm.mjs?v=1118-1603';
import {departureReason} from './ui-model.mjs?v=1118-1603';

const STEPS=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
const nearby=tile=>STEPS.map(([q,r])=>`${tile.q+q},${tile.r+r}`);
const has=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
export const ROAD_CANDIDATE_LIMIT=127;
export const ROAD_MOVE_QUOTE_LIMIT=3;

export function getRoadMarchAdvice(state,fromKey,toKey,selection={},onlyKey=null){
  const from=state.tiles[fromKey],to=state.tiles[toKey],faction=state.factions[state.playerId];
  const troops=selection.troops,girls=from?.field?.filter(id=>selection.girls?.includes(id))||[];
  if(!from?.discovered||!to?.discovered||fromKey===toKey||from.ownerId!==state.playerId||to.ownerId!==state.playerId
    ||departureReason(state,from)||state.ap<1||faction.supply<2||faction.gold<6
    ||!Number.isInteger(troops)||troops<0||troops>from.troops-1||to.troops+troops>100||(!troops&&!girls.length))return null;
  const before=getMarch(state,fromKey);
  if(has(before,toKey))return null; // A lower number alone saves neither a move nor supply.
  const reverse=marchSources(state,toKey),known=keys=>keys.every(key=>state.tiles[key]?.discovered);
  if(!known(Object.keys(before))||!known(Object.keys(reverse)))return null;
  const prefix=new Set([fromKey,...Object.keys(before)]);
  const keys=[...Object.keys(reverse),toKey];
  if(keys.length>ROAD_CANDIDATE_LIMIT)return null;
  const candidates=keys.filter(key=>{
    const tile=state.tiles[key];
    return key!==fromKey&&(onlyKey===null||key===onlyKey)&&tile?.discovered&&tile.ownerId===state.playerId&&!tile.road
      &&nearby(tile).some(neighbor=>prefix.has(neighbor));
  }).map(key=>getRoadQuote(state,key)).filter(quote=>quote.enabled&&faction.supply>=quote.cost.supply+1)
    .sort((a,b)=>a.cost.gold-b.cost.gold||a.key.localeCompare(b.key));
  if(!candidates.length)return null;
  // One shallow world/dictionary copy. Only our fresh tile/faction copies change.
  const projected={...state,tiles:{...state.tiles},factions:{...state.factions,[state.playerId]:{...faction}}};
  let moveQuotes=0;
  for(const quote of candidates){
    const tile=state.tiles[quote.key];
    projected.tiles[quote.key]={...tile,road:true};
    projected.ap=state.ap-quote.cost.ap;
    projected.factions[state.playerId].gold=faction.gold-quote.cost.gold;
    projected.factions[state.playerId].supply=faction.supply-quote.cost.supply;
    try{
      const reach=getMarch(projected,fromKey);
      if(!has(reach,toKey)||reach[toKey]>MARCH_BUDGET||!known(Object.keys(reach)))continue;
      const move=getActions(projected,toKey,fromKey,{troops,girls}).find(action=>action.type==='move');
      moveQuotes++;
      if(move?.enabled)return {key:quote.key,fromKey,toKey,revision:state.revision,cost:{...quote.cost},
        action:{...quote.action,expectedRevision:state.revision},route:reach[toKey],troops,girls:[...girls]};
      if(moveQuotes>=ROAD_MOVE_QUOTE_LIMIT)return null;
    }finally{projected.tiles[quote.key]=tile;}
  }
  return null;
}

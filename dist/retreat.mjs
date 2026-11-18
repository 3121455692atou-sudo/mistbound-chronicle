/** Capacity-aware compulsory withdrawal. Ordinary troops and rare squads never vanish at a full refuge. */
import { isWater } from './waters.mjs?v=1118-1603';
const RANKS=['R','SR','SSR'];
export function planRetreat(state,originKey,factionId,survivors,elite={}){
  if(!Number.isInteger(survivors)||survivors<0||survivors>100)throw new Error('撤离人数必须为0到100的整数。');
  if(RANKS.some(rank=>!Number.isInteger(elite[rank]??0)||(elite[rank]??0)<0||(elite[rank]??0)>99))throw new Error('撤离稀有分队数量无效。');
  const origin=state.tiles[originKey];if(!origin||!state.factions[factionId])throw new Error('撤离起点或国家无效。');
  const distance=tile=>Math.max(Math.abs(tile.q-origin.q),Math.abs(tile.r-origin.r),Math.abs(tile.q+tile.r-origin.q-origin.r));
  const refuges=Object.values(state.tiles).filter(tile=>tile.ownerId===factionId&&tile.key!==originKey&&!tile.shipId&&(!isWater(tile)||tile.bridgeId))
    .sort((a,b)=>Number(a.cutSince!==undefined)-Number(b.cutSince!==undefined)||distance(a)-distance(b)||a.key.localeCompare(b.key));
  const placements=[],elitePlacements=[],demobilizedElites={R:0,SR:0,SSR:0};let remaining=survivors;
  for(const tile of refuges){if(!remaining)break;const troops=Math.min(remaining,Math.max(0,100-tile.troops));if(troops){placements.push({key:tile.key,troops,before:tile.troops,after:tile.troops+troops,distance:distance(tile)});remaining-=troops;}}
  for(const rank of RANKS){let left=elite[rank]||0;for(const tile of refuges){if(!left)break;const before=tile.elite?.[rank]||0,count=Math.min(left,Math.max(0,99-before));if(count){elitePlacements.push({key:tile.key,rank,count,before,after:before+count});left-=count;}}demobilizedElites[rank]=left;}
  return {originKey,factionId,survivors,placed:survivors-remaining,demobilized:remaining,elitePlacements,demobilizedElites,
    refugeKey:placements[0]?.key||elitePlacements[0]?.key||refuges[0]?.key||null,placements};
}

import {getStaffingQuote} from './engine.mjs?v=1118-1603';
import {handsNeeded} from './realm.mjs?v=1118-1603';

// Advisory only. At most one site / two exact national forecasts per request.
// Whole-nation accounting includes donor losses, population and military upkeep.
// No private copy of prices or production formulas; never execute on caller state.
export const STAFFING_PAGE_SIZE=1;
export function getStaffingSites(state){
  return Object.values(state.tiles).filter(t=>t.discovered&&t.ownerId===state.playerId&&t.building&&t.troops<handsNeeded(t))
    .sort((a,b)=>a.key.localeCompare(b.key)).map(t=>({key:t.key,residents:t.troops,need:handsNeeded(t)}));
}
export function* staffingAdviceSteps(state,page=0,preferredKey=null){
  const sites=getStaffingSites(state);
  const pages=Math.ceil(sites.length/STAFFING_PAGE_SIZE);
  // View-only return anchor. Old numeric calls and the two-quote batch stay unchanged.
  if(preferredKey!==null){
    const found=sites.findIndex(site=>site.key===preferredKey);
    if(found>=0)page=Math.floor(found/STAFFING_PAGE_SIZE);
    else if(pages&&Number.isSafeInteger(page)&&page>=0)page%=pages;
  }
  page=Math.max(0,Math.min(Number.isSafeInteger(page)?page:0,Math.max(0,pages-1)));
  const rows=[];
  for(const site of sites.slice(page*STAFFING_PAGE_SIZE,(page+1)*STAFFING_PAGE_SIZE)){
    const tile=state.tiles[site.key];
    for(const kind of ['rally','recruit']){
      yield null;
      const quote=getStaffingQuote(state,tile.key,kind);
      rows.push({key:tile.key,kind,residents:tile.troops,need:handsNeeded(tile),enabled:quote.enabled,reason:quote.reason||'',cost:quote.cost,delta:quote.delta||null,sources:quote.sources||[],afterResidents:quote.afterResidents});
    }
  }
  // Only this bounded batch is ranked. Food gain first, then gold and actual costs.
  rows.sort((a,b)=>Number(b.enabled)-Number(a.enabled)||(b.delta?.supply??-Infinity)-(a.delta?.supply??-Infinity)||(b.delta?.gold??-Infinity)-(a.delta?.gold??-Infinity)||(a.cost?.ap??0)-(b.cost?.ap??0)||(a.cost?.gold??0)-(b.cost?.gold??0)||(a.cost?.supply??0)-(b.cost?.supply??0)||a.key.localeCompare(b.key)||a.kind.localeCompare(b.kind));
  return {revision:state.revision,page,pages,total:sites.length,sites,rows};
}

export function getStaffingAdvice(state,page=0){const steps=staffingAdviceSteps(state,page);let next;do{next=steps.next();}while(!next.done);return next.value;}

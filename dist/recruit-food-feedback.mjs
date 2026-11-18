/** Current public ledger only: no draws, forecasts or random-state access. */
import {getSupplyQuote} from './engine.mjs?v=1118-1603';
const signed=value=>`${value>=0?'+':''}${value}`;
export function recruitFoodNote(state,stats){
  const net=stats.income.supply,gap=Math.max(0,-net);
  const current=`现有补给 ${stats.supply} · 当前净补给 ${signed(net)}/回合。`;
  if(!gap)return current;
  if(gap>1000)return current+'每回合净缺口超过单次采购上限，请到内政分次查看。';
  const quote=getSupplyQuote(state,gap);
  return current+`按当前市价补齐每回合净缺口需 ${quote.cost.gold} 金币（未扣现有库存，并非本回合必付）。`;
}
export function recruitIncomeReceipt(before,after){
  if(!before)return '';
  return `本次招募后，当前每回合净金币 ${signed(before.income.gold)} → ${signed(after.income.gold)}；净补给 ${signed(before.income.supply)} → ${signed(after.income.supply)}。不是未来回合预测。`;
}

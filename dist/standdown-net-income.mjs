/** Read-only presentation arithmetic using the already-paid national military quote. */
export function readStandDownNetGold(getStats,state){try{return getStats(state)?.income?.gold??null;}catch{return null;}}
export function standDownNetIncomePreview(before,plan){
  const a=plan?.budgetBefore?.gold,b=plan?.budgetAfter?.gold,s=plan?.saving;
  const budgetValid=Number.isFinite(a)&&Number.isFinite(b)&&a>=0&&b>=0&&Number.isFinite(s)&&s===a-b&&s>=0;
  const after=before+s,available=budgetValid&&Number.isFinite(before)&&Number.isFinite(after)&&Array.isArray(plan?.affected);
  return Object.freeze({available,budgetValid,before:available?before:null,after:available?after:null,hasCandidates:Array.isArray(plan?.affected)&&plan.affected.length>0});
}
export function standDownNetIncomeReceipt(before,after){
  const available=Number.isFinite(before)&&Number.isFinite(after);
  return Object.freeze({available,before:available?before:null,after:available?after:null});
}
const signed=n=>(n>0?'+':'')+n;
const balance=n=>n<0?'仍有赤字':n===0?'收支持平':'正净收入';
export function standDownNetIncomeHtml(income,{preview=false}={}){
  const note='不是本次金币到账，后续收支会变化。';
  if(!income?.available)return `<p class="military-price" data-standdown-net="unavailable">${preview?'预计收支':'本次调整前后收支'}暂时无法确认。${note}</p>`;
  if(preview&&!income.hasCandidates)return `<p class="military-price" data-standdown-net="no-candidates">当前全国每回合净金币 <b>${signed(income.before)}</b>（${balance(income.before)}）。本次没有可调整的驻地，尚未执行调整。${note}</p>`;
  return `<p class="military-price" data-standdown-net="${preview?'preview':'actual'}">${preview?'预计':'本次调整前后'}全国每回合净金币 <b>${signed(income.before)} → ${signed(income.after)}</b>（${balance(income.after)}）。${note}</p>`;
}

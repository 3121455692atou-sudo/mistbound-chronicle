/** Presentation of the NEXT draw, matching sequential drawRecruit + empty-pool
 * substitution. Pure UI only: prices, RNG and outcome authority stay in engine. */
export function recruitOdds(stats, rates) {
  let remaining=1;
  const odds=Object.fromEntries(rates.map(([kind])=>[kind,0]));
  for(const [kind,base] of rates){const chance=Math.min(remaining,Math.max(0,kind==='girl'?stats.girlRate:base));odds[kind]+=chance;remaining-=chance;}
  odds.N=(odds.N||0)+remaining;
  if(stats.recruitPool===0){odds.SSR=(odds.SSR||0)+(odds.girl||0);odds.girl=0;}
  return odds;
}
export function recruitPoolNote(stats) {
  return `当前可招募的自由旅人：${stats.recruitPool} 人。${stats.recruitPool===0?'目前没有自由旅人，不代表所有少女都已加入。原本抽到少女的结果会改为 SSR。':'其他国家的少女与俘虏不在当前招募范围。'}以下为下一次招募的实际概率。十连逐次结算，途中自由旅人数量可能改变；没有必出少女的保底。`;
}

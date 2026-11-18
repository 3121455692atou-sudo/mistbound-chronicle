/** Pure comic bond view: reusable by a future main-menu profile. No campaign/engine imports. */
const POSITIONS=[[.5,-.866],[1,0],[.5,.866],[-.5,.866],[-1,0],[-.5,-.866]];
const GIFT_ICON={sweet:'cake',tea:'cup',book:'book',tool:'wrench',plush:'bear',snack:'cookie'};
export function renderBondPage(model,{esc,icon}) {
  const {gifts,tiers,tier,bond,canTalk,canGift,knownLike,likedGiftId,giftCost,giftNote,canAct,likedGiftGain=14}=model,S=64;
  const petals=gifts.map((item,i)=>{const [dx,dy]=POSITIONS[i%POSITIONS.length],liked=knownLike&&likedGiftId===item.id;return `<button class="hx cs-gift ${liked?'liked':''}" data-gift="${esc(item.id)}" style="left:calc(50% + ${(dx*S).toFixed(2)}px);top:calc(50% + ${(dy*S).toFixed(2)}px)" ${canGift?'':'disabled'} aria-label="送${esc(item.name)}">${icon(GIFT_ICON[item.id]||'heart')}<small>${esc(item.name)}</small>${liked?'<i>♥</i>':''}</button>`;}).join('');
  const ladder=tiers.map((row,i)=>`<li class="${i<tier?'done':i===tier?'now':''}"><b>${esc(row.name)}</b>${i===tier?`<em>${bond}</em>`:i===tier+1?`<em>${row.at}</em>`:''}${i===tier+1?`<small>${esc(row.reward)}</small>`:''}</li>`).join('');
  return `<div class="cs-bond"><div class="cs-flower"><button class="hx cs-talk" id="talk" ${canTalk?'':'disabled'}>${icon('chat')}<b>谈话</b>${canTalk?'':'<small>暂不可用</small>'}</button>${petals}</div><ol class="cs-ladder">${ladder}</ol></div><p class="cs-hint">${esc(giftNote||`送礼 ${giftCost} 金 · 信赖 +6`)}${canAct?`，送对喜欢的 +${likedGiftGain}`:''}</p>`;
}
/** Adapter only; caller owns persistence, permission, resources and callbacks. */
export function bindBondInteractions({talkButton,giftButtons},{bindAction,onTalk,onGift}) {
  if(talkButton)bindAction(talkButton,onTalk);
  for(const button of giftButtons)bindAction(button,event=>onGift(button.dataset.gift,button,event));
}

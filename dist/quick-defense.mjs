/** Presentation-only, single-battle coordinator. Never retries or follows a new battle. */
export function createQuickDefense({getState,dispatch,allowed,onReceipt=()=>{}}){
  let busy=false,epoch=0,receipt=null;
  const eligible=s=>Boolean(s?.battle?.phase==='player'&&s.battle.playerSide==='defender');
  // dispatch must call its observer once, immediately after a successful engine
  // commit and before any presentation hook. Never infer this token from a
  // returned result whose referenced state could already have been changed.
  const commitToken=result=>({result,state:result.state,battle:result.state.battle,revision:result.state.revision});
  const isCurrent=(result,token)=>Boolean(token&&token.result===result&&getState()===token.state&&result.state===token.state&&token.state.revision===token.revision&&token.state.battle===token.battle);
  return {
    get receipt(){return receipt;},
    clear(){epoch++;receipt=null;},
    available(){return !busy&&allowed()&&eligible(getState());},
    run(expected){
      if(busy||!allowed()||getState()!==expected||!eligible(expected))return {ok:false,error:'当前无法快速结算。'};
      busy=true;const ticket=epoch,battle=expected.battle;
      try{
        let autoCommit=null,duplicateAutoCommit=false;
        const auto=dispatch({type:'battleAuto'},result=>{if(autoCommit){duplicateAutoCommit=true;return;}autoCommit=commitToken(result);});
        if(!auto.ok)return auto;
        const resolved=getState();
        if(ticket!==epoch||duplicateAutoCommit||!isCurrent(auto,autoCommit)||resolved.battle?.id!==battle.id||resolved.battle?.phase!=='result'||!allowed())return {ok:false,error:'战局已改变，请查看当前战果。'};
        // Preserve names/units before finish mutates strategic ownership and resumes AI.
        const snapshot=structuredClone({battle:resolved.battle,characters:resolved.characters,turn:resolved.turn});
        let finishCommit=null,finishResult=null,duplicateFinishCommit=false;
        const finish=dispatch({type:'finishBattle'},result=>{if(finishCommit){duplicateFinishCommit=true;return;}finishCommit=commitToken(result);finishResult=structuredClone(result.detail.result);});
        if(!finish.ok)return finish;
        if(ticket!==epoch||duplicateAutoCommit||duplicateFinishCommit||!isCurrent(finish,finishCommit))return {ok:false,error:'战局已改变。'};
        receipt=Object.freeze({battleId:battle.id,turn:snapshot.turn,battle:snapshot.battle,characters:snapshot.characters,result:finishResult});
        onReceipt(receipt);return finish;
      }catch{return {ok:false,error:'处理未完成，请查看当前战局，不要重复提交。'};}finally{busy=false;}
    }
  };
}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function quickDefenseReceiptHtml(receipt){
  const {battle,characters,result:r}=receipt,side=battle.playerSide,foe=side==='attacker'?'defender':'attacker';
  const count=s=>battle.units.filter(u=>u.side===s).reduce((n,u)=>n+(u.initialSoldiers||0),0);
  const survivors=s=>r[s==='attacker'?'attackerSurvivors':'defenderSurvivors']||0;
  const row=(s,label)=>`<p>${label}普通军士 ${count(s)} → ${survivors(s)}，损失 ${Math.max(0,count(s)-survivors(s))}。${Object.entries(r.lostSazai?.[s]||{}).filter(([,n])=>n).map(([rank,n])=>`${esc(rank)} 损失 ${n}。`).join('')}</p>`;
  const names=ids=>(ids||[]).map(id=>esc(characters[id]?.name||id)).join('、')||'无';
  return `<p>第 ${receipt.turn} 回合 · ${esc(battle.toKey)} · ${r.playerWon?'守住了':'未守住'}。本场已结算，已继续本回合。</p>${row(side,'我方')}${row(foe,'敌方')}<p>${r.playerWon?'敌方':'我方'}被俘角色：${names(r.capturedCharacterIds)}。获救角色：${names(r.rescuedCharacterIds)}。</p><p>${battle.mission==='raid'?'本场为劫掠，领土归属不变。':'本场为领土战。'}${r.raided?'建筑被摧毁。':''}</p>${r.loot?`<p>劫掠所得：${r.loot.gold||0} 金币、${r.loot.supply||0} 补给。</p>`:''}${r.evacuation?`<p>守方撤离安置 ${r.evacuation.placed} 人，退役 ${r.evacuation.demobilized} 人。${Object.entries(r.evacuation.demobilizedElites||{}).filter(([,n])=>n).map(([rank,n])=>`${esc(rank)} 退役 ${n}。`).join('')}</p>`:''}${r.growthSuppressed?'<p>未交战便撤退：不获得战斗经验与羁绊。</p>':r.growthLimited?'<p>撤退战仅实际参与角色获得经验与羁绊。</p>':''}<details><summary>查看本场战斗记录</summary>${(battle.recentLog||battle.log||[]).map(x=>`<p>${esc(typeof x==='string'?x:x.text||'')}</p>`).join('')}</details><p>这里只记录本场战果，不把后续其他战况算作本场损失。下次快速结算替换此记录；刷新后不保留完整记录。当前存档状态请看存档提示。</p>`;
}

export function quickDefenseReceiptSummary(receipt){const r=receipt.result,b=receipt.battle,n=b.units.filter(u=>u.side===b.playerSide).reduce((n,u)=>n+(u.initialSoldiers||0),0);return `本场已结算：${r.playerWon?'守住':'未守住'}，我军损失 ${Math.max(0,n-(r.defenderSurvivors||0))}；${r.playerWon?'敌方':'我方'}被俘 ${(r.capturedCharacterIds||[]).length}，获救 ${(r.rescuedCharacterIds||[]).length}。查看战果`; }

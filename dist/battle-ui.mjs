import {C} from './campaign-copy.mjs?v=1118-1603';
import {icon} from './icons.mjs?v=1118-1603';
import {terrainTop} from './map.mjs?v=1118-1603';
import {BATTLE_TERRAIN,tacticalTargetStatus,tacticalSuppressPreview,OBJECTIVE_RULES} from './battle.mjs?v=1118-1603';
import {BUILDINGS} from './content.mjs?v=1118-1603';
import {FORT_GARRISON} from './fortification.mjs?v=1118-1603';
import {morph} from './morph.mjs?v=1118-1603';
/** The flag rule (rounds to hold, the round the count starts); harnesses that stub the battle module fall back to the shipped numbers. */
const flagRule=()=>typeof OBJECTIVE_RULES!=='undefined'&&OBJECTIVE_RULES?OBJECTIVE_RULES:{hold:3,from:3};
import {fallbackPortrait,smallSkirmishInfo} from './ui-model.mjs?v=1118-1603';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const GLOW={N:'#c9ced8',R:'#5aa9ff',SR:'#c77dff',SSR:'#ffc83d'};
const ROLE={sazai:'罪袋',support:'鼓舞',vanguard:'先锋',ranger:'游击',guard:'卫戍'};
const TREES='<svg class="battle-prop" viewBox="0 0 100 80" aria-hidden="true"><path d="M26 74h6V52h-6z" fill="#4a3320" stroke="none"/><ellipse cx="29" cy="38" rx="21" ry="24" fill="#3f9c6d" stroke="none"/><path d="M70 74h6V46h-6z" fill="#4a3320" stroke="none"/><ellipse cx="73" cy="30" rx="24" ry="28" fill="#2f8560" stroke="none"/><ellipse cx="66" cy="20" rx="10" ry="8" fill="#6fc69a" stroke="none"/></svg>';
const PEAK='<svg class="battle-prop" viewBox="0 0 100 80" aria-hidden="true"><path d="M8 78 50 4l42 74z" fill="#c8d1e6" stroke="none"/><path d="M50 4l42 74H56z" fill="#6b7699" stroke="none"/><path d="M35 30 50 4l15 26-9-4-7 7-6-6z" fill="#fff" stroke="none"/></svg>';
const HIT=['砰！','咚！','啪！','嘭！','哐！'];
const ANGLE={front:'正面',side:'侧击',back:'背刺'},ONLY={cliff:'只有游击',thorns:'先锋/罪袋',swamp:'卫戍罪袋不行'};
const COUNTER_REPLY={skill:'这个攻击技能不会触发反击',defeated:'这一击能击倒对方，对方无法反击',back:'打在背后，对方不能反击',surrounded:'对方被包围，不能反击',range:'超出对方反击射程，不会反击',visibility:'对方无法看见你，不能反击'};
const hpOf=unit=>Math.max(0,Math.min(100,unit.hp/Math.max(1,unit.maxHp)*100));
const HANDOVER_STATE=new WeakMap();
// The reader belongs to this rendered state, never to a save or battle ID alone.
const RECENT_LOG_STATE=new WeakMap();
const recentLogText=entry=>typeof entry==='string'?entry:typeof entry?.text==='string'?entry.text:typeof entry==='number'||typeof entry==='boolean'?String(entry):'这条记录暂无法显示。';
const QUICK_TAP_MS=420;
const cellKeyOf=cell=>`${cell.x},${cell.y}`;
const overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(n,Math.max(lo,hi)));
const backToWheel='<div class="fc-acts"><button class="fc-no" data-battle-command="wheel-back">返回圆盘</button></div>';

const breastworkNote=cover=>`固定朝西的胸墙：正面 +${cover}、侧面 +${Math.floor(cover/2)}、背面 0。两军均可占用，不随分队转向；穿云远射无视胸墙。`;

/** DOM-only view. Every legal move, damage figure and outcome comes from the shared engine. */
export class BattleUI {
  constructor({getState,dispatch,getOptions,getThreat,getReach,getStatus,portrait,notify,save,say,sayTeam,pop,coach,onStart,onAct,onCoach,isSimulation,chatter,quickDefense,canQuickDefense}){
    Object.assign(this,{getState,dispatch,getOptions,getThreat,getReach,getStatus,portrait,notify,save,say,sayTeam,pop,coach,onStart,onAct,onCoach,isSimulation,chatter,quickDefense,canQuickDefense});
    this.aimId=null;this.coachExpanded=false;this.centeredId=null;this.handover=null;this.historyOpen=false;this.resultFocusPending=false;
    this.selectedId=null;this.skillMode=false;this.battleId=null;this.confirmRetreat=false;this.previousHp=new Map();this.threatId=null;this.focusKey=null;
    this.wheelPage=null;this.lastTap=null;
    this.root=document.createElement('section');this.root.id='battle-screen';this.root.className='battle-screen';this.root.hidden=true;
    this.root.setAttribute('role','dialog');this.root.setAttribute('aria-modal','true');this.root.setAttribute('aria-label','战场');document.body.append(this.root);
    this.root.addEventListener('click',event=>this.handleClick(event));
    this.root.addEventListener('contextmenu',event=>{if(this.focusKey||this.aimId||this.threatId||this.skillMode){event.preventDefault();this.clearPreview();this.skillMode=false;this.render();}});
    this.root.addEventListener('scroll',()=>this.placeWheel(),true);
    document.addEventListener('keydown',event=>this.handleKey(event));
    window.addEventListener('resize',()=>{this.centeredId=null;if(this.getState().battle)this.render();});
    this.root.addEventListener('mousedown',event=>{const button=event.target.closest?.('button');if(button){event.preventDefault();button.focus({preventScroll:true});}});
    // Resting on an enemy shows how far it reaches without touching any state.
    this.root.addEventListener('pointerover',event=>{
      if(event.pointerType==='touch')return;
      const cell=event.target.closest?.('[data-battle-cell]'),battle=this.getState().battle;if(!battle)return;
      const [x,y]=cell?cell.dataset.battleCell.split(',').map(Number):[-1,-1],foe=battle.units.find(unit=>unit.hp>0&&unit.x===x&&unit.y===y&&unit.side!==battle.playerSide);
      this.paintThreat(foe?.id||this.threatId);
    });
  }

  clearPreview(){
    this.focusKey=null;this.aimId=null;this.threatId=null;this.wheelPage=null;this.lastTap=null;
  }

  selectFriendly(unit){
    const key=cellKeyOf(unit),same=unit.id===this.selectedId,open=same&&this.focusKey!==key;
    this.clearPreview();this.historyOpen=false;this.handover=null;this.confirmRetreat=false;this.skillMode=false;
    if(!same&&unit.characterId)this.say(unit.characterId,'select');
    this.selectedId=unit.id;if(open)this.focusKey=key;
    this.render();
  }

  /** A second physical click can only repeat the same legal preview in the same turn. */
  quickRepeat(state,key,kind,event){
    if(!(event.detail>0)){this.lastTap=null;return false;}
    const at=Number.isFinite(event.timeStamp)?event.timeStamp:Date.now(),last=this.lastTap;
    const same=last?.state===state&&last.revision===state.revision&&last.round===state.battle.round
      &&last.actor===this.selectedId&&last.key===key&&last.kind===kind&&at>=last.at&&at-last.at<=QUICK_TAP_MS;
    this.lastTap=same?null:{state,revision:state.revision,round:state.battle.round,actor:this.selectedId,key,kind,at};
    return same;
  }

  paintThreat(id){
    const state=this.getState();if(!state.battle)return;
    const keys=new Set(id?(this.getThreat(state,id)||[]).map(cell=>`${cell.x},${cell.y}`):[]);
    for(const cell of this.root.querySelectorAll('[data-battle-cell]'))cell.classList.toggle('threat',keys.has(cell.dataset.battleCell));
    // An enemy's threat replaces the selected squad's own stripes while it is shown.
    this.root.classList.toggle('showing-threat',keys.size>0);
  }

  act(action){
    this.clearPreview();this.skillMode=false;this.confirmRetreat=false;this.handover=null;this.historyOpen=false;
    HANDOVER_STATE.delete(this);
    const before=this.getState().battle,selectedBefore=this.selectedId,hp=new Map(before?.units.map(unit=>[unit.id,unit.hp])||[]);
    const result=this.dispatch(action);
    if(!result.ok){this.notify(result.error||'当前无法执行这个战场指令。',true);this.render();}
    else{
      this.voice(action,before,hp);this.onAct?.(action);
      const next=this.getState(),current=next.battle?.units.find(unit=>unit.id===this.selectedId);
      const advance=next.battle?.phase==='player'&&['battleWait','battleAttack','battleSkill','battleMove'].includes(action.type);
      if(advance&&(!current||current.hp<=0||!this.getOptions(next,current.id).canWait))this.nextReady(1,false);
      // Report an actual selection change, including render's fallen-actor fallback.
      // No timer, extra action, forced facing step or change to readiness.
      if(advance&&selectedBefore!==this.selectedId&&next.battle.id===before?.id&&next.battle.round===before?.round){
        this.handover={battleId:next.battle.id,round:next.battle.round,fromId:selectedBefore,toId:this.selectedId};
        HANDOVER_STATE.set(this,next);
      }
      if(next.battle)this.render();if(this.getState().battle?.phase==='player')this.effects(hp);
    }
    return result;
  }

  nextReady(direction=1,render=true){
    const state=this.getState(),battle=state.battle;if(!battle||battle.phase!=='player')return null;
    if(render){this.clearPreview();this.handover=null;this.historyOpen=false;}
    const allies=battle.units.filter(unit=>unit.side===battle.playerSide&&unit.hp>0),start=allies.findIndex(unit=>unit.id===this.selectedId);
    for(let step=1;step<=allies.length;step++){
      const origin=start<0?(direction<0?0:-1):start,index=(origin+step*direction+allies.length*2)%allies.length,unit=allies[index];
      if(!this.getOptions(state,unit.id).canWait)continue;
      this.selectedId=unit.id;this.skillMode=false;this.aimId=null;this.threatId=null;this.confirmRetreat=false;if(render)this.render();return unit.id;
    }
    if(render)this.notify('本轮分队已全部行动，点右下角进入敌方行动。');return null;
  }

  historyIsCurrent(state=this.getState()){
    const rendered=RECENT_LOG_STATE.get(this);
    return Boolean(state.battle&&rendered?.state===state&&rendered.revision===state.revision&&rendered.battle===state.battle&&rendered.phase===state.battle.phase&&!this.root.hidden&&this.root.isConnected!==false);
  }

  historyToggle(){
    return `<button type="button" data-battle-command="history-toggle" aria-controls="battle-recent-log" aria-expanded="${Boolean(this.historyOpen)}">战报${this.historyOpen?' ▴':' ▾'}</button>`;
  }

  historyPanel(battle){
    if(!this.historyOpen)return '<div id="battle-recent-log" class="b-history" hidden></div>';
    const entries=Array.isArray(battle.log)?battle.log.slice(-100):[];
    return `<div id="battle-recent-log" class="b-history" data-battle-history-view="1"><p id="battle-history-note">本场保留 ${entries.length} 条 · 最多保留 100 条<br>按发生顺序，最新在下方${battle.phase==='result'?'；继续后本场战报不再可查看。':'。'}</p><div id="battle-history-scroll" class="b-history-scroll" data-battle-history-view="1" role="region" aria-label="近期战报，可滚动" aria-describedby="battle-history-note" tabindex="0">${entries.length?`<ol>${entries.map(entry=>`<li>${esc(recentLogText(entry))}</li>`).join('')}</ol>`:'<p class="b-history-empty">暂无战报记录。</p>'}</div></div>`;
  }

  toggleHistory(){
    if(!this.historyIsCurrent()||document.getElementById('modal')?.open||document.getElementById('title-screen')?.hidden===false)return;
    this.historyOpen=!this.historyOpen;
    if(this.historyOpen){this.clearPreview();this.coachExpanded=false;this.confirmRetreat=false;this.skillMode=false;}
    this.render();
    const reader=this.root.querySelector('#battle-history-scroll');
    const target=this.historyOpen?reader:this.root.querySelector('[data-battle-command="history-toggle"]');
    // Start at the latest retained event only on explicit opening. Renders keep
    // the reader's DOM identity, focus and chosen scroll position.
    if(this.historyOpen&&reader){
      reader.scrollTop=reader.scrollHeight;
      // A long result may already be scrolled down to its disclosure. Reveal
      // the opened reader inside that result, never on routine re-renders.
      if(this.getState().battle.phase==='result')reader.scrollIntoView?.({block:'nearest',inline:'nearest'});
    }
    target?.focus({preventScroll:true});
  }

  handleKey(event){
    const state=this.getState(),battle=state.battle;
    if(event.isComposing||!battle||document.getElementById('modal')?.open||event.defaultPrevented||event.ctrlKey||event.altKey||event.metaKey||['INPUT','TEXTAREA','SELECT'].includes(event.target?.tagName)||event.target?.isContentEditable)return;
    // Loading a battle does not enter it until Continue dismisses the title.
    if(document.getElementById('title-screen')?.hidden===false)return;
    // Reading and Close keep their native keys; they are not tactical controls.
    if(event.target?.closest?.('#speech-layer'))return;
    const historyTarget=event.target?.closest?.('[data-battle-history-view],[data-battle-command="history-toggle"]');
    if(historyTarget||this.historyOpen){
      if(!this.historyIsCurrent(state)||historyTarget&&!this.root.contains(historyTarget))return;
      const toggle=event.target?.closest?.('[data-battle-command="history-toggle"]');
      // Prevent the native button default as focus moves, including held-key
      // repeats. Space in the scroll region retains native page scrolling.
      if(toggle&&(event.key==='Enter'||event.code==='Space')){event.preventDefault();if(!event.repeat)this.toggleHistory();return;}
      if(event.key==='Escape'&&this.historyOpen){event.preventDefault();if(!event.repeat)this.toggleHistory();return;}
      if(historyTarget||event.key.toLowerCase()==='n'||event.key.toLowerCase()==='w'||event.code==='Space')return;
    }
    if(event.target?.closest?.('[data-battle-command="quick-defense"]')&&['Enter',' '].includes(event.key)&&event.repeat){event.preventDefault();return;}
    if(event.repeat||battle.phase!=='player')return;
    if(event.key.toLowerCase()==='n'){event.preventDefault();this.nextReady(event.shiftKey?-1:1);}
    else if(event.key.toLowerCase()==='w'||event.code==='Space'&&!['BUTTON','A'].includes(event.target?.tagName)&&!event.target?.closest?.('button,a')&&!event.target?.closest?.('[data-board-scroll]')){
      event.preventDefault();if(this.getOptions(state,this.selectedId).canWait)this.act({type:'battleWait',unitId:this.selectedId});
    }else if(event.key==='Escape'){
      event.preventDefault();this.lastTap=null;
      if(this.wheelPage){this.wheelPage=null;this.render();this.focusWheel();return;}
      const anchor=this.root.querySelector('[data-wheel-anchor]')?.dataset.wheelAnchor;
      this.clearPreview();this.coachExpanded=false;this.skillMode=false;this.confirmRetreat=false;this.render();
      if(anchor)this.root.querySelector(`[data-battle-cell="${anchor}"]`)?.focus?.({preventScroll:true});
    }
  }

  centerBoardOnSelection(){
    if(!window.matchMedia('(max-width:900px) and (max-height:680px) and (orientation:portrait)').matches)return;
    const viewport=this.root.querySelector('[data-board-scroll]'),piece=this.root.querySelector(`[data-unit="${this.selectedId}"]`);
    if(!viewport?.getBoundingClientRect||!piece?.getBoundingClientRect||!viewport.scrollBy)return;
    const box=viewport.getBoundingClientRect(),rect=piece.getBoundingClientRect();
    viewport.scrollBy({left:rect.left+rect.width/2-box.left-box.width/2,top:rect.top+rect.height/2-box.top-box.height/2,behavior:'instant'});
    this.centeredId=this.selectedId;
  }

  focusAfterChatter(){
    if(!this.getState().battle||document.getElementById('modal')?.open||!document.getElementById('title-screen')?.hidden)return;
    const target=(this.historyOpen&&this.historyIsCurrent()?this.root.querySelector('#battle-history-scroll'):null)||this.root.querySelector('[data-battle-command="finish"]')||this.root.querySelector(`[data-battle-unit="${this.selectedId}"]`)||this.root.querySelector('[data-board-scroll]');
    target?.focus({preventScroll:true});
  }

  layoutChatter({active=true,blocked=false,result=false}={}){
    if(!this.chatter)return;
    const bounds=active?this.root.getBoundingClientRect():null,dockBox=active?this.root.querySelector('.b-dock')?.getBoundingClientRect():null;
    const dock=bounds&&dockBox?{bottom:Math.max(0,bounds.bottom-dockBox.top),left:dockBox.left-bounds.left,right:bounds.right-dockBox.right}:null;
    if(dock)this.root.style.setProperty('--battle-chatter-bottom',`${dock.bottom}px`);
    this.chatter({active,blocked,result,dock,root:this.root});
  }

  /** Keep the reusable teaching controls below the measured objective at every size. */
  layoutTeaching(){
    const coach=this.root.querySelector('[data-coach]'),toggle=this.root.querySelector('[data-battle-command="coach-toggle"]');
    const close=label=>{this.coachExpanded=false;this.root.classList.remove('coach-expanded');if(coach)coach.hidden=true;if(toggle){toggle.setAttribute('aria-expanded','false');toggle.textContent=label;}};
    const clearOffsets=()=>{for(const name of ['--battle-objective-bottom','--battle-board-top','--battle-coach-height'])this.root.style?.removeProperty?.(name);};
    const objectiveNode=this.root.querySelector('[data-objective]'),bounds=this.root.getBoundingClientRect?.(),objective=objectiveNode?.getBoundingClientRect?.();
    if(this.root.hidden||this.root.isConnected===false||objectiveNode?.hidden||objectiveNode?.isConnected===false||!bounds||!objective){clearOffsets();close('教学暂不可展开');return;}
    // Layout-free consumers may provide only a partial rectangle. Clear stale
    // measurements, but leave their logical toggle state to the caller.
    const measures=[bounds.top,bounds.height,objective.bottom,objective.height];
    if(measures.some(value=>value===undefined)){clearOffsets();return;}
    if(!measures.every(Number.isFinite)||bounds.height<=0||objective.height<=0){clearOffsets();close('教学暂不可展开');return;}
    const bottom=Math.max(0,Math.ceil(objective.bottom-bounds.top));
    this.root.style.setProperty('--battle-objective-bottom',`${bottom}px`);
    const tools=this.root.querySelector('.b-board-tools')?.getBoundingClientRect?.();
    const top=Math.max(bottom+36,Math.ceil((Number.isFinite(tools?.bottom)?tools.bottom:objective.bottom)-bounds.top)+4);
    this.root.style.setProperty('--battle-board-top',`${top}px`);
    const dock=this.root.querySelector('.b-dock')?.getBoundingClientRect?.();
    const limit=Number.isFinite(dock?.top)?dock.top-bounds.top-64:bounds.height-180;
    const available=Math.floor(limit-top),viewportRoom=Math.max(0,Math.floor(bounds.height-top-12));
    // An explicitly opened lesson may use the lower viewport when the dock has
    // left too little reading room. Its toggle stays above it, outside the card.
    const height=Math.max(0,Math.min(220,viewportRoom,available>=72?available:160));
    this.root.style.setProperty('--battle-coach-height',`${height}px`);
    if(!coach||!toggle)return;
    if(height<72)close('窗口过矮，请放大查看教学');
    toggle.setAttribute('aria-expanded',String(Boolean(this.coachExpanded)));
    toggle.textContent=height<72?'教学（窗口太矮）':this.coachExpanded?'教学 ▴':'教学 ▾';
  }

  squadNumber(unit,battle=this.getState().battle){
    // Include fallen squads so surviving teammates never change their number.
    return battle.units.filter(item=>item.side===unit.side).findIndex(item=>item.id===unit.id)+1;
  }

  squadLabel(unit,battle=this.getState().battle){
    return `第 ${this.squadNumber(unit,battle)} 队 · ${ROLE[unit.kind]||'分队'} · ${unit.x+1},${unit.y+1}`;
  }

  facingLabel(unit,facing,battle){
    return `${this.squadLabel(unit,battle)}，转向${['东','南','西','北'][facing]}（屏幕${['右','下','左','上'][this.screenAngle(facing,battle)/90]}方）`;
  }

  /** Comic sound effects over whoever just got hit, naming how the blow landed. */
  effects(hp){
    const battle=this.getState().battle;if(!battle)return;
    const place=unit=>this.root.querySelector(`[data-unit="${unit.id}"]`)||this.root.querySelector(`[data-battle-cell="${unit.x},${unit.y}"]`);
    let n=0;
    for(const hit of battle.fx||[]){
      const unit=battle.units.find(item=>item.id===hit.id),el=unit&&place(unit),rect=el?.getBoundingClientRect();
      if(!rect)continue;
      const x=rect.left+rect.width/2,y=rect.top+rect.height*.3,delay=n++*170;
      if(hit.tag)this.pop(x,y-26,`${hit.tag}！`,hit.tag==='背刺'?'crit':'gold',delay);
      this.pop(x,y,hit.kill?'击倒！':HIT[n%HIT.length],hit.kill?'red':'',delay);
      this.pop(x,y+30,`-${hit.amount}`,'small red',delay+80);
      setTimeout(()=>{el.classList.remove('hit');void el.offsetWidth;el.classList.add('hit');},delay);
    }
    for(const unit of battle.units){const was=hp.get(unit.id)??unit.hp;if(unit.hp>was){const rect=place(unit)?.getBoundingClientRect();if(rect)this.pop(rect.left+rect.width/2,rect.top+rect.height*.3,`+${unit.hp-was}`,'gold',n++*120);}}
  }

  /** Reads what just changed and lets the right girl react. Sazai stay silent. */
  voice(action,before,hp){
    const state=this.getState(),battle=state.battle;if(!battle)return;
    const mine=unit=>unit.side===battle.playerSide,unitOf=id=>battle.units.find(unit=>unit.id===id);
    const actor=unitOf(action.unitId);
    if(battle.phase==='result'){
      const captured=battle.result.capturedCharacterIds?.find(id=>before.units.some(unit=>unit.characterId===id&&mine(unit)));
      if(captured&&this.say(captured,'captured',true))return;
      const lead=battle.units.find(unit=>mine(unit)&&unit.hp>0&&unit.characterId);
      if(lead)this.say(lead.characterId,battle.result.playerWon?'win':'lose',true);
      return;
    }
    const target=action.targetId&&unitOf(action.targetId);
    if(action.type==='battleMove'&&actor?.characterId){const flag=battle.objective;this.say(actor.characterId,flag&&actor.x===flag.x&&actor.y===flag.y?'flag':'move');}
    else if(['battleAttack','battleSkill'].includes(action.type)&&actor?.characterId){this.say(actor.characterId,target&&target.side!==actor.side&&target.hp<=0?'kill':action.type==='battleSkill'?'skill':'attack',target?.hp<=0);}
    else if(action.type==='battleEndTurn'){
      const hurt=battle.units.filter(unit=>mine(unit)&&(hp.get(unit.id)??unit.hp)>unit.hp);
      const fallen=hurt.find(unit=>unit.hp<=0),victim=hurt.find(unit=>unit.characterId&&unit.hp>0);
      const witness=battle.units.find(unit=>mine(unit)&&unit.hp>0&&unit.characterId);
      if(fallen&&witness)this.say(witness.characterId,'ally_down',true);
      else if(victim)this.say(victim.characterId,victim.hp<victim.maxHp*.3?'hurt':'hit',true);
    }
  }

  render(){
    const state=this.getState(),battle=state.battle,previous=RECENT_LOG_STATE.get(this);
    const replaced=previous?.state!==state||previous?.revision!==state.revision||previous?.battle!==battle||previous?.phase!==battle?.phase;
    const readerHadFocus=Boolean(document.activeElement?.closest?.('[data-battle-history-view]'));
    if(replaced||!battle||document.getElementById('title-screen')?.hidden===false||document.getElementById('modal')?.open)this.historyOpen=false;
    if(replaced)this.resultFocusPending=battle?.phase==='result';
    if(battle)RECENT_LOG_STATE.set(this,{state,revision:state.revision,battle,phase:battle.phase});else RECENT_LOG_STATE.delete(this);
    this.root.hidden=!battle;document.body.classList.toggle('in-battle',Boolean(battle));
    document.querySelector('.app-shell').inert=Boolean(battle);
    if(!battle){morph(this.root,'');this.battleId=null;this.handover=null;HANDOVER_STATE.delete(this);this.layoutTeaching();this.layoutChatter({active:false});return;}
    const newBattle=this.battleId!==battle.id;
    if(newBattle){
      this.clearPreview();this.onStart?.();this.coachExpanded=false;this.centeredId=null;this.handover=null;this.battleId=battle.id;this.selectedId=null;this.skillMode=false;this.confirmRetreat=false;this.previousHp=new Map();
      const startedBattleId=battle.id,girls=battle.units.filter(unit=>unit.side===battle.playerSide&&unit.characterId).map(unit=>unit.characterId);
      if(girls.length)setTimeout(()=>{const current=this.getState().battle;if(current?.id!==startedBattleId||current.phase==='result')return;if(!(girls.length>1&&Math.random()<.5&&this.sayTeam(girls)))this.say(girls[0],'battle_start',true);},240);
    }
    const allies=battle.units.filter(unit=>unit.side===battle.playerSide);
    if(!allies.some(unit=>unit.id===this.selectedId&&unit.hp>0))this.selectedId=(allies.find(unit=>unit.hp>0&&!unit.acted)||allies.find(unit=>unit.hp>0))?.id||null;
    const unit=allies.find(item=>item.id===this.selectedId),options=unit?this.getOptions(state,unit.id):{moves:[],targets:[],skillTargets:[]};
    if(this.handover&&(HANDOVER_STATE.get(this)!==state||battle.phase!=='player'||this.handover.battleId!==battle.id||this.handover.round!==battle.round||this.handover.toId!==unit?.id))this.handover=null;
    if(!this.handover)HANDOVER_STATE.delete(this);
    const identity=unit?this.squadLabel(unit,battle):'未选中分队';
    const targets=this.skillMode?options.skillTargets||[]:options.targets||[],targetMap=new Map(targets.map(item=>[item.targetId||item.unitId,item]));
    const moveMap=new Map((this.skillMode?[]:options.moves||[]).map(cell=>[`${cell.x},${cell.y}`,cell])),moveKeys=moveMap;
    // Red stripes preview from a chosen move cell, or from the unit's tile once movement is done.
    if(this.focusKey&&!battle.tiles.some(cell=>`${cell.x},${cell.y}`===this.focusKey))this.focusKey=null;
    const plan=this.focusKey&&moveMap.has(this.focusKey)?this.focusKey.split(',').map(Number):null;
    const showReach=!this.skillMode&&unit&&options.ok&&!unit.acted&&(Boolean(plan)||!moveMap.size);
    const reachKeys=new Set(showReach?(this.getReach?.(state,unit.id,plan&&{x:plan[0],y:plan[1]})||[]).map(cell=>`${cell.x},${cell.y}`):[]);
    const aim=this.aimId&&targetMap.get(this.aimId);if(!aim)this.aimId=null;
    const attacker=state.factions[battle.attackerId],defender=state.factions[battle.defenderId],terrain=state.terrainTypes[state.tiles[battle.toKey]?.terrainId];
    const ready=allies.filter(item=>item.hp>0&&this.getOptions(state,item.id).canWait),flag=battle.objective;
    const wheel=battle.phase==='player'&&!this.historyOpen&&!this.confirmRetreat?this.wheelContext(state,battle,unit,options,aim,moveMap,ready):null;
    const details=wheel&&this.wheelPage==='details'?wheel.detail?.()||'':'';
    const raid=battle.mission==='raid',targetTile=state.tiles[battle.toKey];
    const declaration=!this.isSimulation?.()&&battle.defenderId===state.playerId
      ?(state.notices||[]).find(n=>n.kind==='war'&&n.line==='declare'&&n.turn===state.turn&&n.factionId===battle.attackerId):null;
    const quick=smallSkirmishInfo(state),selectedCell=unit&&battle.tiles.find(cell=>cell.x===unit.x&&cell.y===unit.y),coaching=this.coach?.();
    if(newBattle&&coaching&&this.isSimulation?.())this.coachExpanded=true;
    if(!coaching||battle.phase!=='player')this.coachExpanded=false;
    this.root.classList.toggle('raid-mission',raid);this.root.classList.toggle('coach-expanded',Boolean(this.coachExpanded));
    this.root.classList.toggle('has-card',Boolean(details));
    const mission=raid?`${battle.playerSide==='attacker'?'劫掠目标':'守备目标'}：${BUILDINGS[targetTile?.building]?.name||'建筑'} ${targetTile?.buildingLevel||1} 级 · ${battle.toKey}。${battle.playerSide==='attacker'?'获胜后摧毁建筑并撤回，不占领领土。':'敌军意图摧毁建筑并撤回，守住建筑即可阻止劫掠。'}`:'';

    const retreatText=this.retreatWarning(state);
    const cells=battle.tiles.map(cell=>{
      const key=`${cell.x},${cell.y}`,piece=battle.units.find(other=>other.hp>0&&other.x===cell.x&&other.y===cell.y);
      const isFlag=flag&&flag.x===cell.x&&flag.y===cell.y,raised=['forest','hill','rock','fort','cliff','ruin'].includes(cell.kind),only=BATTLE_TERRAIN[cell.kind]?.only,noEntry=unit&&only&&!only.includes(unit.kind),cue=moveMap.get(key)?.angle;
      const classes=['battle-cell',(cell.x+cell.y)%2?'odd':'',moveKeys.has(key)?'move-option':'',reachKeys.has(key)&&piece?.side!==battle.playerSide?'reach':'',key===this.focusKey?(moveMap.has(key)?'move-plan':'focused'):'',piece?.id===this.selectedId?'selected':'',piece&&targetMap.has(piece.id)?(this.skillMode&&piece.side===battle.playerSide?'heal-option':'target-option'):'',piece&&piece.id===this.aimId?'aimed':'',noEntry?'no-entry':''].filter(Boolean).join(' ');
      const chip=isFlag?`<span class="cell-chip flag">据点${battle.round<flagRule().from?` 第 ${flagRule().from} 轮起计数`:flag.holder?` ${flag.hold}/3`:''}${flag.contested?' 争夺中':''}</span>`:cell.defense&&!piece?`<span class="cell-chip">防 +${cell.defense}</span>`:BATTLE_TERRAIN[cell.kind]?.weak&&!piece?'<span class="cell-chip weak">易伤</span>':ONLY[cell.kind]&&!piece?`<span class="cell-chip only">${ONLY[cell.kind]}</span>`:'';
      // Portrait phones turn the board a quarter so all of it fits, with your side at the bottom.
      const row=battle.playerSide==='defender'?cell.x+1:battle.width-cell.x;
      const pieceName=piece?`${piece.side===battle.playerSide?'我方':'敌方'} ${this.squadLabel(piece,battle)} · ${piece.name}`:'';
      const selected=piece&&piece.id===this.selectedId&&battle.phase==='player',hint=selected?'点开行动圆盘':'';
      const floorTitle=[`${cell.x+1},${cell.y+1} ${BATTLE_TERRAIN[cell.kind]?.name||cell.kind}`,BATTLE_TERRAIN[cell.kind]?.note,pieceName,hint,cell.siegeCover?breastworkNote(cell.siegeCover):''].filter(Boolean).join(' · ');
      return `<button class="${classes}" data-battle-cell="${key}" data-kind="${esc(cell.kind)}" ${cell.siegeCover?`data-siege-cover="${cell.siegeCover}"`:""} title="${esc(floorTitle)}" style="--gr:${row};--gc:${cell.y+1}" aria-label="${cell.x+1},${cell.y+1} ${esc(BATTLE_TERRAIN[cell.kind]?.name||cell.kind)}${piece?' '+esc(pieceName):''}${hint?' · '+hint:''}${cell.siegeCover?' '+esc(breastworkNote(cell.siegeCover)):''}"${selected?` aria-expanded="${Boolean(wheel?.kind==='unit'&&wheel.key===key)}"`:''}>${cue?`<span class="cell-hint ${cue}">${cue==='back'?'背':'侧'}</span>`:''}${raised?'<i class="cell-face front"></i><i class="cell-face side-l"></i><i class="cell-face side-r"></i><i class="cell-cap"></i>':''}<i class="cell-mark"></i>${cell.kind==='forest'?TREES:cell.kind==='rock'?PEAK:''}${chip}${cell.siegeCover?`<i class="siege-wall" style="--wall-a:${this.screenAngle(cell.siegeFacing??2,battle)}deg"></i><span class="siege-chip">墙 ${cell.siegeCover}</span>`:''}${piece?this.piece(piece,state,battle,targetMap.get(piece.id)):''}${selected?'<i class="b-wheel-beacon" aria-hidden="true">···</i>':''}</button>`;
    }).join('');
    const hero=unit?.characterId?state.characters[unit.characterId]:null,face=hero?this.portrait(hero,unit.hp<unit.maxHp*.3?'cry':'smile'):'assets/sazai.webp';
    const ringLength=2*Math.PI*62,n=Math.max(1,allies.filter(item=>item.hp>0).length),gap=n>1?8:0,len=ringLength/n-gap;
    morph(this.root,`<div class="battle-center" data-board-scroll="1" tabindex="0" aria-label="可滚动的战场"><div class="battle-stage" style="--cols:${battle.width};--rows:${battle.height}"><div class="battle-grid" role="group" aria-label="战棋格盘" style="--ground:${esc(terrain?terrainTop(terrain):'#a99a84')}">${cells}</div></div></div>
      <header class="b-top ink-box"><b>${esc(attacker?.name)}</b><span${declaration?` title="${esc(declaration.text)}"`:''}>${declaration?'宣战并':''}${raid?'劫掠':'进攻'}</span><b>${esc(defender?.name)}</b><small>${this.isSimulation?.()?'模拟战 · ':''}${esc(battle.environment==='air'?C.airBattle:battle.environment==='sea'?C.navalBattle:terrain?.name||'边疆')}战场 · 第 ${battle.round} 轮${flag?.holder?(battle.round<flagRule().from?` · ${flag.holder===battle.playerSide?'我方':'敌方'}先站上了据点`:` · ${flag.holder===battle.playerSide?'我方':'敌方'}占据点 ${flag.hold}/3`):''}</small></header><div class="b-objective" data-objective="1"><b>赢法：打倒全部敌人，或占住据点 3 轮</b><span>第 ${flagRule().from} 轮起计数 · 据点旁有敌人时不计轮</span>${flag?.holder&&flag.holder!==battle.playerSide&&flag.hold>0?`<p class="b-flag-alarm" role="alert">敌方已占据点 ${flag.hold}/3：让任意一队站到据点旁边就能打断${flag.hold>=flagRule().hold-1?'，这一轮不打断就输了':''}。</p>`:''}${mission?`<p class="b-raid-goal">${esc(mission)}</p>`:''}${battle.siege?`<p class="b-siege-entry">${battle.siege.level} 级要塞胸墙 · ${esc(breastworkNote(battle.siege.cover))}</p>`:''}${this.canQuickDefense?.()?'<p class="b-quick-note"><button data-battle-command="quick-defense">自动打完这一场</button><span>按真实损失结算</span></p>':''}${quick?`<p class="b-quick-note">普通小队交战 ${quick.attacker} 对 ${quick.defender}，仍可能伤亡。<button data-battle-command="quick">快速结算本场</button></p>`:''}</div><div class="b-board-tools">${battle.phase==='player'?this.historyToggle():''}${coaching?`<button data-battle-command="coach-toggle" aria-controls="battle-coach" aria-expanded="${Boolean(this.coachExpanded)}">${this.coachExpanded?'教学 ▴':'教学 ▾'}</button>`:''}</div>${battle.phase==='player'?this.historyPanel(battle):''}${this.confirmRetreat?`<div class="b-retreat-note"><p>${esc(retreatText)}</p><button data-battle-command="retreat">确认撤退</button><button data-battle-command="cancel-retreat">继续战斗</button></div>`:''}
      <div class="b-tools"><button class="tab" data-battle-command="auto" data-label="自动"></button><button class="tab ${this.confirmRetreat?'hot':''}" data-battle-command="retreat" data-label="${this.confirmRetreat?'确认撤退':'撤退'}"></button><button class="tab" data-battle-command="save" data-label="存档" aria-label="存档"></button></div>
      <div class="b-hero ${unit?.rank&&unit.rank!=='hero'?'is-sazai':''}" style="--glow:${GLOW[unit?.rank]||'transparent'}">${unit?`<img src="${esc(face)}" alt="" />`:''}</div>
      ${unit?`<div class="b-plate"><b>${esc(hero?.name||unit.name)}</b><small>${esc(identity)} · Lv ${unit.trainingLevel||unit.level||1} · 移 ${unit.move} · 射 ${unit.range}${unit.plane?' · '+(C[unit.aircraftModelId+'Name']||C.aircraft):unit.nativeFlight?' · '+C.air:''}${unit.morale>0?' · 状态好':unit.morale<0?' · 疲劳':''}</small><span class="hp"><i style="width:${hpOf(unit)}%"></i></span><em>${unit.hp}/${unit.maxHp}</em><p class="b-unit-progress">${unit.moved?'已移动':'<i class="b-sw move" aria-hidden="true"></i>还能移动'} · ${unit.acted?'已行动':'<i class="b-sw hit" aria-hidden="true"></i>还能攻击'}${unit.acted&&!unit.moved&&unit.fx?.kite?' · 可再移动':''}</p>${selectedCell?.siegeCover?`<p class="b-cover-note" title="${esc(breastworkNote(selectedCell.siegeCover))}">当前胸墙：正 +${selectedCell.siegeCover} / 侧 +${Math.floor(selectedCell.siegeCover/2)} / 背 0</p>`:''}${this.chips(state,unit.id)}</div>`:''}
      <div class="b-dock"><div class="b-squad">${allies.map(item=>this.token(item,state)).join('')}</div><div class="b-actions"><small class="b-current" role="status" aria-live="polite" aria-atomic="true" ${this.handover?'data-auto-handover="1"':''}>${this.handover?'已自动选中':'当前'}：${esc(identity)}</small>${this.skillMode?'<button class="b-act on" data-battle-command="skill">取消技能</button>':''}<button class="b-act b-next" data-battle-command="next" ${ready.length?'':'disabled'}><span><b>下一队</b></span></button></div></div>
      <button class="dial ${ready.length?'':'ready'}" data-battle-command="end" aria-label="结束我方行动，开始敌方行动" title="点击结束我方行动，随后由敌方行动"><svg class="ring" viewBox="0 0 142 142">${Array.from({length:n},(_,i)=>`<circle class="seg ${i<ready.length?'on':''}" cx="71" cy="71" r="62" stroke-dasharray="${len} ${ringLength-len}" stroke-dashoffset="${-i*ringLength/n-gap/2}" />`).join('')}</svg><span class="core"><small>第 ${battle.round} 轮</small><b class="${ready.length?'':'next'}">${ready.length||'结束行动'}</b><em>${ready.length?'队待命':'点击继续'}</em></span></button>
      ${details||(wheel?this.actionWheel(wheel):'')}
      <p class="b-log">${esc(battle.log.at(-1)?.text||battle.log.at(-1)||'')}</p>
      <div class="b-key"><span>点棋子或头像选角色</span><span><i class="k-move"></i>点蓝格开圆盘 / 双击移动</span><span><i class="k-reach"></i>攻击范围</span><span><i class="k-hit"></i>点红框开圆盘 / 双击攻击</span><span>再点当前角色开圆盘</span><span><i class="k-flag"></i>第 ${flagRule().from} 轮起站据点 3 轮获胜，旁有敌人暂停</span></div>
      ${battle.phase==='player'&&coaching?`<button id="battle-coach" class="b-coach" data-coach="1" ${this.coachExpanded?'':'hidden'}><small>教学 ${coaching.index}/${coaching.total}</small>${esc(coaching.text)}<em>点这里下一条</em></button>`:''}
      ${battle.phase==='result'?this.resultCard(battle,state):''}`);
    this.root.scrollTop=0;this.root.scrollLeft=0;
    this.layoutTeaching();this.placeCard();
    this.layoutChatter({blocked:Boolean(this.historyOpen)||(battle.phase!=='result'&&Boolean(aim||this.threatId||this.focusKey||this.confirmRetreat||this.coachExpanded)),result:battle.phase==='result'});
    if(this.centeredId!==this.selectedId)this.centerBoardOnSelection();
    this.placeWheel();
    if(aim)document.getElementById('bubble').hidden=true;
    if(this.threatId)this.paintThreat(this.threatId);
    this.previousHp=new Map(battle.units.map(other=>[other.id,other.hp]));
    if(!document.getElementById('modal')?.open&&document.getElementById('title-screen')?.hidden!==false){
      if(this.resultFocusPending){this.root.querySelector('[data-battle-command="finish"]')?.focus({preventScroll:true});this.resultFocusPending=false;}
      else if(replaced&&readerHadFocus)this.root.querySelector('[data-battle-command="history-toggle"]')?.focus({preventScroll:true});
    }
  }

  chips(state,id){
    const list=this.getStatus(state,id);
    return list.length?`<div class="b-status">${list.map(chip=>`<span class="${chip.good?'up':'down'}" title="${esc(chip.why)}">${esc(chip.text)}</span>`).join('')}</div>`:'';
  }

  /** State the known stakes, not a guaranteed refuge before world settlement. */
  retreatWarning(state){
    if(this.isSimulation?.())return '撤退会结束本场模拟战，在结果页继续后返回原界面。真实战局、资源和角色状态不会改变。';
    const battle=state.battle,raid=battle.mission==='raid',tile=state.tiles[battle.toKey];
    const loss=typeof C!=='undefined'?'撤退视为战败，损失的兵力不会恢复。'+C.surrenderDetail:'撤退视为战败，损失的兵力不会恢复；倒下的同伴可能被俘。';
    if(battle.playerSide!=='defender')return loss+(raid?'本次劫掠失败，不获得回收资源。':'本次进攻失败，不占领目标。')+'幸存军队撤回出征地。';
    if(raid)return loss+'目标建筑会被敌军摧毁，领土归属不变。';
    const capital=battle.defenderId===state.playerId&&tile?.ownerId===state.playerId&&state.factions[state.playerId]?.capitalKey===battle.toKey;
    const territory=capital?`这里是你当前的首都（${battle.toKey}）。撤退将使首都失守。结算后若有己方可用要塞（未封存、已整备且至少 ${FORT_GARRISON} 人）则迁都，否则失去全部领土并流亡重建。`:'这块领土将被敌军占领。';
    return territory+loss+'幸存军队按驻地容量安置；容量不足的军士退役、稀有分队解散。';
  }

  /** Board directions as they look on screen. Tall screens turn the board a quarter, with the player's side at the bottom. */
  screenAngle(facing,battle){
    if(!window.matchMedia('(max-width:900px) and (orientation:portrait)').matches)return [0,90,180,270][facing]??0;
    return (battle.playerSide==='defender'?[90,0,270,180]:[270,0,90,180])[facing]??0;
  }

  wheelContext(state,battle,unit,options,aim,moveMap,ready){
    const nameOf=item=>state.characters[item.characterId]?.name||item.name;
    const choice=(command,text,position,glyph,rest={})=>({command,text,position,glyph,...rest});
    const detail=choice('wheel-details','详情','secondary','help');
    const target=battle.units.find(item=>item.hp>0&&item.id===(aim?this.aimId:this.threatId));
    if(target){
      if(aim&&unit){
        const heal=Object.hasOwn(aim,'heal'),action=heal?'鼓舞':'攻击';
        const note=heal?`回复 ${aim.heal} · ${target.hp} → ${Math.min(target.maxHp,target.hp+aim.heal)}`
          :`伤害 ${aim.damage} · ${aim.counter?`反击 ${aim.counter}`:'无反击'}${aim.canDefeat?' · 可击倒':''}`;
        return {key:cellKeyOf(target),kind:heal?'heal':'attack',label:nameOf(target),note,choices:[choice('confirm',action,'primary',heal?'spark':'target'),detail,...(!heal&&typeof C!=='undefined'?[choice('suppress',C.suppress+' '+tacticalSuppressPreview(battle,unit.id,target.id).damage,'west','target',{title:C.suppressDetail})]:[])],
          detail:()=>heal?this.healCard(unit,target,aim,state):this.forecast(unit,target,aim,state)};
      }
      const status=tacticalTargetStatus(battle,this.selectedId,target.id,{skill:this.skillMode});
      return {key:cellKeyOf(target),kind:'blocked',label:nameOf(target),note:status.reason||'查看敌方威胁范围',
        choices:[{...detail,position:'primary'}],detail:()=>this.inspect(target,state)};
    }
    if(!this.focusKey)return null;
    if(unit&&cellKeyOf(unit)===this.focusKey){
      const facing=this.wheelPage==='face',tactics=this.wheelPage==='tactics';
      const choices=tactics?[choice('brace',C.brace,'west','shield',{disabled:!options.canWait,title:C.guardDetail}),choice('overwatch',C.overwatch,'east','target',{disabled:!options.canWait,title:C.overwatchDetail}),choice('wheel-back',C.cancel,'south','undo')]:facing?[0,1,2,3].map(face=>{
        const angle=this.screenAngle(face,battle);
        return {text:['右','下','左','上'][angle/90],position:['east','south','west','north'][angle/90],glyph:'arrow',angle,face,pressed:unit.facing===face,title:this.facingLabel(unit,face,battle)};
      }):[
        options.skillLabel&&choice('skill',unit.skillUsed?'已用':options.skillLabel,'north','spark',{disabled:!options.canSkill,title:options.skillDescription}),
        typeof C!=='undefined'&&choice('wheel-tactics',C.guard,'primary','shield'),
        choice('wheel-face','转向','west','compass'),
        choice('wait','待机','east','shield',{disabled:!options.canWait,title:options.reason||'结束本轮行动，自动选下一队'}),
        choice('next','下一队','south','arrow',{disabled:!ready.length}),
      ].filter(Boolean);
      return {key:this.focusKey,kind:'unit',label:nameOf(unit),note:facing?'点圆盘按钮选一个朝向':'点圆盘按钮操作 · 双击蓝格移动 · 双击红框攻击',choices,facing};
    }
    const cell=battle.tiles.find(item=>cellKeyOf(item)===this.focusKey);
    if(!cell)return null;
    const land=BATTLE_TERRAIN[cell.kind]||{},step=moveMap.get(this.focusKey);
    return {key:this.focusKey,kind:step?'move':'blocked',label:land.name||cell.kind,
      note:step?[cell.defense?`防 +${cell.defense}`:'',step.angle==='back'?'可背刺':step.angle==='side'?'可侧击':'','点「移动」或快速双击该格'].filter(Boolean).join(' · '):'走不到这里',
      choices:step?[choice('move-here','移动','primary','arrow',{title:'移动到这里'}),detail]:[{...detail,text:'地形',position:'primary'}],
      detail:()=>this.cellCard(state,battle,unit,options,moveMap)};
  }

  actionWheel(wheel){
    const buttons=wheel.choices.map(({command,text,position,glyph,angle,face,pressed,disabled,title})=>{
      const action=face===undefined?`data-battle-command="${command}"`:`data-face="${face}" aria-pressed="${pressed}"`;
      return `<button type="button" class="b-wheel-choice ${position}" ${action} ${disabled?'disabled':''}${title?` title="${esc(title)}" aria-label="${esc(title)}"`:''}>${glyph?`<i${angle===undefined?'':` style="--wheel-angle:${angle}deg"`}>${icon(glyph)}</i>`:''}<b>${esc(text)}</b></button>`;
    }).join('');
    return `<div class="b-wheel ${wheel.kind}" data-wheel-anchor="${wheel.key}" role="group" aria-label="${esc(wheel.label)}行动圆盘" aria-describedby="battle-wheel-note">${buttons}<button type="button" class="b-wheel-hub" data-battle-command="${wheel.facing?'wheel-back':'unfocus'}" aria-label="${wheel.facing?'返回圆盘':'关闭圆盘'}">${icon(wheel.facing?'arrow':'close')}</button><p class="b-wheel-note" id="battle-wheel-note"><b>${esc(wheel.label)}</b><span>${esc(wheel.note)}</span></p></div>`;
  }

  focusWheel(){
    const button=this.root.querySelector('[data-battle-command="wheel-back"]')||this.root.querySelector('.b-wheel-choice.primary')||this.root.querySelector('.b-wheel-choice:not([disabled])');
    button?.focus?.({preventScroll:true});
  }

  /** Dock the action wheel outside the board grid so no square is ever covered. */
  placeWheel(){
    const wheel=this.root.querySelector?.('[data-wheel-anchor]');if(!wheel?.getBoundingClientRect)return;
    const anchor=this.root.querySelector(`[data-battle-cell="${wheel.dataset.wheelAnchor}"]`)?.getBoundingClientRect();
    const grid=this.root.querySelector('.battle-grid')?.getBoundingClientRect();
    const dial=this.root.querySelector('.dial')?.getBoundingClientRect();
    const dock=this.root.querySelector('.b-dock')?.getBoundingClientRect();
    const screen=this.root.getBoundingClientRect(),menu=wheel.getBoundingClientRect();
    if(!anchor||!menu.width||!screen.width)return;
    const css=getComputedStyle(this.root),inset=side=>parseFloat(css.getPropertyValue(`--sa-${side}`))||0,pad=8;
    const room={left:screen.left+pad+inset('l'),right:screen.right-pad-inset('r'),top:screen.top+pad+inset('t'),bottom:screen.bottom-pad-inset('b')};
    const w=menu.width,h=menu.height,x=(anchor.left+anchor.right)/2,y=(anchor.top+anchor.bottom)/2;
    const note=wheel.querySelector('.b-wheel-note'),size=note.getBoundingClientRect();
    const portrait=window.matchMedia?.('(max-width:900px) and (orientation:portrait)')?.matches;
    const shortLand=window.matchMedia?.('(orientation:landscape) and (max-height:520px)')?.matches;
    if(portrait){
      const floor=dial?dial.top-6:room.bottom-84,ceil=grid?grid.bottom+6:room.top+120;
      const left=clamp(room.right-w-2,room.left,room.right-w),top=clamp(dock?dock.top-6:floor-h,Math.min(ceil,floor-h),Math.max(room.top,floor-h));
      wheel.dataset.side='below';wheel.dataset.placed='1';
      wheel.style.left=`${left-screen.left}px`;wheel.style.top=`${top-screen.top}px`;
      const nLeft=clamp(left-size.width-8,room.left,Math.max(room.left,left-6)),nTop=clamp(top+(h-size.height)/2,Math.min(ceil,room.bottom-size.height),room.bottom-size.height);
      note.style.left=`${nLeft-left}px`;note.style.top=`${nTop-top}px`;return;
    }
    if(shortLand){
      const colLeft=grid?Math.max(grid.right+10,room.right-w-96):room.right-w-8;
      const left=clamp(room.right-w-8,colLeft,room.right-w),maxTop=(dial?dial.top-size.height-10:room.bottom)-h;
      const top=clamp(room.top+36,room.top+32,Math.max(room.top+32,maxTop));
      wheel.dataset.side='right';wheel.dataset.placed='1';
      wheel.style.left=`${left-screen.left}px`;wheel.style.top=`${top-screen.top}px`;
      const nLeft=clamp(left+(w-size.width)/2,grid?grid.right+6:room.left,room.right-size.width),nTop=clamp(top+h+5,room.top,room.bottom-size.height);
      note.style.left=`${nLeft-left}px`;note.style.top=`${nTop-top}px`;return;
    }
    const obstacles=[...this.root.querySelectorAll('.b-top,.b-tools,.b-board-tools,.b-squad,.b-plate,.b-coach:not([hidden]),.battle-screen .dial')].map(node=>node.getBoundingClientRect()).filter(box=>box.width&&box.height);
    const board=grid||anchor,dockTop=dial?dial.top-h-size.height-14:room.bottom-h-size.height-14;
    const spots=[
      ['right',board.right+14,clamp(y-h/2,board.top,dockTop)],
      ['right',room.right-w-8,dockTop],
      ['left',board.left-w-14,clamp(y-h/2,board.top,dockTop)],
      ['below',x-w/2,board.bottom+10],
      ['above',x-w/2,board.top-h-size.height-10],
    ];
    const fits=spots.map(([side,left,top])=>{
      const l=clamp(left,room.left,room.right-w),t=clamp(top,room.top,room.bottom-h),box={left:l,right:l+w,top:t,bottom:t+h};
      return {side,box,score:overlap(box,board)*10000+overlap(box,anchor)*10000+obstacles.reduce((sum,other)=>sum+overlap(box,other)*4,0)+Math.hypot(l-left,t-top)*.4};
    }).sort((a,b)=>a.score-b.score);
    const {side,box}=fits[0];wheel.dataset.side=side;wheel.dataset.placed='1';
    wheel.style.left=`${box.left-screen.left}px`;wheel.style.top=`${box.top-screen.top}px`;
    const noteSpot=top=>{const nLeft=clamp(box.left+(w-size.width)/2,room.left,room.right-size.width),nBox={left:nLeft,right:nLeft+size.width,top,bottom:top+size.height};return {nLeft,top,hit:overlap(nBox,board)*1000+overlap(nBox,anchor)*100+obstacles.reduce((s,o)=>s+overlap(nBox,o)*2,0)};};
    const below=noteSpot(box.bottom+6),above=noteSpot(Math.max(room.top,box.top-size.height-6));
    const picked=box.bottom+6+size.height<=room.bottom&&(below.hit<=above.hit||box.top-size.height-6<room.top)?below:above;
    note.style.left=`${picked.nLeft-box.left}px`;
    note.style.top=`${picked.top-box.top}px`;
  }

  /** The blow before it lands: both health bars, every number behind it and what comes back. */
  forecast(unit,target,hit,state){
    const nameOf=item=>state.characters[item.characterId]?.name||item.name;
    const after=Math.max(0,target.hp-hit.damage),self=Math.max(0,unit.hp-(hit.counter||0));
    const bar=(item,left)=>`<span class="fc-hp"><i style="width:${hpOf(item)}%"></i><u style="width:${left/Math.max(1,item.maxHp)*100}%"></u></span>`;
    const reply=hit.canDefeat?COUNTER_REPLY.defeated:hit.counter?`对方会反击 -${hit.counter}`:COUNTER_REPLY[hit.counterReason]||'对方不会反击';
    return `<section class="b-forecast ${hit.angle}" aria-label="攻击预览"><div class="fc-top"><div class="fc-side"><small class="fc-label">我方</small><b>${esc(nameOf(unit))}</b>${bar(unit,self)}<small>${unit.hp} → ${self}</small></div><div class="fc-mid"><em>${ANGLE[hit.angle]}</em><strong>-${hit.damage}</strong></div><div class="fc-side foe"><small class="fc-label">目标</small><b>${esc(nameOf(target))}</b>${bar(target,after)}<small>${target.hp} → ${after}</small></div></div><div class="fc-lines">${hit.lines.map(line=>`<span class="${line.value>0?'up':'down'}">${esc(line.label)} ${line.value>0?'+':''}${line.value}</span>`).join('')}</div><p class="fc-reply ${hit.canDefeat?'kill':''}">${reply}</p>${backToWheel}</section>`;
  }

  /** Wide screens: the cell and enemy cards sit in the free column left of the board, above the portrait,
   * instead of over the board. Too narrow a column keeps the CSS placement (top centre). */
  placeCard(){
    const card=this.root.querySelector?.('.b-inspect');if(!card)return;
    if(window.matchMedia?.('(max-width:900px) and (orientation:portrait)').matches||window.matchMedia?.('(orientation:landscape) and (max-height:520px)').matches)return;
    const grid=this.root.querySelector('.battle-grid')?.getBoundingClientRect(),hero=this.root.querySelector('.b-hero')?.getBoundingClientRect();
    const room=grid?Math.floor(grid.left)-24:0;if(room<220)return;
    const top=96,bottom=Math.max(top+160,(hero&&hero.top>top?hero.top:innerHeight)-12);
    Object.assign(card.style,{left:'12px',top:`${top}px`,transform:'none',width:`${Math.min(320,room)}px`,maxHeight:`${bottom-top}px`,overflow:'auto'});
  }

  /** A support's heal, previewed like an attack: nothing happens until its button is pressed. */
  healCard(unit,target,hit,state){
    if(!target)return '';
    const nameOf=item=>state.characters[item.characterId]?.name||item.name,after=Math.min(target.maxHp,target.hp+hit.heal);
    return `<section class="b-forecast heal" aria-label="鼓舞预览"><div class="fc-top"><div class="fc-side"><small class="fc-label">我方</small><b>${esc(nameOf(unit))}</b></div><div class="fc-mid"><em>鼓舞</em><strong>+${hit.heal}</strong></div><div class="fc-side"><small class="fc-label">目标</small><b>${esc(nameOf(target))}</b><small>${target.hp} → ${after}</small></div></div>${backToWheel}</section>`;
  }

  /** The card for a tapped cell: what the ground is, who stands there, and the only buttons that act. */
  cellCard(state,battle,unit,options,moveMap){
    const [x,y]=this.focusKey.split(',').map(Number),cell=battle.tiles.find(item=>item.x===x&&item.y===y);if(!cell)return '';
    const land=BATTLE_TERRAIN[cell.kind]||{},piece=battle.units.find(item=>item.hp>0&&item.x===x&&item.y===y),flag=battle.objective,isFlag=Boolean(flag&&flag.x===x&&flag.y===y);
    const facts=[cell.defense?`防 +${cell.defense}`:'',land.weak?'受伤 +1':'',land.cost>1?`移动消耗 ${land.cost}`:'',land.only?`只有${land.only.map(kind=>ROLE[kind]).join('、')}能进`:'',isFlag?'据点':''].filter(Boolean);
    const notes=[land.note,isFlag&&cell.kind!=='fort'?'站这里 3 轮获胜，身边有敌人时暂停':'',cell.siegeCover?breastworkNote(cell.siegeCover):''].filter(Boolean);
    const ground=`<p class="b-cell-land"><b>${esc(land.name||cell.kind)}</b>${facts.map(fact=>`<span>${esc(fact)}</span>`).join('')}</p>${notes.map(note=>`<p>${esc(note)}</p>`).join('')}`;
    const card=(kind,label,body)=>`<section class="b-inspect b-cellcard ${kind}" aria-label="${esc(label)}">${body}${backToWheel}</section>`;
    const nameOf=item=>state.characters[item.characterId]?.name||item.name;
    if(piece&&piece.side===battle.playerSide&&piece.id!==unit?.id)
      return card('ally',nameOf(piece),`<b>${esc(nameOf(piece))}</b><small>${esc(this.squadLabel(piece,battle))} · 移 ${piece.move} · 射 ${piece.range} · 生命 ${piece.hp}/${piece.maxHp}</small><p>${piece.moved?'已移动':'还能移动'} · ${piece.acted?'已行动':'还能攻击'}</p>${this.chips(state,piece.id)}${ground}`);
    const step=moveMap.get(this.focusKey),label=`地块 ${x+1},${y+1}`;
    if(piece&&piece.id===unit?.id)return card('',label,`${ground}<p class="b-cell-why">${esc(nameOf(unit))}站在这里。${unit.acted?'':moveMap.size?'点蓝色移动格可预览走到那里的攻击范围。':'红色斜线是她从这里能打到的范围。'}</p>`);
    if(step)return card('move',label,`${ground}<p class="b-cell-why">红色斜线：走到这里后能打到的范围。${step.angle==='back'?'从这里能打到敌人背后。':step.angle==='side'?'从这里能打到敌人侧面。':''}</p>`);
    let why='';
    if(unit&&!land.block){
      why=options.reason||(this.skillMode?'技能模式下不能移动，先关掉技能。':unit.moved?'这支分队本回合已经移动过。':land.only&&!land.only.includes(unit.kind)?`${ROLE[unit.kind]||'这支分队'}进不去这里。`:`这回合走不到这里：移动力 ${unit.move}，走到敌人身边要停下。`);
    }
    return card('',label,`${ground}${why?`<p class="b-cell-why">${esc(why)}</p>`:''}`);
  }

  /** Tapping an enemy out of reach explains it instead of doing nothing. */
  inspect(foe,state){
    if(!foe)return '';
    const status=tacticalTargetStatus(state.battle,this.selectedId,foe.id,{skill:this.skillMode});
    return `<section class="b-inspect"><b>${esc(state.characters[foe.characterId]?.name||foe.name)}</b><small>Lv ${foe.trainingLevel||foe.level||1} · ${ROLE[foe.kind]||''} · 移 ${foe.move} · 射 ${foe.range} · 生命 ${foe.hp}/${foe.maxHp}</small>${status.reason?`<p class="b-target-blocked">${esc(status.reason)}</p>`:''}${this.chips(state,foe.id)}<p>红格是她下一步能打到的地方。小三角是她的朝向，绕到背后打伤害最高。</p>${backToWheel}</section>`;
  }

  token(unit,state){
    const character=state.characters[unit.characterId],face=character?this.portrait(character,'smile'):'assets/sazai.webp';
    return `<button class="b-token ${unit.id===this.selectedId?'selected':''} ${unit.hp<=0?'fallen':unit.acted?'spent':''} ${unit.characterId?'':'sazai'}" style="--hp:${hpOf(unit)}%;--glow:${GLOW[unit.rank]||'transparent'}" data-battle-unit="${esc(unit.id)}" ${unit.hp<=0?'disabled':''} aria-label="选择 ${esc(this.squadLabel(unit))} · ${esc(unit.name)} · 生命 ${unit.hp}/${unit.maxHp}" title="${esc(this.squadLabel(unit))} · ${esc(unit.name)} · 生命 ${unit.hp}/${unit.maxHp}"><span><img src="${esc(face)}" alt="" /></span><em class="b-squad-number" aria-hidden="true">${this.squadNumber(unit)}</em></button>`;
  }

  piece(unit,state,battle,hit){
    const character=state.characters[unit.characterId],face=character?this.portrait(character,unit.hp<unit.maxHp*.3?'cry':unit.hp<unit.maxHp*.6?'angry':'smile'):null,enemy=unit.side!==battle.playerSide;
    const chip=hit?(Object.hasOwn(hit,'heal')?`<span class="dmg heal">+${hit.heal}</span>`:`<span class="dmg ${hit.canDefeat?'kill':''} ${hit.angle}">${hit.canDefeat?'击倒 ':hit.angle==='front'?'':ANGLE[hit.angle]+' '}-${hit.damage}</span>`):'';
    return `<span class="battle-piece ${unit.characterId?'':'sazai'} ${unit.plane?'aircraft':''} ${enemy?'enemy':''} ${unit.id===this.selectedId?'selected':''} ${unit.acted&&!enemy?'spent':''}" data-unit="${esc(unit.id)}" style="--glow:${GLOW[unit.rank]||'transparent'}"><i class="piece-dir" style="--a:${this.screenAngle(unit.facing,battle)}deg"></i>${unit.plane?`<img class="battle-plane-token" src="assets/buildings/airplane.webp" alt="" style="--plane-a:${this.screenAngle(unit.facing,battle)+40}deg" />`:""}<span class="battle-token-portrait"><img src="${esc(face||'assets/sazai.webp')}" alt="" /></span><span class="piece-health"><i style="width:${hpOf(unit)}%"></i></span><span class="piece-hp">${unit.hp}</span><em class="piece-order" aria-hidden="true">${this.squadNumber(unit,battle)}</em>${unit.overwatch||unit.braced||unit.suppressed?`<small class="b-stance">${esc(unit.overwatch?C.overwatch:unit.braced?C.brace:C.suppress)}</small>`:''}${chip}</span>`;
  }

  resultCard(battle,state){
    const result=battle.result||{},won=result.playerWon,simulation=Boolean(this.isSimulation?.());
    const own=battle.playerSide==='attacker'?result.attackerSurvivors:result.defenderSurvivors,foe=battle.playerSide==='attacker'?result.defenderSurvivors:result.attackerSurvivors;
    const lost=Object.entries(result.lostSazai?.[battle.playerSide]||{}).map(([rank,count])=>`${rank} 级 ${count}`).join('、');
    const faces=(ids,note)=>ids.map(id=>{const character=state.characters[id],src=this.portrait(character,won?'happy':'cry');return `<figure>${src?`<img src="${esc(src)}" alt="" />`:''}<figcaption>${esc(character?.name||id)}<small>${note}</small></figcaption></figure>`;}).join('');
    const raid=battle.mission==='raid',attackerWon=result.winnerSide==='attacker';
    const mission=!simulation&&raid?(battle.playerSide==='attacker'?(attackerWon?'摧毁建筑后撤回，领土归属不变。':'劫掠未成功，建筑未被摧毁，领土归属不变。'):(attackerWon?'敌军摧毁建筑后撤回，我方领土归属不变。':'守住了建筑，敌军劫掠失败，领土归属不变。')):'';
    const captured=simulation?[]:result.capturedCharacterIds||[],rescued=simulation||raid?[]:result.rescuedCharacterIds||[];
    const growthNote=simulation?'本页数字与战果仅为模拟演示，不写入真实战局；点「继续」返回原界面。真实资源、角色成长、出战与胜负记录、疲劳和俘虏状态不变。':result.growthSuppressed==='no-contact-retreat'?'未交战便撤退：双方不获得战斗经验、羁绊或共同作战次数。出战、胜负记录与疲劳照常结算。':result.growthLimited==='participants-only-retreat'?'主动进攻后撤退：双方仅实际交战或有效支援的角色获得经验与羁绊，共同作战次数只计这些同伴。出战、胜负记录与疲劳照常结算。':'';
    const initial=side=>(battle.units||[]).filter(unit=>unit.side===side).reduce((n,unit)=>n+(unit.initialSoldiers||0),0),foeSide=battle.playerSide==='attacker'?'defender':'attacker';
    const casualty=`我军普通军士 ${initial(battle.playerSide)} → ${own??0}，损失 ${Math.max(0,initial(battle.playerSide)-(own||0))}；敌方 ${initial(foeSide)} → ${foe??0}，损失 ${Math.max(0,initial(foeSide)-(foe||0))}。`;
    return `<div class="b-result ${won?'won':'lost'}"><i class="speed-lines"></i><section aria-label="${simulation?'模拟战结果':'战斗结果'}"><h3>${simulation?'模拟战 · ':''}${won?'大捷！':result.reason==='retreat'?'撤退':'败北'}</h3><p class="tally"><b>${own??0}</b> 罪袋生还　<span>敌方残余</span> <b>${foe??0}</b></p><p class="b-casualty">${esc(casualty)}</p>${lost?`<p class="lost">阵亡的稀有罪袋：${lost}</p>`:''}${mission?`<p class="b-raid-outcome">${esc(mission)}</p>`:''}${growthNote?`<p class="b-casualty" data-battle-growth-note>${esc(growthNote)}</p>`:''}${captured.length||rescued.length?`<div class="b-faces">${faces(captured,won?'可以招降':'被俘了')}${faces(rescued,'获救')}</div>`:''}<aside class="b-result-history" data-recent-battle-history>${this.historyToggle()}${this.historyPanel(battle)}</aside><button class="dial-like" data-battle-command="finish">继续${icon('arrow')}</button></section></div>`;
  }

  fire(){if(this.aimId)this.act({type:this.skillMode?'battleSkill':'battleAttack',unitId:this.selectedId,targetId:this.aimId});}

  handleClick(event){
    const cellKey=event.target.closest?.('[data-battle-cell]')?.dataset.battleCell;
    if(event.target.closest?.('button')?.disabled||event.detail>2||(!cellKey&&event.detail>1))return;
    const state=this.getState(),battle=state.battle;if(!battle)return;
    const rendered=RECENT_LOG_STATE.get(this);
    if(rendered&&(!this.historyIsCurrent(state)||this.root.contains?.(event.target)===false))return;
    if(event.target.closest('[data-coach]')){this.historyOpen=false;this.onCoach?.();this.render();return;}
    const command=event.target.closest('[data-battle-command]')?.dataset.battleCommand;
    if(!cellKey||command)this.lastTap=null;
    if(command==='history-toggle'){
      if(this.root?.contains(event.target)&&this.historyIsCurrent(state))this.toggleHistory();
      return;
    }
    if(event.target.closest('[data-battle-history-view]'))return;
    if(battle.phase==='result'){if(command==='finish')this.act({type:'finishBattle'});return;}
    if(command){
      if(command==='move-here'){
        const [fx,fy]=String(this.focusKey||'').split(',').map(Number),options=this.getOptions(state,this.selectedId);
        if(!this.skillMode&&options.moves?.some(cell=>cell.x===fx&&cell.y===fy))this.act({type:'battleMove',unitId:this.selectedId,x:fx,y:fy});
        return;
      }
      if(command==='unfocus'){
        const anchor=this.root.querySelector('[data-wheel-anchor]')?.dataset.wheelAnchor;
        this.clearPreview();this.render();
        if(event.detail===0&&anchor)this.root.querySelector(`[data-battle-cell="${anchor}"]`)?.focus?.({preventScroll:true});
        return;
      }
      if(command==='wheel-details'||command==='wheel-face'||command==='wheel-tactics'||command==='wheel-back'){
        this.wheelPage=command==='wheel-details'?'details':command==='wheel-face'?'face':command==='wheel-tactics'?'tactics':null;
        this.render();if(event.detail===0)this.focusWheel();return;
      }
      if(command==='coach-toggle'){this.clearPreview();this.historyOpen=false;this.coachExpanded=!this.coachExpanded;this.render();return;}
      if(command==='center-board'){this.centerBoardOnSelection();return;}
      if(command==='quick-defense'){if(this.historyIsCurrent(state)&&this.root.contains(event.target)&&this.canQuickDefense?.())this.quickDefense?.(state);return;}
      if(command==='quick'){if(smallSkirmishInfo(state))this.act({type:'battleAuto'});return;}
      if(command==='next'){this.nextReady();return;}
      if(command==='cancel-retreat'){this.confirmRetreat=false;this.render();return;}
      if(command==='confirm'){this.fire();return;}
      if(command==='save'){this.save();return;}
      if(command==='auto'){this.act({type:'battleAuto'});return;}
      if(command==='end'){this.act({type:'battleEndTurn'});return;}
      if(command==='retreat'){this.clearPreview();this.historyOpen=false;if(this.confirmRetreat)this.act({type:'battleRetreat'});else{this.confirmRetreat=true;this.render();}return;}
      if(command==='brace'||command==='overwatch'){this.act({type:command==='brace'?'battleBrace':'battleOverwatch',unitId:this.selectedId});return;}
      if(command==='suppress'){if(this.aimId)this.act({type:'battleSuppress',unitId:this.selectedId,targetId:this.aimId});return;}
      if(command==='wait'){this.act({type:'battleWait',unitId:this.selectedId});return;}
      if(command==='skill'){
        this.historyOpen=false;
        if(this.skillMode){this.clearPreview();this.skillMode=false;this.render();return;}
        const options=this.getOptions(state,this.selectedId);if(!options.canSkill)return;
        const unit=battle.units.find(item=>item.id===this.selectedId);
        if(unit.kind==='guard'){this.act({type:'battleSkill',unitId:unit.id,targetId:unit.id});return;}
        this.clearPreview();this.skillMode=true;this.render();return;
      }
    }
    const turn=event.target.closest('[data-face]')?.dataset.face;
    if(turn!==undefined){this.act({type:'battleFace',unitId:this.selectedId,facing:Number(turn)});return;}
    const rosterId=event.target.closest('[data-battle-unit]')?.dataset.battleUnit;
    if(rosterId){
      const picked=battle.units.find(unit=>unit.id===rosterId&&unit.hp>0&&unit.side===battle.playerSide);
      if(picked){this.selectFriendly(picked);if(event.detail===0)this.focusWheel();}return;
    }
    if(!cellKey||battle.phase!=='player')return;
    this.historyOpen=false;this.confirmRetreat=false;this.wheelPage=null;
    const [x,y]=cellKey.split(',').map(Number),piece=battle.units.find(unit=>unit.hp>0&&unit.x===x&&unit.y===y);
    const options=this.selectedId?this.getOptions(state,this.selectedId):null;
    if(piece){
      const targets=this.skillMode?options?.skillTargets:options?.targets;
      const hit=targets?.find(target=>(target.targetId||target.unitId)===piece.id);
      if(hit){
        this.focusKey=null;this.aimId=piece.id;this.threatId=null;
        if(this.quickRepeat(state,cellKey,this.skillMode?'skill':'attack',event)){this.fire();return;}
      }else if(piece.side===battle.playerSide){
        this.selectFriendly(piece);if(event.detail===0)this.focusWheel();return;
      }else{
        const shown=this.threatId===piece.id;this.clearPreview();this.threatId=shown?null:piece.id;
      }
    }else{
      const canMove=!this.skillMode&&options?.moves?.some(cell=>cell.x===x&&cell.y===y);
      if(canMove&&this.quickRepeat(state,cellKey,'move',event)){this.act({type:'battleMove',unitId:this.selectedId,x,y});return;}
      if(!canMove)this.lastTap=null;
      this.aimId=null;this.threatId=null;this.focusKey=!canMove&&this.focusKey===cellKey?null:cellKey;
    }
    this.render();if(event.detail===0)this.focusWheel();
  }
}

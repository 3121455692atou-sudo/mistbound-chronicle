import {installCampaignUI,campaignBudgetHtml} from './campaign-ui.mjs?v=1118-1603';
import {C as CIVIC_COPY} from './campaign-copy.mjs?v=1118-1603';
import {F,feedbackText} from './feedback-copy.mjs?v=1118-1603';
import {walkable,waterOwner} from './waters.mjs?v=1118-1603';
import {getVassalCharacterQuote,getExpenseBreakdown,getFinanceBreakdown} from './engine.mjs?v=1118-1603';
import {feeDisclosureHtml,expenseDetailsHtml,installFeeDisclosure,financeLedgerHtml} from './finance-ui.mjs?v=1118-1603';
import {routeQuote,armyProfile,controlAt,roadRouteQuote,roadTileCost,ADVANCED_BUILDINGS,WONDERS,effectLines,mobilityOf} from './campaign.mjs?v=1118-1603'
import {shipSpeed,parkedPlanes} from './transport.mjs?v=1118-1603';
import {readStandDownNetGold,standDownNetIncomePreview,standDownNetIncomeReceipt,standDownNetIncomeHtml} from './standdown-net-income.mjs?v=1118-1603';
import {mentorGuidanceHtml,bindMentorGuidance} from './mentor-guidance.mjs?v=1118-1603';
import {createQuickDefense,quickDefenseReceiptHtml,quickDefenseReceiptSummary} from './quick-defense.mjs?v=1118-1603';
import {artPackPanel,bindArtPack} from './art-pack-ui.mjs?v=1118-1603';
import {checkpointPanelHtml,mountCheckpointPanel} from './checkpoint-panel.mjs?v=1118-1603';
import {recruitFoodNote,recruitIncomeReceipt} from './recruit-food-feedback.mjs?v=1118-1603';
import {staffingAdviceSteps} from './staffing-advice.mjs?v=1118-1603';
import {getRoadMarchAdvice} from './road-march-advice.mjs?v=1118-1603';
import { recruitReceiptText, recruitCapacityText } from './recruit-receipt.mjs?v=1118-1603';
import {recruitOdds,recruitPoolNote} from './recruit-ui.mjs?v=1118-1603';
import {fiscalReportHtml} from './fiscal-ui.mjs?v=1118-1603';
import {getSupply,SUPPLY_RULES,getMarchPlan,getMarchOrders,getMusterPlan,getMarchBudget,getCommandPlan,getPrisonPlan,getEdictQuote,getIncomeExtras,getTileExtras,getWarReasons,getPeaceTerms,getEnvoyQuote,getAnnexQuote,EDICTS,EDICT_SLOTS,COMMAND_RULES,DIPLOMACY_RULES,CAPTIVITY_RULES,getArmyMentorGuidance,getRegularGuard,getLiquidationQuote,createGame,perform,getActions,previewAttack,previewRaid,getStats,getTileStats,getBattleOptions,getBattleThreat,getBattleReach,getCaptiveActions,getCaptiveStatus,getFortStatus,getFortNetwork,getPostQuote,getRallyPlan,getUpgradeQuote,RULES_VERSION,getPendingEvent,getDialogueChoiceQuote,getStoryChoiceQuote,getStoryForfeitQuote,getCharacter,getBattleStatus,escapeRisk,serializeGame,deserializeGame,validateMod,getArmy,getRelation,getMarch,getRecruitQuote,getDevelopmentPlan,getRecoveryPlan,getSupplyQuote,getArmyTrainingQuote,getMilitaryQuote,getMilitaryStandDownPlan,getFiscalRecoveryPlan,MAX_SEATS,MARCH_BUDGET,MIGRANTS,GACHA,SAZAI_RANKS,STARTER_BANDS,techOf,researchQuote,TECHNOLOGIES,getPeaceDealQuote,getTreatyQuote,economyView,getShipVoyageQuote,shipRoute,SHIP_MODELS,AUTO_EXPLORE_MAX,autoExploreTarget,cityQuote,hasTech,citiesOf,DUTIES,dutyAt,dutyLine,getDutyQuote,getDutyPlan,getDutyCandidates,getIdleCharacters,EARTH,WORLD_STARTS,worldRegion,inWorld,worldCellOf} from './engine.mjs?v=1118-1603';
import {saveStamp,sameWorld,sameGameContent,hasUnbackedChanges,persistBrowserSave} from './save-storage.mjs?v=1118-1603';
import {fetchAccount,loginHref,logoutAccount,avatarUrl,cloudMeta,planSync,syncMarker,createCloudSync,sameStamp} from './account.mjs?v=1118-1603';
import {createClickThroughGuard} from './click-guard.mjs?v=1118-1603';
import {createTurnInput} from './turn-input.mjs?v=1118-1603';
import {fortLevelProfile} from './fortification.mjs?v=1118-1603';
import {getWorldDetails} from './world-details.mjs?v=1118-1603';
import {registerCapture} from './captivity.mjs?v=1118-1603';
import {getFrontlineReport,frontlineReportHtml} from './frontline.mjs?v=1118-1603';
import {TUTORIAL_LINES} from './tutorial.mjs?v=1118-1603';
import {morph} from './morph.mjs?v=1118-1603';
import {deckHtml,playPull} from './pull-show.mjs?v=1118-1603';
import {MAX_LEVEL,trainingLimitNote,STATS,RESERVED_STATS,RESERVED_SLOTS,POSTS,GIFTS,GIFT_COST,BOND_TIERS,PERK_LEVELS,bondTier,perkChoices,titlesOf,growthRate,traitsOf,quirkOf,QUIRKS,QUIRK_PLACES} from './growth.mjs?v=1118-1603';
import {loadDialogues,findDialogue,findEveryday} from './dialogue.mjs?v=1118-1603';
import {CHARACTER_DEFINITIONS,GROUPS,BUILDINGS} from './content.mjs?v=1118-1603';
import {voiceLine,teamLine} from './voices.mjs?v=1118-1603';
import {WorldMap,terrainThumb,terrainTop} from './map.mjs?v=1118-1603';
import {BattleUI} from './battle-ui.mjs?v=1118-1603';
import {icon,hydrateIcons} from './icons.mjs?v=1118-1603';
import {renderBondPage,bindBondInteractions} from './comic-bond.mjs?v=1118-1603';
import {bindViewAction} from './comic-model.mjs?v=1118-1603';
import {actionCost,disabledReason,departureReason,readyArmies,troopSelection,departureSelection,rareDepartureRequired,nextKey,fallbackPortrait,battleCoachText,battleCoachAdvances} from './ui-model.mjs?v=1118-1603';
import {tileExtensions,bondExtensions,captiveExtensions,sheetExtensions,registerTileAction,registerBondAction,registerCaptiveAction,registerSheetAction,listExtensions} from './extensions.mjs?v=1118-1603';

const $=id=>document.getElementById(id);
const isPhone=()=>window.innerWidth<=720;
const missingArt=new Set();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SAVE_KEY='mistbound.save.v2',TUTORIAL_KEY='mistbound.tutorial.v4';
let campaignUI;
let mapPick=null;
const rallyClickGuard=createClickThroughGuard();
for(const type of ['pointerdown','pointerup','click'])document.addEventListener(type,event=>{if(rallyClickGuard.block(event)){event.preventDefault();event.stopImmediatePropagation();}},true);
let deferredOfferIds=new Set();try{const saved=JSON.parse(localStorage.getItem(SAVE_KEY+'.deferred-offers')||'[]');if(Array.isArray(saved))deferredOfferIds=new Set(saved.filter(id=>typeof id==='string').slice(-64));}catch{}
const builtinPortraits=CHARACTER_DEFINITIONS.map(c=>c.id);
const RANK_GLOW={N:'#c9ced8',R:'#5aa9ff',SR:'#c77dff',SSR:'#ffc83d'};
const DIRECTIONS=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
let state,selectedKey='0,0',dispatchFrom=null,attackFrom=null,attackTroops=null,soundEnabled=(()=>{try{return localStorage.getItem('mistbound.sound')==='on';}catch{return false;}})(),audioContext=null,modalRefresh=null,uiBusy=false;
const freshTutorial=()=>({step:0,dismissed:false,coached:false,seenNotice:0,seenWar:0});
let tutorial=freshTutorial(),practice=null,lesson=null,realGame=false,coachIndex=null,reportItems=[],moveTroops=null,leftBehind=new Set(),newBand='togenashi',diploLines=null,findIndex=0;
let storageAvailable=true,showAllArmies=false;
// Discord account: logged-out players keep the save in this browser only; logged-in players also sync it to their account.
let account={login:false,user:null,ng:null},cloud=null,cloudMarker=null;
try {const stored=localStorage.getItem(SAVE_KEY);if(stored){const result=deserializeGame(stored);if(result.ok){state=result.state;realGame=true;}}const t=localStorage.getItem(TUTORIAL_KEY);if(t)tutorial={...freshTutorial(),...JSON.parse(t)};} catch {storageAvailable=false;}
state??=createGame('mistbound-dawn-01');
// A prior campaign could leave a cursor larger than this save's entire notice sequence.
if(tutorial.seenNotice>state.noticeSeq||tutorial.seenWar>state.noticeSeq){
  const liveTurn=state.turnContinuation?.startedTurn??state.turn-1;
  const earlier=Math.max(0,...(state.notices||[]).filter(n=>n.turn<liveTurn).map(n=>n.id));
  if(tutorial.seenNotice>state.noticeSeq)tutorial.seenNotice=earlier;
  if(tutorial.seenWar>state.noticeSeq)tutorial.seenWar=earlier;
}
let pendingExternalSave=null,saveProgress={mode:realGame?'full':'idle',savedState:realGame?state:null,storedStamp:realGame?saveStamp(state):null,exportedState:null,exportInitiatedState:null,alerted:false};
tutorial.dismissed=true; // Lessons only ever run in their own throwaway world.
hydrateIcons();
const worldMap=new WorldMap($('world-map'),{onSelect:selectTile,onSelectFlight:id=>{const flight=state.campaign.flights[id];if(!flight)return false;if(typeof mapPick!=='undefined'&&mapPick){selectTile(flight.key);return true;}if(flight.ownerId===state.playerId)return campaignUI.commandFlight(id);return false;},onBackground:()=>{if(typeof armyKey!=='undefined'&&armyKey)clearArmy();else if(dispatchFrom)cancelDispatch();else if(flowerOpen)closeFlower();},onView:view=>{placeFlower();placeMarkers();$('zoom').value=view.zoom;},quietRadius:()=>0,quietBox:()=>{const b=flowerBoxes();return b.length?{left:Math.min(...b.map(r=>r.left)),right:Math.max(...b.map(r=>r.right)),top:Math.min(...b.map(r=>r.top)),bottom:Math.max(...b.map(r=>r.bottom))}:null;},characterFace:id=>portraitUrl(state.characters[id],'smile'),armyFaces:key=>(state.tiles[key]?.field||[]).map(id=>portraitUrl(state.characters[id],'smile')).filter(Boolean),stationFaces:key=>(state.tiles[key]?.garrison||[]).map(id=>portraitUrl(state.characters[id],'smile')).filter(Boolean),dutyFace:key=>{const d=typeof dutyAt==='function'?dutyAt(state,key):null,c=d&&state.characters[d.id];return c?{url:portraitUrl(c,'smile'),mark:(DUTIES.find(x=>x.id===d.job)?.name||'差')[0]}:null},tileGirls:key=>{const t=state.tiles[key];if(!t||t.ownerId!==state.playerId)return [];const d=typeof dutyAt==='function'?dutyAt(state,key):null;return [...new Set([...(t.field||[]),...(t.garrison||[]),...(d?[d.id]:[])])].map(id=>portraitUrl(state.characters[id],'smile')).filter(Boolean);},onSelectArmy:key=>{if(typeof mapPick!=='undefined'&&mapPick){selectTile(key);return true;}const t=state.tiles[key];if(state.battle||t?.ownerId!==state.playerId||!t.field?.length)return false;if(armyKey===key&&!armyTarget){clearArmy();return true;}selectArmy(key);return true;},atWarWith:id=>state.relations?.[[state.playerId,id].sort().join('|')]?.status==='war',tileYield:key=>{const stats=getTileStats(state,key),v=stats?.total||stats;return v?{gold:v.gold,supply:v.supply}:null},tilePeople:key=>{const stats=getTileStats(state,key);return stats?{need:stats.need,housing:stats.housing,limit:typeof getSupply==='function'?getSupply(state,key).limit:100}:null},focusOffset:({width,height})=>isPhone()?{x:0,y:document.body.classList.contains('sheet-open')?-height*.22:0}:window.innerWidth<=1100?{x:-Math.min(150,width*.2),y:20}:{x:-30,y:24}});
for(const id of ['world-map','flower'])$(id)?.addEventListener?.('contextmenu',e=>{if(typeof armyKey!=='undefined'&&armyKey){e.preventDefault();clearArmy();}else if(dispatchFrom){e.preventDefault();cancelDispatch();}else if(flowerOpen){e.preventDefault();closeFlower();}});
const COACH=['b_move','b_attack','b_face','b_skill','b_flag','b_retreat'];
const quickDefense=createQuickDefense({getState:()=>state,dispatch:(action,onCommitted)=>runAction(action,{silent:true,onCommitted}),allowed:()=>!practice&&!lesson&&!$('modal').open&&$('title-screen').hidden&&!uiBusy&&!turnInput.busy,onReceipt:()=>renderReport()});
const battleUI=new BattleUI({getState:()=>state,quickDefense:shown=>{const result=quickDefense.run(shown);if(!result.ok)toast(result.error||'请查看当前战果。',true);},canQuickDefense:()=>quickDefense.available(),isSimulation:()=>Boolean(practice||lesson),dispatch:action=>runAction(action,{silent:true}),getOptions:getBattleOptions,getThreat:getBattleThreat,getReach:getBattleReach,getStatus:getBattleStatus,portrait:portraitUrl,notify:toast,say,sayTeam,pop,chatter:syncBattleChatter,save:()=>exportCurrentSave('battle'),
  coach:()=>coachIndex===null||!COACH[coachIndex]?null:{text:battleCoachText(COACH[coachIndex],getBattleOptions(state,battleUI.selectedId),TUTORIAL_LINES[COACH[coachIndex]]),index:coachIndex+1,total:COACH.length},
  onStart:()=>{if(practice||!tutorial.coached)coachIndex=0;warmList(state.battle.units.filter(unit=>unit.characterId).flatMap(unit=>['smile','cry','angry','happy'].map(expr=>portraitUrl(state.characters[unit.characterId],expr))));},
  onCoach:nextCoach,onAct:action=>{if(battleCoachAdvances(COACH[coachIndex],action,state.battle))nextCoach();}});
function nextCoach(){if(coachIndex===null)return;coachIndex++;if(!COACH[coachIndex]){coachIndex=null;tutorial.coached=true;saveAuto();}}
const format=n=>Number.isFinite(Number(n))?Math.round(Number(n)).toLocaleString('zh-CN'):'0';
/** Decoded images kept in memory, so anything shown twice is on screen at once. */
const imageCache=new Map();
function warm(url){
  if(!url)return null;
  if(imageCache.has(url))return imageCache.get(url);
  const image=new Image();image.onerror=()=>missingArt.add(url);image.src=url;imageCache.set(url,image);image.decode?.().catch(()=>{});
  return image;
}
function warmList(urls){
  const queue=[...new Set(urls)].filter(url=>url&&!imageCache.has(url));
  const step=()=>{for(let i=0;i<4&&queue.length;i++)warm(queue.shift());if(queue.length)(window.requestIdleCallback||setTimeout)(step);};
  step();
}
const EXPRESSIONS=['smile','happy','blush','cry','pout','sleepy','surprised','angry'];
function warmWorld(){
  const portrait=window.innerWidth<window.innerHeight;
  const leaders=Object.values(state.factions).filter(f=>f.alive&&!f.isPlayer).map(leaderOf).filter(Boolean);
  warmList([
    ...state.recruitedHeroIds.flatMap(id=>EXPRESSIONS.map(expr=>portraitUrl(state.characters[id],expr))),
    ...leaders.flatMap(hero=>['smile','happy','angry'].map(expr=>portraitUrl(hero,expr))),
    'assets/sazai.webp',
    ...['hall','war','study','town','field','cell','tavern','stage'].map(id=>`assets/bg/${id}-${portrait?'t':'w'}.webp`),
  ]);
}
function portraitUrl(hero,expr='smile'){
  if(!hero)return fallbackPortrait('军士');
  if(builtinPortraits.includes(hero.id)){const url=`assets/portraits/${hero.id}/${expr}.webp`;return missingArt.has(url)?fallbackPortrait(hero.name,hero.color):url;}
  const p=hero.portrait||'';
  if(/^(?:https?:\/\/|\.?\/?assets\/)[^<>]*$/i.test(p))return p;
  return fallbackPortrait(hero.name,hero.color);
}
const recentPulls=[];
function heroIcon(id){return ({mygo:'compass',mujica:'moon',kessoku:'sun',togenashi:'flame',sumimi:'spark'})[state.characters[id]?.group]||'crest';}
function terrainIcon(t){const s=(t?.id||'')+' '+(t?.name||'')+' '+(t?.icon||'');if(/forest|woods|grove|林|森/i.test(s))return 'forest';if(/water|sea|ocean|river|lake|coast|海|湖|河|浅滩/i.test(s))return 'water';if(/mountain|hill|peak|高地|山|丘/i.test(s))return 'mountain';if(/snow|tundra|ice|雪|冻/i.test(s))return 'snow';if(/ruin|遗|城/i.test(s))return 'castle';if(/swamp|marsh|湿|沼/i.test(s))return 'leaf';if(/mine|矿|crystal/i.test(s))return 'mine';return 'wheat';}
function buildingArt(id,isCapital=false){const key=id==='garden'?'farm':id&&['camp','capital','farm','fort','home','lumber','mine','port','quarry','city','shipyard','airfield','administrativeHall','workshop','factory','bank','centralBank','wonder','hangingGardens','greatLibrary','grandBazaar','greatLighthouse','ironCitadel','starStage'].includes(id)?id:isCapital?'capital':'home';return `assets/buildings/${key.toLowerCase()}.webp`;}
function neighbors(key){const t=state.tiles[key];return t?DIRECTIONS.map(([dq,dr])=>`${t.q+dq},${t.r+dr}`).filter(k=>state.tiles[k]):[];}
function capitalKey(){return Object.values(state.tiles).find(t=>t.ownerId===state.playerId&&t.isCapital)?.key||Object.values(state.tiles).find(t=>t.ownerId===state.playerId)?.key||'0,0';}
function currentHero(){return state.characters[state.activeHeroId]||null;}
function chronicleEntries(){return (state.logs||[]).filter(item=>item.npcOnly!==true).reverse();}
function saveAuto({forceFull=false}={}){
  if(practice||lesson||!realGame)return;
  if(pendingExternalSave){renderSaveStatus();return {ok:false,mode:'conflict'};}
  const result=persistBrowserSave(state,{getStorage:()=>localStorage,saveKey:SAVE_KEY,tutorialKey:TUTORIAL_KEY,tutorial,preferCompact:saveProgress.mode==='compact'&&!forceFull});
  storageAvailable=result.ok;saveProgress.mode=result.mode;
  if(result.ok){saveProgress.savedState=state;saveProgress.storedStamp=result.stamp;saveProgress.alerted=false;if(typeof cloudDirty==='function'&&cloudDirty())cloud.schedule(cloudPayload);}
  else if(!saveProgress.alerted){saveProgress.alerted=true;toast('自动保存失败，进度仍在当前页面。请导出存档或重试保存，先不要关闭页面。',true);}
  renderSaveStatus();return result;
}
/* Discord account (account.mjs). Not logged in: the save stays in this browser only, as always.
   Logged in: the same save also syncs to the player's account on the VPS (game "sfw", slot "auto"). */
const DISCORD_MARK='<svg class="discord-mark" viewBox="0 0 127.14 96.36" aria-hidden="true"><path fill="currentColor" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>';
const CLOUD_WORDS={idle:'云存档',pending:'等待同步',saving:'同步中…',synced:'云存档已同步',error:'同步失败，稍后自动重试',conflict:'云端有另一份进度','signed-out':'登录已过期，请重新登录'};
const agoText=at=>{const m=Math.round((Date.now()-Number(at))/60000);return !(m>=0)?'':m<1?'刚刚':m<60?`${m} 分钟前`:m<1440?`${Math.round(m/60)} 小时前`:`${Math.round(m/1440)} 天前`;};
const flushCloud=(ms=1500)=>cloud?Promise.race([cloud.flush(),new Promise(r=>setTimeout(r,ms))]):Promise.resolve();
/** Whether this browser's game moved on since it last agreed with the cloud. */
function cloudDirty(){
  if(typeof cloud==='undefined'||!cloud||typeof account==='undefined'||!account.user||!realGame||practice||lesson)return false;
  const mark=cloudMarker?.read();return !(mark&&mark.updatedAt===cloud.sync.updatedAt&&sameStamp(saveStamp(state),mark.stamp));
}
/** The compact copy (no undo history) that goes to the cloud, or null when there is nothing new. */
function cloudPayload(){return cloudDirty()?{data:JSON.stringify({...state,history:[],historyTrimmed:true}),meta:cloudMeta(state)}:null;}
async function initAccount(){
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')cloud?.flush();});
  addEventListener('pagehide',()=>{cloud?.flush();});
  account=await fetchAccount();
  if(account.user){let store=null;try{store=localStorage;}catch{}cloudMarker=syncMarker(store,account.user.id);cloud=createCloudSync({onChange:onCloudChange,onSaved:(updatedAt,meta)=>cloudMarker.write(updatedAt,meta)});}
  renderAccount();
  if(cloud)await reconcileCloud();
}
function onCloudChange(sync){renderAccount();if(sync.status==='conflict'&&!sync.held)toast('这个账号在别处存过另一份进度，打开菜单选择保留哪份。',true);}
/** At login: upload, download or ask, three-way against what this browser last agreed with the cloud. */
async function reconcileCloud(){
  const remote=await cloud.remote();if(!remote.ok){renderAccount();return;}
  const save=remote.save,local=realGame&&!practice&&!lesson?saveStamp(state):null,plan=planSync(save,local,cloudMarker.read());
  if(plan==='same'){cloud.settle(save?.updatedAt??null);if(save)cloudMarker.write(save.updatedAt,save.meta);return;}
  if(plan==='push'){cloud.settle(save?.updatedAt??null);cloud.schedule(cloudPayload);return cloud.flush();}
  // Taking the cloud game silently is fine while the title screen is up; mid-game the player decides.
  if(plan==='pull'&&(!local||(!$('title-screen').hidden&&!$('modal').open)))return pullCloud(save);
  askCloud(save,local);
}
async function pullCloud(save){
  const got=await cloud.download(),result=got.ok?deserializeGame(got.data):null;
  if(!result?.ok){toast('暂时读不到云端存档，先用这台设备的进度。',true);cloud.hold(save);return;}
  cloudMarker.write(got.updatedAt,got.meta);cloud.settle(got.updatedAt);
  const next=result.state;pendingExternalSave=null;modalRefresh=null;sceneInBattle=false;if($('modal').open)$('modal').close();
  quickDefense.clear();state=next;realGame=true;selectedKey=capitalKey();dispatchFrom=null;attackFrom=null;attackTroops=null;moveTroops=null;leftBehind=new Set();if(typeof armyKey!=='undefined'){armyKey=null;armyTarget=null;worldMap.setArmy?.(null);worldMap.setRoute?.(null);}flowerOpen=false;reportItems=[];dialogueQueue.length=0;seenLevelSeq=state.levelSeq||0;
  tutorial.seenNotice=Math.max(0,...(state.notices||[]).filter(n=>n.turn<(state.turnContinuation?.startedTurn??Infinity)).map(n=>n.id));tutorial.seenWar=tutorial.seenNotice;saveProgress.exportedState=null;saveProgress.exportInitiatedState=null;
  saveAuto();render();worldMap.centerOn(selectedKey);toast(`已载入云端存档 · 第 ${state.turn} 回合`);
  if(!$('title-screen').hidden)showMenu();
}
function askCloud(save,local){
  cloud.hold(save);
  const line=(m,note)=>`第 ${m?.turn||0} 回合${note?`<small>${note}</small>`:''}`;
  openReading('云存档','选一份继续',`<p class="modal-intro">你的账号在云端存着另一份进度。选中的那份会留在这里和云端，另一份会被替换。</p><div class="cloud-pick"><button class="small-button" id="cloud-take" type="button">${icon('download')}<span>用云端的 · ${line(save?.meta,agoText(save?.meta?.savedAt))}</span></button><button class="small-button secondary" id="cloud-keep" type="button">${icon('upload')}<span>用这台设备的 · ${line(local,'会覆盖云端')}</span></button></div><p class="form-hint">拿不准的话，先在菜单里导出这台设备的存档。</p>`,()=>{
    $('cloud-take').onclick=()=>{closeModal();pullCloud(save);};
    $('cloud-keep').onclick=()=>{closeModal();cloud.settle(save?.updatedAt??null);cloud.schedule(cloudPayload);cloud.flush();};
  });
}
async function signOut(){
  await flushCloud();cloud?.stop();cloud=null;cloudMarker=null;
  await logoutAccount();account=await fetchAccount();renderAccount();
  toast('已退出登录。之后的进度只存在这个浏览器里。');
}
function accountFace(user){return `<img class="acct-face" src="${esc(avatarUrl(user,64))}" alt="" referrerpolicy="no-referrer" />`;}
function saveAccountHtml(){
  if(typeof account==='undefined'||!account.user)return '';
  const s=cloud?.sync,conflict=s?.status==='conflict';
  return `<div class="save-account">${accountFace(account.user)}<span class="acct-who"><b>${esc(account.user.name)}</b><small>${esc(CLOUD_WORDS[s?.status||'idle'])}${s?.updatedAt&&!conflict&&s.status==='synced'?` · ${agoText(s.updatedAt)}`:''}</small></span>${conflict?`<button class="small-button" id="save-cloud-pick" type="button">选择保留哪份</button>`:''}${account.ng?`<a class="small-button secondary acct-go" data-acct-go href="${esc(account.ng)}">前往 NG 版</a>`:''}<button class="acct-out" data-acct-out type="button">退出登录</button></div>`;
}
function renderAccount(){
  if(typeof account==='undefined')return;
  const box=$('title-account');
  if(box){
    if(account.user)morph(box,`<div class="acct">${accountFace(account.user)}<span class="acct-who"><b>${esc(account.user.name)}</b><small>${esc(CLOUD_WORDS[cloud?.sync.status||'idle'])}</small></span>${account.ng?`<a class="acct-go" data-acct-go href="${esc(account.ng)}">前往 NG 版</a>`:''}<button class="acct-out" data-acct-out type="button">退出</button></div>`);
    else if(account.login)morph(box,`<a class="discord-login" href="${loginHref()}">${DISCORD_MARK}<span>Discord 登录</span></a>`);
    box.hidden=!account.user&&!account.login;
  }
  const slot=$('save-account-slot');if(slot)morph(slot,saveAccountHtml());
  document.querySelectorAll('[data-acct-out]').forEach(button=>{button.onclick=signOut;});
  document.querySelectorAll('[data-acct-go]').forEach(link=>{link.onclick=event=>{event.preventDefault();flushCloud().then(()=>{location.href=account.ng;});};});
  const pick=$('save-cloud-pick');if(pick)pick.onclick=()=>{const current=cloud?.sync.conflict;if(current)askCloud(current,realGame?saveStamp(state):null);};
}
function renderSaveStatus(){
  const box=$('save-warning');if(!box)return;
  const failed=saveProgress.mode==='failed',conflict=Boolean(pendingExternalSave),compact=saveProgress.mode==='compact';
  box.hidden=!realGame||Boolean(practice||lesson)||(!failed&&!conflict&&!compact);if(box.hidden)return;
  const host=$('modal').open?$('modal'):document.body;if(box.parentElement!==host)host.append(box);
  box.classList.toggle('in-dialog',$('modal').open);box.classList.toggle('save-danger',failed||conflict);
  const old=saveProgress.storedStamp,oldText=old?(sameWorld(old,state)?`浏览器上次成功保存：第 ${old.turn} 回合，修订 ${old.revision}。`:'浏览器仍保存着另一份旧战局。'):'本页进度还没有成功保存在浏览器中。';
  const title=conflict?'另一窗口的存档与本页不同':failed?'自动保存失败':'已保存精简副本';
  const explanation=conflict?'为避免覆盖，本页已暂停自动保存。可以先导出本页，再选择保留哪份战局。':failed?`${oldText}当前进度仍在页面中，请先保留备份。`:'浏览器空间不足，副本暂不含撤销记录；当前页面的撤销记录仍保留。完整导出可保留全部记录。';
  morph(box,`<div><b>${title}</b><p>${esc(explanation)}</p>${saveProgress.exportInitiatedState===state?`<p>已发起下载。请确认文件确实保存后，再标记备份完成。</p>`:''}</div><div class="save-warning-actions"><button id="save-warning-export">导出本页</button><button id="save-warning-retry">${conflict?'用本页覆盖浏览器':'重试完整保存'}</button>${conflict?'<button id="save-warning-load">放弃本页并载入另一窗口</button>':''}${saveProgress.exportInitiatedState===state&&saveProgress.exportedState!==state?'<button id="save-warning-confirm-export">我已确认文件保存</button>':''}</div>`);
  $('save-warning-export').onclick=()=>exportCurrentSave();$('save-warning-retry').onclick=()=>{pendingExternalSave=null;saveAuto({forceFull:true});};
  if($('save-warning-load'))$('save-warning-load').onclick=()=>applyExternalSave(pendingExternalSave);
  if($('save-warning-confirm-export'))$('save-warning-confirm-export').onclick=confirmExportBackup;
}
function exportCurrentSave(kind='turn'){
  try{download(`mistbound-${kind}-${state.turn}.json`,serializeGame(state));saveProgress.exportInitiatedState=state;renderSaveStatus();toast('已发起存档下载，请确认文件已保存。');return true;}
  catch(error){toast('导出未完成：'+error.message,true);return false;}
}
function confirmExportBackup(){if(saveProgress.exportInitiatedState!==state)return false;saveProgress.exportedState=state;renderSaveStatus();toast('已记下本次文件备份；后续操作仍需要重新保存。');return true;}
function applyExternalSave(next){
  if(!next)return;pendingExternalSave=null;modalRefresh=null;sceneInBattle=false;if($('modal').open)$('modal').close();
  quickDefense.clear();state=next;realGame=true;selectedKey=capitalKey();dispatchFrom=null;attackFrom=null;attackTroops=null;moveTroops=null;leftBehind=new Set();if(typeof armyKey!=='undefined'){armyKey=null;armyTarget=null;worldMap.setArmy?.(null);worldMap.setRoute?.(null);}flowerOpen=false;reportItems=[];dialogueQueue.length=0;seenLevelSeq=state.levelSeq||0;
  tutorial.seenNotice=Math.max(0,...(state.notices||[]).filter(n=>n.turn<(state.turnContinuation?.startedTurn??Infinity)).map(n=>n.id));tutorial.seenWar=tutorial.seenNotice;
  storageAvailable=true;saveProgress={mode:state.historyTrimmed?'compact':'full',savedState:state,storedStamp:saveStamp(state),exportedState:null,exportInitiatedState:null,alerted:false};
  render();worldMap.centerOn(selectedKey);toast('已载入另一窗口保存的战局。');
}
function receiveExternalSave(event){
  if(event.key!==SAVE_KEY||!event.newValue||practice||lesson||!realGame)return;
  const result=deserializeGame(event.newValue);if(!result.ok)return;const next=result.state;
  if(sameGameContent(next,state)){pendingExternalSave=null;storageAvailable=true;saveProgress.savedState=state;saveProgress.storedStamp=saveStamp(next);saveProgress.mode=next.historyTrimmed?'compact':'full';saveProgress.alerted=false;renderSaveStatus();return;}
  if(!sameWorld(next,state)||(next.revision||0)<=(state.revision||0)||hasUnbackedChanges(state,{realGame,practice,lesson,...saveProgress})){
    pendingExternalSave=next;saveProgress.savedState=null;saveProgress.storedStamp=saveStamp(next);renderSaveStatus();return;
  }
  applyExternalSave(next);
}
window.addEventListener('storage',receiveExternalSave);
window.addEventListener('beforeunload',event=>{if(hasUnbackedChanges(state,{realGame,practice,lesson,...saveProgress})){event.preventDefault();event.returnValue='';}});
function toast(message,error=false){const box=$('toast-container');const host=$('modal').open?$('modal'):document.body;if(box.parentElement!==host)host.append(box);box.classList.toggle('in-dialog',$('modal').open);while(box.children.length>=2)box.firstChild.remove();const el=document.createElement('div');el.className='toast'+(error?'':' info');el.textContent=message;$('toast-container').append(el);setTimeout(()=>{el.classList.add('fade');setTimeout(()=>el.remove(),300)},error?5000:3300);}
const TONES={action:[440,587.33],turn:[293.66,369.99,440],battle:[164.81,220],deal:[261.63],flip:[659.25],rare:[523.25,659.25,783.99],ssr:[523.25,659.25,783.99,1046.5],meet:[392,523.25,659.25,783.99,1046.5]};
function sound(type='action'){
  if(!soundEnabled)return;
  try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();const now=audioContext.currentTime;const tones=TONES[type]||TONES.action;tones.forEach((frequency,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=frequency;o.connect(g);g.connect(audioContext.destination);g.gain.setValueAtTime(0,now+i*.08);g.gain.linearRampToValueAtTime(.035,now+i*.08+.015);g.gain.exponentialRampToValueAtTime(.001,now+i*.08+.35);o.start(now+i*.08);o.stop(now+i*.08+.36)});}catch{}
}
let pullSerial=0,barkTimer=null,bubbleSerial=0,idleTimer=null,lastBark=0,moodExpr=null,flowerOpen=false,cardSpot='',lastTicker='',lastRes={gold:null,supply:null},hintLine=null;
// A dismiss can move focus. Fence a held Enter/Space through its release, just as
// world settlement does, without queuing any game action or changing world busy UI.
const chatterDismissInput=createTurnInput({afterPaint:run=>run()});
const chatterClickGuard=createClickThroughGuard(),chatterPressedPointers=new Set(),chatterBlockedPointers=new Set(),chatterReleasedPointers=new Set();
const SEASONS=['春','夏','秋','冬'];
function guardChatterPointer(event){
  const id=event.pointerId??'mouse';
  if(event.type==='pointerdown'){chatterReleasedPointers.delete(id);chatterBlockedPointers.delete(id);chatterPressedPointers.delete(id);if($('bubble').contains(event.target))chatterPressedPointers.add(id);}
  else if(event.type==='pointercancel'){chatterPressedPointers.delete(id);chatterBlockedPointers.delete(id);chatterReleasedPointers.delete(id);}
  else if(event.type==='pointerup'){
    chatterPressedPointers.delete(id);
    if(chatterBlockedPointers.delete(id)){chatterReleasedPointers.add(id);return true;}
  }else if(event.type==='click'&&event.detail>0){
    const held=chatterReleasedPointers.delete(id);
    if(held)return true;
  }
  return chatterClickGuard.block(event);
}
function updateChatterSpace(){battleUI.root?.classList.toggle('has-chatter',Boolean(state.battle&&!$('speech-layer').hidden&&!$('bubble').hidden));}
function dismissBubble(event){
  const box=$('bubble');if(box.hidden)return false;
  const focused=box.contains(document.activeElement);
  const dismiss=()=>{for(const id of chatterPressedPointers)chatterBlockedPointers.add(id);chatterClickGuard.arm(event,box.getBoundingClientRect?.());box.hidden=true;updateChatterSpace();if(focused&&state.battle)battleUI.focusAfterChatter();};
  if(focused||event)return chatterDismissInput.request(dismiss,event);
  dismiss();return true;
}
function syncBattleChatter({active,blocked=false,result=false,dock=null,root}){
  const layer=$('speech-layer'),copy=$('bubble-copy');
  layer.hidden=active&&blocked;layer.dataset.result=String(active&&result);
  if(active){
    root.setAttribute('aria-owns','speech-layer');copy.setAttribute('tabindex','0');
    if(dock)for(const [key,value] of Object.entries(dock))layer.style.setProperty(`--battle-chatter-${key}`,`${value}px`);
  }else{
    root.removeAttribute('aria-owns');copy.removeAttribute('tabindex');
    for(const key of ['bottom','left','right'])layer.style.removeProperty(`--battle-chatter-${key}`);
  }
  updateChatterSpace();
}
/** Shows one line. Sazai never speak, and frequent actions do not cut off a line still being read. */
function speak(id,line,important=false){
  const hero=state.characters[id];
  if(!hero||!line)return false;
  // Lessons get the balloon to themselves; idle chatter waits.
  if(lessonRunning()||coachIndex!==null)return false;
  const now=Date.now();
  if(!important&&now-lastBark<2600)return false;
  lastBark=now;
  showBubble(hero,line);
  const spokenBubble=bubbleSerial;
  if(id===state.activeHeroId){moodExpr=line.expr;setLeaderImage();}
  clearTimeout(barkTimer);
  const timer=setTimeout(()=>{
    // A queued old timer must not clear replacement speech or its expression.
    if(barkTimer!==timer)return;
    barkTimer=null;moodExpr=null;setLeaderImage();
    if(bubbleSerial!==spokenBubble)return;
    // Battle hides world hints, but ordinary speech still has a finite lifetime.
    if(state.battle)dismissBubble();else showHint();
  },Math.max(3600,line.text.length*170));
  barkTimer=timer;
  return true;
}
function showBubble(hero,line,hint=false){
  const box=$('bubble'),own=hero?.id===state.activeHeroId,face=!own&&hero?portraitUrl(hero,line.expr||'smile'):null;
  bubbleSerial++;
  // Saying the same thing again must not make the balloon jump.
  const said=`${hero?.id}|${line.text}|${hint}`;
  if(!box.hidden&&box.dataset.said===said)return;
  box.dataset.said=said;
  box.hidden=false;box.className=`bubble ${hint?'hint':''}`;void box.offsetWidth;box.classList.add('pop');
  const copy=$('bubble-copy');copy.scrollTop=0;
  copy.innerHTML=`${face?`<span class="face"><img src="${esc(face)}" alt="" /></span>`:''}${hero?`<b${own?' class="bubble-own-speaker"':''}>${esc(hero.name)}</b>`:''}<p>${esc(line.text)}</p>${hint?(guideNow()?.info?'<small>点这里继续</small>':lessonRunning()?'':'<small>点气泡收起提示</small>'):''}`;
  updateChatterSpace();
}
function showHint(){
  if(state.battle)return;
  if(!currentHero()||(flowerOpen&&!dispatchFrom)||(typeof armyKey!=='undefined'&&armyKey)){$('bubble').hidden=true;return;}
  const hero=currentHero();
  if(dispatchFrom&&!hintLine){$('bubble').hidden=true;return;}
  if(hintLine){showBubble(hero,{text:hintLine,expr:'smile'},true);return;}
  $('bubble').hidden=true;
}
function say(id,trigger,important=false){return speak(id,voiceLine(id,trigger),important);}
function sayTeam(ids){const line=teamLine(ids);return line?speak(line.id,line,true):false;}
function speaker(){const ids=state.recruitedHeroIds.filter(id=>state.characterOwners[id]===state.playerId&&!state.captives[id]);if(state.activeHeroId&&Math.random()<.65)return state.activeHeroId;return ids[Math.floor(Math.random()*ids.length)]||null;}
function nudgeIdle(){clearTimeout(idleTimer);idleTimer=setTimeout(()=>{if(!state.battle&&!$('modal').open&&!document.hidden)say(speaker(),'idle');nudgeIdle();},45000);}
for(const type of ['pointerdown','keydown'])document.addEventListener(type,nudgeIdle,{passive:true});

function pop(x,y,text,cls='',delay=0){
  const el=document.createElement('span');el.className=`pop-word ${cls}`;el.textContent=text;el.style.left=x+'px';el.style.top=y+'px';el.style.animationDelay=delay+'ms';
  $('pops').append(el);setTimeout(()=>el.remove(),1000+delay);
}
function popTile(key,text,cls,delay){const p=worldMap.screenOf(key);if(p)pop(p.x,p.y-12,text,cls,delay);}
function setCount(id,value){
  const el=$(id),to=Number(value);el.dataset.v=to;el.textContent=format(to);
}
function setLeaderImage(){
  const hero=currentHero(),img=$('leader-portrait'),src=hero?portraitUrl(hero,moodExpr||'smile'):'assets/sazai.webp';
  $('leader').classList.toggle('sazai',!hero);
  // Swap only once the new face is decoded, so the old one never drops out.
  if(src&&img.dataset.want!==src){
    img.dataset.want=src;
    const next=warm(src),swap=()=>{if(img.dataset.want===src)img.src=missingArt.has(src)?fallbackPortrait(hero?.name||'军士',hero?.color):src;};
    if(next.complete&&next.naturalWidth)swap();else (next.decode?.()||Promise.resolve()).then(swap,swap);
  }
  img.style.display=src?'block':'none';
}
const hudFold={lever:null,goals:false,ledger:false,rail:false};
const LAYER_LABELS={terrain:'地貌',force:'军情',people:'人口',yield:'收益',political:'疆域',diplomacy:'外交',control:'控制力'};
function syncHudFold(){
  if(typeof document==='undefined')return;
  const tools=document.querySelector('.view-tools'),btn=$('lever-toggle'),lbl=$('lever-label'),caret=$('lever-caret');
  const forceOpen=Boolean(typeof lesson!=='undefined'&&lesson&&!tutorial.dismissed&&GUIDE[tutorial.step]?.id==='adv_layer');
  const leverFolded=forceOpen?false:(hudFold.lever===null?isPhone():hudFold.lever);
  if(tools)tools.classList.toggle('folded',leverFolded);
  if(btn)btn.setAttribute('aria-expanded',String(!leverFolded));
  if(lbl){const cur=document.querySelector('#lever [data-layer].active')?.dataset?.layer||'terrain';lbl.textContent=leverFolded?`地图 · ${LAYER_LABELS[cur]||'地貌'}`:'收起图层';}
  if(caret)caret.textContent=leverFolded?'▾':'▴';
  const ledgerEl=$('ledger'),ledgerBtn=$('fold-ledger');
  if(ledgerEl)ledgerEl.classList.toggle('folded',hudFold.ledger);
  if(ledgerBtn){ledgerBtn.setAttribute('aria-expanded',String(!hudFold.ledger));ledgerBtn.textContent=hudFold.ledger?'▾':'▴';ledgerBtn.title=hudFold.ledger?'展开国库明细':'收起国库明细';}
}
function render(){
  if(state.battle&&$('bubble').classList.contains('hint'))$('bubble').hidden=true;
  syncHudFold();
  const stats=getStats(state),hero=currentHero(),progress=stats.progress;
  $('leader-name').textContent=hero?.name||'罪袋';$('leader-title').textContent=hero?'领军':'代为看家';setLeaderImage();
  setCount('gold-value',stats.gold);setCount('supply-value',stats.supply);
  for(const [id,gain,value] of [['gold',stats.income.gold,stats.gold],['supply',stats.income.supply,stats.supply]]){
    const el=$(id+'-delta');el.textContent=(gain>=0?'+':'')+format(gain);el.title=`毛收入 ${format(gain+(stats.maintenance?.[id]||0))} − 支出 ${format(stats.maintenance?.[id]||0)}`;el.classList.toggle('down',gain<0);$(id+'-after').textContent=format(Math.max(0,value+gain));
  }
  morph($('census'),`<span>领土 <b>${stats.territories}</b></span><span>罪袋 <b>${format(stats.troops)}</b></span>${stats.sazai.R+stats.sazai.SR+stats.sazai.SSR?`<button class="census-rare" id="locate-rare" title="点一下跳到有稀有罪袋的地块，再点看下一处">稀有 <b>${stats.sazai.R+stats.sazai.SR+stats.sazai.SSR}</b></button>`:'<span>稀有 <b>0</b></span>'}<span>同伴 <b>${stats.party.availableIds.length}</b></span>${stats.cutOff?`<span class="alarm">失联 ${stats.cutOff} 地</span>`:''}${stats.capitalBare?'<span class="alarm">首都没有同伴</span>':''}`);
  if($('locate-rare'))$('locate-rare').onclick=()=>{if(typeof campaignUI!=='undefined'&&campaignUI)campaignUI.locateSazai();};
  const graceUntil=state.factions[state.playerId]?.graceUntilTurn||0;
  const plans=[...progress.plans].sort((x,y)=>y.current/Math.max(1,y.target)-x.current/Math.max(1,x.target));
  const guided=guideNow(),step=lesson?GUIDE[tutorial.step]:null;
  const goalsFolded=!step&&hudFold.goals;
  $('goals').classList.toggle('folded',goalsFolded);
  morph($('goals'),step?`<h3>${lesson?.advanced?'进阶教程':'新手教程'} ${tutorial.step+1}/${GUIDE.length}<button id="skip-quest">退出教程</button></h3><p class="quest"><b>${esc(step.title)}</b></p>${guided?`<p class="order" id="guide-order">${esc(guided.order)}</p>`:''}${guided?.info?'<button class="small-button" id="guide-next">下一步</button>':''}${step.id==='practice'?'<button class="small-button" id="quest-practice">开始模拟战</button>':''}${step.done?'<button class="small-button" id="quest-done">结束教程</button>':''}`:goalsFolded?`<button type="button" class="goals-folded-btn" id="fold-goals" aria-expanded="false" title="展开本话目标"><b>第 ${progress.chapter} 话</b><span>${plans[0]?`${format(plans[0].current)}/${format(plans[0].target)}`:''}</span><i>▾</i></button>`:`<h3>第 ${progress.chapter} 话<button id="show-objectives">全部目标</button><button type="button" class="hud-fold goals-fold" id="fold-goals" aria-expanded="true" aria-label="收起本话目标" title="收起目标">▴</button></h3><ul>${plans.slice(0,2).map(p=>`<li style="--p:${Math.min(100,p.current/Math.max(1,p.target)*100)}%"><span>${esc(p.label)}</span><span>${format(p.current)}/${format(p.target)}</span></li>`).join('')}</ul><p>${graceUntil>state.turn?`<b>第 ${graceUntil} 回合起可能开战</b> · `:''}第 ${progress.nextWorldEventTurn} 回合世界演变</p>`);
  if($('show-objectives'))$('show-objectives').onclick=showProgress;
  if($('fold-goals'))$('fold-goals').onclick=()=>{hudFold.goals=!hudFold.goals;render();if(typeof stackRightHud==='function')stackRightHud();if(typeof duckPanels==='function')duckPanels();};
  if($('skip-quest'))$('skip-quest').onclick=e=>{if(e.currentTarget.dataset.sure){endTutorial();return;}e.currentTarget.dataset.sure='1';e.currentTarget.textContent='再点一次退出';};
  if($('quest-practice'))$('quest-practice').onclick=startPractice;
  if($('quest-done'))$('quest-done').onclick=endTutorial;
  if($('guide-next'))$('guide-next').onclick=nextInfo;
  $('turn-hint').hidden=!(state.ap<=0&&!state.battle&&!guided);
  const freeArmies=Object.values(state.tiles).filter(t=>t.ownerId===state.playerId&&t.field?.length&&!departureReason(state,t)).length;morph($('turn-hint'),`<b>指令用完了</b><span>${freeArmies?`还有 ${freeArmies} 支编队能行军（行军不花指令）· `:''}点这里进入下一回合</span>`);
  renderRail();
  renderReport();
  const latest=chronicleEntries()[0]?.text||'';
  if(latest!==lastTicker){lastTicker=latest;const t=$('ticker');t.textContent=latest;t.classList.remove('flash');void t.offsetWidth;t.classList.add('flash');}
  renderDial();if(typeof renderLeftExplore==='function')renderLeftExplore();if($('world-overview'))$('world-overview').hidden=!state.world;if(typeof peopleLegend==='function')peopleLegend();
  $('nav-heroes').classList.toggle('alert',state.recruitedHeroIds.some(id=>getCharacter(state,id)?.pending?.length));
  $('undo').disabled=!stats.canUndo;
  renderGovernanceEntry(stats);
  document.body.classList.toggle('ap-empty',state.ap<=0);document.body.classList.toggle('lesson',Boolean(lesson)&&!tutorial.dismissed);
  worldMap.setHints(mapHints());worldMap.setState(state);worldMap.setUpgradable(upgradableKeys());worldMap.setDiplomacy(diplomacyColors());worldMap.select(flowerOpen?selectedKey:null);
  if(typeof getMarchOrders==='function'){worldMap.setOrders?.(getMarchOrders(state));worldMap.setCalm?.(Object.values(state.tiles).filter(t=>t.ownerId===state.playerId&&t.building).length>=10);}
  renderCommandBar();
  renderSaveStatus();
  renderPurse();
  renderTutorial();
  renderFlower();
  if(typeof renderArmy==='function'){worldMap.setArmy?.(armyTile()?armyKey:null);renderArmy();}
  if(state.battle&&$('modal').open&&!sceneInBattle)closeModal();
  battleUI.render();
  if($('modal').open&&modalRefresh&&!state.battle)modalRefresh();
  queueMicrotask(nextOverlay);
}
function renderDial(){
  const n=state.maxAP,C=2*Math.PI*62,gap=10,len=C/n-gap;
  morph($('end-turn'),`<svg class="ring" viewBox="0 0 142 142">${Array.from({length:n},(_,i)=>`<circle class="seg ${i<state.ap?'on':''}" cx="71" cy="71" r="62" stroke-dasharray="${len} ${C-len}" stroke-dashoffset="${-i*C/n-gap/2}" />`).join('')}</svg><span class="core">${state.ap>0?`<small>${SEASONS[Math.floor((state.turn-1)/4)%4]}季 · 回合</small><b>${state.turn}</b><em>余 ${state.ap} 令</em>`:`<small>第 ${state.turn} 回合</small><b class="next">下一回合</b><em>点这里</em>`}</span>`);
}
/** 余令去探索: a switch beside the dial. On, the commands still left when the turn ends go into the fog (nearest the capital first). */
function renderLeftExplore(){
  const b=$('left-explore');if(!b)return;
  const on=Boolean(state.management?.exploreLeft),show=state.ap>0&&!state.battle&&!state.turnContinuation&&!lesson&&!practice;
  b.hidden=!show;if(!show)return;
  b.setAttribute('aria-checked',String(on));
  b.title=on?`开着：点圆盘结束回合时，剩下的 ${state.ap} 令会自动探索迷雾，先探离首都近的。点一下关掉。`:'关着：结束回合时剩下的指令留着不用。点一下打开，剩下的指令会自动探索迷雾。';
  morph(b,`${icon('compass')}<b>余令去探索</b><i class="knob" aria-hidden="true"></i>`);
}
/** 人口 layer legend: the realm's head count, and how many girls stand on its land (编队、驻扎、差事). */
function peopleLegend(){
  const legend=$('map-legend');if(!legend||worldMap.layer!=='people')return;
  const tiles=Object.values(state.tiles).filter(t=>t.ownerId===state.playerId&&!t.shipId),people=tiles.reduce((n,t)=>n+Math.floor(t.troops||0),0);
  const duty=Object.keys(state.campaign?.duties||{}),girls=new Set([...tiles.flatMap(t=>[...(t.field||[]),...(t.garrison||[])]),...duty]);
  legend.hidden=false;legend.innerHTML=[`本国 ${format(people)} 罪袋`,`${girls.size} 位同伴在地上${duty.length?`（差事 ${duty.length}）`:''}`,'越亮人越多'].map(text=>`<span>${esc(text)}</span>`).join('');
}
function setLeftExplore(on){
  const r=runAction({type:'setLeftoverExplore',on:Boolean(on)});
  if(r?.ok)toast(on?'开了：结束回合时，剩下的指令会自动探索迷雾。':'关了：结束回合时，剩下的指令留着不用。');
  return r;
}
function leftExploreSwitch(){
  const on=Boolean(state.management?.exploreLeft);
  return `<label class="gv-switch left-explore-switch"><input type="checkbox" data-left-explore ${on?'checked':''} /><span>结束回合时，剩下的指令全拿去探索</span></label>`;
}
function bindLeftExploreSwitch(root){root?.querySelectorAll?.('[data-left-explore]').forEach(input=>input.onchange=()=>setLeftExplore(input.checked));}
function tileName(t){if(!t)return '未知疆域';if(!t.discovered)return '迷雾';const city=state?.campaign?.cities?.[t.key];if(city&&!t.isCapital&&city.ownerId===t.ownerId)return city.name;if(t.isCapital){const f=state.factions[t.ownerId];return f?capitalNameOf(f):'古都';}return state.terrainTypes[t.terrainId]?.name||'未知地貌';}
function planBar(plan){return `<div class="objective-row"><div><span>${esc(plan.label)}</span><b>${format(plan.current)} / ${format(plan.target)}</b></div><div class="objective-progress"><i style="width:${Math.max(0,Math.min(100,plan.current/Math.max(1,plan.target)*100))}%"></i></div></div>`;}
/** Which tiles can be acted on this moment. Only candidates are checked; the engine's own actions decide. */
function mapHints(){
  const hints={explore:new Set(),claim:new Set(),attack:new Set()};
  if(typeof mapPick!=='undefined'&&mapPick){for(const tile of Object.values(state.tiles))if(tile.discovered&&mapPick.eligible(tile)){if(mapPick.multi&&mapPick.chosenSet?.has(tile.key))hints.attack.add(tile.key);else hints.claim.add(tile.key);}return hints;}
  if(state.battle)return hints;
  const army=typeof armyTile==='function'?armyTile():null;
  if(army){for(const k of armyMoveKeys(army))hints.claim.add(k);for(const k of armyAttackKeys(army))hints.attack.add(k);return hints;}
  if(dispatchFrom){
    if(state.tiles[dispatchFrom]?.marchedTurn!==state.turn)for(const k of Object.keys(getMarch(state,dispatchFrom)))hints.claim.add(k);
    for(const k of neighbors(dispatchFrom)){const t=state.tiles[k];if(t.discovered&&t.ownerId&&t.ownerId!==state.playerId&&previewAttack(state,dispatchFrom,k).canAttack)hints.attack.add(k);}
    return hints;
  }
  if(state.ap<=0)return hints;
  for(const t of Object.values(state.tiles)){
    if(!t.discovered){if(neighbors(t.key).some(k=>state.tiles[k].discovered)&&getActions(state,t.key).some(a=>a.type==='explore'&&a.enabled))hints.explore.add(t.key);continue;}
    if(t.ownerId===state.playerId)continue;
    const near=neighbors(t.key).filter(k=>state.tiles[k].ownerId===state.playerId);
    if(!near.length)continue;
    if(!t.ownerId){if(getActions(state,t.key).some(a=>a.type==='claim'&&a.enabled))hints.claim.add(t.key);}
    else{const source=near.filter(k=>state.tiles[k].troops>1||state.tiles[k].field.length).sort((a,b)=>state.tiles[b].troops-state.tiles[a].troops)[0];if(source&&previewAttack(state,source,t.key).canAttack)hints.attack.add(t.key);}
  }
  return hints;
}
function selectTile(key){
  if(typeof mapPick!=='undefined'&&mapPick){mapPickTap(key);return;}
  const guided=guideNow();
  if(guided&&key!==null&&(guided.info||key!==guided.tile)){nudgeGuide();return;}
  if(typeof armyTile==='function'&&armyTile()&&key!==null){if(armyTap(key))return;}
  else if(guided?.army&&key===guided.army&&typeof selectArmy==='function'){selectArmy(key);return;}
  if(key===null||(flowerOpen&&key===selectedKey&&!dispatchFrom)){closeFlower();return;}
  if(!state.tiles[key])return;
  selectedKey=key;attackTroops=null;moveTroops=null;attackFrom=dispatchFrom&&key!==dispatchFrom?dispatchFrom:null;flowerOpen=true;
  worldMap.select(key);renderFlower();const scroll=$('flower').querySelector('.tag');if(scroll)scroll.scrollTop=0;showHint();
  fitFlower(key);
}
function closeFlower(){delete $('flower').departureDraft;$('flower').ringForm=null;flowerOpen=false;worldMap.select(null);renderFlower();showHint();}
function cancelDispatch(){if(typeof clearArmy==='function')clearArmy();dispatchFrom=null;attackFrom=null;attackTroops=null;moveTroops=null;leftBehind=new Set();closeFlower();worldMap.setHints(mapHints());renderCommandBar();}
function beginDispatch(key){
  if(typeof selectArmy==='function'){selectArmy(key,{center:true});return;}
  const reason=departureReason(state,state.tiles[key]);if(reason){toast(reason,true);return;}
  delete $('flower').departureDraft;leftBehind=new Set();dispatchFrom=key;attackFrom=key;attackTroops=null;moveTroops=null;flowerOpen=false;
  worldMap.select(null);worldMap.setHints(mapHints());renderFlower();renderCommandBar();showHint();
}
function upgradableKeys(){return new Set(Object.values(state.tiles).filter(t=>t.discovered&&t.ownerId===state.playerId&&t.building&&getUpgradeQuote(state,t.key).enabled).map(t=>t.key));}
function diplomacyColors(){
  return Object.fromEntries(Object.values(state.factions).map(f=>{const rel=getRelation(state,f.id);return [f.id,f.id===state.playerId?'#ffcf6b':rel?.met===false?'#7e8796':({war:'#ef6758',alliance:'#73ce9d',ally:'#73ce9d',pact:'#e6cc75',truce:'#e6cc75',nap:'#e6cc75',neutral:'#8391a6'})[rel?.status]||'#8391a6'];}));
}
function jumpToReadyArmy(direction=1){
  if(typeof nextArmy==='function'){nextArmy(direction);return;}
  let list=readyArmies(state);if(!list.length)list=readyArmies(state,{all:true});
  const key=nextKey(list.map(t=>t.key),selectedKey,direction);
  if(!key){toast('现在没有能出发的军队：可能都走过了、人太少，或者粮不够。');return;}
  cancelDispatch();selectedKey=key;flowerOpen=true;render();worldMap.centerOn(key);fitFlower(key);
}
function jumpToUpgrade(){
  const key=nextKey([...upgradableKeys()],selectedKey);if(!key){toast('目前没有满足升级条件的建筑。');return;}
  cancelDispatch();selectedKey=key;flowerOpen=true;render();worldMap.centerOn(key);fitFlower(key);
}
/** 研究: what is being researched and how long is left; glows when nothing is and something is affordable. */
function researchBadge(){
  if(typeof techOf!=='function')return '';
  const record=techOf(state),active=record.active?TECHNOLOGIES.find(t=>t.id===record.active.id):null;
  if(active)return `<button class="quick tech" id="open-research" aria-label="正在研究${esc(active.name)}，还剩 ${record.active.remaining} 回合">${icon('spark')}<b>${record.active.remaining}</b><span>${esc(active.name)}</span></button>`;
  const ready=TECHNOLOGIES.some(t=>researchQuote(state,t.id).enabled);
  return ready?`<button class="quick tech idle" id="open-research" aria-label="现在没有在研究，点这里选科技">${icon('spark')}<b>!</b><span>选科技</span></button>`:'';
}
/** 闲人: how many girls sit idle with somewhere useful to go (the plan is worth at least one gold a turn each). Cached per revision. */
var idleBadgeCache={state:null,revision:-1,idle:0,plan:0};
function idleBadge(){
  if(typeof getDutyPlan!=='function')return '';
  if(idleBadgeCache.state!==state||idleBadgeCache.revision!==state.revision){const p=getDutyPlan(state,99);idleBadgeCache={state,revision:state.revision,idle:p.idle,plan:p.plan.length};}
  const n=idleBadgeCache.plan;
  return n?`<button class="quick duty" id="open-duty-plan" aria-label="${n} 位同伴闲着，点这里派她们去管事">${icon('heroes')}<b>${n}</b><span>闲人</span></button>`:'';
}
/** Small round badges under the treasury. They only appear when there is something to look at. */
function renderCommandBar(){
  const box=$('map-quick');if(!box)return;
  if(state.battle||(typeof lesson!=='undefined'&&lesson)){box.hidden=true;morph(box,'');return;}
  const inbox=state.inbox||[],up=upgradableKeys().size,war=dispatchFrom?0:filterFrontiers(frontierEntries(state),'war').length;
  const items=[inbox.length?`<button class="quick ${inbox.some(item=>item.kind==='tribute')?'urgent':'mail'}" id="open-offers" aria-label="外交来信 ${inbox.length} 封，本回合内处理">${icon('chat')}<b>${inbox.length}</b><span>来信</span></button>`:'',
    up?`<button class="quick up" id="next-upgrade" aria-label="${up} 处建筑可以升级" aria-keyshortcuts="U">${icon('upload')}<b>${up}</b><span>可升级</span></button>`:'',
    war?`<button class="quick war" id="next-war-frontier" aria-label="${war} 处交战边境" aria-keyshortcuts="F">${icon('flame')}<b>${war}</b><span>交战</span></button>`:'',typeof researchBadge==='function'?researchBadge():'',typeof idleBadge==='function'?idleBadge():''].filter(Boolean);
  box.hidden=!items.length;morph(box,items.join(''));
  if($('open-offers'))$('open-offers').onclick=showInbox;
  if($('next-upgrade'))$('next-upgrade').onclick=jumpToUpgrade;
  if($('next-war-frontier'))$('next-war-frontier').onclick=()=>jumpToFrontier(null,'war');
  if($('open-research'))$('open-research').onclick=()=>showManagement({tab:'tech'});
  if($('open-duty-plan'))$('open-duty-plan').onclick=()=>showDutyPlan();
  const note=$('dispatch-note'),from=state.tiles[dispatchFrom];if(typeof document!=='undefined')document.body?.classList?.toggle('dispatching',Boolean(from&&!state.battle));
  if(note){note.hidden=!from||Boolean(state.battle);if(from)morph(note,`<span><b>出征中</b>点白虚线格行军，红框进攻</span><button id="cancel-dispatch">取消</button>`);if($('cancel-dispatch'))$('cancel-dispatch').onclick=cancelDispatch;}
  if(typeof stackRightHud==='function')stackRightHud();
}
/** The right-hand column stacks under the treasury, which grows when badges show up: layer switch (phones), then the army rail, never into the dial. */
function stackRightHud(){
  if(typeof rectOf!=='function'||typeof document==='undefined')return;
  const ledger=rectOf($('ledger')),tools=document.querySelector('.view-tools'),rail=$('army-rail'),dial=rectOf($('end-turn'));if(!ledger)return;
  const phone=isPhone();let y=ledger.bottom+6;
  // On a phone the layer switch reaches left past the treasury: under a tall goals box (a lesson's) it goes below that too.
  if(tools?.style){if(phone){const lane=rectOf(tools),goal=rectOf($('goals'));if(lane&&goal&&lane.left<goal.right+4)y=Math.max(y,goal.bottom+6);tools.style.top=`${Math.round(y)}px`;const r=rectOf(tools);if(r)y=r.bottom+6;}else tools.style.top='';}
  // The rail ends where the next thing below it begins: the layer switch on a short wide screen, else the dial.
  if(rail?.style){
    rail.style.top=`${Math.round(y+(phone?0:2))}px`;
    const lane=phone?null:rectOf(tools),box=rectOf(rail),line=$('bubble'),say=line&&!line.hidden?rectOf(line):null;
    const floor=Math.min(dial?dial.top-12:Infinity,lane&&box&&lane.top>y&&lane.right>box.left?lane.top-8:Infinity,say&&box&&say.top>y&&say.right>box.left?say.top-8:Infinity);
    rail.style.maxHeight=Number.isFinite(floor)?`${Math.max(40,Math.round(floor-y))}px`:'';
  }
  document.documentElement.style.setProperty('--hud-top',`${Math.round(y)}px`);
  // The left column: the notes hang under the goals box, which is taller during a lesson.
  const goalsBox=rectOf($('goals')),notes=$('report');
  if(notes?.style&&typeof getComputedStyle==='function'){
    notes.style.top='';notes.style.maxWidth='';notes.style.maxHeight='';notes.style.visibility='';const r=rectOf(notes);
    if(goalsBox&&r&&r.left<goalsBox.right&&r.top<goalsBox.bottom+6&&r.bottom>goalsBox.top)notes.style.top=`${Math.round(parseFloat(getComputedStyle(notes).top)+goalsBox.bottom+6-r.top)}px`;
    // On a phone the layer switch reaches into the notes' row: the notes stop short of it.
    const now=rectOf(notes),lane=phone?rectOf(tools):null;
    if(now&&lane&&now.right>lane.left-6&&now.bottom>lane.top&&now.top<lane.bottom)notes.style.maxWidth=`${Math.max(118,Math.round(lane.left-6-now.left))}px`;
    // …and never reach down onto the leader's face.
    const face=typeof leaderFaceBox==='function'?leaderFaceBox():null,held=rectOf(notes);
    if(face&&held&&held.left<face.right&&held.right>face.left&&held.bottom>face.top-6){const room=Math.round(face.top-6-held.top);if(room>=30)notes.style.maxHeight=`${room}px`;else notes.style.visibility='hidden';}
  }
}
/* ---------------------------------------------------------------------------------------------
   The army (编队). The girls marching on a tile and the Sazai who go with them are one unit on the
   map, flying a banner with the lead girl's face. Tapping the banner commands the army in its own
   card, the 编队卡, apart from the tile ring:
     · who is in it: tap a face to send her to the station here, tap a stationed face to bring her;
     · how many Sazai go: − / + and three presets, the rest stay and keep the tile producing;
     · where to: white tiles march, red tiles attack. The map draws the arrow, the card shows the
       odds and a big button. Nothing moves until that button (a second tap on a march target also
       marches; an attack always needs the button).
   The tile ring's 编队 petal, the army rail and N all open the same card.
   --------------------------------------------------------------------------------------------- */
let armyKey=null,armyTarget=null,armySplit=null,armySel=null,armyFolded=false,armyWaypoints=[],armyRouting=false,armyRaid=false;const armyPlans=new Map();
function armyTile(key=armyKey){const t=key&&state.tiles[key];return t&&t.ownerId===state.playerId&&!state.battle?t:null;}
function armySelectedField(home=armyTile()){return home&&armySel?.key===home.key?home.field.filter(id=>armySel.ids.has(id)):[];}
function armySelectedStation(home=armyTile()){return home&&armySel?.key===home.key?home.garrison.filter(id=>armySel.ids.has(id)):[];}
function armySelectedAll(home=armyTile()){return [...armySelectedField(home),...armySelectedStation(home)];}
/** Armies are tiles with marching girls; ready ones first. */
function armyList(){return Object.values(state.tiles).filter(t=>t.ownerId===state.playerId&&t.field?.length).sort((a,b)=>Boolean(armyMoveReason(a))-Boolean(armyMoveReason(b))||b.field.length-a.field.length||b.troops-a.troops||a.key.localeCompare(b.key));}
/** Why this army cannot march this turn, or ''. Attacking is checked target by target. */
function armyMoveReason(home){if(home?.shipId){const ship=state.campaign.ships[home.shipId];return ship?.movedTurn===state.turn?'这艘船本回合已经航行过了':'';}return departureReason(state,home);}
/* Ships are armies on water: the same card, with sail / unload / landing as their orders. A land army beside its own ship can board it. */
const shipOf=home=>home?.shipId?state.campaign.ships[home.shipId]:null;
function shipReach(home){
  const ship=shipOf(home);if(!ship||armyMoveReason(home))return [];
  const speed=shipSpeed(state,ship),seen=new Map([[home.key,0]]),queue=[home.key];
  for(let i=0;i<queue.length;i++){const key=queue[i],d=seen.get(key);if(d>=speed)continue;for(const near of neighbors(key)){const t=state.tiles[near];if(!t?.discovered||t.terrainId!=='ocean'||t.shipId||seen.has(near))continue;seen.set(near,d+1);queue.push(near);}}
  seen.delete(home.key);return [...seen.keys()];
}
const hexStep=(a,b)=>Math.max(Math.abs(a.q-b.q),Math.abs(a.r-b.r),Math.abs(a.q+a.r-b.q-b.r));
/** Who goes with this order: everybody marching here, or the selected marching character(s) / 分队 subset. */
function armyGoing(home=armyTile()){
  if(!home)return [];
  if(armySplit&&armySplit.key===home.key)return home.field.filter(id=>armySplit.ids.has(id));
  const picked=armySelectedField(home);
  if(picked.length)return picked;
  return [...home.field];
}
const armySplitting=(home=armyTile())=>Boolean(home&&((armySplit&&armySplit.key===home.key)||(armySelectedField(home).length>0&&armySelectedField(home).length<home.field.length)));
function armyAttackKeys(home){
  if(!home||home.foughtTurn===state.turn)return [];
  if(home.shipId)return neighbors(home.key).filter(k=>{const t=state.tiles[k];return t.discovered&&t.ownerId&&t.ownerId!==state.playerId&&getRelation(state,t.ownerId)?.status==='war';});
  const girls=armyGoing(home);
  return neighbors(home.key).filter(k=>{const t=state.tiles[k];return t?.discovered&&t.ownerId&&t.ownerId!==state.playerId&&previewAttack(state,home.key,k,undefined,girls).canAttack;});
}
function armyMoveKeys(home){if(home?.shipId)return [...shipReach(home),...neighbors(home.key).filter(k=>{const t=state.tiles[k];return t.discovered&&!t.shipId&&t.ownerId===state.playerId&&walkable(state,t);})];const boards=home?neighbors(home.key).filter(k=>state.tiles[k].shipId&&state.tiles[k].ownerId===state.playerId):[];return [...boards,...(home&&!armyMoveReason(home)?Object.keys(armySplitting(home)?getMarch(state,home.key,armyGoing(home)):getMarch(state,home.key)):[])];}
function armyChoice(home,to=null){
  if(home?.shipId&&!armyPlans.has(home.key)){const all=departureSelection(home,to,getTileStats(state,home.key),home.troops,{attack:Boolean(to&&to.ownerId&&to.ownerId!==state.playerId),girls:armyGoing(home)});return {...all,defaultAmount:all.max,manual:false};}
  const attack=Boolean(to&&to.ownerId&&to.ownerId!==state.playerId),requested=armyPlans.has(home.key)?armyPlans.get(home.key):null;
  const girls=armyGoing(home),room=!attack&&to&&to.ownerId===state.playerId&&typeof getSupply==='function'?getSupply(state,to.key,{arriving:girls.length}).room:undefined;
  return departureSelection(home,to,getTileStats(state,home.key),requested,{attack,girls,room});
}
/** The standing march order this army is under, if any. */
function armyOrderOf(home=armyTile()){
  if(!home||typeof getMarchOrders!=='function')return null;
  return getMarchOrders(state).find(order=>order.key===home.key&&(order.girls.length?order.girls.some(id=>home.field.includes(id)):!home.field.length))||null;
}
/** The far-march quote for a tile of ours beyond today's walk, or null when no road of our own land leads there. */
function armyFarPlan(key,home=armyTile()){
  if(!home||typeof getMarchPlan!=='function')return null;
  const to=state.tiles[key];if(!to?.discovered||to.ownerId!==state.playerId||key===home.key)return null;
  const plan=getMarchPlan(state,home.key,key,{troops:armyChoice(home,to).amount,girls:armyGoing(home)});
  return plan.path.length>1?plan:null;
}
/** What a tap on this tile means while an army is commanded: 'move', 'far', 'attack', 'road', or '' (just look at the tile). */
function armyOrderKind(key,home=armyTile()){
  const t=state.tiles[key];if(!home||!t||key===home.key||!t.discovered)return '';
  if(home.shipId){
    if(t.terrainId==='ocean')return t.shipId&&t.ownerId===state.playerId?'':shipRoute(state,home.shipId,key)?'sail':'';
    if(hexStep(home,t)!==1||!walkable(state,t))return '';
    return t.ownerId===state.playerId?'unload':'landing';
  }
  if(t.shipId)return t.ownerId===state.playerId&&hexStep(home,t)===1?'board':'';
  if(t.ownerId===state.playerId){
    if(typeof armyProfile==='function'&&armyProfile(state,home.key).goal)return 'objective';
    if(!armyMoveReason(home)&&Object.hasOwn(armySplitting(home)?getMarch(state,home.key,armyGoing(home)):getMarch(state,home.key),key))return 'move';
    if(armyFarPlan(key,home))return 'far';
    if(!armyMoveReason(home)&&getRoadMarchAdvice(state,home.key,key,{troops:armyChoice(home,t).amount,girls:armyGoing(home)}))return 'road';
    return typeof routeQuote==='function'&&routeQuote(state,home.key,key,{girls:armyGoing(home),troops:armyChoice(home,t).amount}).enabled?'objective':'';
  }
  if(t.ownerId&&neighbors(home.key).includes(key))return 'attack';
  if(!t.ownerId&&neighbors(home.key).includes(key))return '';
  if(typeof routeQuote!=='function')return '';const choice=armyChoice(home,t),plan=routeQuote(state,home.key,key,{girls:armyGoing(home),troops:choice.amount});
  return plan.enabled?'objective':'';
}
/** Draws what the army card is looking at: a target's arrow or trail, else the trail of its standing order. */
function armyRoute(){
  const home=armyTile();if(!home){worldMap.setRoute(null);return;}
  if(armyTarget){
    const kind=armyOrderKind(armyTarget,home),plan=kind==='far'?armyFarPlan(armyTarget,home):null;
    if(kind==='sail'){const route=shipRoute(state,home.shipId,armyTarget);worldMap.setRoute(route?{from:home.key,to:armyTarget,kind:'far',path:route.path,stops:[]}:null);return;}
    if(kind==='objective'){
      const plan2=routeQuote(state,home.key,armyTarget,{girls:armyGoing(home),troops:armyChoice(home,state.tiles[armyTarget]).amount,waypoints:armyWaypoints.filter(k=>k!==armyTarget)}),reach=plan2?.reach||[],stops=armyWaypoints.filter(k=>plan2?.path?.includes(k));
      // The part it can walk now is the bold trail; past the first unclaimed or neutral tile the plan goes on faint.
      worldMap.setRoute(plan2?.path?.length>1?{from:home.key,to:armyTarget,kind:'far',path:plan2.partial?reach:plan2.path,rest:plan2.partial?plan2.path.slice(Math.max(0,reach.length-1)):null,stops:[...stops,armyTarget]}:null);return;
    }
    worldMap.setRoute(plan?{from:home.key,to:armyTarget,kind:'far',path:plan.path,stops:plan.stops}:{from:home.key,to:armyTarget,kind:kind==='attack'?'attack':'move'});
    return;
  }
  const order=armyOrderOf(home);
  worldMap.setRoute(order?.path?.length>1?{from:home.key,to:order.toKey,kind:'far',path:order.path,stops:order.stops}:null);
}
function selectArmy(key,{target=null,center=false}={}){
  const home=armyTile(key);if(!home)return false;
  const guided=guideNow();
  if(guided&&!(guided.army===key||((guided.step?.id==='march'||guided.step?.far)&&guided.tile&&armyKey===key)||guided.armyFree)){nudgeGuide();return false;}
  if(flowerOpen)closeFlowerQuiet();
  dispatchFrom=null;attackFrom=null;
  if(armyKey!==key){armyPlans.delete(key);armySplit=null;armySel=null;armyFolded=false;}
  armyKey=key;armyTarget=null;armyWaypoints=[];armyRouting=false;armyRaid=false;worldMap.select(null);worldMap.setArmy(key);worldMap.setRoute(null);
  if(target&&armyOrderKind(target,home)){armyTarget=target;armyFolded=false;}
  armyRoute();
  worldMap.setHints(mapHints());renderArmy();renderRail();renderCommandBar();showHint();
  if(center)worldMap.centerOn(key);
  fitArmy();
  // In a lesson the next thing to tap changes the moment the army is picked: say so, and bring it into view.
  if(guided&&typeof renderTutorial==='function'){const now=guideNow();if(now&&$('guide-order'))$('guide-order').textContent=now.order;renderTutorial();}
  else placeMarkers();
  return true;
}
function clearArmy(){
  if(!armyKey&&!armyTarget)return;
  armyKey=null;armyTarget=null;armySplit=null;armySel=null;armyFolded=false;armyWaypoints=[];armyRouting=false;worldMap.setArmy(null);worldMap.setRoute(null);
  worldMap.setHints(mapHints());renderArmy();renderRail();renderCommandBar();showHint();placeMarkers();
}
function setArmyTarget(key){
  const home=armyTile(),kind=armyOrderKind(key,home);if(!home||!kind)return;
  if(armyTarget!==key){armyWaypoints=[];armyRouting=false;armyRaid=false;}
  armyFolded=false;armyTarget=key;armyRoute();renderArmy();fitArmy(key);placeMarkers();
}
/** A tap on the map while an army is commanded. Returns true when the army took it. */
function armyTap(key){
  const home=armyTile();if(!home)return false;
  // 改道: while it is on, taps add or remove the tiles the long march must pass through.
  if(armyRouting&&armyTarget&&key!==armyTarget&&key!==home.key){
    const t=state.tiles[key];
    if(t?.discovered&&!t.shipId&&walkable(state,t)){armyWaypoints=armyWaypoints.includes(key)?armyWaypoints.filter(k=>k!==key):[...armyWaypoints,key].slice(0,8);armyRoute();renderArmy();placeMarkers();return true;}
    toast('途经点要选能走的陆地。',true);return true;
  }
  if(key===home.key){clearArmy();return false;}
  const kind=armyOrderKind(key,home);
  if(!kind){clearArmy();return false;}
  if(armyTarget===key){
    if(kind==='move'||kind==='sail'||kind==='board'||kind==='unload'){armyGo();return true;}
    const go=$('army-go');if(go){go.classList.remove('nudge');void go.offsetWidth;go.classList.add('nudge');}
    return true;
  }
  setArmyTarget(key);return true;
}
function armyMember(id,toStation){
  const home=armyTile();if(!home)return;
  const guided=guideNow();if(guided&&!guided.free&&!guided.armyFree){nudgeGuide();return;}
  const result=runAction({type:'stance',characterId:id,stay:toStation});
  if(result.ok)armyPlans.delete(home.key);
}
function armyToggleSelect(id){
  const home=armyTile();if(!home)return;
  const guided=guideNow();if(guided&&!guided.free&&!guided.armyFree){nudgeGuide();return;}
  if(!armySel||armySel.key!==home.key)armySel={key:home.key,ids:new Set()};
  if(armySel.ids.has(id))armySel.ids.delete(id);else armySel.ids.add(id);
  if(!armySel.ids.size)armySel=null;
  armyPlans.delete(home.key);
  if(armyTarget&&!armyOrderKind(armyTarget,home))armyTarget=null;
  armyRoute();worldMap.setHints(mapHints());renderArmy();placeMarkers();
}
function armyMoveSelected(toStation){
  const home=armyTile();if(!home)return;
  const guided=guideNow();if(guided&&!guided.free&&!guided.armyFree){nudgeGuide();return;}
  const ids=toStation?armySelectedField(home):armySelectedStation(home);
  if(!ids.length)return;
  let moved=0;
  for(const id of ids){
    const result=runAction({type:'stance',characterId:id,stay:toStation});
    if(!result.ok)break;
    moved++;
  }
  if(moved){armySel=null;armyPlans.delete(home.key);if(armyTile(home.key))renderArmy();}
}
function startHeroDutyPick(characterId,fromArmyKey=null){
  if(typeof getDutyQuote!=='function'||typeof DUTIES==='undefined')return;
  const hero=state.characters[characterId];if(!hero)return;
  const land=Object.values(state.tiles).filter(t=>t.ownerId===state.playerId&&t.discovered&&!t.shipId&&t.cutSince===undefined&&state.terrainTypes[t.terrainId]?.passable);
  if(!land.length){toast('现在没有可派遣劳作的己方陆地。',true);return;}
  const probe=getDutyQuote(state,land[0].key,characterId,DUTIES[0].id);
  if(probe.reason&&!/已经在做|数值是 0|是 0|指令/.test(probe.reason)){toast(probe.reason,true);return;}
  if(typeof beginMapPick!=='function')return;
  let pickedJob=null;
  const bestQuoteFor=key=>{
    const quotes=DUTIES.map(d=>getDutyQuote(state,key,characterId,d.id));
    if(pickedJob){const chosen=quotes.find(q=>q.job===pickedJob);if(chosen)return chosen;}
    return [...quotes].sort((a,b)=>Number(b.enabled)-Number(a.enabled)||(b.effect?.value||0)-(a.effect?.value||0))[0];
  };
  const ranked=[...land].sort((a,b)=>{
    const otherA=Number(a.key!==fromArmyKey),otherB=Number(b.key!==fromArmyKey);
    const freeA=Number(!(typeof dutyAt==='function'&&dutyAt(state,a.key))),freeB=Number(!(typeof dutyAt==='function'&&dutyAt(state,b.key)));
    const qA=bestQuoteFor(a.key),qB=bestQuoteFor(b.key);
    return (otherB-otherA)||(freeB-freeA)||((qB?.effect?.value||0)-(qA?.effect?.value||0))||a.key.localeCompare(b.key);
  });
  const landSet=new Set(land.map(t=>t.key));
  beginMapPick({
    kind:'duty',icon:'scroll',title:`派遣 ${hero.name} 劳作`,subtitle:'选己方地块与差事',from:fromArmyKey||land[0].key,initial:ranked[0]?.key||land[0].key,
    eligible:t=>landSet.has(t.key),
    why:t=>!t?.discovered?'迷雾里不能派驻。':t.ownerId!==state.playerId?'只能派遣到自己的陆地上。':t.cutSince!==undefined?'这块地与首都失联，先打通道路。':'水面不能劳作。',
    preview:key=>bestQuoteFor(key),
    render:(tile,q)=>{
      if(!tile)return `<h4>点地图上的己方地块</h4><p>白框是可派遣劳作的领地，选好地块后可挑差事类型。</p>`;
      const chips=typeof dutyChips==='function'?dutyChips(tile,characterId,q.job):`<div class="ap-mini-row">${DUTIES.map(d=>`<button type="button" class="ap-mini ${q.job===d.id?'on':''}" data-duty-job="${d.id}">${esc(d.name)}</button>`).join('')}</div>`;
      const dName=DUTIES.find(d=>d.id===q.job)?.name||'差事';
      return `<h4>派往 ${esc(tileName(tile))}<small>${esc(tile.key)}</small></h4>${chips}<p>${esc(dName)}产出：<b>${esc(q.line||'无加成')}</b>${q.replaces?` · 接替 ${esc(state.characters[q.replaces]?.name||'')}（回首都）`:''} · ${priceHtml(q)}</p>${q.enabled?'':`<p class="alarm">${esc(q.reason)}</p>`}`;
    },
    bind:root=>{root.querySelectorAll('[data-duty-job]').forEach(b=>b.onclick=()=>{if(b.getAttribute('aria-disabled')==='true'){toast(/已满/.test(b.textContent)?'这里控制力已满，换一项差事吧。':'她这项数值是 0，做不来。',true);return;}pickedJob=b.dataset.dutyJob;renderMapPicker();});},
    confirmLabel:'派去劳作！',
    onPick:key=>{const q=bestQuoteFor(key);if(!q?.enabled){toast(q?.reason||'现在还不能派驻。',true);return;}const r=runAction(q.action);if(r.ok)toast(`${hero.name}已前往${tileName(state.tiles[key])}${DUTIES.find(d=>d.id===q.job)?.name||'劳作'}：${q.line}。`);},
    onCancel:()=>{if(fromArmyKey&&armyTile(fromArmyKey)){selectArmy(fromArmyKey);armySel={key:fromArmyKey,ids:new Set([characterId])};renderArmy();}}
  });
}
/** 分队: tick who goes this time. Everybody else stays on the tile as an army of their own; nobody needs a station seat. */
function armySplitToggle(on){
  const home=armyTile();if(!home)return;
  armySel=null;
  armySplit=on?{key:home.key,ids:new Set(home.field)}:null;armyPlans.delete(home.key);
  if(armyTarget&&!armyOrderKind(armyTarget,home))armyTarget=null;
  armyRoute();worldMap.setHints(mapHints());renderArmy();placeMarkers();
}
function armyPick(id,mode='toggle'){
  const home=armyTile();if(!(home&&armySplit&&armySplit.key===home.key))return;
  if(mode==='all')armySplit.ids=new Set(home.field);else if(mode==='none')armySplit.ids=new Set();
  else if(armySplit.ids.has(id))armySplit.ids.delete(id);else armySplit.ids.add(id);
  armyPlans.delete(home.key);
  if(armyTarget&&!armyOrderKind(armyTarget,home))armyTarget=null;
  armyRoute();worldMap.setHints(mapHints());renderArmy();placeMarkers();
}
function armyGo(){
  const home=armyTile(),to=armyTarget&&state.tiles[armyTarget];if(!home||!to)return;
  const kind=armyOrderKind(to.key,home),choice=armyChoice(home,to),girls=armyGoing(home);
  if(kind==='objective'){
    const plan=routeQuote(state,home.key,to.key,{girls,troops:choice.amount,waypoints:armyWaypoints.filter(k=>k!==to.key)});
    if(!plan.enabled){toast(plan.reason||'到不了那里。',true);return;}
    const result=runAction(plan.action);if(!result.ok)return;
    if(plan.partial&&plan.blocker){toast(`目标定好了：${tileName(to)}。${plan.reach?.length>1?`先走到 ${tileName(state.tiles[plan.reach.at(-1)])}，`:''}${plan.blocker}。`);clearArmy();return;}
    toast(`目标定好了：${tileName(to)}，大约 ${plan.turns} 回合。之后每回合开始自动前进${(typeof armyProfile==='function'&&armyProfile(state,home.key).mode==='free')?'，遇敌自动开打':'，遇敌进战棋'}。`);clearArmy();return;
  }
  if(kind==='sail'){
    const ship=shipOf(home),from=home.key,result=runAction({type:'sailShip',shipId:ship.id,toKey:to.key});if(!result.ok)return;
    const d=result.detail;toast(d?.fought?'和敌船交上火了。':d?.arrived?`船开到了 ${to.key}。`:`船先开到 ${d?.key||ship.key}，之后每回合自动往 ${to.key} 开。`);
    const there=armyTile(d?.key);if(there&&!state.battle)selectArmy(there.key);else clearArmy();return;
  }
  if(kind==='board'||kind==='unload'){
    const ship=kind==='board'?state.campaign.ships[to.shipId]:shipOf(home),shore=kind==='board'?home.key:to.key;
    const result=runAction({type:kind==='board'?'boardShip':'disembarkShip',shipId:ship.id,shoreKey:shore,characterIds:girls,troops:choice.amount});if(!result.ok)return;
    toast(kind==='board'?`上船了：${girls.length?`${girls.length} 位同伴、`:''}${choice.amount} 名罪袋。点船就能出航。`:`下船了：${girls.length?`${girls.length} 位同伴、`:''}${choice.amount} 名罪袋。`);
    if(kind==='board')selectArmy(to.key);else clearArmy();return;
  }
  if(kind==='landing'){
    const ship=shipOf(home),result=runAction({type:'shoreLanding',shipId:ship.id,shoreKey:to.key,characterIds:girls,troops:choice.amount});
    if(result.ok&&!state.battle)clearArmy();return;
  }
  if(kind==='road'){
    const road=getRoadMarchAdvice(state,home.key,to.key,{troops:choice.amount,girls});
    if(!road){toast('局势变了，请重新选择目标。',true);renderArmy();return;}
    const from=home.key,target=to.key;
    runAction(road.action,{onCommitted:()=>{armyKey=from;armyTarget=target;}});
    if(armyTile(from)){armyKey=from;setArmyTarget(target);}
    return;
  }
  if(kind==='far'){
    const plan=armyFarPlan(to.key,home);
    if(!plan?.enabled){toast(plan?.reason||'现在不能下这道远行令。',true);return;}
    const result=runAction(plan.action);
    if(!result.ok)return;
    armyPlans.delete(home.key);
    const d=result.detail;
    toast(d.arrived?`已经走到 ${tileName(state.tiles[d.toKey])}。`:`远行令已下达：${d.movedNow?`今天先到 ${tileName(state.tiles[d.key])}，`:'下回合开始时出发，'}第 ${d.arrivesTurn} 回合抵达 ${tileName(state.tiles[d.toKey])}。之后每回合自动前进。`);
    clearArmy();
    return;
  }
  if(kind==='move'){
    const from=home.key,target=to.key;
    const result=runAction({type:'move',fromKey:from,toKey:target,troops:choice.amount,girls});
    if(!result.ok)return;
    armyPlans.delete(from);armySplit=null;armySel=null;
    // Still able to fight from where it arrived? Keep commanding it there; otherwise let go.
    const there=armyTile(target);
    if(there&&there.field.length&&armyAttackKeys(there).length)selectArmy(target);else clearArmy();
    return;
  }
  if(kind==='attack'&&armyRaid){
    const raid=previewRaid(state,home.key,to.key,choice.amount,girls);
    if(!raid.ok||!raid.canAttack||!choice.valid){toast(raid.reason||raid.error||'现在不能劫掠这里。',true);return;}
    const from=home.key,target=to.key,loot=raid.loot||{gold:0,supply:0},name=BUILDINGS[to.building]?.name||'建筑';
    armyKey=null;armyTarget=null;armySplit=null;armySel=null;armyRaid=false;worldMap.setArmy(null);worldMap.setRoute(null);
    const result=runAction({type:'raid',fromKey:from,toKey:target,troops:choice.amount,girls});
    if(!result.ok){selectArmy(from,{target});return;}
    if(!state.battle)toast(`拆掉了${name}，抢回 ${loot.gold} 金、${loot.supply} 粮。`);
    armyPlans.delete(from);renderArmy();return;
  }
  if(kind==='attack'){
    const preview=previewAttack(state,home.key,to.key,choice.amount,girls);
    if(!preview.ok||!preview.canAttack||!choice.valid){toast(preview.reason||preview.error||'现在不能从这里进攻。',true);return;}
    const from=home.key,target=to.key,split=armySplit,sel=armySel;
    armyKey=null;armyTarget=null;armySplit=null;armySel=null;worldMap.setArmy(null);worldMap.setRoute(null);
    const result=runAction({type:'attack',fromKey:from,toKey:target,troops:choice.amount,girls});
    if(!result.ok){armySplit=split;armySel=sel;selectArmy(from,{target});return;}
    armyPlans.delete(from);renderArmy();
  }
}
function nextArmy(direction=1){
  const list=armyList();
  if(!list.length){toast('现在没有编队。点己方地块，再点「编队」花瓣，就能让同伴编成一队。');return;}
  const key=nextKey(list.map(t=>t.key),armyKey,direction);
  selectArmy(key,{center:true});
}
function armyFace(id,where){
  const hero=state.characters[id];if(!hero)return '';
  const home=armyTile(),lead=where==='march'&&home?.field[0]===id,explicitSplit=where==='march'&&Boolean(home&&armySplit&&armySplit.key===home.key),going=!explicitSplit||armySplit.ids.has(id);
  const picked=!explicitSplit&&Boolean(armySel&&armySel.key===home?.key&&armySel.ids.has(id)),selField=armySelectedField(home);
  const dimmed=!explicitSplit&&where==='march'&&selField.length>0&&!picked;
  const quirk=typeof quirkOf==='function'?quirkOf(hero):null,badge=where==='march'&&quirk?.where==='army'?`<em class="ap-quirk" title="${esc(quirk.desc)}">${esc(quirk.name)}</em>`:'';
  const air=typeof mobilityOf==='function'&&mobilityOf(state,id)?.air?'<u class="ap-air" title="可飞行：无需机场即可飞行">飞</u>':'';
  const attr=explicitSplit?`data-army-pick="${esc(id)}" aria-pressed="${going}"`:`data-army-select="${esc(id)}" data-army-${where==='march'?'leave':'join'}="${esc(id)}" aria-pressed="${picked}"`;
  const tip=explicitSplit?(going?' · 点一下，这次不带她':' · 点一下，这次带上她'):picked?' · 已选中：点右侧驻地驻守、派遣劳作，或直接点地图分队移动':` · 点一下选中她（再点驻地驻守 / 派遣劳作 / 直接分队移动）`;
  return `<button type="button" class="ap-girl ${where} ${lead?'lead':''} ${explicitSplit?(going?'going':'staying'):picked?'going picked':dimmed?'staying':''}" ${attr} title="${esc(hero.name)}${tip}"><i><img src="${esc(portraitUrl(hero,'smile')||'')}" alt="" loading="lazy" />${air}${badge}</i><b>${esc(hero.name)}</b></button>`;
}
function renderArmy(){
  if(typeof mapPick!=='undefined'&&mapPick){renderMapPicker();return;}
  const box=$('army-panel');if(!box)return;
  const home=armyTile();
  if(armyKey&&!home){armyKey=null;armyTarget=null;armySplit=null;armySel=null;armyFolded=false;worldMap.setArmy(null);worldMap.setRoute(null);}
  if(armySplit&&(!home||armySplit.key!==home.key))armySplit=null;
  if(armySplit){armySplit.ids=new Set(home.field.filter(id=>armySplit.ids.has(id)));}
  if(armySel&&(!home||armySel.key!==home.key))armySel=null;
  if(armySel){armySel.ids=new Set([...armySel.ids].filter(id=>home.field.includes(id)||home.garrison.includes(id)));if(!armySel.ids.size)armySel=null;}
  if(armyTarget&&!armyOrderKind(armyTarget,home)){armyTarget=null;if(home&&typeof armyRoute==='function')armyRoute();else worldMap.setRoute(null);}
  document.body.classList.toggle('army-open',Boolean(home));
  if(!home){box.hidden=true;box.classList.remove('folded');morph(box,'');placeArmy();return;}
  box.classList.toggle('folded',armyFolded);
  const going=armyGoing(home),splitting=armySplitting(home),explicitSplit=Boolean(armySplit&&armySplit.key===home.key);
  const selField=armySelectedField(home),selStation=armySelectedStation(home),selAll=armySelectedAll(home);
  const to=armyTarget?state.tiles[armyTarget]:null,kind=to?armyOrderKind(to.key,home):'',choice=armyChoice(home,to),stats=getTileStats(state,home.key);
  const moveReason=armyMoveReason(home),attackKeys=armyAttackKeys(home),moveKeys=armyMoveKeys(home),standing=armyOrderOf(home);
  const rare=['SSR','SR','R'].filter(rank=>home.elite?.[rank]).map(rank=>`${rank}×${home.elite[rank]}`).join(' ');
  const status=!moveReason?['ready','可出发']:attackKeys.length?['half','走过了 · 还能打']:['done',/补给/.test(moveReason)?'缺粮':/行军/.test(moveReason)?'本回合走过了':'走不了'];
  const crew=home.field.length?home.field.map(id=>armyFace(id,'march')).join(''):`<p class="ap-empty">还没有同伴随队${home.garrison.length?'，点驻地头像选中后再点此处加入':''}</p>`;
  const seats=home.garrison.map(id=>armyFace(id,'station')).join('')+(home.garrison.length<MAX_SEATS?`<span class="ap-seat" aria-hidden="true">${selField.length?'驻':''}</span>`:'');
  const staying=home.field.length-going.length;
  const splitBar=explicitSplit?`<div class="ap-split" role="group" aria-label="分队"><b>分队</b><span>亮着的 ${going.length} 位这次出发${staying?`，${staying} 位留在原地另成一队`:''}</span><button type="button" data-army-pick-all="all">全选</button><button type="button" data-army-pick-all="none">全不选</button><button type="button" class="on" id="army-split-off">不分了</button></div>`:'';
  const selFly=selAll.length&&!home.shipId&&typeof campaignUI!=='undefined'&&campaignUI?.flightInfo?campaignUI.flightInfo(home.key,selAll):null;
  const selBar=!explicitSplit&&selAll.length?`<div class="ap-split ap-sel-bar" role="group" aria-label="已选中角色"><b>已选 ${selAll.length===1?esc(state.characters[selAll[0]]?.name||''):`${selAll.length} 位`}</b><span>${selField.length?(selField.length<home.field.length?'直接点地图可分出她的编队出发，或点驻地驻守':'点右侧驻地可驻守，或派遣劳作'):'点左侧编队区域即可加入队伍'}</span>${selField.length?`<button type="button" class="on" id="army-to-station">驻地</button>`:''}${selStation.length?`<button type="button" class="on" id="army-to-march">入队</button>`:''}${selAll.length===1&&!home.shipId&&typeof getDutyQuote==='function'?`<button type="button" id="army-to-duty">派遣劳作</button>`:''}${selFly?.available?`<button type="button" class="sky" id="army-char-fly">起飞</button>`:''}${selAll.length===1&&typeof showCharacter==='function'?`<button type="button" id="army-char-sheet">面板</button>`:''}<button type="button" id="army-sel-clear">取消</button></div>`:'';
  const sup=typeof getSupply==='function'?getSupply(state,home.key):null,there=to&&(kind==='move'||kind==='far')&&typeof getSupply==='function'?getSupply(state,to.key,{arriving:going.length}):null;
  const supNote=sup?(sup.over?`<em class="ap-over">此地超出补给 ${sup.over} 人，回合结束时 ${sup.leaving} 人会分散到附近</em> · `:`<span class="ap-sup" title="${esc(sup.parts.map(part=>`${part.label} ${part.value}`).join(' + '))}">此地补给 ${sup.people}/${sup.limit}</span> · `):'';
  const roomNote=there&&there.room<home.troops-1?`${tileName(to)}补给上限 ${there.limit}，只够再进 ${there.room} 人`:'';
  const troopsRow=choice.max>0||choice.amount>0?`<div class="ap-troops"><span class="ap-label">带兵</span><button class="ap-step" data-army-step="-1" aria-label="少带一名罪袋" ${choice.amount<=choice.min?'disabled':''}>−</button><b id="army-troops" aria-live="polite">${choice.amount}</b><button class="ap-step" data-army-step="1" aria-label="多带一名罪袋" ${choice.amount>=choice.max?'disabled':''}>+</button><span class="ap-presets">${home.shipId?'':`<button data-army-preset="safe" aria-pressed="${!choice.manual||choice.amount===choice.defaultAmount}">保产 ${choice.defaultAmount}</button>`}<button data-army-preset="max" aria-pressed="${choice.amount===choice.max&&choice.max!==choice.defaultAmount}">全部 ${choice.max}</button>${going.length?`<button data-army-preset="0" aria-pressed="${choice.amount===0}">不带</button>`:''}</span><small>${home.shipId?`船上 ${home.troops+home.field.length+home.garrison.length}/${SHIP_MODELS[shipOf(home)?.modelId]?.capacity||8} 人 · 留在船上 ${choice.remaining} 人`:`${supNote}留守 ${choice.remaining} 人${choice.remaining<stats.need?`<em> · 少于满产 ${stats.need} 人，产出会降</em>`:''}`}${rare?` · 稀有 ${esc(rare)} ${choice.amount>0?'跟着走':'留守'}`:''}</small></div>`:`<div class="ap-troops"><span class="ap-label">带兵</span><b>0</b><small>${home.bridgeId?esc(F.bridge_walk):`这里只有 ${home.troops} 人，要留 1 人看家${going.length?'，只派同伴出发':''}`}</small></div>`;
  const goal=home.shipId?(shipOf(home)?.goal?{toKey:shipOf(home).goal,blocked:shipOf(home).blocked}:null):typeof armyProfile==='function'?armyProfile(state,home.key).goal:null;
  const goalStrip=goal&&!to?`<div class="ap-standing"><span>${icon('flag')}<b>${home.shipId?'航行中':'目标'}</b> → ${esc(tileName(state.tiles[goal.toKey]))}${goal.blocked?` · <em>${esc(goal.blocked)}</em>`:' · 每回合开始自动前进'}</span><button class="ap-link" id="army-cancel-goal">取消</button></div>`:'';
  const orderStrip=goalStrip+(standing&&!to?`<div class="ap-standing"><span>${icon('flag')}<b>远行中</b> → ${esc(tileName(state.tiles[standing.toKey]))}${standing.blocked?` · <em>${esc(standing.blocked)}</em>`:standing.turns?` · 还要 ${standing.turns} 回合，每回合开始自动走`:''}</span><button class="ap-link" id="army-cancel-order">取消远行</button></div>`:'');
  let order='';
  if(!to){
    const can=home.shipId?[moveKeys.length?'<b class="w">白框</b>的海面航行、岸边卸人':'',attackKeys.length?'<b class="r">红框</b>登陆作战':'','更远的海面会分几回合开过去'].filter(Boolean):[moveKeys.length?'<b class="w">白框</b>行军':'',attackKeys.length?'<b class="r">红框</b>进攻':'',typeof getMarchPlan==='function'?'更远处下<b class="f">远行令</b>':''].filter(Boolean);
    const say=explicitSplit&&!going.length?'先点亮这次要出发的人':can.length?`点地图上${can.join('，')}`:moveReason?`${esc(moveReason)}`:'旁边没有能走或能打的地方';
    // 集结 lives in the tile's 军务 too; here it is one tap away from the army that needs the Sazai.
    const rally=home.shipId?null:getActions(state,home.key).find(a=>a.type==='rally'),canRally=Boolean(rally&&(rally.enabled||rally.effects?.previewAvailable));
    const others=Object.values(state.tiles).filter(t=>t.ownerId===state.playerId&&t.field?.length&&t.key!==home.key).length;
    const tileFly=!home.shipId&&typeof campaignUI!=='undefined'&&campaignUI?.flightInfo?campaignUI.flightInfo(home.key):null;
    order=`<div class="ap-order"><p class="ap-hint">${say}</p><div class="ap-actions">${tileFly?.available?`<button type="button" class="ap-mini sky" id="army-fly" title="会飞的同伴或机场飞机跨山越海起飞">${icon('compass')}${home.building==='airfield'?'起飞':'飞行'}</button>`:''}${home.field.length>1&&!explicitSplit&&!selField.length?`<button type="button" class="ap-mini" id="army-split" title="只让一部分同伴出发，其余留在原地">${icon('swap')}分队</button>`:''}${canRally?`<button type="button" class="ap-mini" id="army-rally" title="从后方调罪袋到这里：地图上的卡片里定人数，金框是出人的地">${icon('heroes')}集结${rally.enabled?` +${rally.effects.troops}`:''}</button>`:''}${others&&!home.shipId&&typeof showMusterPreview==='function'?`<button type="button" class="ap-mini" id="army-muster" title="让其他编队都往这里走：地图上的卡片里看路线再下令">${icon('flag')}会师</button>`:''}${others?`<button type="button" class="ap-mini" id="army-next" aria-keyshortcuts="N">下一队 ${icon('arrow')}</button>`:''}</div></div>`;
  }else if(kind==='move'){
    const check=getActions(state,to.key,home.key,{troops:choice.amount,girls:going}).find(a=>a.type==='move'),steps=(splitting?getMarch(state,home.key,going):getMarch(state,home.key))[to.key];
    const budget=typeof getMarchBudget==='function'?getMarchBudget(state,home.key,going):MARCH_BUDGET;
    const warn=[choice.remaining<stats.need?`原地留 ${choice.remaining} 人，产出会降`:'',fortDepartureWarning(stats.fort,choice.remaining)].filter(Boolean)[0]||'';
    const ok=Boolean(check?.enabled&&choice.valid),why=!choice.valid?'至少带 1 名罪袋或 1 位同伴。':check?.reason||'';
    order=`<div class="ap-order target"><div class="ap-goal"><h4>${selField.length&&selField.length<home.field.length?'分队行军':'行军'} → ${esc(tileName(to))}<button class="ap-link" id="army-untarget">换目标</button></h4><p>路程 ${format(steps)}/${budget} · ${check?.cost?.supply===0?'辎重随行，不花补给':'1 补给'} · 不花指令${going.length?` · ${going.length} 位同伴同行`:''}</p>${roomNote?`<p class="ap-room">${esc(roomNote)}</p>`:''}${warn?`<p class="alarm">${esc(warn)}</p>`:''}${ok?'':`<p class="alarm">${esc(why)}</p>`}</div><button class="ap-go cs-burst" id="army-go" ${ok?'':'aria-disabled="true"'}><span>行军！</span></button></div>`;
  }else if(kind==='far'){
    const plan=armyFarPlan(to.key,home),road=!moveReason&&typeof getRoadMarchAdvice==='function'?getRoadMarchAdvice(state,home.key,to.key,{troops:choice.amount,girls:going}):null;
    const ok=Boolean(plan?.enabled&&choice.valid),why=!choice.valid?'至少带 1 名罪袋或 1 位同伴。':plan?.reason||'';
    const days=plan?plan.turns-(plan.startsNow?1:0):0;
    order=`<div class="ap-order target far"><div class="ap-goal"><h4>${selField.length&&selField.length<home.field.length?'分队远行':'远行'} → ${esc(tileName(to))}<button class="ap-link" id="army-untarget">换目标</button></h4><p>${plan?.direct?'下回合开始时走到':`分 ${plan?.turns} 段走完`}，<b>第 ${plan?.arrivesTurn} 回合到</b>${days>0?`（${days} 回合后）`:''} · ${plan?.supplyPerDay?'每段 1 补给':'辎重随行，不花补给'} · 不花指令</p><p>${plan?.startsNow?`今天先走到 ${esc(tileName(state.tiles[plan.firstStop]))}，之后每回合开始自动前进，不用再点。`:esc(plan?.waiting||'')}</p>${roomNote?`<p class="ap-room">${esc(roomNote)}</p>`:''}${ok?'':`<p class="alarm">${esc(why)}</p>`}</div><button class="ap-go cs-burst" id="army-go" ${ok?'':'aria-disabled="true"'}><span>远行！</span></button>${road?`<button class="ap-mini" id="army-road" title="在 ${esc(road.key)} 修一段路（${esc(costLine(road.cost))}），这回合就能走到">${icon('map')}修路，今天就到</button>`:''}</div>`;
  }else if(kind==='attack'){
    const p=previewAttack(state,home.key,to.key,choice.amount,going),foe=state.factions[to.ownerId];
    const peace=/宣战/.test(p.reason||'')&&!/谁也不能/.test(p.reason||'');
    const guard=departureGuardWarning(state,home,choice.remaining,p.ok?p.commanders?.attacker||going:going,departureRemainingElite(home,{attack:true,preview:p}));
    const warn=[guard,choice.remaining<stats.need?`原地留 ${choice.remaining} 人，产出会降`:''].filter(Boolean)[0]||'';
    const ok=Boolean(p.ok&&p.canAttack&&choice.valid),why=!choice.valid?'至少带 1 名罪袋或 1 位同伴。':p.reason||p.error||'';
    const odds=p.ok&&!p.occupy&&p.forces?`<p class="ap-odds"><span>我方 <b>${format(p.forces.attacker.rating)}</b></span><span>守方 <b>${format(p.forces.defender.rating)}</b></span>${p.flank>0?`<span>夹击 +${p.flank}</span>`:''}<small>战力估算，不是胜率</small></p>`:p.occupy?'<p>对方没有守军，直接占领。</p>':'';
    const free=p.ok&&p.vanguard?`<p class="ap-free">先锋 ${esc(state.characters[p.vanguard]?.name||'')} 带头：这次进攻不花指令。</p>`:'';
    // A building there: the same card raids it instead — one switch, one line of what is lost and won, one burst.
    const canRaid=Boolean(to.building&&!peace&&typeof previewRaid==='function');if(!canRaid)armyRaid=false;
    const modes=canRaid?`<span class="ap-modes raid" role="group" aria-label="进攻或劫掠"><button data-army-raid="0" aria-pressed="${!armyRaid}">进攻</button><button data-army-raid="1" aria-pressed="${armyRaid}">劫掠</button></span>`:'';
    if(armyRaid){
      const r=previewRaid(state,home.key,to.key,choice.amount,going),bname=BUILDINGS[to.building]?.name||'建筑',okR=Boolean(r.ok&&r.canAttack&&choice.valid),whyR=!choice.valid?'至少带 1 名罪袋或 1 位同伴。':r.reason||r.error||'';
      order=`<div class="ap-order target attack"><div class="ap-goal"><h4>劫掠 → ${esc(bname)} Lv ${to.buildingLevel||1}${foe?`<small>${esc(foe.name)}</small>`:''}${modes}<button class="ap-link" id="army-untarget">换目标</button></h4><p>拆掉它，抢回 ${priceHtml({gold:r.loot?.gold||0,supply:r.loot?.supply||0},{hideAp:true})||'一点东西'} · 不占地</p><p>${r.occupy?'没有守军：直接拆。':'有守军：先打一场战棋，赢了才拆。'}${r.cost?` 花 ${esc(costLine(r.cost))}。`:''}</p>${okR?'':`<p class="alarm">${esc(whyR)}</p>`}</div><button class="ap-go cs-burst red" id="army-go" ${okR?'':'aria-disabled="true"'}><span>劫掠！</span></button></div>`;
    }else     order=`<div class="ap-order target attack"><div class="ap-goal"><h4>${p.occupy?'占领':'进攻'} → ${esc(tileName(to))}${foe?`<small>${esc(foe.name)}</small>`:''}${modes}<button class="ap-link" id="army-untarget">换目标</button></h4>${odds}${free}${warn?`<p class="alarm">${esc(warn)}</p>`:''}${ok?(p.occupy?'':'<p>点下去就进战棋，开打不能撤销。</p>'):`<p class="alarm">${esc(why)}</p>`}${ok&&!p.occupy?`<details class="ap-more"><summary>双方阵容</summary>${forcePreviewHtml(p)}</details>`:''}</div>${peace?`<button class="ap-go cs-burst talk" id="army-talk"><span>去谈判</span></button>`:`<button class="ap-go cs-burst red" id="army-go" ${ok?'':'aria-disabled="true"'}><span>${p.occupy?'占领！':'进攻！'}</span></button>`}</div>`;
  }else if(kind==='objective'){
    const ways=armyWaypoints.filter(k=>k!==to.key),plan=routeQuote(state,home.key,to.key,{girls:going,troops:choice.amount,waypoints:ways}),mode=typeof armyProfile==='function'?armyProfile(state,home.key).mode:'main';
    const ok=Boolean(plan.enabled&&choice.valid),why=!choice.valid?'至少带 1 名罪袋或 1 位同伴。':plan.reason||'';
    const enemy=to.ownerId&&to.ownerId!==state.playerId?state.factions[to.ownerId]:null;
    order=`<div class="ap-order target far"><div class="ap-goal"><h4>目标 → ${esc(tileName(to))}${enemy?`<small>${esc(enemy.name)}</small>`:''}<button class="ap-link" id="army-untarget">换目标</button></h4><p>${ok?`大约 <b>${plan.turns} 回合</b>到 · 每回合开始自动前进 · 不花指令`:''}${ways.length?` · 途经 ${ways.length} 处`:''}</p>${plan.partial&&plan.blocker?`<p class="ap-room">${plan.reach?.length>1?`先走到 ${esc(tileName(state.tiles[plan.reach.at(-1)]))} 等着；`:'现在原地等着；'}${esc(plan.blocker)}。</p>`:''}<p>${mode==='free'?'自由部队：路上遇敌自动开打，按战力加一点运气结算。':'主力部队：路上遇敌进战棋，你来指挥。'}</p>${ok?'':`<p class="alarm">${esc(why)}</p>`}<div class="ap-mini-row"><button class="ap-mini ${armyRouting?'on':''}" id="army-route">${armyRouting?'改完了':'改道'}</button>${ways.length?'<button class="ap-mini" id="army-route-clear">清除途经</button>':''}${armyRouting?'<small class="ap-hint">点地图上的地块，路线就从那里绕；再点一次取消。</small>':''}</div></div><button class="ap-go cs-burst" id="army-go" ${ok?'':'aria-disabled="true"'}><span>${plan.partial&&!(plan.reach?.length>1)?'定目标！':'出发！'}</span></button></div>`;
  }else if(kind==='sail'){
    const ship=shipOf(home),route=shipRoute(state,ship.id,to.key),speed=shipSpeed(state,ship),q=getShipVoyageQuote(state,ship.id,to.key),enemy=to.shipId&&to.ownerId!==state.playerId;
    const turns=route?Math.ceil((route.path.length-1)/speed):0,now=route&&route.path.length-1<=speed,ok=Boolean(route&&q.enabled);
    order=`<div class="ap-order target ${enemy?'attack':'far'}"><div class="ap-goal"><h4>${enemy?'海战':'航行'} → ${esc(to.key)}<button class="ap-link" id="army-untarget">换目标</button></h4><p>${route?`${route.path.length-1} 格 · 航速 ${speed} · ${now?'这回合就到':`<b>${turns} 回合</b>到，之后每回合自动开`}`:''} · 1 补给/回合</p>${ok?'':`<p class="alarm">${esc(q.reason||'开不过去。')}</p>`}</div><button class="ap-go cs-burst ${enemy?'red':''}" id="army-go" ${ok?'':'aria-disabled="true"'}><span>${enemy?'开战！':'出航！'}</span></button></div>`;
  }else if(kind==='board'||kind==='unload'){
    const shipTile=kind==='board'?to:home,ship=state.campaign.ships[shipTile.shipId],cap=SHIP_MODELS[ship.modelId]?.capacity||8,aboard=shipTile.troops+shipTile.field.length+shipTile.garrison.length;
    const ok=Boolean(choice.valid&&(kind==='unload'||aboard+going.length+choice.amount<=cap));
    order=`<div class="ap-order target"><div class="ap-goal"><h4>${kind==='board'?`登船 → ${esc(SHIP_MODELS[ship.modelId]?.name||'船')}`:`下船 → ${esc(tileName(to))}`}<button class="ap-link" id="army-untarget">换目标</button></h4><p>船上 ${aboard}/${cap} 人 · ${going.length?`${going.length} 位同伴、`:''}${choice.amount} 名罪袋 · 不花指令</p>${ok?'':`<p class="alarm">${esc(!choice.valid?'至少带 1 名罪袋或 1 位同伴。':'船装不下这么多人。')}</p>`}</div><button class="ap-go cs-burst" id="army-go" ${ok?'':'aria-disabled="true"'}><span>${kind==='board'?'登船！':'下船！'}</span></button></div>`;
  }else if(kind==='landing'){
    const foe=to.ownerId?state.factions[to.ownerId]:null,ok=Boolean(choice.valid&&(going.length||choice.amount));
    order=`<div class="ap-order target attack"><div class="ap-goal"><h4>${foe?'登陆作战':'登陆'} → ${esc(tileName(to))}${foe?`<small>${esc(foe.name)}</small>`:''}<button class="ap-link" id="army-untarget">换目标</button></h4><p>${foe?'从船上直接打上岸：2 指令，进战棋。':'占下这块无主海岸：2 指令、2 补给。'}</p>${ok?'':'<p class="alarm">至少带 1 名罪袋或 1 位同伴。</p>'}</div><button class="ap-go cs-burst red" id="army-go" ${ok?'':'aria-disabled="true"'}><span>登陆！</span></button></div>`;
  }else if(kind==='road'){
    const road=getRoadMarchAdvice(state,home.key,to.key,{troops:choice.amount,girls:going});
    order=road?`<div class="ap-order target"><div class="ap-goal"><h4>${esc(tileName(to))} 太远了<button class="ap-link" id="army-untarget">换目标</button></h4><p>在 ${esc(road.key)} 修路（${esc(costLine(road.cost))}）后，路程 ${format(road.route)}/${MARCH_BUDGET}，就能走到。只修路，不会自动出发。</p></div><button class="ap-go cs-burst" id="army-go"><span>修路</span></button></div>`:'';
  }
  const lead=state.characters[home.field[0]];
  if(typeof armyRoute==='function')armyRoute();
  const swapHint=explicitSplit?'点头像<br>选人':selField.length?'点驻地<br>驻守':selStation.length?'点编队<br>入队':'点头像<br>选中';
  morph(box,`<div class="ap-in ${home.field.length>6?'many':''}"><header class="ap-head"><span class="ap-flag" aria-hidden="true">${lead?`<img src="${esc(portraitUrl(lead,'smile')||'')}" alt="" />`:'<img src="assets/sazai.webp" alt="" />'}</span><h3>${home.shipId?esc(SHIP_MODELS[shipOf(home)?.modelId]?.name||'船'):'编队'}<small>${esc(home.shipId?home.key:`${tileName(home)} ${home.key}`)}</small></h3>${typeof armyModeHtml==='function'?armyModeHtml(home):''}<span class="ap-state ${status[0]}">${esc(status[1])}</span><button type="button" class="ap-mini" id="army-tile" title="看这块地：建设、征募、驻扎">${icon('castle')}地块</button><button type="button" class="ap-mini ap-fold-btn" id="army-fold" aria-expanded="${!armyFolded}" title="${armyFolded?'展开编队面板':'收起面板看地图'}">${armyFolded?'展开 ▴':'收起 ▾'}</button><button class="tag-close" id="army-close" aria-label="关闭编队">${icon('close')}</button></header><div class="ap-body">
    ${orderStrip}${splitBar}${selBar}<div class="ap-crew"><div class="ap-row march ${selStation.length&&!selField.length?'drop-zone':''}" id="army-march-box" aria-label="编队成员">${crew}</div><button type="button" class="ap-swap ${selField.length?'to-station':selStation.length?'to-march':''}" id="army-swap-btn" title="${selField.length?'让选中角色留在驻地':selStation.length?'让选中角色加入编队':'先点角色头像选中'}">${icon('arrow')}<small>${swapHint}</small></button><div class="ap-row station ${selField.length?'drop-zone':''}" id="army-station-box" aria-label="驻地"><span class="ap-label">驻地 ${home.garrison.length}/${MAX_SEATS}${selField.length?' · 点此驻守':''}</span><div class="ap-seats">${seats}</div></div></div>
    ${typeof armyFreeHtml==='function'?armyFreeHtml(home):''}${troopsRow}${order}</div></div>`);
  box.hidden=false;
  const view={state,key:home.key,target:armyTarget},live=()=>state===view.state&&armyKey===view.key&&armyTarget===view.target&&!state.battle;
  box.querySelectorAll('[data-army-select]').forEach(b=>b.onclick=e=>{e?.stopPropagation?.();if(e?.detail>1||!live())return;armyToggleSelect(b.dataset.armySelect);});
  box.querySelectorAll('[data-army-pick]').forEach(b=>b.onclick=e=>{e?.stopPropagation?.();if(e?.detail>1||!live())return;armyPick(b.dataset.armyPick);});
  box.querySelectorAll('[data-army-pick-all]').forEach(b=>b.onclick=()=>{if(live())armyPick(null,b.dataset.armyPickAll);});
  if($('army-station-box'))$('army-station-box').onclick=e=>{if(!live()||!selField.length||e.target?.closest?.('[data-army-select]'))return;armyMoveSelected(true);};
  if($('army-march-box'))$('army-march-box').onclick=e=>{if(!live()||!selStation.length||selField.length||e.target?.closest?.('[data-army-select]'))return;armyMoveSelected(false);};
  if($('army-swap-btn'))$('army-swap-btn').onclick=()=>{if(!live())return;if(selField.length)armyMoveSelected(true);else if(selStation.length)armyMoveSelected(false);else toast('先点一位角色头像选中她。');};
  if($('army-to-station'))$('army-to-station').onclick=()=>{if(live())armyMoveSelected(true);};
  if($('army-to-march'))$('army-to-march').onclick=()=>{if(live())armyMoveSelected(false);};
  if($('army-to-duty'))$('army-to-duty').onclick=()=>{if(live()&&selAll[0])startHeroDutyPick(selAll[0],home.key);};
  if($('army-char-fly'))$('army-char-fly').onclick=()=>{if(!live()||typeof campaignUI==='undefined'||!campaignUI?.startFlight)return;const ids=[...selAll];campaignUI.startFlight(home.key,ids,()=>{if(armyTile(home.key)){selectArmy(home.key);armySel={key:home.key,ids:new Set(ids)};renderArmy();}});};
  if($('army-fly'))$('army-fly').onclick=()=>{if(!live()||typeof campaignUI==='undefined'||!campaignUI?.startFlight)return;campaignUI.startFlight(home.key,null,()=>{if(armyTile(home.key))selectArmy(home.key);});};
  if($('army-char-sheet'))$('army-char-sheet').onclick=()=>{if(live()&&selAll[0]&&typeof showCharacter==='function')showCharacter(selAll[0]);};
  if($('army-sel-clear'))$('army-sel-clear').onclick=()=>{if(!live())return;armySel=null;armyPlans.delete(home.key);armyRoute();worldMap.setHints(mapHints());renderArmy();placeMarkers();};
  if($('army-fold'))$('army-fold').onclick=()=>{if(!live())return;armyFolded=!armyFolded;renderArmy();fitArmy(armyTarget||armyKey);};
  box.querySelectorAll('[data-army-step]').forEach(b=>b.onclick=()=>{if(!live())return;armyPlans.set(home.key,Math.max(choice.min,Math.min(choice.max,choice.amount+Number(b.dataset.armyStep))));renderArmy();});
  box.querySelectorAll('[data-army-preset]').forEach(b=>b.onclick=()=>{if(!live())return;const v=b.dataset.armyPreset;if(v==='safe')armyPlans.delete(home.key);else armyPlans.set(home.key,v==='max'?choice.max:0);renderArmy();});
  if(typeof bindArmyMode==='function')bindArmyMode(box,home,live);
  if($('army-route'))$('army-route').onclick=()=>{if(!live())return;armyRouting=!armyRouting;renderArmy();};
  if($('army-route-clear'))$('army-route-clear').onclick=()=>{if(!live())return;armyWaypoints=[];armyRoute();renderArmy();placeMarkers();};
  if($('army-cancel-goal'))$('army-cancel-goal').onclick=()=>{if(!live())return;const r=runAction(home.shipId?{type:'setShipGoal',shipId:home.shipId,toKey:null}:{type:'cancelArmyObjective',key:home.key});if(r.ok){toast('目标取消了，队伍留在原地。');selectArmy(home.key);}};
  if($('army-close'))$('army-close').onclick=()=>{if(live())clearArmy();};
  if($('army-tile'))$('army-tile').onclick=()=>{if(!live())return;const key=home.key;clearArmy();selectTile(key);};
  if($('army-next'))$('army-next').onclick=()=>{if(live())nextArmy(1);};
  if($('army-rally'))$('army-rally').onclick=()=>{if(!live())return;if(typeof openRingForm==='function')openRingForm(home.key,'集结');else showRallyPreview(home.key);};
  if($('army-muster'))$('army-muster').onclick=()=>{if(!live())return;if(typeof openRingForm==='function')openRingForm(home.key,'会师');else showMusterPreview(home.key);};
  if($('army-split'))$('army-split').onclick=()=>{if(live())armySplitToggle(true);};
  if($('army-split-off'))$('army-split-off').onclick=()=>{if(live())armySplitToggle(false);};
  if($('army-cancel-order'))$('army-cancel-order').onclick=()=>{if(!live()||!standing)return;const result=runAction({type:'cancelMarch',id:standing.id});if(result.ok){toast('远行令取消了，队伍留在原地。');if(armyTile(view.key))selectArmy(view.key);}};
  if($('army-untarget'))$('army-untarget').onclick=()=>{if(!live())return;armyTarget=null;armyRoute();renderArmy();placeMarkers();};
  if($('army-talk'))$('army-talk').onclick=()=>{if(live()&&to)showTalks(to.ownerId);};
  box.querySelectorAll('[data-army-raid]').forEach(b=>b.onclick=()=>{if(!live())return;armyRaid=b.dataset.armyRaid==='1';renderArmy();});
  if($('army-road'))$('army-road').onclick=()=>{
    if(!live()||!to)return;
    const road=getRoadMarchAdvice(state,home.key,to.key,{troops:choice.amount,girls:going});
    if(!road){toast('局势变了，请重新选择目标。',true);renderArmy();return;}
    const from=home.key,target=to.key;
    runAction(road.action,{onCommitted:()=>{armyKey=from;armyTarget=target;}});
    if(armyTile(from)){armyKey=from;setArmyTarget(target);}
  };
  const go=$('army-go');if(go)go.onclick=e=>{if(e.detail>1||!live())return;if(go.getAttribute('aria-disabled')==='true'){toast(box.querySelector('.ap-goal .alarm')?.textContent||'现在还不能出发。',true);return;}armyGo();};
  placeArmy();
}
/** 主力 / 自由: main armies fight on the board; free ones choose their own fights and settle them by numbers. */
function armyModeHtml(home){
  const mode=home.shipId?(shipOf(home)?.mode||'main'):typeof armyProfile==='function'?armyProfile(state,home.key).mode:'main';
  return `<span class="ap-modes" role="group" aria-label="部队类型"><button data-army-mode="main" aria-pressed="${mode==='main'}" title="主力：遇敌进战棋，你来指挥">主力</button><button data-army-mode="free" aria-pressed="${mode==='free'}" title="自由：自己找仗打，战斗自动结算">自由</button></span>`;
}
function armyFreeHtml(home){
  if(home.shipId)return '';
  const record=state.campaign?.armies?.[home.key]||{},mode=record.mode||'main';if(mode!=='free')return '';
  const foes=Object.values(state.factions).filter(f=>f.alive&&!f.isPlayer&&getRelation(state,f.id)?.status==='war');
  const enemy=foes.find(f=>f.id===record.enemyId)?.id||null,strategy=record.strategy||'capital';
  return `<div class="ap-free-row"><span class="ap-label">方针</span><button data-army-strategy="capital" aria-pressed="${strategy==='capital'}">打首都</button><button data-army-strategy="open" aria-pressed="${strategy==='open'}">占空地</button>${foes.length?`<span class="ap-label">打谁</span>${foes.map(f=>`<button data-army-enemy="${esc(f.id)}" aria-pressed="${f.id===enemy}" style="--c:${esc(f.color)}">${esc(f.name)}</button>`).join('')}`:'<small>现在没在打仗：开战后它会自己出发。</small>'}${foes.length&&!enemy?'<small>点一个国家，它就自己往那边打。</small>':''}</div>`;
}
function bindArmyMode(box,home,live){
  box.querySelectorAll('[data-army-mode]').forEach(b=>b.onclick=()=>{
    if(!live())return;const mode=b.dataset.armyMode,record=state.campaign?.armies?.[home.key]||{};
    const r=runAction(home.shipId?{type:'setShipMode',shipId:home.shipId,mode}:{type:'setArmyMode',key:home.key,mode,enemyId:record.enemyId||null,strategy:record.strategy||'capital'});
    if(r.ok){toast(mode==='free'?'改成自由部队：遇敌自动结算，不进战棋。':'改成主力：遇敌进战棋。');if(armyTile(home.key))selectArmy(home.key);}
  });
  const set=(patch)=>{if(!live())return;const record=state.campaign?.armies?.[home.key]||{};const r=runAction({type:'setArmyMode',key:home.key,mode:'free',enemyId:record.enemyId||null,strategy:record.strategy||'capital',...patch});if(r.ok&&armyTile(home.key))selectArmy(home.key);};
  box.querySelectorAll('[data-army-strategy]').forEach(b=>b.onclick=()=>set({strategy:b.dataset.armyStrategy}));
  box.querySelectorAll('[data-army-enemy]').forEach(b=>b.onclick=()=>set({enemyId:b.dataset.armyEnemy}));
}
/** Where the card sits: beside the leader on a wide screen, a sheet along the bottom on phones and mid widths, a column on a short landscape screen. */
function placeArmy(){
  const box=$('army-panel'),open=Boolean(box&&!box.hidden&&(armyTile()||(typeof mapPick!=='undefined'&&mapPick))),w=window.innerWidth,h=window.innerHeight;
  // Any phone held sideways gets the column: a bottom sheet would leave its own button under the fold.
  const side=h<=520&&w>=560,sheet=!side&&w<1024;
  if(box){box.classList.toggle('ap-sheet',open&&sheet);box.classList.toggle('ap-side',open&&side);}
  document.body.classList.toggle('army-sheet',open&&sheet);document.body.classList.toggle('army-side',open&&side);
  document.body.classList.toggle('sheet-open',Boolean((open&&isPhone())||(flowerOpen&&!$('flower').hidden&&!state.battle&&isPhone())));
  duckPanels();
}
/** Keep the army (and the tile it is looking at) in the part of the map the card does not cover. */
function fitArmy(focus=armyKey){
  const box=$('army-panel'),home=armyTile();if(!box||box.hidden||!home)return;
  const r=box.getBoundingClientRect(),w=window.innerWidth,h=window.innerHeight,goals=$('goals')?.getBoundingClientRect();
  const hud=[goals,$('ledger')?.getBoundingClientRect(),isPhone()?document.querySelector('.view-tools')?.getBoundingClientRect():null].filter(r=>r&&r.height);
  const wall={left:56,right:56,top:Math.max(80,...hud.map(r=>r.bottom+34)),bottom:70};
  if(box.classList?.contains?.('ap-side'))wall.right=Math.max(wall.right,w-r.left+50);else wall.bottom=Math.max(wall.bottom,h-r.top+56);
  const points=[home.key,...(focus&&focus!==home.key?[focus]:[])].map(key=>worldMap.screenOf(key)).filter(Boolean);if(!points.length)return;
  const xs=points.map(p=>p.x),ys=points.map(p=>p.y),fit=(lo,hi,min,max)=>hi-lo>max-min?(min+max)/2-(lo+hi)/2:lo<min?min-lo:hi>max?max-hi:0;
  // The army also should not sit on the card's edge, where the tiles it can reach would hide under the card.
  const top=wall.top,bottom=h-wall.bottom,low=top+(bottom-top)*.62,y=Math.max(...ys);
  const dy=fit(Math.min(...ys),y,top,bottom)||(points.length===1&&y>low?top+(bottom-top)*.45-y:0);
  worldMap.glideBy(fit(Math.min(...xs),Math.max(...xs),wall.left,w-wall.right),dy);
}
const costLine=cost=>actionCost(cost);
function shortWhy(action){return disabledReason(state,action);}
/* ---------------------------------------------------------------------------------------------
   The tile ring. Orders open onto the six hexes around the tile you touched, and every kind of
   order always lives in the same hex so the hand learns it:
     0 征募 (top right) · 1 建设▸ / 主操作 · 2 推荐 · 3 军务▸ · 4 出征 / 外交 · 5 驻扎 / 取消
   A hex that holds several orders opens a sub-ring around the same tile; its petal becomes 返回.
   The card with the tile's numbers always sits outside the ring (beside it on a desktop, as a
   sheet along the bottom on a phone), so a petal never covers what it is about.
   Extra orders from extensions.mjs join the 建设 or 军务 sub-rings through registerTileAction().
   --------------------------------------------------------------------------------------------- */
/* ---- 内政·要事: what is worth doing now, each with one button to where it is done (the map, when it is about land). ---- */
var govPick=null,citySiteCache={state:null,revision:-1,keys:[]};
const stripCoord=label=>String(label).replace(/^-?\d+,-?\d+\s*·\s*/,'');
/** Land where a city could stand (the mayor, price and commands are chosen in the tile's 建城 card). */
function citySites(){
  if(typeof hasTech!=='function'||!hasTech(state,'administration'))return [];
  if(citySiteCache.state===state&&citySiteCache.revision===state.revision)return citySiteCache.keys;
  const keys=Object.values(state.tiles).filter(t=>t.ownerId===state.playerId&&t.discovered&&!t.isCapital&&!t.shipId&&state.terrainTypes[t.terrainId]?.passable&&!state.campaign?.cities?.[t.key]&&!/请在己方|至少相隔/.test(cityQuote(state,t.key,'').reason||'')).map(t=>t.key);
  citySiteCache={state,revision:state.revision,keys};return keys;
}
function govTodos(tab){
  if((typeof practice!=='undefined'&&practice)||state.battle)return [];
  const stats=getStats(state),me=state.factions[state.playerId],todo=[],net=stats.income.supply;
  if(net<0)todo.push({icon:'wheat',tone:'bad',text:`粮每回合 ${net}，库存还能撑 ${Math.floor(me.supply/-net)} 回合`,acts:[['买粮','tab:treasury'],['地图上自救 ›','map:recovery']]});
  const record=typeof techOf==='function'?techOf(state):null;
  if(record&&!record.active&&TECHNOLOGIES.some(t=>researchQuote(state,t.id).enabled))todo.push({icon:'spark',text:'现在没有在研究',acts:[['选科技 ›','tab:tech']]});
  const slots=typeof EDICT_SLOTS!=='undefined'?EDICT_SLOTS.filter(chapter=>state.milestone.level>=chapter).length:0,used=(state.edicts||[]).length;
  if(slots>used)todo.push({icon:'scroll',text:`国策还有 ${slots-used} 栏空着`,acts:[['选国策 ›','tab:edict']]});
  if(typeof idleBadge==='function'){idleBadge();if(idleBadgeCache.plan)todo.push({icon:'heroes',text:`${idleBadgeCache.plan} 位同伴闲着，能去管地多产`,acts:[['派去管事 ›','map:duty']]});}
  const sites=citySites().length;if(sites&&!citiesOf(state).length)todo.push({icon:'castle',text:`能建城了，有 ${sites} 处地方可选`,acts:[['在地图上挑地方 ›','map:city']]});
  const up=upgradableKeys().size;if(up)todo.push({icon:'upload',text:`${up} 处建筑能升级`,acts:[['地图上看 ›','map:upgrade']]});
  const train=getArmyTrainingQuote(state);if(train.enabled)todo.push({icon:'shield',text:`常备军能练到 Lv ${train.nextLevel}`,acts:[['去练兵 ›','tab:army']]});
  // A page that already has the button right below does not repeat it here.
  const here={build:['map:city'],army:['tab:army'],edict:['tab:edict'],tech:['tab:tech']}[tab]||[];
  return todo.filter(item=>!(item.acts.length===1&&(item.acts[0][1]===`tab:${tab}`||here.includes(item.acts[0][1])))).slice(0,4);
}
function govTodoHtml(list){
  return list.length?`<p class="gv-todo-head">${icon('flag')}<b>要事</b><small>点按钮直接去办</small></p><ul>${list.map(t=>`<li class="${t.tone||''}">${icon(t.icon)}<span>${esc(t.text)}</span><em>${t.acts.map(([label,go])=>`<button type="button" class="gv-go" data-gov-go="${esc(go)}">${esc(label)}</button>`).join('')}</em></li>`).join('')}</ul>`:'';
}
function govGo(go){
  const [kind,what]=String(go).split(':');
  if(kind==='tab'){if(typeof govPick==='function')govPick(what);return;}
  if(what==='duty'){closeModal();showDutyPlan({back:true});}
  else if(what==='city')cityOnMap(true);
  else if(what==='upgrade'){closeModal();jumpToUpgrade();}
  else if(what==='recovery')recoveryOnMap();
}
/** 建城 on the map: frames on every place a city could stand, the far ones first (that is where a city helps most). */
function cityOnMap(back=false){
  const keys=new Set(citySites());
  if(!keys.size){toast(hasTech(state,'administration')?'现在没有能建城的地：离已有的城太近，或者还没有首都以外的领土。':'要先研究「行政学」才能建城。',true);return;}
  closeModal();
  const best=[...keys].sort((a,b)=>controlAt(state,state.tiles[a]).value-controlAt(state,state.tiles[b]).value||a.localeCompare(b))[0];
  beginMapPick({label:'建城',title:'挑地方建城',icon:'castle',initial:best,eligible:t=>keys.has(t.key),confirmLabel:'选这里',why:()=>'框起来的地才能建城：己方、不是首都、离别的城够远。',
    render:tile=>tile?`<h4>${esc(tileName(tile))}</h4><p class="cs-hint">这里现在控制力 ${controlAt(state,tile).percent}%。建城后这里 90%，往外每格 −7%：离首都越远越划算。下一步选市长。</p><p>${priceHtml(cityQuote(state,tile.key,'').cost)}</p>`:'<h4>点一块框起来的地</h4>',
    onPick:key=>openRingForm(key,'建城','build'),onCancel:back?()=>showManagement({tab:'build'}):undefined});
}
/** 一键建设 on the map: the batch framed where it goes, the list beside, one burst. */
function developmentOnMap(settings){
  const plan=getDevelopmentPlan(state,settings),keys=new Set((plan?.actions||[]).map(job=>job.action.key));
  if(!keys.size){toast('这回合没有做得起的建设：换个方向或少留点金币。',true);return;}
  closeModal();
  beginMapPick({label:'一键建设',title:`这一批建设 · ${plan.actions.length} 项 · ${MANAGEMENT_MODES[settings.mode]||''}`,icon:'castle',initial:plan.actions[0].action.key,eligible:t=>keys.has(t.key),confirmLabel:'开工！',why:()=>'金框是这一批要盖的地。',
    ready:()=>Boolean(getDevelopmentPlan(state,settings)?.actions?.length),
    render:tile=>{const now=getDevelopmentPlan(state,settings);return `<ul class="ring-roster dev-plan">${now.actions.map((job,i)=>`<li class="${tile?.key===job.action.key?'on':''}"><i>${i+1}</i><span><b>${esc(tileName(state.tiles[job.action.key]))} · ${esc(stripCoord(job.label))}</b><small>${format(job.cost?.gold||0)} 金 · ${format(job.cost?.supply||0)} 粮 · ${job.cost?.ap||0} 令</small></span></li>`).join('')}</ul><p>${priceHtml(now)}</p><p class="cs-hint">金币至少留 ${format(settings.reserve)}。点一块金框看是哪一项。</p>`;},
    onPick:()=>{const r=runAction({type:'develop',...settings});if(r.ok)toast('这一批建设开工了。');},onCancel:()=>showManagement({tab:'build'})});
}
/** 缺粮自救 on the map: the land where sending people home or planting an emergency field helps, then the tile's own card. */
function recoveryOnMap(){
  const keys=new Set(Object.values(state.tiles).filter(t=>t.ownerId===state.playerId&&!t.shipId&&t.cutSince===undefined&&(t.troops>1||t.building!=='garden')).map(t=>t.key));
  if(!keys.size){toast('没有能自救的地。',true);return;}
  closeModal();
  const best=[...keys].sort((a,b)=>state.tiles[b].troops-state.tiles[a].troops||a.localeCompare(b))[0];
  beginMapPick({label:'缺粮自救',title:'缺粮自救：挑一块地',icon:'wheat',initial:best,eligible:t=>keys.has(t.key),confirmLabel:'选这里',why:()=>'挑一块自己的地：遣散这里闲着的罪袋，或者改成应急田圃。',
    render:tile=>tile?`<h4>${esc(tileName(tile))} · ${tile.troops} 人</h4><p class="cs-hint">下一步选：遣散几个人省粮，或者把这里改成应急田圃。都会先告诉你每回合粮变成多少。</p>`:'<h4>点一块框起来的地</h4>',
    onPick:key=>openRingForm(key,'缺粮自救','army'),onCancel:()=>showManagement({tab:'treasury'})});
}
/* ---- 差事: a girl who is not out fighting works this land. The card picks who and which job; the map frames where she is now. ---- */
function dutyFace(id,expr='smile'){const hero=state.characters[id];return hero&&typeof portraitUrl==='function'?`<img src="${esc(portraitUrl(hero,expr)||'assets/sazai.webp')}" alt="" />`:'<img src="assets/sazai.webp" alt="" />';}
function dutyChips(t,id,picked,{cls=''}={}){
  const full=typeof controlAt==='function'&&controlAt(state,t).percent>=100;
  return `<div class="pay-steps ring-steps duty-jobs ${cls}" role="group" aria-label="做什么">${DUTIES.map(d=>{const q=getDutyQuote(state,t.key,id,d.id),zero=!q.effect?.value,useless=zero||(d.id==='govern'&&full);return `<button type="button" data-duty-job="${d.id}" aria-pressed="${picked===d.id}" ${useless?'aria-disabled="true"':''} title="${esc(`${d.name}看${d.statName}：${d.about}`)}">${esc(d.name)}<small>${esc(zero?`${d.statName} 0`:useless?'控制力已满':q.line)}</small></button>`;}).join('')}</div>`;
}
function dutyForm(t){
  const box=$('flower'),here=dutyAt(state,t.key),list=getDutyCandidates(state,t.key);
  const d=box.dutyDraft?.key===t.key?box.dutyDraft:(box.dutyDraft={key:t.key,id:null,job:null,more:false});
  if(!list.some(c=>c.id===d.id))d.id=null;
  const pick=d.id?list.find(c=>c.id===d.id):null,job=pick?(d.job&&pick.jobs.some(j=>j.job===d.job)?d.job:pick.best.job):null;
  const now=here?`<div class="duty-now"><i>${dutyFace(here.id,'happy')}</i><span><b>${esc(state.characters[here.id]?.name||'')}</b><small>在这里${esc(DUTIES.find(x=>x.id===here.job)?.name||'')} · ${esc(dutyLine(getDutyQuote(state,t.key,here.id,here.job).effect))}${t.cutSince!==undefined?' · 和首都断了，暂停':''}</small></span><button type="button" class="small-button secondary" data-duty-recall="${esc(here.id)}">召回</button></div>${d.id?'':`${dutyChips(t,here.id,here.job,{cls:'mine'})}<p class="cs-hint">换差事不花指令；换人的话她回首都。</p>`}`:'';
  const shown=d.more?list:list.slice(0,4);
  const rows=shown.map(c=>`<li><button type="button" data-duty-who="${esc(c.id)}" aria-pressed="${c.id===d.id}"><i>${dutyFace(c.id)}</i><span><b>${esc(c.name)}</b><small>${esc(c.where||'')}${c.best.score>0?` · 最合适：${esc(DUTIES.find(x=>x.id===c.best.job).name)} ${esc(dutyLine(c.best.effect))}`:' · 这里帮不上忙'}</small></span></button></li>`).join('');
  const q=pick?getDutyQuote(state,t.key,pick.id,job):null;
  const html=`<p class="rf-say">派一位没在打仗的同伴管这块地：她离开编队、不上阵，按她的数值多产出。</p>${now}
    ${list.length?`<p class="duty-head">${here?'换人':'派谁来'}</p><ul class="ring-roster duty-pick">${rows}</ul>${list.length>shown.length?`<button type="button" class="small-button secondary" data-duty-more>还有 ${list.length-shown.length} 位</button>`:''}`:`<p class="alarm">${here?'':'现在没人能派：领军、副手、任职、出使、市长和远行中的同伴都走不开。'}</p>`}
    ${pick?`${dutyChips(t,pick.id,job)}${q.replaces?`<p class="cs-hint">${esc(state.characters[q.replaces]?.name||'')}会回首都。</p>`:''}<div class="rf-foot">${priceHtml(q)}<button class="cs-burst small" id="rf-go" ${q.enabled?'':'aria-disabled="true"'}><span>派驻！</span></button></div>${q.enabled?'':`<p class="alarm">${esc(q.reason)}</p>`}`:list.length?'<p class="cs-hint">点一位同伴，再选她做什么。派人花 1 令。</p>':''}`;
  const from=pick?Object.values(state.tiles).find(x=>(x.field||[]).includes(pick.id)||(x.garrison||[]).includes(pick.id))?.key:null;
  return {html,map:{marks:new Set(from&&from!==t.key?[from]:[])},bind:root=>{
    root.querySelectorAll('[data-duty-who]').forEach(b=>b.onclick=()=>{d.id=b.dataset.dutyWho===d.id?null:b.dataset.dutyWho;d.job=null;renderFlower();});
    root.querySelectorAll('[data-duty-job]').forEach(b=>b.onclick=()=>{if(b.getAttribute('aria-disabled')==='true'){toast(/已满/.test(b.textContent)?'这里控制力已经满了，治理帮不上忙。':'她这项数值是 0，做不来。',true);return;}
      if(here&&b.closest('.duty-jobs.mine')&&!pick){const q2=getDutyQuote(state,t.key,here.id,b.dataset.dutyJob);if(!q2.enabled){toast(q2.reason,true);return;}const r=runAction(q2.action);if(r.ok)toast(`${state.characters[here.id].name}改做${DUTIES.find(x=>x.id===b.dataset.dutyJob).name}：${q2.line}。`);return;}
      d.job=b.dataset.dutyJob;renderFlower();});
    const more=root.querySelector('[data-duty-more]');if(more)more.onclick=()=>{d.more=true;renderFlower();};
    const recall=root.querySelector('[data-duty-recall]');if(recall)recall.onclick=()=>{const id=recall.dataset.dutyRecall,r=runAction({type:'recallDuty',characterId:id});if(r.ok)toast(`${state.characters[id].name}回首都了。`);};
    const go=root.querySelector('#rf-go');if(go)go.onclick=e=>{if(e.detail>1)return;const now2=pick&&getDutyQuote(state,t.key,pick.id,job);if(!now2?.enabled){toast(now2?.reason||'先选人。',true);return;}const r=runAction(now2.action);if(!r.ok)return;box.dutyDraft=null;toast(`${pick.name}来这里${DUTIES.find(x=>x.id===job).name}：${now2.line}。`);};
  }};
}
/** 一键安排闲人: the plan on the map (gold frames where each goes), the list in the card, one burst for all of it. */
function showDutyPlan({back=false}={}){
  const plan=getDutyPlan(state);
  if(!plan.plan.length){toast(plan.idle?'闲着的同伴在哪儿都多产不了多少，先留着。':'现在没有闲着的同伴。');return;}
  const keys=plan.plan.map(p=>p.key),planned=new Set(keys);
  if(typeof beginMapPick!=='function'){const r=runAction(plan.action);if(r.ok)toast(`派出了 ${plan.plan.length} 位同伴。`);return;}
  beginMapPick({label:'安排闲人',title:'安排闲人',icon:'heroes',initial:keys[0],eligible:t=>planned.has(t.key),confirmLabel:'派驻！',
    why:()=>'点金框里的地，看是谁去那里。',
    ready:()=>Boolean(getDutyPlan(state).action),
    render:(tile)=>{const now=getDutyPlan(state);
      return `<h4>安排 ${now.plan.length} 位闲着的同伴</h4><p class="cs-hint">她们离开编队、不上阵，去框起来的地管事。点一块地看是谁。</p><ul class="ring-roster duty-plan">${now.plan.map(p=>`<li class="${tile?.key===p.key?'on':''}"><i>${dutyFace(p.characterId)}</i><span><b>${esc(p.name)} · ${esc(DUTIES.find(x=>x.id===p.job).name)}</b><small>${esc(tileName(state.tiles[p.key]))} · ${esc(p.line)}</small></span></li>`).join('')}</ul><p class="rf-say">每回合多产：${esc(dutyPlanTotal(now))}</p>${now.idle>now.plan.length?`<p class="cs-hint">还有 ${now.idle-now.plan.length} 位闲着：${now.plan.length>=now.land?'每块地只派一人，空着的地不够了，开拓更多地就能派。':now.plan.length>=now.limit?'这回合的指令不够，下回合再派。':'剩下的地她们去了也多产不了多少。'}</p>`:''}<p>${priceHtml(now)}</p>`;},
    onPick:()=>{const now=getDutyPlan(state);if(!now.action){toast('现在没有能派的。',true);return;}const r=runAction(now.action);if(r.ok)toast(`派出了 ${now.plan.length} 位同伴，每回合多产：${dutyPlanTotal(now)}。`);},onCancel:back?()=>showManagement():undefined});
}
function dutyPlanTotal(plan){const g=plan.plan.reduce((n,p)=>n+(p.effect.gold||0),0),s=plan.plan.reduce((n,p)=>n+(p.effect.supply||0),0),c=plan.plan.filter(p=>p.effect.control).length,m=plan.plan.filter(p=>p.effect.growth).length;return [g?`金 +${g}`:'',s?`粮 +${s}`:'',c?`${c} 块地控制力提高`:'',m?`${m} 块地人口长得更快`:''].filter(Boolean).join('、')||'一点点';}
/** 大工程: every advanced building and wonder this tile could take, as cards; one burst builds the picked one. */
const GRAND_ART=new Set(['workshop','factory','bank','centralbank','administrativehall','shipyard','airfield','wonder','hanginggardens','greatlibrary','grandbazaar','greatlighthouse','ironcitadel','starstage']);
function grandArt(id){const key=String(id).toLowerCase();return `assets/buildings/${GRAND_ART.has(key)?key:'home'}.webp`;}
function grandLine(id){const w=WONDERS[id];if(w)return w.line;return BUILDINGS[id]?.description||'';}
function grandForm(t,list){
  const box=$('flower');let pick=box.grandPick?.key===t.key?box.grandPick.id:null;
  const sorted=[...list].sort((a,b)=>Number(b.enabled)-Number(a.enabled)||Number(Boolean(WONDERS[a.action.building]))-Number(Boolean(WONDERS[b.action.building]))||(a.cost?.gold||0)-(b.cost?.gold||0));
  if(!sorted.some(a=>a.action.building===pick))pick=sorted[0]?.action.building;
  const chosen=sorted.find(a=>a.action.building===pick),wonder=WONDERS[pick],spec=ADVANCED_BUILDINGS[pick];
  const cards=sorted.map(a=>{const id=a.action.building,w=WONDERS[id];return `<button class="gp-card ${id===pick?'on':''} ${a.enabled?'':'off'} ${w?'wonder':''}" data-gp="${esc(id)}" aria-pressed="${id===pick}"><img src="${esc(grandArt(id))}" alt="" /><b>${esc(w?.name||BUILDINGS[id]?.name||id)}</b><small>${a.enabled?esc([a.cost?.gold?`${a.cost.gold}金`:'',a.cost?.supply?`${a.cost.supply}粮`:''].filter(Boolean).join(' ')):esc(shortWhy(a))}</small></button>`;}).join('');
  const html=`<div class="gp-grid">${cards}</div>${chosen?`<p class="rf-say"><b>${esc(wonder?.name||BUILDINGS[pick]?.name||pick)}</b>${wonder?' · 奇观，每国一座':''} · ${esc(grandLine(pick))}${spec?.upkeep?` 维护 ${spec.upkeep} 金/回合。`:''}</p><div class="rf-foot">${priceHtml(chosen)}<button class="cs-burst small" id="rf-go" ${chosen.enabled?'':'aria-disabled="true"'}><span>开工！</span></button></div>${chosen.enabled?'':`<p class="alarm">${esc(tileActionReason(chosen))}</p>`}`:''}`;
  return {html,bind:root=>{
    root.querySelectorAll('[data-gp]').forEach(b=>b.onclick=()=>{box.grandPick={key:t.key,id:b.dataset.gp};renderFlower();});
    const go=root.querySelector('#rf-go');if(go)go.onclick=e=>{if(e.detail>1)return;const now=getActions(state,t.key).find(a=>a.type==='build'&&a.action?.building===pick);if(!now?.enabled){toast(now?tileActionReason(now):'现在建不了。',true);return;}runAction(now.action);};
  }};
}
/* ---- 集结 / 会师 / 变卖 as ring forms: the card beside the ring is the whole order, the map shows where people come from. ---- */
var ringPreview=null;
/** Marks (white frames) and routes a ring form wants drawn while it is open; cleared when the form closes. */
function setRingPreview(next){
  const was=ringPreview;ringPreview=next&&(next.marks?.size||next.orders?.length)?next:null;
  if((!was&&!ringPreview)||typeof worldMap==='undefined')return;
  worldMap.setMarks?.(ringPreview?.marks||null);
  worldMap.setOrders?.([...(typeof getMarchOrders==='function'?getMarchOrders(state):[]),...(ringPreview?.orders||[])]);
}
/** Opens a tile's ring with one of its forms already showing: lists and the army card hand over to the map this way. */
function openRingForm(key,label,group='army'){
  if(!state.tiles[key])return;
  goToTile(key);
  const box=$('flower');if(!flowerOpen||selectedKey!==key)return;
  box.ringGroup=group;box.ringPage=0;box.ringForm={key,label};renderFlower();if(typeof fitFlower==='function')fitFlower(key);
}
function rallyForm(t){
  const box=$('flower'),d=box.rallyDraft?.key===t.key?box.rallyDraft:(box.rallyDraft={key:t.key,amount:null,all:false});
  const open=getRallyPlan(state,t.key),max=Math.max(1,Math.min(100,Number.isInteger(open?.requested)?open.requested:100-(t.troops||0)));
  const amount=Math.max(1,Math.min(max,d.amount??max)),plan=getRallyPlan(state,t.key,amount,{scope:d.all?'all-forces':'reserves'});
  const sources=plan.sources||[],overridden=plan.overriddenSources||[],guarded=(plan.protectedSources||[]).length;
  const presets=[...new Set([10,20,40].filter(n=>n<max).concat([max]))];
  const html=`<p class="rf-say">把附近空闲的罪袋调来这里，地图上金框是出人的地。</p>
    <div class="pay-steps ring-steps" role="group" aria-label="最多调多少人">${presets.map(n=>`<button type="button" data-rally-n="${n}" aria-pressed="${amount===n}">${n===max&&presets.length>1?`最多 ${n}`:n}<small>人</small></button>`).join('')}</div>
    ${guarded||d.all?`<label class="ring-check"><input type="checkbox" data-rally-all ${d.all?'checked':''} /> 也从守要塞、主力编队那里抽人${guarded&&!d.all?`（${guarded} 处在保护）`:''}</label>`:''}
    ${plan.troops?`<p class="rf-say"><b>集结 ${plan.troops} 人</b>，来自 ${sources.length} 块地 · 这里 ${t.troops} → ${plan.after} 人${plan.shortfall?` · 比要的少 ${plan.shortfall} 人`:''}</p>`:''}
    ${overridden.length?`<p class="alarm">会从 ${overridden.length} 处重要军队抽人。</p>`:''}${plan.enabled?'':`<p class="alarm">${esc(guarded&&!d.all?'附近能调的人都在守要塞或主力编队里；勾上上面这项才会从他们那里抽。':plan.reason||'附近没有能调的人。')}</p>`}
    <div class="rf-foot">${priceHtml(plan)}<button class="cs-burst small" id="rf-go" ${plan.enabled?'':'aria-disabled="true"'}><span>集结！</span></button></div>`;
  return {html,map:{marks:new Set(sources.map(x=>x.fromKey))},bind:root=>{
    root.querySelectorAll('[data-rally-n]').forEach(b=>b.onclick=()=>{d.amount=Number(b.dataset.rallyN);renderFlower();});
    const all=root.querySelector('[data-rally-all]');if(all)all.onchange=()=>{d.all=all.checked;renderFlower();};
    const go=root.querySelector('#rf-go');if(go)go.onclick=e=>{if(e.detail>1)return;const now=getRallyPlan(state,t.key,amount,{scope:d.all?'all-forces':'reserves'});if(!now.enabled){toast(now.reason||'现在集结不了。',true);renderFlower();return;}const r=runAction(now.action);if(!r.ok)return;box.rallyDraft=null;box.ringForm=null;toast(`集结了 ${now.troops} 人，这里现在 ${state.tiles[t.key]?.troops??now.after} 人。`);renderFlower();};
  }};
}
function musterForm(t){
  const box=$('flower'),d=box.musterDraft?.key===t.key?box.musterDraft:(box.musterDraft={key:t.key,mode:'safe',spare:false});
  const plan=getMusterPlan(state,t.key,{troops:d.mode,spare:d.spare}),all=[...(plan.armies||[]),...(plan.spareSources||[])];
  const face=p=>{const hero=state.characters[p.girls?.[0]];return hero&&typeof portraitUrl==='function'?`<img src="${esc(portraitUrl(hero,'smile')||'')}" alt="" />`:'<img src="assets/sazai.webp" alt="" />';};
  const rows=all.slice(0,5).map(p=>`<li><i>${face(p)}</i><span><b>${esc(state.characters[p.girls?.[0]]?.name||'富余罪袋')}${p.girls?.length>1?` 等 ${p.girls.length} 位`:''}</b><small>${esc(tileName(state.tiles[p.fromKey]))} · ${p.troops?`带 ${p.troops} 人`:'不带兵'} · ${p.arrivesTurn===state.turn?'今天到':`${p.arrivesTurn-state.turn} 回合后到`}</small></span></li>`).join('');
  const html=`<p class="rf-say">别处的编队都往这里走，远的每回合开头自动前进，不花指令，路上吃补给。地图上金框是出发地，线是各队的路。</p>
    <div class="pay-steps ring-steps" role="group" aria-label="会师方式"><button type="button" data-muster-mode="safe" aria-pressed="${d.mode==='safe'}">带上兵<small>各地留够人手</small></button><button type="button" data-muster-mode="none" aria-pressed="${d.mode==='none'}">只来人<small>罪袋不动</small></button>${d.mode==='safe'?`<button type="button" data-muster-spare aria-pressed="${d.spare}">加上闲人<small>各地富余罪袋</small></button>`:''}</div>
    ${plan.enabled?`<ul class="ring-roster">${rows}</ul>${all.length>5?`<small class="cs-hint">还有 ${all.length-5} 路</small>`:''}<p class="rf-say"><b>${plan.armies.length} 支编队 · ${plan.girls} 位同伴 · ${plan.troops} 名罪袋</b> · ${plan.lastTurn===state.turn?'今天到齐':`第 ${plan.lastTurn} 回合到齐`}</p>`:`<p class="alarm">${esc(plan.reason||'没有能来的编队。')}</p>`}
    ${plan.skipped?.length?`<small class="cs-hint">来不了：${esc(plan.skipped.map(item=>`${state.characters[item.girls?.[0]]?.name||tileName(state.tiles[item.fromKey])}（${item.reason}）`).join('；'))}</small>`:''}
    <div class="rf-foot">${priceHtml(plan)}<button class="cs-burst small" id="rf-go" ${plan.enabled?'':'aria-disabled="true"'}><span>会师！</span></button></div>`;
  return {html,map:{marks:new Set(all.map(p=>p.fromKey)),orders:(plan.armies||[]).filter(p=>Array.isArray(p.path)&&p.path.length>1).map(p=>({key:p.fromKey,toKey:t.key,path:p.path,stops:p.stops||[]}))},bind:root=>{
    root.querySelectorAll('[data-muster-mode]').forEach(b=>b.onclick=()=>{d.mode=b.dataset.musterMode;if(d.mode==='none')d.spare=false;renderFlower();});
    const spare=root.querySelector('[data-muster-spare]');if(spare)spare.onclick=()=>{d.spare=!d.spare;renderFlower();};
    const go=root.querySelector('#rf-go');if(go)go.onclick=e=>{if(e.detail>1)return;const now=getMusterPlan(state,t.key,{troops:d.mode,spare:d.spare});if(!now.enabled){toast(now.reason,true);renderFlower();return;}const r=runAction(now.action);if(!r.ok)return;const x=r.detail;box.musterDraft=null;box.ringForm=null;toast(`会师令已下：${x.parties.length} 路人马动身${x.arrived?`，${x.arrived} 路已经到了`:''}，${x.lastTurn===state.turn?'今天到齐':`第 ${x.lastTurn} 回合到齐`}。`);renderFlower();};
  }};
}
function liquidationForm(t){
  const box=$('flower');
  const choices=[...(t.building?[{asset:'building',name:'拆建筑',small:BUILDINGS[t.building]?.name||''}]:[]),...(t.road?[{asset:'road',name:'拆道路',small:''}]:[]),...['R','SR','SSR'].filter(rank=>t.elite?.[rank]>0).map(rank=>({asset:'elite',rank,amount:1,name:`遣散 ${rank}`,small:`库存 ${t.elite[rank]}`}))];
  if(!choices.length)return {html:'<p class="alarm">这里没有能变卖的东西。</p>'};
  const i=box.liquidatePick?.key===t.key?Math.min(box.liquidatePick.i,choices.length-1):0,{name,small,...choice}=choices[i];
  const ask=()=>getLiquidationQuote(state,{type:'liquidate',key:t.key,...choice,expectedRevision:state.revision}),q=ask();
  const delta=(label,a,b)=>a===b?'':`${label} ${a}→${b}`;
  const lines=q.enabled?[delta('金',q.before.stats.gold,q.after.stats.gold),delta('粮',q.before.stats.supply,q.after.stats.supply),delta('住房',q.before.stats.housing,q.after.stats.housing),delta('防',q.before.stats.defense,q.after.stats.defense)].filter(Boolean).join(' · '):'';
  const html=`<p class="rf-say">折价换回金币，不是原价退款；土地和居民都留着。</p>
    <div class="pay-steps ring-steps" role="group" aria-label="变卖什么">${choices.map((c,k)=>`<button type="button" data-liq="${k}" aria-pressed="${k===i}">${esc(c.name)}${c.small?`<small>${esc(c.small)}</small>`:''}</button>`).join('')}</div>
    ${q.enabled?`<p class="rf-say"><b>回收 ${q.refund.gold} 金</b>${q.refund.gold?'':'（这件拆了拿不回钱）'} · 国库 ${q.before.gold} → ${q.after.gold}${lines?`<br>这块地每回合：${esc(lines)}`:''}</p>`:`<p class="alarm">${esc(q.reason||'现在变卖不了。')}</p>`}
    <div class="rf-foot"><span class="pick-price"><span class="pp"><img src="assets/icons/gold.webp" alt="金币" />+${q.enabled?q.refund.gold:0}</span><span class="pp ap">不花指令</span></span><button class="cs-burst small" id="rf-go" ${q.enabled?'':'aria-disabled="true"'}><span>变卖！</span></button></div>`;
  return {html,bind:root=>{
    root.querySelectorAll('[data-liq]').forEach(b=>b.onclick=()=>{box.liquidatePick={key:t.key,i:Number(b.dataset.liq)};renderFlower();});
    const go=root.querySelector('#rf-go');if(go)go.onclick=e=>{if(e.detail>1)return;const now=ask();if(!now.enabled){toast(now.reason||'现在变卖不了。',true);renderFlower();return;}const r=runAction(now.action);if(!r.ok)return;box.liquidatePick=null;box.ringForm=null;toast(`${now.label}：回收 ${now.refund.gold} 金。点错了可以按右下角的撤销。`);renderFlower();};
  }};
}
function recoveryForm(t,actions){
  const box=$('flower'),kinds=['demobilize','emergencyFarm'].filter(k=>actions.some(a=>a.type===k));
  if(!kinds.length)return {html:'<p class="alarm">这里没有能救急的办法。</p>'};
  const d=box.recoveryDraft?.key===t.key?box.recoveryDraft:(box.recoveryDraft={key:t.key,type:kinds[0],troops:null});
  if(!kinds.includes(d.type))d.type=kinds[0];
  const max=Math.max(1,(t.troops||1)-1),presets=[...new Set([1,5,10].filter(n=>n<max).concat([max]))],troops=Math.max(1,Math.min(max,d.troops??Math.min(5,max)));
  const ask=()=>getRecoveryPlan(state,d.type==='demobilize'?{type:'demobilize',key:t.key,troops,expectedRevision:state.revision}:{type:'emergencyFarm',key:t.key,expectedRevision:state.revision});
  const plan=ask(),sign=n=>`${n>0?'+':''}${n}`;
  const html=`<p class="rf-say">粮不够时先止血：遣散这里的罪袋少吃粮，或者把这块地改成应急田圃多产粮。</p>
    <div class="pay-steps ring-steps" role="group" aria-label="怎么救急">${kinds.map(k=>`<button type="button" data-recover="${k}" aria-pressed="${d.type===k}">${k==='demobilize'?'遣散罪袋':'改应急田圃'}<small>${k==='demobilize'?'少吃粮':'多产粮，拆掉原建筑'}</small></button>`).join('')}</div>
    ${d.type==='demobilize'?`<div class="pay-steps ring-steps" role="group" aria-label="遣散多少人">${presets.map(n=>`<button type="button" data-recover-n="${n}" aria-pressed="${troops===n}">${n}<small>${n===max&&presets.length>1?'只留 1 人':'人'}</small></button>`).join('')}</div>`:''}
    ${plan.ok?`<p class="rf-say"><b>每回合粮 ${sign(plan.supplyBefore)} → ${sign(plan.supplyAfter)}</b>${d.type==='demobilize'?` · 这里 ${plan.tileTroopsBefore} → ${plan.tileTroopsAfter} 人`:''}${plan.remainingDeficit?.supply>0?`<br>还差 ${plan.remainingDeficit.supply} 粮/回合`:''}</p>`:`<p class="alarm">${esc(plan.reason||'这里救不了急。')}</p>`}
    <div class="rf-foot">${priceHtml(plan)}<button class="cs-burst small" id="rf-go" ${plan.ok?'':'aria-disabled="true"'}><span>${d.type==='demobilize'?'遣散！':'改田！'}</span></button></div>`;
  return {html,bind:root=>{
    root.querySelectorAll('[data-recover]').forEach(b=>b.onclick=()=>{d.type=b.dataset.recover;renderFlower();});
    root.querySelectorAll('[data-recover-n]').forEach(b=>b.onclick=()=>{d.troops=Number(b.dataset.recoverN);renderFlower();});
    const go=root.querySelector('#rf-go');if(go)go.onclick=e=>{if(e.detail>1)return;const now=ask();if(!now.ok){toast(now.reason||'这里救不了急。',true);renderFlower();return;}const type=d.type,r=runAction(now.action);if(!r.ok)return;box.recoveryDraft=null;box.ringForm=null;toast(type==='demobilize'?`遣散了 ${now.removed} 人，每回合粮 ${sign(now.supplyAfter)}。`:`改成了应急田圃，每回合粮 ${sign(now.supplyAfter)}。`);renderFlower();};
  }};
}
const flowerSize=()=>isPhone()?60:window.innerHeight<=520?62:74;
/** A line too wide for the hexagon at its height is never cut: it rides on an ink plate over the neighbours. */
function fitPetals(box){
  for(const el of box.querySelectorAll?.('.petal,.ring-hub')||[]){
    const W=el.offsetWidth,H=el.offsetHeight;if(!W||!H)continue;
    const at=y=>y<H/4?W*y/(H/4):y>H*3/4?W*(H-y)/(H/4):W;let spill=false;
    for(const line of el.querySelectorAll('b,small')){
      line.classList.remove('spill');
      const mid=line.offsetTop+line.offsetHeight/2,room=at(Math.max(0,Math.min(H,mid)))-6;
      if(line.offsetWidth>room){line.classList.add('spill');spill=true;}
    }
    el.classList.toggle('spilling',spill);
  }
}
/** What a petal does, in full: shown above or below the ring (never inside a native tooltip that can be cut off). */
function bindPetalTips(box){
  for(const b of box.querySelectorAll?.('.petal[data-tip]')||[]){
    b.onpointerenter=e=>{if(e.pointerType==='mouse')showPetalTip(b);};
    b.onpointerleave=()=>hidePetalTip();b.onfocus=()=>showPetalTip(b);b.onblur=()=>hidePetalTip();
  }
}
function showPetalTip(b){
  const text=b.dataset?.tip;if(!text||(typeof isPhone==='function'&&isPhone()))return;
  let tip=$('petal-tip');if(!tip){tip=document.createElement('div');tip.id='petal-tip';tip.className='petal-tip';tip.setAttribute('role','tooltip');document.body.appendChild(tip);}
  tip.innerHTML=`<b>${esc(b.dataset.name||'')}</b><span>${esc(text)}</span>`;tip.hidden=false;
  const r=b.getBoundingClientRect(),ring=(typeof flowerBoxes==='function'&&flowerBoxes()[0])||r,w=window.innerWidth,h=window.innerHeight,tw=tip.offsetWidth,th=tip.offsetHeight;
  const low=r.top+r.height/2>(ring.top+ring.bottom)/2+4;
  let y=low?ring.bottom+8:ring.top-th-8;if(y<8||y+th>h-8)y=low?ring.top-th-8:ring.bottom+8;
  tip.style.left=`${Math.round(Math.max(8,Math.min(w-tw-8,r.left+r.width/2-tw/2)))}px`;tip.style.top=`${Math.round(Math.max(8,Math.min(h-th-8,y)))}px`;
}
function hidePetalTip(){const tip=$('petal-tip');if(tip)tip.hidden=true;}
/** The tile card says who works this tile and what she adds; the numbers above already count it. */
function dutyCardLine(duty){
  const c=state.characters[duty.id],job=DUTIES.find(x=>x.id===duty.job)?.name||'差事',face=c?portraitUrl(c,'smile'):'';
  const what=duty.gold?`金 +${duty.gold}`:duty.supply?`粮 +${duty.supply}`:duty.control?`控制力 +${Math.round(duty.control*100)}%`:duty.growth?`人口增长 +${duty.growth}`:'这项她做不来';
  return `${face?`<i class="pface"><img src="${esc(face)}" alt="" /></i>`:''}<span>${esc(c?.name||'')}在这里${esc(job)}：${esc(what)}${duty.gold||duty.supply?'，已算进上面的产出':''}</span>`;
}
/** A long name on a petal: the given name only (夏洛特·伊索阿尔 → 夏洛特); the full name is on her card. */
const girlShort=name=>{const full=String(name||''),head=full.split('·')[0];return head.length>=2?head:full;};
/** Why a tile is on the border list, and where it sits in the list: shown on the card the border button opens. */
var frontierCursor=null;
function frontierBanner(key,filter='all'){
  const entries=filterFrontiers(frontierEntries(state),filter),i=entries.findIndex(item=>item.key===key),e=entries[i];if(!e)return '';
  const names=ids=>ids.map(id=>state.factions[id]?.name).filter(Boolean).slice(0,2).join('、');
  const atWar=e.countries.filter(id=>state.relations?.[[state.playerId,id].sort().join('|')]?.status==='war'),calm=e.countries.filter(id=>!atWar.includes(id));
  const why=[atWar.length?`挨着交战的${names(atWar)}`:'',calm.length?`挨着${names(calm)}`:'',e.land?`旁边有 ${e.land} 块无主空地，花 1 令能开拓`:'',e.fog?'旁边是迷雾，花 1 令能探索':''].filter(Boolean);
  const kind={war:'交战边境',country:'邻国边境',land:'能开拓的边境',fog:'迷雾边缘'}[filter]||'边境';
  return `<div class="front-banner"><span><b>${kind} ${i+1} / ${entries.length}</b>${esc(why.join('；'))}</span>${entries.length>1?`<button type="button" class="front-next" id="front-next" aria-keyshortcuts="F">下一处 ›</button>`:''}</div>`;
}
function renderFlower(){
  if(typeof hidePetalTip==='function')hidePetalTip();
const RING={recruit:0,build:1,pick:2,army:3,march:4,seat:5};
const RING_GROUPS={build:{label:'建设',ic:'castle'},army:{label:'军务',ic:'shield'}};
const BUILD_ICON={farm:'farm',mine:'coin',quarry:'mine',lumber:'forest',port:'water',camp:'compass',fort:'fort',garden:'leaf'};
/** What a petal can say in four or five characters. The whole reason is in the toast on tap. */
function petalCost(cost={}){return [cost.gold?`${cost.gold}金`:'',cost.supply?`${cost.supply}粮`:''].filter(Boolean).join(' ')||(cost.ap?`${cost.ap} 指令`:'');}
function petalWhy(action){
  const text=shortWhy(action);
  if(/指令不足/.test(text)&&!action.reason)return '没指令了';
  if(/金币不足/.test(text)&&!action.reason)return '金币不够';
  if(/补给不足/.test(text)&&!action.reason)return '粮不够';
  const first=String(action.reason||text).split(/[；。，,]/)[0];
  return first.length>7?first.slice(0,6)+'…':first;
}
function yieldText(effects){
  const before=effects?.productionBefore,after=effects?.productionAfter;if(!before||!after)return '';
  const g=after.gold-before.gold,s=after.supply-before.supply;
  return [g?`金${g>0?'+':''}${g}`:'',s?`粮${s>0?'+':''}${s}`:''].filter(Boolean).join(' ');
}
  const box=$('flower'),t=state.tiles[selectedKey];
  let ringGroup=box.ringGroup||null;
  const actionView={state,key:selectedKey};box.tileActionView=actionView;
  if(box.attackSourceChoice?.state!==state||box.attackSourceChoice?.revision!==state.revision)delete box.attackSourceChoice;
  if(!flowerOpen||!t||state.battle){box.hidden=true;box.ringGroup=null;if(typeof setRingPreview==='function')setRingPreview(null);placeFlower();const back=guideNow();if($('guide-order')&&back)$('guide-order').textContent=back.order;renderTutorial();return;}
  const terrain=state.terrainTypes[t.terrainId],water=t.terrainId==='ocean'||t.terrainId==='lake',sovereign=water&&typeof waterOwner==='function'?waterOwner(state,t)||t.ownerId:t.ownerId,faction=t.discovered&&sovereign?state.factions[sovereign]:null,own=t.discovered&&t.ownerId===state.playerId&&(terrain?.passable||Boolean(t.bridgeId||t.shipId)),discovered=t.discovered;
  const sources=neighbors(t.key).filter(k=>state.tiles[k].ownerId===state.playerId&&(state.tiles[k].troops>1||state.tiles[k].field.length)).sort((a,b)=>state.tiles[b].field.length-state.tiles[a].field.length||state.tiles[b].troops-state.tiles[a].troops);
  // An attack on this tile is made by an army next to it: the one with girls that can win, else the biggest.
  const source=discovered&&!own&&t.ownerId?sources.find(key=>previewAttack(state,key,t.key,undefined,state.tiles[key].field).canAttack)||sources[0]:sources[0];
  const choosing=false,draft=null,moving=false;
  const actions=getActions(state,t.key,source),stats=getTileStats(state,t.key);
  const supplyShort=(getStats(state).income?.supply||0)<0;
  /* ---- orders ---- */
  const homes=[],groups={build:[],army:[]},grand=[];
  const put=(slot,label,ic,action,opts={})=>{if(!homes.some(h=>h.slot===slot))homes.push({slot,label,ic,action,...opts});};
  const into=(group,label,ic,action,opts={})=>groups[group].push({label,ic,action,...opts});
  {
    for(const a of actions){
      // These are already-built alternatives, not affordable future choices or conversions.
      if(a.type==='build'&&!a.enabled&&t.building&&!BUILDINGS[t.building]?.emergency&&a.reason==='此地已有建筑。')continue;
      // Workshops, banks, yards, halls and wonders share one petal (大工程) and are picked in its card.
      if(a.type==='build'&&typeof ADVANCED_BUILDINGS!=='undefined'&&ADVANCED_BUILDINGS[a.action?.building]){grand.push(a);continue;}
      if(a.type==='explore')put(RING.build,'探索','compass',a,{primary:true,detail:a.enabled?petalCost(a.cost):''});
      else if(a.type==='claim'){const migrants=a.effects?.migrants??Math.max(0,Math.min(MIGRANTS,100-t.troops)),fromKey=a.effects?.fromKey||a.action.fromKey;put(RING.build,a.effects?.water?F.water_claim:'开拓','flag',a,{primary:true,detail:fromKey?`迁入 ${migrants} 人`:petalCost(a.cost),why:a.effects?.water?F.water_no_people:fromKey?`从 ${fromKey} 迁入 ${migrants} 人，原地人口相应减少。`:''});}
      else if(a.type==='recruit'){const n=/\+(\d+)/.exec(a.label||'')?.[1];put(RING.recruit,'征募','recruit',a,{detail:n?`+${n} 罪袋`:petalCost(a.cost)});}
      else if(a.type==='build'){
        const id=a.action?.building,effects=a.effects,replaced=effects?.replacedBuilding,name=effects?.building?.name||BUILDINGS[id]?.name||String(a.label).replace('建造','');
        into('build',replaced&&id!=='fort'?`改${name}`:name,BUILD_ICON[id]||'farm',a,{building:id,detail:id==='fort'?'防 +3':yieldText(effects)||petalCost(a.cost),
          why:id==='fort'&&effects?fortBuildText(effects):replaced?`替换${replaced.name}；${buildProductionText(effects)}`:effects?buildProductionText(effects):''});
      }
      else if(a.type==='upgrade'){const effects=a.effects,fort=effects?.kind==='fort-upgrade',ordinary=effects?.kind==='building-upgrade';
        const falls=Boolean(effects?.productionFalls);
        into('build','升级','upload',a,{upgrade:true,warn:falls,detail:a.enabled?(falls?'产出会降':petalCost(a.cost)):'',why:fort?fortUpgradeText(effects):ordinary?buildingUpgradeText(effects):a.label});}
      else if(a.type==='fortMode')into('build',a.action.mothball?'封存要塞':'启用要塞','fort',a,{detail:a.action.mothball?'省维护':'下回合好',why:a.action.mothball?'停止维护，同时失去防区掩护与迁都保障。':`下回合（第 ${state.turn+1} 回合）整备完成。胸墙需要 4 人，掩护邻地还要连通首都。`});
      else if(a.type==='road'){if(!own)put(RING.pick,'修路','map',a,{detail:a.enabled?petalCost(a.cost):'',why:'修路后行军只算半格路程。'});}
      else if(a.type==='militaryMode'){const service=a.effects.before;into('army','编制','shield',{enabled:true,cost:{}},{detail:service.reserve?'后备中':service.ready?'执勤中':'整备中',why:`常备军 Lv ${service.effectiveLevel}（已学 Lv ${service.learnedLevel}）。执勤或转后备，先看费用再确认。`,run:()=>showGarrison(t.key,null,{military:true})});}
      else if(a.type==='rally')into('army','集结','heroes',{...a,enabled:a.enabled||Boolean(a.effects?.previewAvailable)},{detail:a.enabled?`+${a.effects.troops} 罪袋`:'先看看',why:a.enabled?`从 ${a.effects.sources.length} 处邻地调来 ${a.effects.troops} 名罪袋，这里变成 ${a.effects.after} 人。`:'看哪些军队受保护、能调多少；在卡片里定人数再集结。',...(typeof rallyForm==='function'?{form:()=>rallyForm(t)}:{run:()=>showRallyPreview(t.key)})});
      else if(a.type==='liquidate'){if(!groups.army.some(item=>item.liquidate))into('army','变卖','coin',{enabled:true,cost:{}},{liquidate:true,detail:'折价换钱',why:'拆掉建筑、道路或遣散稀有罪袋，折价换回金币。卡片里先看损失再变卖。',...(typeof liquidationForm==='function'?{form:()=>liquidationForm(t)}:{run:()=>showLiquidation(t.key)})});}
      else if(a.type==='attack'){
        const p=previewAttack(state,source,t.key,undefined,state.tiles[source]?.field||[]),from=state.tiles[source];
        if(/宣战/.test(p.reason||'')&&!/谁也不能/.test(p.reason))put(RING.build,'宣战','sword',{enabled:true,cost:{}},{danger:true,detail:'先去谈',run:()=>showTalks(t.ownerId)});
        else put(RING.build,p.occupy?'占领':'进攻','sword',{...a,enabled:Boolean(p.ok&&p.canAttack),reason:p.reason||p.error||a.reason},{danger:true,detail:from?.field.length?`${from.field.length} 位编队`:'选编队',why:`由 ${tileName(from)} 的编队出发：切到编队卡，看双方战力再确认。`,run:()=>selectArmy(source,{target:t.key})});
      }
      else if(!['move','raid','demobilize','emergencyFarm'].includes(a.type))into('army',String(a.label||a.type).split(' ')[0],'gear',a);
    }
    if(own&&grand.length&&typeof grandForm==='function')into('build','大工程','castle',{enabled:true,cost:{}},{rank:3.5,detail:`${grand.filter(a=>a.enabled).length} 项可建`,why:'工坊、工厂、银行、船厂、机场、行政厅和奇观：点开，在卡片里挑一项。',form:()=>grandForm(t,grand)});
    // 修路 always starts here: tap the far end on the map and the whole road is priced and built in one go.
    if(own&&(terrain?.passable||t.bridgeId)&&!t.shipId&&t.cutSince===undefined&&typeof startRoadTool==='function'){const first=t.road||typeof roadTileCost!=='function'?null:roadTileCost(state,t);into('build','修路','map',{enabled:true,cost:{}},{detail:first?`${petalCost(first)}/格`:'修到远处',why:'点地图上的终点，一次修完整条路，路线挑最省钱的；已有道路的格子不收钱。只修这一格就直接确认。修路不花指令。',run:()=>startRoadTool(t.key)});}
    if(own&&typeof showMusterPreview==='function'&&Object.values(state.tiles).some(tile=>tile.ownerId===state.playerId&&tile.key!==t.key&&tile.field?.length))into('army','会师','flag',{enabled:true,cost:{}},{muster:true,detail:'编队都来这',why:'让别处的编队都往这块地走，远的分几回合自动走到。卡片里看路线再下令。',...(typeof musterForm==='function'?{form:()=>musterForm(t)}:{run:()=>showMusterPreview(t.key)})});
    if(own&&actions.some(a=>['demobilize','emergencyFarm'].includes(a.type)))into('army','缺粮自救','wheat',{enabled:true,cost:{}},{urgent:supplyShort,detail:supplyShort?'粮在减少':'裁员 / 改田',why:'遣散闲置罪袋或改成应急田圃，马上止住缺粮。',...(typeof recoveryForm==='function'?{form:()=>recoveryForm(t,actions)}:{run:()=>showManagement({recoveryKey:t.key})})});
    const ringCtx={state,tile:t,key:t.key,refresh:renderFlower,toast,run:(action,options)=>runAction(action,options),close:closeFlower,back:()=>{box.ringForm=null;renderFlower();}};
    for(const extra of (typeof tileExtensions==='function'?tileExtensions({state,tile:t,own,discovered}):[]))into(extra.group==='army'?'army':'build',extra.label,extra.icon||'spark',{enabled:extra.enabled!==false,reason:extra.reason||'',cost:extra.cost||{}},{detail:extra.short||'',why:extra.detail||extra.why||'',rank:extra.rank,form:extra.form?()=>extra.form(ringCtx):null,run:()=>extra.run?.(ringCtx)});
    if(own){
      const reason=departureReason(state,t),lead=state.characters[t.field[0]];
      put(RING.march,'编队','flag',{enabled:true,cost:{}},{primary:Boolean(t.field.length&&!reason),detail:t.field.length?`${t.field.length} 位 · 走或打`:'组队出发',why:'切到编队卡：调人、带兵、行军和进攻。',face:lead&&typeof portraitUrl==='function'?portraitUrl(lead,'smile'):'',run:()=>selectArmy(t.key)});
      put(RING.seat,'驻扎','heroes',{enabled:true,cost:{}},{primary:!t.garrison.length&&!t.field.length,detail:`${t.garrison.length} 驻 ${t.field.length} 行`,run:()=>showGarrison(t.key)});
    }
    if(discovered&&t.ownerId&&!own&&t.building&&source)put(RING.army,'劫掠','flame',{enabled:true,cost:{}},{danger:true,detail:'拆了就撤',why:'切到旁边的编队：拆掉这座建筑、抢回资源后撤回，不占地。',run:()=>{if(selectArmy(source,{target:t.key})){armyRaid=true;renderArmy();}}});
    // Fog: 探索 runs at once; 自动探索 is the standing order (a few commands at the start of every turn).
    if(!discovered&&typeof autoExploreForm==='function'){const n=state.management?.explore||0;put(RING.army,'自动探索','compass',{enabled:true,cost:{}},{detail:n?`每回合${n}令`:state.management?.exploreLeft?'用余令':'关着',why:'每回合开头自动花几令探索迷雾；也可以让结束回合时剩下的指令全拿去探索。',form:()=>autoExploreForm()});}
    if(discovered&&t.ownerId&&!own)put(RING.march,'外交','handshake',{enabled:true,cost:{}},{detail:'谈谈',run:()=>showTalks(t.ownerId)});
    if(own&&terrain?.passable&&!t.shipId&&typeof dutyForm==='function'){const here=dutyAt(state,t.key);const gain=here&&stats.duty?(stats.duty.gold?`金+${stats.duty.gold}`:stats.duty.supply?`粮+${stats.duty.supply}`:stats.duty.control?`控制+${Math.round(stats.duty.control*100)}%`:stats.duty.growth?`人口+${stats.duty.growth}`:''):'';put(RING.pick,'差事','heroes',{enabled:true,cost:{}},{primary:!here&&getIdleCharacters(state).length>0,face:here&&state.characters[here.id]?portraitUrl(state.characters[here.id],'smile'):null,detail:here?`${DUTIES.find(x=>x.id===here.job)?.name||''}${gain?'·'+gain:''}`:'派人管事',why:'派一位没在打仗的同伴来管这块地：她不上阵，按她的经营、守备、魅力或统军多产出。',form:()=>dutyForm(t)});}
    // Most useful first inside each sub-ring; selling things off always comes last.
    const RANK={build:i=>i.rank??(i.upgrade?0:i.building&&i.building!=='fort'?1:i.building==='fort'?2:/要塞/.test(i.label)?3:i.label==='修路'?4:5),army:i=>i.rank??(i.urgent?0:i.muster?1:i.label==='集结'?2:i.label==='编制'?3:i.label==='缺粮自救'?4:i.liquidate?9:5)};
    for(const key of ['build','army'])groups[key].sort((x,y)=>RANK[key](x)-RANK[key](y));
    // A hex with one order shows it directly; several orders become a sub-ring behind one petal.
    for(const [key,slot] of [['build',RING.build],['army',RING.army]]){
      const list=groups[key];if(!list.length||homes.some(h=>h.slot===slot&&!h.groupable))continue;
      if(list.length===1){homes.push({slot,...list[0]});continue;}
      const up=list.find(i=>i.upgrade&&i.action.enabled&&!i.warn),urgent=list.find(i=>i.urgent),ready=list.filter(i=>i.action.enabled);
      homes.push({slot,label:RING_GROUPS[key].label,ic:RING_GROUPS[key].ic,group:key,action:{enabled:true,cost:{}},primary:Boolean(up),urgent:Boolean(urgent),
        detail:urgent?urgent.label:up?'可升级':ready.length?ready.slice(0,2).map(i=>i.label).join(' '):`${list.length} 项`});
    }
    // The 推荐 hex repeats the order most worth doing here, so a new player never needs the sub-ring.
    if(own&&!homes.some(h=>h.slot===RING.pick)&&groups.build.length>1){
      const up=groups.build.find(i=>i.upgrade&&i.action.enabled&&!i.warn),econ=groups.build.find(i=>i.building&&i.building!=='fort'&&i.action.enabled);
      const best=up||econ;if(best)homes.push({...best,slot:RING.pick,shortcut:true});
    }
  }
  if(ringGroup&&!(groups[ringGroup]?.length>1&&homes.some(h=>h.group===ringGroup)))ringGroup=box.ringGroup=null;
  // An open sub-ring: 返回 sits where its group petal was, the group's orders follow clockwise.
  let petals=homes;
  if(ringGroup){
    const at=homes.find(h=>h.group===ringGroup).slot,list=groups[ringGroup];
    const size=list.length>5?4:5,pages=Math.ceil(list.length/size);box.ringPage=Math.min(box.ringPage||0,pages-1);
    petals=[{slot:at,label:'返回',ic:'undo',action:{enabled:true,cost:{}},back:true,detail:RING_GROUPS[ringGroup].label,run:()=>{box.ringGroup=null;box.ringPage=0;box.ringForm=null;renderFlower();if(typeof fitFlower==='function')fitFlower(selectedKey);}},...list.slice(box.ringPage*size,box.ringPage*size+size).map((item,i)=>({...item,slot:(at+1+i)%6})),...(pages>1?[{slot:(at+5)%6,label:'更多',ic:'arrow',action:{enabled:true,cost:{}},detail:`${box.ringPage+1}/${pages}`,run:()=>{box.ringPage=(box.ringPage+1)%pages;renderFlower();if(typeof fitFlower==='function')fitFlower(selectedKey);}}]:[])];
  }
  const say2=discovered&&water&&typeof F!=='undefined'?t.bridgeId?F.bridge_walk:F.bridge_claim_help:!homes.length?(discovered?(own?'':t.ownerId?'从相邻的己方领土才能进攻。':terrain?.passable===false?'水域无法驻军。':'从邻近国土开拓，才能抵达这里。'):'从已探索的边缘才能进入。'):'';
  /* ---- the card ---- */
  const place=state.world&&typeof worldRegion==='function'?worldRegion(state,t.q,t.r):'';
  const sub=!discovered?(place?`未探索 · ${place}`:'未探索'):`${t.isCapital?'首都 · ':''}${terrain?.name||'未知地貌'}${place?' · '+place:''}`;
  const building=t.building?`${BUILDINGS[t.building]?.name||t.building}${(t.buildingLevel||1)>1?` Lv ${t.buildingLevel}`:''}`:'';
  const line=discovered?[building,t.road?'有路':'',own&&t.marchedTurn===state.turn?'本回合走过了':''].filter(Boolean).join(' · '):'';
  const alerts=[];
  if(discovered&&own&&stats.control)alerts.push(`${(typeof CIVIC_COPY!=='undefined'?CIVIC_COPY.control:'')} ${stats.control.percent}%${stats.control.digestion?` · ${(typeof CIVIC_COPY!=='undefined'?CIVIC_COPY.integration:'')} ${stats.control.digestion}`:''}`);
  if(discovered&&own&&stats.cut)alerts.push(`和首都失联，还剩 ${stats.cutLeft} 回合就要脱离`);
  else if(discovered&&own&&t.troops<stats.need)alerts.push(`人手 ${t.troops}/${stats.need}，产出打折`);
  if(!(discovered&&own&&stats.fort)&&discovered&&stats.protectedBy?.length)alerts.push(`在要塞防区里 · 防御 +${stats.supportDefense}`);
  let more='';
  if(discovered&&stats.fort)more+=`<div class="fort-summary"><b>${stats.fort.operational?'要塞防区执勤中':stats.fort.mothballed?'要塞已封存':'要塞未执勤'}</b><p>${esc(stats.fort.reason||`掩护相邻己方领土，防御 +${stats.fort.cover}；不与其他要塞叠加。`)}</p><p>维护 ${stats.fort.upkeep.gold} 金 · ${stats.fort.upkeep.supply} 粮 / 回合 · 至少 ${stats.fort.garrison} 人驻守 · ${stats.fort.refuge?'可接纳迁都':'暂不能接纳迁都'}</p>${fortProfileHtml(stats.fort)}${stats.fort.excess?`<p class="alarm">防区超额 ${stats.fort.excess} 座，维护费加价。</p>`:''}</div>`;
  const sup=discovered&&t.ownerId&&typeof getSupply==='function'?getSupply(state,t.key):null;
  if(sup?.over&&own)alerts.push(`超出补给 ${sup.over} 人，回合结束时 ${sup.leaving} 人会分散到附近`);
  if(sup&&own&&!t.bridgeId)more+=`<p class="say">自然增长到 ${stats.housing} 人为止；调兵、集结、会师最多到补给上限 <b>${sup.limit}</b> 人（${esc(sup.parts.map(part=>`${part.label} ${part.value}`).join(' + '))}${sup.parts.reduce((sum,part)=>sum+part.value,0)>sup.limit?'，封顶 100':''}）。超出的人每回合有五分之一分散到附近的己方地块。</p>`;
  else if(discovered&&own&&!t.bridgeId&&t.troops>=stats.housing)more+=`<p class="say">自然增长到 ${stats.housing} 人为止；调兵可以超过，上限 100。</p>`;
  if(discovered&&!choosing&&(own||actions.some(action=>['claim','attack'].includes(action.type))))more+=frontlineReportHtml(getFrontlineReport(state,t.key,{rallyAction:actions.find(action=>action.type==='rally'),includeChoices:own&&!moving,expansion:!own}));
  let card;
  const formItem=box.ringForm?.key===t.key?(ringGroup?groups[ringGroup]:homes).find(item=>item.label===box.ringForm.label&&item.form):null;
  let formView=null;
  if(formItem){
    // A petal with a form: the card beside the ring becomes that order's form (who, which model, the price) with its own burst.
    formView=formItem.form()||{html:''};
    card=`<div class="tag options ring-form"><h3>${esc(tileName(t))} · ${esc(formItem.label)}</h3>${formView.html}</div>`;
  }else if(ringGroup){
    // An open sub-ring: the card reads out what each of its orders does before you pick one.
    const source=groups[ringGroup],size=source.length>5?4:5,list=source.slice((box.ringPage||0)*size,(box.ringPage||0)*size+size);
    card=`<div class="tag options"><h3>${esc(tileName(t))} · ${esc(RING_GROUPS[ringGroup].label)}</h3><ul class="ring-notes">${list.map(item=>`<li class="${item.warn?'warn':''} ${item.action.enabled?'':'off'}"><b>${esc(item.label)}</b><span>${esc(item.action.enabled?(item.why||item.detail||petalCost(item.action.cost)):tileActionReason(item.action))}</span>${item.action.enabled&&(item.action.cost?.gold||item.action.cost?.supply||item.action.cost?.ap)?`<small>${typeof priceHtml==='function'?priceHtml(item.action):esc(costLine(item.action.cost))}</small>`:''}</li>`).join('')}</ul></div>`;
  }else{
    const faces=discovered&&t.ownerId&&typeof seatStrip==='function'?seatStrip(t.key):'';
    card=`<div class="tag"><h3>${esc(tileName(t))}</h3><div class="sub"><i style="background:${esc(faction?.color||'#a9afc0')}"></i>${esc(sub)}${faction?' · '+esc(faction.name):''}</div>${discovered?`<div class="nums"><span class="g">金 +${(stats.total||stats).gold}</span><span class="s">粮 +${(stats.total||stats).supply}</span><span class="d">防 ${stats.defense}</span>${t.ownerId||t.troops?`<span class="p">人 ${t.troops}/${stats.housing}</span>`:''}${sup?`<span class="cap ${sup.over?'over':''}" title="这块地最多能养的人">补给 ${sup.limit}</span>`:''}${own&&stats.foodGain&&t.troops<stats.housing?`<span>+1 人 ${Math.ceil((stats.foodTarget-stats.food)/stats.foodGain)} 回合</span>`:''}${!t.ownerId&&t.troops?'<span>流民</span>':''}</div>`:''}${own&&stats.duty&&typeof dutyCardLine==='function'?`<p class="tile-line duty-line">${dutyCardLine(stats.duty)}</p>`:''}${line?`<p class="tile-line">${esc(line)}</p>`:''}${discovered&&own&&stats.fort&&typeof tileFortStatusHtml==='function'?tileFortStatusHtml(t,stats.fort):''}${faces}${alerts.map(text=>`<p class="say ${/失联|打折|整备|超出补给/.test(text)?'alarm':''}">${esc(text)}</p>`).join('')}${say2?`<p class="say">${esc(say2)}</p>`:''}${more?`<details class="tile-more"><summary>更多情况</summary>${more}</details>`:''}</div>`;
  }
  const S=typeof flowerSize==='function'?flowerSize():92;box.style?.setProperty?.('--s',S+'px');
  const SLOT=typeof SLOTS!=='undefined'?SLOTS:[[.5,-.866],[1,0],[.5,.866],[-.5,.866],[-1,0],[-.5,-.866]];
  box.classList.toggle('sub-open',Boolean(ringGroup));box.classList.toggle('choosing',false);
  const closer=`<button class="tag-close" id="close-tile" aria-label="收起">${icon('close')}</button>`;
  card=card.replace(/^<div class="tag([^"]*)">/,(m)=>m+closer);
  const cursor=typeof frontierCursor!=='undefined'?frontierCursor:null,front=!formItem&&!ringGroup&&cursor?.key===t.key&&typeof frontierBanner==='function'?cursor:null;if(cursor&&cursor.key!==t.key)frontierCursor=null;
  if(front){const banner=frontierBanner(t.key,front.filter);if(banner)card=card.replace('</h3>','</h3>'+banner);}
  const hub=`<span class="ring-hub" aria-hidden="true"><i class="hex"></i><b>${esc(tileName(t))}</b><small>${esc(t.key)}</small></span>`;
  morph(box,`${card}${hub}${petals.map((item,i)=>{const [dx,dy]=SLOT[item.slot],a=item.action,ready=a.enabled;return `<button id="tile-action-${encodeURIComponent(item.label)}" class="petal ${ready&&item.primary?'primary':''} ${ready&&item.danger?'danger':''} ${item.group?'group':''} ${item.back?'back':''} ${item.urgent||item.warn?'urgent':''} ${item.shortcut?'shortcut':''} ${formItem&&item.label===formItem.label?'on':''}" data-petal="${i}" data-name="${esc(item.label)}" style="--x:${(dx*S).toFixed(1)}px;--y:${(dy*S).toFixed(1)}px;--n:${i}" ${ready?'':'aria-disabled="true"'} data-tip="${esc(ready?(item.why||a.label||item.label):tileActionReason(a))}"><i class="hex" aria-hidden="true"></i><kbd>${i+1}</kbd>${item.face?`<i class="pface"><img src="${esc(item.face)}" alt="" /></i>`:icon(item.ic)}<b>${esc(item.label)}</b><small>${esc(ready?(item.detail||petalCost(a.cost)):petalWhy(a))}</small></button>`;}).join('')}`);
  box.hidden=false;
  if(typeof fitPetals==='function'){fitPetals(box);bindPetalTips(box);}
  if(front&&box.querySelector?.('#front-next'))box.querySelector('#front-next').onclick=()=>jumpToFrontier(null,front.filter);
  if(formView?.bind){const root=box.querySelector?.('.ring-form');if(root)formView.bind(root);}
  if(typeof setRingPreview==='function')setRingPreview(formView?.map||null);
  const phone=typeof isPhone==='function'&&isPhone(),tag=box.querySelector?.('.tag');if(tag?.classList){tag.classList.toggle('tile-sheet',phone);const spotNow=typeof cardSpot!=='undefined'?cardSpot:'';for(const spot of ['below','left','right'])tag.classList.toggle(spot,!phone&&spotNow===spot);}
  placeFlower();
  const currentView=()=>box.tileActionView===actionView&&state===actionView.state&&selectedKey===actionView.key&&flowerOpen&&!state.battle;
  const executeItem=(index,event)=>{
    if(event?.detail>1||!currentView())return;
    const item=petals[index],lock=guideNow();
    if(lock?.petal&&item.label!==lock.petal&&!(item.group&&groups[item.group]?.some(entry=>entry.label===lock.petal))&&!item.back){nudgeGuide();return;}
    if(item.group){box.ringGroup=item.group;box.ringPage=0;box.ringForm=null;renderFlower();if(typeof fitFlower==='function')fitFlower(selectedKey);return;}
    if(item.form){box.ringForm=box.ringForm?.label===item.label&&box.ringForm.key===t.key?null:{key:t.key,label:item.label};renderFlower();if(typeof fitFlower==='function')fitFlower(selectedKey);return;}
    if(!item.action.enabled){const b=box.querySelector(`[data-petal="${index}"]`);b?.classList.remove('nope');void b?.offsetWidth;b?.classList.add('nope');toast(state.ap<=0&&item.action.cost?.ap?'指令用完了，点右下角的圆盘进入下一回合。':shortWhy(item.action),true);return;}
    if(item.run){item.run();return;}
    runAction({...item.action.action});
  };
  box.querySelectorAll('[data-petal]').forEach(b=>b.onclick=e=>executeItem(+b.dataset.petal,e));
  const closeButton=box.querySelector?.('#close-tile');if(closeButton)closeButton.onclick=()=>{if(currentView())closeFlower();};
  box.querySelectorAll('[data-open-recovery]').forEach(button=>button.onclick=()=>showManagement({recoveryKey:button.dataset.openRecovery}));
  box.querySelectorAll('[data-frontline-rally]').forEach(button=>button.onclick=()=>typeof openRingForm==='function'?openRingForm(button.dataset.frontlineRally,'集结'):showRallyPreview(button.dataset.frontlineRally));
  box.querySelectorAll('[data-frontline-from]').forEach(button=>button.onclick=()=>previewFrontlineMove(button.dataset.frontlineFrom,button.dataset.frontlineTo));
  const guided=guideNow();
  box.querySelectorAll('[data-seat]').forEach(b=>b.onclick=()=>{if(guided&&guided.petal!=='驻扎'){nudgeGuide();return;}showGarrison(t.key);});
  if(guided?.petal){
    const wanted=homes.find(item=>item.label===guided.petal)||Object.values(groups).flat().find(item=>item.label===guided.petal);
    const parent=!petals.some(item=>item.label===guided.petal)&&homes.find(item=>item.group&&groups[item.group].some(entry=>entry.label===guided.petal));
    if(!wanted?.action.enabled){tutorial.step++;queueMicrotask(render);}
    else box.querySelectorAll('.petal').forEach(b=>{const on=b.dataset.name===guided.petal||Boolean(parent&&b.dataset.name===parent.label);b.classList.toggle('quest',on);b.classList.toggle('locked',!on);});
  }
  if($('guide-order')&&guided)$('guide-order').textContent=guided.order;
  placeMarkers();
}
/* Nothing sits on what you are working on: the ring and its card settle where no panel is,
   and whatever still touches them steps aside until the ring closes. */
const rectOf=el=>{const r=el?.getBoundingClientRect();return r&&r.width&&r.height?r:null;};
const hits=(a,b,pad=0)=>a.left<b.right+pad&&a.right>b.left-pad&&a.top<b.bottom+pad&&a.bottom>b.top-pad;
const boxAt=(x,y,w,h)=>({left:x,top:y,right:x+w,bottom:y+h});
// Petal centres sit at S·(±1, 0) and S·(±.5, ±.866); a petal is S·.94 wide and S·1.08 tall.
const ringAt=(x,y,S)=>boxAt(x-S*1.48,y-S*1.42,S*2.96,S*2.84);
function cardAt(x,y,S,w,h,spot){
  const gap=S*1.42+10,side=S*1.48+10;
  return spot==='below'?boxAt(x-w/2,y+gap,w,h):spot==='left'?boxAt(x-side-w,y-h/2,w,h):spot==='right'?boxAt(x+side,y-h/2,w,h):boxAt(x-w/2,y-gap-h,w,h);
}
/** The leader's face: nothing the ring opens may land on it (forehead to chin, the middle of the portrait). */
function leaderFaceBox(){const img=rectOf($('leader-portrait')),box=$('leader');if(!img||!box||box.hidden||getComputedStyle(box).visibility==='hidden')return null;return boxAt(img.left+img.width*.26,img.top+img.height*.02,img.width*.48,img.height*.32);}
function panelBoxes(){return [...[$('goals'),$('ledger'),document.querySelector('.tabs'),$('end-turn'),$('undo'),$('army-rail'),$('map-quick'),$('ticker'),$('dispatch-note'),isPhone()?null:document.querySelector('.view-tools')].map(rectOf),typeof leaderFaceBox==='function'&&!isPhone()?leaderFaceBox():null].filter(Boolean);}
function sheetBox(){const tag=$('flower').querySelector('.tag.tile-sheet');if(!tag||$('flower').hidden||!tag.offsetHeight)return null;const bottom=window.innerHeight-8-(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-b'))||0);return boxAt(8,bottom-tag.offsetHeight,window.innerWidth-16,tag.offsetHeight);}
/** Docks the tile ring in the HUD corridor so petals and cards never sit on map tiles. */
function flowerAnchor(){
  const w=window.innerWidth,h=window.innerHeight,S=flowerSize(),phone=isPhone(),side=!phone&&h<=520;
  if(phone){
    const sheet=sheetBox(),bottom=sheet?sheet.top:h-152;
    return {x:Math.round(w/2),y:Math.max(Math.round(S*1.42+68),Math.round(bottom-S*1.42-8)),spot:'',phone:true,side:false};
  }
  if(side)return {x:Math.round(w-S*1.48-12),y:Math.round(h*.5),spot:'left',phone:false,side:true};
  const dial=rectOf($('end-turn')),tools=rectOf(document.querySelector('.view-tools')),dialEdge=dial?dial.left-14:w-168;
  // The map buttons (图层、缩放、边境…) stay usable while a ring is open: dock left of them when they share the height.
  const rightEdge=tools&&tools.bottom>h-68-S*2.84-8?Math.min(dialEdge,tools.left-12):dialEdge;
  const rx=Math.max(Math.round(S*1.48+16),Math.min(Math.round(w-S*1.48-14),Math.round(rightEdge-S*1.48)));
  const ry=Math.round(h-68-S*1.42);
  const tag=$('flower')?.querySelector?.('.tag'),cw=tag?.offsetWidth||260,ch=tag?.offsetHeight||140;
  const leftCard=cardAt(rx,ry,S,cw,ch,'left'),face=typeof leaderFaceBox==='function'?leaderFaceBox():null;
  return {x:rx,y:ry,spot:leftCard.left>=12&&(!face||!hits(leftCard,face,6))?'left':'',phone:false,side:false};
}
function fitFlower(key){
  const at=worldMap.screenOf(key);if(!at)return;
  placeFlower();
  const w=window.innerWidth,h=window.innerHeight,anchor=flowerAnchor(),S=flowerSize(),ring=ringAt(anchor.x,anchor.y,S),boxes=flowerBoxes();
  const hud=[rectOf($('goals')),rectOf($('ledger')),anchor.phone?rectOf(document.querySelector('.view-tools')):null].filter(Boolean);
  const top=Math.max(68,...hud.map(r=>r.bottom+36)),pad=anchor.phone?64:84;
  let left=56,right=w-56,bottom=h-72;
  if(anchor.phone)bottom=Math.min(bottom,ring.top-34);
  else if(anchor.side)right=Math.min(right,Math.min(...boxes.map(b=>b.left))-36);
  else{
    const face=typeof leaderFaceBox==='function'?leaderFaceBox():null;
    if(face)left=Math.max(left,face.right+28);
    // Keep the selected tile and its immediate neighbors clear of the docked ring/card box.
    const dockTop=Math.min(...boxes.map(b=>b.top)),dockLeft=Math.min(...boxes.map(b=>b.left));
    if(at.x+pad>dockLeft&&at.y+pad>dockTop-18){
      if(dockTop-36>=top+90)bottom=Math.min(bottom,dockTop-36);
      else if(dockLeft-36>=left+120)right=Math.min(right,dockLeft-36);
    }
  }
  const fit=(v,lo,hi)=>lo>hi?(lo+hi)/2-v:v<lo?lo-v:v>hi?hi-v:0;
  const dx=fit(at.x,left+pad*.45,right-pad*.45),dy=fit(at.y,top+pad*.45,bottom-pad*.45);
  if(dx||dy)worldMap.glideBy(dx,dy);
  placeFlower();
}
function flowerBoxes(){
  const box=$('flower'),tag=box?.querySelector?.('.tag');if(!flowerOpen||!box||box.hidden||state.battle)return [];
  const anchor=flowerAnchor(),S=flowerSize(),boxes=[ringAt(anchor.x,anchor.y,S)];
  if(tag?.classList.contains('tile-sheet')){const sheet=sheetBox();if(sheet)boxes.push(sheet);}
  else if(tag&&tag.offsetWidth){const c=cardAt(anchor.x,anchor.y,S,tag.offsetWidth,tag.offsetHeight,anchor.spot),dx=parseFloat(tag.style.marginLeft)||0,dy=parseFloat(tag.style.marginTop)||0;boxes.push({left:c.left+dx,right:c.right+dx,top:c.top+dy,bottom:c.bottom+dy});}
  return boxes;
}
function duckPanels(){
  const mine=flowerOpen&&!$('flower').hidden?flowerBoxes():[],card=$('army-panel');if(card&&!card.hidden){const r=rectOf(card);if(r)mine.push(r);}
  const list=[$('bubble'),$('report'),$('ticker'),$('army-rail'),$('turn-hint'),$('ledger'),$('map-quick'),$('dispatch-note'),document.querySelector('.view-tools'),$('nameplate'),lesson?null:$('goals')];
  for(const el of list){if(!el)continue;const r=mine.length?rectOf(el):null;el.classList.toggle('ducked',Boolean(r&&mine.some(m=>hits(m,r,2))));}
}
function placeFlower(){
  const box=$('flower'),open=Boolean(flowerOpen&&!box.hidden&&!state.battle&&state.tiles[selectedKey]);
  const anchor=open?flowerAnchor():null;
  document.body.classList.toggle('sheet-open',Boolean((open&&anchor.phone)||(typeof armyTile==='function'&&armyTile()&&!$('army-panel')?.hidden&&isPhone())));
  document.body.classList.toggle('flower-side',Boolean(open&&anchor.side));
  if(!open){duckPanels();return;}
  cardSpot=anchor.spot;
  box.style.left=`${anchor.x}px`;box.style.top=`${anchor.y}px`;box.style.transform='none';
  const tag=box.querySelector('.tag');
  if(tag){
    tag.classList.toggle('tile-sheet',anchor.phone);
    for(const spot of ['below','left','right'])tag.classList.toggle(spot,!anchor.phone&&cardSpot===spot);
    if(!anchor.phone){
      tag.style.marginLeft='0px';tag.style.marginTop='0px';
      const c=cardAt(anchor.x,anchor.y,flowerSize(),tag.offsetWidth,tag.offsetHeight,cardSpot),over=c.right-(window.innerWidth-8),under=8-c.left,high=8-c.top;
      // The card never covers the bottom tabs: above them when it reaches over them, else above the window edge.
      const nav=typeof rectOf==='function'?rectOf(document.querySelector('nav.tabs')):null,floor=nav&&nav.height&&c.right>nav.left&&c.left<nav.right?Math.min(window.innerHeight,nav.top)-8:window.innerHeight-8,low=c.bottom-floor;
      if(over>0)tag.style.marginLeft=`${-over}px`;else if(under>0)tag.style.marginLeft=`${under}px`;
      if((cardSpot==='left'||cardSpot==='right')&&low>0)tag.style.marginTop=`${-low}px`;else if((cardSpot==='left'||cardSpot==='right')&&high>0)tag.style.marginTop=`${high}px`;
    }
  }
  duckPanels();
}
/* The tutorial is a strict script: one tile, one button, nothing else answers until it is done. */
const GUIDE_BASIC=[
  {id:'intro_land',title:'这是我们的领土',info:true,tile:capitalKey,wide:true},
  {id:'intro_army',title:'这是军队',info:true,tile:capitalKey},
  {id:'intro_money',title:'金币和粮',info:true,el:'ledger'},
  {id:'intro_turn',title:'回合和指令',info:true,el:'end-turn'},
  {id:'explore',title:'探索迷雾',petal:'探索',type:'explore',ap:1,tile:()=>nearestHint('explore')},
  {id:'claim',title:'开拓一块空地',petal:'开拓',type:'claim',ap:1,tile:()=>nearestHint('claim')},
  {id:'build',title:'在首都修农庄',petal:'农庄',type:'build',ap:1,tile:capitalKey,skip:()=>Boolean(state.tiles[capitalKey()]?.building)},
  {id:'end1',title:'进入下一回合',el:'end-turn',where:'右下角的圆盘',type:'endTurn'},
  {id:'recruit',title:'征募罪袋',petal:'征募',type:'recruit',ap:1,tile:capitalKey},
  {id:'fort',title:'修一座要塞',petal:'要塞',via:'建设',type:'build',ap:1,tile:()=>Object.values(state.tiles).filter(t=>t.ownerId===state.playerId&&!t.isCapital&&!t.building&&t.troops>=3).sort((a,b)=>b.troops-a.troops||a.key.localeCompare(b.key))[0]?.key||null},
  {id:'seat',title:'看看驻扎席位',petal:'驻扎',type:'seat',tile:capitalKey},
  {id:'march',title:'指挥编队行军',type:'move',tile:capitalKey},
  {id:'end2',title:'进入下一回合',el:'end-turn',where:'右下角的圆盘',type:'endTurn'},
  {id:'talk',title:'看看诸国',el:'nav-factions',where:'「诸国」按钮',type:'talk'},
  {id:'practice',title:'打一场模拟战',el:'quest-practice',where:'「开始模拟战」',type:'practice'},
  {id:'war',title:'教程完成',el:'quest-done',where:'「结束教程」，回到主菜单',type:'done',done:true},
];
/* The advanced lesson runs on a prepared mid-game realm (advancedWorld): a long strip of land, two armies,
   a prisoner, a war that is going well and an open edict slot. Steps inside a full-screen page cannot be
   pointed at from the map, so those pages show a note of their own while their step is current (lessonNote). */
const ADV={from:()=>capitalKey(),far:()=>'0,6'};
const GUIDE_ADV=[
  {id:'adv_intro',title:'领地大了以后',info:true,tile:capitalKey,wide:true},
  {id:'adv_layer',title:'换成军情图层',el:'layer-force',where:'「军情」图层',type:'layer'},
  {id:'adv_far',title:'下一道远行令',far:ADV.far,type:'marchOrder',tile:capitalKey},
  {id:'adv_end',title:'结束回合',el:'end-turn',where:'右下角的圆盘',type:'endTurn'},
  {id:'adv_watch',title:'她们自己在走',info:true,tile:()=>(typeof getMarchOrders==='function'&&getMarchOrders(state)[0]?.key)||ADV.far(),wide:true},
  {id:'adv_muster',title:'会师',petal:'会师',via:'军务',type:'muster',tile:capitalKey,note:'看清各队哪一回合到，点下面的「会师！」。'},
  {id:'adv_jail',title:'牢房总令',el:'nav-heroes',where:'「同伴」',type:'secureCaptives',note:'点「俘虏」进牢房，在「牢房总令」里点「全员加强看守」。'},
  {id:'adv_post',title:'任命军师',el:'nav-heroes',where:'「同伴」',type:'assignPost',note:'点河原木桃香，翻到「任用」，点「军师」，再点「任命！」。'},
  {id:'adv_edict',title:'颁布一条国策',el:'nav-admin',where:'「内政」',type:'enactEdict',note:'在「国策」页挑一条，点「颁布！」。'},
  {id:'adv_peace',title:'体面地停战',el:'nav-factions',where:'「诸国」',type:'makePeace',note:'点正在交战的 MyGO!!!!!，在「议和条款」里挑一条，点「议和！」。'},
  {id:'adv_done',title:'进阶课完成',el:'quest-done',where:'「结束教程」，回到主菜单',type:'done',done:true},
];
let GUIDE=GUIDE_BASIC;
/** The note a full-screen page shows while one of these lesson steps is waiting on it. */
function lessonNote(...ids){
  const step=typeof lesson!=='undefined'&&lesson&&!tutorial.dismissed?GUIDE[tutorial.step]:null;
  return step?.note&&ids.includes(step.id)?`<p class="guide-note lesson-note">${esc(step.note)}</p>`:'';
}
const lessonRunning=()=>Boolean(lesson)&&!tutorial.dismissed&&!practice&&!state.battle&&$('title-screen').hidden&&Boolean(GUIDE[tutorial.step]);
function nextInfo(){if(!guideNow()?.info)return;tutorial.step++;saveAuto();render();}
let guideCache={id:null,tile:null},lastGuideTile=null;
function hexGap(a,b){return Math.max(Math.abs(a.q-b.q),Math.abs(a.r-b.r),Math.abs(a.q+a.r-b.q-b.r));}
function nearestHint(kind){const set=mapHints()[kind],home=state.tiles[capitalKey()];return [...set].sort((a,b)=>hexGap(state.tiles[a],home)-hexGap(state.tiles[b],home)||a.localeCompare(b))[0]||null;}
function armies(){return Object.values(state.tiles).filter(t=>t.ownerId===state.playerId).sort((a,b)=>b.field.length-a.field.length||b.troops-a.troops);}
function marchGoal(){const reach=getMarch(state,capitalKey());return Object.keys(reach).sort((a,b)=>reach[a]-reach[b]||a.localeCompare(b))[0]||null;}
function guideTile(step){
  const id=`${state.seed}|${tutorial.step}`;
  if(guideCache.id!==id)guideCache={id,tile:step.tile()};
  return guideCache.tile;
}
/** What the player must do right now, or null when they are free to play. */
function guideNow(){
  if(tutorial.dismissed||practice||state.battle||!$('title-screen').hidden)return null;
  let step=GUIDE[tutorial.step];
  while(step&&!step.free&&step.skip?.()){tutorial.step++;step=GUIDE[tutorial.step];}
  if(!step||step.free)return null;
  const line=TUTORIAL_LINES[step.id];
  if(step.info)return {step,info:true,el:step.el,tile:step.tile?.(),wide:step.wide,order:'看完点「下一步」',line};
  if(step.ap&&state.ap<step.ap)return {step,el:'end-turn',order:'指令用完了，点右下角的圆盘进入下一回合',line:TUTORIAL_LINES.end1};
  if(step.el)return {step,el:step.el,order:`点箭头指的${step.where}`,line};
  if(step.id==='march'||step.far){
    const from=capitalKey(),to=step.far?step.far():marchGoal();
    if(typeof armyKey==='undefined'||armyKey!==from)return {step,army:from,tile:from,order:'点首都上方的编队旗（旗上是角色头像）',line};
    if(!to||(step.far&&state.tiles[to]?.ownerId!==state.playerId)){tutorial.step++;return guideNow();}
    if(armyTarget!==to)return {step,army:from,tile:to,order:step.far?'点箭头指的那块远处的己方地块':'点箭头指的白框地块，预览行军路线',line};
    return {step,army:from,tile:to,el:'army-go',order:step.far?'点「远行！」，她们会分几回合自己走到':'可点头像选随行角色，点「行军！」（或再点该白框地块）出发',line};
  }
  const key=guideTile(step);
  if(!key){tutorial.step++;return guideNow();}
  if(flowerOpen&&selectedKey===key)return {step,tile:key,petal:step.petal,order:step.via&&!document.querySelector(`#flower .petal[data-name="${step.petal}"]`)?`点圆盘上发光的「${step.via}」，再点「${step.petal}」`:`点地块圆盘上发光的「${step.petal}」按钮`,line};
  return {step,tile:key,order:step.tile===capitalKey?'点箭头指的首都地块':'点箭头指的这块地',line};
}
function guideDone(type){
  const step=GUIDE[tutorial.step];
  if(practice||tutorial.dismissed||!step||step.type!==type)return;
  tutorial.step++;closeFlowerQuiet();saveAuto();
  // A step finished inside a full-screen page: the next one starts from the map, so step back out to it
  // once the page has shown what the order did.
  if(typeof lesson!=='undefined'&&lesson?.advanced&&step.note&&$('modal')?.open&&typeof setTimeout==='function')setTimeout(()=>{if(lesson?.advanced&&$('modal').open&&!state.battle&&$('title-screen').hidden){closeModal();render();}},700);
}
function nudgeGuide(){
  const g=guideNow();if(!g)return;
  toast(g.order);
  const box=$('goals');box.classList.remove('shake');void box.offsetWidth;box.classList.add('shake');
}
/** Where the map may put the thing a lesson points at: clear of the leader's line, the army card and the panels
 * that hang from the edges. Measured from what is really on screen, because every device stacks them differently.
 * `flag` asks for the extra headroom a banner needs above its tile. */
function guideMargins(flag=false){
  const phone=isPhone(),W=window.innerWidth,H=window.innerHeight,short=H<=520,low=!phone&&short;
  const m={left:phone?60:low?320:380,right:phone?72:low?250:210,top:short?130:phone?200:150,bottom:short?90:phone?330:190};
  const shown=el=>{const r=el&&typeof rectOf==='function'?rectOf(el):null;return r&&!el.classList.contains('ducked')&&getComputedStyle(el).visibility!=='hidden'?r:null;};
  const card=shown($('army-panel'));
  if(card){
    // The card is a column on the right of a short wide screen, a sheet along the bottom everywhere else.
    if(card.height>H*.6){m.right=Math.max(m.right,W-card.left+52);if(short)m.top=70;}
    else m.bottom=Math.max(m.bottom,H-card.top+(phone?30:56));
  }
  if(phone){
    // The right-hand column (layer switch, legend, armies) is tall on a phone: the target goes to its left, under the goals box.
    const lane=shown(document.querySelector('.view-tools')),rail=shown($('army-rail')),goal=shown($('goals')),notes=shown($('report')),edge=Math.min(lane?.left??W,rail?.left??W);
    if(edge-34-m.left>=50){m.right=Math.max(m.right,W-edge+34);m.top=Math.max(goal?.bottom||0,notes?.bottom||0,60)+(flag?58:36);}
    else m.top=Math.max(goal?.bottom||0,notes?.bottom||0,lane?.bottom||0,60)+(flag?58:36);
  }
  const line=$('bubble'),say=line?.classList.contains('hint')?shown(line):null;
  if(say){
    if(say.top<H*.3&&say.width>say.height*1.2)m.top=Math.max(m.top,say.bottom+(flag?58:36)); // a caption along the top
    else if(phone)m.bottom=Math.max(m.bottom,H-say.top+34);                                  // above the tabs on a phone
    else if(say.left<W/2)m.left=Math.max(m.left,say.right+44);                               // beside the leader on a wide screen
  }
  // Never ask for more room than the screen has: the top gives way before the card or the tabs do, then the left.
  if(m.top+m.bottom>H-40)m.top=Math.max(40,H-40-m.bottom);
  if(m.left+m.right>W-40)m.left=Math.max(30,W-40-m.right);
  return m;
}
/** Brings the lesson's target into the free part of the map; again whenever what covers the map changes size. */
function guidePan(){
  const g=typeof guideNow==='function'?guideNow():null;
  if(!g?.tile||g.petal||g.info)return;
  const m=guideMargins(Boolean(g.army)&&!(typeof armyKey!=='undefined'&&armyKey===g.army)),mark=`${g.tile}|${[m.left,m.right,m.top,m.bottom].map(Math.round).join(',')}`;
  if(mark!==lastGuideTile){lastGuideTile=mark;worldMap.panIntoView(g.tile,m);}
}
function renderTutorial(){
  const g=guideNow();
  hintLine=g?g.line:null;
  if(!$('bubble').classList.contains('pop')||Date.now()-lastBark>3600)showHint();
  guidePan();
  placeMarkers();
}
/** The bouncing arrow, the spotlight on the map, and the arrow back home. */
function placeMarkers(){
  const g=guideNow(),mark=$('pointer'),light=$('spot'),open=!$('modal').open&&$('title-screen').hidden&&!state.battle;
  document.querySelectorAll('.guide-target').forEach(el=>el.classList.remove('guide-target'));
  let at=null,hole=null;
  const onEl=id=>{const el=$(id),r=el?.getBoundingClientRect();if(!r?.width)return;el.classList.add('guide-target');at={x:r.left+r.width/2,y:r.top+2};hole={x:r.left+r.width/2,y:r.top+r.height/2,r:Math.max(r.width,r.height)/2+8};};
  if(open&&g){
    if(g.army&&!(typeof armyKey!=='undefined'&&armyKey===g.army)){const b=worldMap.bannerOf?.(g.army),p=b?null:worldMap.screenOf(g.army);if(b){at={x:b.x,y:b.top-2};hole={x:b.x,y:b.y,r:38};}else if(p){at={x:p.x,y:p.y-44};hole={x:p.x,y:p.y-20,r:48};}}
    else if(g.el)onEl(g.el);
    else if(g.petal){const r=($('flower').querySelector(`.petal[data-name="${g.petal}"]`)||$('flower').querySelector('.petal.quest'))?.getBoundingClientRect();if(r?.width)at={x:r.left+r.width/2,y:r.top+10};}
    else if(g.tile){const p=worldMap.screenOf(g.tile);if(p){at={x:p.x,y:p.y-(g.wide?90:30)};hole={x:p.x,y:p.y-6,r:Math.max(46,(p.zoom||1)*(g.wide?135:62))};}}
  }else if(open&&state.ap<=0&&!state.turnContinuation&&!dispatchFrom)onEl('end-turn');
  mark.hidden=!at;
  if(at)mark.style.transform=`translate(${Math.round(at.x)}px,${Math.round(at.y)}px)`;
  light.hidden=!(open&&g&&hole);
  if(hole){light.style.transform=`translate(${Math.round(hole.x)}px,${Math.round(hole.y)}px)`;light.style.setProperty('--r',`${Math.round(hole.r)}px`);}
  const arrow=$('home-arrow'),home=worldMap.screenOf(capitalKey());
  if(!home)return;
  const w=window.innerWidth,h=window.innerHeight,away=home.x<-20||home.y<-20||home.x>w+20||home.y>h+20;
  if(!away||state.battle){arrow.hidden=true;return;}
  // The arrow rides the screen edge towards the capital and slides along it past anything in the way.
  const m=36,W=w-m*2,H=h-m*2,around=(W+H)*2,cx=w/2,cy=h/2,dx=home.x-cx,dy=home.y-cy,fit=Math.min((w/2-m)/Math.abs(dx||1),(h/2-m)/Math.abs(dy||1)),ax=cx+dx*fit,ay=cy+dy*fit;
  const start=ay<=m+1?ax-m:ax>=w-m-1?W+ay-m:ay>=h-m-1?W+H+w-m-ax:W+H+W+h-m-ay;
  const onEdge=t=>{t=(t%around+around)%around;if(t<W)return [m+t,m];t-=W;if(t<H)return [w-m,m+t];t-=H;if(t<W)return [w-m-t,h-m];t-=W;return [m,h-m-t];};
  const walls=[...panelBoxes(),...flowerBoxes(),...[$('nameplate'),$('report'),$('ticker'),$('turn-hint'),document.querySelector('.view-tools')].map(rectOf).filter(Boolean)];
  let spot=null;
  for(let d=0;d<=around/2&&!spot;d+=14)for(const s of [d,-d]){const c=onEdge(start+s);if(!walls.some(o=>hits(boxAt(c[0]-30,c[1]-30,60,60),o))){spot=c;break;}}
  arrow.hidden=!spot;
  if(spot){arrow.style.transform=`translate(${Math.round(spot[0])}px,${Math.round(spot[1])}px)`;arrow.style.setProperty('--a',`${Math.atan2(home.y-spot[1],home.x-spot[0])}rad`);}
}
// While a lesson is running, only its target answers; everything else explains what to press.
document.addEventListener('click',e=>{
  const g=guideNow();if(!g||!(e.target instanceof Element))return;
  const t=e.target;
  if(t.closest('#modal,#flower,#skip-quest,#guide-next,#title-screen,#battle-screen,#world-map,.view-tools,#toast-container,#report,#bubble'))return;
  if(g.el&&(t.closest(`#${g.el}`)||(g.el==='end-turn'&&t.closest('#turn-hint'))))return;
  e.stopPropagation();e.preventDefault();nudgeGuide();
},true);
const turnInput=createTurnInput({onBusy:renderTurnProcessing,onError:error=>toast('回合处理遇到问题：'+error.message,true)});
function renderTurnProcessing(busy){
  for(const id of ['end-turn','turn-hint','end-with-expiring-offers','end-with-fiscal-loss']){const button=$(id);if(button){button.disabled=busy;button.setAttribute('aria-busy',String(busy));}}
  document.body.classList.toggle('turn-processing',busy);
  let label=$('turn-processing-status');
  if(busy){
    if(!label){label=document.createElement('div');label.id='turn-processing-status';label.className='turn-processing-status';label.setAttribute('role','status');label.setAttribute('aria-live','polite');}
    label.textContent=`第 ${state.turn} 回合 · 正在结算`;label.hidden=false;
    ($('modal').open?$('modal'):document.body).append(label);
  }else if(label){label.hidden=true;document.body.append(label);}
}
for(const type of ['pointerdown','pointerup','pointercancel','click','dblclick','keydown','keyup'])document.addEventListener(type,event=>{
  const repeatedTurnKey=event.type==='keydown'&&event.repeat&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&['Enter','Space'].includes(event.code)&&event.target?.closest?.('#end-turn,#turn-hint,#end-with-expiring-offers,#end-with-fiscal-loss');
  if(turnInput.block(event)||repeatedTurnKey){event.preventDefault();event.stopImmediatePropagation();}
},true);
window.addEventListener('blur',()=>turnInput.clearHeld());
function requestEndTurn(event,{confirmOffersExpiry=false,confirmFiscalLoss=false}={}){
  if(uiBusy||!turnInput.canRequest(event))return false;
  // Ask before scheduling anything. Closing this dialog never advances the turn.
  if(!confirmOffersExpiry&&!lesson&&!practice&&state.inbox?.length){runAction({type:'endTurn'});return false;}
  const requestedState=state;
  return turnInput.request(()=>{
    if(state!==requestedState){toast('战局已改变，请重新确认结束回合。',true);return;}
    const result=runAction({type:'endTurn'},{confirmOffersExpiry,confirmFiscalLoss});
    if((confirmOffersExpiry||confirmFiscalLoss)&&result.ok&&$('modal').open)closeModal();
  },event);
}
const SFX={explore:['哗——','ice'],claim:['插旗！','gold'],build:['叮当！','gold'],upgrade:['锵锵！','gold'],recruit:['嘿咻！','gold'],move:['出发！',''],marchOrder:['远行！',''],muster:['集合！','gold']};
function runAction(action,{silent=false,confirmOffersExpiry=false,confirmFiscalLoss=false,onCommitted=null}={}){
  if(uiBusy||turnInput.busy&&!turnInput.executing)return {ok:false,error:'正在执行指令',state};
  if(action.type==='endTurn'&&!confirmOffersExpiry&&!lesson&&!practice&&state.inbox?.length){showOfferExpiry();return {ok:false,pendingConfirmation:true,error:'请先确认未回复来信的到期后果。',state};}
  if(action.type==='endTurn'&&!confirmFiscalLoss&&!lesson&&!practice&&!state.battle&&!state.turnContinuation){const plan=getFiscalRecoveryPlan(state);if(plan.needed){showFiscalWarning(plan,{confirmOffersExpiry});return {ok:false,pendingConfirmation:true,error:'请先确认财政收缩的实际损失。',state};}}
  const previousCapital=capitalKey(),before=state;
  const quoted=['explore','claim','build','upgrade','road','fortMode','recruit'].includes(action.type)?getActions(state,action.key).find(a=>a.type===action.type&&(action.type!=='build'||a.action.building===action.building)):null;
  const goldBefore=state.factions[state.playerId].gold,supplyBefore=state.factions[state.playerId].supply;
  uiBusy=true;let result;
  try{result=perform(state,action);}catch(e){result={ok:false,state,error:'指令未执行：'+e.message};}finally{uiBusy=false;}
  if(!result.ok){if(!silent)toast(result.error||'这个指令暂时无法执行。',true);return result;}
  state=result.state;
  // Internal read-only observer: bind a two-step UI action to the actual engine
  // commit before rendering, saving or story callbacks can replace that state.
  onCommitted?.(result);
  const guideStepBefore=tutorial.step;guideDone(action.type);const guideAdvanced=tutorial.step!==guideStepBefore;
  if(['attack','raid','move','marchOrder','muster','claim','explore','endTurn','undo'].includes(action.type)){dispatchFrom=null;attackFrom=null;attackTroops=null;moveTroops=null;leftBehind=new Set();}
  if(['attack','raid','claim','explore','endTurn','undo','continue'].includes(action.type)&&typeof armyKey!=='undefined'){armyKey=null;armyTarget=null;worldMap.setArmy?.(null);worldMap.setRoute?.(null);}
  if(action.type==='endTurn'||action.type==='attack'||action.type==='raid')flowerOpen=false;
  if(['explore','move','claim'].includes(action.type)){selectedKey=action.toKey||action.key||selectedKey;flowerOpen=!guideAdvanced&&action.type!=='move';}
  const relocated=capitalKey()!==previousCapital;
  if(relocated||!state.tiles[selectedKey])selectedKey=capitalKey();
  if(practice&&action.type==='finishBattle'){endPractice();return result;}
  saveAuto();render();if(relocated)worldMap.centerOn(selectedKey);sound(action.type==='endTurn'?'turn':['attack','raid'].includes(action.type)?'battle':'action');
  const key=action.type==='marchOrder'?result.detail?.key||action.fromKey:action.key||action.toKey||selectedKey,sfx=SFX[action.type],now=state.factions[state.playerId];
  if(action.type==='attack'&&result.detail?.occupied){popTile(key,'占领！','gold');toast('这里没有女孩子或要塞守备，军队直接进城了。');}
  const raid=result.detail?.raided?result.detail:result.detail?.result?.raided?result.detail.result:null;
  if(raid){const mine=action.type==='raid'||before.battle?.attackerId===state.playerId;popTile(raid.toKey,mine?'劫掠！':'遭劫掠',mine?'gold raid':'red raid');toast(`${mine?'我军':'敌军'}摧毁建筑后撤回，领土归属不变。${mine?'我军':'敌军'}回收 ${format(raid.loot.gold)} 金币、${format(raid.loot.supply)} 补给。`);}
  if(sfx)popTile(key,sfx[0],sfx[1]);
  const dg=now.gold-goldBefore,ds=now.supply-supplyBefore;
  if(quoted&&!silent){const bonusGold=dg+(quoted.cost.gold||0),bonusSupply=ds+(quoted.cost.supply||0);toast(`已执行${quoted.label}：${costLine(quoted.cost)}${bonusGold>0||bonusSupply>0?`。另获奖励 ${bonusGold>0?bonusGold+' 金币 ':''}${bonusSupply>0?bonusSupply+' 补给':''}`:''}`);}
  if(sfx&&(dg||ds))popTile(key,'净 '+[dg?`${dg>0?'+':''}${dg} 金`:'',ds?`${ds>0?'+':''}${ds} 粮`:''].filter(Boolean).join('  '),'small',180);
  const flyerShown=action.type==='endTurn'&&!state.battle;
  if(flyerShown){const fresh=Object.values(state.factions).find(f=>!before.factions[f.id]);turnFlyer(result.detail?.income,fresh,result.detail?.explored,result.detail?.leftExplored);}
  if(action.type==='explore'&&result.detail?.nation)turnFlyer(null,state.factions[result.detail.nation]);
  if(result.detail?.explored&&!silent&&(!flyerShown||Object.values(state.factions).some(f=>!before.factions[f.id]))){const x=result.detail.explored;toast(`自动探索：花了 ${x.spent} 令，揭开 ${x.revealed} 块地。`);}
  if(result.detail?.leftExplored&&!silent&&(!flyerShown||Object.values(state.factions).some(f=>!before.factions[f.id]))){const x=result.detail.leftExplored;toast(`余令去探索：剩下的 ${x.spent} 令揭开了 ${x.revealed} 块地。`);}
  if(action.type==='undo'){reportItems=[];renderReport();}
  storyHooks(before,action,result);
  queueWorldDetails(before,action);
  voiceFor(action,result);
  queueMicrotask(nextOverlay);
  return result;
}
function turnFlyer(income,fresh=null,explored=null,left=null){
  const box=$('flyer');box.hidden=false;
  box.innerHTML=`<i class="speed-lines"></i><div class="flyer-strip"><h2>${fresh?`发现 ${esc(fresh.name)}`:`第 ${state.turn} 回合`}</h2><p>${fresh?'在迷雾里发现了新的国家':income?`金币 ${income.gold>=0?'+':''}${income.gold}　补给 ${income.supply>=0?'+':''}${income.supply}${income.people?`　人口 +${income.people}`:''}`:''}</p>${explored&&!fresh?`<p>自动探索 ${explored.spent} 令 · 揭开 ${explored.revealed} 块</p>`:''}${left&&!fresh?`<p>剩下 ${left.spent} 令去探索 · 揭开 ${left.revealed} 块</p>`:''}</div>`;
  box.querySelector('.flyer-strip').classList.toggle('big',Boolean(fresh));clearTimeout(box._t);box._t=setTimeout(()=>{box.hidden=true;nextOverlay();},fresh?1950:1050);
}
/** 每回合自动探索: one row of steps (关 / 1 令 …), the same on the fog card and in 内政 · 边境. */
function autoExploreSteps(){
  const n=state.management?.explore||0,max=typeof AUTO_EXPLORE_MAX==='number'?AUTO_EXPLORE_MAX:4;
  return `<div class="pay-steps auto-explore" role="group" aria-label="每回合自动探索">${Array.from({length:max+1},(_,i)=>`<button type="button" data-auto-explore="${i}" aria-pressed="${n===i}">${i?`${i} 令`:'关'}</button>`).join('')}</div>`;
}
function autoExploreNote(){
  const n=state.management?.explore||0,next=n&&typeof autoExploreTarget==='function'?autoExploreTarget(state):null;
  const home=state.tiles[state.factions[state.playerId]?.capitalKey];
  let where='';
  if(next&&home){const x=Math.sqrt(3)*((next.q-home.q)+(next.r-home.r)/2),y=1.5*(next.r-home.r),i=Math.round(Math.atan2(y,x)/(Math.PI/4));where=`首都${['东','东南','南','西南','西','西北','北','东北'][(i+8)%8]}边`;}
  return n?`下回合开头先花 ${n} 令${where?`，从${where}的迷雾探起`:''}；指令不够或迷雾探完就停。`:'现在关着：只有你点「探索」才会探。';
}
function bindAutoExplore(root){
  root.querySelectorAll('[data-auto-explore]').forEach(b=>b.onclick=()=>{const amount=Number(b.dataset.autoExplore);const r=runAction({type:'setAutoExplore',amount});if(r?.ok)toast(amount?`每回合开头自动探索 ${amount} 令。`:'自动探索关了。');});
}
function autoExploreForm(){
  return {html:`<p class="rf-say">每回合开头自动花几令去探迷雾：先探离首都近、能揭开更多新地的方向。每次 1 令，不花金和粮。</p>${autoExploreSteps()}<small class="cs-hint auto-explore-note">${esc(autoExploreNote())}</small>${leftExploreSwitch()}`,bind:root=>{bindAutoExplore(root);bindLeftExploreSwitch(root);}};
}
const ACTION_VOICES={explore:'explore',claim:'claim',build:'build',upgrade:'build',recruit:'recruit'};
function voiceFor(action,result){
  if(state.battle)return;
  if(action.type==='endTurn'){
    const faction=state.factions[state.playerId],who=speaker();
    if(!who)return;
    setTimeout(()=>{if(faction.gold<8||faction.supply<4)say(who,'poor',true);else if(faction.gold>90)say(who,'rich',true);else say(who,'turn_start',true);},900);
    return;
  }
  if(action.type==='finishBattle'){const r=result.detail?.result;if(r){for(const id of r.rescuedCharacterIds||[])if(say(id,'rescued',true))return;const id=state.activeHeroId;if(id)say(id,r.playerWon?'win':'lose',true);}return;}
  if(ACTION_VOICES[action.type])say(speaker(),ACTION_VOICES[action.type]);
}
function openModal(title,kicker,html,setup,refresh=null,{dismissible=true}={}){openModal.checkpointCleanup?.();openModal.checkpointCleanup=null;openModal.artPackCleanup?.();openModal.artPackCleanup=null;cancelSaveImport();backTo(null);$('modal').className='screen';$('close-modal').hidden=!dismissible;$('modal-title').textContent=title;$('modal-kicker').textContent=kicker;morph($('modal-body'),html);modalRefresh=refresh;if(!$('modal').open)$('modal').showModal();$('modal-body').scrollTop=0;if(setup)setup();renderPurse();renderSaveStatus();}
const openReading=(title,kicker,html,...rest)=>openModal(title,kicker,`<div class="reading">${html}</div>`,...rest);
function vTitleHtml(text,extra=''){
  const s=String(text??''),chars=[...s],at=extra?` ${extra}`:'';
  if(/^[\x20-\x7e]+$/.test(s))return `<h2${at} style="--n:${chars.length}">${esc(s)}</h2>`;
  return `<h2${at} class="cs-v" style="--n:${chars.length}">${chars.map(ch=>`<i${ch==='·'?' class="dot"':''}>${esc(ch)}</i>`).join('')}</h2>`;
}
/* ---------------------------------------------------------------------------------------------
   Map tools. An order that needs a second place (a road's far end, a landing field, a voyage, a
   ceded tile) keeps the player on the map: the card sits where the army card sits and updates as
   tiles are tapped; the route and the price show at once. A second tap on the same tile, the
   burst, or Enter does it; × or Esc backs out. Nothing ever bounces back to a menu.
   options: { title, subtitle, icon, from, initial, eligible(tile), why(tile), preview(key),
              route(preview,key), render(tile,preview,ready), confirmLabel, onPick(key|keys), onCancel,
              multi (tap toggles a set), ready(picker) }
   --------------------------------------------------------------------------------------------- */
function beginMapPick(options){
  if(state.battle)return;
  clearArmy();closeFlowerQuiet();
  const first=options.initial&&state.tiles[options.initial]&&options.eligible(state.tiles[options.initial])?options.initial:null;
  mapPick={...options,chosen:options.multi?null:first,chosenSet:new Set(options.multi?(options.initialSet||[]):[]),note:''};
  document.body.classList.add('picking-campaign-tile');worldMap.setPicking?.(true);
  if($('modal').open)closeModal();
  worldMap.setHints(mapHints());
  if(first||options.from)worldMap.centerOn(first||options.from);
  if(first)worldMap.select(first);
  renderMapPicker();
}
function mapPickPreview(picker=mapPick){
  if(!picker||picker.multi)return picker?.preview?.([...(picker.chosenSet||[])])||null;
  const tile=state.tiles[picker.chosen];
  return tile&&picker.preview?picker.preview(tile.key):null;
}
function mapPickReady(picker=mapPick){
  if(!picker)return false;
  if(picker.ready)return Boolean(picker.ready(picker));
  if(picker.multi){const p=mapPickPreview(picker);return Boolean(picker.chosenSet.size&&(!p||p.enabled!==false));}
  const tile=state.tiles[picker.chosen],p=mapPickPreview(picker);
  return Boolean(tile&&picker.eligible(tile)&&(!p||p.enabled!==false));
}
function mapPickTap(key){
  const picker=mapPick,tile=state.tiles[key];if(!picker)return;
  if(!tile?.discovered||!picker.eligible(tile)){
    picker.note=picker.why?.(tile)||'这里不行，换一块白框里的地。';renderMapPicker();
    const note=$('map-pick-note');if(note){note.classList.remove('nudge');void note.offsetWidth;note.classList.add('nudge');}
    return;
  }
  picker.note='';picker.folded=false;
  if(picker.multi){if(picker.chosenSet.has(key))picker.chosenSet.delete(key);else picker.chosenSet.add(key);renderMapPicker();return;}
  if(picker.chosen===key&&mapPickReady(picker)){finishMapPick(false);return;}
  picker.chosen=key;worldMap.select(key);renderMapPicker();
}
function finishMapPick(cancel=false){
  const picker=mapPick;if(!picker)return;
  if(!cancel&&!mapPickReady(picker)){const go=$('map-pick-confirm');if(go){go.classList.remove('nudge');void go.offsetWidth;go.classList.add('nudge');}return;}
  const key=picker.chosen,keys=[...(picker.chosenSet||[])];
  mapPick=null;document.body.classList.remove('picking-campaign-tile','army-open');worldMap.setPicking?.(false);
  worldMap.select(null);worldMap.setRoute(null);worldMap.setHints(mapHints());renderArmy();
  if(cancel)picker.onCancel?.();else picker.onPick?.(picker.multi?keys:key);
}
/** A price as the HUD shows it: coin and grain icons with numbers, and whether commands are spent. */
function priceHtml(quote={},{noAp='不花指令',hideAp=false,action=null}={}){
  const cost=quote.cost||quote;
  const part=(img,alt,n)=>n?`<span class="pp"><img src="assets/icons/${img}.webp" alt="${alt}" />${format(n)}</span>`:'';
  const summary=`<span class="pick-price">${part('gold','金币',cost.gold)}${part('food','补给',cost.supply)}${hideAp?'':`<span class="pp ap">${cost.ap?`${cost.ap} 令`:esc(noAp)}</span>`}</span>`;
  if(hideAp||!(cost.gold||cost.supply)||typeof feeDisclosureHtml!=='function')return summary;
  const source=action?{action,cost}:quote;
  return feeDisclosureHtml(summary,expenseDetailsHtml(getExpenseBreakdown(state,source,cost)));
}
function expenseRowHtml(summary,action,cost){
  if(typeof feeDisclosureHtml!=='function'||typeof getExpenseBreakdown!=='function')return summary;
  return feeDisclosureHtml(summary,expenseDetailsHtml(getExpenseBreakdown(state,action,cost)));
}
function renderMapPicker(){
  const picker=mapPick,box=$('army-panel');if(!picker||!box)return;
  const tile=state.tiles[picker.chosen],preview=mapPickPreview(picker),ready=mapPickReady(picker),folded=Boolean(picker.folded);
  const body=picker.render?picker.render(tile,preview,ready):`<h4>${esc(tile?tileName(tile):(picker.instruction||'点地图上的白框'))}</h4>${preview?.cost?`<p>${priceHtml(preview)}</p>`:''}${preview?.reason?`<p class="alarm">${esc(preview.reason)}</p>`:''}`;
  document.body.classList.add('army-open');worldMap.setHints(mapHints());
  box.classList.toggle('folded',folded);
  morph(box,`<div class="ap-in map-tool ${esc(picker.kind||'')}"><header class="ap-head"><span class="ap-flag tool" aria-hidden="true">${icon(picker.icon||'map')}</span><h3>${esc(picker.title||picker.label||'选地块')}${picker.subtitle?`<small>${esc(picker.subtitle)}</small>`:''}</h3><button type="button" class="ap-mini ap-fold-btn" id="map-pick-fold" aria-expanded="${!folded}" title="${folded?'展开面板':'收起面板看地图'}">${folded?'展开 ▴':'收起 ▾'}</button><button class="tag-close" id="map-pick-cancel" aria-label="取消">${icon('close')}</button></header><div class="ap-body"><div class="ap-order target"><div class="ap-goal">${body}${picker.note?`<p class="alarm" id="map-pick-note">${esc(picker.note)}</p>`:''}</div><button class="ap-go cs-burst ${picker.danger?'red':''}" id="map-pick-confirm" ${ready?'':'aria-disabled="true"'}><span>${esc(picker.confirmLabel||'确定！')}</span></button></div>${picker.foot?picker.foot(tile,preview):''}</div></div>`);
  box.hidden=false;
  if($('map-pick-fold'))$('map-pick-fold').onclick=()=>{picker.folded=!picker.folded;renderMapPicker();};
  $('map-pick-cancel').onclick=()=>finishMapPick(true);
  if($('map-pick-confirm'))$('map-pick-confirm').onclick=e=>{if(e.detail>1)return;if(!mapPickReady(picker)){toast(preview?.reason||picker.instruction||'先在地图上点一块白框。',true);return;}finishMapPick(false);};
  picker.bind?.(box);
  const route=picker.route?picker.route(preview,picker.chosen):(preview?.path?.length>1?{from:preview.path[0],to:preview.path.at(-1),kind:'far',path:preview.path,stops:[]}:null);
  worldMap.setRoute(route||null);
  placeArmy();
}
/** 修路: start here, tap where the road should end, see the whole road and its price, build it in one go. */
function startRoadTool(fromKey){
  const from=state.tiles[fromKey];if(!from)return;
  const eligible=t=>t.ownerId===state.playerId&&!t.shipId&&t.cutSince===undefined&&walkable(state,t);
  beginMapPick({kind:'road',icon:'map',title:'修路',subtitle:`从 ${tileName(from)} ${from.key}`,from:fromKey,initial:from.road?null:fromKey,eligible,
    why:t=>!t?.discovered?'迷雾里修不了路。':t.ownerId!==state.playerId?'只能在自己的土地上修路；无主地先开拓。':t.cutSince!==undefined?'这块地和首都失联，不能动工。':'水面修不了路。',
    preview:key=>roadRouteQuote(state,fromKey,key),
    route:(q)=>q?.path?.length?{from:q.path[0],to:q.path.at(-1),kind:'road',path:q.path,stops:[]}:null,
    render:(tile,q)=>{
      if(!tile)return `<h4>点地图上的终点</h4><p>白框里的己方土地都能修到。路线自动挑最省钱的，已有道路的格子不收钱。</p>`;
      const only=tile.key===fromKey,n=q?.keys?.length||0;
      return `<h4>${only?'只修这一格':`修到 ${esc(tileName(tile))}`}<small>${esc(tile.key)}</small></h4><p>${n?`${n} 格新路${q.existing?` · 沿用 ${q.existing} 格旧路`:''}`:'没有要修的格子'} · 修好后行军只算半格</p><p>${priceHtml(q||{})}</p>${only?'<p>想修长路就再点终点。</p>':'<p>再点一次终点，或按右边的按钮。</p>'}${q&&!q.enabled?`<p class="alarm">${esc(q.reason)}</p>`:''}`;
    },
    confirmLabel:'修路！',
    onPick:key=>{
      const q=roadRouteQuote(state,fromKey,key);if(!q.enabled){toast(q.reason,true);return;}
      const keys=[...q.keys],r=runAction(q.action);
      if(r.ok){toast(`修好了 ${keys.length} 格路（${q.cost.gold} 金 · ${q.cost.supply} 粮，不花指令）。`);keys.forEach((k,i)=>popTile(k,'路','',i*60));}
    }});
}
if(typeof document!=='undefined'&&typeof document.addEventListener==='function')document.addEventListener('keydown',event=>{
  if(typeof mapPick==='undefined'||!mapPick)return;
  if(['Enter',' '].includes(event.key)&&event.target?.closest?.('[data-fee-toggle]'))return;
  if(event.key==='Escape')finishMapPick(true);
  else if(event.key==='Enter')finishMapPick(false);
  else if(event.key==='Tab')return;
  event.preventDefault();event.stopImmediatePropagation();
},true);
// A required story choice has no Close control. Native Escape must leave that same
// line visible, rather than close and immediately replay the still-pending event.
$('modal').addEventListener('cancel',event=>{if($('close-modal').hidden)event.preventDefault();});
$('modal').addEventListener('close',()=>{if($('modal').open)return;openModal.checkpointCleanup?.();openModal.checkpointCleanup=null;openModal.artPackCleanup?.();openModal.artPackCleanup=null;cancelSaveImport();backTo(null);$('modal').className='screen';modalRefresh=null;sceneInBattle=false;document.body.append($('toast-container'));$('toast-container').classList.remove('in-dialog');if(!$('title-screen').hidden&&$('title-import-back'))$('menu-import')?.focus({preventScroll:true});renderSaveStatus();queueMicrotask(nextOverlay);});
function closeModal(){openModal.checkpointCleanup?.();openModal.checkpointCleanup=null;openModal.artPackCleanup?.();openModal.artPackCleanup=null;cancelSaveImport();sceneInBattle=false;if($('modal').open)$('modal').close();render();}
$('close-modal').onclick=closeModal;

let modalBack=null;
/** A view-only return target; required story choices never expose it. */
function backTo(run){modalBack=$('close-modal').hidden?null:run;const button=$('modal-back');if(button)button.hidden=!modalBack;}
function renderPurse(){
  const box=$('modal-purse');if(!box)return;
  box.hidden=!state||!$('title-screen').hidden||Boolean(lesson);if(box.hidden)return;
  const f=state.factions[state.playerId];
  morph(box,`<span><img src="assets/icons/gold.webp" alt="金币" />${format(f.gold)}</span><span><img src="assets/icons/food.webp" alt="补给" />${format(f.supply)}</span><span class="ap">${state.ap} 令</span>`);
}
if($('modal-back'))$('modal-back').onclick=()=>{if(!$('modal').open||$('close-modal').hidden)return;const go=modalBack;backTo(null);go?.();};
function bindComicAction(button,run=button?.onclick){
  if(!button||!run)return;
  return bindViewAction(button,{getState:()=>state,isCurrent:()=>$('modal').open&&$('modal-body').contains(button),run});
}

let rosterSort='join',rosterFilter='all',seenLevelSeq=0,rosterOrder=[],sheetTab='grow',sheetSayTimer=0,sheetStat='attack',sheetPerk=null,sheetSeat=null,sheetPeek=false,sheetEnter='',talkPick=null;
const ROLE_NAME={vanguard:'先锋',ranger:'游击',guard:'卫戍',support:'鼓舞'};
const SORTS=[['join','入队顺序'],['level','等级'],['power','战力'],['bond','信赖'],['quirk','词条'],['group','团体'],['role','职业']];
/** Where a signature trait works, in the order a player assigns people: armies first, then seats, offices, and the ones that need nothing. */
const QUIRK_ORDER=['army','seat','capital','tile','lead','office','post','realm'];
const FILTERS=[['all','全部'],['ready','可出战'],['perk','待选天赋'],['post','任职中'],['duty','差事中'],['held','被俘/关押']];
const power=v=>v.stats.attack*2+v.stats.defense*2+v.stats.scout+v.stats.economy+v.stats.charm+v.level*2;
const groupName=id=>GROUPS[id]||id||'无所属';
function myPeople(){
  const held=Object.values(state.captives).filter(c=>c.originalFactionId===state.playerId||c.captorId===state.playerId).map(c=>c.characterId);
  return [...new Set([...state.recruitedHeroIds,...held])].map(id=>getCharacter(state,id)).filter(Boolean);
}
function statusOf(v){
  if(v.captive)return v.captive.captorId===state.playerId?'俘虏':'被俘';
  if(v.captivity?.parole.remaining)return `休整 ${v.captivity.parole.remaining} 回合`;
  if(v.id===state.activeHeroId)return v.stance==='garrison'?'领军 · 驻扎':'领军 · 行军';
  const post=POSTS.find(item=>item.id===v.post);if(post)return post.name;
  if(v.envoy)return '使节';
  if(v.duty&&typeof DUTIES!=='undefined')return `${DUTIES.find(d=>d.id===v.duty.job)?.name||'差事'} · ${tileName(state.tiles[v.duty.key])}`;
  return v.owner===state.playerId?(v.stance==='garrison'?'驻扎':'行军'):'';
}
const rgbOf=c=>{const m=/^#?([0-9a-f]{6})$/i.exec(String(c||''));return m?[0,2,4].map(i=>parseInt(m[1].slice(i,i+2),16)):null;};
/** The opposite hue of her colour: she stands on it, so her hair and clothes cannot melt into the panel. */
function popOf(hero){
  const c=rgbOf(hero);if(!c)return '#3d6f8e';
  const [r,g,b]=c.map(v=>v/255),max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;
  let h=0;if(d)h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;
  h=(h*60+540)%360;const l=(max+min)/2,s=d?d/(1-Math.abs(2*l-1)):0;
  return `hsl(${Math.round(h)} ${Math.round(Math.max(38,Math.min(62,s*62)))}% 34%)`;
}
function card(v){
  const status=statusOf(v);
  return `<button class="card ${v.captive?'held':''}" data-char="${esc(v.id)}" style="--hero:${esc(v.color||'#ffc83d')};--pop:${popOf(v.color||'#ffc83d')}"><i class="card-bg"></i><span class="card-art"><img src="${esc(portraitUrl(v,v.captive?'cry':'smile')||'assets/sazai.webp')}" alt="" loading="lazy" /></span><span class="card-lv">Lv ${v.level}</span>${status?`<span class="card-tag">${status}</span>`:''}${v.pending?.length?'<span class="card-new">天赋</span>':''}<span class="card-name"><b>${esc(v.name)}</b><small>${ROLE_NAME[v.role]||'—'} · ${v.owner===state.playerId&&!v.captive&&v.quirk?`<em class="card-quirk ${v.quirkNow&&!v.quirkNow.active?'off':''}" title="${esc(v.quirk.desc)}">${esc(v.quirk.name)}</em>`:esc(groupName(v.group))}</small></span><i class="card-bond" style="--v:${v.growth.bond}%"></i></button>`;
}
function showHeroes(scope=null,returnTo=null){
  if(scope&&scope!==state.playerId){
    const faction=state.factions[scope],list=Object.keys(state.characters).filter(id=>state.characterOwners[id]===scope&&!state.captives[id]&&!state.campaign?.prison?.[id]).map(id=>getCharacter(state,id));
    rosterOrder=list.map(v=>v.id);
    openModal(faction?.name||'成员',`${list.length} 人`,`<div class="cards">${list.map(card).join('')}</div><div class="form-actions"><button class="small-button secondary" id="back-nations">${returnTo?'返回会谈':'返回诸国'}</button></div>`,()=>{document.querySelectorAll('[data-char]').forEach(b=>b.onclick=()=>showCharacter(b.dataset.char,()=>showHeroes(scope,returnTo)));$('back-nations').onclick=returnTo||showFactions;backTo(returnTo||showFactions);});
    return;
  }
  const people=myPeople();
  let list=[...people];
  if(rosterFilter==='ready')list=list.filter(v=>!v.captive&&!v.post&&!v.duty&&!v.captivity?.parole.remaining);
  if(rosterFilter==='duty')list=list.filter(v=>v.duty);
  if(rosterFilter==='perk')list=list.filter(v=>v.pending?.length);
  if(rosterFilter==='post')list=list.filter(v=>v.post);
  if(rosterFilter==='held')list=list.filter(v=>v.captive);
  const joinOrder=new Map(state.recruitedHeroIds.map((id,i)=>[id,i]));
  const by={join:(a,b)=>(joinOrder.get(a.id)??999)-(joinOrder.get(b.id)??999),level:(a,b)=>b.level-a.level||b.growth.exp-a.growth.exp,power:(a,b)=>power(b)-power(a),bond:(a,b)=>b.growth.bond-a.growth.bond,group:(a,b)=>String(a.group).localeCompare(String(b.group)),role:(a,b)=>String(a.role).localeCompare(String(b.role)),quirk:(a,b)=>{const at=v=>{const i=typeof QUIRK_ORDER!=='undefined'?QUIRK_ORDER.indexOf(v.quirk?.where):-1;return v.captive||i<0?99:i;};return at(a)-at(b)||String(a.quirk?.name||'').localeCompare(String(b.quirk?.name||''),'zh')||b.level-a.level;}}[rosterSort]||((a,b)=>0);
  list.sort(by);rosterOrder=list.map(v=>v.id);
  const heads={group:v=>groupName(v.group),role:v=>ROLE_NAME[v.role]||'其他',quirk:v=>v.captive||!v.quirk?'还没加入':(typeof QUIRK_PLACES!=='undefined'&&QUIRK_PLACES[v.quirk.where])||'词条'}[rosterSort];
  let last=null;
  const cards=list.map(v=>{const head=heads?heads(v):null,html=head&&head!==last?`<h3 class="card-head">${esc(head)}</h3>`:'';last=head;return html+card(v);}).join('');
  const pending=myPeople().filter(v=>v.pending?.length&&!v.captive&&v.owner===state.playerId).length;
  const stats=getStats(state).sazai,jailed=Object.values(state.captives||{}).filter(c=>c.captorId===state.playerId||c.originalFactionId===state.playerId).length;
  const bags=`<div class="sazai-line">${['N','R','SR','SSR'].map(rank=>`<div class="bag" style="--glow:${RANK_GLOW[rank]}"><img src="assets/sazai.webp" alt="" /><div><b>${stats[rank]}</b><span>${rank} 级罪袋</span></div></div>`).join('')}</div>`;
  const chips=(rows,cur,attr)=>rows.map(([id,name])=>`<button class="chip ${cur===id?'on':''}" ${attr}="${id}">${name}</button>`).join('');
  const rosterTotal=people.length,heldHere=people.filter(v=>v.captive?.captorId===state.playerId).length,filterName=FILTERS.find(([id])=>id===rosterFilter)?.[1]||'当前筛选';
  const rosterCount=rosterFilter==='all'?`${rosterTotal} 人`:`${filterName} ${list.length} 人 · 全部 ${rosterTotal} 人`;
  openModal(heldHere?'同伴与俘虏':'同伴',rosterCount,`${typeof lessonNote==='function'?lessonNote('adv_jail','adv_post'):''}${heldHere?`<p class="form-hint roster-composition">同伴 ${rosterTotal-heldHere} 人 · 关押 ${heldHere} 人；关押者尚未加入。</p>`:''}${jailed?`<button class="small-button" id="open-jail">俘虏 ${jailed} 人</button>`:''}${pending?`<button class="small-button perk-summary" id="open-pending-perks">${pending} 位同伴有待选天赋 · 查看</button>`:''}<div class="bars-row"><div class="chips">${chips(SORTS,rosterSort,'data-sort')}</div><div class="chips">${chips(FILTERS,rosterFilter,'data-filter')}</div></div><div class="cards">${cards||`<p class="form-hint">${rosterFilter==='held'?'当前没有被俘或关押的角色。':'当前筛选没有角色。'}</p>`}</div>${bags}`,()=>{
    if($('open-jail'))$('open-jail').onclick=()=>showCaptiveSheet();
    if($('open-pending-perks'))$('open-pending-perks').onclick=()=>{rosterFilter='perk';showHeroes();};
    document.querySelectorAll('[data-sort]').forEach(b=>b.onclick=()=>{rosterSort=b.dataset.sort;showHeroes();});
    document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{rosterFilter=b.dataset.filter;showHeroes();});
    document.querySelectorAll('[data-char]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.char;
      if(state.captives?.[id])showCaptiveSheet(id);else showCharacter(id);
    });
  });
}
function radar(v){
  const size=200,c=size/2,r=78,n=STATS.length,max=Math.max(8,...STATS.map(s=>v.stats[s.id]||0));
  const point=(i,value)=>{const a=-Math.PI/2+i*2*Math.PI/n,k=Math.max(.06,value/max);return [c+Math.cos(a)*r*k,c+Math.sin(a)*r*k];};
  const poly=values=>values.map((value,i)=>point(i,value).map(x=>x.toFixed(1)).join(',')).join(' ');
  const rings=[.33,.66,1].map(k=>`<polygon class="ring" points="${poly(STATS.map(()=>max*k))}" />`).join('');
  const labels=STATS.map((s,i)=>{const a=-Math.PI/2+i*2*Math.PI/n,x=c+Math.cos(a)*(r+16),y=c+Math.sin(a)*(r+14)+4;return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${s.name}</text>`;}).join('');
  return `<svg class="radar" viewBox="0 0 ${size} ${size}" role="img" aria-label="能力图">${rings}<polygon class="base" points="${poly(STATS.map(s=>state.characters[v.id].stats?.[s.id]||0))}" /><polygon class="now" points="${poly(STATS.map(s=>v.stats[s.id]||0))}" />${labels}</svg>`;
}
/* The character page is one manga page: she stands in a splash panel and breaks out of its frame,
   and everything you do to her follows one grammar: tap a hexagon, read the caption, hit the burst. */
const SHEET_TABS=[['grow','能力','pentagon'],['perk','天赋','spark'],['bond','相处','heart'],['duty','任用','scroll']];
const SHEET_FACE={grow:'smile',perk:'happy',bond:'blush',duty:'smile'};
const GIFT_ICON={sweet:'cake',tea:'cup',book:'book',tool:'wrench',plush:'bear',snack:'cookie'};
/* Every hexagon is regular and sits on one lattice: height = width × 1.1547, centres one HEX_GAP apart edge to edge. */
const HEX_GAP=6,HEX_ROW=.866;
const SLOTS=[[.5,-.866],[1,0],[.5,.866],[-.5,.866],[-1,0],[-.5,-.866]];
const HEX_PLATE='M50 0 100 28.87V86.6L50 115.47 0 86.6V28.87Z',HEX_RING='M50 11.5 90 34.6V80.8L50 103.9 10 80.8V34.6Z';
const hexName=name=>{const c=[...name];return c.length===4?`${c.slice(0,2).join('')}<br>${c.slice(2).join('')}`:name;};
/** Why training is off right now, in words: a touch screen has no tooltip to hide this in. */
function trainBlock(v,stat){
  const gold=state.factions[state.playerId].gold;
  const limitNote=trainingLimitNote(v,stat);
  if(limitNote)return limitNote;
  if(v.captivity?.parole.remaining)return `假释休整至第 ${v.captivity.parole.until} 回合，期间不能特训`;
  if(state.battle||state.turnContinuation)return '请先完成当前战场与战争阶段';
  if(state.ap<1)return '指令用完了，下回合再来';
  if(gold<v.trainCost.gold)return `金币不够，还差 ${v.trainCost.gold-gold}`;
  if(v.growth.spirit<20)return '她太累了，干劲要 20 以上';
  return '';
}
const edges=new Map();
function makeEdge(url){
  if(!url||url.startsWith('data:'))return Promise.resolve('');
  if(edges.has(url))return Promise.resolve(edges.get(url));
  return new Promise(done=>{
    const img=new Image();
    img.onload=()=>{try{
      const w=img.naturalWidth,h=img.naturalHeight,R=4,shape=document.createElement('canvas'),edge=document.createElement('canvas');
      shape.width=edge.width=w;shape.height=edge.height=h;
      const s=shape.getContext('2d',{willReadFrequently:true});s.drawImage(img,0,0);
      const data=s.getImageData(0,0,w,h),px=data.data;
      // Only outline actual alpha shapes; never outline opaque rectangles or remove black pixels.
      if(!px.some((value,i)=>i%4===3&&value<170)){edges.set(url,'');done('');return;}
      for(let i=0;i<px.length;i+=4){px[i]=px[i+1]=px[i+2]=255;px[i+3]=px[i+3]>170?255:0;}
      s.putImageData(data,0,0);
      const e=edge.getContext('2d');for(let t=0;t<16;t++){const r=t*Math.PI/8;e.drawImage(shape,Math.cos(r)*R,Math.sin(r)*R);}
      const made=edge.toDataURL('image/png');edges.set(url,made);done(made);
    }catch{done('');}};
    img.onerror=()=>done('');img.src=url;
  });
}
const girlHtml=(url,alt,id='')=>!url||url.startsWith('data:')?`<div class="cs-girl art-brief" ${id?'id="cs-girl"':''}><span>素材待补：${esc(alt)}，透明半身立绘，8 种表情，沿底边裁切。</span><img ${id?`id="${id}"`:''} hidden alt="" /><img ${id?'id="poke-edge"':''} hidden alt="" /></div>`:`<div class="cs-girl" ${id?'id="cs-girl"':''}><img class="cs-edge" hidden ${id?'id="poke-edge"':''} src="${edges.get(url)||'data:,'}" alt="" /><img class="cs-art" ${id?`id="${id}"`:''} src="${esc(url)}" alt="${esc(alt)}" /></div>`;
const fitEdge=url=>makeEdge(url).then(made=>{const art=$('poke-img');if(art&&art.getAttribute('src')===url){const edge=$('poke-edge');if(edge){edge.hidden=!made;if(made)edge.src=made;}}});
const hexPlate=(fill='')=>`<svg viewBox="0 0 100 115.47" aria-hidden="true"><path class="plate" d="${HEX_PLATE}"${fill?` style="fill:${fill}"`:''}/>`;
const hexGauge=(cls,value,label,pct,color)=>`<div class="cs-hg ${cls}">${hexPlate()}<path class="bed" d="${HEX_RING}"/><path class="fill" pathLength="100" stroke-dasharray="${Math.min(100,Math.max(0,pct)).toFixed(1)} 100" style="stroke:${color}" d="${HEX_RING}"/></svg><b>${value}</b><small>${label}</small></div>`;
const hexRole=name=>`<div class="cs-hg role">${hexPlate('#c0271a')}</svg><b>${esc(name)}</b></div>`;
const seatFace=hero=>`<i class="cs-face"><img src="${esc(portraitUrl(hero,'smile')||'assets/sazai.webp')}" alt="${esc(hero.name)}" /></i>`;
function sheetGrow(v,id,mine){
  const g=v.growth,n=STATS.length,top=Math.max(6,...STATS.map(s=>v.stats[s.id]||0)),base=state.characters[id].stats||{};
  const size=232,cx=116,cy=124,R=60,HW=48,node=R+HW*.5774+HEX_GAP;
  const at=(i,k,r=R)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [cx+Math.cos(a)*r*k,cy+Math.sin(a)*r*k];};
  const poly=values=>values.map((value,i)=>at(i,Math.max(.08,value/top)).map(x=>x.toFixed(1)).join(',')).join(' ');
  const rings=[1,.66,.33].map(k=>`<polygon class="ring" points="${poly(STATS.map(()=>top*k))}" />`).join('');
  const spokes=STATS.map((s,i)=>{const [x,y]=at(i,1);return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" />`;}).join('');
  const picked=STATS.find(s=>s.id===sheetStat)||STATS[0];
  const nodes=STATS.map((s,i)=>{const [x,y]=at(i,1,node);return `<button class="hx cs-stat ${s.id===picked.id?'on':''} ${mine&&!trainBlock(v,s)?'can':''}" data-stat="${s.id}" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px" aria-label="${s.name} ${v.stats[s.id]||0}"><b>${v.stats[s.id]||0}</b><small>${s.name}</small></button>`;}).join('');
  const trained=g.trained[picked.id]||0,blocked=mine?trainBlock(v,picked):'',value=v.stats[picked.id]||0;
  const pick=`<div class="cs-pick"><h3 style="--p:${Math.min(100,value/top*100)}%">${picked.name}</h3>${mine?`<em>升级时成长率 ${growthRate(picked.id,base[picked.id]||0,g.bond)}%</em>`:''}<p>${esc(picked.about)}</p>${mine?`<i class="cs-pips" aria-label="已特训 ${trained} 次，上限 ${v.trainCap} 次">${'◆'.repeat(trained)}${'◇'.repeat(Math.max(0,v.trainCap-trained))}</i><button class="cs-burst" data-train="${picked.id}" aria-label="立即特训${esc(picked.name)}，消耗 ${v.trainCost.gold} 金币、${v.trainCost.ap} 指令和 15 干劲" aria-describedby="training-action-note" ${blocked?'disabled':''}><span>特训！</span></button><small class="${blocked?'warn':''}">${blocked?esc(blocked):typeof expenseRowHtml==='function'?expenseRowHtml(`${v.trainCost.gold} 金 · ${v.trainCost.ap} 令 · 15 干劲`,{type:'train',characterId:v.id,stat:picked.id},v.trainCost):`${v.trainCost.gold} 金 · ${v.trainCost.ap} 令 · 15 干劲`}</small><p class="cs-action-note" id="training-action-note">点「特训」立即消耗${g.level>=MAX_LEVEL?'':'，也给一点经验'}；点错了回地图能撤销上一步。</p><details class="cs-how"><summary>特训怎么算</summary><p>强化所选${esc(picked.name)}属性。${g.level>=MAX_LEVEL?'角色已满级，不再积累经验。':'特训也会获得角色经验，经验足够才提升角色 Lv，不是每次都升级。'}统军属性不是角色 Lv；常备军需另行付费训练。后续操作可能清空撤销记录。</p></details>`:''}</div>`;
  const traits=traitsOf(state.characters[id].stats);
  // Her signature trait, said the way a manga introduces a special move: the name, where it works, and whether it is working now.
  const quirk=v.quirk||(typeof quirkOf==='function'?quirkOf(state.characters[id]):null),now=v.quirkNow,place=quirk&&typeof QUIRK_PLACES!=='undefined'?QUIRK_PLACES[quirk.where]||'':'';
  const quirkCard=quirk?`<div class="cs-quirk ${now?(now.active?'on':'off'):''}"><span class="cs-qtag">专属词条</span><h4>${esc(quirk.name)}</h4><em>${esc(place)}</em>${now?`<small class="cs-qnow">${now.active?'生效中':'没生效'}</small>`:''}<p>${esc(quirk.desc)}</p>${now&&!now.active?`<p class="cs-qtip">${esc(now.tip)}</p>`:''}</div>`:'';
  // What to do with her next, at most three lines: the things a new player would otherwise have to hunt for.
  const steps=[];
  if(mine){
    const free=STATS.filter(s=>!trainBlock(v,s)).length,left=STATS.reduce((sum,s)=>sum+Math.max(0,v.trainCap-(g.trained[s.id]||0)),0),nextPerk=typeof PERK_LEVELS!=='undefined'?PERK_LEVELS.find(level=>level>g.level):null,tier=typeof BOND_TIERS!=='undefined'?BOND_TIERS.find(row=>row.at>g.bond):null;
    if(v.pending?.length)steps.push(['perk',`有 ${v.pending.length} 个天赋等她选`,'去「天赋」']);
    if(free)steps.push(['',`现在能特训 ${free} 项，点一个六角再点「特训！」`,'']);
    else if(left)steps.push(['',`还能特训 ${left} 次，${v.trainCost.gold} 金一次`,'']);
    if(g.level<MAX_LEVEL)steps.push(['',`升到 Lv ${g.level+1} 还差 ${Math.max(0,v.need-g.exp)} 经验${nextPerk?`，Lv ${nextPerk} 开下一档天赋`:''}`,'']);
    if(tier)steps.push(['bond',`信赖 ${g.bond}/${tier.at}：到了就${tier.reward}`,'去「相处」']);
  }
  const nextHtml=steps.length?`<ul class="cs-next" aria-label="接下来">${steps.slice(0,3).map(([tab,text,go])=>`<li>${tab?`<button data-tab="${tab}">${esc(text)}<i>${esc(go)} ›</i></button>`:`<span>${esc(text)}</span>`}</li>`).join('')}</ul>`:'';
  const notes=`${nextHtml}<div class="cs-notes">${traits.map(t=>`<p class="cs-trait"><b>${esc(t.name)}</b>${esc(t.desc)}</p>`).join('')}${v.captivity?.parole.remaining?`<p class="guide-note">假释休整至第 ${v.captivity.parole.until} 回合，期间不能部署、任职或特训；属性不受损。</p>`:''}<p class="cs-record"><span>出战<b>${g.battles}</b></span><span>胜<b>${g.wins}</b></span><span>击倒<b>${g.kills}</b></span><span>被俘<b>${g.captured}</b></span></p>${v.captive?.captorId===state.playerId?'<button class="cs-link" id="to-captives">去牢房<span>›</span></button>':''}</div>`;
  return `${quirkCard}<div class="cs-grow"><div class="cs-dial" style="width:${size}px;height:${size}px"><svg viewBox="0 0 ${size} ${size}" aria-hidden="true">${rings}${spokes}<polygon class="base" points="${poly(STATS.map(s=>base[s.id]||0))}" /><polygon class="now" points="${poly(STATS.map(s=>v.stats[s.id]||0))}" /></svg>${nodes}</div>${pick}</div>${notes}`;
}
function sheetPerks(v,mine){
  const g=v.growth,W=innerHeight<=600?44:innerHeight<=650?50:54,H=W*1.1547,D=W+HEX_GAP,STEP=D*HEX_ROW,LV=42,tierCount=PERK_LEVELS.length;
  const widest=Math.max(...PERK_LEVELS.map((_,t)=>perkChoices(v.role,t).length)),width=LV+widest*D-HEX_GAP,cells=[],line=[];
  PERK_LEVELS.forEach((level,t)=>{
    const options=perkChoices(v.role,t),chosen=g.perks[t],reached=g.level>=level,open=reached&&!chosen&&mine;
    // Rows climb one half-cell at a time, so each row nests into the gaps of the row above.
    const half=(tierCount-1-t)%2?.5:0,wish=(widest-1)/2+(t-1)/2-(options.length-1)/2,start=Math.max(0,Math.min(widest-options.length,Math.round(wish-half)+half)),y=t*STEP;
    cells.push(`<span class="cs-lv ${reached?'on':''}" style="top:${(y+H/2-11).toFixed(1)}px">Lv ${level}</span>`);
    options.forEach((p,i)=>{
      const x=LV+(start+i)*D;if(chosen===p.id)line.push([(x+W/2).toFixed(1),(y+H/2).toFixed(1)]);
      cells.push(`<button class="hx cs-perk ${chosen===p.id?'got':''} ${open?'open':''} ${reached?'':'locked'} ${sheetPerk===`${t}|${p.id}`?'on':''}" data-pick-perk="${t}|${p.id}" style="--hxw:${W}px;left:${x.toFixed(1)}px;top:${y.toFixed(1)}px"><b>${hexName(esc(p.name))}</b></button>`);
    });
  });
  const [tier,perkId]=(sheetPerk||'').split('|'),option=sheetPerk?perkChoices(v.role,Number(tier)).find(p=>p.id===perkId):null;
  const canLearn=option&&mine&&!v.captivity?.parole.remaining&&!state.battle&&!state.turnContinuation&&g.level>=PERK_LEVELS[tier]&&!g.perks[tier];
  const next=PERK_LEVELS.find(level=>level>g.level);
  const cap=option?`<div class="cs-cap"><div><h3>${esc(option.name)}</h3><p>${esc(option.desc)}</p><small>${v.captivity?.parole.remaining?'假释休整期间不能选择天赋':state.battle||state.turnContinuation?'请先完成当前战场与战争阶段':g.perks[tier]===option.id?'已经学会':g.perks[tier]?'这一档已经选了别的':g.level<PERK_LEVELS[tier]?`Lv ${PERK_LEVELS[tier]} 解锁`:'每档只能选一个，选定后不能改'}</small></div>${canLearn?`<button class="cs-burst small" id="learn"><span>学会！</span></button>`:''}</div>`:`<div class="cs-cap"><div><h3>${mine&&v.pending.length?'可以选天赋了':'天赋'}</h3><p>${mine&&v.pending.length?'金边的六角现在就能选，点一个看看。':next?`Lv ${next} 解锁下一档。点六角看说明。`:'全部解锁了。点六角看说明。'}</p></div></div>`;
  const treeH=Math.ceil((tierCount-1)*STEP+H);
  return `<div class="cs-tree" style="width:${width}px;height:${treeH}px">${line.length>1?`<svg viewBox="0 0 ${width} ${treeH}" aria-hidden="true"><polyline points="${line.map(p=>p.join(',')).join(' ')}" /></svg>`:''}${cells.join('')}</div>${cap}`;
}
/* Extension hexes (see extensions.mjs): one row of hexes; tapping one puts its line in the narration
   box, the burst button runs it. Nothing registered means no row at all. */
let extPick=null;
function extensionRow(list,label='互动'){
  if(!list.length)return '';
  const chosen=list.find(item=>item.id===extPick)||null;
  const spend=chosen&&(chosen.cost.ap||chosen.cost.gold||chosen.cost.supply)?costLine(chosen.cost):'';
  return `<section class="ext-row" aria-label="${esc(label)}"><h4>${esc(label)}</h4><div class="cs-acts">${list.map(item=>`<button class="hx cs-act ${item.id===chosen?.id?'on':''} ${item.enabled?'':'off'}" data-ext-pick="${esc(item.id)}" aria-pressed="${item.id===chosen?.id}">${item.icon?icon(item.icon):''}<b>${hexName(esc(item.label))}</b></button>`).join('')}</div>${chosen?`<div class="cs-cap"><div><h3>${esc(chosen.label)}</h3>${chosen.detail?`<p>${esc(chosen.detail)}</p>`:''}${spend?`<small>${esc(spend)}</small>`:''}${chosen.enabled?'':`<small class="warn">${esc(chosen.reason)}</small>`}</div><button class="cs-burst small" id="ext-go" ${chosen.enabled?'':'disabled'}><span>就这样</span></button></div>`:''}</section>`;
}
function bindExtensionRow(list,{redo,context}){
  document.querySelectorAll('[data-ext-pick]').forEach(b=>b.onclick=()=>{extPick=extPick===b.dataset.extPick?null:b.dataset.extPick;redo();});
  const chosen=list.find(item=>item.id===extPick),go=$('ext-go');
  if(chosen&&go)bindComicAction(go,()=>{if(!chosen.enabled)return;const result=chosen.run(context());extPick=null;if(result?.ok!==false&&$('ext-go')===go)redo();return result;});
}
function girlContext(v,id,act,extra={}){return {state,characterId:id,hero:v,view:v,dispatch:action=>act(action,{silent:true}),toast,refresh:()=>showCharacter(id,null,true),...extra};}
function sheetBond(v,id,canAct){
  const g=v.growth,gold=state.factions[state.playerId].gold;
  const giftNote=!canAct?(v.captivity?.parole.remaining?`假释休整至第 ${v.captivity.parole.until} 回合`:'请先完成当前战场与战争阶段'):!v.canGift?'这回合送过了':gold<GIFT_COST?'金币不够送礼':`点礼物即送出：${GIFT_COST} 金 · 信赖 +${v.giftGains?.plain??6}`;
  return renderBondPage({gifts:GIFTS,tiers:BOND_TIERS,tier:bondTier(g.bond),bond:g.bond,canTalk:v.canTalk&&canAct,canGift:v.canGift&&gold>=GIFT_COST&&canAct,knownLike:g.knownLike,likedGiftId:v.likes,giftCost:GIFT_COST,giftNote,likedGiftGain:v.giftGains?.liked??14,canAct},{esc,icon});
}
function sheetDuty(v,id,canAct){
  const leader=id===state.activeHeroId,seat=sheetSeat&&(sheetSeat==='leader'||POSTS.some(p=>p.id===sheetSeat))?sheetSeat:v.post||'leader';
  const rows=[{id:'leader',name:'领军',who:state.activeHeroId},...POSTS.map(p=>({id:p.id,name:p.name,who:state.posts[p.id]}))];
  const seats=rows.map(row=>{const hero=row.who?state.characters[row.who]:null;return `<button class="cs-seatwrap ${seat===row.id?'on':''}" data-seat="${row.id}"><span class="hx cs-seat ${row.who===id?'mine':''}">${hero?seatFace(hero):'<em>空缺</em>'}</span><small>${row.name}</small></button>`;}).join('');
  const post=POSTS.find(p=>p.id===seat),on=post&&state.posts[post.id]===id,quote=post?getPostQuote(state,post.id,on?null:id):null;
  const leaderCost=typeof CIVIC_COPY!=='undefined'?CIVIC_COPY.apNeed.replace('{ap}','2').replace('{left}',String(state.ap)):'2 指令';
  const about=post?post.about:'站在世界上的主角，指挥全军出战。',note=post?(quote.enabled?'新任职需本人位于当前首都；任职期间留守，不上战场。':quote.reason):(leader?'她就是现任领军。':!canAct?(v.captivity?.parole.remaining?'假释休整期间不能部署。':'战斗中不能任命领军。'):state.ap<2?leaderCost:`现任 ${currentHero()?.name||'无'}，${leaderCost}${v.post?'同时卸任当前职位。':''}`);
  const act=post?`<button class="cs-burst small" id="seat-go" data-post="${post.id}" ${quote.enabled?'':'disabled'}><span>${on?'卸任':'任命！'}</span></button>`:leader?'':`<button class="cs-burst small" id="make-leader" ${state.ap>=2&&canAct?'':'disabled'}><span>任命！</span></button>`;
  const where=v.post?'正在任职':v.duty&&typeof DUTIES!=='undefined'?`在 ${esc(tileName(state.tiles[v.duty.key]))} ${esc(DUTIES.find(d=>d.id===v.duty.job)?.name||'差事')}（不上阵）`:`${v.stance==='garrison'?'驻扎':'行军'}在 ${esc(tileName(state.tiles[v.station]))}`;
  return `${typeof lessonNote==='function'?lessonNote('adv_post'):''}<button class="cs-link wide" id="go-station" ${canAct&&!v.post?'':'disabled'}>${icon('map')}${where}${v.post?'':'<span>›</span>'}</button><div class="cs-seats">${seats}</div><div class="cs-cap"><div><h3>${post?post.name:'领军'}</h3><p>${esc(about)}</p><small>${esc(note)}</small></div>${act}</div>${post&&!v.post&&v.station!==capitalKey()?'<button class="cs-link" id="locate-for-post">定位角色，安排返回首都<span>›</span></button>':''}`;
}
function sheetSfx(text,x,y){const box=$('cs-sfx');if(!box)return;const el=document.createElement('span');el.textContent=text;el.style.left=x+'px';el.style.top=y+'px';box.append(el);setTimeout(()=>el.remove(),900);}
function showPrisonHall(returnTo=null){
  const count=Object.keys(state.campaign?.prison||{}).length;
  const body=typeof campaignUI!=='undefined'&&campaignUI?campaignUI.prisonRosterHtml(state,{always:true}):'';
  openReading('肖申克监狱',`${count} 人收押`,`<div class="comic-sheet">${body}<div class="form-actions"><button type="button" class="small-button secondary" id="prison-open-captives">查看俘虏名册</button><button type="button" class="small-button secondary" id="prison-hall-back">返回</button></div></div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-cell');
    const goBack=returnTo||(()=>showHeroes());
    backTo(goBack);
    if($('prison-open-captives'))$('prison-open-captives').onclick=()=>showCaptives();
    if($('prison-hall-back'))$('prison-hall-back').onclick=goBack;
  });
}
function showCharacter(id,back=null,keep=false){
  const v=getCharacter(state,id);if(!v)return;
  const mine=v.owner===state.playerId&&!v.captive,g=v.growth,canAct=!state.battle&&!state.turnContinuation&&!v.captivity?.parole.remaining,tabs=mine?SHEET_TABS:SHEET_TABS.slice(0,2);
  if(!keep){sheetPerk=null;sheetSeat=null;sheetPeek=false;if(mine&&v.pending.length)sheetTab='perk';}
  if(!tabs.some(([key])=>key===sheetTab))sheetTab='grow';
  if(!rosterOrder.includes(id)){const people=myPeople().map(p=>p.id);rosterOrder=people.includes(id)?people:[id];}
  const at=rosterOrder.indexOf(id),many=rosterOrder.length>1,len=rosterOrder.length;
  const face=v.captive?'cry':g.spirit<=30?'sleepy':SHEET_FACE[sheetTab];
  const portraitSource=portraitUrl(v,face)||portraitUrl(v,'smile');
  const portrait=portraitSource||'assets/sazai.webp',hasPortrait=Boolean(portraitSource&&!portraitSource.startsWith('data:'));
  const heldHere=v.captive?.captorId===state.playerId;
  const extBase={state,characterId:id,hero:v,view:v,mine,canAct,tab:sheetTab,captive:v.captive,held:heldHere};
  const extList=mine&&typeof sheetExtensions==='function'?[...(sheetTab==='bond'?bondExtensions(extBase):[]),...sheetExtensions(sheetTab,extBase)]:(heldHere&&sheetTab==='grow'&&typeof captiveExtensions==='function'?captiveExtensions(extBase):[]);
  if(extList.length&&!extList.some(item=>item.id===extPick))extPick=null;
  const hallCount=Object.keys(state.campaign?.prison||{}).length;
  const dutyHallFoot=mine&&sheetTab==='duty'?`<div class="cs-duty-foot"><small>仅进入查看名册，不处决当前角色</small><button type="button" class="small-button secondary cs-hall-btn" id="open-exec-hall">${icon('fort')}<span>进入处刑室${hallCount?`（${hallCount}）`:''} ›</span></button></div>`:'';
  const panel={grow:()=>sheetGrow(v,id,mine),perk:()=>sheetPerks(v,mine),bond:()=>sheetBond(v,id,canAct),duty:()=>sheetDuty(v,id,canAct)}[sheetTab]()+(extList.length?extensionRow(extList,sheetTab==='bond'?'互动':heldHere?'处决':'更多'):'')+dutyHallFoot;
  const peer=(by,label)=>{const hero=state.characters[rosterOrder[(at+by+len)%len]];return `<button class="cs-peer" data-step="${by}" aria-label="${label}：${esc(hero?.name||'')}"><i class="cs-face"><img src="${esc(portraitUrl(hero,'smile')||'assets/sazai.webp')}" alt="" /></i></button>`;};
  const status=statusOf(v),titles=titlesOf(g);
  const html=`<div class="cs ${sheetPeek?'peek':''}" style="--hero:${esc(v.color||'#ffc83d')};--pop:${popOf(v.color||'#ffc83d')}">
    <div class="cs-stage" id="poke">
      <div class="cs-frame"><i></i></div>
      ${girlHtml(portrait,v.name,'poke-img')}
    </div>
    <header class="cs-id">${typeof vTitleHtml==='function'?vTitleHtml(v.name):`<h2 style="--n:${[...v.name].length}">${esc(v.name)}</h2>`}</header>
    <span class="cs-ribbon"><b>${esc(groupName(v.group))}</b>${v.specialty?`<i>${esc(v.specialty)}</i>`:''}${typeof mobilityOf==='function'&&mobilityOf(state,id)?.air?'<u class="cs-air-tag" title="具备天生飞行能力，可在编队面板或任用页直接起飞">可飞行</u>':''}</span>
    ${status?`<span class="cs-status">${esc(status)}</span>`:''}
    <div class="cs-gauges">${hexGauge('lv',v.level,'Lv',g.exp/v.need*100,'#ffc83d')}${hexGauge('bond',g.bond,BOND_TIERS[bondTier(g.bond)].name,g.bond,'#ff8fb0')}${hexGauge('spirit',g.spirit,'干劲',g.spirit,'#7cc7ff')}${hexRole(ROLE_NAME[v.role]||'—')}</div>
    <button class="cs-zoom" id="sheet-zoom" aria-label="看全身">${icon('expand')}</button>
    <div class="cs-peek-note">${titles.length?`<p class="cs-titles">${titles.map(t=>`<span>${esc(t)}</span>`).join('')}</p>`:''}${esc(v.description||'')}${hasPortrait?'':'<details class="art-source-note"><summary>素材说明</summary><p>缺少该角色的立绘资源。需要透明半身立绘、8 种表情，沿底边裁切。</p></details>'}</div>
    <div class="cs-sfx" id="cs-sfx" aria-hidden="true"></div>
    <div class="cs-say" id="sheet-say"></div>
    <div class="cs-leafwrap"><section class="cs-leaf" id="sheet-panel">${panel}</section></div>
    <nav class="cs-nav" aria-label="角色分页">
      ${many?peer(-1,'上一位'):''}
      <div class="cs-tabs">${tabs.map(([key,name,ic])=>`<button class="${key===sheetTab?'on':''}" data-tab="${key}">${icon(ic)}<span>${name}</span>${key==='perk'&&mine&&v.pending.length?'<i></i>':''}</button>`).join('')}</div>
      ${many?peer(1,'下一位'):''}
    </nav>
  </div>`;
  const entering=sheetEnter;sheetEnter='';
  const shown=state;let acting=false;
  const act=(action,options)=>{acting=true;try{return runAction(action,options);}finally{acting=false;}};
  const refresh=()=>{if(!acting&&state!==shown&&modalRefresh===refresh&&$('modal').open)showCharacter(id,back,true);};
  openModal('','',html,()=>{
    $('modal').className='screen sheet-mode';
    fitEdge(portrait);
    if(entering){$('cs-girl').classList.add(entering);setTimeout(()=>$('cs-girl')?.classList.remove(entering),420);}
    warmList(['smile','happy','blush','sleepy'].map(expr=>portraitUrl(v,expr)));
    const redo=()=>showCharacter(id,back,true);
    backTo(back||(()=>showHeroes()));
    const step=by=>{if(!many)return;sheetEnter=by>0?'in-r':'in-l';showCharacter(rosterOrder[(at+by+len)%len],back);$('sheet-panel').scrollTop=0;};
    const root=document.querySelector('.cs');clearTimeout(sheetSayTimer);
    document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{sheetPeek=false;sheetTab=b.dataset.tab;if(extList.length)extPick=null;redo();$('sheet-panel').scrollTop=0;});
    document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>step(Number(b.dataset.step)));
    let startX=0,startY=0;
    root.ontouchstart=e=>{startX=e.touches[0].clientX;startY=e.touches[0].clientY;};
    root.ontouchend=e=>{const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY,bar=$('sheet-panel').getBoundingClientRect().top;if((sheetPeek||startY<bar)&&Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*2)step(dx<0?1:-1);};
    const say=line=>{if(!line)return;const src=portraitUrl(v,line.expr||'happy');if(src){$('poke-img').src=src;fitEdge(src);}$('sheet-say').innerHTML=`<div class="bubble pop"><p>${esc(line.text)}</p></div>`;clearTimeout(sheetSayTimer);sheetSayTimer=setTimeout(()=>{if(root===document.querySelector('.cs')&&$('sheet-say'))$('sheet-say').innerHTML='';},4200);};
    const bounce=()=>{const girl=$('cs-girl');girl.classList.remove('poked');void girl.offsetWidth;girl.classList.add('poked');};
    $('poke').onclick=e=>{
      if(sheetPeek){sheetPeek=false;root.classList.remove('peek');return;}
      bounce();const box=root.getBoundingClientRect();sheetSfx('戳！',e.clientX-box.left,e.clientY-box.top);
      if(!v.captive&&v.owner===state.playerId)say(voiceLine(id,'idle')||voiceLine(id,'select'));
    };
    $('sheet-zoom').onclick=()=>{sheetPeek=!sheetPeek;root.classList.toggle('peek',sheetPeek);};
    document.querySelectorAll('[data-stat]').forEach(b=>b.onclick=()=>{sheetStat=b.dataset.stat;redo();});
    document.querySelectorAll('[data-pick-perk]').forEach(b=>b.onclick=()=>{sheetPerk=b.dataset.pickPerk;redo();});
    document.querySelectorAll('[data-seat]').forEach(b=>b.onclick=()=>{sheetSeat=b.dataset.seat;redo();});
    document.querySelectorAll('[data-train]').forEach(b=>b.onclick=()=>{const stat=b.dataset.train,r=act({type:'train',characterId:id,stat},{silent:true});if(!r.ok){toast(r.error,true);return;}const box=b.getBoundingClientRect(),root2=root.getBoundingClientRect();redo();sheetSfx('嘿咻！',box.left-root2.left+box.width/2,box.top-root2.top);document.querySelector(`[data-stat="${stat}"]`)?.classList.add('bump');say(voiceLine(id,'build'));});
    if($('learn'))$('learn').onclick=()=>{const [tier,perk]=sheetPerk.split('|'),r=act({type:'choosePerk',characterId:id,tier:Number(tier),perk},{silent:true});if(!r.ok){toast(r.error,true);return;}queueSlot('perk.chosen',{who:id,param:perk});redo();bounce();const box=root.getBoundingClientRect();sheetSfx('领悟！',box.width*.5,box.height*.42);};
    bindBondInteractions({talkButton:$('talk'),giftButtons:document.querySelectorAll('[data-gift]')},{bindAction:bindComicAction,
      onGift:(item,b)=>{const rect=b.getBoundingClientRect(),box=root.getBoundingClientRect(),r=act({type:'gift',characterId:id,item},{silent:true});if(!r.ok){toast(r.error,true);return r;}queueSlot(r.detail.liked?'gift.loved':'gift.normal',{who:id});redo();sheetSfx(r.detail.liked?'♥♥♥':'♥',rect.left-box.left+rect.width/2,rect.top-box.top);say(r.detail.liked?{text:'这个！你怎么知道我喜欢这个！',expr:'happy'}:{text:'谢谢领主。',expr:'smile'});return r;},
      onTalk:()=>{const r=act({type:'talk',characterId:id},{silent:true});if(!r.ok){toast(r.error,true);return r;}const present=state.recruitedHeroIds.filter(x=>state.characterOwners?.[x]===state.playerId&&!state.captives?.[x]&&!(state.captureHistory?.[x]?.paroleUntil>state.turn));const d=findDialogue('talk.daily',{who:id,present},state.storySeen);if(d){playDialogue(d,id);return r;}redo();say(voiceLine(id,'idle'));return r;}
    });
    if(extList.length)bindExtensionRow(extList,{redo:()=>{if(!state.captives?.[id]&&state.characterOwners?.[id]!==state.playerId)showHeroes();else redo();},context:()=>girlContext(v,id,act,{say,captive:v.captive,held:heldHere})});
    if($('seat-go'))$('seat-go').onclick=()=>{const post=$('seat-go').dataset.post,on=state.posts[post]===id,quote=getPostQuote(state,post,on?null:id);if(!quote.enabled){toast(quote.reason,true);return;}const r=act(quote.action,{silent:true});if(!r.ok){toast(r.error,true);return;}if(!on)queueSlot('post.assigned',{who:id,param:post});redo();};

    if($('make-leader'))$('make-leader').onclick=()=>{const r=act({type:'assignHero',characterId:id},{silent:true});if(r.ok)redo();else toast(r.error,true);};
    if($('go-station'))$('go-station').onclick=()=>{if(v.duty&&typeof openRingForm==='function'){closeModal();openRingForm(v.duty.key,'差事',null);return;}showGarrison(v.station||capitalKey());backTo(()=>showCharacter(id,back,true));};
    if($('to-captives'))$('to-captives').onclick=()=>showCaptiveSheet(id);
    if($('locate-for-post'))$('locate-for-post').onclick=()=>{closeModal();cancelDispatch();const key=v.station||capitalKey();selectedKey=key;flowerOpen=true;render();worldMap.centerOn(key);fitFlower(key);toast(`请让 ${v.name} 随军返回首都 ${capitalKey()}，再任职。`);};
    if($('open-exec-hall'))$('open-exec-hall').onclick=()=>showPrisonHall(()=>showCharacter(id,back,true));
    for(const b of document.querySelectorAll('[data-train],#learn,#seat-go,#make-leader'))bindComicAction(b);
  },refresh);
}
/** Dialogue queue: moments enqueue here and play one at a time when nothing else is open. */
const dialogueQueue=[];
let sceneInBattle=false;
function queueSlot(slot,ctx){if(!ctx?.who||!state.characters[ctx.who])return;const domestic=/^(?:turn\.random|join\.(?:first|reunion)|talk\.daily|gift\.(?:normal|loved)|bond\.tier|level\.milestone|perk\.chosen|post\.assigned)$/.test(slot),ready=x=>Boolean(x&&(!state.characterOwners||state.characterOwners[x]===state.playerId)&&!state.captives?.[x]&&!(state.captureHistory?.[x]?.paroleUntil>state.turn));if(domestic&&!ready(ctx.who))return;const present=domestic&&state.characterOwners?(state.recruitedHeroIds||[]).filter(ready):undefined;const entry=findDialogue(slot,present?{...ctx,present}:ctx,state.storySeen);if(entry&&!dialogueQueue.some(item=>item.entry.id===entry.id))dialogueQueue.push({entry,who:ctx.who});}
let stageBg='study';
const SCENE_POOL=['study','town','field','tavern','stage'];
function sceneFor(slot='',id=''){if(/capt|prison|ransom|rescue/.test(slot))return 'cell';if(/battle|capital|war/.test(slot))return 'war';let h=0;for(const c of String(id))h=(h*31+c.charCodeAt(0))>>>0;return SCENE_POOL[h%SCENE_POOL.length];}
function vnStage(title,line){
  const hero=line.speaker?state.characters[line.speaker]:null,p=hero?portraitUrl(hero,line.expr||'smile'):null;
  return `<div class="vn bg-${esc(stageBg)}">${p?`<div class="vn-sprite"><img src="${esc(p)}" alt="${esc(hero.name)}" /></div>`:''}<div class="vn-box">${title?`<h4>${esc(title)}</h4>`:''}${hero?`<b style="color:${esc(hero.color)}">${esc(hero.name)}</b>`:''}<p class="${hero?'':'vn-narration'}">${esc(line.text)}</p><div class="vn-actions" id="vn-actions"></div></div></div>`;
}
/* Scenes: her own words at the moments that matter — answering the notice, giving in, being taken,
   her nation falling. Lines live in captive-lines.mjs (every character has each one); they load lazily
   so the first paint never waits for them. A scene is only a reading: it never changes the world. */
let CAPTIVE_LINES=null;
const linesReady=import('./captive-lines.mjs?v=1118-1603').then(m=>{CAPTIVE_LINES=m.CAPTIVE_LINES;}).catch(()=>{});
const sceneLines=(id,situation,bucket='once')=>(CAPTIVE_LINES?.[id]?.[situation]?.[bucket]||[]).filter(line=>line?.text).map(line=>({speaker:id,expr:line.expr,text:line.text}));
const sceneQueue=[];
function queueScene(id,situation,options={}){if(practice||lesson||!id||!state.characters[id])return;if(!sceneQueue.some(item=>item.id===id&&item.situation===situation))sceneQueue.push({id,situation,...options});}
function playScene(scene,onDone){
  const lines=sceneLines(scene.id,scene.situation);
  if(!lines.length){onDone?.();return;}
  let index=0;stageBg=scene.bg||'cell';
  openModal('','',scene.head?`<div class="fall">${scene.head}<div id="scene-stage"></div></div>`:'<div id="scene-stage"></div>',()=>{
    const draw=()=>{
      morph($('scene-stage'),vnStage('',lines[index]));
      const row=$('vn-actions'),last=index>=lines.length-1;
      row.innerHTML=`<button class="vn-act${last?'':' plain'}" id="vn-next">${last?'好':'继续'}</button>`;
      $('vn-next').onclick=()=>{if(!last){index++;draw();return;}closeModal();onDone?.();};
    };
    draw();
  });
}
/** Which of her lines fits what just happened in the cell: good, flat or bad. */
function captiveBucket(before,after){
  if(!after)return 'good';
  const gain=(after.progress??0)-(before.progress??0),grudge=(after.grudge??0)-(before.grudge??0);
  return gain>=10&&grudge<=0?'good':grudge>=10||gain<=0?'bad':'flat';
}
function captiveVoice(id,way,before,after){
  const pool=sceneLines(id,way==='care'?'talk':way,captiveBucket(before,after));
  return pool.length?pool[Math.floor(Math.random()*pool.length)]:null;
}
function playDialogue(entry,who){
  let index=0,settled=false,generation=0,activeRow=null,shownState=null,shownRevision=null;stageBg=entry.bg||sceneFor(entry.slot,entry.id);
  const token={},entryFingerprint=JSON.stringify(entry);$('modal-body').paidChoiceView=token;
  const ownsView=()=>$('modal').open&&$('modal-body').paidChoiceView===token&&$('vn-actions')===activeRow;
  const showLine=()=>{
    morph($('modal-body'),vnStage('',entry.lines[index]));
    const row=$('vn-actions'),viewState=state,viewRevision=state.revision,viewGeneration=++generation;activeRow=row;shownState=viewState;shownRevision=viewRevision;
    const isCurrent=()=>!settled&&ownsView()&&generation===viewGeneration&&state===viewState&&state.revision===viewRevision&&JSON.stringify(entry)===entryFingerprint;
    const complete=(effect,reply)=>{
      if(!isCurrent())return;
      const quote=getDialogueChoiceQuote(state,{id:entry.id,effect});
      if(!quote.enabled){toast(quote.reason,true);showLine();return;}
      settled=true;
      const r=runAction({type:'dialogueDone',id:entry.id,who,effect,expectedRevision:viewRevision},{silent:true});
      if(!r.ok){settled=false;if(ownsView()&&generation===viewGeneration){toast(r.error||'事件未完成，请重试。',true);showLine();}return;}
      // Rendering/story callbacks may have opened another modal. Never replace it.
      if(!ownsView()||generation!==viewGeneration||state!==r.state)return;
      if(reply){$('modal-body').innerHTML=vnStage('',reply);$('vn-actions').innerHTML='<button class="vn-act" id="vn-done">好</button>';const done=$('vn-done');done.onclick=()=>{if($('modal-body').paidChoiceView===token&&$('vn-done')===done)closeModal();};}else closeModal();
    };
    if(index<entry.lines.length-1){row.innerHTML='<button class="vn-act plain" id="vn-next">继续</button>';$('vn-next').onclick=()=>{if(!isCurrent())return;index++;showLine();};return;}
    if(entry.choices?.length){row.innerHTML=entry.choices.map((c,i)=>{const q=getDialogueChoiceQuote(state,{id:entry.id,effect:c.effect});return `<button class="vn-act" data-c="${i}" ${q.enabled?'':'aria-disabled="true"'}>${esc(c.label)}${effectText(q.effect)}${q.enabled?'':`<small>${esc(q.reason)}</small>`}</button>`;}).join('');row.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{if(!isCurrent())return;const c=entry.choices[+b.dataset.c];complete(c.effect,c.reply);});return;}
    row.innerHTML='<button class="vn-act" id="vn-done">好</button>';$('vn-done').onclick=()=>complete();
  };
  openModal('','','',showLine,()=>{if(!settled&&ownsView()){if(JSON.stringify(entry)!==entryFingerprint)closeModal();else if(state!==shownState||state.revision!==shownRevision)showLine();}});
}
function showLevelUps(list){
  openModal('成长','',`<div class="levels">${list.map((item,i)=>{const h=state.characters[item.id],names=item.gains.map(id=>STATS.find(s=>s.id===id)?.name).filter(Boolean);return `<article class="level-row" style="--hero:${esc(h.color||'#ffc83d')};--n:${i}"><span class="level-art"><img src="${esc(portraitUrl(h,'happy')||'')}" alt="" /></span><div class="level-tag"><em>Lv ${item.level}</em><b>${esc(h.name)}</b><p>${names.map(n=>`<span>${n} +1</span>`).join('')}</p>${item.perk?'<small>可以选新天赋了</small>':''}</div></article>`;}).join('')}</div><div class="form-actions center"><button class="pull" id="levels-ok">继 续</button></div>`,()=>{$('levels-ok').onclick=closeModal;});
}
function nextOverlay(){
  if(typeof mapPick!=='undefined'&&mapPick)return;
  if(state.battle||$('modal').open||!$('flyer').hidden||!$('title-screen').hidden||lessonRunning())return;
  // An incoming declaration must not wait behind ordinary character scenes.
  // A war that ends (the enemy fell to someone else, or dissolved) gets its own scene too, in the same order as declarations.
  const declared=!practice&&(state.notices||[]).find(n=>(n.kind==='war'&&n.line==='declare'||n.line==='over')&&n.id>(tutorial.seenWar||0));
  if(declared){if(declared.line==='over'&&typeof showWarOver==='function')showWarOver(declared);else if(declared.line==='declare')showDeclaration(declared);tutorial.seenWar=declared.id;saveAuto();return;}
  if((state.levelSeq||0)<seenLevelSeq)seenLevelSeq=state.levelSeq||0;
  const fresh=(state.levelLog||[]).filter(item=>item.seq>seenLevelSeq);
  if(fresh.length){seenLevelSeq=state.levelSeq;for(const item of fresh)if([5,10,15,20,30].includes(item.level))queueSlot('level.milestone',{who:item.id,param:item.level});showLevelUps(fresh);return;}
  const scene=typeof sceneQueue!=='undefined'?sceneQueue.shift():null;
  if(scene){if(!CAPTIVE_LINES){sceneQueue.unshift(scene);linesReady.then(()=>queueMicrotask(nextOverlay));return;}playScene(scene,()=>queueMicrotask(nextOverlay));return;}
  const next=dialogueQueue.shift();
  if(next){
    const e=next.entry,domestic=/^(?:turn\.random|join\.(?:first|reunion)|talk\.daily|gift\.(?:normal|loved)|bond\.tier|level\.milestone|perk\.chosen|post\.assigned)$/.test(e?.slot||'');
    if(domestic&&state.characterOwners){const ready=x=>!x||x==='*'||(state.characterOwners[x]===state.playerId&&!state.captives?.[x]&&!(state.captureHistory?.[x]?.paroleUntil>state.turn));if(!ready(e.who)||!ready(e.with)||(e.lines||[]).some(l=>!ready(l?.speaker))||(e.choices||[]).some(c=>!ready(c?.reply?.speaker))){queueMicrotask(nextOverlay);return;}}
    playDialogue(next.entry,next.who);return;
  }
  if(!practice){
    const fallen=(state.campaign?.occupations||[]).find(o=>o.turn===state.turn&&!state.factions[o.factionId]?.alive&&!askedOccupation.has(`${o.factionId}:${o.turn}`));
    if(fallen){askedOccupation.add(`${fallen.factionId}:${fallen.turn}`);showOccupationChoice(fallen);return;}
    const offer=nextPendingOffer();
    if(offer){showOffer(offer);return;}
  }
  maybeShowEvent();
}
/** A capital just fell and the nation has no land left: annex it, or keep it as a subject. Asked right away, never hidden in a tab. */
const askedOccupation=new Set();
function showOccupationChoice(o){
  const f=state.factions[o.factionId];if(!f)return;
  const free=o.members.filter(id=>state.characterOwners[id]===null&&!state.captives[id]&&!state.campaign?.prison?.[id]),speaker=free[0]||state.activeHeroId;
  const pick=choice=>{const r=runAction({type:'occupationChoice',factionId:f.id,choice});if(r.ok){closeModal();toast(choice==='vassal'?`${f.name}成了你的附庸：首都和她们都还在，每回合上缴八成产出。`:`${f.name}并入了你的国土。`);}};
  vnChoice(`${f.name} · 首都陷落`,speaker,'cry',`${f.name}的土地都在你手里了。要把这个国家并进来，还是留着当附庸？`,
    free.length?`吞并：领土全归你，没被俘的 ${free.length} 位角色回到角色池，你拿不到。附庸：她们留在原国、首都照旧，每回合上缴 80% 产出、随你出战，以后还能慢慢整合（这一回合内决定，不选就是吞并）。`:'她们已经没有能主事的人了，只能吞并。',
    [...(free.length?[{label:'收为附庸',run:()=>pick('vassal')}]:[]),{label:'吞并',plain:Boolean(free.length),run:()=>pick('annex')}],'war');
}
/** Compares before and after an action and lights up whichever story slots it touched. */
function storyHooks(before,action,result){
  if(state.battle&&before.battle?.id!==state.battle.id){
    const side=state.battle.playerSide,named=test=>state.battle.units.filter(unit=>unit.characterId&&test(unit.side===side));
    for(const me of named(mine=>mine))for(const foe of named(mine=>!mine)){
      if(state.characters[me.characterId]?.group!==state.characters[foe.characterId]?.group)continue;
      const entry=findDialogue('battle.rival',{who:me.characterId,with:foe.characterId},state.storySeen);
      if(entry){sceneInBattle=true;playDialogue(entry,me.characterId);return;}
    }
  }
  const lead=state.activeHeroId,chief=id=>state.factions[id]?.leaderId;
  if(action.type==='gacha'){const present=state.recruitedHeroIds.filter(x=>state.characterOwners?.[x]===state.playerId&&!state.captives?.[x]&&!(state.captureHistory?.[x]?.paroleUntil>state.turn));for(const pull of result.detail?.results||[result.detail]){if(pull?.result!=='girl')continue;const id=pull.characterId;if(typeof queueScene==='function')queueScene(id,'join',{bg:'tavern'});queueSlot('join.first',{who:id});for(const other of present)if(other!==id&&state.characters[other]?.group===state.characters[id]?.group)queueSlot('join.reunion',{who:id,with:other});}}
  if(action.type==='endTurn'&&!state.battle&&Math.random()<.35){const present=state.recruitedHeroIds.filter(x=>state.characterOwners?.[x]===state.playerId&&!state.captives?.[x]&&!(state.captureHistory?.[x]?.paroleUntil>state.turn));const entry=findEveryday(present,state.storySeen);if(entry)dialogueQueue.push({entry,who:entry.who});}
  if(action.type==='recruitCaptive'&&result.detail?.joined){if(typeof queueScene==='function')queueScene(action.characterId,'submit',{bg:'cell'});queueSlot('captive.recruit',{who:action.characterId});queueSlot('join.first',{who:action.characterId});}
  if(action.type==='releaseCaptive')queueSlot('captive.release',{who:action.characterId});
  if(action.type==='ransomCharacter')queueSlot('captive.ransom',{who:action.characterId});
  if(action.type==='finishBattle'){
    const r=result.detail?.result;if(r){
      const enemy=r.winnerId===state.playerId?r.loserId:r.winnerId;
      queueSlot(r.playerWon?'battle.win':'battle.lose',{who:lead,with:chief(enemy)});
      for(const id of r.capturedCharacterIds||[])queueSlot(r.playerWon?'captured.enemy':'captured.self',r.playerWon?{who:id,with:lead}:{who:id,with:chief(r.winnerId)});
      for(const id of r.rescuedCharacterIds||[])queueSlot('captive.rescued',{who:id});
      if(state.capturedCapitalIds.length>before.capturedCapitalIds.length)queueSlot('capital.taken',{who:lead,with:chief(enemy)});
    }
  }
  for(const id of Object.keys(state.factions)){
    if(!before.factions[id])queueSlot('nation.arrive',{who:state.factions[id].leaderId});
    else if(before.factions[id].alive&&!state.factions[id].alive)queueSlot('nation.fall',{who:state.factions[id].leaderId});
  }
  for(const [id,c] of Object.entries(before.captives))if(c.originalFactionId===state.playerId&&!state.captives[id]&&state.characterOwners[id]===c.captorId){queueSlot('captive.defected',{who:id,with:chief(c.captorId)});toast(`${state.characters[id].name}被${state.factions[c.captorId].name}说服，留在了那边。`,true);}
  if(before.factions[state.playerId].capitalKey!==state.factions[state.playerId].capitalKey)queueSlot('capital.lost',{who:lead});
  for(const id of state.recruitedHeroIds){const a=bondTier(before.growth?.[id]?.bond||0),b=bondTier(state.growth?.[id]?.bond||0);if(b>a)queueSlot('bond.tier',{who:id,param:b});}
}
function showRecruit(reveal=null,incomeBefore=null){
  const quotedState=state;
  const stats=getStats(state),f=state.factions[state.playerId],single=getRecruitQuote(state,1),ten=getRecruitQuote(state,10),afford=cost=>state.ap>=cost.ap&&f.gold>=cost.gold;
  const results=reveal?.results||(reveal?[reveal]:[]);
  const picks=results.map(r=>{const h=r.result==='girl'?state.characters[r.characterId]:null;return {rank:r.result,girl:Boolean(h),glow:h?h.color||'#ff8fb0':RANK_GLOW[r.result],name:h?h.name:SAZAI_RANKS[r.result].name,img:h?portraitUrl(h,'happy'):'assets/sazai.webp',line:h?`${h.name}：「${r.line}」`:r.line};});
  const history=recentPulls.slice(-14).map(r=>`<i style="--c:${r==='girl'?'#ff8fb0':RANK_GLOW[r]}" title="${r==='girl'?'少女':r}"></i>`).join('');
  const actualOdds=recruitOdds(stats,GACHA.rates);
  const odds=GACHA.rates.map(([k,v])=>`<b style="--glow:${RANK_GLOW[k]||'#ff8fb0'}">${k==='girl'?'少女':k}</b>${(actualOdds[k]*100).toFixed(2)}%`).join(' ');
  const count=rank=>picks.filter(p=>p.rank===rank).length,receiptText=recruitReceiptText(results),incomeText=reveal?recruitIncomeReceipt(incomeBefore,stats):'';
  const tally=reveal?`<p class="pull-tally after">抽中：${['girl','SSR','SR','R','N'].filter(count).map(k=>`<b style="--glow:${RANK_GLOW[k]||'#ff8fb0'}">${k==='girl'?'少女':k} × ${count(k)}</b>`).join('')}${receiptText?`<span>${esc(receiptText)}</span>`:''}</p>`:'';
  const solo=picks.length===1&&!picks[0].girl?picks[0]:null;
  const home=state.tiles[f.capitalKey],nearFull=(home?.troops||0)>=90||['R','SR','SSR'].some(rank=>(home?.elite?.[rank]||0)>=95);
  const poolLine=stats.recruitPool?`还有 ${stats.recruitPool} 位少女在各地流浪`:'现在没有流浪的少女：抽到少女的那一下会变成 SSR';
  openModal('招募',`遇到少女的概率 ${(actualOdds.girl*100).toFixed(2)}%`,`<div class="recruit ${reveal?'playing':''}" id="recruit" style="--glow:#5d6480"><i class="speed-lines"></i><div class="recruit-stage ${reveal?'':'idle'}">${reveal?`${deckHtml(picks,++pullSerial)}<div class="meet" hidden></div><button class="pull-skip">跳过</button>${solo?`<p class="sayline after">${esc(solo.line)}</p>`:''}`:'<div class="stagehand idle"><p class="board">告示已经贴好<small>今天会是谁来呢</small></p></div>'}</div><div class="pull-row"><p class="form-hint" id="recruit-pool-note">${esc(poolLine)}</p>${tally}${incomeText?`<p class="form-hint" id="recruit-income-receipt">${esc(incomeText)}</p>`:''}<p class="form-hint ${stats.income.supply<0?'alarm':''}" id="recruit-food-note" ${stats.income.supply<0?'':'hidden'}>${esc(recruitFoodNote(state,stats))}</p>${stats.income.supply<0?'<button class="small-button secondary" id="recruit-food-help">查看缺粮自救</button>':''}<button class="pull" id="pull" data-comic-commit aria-describedby="recruit-cost-note recruit-pool-note recruit-capacity-note" ${afford(single.cost)?'':'disabled'}>招 募<small>${format(single.cost.gold)} 金币 · ${single.cost.ap} 指令</small></button><button class="pull ten-btn" id="pull10" data-comic-commit aria-describedby="recruit-cost-note recruit-pool-note recruit-capacity-note" ${afford(ten.cost)?'':'disabled'}>十 连<small>${format(ten.cost.gold)} 金币 · ${ten.cost.ap} 指令</small></button><span class="odds">${odds}</span><span class="history">${history}</span><p class="form-hint ${nearFull?'alarm':''}" id="recruit-capacity-note" ${nearFull?'':'hidden'}>${esc(nearFull?`首都快住满了：${recruitCapacityText(state,typeof getSupply==='function'?getSupply(state,state.factions[state.playerId].capitalKey)?.limit:undefined)}`:recruitCapacityText(state,typeof getSupply==='function'?getSupply(state,state.factions[state.playerId].capitalKey)?.limit:undefined))}</p><details class="recruit-rules"><summary>抽卡规则</summary><p>${esc(recruitPoolNote(stats))}</p><p class="recruit-cost-note" id="recruit-cost-note">费用随领土规模和累计招募次数慢慢上涨，招募概率不受价格影响。</p>${typeof priceHtml==='function'?`<p>招募 ${priceHtml(single,{action:{type:'gacha',count:1}})}</p><p>十连 ${priceHtml(ten,{action:{type:'gacha',count:10}})}</p>`:''}</details></div></div>`,()=>{
    const singleButton=$('pull'),tenButton=$('pull10');let active=true;
    const pull=(count,event)=>{if(event?.detail>1)return;if(!active||!$('modal').open||$('pull')!==singleButton||$('pull10')!==tenButton)return;if(state!==quotedState){toast('局势已变化，请重新打开招募。',true);return;}active=false;const r=runAction(count===10?{type:'gacha',count:10}:{type:'gacha'},{silent:true});if(!r.ok){active=true;const receipt=$('recruit-income-receipt');if(receipt){receipt.textContent='';receipt.hidden=true;}toast(r.error,true);return;}const list=r.detail.results||[r.detail];recentPulls.push(...list.map(x=>x.result));showRecruit(r.detail,stats);if(!list.some(x=>x.result==='girl')&&Math.random()<.4)say(speaker(),'recruit');};
    $('pull').onclick=event=>pull(1,event);$('pull10').onclick=event=>pull(10,event);
    if($('recruit-food-help'))$('recruit-food-help').onclick=()=>{if(!active||state!==quotedState||!$('modal').open||$('pull')!==singleButton)return;active=false;showManagement();$('governance-recovery')?.scrollIntoView({block:'start'});};
    if(reveal)playPull($('recruit'),picks,{sound});
  });
}
/** Sandbox vignette: lines first, then a choice, then the reply. */
function maybeShowEvent(){
  if(state.battle||state.turnContinuation||$('modal').open||!state.pendingEvent||!$('flyer').hidden)return;
  let event=getPendingEvent(state);if(!event)return;
  let index=0,settled=false,generation=0,activeNote=null,shownState=null,shownRevision=null;stageBg=event.bg||sceneFor('',event.id);
  const token={},eventFingerprint=JSON.stringify(event);$('modal-body').paidChoiceView=token;
  const ownsView=()=>$('modal').open&&$('modal-body').paidChoiceView===token&&$('story-choice-note')===activeNote;
  const stage=line=>vnStage(event.title,line);
  const showLine=()=>{
    morph($('modal-body'),stage(event.lines[index]));
    const row=$('vn-actions'),reading=index<event.lines.length-1,viewState=state,viewRevision=state.revision,viewGeneration=++generation;
    const forfeiture=getStoryForfeitQuote(state,{expectedEventId:event.id});
    row.innerHTML=`<p class="story-choice-note" id="story-choice-note" tabindex="-1">${reading?'阅读后需选择一个结果才能返回地图':'请选择一个结果后返回地图'}；Esc 不会跳过事件。</p>`+(reading?'<button class="vn-act plain" id="vn-next" aria-describedby="story-choice-note">继续</button>':event.choices.map((c,i)=>{const q=getStoryChoiceQuote(state,{choice:i,expectedEventId:event.id});return `<button class="vn-act" data-choice="${i}" aria-describedby="story-choice-note" ${q.enabled?'':'aria-disabled="true"'}>${esc(c.label)}${effectText(c.effect)}${q.enabled?'':`<small>${esc(q.reason)}</small>`}</button>`;}).join('')+(forfeiture.enabled?'<button class="vn-act plain" id="story-forfeit" aria-describedby="story-choice-note">无力承担本次事件，放弃收益</button>':''));
    const note=$('story-choice-note');activeNote=note;shownState=viewState;shownRevision=viewRevision;
    const isCurrent=()=>!settled&&ownsView()&&generation===viewGeneration&&state===viewState&&state.revision===viewRevision&&state.pendingEvent===event.id&&getPendingEvent(state)===event&&JSON.stringify(event)===eventFingerprint;
    const complete=(action,reply)=>{
      if(!isCurrent())return;settled=true;
      const r=runAction({type:'storyChoice',...action,expectedEventId:event.id,expectedRevision:viewRevision},{silent:true});
      if(!r.ok){settled=false;if(ownsView()&&generation===viewGeneration){toast(r.error||'事件未完成，请重试。',true);showLine();}return;}
      if(!ownsView()||generation!==viewGeneration||state!==r.state)return;
      $('close-modal').hidden=false;$('modal-body').innerHTML=stage(reply);$('vn-actions').innerHTML='<button class="vn-act" id="vn-done">好</button>';const done=$('vn-done');done.onclick=()=>{if($('modal-body').paidChoiceView===token&&$('vn-done')===done)closeModal();};done.focus({preventScroll:true});
    };
    if(reading){$('vn-next').onclick=()=>{if(!isCurrent())return;index++;showLine();};$('vn-next').focus({preventScroll:true});}
    else{
      row.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{if(!isCurrent())return;const choice=event.choices[+b.dataset.choice];complete({choice:+b.dataset.choice},choice.reply);});
      if($('story-forfeit'))$('story-forfeit').onclick=()=>complete({forfeit:true},{speaker:null,text:'无力承担本次事件，放弃收益。'});
      // Advancing the final line must not focus a reward that a held Enter can accept.
      note.focus({preventScroll:true});
    }
  };
  // Public dispatch can finish/replace this event; never treat it as this view's commit.
  openModal('','','',showLine,()=>{if(!settled&&ownsView()){const current=getPendingEvent(state);if(state.pendingEvent!==event.id||state.turnContinuation||!current||JSON.stringify(current)!==eventFingerprint)closeModal();else if(state!==shownState||state.revision!==shownRevision||current!==event){event=current;showLine();}}},{dismissible:false});
}
function effectText(effect={}){const parts=[effect.gold?`金币 ${effect.gold>0?'+':''}${effect.gold}`:'',effect.supply?`补给 ${effect.supply>0?'+':''}${effect.supply}`:'',effect.troops?`罪袋 +${effect.troops}`:'',effect.sazai?`${effect.sazai} 罪袋`:''].filter(Boolean);return parts.length?`<small>${parts.join(' · ')}</small>`:'';}
let captiveReply=null;
const captiveActionKey=action=>`${action.type}:${action.way||''}`;
function rememberCaptiveContext(target,{focus=true}={}){
  const view=$('captives-view'),body=$('modal-body'),rows=[...view.querySelectorAll('[data-captive-id]')];
  const row=target.closest('[data-captive-id]'),detail=target.closest('[data-captive-detail]');
  return {view,id:row?.dataset.captiveId,action:target.dataset.jailAction,detail:detail?.dataset.captiveDetail,heading:'captiveHeading' in target.dataset,back:target.id==='captives-back',focus,scroll:body.scrollTop,top:target.getBoundingClientRect().top-body.getBoundingClientRect().top,
    rows:rows.map(row=>({id:row.dataset.captiveId,open:[...row.querySelectorAll('[data-captive-detail]')].filter(detail=>detail.open).map(detail=>detail.dataset.captiveDetail)}))};
}
function currentCaptiveContext(view){
  const active=document.activeElement,box=$('modal-body').getBoundingClientRect();
  const focused=view.contains(active)&&(active.closest('[data-jail]')||active.closest('[data-captive-detail]')?.querySelector('summary')||active.closest('[data-captive-heading]')||(active.id==='captives-back'?active:null));
  const target=focused||[...view.querySelectorAll('[data-jail],[data-captive-heading],summary')].find(item=>{const rect=item.getBoundingClientRect();return rect.bottom>box.top&&rect.top<box.bottom;})||view.querySelector('[data-captive-id]')||$('captives-back');
  return rememberCaptiveContext(target,{focus:Boolean(focused)});
}
function restoreCaptiveContext(saved){
  const body=$('modal-body'),rows=[...$('captives-view').querySelectorAll('[data-captive-id]')];
  for(const row of rows){const previous=saved.rows.find(item=>item.id===row.dataset.captiveId);for(const detail of row.querySelectorAll('[data-captive-detail]'))detail.open=Boolean(previous?.open.includes(detail.dataset.captiveDetail));}
  const row=rows.find(item=>item.dataset.captiveId===saved.id);
  const anchor=saved.back?$('captives-back'):row&&(saved.action?[...row.querySelectorAll('[data-jail-action]')].find(item=>item.dataset.jailAction===saved.action):saved.detail?[...row.querySelectorAll('[data-captive-detail]')].find(item=>item.dataset.captiveDetail===saved.detail)?.querySelector('summary'):saved.heading?row.querySelector('[data-captive-heading]'):row);
  body.scrollTop=saved.scroll;
  if(anchor){
    body.scrollTop+=anchor.getBoundingClientRect().top-body.getBoundingClientRect().top-saved.top;
    if(saved.focus)anchor.focus({preventScroll:true});return;
  }
  // A returned/recruited captive really leaves the list. Keep the local neighborhood,
  // and focus a heading instead of another action that a held key could activate.
  const index=saved.rows.findIndex(item=>item.id===saved.id),neighbors=[...saved.rows.slice(index+1),...saved.rows.slice(0,index).reverse()];
  const next=row||neighbors.map(item=>rows.find(candidate=>candidate.dataset.captiveId===item.id)).find(Boolean);
  if(next){body.scrollTop+=next.getBoundingClientRect().top-body.getBoundingClientRect().top-16;if(saved.focus)next.querySelector('[data-captive-heading]').focus({preventScroll:true});}
  else{body.scrollTop=0;if(saved.focus)$('captives-back').focus({preventScroll:true});}
}
function captiveFeedback(action,before,after){
  const risk=`每回合逃跑风险 ${before.escapeRisk}% → ${after.escapeRisk}%。`;
  if(action.type==='secureCaptive')return `加强看守已安排：${after.security.remaining} 回合专门护卫。${risk}`;
  if(action.type==='extendCaptive')return `续押办好了：审查从第 ${before.reviewTurn} 回合推迟到第 ${after.reviewTurn} 回合，怨气 ${before.grudge} → ${after.grudge}。${risk}`;
  const method={talk:'好言相劝',gift:'送礼示好',press:'严正交涉',care:'照护与和解'}[action.way];
  return `${method}已完成：${before.progressLabel} ${before.progress} → ${after.progress}，怨气 ${before.grudge} → ${after.grudge}${action.way==='care'?`，警戒 ${before.watch} → ${after.watch}`:''}。${risk}${after.accession?.prepared?'交涉准备已完成；加入仍需另行确认报价。':''}`;
}
function captiveAccessionHtml(status){
  const quote=status.accession;if(!quote)return '';
  const reasons=[...new Set([quote.reason,...(quote.conditions||[]).map(item=>item.reason),quote.preparationReason,quote.budgetReason].filter(Boolean))];
  return `<section class="captive-accession" aria-label="当前加入条件"><b>${esc(quote.enabled?'可以提出归附条件':quote.label)}</b><p>加入时另付 ${esc(costLine(quote.cost))}。交涉准备不会自动加入。</p>${reasons.length?`<ul>${reasons.map(reason=>`<li>${esc(reason)}</li>`).join('')}</ul>`:'<p>选择加入报价并执行；成功后才支付费用并加入。</p>'}</section>`;
}
/** How long a detention has left, said plainly: nobody should "just become paroled". */
function reviewText(status){
  if(!status?.held)return '';
  const left=status.reviewLeft??Math.max(0,(status.reviewTurn||0)-state.turn);
  return `${left<=3?'<b class="due">':''}还能关 ${left} 回合${left<=3?'</b>':''} · 第 ${status.reviewTurn} 回合定期审查后假释归国${status.extended?`（已续押 ${status.extended} 回合）`:''}`;
}
/** 牢房总令: one tap for every captive. Guard them all, renew the ones about to be reviewed, or leave a standing order. */
function prisonOrdersHtml(){
  if(typeof getPrisonPlan!=='function')return '';
  const plan=getPrisonPlan(state);if(!plan.held.length)return '';
  const price=cost=>[cost.gold?`${cost.gold} 金`:'',cost.supply?`${cost.supply} 粮`:''].filter(Boolean).join(' ')||'免费';
  const secure=plan.secure,extend=plan.extend;
  const secureNote=!secure.total?'都有专门护卫':secure.ready.length<secure.total?`钱只够 ${secure.ready.length}/${secure.total} 人 · ${price(secure.cost)}`:`${secure.total} 人 · ${price(secure.cost)}`;
  const extendNote=!extend.total?`${CAPTIVITY_RULES.extendWindow} 回合内没人到期`:extend.ready.length<extend.total?`钱只够 ${extend.ready.length}/${extend.total} 人 · ${price(extend.cost)}`:`${extend.total} 人 · ${price(extend.cost)}`;
  return `${typeof lessonNote==='function'?lessonNote('adv_jail'):''}<div class="jail-orders" id="jail-orders" role="group" aria-label="牢房总令"><h4>牢房总令<small>${plan.held.length} 人在押${plan.soonest!==null?` · 最近 ${plan.soonest} 回合后有人到期`:''}</small></h4>
    <button class="jo" id="jail-secure-all" ${plan.reason||!secure.ready.length?'aria-disabled="true"':''} title="${esc(plan.reason||secure.reason||`每人 ${CAPTIVITY_RULES.securityGold} 金 ${CAPTIVITY_RULES.securitySupply} 粮，管 ${plan.securityTurns} 回合，逃跑风险降 12%`)}">${icon('shield')}<span><b>全员加强看守</b><small>${esc(secureNote)}</small></span></button>
    <button class="jo" id="jail-extend-all" ${plan.reason||!extend.ready.length?'aria-disabled="true"':''} title="${esc(plan.reason||extend.reason||`把快到期的审查各推迟 ${CAPTIVITY_RULES.extendTurns} 回合，她们的怨气各 +${CAPTIVITY_RULES.extendGrudge}`)}">${icon('scroll')}<span><b>到期全员续押</b><small>${esc(extendNote)}</small></span></button>
    <button class="jo toggle ${plan.autoSecure?'on':''}" id="jail-auto" aria-pressed="${plan.autoSecure}" title="开着时，每回合开始给护卫到期的俘虏自动续上；国库会留 ${CAPTIVITY_RULES.autoSecureGoldFloor} 金、${CAPTIVITY_RULES.autoSecureSupplyFloor} 粮不动">${icon('swap')}<span><b>长期看守</b><small>${plan.autoSecure?'开着 · 护卫到期自动续':'关着 · 每次自己安排'}</small></span></button></div>`;
}
function bindPrisonOrders(redo){
  const act=(action,done)=>{const result=runAction(action);if(result.ok){toast(done(result.detail));redo();}return result;};
  const guard=(id,run)=>{const button=$(id);if(!button)return;button.onclick=()=>{if(button.getAttribute('aria-disabled')==='true'){toast(button.title||'现在不行。',true);return;}run();};};
  guard('jail-secure-all',()=>act({type:'secureCaptives'},d=>`${d.characterIds.length} 名俘虏安排了专门护卫，花了 ${d.cost.gold} 金 ${d.cost.supply} 粮${d.skipped?`；还有 ${d.skipped} 人钱不够`:''}。`));
  guard('jail-extend-all',()=>act({type:'extendCaptives'},d=>`${d.characterIds.length} 名俘虏续押 ${CAPTIVITY_RULES.extendTurns} 回合，花了 ${d.cost.gold} 金${d.skipped?`；还有 ${d.skipped} 人钱不够`:''}。`));
  guard('jail-auto',()=>{const on=!getPrisonPlan(state).autoSecure;act({type:'setPrisonPolicy',autoSecure:on},()=>on?'长期看守开了：护卫到期会自动续上。':'长期看守关了。');});
}
function showCaptives(saved=null){
  // Only the action that is still in this roster can restore its reading position.
  saved=saved?.view===$('captives-view')&&$('modal').open?saved:null;
  if(captiveReply?.state!==state)captiveReply=null;
  const shownState=state;let view=null,acting=false;
  const refresh=()=>{
    if(acting||state===shownState||modalRefresh!==refresh||!$('modal').open||$('captives-view')!==view)return;
    showCaptives(currentCaptiveContext(view));
  };
  const records=Object.values(state.captives||{}).filter(c=>c.captorId===state.playerId||c.originalFactionId===state.playerId);
  const eventNames={captured:'被俘',escaped:'逃脱',released:'获释',paroled:'假释休整',ransomed:'赎回',rescued:'获救',joined:'归顺'};
  const meter=(label,value,cls)=>`<div class="jail-bar ${cls}"><span>${label}</span><i><u style="width:${Math.min(100,value)}%"></u></i><b>${Math.round(value)}</b></div>`;
  const body=records.length?`<div class="jail">${records.map(c=>{
    const hero=state.characters[c.characterId],held=c.captorId===state.playerId,origin=state.factions[c.originalFactionId],status=getCaptiveStatus(state,c.characterId);
    const extBtns=held&&typeof captiveExtensions==='function'?captiveExtensions({state,characterId:c.characterId,hero,view:hero,captive:c,status,held}).map(ext=>`<div class="captive-action-card"><button class="captive-action alt" data-jail-ext="${esc(c.characterId)}" data-jail-ext-id="${esc(ext.id)}" ${ext.enabled?'':'aria-disabled="true"'}><b>${esc(ext.label)}</b><small>无需招募 · 直接处决</small>${ext.enabled?'':`<strong>${esc(ext.reason||'现在不行')}</strong>`}</button>${ext.detail?`<details data-captive-detail="ext:${esc(ext.id)}"><summary>规则与后果</summary><p>${esc(ext.detail)}</p></details>`:''}</div>`).join(''):'';
    const buttons=getCaptiveActions(state,c.characterId).map(a=>`<div class="captive-action-card"><button class="captive-action ${a.type==='persuade'?'':'alt'}" id="captive-action-${encodeURIComponent(c.characterId)}-${encodeURIComponent(captiveActionKey(a.action))}" data-jail="${esc(c.characterId)}" data-jail-action="${esc(captiveActionKey(a.action))}" ${a.enabled?'':'aria-disabled="true"'}><b>${esc(a.label)}</b><small>${esc(costLine(a.cost))}${a.effects?.gold>0?` · 我方收取 ${a.effects.gold} 金币`:''}</small>${a.effects?.progress!==undefined?`<em>${esc(status.progressLabel)} ${status.progress} → ${a.effects.progress} · 怨气 ${status.grudge} → ${a.effects.grudge}</em>`:''}${a.effects?.escapeRisk!==undefined?`<em>执行后逃跑风险 ${a.effects.escapeRisk}%</em>`:''}${a.enabled?'':`<strong>${esc(shortWhy(a))}</strong>`}</button>${a.description?`<details data-captive-detail="action:${esc(captiveActionKey(a.action))}"><summary>规则与后果</summary><p>${esc(a.description)}</p></details>`:''}</div>`).join('')+extBtns;
    const reply=captiveReply?.id===c.characterId?`<p class="captive-rule captive-result" role="status">${esc(captiveReply.text)}</p>${captiveReply.line?`<p class="jail-say">${esc(captiveReply.line)}</p>`:''}`:'';
    return `<article id="captive-${encodeURIComponent(c.characterId)}" data-captive-id="${esc(c.characterId)}" class="jail-row ${held?'':'ours'}"><span class="jail-face"><img src="${esc(portraitUrl(hero,held&&(c.grudge||0)>40?'angry':held?'pout':'cry')||'')}" alt="${esc(hero?.name)}" /></span><div class="captive-content"><div class="captive-head"><h3 data-captive-heading tabindex="-1">${esc(hero?.name||c.characterId)}</h3><span class="captive-badge ${held?'':'ours'}">${held?'在押俘虏':'我方被俘'}</span>${typeof showCaptiveSheet==='function'?`<button type="button" class="small-button secondary captive-open-cell" data-open-cell="${esc(c.characterId)}">牢房交涉 ›</button>`:''}</div><small class="captive-origin">${held?`原属 ${esc(origin?.alive?origin.name:'已亡的国家')}`:`关在 ${esc(state.factions[c.captorId]?.name||'')}`} · 已关押 ${status.heldTurns} 回合</small><p class="captive-history">累计被俘 ${status.captures} 次 · 再捕 ${status.recaptures} 次 · 逃脱 ${status.escapes} 次${status.historyIncomplete?'（旧档仅保留部分履历）':''}</p>${status.recaptureAfterEscape?'<p class="captive-warning">逃脱后再次被同一国俘获，警戒提高；照护和时间会让警戒逐步消退。</p>':''}<p class="captive-history">警戒 ${status.watch} 级 · ${esc(status.security.label)}${status.security.remaining?`（剩 ${status.security.remaining} 回合）`:''} · ${typeof reviewText==='function'?reviewText(status):`第 ${status.reviewTurn} 回合定期审查`}</p>${held?meter(esc(status.progressLabel),status.progress,'good')+meter('怨气',status.grudge,'bad'):''}${held?captiveAccessionHtml(status):''}<details class="captive-risk" data-captive-detail="risk"><summary>每回合逃跑风险 ${status.escapeRisk}% · 查看原因</summary><p>${status.escapeBreakdown.map(item=>`${esc(item.label)} ${item.value>0?'+':''}${item.value}%`).join(' · ')}。最终限制在 2%～40%。</p></details>${status.ransom?.freeReturn?`<p class="captive-warning">原赎金协议有效至第 ${status.ransom.protectedUntil} 回合，本次免费遣返，不重复索取赎金。</p>`:''}${reply}<div class="captive-actions">${buttons}</div>${status.recentEvents.length?`<details class="captive-events" data-captive-detail="events"><summary>近期履历</summary><ul>${status.recentEvents.slice(-5).reverse().map(event=>`<li>第 ${event.turn} 回合 · ${esc(eventNames[event.type]||event.type)} · ${esc(state.factions[event.captorId]?.name||'')}${event.gold?` · ${event.gold} 金币`:''}</li>`).join('')}</ul></details>`:''}</div></article>`;
  }).join('')}</div>`:'<div class="captives-empty"><img src="assets/sazai.webp" alt="" /><p>现在没有俘虏。</p></div>';
  openReading('俘虏','履历 · 看守 · 交涉准备',`<div id="captives-view" class="comic-sheet"><div class="comic-banner"><img src="assets/sazai.webp" alt="" /><div><b>俘虏与看守名册</b><p>每人每回合可交涉一次；点按钮查看费用与数值变化，也可进入「牢房交涉」面对面处理。</p></div></div>${typeof prisonOrdersHtml==='function'?prisonOrdersHtml():''}${body}${typeof campaignUI!=='undefined'&&campaignUI?campaignUI.prisonRosterHtml(state):''}<div class="form-actions"><button class="small-button secondary" id="captives-back">返回同伴</button></div></div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-cell','captives-screen');
    view=$('captives-view');
    $('captives-back').onclick=()=>{captiveReply=null;showHeroes();};
    if(typeof bindPrisonOrders==='function')bindPrisonOrders(()=>{if($('modal').open&&$('captives-view')===view)showCaptives(currentCaptiveContext(view));});
    document.querySelectorAll?.('[data-open-cell]')?.forEach?.(b=>b.onclick=()=>{if(typeof showCaptiveSheet==='function'){showCaptiveSheet(b.dataset.openCell);}});
    document.querySelectorAll?.('[data-jail-ext]')?.forEach?.(b=>b.onclick=()=>{
      if(!$('modal').open||!$('captives-view')?.contains(b))return;
      const context=rememberCaptiveContext(b),id=b.dataset.jailExt,extId=b.dataset.jailExtId,c=state.captives?.[id];
      if(shownState!==state||!c){toast('记录已更新，请重新选择。',true);showCaptives(context);return;}
      const hero=state.characters[id],status=getCaptiveStatus(state,id),held=c.captorId===state.playerId;
      const ext=typeof captiveExtensions==='function'?captiveExtensions({state,characterId:id,hero,view:hero,captive:c,status,held}).find(x=>x.id===extId):null;
      if(!ext?.enabled){toast(ext?.reason||'记录已更新，请重新选择。',true);return;}
      const r=ext.run({state,characterId:id,hero,view:hero,captive:c,status,held,dispatch:action=>{acting=true;try{return runAction(action,{silent:true});}finally{acting=false;}},toast,refresh:()=>showCaptives(context)});
      if(r?.ok!==false&&$('modal').open&&$('captives-view')===context.view)showCaptives(context);
    });
    document.querySelectorAll('[data-jail]').forEach(b=>{
      const handle=()=>{
      if(b.onclick!==handle||!$('modal').open||!$('captives-view')?.contains(b))return;
      const context=rememberCaptiveContext(b),id=b.dataset.jail;
      if(shownState!==state){toast('记录已更新，请重新选择。',true);showCaptives(context);return;}
      const picked=getCaptiveActions(state,id).find(a=>captiveActionKey(a.action)===b.dataset.jailAction),name=state.characters[id].name;
      if(!picked?.enabled){toast(picked?shortWhy(picked):'记录已更新，请重新选择。',true);return;}
      const before=getCaptiveStatus(state,id);let r;
      // The local handler owns its result and context; skip render's intermediate
      // refresh until feedback is ready. Other public actions refresh immediately.
      acting=true;try{r=runAction(picked.action);}finally{acting=false;}if(!r.ok)return;
      const left=state.captives[id],after=getCaptiveStatus(state,id),way=picked.action.way;
      const voice=way&&typeof captiveVoice==='function'?captiveVoice(id,way,before,after):null;
      captiveReply=left?{id,state,text:captiveFeedback(picked.action,before,after),line:voice?.text||(way==='gift'?speech(id,'thanks',(left.grudge||0)>40?'angry':'calm'):way==='press'?speech(id,'refuse',(left.grudge||0)>40?'angry':'calm'):null),expr:voice?.expr}:null;
      if(r.detail?.joined)toast(`${name}已接受归附条件，支付 ${costLine(r.detail.cost||picked.cost)}。`);
      else if(picked.type==='paroleCaptive')toast(`${name}已假释归国，将按约休整后恢复部署。`);
      else if(picked.type==='releaseCaptive')toast(state.characterOwners[id]?`${name}已获释归国。`:`${name}已获释，成为自由旅人，可在后续招募中再遇见。`);
      else if(picked.type==='sellCaptive')toast(r.detail.gold?`已收到 ${r.detail.gold} 金币赎金。`:'已按原约免费遣返。');
      else if(picked.type==='secureCaptive')toast('专门护卫已安排，风险与剩余回合已更新。');
      else if(picked.type==='extendCaptive')toast(`${name}续押到第 ${r.detail.reviewTurn} 回合。`);
      if($('modal').open&&$('captives-view')===context.view)showCaptives(context);
      };b.onclick=handle;
    });
    if(saved)restoreCaptiveContext(saved);
  },refresh);
}
let comicJailId=null,comicJailAction=null;
/** Focused comic cell reads the same authoritative actions/history as the retained roster. */
function showCaptiveSheet(focus=null){
  const records=Object.values(state.captives||{}).filter(c=>c.captorId===state.playerId||c.originalFactionId===state.playerId);
  const previous=$('comic-cell'),paper=$('cell-paper'),same=previous?.dataset.captiveId===(focus||comicJailId),scroll=same?paper?.scrollTop||0:0;
  const opened=same?[...paper.querySelectorAll('[data-cell-detail]')].filter(d=>d.open).map(d=>d.dataset.cellDetail):[];
  const c=records.find(c=>c.characterId===(focus||comicJailId))||records[0];
  if(!c){comicJailId=null;comicJailAction=null;openReading('俘虏','',`<div class="comic-sheet"><div class="captives-empty"><img src="assets/sazai.webp" alt="" /><p>现在没有俘虏。</p></div></div>`,()=>{$('modal')?.classList?.add?.('scene','bg-cell');backTo(showHeroes);});return;}
  if(comicJailId!==c.characterId)comicJailAction=null;comicJailId=c.characterId;
  if(captiveReply?.state!==state)captiveReply=null;
  const id=c.characterId,hero=state.characters[id],held=c.captorId===state.playerId,status=getCaptiveStatus(state,id),actions=getCaptiveActions(state,id);
  const chosen=actions.find(a=>captiveActionKey(a.action)===comicJailAction)||actions.find(a=>a.enabled)||actions[0];comicJailAction=chosen?captiveActionKey(chosen.action):null;
  const replied=captiveReply?.id===id&&captiveReply.state===state?captiveReply:null;
  const art=portraitUrl(hero,replied?.expr||(held&&(c.grudge||0)>40?'angry':held?'pout':'cry'));
  const captiveExt=typeof captiveExtensions==='function'?captiveExtensions({state,characterId:id,hero,view:hero,captive:c,status,held}):[];if(captiveExt.length&&!captiveExt.some(item=>item.id===extPick))extPick=null;
  const hexes=actions.map(a=>`<button class="hx cs-act ${a===chosen?'on':''} ${a.enabled?'':'off'}" data-cell-pick="${esc(captiveActionKey(a.action))}" aria-pressed="${a===chosen}"><b>${hexName(esc(a.label))}</b></button>`).join('');
  const cap=chosen?`<div class="cs-cap" id="cell-proposal" tabindex="-1" role="status"><div><h3>${esc(chosen.label)}</h3><p>${esc(costLine(chosen.cost))}${chosen.effects?.gold>0?` · 我方收取 ${chosen.effects.gold} 金币`:''}</p>${chosen.effects?.progress!==undefined?`<small>${esc(status.progressLabel)} ${status.progress} → ${chosen.effects.progress} · 怨气 ${status.grudge} → ${chosen.effects.grudge}</small>`:''}${chosen.effects?.escapeRisk!==undefined?`<small>执行后逃跑风险 ${chosen.effects.escapeRisk}%</small>`:''}${chosen.enabled?'':`<small class="warn">${esc(shortWhy(chosen))}</small>`}</div><button class="cs-burst small" id="cell-go" ${chosen.enabled?'':'disabled'}><span>就这样</span></button></div>${chosen.description?`<p class="captive-rule">${esc(chosen.description)}</p>`:''}`:'';
  const names={captured:'被俘',escaped:'逃脱',released:'获释',paroled:'假释休整',ransomed:'赎回',rescued:'获救',joined:'归顺'};
  const faces=records.map(item=>{const h=state.characters[item.characterId];return `<button class="cs-peer ${item.characterId===id?'on':''}" data-cell-face="${esc(item.characterId)}" aria-label="${esc(h?.name||item.characterId)}"><i class="cs-face"><img src="${esc(portraitUrl(h,'smile'))}" alt="" /></i></button>`;}).join('');
  const html=`<div class="cs cell" id="comic-cell" data-captive-id="${esc(id)}" style="--hero:${esc(hero?.color||'#7a8d9e')}"><div class="cs-stage"><div class="cs-frame"><i></i></div>${girlHtml(art,hero?.name||id,'poke-img')}</div>
    <header class="cs-id">${typeof vTitleHtml==='function'?vTitleHtml(hero?.name||id,'id="cell-name" tabindex="-1"'):`<h2 id="cell-name" tabindex="-1" style="--n:${[...(hero?.name||id)].length}">${esc(hero?.name||id)}</h2>`}</header><span class="cs-ribbon">${held?'你的牢房':`关在 ${esc(state.factions[c.captorId]?.name||'别国')} 牢里`}</span>
    <div class="cs-gauges">${held?`${hexGauge('lv',status.escapeRisk+'%','逃跑',status.escapeRisk,'#ffc83d')}${hexGauge('bond',status.progress,status.progressLabel,status.progress,'#8fe3b4')}${hexGauge('spirit',status.grudge,'怨气',status.grudge,'#ff8f7f')}`:''}${hexRole(held?'俘虏':'被俘')}</div>
    <div class="cs-leafwrap"><section class="cs-leaf" id="cell-paper"><p class="captive-history">已关押 ${status.heldTurns} 回合 · 警戒 ${status.watch} 级 · ${esc(status.security.label)}${status.security.remaining?`（剩 ${status.security.remaining} 回合）`:''} · ${typeof reviewText==='function'?reviewText(status):`第 ${status.reviewTurn} 回合定期审查`}</p>
    ${status.recaptureAfterEscape?'<p class="captive-warning">逃脱后被同一国再捕，警戒提高；照护和时间会让警戒消退。</p>':''}${status.ransom?.freeReturn?`<p class="captive-warning">原赎金协议有效至第 ${status.ransom.protectedUntil} 回合，本次免费遣返，不重复索取赎金。</p>`:''}
    ${captiveReply?.id===id?`${replied?.line?`<p class="jail-say"><b>${esc(hero?.name||'')}</b>「${esc(replied.line)}」</p>`:''}<p class="captive-rule captive-result" role="status">${esc(captiveReply.text)}</p>`:''}
    <div class="cs-acts">${hexes}</div>${cap}${held?captiveAccessionHtml(status):''}${captiveExt.length?extensionRow(captiveExt,'处决'):''}${held&&typeof prisonOrdersHtml==='function'?prisonOrdersHtml():''}
    <details data-cell-detail="risk"><summary>每回合逃跑风险 ${status.escapeRisk}% · 查看原因</summary><p>${status.escapeBreakdown.map(item=>`${esc(item.label)} ${item.value>0?'+':''}${item.value}%`).join(' · ')}。最终限制在 2%～40%。</p></details>
    <details data-cell-detail="history"><summary>累计被俘 ${status.captures} 次 · 再捕 ${status.recaptures} 次 · 逃脱 ${status.escapes} 次</summary>${status.historyIncomplete?'<p>旧档仅保留部分履历。</p>':''}<ul>${status.recentEvents.slice(-5).reverse().map(e=>`<li>第 ${e.turn} 回合 · ${esc(names[e.type]||e.type)} · ${esc(state.factions[e.captorId]?.name||'')}${e.gold?` · ${e.gold} 金币`:''}</li>`).join('')}</ul></details></section></div>
    <nav class="cs-nav jailnav" aria-label="牢房里的人"><div class="cs-faces">${faces}</div><button class="cs-link" id="cell-stats">查看能力<span>›</span></button><button class="cs-link" id="cell-history">完整履历名册<span>›</span></button></nav></div>`;
  const shown=state;let acting=false,view=null;
  const refresh=()=>{if(!acting&&state!==shown&&modalRefresh===refresh&&$('modal').open&&$('comic-cell')===view)showCaptiveSheet(id);};
  openModal('俘虏','',html,()=>{
    $('modal').className='screen sheet-mode';view=$('comic-cell');fitEdge(art);backTo(()=>{captiveReply=null;showHeroes();});
    for(const b of document.querySelectorAll('[data-cell-face]'))b.onclick=()=>{captiveReply=null;showCaptiveSheet(b.dataset.cellFace);};
    for(const b of document.querySelectorAll('[data-cell-pick]'))b.onclick=()=>{comicJailAction=b.dataset.cellPick;showCaptiveSheet(id);$('cell-proposal')?.scrollIntoView?.({block:'nearest'});$('cell-proposal')?.focus?.({preventScroll:true});};
    if($('cell-stats'))$('cell-stats').onclick=()=>showCharacter(id,()=>showCaptiveSheet(id));
    $('cell-history').onclick=()=>{showCaptives();backTo(()=>showCaptiveSheet(id));};
    if(typeof bindPrisonOrders==='function')bindPrisonOrders(()=>{if($('modal').open&&$('comic-cell')===view)showCaptiveSheet(id);});
    if(captiveExt.length)bindExtensionRow(captiveExt,{redo:()=>showCaptiveSheet(id),context:()=>({state,characterId:id,hero,view:hero,captive:c,status,held,dispatch:action=>{acting=true;try{return runAction(action,{silent:true});}finally{acting=false;}},toast,refresh:()=>showCaptiveSheet(id)})});
    for(const d of $('cell-paper').querySelectorAll('[data-cell-detail]'))d.open=opened.includes(d.dataset.cellDetail);$('cell-paper').scrollTop=scroll;
    bindComicAction($('cell-go'),()=>{
      const picked=getCaptiveActions(state,id).find(a=>captiveActionKey(a.action)===comicJailAction);if(!picked?.enabled){toast(picked?shortWhy(picked):'记录已更新，请重新选择。',true);return;}
      const before=getCaptiveStatus(state,id);let r;acting=true;try{r=runAction(picked.action);}finally{acting=false;}if(!r.ok)return r;
      const left=state.captives[id],after=getCaptiveStatus(state,id),voice=picked.action.way&&typeof captiveVoice==='function'?captiveVoice(id,picked.action.way,before,after):null;captiveReply=left?{id,state,text:captiveFeedback(picked.action,before,after),line:voice?.text,expr:voice?.expr}:null;
      if(r.detail?.joined)toast(`${hero.name}已接受归附条件，支付 ${costLine(r.detail.cost||picked.cost)}。`);else if(picked.type==='paroleCaptive')toast(`${hero.name}已假释归国，将按约休整后恢复部署。`);else if(picked.type==='releaseCaptive')toast(state.characterOwners[id]?`${hero.name}已获释归国。`:`${hero.name}已获释，成为自由旅人。`);else if(picked.type==='sellCaptive')toast(r.detail.gold?`已收到 ${r.detail.gold} 金币赎金。`:'已按原约免费遣返。');
      if($('modal').open&&$('comic-cell')===view){showCaptiveSheet(id);if(!left)$('cell-name')?.focus({preventScroll:true});}return r;
    });
  },refresh);
}
function capitalNameOf(f){return f.isPlayer?'领主城':`${f.name} 主城`;}
const leaderOf=f=>f.isPlayer?currentHero():state.characters[f.leaderId]&&state.characterOwners[f.leaderId]===f.id&&!state.captives[f.leaderId]&&!state.campaign?.prison?.[f.leaderId]?state.characters[f.leaderId]:Object.values(state.characters).find(h=>state.characterOwners?.[h.id]===f.id&&!state.captives?.[h.id]&&!state.campaign?.prison?.[h.id]);
/* 诸国. Tap a nation to talk. 多选 turns the same cards into checkboxes with one action bar at the bottom:
   pick the kind (寒暄 / 通商 / 互不侵犯 / 结盟), tick nations, one burst does them all at 1 command each. */
function showFactions(){
  const factions=visibleFactions(state),share=factions.map(f=>[f,Object.values(state.tiles).filter(t=>t.ownerId===f.id&&!t.shipId&&(f.isPlayer||t.discovered)).length]);
  const picking=Boolean(factionPick);
  if(picking){factionPick.ids=new Set([...factionPick.ids].filter(id=>getRelation(state,id)?.offers?.find(o=>o.kind===factionPick.kind)?.enabled));}
  const offerOf=f=>picking&&!f.isPlayer?getRelation(state,f.id)?.offers?.find(o=>o.kind===factionPick.kind):null;
  const top=`<div class="dip-top"><p class="form-hint">${picking?`选一种提议，再勾国家：每国 1 指令，现在剩 ${state.ap} 令。`:'点国家开始会谈。大家默认和平，开战要先宣战。'}</p><button class="small-button ${picking?'':'secondary'}" id="batch-toggle">${picking?'不多选了':'多选 · 批量外交'}</button></div>`;
  const kinds=picking?`<div class="dip-kinds" role="radiogroup" aria-label="批量提议">${BATCH_KINDS.map(([kind,label])=>`<button role="radio" aria-checked="${factionPick.kind===kind}" data-batch-kind="${kind}">${label}</button>`).join('')}</div>`:'';
  const html=`${top}${kinds}<div class="spectrum" title="诸国疆域占比">${share.map(([f,n])=>`<i style="flex:${n||.2};background:${esc(f.color)}"></i>`).join('')}</div>${GUIDE[tutorial.step]?.id==='talk'&&!tutorial.dismissed?'<p class="guide-note">点下面任意一个别的国家试试。</p>':''}${typeof lessonNote==='function'?lessonNote('adv_peace'):''}<div class="banners ${picking?'picking':''}">${share.map(([f,land])=>{
    const tiles=Object.values(state.tiles).filter(t=>t.ownerId===f.id&&!t.shipId&&(f.isPlayer||t.discovered)),view=f.isPlayer?null:getRelation(state,f.id),leader=leaderOf(f);
    const stamp=f.isPlayer?'':view.statusName,calm=view&&view.status!=='war';
    const members=Object.keys(state.characters).filter(id=>state.characterOwners[id]===f.id&&!state.captives[id]).length;
    const offer=offerOf(f),picked=picking&&factionPick.ids.has(f.id);
    const pickNote=picking&&!f.isPlayer?`<em class="pick-note ${offer?.enabled?(offer.willing||offer.kind==='chat'?'yes':'no'):'off'}">${offer?.enabled?(offer.kind==='chat'?'好感 +2':offer.willing?'会同意':'会拒绝'):esc(offer?.reason||'不行')}</em>`:'';
    return `<article class="banner ${f.isPlayer?'me':''} ${picked?'picked':''} ${picking&&!f.isPlayer&&!offer?.enabled?'locked':''}" data-nation="${esc(f.id)}" style="--c:${esc(f.color)}" ${picking&&!f.isPlayer?`role="checkbox" aria-checked="${picked}"`:''}>${picking&&!f.isPlayer?`<span class="pick-box" aria-hidden="true">${picked?'✓':''}</span>`:''}${stamp?`<span class="stamp ${calm?'calm':''}">${stamp}</span>`:''}${leader?`<span class="chief"><img src="${esc(portraitUrl(leader,view?.status==='war'?'angry':'smile')||'')}" alt="${esc(leader.name)}" /></span>`:''}<div class="foot"><h3>${esc(f.name)}</h3>${pickNote}<div class="facts">${esc(leader?.name||(f.regularCommand?'常备军指挥':'无人领军'))} · ${members} 名角色 · 军训 Lv ${f.armyTrainingLevel||1}<small>${f.isPlayer?'':'已见 '}${land} 地 · ${tiles.reduce((n,t)=>n+t.troops,0)} 人${view&&f.alive?` · 好感 ${view.favor>0?'+':''}${view.favor}${view.attitude?` · ${view.attitude.name}`:''}${view.trade?' · 通商':''}${view.borders?' · 接壤':''}${view.envoy?' · 有使节':''}${view.status==='vassal'?` · 独立倾向 ${f.liberty||0}%`:''}`:''}</small></div></div></article>`;
  }).join('')}</div>${picking?batchBarHtml():''}`;
  openModal('诸国','',html,()=>{
    $('batch-toggle').onclick=()=>{factionPick=factionPick?null:{kind:'chat',ids:new Set()};showFactions();};
    document.querySelectorAll('[data-batch-kind]').forEach(b=>b.onclick=()=>{factionPick.kind=b.dataset.batchKind;factionPick.ids=new Set();showFactions();});
    document.querySelectorAll('[data-nation]').forEach(b=>b.onclick=()=>{
      const f=state.factions[b.dataset.nation];
      if(factionPick&&!f.isPlayer){
        const offer=getRelation(state,f.id)?.offers?.find(o=>o.kind===factionPick.kind);
        if(!offer?.enabled){toast(offer?.reason||'现在不能这样提议。',true);return;}
        if(factionPick.ids.has(f.id))factionPick.ids.delete(f.id);else if(factionPick.ids.size>=state.ap){toast(`指令只剩 ${state.ap} 令，最多选 ${state.ap} 国。`,true);return;}else factionPick.ids.add(f.id);
        showFactions();return;
      }
      if(f.isPlayer&&GUIDE[tutorial.step]?.id==='talk'&&!tutorial.dismissed){toast('这是你自己的国家，点别的国家。');return;}if(!f.alive){showFactions();return;}if(f.isPlayer)showHeroes(f.id);else showTalks(f.id);
    });
    const all=$('batch-all');if(all)all.onclick=()=>{const ready=visibleFactions(state).filter(f=>!f.isPlayer&&getRelation(state,f.id)?.offers?.find(o=>o.kind===factionPick.kind)?.enabled).map(f=>f.id).slice(0,state.ap);factionPick.ids=new Set(ready);showFactions();};
    const go=$('batch-go');if(go)go.onclick=e=>{
      if(e.detail>1)return;const ids=[...factionPick.ids],kind=factionPick.kind,label=BATCH_KINDS.find(k=>k[0]===kind)[1];
      if(!ids.length){toast('先勾几个国家。',true);return;}
      const before=Object.fromEntries(ids.map(id=>[id,getRelation(state,id)?.favor||0]));
      const r=runAction({type:'batchDiplomacy',kind,factionIds:ids});if(!r.ok)return;
      const agreed=(r.detail?.results||[]).filter(x=>x?.accepted).length;
      toast(kind==='chat'?`和 ${ids.length} 国寒暄了：${ids.map(id=>`${state.factions[id].name} ${before[id]}→${getRelation(state,id)?.favor}`).join('，')}。`:`${label}：${agreed}/${ids.length} 国同意。`);
      factionPick.ids=new Set();showFactions();
    };
  });
}
var factionPick=typeof factionPick!=='undefined'?factionPick:null;
var BATCH_KINDS=[['chat','寒暄'],['trade','通商'],['pact','互不侵犯'],['ally','结盟']];
function batchBarHtml(){
  const n=factionPick.ids.size,label=BATCH_KINDS.find(k=>k[0]===factionPick.kind)[1];
  return `<div class="dip-bar"><div><b>${label} × ${n}</b><small>${n?`${[...factionPick.ids].map(id=>state.factions[id]?.name).join('、')} · ${n} 令（剩 ${state.ap}）`:'点上面的国家勾选'}</small></div><button class="small-button secondary" id="batch-all">全选能选的</button><button class="cs-burst small" id="batch-go" ${n?'':'aria-disabled="true"'}><span>${label}！</span></button></div>`;
}
const FALLBACK_LINES={hello:'贵国的来意，我们听听看。',ask_peace:'这场仗就到这里吧。',ask_deal:'我们有件事想商量。',gift:'这是一点心意，请收下。',thanks:'心意收到了。',accept:'好，就这么定了。',refuse:'这件事恕难从命。',declare:'既然如此，战场上见。',answer:'那就来吧。',bye:'今天就到这里。'};
const speech=(id,situation,mood='calm')=>diploLines?.[id]?.[situation]?.[mood]||FALLBACK_LINES[situation];
const MOOD_EXPR={normal:'happy',calm:'smile',angry:'angry'};
const ALLIANCE_OBLIGATION='互相防卫：一方被直接宣战，另一方若未与进攻国交战，会自动宣战援助（援军不再连锁召集）。参战会中断与进攻国的通商、双方好感 -30。即使有同盟、互不侵犯或休战也会撕约，并使其他现存国家对参战方好感 -10（均最低 -100）。';
const OFFER_EFFECT={chat:'好感 +2',peace:'休战 6 回合',trade:'双方每回合 +2 金',pact:'12 回合互不进攻',ally:'双方互保；盟友被宣战时你也会自动参战',demand:'索取对方现有金币，好感下降'};
function offerEffectText(offer){if(offer.kind==='demand'&&offer.effects)return `本次索取 ${format(offer.effects.gold)} 金 · 好感 ${offer.effects.favor} · ${offer.effects.interval} 回合间隔`;return OFFER_EFFECT[offer.kind]||'';}
let talkTerm=null,talkCb=null;
const CB_NAME={rescue:'营救同伴',reclaim:'收复失地',insult:'回敬勒索',grudge:'清算旧怨',conquest:'无端开战',ally:'同盟参战',feud:'血海深仇'};
/** A treaty being drafted with one nation this turn: which terms are on, how many tiles, and (if picked on the map) which. */
const talkDrafts=new Map(),talkVassalPicks=new Map(),TRUCE_TURNS_UI=6;
function talkDraftOf(id){const d=talkDrafts.get(id);if(d&&d.turn===state.turn)return d;const fresh={turn:state.turn,land:0,tiles:null,pay:0};talkDrafts.set(id,fresh);return fresh;}
/** The draft as the engine reads it: hand-picked tiles, else the first ones joined to the receiver. */
function treatySelection(id,draft){
  const base=getTreatyQuote(state,id,{}),options=base.land?.options||[];
  const tiles=draft.tiles?draft.tiles.filter(k=>options.includes(k)).slice(0,draft.land):options.slice(0,draft.land);
  return {...Object.fromEntries(['gold','installments','vassal','captives','trade','forts','tech','alliances'].map(k=>[k,Boolean(draft[k])])),pay:draft.pay||0,tiles};
}
/** 割地 on the map: tap the tiles to add or drop them; the points and the share of the realm show as you go. */
function pickCession(id){
  const draft=talkDraftOf(id),base=getTreatyQuote(state,id,{}),options=base.land?.options||[],demand=base.demand;
  beginMapPick({kind:'cession',icon:'flag',title:demand?'要她割哪几块地':'割给她哪几块地',subtitle:state.factions[id]?.name||'',multi:true,initialSet:treatySelection(id,draft).tiles,
    eligible:t=>options.includes(t.key),why:()=>demand?'只能要连着你领土的地，首都不行。':'只能割连着她领土的地，首都不行。',
    preview:keys=>getTreatyQuote(state,id,{...treatySelection(id,draft),tiles:keys}),
    render:(tile,q)=>`<h4>已选 ${mapPick?.chosenSet?.size||0} 块 · ${q?.land?.landPoints||0} 分</h4><p>占${demand?'她':'你'}的国土 ${Math.round((q?.land?.landShare||0)*100)}% · 条款合计 ${q?.points||0} 分，${demand?`你有 ${q?.need||0} 分`:`要凑够 ${q?.need||0} 分`}</p><p>白框能选，红框是已选的。</p>`,
    ready:picker=>picker.chosenSet.size>0,confirmLabel:'就这些',
    onPick:keys=>{Object.assign(draft,{tiles:keys,land:keys.length});if(keys.length)draft.vassal=false;showTalks(id);},onCancel:()=>showTalks(id)});
}
/** The second layer of a talk: how she sees you, why, what the war is worth, who is posted there. All of it folds away. */
function talkDepthHtml(id,view){
  if(!view?.attitude)return {top:'',war:'',cb:'',more:''};
  const f=state.factions[id],att=view.attitude,sign=n=>`${n>0?'+':''}${n}`;
  const top=`<div class="cs-att att-${esc(att.id)}"><b>${esc(att.name)}</b><p>${esc(att.hint)}</p></div>`;
  let war='';
  if(view.war&&view.peace){
    const score=view.war.score,meter=`<div class="war-score"><span>她占优</span><div class="war-meter"><i style="left:${(score+100)/2}%"></i><u style="left:${(DIPLOMACY_RULES.terms.gold+100)/2}%"></u><u style="left:${(DIPLOMACY_RULES.terms.land+100)/2}%"></u><u style="left:${(DIPLOMACY_RULES.terms.vassal+100)/2}%"></u></div><span>你占优</span></div>
      <small>战争分数 <b>${sign(score)}</b> · 第 ${view.war.since} 回合开战 · ${esc(CB_NAME[view.war.cb]||'开战')}。占地 +${DIPLOMACY_RULES.score.tile}、破首都 +${DIPLOMACY_RULES.score.capital}、胜一场 +${DIPLOMACY_RULES.score.battle}、俘一人 +${DIPLOMACY_RULES.score.captive}；输了反过来扣。</small>`;
    if(typeof getTreatyQuote==='function'&&typeof talkDraftOf==='function'){
      // One treaty sheet, both ways. Ahead: pick what she gives, up to your war score. Behind: pick what you give, enough to cover her lead.
      const draft=talkDraftOf(id),sel=treatySelection(id,draft),q=getTreatyQuote(state,id,sel),landMax=q.land?.options?.length||0,n=sel.tiles.length;
      const chip=i=>i.id==='pay'?`<div class="cs-term pay ${i.on?'on can':''}"><b>赔款</b><span class="pay-steps">${i.options.map(o=>`<button data-treaty-pay="${o.share}" aria-pressed="${draft.pay===o.share}">${o.share===1?'全部':o.share===.5?'一半':'四分之一'}<small>${o.gold}金·${o.points}分</small></button>`).join('')}</span></div>`
        :`<button class="cs-term ${i.on?'on can':''} ${i.enabled?'':'off'}" data-treaty="${esc(i.id)}" aria-pressed="${i.on}"><b>${esc(i.name)}</b><small>${i.enabled?`${i.points} 分`:'不行'}</small></button>`;
      const idle=q.items.filter(i=>!i.enabled&&i.id!=='pay').map(i=>i.name);
      const landChip=!landMax?`<div class="cs-term land off"><b>${q.demand?'割地':'割给她'}</b><small>${q.demand?'她没有连着你的地':'你没有连着她的地'}</small></div>`:`<div class="cs-term land ${n?'on can':''}"><b>${q.demand?'割地':'割给她'}</b><span class="deal-step"><button data-treaty-land="-1" ${n<=0?'disabled':''} aria-label="少一块">−</button><em>${n}</em><button data-treaty-land="1" ${n>=landMax||(q.demand&&draft.vassal)?'disabled':''} aria-label="多一块">+</button></span><small>${q.land.landPoints} 分 · 占${q.demand?'她':'你'} ${Math.round(q.land.landShare*100)}%</small></div>`;
      const landNames=keys=>{const c={};for(const k of keys){const nm=typeof tileName==='function'?tileName(state.tiles[k]):k;c[nm]=(c[nm]||0)+1;}return Object.entries(c).map(([nm,x])=>x>1?`${nm}×${x}`:nm).join('、');};
      const picked=[...q.items.filter(i=>i.on&&i.detail).map(i=>i.detail),...(n?[`${q.demand?'她割让':'你割给她'} ${n} 块地（${landNames(sel.tiles)}）`]:[])];
      const label=!q.points?'停战！':q.demand?'议和！':'求和！';
      war=`<div class="cs-war" id="talk-war">${meter}<p class="cs-hint">${q.demand?'你占优：条款可以组合，点数加起来不超过战争分数，她只能答应。':score<0?'她占优：给她的东西凑够分数，她就停手。':'不分胜负：可以白白停战，也可以给点东西。'}</p><div class="cs-terms treaty" role="group" aria-label="议和条款">${landChip}${q.items.filter(i=>i.enabled||i.id==='pay').map(chip).join('')}</div>${idle.length?`<small class="cs-hint treaty-idle">现在谈不了：${esc(idle.join(' · '))}</small>`:''}
        <div class="deal-sum"><span>${q.demand?`条款 <b>${q.points}</b> / 你有 <b>${q.need}</b> 分`:`给她 <b>${q.points}</b> / 要凑够 <b>${q.need}</b> 分`}</span>${n?`<button class="cs-link" id="deal-map">${draft.tiles?`在地图上改这 ${n} 块 ›`:`在地图上挑这 ${n} 块 ›`}</button>`:''}</div>
        <div class="cs-cap" id="peace-proposal" role="status" tabindex="-1"><div><h3>${q.demand?'议和条约':'求和'}</h3><p>${esc(picked.length?picked.join('；')+`；休战 ${TRUCE_TURNS_UI} 回合。`:`什么都不要，各自收兵，休战 ${TRUCE_TURNS_UI} 回合。`)}</p>${q.enabled?'<small>1 指令。议和不能撤销。</small>':`<small class="warn">${esc(q.reason)}</small>`}</div><button class="cs-burst small" id="treaty-go" ${q.enabled?'':'disabled'}><span>${label}</span></button></div></div>`;
    }else{
      const terms=view.peace.terms.filter(term=>term.id!=='white'),picked=terms.find(term=>term.id===talkTerm)||null;
      war=`<div class="cs-war" id="talk-war">${meter}
      <div class="cs-terms" role="group" aria-label="议和条款">${terms.map(term=>`<button class="cs-term ${term.enabled?'can':''} ${picked?.id===term.id?'on':''}" data-term="${esc(term.id)}" aria-pressed="${picked?.id===term.id}"><b>${esc(term.name)}</b><small>${term.need>0?`${term.need} 分起`:term.need<0?`${term.need} 分以下`:'随时'}</small></button>`).join('')}</div>
      ${picked?`<div class="cs-cap" id="peace-proposal" role="status" tabindex="-1"><div><h3>${esc(picked.name)}</h3><p>${esc(picked.desc)}</p>${picked.enabled?'<small>分数够了，她只能答应。议和不能撤销。</small>':`<small class="warn">${esc(picked.reason)}</small>`}</div><button class="cs-burst small" id="peace-go" ${picked.enabled?'':'disabled'}><span>议和！</span></button></div>`:'<p class="cs-hint">白白停战点下面的「停战」六角；战况不利时可以赔款求和。</p>'}</div>`;
    }
  }
  let cb='';
  if(view.reasons?.length&&view.canDeclare){
    const valid=view.reasons.filter(reason=>reason.valid),chosen=valid.find(reason=>reason.id===talkCb)||valid[0];
    cb=`<div class="cs-cb" role="radiogroup" aria-label="宣战理由">${valid.map(reason=>`<button class="cs-reason ${reason.id===chosen.id?'on':''} ${reason.unjust?'unjust':''}" role="radio" aria-checked="${reason.id===chosen.id}" data-cb="${esc(reason.id)}" title="${esc(reason.desc)}">${esc(reason.name)}</button>`).join('')}</div><small class="cs-warn" id="cb-note">${esc(chosen.desc)}</small>`;
  }
  const notes=view.notes?.length?`<details class="cs-fold" data-talk-fold="notes"><summary>好感 ${sign(view.favor)} 是怎么来的</summary><ul class="cs-ledger">${view.notes.map(note=>`<li><span>第 ${note.turn} 回合 · ${esc(note.why)}</span><b class="${note.delta<0?'down':''}">${sign(note.delta)}</b></li>`).join('')}</ul></details>`:'';
  let envoy='';
  if(typeof getEnvoyQuote==='function'&&view.status!=='war'&&view.met){
    const now=view.envoy,hero=now?state.characters[now.characterId]:null;
    const pool=state.recruitedHeroIds.filter(girl=>girl!==now?.characterId&&getEnvoyQuote(state,id,girl).enabled).slice(0,12);
    envoy=`<details class="cs-fold" data-talk-fold="envoy"><summary>使节：${hero?`${esc(hero.name)}，每回合好感 +${now.speed}，到 ${now.cap} 为止`:'还没派人'}</summary><p class="cs-hint">派一位在首都的同伴常驻她那里。魅力越高，好感涨得越快、上限越高；出使期间她不上战场。</p><div class="cs-envoys">${hero?`<button class="cs-envoy on" id="envoy-recall" aria-label="召回 ${esc(hero.name)}"><i class="cs-face"><img src="${esc(portraitUrl(hero,'smile')||'')}" alt="" /></i><b>${esc(hero.name)}</b><small>点一下召回</small></button>`:''}${pool.map(girl=>{const h=state.characters[girl],q=getEnvoyQuote(state,id,girl);return `<button class="cs-envoy" data-envoy="${esc(girl)}"><i class="cs-face"><img src="${esc(portraitUrl(h,'smile')||'')}" alt="" /></i><b>${esc(h.name)}</b><small>+${q.effect.speed}/回合 · 上限 ${q.effect.cap}</small></button>`;}).join('')||(hero?'':'<p class="cs-hint">现在没有能派的人：要在首都、不是领军或副将、没有任职。</p>')}</div></details>`;
  }
  let vassal='';
  if(view.vassal){
    const annex=view.vassal.annex;
    const job=state.campaign?.integrations?.[id],lead=state.characters[f.leaderId];
    const progress=job?`<div class="deal-sum"><span>整合进度 <b>${job.progress}/${job.total}</b> 回合 · 打仗或她闹独立会暂停</span><i class="city-lib" style="--p:${Math.round(job.progress/Math.max(1,job.total)*100)}%"><u></u></i></div>`:'';
    const selection=getVassalCharacterQuote(state,id,talkVassalPicks.get(id));
    const chosen=selection.candidates.includes(selection.characterId)?selection.characterId:selection.candidates[0];
    talkVassalPicks.set(id,chosen);
    const requisition=getVassalCharacterQuote(state,id,chosen),girl=state.characters[chosen];
    const pull=lead&&f.alive?`<details class="cs-fold" data-talk-fold="tribute"><summary>${esc(F.vassal_pick)}${girl?' · '+esc(girl.name):''}</summary><div class="cs-envoys">${selection.candidates.map(who=>{const h=state.characters[who];return `<button class="cs-envoy ${who===chosen?'on':''}" data-vassal-person="${esc(who)}" aria-pressed="${who===chosen}"><i class="cs-face"><img src="${esc(portraitUrl(h,'smile')||'')}" alt="" /></i><b>${esc(h.name)}</b></button>`;}).join('')}</div><div class="cs-cap"><div><p>${esc(feedbackText('vassal_select',{name:girl?.name||'',faction:f.name}))}</p>${requisition.reason?`<small class="warn">${esc(requisition.reason)}</small>`:''}</div><button class="cs-burst small" id="vassal-requisition" ${requisition.enabled?'':'disabled'}><span>${esc(F.vassal_do)}</span></button></div></details>`:'';
    const annexReview=typeof CIVIC_COPY!=='undefined'?esc(CIVIC_COPY.annexReview.replace(/\{(\w+)\}/g,(_,key)=>String(({tiles:annex.tiles,girls:annex.girls,cost:'{fee}',turns:annex.turns})[key]??''))).replace('{fee}',typeof priceHtml==='function'?priceHtml(annex):esc(costLine(annex.cost))):'';
    vassal=`<div class="cs-vassal"><h4>附庸<small>第 ${view.vassal.since} 回合臣服 · 每回合进贡 ${view.vassal.tribute} 金 · 独立倾向 ${f.liberty||0}% · 随你出战</small></h4>${progress}${pull}<div class="cs-cap"><div><h3>整合进领地</h3><p>${annexReview}</p><small class="${annex.enabled?'':'warn'}">${esc(annex.enabled?'条件都够了。整合不能撤销。':annex.reason)}</small></div><button class="cs-burst small" id="annex-go" ${annex.enabled?'':'disabled'}><span>整合！</span></button></div><button class="cs-link" id="release-vassal">解除附庸关系<span>›</span></button></div>`;
  }
  return {top,war,cb,more:`${vassal}${envoy}${notes}`};
}
/** Source comic stage; every execution still re-reads the public relation quote. */
function showTalks(id,exchange=null){
  const f=state.factions[id],view=getRelation(state,id);
  if(!f?.alive){showFactions();return;}if(!view){showHeroes(id);return;}
  const firstTalk=GUIDE[tutorial.step]?.id==='talk'&&!tutorial.dismissed;guideDone('talk');
  const them=leaderOf(f),me=currentHero(),mood=exchange?.mood||view.mood,theirLine=exchange?.theirs||speech(them?.id,'hello',view.mood);
  if(them)warmList(['smile','happy','angry'].map(expr=>portraitUrl(them,expr)));
  const picked=view.offers.find(o=>o.kind===talkPick)||view.offers.find(o=>o.enabled)||view.offers[0],S=58+HEX_GAP,war=view.status==='war';
  const petals=view.offers.map((o,i)=>{const [dx,dy]=SLOTS[i]||[0,0];return `<button class="hx cs-offer ${o.kind===picked?.kind?'on':''} ${!o.enabled?'off':o.willing?'yes':'no'}" data-offer="${o.kind}" aria-label="${esc(o.label)}：${esc(o.enabled?(o.willing?'会同意':'会拒绝'):o.reason||'查看当前条件')}。${esc(offerEffectText(o))}" aria-controls="talk-proposal" ${o.kind==='ally'?'aria-describedby="alliance-obligation" ':''}style="left:calc(50% + ${(dx*S).toFixed(2)}px);top:calc(50% + ${(dy*S).toFixed(2)}px)" aria-pressed="${o.kind===picked?.kind}"><b>${hexName(esc(o.label))}</b><small>${!o.enabled?'查看原因':o.kind==='chat'?'好感 +2':o.willing?'会同意':'会拒绝'}</small></button>`;}).join('');
  const factors=o=>o.kind==='chat'?'她愿意聊聊':`${o.willing?'她会同意':'她会拒绝'}：合计 ${o.score}，要 ${o.need}（${o.lines.map(([label,value])=>`${label} ${value>0?'+':''}${value}`).join('，')}）`;
  const cap=picked?`<div class="cs-cap" id="talk-proposal" role="status" aria-live="polite" tabindex="-1"><div><h3>${esc(picked.label)}</h3><p>${esc(offerEffectText(picked))}</p><small>${esc(picked.enabled?factors(picked):picked.reason||'现在不行')}</small></div><button class="cs-burst small" id="offer-go" ${picked.enabled?'':'disabled'} ${picked.kind==='ally'?'aria-describedby="alliance-obligation"':''}><span>提议！</span></button></div>`:'';
  const gifts=view.gifts.map(g=>`<button class="cs-slip" data-gift="${g.gold}" aria-label="立即赠送 ${g.gold} 金币，好感增加 ${g.favor}，外交赠礼不可撤销" ${g.enabled?'':'disabled'}>${g.gold} 金<small>好感 +${g.favor}</small></button>`).join('');
  const art=them?portraitUrl(them,MOOD_EXPR[mood])||portraitUrl(them,'smile'):null;
  const depth=typeof talkDepthHtml==='function'?talkDepthHtml(id,view):{top:'',war:'',cb:'',more:''};
  const foldsOpen=[...(typeof document!=='undefined'&&document.querySelectorAll?document.querySelectorAll('[data-talk-fold]'):[])].filter(d=>d.open).map(d=>d.dataset.talkFold),paperScroll=$('talk-paper')?.scrollTop||0;
  const html=`<div class="cs talk" style="--hero:${esc(f.color)}">
    <div class="cs-stage">${girlHtml(art,them?.name||(f.regularCommand?'常备军指挥':f.name),'poke-img')}</div>
    <div class="cs-say always"><div class="bubble"><b>${esc(them?.name||(f.regularCommand?'常备军指挥':f.name))}</b><p>${esc(theirLine)}</p></div>${exchange?.mine&&me?`<p class="cs-mine"><b>${esc(me.name)}</b>${esc(exchange.mine)}</p>`:''}</div>
    <div class="cs-leafwrap"><section class="cs-leaf" id="talk-paper">
      <div class="cs-favor"><span class="cs-stamp ${war?'':'calm'}">${esc(view.statusName)}</span><div><div class="favor"><i style="left:${(view.favor+100)/2}%"></i></div><small>好感 ${view.favor>0?'+':''}${view.favor} · 军训 Lv ${f.armyTrainingLevel||1} · 实力 ${view.power} 对 ${view.myPower}${view.borders?' · 接壤':' · 未接壤'}${view.trade?' · 通商':''}${view.until?` · 到第 ${view.until} 回合`:''}</small></div></div>
      ${depth.top}
      ${firstTalk?'<p class="guide-note">点六角查看提议，再按「提议！」执行。看完可点右上角 × 关闭。</p>':''}${typeof lessonNote==='function'?lessonNote('adv_peace'):''}${view.talked?'<p class="form-hint">这回合已经谈过了，下回合再来。</p>':''}
      ${depth.war}
      <div class="cs-bond"><div class="cs-flower"><button class="hx cs-talk" id="talk-members">${icon('heroes')}<b>成员</b></button><div class="offers">${petals}</div></div><div class="cs-side"><h4>送礼</h4><div class="cs-slips">${gifts}</div><small class="cs-warn">点金额立即送出，外交赠礼不可撤销。</small>${war?'':`<button class="cs-burst red" id="declare" ${view.canDeclare?'':'disabled'}><span>${view.breaksTreaty?'撕约宣战':'宣战！'}</span></button><small class="cs-warn" id="declare-reason">${esc(view.grace||(!view.canDeclare?(view.status==='vassal'?'她是你的附庸':'当前不能宣战'):view.breaksTreaty?'撕约会让各国好感 -10':''))}</small>${depth.cb}`}</div></div>${cap}
      ${exchange?.result?`<p class="talk-result" id="talk-result" role="status">${esc(exchange.result)}</p>`:''}
      ${view.status==='ally'||view.offers.some(o=>o.kind==='ally')?`<p class="form-hint" id="alliance-obligation">${esc(ALLIANCE_OBLIGATION)}</p>`:''}
      ${depth.more}
    </section></div></div>`;
  const shown=state;let acting=false;
  const refresh=()=>{if(!acting&&state!==shown&&modalRefresh===refresh&&$('modal').open)showTalks(id);};
  openModal(f.name,'会谈',html,()=>{
    $('modal').className=`screen scene talk-scene bg-${war?'war':'hall'}`;if(art)fitEdge(art);backTo(showFactions);
    $('talk-members').onclick=()=>showHeroes(id,()=>showTalks(id,exchange));
    for(const b of document.querySelectorAll('[data-offer]'))b.onclick=()=>{talkPick=b.dataset.offer;showTalks(id,exchange);$('talk-proposal')?.scrollIntoView?.({block:'nearest'});$('talk-proposal')?.focus?.({preventScroll:true});};
    const execute=action=>{acting=true;try{return runAction(action);}finally{acting=false;}};
    bindComicAction($('offer-go'),()=>{
      const current=getRelation(state,id)?.offers.find(o=>o.kind===picked?.kind);if(!current?.enabled){toast(current?.reason||'提议已经变化，请重新选择。',true);showTalks(id);return;}
      const kind=current.kind,r=execute({type:'propose',factionId:id,kind});if(!r.ok)return r;
      const after=getRelation(state,id),ask={peace:'ask_peace',chat:'hello'}[kind]||'ask_deal';
      showTalks(id,{mine:me?speech(me.id,ask,'normal'):'',theirs:speech(them?.id,kind==='chat'?'bye':r.detail.accepted?'accept':'refuse',after.mood),mood:kind==='chat'||r.detail.accepted?'normal':after.mood,result:kind==='chat'?'寒暄已完成。':r.detail.accepted?`${current.label}已获同意。`:`${current.label}未获同意。提出时合计 ${current.score}，需要 ${current.need}：${current.lines.map(([label,value])=>`${label} ${value>0?'+':''}${value}`).join('，')}。`});$('talk-result')?.scrollIntoView?.({block:'nearest'});return r;
    });
    for(const b of document.querySelectorAll('[data-gift]'))bindComicAction(b,()=>{
      const gold=Number(b.dataset.gift),current=getRelation(state,id)?.gifts.find(g=>g.gold===gold);if(!current?.enabled){toast('当前不能送这份礼物。',true);return;}
      const r=execute({type:'sendGift',factionId:id,gold});if(!r.ok)return r;const after=getRelation(state,id);
      showTalks(id,{mine:me?speech(me.id,'gift','normal'):'',theirs:speech(them?.id,'thanks',after.mood),mood:after.mood});return r;
    });
    bindComicAction($('declare'),e=>{
      const b=e.currentTarget,current=getRelation(state,id);if(!current?.canDeclare){toast(current?.grace||'当前不能宣战。',true);return;}
      const valid=(current.reasons||[]).filter(reason=>reason.valid),cb=valid.find(reason=>reason.id===talkCb)||valid[0]||null;
      if(!b.dataset.sure){b.dataset.sure='1';b.querySelector('span').textContent='确定？';$('declare-reason').textContent=current.breaksTreaty?'确定撕约宣战？其他各国好感 -10。':cb&&!cb.unjust?`确定以「${cb.name}」为由宣战？`:cb?.unjust?`确定无端开战？见过的国家好感各 ${DIPLOMACY_RULES.unjustWar}。`:'确定向这个国家宣战？';return;}
      const r=execute({type:'declareWar',factionId:id,...(cb?{cb:cb.id}:{})});if(!r.ok)return r;talkCb=null;talkTerm=null;showTalks(id,{mine:me?speech(me.id,'declare','angry'):'',theirs:speech(them?.id,'answer','angry'),mood:'angry'});return r;
    });
    // The deeper layer: reasons for war, peace terms, the envoy, the vassal.
    for(const d of document.querySelectorAll('[data-talk-fold]'))d.open=foldsOpen.includes(d.dataset.talkFold);
    if($('talk-paper')&&paperScroll)$('talk-paper').scrollTop=paperScroll;
    for(const b of document.querySelectorAll('[data-cb]'))b.onclick=()=>{talkCb=b.dataset.cb;showTalks(id,exchange);};
    for(const b of document.querySelectorAll('[data-term]'))b.onclick=()=>{talkTerm=talkTerm===b.dataset.term?null:b.dataset.term;showTalks(id,exchange);$('peace-proposal')?.scrollIntoView?.({block:'nearest'});};
    for(const b of document.querySelectorAll('[data-treaty]'))b.onclick=()=>{const d=talkDraftOf(id),key=b.dataset.treaty;d[key]=!d[key];if(key==='vassal'&&d.vassal){d.land=0;d.tiles=null;}showTalks(id,exchange);};
    for(const b of document.querySelectorAll('[data-treaty-pay]'))b.onclick=()=>{const d=talkDraftOf(id),share=Number(b.dataset.treatyPay);d.pay=d.pay===share?0:share;showTalks(id,exchange);};
    for(const b of document.querySelectorAll('[data-treaty-land]'))b.onclick=()=>{const d=talkDraftOf(id);d.land=Math.max(0,d.land+Number(b.dataset.treatyLand));if(d.tiles&&d.land>d.tiles.length)d.tiles=null;if(d.land)d.vassal=false;showTalks(id,exchange);};
    if($('deal-map'))$('deal-map').onclick=()=>pickCession(id);
    bindComicAction($('treaty-go'),()=>{
      const q=getTreatyQuote(state,id,treatySelection(id,talkDraftOf(id)));if(!q.enabled){toast(q.reason,true);showTalks(id);return;}
      const r=execute(q.action);if(!r.ok)return r;talkDrafts.delete(id);
      const said=(r.detail.done||[]).join('、')||'各自收兵';
      showTalks(id,{mine:me?speech(me.id,'ask_peace','normal'):'',theirs:speech(them?.id,r.detail.demand?'refuse':'accept',r.detail.demand?'angry':'normal'),mood:r.detail.demand?'angry':'normal',result:`和约成了：${said}。`});$('talk-result')?.scrollIntoView?.({block:'nearest'});return r;
    });
    for(const b of document.querySelectorAll('[data-vassal-person]'))b.onclick=()=>{talkVassalPicks.set(id,b.dataset.vassalPerson);showTalks(id,exchange);};
    if($('vassal-requisition'))$('vassal-requisition').onclick=e=>{const b=e.currentTarget,q=getVassalCharacterQuote(state,id,talkVassalPicks.get(id));if(!q.enabled){toast(q.reason,true);showTalks(id);return;}if(!b.dataset.sure){b.dataset.sure='1';b.querySelector('span').textContent=F.vassal_confirm;return;}const r=execute(q.action);if(r.ok){toast(feedbackText('vassal_done',{name:state.characters[r.detail.characterId]?.name||''}));showTalks(id);}};
    bindComicAction($('peace-go'),()=>{
      const term=getRelation(state,id)?.peace?.terms.find(item=>item.id===talkTerm);if(!term?.enabled){toast(term?.reason||'条款已经变化，请重新选择。',true);showTalks(id);return;}
      const r=execute(term.action);if(!r.ok)return r;talkTerm=null;
      const d=r.detail,said={gold:`她赔了 ${d.gold} 金币，两国休战。`,land:`她割让了 ${d.tiles?.length||0} 块地，两国休战。`,vassal:`${f.name}臣服了：从此进贡、随你出战。`,pay:`赔了 ${-d.gold} 金币，换来休战。`}[d.term]||'两国停战。';
      showTalks(id,{mine:me?speech(me.id,'ask_peace','normal'):'',theirs:speech(them?.id,d.term==='pay'?'accept':'refuse',d.term==='pay'?'normal':'angry'),mood:d.term==='pay'?'normal':'angry',result:said});$('talk-result')?.scrollIntoView?.({block:'nearest'});return r;
    });
    for(const b of document.querySelectorAll('[data-envoy]'))bindComicAction(b,()=>{
      const quote=getEnvoyQuote(state,id,b.dataset.envoy);if(!quote.enabled){toast(quote.reason,true);return;}
      const r=execute(quote.action);if(!r.ok)return r;toast(`${state.characters[b.dataset.envoy].name}出使${f.name}，每回合好感 +${quote.effect.speed}。`);showTalks(id,exchange);return r;
    });
    bindComicAction($('envoy-recall'),()=>{const r=execute({type:'assignEnvoy',factionId:id,characterId:null});if(!r.ok)return r;toast('使节召回了，回到首都。');showTalks(id,exchange);return r;});
    bindComicAction($('annex-go'),()=>{
      const quote=getAnnexQuote(state,id);if(!quote.enabled){toast(quote.reason,true);return;}
      const r=execute(quote.action);if(!r.ok)return r;toast(`开始整合${f.name}：每回合推进一格，打仗或她闹独立会暂停。`);showTalks(id);return r;
    });
    if($('release-vassal'))$('release-vassal').onclick=e=>{const b=e.currentTarget;if(!b.dataset.sure){b.dataset.sure='1';b.firstChild.textContent='再点一次，确定解除';return;}const r=execute({type:'releaseVassal',factionId:id});if(r.ok)showTalks(id);};
  },refresh);
}
const OFFER_TEXT={peace:['ask_peace','提议停战：休战 6 回合。'],trade:['ask_deal','提议通商：双方每回合 +2 金。'],pact:['ask_deal','提议互不侵犯：12 回合互不进攻。'],ally:['ask_deal',`提议结盟：${ALLIANCE_OBLIGATION}`],tribute:['hello','要你进贡。不给的话，她就要开战了。']};
function vnChoice(title,speakerId,expr,text,note,buttons,bg='hall'){
  stageBg=bg;
  openModal(title,'',vnStage(title,{speaker:speakerId,expr,text}),()=>{
    const row=$('vn-actions');row.innerHTML=`${note?`<p class="vn-note">${esc(note)}</p>`:''}${buttons.map((b,i)=>`<button class="vn-act ${b.plain?'plain':''}" data-b="${i}">${esc(b.label)}</button>`).join('')}`;
    row.querySelectorAll('[data-b]').forEach(el=>el.onclick=()=>buttons[+el.dataset.b].run());
  });
}
function offerIdentity(item){return [state.seed,state.playerId,item.id,item.turn,item.from,item.kind].join('|');}
function markOfferSeen(item){deferredOfferIds.add(offerIdentity(item));deferredOfferIds=new Set([...deferredOfferIds].slice(-64));try{localStorage.setItem(SAVE_KEY+'.deferred-offers',JSON.stringify([...deferredOfferIds]));}catch{}}
function nextPendingOffer(){return (state.inbox||[]).find(item=>!deferredOfferIds.has(offerIdentity(item)));}
function offerConsequence(item){return item.kind==='tribute'?`要求 ${format(item.gold)} 金币。拒绝会宣战；本回合结束前不答复，也可能遭到宣战。`:'本回合结束时未回复则过期，不会自动接受。';}
function showInbox(){
  const inbox=state.inbox||[],names={peace:'停战',trade:'通商',pact:'互不侵犯',ally:'结盟',tribute:'进贡要求'};
  for(const item of inbox)markOfferSeen(item);
  openReading('外交来信',`${inbox.length} 封待回复`,`<div class="comic-sheet">${inbox.length?`<div class="comic-banner"><img src="assets/sazai.webp" alt="" /><div><b>使者来信 · 本回合结束时到期</b><p>可以先收起，随时从右上角「来信」重新打开回复。</p></div></div><div class="offer-inbox">${inbox.map(item=>{const f=state.factions[item.from],them=f&&typeof leaderOf==='function'?leaderOf(f):null,face=them&&typeof portraitUrl==='function'?portraitUrl(them,item.kind==='tribute'?'angry':'smile'):'assets/sazai.webp';return `<article class="info-box comic-letter ${item.kind==='tribute'?'danger':''}" style="--c:${esc(f?.color||'#ffc83d')}"><img class="letter-face" src="${esc(face)}" alt="" /><div class="letter-body"><h3>${esc(f?.name||item.from)} · ${esc(names[item.kind]||item.kind)}</h3><p>${esc(offerConsequence(item))}</p><button class="small-button" data-inbox-offer="${esc(item.id)}">查看并回复</button></div></article>`;}).join('')}</div>`:'<div class="captives-empty"><img src="assets/sazai.webp" alt="" /><p>没有待回复来信。</p></div>'}</div>`,()=>{$('modal')?.classList?.add?.('scene','bg-hall');$('modal-body').querySelectorAll('[data-inbox-offer]').forEach(button=>button.onclick=()=>{const item=state.inbox.find(item=>String(item.id)===button.dataset.inboxOffer);if(item)showOffer(item);else showInbox();});});
}
function showFiscalWarning(plan,{confirmOffersExpiry=false,offset=0}={}){
  const quotedState=state,quotedRevision=state.revision,owner={};let active=true,opening=false;
  const quoteRear=()=>{try{return getMilitaryStandDownPlan(state);}catch{return null;}};
  const eligible=quote=>Boolean(quote?.enabled&&Array.isArray(quote.affected)&&quote.affected.length&&Number.isFinite(quote.saving)&&quote.saving>0);
  const rear=quoteRear();
  openModal('维护预算不足','结束回合前查看实际损失',`<div class="reading"><div class="comic-sheet"><div class="comic-banner warn"><img src="assets/icons/gold.webp" alt="" /><div><b>国库不够支付本回合维护费</b><p>你可以先去内政调整，或者把后方军队转成省钱的后备状态。</p></div></div>${fiscalReportHtml(plan.report,offset)}<div class="form-actions"><button class="small-button secondary" id="cancel-fiscal-loss">先调整财政</button>${eligible(rear)?'<button class="small-button secondary" id="preview-fiscal-standdown">预览后方转后备</button>':''}<button class="small-button danger" id="end-with-fiscal-loss">承担上方损失并结束回合</button></div></div></div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-hall');
    const confirmButton=$('end-with-fiscal-loss');confirmButton.fiscalWarningOwner=owner;
    const ownsView=()=>active&&$('modal').open&&!$('close-modal').hidden&&$('end-with-fiscal-loss')===confirmButton&&confirmButton.fiscalWarningOwner===owner&&$('modal-body').contains(confirmButton);
    const live=()=>ownsView()&&state===quotedState&&state.revision===quotedRevision;
    $('cancel-fiscal-loss').onclick=()=>{if(!live())return;active=false;showManagement();};
    if($('fiscal-prev'))$('fiscal-prev').onclick=()=>{if(!live())return;active=false;showFiscalWarning(plan,{confirmOffersExpiry,offset:offset-100});};
    if($('fiscal-more'))$('fiscal-more').onclick=()=>{if(!live())return;active=false;showFiscalWarning(plan,{confirmOffersExpiry,offset:offset+100});};
    if($('preview-fiscal-standdown'))$('preview-fiscal-standdown').onclick=event=>{
      if(event?.detail>1||opening||!live()||uiBusy||turnInput.busy)return;
      opening=true;
      try{
        const current=quoteRear();
        if(!live()||uiBusy||turnInput.busy||!eligible(current)||JSON.stringify(current)!==JSON.stringify(rear))return;
        active=false;showMilitaryStandDown();
      }finally{opening=false;}
    };
    confirmButton.onclick=event=>{
      if(!ownsView())return;
      if(state!==quotedState||state.revision!==plan.revision){toast('局势已变化，请重新查看财政清单。',true);closeModal();return;}
      const current=getFiscalRecoveryPlan(state);
      if(!live())return;
      if(JSON.stringify(current)!==JSON.stringify(plan)){if(current.needed)showFiscalWarning(current,{confirmOffersExpiry});else{toast('维护缺口已解除，请重新结束回合。');closeModal();}return;}
      active=false;requestEndTurn(event,{confirmOffersExpiry,confirmFiscalLoss:true});
    };
  });
}
function showFiscalRecord(report,offset=0){
  if(!report)return;
  if(state.factions[state.playerId].fiscalReport!==report){toast('财政记录已更新，请重新打开通知。',true);closeModal();return;}
  openReading('财政收缩记录',`第 ${report.turn} 回合已发生的损失`,`<div class="comic-sheet"><div class="comic-banner warn"><img src="assets/icons/gold.webp" alt="" /><div><b>第 ${report.turn} 回合维护缩减账单</b><p>以下是当时因资金或补给不足自动缩减的记录。</p></div></div>${fiscalReportHtml(report,offset,{settled:true})}</div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-hall');
    if($('fiscal-prev'))$('fiscal-prev').onclick=()=>showFiscalRecord(report,offset-100);
    if($('fiscal-more'))$('fiscal-more').onclick=()=>showFiscalRecord(report,offset+100);
  });
}
function showOfferExpiry(){
  const inbox=state.inbox||[],tribute=inbox.filter(item=>item.kind==='tribute');
  openModal('来信即将过期','结束回合前确认',`<div class="reading"><div class="comic-sheet"><div class="comic-banner ${tribute.length?'warn':''}"><img src="assets/sazai.webp" alt="" /><div><b>还有 ${inbox.length} 封外交来信未答复</b><p>直接结束回合会让来信作废（不会自动同意）。</p></div></div>${tribute.length?`<div class="recovery-warning"><b>存在宣战风险</b>${tribute.map(item=>`<p>${esc(state.factions[item.from]?.name||item.from)}：${esc(offerConsequence(item))}</p>`).join('')}</div>`:''}<div class="form-actions"><button class="small-button secondary" id="review-expiring-offers">先看来信</button><button class="small-button danger" id="end-with-expiring-offers">仍然结束回合</button></div></div></div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-hall');
    $('review-expiring-offers').onclick=showInbox;$('end-with-expiring-offers').onclick=event=>requestEndTurn(event,{confirmOffersExpiry:true});
  });
}
function showOffer(item){
  const f=state.factions[item.from];if(!f||!(state.inbox||[]).some(offer=>offer.id===item.id)){showInbox();return;}
  markOfferSeen(item);
  const them=leaderOf(f),view=getRelation(state,item.from),[situation,about]=OFFER_TEXT[item.kind]||['hello','有一封提议。'];
  const priced=item.kind==='peace'&&item.gold?`她占着上风：要你赔 ${format(item.gold)} 金币才肯停战。`:item.kind==='peace'&&item.pays?`她撑不住了：愿意赔你 ${format(item.pays)} 金币换停战。`:'';
  const note=`${f.name}${item.kind==='tribute'?'送来进贡要求。':about}${priced?` ${priced}`:''} ${offerConsequence(item)} 关闭或 Esc 只是暂缓，可从地图「外交来信」继续回复。`;
  const answer=accept=>{const r=runAction({type:'answerOffer',id:item.id,accept});if(r.ok)closeModal();else toast(r.error,true);};
  vnChoice(f.name,them?.id,MOOD_EXPR[view.mood],speech(them?.id,situation,view.mood),note,[{label:item.kind==='tribute'?`支付 ${item.gold} 金`:item.kind==='peace'&&item.gold?`赔 ${item.gold} 金停战`:item.kind==='peace'&&item.pays?`收下 ${item.pays} 金停战`:'同意',run:()=>answer(true)},{label:item.kind==='tribute'?'拒绝并开战':'拒绝',plain:true,run:()=>answer(false)},{label:'稍后处理',plain:true,run:()=>{closeModal();renderCommandBar();}}]);
}
function showDeclaration(n){
  const f=state.factions[n.factionId],them=f&&leaderOf(f);
  vnChoice(f?.name||'宣战',them?.id,'angry',speech(them?.id,'declare','angry'),n.text,[{label:'知道了',plain:true,run:closeModal},{label:'去会谈',run:()=>showTalks(n.factionId)}],'war');
}
/** 战争结束: told by her own lead, with the reason, where the land went, and one tap to the place or to the cells. */
function showWarOver(n){
  const f=state.factions[n.factionId],by=n.byId?state.factions[n.byId]:null,name=f?.name||'对方';
  const held=Object.values(state.captives||{}).filter(c=>c?.originalFactionId===n.factionId&&c.captorId===state.playerId).length;
  const tile=n.key?state.tiles[n.key]:null;
  const line=by?`${name}被${by.name}灭了……我们和她的仗，就这么结束了。`:`${name}散了。我们和她的仗不用再打了。`;
  const buttons=[{label:'知道了',plain:true,run:closeModal}];
  if(tile?.discovered&&typeof goToTile==='function')buttons.push({label:'在地图上看',run:()=>{closeModal();goToTile(n.key);}});
  if(held&&typeof showCaptives==='function')buttons.push({label:`去牢房（${held} 人）`,run:()=>{closeModal();showCaptives();}});
  vnChoice(`战争结束 · ${name}`,state.activeHeroId,'surprised',line,n.text,buttons,'war');
}
function queueWorldDetails(before,action){
  if(practice||lesson)return;
  const fresh=getWorldDetails(before,state,action),details=[...fresh.captures,...fresh.falls];if(!details.length)return;
  if(typeof queueScene==='function')for(const item of fresh.captures)queueScene(item.characterId,'capture',{bg:'cell'});
  if(typeof queueScene==='function')for(const item of fresh.falls)if(item.speakerId&&!item.returned)queueScene(item.speakerId,'fall',{bg:'court',head:`<div class="fall-head" style="--c:${esc(item.color||'#a9afc0')}"><b>${esc(item.factionName)}</b><small>${esc(item.speakerName||'')} · 国家代表</small><span>亡国</span></div>`});
  const note={kind:'world',text:details.slice(0,2).map(item=>item.title).join(' · ')+(details.length>2?` 等 ${details.length} 项`:''),color:details[0].color,details};
  reportItems=trimReportItems([...reportItems,note]);trackReportLifetime([note],18000);renderReport();
}
// UI-only readable time: battle/overlay time never spends a report's lifetime.
// Object identity and a timer generation keep old worlds and dismissals separate.
const reportLifetimes=new Map();let reportLifetimeTimer=null,reportTimerGeneration=0;
function reportIsReadable(){return !practice&&!lesson&&!state.battle&&!flowerOpen&&!document.hidden&&!$('modal').open&&['title-screen','notice-screen','flyer'].every(id=>!$(id)||$(id).hidden);}
function trackReportLifetime(items,duration){const at=Date.now(),readable=reportIsReadable();for(const item of items)if(!reportLifetimes.has(item))reportLifetimes.set(item,{remaining:duration,at,readable});}
function ageReportLifetimes(){
  const at=Date.now(),readable=reportIsReadable();let expired=false;
  for(const [item,life]of reportLifetimes){
    if(!reportItems.includes(item)){reportLifetimes.delete(item);expired=true;continue;}
    // Conservatively omit the transition interval if either endpoint is blocked.
    if(life.readable&&readable)life.remaining-=Math.max(0,at-life.at);
    life.at=at;life.readable=readable;
    if(life.remaining<=0){reportItems=reportItems.filter(n=>n!==item);reportLifetimes.delete(item);expired=true;}
  }
  return expired;
}
function scheduleReportLifetime(){
  clearTimeout(reportLifetimeTimer);reportLifetimeTimer=null;const generation=++reportTimerGeneration;
  if(reportLifetimes.size)reportLifetimeTimer=setTimeout(()=>{if(generation!==reportTimerGeneration)return;reportLifetimeTimer=null;if(ageReportLifetimes())renderReport();else scheduleReportLifetime();},Math.min(250,...[...reportLifetimes.values()].map(life=>life.remaining)));
}
document.addEventListener('visibilitychange',()=>{ageReportLifetimes();scheduleReportLifetime();});
const isAllianceNotice=n=>n.kind==='war'&&Boolean(n.allyId);
// One priority card holds this short-lived batch, even when later land reports arrive.
// Keep individual notice objects so each retains the existing seen/expiry lifecycle.
function trimReportItems(items){return [...items.filter(isAllianceNotice),...items.filter(n=>!isAllianceNotice(n)).slice(-3)];}
function showWorldDetails(details){
  openReading('战后纪事','本次行动的新变化',`<div class="comic-sheet"><div class="world-details">${details.map(item=>{const hero=state.characters[item.speakerId],face=hero?portraitUrl(hero,'smile'):fallbackPortrait(item.speakerName||item.factionName,item.color);return `<article style="--detail-color:${esc(item.color||'#9fb2c5')}"><header><img src="${esc(face)}" alt="" /><div><small>第 ${item.turn} 回合 · ${esc(item.factionName)}</small><h3>${esc(item.title)}</h3><b>${esc(item.speakerName||item.factionName)}</b></div></header>${item.lines.map(line=>`<p>${esc(line)}</p>`).join('')}</article>`;}).join('')}</div><div class="form-actions"><button class="small-button" id="details-captives">查看当前俘虏</button><button class="small-button secondary" id="details-chronicle">查看纪事</button></div></div>`,()=>{$('modal')?.classList?.add?.('scene','bg-war');$('details-captives').onclick=showCaptives;$('details-chronicle').onclick=showChronicle;});
}
const REPORT_ICON={jail:'heroes',war:'sword',peace:'flag',cut:'target',land:'flag',nation:'crest',era:'spark',world:'flag'};
function showAllianceReport(entries){
  const shownState=state;let view;
  openReading('同盟参战','已经执行的参战与影响',`<div class="comic-sheet"><div class="comic-banner warn"><img src="assets/sazai.webp" alt="" /><div><b>盟约生效 · 已自动参战</b><p>以下参战与外交变化已经生效，并记入世界编年史。</p></div></div><div class="offer-inbox" id="alliance-report">${entries.map(n=>{const f=state.factions[n.factionId],them=f&&typeof leaderOf==='function'?leaderOf(f):null,face=them&&typeof portraitUrl==='function'?portraitUrl(them,'angry'):'assets/sazai.webp';return `<article class="info-box comic-letter" style="--c:${esc(f?.color||'#ef6758')}"><img class="letter-face" src="${esc(face)}" alt="" /><div class="letter-body"><h3>第 ${n.turn} 回合</h3><p>${esc(n.text)}</p>${f?.alive?`<button class="small-button" data-alliance-talk="${esc(n.factionId)}">与${esc(f.name)}会谈</button>`:''}</div></article>`;}).join('')}</div><p class="form-hint">这些影响也已记入编年史，可从「存档 → 查看编年史」重新查看。</p><button class="small-button secondary" id="alliance-chronicle">查看编年史</button></div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-war');
    view=$('alliance-report');const current=()=>state===shownState&&$('modal').open&&$('alliance-report')===view;
    view.querySelectorAll('[data-alliance-talk]').forEach(button=>button.onclick=()=>{if(current())showTalks(button.dataset.allianceTalk);});$('alliance-chronicle').onclick=()=>{if(current())showChronicle();};
  });
}
function renderReport(){
  if(practice)return;
  ageReportLifetimes();
  // Older saves can contain a `world` notice from a foreign declaration near our border.
  const fresh=(state.notices||[]).filter(n=>n.id>(tutorial.seenNotice||0)&&!n.line&&n.kind!=='world');
  if(fresh.length){tutorial.seenNotice=Math.max(tutorial.seenNotice,...fresh.map(n=>n.id));reportItems=trimReportItems([...reportItems,...fresh]);trackReportLifetime(fresh,9000);saveAuto();}
  const receipt=quickDefense.receipt,box=$('report');box.hidden=!reportItems.length&&!receipt;
  const calls=reportItems.filter(isAllianceNotice),cards=[...(receipt?[{kind:'war',quickReceipt:receipt,text:quickDefenseReceiptSummary(receipt)}]:[]),...(calls.length?[{kind:'war',entries:calls,text:`同盟参战 · 查看影响：${calls.length===1?`你已为${state.factions[calls[0].allyId]?.name||'盟友'}向${state.factions[calls[0].factionId]?.name||'进攻国'}宣战`:`已自动加入 ${calls.length} 场战争`}`}]:[]),...reportItems.filter(n=>!isAllianceNotice(n))];
  box.classList.toggle('has-alliance',Boolean(calls.length));
  if(calls.length){box.setAttribute('tabindex','0');box.setAttribute('role','region');box.setAttribute('aria-label','近期战报，窄屏可上下滚动查看全部');}
  else{for(const attribute of ['tabindex','role'])box.removeAttribute(attribute);box.setAttribute('aria-label','战报');}
  // Focus can outlive the alliance card or the last report. Its Space still belongs
  // to this region, while child controls and a fresh map press keep their own behavior.
  box.onkeydown=event=>{if(event.target===box&&event.code==='Space'){event.preventDefault();box.scrollTop+=(event.shiftKey?-1:1)*box.clientHeight;}};
  morph(box,`${calls.length&&cards.length>1?'<small class="report-scroll-hint">战报 · ↕ 上下滚动查看</small>':''}`+cards.map((n,i)=>`<div class="note ${esc(n.kind)}"${n.color?` style="border-color:${esc(n.color)}"`:""}><button data-note="${i}"${n.entries?` title="${esc(n.entries.map(entry=>entry.text).join('\n'))}" aria-label="${esc(n.text)}"`:''}>${icon(REPORT_ICON[n.kind]||'flag')}<span>${esc(n.text)}</span></button><button class="x" data-drop="${i}" ${n.quickReceipt?'hidden':''} aria-label="收起">${icon('close')}</button></div>`).join(''));
  const dismiss=n=>{if(n.quickReceipt)return;reportItems=reportItems.filter(x=>n.entries?!n.entries.includes(x):x!==n);renderReport();};
  const current=n=>n.quickReceipt?quickDefense.receipt===n.quickReceipt:n.entries?n.entries.some(entry=>reportItems.includes(entry)):reportItems.includes(n);
  // Morph can reuse a former group button for an ordinary row. Capture its card
  // now; a retained callback must never read that reused node's new data index.
  box.querySelectorAll('[data-note]').forEach(b=>{const n=cards[+b.dataset.note];b.onclick=()=>{if(!current(n))return;
    // In a lesson the notes are for reading: a tap must not walk the map away from what the lesson points at.
    if(typeof lesson!=='undefined'&&lesson&&typeof guideNow==='function'&&guideNow()){if(typeof nudgeGuide==='function')nudgeGuide();return;}if(n.quickReceipt){if($('modal').open||state.battle||!$('title-screen').hidden)return;openReading('最近快速战果','已结算 · 只读',quickDefenseReceiptHtml(n.quickReceipt));return;}if(n.entries)showAllianceReport(n.entries.filter(entry=>reportItems.includes(entry)));else if(n.details)showWorldDetails(n.details);else if(n.fiscalTurn){const report=state.factions[state.playerId].fiscalReport;if(report?.turn===n.fiscalTurn)showFiscalRecord(report);else openReading('财政收缩记录','记录已更新',`<p>${esc(n.text)}</p><p>完整逐项清单已由较新的收缩记录替代。</p>`);}else if(n.militarySites?.length)showMilitaryEmergency(n);else if(n.key){selectedKey=n.key;worldMap.centerOn(n.key);}else if(n.factionId&&state.factions[n.factionId]?.alive)showTalks(n.factionId);else if(n.kind==='era')showFactions();else if(n.kind==='jail')showCaptives();dismiss(n);};});
  box.querySelectorAll('[data-drop]').forEach(b=>{const n=cards[+b.dataset.drop];b.onclick=()=>{if(current(n))dismiss(n);};});
  ageReportLifetimes();scheduleReportLifetime();
}
/** Who sits on a tile. Clicking any seat opens the garrison sheet. */
function seatStrip(key){
  const t=state.tiles[key],army=getArmy(state,key),mine=t.ownerId===state.playerId;
  const seats=Array.from({length:MAX_SEATS},(_,i)=>{
    const who=army.leaders[i];
    if(who?.kind==='girl'){const hero=state.characters[who.id];return `<span class="seat girl" title="${esc(hero.name)}"><img src="${esc(portraitUrl(hero,'smile')||'')}" alt="${esc(hero.name)}" /></span>`;}
    if(who&&who.rank!=='N')return `<span class="seat bag" style="--glow:${RANK_GLOW[who.rank]}"><img src="assets/sazai.webp" alt="" /><i>${who.rank}</i></span>`;
    return `<span class="seat ${who?'bag plain':'empty'}">${who?'<img src="assets/sazai.webp" alt="" />':'+'}</span>`;
  }).join('');
  return mine?`<button class="seats" data-seat="1" aria-label="管理驻扎">${seats}</button>`:`<div class="seats">${seats}</div>`;
}
function showGarrison(key,feedback=null,{military=false}={}){
  const firstSeat=GUIDE[tutorial.step]?.id==='seat'&&!tutorial.dismissed;closeFlowerQuiet();guideDone('seat');
  const t=state.tiles[key],stats=getTileStats(state,key);
  if(t?.ownerId!==state.playerId){closeModal();return;}
  const army=getArmy(state,key),service=army.military,quote=getMilitaryQuote(state,key,!service.reserve);
  const face=(id,stay)=>{const hero=state.characters[id];return `<button class="roster-face" data-stance="${esc(id)}" data-stay="${stay}"><i><img src="${esc((typeof portraitUrl==='function'?portraitUrl(hero,'smile'):'')||'')}" alt="" /></i><b>${esc(hero.name)}</b></button>`;};
  const seats=Array.from({length:MAX_SEATS},(_,i)=>t.garrison[i]?face(t.garrison[i],0):'<span class="roster-face empty"><i></i></span>').join('');
  const nobody=!army.girls.length,rare=['SSR','SR','R'].filter(r=>t.elite?.[r]).map(r=>`${r} × ${t.elite[r]}`).join('　');
  const artKey=t.building==='garden'?'farm':t.building&&['camp','capital','farm','fort','home','lumber','mine','port','quarry'].includes(t.building)?t.building:t.isCapital?'capital':'home';
  const bName=typeof BUILDINGS!=='undefined'&&t.building?`${BUILDINGS[t.building]?.name||t.building}${(t.buildingLevel||1)>1?` Lv ${t.buildingLevel}`:''}`:t.isCapital?'本国主城':'领地据点';
  openReading(tileName(t),'驻扎与军队',`<div class="comic-sheet"><div class="comic-banner"><img class="building-thumb" src="assets/buildings/${artKey}.webp" alt="" /><div><b>${esc(bName)} · ${esc(key)}</b><p>点角色头像即可在「留守驻扎」和「随队出征」之间切换。</p></div></div>${firstSeat?'<p class="guide-note">上面是驻扎的女孩子，留守这里不能走；下面是编队里的，跟编队出发。点头像就能切换。看完点右上角的 × 关闭。</p>':''}
    <h4>驻扎 ${t.garrison.length}/${MAX_SEATS}<small>留守这里，走不了</small></h4><div class="roster-row">${seats}</div>
    <h4>编队 ${t.field.length}<small>跟编队出发，点头像留下驻扎</small></h4><div class="roster-row">${t.field.map(id=>face(id,1)).join('')||'<p class="form-hint">这里还没有编队。点上面的头像，让她加入编队。</p>'}</div>
    ${nobody&&!hasRegularGuard(state,t)?'<p class="guide-alarm">这里没有可参战守备，敌军来了会直接占领。</p>':''}
    <div class="tile-facts"><span>人 <b>${t.troops}</b>/${stats.housing}</span><span>满产 <b>${stats.need}</b> 人</span><span>金 <b>+${stats.gold}</b></span><span>粮 <b>+${stats.supply}</b></span><span>防 <b>${stats.defense}</b></span>${rare?`<span>稀有罪袋 <b>${rare}</b></span>`:''}</div>
    ${departureReason(state,t)?`<p class="form-hint">${esc(departureReason(state,t))}</p>`:''}${stats.fort?`<p class="form-hint">${esc(stats.fort.reason||'要塞防区正在执勤。')} 维护 ${stats.fort.upkeep.gold} 金币、${stats.fort.upkeep.supply} 补给 / 回合。</p>`:''}<div class="form-actions"><button class="small-button" id="garrison-march" ${departureReason(state,t)?'disabled':''}>${typeof icon==='function'?icon('flag'):''}指挥编队</button></div><details class="garrison-military" id="garrison-military" ${military||feedback?'open':''}><summary>常备军编制 · ${esc(militaryModeLabel(service))}</summary>${militarySiteHtml(service,army)}${militaryQuoteHtml(quote)}<p id="military-service-result" class="military-result" role="status" tabindex="-1" ${feedback?'':'hidden'}>${esc(feedback?.text||'')}</p>${feedback?.undo?'<button class="small-button secondary" id="undo-military-service">撤销本次调整</button>':''}</details></div>`,()=>{
      $('modal')?.classList?.add?.('scene','bg-town','garrison-screen');
      document.querySelectorAll('[data-stance]').forEach(b=>b.onclick=()=>{const r=runAction({type:'stance',characterId:b.dataset.stance,stay:b.dataset.stay==='1'});if(r.ok)showGarrison(key);});
      $('garrison-march').onclick=()=>{closeModal();beginDispatch(key);worldMap.panIntoView(key,{left:120,right:120,top:180,bottom:120});};
      bindComicAction($('confirm-military-service'),()=>{
        const current=getMilitaryQuote(state,key,quote.reserve);
        if(JSON.stringify(current)!==JSON.stringify(quote)){showGarrison(key,{text:'编制或报价已变化，请查看当前费用后重新确认。'});return;}
        if(!current.enabled)return;
        const result=runAction(quote.action);if(!result.ok){showGarrison(key,{text:result.error});return;}
        const paid=result.detail;
        showGarrison(key,{text:paid.reserve?`已转为后备。全军实付军费 ${paid.budgetBefore.gold} → ${paid.budgetAfter.gold} 金币 / 回合；居民、英雄、等级与稀有库存保留。`:`已支付一次整备费 ${paid.cost.gold} 金币，第 ${paid.after.readyTurn} 回合恢复军训与稀有队；整备期间仍支付军费，不抵扣后续维护。`,undo:true});
      });
      if($('undo-military-service')){const expectedRevision=state.revision;bindComicAction($('undo-military-service'),()=>{const result=runAction({type:'undo',expectedRevision});if(result.ok)showGarrison(key,{text:'已撤销本次编制调整。'});});}
      if(feedback){$('military-service-result').focus({preventScroll:true});$('military-service-result').scrollIntoView?.({block:'nearest'});}
    if(military||feedback)$('garrison-military')?.scrollIntoView({block:'nearest'});
    },()=>showGarrison(key,null,{military:Boolean($('garrison-military')?.open)}));
}
/** A plain list of the player's armies (编队) down the right edge, ready ones first: tap one to command it. */
function renderRail(){
  const box=$('army-rail'),list=(lesson&&!lesson.advanced)||state.battle?[]:Object.values(state.tiles).filter(t=>t.ownerId===state.playerId&&t.field?.length).sort((a,b)=>Boolean(departureReason(state,a))-Boolean(departureReason(state,b))||b.field.length-a.field.length||b.troops-a.troops).slice(0,24);
  const commanded=typeof armyKey!=='undefined'?armyKey:null,orders=typeof getMarchOrders==='function'?getMarchOrders(state):[];
  const canFold=list.length>=2,folded=canFold&&Boolean(hudFold.rail);
  box.classList.toggle('folded',folded);
  const head=canFold?`<button type="button" class="rail rail-fold" id="fold-rail" aria-expanded="${!folded}" title="${folded?'展开编队列表':'收起编队列表'}"><b>编队 ${list.length}</b><small>${folded?'▾':'▴'}</small></button>`:'';
  const items=folded?'':list.map(t=>{const hero=state.characters[t.field[0]],why=departureReason(state,t),order=orders.find(o=>o.key===t.key&&o.girls.some(id=>t.field.includes(id)));return `<button class="rail ${why?'done':''} ${order?'ordered':''} ${commanded===t.key?'selected':''}" data-rail="${t.key}" aria-label="编队：${esc(hero?.name||'罪袋')}${t.field.length>1?` 等 ${t.field.length} 位`:''}，在${esc(tileName(t))}，${order?`远行中，还要 ${order.turns||'?'} 回合，`:''}${why?esc(why):'可以出发'}" title="${esc(order?`远行去 ${tileName(state.tiles[order.toKey])}${order.turns?`，还要 ${order.turns} 回合`:''}`:why||'可以出发')}">${hero?`<i><img src="${esc(portraitUrl(hero,'smile')||'')}" alt="" /></i>`:'<i class="bag">罪</i>'}<b>${t.field.length}</b><small>位</small>${order?`<em>${order.turns?`${order.turns}天`:'行'}</em>`:''}</button>`;}).join('');
  morph(box,head+items);
  if($('fold-rail'))$('fold-rail').onclick=()=>{hudFold.rail=!hudFold.rail;renderRail();if(typeof stackRightHud==='function')stackRightHud();if(typeof duckPanels==='function')duckPanels();};
  box.querySelectorAll('[data-rail]').forEach(b=>b.onclick=()=>{if(typeof selectArmy==='function'){selectArmy(b.dataset.rail,{center:true});return;}worldMap.centerOn(b.dataset.rail);selectTile(b.dataset.rail);});
}
/** Brings a tile up on the map with its ring open: the way every list (cities, rare Sazai, frontiers) hands over to the map. */
function goToTile(key){
  if(!state.tiles[key])return;
  if($('modal').open)closeModal();
  if(typeof mapPick!=='undefined'&&mapPick)finishMapPick(true);
  if(typeof armyTile==='function'&&armyTile())clearArmy();
  worldMap.centerOn(key);
  if(flowerOpen&&selectedKey===key){fitFlower(key);return;}
  selectTile(key);
}
function closeFlowerQuiet(){if(flowerOpen){flowerOpen=false;worldMap.select(null);renderFlower();}}
/** A throwaway battle on a throwaway map: the real save is set aside and put back untouched. */
function startPractice(){
  if(practice||state.battle)return;
  quickDefense.clear();
  if($('modal').open)closeModal();
  const kept={state,selectedKey};
  let world=createGame('practice');
  world.turn=8;world.relations[['lord','mujica'].sort().join('|')]={status:'war',favor:-30,until:0,since:8,trade:false,talkTurn:0};
  for(const t of Object.values(world.tiles)){t.garrison=[];t.field=[];}
  Object.assign(world.tiles['1,0'],{troops:13,field:['rupa','nina','momoka']});
  Object.assign(world.tiles['2,0'],{ownerId:'mujica',troops:6,terrainId:'plains',building:null,buildingLevel:0,elite:{R:1,SR:0,SSR:0},garrison:['sakiko']});
  world.factions.lord.supply=50;
  const r=perform(world,{type:'attack',fromKey:'1,0',toKey:'2,0'});
  if(!r.ok){toast(r.error,true);return;}
  practice=kept;coachIndex=0;practice.fromMenu=!$('title-screen').hidden;$('title-screen').hidden=true;state=r.state;render();
}
function endPractice(){
  const fromMenu=practice.fromMenu;state=practice.state;selectedKey=practice.selectedKey;practice=null;coachIndex=null;
  tutorial.coached=true;guideDone('practice');saveAuto();render();worldMap.centerOn(selectedKey);
  if(fromMenu)showMenu();
}
/* One manga page for a reading screen, the same cut as 内政 and 怎么玩: the leader stands on the left and says
   the one thing that matters, the title runs down the edge, and everything else is on the paper. Screens that
   are sliced out for white-box tests fall back to their plain sheet when this helper is not around. */
function mangaPage({cls='',title='',ribbon='',note='',lead=null,expr='smile',line='',paper=''}){
  const face=lead&&typeof portraitUrl==='function'?portraitUrl(lead,expr)||portraitUrl(lead,'smile'):'assets/sazai.webp';
  const girl=typeof girlHtml==='function'?girlHtml(face,lead?.name||'罪袋','poke-img'):`<div class="cs-girl"><img class="cs-art" src="${esc(face)}" alt="" /></div>`;
  if(lead&&typeof fitEdge==='function'&&typeof setTimeout==='function')setTimeout(()=>fitEdge(face),0);
  return `<div class="cs page ${cls}" style="--hero:${esc(lead?.color||'#ffc83d')};--pop:${typeof popOf==='function'?popOf(lead?.color||'#ffc83d'):'#3d6f8e'}">
    <div class="cs-stage"><div class="cs-frame"><i></i></div>${girl}</div>
    <header class="cs-id">${typeof vTitleHtml==='function'?vTitleHtml(title):`<h2 style="--n:${[...title].length}">${esc(title)}</h2>`}</header>
    ${ribbon?`<span class="cs-ribbon"><b>${esc(ribbon)}</b>${note?`<i>${esc(note)}</i>`:''}</span>`:''}
    <div class="cs-say always"><div class="bubble"><b>${esc(lead?.name||'罪袋')}</b><p>${esc(line)}</p></div></div>
    <div class="cs-leafwrap"><section class="cs-leaf">${paper}</section></div>
  </div>`;
}
function showChronicle(){
  const entries=new Map();
  const chronicle=(state.chronicle||[]).filter(item=>item.npcOnly!==true);
  const notices=(state.notices||[]).filter(item=>item.kind!=='world');
  for(const item of [...chronicle,...(state.logs||[]).filter(item=>item.npcOnly!==true),...notices])entries.set(`${item.turn}:${item.text}`,item);
  const history=[...entries.values()].sort((a,b)=>a.turn-b.turn).reverse();
  const lead=typeof currentHero==='function'?currentHero():null,face=lead&&typeof portraitUrl==='function'?portraitUrl(lead,'smile'):'assets/sazai.webp';
  const paged=typeof mangaPage==='function',rows=`<div class="timeline">${history.slice(0,200).map(l=>`<div class="timeline-item"><small>第 ${l.turn} 回合</small>${esc(l.text)}</div>`).join('')}</div>`;
  const about=`回看这个世界发生过的大事记、行动与战报${state.chronicleArchive?.entries?'；更早的历史已汇总归档':''}。`;
  openReading('编年史','',paged?mangaPage({cls:'chron',title:'编年史',ribbon:`最近 ${Math.min(200,history.length)} 条`,lead,expr:'smile',line:history.length?`最近的 ${Math.min(200,history.length)} 件事都记在这儿，最新的在最上面${state.chronicleArchive?.entries?'；更早的已经归档':''}。`:'还什么都没发生呢。',paper:history.length?rows:'<p class="pg-empty">这个世界的第一页还空着。</p>'})
    :`<div class="comic-sheet"><div class="comic-banner"><img class="letter-face" src="${esc(face)}" alt="" /><div><b>旅途编年史 · 最近 ${Math.min(200,history.length)} 条记录</b><p>${about}</p></div></div>${rows}</div>`,()=>{if(paged&&$('modal'))$('modal').className='screen sheet-mode page-screen';else $('modal')?.classList?.add?.('scene','bg-study');});
}
function showProgress(){
  const stats=getStats(state),progress=stats.progress;
  const lead=typeof currentHero==='function'?currentHero():null,face=lead&&typeof portraitUrl==='function'?portraitUrl(lead,'happy'):'assets/sazai.webp';
  const paged=typeof mangaPage==='function';
  const plans=`<div class="panel-grid progress-plans">${progress.plans.map((plan,i)=>`<div class="info-box pg-plan"><span class="bk-no">${i+1}</span>${planBar(plan)}${plan.description?`<p>${esc(plan.description)}</p>`:''}<p class="reward-line"><img src="assets/icons/gold.webp" alt="" /><img src="assets/icons/food.webp" alt="" />达成奖励：${format(plan.reward.gold)} 金币 · ${format(plan.reward.supply)} 补给</p></div>`).join('')}</div>`;
  const tail=`<div class="generation-stats" style="margin-top:18px"><span><b>${progress.completed}</b>已写下的篇章</span><span><b>${progress.buildingLevels}</b>建筑总等级</span><span><b>${progress.rebuilds}</b>边疆重建</span></div><h4>下一次世界演变 · 第 ${progress.nextWorldEventTurn} 回合</h4><p class="form-hint">每 8 回合，衰落的国家可能复兴，新势力可能从边疆入场，或出现贸易与丰收事件。已有国度与人物继续留在这个世界。</p><div class="info-box pg-forever"><h3>世界不会在这里结束</h3><p>失守时可以迁都或从边疆重建。同一份地图、人物与 Mod 会陪你继续走下去。</p></div>`;
  const best=[...progress.plans].sort((a,b)=>b.current/Math.max(1,b.target)-a.current/Math.max(1,a.target))[0];
  openReading('国度的下一篇章',`第 ${progress.chapter} 篇章`,paged?mangaPage({cls:'plans',title:'下一章',ribbon:`第 ${progress.chapter} 话`,note:'四选一',lead,expr:'happy',line:best?`四件事做成任意一件就翻到下一话，奖励自动到账。现在最接近的是「${best.label}」：${format(best.current)}/${format(best.target)}。`:'四件事做成任意一件就翻到下一话。',paper:plans+tail})
    :`<div class="comic-sheet"><div class="comic-banner"><img class="letter-face" src="${esc(face)}" alt="" /><div><b>第 ${progress.chapter} 篇章 · 自由发展目标</b><p>四项计划任意完成一项，就会自动领取奖励并开启下一篇章；按自己的节奏玩就好。</p></div></div>${plans}${tail}</div>`,()=>{if(paged&&$('modal'))$('modal').className='screen sheet-mode page-screen';else $('modal')?.classList?.add?.('scene','bg-stage');});
}
// Long-campaign view helpers. Keep these read-only: hidden owners must not leak through frontier lists.
const MANAGEMENT_MODES={balanced:'均衡建设',economy:'金币优先',supply:'补给优先'};
const FRONTIER_PAGE_SIZE=12;
const GOV_TABS=[['treasury','国库','coin'],['tech','科技','spark'],['build','建设','castle'],['army','军队','shield'],['edict','国策','scroll'],['frontier','边境','compass']];
/** What the leader says on each page of 内政: the one thing worth knowing, in her voice, with the face to match. */
function govLine(tab,stats){
  const f=state.factions[state.playerId],income=stats.income,turnsOfFood=income.supply<0?Math.floor(f.supply/-income.supply):Infinity;
  if(tab==='treasury'){
    if(income.supply<0&&turnsOfFood<=3)return {text:`粮每回合少 ${format(-income.supply)}，库里只够撑 ${turnsOfFood} 回合了！先买点粮，或者往下翻看看自救的办法。`,expr:'cry'};
    if(income.gold<0)return {text:`金币每回合倒贴 ${format(-income.gold)}。军费和要塞是大头，往下看账本。`,expr:'pout'};
    if(income.supply<0)return {text:`金币每回合进 ${format(income.gold)}，可粮在少：每回合 ${format(income.supply)}，还能撑 ${turnsOfFood} 回合。`,expr:'surprised'};
    return {text:`每回合净进 ${format(income.gold)} 金、${format(income.supply)} 粮。账都在右边，放心花。`,expr:'happy'};
  }
  if(tab==='build'){
    const policy=state.management||{mode:'off'};
    return state.ap<=0?{text:'这回合的指令用完了，建设下回合再安排。开着托管的话，我会用剩下的指令自己盖。',expr:'smile'}:{text:policy.mode==='off'?'挑个方向，我把这回合盖得起的列出来，你点「开工」就行。嫌每回合点麻烦，就开托管。':'托管开着：每回合结束，我会用剩下的指令照你定的方向盖。',expr:'happy'};
  }
  if(tab==='army'){
    const budget=stats.maintenance.military;
    return {text:budget.gold>0?`全军每回合军费 ${format(budget.gold)} 金。后方不打仗的驻地转成后备，就不用付。`:'现在没有要付的军费。练兵会让每一队罪袋都更能打，但也更贵。',expr:budget.gold>income.gold&&budget.gold>0?'pout':'smile'};
  }
  if(tab==='edict'){
    const slots=typeof EDICT_SLOTS!=='undefined'?EDICT_SLOTS.filter(chapter=>state.milestone.level>=chapter).length:0,active=(state.edicts||[]).length;
    return !slots?{text:`国策要到第 ${EDICT_SLOTS[0]} 话才开。那时候你定一条规矩，全国照办，不用再一件件点。`,expr:'smile'}:active<slots?{text:`还有 ${slots-active} 栏国策空着呢。定一条，全国每回合都照着来。`,expr:'surprised'}:{text:'国策都定好了。想换的话点一条新的，会把旧的顶掉。',expr:'happy'};
  }
  if(tab==='tech'&&typeof techOf==='function'){
    const record=techOf(state),active=record.active?TECHNOLOGIES.find(t=>t.id===record.active.id):null,queue=(record.queue||[]).map(id=>TECHNOLOGIES.find(t=>t.id===id)?.name).filter(Boolean);
    return active?{text:`正在研究「${active.name}」，还剩 ${record.active.remaining} 回合。${queue.length?`后面排着${queue.slice(0,3).join('、')}${queue.length>3?' 等':''}。`:'点一张卡，可以接着排下一项。'}`,expr:'happy'}:{text:'现在没有在研究！点树上一张卡，它要走的路会亮起来，再按下面的按钮就排好了。',expr:'surprised'};
  }
  const war=typeof filterFrontiers==='function'&&typeof frontierEntries==='function'?filterFrontiers(frontierEntries(state),'war').length:0;
  return war?{text:`有 ${war} 处边境在打仗。点一处，我把地图挪过去。`,expr:'angry'}:{text:'边境上现在没有战事。点一处就能跳过去看看。',expr:'smile'};
}
/** 国策 page: the slots as hexes, the eight edicts as a honeycomb, one caption and one burst. */
let govEdict=null;
function edictPageHtml(){
  if(typeof EDICTS==='undefined'||typeof getEdictQuote!=='function')return '';
  const active=state.edicts||[],slots=EDICT_SLOTS.filter(chapter=>state.milestone.level>=chapter).length;
  const picked=EDICTS.find(edict=>edict.id===govEdict)||EDICTS.find(edict=>!active.includes(edict.id))||EDICTS[0];
  const on=active.includes(picked.id),full=active.length>=slots&&slots>0,swap=!on&&full?active[0]:null,quote=getEdictQuote(state,picked.id,swap);
  const seats=EDICT_SLOTS.map((chapter,index)=>{const id=active[index],edict=EDICTS.find(item=>item.id===id);return `<span class="gv-slot ${edict?'on':index<slots?'open':'shut'}">${edict?`${icon(edict.icon)}<b>${esc(edict.name)}</b>`:index<slots?'<b>空着</b>':`<b>第 ${chapter} 话</b><small>解锁</small>`}</span>`;}).join('');
  const cells=EDICTS.map(edict=>`<button class="gv-edict ${active.includes(edict.id)?'got':''} ${edict.id===picked.id?'on':''}" data-edict="${esc(edict.id)}" aria-pressed="${edict.id===picked.id}">${icon(edict.icon)}<b>${esc(edict.name)}</b></button>`).join('');
  const note=on?'正在施行。废止不花钱，但这回合就不能再颁布别的了。':quote.enabled?(swap?`国策栏满了：颁布它会顶掉「${EDICTS.find(edict=>edict.id===swap).name}」。`:'一回合只能改一次国策。'):quote.reason;
  return `<section class="governance-panel gv-sec"><h3>国策</h3>${typeof lessonNote==='function'?lessonNote('adv_edict'):''}<p class="form-hint">定下一条，全国每回合照办，不用再一件件点。第 ${EDICT_SLOTS.join('、')} 话各开一栏。</p><div class="gv-slots">${seats}</div><div class="gv-edicts">${cells}</div>
    <div class="cs-cap" id="edict-proposal" role="status"><div><h3>${esc(picked.name)}</h3><p>${esc(picked.desc)}</p><small class="${on||quote.enabled?'':'warn'}">${on?'':`${esc(costLine(quote.cost))} · `}${esc(note)}</small></div>${on?'<button class="cs-burst small" id="edict-repeal"><span>废止</span></button>':`<button class="cs-burst small" id="edict-go" ${quote.enabled?'':'disabled'}><span>颁布！</span></button>`}</div></section>`;
}
/** 指令从哪来: the parts of this turn's commands and what would add another. */
function commandSourcesHtml(){
  if(typeof getCommandPlan!=='function')return '';
  const plan=getCommandPlan(state),hints=[];
  if(plan.nextRealm)hints.push(`领土到 ${plan.nextRealm} 块 +1（现在 ${plan.tiles} 块）`);
  if(!plan.strategist)hints.push('任命一位军师 +1（角色页「任用」）');
  if(!plan.parts.some(part=>part.id==='quirk'))hints.push('让有「运筹」词条的同伴领军或任职 +1');
  if(!plan.parts.some(part=>part.id==='edict'))hints.push('颁布国策「勤政」 +1');
  return `<h3>指令从哪来</h3><div class="gv-pips">${plan.parts.map(part=>`<span class="gv-pip"><b>${part.value}</b><small>${esc(part.label)}</small></span>`).join('<i>+</i>')}<i>=</i><span class="gv-pip sum"><b>${plan.total}</b><small>每回合</small></span></div>${state.maxAP!==plan.total?`<p class="form-hint">下回合开始按 ${plan.total} 令算，这回合还是 ${state.maxAP} 令。</p>`:''}${hints.length?`<details><summary>还能再多</summary><ul class="gv-hints">${hints.map(text=>`<li>${esc(text)}</li>`).join('')}</ul></details>`:''}`;
}
let govTab='treasury';
const TRAINING_ROLES={sazai:'罪袋',vanguard:'先锋',ranger:'游击',guard:'卫戍',support:'鼓舞'};
function hasRegularGuard(world,tile){return Boolean(tile&&getRegularGuard(world,tile.key));}
function fortDepartureWarning(fort,remaining){
  if(!fort?.localDefense||remaining>=fort.garrison)return '';
  const lost=[fort.siegeReady?'本地胸墙':'',fort.operational?'邻地掩护':'',fort.refuge?'迁都保障':''].filter(Boolean);
  return `要塞驻军将不足 ${fort.garrison} 人，不再满足普通军守备门槛${lost.length?'；将失去'+lost.join('、'):''}。`;
}
function departureRemainingElite(tile,{attack=false,transfer,preview}={}){
  if(!attack)return transfer?.retained??tile.elite;
  if(!preview?.ok)return tile.elite;
  // Direct occupation transfers the whole stock; battle sends only deployed squads.
  const retained={R:tile.elite?.R||0,SR:tile.elite?.SR||0,SSR:tile.elite?.SSR||0};
  if(preview.occupy)return {R:0,SR:0,SSR:0};
  for(const unit of preview.forces.attacker.units)if(Object.hasOwn(retained,unit.rank))retained[unit.rank]=Math.max(0,retained[unit.rank]-1);
  return retained;
}
function departureGuardWarning(world,tile,remaining,girls,elite=tile.elite){
  const retained={...tile,troops:remaining,field:tile.field.filter(id=>!girls.includes(id)),elite},after={...world,tiles:{...world.tiles,[tile.key]:retained}};
  return getArmy(after,tile.key).girls.length||hasRegularGuard(after,retained)?'':'原地没有可参战守备，遭进攻时可被直接占领。';
}
function tileActionReason(action){
  // The panel has one next-turn direction; keep each card's numeric shortage and other blockers.
  const redundant=state.ap<=0&&state.ap<(action.cost?.ap||0)&&action.reason==='指令用完了，点右下角的圆盘进入下一回合。';
  return shortWhy(redundant?{...action,reason:''}:action);
}
function tileFortStatusHtml(tile,fort){
  const heading=[fort.operational?'要塞防区执勤':fort.mothballed?'要塞已封存':'要塞未执勤',
    !fort.mothballed&&!fort.ready?`整备至第 ${tile.fortReadyTurn} 回合`:'',
    !fort.staffed?`缺驻军 ${tile.troops}/${fort.garrison}`:'',!fort.connected?'首都失联':''].filter(Boolean).join(' · ');
  return `<div class="tile-fort-status" role="status" aria-label="要塞状态"><b>${esc(heading)}</b><span>要塞驻军 ${fort.localDefense?'达标':'不足'} · 胸墙 ${fort.siegeReady?'可用':'未启用'} · 邻地掩护 ${fort.operational?'+'+fort.cover:'无'}</span></div>`;
}
function fortBuildText(effects){
  const staff=effects.residents<effects.garrison?`建造至少需要 ${effects.constructionWorkers} 人；驻军至少 ${effects.garrison} 人（现 ${effects.residents} 人）。`:'';
  return `${buildProductionText(effects)}；全防区维护 ${buildDelta(effects.upkeepAfter.gold-effects.upkeepBefore.gold)} 金 / ${buildDelta(effects.upkeepAfter.supply-effects.upkeepBefore.supply)} 粮每回合。${staff}本回合战争仍在整备，无胸墙；第 ${effects.readyTurn} 回合完成。`;
}
function buildDelta(value){return value>0?`+${value}`:value<0?`−${Math.abs(value)}`:'0';}
function buildProductionText(effects){
  const before=effects.productionBefore,after=effects.productionAfter;
  const changes=[['gold','金产'],['supply','粮产']].filter(([key])=>before[key]!==after[key]).map(([key,label])=>`${label} ${buildDelta(after[key]-before[key])}`);
  return changes.length?`本地${changes.join(' / ')}/回合`:'本地产出不变';
}
function buildPreviewHtml(effects){
  const before=effects.productionBefore,after=effects.productionAfter,replaced=effects.replacedBuilding,fort=effects.building.id==='fort';
  const identity=replaced?`${replaced.name} Lv ${replaced.level}`:'空地';
  return `<details class="build-preview"><summary>${replaced?'改建':'建造'}前后${fort?'与生效条件':''}</summary><p>${esc(identity)} → ${esc(effects.building.name)} Lv ${effects.building.level}；现有 ${effects.residents} 名居民不变。</p><p>本地产出 / 回合：金币 ${before.gold} → ${after.gold}；补给 ${before.supply} → ${after.supply}。<br>满产人手 ${before.need} → ${after.need} 人；满产时金币 ${before.fullGold} → ${after.fullGold}、补给 ${before.fullSupply} → ${after.fullSupply}。</p>${fort?`<p>全防区维护 / 回合：金币 ${effects.upkeepBefore.gold} → ${effects.upkeepAfter.gold}；补给 ${effects.upkeepBefore.supply} → ${effects.upkeepAfter.supply}。包含现有要塞的超额加价，不是全领地净收入。</p><p>建造至少需要 ${effects.constructionWorkers} 人；驻军至少 ${effects.garrison} 人才可组织要塞守备。本回合战争阶段仍在整备，无胸墙；第 ${effects.readyTurn} 回合完成整备，仍需足够驻军且未封存才有胸墙。邻地掩护另需连通首都。</p>`:`<p>建造至少需要 ${effects.constructionWorkers} 人。以上是本地生产，不含全领地维护与行政费用。</p>`}</details>`;
}
function eliteTransferText(transfer){
  if(!transfer)return '';
  const ranks=['R','SR','SSR'].filter(rank=>(transfer.moved?.[rank]||0)+(transfer.retained?.[rank]||0)>0);if(!ranks.length)return '';
  const list=bag=>ranks.map(rank=>`${rank} ×${bag?.[rank]||0}`).join(' · ');
  return `稀有转移：${list(transfer.moved)}；原地保留：${list(transfer.retained)}。`;
}
function buildingUpgradeText(effects){
  const {before:b,after:a,productionFalls,nextFullProductionShortage:missing}=effects;
  return `${effects.building.name} Lv ${b.level} → ${a.level}；本地实际${productionFalls?'产出下降':'产出'}：金 ${b.production.gold}→${a.production.gold} / 粮 ${b.production.supply}→${a.production.supply} 每回合；满产人手 ${b.production.need}→${a.production.need}（现 ${a.residents} 人）${missing?`；升级后缺 ${missing} 人，需调入补足`:''}`;
}
function buildingUpgradePreviewHtml(effects){
  const {before:b,after:a}=effects;
  return `<details class="build-preview building-upgrade-preview"><summary>满产与住房详情</summary><p>按当前居民与状态预览；能否购买以按钮条件为准。${a.production.cut?'失联时产出为 0，需先连通首都。':''}</p><p>人手足够且连通时 / 回合：金币 ${b.production.fullGold} → ${a.production.fullGold}；补给 ${b.production.fullSupply} → ${a.production.fullSupply}。这是满产产出，不是当前实收。</p><p>居民 ${b.residents} → ${a.residents}（不变）；住房 ${b.housing} → ${a.housing}。升级不立即增加居民；住房是自然增长与征募上限，调入军士可超过住房，军士上限仍为 100。${a.housing<a.production.need?`升级后住房少于满产所需 ${a.production.need} 人，需靠调入补足。`:''}</p><p>本地产出不含全领地维护与行政费用。</p></details>`;
}
function fortUpgradeText(effects){
  const {before,after,productionFalls,deploymentUnchanged}=effects;
  const parts=[`要塞 Lv ${before.level} → ${after.level}`];
  if(productionFalls)parts.push(`本地产出下降：金 ${before.production.gold}→${after.production.gold} / 粮 ${before.production.supply}→${after.production.supply}`);
  parts.push(deploymentUnchanged?`部署格掩护不变 ${after.deploymentCover}`:`部署格掩护 ${before.deploymentCover}→${after.deploymentCover}`);
  if(!after.fort.siegeReady)parts.push(after.fort.mothballed?'仍封存，无胸墙':!after.fort.ready?'仍整备，无胸墙':'仍缺驻军，无胸墙');
  parts.push(`本地维护 ${before.fort.upkeep.gold}金/${before.fort.upkeep.supply}粮 → ${after.fort.upkeep.gold}金/${after.fort.upkeep.supply}粮/回合`);
  return parts.join('；');
}
function fortUpgradePreviewHtml(effects){
  const {before:b,after:a,networkBefore:nb,networkAfter:na,nextStep,nextBreakpoint}=effects;
  const wall=w=>`${w.front} / ${w.side} / ${w.rear}`,upkeep=u=>`${u.gold} 金 / ${u.supply} 粮`;
  const readiness=a.fort.mothballed?'仍封存，升级不会启用':!a.fort.ready?`仍整备至第 ${a.readyTurn} 回合，本回合战争无胸墙`:!a.fort.staffed?`仍缺驻军，至少 ${a.fort.garrison} 人才有胸墙`:'胸墙保持可用';
  return `<details class="build-preview fort-upgrade-preview"><summary>升级前后 · Lv ${b.level} → ${a.level}</summary><p>按当前居民与状态预览；能否购买以按钮条件为准。</p><dl><div><dt>部署格普通掩护</dt><dd>${b.deploymentCover} → ${a.deploymentCover}${effects.deploymentUnchanged?'（不变）':''}；地图防御 ${b.mapDefense} → ${a.mapDefense}</dd></div><div><dt>胸墙正 / 侧 / 背</dt><dd>当前可用 ${wall(b.activeWall)} → ${wall(a.activeWall)}；等级标称 ${wall(b.nominalWall)} → ${wall(a.nominalWall)}</dd></div><div><dt>相邻 1 格掩护</dt><dd>当前投射 +${b.activeNeighborCover} → +${a.activeNeighborCover}；等级标称 +${b.nominalNeighborCover} → +${a.nominalNeighborCover}</dd></div><div><dt>居民 / 增长住房</dt><dd>居民 ${b.residents} → ${a.residents}（不变）；住房 ${b.housing} → ${a.housing}</dd></div><div><dt>满产人手 / 产出</dt><dd>人手 ${b.production.need} → ${a.production.need}（现 ${a.residents} 人）；本地实际金币 ${b.production.gold} → ${a.production.gold}，补给 ${b.production.supply} → ${a.production.supply} / 回合${effects.nextFullProductionShortage?`；升级后距满产缺 ${effects.nextFullProductionShortage} 人`:''}</dd></div><div><dt>本地实际维护</dt><dd>${upkeep(b.fort.upkeep)} → ${upkeep(a.fort.upkeep)} / 回合</dd></div><div><dt>全防区实际维护</dt><dd>${upkeep(nb.upkeep)} → ${upkeep(na.upkeep)} / 回合（已含超额 ${na.excess} 座加价）</dd></div></dl><p>${esc(readiness)}；升级不改变整备时间。要塞守备仍需 ${a.fort.garrison} 人，与满产人手不同。${!a.fort.connected?'仍与首都失联，无邻地掩护。':''}</p><p>邻地仅限连通的己方地块，取最强要塞、不叠加；已有更强掩护时可能没有增益。离开部署格后按新位置计算；胸墙朝向固定、两军均可占用。</p><p>住房是增长容量，不立即增加居民；军士上限仍为 100。产出按现有人手取整，失联时为 0；以上维护不是领地净收入。</p>${nextBreakpoint?`<p>Lv ${nextBreakpoint.level} 才提高等级标称胸墙（正面 ${nextBreakpoint.wallFront}）与邻地掩护（+${nextBreakpoint.neighborCover}），胸墙仍需完成整备、足够驻军且未封存；邻地掩护另需连通首都。</p>`:''}${nextStep?`<p>再升 Lv ${nextStep.level} → ${nextStep.nextLevel}：按领土规模不变估价 ${esc(costLine(nextStep.cost))}；届时至少要 ${nextStep.requiredResidents} 人，仍需足够资源与指令。</p>`:'<p>本次升至最高等级。</p>'}</details>`;
}
function fortLevelSummary(profile){
  if(!profile)return '';
  return `Lv ${profile.level}：邻地掩护 +${profile.cover}；胸墙正面 +${profile.siege.cover} / 侧面 +${Math.floor(profile.siege.cover/2)} / 背面 0；基础维护 ${profile.baseUpkeep.gold} 金币、${profile.baseUpkeep.supply} 补给 / 回合`;
}
function fortProfileHtml(fort){
  return fort.profile?`<div class="fort-level-profile"><p>本地普通军守备：${fort.localDefense?'可组织防守':'驻军条件不足'} · 胸墙：${fort.siegeReady?'可用':'未启用'}</p><p>地图防御会折算为守军部署格的普通掩护；离开部署格后按新位置计算。普通掩护不等于定向胸墙，防御增加也不一定提高掩护。</p><p>本级 ${esc(fortLevelSummary(fort.profile))}</p>${fort.nextProfile?`<p>下一级 ${esc(fortLevelSummary(fort.nextProfile))}</p>`:'<p>已达最高等级。</p>'}<small>基础维护不含防区超额加价；本地实际维护见上方。本地守备至少需 ${fort.garrison} 人；胸墙还需完成整备且未封存，失联不会取消已备好的胸墙。邻地掩护另需连通首都。封存免维护，保留驻军守备但无胸墙。</small></div>`:'';
}
function forcePreviewHtml(preview){const forces=preview?.forces;if(!forces)return '';return `<div class="force-preview"><b>战术编队估算</b><div>${[['我军',forces.attacker],['守军',forces.defender]].map(([name,force])=>`<p><strong>${name}</strong> ${force.squads} 分队 · ${force.heroes} 同伴 · 军训 Lv ${force.trainingLevel}${force.units?.some(unit=>unit.kind==='sazai'&&['R','SR','SSR'].includes(unit.rank))?`<br>实际稀有出场：${['R','SR','SSR'].map(rank=>[rank,force.units.filter(unit=>unit.kind==='sazai'&&unit.rank===rank).length]).filter(([,n])=>n).map(([rank,n])=>`${rank} ×${n}`).join(' · ')}`:''}<br>生命 ${format(force.hp)} · 正面输出 ${format(force.pressure)} · 综合 ${format(force.rating)}</p>`).join('')}</div><small>估算，不含站位、技能、治疗与目标争夺，不是胜率。</small>${preview.siege?`<p class="siege-preview">${preview.siege.level} 级要塞胸墙：正面 +${preview.siege.cover}、侧面 +${Math.floor(preview.siege.cover/2)}、背面 0。朝向固定，两军均可占用，穿云远射无视胸墙；此站位影响不计入上方估算。</p>`:''}</div>`;}
function militaryModeLabel(site){return site.reserve?'后备':site.ready?'执勤':'整备中';}
function militaryRanksText(ranks){return ['SSR','SR','R'].filter(rank=>ranks?.[rank]>0).map(rank=>`${rank} ×${format(ranks[rank])}`).join(' · ')||'无';}
function militarySiteHtml(site,army){
  if(!site)return '';
  const active={R:0,SR:0,SSR:0};for(const unit of army?.leaders||[])if(unit.kind==='sazai'&&unit.rank in active)active[unit.rank]++;
  return `<section class="military-service" aria-label="本地军队编制"><div class="military-service-heading"><h3>军队：${militaryModeLabel(site)}</h3><b>本地军费 ${format(site.upkeep.gold)} 金 / 回合</b></div><p>普通军队：当前 <b>Lv ${site.effectiveLevel}</b> · 已学 Lv ${site.learnedLevel}。居民继续生产，英雄照常行动。</p><p>当前驻地编队稀有：${esc(militaryRanksText(active))}。</p>${site.reason?`<p class="military-readiness">${esc(site.reason)}</p>`:''}<details><summary>查看稀有编制与库存</summary><p>编制：${esc(militaryRanksText(site.prepared))}。<br>已整备稀有：${esc(militaryRanksText(site.available))}。<br>库存总量：${esc(militaryRanksText(site.stock))}。<br>编制外库存：${esc(militaryRanksText(site.storedReserve))}，不收军费。</p><p>完成整备后，同伴出征或要塞守备时可带出已学军训与已整备稀有队；没有同伴且没有要塞的地块不会单独触发战棋守备。</p></details></section>`;
}
function militaryQuoteHtml(quote){
  const next=quote.after;
  return `<section class="military-quote" aria-label="编制调整报价"><h4>${quote.reserve?'转为后备':'重新整备执勤'}</h4><p>${quote.reserve?'普通军队改按 Lv 1；稀有队停止参战。居民生产、英雄、已学等级与稀有库存保留。':`支付一次整备费，至第 ${next.readyTurn} 回合恢复已学军训与稀有队；在此之前普通军队按 Lv 1、稀有队不参战。`}</p><p class="military-price"><b>${quote.reserve?'本次费用':'一次整备费'}：${esc(costLine(quote.cost))}</b><br>全军实付军费：${format(quote.budgetBefore.gold)} → ${format(quote.budgetAfter.gold)} 金币 / 回合</p>${quote.reserve?'':`<p class="military-readiness">整备期间仍支付军费；一次整备费不抵扣后续维护。</p>`}<button class="small-button" type="button" id="confirm-military-service" aria-describedby="military-service-status" ${quote.enabled?'':'disabled'}>${quote.reserve?'确认转为后备':'确认付费整备'}</button><p class="form-hint" id="military-service-status" role="status">${esc(quote.reason||'只调整本地编制；完成后可立即撤销这一步。')}</p></section>`;
}
function militaryBudgetHtml(budget){
  if(!budget)return '';
  return `<p class="military-price">军费毛额 <b>${format(budget.nominalGold)}</b> - 国家补贴 <b>${format(budget.allowanceUsed)}</b> = 实付 <b>${format(budget.gold)}</b> 金币 / 回合</p><p class="form-hint">国家补贴额度 ${format(budget.allowance)}，本回合使用 ${format(budget.allowanceUsed)}。军费不加收补给。</p><details class="military-sites"><summary>逐地查看：执勤及整备 ${budget.active} · 后备 ${budget.reserve}${budget.preparing?` · 其中整备 ${budget.preparing}`:''}</summary><p>以下为各地军费毛额；国家补贴统一抵扣，不能将各地数字视作全军实付。</p><ul>${(budget.sites||[]).map(site=>`<li><b>${esc(tileName(state.tiles[site.key]))} ${esc(site.key)} · ${militaryModeLabel(site)}</b><span>${format(site.residents)} 人 · 当前 Lv ${site.effectiveLevel} / 已学 Lv ${site.learnedLevel} · ${format(site.upkeep.gold)} 金 / 回合</span><span>执勤稀有编制 ${esc(militaryRanksText(site.available))}；库存 ${esc(militaryRanksText(site.stock))}</span>${!site.reserve&&!site.ready?`<span>第 ${site.readyTurn} 回合完成整备，期间仍付军费。</span>`:''}</li>`).join('')}</ul></details>`;
}
function militaryAffectedHtml(affected){
  return `<ul class="military-site-list">${affected.map(site=>`<li><b>${esc(tileName(state.tiles[site.key]))} ${esc(site.key)}</b><span>${format(site.before.residents)} 人保留 · 普通军 Lv ${site.before.effectiveLevel} → Lv ${site.after.effectiveLevel}</span><span>停止稀有编制：${esc(militaryRanksText(site.before.prepared))}；全部库存保留。</span>${!site.before.ready?`<span>原为整备中，第 ${site.before.readyTurn} 回合的整备安排取消。</span>`:''}</li>`).join('')}</ul>`;
}
function showMilitaryEmergency(note){
  if(!note?.militarySites?.length)return;
  openReading('军费不足，已自动转为后备',`第 ${note.turn} 回合的财政记录`,`<div class="comic-sheet"><div class="comic-banner warn"><img src="assets/sazai.webp" alt="" /><div><b>第 ${note.turn} 回合军费紧缩</b><p>因军费不足，部分驻地当时已自动转入省钱的后备状态。</p></div></div><div class="military-bulk"><p class="military-readiness">${esc(note.text)}</p><p>本次实际调整 ${note.militarySites.length} 处驻地。以下为当时完整清单，不表示这些驻地现在仍为后备。</p><ul class="military-site-list">${note.militarySites.map(key=>`<li><b>${esc(key)}</b>${state.tiles[key]?.ownerId===state.playerId?`<button class="small-button secondary" data-military-site="${esc(key)}">查看当前驻地</button>`:''}</li>`).join('')}</ul><p class="form-hint">防守已减弱；居民、英雄、已学训练与稀有库存保留。按当前情况逐地查看费用后，可重新整备。</p><button class="small-button secondary" id="military-emergency-back">返回内政</button></div></div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-war');
    $('modal-body').querySelectorAll('[data-military-site]').forEach(button=>{const key=button.dataset.militarySite;button.onclick=()=>{if(state.tiles[key]?.ownerId===state.playerId)showGarrison(key);};});
    $('military-emergency-back').onclick=()=>showManagement();
  });
}
function showMilitaryStandDown(message=''){
  const shownState=state,shownRevision=state.revision,plan=getMilitaryStandDownPlan(state),income=standDownNetIncomePreview(readStandDownNetGold(getStats,state),plan),residents=plan.affected.reduce((sum,site)=>sum+site.before.residents,0),rare={R:0,SR:0,SSR:0};
  let acting=false;const refresh=()=>{if(!acting&&$('modal').open&&modalRefresh===refresh)showMilitaryStandDown('局势或清单已变化，请重新查看后再确认。');};
  for(const site of plan.affected)for(const rank of Object.keys(rare))rare[rank]+=site.before.prepared[rank];
  openReading('后方转为后备','先查看清单，再确认',`<div class="comic-sheet"><div class="comic-banner"><img src="assets/sazai.webp" alt="" /><div><b>后方驻军省钱休整</b><p>保留首都、同伴与前线要塞，只让安全的后方驻地暂停军训开销。</p></div></div><div class="military-bulk"><p class="military-price"><b>${plan.affected.length} 处驻地 · ${format(residents)} 名居民保留</b><br>转后备的稀有编制：${esc(militaryRanksText(rare))}<br>${income.budgetValid?`全军实付军费 ${format(plan.budgetBefore.gold)} → ${format(plan.budgetAfter.gold)} 金币 / 回合，节省 ${format(plan.saving)} 金币 / 回合。`:'全军实付军费暂时无法确认。'}</p>${standDownNetIncomeHtml(income,{preview:true})}<p>${esc(plan.description)}</p>${plan.affected.length?`<details class="military-sites" ${plan.affected.length<=4?'open':''}><summary>查看将调整的 ${plan.affected.length} 地与稀有队伍</summary>${militaryAffectedHtml(plan.affected)}</details>`:''}${plan.protectedSites.length?`<details class="military-sites"><summary>本次保留 ${plan.protectedSites.length} 处重要驻地及原因</summary><ul>${plan.protectedSites.map(site=>`<li><b>${esc(site.key)}</b><span>${esc(site.reasons.join('；'))}</span></li>`).join('')}</ul></details>`:''}<p class="military-readiness">${esc(costLine(plan.cost))}。转为后备后失去当前军训与稀有队战力；恢复执勤需逐地支付整备费并等待。仅按当前可见敌情保护，不保证局势变化后的安全。</p><p id="military-bulk-status" class="military-result" role="status" tabindex="-1">${esc(message||plan.reason||'确认只执行上方清单，保留人口、角色、已学等级与稀有库存。')}</p><div class="form-actions"><button class="small-button secondary" id="cancel-military-bulk">返回内政</button><button class="small-button" id="confirm-military-bulk" aria-describedby="military-bulk-status" ${plan.enabled?'':'disabled'}>确认 ${plan.affected.length} 地转为后备</button></div></div></div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-war');
    const view=$('military-bulk-status'),ownsView=()=>$('modal').open&&modalRefresh===refresh&&$('modal-body').contains(view);
    bindComicAction($('cancel-military-bulk'),()=>{if(state===shownState&&state.revision===shownRevision&&ownsView())showManagement();});
    bindComicAction($('confirm-military-bulk'),()=>{
      if(!ownsView())return;
      const current=getMilitaryStandDownPlan(state),beforeIncome=readStandDownNetGold(getStats,state);
      if(state!==shownState||state.revision!==shownRevision||JSON.stringify(current)!==JSON.stringify(plan)||income.available&&beforeIncome!==income.before){showMilitaryStandDown('局势或清单已变化，请重新查看后再确认。');return;}
      if(!current.enabled)return;
      let committed=null,duplicate=false,result;acting=true;
      const incomplete=()=>toast(committed?'调整已执行，但本次收支回执未显示；请查看当前局势，不要重复执行。':'请查看当前局势，本次收支回执未显示；不要重复执行。',true);
      try{
        result=runAction(plan.action,{onCommitted:actual=>{
          if(committed){duplicate=true;return;}
          committed={result:actual,state:actual.state,revision:actual.state.revision,battle:actual.state.battle,income:standDownNetIncomeReceipt(null,null)};
          // Measurement is read-only and must never interrupt the original save/story pipeline.
          try{committed.income=standDownNetIncomeReceipt(beforeIncome,readStandDownNetGold(getStats,actual.state));}catch{}
        }});
      }catch{incomplete();return;}finally{acting=false;}
      if(!result.ok){if(state===shownState&&state.revision===shownRevision&&ownsView())showMilitaryStandDown(result.error);return;}
      if(!committed||duplicate||committed.result!==result||state!==committed.state||result.state!==committed.state||state.revision!==committed.revision||state.battle!==committed.battle||!ownsView()){incomplete();return;}
      try{showMilitaryStandDownResult(result.detail,committed.income);}catch{incomplete();}
    });
    if(message)$('military-bulk-status').focus({preventScroll:true});
  },refresh);
}
function showMilitaryStandDownResult(plan,income){
  const expectedRevision=state.revision;
  openReading('已转为后备','本次编制调整',`<div class="comic-sheet"><div class="comic-banner"><img src="assets/sazai.webp" alt="" /><div><b>后方驻地已转为后备</b><p>如果改变主意，可以立刻撤销这一步。</p></div></div><div class="military-bulk"><p class="military-result" id="military-bulk-result" role="status" tabindex="-1">已将 ${plan.affected.length} 处驻地转为后备。全军实付军费 ${format(plan.budgetBefore.gold)} → ${format(plan.budgetAfter.gold)} 金币 / 回合。居民与库存保留，普通军按 Lv 1，稀有队不参战，防守会减弱。</p>${standDownNetIncomeHtml(income)}<p class="military-readiness">恢复执勤需逐地支付整备费并等待。不保证局势变化后的安全。</p><details class="military-sites"><summary>查看实际调整的 ${plan.affected.length} 地</summary>${militaryAffectedHtml(plan.affected)}</details><p class="form-hint">现在可撤销这一批调整；继续其他操作后可能无法撤销。</p><div class="form-actions"><button class="small-button secondary" id="military-result-back">返回内政</button><button class="small-button" id="undo-military-bulk">撤销本次调整</button></div></div></div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-war');
    $('military-result-back').onclick=()=>showManagement();
    bindComicAction($('undo-military-bulk'),()=>{const result=runAction({type:'undo',expectedRevision});if(result.ok){showMilitaryStandDown('已撤销整批调整；下方为当前清单，尚未再次执行。');}});
    $('military-bulk-result').focus({preventScroll:true});
  },()=>showMilitaryStandDown('局势已变化，请重新查看当前清单。'));
}
function trainingEffectsText(effects){return `统军 +${format(effects.attack)} · 守备 +${format(effects.defense)} · 每分队生命 +${format(effects.hpBonus)} · 每击训练加成 +${format(effects.powerBonus)}`;}
function visibleFactions(world){
  const known=new Set(Object.values(world.tiles).filter(t=>t.discovered).map(t=>t.ownerId));
  return Object.values(world.factions).filter(f=>f.alive&&(f.isPlayer||known.has(f.id))).sort((a,b)=>Number(Boolean(a.isPlayer))-Number(Boolean(b.isPlayer)));
}
function frontierEntries(world){
  const list=[];
  for(const tile of Object.values(world.tiles)){
    if(tile.ownerId!==world.playerId||!tile.discovered)continue;
    let fog=0,land=0,war=0;const countries=new Set();
    for(const [dq,dr] of DIRECTIONS){
      const next=world.tiles[`${tile.q+dq},${tile.r+dr}`];
      if(!next){if(typeof inWorld!=='function'||inWorld(world,tile.q+dq,tile.r+dr))fog++;continue;}
      if(!next.discovered){fog++;continue;}
      if(next.ownerId===world.playerId)continue;
      if(!next.ownerId){if(world.terrainTypes?.[next.terrainId]?.passable)land++;continue;}
      const faction=world.factions[next.ownerId];
      if(!faction?.alive)continue;
      countries.add(faction.id);
      if(world.relations?.[[world.playerId,faction.id].sort().join('|')]?.status==='war')war++;
    }
    if(fog||land||countries.size)list.push({key:tile.key,q:tile.q,r:tile.r,fog,land,war,capital:tile.key===world.factions[world.playerId]?.capitalKey,countries:[...countries],priority:war?0:countries.size?1:land?2:3});
  }
  return list.sort((a,b)=>a.priority-b.priority||Number(Boolean(b.war&&b.capital))-Number(Boolean(a.war&&a.capital))||a.q-b.q||a.r-b.r);
}
function filterFrontiers(entries,filter){
  return entries.filter(entry=>filter==='all'||filter==='war'&&entry.war>0||filter==='country'&&entry.countries.length>0||filter==='land'&&entry.land>0||filter==='fog'&&entry.fog>0);
}
// End long-campaign view helpers.
function renderGovernanceEntry(stats){
  const mode=state.management?.mode||'off',enabled=mode!=='off',shortage=stats.income.supply<0&&stats.supply<=Math.max(0,-stats.income.supply*2);
  const tab=$('nav-admin');if(tab){tab.classList.toggle('alert',shortage);tab.classList.toggle('auto',enabled);tab.title=shortage?'粮快不够了：内政里可以采购或自救':enabled?`回合末托管中：${MANAGEMENT_MODES[mode]||mode}`:'内政 (G)';}
  const admin=stats.administration;
  if(admin)$('gold-delta').title=`金币毛收入 ${format(admin.rawGold)} - 基础维持费 ${format(admin.baseGold)} - 行政支出 ${format(admin.gold)} - 要塞维护 ${format(stats.fortNetwork?.upkeep.gold||0)} - 军费 ${format(stats.maintenance.military.gold)} - ${(typeof CIVIC_COPY!=='undefined'?CIVIC_COPY.civic:'')} ${format(stats.maintenance.civic?.upkeep||0)} = 净收入 ${format(stats.income.gold)}；行政效率 ${(admin.efficiency*100).toFixed(1)}%。内政页可查看详情。`;
}
function jumpToFrontier(key=null,filter='all'){
  if(state.battle||guideNow())return;
  const entries=filterFrontiers(frontierEntries(state),filter);
  if(!entries.length){toast('目前没有可查看的边境。');return;}
  const here=entries.findIndex(item=>item.key===selectedKey);
  // The tile just visited may have left the list (claimed land, a lost neighbour): carry on from where it stood, not from the top.
  const cursor=typeof frontierCursor!=='undefined'?frontierCursor:null,after=here<0&&flowerOpen&&cursor?.key===selectedKey&&cursor.filter===filter?cursor.index%entries.length:(here+1)%entries.length;
  const entry=key?entries.find(item=>item.key===key):!flowerOpen?entries[0]:entries[after];
  if(!entry){toast('这处边境已经发生变化，请重新选择。');return;}
  if(typeof frontierCursor!=='undefined')frontierCursor={key:entry.key,filter,index:entries.indexOf(entry)};
  focusManagedTile(entry.key);
}
function previewFrontlineMove(fromKey,toKey){
  if(state.battle||state.turnContinuation||guideNow())return;
  const quote=getActions(state,toKey,fromKey).find(action=>action.type==='move');
  if(!quote?.enabled){toast(quote?.reason||'转移条件已变化，请重新查看边境。',true);renderFlower();return;}
  // Open the ordinary destination/force picker. Only its existing confirmation executes.
  beginDispatch(fromKey);selectTile(toKey);worldMap.panIntoView(toKey,{left:120,right:120,top:180,bottom:120});
}
function focusManagedTile(key){
  if(!state.tiles[key]?.discovered)return;
  if($('modal').open)closeModal();
  dispatchFrom=null;attackFrom=null;attackTroops=null;moveTroops=null;leftBehind=new Set();if(typeof armyKey!=='undefined'){armyKey=null;armyTarget=null;worldMap.setArmy?.(null);worldMap.setRoute?.(null);}flowerOpen=false;
  worldMap.setHints(mapHints());worldMap.centerOn(key);selectTile(key);
  $('world-map').focus({preventScroll:true});
}
function showRaidPreview(fromKey,toKey){
  const source=state.tiles[fromKey],target=state.tiles[toKey];
  if(!source||!target){toast('出发地或目标已经变化，请重新选择。',true);return;}
  // The modal owns only a temporary troop amount. Closing it never changes the map's army/left-behind selection.
  const girls=source.field.filter(id=>!leftBehind.has(id)),first=previewRaid(state,fromKey,toKey,attackTroops??undefined,girls);
  const maxTroops=()=>Math.max(0,(state.tiles[fromKey]?.troops||0)-1),minTroops=girls.length?0:1;
  const safeTroops=()=>{const cur=state.tiles[fromKey],need=typeof getTileStats==='function'&&cur?getTileStats(state,fromKey)?.need||1:1;return Math.max(minTroops,Math.min(maxTroops(),(cur?.troops||0)-Math.max(1,need)));};
  const initialTroops=attackTroops??first.attackingTroops??maxTroops();
  const artOf=t=>{const id=t?.building;const k=id==='garden'?'farm':id&&['camp','capital','farm','fort','home','lumber','mine','port','quarry','city','shipyard','airfield','administrativeHall'].includes(id)?id:t?.isCapital?'capital':'home';return `assets/buildings/${k}.webp`;};
  const crewFaces=girls.length?girls.map(id=>{const h=state.characters[id],u=h&&typeof portraitUrl==='function'?portraitUrl(h,'angry')||portraitUrl(h,'smile'):'';return `<span class="raid-face" title="${esc(h?.name||id)}">${u?`<img src="${esc(u)}" alt="${esc(h?.name||id)}" />`:`<b>${esc(h?.name||id)}</b>`}</span>`;}).join(''):'<span class="raid-face bag"><img src="assets/sazai.webp" alt="军士" /></span>';
  let confirmed=false;
  const draft=()=>{const field=$('raid-troops'),troops=field.valueAsNumber;return field.value.trim()!==''&&Number.isInteger(troops)&&troops>=minTroops&&troops<=maxTroops()?{type:'raid',fromKey,toKey,troops,girls:[...girls]}:null;};
  const refresh=()=>{
    if(!$('raid-preview'))return;
    const action=draft(),curTarget=state.tiles[toKey],preview=action?previewRaid(state,fromKey,toKey,action.troops,action.girls):null,building=(typeof BUILDINGS!=='undefined'?BUILDINGS:{})[preview?.building||curTarget?.building];
    const reason=!action?'出征人数无效，出发地至少需留下 1 名居民。':preview?.reason||preview?.error||'';
    const blocked=confirmed||!preview?.canAttack||Boolean(state.battle)||Boolean(state.turnContinuation);
    $('raid-troops').max=String(maxTroops());
    $('raid-troops').setAttribute('aria-invalid',String(!action));
    const foe=state.factions[curTarget?.ownerId];
    morph($('raid-preview'),`<div class="raid-target" style="--c:${esc(foe?.color||'#ef6758')}"><img class="building-thumb" src="${artOf(curTarget)}" alt="" /><div><b>目标：${esc(foe?.name||'原属国家')} · ${esc(toKey)}</b><p>将摧毁 <strong>${esc(building?.name||'已无建筑')} ${format(preview?.level||curTarget?.buildingLevel||0)} 级</strong>；破坏后立即撤回，不会占领领土。</p></div></div>${preview?.ok?`<div class="raid-quote"><div class="raid-loot-grid"><div class="raid-loot"><img src="assets/icons/gold.webp" alt="" /><div><small>预计带回金币</small><b>+${format(preview.loot?.gold||0)}</b></div></div><div class="raid-loot"><img src="assets/icons/food.webp" alt="" /><div><small>预计带回补给</small><b>+${format(preview.loot?.supply||0)}</b></div></div></div><p class="raid-loot-summary"><b>成功回收 ${format(preview.loot?.gold||0)} 金币 · ${format(preview.loot?.supply||0)} 补给</b></p><p>行动费用 ${preview.cost?.ap||0} 指令 · ${format(preview.cost?.gold||0)} 金币 · ${format(preview.cost?.supply||0)} 补给；无论胜败都会支付。</p><p>${preview.occupy?'此地没有战棋守备，确认后直接摧毁建筑并撤回。':'此地有守备，确认后进入战棋；胜利才会摧毁建筑并回收资源，可能有伤亡或被俘。'}</p><p>出征 ${format(action.troops)} 名军士，出发地留下 ${format((state.tiles[fromKey]?.troops||0)-action.troops)} 人。</p>${forcePreviewHtml(preview)}</div>`:''}<p class="form-hint">回收数量只看目标建筑与等级；应急田圃无可回收物资，首都也不会因此迁都。</p>`);
    $('raid-status').textContent=reason||'已列明本次目标、成本与回收；确认前不会执行。';
    $('confirm-raid').disabled=blocked;$('confirm-raid').textContent=preview?.occupy?'确认劫掠并撤回':'确认进入劫掠战';
  };
  openModal('劫掠预览','摧毁建筑后撤回',`<div class="raid-preview-screen comic-sheet"><div class="raid-stage-card"><div class="raid-side"><small>出发 · ${esc(tileName(source))} ${esc(fromKey)}</small><div class="raid-faces">${crewFaces}</div><b>${girls.length?girls.map(id=>esc(state.characters[id]?.name||id)).join('、'):'罪袋突击队'}</b></div><div class="raid-vs"><span>奇袭拆毁</span><small>抢完即撤</small></div><div class="raid-side foe"><small>目标 · ${esc(toKey)}</small><img class="building-thumb" src="${artOf(target)}" alt="" /><b>${esc((typeof BUILDINGS!=='undefined'?BUILDINGS[target.building]?.name:'')||tileName(target))}</b></div></div><div class="raid-controls-card"><div class="field"><label for="raid-troops">出征军士（原地至少留 1 人）</label><div class="num-stepper"><button type="button" class="ap-step" data-raid-step="-1" aria-label="少带 1 人">−</button><input id="raid-troops" type="number" min="${minTroops}" max="${maxTroops()}" step="1" inputmode="numeric" value="${initialTroops}" aria-describedby="raid-status" /><button type="button" class="ap-step" data-raid-step="1" aria-label="多带 1 人">+</button><div class="ap-presets"><button type="button" data-raid-preset="safe">保产</button><button type="button" data-raid-preset="max">全军</button></div></div></div><p class="form-hint">随行同伴：${girls.length?girls.map(id=>esc(state.characters[id]?.name||id)).join('、'):'无'}。未选中的同伴留守原地；取消不会改动地图编队。</p></div><div id="raid-preview"></div><p class="status-box" id="raid-status" role="status"></p><div class="form-actions"><button class="small-button secondary" id="cancel-raid" type="button">取消，返回地图</button><button class="small-button danger" id="confirm-raid" type="button">确认劫掠</button></div></div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-war','raid-screen');$('raid-troops').oninput=refresh;$('cancel-raid').onclick=closeModal;
    $('modal-body')?.querySelectorAll?.('[data-raid-step]')?.forEach?.(b=>b.onclick=()=>{const cur=Number($('raid-troops').value)||0;$('raid-troops').value=String(Math.max(minTroops,Math.min(maxTroops(),cur+Number(b.dataset.raidStep))));refresh();});
    $('modal-body')?.querySelectorAll?.('[data-raid-preset]')?.forEach?.(b=>b.onclick=()=>{$('raid-troops').value=String(b.dataset.raidPreset==='safe'?safeTroops():maxTroops());refresh();});
    $('confirm-raid').onclick=()=>{if(confirmed)return;const action=draft();if(!action||!previewRaid(state,fromKey,toKey,action.troops,action.girls).canAttack){refresh();return;}confirmed=true;$('confirm-raid').disabled=true;const result=runAction(action);if(!result.ok){confirmed=false;refresh();return;}if($('modal').open)closeModal();};
    refresh();
  },refresh);
}

/** 会师: every army sets out for one tile. A strip of days shows who gets there when; nothing moves until the burst. */
function showMusterPreview(key,options={}){
  const target=state.tiles[key];if(!target||target.ownerId!==state.playerId)return;
  let mode=options.troops||'safe',spare=Boolean(options.spare);
  const lead=typeof currentHero==='function'?currentHero():null,face=lead&&typeof portraitUrl==='function'?portraitUrl(lead,'happy')||portraitUrl(lead,'smile'):'assets/sazai.webp';
  const chip=plan=>{
    const hero=state.characters[plan.girls[0]],from=state.tiles[plan.fromKey];
    return `<li class="mu-army ${plan.girls.length?'':'bags'}"><i class="mu-flag">${hero?`<img src="${esc(portraitUrl(hero,'smile')||'')}" alt="" />`:'<img class="bag" src="assets/sazai.webp" alt="" />'}</i><b>${hero?`${esc(hero.name)}${plan.girls.length>1?`<em>等 ${plan.girls.length} 位</em>`:''}`:'富余罪袋'}</b><small>${esc(tileName(from))} · ${plan.troops?`带 ${plan.troops} 人`:'不带兵'}</small></li>`;
  };
  const sheet=()=>{
    const plan=getMusterPlan(state,key,{troops:mode,spare}),all=[...plan.armies,...plan.spareSources];
    const days=[...new Set(all.map(item=>item.arrivesTurn))].sort((a,b)=>a-b);
    const lanes=days.map(turn=>`<section class="mu-lane ${turn===state.turn?'now':''}"><h4>${turn===state.turn?'今天就到':`第 ${turn} 回合`}${turn===state.turn?'':`<small>${turn-state.turn} 回合后</small>`}</h4><ul>${all.filter(item=>item.arrivesTurn===turn).map(chip).join('')}</ul></section>`).join('');
    const total=plan.enabled?`${plan.armies.length} 支编队 · ${plan.girls} 位同伴 · ${plan.troops} 名罪袋${plan.spareSources.length?`（含 ${plan.spareSources.length} 处闲人）`:''} · 今天花 ${plan.cost.supply} 补给 · ${plan.lastTurn===state.turn?'今天到齐':`第 ${plan.lastTurn} 回合到齐`}`:'';
    const skipped=plan.skipped.length?`<p class="mu-skip">来不了：${plan.skipped.map(item=>`${esc(state.characters[item.girls[0]]?.name||tileName(state.tiles[item.fromKey]))}（${esc(item.reason)}）`).join('；')}</p>`:'';
    return {plan,html:`<div class="muster" id="muster-view">
      <div class="mu-call"><img class="mu-face" src="${esc(face)}" alt="" /><div class="mu-say"><h3>各路人马，到<b>${esc(tileName(target))}</b>集合！</h3><p>远的分几回合走，每回合开始自动前进，不用再一队一队点。路上花补给，不花指令。</p></div></div>
      <div class="mu-opts" role="group" aria-label="会师方式"><button class="mu-opt ${mode==='safe'?'on':''}" data-muster-troops="safe" aria-pressed="${mode==='safe'}"><b>带上兵</b><small>各地留够种地和守要塞的人</small></button><button class="mu-opt ${mode==='none'?'on':''}" data-muster-troops="none" aria-pressed="${mode==='none'}"><b>只来人</b><small>同伴轻装赶路，罪袋不动</small></button><button class="mu-opt ${spare?'on':''}" data-muster-spare aria-pressed="${spare}" ${mode==='none'?'disabled':''}><b>闲人也来</b><small>没有同伴的地块也派富余罪袋</small></button></div>
      ${typeof lessonNote==='function'?lessonNote('adv_muster'):''}${plan.enabled?`<div class="mu-strip">${lanes}</div><p class="mu-total">${total}</p>${skipped}`:`<p class="mu-none">${esc(plan.reason)}</p>${skipped}`}
      <div class="mu-go"><button class="cs-burst" id="muster-go" ${plan.enabled?'':'disabled'}><span>会师！</span></button><small>下令后各队立刻走今天的路。之后想改主意，点任何一支编队都能取消或另派。</small></div>
    </div>`};
  };
  let shown=sheet();
  const bind=()=>{
    $('modal')?.classList?.add?.('scene','bg-war','muster-screen');
    document.querySelectorAll('[data-muster-troops]').forEach(b=>b.onclick=()=>{mode=b.dataset.musterTroops;if(mode==='none')spare=false;redraw();});
    document.querySelectorAll('[data-muster-spare]').forEach(b=>b.onclick=()=>{spare=!spare;redraw();});
    bindComicAction($('muster-go'),()=>{
      const current=getMusterPlan(state,key,{troops:mode,spare});
      if(!current.enabled){toast(current.reason,true);redraw();return;}
      const result=runAction(current.action);if(!result.ok)return result;
      const d=result.detail;closeModal();
      toast(`会师令已下：${d.parties.length} 路人马动身${d.arrived?`，${d.arrived} 路已经到了`:''}，${d.lastTurn===state.turn?'今天到齐':`第 ${d.lastTurn} 回合到齐`}。`);
      if(typeof worldMap!=='undefined')worldMap.centerOn?.(key);
      return result;
    });
  };
  const redraw=()=>{shown=sheet();morph($('modal-body'),shown.html);bind();};
  openModal('会师',`→ ${tileName(target)} ${key}`,shown.html,bind,()=>{if($('muster-view'))redraw();});
}
function showRallyPreview(key,initialAmount,staffingReturn=null){
  // Advice supplies an explicit positive deficit. Ordinary entry retains its old default.
  if(initialAmount!==undefined&&(!Number.isInteger(initialAmount)||initialAmount<1||initialAmount>100))return;
  // What the place can still feed (补给上限), from the same quote the order will use.
  const rallyRoom=()=>{const all=getRallyPlan(state,key);return Number.isInteger(all?.requested)?all.requested:100-(state.tiles[key]?.troops||0);};
  const amountOnOpen=initialAmount===undefined?Math.max(1,rallyRoom()):initialAmount;
  const rallyTicket={},resume=staffingReturn&&Number.isSafeInteger(staffingReturn.page)&&staffingReturn.page>=0?{page:staffingReturn.page}:null;
  const returnState=state,returnRevision=state.revision;
  let confirmed=false,shown=null,shownState=null,amountNode=null,active=true,checking=false;
  const owns=()=>active&&$('modal').open&&modalRefresh===refresh&&!$('close-modal').hidden&&$('rally-amount')===amountNode&&amountNode?.rallyTicket===rallyTicket&&$('modal-body').contains(amountNode);
  const live=()=>owns()&&state===returnState&&state.revision===returnRevision;
  const returnToStaffing=(world,revision)=>{
    if(!resume||!owns()||state!==world||state.revision!==revision||state.battle||state.turnContinuation)return;
    active=false;showManagement({staffingKey:key,staffingPage:resume.page});
  };
  const destTile=state.tiles[key],destArtKey=destTile?.building==='garden'?'farm':destTile?.building&&['camp','capital','farm','fort','home','lumber','mine','port','quarry'].includes(destTile.building)?destTile.building:destTile?.isCapital?'capital':'home';
  const refresh=()=>{
    if(resume&&(confirmed||!live()))return;
    if(!$('rally-preview'))return;
    const value=$('rally-amount').value,amount=value.trim()===''?NaN:Number(value),scope=$('rally-include-protected').checked?'all-forces':'reserves';shown=getRallyPlan(state,key,amount,{scope});shownState=state;
    const sources=shown.sources||[],protectedSources=shown.protectedSources||[],overridden=shown.overriddenSources||[],blocked=shown.blockedSources||[];
    morph($('rally-preview'),`<div class="rally-summary-card"><img src="assets/sazai.webp" alt="" /><div><p><b>集结 ${format(shown.troops)} 名普通军士，来自 ${sources.length} 个地块</b></p><p>本地 ${state.tiles[key]?.troops||0} → ${shown.after??state.tiles[key]?.troops??0} 人 · ${esc(costLine(shown.cost))}</p>${shown.shortfall?`<p>比所填上限少 ${shown.shortfall} 人；不会为凑人数自动动用受保护军队。</p>`:''}</div></div><p class="form-hint">默认自动保护首都、同伴驻地、主力、边防和要塞，并保留各地生产人手；调来的部队本回合算已行军。来源保留的人手未出发。</p>${overridden.length?`<div class="recovery-warning"><b>将从重要军队抽调军士</b>${overridden.map(source=>`<p>${esc(source.fromKey)}：${source.troopsBefore} → ${source.remain} 人，调出 ${source.troops}。${esc((source.protectionReasons||[]).join('、'))}</p>`).join('')}</div>`:''}${protectedSources.length?`<details class="rally-protected"><summary>本次保留 ${protectedSources.length} 支重要军队</summary><ul>${protectedSources.map(source=>`<li>${esc(source.fromKey)}：保留 ${source.troopsBefore??source.before??source.remain} 人 · ${esc(source.reason||(source.protectionReasons||[]).join('、'))}</li>`).join('')}</ul></details>`:''}${blocked.length?`<details class="military-sites" ${sources.length?'':'open'}><summary>因编制限制未调动 ${blocked.length} 处驻地</summary><ul>${blocked.map(source=>`<li><b>${esc(source.fromKey)} · ${source.troopsBefore} 人保留</b><span>${esc(source.reason)}</span></li>`).join('')}</ul></details>`:''}${sources.length?`<details class="rally-sources"><summary>查看每个来源与留守人数</summary><ul>${sources.map(source=>`<li>${esc(tileName(state.tiles[source.fromKey]))} ${esc(source.fromKey)}：${source.troopsBefore??source.troops+source.remain} → ${source.remain} 人（调出 ${source.troops}，留 ${source.remain}）${source.overridden?` · 重要军队：${esc((source.protectionReasons||[]).join('、'))}`:''}</li>`).join('')}</ul></details>`:''}`);
    $('rally-status').textContent=shown.reason||'确认后按上述来源调动，取消不会花费资源。';$('confirm-rally').disabled=confirmed||!shown.enabled;$('confirm-rally').textContent=overridden.length?'确认从含重要军队的来源集结':'确认集结';
  };
  openModal('就近集结',`目的地 ${key}`,`<div class="reading"><div class="comic-sheet"><div class="comic-banner"><img class="building-thumb" src="assets/buildings/${destArtKey}.webp" alt="" /><div><b>汇集附近空闲罪袋 → ${esc(tileName(destTile))} ${esc(key)}</b><p>先看能调来多少人、各地留守多少人，确认后才执行。</p></div></div><div class="field"><label for="rally-amount">最多调入人数</label><div class="num-stepper"><input id="rally-amount" type="number" min="1" max="100" step="1" value="${amountOnOpen}" /><div class="ap-presets"><button type="button" data-rally-preset="5">5 人</button><button type="button" data-rally-preset="15">15 人</button><button type="button" data-rally-preset="max">满编</button></div></div></div><label class="rally-override"><input id="rally-include-protected" type="checkbox" />允许从首都、主力及边防等重要军队抽调（高风险）</label><p class="form-hint">勾选只更新预览，仍需明确确认。可能削弱来源的防守能力。</p><div id="rally-preview"></div><p class="status-box" id="rally-status" role="status"></p><div class="form-actions"><button class="small-button secondary" id="cancel-rally">${resume?'取消，返回生产人手':'取消'}</button><button class="small-button" id="confirm-rally">确认集结</button></div></div></div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-field','rally-screen');
    // A reused, dirty checkbox keeps its live checked state after morphing; consent is per opening.
    $('rally-include-protected').checked=false;
    amountNode=$('rally-amount');amountNode.value=String(amountOnOpen);amountNode.rallyTicket=rallyTicket;
    $('rally-amount').oninput=refresh;$('rally-include-protected').onchange=refresh;
    $('modal-body')?.querySelectorAll?.('[data-rally-preset]')?.forEach?.(b=>b.onclick=()=>{const v=b.dataset.rallyPreset;$('rally-amount').value=String(v==='max'?Math.max(1,rallyRoom()):Number(v));refresh();});
    $('cancel-rally').onclick=()=>{
      if(resume){if(!live())return;$('rally-include-protected').checked=false;return returnToStaffing(returnState,returnRevision);}
      $('rally-include-protected').checked=false;closeModal();
    };
    if(resume)backTo($('cancel-rally').onclick);
    $('confirm-rally').onclick=event=>{
      if(confirmed||event?.detail>1||!shown?.enabled||!$('modal').open||$('rally-amount')!==amountNode||amountNode.rallyTicket!==rallyTicket||state!==shownState)return;
      if(resume){
        if(checking||!live()||uiBusy||turnInput.busy)return;
        checking=true;
        try{
        const value=$('rally-amount').value,amount=value.trim()===''?NaN:Number(value),scope=$('rally-include-protected').checked?'all-forces':'reserves',current=getRallyPlan(state,key,amount,{scope});
        if(!live()||uiBusy||turnInput.busy)return;
        if(!current.enabled||JSON.stringify(current)!==JSON.stringify(shown)){refresh();return;}
        }finally{checking=false;}
      }
      const action=shown.action,clickRect=event?.currentTarget?.getBoundingClientRect?.();confirmed=true;$('confirm-rally').disabled=true;$('rally-include-protected').checked=false;
      let result,committed=null,duplicate=false;
      if(resume){
        try{result=runAction(action,{onCommitted:actual=>{
          if(committed){duplicate=true;return;}
          committed={result:actual,state:actual.state,revision:actual.state.revision,battle:actual.state.battle,continuation:actual.state.turnContinuation};
        }});}catch{toast(committed?'集结已执行，请查看当前局势。':'请查看当前局势，不要重复执行。',true);return;}
      }else result=runAction(action);
      if(result.ok){
        rallyClickGuard.arm(event,clickRect);
        if(resume){
          if(!committed||duplicate||committed.result!==result||state!==committed.state||result.state!==committed.state||state.revision!==committed.revision||state.battle!==committed.battle||state.turnContinuation!==committed.continuation||!owns())return;
          try{returnToStaffing(committed.state,committed.revision);}catch{toast('集结已执行，请查看当前局势。',true);}
        }else closeModal();
      }else{confirmed=false;refresh();}
    };refresh();
  },refresh);
}

function mountRecovery(initialKey){
  const box=$('governance-recovery');box.hidden=false;
  let key=initialKey||selectedKey,action=null,cachedState=null,owned=[],candidates=[],relief=null,constructionConsentState=state;
  const preservedKey=state.tiles[key]?.ownerId===state.playerId?key:null;
  const signed=n=>`${n>=0?'+':''}${format(n)}`;
  const canExecute=plan=>plan?.ok&&!state.battle&&!state.turnContinuation&&state.ap>=(plan.cost?.ap||0);
  const purchaseAmount=()=>{const input=$('supply-purchase-amount'),amount=input.valueAsNumber;return input.value.trim()!==''&&Number.isInteger(amount)&&amount>=1&&amount<=1000?amount:null;};
  const threeTurnGap=stats=>Math.max(0,Math.ceil(Math.max(0,-stats.income.supply)*3-stats.supply));
  const short=Boolean(initialKey)||getStats(state).income.supply<0;
  morph(box,`<h3>补给与缺粮</h3><p class="form-hint" id="recovery-balance"></p><p class="form-hint" id="recovery-disconnection" hidden></p><details class="gv-fold recovery-fold" ${short?'open':''}><summary>${short?'粮不够了：买粮，或者不花钱自救':'粮不够时怎么办：买粮、遣散、改田'}</summary><p class="form-hint">粮不够时：花金币采购，或者不花钱自救——遣散闲着的罪袋、把地改成应急田圃。每一项都会先告诉你每回合收支变成多少。</p><section class="supply-purchase" aria-labelledby="supply-purchase-heading"><h4 id="supply-purchase-heading">采购补给</h4><div class="supply-purchase-controls"><div class="field"><label for="supply-purchase-amount">采购数量（1～1,000）</label><input id="supply-purchase-amount" type="number" min="1" max="1000" step="1" inputmode="numeric" value="20" aria-describedby="supply-purchase-status" /></div><button class="small-button secondary" type="button" id="supply-three-turns">补足 3 回合</button></div><p class="form-hint" id="supply-three-turns-hint"></p><p class="supply-purchase-quote" id="supply-purchase-quote" aria-live="polite"></p><p class="form-hint" id="supply-purchase-after"></p><p class="form-hint" id="supply-purchase-status" role="status"></p><button class="small-button" type="button" id="execute-supply-purchase">确认采购</button><p class="form-hint">不花指令，只执行本次采购，不开启自动采购。按当前净收支估算缺口，采购不会改变每回合产出。</p></section><div class="relief-options">${preservedKey?`<label><input id="relief-preserve-selected" type="checkbox" checked />额外保留当前地块 ${esc(preservedKey)}（全面裁减时也保留）</label>`:''}<details><summary>高级：紧急裁员与军队保护</summary><label><input id="relief-cut-construction" type="checkbox" />紧急裁减建造人手（放弃动工资格以多省粮）</label><p class="recovery-warning">部分地块将不足 3 人，暂时不能建造普通建筑。不会裁减现有生产人手；勾选只更新预览。</p><label><input id="relief-all-forces" type="checkbox" />全面裁减普通军士（高风险）</label><p class="recovery-warning">取消自动保护，可能削弱首都、主力与要塞防线。勾选只更新预览，仍需明确确认。</p></details></div><div id="recovery-relief"></div><details class="recovery-details" ${initialKey?'open':''}><summary>选择地块，预览改田或裁员</summary><p class="form-hint">${esc(typeof CIVIC_COPY!=='undefined'?CIVIC_COPY.guideRelief:'')}</p><div class="recovery-candidates" id="recovery-candidates"></div><div class="field"><label for="recovery-tile">操作地块</label><select id="recovery-tile" ${typeof beginMapPick==='function'&&typeof CIVIC_COPY!=='undefined'?'hidden':''}></select>${typeof beginMapPick==='function'&&typeof CIVIC_COPY!=='undefined'?`<p id="recovery-map-selection"></p><button class="small-button secondary" id="recovery-map-pick">${esc(CIVIC_COPY.selectTile)}</button>`:''}</div><div class="recovery-controls"><button class="small-button secondary" type="button" id="preview-emergency-farm">预览改田</button><div class="field"><label for="recovery-troops">遣散人数</label><input id="recovery-troops" type="number" min="1" step="1" inputmode="numeric" value="1" /></div><button class="small-button secondary" type="button" id="preview-demobilize">预览裁员</button></div><div id="recovery-preview" aria-live="polite"></div></details><p class="form-hint">执行后可用地图上的撤销按钮撤回本回合上一步。</p></details>`);
  const refresh=()=>{
    if(constructionConsentState!==state){$('relief-cut-construction').checked=false;constructionConsentState=state;}
    if(cachedState!==state){
      cachedState=state;owned=Object.values(state.tiles).filter(t=>t.ownerId===state.playerId).sort((a,b)=>a.key.localeCompare(b.key));
      relief=getRecoveryPlan(state,{type:'relief',scope:$('relief-all-forces').checked?'all-forces':'reserves',preserveConstruction:!$('relief-cut-construction').checked,protectedKeys:preservedKey&&$('relief-preserve-selected')?.checked?[preservedKey]:[]});
      // Bound expensive nation-wide projections. Prefer empty/low-yield plots, never silently sacrifice a fort.
      candidates=owned.filter(t=>t.troops>=1&&t.cutSince===undefined&&t.building!=='garden').map(tile=>({tile,stats:getTileStats(state,tile.key)}))
        .sort((a,b)=>(a.tile.building==='fort'?2:a.tile.isCapital?1:0)-(b.tile.building==='fort'?2:b.tile.isCapital?1:0)||a.stats.supply-b.stats.supply||(a.tile.buildingLevel||0)-(b.tile.buildingLevel||0)||a.stats.gold-b.stats.gold||a.tile.key.localeCompare(b.tile.key))
        .slice(0,8).map(({tile})=>getRecoveryPlan(state,{type:'emergencyFarm',key:tile.key})).filter(plan=>plan.ok&&plan.supplyAfter>plan.supplyBefore).slice(0,4);
    }
    if(!owned.some(tile=>tile.key===key))key=owned[0]?.key||'';
    const stats=getStats(state),tile=state.tiles[key],locked=state.battle||state.turnContinuation;
    $('recovery-balance').textContent=`补给库存 ${format(stats.supply)} · 按当前局势估算净收支：补给 ${signed(stats.income.supply)}${stats.income.supply<0?'，仍有缺口':'，目前没有赤字'}。`;
    $('recovery-disconnection').hidden=stats.cutOff<=0;
    $('recovery-disconnection').textContent=stats.cutOff>0?`当前 ${format(stats.cutOff)} 块领土和首都断了联系：不产出、不增长。打通联系后再查看收支。`:'';
    const amount=purchaseAmount(),quote=amount===null?null:getSupplyQuote(state,amount),gap=threeTurnGap(stats),insufficient=Boolean(quote&&stats.gold<quote.cost.gold);
    $('supply-three-turns').disabled=gap<=0;
    $('supply-three-turns-hint').textContent=gap>1000?`按当前收支补足 3 回合还缺 ${format(gap)} 份；快捷按钮仅填入上限 1,000 份，买完仍需补足。`:gap>0?`扣除现有库存后，按当前收支补足 3 回合还需 ${format(gap)} 份。`:'当前库存已覆盖按当前收支估算的 3 回合缺口。';
    $('supply-purchase-amount').setAttribute('aria-invalid',String(amount===null));
    $('supply-purchase-quote').textContent=quote?`单价 ${quote.unitGold.toLocaleString('zh-CN',{maximumFractionDigits:4})} 金币 / 份 · 共 ${format(quote.amount)} 份 · 总价 ${format(quote.cost.gold)} 金币 · ${quote.cost.ap} 指令`:'请输入 1 到 1,000 之间的整数数量。';
    if(quote&&typeof expenseRowHtml==='function')morph($('supply-purchase-quote'),expenseRowHtml(esc($('supply-purchase-quote').textContent),{type:'buySupply',amount:quote.amount},quote.cost));
    $('supply-purchase-after').textContent=quote?`采购后补给库存：${format(stats.supply)} → ${format(stats.supply+quote.amount)}${insufficient?'':` · 剩余金币 ${format(stats.gold-quote.cost.gold)}`}`:'';
    $('supply-purchase-status').textContent=locked?'战斗或回合结算中不能采购。':amount===null?'数量无效，尚未下单。':insufficient?`金币不足，还差 ${format(quote.cost.gold-stats.gold)} 金币。`:'报价已更新，点击确认后才会扣款。';
    $('supply-purchase-status').classList.toggle('error-copy',amount===null||insufficient);
    $('execute-supply-purchase').disabled=amount===null||insufficient||Boolean(locked)||uiBusy;

    const fullRelief=relief?.scope==='all-forces',affected=relief?.affectedSites||[],protectedSites=relief?.protectedSites||[],overridden=relief?.overriddenSites||[];
    const siteList=(sites,protect=false)=>`<ul class="relief-sites">${sites.map(site=>`<li><b>${esc(tileName(state.tiles[site.key]))} ${esc(site.key)}：${site.troopsBefore} → ${site.troopsAfter}</b><span>${protect?'完整保留':'遣散 '+site.removed+' 人'} · ${esc(site.reason)}</span></li>`).join('')}</ul>`;
    const crews=relief?.constructionTradeoff,lostCrews=relief?.constructionLostSites||[],keptCrews=relief?.constructionRetainedSites||[];
    const constructionCopy=crews?relief.preserveConstruction
      ? `保住 ${format(crews.sites)} 处动工资格，额外留 ${format(crews.workers)} 人；比紧急裁减建造人手每回合少省 ${format(crews.extraSupplySaving)} 补给${crews.extraGoldSaving?`、${format(crews.extraGoldSaving)} 金币`:''}。`
      : `本次 ${format(lostCrews.length)} 处将不足 3 人，暂时不能建造普通建筑；比保留建造人手多遣散 ${format(crews.workers)} 人，每回合多省 ${format(crews.extraSupplySaving)} 补给${crews.extraGoldSaving?`、${format(crews.extraGoldSaving)} 金币`:''}。` : '';
    const constructionList=relief?.preserveConstruction?keptCrews:lostCrews;
    const constructionDisclosure=`<p id="recovery-construction" class="${lostCrews.length?'recovery-warning':'form-hint'}">${esc(constructionCopy)}保留人手不提供免费建设，建造仍需支付指令和资源。</p>${constructionList.length?`<details class="relief-breakdown"><summary>${relief.preserveConstruction?'保留建造人手':'失去动工资格'} · ${constructionList.length} 处</summary>${siteList(constructionList)}</details>`:''}`;
    const reliefLists=`${constructionDisclosure}${overridden.length?`<div class="recovery-warning"><b>本次将削减 ${overridden.length} 处重要军队</b>${siteList(overridden)}</div>`:''}${affected.length?`<details class="relief-breakdown"><summary>逐地裁减清单 · ${affected.length} 处</summary>${siteList(affected)}</details>`:''}${protectedSites.length?`<details class="relief-breakdown"><summary>保留军队与防线 · ${protectedSites.length} 处，${format(relief.protectedReserves||0)} 名预备兵受保护</summary>${siteList(protectedSites,true)}</details>`:''}`;
    morph($('recovery-relief'),relief?.ok?`<div class="recovery-quote"><b>${fullRelief?'全面裁减':'仅裁减后方预备兵'} · ${format(relief.removed)} 人</b><p>每回合净补给 ${signed(relief.supplyBefore)} → ${signed(relief.supplyAfter)}；净金币 ${signed(relief.goldBefore)} → ${signed(relief.goldAfter)}。</p><p>0 指令 · 0 金币 · 0 补给。保留生产人手、同伴和稀有队伍。${fullRelief?'自动保护已关闭，请逐项检查重要军队。':'自动保留首都、同伴驻地、主力、要塞和交战边防。'}${relief.supplyAfter<0?'执行后仍有补给赤字。':''}</p>${reliefLists}<button class="small-button ${fullRelief||lostCrews.length?'danger':''}" type="button" id="execute-relief" ${canExecute(relief)?'':'disabled'}>${fullRelief?'确认全面裁减':!relief.preserveConstruction?'确认紧急裁减':'确认遣散后方预备兵'} ${format(relief.removed)} 人</button></div>`:`<p class="governance-empty">${esc(relief?.reason||'暂无可裁减的后方预备兵。')}</p>${reliefLists}`);
    if($('execute-relief')){const displayed=relief.action;bindComicAction($('execute-relief'),()=>{action=null;const result=runAction(displayed);if(result.ok)toast(`已按清单遣散 ${format(result.detail.removed)} 名普通军士。`);else{cachedState=null;refresh();}});}
    morph($('recovery-tile'),owned.map(t=>`<option value="${esc(t.key)}" ${t.key===key?'selected':''}>${esc(tileName(t))} ${esc(t.key)} · ${t.troops} 人 · ${esc(BUILDINGS[t.building]?.name||'无建筑')}</option>`).join(''));
    $('recovery-tile').onchange=()=>{key=$('recovery-tile').value;action=null;refresh();};
    if(typeof beginMapPick==='function'&&typeof CIVIC_COPY!=='undefined'&&$('recovery-map-pick')){$('recovery-map-selection').textContent=tile?`${tileName(tile)} · ${tile.key}`:'';$('recovery-map-pick').onclick=()=>beginMapPick({label:CIVIC_COPY.selectTile,initial:key,eligible:t=>t.ownerId===state.playerId&&!t.shipId,onPick:picked=>showManagement({recoveryKey:picked}),onCancel:()=>showManagement({recoveryKey:key})});}
    $('recovery-troops').max=String(Math.max(0,(tile?.troops||0)-1));
    $('preview-demobilize').disabled=!tile||tile.troops<=1||Boolean(locked);
    $('preview-emergency-farm').disabled=!tile||Boolean(locked);
    morph($('recovery-candidates'),candidates.length?`<p class="form-hint">优先查看低产地块：</p>${candidates.map(plan=>`<button class="recovery-candidate" type="button" data-recovery-farm="${esc(plan.key)}"><span>${esc(tileName(state.tiles[plan.key]))} ${esc(plan.key)}<small>${esc(BUILDINGS[plan.replacedBuilding]?.name||'无建筑')}${plan.replacedBuilding?` ${plan.replacedLevel||1}级`:''} → 应急田圃</small></span><b>净补给 ${signed(plan.supplyAfter-plan.supplyBefore)}</b></button>`).join('')}`:'<p class="form-hint">优先检查的低产地块没有可增粮方案。可选择其他地块查看实际预览。</p>');
    $('recovery-candidates').querySelectorAll('[data-recovery-farm]').forEach(button=>button.onclick=()=>{key=button.dataset.recoveryFarm;action={type:'emergencyFarm',key};refresh();$('recovery-preview').scrollIntoView({block:'nearest'});});
    const plan=action?getRecoveryPlan(state,action):null;
    const warning=action?.type==='emergencyFarm'?`将${plan?.replacedBuilding?`拆除 ${BUILDINGS[plan.replacedBuilding]?.name||plan.replacedBuilding} ${plan.replacedLevel||1}级`:'使用这块空地'}，改为 1 级应急田圃，不退款。${plan?.replacedBuilding==='fort'?'这里的要塞将消失，可能失去迁都保障。':''}`:'裁员会降低守军人数，也可能使地块生产人手不足。至少留下 1 名居民。';
    morph($('recovery-preview'),!action?'':!plan?.ok?`<p class="governance-empty">${esc(plan?.reason||'请检查方案。')}</p>`:`<div class="recovery-quote"><b>${action.type==='emergencyFarm'?'改田':'裁员'}预览 · ${esc(action.key)}</b><p class="recovery-warning">${esc(warning)}</p><p>该地居民 ${plan.tileTroopsBefore} → ${plan.tileTroopsAfter}。<br>每回合净补给 ${signed(plan.supplyBefore)} → ${signed(plan.supplyAfter)}。<br>每回合净金币 ${signed(plan.goldBefore)} → ${signed(plan.goldAfter)}。</p><p>${plan.cost.ap} 指令 · 0 金币 · 0 补给。${plan.supplyAfter<0?'执行后仍有补给赤字。':''}${state.ap<plan.cost.ap?'本回合指令不足，请下一回合再执行。':''}</p><button class="small-button" type="button" id="execute-recovery" ${canExecute(plan)?'':'disabled'}>${action.type==='emergencyFarm'?'确认替换并改田':`确认遣散 ${plan.removed} 人`}</button><button class="small-button secondary" type="button" id="cancel-recovery">取消</button></div>`);
    if($('execute-recovery'))$('execute-recovery').onclick=()=>{const chosen=action;if(!chosen)return;action=null;const result=runAction(chosen);if(result.ok)toast(chosen.type==='emergencyFarm'?'已改作应急田圃，未退还原建筑费用。':'已按预览遣散军士。');else refresh();};
    if($('cancel-recovery'))$('cancel-recovery').onclick=()=>{action=null;refresh();};
  };
  // Emergency choices are local to this opening, including reused dirty controls.
  $('relief-cut-construction').checked=false;
  $('relief-all-forces').checked=false;
  if($('relief-preserve-selected'))$('relief-preserve-selected').checked=true;
  $('relief-cut-construction').onchange=()=>{cachedState=null;refresh();};
  $('relief-all-forces').onchange=()=>{cachedState=null;refresh();};
  if($('relief-preserve-selected'))$('relief-preserve-selected').onchange=()=>{cachedState=null;refresh();};
  $('supply-purchase-amount').oninput=refresh;
  $('supply-three-turns').onclick=()=>{const gap=threeTurnGap(getStats(state));if(gap<=0)return;$('supply-purchase-amount').value=String(Math.min(1000,gap));refresh();};
  $('execute-supply-purchase').onclick=()=>{const amount=purchaseAmount();if(amount===null)return;const quote=getSupplyQuote(state,amount);if(state.battle||state.turnContinuation||state.factions[state.playerId].gold<quote.cost.gold){refresh();return;}const result=runAction({type:'buySupply',amount});if(result.ok)toast(`已购入 ${format(quote.amount)} 份补给，花费 ${format(quote.cost.gold)} 金币。`);else refresh();};
  $('preview-emergency-farm').onclick=()=>{action={type:'emergencyFarm',key};refresh();};
  $('preview-demobilize').onclick=()=>{action={type:'demobilize',key,troops:$('recovery-troops').valueAsNumber};refresh();};
  $('recovery-troops').oninput=()=>{if(action?.type==='demobilize'){action={type:'demobilize',key,troops:$('recovery-troops').valueAsNumber};refresh();}};
  return refresh;
}

async function showStaffingAdvice(page=0,preferredKey=null){
  const owner=state,revision=state.revision,host=$('staffing-advice');
  const ticket={};host.staffingTicket=ticket;
  const live=()=>state===owner&&state.revision===revision&&$('modal').open&&$('staffing-advice')===host&&host.staffingTicket===ticket;
  morph(host,'<p class="form-hint" role="status">正在计算，可以返回地图。</p>');
  const steps=staffingAdviceSteps(state,page,preferredKey);let next;
  do{await new Promise(resolve=>setTimeout(resolve,0));if(!live())return;next=steps.next();}while(!next.done);
  const report=next.value,batchSites=new Set(report.rows.map(row=>row.key)).size;
  const emptyAdvice=!report.total?'当前没有缺少生产人手的地块。':!report.rows.some(row=>row.enabled)?'本批没有可执行建议。':'';
  const signed=n=>`${n>=0?'+':''}${format(n)}`;
  morph(host,`<p class="form-hint">第 ${state.turn} 回合 · 缺少生产人手 ${report.total} 地 · 本批 ${batchSites} 地${report.pages?` · 第 ${report.page+1} / ${report.pages} 页`:''}。仅比较本批，不代表全国最优；每项单独估算，不可相加。集结只用受保护规则允许的后方预备兵。</p>${emptyAdvice?`<p class="governance-empty">${emptyAdvice}</p>`:''}${report.sites.length?`<div class="field"><label for="staffing-site">选择缺少人手的地块</label><select id="staffing-site" ${typeof beginMapPick==='function'&&typeof CIVIC_COPY!=='undefined'?'hidden':''}>${report.sites.map((site,index)=>`<option value="${index}" ${index===report.page?'selected':''}>${esc(site.key)} · ${esc(tileName(state.tiles[site.key]))} · ${site.residents} / ${site.need}</option>`).join('')}</select>${typeof beginMapPick==='function'&&typeof CIVIC_COPY!=='undefined'?`<button class="small-button secondary" id="staffing-map-pick">${esc(CIVIC_COPY.selectTile)}</button>`:''}</div>`:''}<ol class="development-jobs">${report.rows.map(row=>`<li><div><b>${esc(row.key)} · ${row.kind==='rally'?'就近集结':'征募'}</b><span>人手 ${row.residents} / ${row.need}${row.enabled?` → ${row.afterResidents}`:''}</span>${row.enabled?`<small>预计每回合净收入变化：金币 ${signed(row.delta.gold)} · 补给 ${signed(row.delta.supply)}</small><small>${esc(costLine(row.cost))}${row.delta.supply<=0?'；不增加净补给':''}</small>`:`<small>${esc(row.reason)}</small>`}</div>${row.kind==='rally'?`<button class="small-button secondary" data-staffing-rally="${esc(row.key)}" ${row.enabled&&row.need>row.residents?'':'disabled'}>预览集结</button>`:`<button class="small-button secondary" data-staffing-key="${esc(row.key)}">定位</button>`}</li>`).join('')}</ol><p class="form-hint">只提供建议，不自动执行。征募请定位后查看当前地块操作；集结预填缺少人手的数量，确认前查看来源。局势变化后请重新查看。</p>${report.pages>1?`<button class="small-button secondary" id="staffing-next">下一批</button>`:''}`);
  if(report.sites.length){$('staffing-site').value=String(report.page);$('staffing-site').onchange=()=>{if(live())return showStaffingAdvice(Number($('staffing-site').value));};}
  if(typeof beginMapPick==='function'&&typeof CIVIC_COPY!=='undefined'&&$('staffing-map-pick'))$('staffing-map-pick').onclick=()=>{if(!live())return;const keys=new Set(report.sites.map(site=>site.key)),key=report.sites[report.page]?.key;beginMapPick({label:CIVIC_COPY.selectTile,initial:key,eligible:t=>keys.has(t.key),onPick:picked=>showManagement({staffingKey:picked}),onCancel:()=>showManagement({staffingKey:key,staffingPage:report.page})});};
  let opening=false;
  host.querySelectorAll('[data-staffing-rally]').forEach(button=>button.onclick=()=>{
    if(opening||!live()||button.disabled)return;
    const row=report.rows.find(row=>row.kind==='rally'&&row.key===button.dataset.staffingRally);
    const amount=row?.need-row?.residents;
    if(!row?.enabled||!Number.isInteger(amount)||amount<1||amount>100)return;
    opening=true;
    try{
      const current=getRallyPlan(state,row.key,amount,{scope:'reserves'});
      if(!live()||!current.enabled)return;
      showRallyPreview(row.key,amount,{page:report.page});
    }finally{opening=false;}
  });
  host.querySelectorAll('[data-staffing-key]').forEach(button=>button.onclick=()=>{if(live())focusManagedTile(button.dataset.staffingKey);});
  if(report.pages>1)$('staffing-next').onclick=()=>{if(live())showStaffingAdvice((report.page+1)%report.pages);};
}

function showManagement({recoveryKey=null,staffingKey=null,staffingPage=0,tab=null}={}){
  const gdoc=typeof document!=='undefined'?document:null;
  const saved={mode:'off',reserve:20,...(state.management||{})};
  let frontierFilter='all',frontierPage=0,refreshRecovery=null;
  const savedSummary=()=>{const policy=state.management||{mode:'off',reserve:20};return policy.mode==='off'?'当前：手动建设，回合末自动建设已关闭。':`当前：${MANAGEMENT_MODES[policy.mode]}托管，保留 ${format(policy.reserve)} 金币。`;};
  const draft=()=>{
    const field=$('management-reserve'),reserve=field.valueAsNumber;
    if(field.value.trim()===''||!Number.isSafeInteger(reserve)||reserve<0||reserve>1000000000)return null;
    return {mode:$('management-mode').value,reserve};
  };
  const refresh=()=>{
    if(!$('management-preview'))return;
    const settings=draft(),stats=getStats(state),faction=state.factions[state.playerId],admin=stats.administration;
    $('management-current').textContent=savedSummary();
    $('management-error').hidden=Boolean(settings);
    $('save-management').disabled=!settings;
    $('management-treasury').textContent=`现有 ${format(faction.gold)} 金币 · ${format(faction.supply)} 补给 · 剩余 ${state.ap} / ${state.maxAP} 指令`;
    const net=(n)=>`${n>=0?'+':''}${format(n)}`,tabNow=(typeof document!=='undefined'?gdoc?.querySelector?.('.governance')?.dataset?.tab:null)||startTab;
    // Her gauges: commands left, and which way gold and grain are going.
    const gauge=(cls,value,label,pct,color)=>typeof hexGauge==='function'?hexGauge(cls,value,label,pct,color):`<div class="cs-hg ${cls}"><b>${value}</b><small>${label}</small></div>`;
    morph($('gov-summary'),`${gauge('lv',`${state.ap}<small>/${state.maxAP}</small>`,'指令',state.maxAP?state.ap/state.maxAP*100:0,'#ffc83d')}${gauge('bond',net(stats.income.gold),'金 / 回合',100,stats.income.gold<0?'#ff8f7f':'#ffc83d')}${gauge('spirit',net(stats.income.supply),'粮 / 回合',100,stats.income.supply<0?'#ff8f7f':'#8fe3b4')}`);
    if($('gov-purse'))morph($('gov-purse'),`<div class="gv-coin"><img src="assets/icons/gold.webp" alt="金币" /><b>${format(faction.gold)}</b><em class="${stats.income.gold<0?'down':''}">${net(stats.income.gold)}<small>每回合</small></em></div><div class="gv-coin"><img src="assets/icons/food.webp" alt="粮" /><b>${format(faction.supply)}</b><em class="${stats.income.supply<0?'down':''}">${net(stats.income.supply)}<small>每回合</small></em></div>`);
    if($('gov-commands')&&typeof commandSourcesHtml==='function')morph($('gov-commands'),commandSourcesHtml());
    if($('gov-todo')&&typeof govTodos==='function'){const list=tabNow==='tech'?[]:govTodos(tabNow);$('gov-todo').hidden=!list.length;morph($('gov-todo'),govTodoHtml(list));$('gov-todo').querySelectorAll('[data-gov-go]').forEach(b=>b.onclick=()=>govGo(b.dataset.govGo));}
    if($('gov-line')&&typeof govLine==='function'){
      const said=govLine(tabNow,stats);$('gov-line').textContent=said.text;
      const face=govLead&&typeof portraitUrl==='function'?portraitUrl(govLead,said.expr)||govFace:null,art=$('poke-img');
      if(face&&art&&art.getAttribute?.('src')!==face){art.src=face;if(typeof fitEdge==='function')fitEdge(face);}
    }
    // 货币 under the treasury ledger, the tech tree as its own tab, the city list on 建设. They redraw with everything else.
    if(typeof campaignUI!=='undefined'&&campaignUI){
      const paint=(id,html,bind)=>{const box=$(id);if(!box)return;morph(box,html);bind?.(box);};
      paint('gov-money-slot',campaignUI.moneyHtml(state),box=>campaignUI.bindMoney(box,refresh));
      paint('gov-tech',campaignUI.techHtml(state),box=>campaignUI.bindTech(box,refresh));
      paint('gov-cities-slot',campaignUI.cityListHtml(state),box=>campaignUI.bindCityList(box));
    }
    if($('gov-edicts')&&typeof edictPageHtml==='function'){
      morph($('gov-edicts'),edictPageHtml());
      gdoc?.querySelectorAll?.('[data-edict]')?.forEach(b=>b.onclick=()=>{govEdict=b.dataset.edict;refresh();});
      if($('edict-go'))bindComicAction($('edict-go'),()=>{
        const active=state.edicts||[],slots=EDICT_SLOTS.filter(chapter=>state.milestone.level>=chapter).length,id=$('gov-edicts').querySelector('[data-edict][aria-pressed="true"]')?.dataset.edict;
        const quote=getEdictQuote(state,id,active.length>=slots&&slots>0?active[0]:null);if(!quote.enabled){toast(quote.reason,true);return;}
        const result=runAction(quote.action);if(result.ok)toast(`国策「${quote.name}」颁布了：${quote.desc}。`);return result;
      });
      if($('edict-repeal'))bindComicAction($('edict-repeal'),()=>{const id=$('gov-edicts').querySelector('[data-edict][aria-pressed="true"]')?.dataset.edict,result=runAction({type:'repealEdict',id});if(result.ok)toast('国策废止了。');return result;});
    }
    gdoc?.querySelectorAll?.('[data-gov-mode]')?.forEach(b=>{const on=b.dataset.govMode===$('management-mode').value;b.classList?.toggle?.('on',on);b.setAttribute?.('aria-pressed',String(on));});
    const training=getArmyTrainingQuote(state);
    $('army-training-level').textContent=`当前 Lv ${training.level} / ${training.maxLevel} · 当前角色指导上限 Lv ${training.cap}`;
    $('army-training-effects').textContent=trainingEffectsText(training.effects);
    $('army-training-next').textContent=training.level<training.maxLevel?`下一级 Lv ${training.nextLevel}：${trainingEffectsText(training.nextEffects)}`:'已达到最高训练等级。';
    $('army-training-mixed').textContent=training.effects.mixed?`已解锁混编军种与基础技能：${training.effects.roles.map(role=>TRAINING_ROLES[role]||role).join('、')}。`:'Lv 5 解锁普通军混编与基础军种技能。';
    $('army-training-cost').textContent=training.level<training.maxLevel?`本次费用 ${format(training.cost.gold)} 金币 · ${format(training.cost.supply)} 补给 · ${training.cost.ap} 指令`:'不再收取训练费用。';
    if(training.level<training.maxLevel&&typeof expenseRowHtml==='function')morph($('army-training-cost'),expenseRowHtml(esc($('army-training-cost').textContent),{type:'trainArmy'},training.cost));
    $('army-training-upkeep').textContent=`训练后全军实付军费 ${format(training.militaryBefore.gold)} → ${format(training.militaryAfter.gold)} 金币 / 回合（增加 ${format(training.upkeepDelta)}）；预计净金币 ${format(training.netIncomeBefore.gold)} → ${format(training.netIncomeAfter.gold)} / 回合。按当前驻地编制估算，后备仍按 Lv 1。`;
    $('army-training-status').textContent=training.reason||'本次只提升 1 级，不自动训练。';
    if($('army-training-plain'))$('army-training-plain').textContent=training.level>=training.maxLevel?'常备军已经练满了。':training.cap<training.nextLevel?`练兵让所有罪袋部队更能打（统军、守备、生命都涨）。要练到 Lv ${training.nextLevel}，麾下最强六位同伴的平均等级得到 ${training.nextLevel}（现在能练到 Lv ${training.cap}）：同伴打仗、特训都会升级。`:`练兵让所有罪袋部队更能打（统军、守备、生命都涨），每练一级军费也会涨一点。现在能练到 Lv ${training.cap}。`;
    $('train-army').disabled=!training.enabled||uiBusy;$('train-army').textContent=training.level>=training.maxLevel?'已满级':`训练至 Lv ${training.nextLevel}`;
    const mentorHost=$('army-mentor-members'),mentorState=state,mentorRevision=state.revision;
    morph(mentorHost,mentorGuidanceHtml(getArmyMentorGuidance(state),esc));
    const mentorTicket={};mentorHost.mentorTicket=mentorTicket;
    bindMentorGuidance(mentorHost,{
      live:()=>state===mentorState&&state.revision===mentorRevision&&$('modal').open&&$('army-mentor-members')===mentorHost&&mentorHost.mentorTicket===mentorTicket,
      open:id=>{sheetTab='grow';sheetPerk=null;sheetSeat=null;sheetPeek=false;showCharacter(id,()=>{if(sameWorld(mentorState,state))showManagement({recoveryKey});},true);}
    });
    const trainingRevision=state.revision;
    bindComicAction($('train-army'),()=>{
      const current=getArmyTrainingQuote(state);
      if(JSON.stringify(current)!==JSON.stringify(training)){refresh();$('army-training-status').textContent='训练报价已变化，请查看新的费用后重新确认。';return;}
      if(!current.enabled)return;
      const result=runAction({type:'trainArmy',expectedRevision:trainingRevision});
      if(result.ok){toast(`常备军已提升至 Lv ${training.nextLevel}。全军实付军费 ${training.militaryAfter.gold} 金币 / 回合。`);$('army-training-status').textContent=`已提升至 Lv ${training.nextLevel}；全军实付军费 ${training.militaryAfter.gold} 金币 / 回合。`;$('army-training-status').focus({preventScroll:true});}else refresh();
    });
    morph($('military-ledger'),militaryBudgetHtml(stats.maintenance.military));
    const emergency=(state.notices||[]).filter(note=>note.militarySites?.length).at(-1);
    morph($('military-emergency'),emergency?`<p class="military-readiness">第 ${emergency.turn} 回合曾因军费不足，将 ${emergency.militarySites.length} 地转为后备，防守减弱。</p><button class="small-button secondary" id="show-military-emergency">查看当时完整清单</button>`:'');
    if(emergency)$('show-military-emergency').onclick=()=>showMilitaryEmergency(emergency);

    const spend=(label,value,unit='')=>value?`<div><span>${label}</span><b>-${format(value)}${unit}</b></div>`:'';
    const extras=typeof getIncomeExtras==='function'?getIncomeExtras(state):[],fortBill=stats.maintenance?.forts||stats.fortNetwork?.upkeep||{gold:0,supply:0};
    const extraRows=extras.map(row=>`<div class="sub"><span>其中 ${esc(row.label)}</span><b>${[row.gold?`+${format(row.gold)} 金`:'',row.supply?`+${format(row.supply)} 粮`:''].filter(Boolean).join(' ')}</b></div>`).join('');
    if(typeof financeLedgerHtml==='function')morph($('management-ledger'),financeLedgerHtml(getFinanceBreakdown(state),typeof CIVIC_COPY!=='undefined'?CIVIC_COPY.civic:''));
    else if(admin)morph($('management-ledger'),`<div><span>领土产出</span><b>+${format(admin.rawGold)} 金</b></div>${extraRows}${spend('基础维持费',admin.baseGold,' 金')}${spend('行政支出',admin.gold,' 金')}${spend('要塞维护',fortBill.gold||0,' 金')}${spend('要塞用粮',fortBill.supply||0,' 粮')}${spend('军费（补贴后）',stats.maintenance.military.gold,' 金')}${spend((typeof CIVIC_COPY!=='undefined'?CIVIC_COPY.civic:''),stats.maintenance.civic?.upkeep||0,' 金')}<div class="net"><span>每回合净金币</span><b>${stats.income.gold>=0?'+':''}${format(stats.income.gold)}</b></div><div class="net"><span>每回合净补给</span><b>${stats.income.supply>=0?'+':''}${format(stats.income.supply)}</b></div>${stats.fortNetwork?.excess?`<p class="alarm">要塞超额 ${stats.fortNetwork.excess} 座，维护费加价。可以在地块的「建设」里封存不需要的要塞。</p>`:''}${typeof campaignBudgetHtml==='function'?campaignBudgetHtml(state,esc):''}<details><summary>怎么算的</summary><p>要塞开启 ${stats.fortNetwork?.active||0} 座${Number.isInteger(stats.fortNetwork?.operational)?` / 防区可用 ${stats.fortNetwork.operational} 座`:""} / 常规容量 ${stats.fortNetwork?.capacity||1} 座。</p><p>行政效率 ${(admin.efficiency*100).toFixed(1)}%：领土越大，行政支出越多。</p><p>建设、升级、训练、招募和采购的价格随领土规模上涨，招募还看累计次数；存款多少不影响价格。${typeof CIVIC_COPY!=='undefined'?CIVIC_COPY.fiscalRulesDesc:''}</p></details>`);
    const plan=settings?getDevelopmentPlan(state,settings):null,jobs=plan?.actions||[],cost=plan?.cost||{ap:0,gold:0,supply:0};
    const empty=!settings?'请输入有效的金币保留额。':state.battle?'战斗中不能安排内政。':state.ap<=0?'本回合已没有指令。下一回合可以继续建设。':'当前没有同时满足资源、指令与保留额要求的建设。可调整优先方向或保留额。';
    morph($('management-preview'),jobs.length?`<ol class="development-jobs">${jobs.map((job,index)=>`<li><div><b>${index+1}. ${esc(tileName(state.tiles[job.action.key]))} · ${esc(String(job.label).replace(/^-?\d+,-?\d+\s*·\s*/,''))}</b><small>${format(job.cost?.gold||0)} 金币 · ${format(job.cost?.supply||0)} 补给 · ${job.cost?.ap||0} 指令</small></div><button class="small-button secondary" type="button" data-plan-locate="${esc(job.action.key)}" aria-label="在地图上看${esc(job.label)}的地块 ${esc(job.action.key)}">地图上看</button></li>`).join('')}</ol><button class="gv-link" type="button" id="development-map">${icon('map')}在地图上看这一批，在地图上开工<span>›</span></button>`:`<p class="governance-empty">${empty}</p>`);
    $('management-preview').querySelectorAll('[data-plan-locate]').forEach(button=>button.onclick=()=>focusManagedTile(button.dataset.planLocate));
    if($('development-map'))$('development-map').onclick=()=>{const settings=draft();if(settings&&typeof developmentOnMap==='function')developmentOnMap(settings);};
    $('management-total').textContent=`本批 ${jobs.length} 项 · ${format(cost.gold)} 金币 · ${format(cost.supply)} 补给 · ${cost.ap} 指令`;
    $('management-after').textContent=`开工后还剩：${format(faction.gold-cost.gold)} 金币 · ${format(faction.supply-cost.supply)} 补给 · 余 ${Math.max(0,state.ap-cost.ap)} 指令`;
    $('execute-development').disabled=!settings||!jobs.length||Boolean(state.battle)||uiBusy;
    ($('execute-development').querySelector?.('span')||$('execute-development')).textContent=jobs.length?`开工 ${jobs.length} 项！`:'没得建';
    const all=frontierEntries(state),entries=filterFrontiers(all,frontierFilter),pages=Math.ceil(entries.length/FRONTIER_PAGE_SIZE);
    frontierPage=Math.max(0,Math.min(frontierPage,pages-1));
    $('frontier-count').textContent=`${entries.length} 处边境${pages>1?` · 第 ${frontierPage+1} / ${pages} 页`:''}`;
    $('management-next-frontier').disabled=!entries.length;
    $('frontier-previous').disabled=frontierPage<=0;$('frontier-next').disabled=frontierPage+1>=pages;
    $('frontier-paging').hidden=pages<=1;
    morph($('frontier-list'),entries.length?entries.slice(frontierPage*FRONTIER_PAGE_SIZE,(frontierPage+1)*FRONTIER_PAGE_SIZE).map(entry=>{
      const tile=state.tiles[entry.key],labels=[entry.capital?'本国首都':'',entry.war?'交战边境':'',...entry.countries.map(id=>state.factions[id].name),entry.land?`可开拓方向 ${entry.land}`:'',entry.fog?`迷雾方向 ${entry.fog}`:''].filter(Boolean);
      return `<button class="frontier-place ${entry.war?'war':''}" type="button" data-frontier-key="${esc(entry.key)}"><span><b>${esc(tileName(tile))} <small>${esc(entry.key)}</small></b><span>${esc(labels.join(' · '))}</span></span><span class="frontier-army">${format(tile.troops)} 人<br>${(tile.garrison||[]).length+(tile.field||[]).length} 同伴</span>${icon('arrow')}</button>`;
    }).join(''):'<p class="governance-empty">这一类边境暂时没有地块。</p>');
    $('frontier-list').querySelectorAll('[data-frontier-key]').forEach(button=>button.onclick=()=>jumpToFrontier(button.dataset.frontierKey));
    if($('auto-explore-steps')&&typeof autoExploreSteps==='function'){morph($('auto-explore-steps'),autoExploreSteps());$('auto-explore-note').textContent=autoExploreNote();bindAutoExplore($('auto-explore-steps'));}
    if($('left-explore-box')&&typeof leftExploreSwitch==='function'){morph($('left-explore-box'),leftExploreSwitch());bindLeftExploreSwitch($('left-explore-box'));}
    refreshRecovery?.();
  };
  const startTab=tab||(recoveryKey||getStats(state).income.supply<0?'treasury':staffingKey!==null?'build':(typeof govTab!=='undefined'?govTab:'treasury'));
  const govLead=typeof currentHero==='function'?currentHero():null,govFace=govLead&&typeof portraitUrl==='function'?portraitUrl(govLead,'smile'):'assets/sazai.webp';
  const govTabs=typeof GOV_TABS!=='undefined'?GOV_TABS:[['treasury','国库','coin'],['build','建设','castle'],['army','军队','shield'],['frontier','边境','compass']];
  const govGirl=typeof girlHtml==='function'?girlHtml(govFace,govLead?.name||'罪袋','poke-img'):`<div class="cs-girl"><img class="cs-art" src="${esc(govFace)}" alt="" /></div>`;
  openModal('内政与边境',`第 ${state.turn} 回合`,`<div class="cs gov governance" data-tab="${startTab}" style="--hero:${esc(govLead?.color||'#ffc83d')};--pop:${typeof popOf==='function'?popOf(govLead?.color||'#ffc83d'):'#3d6f8e'}">
    <div class="cs-stage" id="gov-stage"><div class="cs-frame"><i></i></div>${govGirl}</div>
    <header class="cs-id">${typeof vTitleHtml==='function'?vTitleHtml('内政'):'<h2 style="--n:2">内政</h2>'}</header>
    <span class="cs-ribbon"><b>${esc(state.factions[state.playerId]?.name||'本国')}</b><i>第 ${state.turn} 回合</i></span>
    <div class="cs-say always" id="gov-say"><div class="bubble"><b>${esc(govLead?.name||'罪袋')}</b><p id="gov-line"></p></div></div>
    <div class="cs-gauges gov-gauges" id="gov-summary"></div>
    <div class="cs-leafwrap"><section class="cs-leaf" id="gov-paper">
    <div class="gv-todo" id="gov-todo" hidden></div>
    <section class="gov-page" data-gov-page="treasury">
      <div class="gv-purse" id="gov-purse"></div>
      <p class="governance-intro" id="management-treasury"></p>
      <section class="governance-panel gv-sec"><h3>每回合收支</h3><div class="management-ledger" id="management-ledger"></div></section>
      <div id="gov-money-slot"></div>
      <section class="governance-panel gv-sec gv-commands" id="gov-commands"></section>
      <section class="governance-panel gv-sec" id="governance-recovery" hidden></section>
    </section>
    <section class="gov-page" data-gov-page="tech" id="gov-tech"></section>
    <section class="gov-page" data-gov-page="build">
      <div id="gov-cities-slot"></div>
      <section class="governance-panel" aria-labelledby="management-heading">
        <h3 id="management-heading">一次安排建设</h3><p class="form-hint">选个方向，自动挑出这回合做得起的建设；确认后逐项执行，照常花指令和资源。</p>
        <div class="gv-modes" role="group" aria-label="建设方向">${Object.entries(MANAGEMENT_MODES).map(([mode,label])=>`<button type="button" class="gv-mode" data-gov-mode="${mode}"><b>${esc(String(label).replace('建设',''))}</b><small>${{balanced:'金粮兼顾',economy:'先赚金币',supply:'先种粮'}[mode]||''}</small></button>`).join('')}</div><div class="form-row gv-form"><div class="field gv-native"><label for="management-mode">建设方向</label><select id="management-mode">${Object.entries(MANAGEMENT_MODES).map(([mode,label])=>`<option value="${mode}" ${saved.mode===mode||saved.mode==='off'&&mode==='balanced'?'selected':''}>${label}</option>`).join('')}</select></div><div class="field gv-reserve"><label for="management-reserve">金币至少留</label><span class="gv-stepper"><button type="button" data-reserve-step="-10" aria-label="少留 10 金币">−</button><input id="management-reserve" type="number" min="0" max="1000000000" step="1" inputmode="numeric" value="${Number.isSafeInteger(saved.reserve)?saved.reserve:20}" aria-describedby="management-error" /><button type="button" data-reserve-step="10" aria-label="多留 10 金币">+</button></span></div></div>
        <p class="form-hint error-copy" id="management-error" role="status" hidden>请填 0 以上的整数。</p>
        <p class="management-total" id="management-total" aria-live="polite"></p><div id="management-preview"></div><p class="form-hint" id="management-after"></p>
        <button class="cs-burst" type="button" id="execute-development"><span>开工！</span></button>
      </section>
      <section class="governance-panel management-policy"><h3>回合末托管</h3><p class="form-hint">结束回合时，用剩下的指令自动建造和升级，金币不低于上面的底线。不会开拓、招募、外交或打仗。</p><label class="management-switch gv-switch"><input type="checkbox" id="management-auto" ${saved.mode!=='off'?'checked':''} /><span>开启托管</span></label><button class="small-button secondary" type="button" id="save-management">保存托管设置</button><p class="management-current" id="management-current" role="status"></p></section>
      <section class="governance-panel" aria-labelledby="staffing-heading"><div class="governance-heading"><h3 id="staffing-heading">哪里缺人手</h3><button class="small-button secondary" type="button" id="open-staffing-advice">看看</button></div><p class="form-hint">人手不够产出会打折。这里比较“就近集结”和“征募”哪个划算，只看不花钱。</p><div id="staffing-advice"></div></section>
    </section>
    <section class="gov-page" data-gov-page="army">
      <section class="governance-panel army-training" aria-labelledby="army-training-heading"><h3 id="army-training-heading">常备军训练</h3><p class="gv-plain" id="army-training-plain"></p><p class="management-total" id="army-training-level"></p><details class="form-hint gv-fold"><summary>每一级加多少</summary><p class="form-hint" id="army-training-effects"></p><p class="form-hint" id="army-training-next"></p><p class="form-hint" id="army-training-mixed"></p></details><p class="military-readiness" id="army-training-upkeep"></p><p class="management-total" id="army-training-cost"></p><p class="form-hint" id="army-training-status" role="status" tabindex="-1"></p><button class="small-button" id="train-army" type="button">训练常备军</button><details class="form-hint"><summary>训练上限怎么提高</summary><p>上限随麾下最高六名角色的平均等级提高，已练成的等级不会掉。这里的统军、守备不是直接伤害值，也不能代替角色的天赋与信赖。</p><div id="army-mentor-members"></div></details></section>
      <section class="governance-panel military-budget" aria-labelledby="military-budget-heading"><h3 id="military-budget-heading">军费</h3><div id="military-ledger"></div><div id="military-emergency"></div><button class="small-button secondary" type="button" id="preview-military-bulk">后方军队转后备（先看）</button></section>
    </section>
    <section class="gov-page" data-gov-page="edict" id="gov-edicts"></section>
    <section class="gov-page" data-gov-page="frontier">
      <section class="governance-panel auto-explore-panel" aria-labelledby="auto-explore-heading"><h3 id="auto-explore-heading">自动探索</h3><p class="form-hint">每回合开头自动花几令探索迷雾，每次 1 令，不花金和粮。地图上点任一块迷雾也能设。</p><div id="auto-explore-steps"></div><p class="form-hint auto-explore-note" id="auto-explore-note"></p><div id="left-explore-box"></div></section>
      <section class="governance-panel" aria-labelledby="frontier-heading"><div class="governance-heading"><h3 id="frontier-heading">边境速览</h3><button class="small-button secondary" type="button" id="management-next-frontier">下一处</button></div><p class="form-hint">点一处就把地图移过去，不会下命令。地图上按 F 也能轮流看。</p><div class="field"><label for="frontier-filter">看哪类</label><select id="frontier-filter"><option value="all">全部边境</option><option value="war">交战边境</option><option value="country">接壤诸国</option><option value="land">能开拓的</option><option value="fog">迷雾方向</option></select></div><p class="form-hint" id="frontier-count"></p><div class="frontier-list" id="frontier-list"></div><div class="frontier-paging" id="frontier-paging"><button class="small-button secondary" type="button" id="frontier-previous">上一页</button><button class="small-button secondary" type="button" id="frontier-next">下一页</button></div></section>
    </section>
    </section></div>
    <nav class="cs-nav gov-nav" aria-label="内政分页"><div class="cs-tabs gov-tabs" role="tablist">${govTabs.map(([id,name,ic])=>`<button role="tab" data-gov-tab="${id}" class="${id===startTab?'on':''}" aria-selected="${id===startTab}">${icon(ic)}<span>${name}</span></button>`).join('')}</div></nav>
  </div>`,()=>{
    if($('modal'))$('modal').className='screen sheet-mode management-screen';
    const dom=typeof document!=='undefined'?document:null;
    const pick=id=>{if(typeof govTab!=='undefined')govTab=id;const root=dom?.querySelector?.('.governance');if(!root)return;root.dataset.tab=id;root.querySelectorAll('[data-gov-tab]').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.govTab===id));b.classList?.toggle?.('on',b.dataset.govTab===id);});$('modal-body').scrollTop=0;if($('gov-paper'))$('gov-paper').scrollTop=0;refresh();};
    dom?.querySelectorAll?.('[data-gov-tab]')?.forEach(b=>b.onclick=()=>pick(b.dataset.govTab));
    if(typeof govPick!=='undefined')govPick=pick;
    if(govLead&&typeof fitEdge==='function')fitEdge(govFace);
    dom?.querySelectorAll?.('[data-gov-mode]')?.forEach(b=>b.onclick=()=>{$('management-mode').value=b.dataset.govMode;refresh();});
    dom?.querySelectorAll?.('[data-reserve-step]')?.forEach(b=>b.onclick=()=>{const field=$('management-reserve'),now=Number.isSafeInteger(field.valueAsNumber)?field.valueAsNumber:0;field.value=String(Math.max(0,Math.min(1000000000,now+Number(b.dataset.reserveStep))));refresh();});
    // A reused form can retain dirty checked/selected properties after Cancel.
    // Each opening starts from the saved policy, not an abandoned local draft.
    $('management-auto').checked=saved.mode!=='off';
    $('management-mode').value=saved.mode==='off'?'balanced':saved.mode;
    $('frontier-filter').value='all';
    $('management-mode').onchange=refresh;$('management-reserve').oninput=refresh;
    $('preview-military-bulk').onclick=()=>showMilitaryStandDown();
    $('staffing-advice').staffingTicket={};
    $('open-staffing-advice').onclick=()=>showStaffingAdvice(0,selectedKey);
    $('execute-development').onclick=()=>{const settings=draft();if(!settings)return;const result=runAction({type:'develop',...settings});if(result.ok)toast('本批建设已完成。');else refresh();};
    $('save-management').onclick=()=>{const settings=draft();if(!settings)return;const mode=$('management-auto').checked?settings.mode:'off',result=runAction({type:'setManagement',...settings,mode});if(result.ok)toast(mode==='off'?'已关闭回合末自动建设。':'已保存回合末托管设置。');};
    $('frontier-filter').onchange=()=>{frontierFilter=$('frontier-filter').value;frontierPage=0;refresh();};
    $('frontier-previous').onclick=()=>{frontierPage--;refresh();};$('frontier-next').onclick=()=>{frontierPage++;refresh();};
    $('management-next-frontier').onclick=()=>jumpToFrontier(null,frontierFilter);
    refreshRecovery=mountRecovery(recoveryKey);
    refresh();
    const supply=getStats(state);
    if(recoveryKey||supply.supply<=0&&supply.income.supply<0)$('governance-recovery').scrollIntoView({block:'start'});
    if(staffingKey!==null)showStaffingAdvice(staffingPage,staffingKey);
  },refresh);
}

function returnToAssetTile(key){
  closeModal();
  if(!state.tiles[key]?.discovered)return;
  cancelDispatch();selectedKey=key;flowerOpen=true;render();fitFlower(key);
}
function showLiquidation(key,message=''){
  const tile=state.tiles[key];if(!tile||!tile.discovered||tile.ownerId!==state.playerId)return;
  const artKey=tile.building==='garden'?'farm':tile.building&&['camp','capital','farm','fort','home','lumber','mine','port','quarry'].includes(tile.building)?tile.building:tile.isCapital?'capital':'home';
  const choices=[...(tile.building?[{asset:'building',name:'拆除建筑'}]:[]),...(tile.road?[{asset:'road',name:'拆除道路'}]:[]),...['R','SR','SSR'].filter(rank=>tile.elite?.[rank]>0).map(rank=>({asset:'elite',rank,amount:1,name:`遣散 ${rank} 稀有队伍（库存 ${tile.elite[rank]}）`}))];
  openReading('变卖资产','折价回收，不是原价退款',`<div class="comic-sheet"><div class="comic-banner"><img class="building-thumb" src="assets/buildings/${artKey}.webp" alt="" /><div><b>${esc(tileName(tile))} ${esc(key)} · 折价换回金币</b><p>紧急缺钱时可拆掉建筑、道路或遣散稀有罪袋换回部分金币，土地和居民都会保留。</p></div></div><div class="military-bulk"><div class="form-row"><label class="field">选择资产<select id="liquidation-asset">${choices.map((c,i)=>`<option value="${i}">${esc(c.name)}</option>`).join('')}</select></label><label class="field">稀有队伍数量<input id="liquidation-count" type="number" min="1" step="1" value="1"></label></div><div id="liquidation-preview"></div><p id="liquidation-status" class="status-box" role="status">${esc(message)}</p><div class="form-actions"><button id="liquidation-back" class="small-button secondary">返回地块</button><button id="liquidation-confirm" class="small-button">确认折价变卖</button></div></div></div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-town');
    let displayed;
    const quote=()=>{const choice=choices[Number($('liquidation-asset').value)]||choices[0];return getLiquidationQuote(state,{type:'liquidate',key,...choice,...(choice?.asset==='elite'?{amount:Number($('liquidation-count').value)}:{}),expectedRevision:state.revision});};
    const refresh=()=>{displayed=quote();const q=displayed; $('liquidation-count').disabled=q.action.asset!=='elite';$('liquidation-confirm').disabled=!q.enabled;
      $('liquidation-preview').innerHTML=q.enabled?`<p class="military-price">${esc(q.label)}：回收 ${q.refund.gold} 金币；国库 ${q.before.gold} → ${q.after.gold}。费用：0 行动力、0 金币、0 补给。</p><p>居民 ${q.before.residents} → ${q.after.residents}；稀有库存 ${['R','SR','SSR'].map(rank=>`${rank} ${q.before.elite[rank]||0} → ${q.after.elite[rank]||0}`).join('，')}；道路 ${q.before.road?'有':'无'} → ${q.after.road?'有':'无'}。</p><p>本地金币产出 ${q.before.stats.gold} → ${q.after.stats.gold}；补给产出 ${q.before.stats.supply} → ${q.after.stats.supply}；住房 ${q.before.stats.housing} → ${q.after.stats.housing}；防御 ${q.before.stats.defense} → ${q.after.stats.defense}。</p><p>全国金币净收入 ${q.before.netIncome.gold} → ${q.after.netIncome.gold}；补给净收入 ${q.before.netIncome.supply} → ${q.after.netIncome.supply}。全国维护金币 ${q.before.maintenance.gold} → ${q.after.maintenance.gold}；补给 ${q.before.maintenance.supply} → ${q.after.maintenance.supply}。</p>${q.defenseChanges.map(d=>`<p>${esc(d.key)} 防御 ${d.before} → ${d.after}</p>`).join('')}`:`<p>${esc(q.reason)}</p>`;};
    $('liquidation-asset').onchange=refresh;$('liquidation-count').oninput=refresh;bindComicAction($('liquidation-back'),()=>returnToAssetTile(key));refresh();
    bindComicAction($('liquidation-confirm'),()=>{const current=quote();if(JSON.stringify(current)!==JSON.stringify(displayed)){showLiquidation(key,'局势或数量已变化，请重新确认。');return;}if(!current.enabled)return;const result=runAction(current.action);if(!result.ok){showLiquidation(key,result.error);return;}const expectedRevision=state.revision;openReading('变卖完成','资产已折价回收',`<div class="comic-sheet"><div class="comic-banner"><img src="assets/icons/gold.webp" alt="" /><div><b>已折价回收 ${current.refund.gold} 金币</b><p>国库 ${current.before.gold} → ${current.after.gold}。如果点错了可以立刻撤销。</p></div></div><div class="form-actions"><button id="liquidation-undo" class="small-button">撤销本次变卖</button><button id="liquidation-done" class="small-button secondary">返回地块</button></div></div>`,()=>{$('modal')?.classList?.add?.('scene','bg-town');bindComicAction($('liquidation-undo'),()=>{const r=runAction({type:'undo',expectedRevision});if(r.ok)showLiquidation(key,'已撤销。');});bindComicAction($('liquidation-done'),()=>returnToAssetTile(key));},()=>showLiquidation(key,'局势已变化。'));});
  },()=>showLiquidation(key,'局势已变化，请重新确认。'));
}
function showGuide(){
  const ic=name=>typeof icon==='function'?icon(name):'';
  const art=kind=>{
    // The six homes of the tile ring, placed by the same sixty-degree steps the real ring uses.
    if(kind==='ring')return `<span class="bk-ring" aria-hidden="true">${['征募','建设','推荐','军务','编队','驻扎'].map((name,i)=>{const a=(i*60-60)*Math.PI/180;return `<i style="--x:${Math.cos(a).toFixed(3)};--y:${Math.sin(a).toFixed(3)}">${name}</i>`;}).join('')}<i class="hub">地块</i></span>`;
    if(kind==='dial')return '<span class="bk-dial" aria-hidden="true"><b>3</b></span>';
    if(kind==='trail')return '<span class="bk-trail" aria-hidden="true"><i>1</i><i>2</i><i>3</i><u></u></span>';
    if(kind==='frames')return '<span class="bk-frames" aria-hidden="true"><i class="w"></i><i class="r"></i></span>';
    if(kind==='pips')return '<span class="bk-pips" aria-hidden="true"><i>3</i><em>+</em><i>1</i><em>+</em><i>1</i></span>';
    if(kind==='cap')return '<span class="bk-pips cap" aria-hidden="true"><i>28</i><em>+</em><i>8</i><em>+</em><i>10</i></span>';
    if(kind==='meter')return '<span class="bk-meter" aria-hidden="true"><i></i></span>';
    if(kind==='chips')return '<span class="bk-chips" aria-hidden="true"><i>急行军</i><i>行商</i><i>运筹</i></span>';
    return `<span class="bk-hex" aria-hidden="true">${ic(kind)}</span>`;
  };
  const lead=typeof currentHero==='function'?currentHero():null,face=lead&&typeof portraitUrl==='function'?portraitUrl(lead,'happy')||portraitUrl(lead,'smile'):'assets/sazai.webp';
  const girl=typeof girlHtml==='function'?girlHtml(face,lead?.name||'向导','poke-img'):`<div class="cs-girl"><img class="cs-art" src="${esc(face)}" alt="" /></div>`;
  const keys='1～6 按对应的花瓣 · N 下一支军队 · U 可升级的建筑 · F 边境 · G 内政 · H 回首都 · Z 撤销 · 空格 结束回合 · 右键 / Esc 收起圆盘';
  const fort=`<details class="fort-guide-levels"><summary>要塞与守备细则</summary><p>地块上有能参战的同伴就会打战棋。没有同伴时，要塞只要有普通居民或整备好的稀有军士就会防守；首都有军士时必定防守。其余没有同伴的地块会被直接占领。</p><p>要塞至少有4名普通军士、整备好且未封存时会启用定向胸墙。若与首都连通还能保护相邻地块，多个要塞效果不叠加。哪怕与首都失联，只要满足上述条件仍可接纳迁都。</p>${[1,3,5].map(level=>`<p>${esc(fortLevelSummary(fortLevelProfile(level)))}</p>`).join('')}</details>`;
  const pages=GUIDE_BOOK.map(chapter=>`<section class="bk-page" data-book-page="${chapter.id}">${chapter.panels.map((panel,i)=>`<article class="bk-panel"><span class="bk-no">${i+1}</span>${art(panel.art)}<h3>${esc(panel.t)}</h3><p>${esc(panel.d)}</p>${panel.fort?fort:''}</article>`).join('')}${chapter.id==='basic'?`<details class="fort-guide-levels bk-keys"><summary>快捷键一览</summary><p>${keys}</p></details>`:''}</section>`).join('');
  const html=`<div class="cs book" id="guide-book" data-tab="${guideTab}" style="--hero:${esc(lead?.color||'#ffc83d')};--pop:${typeof popOf==='function'?popOf(lead?.color||'#ffc83d'):'#3d6f8e'}">
    <div class="cs-stage"><div class="cs-frame"><i></i></div>${girl}</div>
    <header class="cs-id">${typeof vTitleHtml==='function'?vTitleHtml('怎么玩'):'<h2 style="--n:3">怎么玩</h2>'}</header>
    <span class="cs-ribbon"><b>领主手记</b><i>六章，翻着看</i></span>
    <div class="cs-say always"><div class="bubble"><b>${esc(lead?.name||'向导')}</b><p id="book-line"></p></div></div>
    <div class="cs-leafwrap"><section class="cs-leaf" id="book-paper">
      <div class="bk-lessons" role="group" aria-label="上手练一遍"><button class="bk-lesson" id="guide-lesson"><b>新手教程</b><small>带你走第一遍</small></button><button class="bk-lesson" id="guide-advanced"><b>进阶教程</b><small>远行 · 会师 · 议和</small></button><button class="bk-lesson" id="guide-practice"><b>模拟战</b><small>不影响存档</small></button></div>
      ${pages}
    </section></div>
    <nav class="cs-nav" aria-label="章节"><div class="cs-tabs" role="tablist">${GUIDE_BOOK.map(chapter=>`<button role="tab" data-book-tab="${chapter.id}" class="${chapter.id===guideTab?'on':''}" aria-selected="${chapter.id===guideTab}">${ic(chapter.icon)}<span>${chapter.name}</span></button>`).join('')}</div></nav>
  </div>`;
  openReading('怎么玩','领主手记',html,()=>{
    if($('modal'))$('modal').className='screen sheet-mode guide-screen';
    if(lead&&typeof fitEdge==='function')fitEdge(face);
    const dom=typeof document!=='undefined'?document:null;
    const pick=id=>{
      guideTab=id;const root=$('guide-book'),chapter=GUIDE_BOOK.find(item=>item.id===id)||GUIDE_BOOK[0];
      if(root?.dataset)root.dataset.tab=chapter.id;
      dom?.querySelectorAll?.('[data-book-tab]')?.forEach(b=>{const on=b.dataset.bookTab===chapter.id;b.classList?.toggle?.('on',on);b.setAttribute?.('aria-selected',String(on));});
      if($('book-line'))$('book-line').textContent=chapter.say;if($('book-paper'))$('book-paper').scrollTop=0;
    };
    dom?.querySelectorAll?.('[data-book-tab]')?.forEach(b=>b.onclick=()=>pick(b.dataset.bookTab));
    pick(guideTab);
    $('guide-practice').onclick=startPractice;
    if($('guide-lesson'))$('guide-lesson').onclick=()=>{if(typeof startTutorial==='function'){if($('modal').open)closeModal();startTutorial();}};
    if($('guide-advanced'))$('guide-advanced').onclick=()=>{if(typeof startAdvancedTutorial==='function'){if($('modal').open)closeModal();startAdvancedTutorial();}};
  });
}
/* 怎么玩: a handbook drawn as a manga page. Five chapters as tabs under the page, every rule one small panel
   with a picture, and the girl who leads the realm telling you which part matters. The three ways to learn by
   doing (first lesson, advanced lesson, mock battle) sit at the top of the paper. */
const GUIDE_BOOK=[
  {id:'basic',name:'入门',icon:'help',say:'先弄懂这几步，马上就能上手玩。',panels:[
    {t:'点地块，开花瓣',art:'ring',d:'点己方地块，周围会弹出六角花瓣菜单。右上征募，右边建设，右下推荐，左下军务，左边编队，左上驻扎。每个按钮的位置永远固定，点习惯就熟了。'},
    {t:'人就是一切',art:'heroes',d:'地里的普通罪袋既是干活的人，也是普通士兵。人手够了地块才有满额产出。「开拓」通常能从相邻己方地迁2人过去，「征募」直接在本地加4人，有些同伴还能额外多招。'},
    {t:'金币、粮和指令',art:'dial',d:(typeof CIVIC_COPY!=='undefined'?CIVIC_COPY.guideResources:'')},
    {t:'结束回合',art:'sun',d:'点右下角的大圆盘，就会进入下一回合。系统会发金币和粮食，地里会长出新人口，其他国家也会在此时行动。手头的指令没用完，随时都能点圆盘。'},
    {t:'先别怕打仗',art:'sword',d:'前7个回合大家都在安心发育，谁也不能开战。第8回合起，先在「诸国」界面向对方宣战，才能进攻红框地块。要是想练手，随时能开模拟战，完全不影响存档。'},
  ]},
  {id:'army',name:'军队',icon:'flag',say:'点小旗选队伍，教你带兵和移动。',panels:[
    {t:'编队旗',art:'flag',d:'同伴带着罪袋行军时，地块上会插一面小旗。点旗子能打开队伍界面。点同伴头像，就能把她在这支队伍和本地驻军之间调来调去。'},
    {t:'白框走，红框打',art:'frames',d:'选中小旗后，白色虚线框代表本回合能走到的己方地块，红框是能进攻的邻国地块。点目标地会先预览路线。行军可以点界面按钮，也能再点一次白框出发；红框进攻必须点按钮。'},
    {t:'远行令',art:'trail',d:'想去很远的己方地块，直接点它下达远行令。队伍不会一下飞过去，而是每回合沿着己方领土自动走一段路，中途不花指令。路线会画成虚线，你随时都能点取消。'},
    {t:'分队',art:'swap',d:'队伍人多时点「分队」。挑出这次要出发的同伴头像，再调整带走的罪袋人数，就能拆出一支新队伍出发。剩下的人继续留在原地，不用先塞进驻地。'},
    {t:'会师',art:'heroes',d:'点一块己方地，选「军务 → 会师」，能让各地队伍一起往这里走。界面会提前排出谁先到，也不会消耗指令。所有同伴都能来，但赶来的普通兵不能超过这块地的补给上限。'},
    {t:'补给上限',art:'cap',d:'补给上限是指地块能容纳的普通人口。修路加8，要塞每级加8，首都加20，地块上的同伴每人加10（最多算6人）。调兵不能超额；若已超限，每回合会尝试把超出部分的五分之一转移到连通且有空位的己方地块，绝不会直接裁减人口。'},
    {t:'军情图层',art:'map',d:'点地图右侧的「军情」可以切图层。界面会收起建筑，方便你看队伍位置和路线。地块上的人数显示为红色，代表劳动力不够；显示为金色，代表人数已经超过了补给上限。'},
    {t:'战棋',art:'shield',d:'进攻有守军的地块会进战棋。蓝格是移动范围，红斜线是射程，快速双击蓝格或红框敌人能直接行动。全歼敌人获胜，或者占领据点累计满3轮也能赢。据点从第3轮起算，敌人靠到旁边就会暂停计数。'},
  ]},
  {id:'grow',name:'养成',icon:'heart',say:'看同伴擅长什么，派她去合适位置。',panels:[
    {t:'等级与属性',art:'pentagon',d:'同伴升级时按成长率随机提升属性，不是每项必涨。统军提升部队伤害，守备增加生命与减伤，经营提高任职与领军收入，魅力提高招募遇到少女的概率、劝说时的交涉准备且适合担任使节，探险决定探索范围。'},
    {t:'特训',art:'spark',d:(typeof CIVIC_COPY!=='undefined'?CIVIC_COPY.guideTraining:'')},
    {t:'天赋',art:'crest',d:'同伴升到5、10、15、20级时，各能选一项新天赋，选定后不能反悔重来。前三档主要强化个人战斗特长，最后一档能提供全国生效的收入或经验加成。'},
    {t:'信赖',art:'heart',d:'全国每回合可找一人谈话。送礼每人每回合一次，每次花8金币，送喜欢的礼物加得更多，熟悉后提升会变慢。信赖达到50时进入战棋自带2点护盾，达到80时技能可用次数加1次，达到100时每回合为你产出2枚金币，升级时属性也更容易成长。'},
    {t:'专属词条',art:'chips',d:'每位同伴都有在大地图生效的专属词条，但必须放在对的位置才能起效。比如「急行军」需要她在编队里，「运筹」需要她领军或任职。注意任职当官的同伴不能带兵上战场。'},
    {t:'任用',art:'scroll',d:'待在首都的闲置同伴可以安排当官：财务官加金币，军需官加粮，招募官让你更容易遇到少女，军师每回合多给1道指令。一旦安排她任职，她就不能带兵上战场了。'},
    {t:'差事',art:'heroes',d:'不打仗的同伴可以去一块己方地上管事：经营多产金，屯田多产粮，治理提高这块地的控制力，征募让人口长得快，各看她的经营、守备、魅力、统军。她离开编队、不上阵。点己方地块的「差事」花瓣，或者地图右上的「闲人」一键安排。派人花 1 令，召回不花。'},
  ]},
  {id:'realm',name:'国家',icon:'spark',say:'城市、科技、货币、船和飞机，都在地图上点。',panels:[
    {t:'修路',art:'map',d:'点己方地块 → 建设 → 修路，再点地图上的终点：整条路和价钱马上画出来，自动挑最省钱的路线，已有道路的格子不收钱。再点一次终点就修好。修路不花指令，但要金币和粮；控制力低的地方更贵。'},
    {t:'控制力',art:'target',d:'离首都越远控制力越低：每格 −8%，最低 15%。控制力低，产出少、建造和修路更贵。新打下的地有 10 回合消化期。地图右边的「控制力」图层能看全国。'},
    {t:'城市',art:'castle',d:'研究「行政学」后，点己方地块 → 建设 → 建城，在卡片里点一位在场的同伴当市长。城市中心控制力 90%，往外每格 −7%，还会自己往外开拓。市长信赖满了就不会因为别国更富而闹独立；城市离首都太远，市长信赖会慢慢掉。'},
    {t:'迁都',art:'flag',d:'点一座城市 → 建设 → 迁都。要和平、要有市长、动乱低。迁完有 8 回合恢复期。'},
    {t:'科技',art:'spark',d:'国库下的「研究」角标，或者内政 → 科技。点一个六角看它做什么，按「研究！」。暗着的也能点：会把前置按顺序排好，后面的自动接上、不花指令。六条线：农业、商贸、行政、工业、军事、海空，越往后越强也越贵。'},
    {t:'大工程与奇观',art:'castle',d:'工坊、工厂、银行、船厂、机场、行政厅和七座奇观，都在 建设 → 大工程 里挑。行政厅每座 0.25 指令，四座加 1。奇观每国一座，各有全国效果，维护很贵。'},
    {t:'货币',art:'coin',d:'内政 → 国库下面是货币。卖粮换金是前期最快的钱；国债要先研究银行业，利息看信用；印钞会推高物价，一直印会恶性通胀，城市开始躁动。有中央银行就能调利率。通商的国家用你的钱结账越多，铸币税越多。'},
    {t:'船',art:'compass',d:'船厂 → 军务 → 造船。船是地图上的单位：点船，白框的海面航行，岸边的己方地卸人，红框登陆作战。己方编队站在船旁边时，点船就能登船。远的海面会分几回合自己开过去。'},
    {t:'飞机',art:'compass',d:'机场 → 军务 → 造飞机、起飞。选好坐飞机的同伴，再点降落的机场；没有第二个机场就改成巡航。会飞的同伴在任何己方地块都能「飞行」，不用飞机。点天上的飞机能改航或拦截。'},
    {t:'主力与自由',art:'flag',d:'编队卡标题旁能切「主力 / 自由」。主力遇敌进战棋；自由部队按战力加一点运气自动结算。给自由部队选「打首都」或「占空地」和要打的国家，它就自己出发。'},
    {t:'远行与改道',art:'trail',d:'选中编队后点走不到的地方（敌境也行），卡片写几回合到，按「出发！」之后每回合自动走。想绕路就点「改道」，再点途经的地块。'},
    {t:'罪袋定位',art:'heroes',d:'国库下人口一行的「稀有 N」能点：每点一次跳到一处有稀有罪袋的地，船上的也算。'},
    {t:'肖申克监狱',art:'shield',d:'牢房里选一位俘虏，在处置里选「永久监禁」。她这局再也不会出现：不能招降、赎回，也不进卡池。牢房页最下面能看到名单。'},
    {t:'批量外交',art:'chat',d:'诸国 → 多选。先选寒暄、通商、互不侵犯或结盟，再勾国家，一次做完，每国 1 指令。'},
    {t:'议和条约',art:'scroll',d:'战争分数领先时，会谈页的条款可以组合：索赔、割地、臣服，点数加起来不超过战争分数就行。割哪几块默认自动挑，也能在地图上改。'},
    {t:'吞并还是附庸',art:'crest',d:'打下一国最后的地时会马上问你：吞并（没被俘的角色回角色池，你拿不到），还是收为附庸（她们留在原国，每回合上缴八成，以后还能慢慢整合）。'},
  ]},
  {id:'rule',name:'治国',icon:'castle',say:'领地变多不用愁，交给托管帮你管。',panels:[
    {t:'指令会变多',art:'pips',d:(typeof CIVIC_COPY!=='undefined'?CIVIC_COPY.guideActions:'')},
    {t:'自动探索',art:'compass',d:'点地图上任一块迷雾，花瓣「自动探索」里选每回合几令（内政「边境」页也能设）。每回合开头先探离首都近、能揭开更多新地的迷雾；每次 1 令，不花金和粮，指令不够就停。'},
    {t:'内政托管',art:'gear',d:'在内政「建设」页选好规划方向，打开托管就行。每回合结束时，系统会自动用没花完的指令去盖房。托管建设时绝不会动用你设定预留的金币，不过维持军队等其他开销仍可能让金币减少。'},
    {t:'国策',art:'scroll',d:(typeof CIVIC_COPY!=='undefined'?CIVIC_COPY.guideEdicts:'')},
    {t:'要塞',art:'fort',d:'要塞本地防御加3。驻守至少4名普通军士、完成整备且未封存的要塞，不仅能在丢都后接纳迁都，只要跟首都连通，还能替相邻己方地块提供掩护。没有同伴也没有要塞守军的普通地块，敌军一来就会被直接占领。',fort:true},
    {t:'别断了联系',art:'target',d:'己方地块必须有路连回首都。一旦路线被切断，地块就会画上红色斜线，停止产出资源并不再生长人口。要是连续2个回合都没能重新打通，这块地就会彻底脱离你的国家。'},
    {t:'牢房',art:'shield',d:'俘虏在每回合结算时都有机会逃跑。可以使用「牢房总令」加强看守，也可以开启自动补充看守时间。关押满24回合会面临假释审查，快到期时可花钱续押来延后假释。招降需要交涉准备达到100、怨气不高于40，且对方愿意倾听，再支付金币和1道指令确认加入。'},
    {t:'军费与后备',art:'coin',d:'常备军训练越高打仗越猛，但每回合都要吃军费。把暂时不打仗的后方驻地设为「后备」，就不用再交这笔驻军费，本地的人口和经济产出也完全不会受损。'},
  ]},
  {id:'dip',name:'外交',icon:'handshake',say:'不用死打，先看态度再决定怎么谈。',panels:[
    {t:'好感与态度',art:'chat',d:'别国对你有好感度和态度。赠送礼金最多只能让好感增加到40，而且好感达到25时礼金的提升效果就会减半，后续需要依靠谈话和派遣使节继续提升。点开会谈界面，可以清楚查看对方对你各项好感数值的来源与计算方式。'},
    {t:'条约',art:'handshake',d:'两国可缔结通商（双方每回合各增加2枚金币）、互不侵犯条约或结盟（同盟被宣战时会自动参战）。对方是否同意受性格与实力等多重因素影响，点击提议即可查看意愿与详细原因。单方面撕毁条约需要付出沉重代价。'},
    {t:'宣战理由',art:'sword',d:'对方扣押你的人、占了你的失地、跑来找你勒索，或者双方积怨已深，都是正当宣战理由。要是毫无理由直接宣战，所有见过面的国家对你的好感都会扣8点；中途撕毁条约还要另扣10点。'},
    {t:'战争分数',art:'meter',d:'战事越顺分数越高：占普通地加6分，打下首都加25分，战棋赢一场加4分，俘虏对方一人加5分，劫掠加3分；吃了败仗或丢地就会反向扣分。分数高，你在谈判时才能提出更多要求。'},
    {t:'议和条款',art:'scroll',d:'手里有20分能要赔款，30分起能逼对方割地（每多15分能多要一块，最多割4块），60分能让她彻底臣服（对方领地不超3块时只要40分）。要是你处于劣势，分数跌到负20分以下也能主动赔款求和。'},
    {t:'附庸',art:'crest',d:(typeof CIVIC_COPY!=='undefined'?CIVIC_COPY.guideSubject:'')},
    {t:'使节',art:'hero',d:'你可以把留在首都的同伴派去别国当使节（带兵的领军、副将和在任官员不能去）。使节每回合都会提升两国好感，她的魅力越高涨得越快、上限也越高。一旦两国开战，使节会自动赶回首都。'},
    {t:'小心她们结盟',art:'flame',d:'讨厌你又打不过你的国家很容易抱团结盟。宣战前一定要先点开诸国界面查清楚她的盟友，一旦开战，她的盟友会自动参战围攻你。礼金和使节只能拉近感情，无法拆散别人已经签好的同盟。'},
  ]},
];
let guideTab='basic';
function download(filename,text,type='application/json'){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
/** Settings that must be reachable without loading a world: sound. */
function showSettings(fromSave=false){
  const hero=(typeof currentHero==='function'&&currentHero())||(typeof CHARACTER_DEFINITIONS!=='undefined'?CHARACTER_DEFINITIONS[0]:null);
  const art=hero&&typeof portraitUrl==='function'?portraitUrl(hero,'happy')||portraitUrl(hero,'smile'):'assets/sazai.webp';
  const name=hero?.name||'向导';
  openModal('设置','声音与演出偏好',`<div class="settings-stage"><div class="settings-art"><img src="${esc(art)}" alt="${esc(name)}" /><div class="bubble settings-bubble"><b>${esc(name)}</b><p>声音和演出开关都在这儿，点一下就生效，下次打开也会记住。</p></div></div><div class="settings-sheet comic-sheet"><div class="settings"><button class="menu-row" id="set-sound">${typeof icon==='function'?icon(soundEnabled?'sound':'sound-off'):''}<span class="menu-copy"><b>音效</b><small>${soundEnabled?'开启 · 点击、行军与抽卡都有提示音':'关闭 · 全程静音游玩'}</small></span><em class="menu-pill ${soundEnabled?'on':''}">${soundEnabled?'已开启':'已关闭'}</em></button>${typeof artPackPanel==='function'?artPackPanel():''}<p class="form-hint">偏好会自动保存在当前浏览器。${realGame||fromSave?'需要备份进度或开启新世界，可前往「菜单」。':'进入游戏后点右下角「菜单」即可导出或载入存档。'}</p>${fromSave||realGame?`<div class="form-actions"><button class="small-button secondary" id="set-open-save" type="button">${fromSave?'返回菜单':'打开存档与菜单'}</button></div>`:''}</div></div></div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-tavern','settings-screen');
    if(typeof bindArtPack==='function')openModal.artPackCleanup=bindArtPack($('art-pack-panel'));
    if(fromSave&&typeof backTo==='function')backTo(showSave);
    $('set-sound').onclick=()=>{$('toggle-sound').click();showSettings(fromSave);};
    if($('set-open-save'))$('set-open-save').onclick=()=>showSave();
  });
}
function showSave(){
  const shownState=state;let chronicleButton,chronicleSession;
  const row=(id,ic,name,note,pill='')=>`<button class="menu-row" id="${id}">${typeof icon==='function'?icon(ic):''}<span class="menu-copy"><b>${name}</b><small>${note}</small></span>${pill?`<em class="menu-pill ${pill==='已开启'?'on':''}">${pill}</em>`:''}</button>`;
  const stats=getStats(state),lead=typeof currentHero==='function'?currentHero():null,face=lead&&typeof portraitUrl==='function'?portraitUrl(lead,'smile'):'assets/sazai.webp',onSound=typeof soundEnabled!=='undefined'&&soundEnabled;
  const paged=typeof mangaPage==='function';
  const banner=`<div class="comic-banner"><img class="letter-face" src="${esc(face)}" alt="" /><div><b>${esc(state.factions[state.playerId]?.name||'领主城')} · 第 ${state.turn} 回合</b><p>领土 ${stats.territories} 处 · 同伴 ${state.recruitedHeroIds?.length||0} 位 · 随时查看目标、历史、规则与存档。</p></div></div>`;
  const body=`<div class="menu-list">${row('save-show-progress','scroll','发展计划','完成任意一项即可领奖进入下一章')}${row('save-show-chronicle','map','编年史','回看这个世界发生过的大事记')}${row('save-show-guide','help','怎么玩','五章手记：入门、军队、养成、治国、外交')}${row('save-sound',onSound?'sound':'sound-off','音效',onSound?'点击关闭游戏提示音':'点击开启游戏提示音',onSound?'已开启':'已关闭')}${row('save-show-settings','gear','偏好设置','声音与演出选项面板')}</div>
    <h4>存档与云同步<small>${!storageAvailable?'自动保存不可用，记得手动导出':(typeof account!=='undefined'&&account.user)?'已自动保存在本机，并同步到你的账号':'每一步都会自动保存在当前浏览器里'}</small></h4>
    <div id="save-account-slot">${typeof saveAccountHtml==='function'?saveAccountHtml():''}</div>
    <div class="menu-pair"><button class="small-button" id="export-save">${typeof icon==='function'?icon('download'):''}导出存档</button><button class="small-button secondary" id="import-save" aria-describedby="save-import-status">${typeof icon==='function'?icon('upload'):''}载入存档</button></div>
    <div id="save-import-status" class="status-box" role="status" aria-live="polite" aria-atomic="true" style="overflow-wrap:anywhere;font-family:var(--font)" hidden></div>
    <p class="form-hint">${(typeof account!=='undefined'&&account.user)?'换设备时登录同一个 Discord 账号就能接着玩。':'换设备游玩时，先点「导出存档」保存文件，再到新设备点「载入存档」即可。'}</p>
    <div class="menu-pair"><button class="small-button secondary" id="to-menu">回到主菜单</button></div>
    <details class="menu-more"><summary>开始新世界</summary><div class="field"><label for="new-seed">地图种子（填相同的词会生成相同的地图）</label><input id="new-seed" value="mistbound-${Date.now().toString(36)}" maxlength="100" /></div><p class="form-hint">开新局会覆盖当前自动存档；想留住现在的进度，请先点上方「导出存档」。</p><button class="small-button danger" id="new-game">开始新世界</button><p class="form-hint"><a class="download-link" href="examples/battle-demo.save.json" download>下载战棋试玩存档</a>，载入后直接体验第一场防守战。</p></details>
    ${typeof artPackPanel==='function'?artPackPanel():''}
    <details class="menu-more"><summary>临时快照备份</summary>${checkpointPanelHtml()}</details>`;
  openReading('菜单',`第 ${state.turn} 回合 · ${stats.territories} 领土`,paged?mangaPage({cls:'menu',title:'菜单',ribbon:state.factions[state.playerId]?.name||'领主城',note:`第 ${state.turn} 回合`,lead,expr:'smile',line:`领土 ${stats.territories} 处，同伴 ${state.recruitedHeroIds?.length||0} 位。目标、历史、规则和存档都在这一页。`,paper:body}):`<div class="comic-sheet">${banner}${body}</div>`,()=>{
    if(paged&&$('modal'))$('modal').className='screen sheet-mode page-screen save-screen';else $('modal')?.classList?.add?.('scene','bg-study','save-screen');
    if(typeof bindArtPack==='function')openModal.artPackCleanup=bindArtPack($('art-pack-panel'));
    const panel=$('checkpoint-panel');
    openModal.checkpointCleanup=mountCheckpointPanel(panel,{getState:()=>state,isCurrent:()=>$('modal').open&&$('checkpoint-panel')===panel&&state===shownState,download});
    $('export-save').onclick=()=>exportCurrentSave();
    saveImportSession={};$('import-save').onclick=beginSaveImport;
    $('save-show-guide').onclick=()=>{showGuide();backTo(showSave);};$('save-show-progress').onclick=()=>{showProgress();backTo(showSave);};
    chronicleButton=$('save-show-chronicle');chronicleSession=saveImportSession;chronicleButton.onclick=()=>{if(state===shownState&&$('modal').open&&$('save-show-chronicle')===chronicleButton&&saveImportSession===chronicleSession){showChronicle();backTo(showSave);}};
    $('save-sound').onclick=()=>{$('toggle-sound').click();showSave();};
    if($('save-show-settings'))$('save-show-settings').onclick=()=>showSettings(true);
    $('new-game').onclick=()=>showNewGame($('new-seed').value.trim()||null);
    $('to-menu').onclick=showMenu;
    renderSaveImportStatus();if(typeof renderAccount==='function')renderAccount();
  });
}
function showTitleImport(){
  if($('title-screen').hidden)return;
  openReading('载入存档','接续已有旅程',`<div class="comic-sheet"><div class="comic-banner"><img src="assets/sazai.webp" alt="" /><div><b>从存档文件继续旅程</b><p>选择之前导出的 JSON 存档文件，就能直接回到当时的回合。</p></div></div><p class="form-hint" id="title-import-note">${realGame?`当前浏览器里还留着第 ${state.turn} 回合的进度，想保留的话可以先导出备份。`:''}无需先开始新游戏，载入成功后会直接进入所选战局；取消选择或文件格式不对时，不会覆盖现有进度。</p><div class="form-actions"><button class="small-button" id="import-save" type="button" aria-describedby="title-import-note save-import-status">${icon('upload')}选择存档文件</button>${realGame?'<button class="small-button secondary" id="title-import-export" type="button">导出当前进度</button>':''}<button class="small-button secondary" id="title-import-back" type="button">返回主菜单</button></div><div id="save-import-status" class="status-box" role="status" aria-live="polite" aria-atomic="true" style="overflow-wrap:anywhere;font-family:var(--font)" hidden></div></div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-study','title-import-screen');
    const back=$('title-import-back'),session=saveImportSession={fromTitle:true};
    const isCurrent=()=>$('modal').open&&!$('title-screen').hidden&&saveImportSession===session&&$('title-import-back')===back;
    $('import-save').onclick=()=>{if(isCurrent())beginSaveImport();};back.onclick=()=>{if(isCurrent())closeModal();};
    if($('title-import-export'))$('title-import-export').onclick=()=>{if(isCurrent())exportCurrentSave();};
    renderSaveImportStatus();$('import-save').focus({preventScroll:true});
  });
}
$('save-file-input').onchange=async e=>{
  const file=e.target.files?.[0],request=saveImportPicking;e.target.value='';
  if(!request||request.input!==e.target){if(!file&&saveImportRequest?.input===e.target&&saveImportIsCurrent(saveImportRequest))cancelSaveImport('未选择存档，当前战局未替换。可以重新选择。');return;}
  if(!saveImportIsCurrent(request))return;
  saveImportPicking=null;saveImportRequest=request;
  if(!file){cancelSaveImport('未选择存档，当前战局未替换。可以重新选择。');return;}
  const fail=message=>{saveImportRequest=null;setSaveImportStatus(message,true);toast(message,true);};
  if(file.size>20*1024*1024){fail('存档超过 20 MB，请用 CLI 检查后再载入。');return;}
  setSaveImportStatus(`正在读取「${file.name||'存档'}」。当前战局尚未替换，可重新选择，或关闭窗口取消。`);
  let applied=false;
  try{
    const text=await file.text();if(!saveImportIsCurrent(request))return;
    const result=deserializeGame(text);
    // Another tab may write during validation before its storage event reaches this task.
    if(!saveImportIsCurrent(request))return;
    if(!result.ok){fail(result.error||'存档格式不正确。');return;}
    // Reading can finish out of order. Only the still-current request may replace the campaign.
    saveImportRequest=null;applied=true;
    quickDefense.clear();realGame=true;state=result.state;pendingExternalSave=null;saveProgress.exportedState=null;saveProgress.exportInitiatedState=null;selectedKey=capitalKey();dispatchFrom=null;attackFrom=null;attackTroops=null;moveTroops=null;leftBehind=new Set();if(typeof armyKey!=='undefined'){armyKey=null;armyTarget=null;worldMap.setArmy?.(null);worldMap.setRoute?.(null);}flowerOpen=false;seenLevelSeq=state.levelSeq||0;dialogueQueue.length=0;reportItems=[];tutorial.seenNotice=Math.max(0,...(state.notices||[]).filter(n=>n.turn<(state.turnContinuation?.startedTurn??Infinity)).map(n=>n.id));tutorial.seenWar=tutorial.seenNotice;if(request.session.fromTitle)$('title-screen').hidden=true;saveAuto();render();worldMap.centerOn(selectedKey);closeModal();const pending=state.recruitedHeroIds.filter(id=>getCharacter(state,id)?.pending?.length).length;
    const message=`旅行手记已载入，第 ${state.turn} 回合。${pending?`${pending} 位同伴有待选天赋，可从「同伴」查看。`:''}`;setSaveImportStatus(message,false,state);toast(message);
  }catch(error){if(applied)fail('存档已载入，但界面更新未完成：'+error.message+'。请先导出备份。');else if(saveImportIsCurrent(request))fail('无法读取存档：'+error.message);}
};
let saveImportRequest=null,saveImportPicking=null,saveImportStatus=null,saveImportSession={};
function beginSaveImport(){
  cancelSaveImport();if(!$('modal')?.open||!$('save-import-status'))return;
  // Each native chooser owns its input. A late event from an abandoned chooser must not
  // borrow a newer attempt, even if Save was closed and reopened in between.
  const previous=$('save-file-input'),input=previous.cloneNode(false);
  input.onchange=previous.onchange;input.oncancel=previous.oncancel;previous.replaceWith(input);
  const request=saveImportPicking={state,revision:state.revision||0,externalSave:pendingExternalSave,storedSave:readSaveImportStorage(),session:saveImportSession,input};
  setSaveImportStatus('请选择存档文件，选择后会开始读取。当前战局尚未替换。');
  try{input.click();}catch(error){if(saveImportIsCurrent(request)){cancelSaveImport();const message='无法打开存档选择窗口：'+error.message+'。请重试。';setSaveImportStatus(message,true);toast(message,true);}}
}
// A fresh title has no real campaign yet, so storage events may ignore its placeholder.
// Snapshot the browser bytes too, rather than overwriting a save created by another tab.
function readSaveImportStorage(){try{return localStorage.getItem(SAVE_KEY);}catch{return undefined;}}
function renderSaveImportStatus(){
  const box=$('save-import-status');if(!box)return;
  if(saveImportStatus?.completedState&&saveImportStatus.completedState!==state)saveImportStatus=null;
  box.hidden=!saveImportStatus;box.className='status-box'+(saveImportStatus?.error?' error':'');box.textContent=saveImportStatus?.message||'';
  $('import-save')?.setAttribute('aria-busy',String(Boolean(saveImportRequest)));
}
function setSaveImportStatus(message,error=false,completedState=null){saveImportStatus={message,error,completedState};renderSaveImportStatus();}
function cancelSaveImport(message='已取消载入，当前战局未替换。可以重新选择。'){
  if(!saveImportRequest&&!saveImportPicking)return;
  saveImportRequest=null;saveImportPicking=null;setSaveImportStatus(message);
}
function saveImportIsCurrent(request){
  if(!request||(saveImportRequest!==request&&saveImportPicking!==request))return false;
  if(state!==request.state||(state.revision||0)!==request.revision){cancelSaveImport('战局已改变，本次载入已取消。需要载入时请重新选择存档。');return false;}
  if(pendingExternalSave!==request.externalSave){cancelSaveImport('另一窗口的存档已改变，本次载入已取消。请查看保存提示后重新选择存档。');return false;}
  if(readSaveImportStorage()!==request.storedSave){cancelSaveImport('浏览器存档已改变，本次载入已取消。请检查其他窗口后重新选择存档。');return false;}
  if(!$('modal')?.open||request.session!==saveImportSession||!$('save-import-status')||Boolean(request.session.fromTitle)!==!$('title-screen').hidden){cancelSaveImport();return false;}
  return true;
}
$('save-file-input').oncancel=e=>{const request=saveImportPicking||saveImportRequest;if(!request||request.input!==e.target||!saveImportIsCurrent(request))return;cancelSaveImport('未选择存档，当前战局未替换。可以重新选择。');};

/* The workshop lives on the main menu. What it holds joins new runs only; inside a run, nations simply rise from the fog. */
const MODS_KEY='mistbound.mods.v1';
function loadMods(){try{const list=JSON.parse(localStorage.getItem(MODS_KEY)||'[]');return Array.isArray(list)?list:[];}catch{return [];}}
function keepMods(list){try{localStorage.setItem(MODS_KEY,JSON.stringify(list));return true;}catch{return false;}}
function setFormStatus(message,error=false){const el=$('workshop-status');if(el){el.hidden=false;el.className='status-box'+(error?' error':'');el.textContent=message;}}
function uniqueId(prefix){return prefix+'.'+Date.now().toString(36);}
function defaultMod(){return {schemaVersion:1,id:'wanderer.first-pack',name:'旅人的第一篇章',characters:[{id:'wanderer.lan',role:'ranger',name:'岚音',title:'远方的观星者',color:'#7a8d9e',stats:{attack:1,defense:1,scout:2,economy:2},trait:'向星而行',description:'擅长探索迷雾的旅行者，带着来自远方的地图。'}]};}
function addMod(mod,tab){
  const list=loadMods(),check=validateMod(mod,createGame('workshop-check',{mods:list}));
  if(!check.ok){setFormStatus(check.errors.join('\n'),true);return false;}
  if(!keepMods([...list,mod])){setFormStatus('浏览器存储不可用，没能保存。',true);return false;}
  showWorkshop(tab);setFormStatus(`「${mod.name||mod.id}」已加入，下次自定义开局生效。`);return true;
}
function showWorkshop(tab='nation'){
  const mods=loadMods();
  const tabs=`<div class="modal-tabs">${[['nation','新国家'],['character','新角色'],['json','JSON']].map(([id,name])=>`<button class="${tab===id?'active':''}" data-workshop-tab="${id}">${name}</button>`).join('')}</div>`;
  const list=mods.length?`<h4>已加入 ${mods.length} 项</h4><div class="mod-list">${mods.map((mod,i)=>`<div class="mod-row"><b>${esc(mod.name||mod.id)}</b><small>${mod.factions?.length?`${mod.factions.length} 国 · `:''}${mod.characters?.length||0} 人</small><button class="chip" data-drop-mod="${i}">移除</button></div>`).join('')}</div>`:'';
  let body='',setup=()=>{};
  if(tab==='nation'){
    body=`<div class="form-row"><label class="field">国家名称<input id="nation-name" value="星潮王庭" maxlength="24" /></label><label class="field">国旗颜色<input id="nation-color" type="color" value="#8c7da6" /></label></div><div class="form-row"><label class="field">领袖姓名<input id="nation-leader" value="月汐" maxlength="20" /></label><label class="field">国家倾向<select id="nation-personality"><option value="balanced">均衡</option><option value="aggressive">好战</option><option value="builder">求稳</option></select></label></div><div id="workshop-status" hidden></div><div class="form-actions"><button class="small-button" id="add-nation">${icon('plus')}加入</button></div>`;
    setup=()=>{$('add-nation').onclick=()=>{const name=$('nation-name').value.trim(),leaderName=$('nation-leader').value.trim();if(!name||!leaderName){setFormStatus('请填写国家和领袖的名字。',true);return;}const id=uniqueId('nation'),leaderId=id+'.leader',color=$('nation-color').value;addMod({schemaVersion:1,id:id+'.pack',name,characters:[{id:leaderId,name:leaderName,title:name+'的执旗者',color,stats:{attack:2,defense:2,scout:1,economy:1},description:'从雾海彼端而来，为新国度寻找未来。'}],factions:[{id,name,color,leaderId,personality:$('nation-personality').value}]},'nation');};};
  }else if(tab==='character'){
    body=`<div class="form-row"><label class="field">角色姓名<input id="char-name" value="岚音" maxlength="20" /></label><label class="field">称号<input id="char-title" value="远方的观星者" maxlength="32" /></label></div><label class="field">代表色<input id="char-color" type="color" value="#7a8d9e" /></label><div class="form-row">${[['attack','统军',1],['defense','守备',1],['scout','探险',2],['economy','经营',2]].map(([k,l,n])=>`<label class="field">${l}<input id="char-${k}" type="number" min="0" max="${k==='scout'?2:12}" value="${n}" /></label>`).join('')}</div><label class="field">一句话介绍<input id="char-description" value="擅长探索迷雾的旅行者。" maxlength="120" /></label><div id="workshop-status" hidden></div><div class="form-actions"><button class="small-button" id="add-character">${icon('plus')}加入</button></div>`;
    setup=()=>{$('add-character').onclick=()=>{const name=$('char-name').value.trim();addMod({schemaVersion:1,id:uniqueId('character-pack'),name,characters:[{id:uniqueId('hero'),name,title:$('char-title').value.trim(),color:$('char-color').value,stats:Object.fromEntries(['attack','defense','scout','economy'].map(k=>[k,Number($('char-'+k).value)])),description:$('char-description').value.trim()}]},'character');};};
  }else{
    body=`<label class="field">内容包 JSON<textarea id="mod-json" spellcheck="false" aria-label="Mod JSON 编辑器">${esc(JSON.stringify(defaultMod(),null,2))}</textarea></label><div id="workshop-status" hidden></div><div class="form-actions"><button class="small-button secondary" id="load-mod-file">${icon('upload')}读取文件</button><button class="small-button" id="apply-mod">${icon('plus')}校验并加入</button></div>`;
    setup=()=>{$('load-mod-file').onclick=()=>$('mod-file-input').click();$('apply-mod').onclick=()=>{let mod;try{mod=JSON.parse($('mod-json').value);}catch(e){setFormStatus('JSON 解析失败：'+e.message,true);return;}addMod(mod,'json');};};
  }
  openReading('工坊','自建国家与旅人',`<div class="comic-sheet"><div class="comic-banner"><img src="assets/sazai.webp" alt="" /><div><b>创作者工坊 · 加入自定义国家或角色</b><p>这里添加的内容会在下一次「自定义开局」时生效：新国家会从迷雾中登场，新角色会作为旅人等待招募。</p></div></div>${tabs}${body}${list}</div>`,()=>{
    $('modal')?.classList?.add?.('scene','bg-tavern','workshop-screen');
    document.querySelectorAll('[data-workshop-tab]').forEach(b=>b.onclick=()=>showWorkshop(b.dataset.workshopTab));
    document.querySelectorAll('[data-drop-mod]').forEach(b=>b.onclick=()=>{const next=loadMods();next.splice(Number(b.dataset.dropMod),1);keepMods(next);showWorkshop(tab);});
    setup();
  });
}
$('mod-file-input').onchange=async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;if(f.size>2*1024*1024){toast('Mod 超过 2 MB，请拆分内容包。',true);return;}try{const text=await f.text();if($('mod-json')){$('mod-json').value=text;setFormStatus('文件已读取。先校验，再应用。');}}catch(e){toast('读取文件失败：'+e.message,true)}};

$('nav-admin').onclick=()=>showManagement();
$('find-frontier').onclick=()=>jumpToFrontier();if($('world-overview'))$('world-overview').onclick=()=>showWorldOverview();
$('nav-factions').onclick=showFactions;$('nav-heroes').onclick=()=>showHeroes();$('nav-recruit').onclick=()=>showRecruit();$('nameplate').onclick=()=>state.activeHeroId?showCharacter(state.activeHeroId):showHeroes();
$('leader').onclick=()=>{const id=state.activeHeroId,el=$('leader');el.classList.remove('poked');void el.offsetWidth;el.classList.add('poked');if(id)say(id,'idle',true);};
$('bubble').onclick=()=>{if(state.battle)return;const g=guideNow();if(g?.info){nextInfo();return;}if(lessonRunning())return;dismissBubble();};
$('bubble-close').onclick=event=>{event.stopPropagation();dismissBubble(event);};
for(const type of ['pointerdown','pointerup','pointercancel','click','dblclick','keydown','keyup'])document.addEventListener(type,event=>{if(guardChatterPointer(event)||chatterDismissInput.block(event)){event.preventDefault();event.stopImmediatePropagation();}},true);
window.addEventListener('blur',()=>{chatterDismissInput.clearHeld();chatterClickGuard.clear();chatterPressedPointers.clear();chatterBlockedPointers.clear();chatterReleasedPointers.clear();});
$('ticker').onclick=()=>showChronicle();
$('zoom').oninput=e=>worldMap.zoomTo(Number(e.target.value));
$('end-turn').onmouseenter=()=>document.body.classList.add('previewing');$('end-turn').onmouseleave=()=>document.body.classList.remove('previewing');
$('open-save').onclick=showSave;$('open-guide').onclick=showGuide;
$('center-map').onclick=()=>{selectedKey=capitalKey();worldMap.centerOn(selectedKey);};
$('home-arrow').onclick=()=>{selectedKey=capitalKey();worldMap.centerOn(selectedKey);};
$('find-army').onclick=()=>jumpToReadyArmy();
if($('lever-toggle'))$('lever-toggle').onclick=()=>{const cur=hudFold.lever===null?isPhone():hudFold.lever;hudFold.lever=!cur;syncHudFold();if(typeof stackRightHud==='function')stackRightHud();if(typeof duckPanels==='function')duckPanels();placeMarkers();};
if($('fold-ledger'))$('fold-ledger').onclick=()=>{hudFold.ledger=!hudFold.ledger;syncHudFold();if(typeof stackRightHud==='function')stackRightHud();if(typeof duckPanels==='function')duckPanels();placeMarkers();};
document.querySelectorAll('[data-layer]').forEach(b=>b.onclick=()=>{const wasActive=b.classList.contains('active');document.querySelectorAll('[data-layer]').forEach(x=>x.classList.toggle('active',x===b));worldMap.setLayer(b.dataset.layer);const legend=$('map-legend'),words={diplomacy:['金 · 本国','红 · 交战','绿 · 同盟','黄 · 条约','灰 · 中立'],force:['数字 · 人口','红底 · 人手不够','金底 · 超出补给','旗 · 编队','点线 · 远行令']}[b.dataset.layer];legend.hidden=!words&&b.dataset.layer!=='people';if(words)legend.innerHTML=words.map(text=>`<span>${text}</span>`).join('');if(b.dataset.layer==='people'&&typeof peopleLegend==='function')peopleLegend();if(isPhone()&&wasActive&&hudFold.lever===false)hudFold.lever=true;syncHudFold();if(typeof stackRightHud==='function')stackRightHud();if(b.dataset.layer==='force'&&GUIDE[tutorial.step]?.type==='layer'&&!tutorial.dismissed){guideDone('layer');render();}});
$('toggle-sound').onclick=()=>{soundEnabled=!soundEnabled;try{localStorage.setItem('mistbound.sound',soundEnabled?'on':'off');}catch{toast('浏览器未能记住音效设置。',true);}$('toggle-sound').innerHTML=icon(soundEnabled?'sound':'sound-off');$('toggle-sound').title=soundEnabled?'关闭音效':'开启音效';$('toggle-sound').setAttribute('aria-label',$('toggle-sound').title);sound();};
$('toggle-sound').innerHTML=icon(soundEnabled?'sound':'sound-off');$('toggle-sound').title=soundEnabled?'关闭音效':'开启音效';$('toggle-sound').setAttribute('aria-label',$('toggle-sound').title);
$('end-turn').onclick=requestEndTurn;if($('left-explore'))$('left-explore').onclick=()=>setLeftExplore(!state.management?.exploreLeft);$('turn-hint').onclick=requestEndTurn;$('undo').onclick=()=>runAction({type:'undo'});
document.addEventListener('keydown',e=>{
  if(e.repeat&&e.target?.closest?.('[data-comic-commit]')&&['Enter','Space'].includes(e.code)){e.preventDefault();return;}
  if(e.repeat||e.defaultPrevented||e.isComposing||e.metaKey||e.ctrlKey||e.altKey||guideNow()||state.battle||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)||document.activeElement?.isContentEditable)return;
  if(e.key==='Escape'){if($('modal').open)return;if(armyKey){if(armyTarget){armyTarget=null;worldMap.setRoute(null);renderArmy();}else clearArmy();e.preventDefault();}else if(flowerOpen&&$('flower').ringGroup){$('flower').ringGroup=null;renderFlower();e.preventDefault();}else if(dispatchFrom){cancelDispatch();e.preventDefault();}else if(flowerOpen){closeFlower();e.preventDefault();}return;}
  if($('modal').open||!$('title-screen').hidden||!$('notice-screen').hidden)return;
  if(e.code==='Space'&&!['BUTTON','A'].includes(document.activeElement?.tagName)){e.preventDefault();requestEndTurn(e);}
  else if(flowerOpen&&/^[1-6]$/.test(e.key)){const petal=$('flower').querySelector(`[data-petal="${Number(e.key)-1}"]`);if(petal){e.preventDefault();petal.click();}}
  else if(e.key.toLowerCase()==='z'){e.preventDefault();runAction({type:'undo'});}
  else if(e.key.toLowerCase()==='n'){e.preventDefault();jumpToReadyArmy(e.shiftKey?-1:1);}
  else if(e.key.toLowerCase()==='u'){e.preventDefault();jumpToUpgrade();}
  else if(e.key.toLowerCase()==='h'){e.preventDefault();cancelDispatch();worldMap.centerOn(capitalKey());}
  else if(e.key.toLowerCase()==='m'&&state.world){e.preventDefault();showWorldOverview();}
  else if(e.key.toLowerCase()==='g'){e.preventDefault();showManagement();}
  else if(e.key.toLowerCase()==='f'){e.preventDefault();jumpToFrontier();}
});
function syncCoverImage(image,failed=false){
  const picture=image?.closest?.('#title-screen picture');if(!picture||(!failed&&!image.complete))return;
  const missing=failed||!(image.naturalWidth>0);picture.hidden=missing;document.body.classList.toggle('cover-missing',missing);
}
// Cover requests may finish before module listeners are attached. Reconcile completed images too.
document.addEventListener('load',event=>syncCoverImage(event.target),true);
for(const image of document.querySelectorAll('#title-screen picture img'))syncCoverImage(image);
document.addEventListener('error',e=>{
  const img=e.target;if(!(img instanceof HTMLImageElement)||img.src.startsWith('data:'))return;
  const match=/portraits\/([^/]+)\/(\w+)\.webp/.exec(img.src),hero=match&&state.characters[match[1]];
  if(match)missingArt.add(`assets/portraits/${match[1]}/${match[2]}.webp`);
  if(img.closest('#title-screen')){syncCoverImage(img,true);return;}
  img.dataset.fallback='1';img.src=fallbackPortrait(hero?.name||img.alt||'军士',hero?.color);img.classList.add('fallback-portrait');
},true);
window.addEventListener('resize',()=>{stackRightHud();placeFlower();if(flowerOpen)fitFlower(selectedKey);if(armyTile()){placeArmy();fitArmy(armyTarget||armyKey);}});
// The treasury grows and shrinks on its own (counting numbers, badges, wrapping): whatever hangs under it follows.
if(typeof ResizeObserver!=='undefined'&&$('ledger')){const follow=new ResizeObserver(()=>{if(typeof stackRightHud==='function')stackRightHud();if(typeof duckPanels==='function')duckPanels();});for(const id of ['ledger','goals','report'])if($(id))follow.observe($(id));
  // The layer legend comes and goes under the switch: the army rail below it follows.
  if(document.querySelector('.view-tools'))follow.observe(document.querySelector('.view-tools'));
  // A lesson's target moves out from under her line or the army card when either one grows.
  const again=()=>{if(typeof stackRightHud==='function')stackRightHud();if(typeof lesson!=='undefined'&&lesson&&typeof guidePan==='function'){guidePan();placeMarkers();}};
  const cover=new ResizeObserver(again);for(const id of ['bubble','army-panel','report'])if($(id))cover.observe($(id));
  // Her line pops in with a scale: measured mid-pop it looks smaller than it ends up.
  $('bubble')?.addEventListener?.('animationend',again);}
// Every successful action is saved immediately; closing a stale tab must not overwrite a newer save.
installFeeDisclosure(document);
campaignUI=installCampaignUI({getState:()=>state,run:(action,options)=>runAction(action,options),esc,icon,toast,portrait:portraitUrl,priceHtml,beginMapPick,tileName,goToTile,showGarrison,
  openTech:id=>{campaignUI.setTechPick(id);showManagement({tab:'tech'});},cityOnMap:back=>cityOnMap(back),focusShip:key=>{worldMap.centerOn(key);if(typeof selectArmy==='function')selectArmy(key);}});
window.Mistbound=Object.freeze({map:worldMap,account:()=>({login:account.login,user:account.user,cloud:cloud?{...cloud.sync}:null}),guide:()=>{const g=guideNow();return g&&{id:g.step.id,info:Boolean(g.info),tile:g.tile,petal:g.petal,el:g.el,army:g.army,order:g.order};},army:key=>selectArmy(key,{center:true}),armyState:()=>{const home=armyTile();return {key:home?armyKey:null,target:armyTarget,move:home?armyMoveKeys(home):[],attack:home?armyAttackKeys(home):[],banner:home?worldMap.bannerOf(home.key):null};},getState:()=>JSON.parse(serializeGame(state)),dispatch:action=>runAction(action),validateMod:mod=>validateMod(mod,state),exportSave:()=>serializeGame(state),select:key=>selectTile(key),extend:typeof registerTileAction==='function'?Object.freeze({tile:registerTileAction,bond:registerBondAction,captive:registerCaptiveAction,sheet:registerSheetAction,list:listExtensions}):null});
seenLevelSeq=state.levelSeq||0;loadDialogues();fetch('dialogue/diplomacy.json').then(r=>r.ok?r.json():null).then(d=>{diploLines=d;}).catch(()=>{});// Lines are looked up when spoken, so a slow load only delays flavour.
selectedKey=capitalKey();worldMap.setState(state);worldMap.zoomBy(isPhone()?.8:Math.max(.8,Math.min(1.5,(window.innerWidth-330)/960,(window.innerHeight-90)/640)));worldMap.centerOn(selectedKey);render();saveAuto();
const leaveMenu=()=>{$('title-screen').hidden=true;render();queueMicrotask(nextOverlay);};
$('menu-continue').onclick=leaveMenu;
$('menu-import').onclick=showTitleImport;
function enterWorld(world,tutorialState){
  quickDefense.clear();
  state=world;tutorial=tutorialState;pendingExternalSave=null;saveProgress.exportedState=null;saveProgress.exportInitiatedState=null;
  reportItems=[];dispatchFrom=null;attackFrom=null;attackTroops=null;moveTroops=null;leftBehind=new Set();if(typeof armyKey!=='undefined'){armyKey=null;armyTarget=null;worldMap.setArmy?.(null);worldMap.setRoute?.(null);}seenLevelSeq=state.levelSeq||0;lastGuideTile=null;guideCache={id:null,tile:null};flowerOpen=false;
  selectedKey=capitalKey();worldMap.setState(state);saveAuto();render();worldMap.centerOn(selectedKey);
  if($('modal').open)closeModal();
  warmWorld();
}
function startGame(seed,options){realGame=true;enterWorld(createGame(seed,{...options,mods:loadMods()}),{...tutorial,dismissed:true,coached:true,seenNotice:0,seenWar:0});leaveMenu();}
/** The tutorial is a short guided run on its own map. It neither reads nor writes the real save. */
function startTutorial(){
  lesson={state,tutorial};GUIDE=GUIDE_BASIC;
  enterWorld(createGame('moe-tutorial'),{...freshTutorial(),dismissed:false});
  leaveMenu();
}
/** The advanced lesson's world: mid-game, built by hand so every step has something real to act on. */
function advancedWorld(){
  const world=createGame('moe-advanced'),me=world.playerId,strip=[1,2,3,4,5,6,7];
  world.turn=24;world.history=[];world.milestone.level=3;
  // Nobody starts a fight during the lesson: the other courts stay under a long truce of their own.
  for(const faction of Object.values(world.factions))faction.graceUntilTurn=faction.isPlayer?0:90;
  Object.assign(world.factions[me],{gold:320,supply:140});
  for(const r of strip){
    const key=`0,${r}`;
    world.tiles[key]||={key,q:0,r,terrainId:'plains',ownerId:null,troops:0,food:0,garrison:[],field:[],building:null,buildingLevel:0,isCapital:false,capitalOf:null,discovered:true,ruinClaimed:false};
    Object.assign(world.tiles[key],{terrainId:r%3===0?'meadow':'plains',ownerId:me,troops:8,discovered:true,garrison:[],field:[],building:r%2?'farm':'mine',buildingLevel:1,road:r<=2});
  }
  for(const tile of Object.values(world.tiles))if(tile.ownerId===me||tile.ownerId==='mygo'||Math.abs(tile.q)<=2)tile.discovered=true;
  const home=world.tiles[world.factions[me].capitalKey],[lead,a,b,c,d]=world.recruitedHeroIds;
  for(const tile of Object.values(world.tiles)){tile.garrison=tile.garrison.filter(id=>!world.recruitedHeroIds.includes(id));tile.field=tile.field.filter(id=>!world.recruitedHeroIds.includes(id));}
  home.troops=24;home.garrison=[lead,b];home.field=[a];
  Object.assign(world.tiles['0,7'],{troops:16,field:[c,d]});
  // A war that is going well, so the peace table has something to offer.
  world.relations[[me,'mygo'].sort().join('|')]={status:'war',favor:-34,until:0,since:18,trade:false,talkTurn:0,war:{by:me,cb:'grudge',since:18,score:36},notes:[{turn:18,delta:-30,why:'开战'},{turn:21,delta:-4,why:'夺取领土'}]};
  world.factions.mygo.gold=60;
  // One guest in the cells.
  const guest='taki';
  if(world.characterOwners[guest]==='mygo'){
    for(const tile of Object.values(world.tiles)){tile.garrison=tile.garrison.filter(id=>id!==guest);tile.field=tile.field.filter(id=>id!==guest);}
    registerCapture(world,guest,me,'mygo','lesson.advanced');
    world.growth[guest]||={...world.growth[lead],captured:1};
  }
  world.metrics.land=strip.length;world.milestone.baseline={...world.metrics};
  return world;
}
function startAdvancedTutorial(){
  lesson={state,tutorial,advanced:true};GUIDE=GUIDE_ADV;
  enterWorld(advancedWorld(),{...freshTutorial(),dismissed:false,coached:true});
  if($('modal').open)closeModal();
  leaveMenu();
}
function endTutorial(){
  if(!lesson)return;
  const kept=lesson;lesson=null;GUIDE=GUIDE_BASIC;
  document.querySelector('[data-layer="terrain"]')?.click();
  enterWorld(kept.state,kept.tutorial);showMenu();
}
function showMenu(){
  if($('modal').open)closeModal();
  $('menu-continue').hidden=!realGame;
  if(realGame)$('menu-continue').textContent=`继续游戏 · 第 ${state.turn} 回合`;
  const custom=$('menu-custom');delete custom.dataset.sure;custom.textContent='自定义开局';
  $('title-screen').hidden=false;placeMarkers();
}
/* 世界地图 on the new-game screen: two map cards; the world map shows the real Earth with every start ringed. */
function newGameMapHtml(){
  if(typeof EARTH==='undefined')return '';
  const kind=showNewGame.map==='earth'?'earth':'endless',start=showNewGame.start||'random',spec=WORLD_STARTS.find(s=>s.id===start);
  const cards=[['endless','无限大陆','随机生成，没有尽头：越往外走越远，新的国家在迷雾里出现。'],['earth','世界地图',`真实的地球：${EARTH.cols}×${EARTH.rows} 格，约 ${EARTH.land} 块陆地。大洋要学会造船才过得去，世界探完就到头了。`]];
  const hint=spec?`从「${spec.name}」出发：四个最早的邻国就在附近的真实陆地上，其余国家在你探索时从迷雾里出现。`:'开局时随机挑一个起点。';
  return `<h3>选择地图</h3><div class="map-picks">${cards.map(([id,name,about])=>`<button type="button" class="map-pick ${kind===id?'on':''}" data-map="${id}" aria-pressed="${kind===id}"><b>${name}</b><small>${about}</small></button>`).join('')}</div>${kind==='earth'?`<div class="earth-pick"><canvas id="earth-preview" class="earth-preview" role="img" aria-label="世界地图，红圈是可选的起点"></canvas><div class="earth-starts" role="group" aria-label="从哪里开始">${[...WORLD_STARTS.map(s=>[s.id,s.name]),['random','随机']].map(([id,name])=>`<button type="button" data-start="${id}" aria-pressed="${start===id}">${esc(name)}</button>`).join('')}</div><p class="form-hint">${esc(hint)}</p></div>`:''}`;
}
const EARTH_PREVIEW={size:2.4,sea:'#173954'};
function earthPreviewCenter(col,row){const S=EARTH_PREVIEW.size;return {x:Math.sqrt(3)*S*(col+.5+(row&1)*.5)+2,y:S+1.5*S*row+2};}
function drawEarthPreview(canvas,startId,live=false){
  const S=EARTH_PREVIEW.size,W=Math.ceil((EARTH.cols+.5)*Math.sqrt(3)*S)+4,H=Math.ceil(EARTH.rows*1.5*S+S*.5)+4,dpr=Math.min(2,window.devicePixelRatio||1),ctx=canvas.getContext?.('2d');
  if(!ctx)return;
  canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);canvas.style.aspectRatio=`${W} / ${H}`;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle=EARTH_PREVIEW.sea;ctx.fillRect(0,0,W,H);
  for(let row=0;row<EARTH.rows;row++)for(let col=0;col<EARTH.cols;col++){
    const id=EARTH.codes[EARTH.grid[row][col]];
    let tile=null;if(live){const o=state.world.origin,r=row-o.row,q=col-o.col+Math.floor(o.row/2)-Math.floor(row/2);tile=state.tiles[`${q},${r}`];}
    if(id==='ocean'&&!live)continue;
    const {x,y}=earthPreviewCenter(col,row);ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-30);ctx.lineTo(x+S*1.04*Math.cos(a),y+S*1.04*Math.sin(a));}ctx.closePath();
    if(live&&!tile?.discovered){ctx.fillStyle=id==='ocean'?'#0c1622':'#25303c';ctx.fill();continue;}
    if(id==='ocean'){ctx.fillStyle=EARTH_PREVIEW.sea;ctx.fill();continue;}
    ctx.fillStyle=id==='lake'?'#4f87a3':state?.terrainTypes?.[tile?.terrainId||id]?.color||'#8d9d73';ctx.fill();
    const owner=tile?.ownerId&&state.factions[tile.ownerId];
    if(owner){ctx.globalAlpha=owner.isPlayer?.75:.62;ctx.fillStyle=owner.color||'#ffffff';ctx.fill();ctx.globalAlpha=1;}
  }
  if(live){for(const canal of Object.values(state.campaign?.canals||{})){const t=state.tiles[canal.key];if(!t?.discovered)continue;const cell=worldCellOf(state,t.q,t.r);if(!cell)continue;const {x,y}=earthPreviewCenter(cell.col,cell.row);ctx.beginPath();ctx.arc(x,y,3.1,0,Math.PI*2);ctx.fillStyle=canal.status==='open'?'#4fe3ff':'#ffd46b';ctx.fill();ctx.lineWidth=1.1;ctx.strokeStyle='#0b2236';ctx.stroke();}for(const f of Object.values(state.factions)){const t=f.alive&&state.tiles[f.capitalKey];if(!t?.discovered)continue;const cell=worldCellOf(state,t.q,t.r);if(!cell)continue;const {x,y}=earthPreviewCenter(cell.col,cell.row);ctx.beginPath();ctx.arc(x,y,f.isPlayer?4.6:3.4,0,Math.PI*2);ctx.fillStyle=f.isPlayer?'#ffc83d':'#ffffff';ctx.fill();ctx.lineWidth=1.4;ctx.strokeStyle='#0b0f18';ctx.stroke();}return;}
  for(const spec of WORLD_STARTS){
    const {x,y}=earthPreviewCenter(spec.col,spec.row),on=spec.id===startId;
    ctx.beginPath();ctx.arc(x,y,on?7:4.5,0,Math.PI*2);ctx.fillStyle=on?'#ff3d63':'rgba(255,61,99,.35)';ctx.fill();ctx.lineWidth=on?2.5:1.6;ctx.strokeStyle='#ffffff';ctx.stroke();
  }
}
/** The start nearest a click on the preview, if the click lands close to one. */
function earthStartAt(canvas,event){
  const box=canvas.getBoundingClientRect(),S=EARTH_PREVIEW.size,W=Math.ceil((EARTH.cols+.5)*Math.sqrt(3)*S)+4,k=W/box.width,x=(event.clientX-box.left)*k,y=(event.clientY-box.top)*k;
  let best=null,dist=Infinity;for(const spec of WORLD_STARTS){const c=earthPreviewCenter(spec.col,spec.row),d=Math.hypot(c.x-x,c.y-y);if(d<dist){dist=d;best=spec;}}
  return dist<=26?best.id:null;
}
/** 世界全图: the whole Earth — fog where nobody has looked (the coasts still faintly drawn), every nation's land in its colour,
 * capitals as dots. A click goes there on the map and, on explored land, opens that tile. */
function showWorldOverview(){
  if(!state.world||typeof EARTH==='undefined')return;
  const seen=Object.values(state.tiles).filter(t=>t.discovered).length,share=Math.round(seen/(EARTH.cols*EARTH.rows)*100);
  const nations=Object.values(state.factions).filter(f=>f.alive&&(f.isPlayer||Object.values(state.tiles).some(t=>t.discovered&&t.ownerId===f.id))).sort((a,b)=>Number(Boolean(b.isPlayer))-Number(Boolean(a.isPlayer)));
  const legend=nations.map(f=>`<span><i style="background:${esc(f.color)}"></i>${esc(f.name)}${f.isPlayer?'（你）':''}</span>`).join('');
  openReading('世界全图',state.world.start&&WORLD_STARTS.find(s=>s.id===state.world.start)?.name||'',`<div class="world-overview"><canvas id="world-canvas" class="earth-preview world-canvas" role="img" aria-label="世界全图"></canvas><p class="form-hint">已探索 ${share}% 的世界 · 暗处还在迷雾里 · 点地图上任意一处，大地图就跳过去。</p><div class="world-legend">${legend}</div></div>`,()=>{
    const canvas=$('world-canvas');if(!canvas)return;drawEarthPreview(canvas,null,true);
    canvas.onclick=e=>{const key=worldKeyAt(canvas,e);if(!key)return;closeModal();worldMap.centerOn(key);if(state.tiles[key]?.discovered)selectTile(key);};
  });
}
/** The tile key under a click on the world canvas, if that cell is on the map. */
function worldKeyAt(canvas,event){
  const box=canvas.getBoundingClientRect(),S=EARTH_PREVIEW.size,W=Math.ceil((EARTH.cols+.5)*Math.sqrt(3)*S)+4,k=W/box.width,x=(event.clientX-box.left)*k,y=(event.clientY-box.top)*k;
  const row=Math.max(0,Math.min(EARTH.rows-1,Math.round((y-S-2)/(1.5*S)))),col=Math.max(0,Math.min(EARTH.cols-1,Math.round((x-2)/(Math.sqrt(3)*S)-.5-(row&1)*.5)));
  const o=state.world.origin,r=row-o.row,q=col-o.col+Math.floor(o.row/2)-Math.floor(row/2);
  return inWorld(state,q,r)?`${q},${r}`:null;
}
function showNewGame(seed=null){
  const cat=showNewGame.cat||'all',cats=[['all','全部'],['band','乐队企划'],['idol','偶像企划'],['sekai','歌姬与世界'],['anime','异界与日常']];
  const titleOf=band=>{const spec=STARTER_BANDS[band];return spec?.label||GROUPS[spec?.group||band]||band;};
  const rosterOf=band=>{const spec=STARTER_BANDS[band],ids=spec?.members||CHARACTER_DEFINITIONS.filter(c=>c.group===(spec?.group||band)).map(c=>c.id);return [spec?.leader,...ids.filter(id=>id!==spec?.leader)].filter(Boolean).map(id=>CHARACTER_DEFINITIONS.find(c=>c.id===id)).filter(Boolean);};
  const visible=Object.keys(STARTER_BANDS).filter(band=>!STARTER_BANDS[band]?.discordNgOnly&&(cat==='all'||STARTER_BANDS[band].category===cat));
  const picked=rosterOf(newBand),leadName=picked[0]?.name||'';
  const html=`<div class="setup"><h3>选择开局阵容</h3><p class="form-hint">当前已选：<b>${esc(titleOf(newBand))}</b>（领军 ${esc(leadName)} · ${picked.length>1?`${picked.length} 人同行`:'单人开局'}）。其余阵容与同作角色会成为邻国或在迷雾中等待招募。</p><div class="gov-tabs setup-cats" role="tablist" aria-label="阵容分类">${cats.map(([id,label])=>`<button type="button" role="tab" data-band-cat="${id}" aria-selected="${cat===id}"><span>${label}</span></button>`).join('')}</div><div class="bands">${visible.map(band=>{const list=rosterOf(band),lead=list[0];return `<button type="button" class="band ${band===newBand?'on':''}" data-band="${band}"><span class="band-head"><b>${esc(titleOf(band))}</b><small>${list.length} 人 · ${esc(lead?.name||'')}</small></span><span class="band-faces">${list.map(c=>`<i title="${esc(c.name)}"><img src="${esc(portraitUrl(c,'smile')||'')}" alt="${esc(c.name)}" loading="lazy" /></i>`).join('')}</span></button>`;}).join('')}</div>${newGameMapHtml()}<h3>给国家起个名字</h3><input id="nation-input" class="nation-input" maxlength="16" placeholder="${esc(titleOf(newBand))}" /><div class="form-actions"><button class="small-button secondary" id="setup-back">返回</button><button class="small-button" id="setup-go">开始</button></div></div>`;
  openModal('自定义开局','',html,()=>{
    $('modal').className='screen scene bg-stage';
    document.querySelectorAll('[data-band-cat]').forEach(b=>b.onclick=()=>{showNewGame.cat=b.dataset.bandCat;const name=$('nation-input').value;showNewGame(seed);$('nation-input').value=name;});
    document.querySelectorAll('[data-band]').forEach(b=>b.onclick=()=>{newBand=b.dataset.band;const name=$('nation-input').value,scroll=document.querySelector('.bands')?.scrollTop||0;showNewGame(seed);$('nation-input').value=name;const list=document.querySelector('.bands');if(list)list.scrollTop=scroll;});
    $('setup-back').onclick=closeModal;
    const keep=fn=>()=>{const name=$('nation-input').value,scroll=$('modal-body').scrollTop;fn();showNewGame(seed);$('nation-input').value=name;$('modal-body').scrollTop=scroll;};
    document.querySelectorAll('[data-map]').forEach(b=>b.onclick=keep(()=>{showNewGame.map=b.dataset.map;}));
    document.querySelectorAll('[data-start]').forEach(b=>b.onclick=keep(()=>{showNewGame.start=b.dataset.start;}));
    const preview=$('earth-preview');if(preview){drawEarthPreview(preview,showNewGame.start||'random');preview.onclick=e=>{const id=earthStartAt(preview,e);if(id)keep(()=>{showNewGame.start=id;})();};}
    $('setup-go').onclick=()=>{const map=showNewGame.map==='earth'?'earth':'endless',start=showNewGame.start&&showNewGame.start!=='random'?showNewGame.start:null;startGame(seed||'moe-'+Date.now().toString(36),{band:newBand,name:$('nation-input').value.trim()||titleOf(newBand),...(map==='earth'?{map,start}:{})});};
  });
}
$('menu-new').onclick=startTutorial;if($('menu-advanced'))$('menu-advanced').onclick=startAdvancedTutorial;
$('menu-custom').onclick=()=>{const b=$('menu-custom');if(realGame&&!b.dataset.sure){b.dataset.sure='1';b.textContent='再点覆盖存档';return;}showNewGame();};
$('notice-ok').onclick=()=>{$('notice-screen').hidden=true;};
$('menu-settings').onclick=()=>showSettings();$('menu-guide').onclick=showGuide;$('menu-practice').onclick=startPractice;$('menu-workshop').onclick=()=>showWorkshop();
showMenu();warmWorld();initAccount();
let buildId=null;$('build-tag').textContent=`规则 ${RULES_VERSION}`;
async function checkBuild(){
  try{
    const r=await fetch('version.txt',{cache:'no-store'});if(!r.ok)return;
    const id=(await r.text()).trim();if(!/^\d{4}-\d{4}$/.test(id))return;
    if(buildId===null){buildId=id;$('build-tag').textContent=`版本 ${id} · 规则 ${RULES_VERSION}`;}
    else if(id!==buildId)$('update-note').hidden=false;
  }catch{}
}
$('update-note').onclick=()=>location.reload();
checkBuild();document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkBuild();});setInterval(checkBuild,180000);
if(!storageAvailable)toast('浏览器自动保存不可用，记得从存档面板导出进度。',true);

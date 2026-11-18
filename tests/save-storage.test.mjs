import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {createGame,perform,serializeGame,deserializeGame,getActions} from '../dist/engine.mjs';
import {saveStamp,sameWorld,sameGameContent,hasUnbackedChanges,persistBrowserSave} from '../dist/save-storage.mjs';
const app=await readFile(new URL('../dist/app.mjs',import.meta.url),'utf8');
const SAVE_KEY='mistbound.save.v2',TUTORIAL_KEY='mistbound.tutorial.v4';
function storage(){const values=new Map();return {values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};}
const newState=()=>createGame('ui-save-safety');
function withUndo(){const state=newState(),action=getActions(state,'0,0').find(item=>item.type==='road');return perform(state,action.action).state;}
function setup(state=newState()){
  const local=storage(),events={},messages=[],downloads=[],renders=[];
  local.setItem(SAVE_KEY,serializeGame(state));
  const modal={open:false,close(){this.open=false;}},warning={hidden:true};
  const context={state,realGame:true,practice:null,lesson:null,pendingExternalSave:null,storageAvailable:true,tutorial:{seenNotice:0,seenWar:0},SAVE_KEY,TUTORIAL_KEY,
    saveProgress:{mode:'full',savedState:state,storedStamp:saveStamp(state),exportedState:null,exportInitiatedState:null,alerted:false},saveStamp,sameWorld,sameGameContent,hasUnbackedChanges,persistBrowserSave,deserializeGame,serializeGame,
    localStorage:local,window:{addEventListener:(event,fn)=>events[event]=fn},$:id=>id==='modal'?modal:id==='save-warning'?warning:null,
    toast:(text,error)=>messages.push({text,error}),download:(...args)=>downloads.push(args),render:()=>renders.push(context.state),worldMap:{centerOn(){}},
    capitalKey:()=>context.state.factions[context.state.playerId].capitalKey,dialogueQueue:[],reportItems:[],modalRefresh:null,sceneInBattle:false,
    selectedKey:'0,0',dispatchFrom:'0,0',attackFrom:'0,0',moveTroops:2,attackTroops:2,leftBehind:new Set(),flowerOpen:true,seenLevelSeq:0};
  context.quickDefense={receipt:null,clear(){this.receipt=null;}};vm.createContext(context);vm.runInContext(app.slice(app.indexOf('function saveAuto('),app.indexOf('function toast(')),context);
  context.renderSaveStatus=()=>renders.push({mode:context.saveProgress.mode,conflict:!!context.pendingExternalSave});
  return {context,local,events,messages,downloads,renders,modal};
}

test('full browser save is minified, includes undo and round-trips through the real importer',()=>{
  const state=withUndo(),local=storage(),before=JSON.stringify(state),result=persistBrowserSave(state,{getStorage:()=>local,tutorial:{step:1}});
  assert.equal(result.ok,true);assert.equal(result.mode,'full');assert.equal(result.tutorialSaved,true);assert.equal(local.getItem(SAVE_KEY),before);assert.equal(JSON.stringify(state),before);
  const loaded=deserializeGame(local.getItem(SAVE_KEY));assert.equal(loaded.ok,true,loaded.error);assert.equal(loaded.state.history.length,state.history.length);assert.ok(state.history.length>0);
});

test('quota failure saves an independent history-free copy without mutating the live undo history',()=>{
  const state=withUndo(),before=JSON.stringify(state),local=storage(),set=local.setItem;local.setItem=(key,value)=>{if(key===SAVE_KEY&&JSON.parse(value).history.length)throw new Error('QuotaExceededError');set(key,value);};
  const result=persistBrowserSave(state,{getStorage:()=>local});assert.equal(result.ok,true);assert.equal(result.mode,'compact');assert.equal(result.attempts.length,2);assert.equal(JSON.stringify(state),before);
  const copy=JSON.parse(local.getItem(SAVE_KEY));assert.deepEqual(copy.history,[]);assert.equal(copy.historyTrimmed,true);assert.equal(deserializeGame(local.getItem(SAVE_KEY)).ok,true);
});

test('when full and compact writes both fail the old browser save survives',()=>{
  const state=withUndo(),before=JSON.stringify(state),local=storage();local.setItem(SAVE_KEY,'old-save');local.setItem=()=>{throw new Error('quota');};
  const result=persistBrowserSave(state,{getStorage:()=>local});assert.equal(result.ok,false);assert.equal(result.attempts.length,2);assert.equal(local.getItem(SAVE_KEY),'old-save');assert.equal(JSON.stringify(state),before);
});

test('blocked or missing browser storage returns a recoverable failure',()=>{
  for(const getStorage of [()=>{throw new Error('SecurityError');},()=>null,()=>({})]){const result=persistBrowserSave(newState(),{getStorage});assert.equal(result.ok,false);assert.equal(result.mode,'failed');assert.equal(result.attempts.length,0);}
});

test('tutorial preference failure does not misreport the saved game as lost',()=>{
  const local=storage(),set=local.setItem;local.setItem=(key,value)=>{if(key===TUTORIAL_KEY)throw new Error('quota');set(key,value);};
  const result=persistBrowserSave(newState(),{getStorage:()=>local,tutorial:{step:2}});assert.equal(result.ok,true);assert.equal(result.tutorialSaved,false);assert.ok(local.getItem(SAVE_KEY));
});

test('compact mode avoids repeatedly attempting an oversized full save',()=>{
  const state=withUndo(),local=storage(),result=persistBrowserSave(state,{getStorage:()=>local,preferCompact:true});assert.equal(result.attempts.length,1);assert.equal(result.mode,'compact');assert.ok(state.history.length);
});

test('unbacked change checks ignore demos and accept only actual saved state or explicitly acknowledged file',()=>{
  const state=newState(),older=structuredClone(state);assert.equal(hasUnbackedChanges(state,{savedState:state}),false);assert.equal(hasUnbackedChanges(state,{savedState:older}),true);assert.equal(hasUnbackedChanges(state,{exportedState:state}),false);
  for(const settings of [{realGame:false},{practice:{}},{lesson:{}}])assert.equal(hasUnbackedChanges(state,settings),false);
});

test('real autosave handler surfaces persistent failure once while gameplay remains possible',()=>{
  const h=setup(withUndo()),prior=h.local.getItem(SAVE_KEY),oldStamp=h.context.saveProgress.storedStamp;h.context.localStorage.setItem=()=>{throw new Error('quota');};
  h.context.state=perform(h.context.state,{type:'endTurn'}).state;assert.equal(h.context.saveAuto().ok,false);assert.equal(h.context.saveAuto().ok,false);assert.equal(h.messages.length,1);assert.equal(h.local.getItem(SAVE_KEY),prior);assert.equal(h.context.saveProgress.storedStamp,oldStamp);assert.equal(h.context.saveProgress.mode,'failed');
  const action=getActions(h.context.state,'0,0').find(item=>item.enabled&&item.type==='recruit');assert.ok(action);const result=perform(h.context.state,action.action);assert.equal(result.ok,true);h.context.state=result.state;h.context.saveAuto();assert.equal(h.messages.length,1);
  let prevented=false;h.events.beforeunload({preventDefault(){prevented=true;}});assert.equal(prevented,true);
});

test('successful retry restores durability without changing the world',()=>{
  const h=setup(withUndo());h.context.state=perform(h.context.state,{type:'endTurn'}).state;const before=serializeGame(h.context.state);h.context.saveProgress.mode='failed';assert.equal(h.context.saveAuto({forceFull:true}).ok,true);assert.equal(h.context.saveProgress.savedState,h.context.state);assert.equal(serializeGame(h.context.state),before);
  let prevented=false;h.events.beforeunload({preventDefault(){prevented=true;}});assert.equal(prevented,false);
});

test('an older same-world save is a conflict and cannot silently overwrite the open campaign',()=>{
  const older=newState(),state=perform(older,{type:'endTurn'}).state,h=setup(state);h.events.storage({key:SAVE_KEY,newValue:serializeGame(older)});assert.equal(h.context.state,state);assert.equal(h.context.pendingExternalSave.revision,older.revision);assert.equal(h.context.saveAuto().mode,'conflict');
  let prevented=false;h.events.beforeunload({preventDefault(){prevented=true;}});assert.equal(prevented,true);
});

test('newer same-world saves auto-sync only when current changes were already durable',()=>{
  const state=newState(),next=perform(state,{type:'endTurn'}).state,clean=setup(state);clean.events.storage({key:SAVE_KEY,newValue:serializeGame(next)});assert.equal(clean.context.state.revision,next.revision);assert.equal(clean.context.pendingExternalSave,null);assert.equal(clean.context.dispatchFrom,null);
  const dirty=setup(state);dirty.context.saveProgress.savedState=null;dirty.events.storage({key:SAVE_KEY,newValue:serializeGame(next)});assert.equal(dirty.context.state,state);assert.ok(dirty.context.pendingExternalSave);
});

test('cross-world and divergent equal-revision branches require explicit choice even on a clean page',()=>{
  for(const variant of ['different-world','equal-revision']){const state=newState(),h=setup(state),next=variant==='different-world'?createGame('another-world'):structuredClone(state);if(variant==='equal-revision')next.factions[next.playerId].gold++;
    h.events.storage({key:SAVE_KEY,newValue:serializeGame(next)});assert.equal(h.context.state,state);assert.ok(h.context.pendingExternalSave);assert.equal(h.context.saveProgress.savedState,null);assert.equal(h.context.saveAuto().mode,'conflict');h.context.exportCurrentSave();assert.equal(h.downloads.length,1);assert.equal(h.context.state,state);
  }
  assert.equal((app.match(/addEventListener\('storage'/g)||[]).length,1,'old unconditional listener must not remain');
});

test('same-game comparison ignores only optional undo history and object ordering',()=>{
  const state=withUndo(),copy={...state,history:[],historyTrimmed:true};assert.equal(sameGameContent(state,copy),true);copy.factions=Object.fromEntries(Object.entries(copy.factions).reverse());assert.equal(sameGameContent(state,copy),true);
  const changed=structuredClone(copy);changed.factions[changed.playerId].gold++;assert.equal(sameGameContent(state,changed),false);
  const h=setup(state);h.events.storage({key:SAVE_KEY,newValue:JSON.stringify(copy)});assert.equal(h.context.state,state);assert.ok(h.context.state.history.length);assert.equal(h.context.saveProgress.mode,'compact');
});

test('download initiation cannot suppress the unload warning until explicit confirmation of that exact version',()=>{
  const h=setup(withUndo());h.context.saveProgress.savedState=null;assert.equal(h.context.exportCurrentSave(),true);assert.equal(h.context.saveProgress.exportedState,null);assert.equal(h.context.saveProgress.exportInitiatedState,h.context.state);assert.equal(h.downloads.length,1);
  let prevented=false;h.events.beforeunload({preventDefault(){prevented=true;}});assert.equal(prevented,true);assert.equal(h.context.confirmExportBackup(),true);prevented=false;h.events.beforeunload({preventDefault(){prevented=true;}});assert.equal(prevented,false);
  h.context.state=perform(h.context.state,{type:'endTurn'}).state;assert.equal(h.context.confirmExportBackup(),false);prevented=false;h.events.beforeunload({preventDefault(){prevented=true;}});assert.equal(prevented,true);
});

test('a failed export keeps the dirty warning and an invalid external save cannot replace state',()=>{
  const h=setup();h.context.saveProgress.savedState=null;h.context.download=()=>{throw new Error('blocked');};assert.equal(h.context.exportCurrentSave(),false);assert.equal(h.context.saveProgress.exportInitiatedState,null);assert.equal(h.context.saveProgress.exportedState,null);
  const current=h.context.state;h.events.storage({key:SAVE_KEY,newValue:'bad JSON'});assert.equal(h.context.state,current);assert.equal(h.context.pendingExternalSave,null);assert.match(h.messages[0].text,/导出未完成/);
});

/** Browser persistence only. No world mutation, gameplay, or download-success assumptions. */
export const saveStamp = state => ({seed:state?.seed,playerId:state?.playerId,turn:state?.turn,revision:state?.revision||0});
export const sameWorld = (left,right) => Boolean(left&&right&&left.seed===right.seed&&left.playerId===right.playerId);

// A download click is not evidence that a file reached disk. exportedState is set only after
// the player explicitly confirms saving that exact state, never by download initiation.
export function hasUnbackedChanges(state,{realGame=true,practice=false,lesson=false,savedState=null,exportedState=null}={}){
  return Boolean(realGame&&!practice&&!lesson&&state!==savedState&&state!==exportedState);
}

const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value;
export function sameGameContent(left,right){
  if(!sameWorld(left,right))return false;
  const game=state=>Object.fromEntries(Object.entries(state).filter(([key])=>!['history','historyTrimmed'].includes(key)));
  return JSON.stringify(canonical(game(left)))===JSON.stringify(canonical(game(right)));
}

export function persistBrowserSave(state,{getStorage=()=>globalThis.localStorage,saveKey='mistbound.save.v2',tutorialKey='mistbound.tutorial.v4',tutorial,preferCompact=false}={}){
  let storage;const stamp=saveStamp(state),attempts=[];
  try{storage=getStorage();if(!storage||typeof storage.setItem!=='function')throw new Error('浏览器存储不可用');}
  catch(error){return {ok:false,mode:'failed',stamp,attempts,reason:error.message||String(error)};}
  let lastError;
  for(const mode of preferCompact?['compact']:['full','compact']){
    try{
      // The browser quota fallback drops undo history from the saved COPY only.
      const copy=mode==='compact'?{...state,history:[],historyTrimmed:true}:state;
      const text=JSON.stringify(copy);storage.setItem(saveKey,text);attempts.push({mode,ok:true,chars:text.length});
      let tutorialSaved=true;
      if(tutorial!==undefined)try{storage.setItem(tutorialKey,JSON.stringify(tutorial));}catch{tutorialSaved=false;}
      return {ok:true,mode,stamp,chars:text.length,tutorialSaved,attempts};
    }catch(error){lastError=error;attempts.push({mode,ok:false,reason:error.message||String(error)});}
  }
  return {ok:false,mode:'failed',stamp,attempts,reason:lastError?.message||String(lastError)};
}

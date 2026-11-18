/** Yield across a paint before synchronous world work. The bounded timer also handles
 * background tabs, where animation frames may stop altogether. No action is queued twice. */
export function afterNextPaint(callback,{requestFrame=globalThis.requestAnimationFrame?.bind(globalThis),cancelFrame=globalThis.cancelAnimationFrame?.bind(globalThis),setTimer=setTimeout,clearTimer=clearTimeout}={}){
  let done=false,first=null,second=null,timer=null;
  const cancel=()=>{done=true;if(timer!==null)clearTimer(timer);if(first!==null)cancelFrame?.(first);if(second!==null)cancelFrame?.(second);};
  const finish=()=>{if(done)return;cancel();callback();};
  timer=setTimer(finish,requestFrame?120:0);
  if(requestFrame)first=requestFrame(()=>{if(!done)second=requestFrame(finish);});
  return cancel;
}

/** A UI-only single-flight gate. The engine and public dispatch remain synchronous.
 * Inputs made during settlement are discarded, including a pointer/key released later. */
export function createTurnInput({afterPaint=afterNextPaint,now=()=>performance.now(),onBusy=()=>{},onError=error=>{throw error;}}={}){
  let busy=false,executing=false,completedAt=-Infinity,blockedClick=false,keyboardClickUntil=-Infinity;
  const pressedKeys=new Set(),heldKeys=new Set(),heldPointers=new Set();
  const keyOf=event=>{const key=event?.code||event?.key;return key===' '||key==='Spacebar'?'Space':key;};
  const activationKey=key=>['Enter','NumpadEnter','Space'].includes(key);
  const ordinaryKey=key=>key&&!/^(?:Control|Meta|Alt|Shift)(?:Left|Right)?$/.test(key);
  const keyboardClick=event=>event?.detail===0&&now()<=keyboardClickUntil;
  const stale=event=>Number.isFinite(event?.timeStamp)&&event.timeStamp>=0&&event.timeStamp<=completedAt;
  const canRequest=event=>!busy&&!event?.repeat&&!(event?.detail>1)&&!stale(event)&&!keyboardClick(event);
  const release=()=>{
    busy=false;
    // A release before a long settlement finishes still needs a trailing-click fence.
    // Once every activation key is up, bound that fence for assistive clicks with no keydown.
    if(keyboardClickUntil===Infinity&&![...heldKeys].some(activationKey))keyboardClickUntil=now()+250;
    onBusy(false);
  };
  return {
    get busy(){return busy;},
    get executing(){return executing;},
    canRequest,
    request(run,event){
      if(!canRequest(event))return false;
      const key=keyOf(event);if(event?.type==='keydown'&&ordinaryKey(key))pressedKeys.add(key);
      // The initial Enter keydown precedes its native click. Quarantine it even if
      // this turn is fast enough to finish before the first repeat event arrives.
      for(const pressed of pressedKeys){heldKeys.add(pressed);if(activationKey(pressed))keyboardClickUntil=Infinity;}
      busy=true;let ran=false;
      try{
        onBusy(true);
        afterPaint(()=>{
          if(ran)return;ran=true;executing=true;
          try{run();}catch(error){onError(error);}finally{
            executing=false;completedAt=now();
            // Keep the lock through a result paint so already queued input cannot click
            // the new world, a newly opened battle, or a dialog under the old button.
            try{afterPaint(release);}catch(error){release();onError(error);}
          }
        });
      }catch(error){release();onError(error);return false;}
      return true;
    },
    block(event){
      const type=event.type,key=keyOf(event),pointer=event.pointerId??'mouse';
      if(type==='pointercancel'){heldPointers.delete(pointer);return false;}
      if(type==='keydown'||type==='keyup'){
        const modified=event.ctrlKey||event.metaKey||event.altKey;
        if(type==='keyup'){
          pressedKeys.delete(key);const held=heldKeys.delete(key),block=busy||stale(event)||held;
          if(block&&activationKey(key))keyboardClickUntil=busy?Infinity:now()+250;
          // Tracking must be cleaned even when a modifier preserves browser defaults.
          return modified?false:block;
        }
        const fresh=!event.repeat;
        if(fresh)heldKeys.delete(key); // A new physical press is deliberate, even if keyup was lost.
        if(ordinaryKey(key))pressedKeys.add(key);
        if(modified){if(fresh)keyboardClickUntil=-Infinity;return false;}
        const block=busy||stale(event)||heldKeys.has(key);
        if(block){if(ordinaryKey(key))heldKeys.add(key);if(activationKey(key))keyboardClickUntil=Infinity;}
        else if(fresh)keyboardClickUntil=-Infinity;
        return block;
      }
      let block=busy||stale(event);
      if(type==='pointerdown'){
        if(block)heldPointers.add(pointer);else{heldPointers.delete(pointer);blockedClick=false;keyboardClickUntil=-Infinity;}
      }else if(type==='pointerup'){
        block=heldPointers.delete(pointer)||block;if(block)blockedClick=true;
      }else if(type==='click'){
        block=block||keyboardClick(event)||(event.detail!==0&&blockedClick);blockedClick=false;
      }
      return block;
    },
    clearHeld(){pressedKeys.clear();heldKeys.clear();heldPointers.clear();blockedClick=false;keyboardClickUntil=-Infinity;},
  };
}

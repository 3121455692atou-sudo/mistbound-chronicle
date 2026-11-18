/** Consume only a trailing pointer click where a successful rally confirmation just vanished.
 * Other positions, keyboard activation and modified clicks keep their normal behavior. */
export function createClickThroughGuard({now=()=>performance.now(),lifetime=500}={}){
  let pending=null;
  return {
    arm(event,rect){
      pending=null;
      if(!event||!(event.detail>0)||!rect||![rect.left,rect.top,rect.right,rect.bottom].every(Number.isFinite))return false;
      pending={left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom,until:now()+lifetime};return true;
    },
    block(event){
      if(!pending)return false;
      if(now()>pending.until||event.button!==undefined&&event.button!==0||event.ctrlKey||event.metaKey||event.altKey||event.type==='click'&&event.detail===0){pending=null;return false;}
      if(!['pointerdown','pointerup','click'].includes(event.type))return false;
      const inside=Number.isFinite(event.clientX)&&Number.isFinite(event.clientY)&&event.clientX>=pending.left&&event.clientX<=pending.right&&event.clientY>=pending.top&&event.clientY<=pending.bottom;
      if(!inside){if(event.type==='pointerdown'||event.type==='click')pending=null;return false;}
      if(event.type==='click')pending=null;
      return true;
    },
    clear(){pending=null;},
  };
}

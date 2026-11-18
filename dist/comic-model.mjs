/** Presentation-only action lease. It never calculates legality or mutates a world. */
export function bindViewAction(button,{getState,isCurrent,run}) {
  const shownState=getState();let used=false;
  button.setAttribute('data-comic-commit','');
  const handle=event=>{
    if(used||button.onclick!==handle||!isCurrent()||getState()!==shownState||event?.detail>1||button.disabled)return;
    used=true;
    try{return run(event);}finally{
      // A rejected command can be retried while the exact same view/state is still open.
      // A successful command, replaced handler, Back, or Close retires this lease.
      if(getState()===shownState&&isCurrent()&&button.onclick===handle)used=false;
    }
  };
  button.onclick=handle;return handle;
}

import { ACCESS_COPY as TEXT, formatAccess } from './multiplayer-copy.mjs?v=1118-1603';
import { bandRoster } from './multiplayer-engine.mjs?v=1118-1603';
import { mangaPage, esc } from './multiplayer-view.mjs?v=1118-1603';

/** Room invitations are delegated local identities, never presented as verified OpenAI accounts. */
export class AgentInvites {
  constructor({ request, toast, confirm }) {
    Object.assign(this, { request, toast, confirm });
    this.grants=[];
    this.dialog = document.createElement('dialog');
    this.dialog.id = 'agent-dialog'; this.dialog.className = 'screen sheet-mode page-screen';
    this.dialog.setAttribute('aria-label', TEXT.agentTitle);
    document.body.append(this.dialog);
    this.dialog.addEventListener('close', () => { this.fresh = null; this.dialog.innerHTML = ''; });
  }
  async open(room) {
    this.room = room; this.fresh = null;this.draftName=null;
    if (!this.dialog.open) this.dialog.showModal();
    await this.refresh();
  }
  async refresh() {
    try {
      const result = await this.request('/agent-grants');
      this.grants = result.grants; this.render();
    } catch (error) { this.toast(error.message); this.dialog.close(); }
  }
  contextChanged(room) {
    if(!this.room)return;
    const before=this.room;
    if(room?.code===this.room.code)this.room=room;
    else {this.room=null;this.fresh=null;}
    if(this.dialog.open && (!this.room || ['title','status','role','isHost'].some(k=>before[k]!==this.room[k])))this.render();
  }
  canIssue() {
    return this.room?.edition==='sfw' && this.room.status!=='finished'
      && (this.room.isHost||this.room.role==='player');
  }
  async create(name,replaceId=null) {
    if(!this.canIssue())return;
    try {
      const result=await this.request('/agent-grants',{code:this.room.code,name,replaceId,requestId:crypto.randomUUID()});
      this.fresh=result.grant||null;this.draftName=null;await this.refresh();
      if(!result.grant)this.toast(TEXT.agentLinkReady);
    } catch(error){this.toast(error.message);await this.refresh();}
  }
  render() {
    const canIssue=this.canIssue(),count=this.grants.filter(g=>g.code===this.room?.code&&g.quota).length;
    const names=new Set(this.grants.filter(g=>g.code===this.room?.code).flatMap(g=>[g.name,g.issuedName]));
    let defaultName=1;while(names.has(`Dot ${defaultName}`))defaultName++;
    const title=canIssue?TEXT.agentTitle:TEXT.myInvites;
    const paper = `<p class="form-hint">${esc(TEXT.agentHint)}</p>
      ${canIssue?`<h3>${esc(formatAccess('agentCurrentRoom',{title:this.room.title,code:this.room.code}))}</h3>
      <p>${esc(formatAccess('agentQuota',{count}))}</p><p class="form-hint">${TEXT.agentLimit}</p>
      <form id="agent-create-form" class="form-grid"><label>${TEXT.agentName}<input name="name" maxlength="24" required value="${esc(this.draftName??`Dot ${defaultName}`)}" autocomplete="off"></label><button type="submit"${count>=3?' disabled':''}>${TEXT.agentCreate}</button></form>`:`<p class="form-hint">${esc(TEXT.agentManageOnlyHint)}</p>`}
      ${this.fresh ? `<h3>${esc(formatAccess('agentCurrentLink',{name:this.fresh.name,ref:this.fresh.ref}))}</h3><label class="mp-agent-link">${TEXT.agentLinkLabel}<textarea id="agent-link" readonly rows="3"></textarea></label><button id="agent-copy">${esc(formatAccess('agentCopyNamed',{name:this.fresh.name}))}</button>` : ''}
      <h3>${TEXT.allInvitesTitle}</h3><p class="form-hint">${TEXT.allInvitesHint}</p>
      ${this.grants.length?`<button id="agent-revoke-all" class="small-button danger">${TEXT.agentRevokeAll}</button>`:''}
      <div class="mp-agent-grants">${this.grants.length ? this.grants.map(g=>`<article class="mp-letter" data-grant="${esc(g.id)}"><h4>${esc(g.name)} · #${esc(g.ref)}</h4>
        ${g.name!==g.issuedName?`<p>${esc(formatAccess('agentNames',{issued:g.issuedName,current:g.name}))}</p>`:''}
        <p>${esc(g.roomTitle)}（${esc(g.code)}） · ${g.roomStatus==='waiting'?TEXT.agentWaitingRoom:g.roomStatus==='playing'?TEXT.agentPlayingRoom:TEXT.agentFinishedRoom}</p>
        <p>${g.used?TEXT.agentUsed:TEXT.agentUnused} · ${new Date(g.expires).toLocaleString('zh-CN')}</p>
        <div class="mp-actions plain">${canIssue&&g.code===this.room.code&&!g.used?`<button class="small-button secondary" data-replace="${esc(g.id)}">${TEXT.agentReplace}</button>`:''}
        <button class="small-button danger" data-revoke="${esc(g.id)}">${TEXT.agentRevoke}</button></div></article>`).join('') : `<p class="form-hint">${TEXT.agentNone}</p>`}</div>`;
    const scroll=this.dialog.querySelector('.cs-leaf')?.scrollTop||0;
    this.dialog.setAttribute('aria-label',title);
    this.dialog.innerHTML = `<div class="screen-head"><h2>${title}</h2><button class="screen-close" id="agent-close" aria-label="${TEXT.close}">×</button></div><div class="screen-body">${mangaPage({title,lead:bandRoster('togenashi')[0],line:TEXT.agentLoginHint,paper,cls:'mp-sheet'})}</div>`;
    if(this.dialog.querySelector('.cs-leaf'))this.dialog.querySelector('.cs-leaf').scrollTop=scroll;
    this.dialog.querySelector('#agent-close').onclick = () => this.dialog.close();
    if (this.fresh) {
      this.dialog.querySelector('#agent-link').value = this.fresh.url;
      this.dialog.querySelector('#agent-copy').onclick = async () => {
        try { await navigator.clipboard.writeText(this.fresh.url); this.toast(TEXT.agentCopied); }
        catch { this.dialog.querySelector('#agent-link').select(); }
      };
    }
    this.dialog.querySelector('#agent-create-form')?.addEventListener('submit', async event => {
      event.preventDefault(); const button = event.currentTarget.querySelector('button');
      if (button.disabled) return; button.disabled = true;
      await this.create(new FormData(event.currentTarget).get('name'));
    });
    const nameInput=this.dialog.querySelector('[name="name"]');
    if(nameInput)nameInput.oninput=event=>{this.draftName=event.target.value;};
    for(const button of this.dialog.querySelectorAll('[data-replace]'))button.onclick=()=>{
      const grant=this.grants.find(g=>g.id===button.dataset.replace);
      this.confirm(TEXT.agentReplace,TEXT.agentReplaceConfirm,()=>this.create(grant.name,grant.id));
    };
    const revokeAll=this.dialog.querySelector('#agent-revoke-all');
    if(revokeAll)revokeAll.onclick=()=>this.confirm(TEXT.agentRevokeAll,TEXT.agentRevokeAllConfirm,async()=>{
      try {
        await this.request('/agent-grants/revoke-all',{requestId:crypto.randomUUID()});
        this.fresh=null;this.toast(TEXT.agentAllRevoked);await this.refresh();
      } catch(error){this.toast(error.message);}
    });
    for (const button of this.dialog.querySelectorAll('[data-revoke]')) button.onclick = () => {
      this.confirm(TEXT.agentRevoke, TEXT.agentRevokeConfirm, async () => {
        button.disabled = true;
        try {
          await this.request(`/agent-grants/${button.dataset.revoke}/revoke`, { requestId:crypto.randomUUID() });
          if(this.fresh?.id===button.dataset.revoke)this.fresh=null;
          this.toast(TEXT.agentRevoked); await this.refresh();
        } catch(error) {this.toast(error.message);button.disabled=false;}
      });
    };
  }
}

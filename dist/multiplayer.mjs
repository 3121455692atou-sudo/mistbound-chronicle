import { MP_RULES, bandOptions, bandRoster, bandName } from './multiplayer-engine.mjs?v=1118-1603';
import { COPY, UI_COPY, ACCESS_COPY as TEXT, formatAccess } from './multiplayer-copy.mjs?v=1118-1603';
import { MultiplayerUI } from './multiplayer-ui.mjs?v=1118-1603';
import { mangaPage } from './multiplayer-view.mjs?v=1118-1603';
import { AgentInvites } from './multiplayer-access.mjs?v=1118-1603';

const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const api = '/multiplayer/api';
const edition = document.documentElement.dataset.edition;
let user = null, room = null, events = null, pending = false, gameUI = null;
let renderedVersion = -1, renderedChat = -1, rooms = [], bootActive = null, toastTimer = null, offset = 0;
let roomSettingsDraft=null,lobbyPromise=null;
const main = $('#main'), chat = $('#chat');
const agentInvites = new AgentInvites({ request, toast, confirm: ask });
const canManageInvites=()=>!!user&&user.kind!=='dot';
const canInviteDot = () => edition === 'sfw' && canManageInvites();
const openInviteManager=()=>agentInvites.open(canInviteDot()&&room&&(room.isHost||room.role==='player')?room:null);
const bandSelect = (id = 'togenashi', name = 'band') => `<select name="${name}" aria-label="选择阵容">${bandOptions().map(b => `<option value="${esc(b.id)}"${b.id === id ? ' selected' : ''}>${esc(b.name)}</option>`).join('')}</select>`;
const portrait = hero => hero?.portrait ? `assets/portraits/${encodeURIComponent(hero.portrait)}/smile.webp` : 'assets/sazai.webp';
const mySeat = () => room?.seats.find(s => s.id === room.me);
const myPlayer = () => room?.game?.players.find(p => p.id === room.me);
function toast(text) {
  clearTimeout(toastTimer); $('#toast').textContent = text; $('#toast').hidden = false;
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 5000);
}
function connection(text = '') { $('#connection').textContent = text; $('#connection').hidden = !text; }
async function request(path, data = undefined) {
  let response;
  try {
    response = await fetch(`${api}${path}`, {
      method: data === undefined ? 'GET' : 'POST', credentials: 'same-origin', cache: 'no-store',
      headers: { accept: 'application/json', ...(user ? { 'x-mb-expected-account': user.id } : {}),
        ...(data === undefined ? {} : { 'content-type': 'application/json' }) },
      ...(data === undefined ? {} : { body: JSON.stringify(data) }), signal: AbortSignal.timeout(12000),
    });
  } catch { throw new Error('网络连接中断，请稍后重试。房间状态已保留，请确认最新战局。'); }
  let body;
  try { body = await response.json(); } catch { throw new Error('服务器暂时无法连接，请稍后重试。'); }
  if (!response.ok) {
    if (response.status === 401) {
      const wasAgent = user?.kind === 'dot' || body.error === 'agent-session-ended';
      leaveView(); user = null; bootActive = null; renderLogin();
      if(wasAgent)showAgentLogout();
    }
    if (body.error === 'account-changed') {
      leaveView(); user = null; bootActive = null; renderLogin(); connection(body.message);
      main.innerHTML = `<section class="panel login-panel"><h2>${esc(body.message)}</h2><button id="retry">重新连接</button></section>`;
      $('#retry').onclick = () => location.reload();
    }
    const error = new Error(body.message || '操作未完成。'); error.code = body.error;
    throw error;
  }
  return body;
}
async function mutate(operation, data = {}, create = false) {
  if (pending) return;
  pending = true; main.inert = true; gameUI?.setBusy(true);
  const path = create ? '/rooms' : `/rooms/${room.code}/${operation}`;
  try {
    const result = await request(path, { ...data, version: room?.version, requestId: crypto.randomUUID() });
    if(operation==='room-settings'){roomSettingsDraft=null;renderedVersion=-1;}
    if (result.room) receiveRoom(result.room);
    else { leaveView(); await loadLobby(); }
  } catch (error) {
    toast(error.message);
    if (room) await refreshRoom();
  } finally { pending = false; main.inert = false; gameUI?.setBusy(false); }
}
function ask(title, text, action) {
  const dialog = $('#confirm-dialog');
  $('#confirm-title').textContent = title; $('#confirm-copy').textContent = text;
  dialog.returnValue = '';
  dialog.addEventListener('close', () => { if (dialog.returnValue === 'confirm') action(); }, { once: true });
  dialog.showModal();
}
function leaveView() {
  events?.close(); events = null; room = null; renderedVersion = -1; renderedChat = -1;
  gameUI?.suspend(); chat.hidden = true; connection();
  document.body.classList.remove('mp-chat-unread');
  roomSettingsDraft=null;agentInvites.contextChanged(null);
  const url = new URL(location.href); url.searchParams.delete('room'); url.searchParams.delete('watch'); history.replaceState(null, '', url);
}
function editionUrl(mode, code = '') {
  const link = $(`#edition-${mode}`);
  const url = new URL(link.href);
  if (code) url.searchParams.set('room', code);
  return url.href;
}
function renderLogin() {
  $('#account').textContent = '尚未登录';
  main.innerHTML = `<section class="panel login-panel"><div class="eyebrow">MEMBERS ONLY</div><h1>相约雾海，再开一局</h1><p>联机模式只向已登录用户开放。登录后就能创建房间、邀请朋友，并在房间频道聊天。</p><a class="button" href="/account/login?to=${edition === 'ng' ? 'ng' : 'home'}">Discord 登录</a><p style="margin:20px 0 0"><a href="/">返回单机主菜单</a></p></section>`;
  main.innerHTML = mangaPage({title:'联机大厅',lead:bandRoster('togenashi')[0],line:UI_COPY.lobbyLine,paper:main.innerHTML,cls:'mp-lobby-page'});
  if(edition==='sfw')main.querySelector('.cs-leaf').insertAdjacentHTML('beforeend',`<p class="form-hint">${esc(TEXT.agentLoginHint)}</p>`);
}
function updateAccount() {
  $('#account').textContent = `${user.name} · ${user.kind==='dot'?TEXT.agentBadge+(user.ref?' #'+user.ref:''):'已登录'}`;
  $('#edition-ng').hidden=user.kind==='dot';
  if(user.kind==='dot')showAgentLogout();
}
function showAgentLogout() {
  if($('#agent-logout'))return;
  const button=document.createElement('button');button.id='agent-logout';button.className='small-button secondary';button.textContent=TEXT.agentSignOut;
  button.onclick=async()=>{try{await request('/agent/logout',{requestId:crypto.randomUUID()});location.reload();}catch(error){toast(error.message);}};
  $('#account').append(button);
}
function renderLobby() {
  const active = bootActive;
  main.innerHTML = `<section class="intro"><div><div class="eyebrow">A SMALL WORLD, A SHARED STORY</div><h1>在同一片雾海相遇</h1><p>创建房间，挑选阵容。与好友从一座主城起步，在有限的棋盘上角逐胜负。</p></div><div class="stamp"><b>2—4</b>人联机战局</div></section>
    ${active ? `<div class="turn-status mine">你还有一间未结束的${active.edition === 'ng' ? ' NG ' : '普通版'}房间：<a href="${esc(editionUrl(active.edition, active.code))}">回到 ${esc(active.code)}</a></div>` : ''}
    <div class="lobby-grid"><section class="panel"><h2>创建房间</h2><form id="create-form" class="form-grid">
    <label>房间名称<input name="title" required maxlength="30" value="${esc(user.name.slice(0, 20))}的雾海小屋"></label>
    <div class="form-row"><label>有限地图<select name="map"><option value="small">雾海前线 · 91 格</option><option value="medium">四境群岛 · 169 格</option></select></label><label>${TEXT.playerSeatsLabel}<select name="capacity"><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></label></div>
    <label>${TEXT.hostRoleLabel}<select name="hostRole"><option value="player">${TEXT.hostPlayerOption}</option><option value="spectator">${TEXT.hostSpectatorOption}</option></select></label>
    <label class="mp-check"><input type="checkbox" name="allowSpectators" checked>${TEXT.allowSpectatorsLabel}</label>
    <label>你的阵容${bandSelect()}</label><div class="form-row"><label>回合时限<select name="turnSeconds"><option value="120">120 秒</option><option value="90">90 秒</option><option value="180">180 秒</option></select></label><label>房间密码（可选）<input name="password" type="password" maxlength="64" autocomplete="new-password" placeholder="留空即可公开加入"></label></div>
    <button type="submit"${active ? ' disabled' : ''}>创建${edition === 'ng' ? ' NG ' : '普通版'}房间</button></form>
    <div class="balance-note"><p>联机平衡规则：所有阵容统一先锋、游击、卫戍、鼓舞 4 个席位与基础属性，拥有相同的初始领土与国库。行动顺序随机决定。</p><p>普通版与 NG 版需分别建房或加入；战斗规则相同。单机存档与联机对局分别保存。</p></div></section>
    <section class="panel"><div class="panel-head"><h2>${COPY.roomListTitle}</h2><button id="refresh-rooms" class="secondary">刷新</button></div>${user.kind!=='dot'?`<p class="form-hint">${TEXT.createdRoomHint}</p>`:''}<div id="rooms" class="rooms"></div><form id="join-code-form" class="join-code"><label for="join-code">有朋友的房间号？</label><input id="join-code" name="code" required maxlength="6" pattern="[A-HJ-NP-Za-hj-np-z2-9]{6}" placeholder="输入 6 位房间号" autocapitalize="characters" autocomplete="off"><button type="submit" class="secondary">加入房间</button></form>
    <div id="join-options" hidden></div></section></div>
    ${canManageInvites()?`<button id="manage-dot" class="small-button secondary">${TEXT.myInvites}</button>`:''}`;
  main.querySelector('.intro')?.remove();
  const paper = main.innerHTML;
  main.innerHTML = mangaPage({ title: '联机大厅', lead: bandRoster('togenashi')[0], line: UI_COPY.lobbyLine,
    paper: `<nav class="mp-lobby-tabs"><button id="lobby-create">创建房间</button><button id="lobby-join">加入房间</button></nav>${paper}`, cls: 'mp-lobby-page' });
  const grid = main.querySelector('.lobby-grid');
  const choose = tab => { grid.dataset.tab = tab; $('#lobby-create').classList.toggle('on',tab==='create'); $('#lobby-join').classList.toggle('on',tab==='join'); };
  $('#lobby-create').onclick = () => choose('create'); $('#lobby-join').onclick = () => choose('join'); choose(rooms.length ? 'join' : 'create');
  renderRooms();
  $('#create-form').addEventListener('submit', event => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget));
    data.capacity = Number(data.capacity); data.turnSeconds = Number(data.turnSeconds);
    data.allowSpectators=event.currentTarget.elements.allowSpectators.checked;mutate('', data, true);
  });
  $('#refresh-rooms').addEventListener('click', () => refreshRooms());
  $('#join-code-form').addEventListener('submit', event => { event.preventDefault(); showJoin($('#join-code').value); });
  if($('#manage-dot'))$('#manage-dot').onclick=()=>agentInvites.open(null);
  if(user.kind==='dot') {
    $('#create-form').querySelector('button').disabled=true;
    $('#create-form').insertAdjacentHTML('beforeend',`<p class="form-hint">${esc(TEXT.agentRoomOnly)}</p>`);
  }
  $('[name="hostRole"]').onchange=event=>{ $('[name="band"]').closest('label').hidden=event.target.value==='spectator'; };
}
function renderRooms() {
  if (!$('#rooms')) return;
  $('#rooms').innerHTML = rooms.length ? rooms.map(r => `<article class="room-card"><div><h3>${esc(r.title)} ${r.locked ? '· 有密码' : ''}${r.status === 'playing' ? ` · ${COPY.ongoingBadge}` : ''}</h3>${r.createdByMe?`<small>${TEXT.createdRoomBadge}</small>`:''}<small>${esc(r.host)}${r.hostRole==='spectator'?' · '+TEXT.hostSpectatorBadge:''} · ${MP_RULES.maps[r.map]?.name || ''} · ${r.count}/${r.capacity} 人${r.status === 'playing' ? ` · AI ${r.available || 0}` : ''} · ${esc(formatAccess('watchCount',{count:r.spectators||0}))}</small><small>${r.allowSpectators!==false?TEXT.watchOpenBadge:TEXT.watchClosedBadge}</small><small class="room-code">${esc(r.code)}</small></div><div class="mp-room-buttons"><button data-join="${esc(r.code)}"${!r.joined && (r.status === 'playing' ? !r.available : r.count >= r.capacity) ? ' disabled' : ''}>${r.joined ? '回到房间' : r.status === 'playing' ? COPY.takeoverButton : '加入'}</button>${!r.joined&&(r.allowSpectators!==false||r.isHost)?`<button class="secondary" data-watch="${esc(r.code)}">${r.watching?TEXT.watchingBadge:TEXT.watchButton}</button>`:''}${r.canDissolve?`<button class="danger" data-dissolve="${esc(r.code)}">${TEXT.dissolveButton}</button>`:''}</div></article>`).join('') : `<p class="empty">${COPY.roomListEmpty}</p>`;
  for (const button of $('#rooms').querySelectorAll('[data-join]')) button.onclick = () => {
    const existing = rooms.find(r => r.code === button.dataset.join);
    existing?.joined ? openRoom(existing.code) : showJoin(existing.code);
  };
  for(const button of $('#rooms').querySelectorAll('[data-watch]'))button.onclick=()=>{
    const existing=rooms.find(r=>r.code===button.dataset.watch);
    if(existing?.watching)openRoom(existing.code,true);
    else if(existing&&!existing.locked)watchRoom(existing.code);
    else showJoin(button.dataset.watch,true);
  };
  for(const button of $('#rooms').querySelectorAll('[data-dissolve]'))button.onclick=()=>{
    const target=rooms.find(r=>r.code===button.dataset.dissolve);
    if(!target?.canDissolve)return;
    ask(TEXT.dissolveButton,formatAccess('dissolveNamedConfirm',{title:target.title,code:target.code}),async()=>{
      if(pending)return;pending=true;main.inert=true;
      try {
        await request(`/rooms/${target.code}/dissolve`,{requestId:crypto.randomUUID()});
        await loadLobby();toast(TEXT.roomDissolved);
      } catch(error){toast(error.message);await refreshRooms();}
      finally{pending=false;main.inert=false;}
    });
  };
}
async function watchRoom(code) {
  if(pending)return;pending=true;main.inert=true;
  try {receiveRoom((await request(`/rooms/${code}/watch`,{requestId:crypto.randomUUID()})).room);}
  catch(error){toast(error.message);await refreshRooms();}
  finally {pending=false;main.inert=false;gameUI?.setBusy(false);}
}
async function refreshRooms() {
  if (!user || room) return;
  try { rooms = (await request('/rooms')).rooms; renderRooms(); } catch (error) { toast(error.message); }
}
async function loadLobby() {
  if(lobbyPromise)return lobbyPromise;
  const account=user?.id;
  const loading=(async()=>{
    const boot=await request('/boot'),listed=await request('/rooms');
    if(!user||user.id!==account||room)return;
    bootActive=boot.activeRoom;rooms=listed.rooms;renderLobby();
    if(agentInvites.dialog.open&&canManageInvites())await agentInvites.refresh();
  })();
  lobbyPromise=loading;
  try{return await loading;}finally{if(lobbyPromise===loading)lobbyPromise=null;}
}
function showJoin(rawCode, watching = false) {
  const code = String(rawCode).trim().toUpperCase();
  if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code)) { toast('请输入正确的 6 位房间号。'); return; }
  const listed=rooms.find(r=>r.code===code);
  if(watching&&listed?.allowSpectators===false&&!listed.isHost){toast(TEXT.watchClosed);return;}
  $('#lobby-join')?.click();
  const target = $('#join-options');
  target.hidden = false; target.innerHTML = `<form id="join-form" class="form-grid" style="margin-top:20px"><h3>${watching?TEXT.watchTitle:'加入'} ${esc(code)}</h3><p class="muted">${watching?TEXT.watchHint:COPY.lateJoinNote}</p><label>房间密码<input name="password" type="password" maxlength="64" placeholder="公开房间留空" autocomplete="off"></label><button type="submit">${watching?TEXT.watchButton:'进入房间'}</button>${!watching?`<button id="instead-watch" type="button" class="secondary">${TEXT.watchButton}</button>`:''}</form>`;
  if($('#instead-watch'))$('#instead-watch').onclick=()=>showJoin(code,true);
  $('#join-form').addEventListener('submit', async event => {
    event.preventDefault(); if (pending) return;
    pending = true; main.inert = true; gameUI?.setBusy(true);
    try {
      const result = await request(`/rooms/${code}/${watching?'watch':'join'}`, { band: 'togenashi', ...Object.fromEntries(new FormData(event.currentTarget)), requestId: crypto.randomUUID() });
      receiveRoom(result.room);
    } catch (error) { toast(error.message); } finally { pending = false; main.inert = false; gameUI?.setBusy(false); }
  });
  target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
async function openRoom(code, watching = false) {
  try {
    const result = await request(`/rooms/${code}`); receiveRoom(result.room);
  } catch (error) {
    if (['not-a-member', 'room-not-found'].includes(error.code)) { await loadLobby(); showJoin(code,watching); }
    else {
      await loadLobby(); toast(error.message);
      if (error.code === 'edition-mismatch' && user?.kind !== 'dot') {
        const other = edition === 'ng' ? 'sfw' : 'ng';
        const link = document.createElement('a');
        link.className = 'button secondary'; link.href = editionUrl(other, code);
        link.textContent = $(`#edition-${other}`).textContent;
        main.prepend(link);
      }
    }
  }
}
async function refreshRoom() {
  if (!room) return;
  try { const result = await request(`/rooms/${room.code}`); receiveRoom(result.room); }
  catch(error){if(error.code==='room-dissolved'){leaveView();await loadLobby();toast(TEXT.roomDissolved);}}
}
function receiveRoom(next) {
  if (!next || (room?.code === next.code && (next.version < room.version || (next.version === room.version && next.chatSeq < room.chatSeq)))) return;
  const changed = room?.code !== next.code || room?.role !== next.role;
  const audienceChanged = room?.spectators !== next.spectators;
  if (changed) { events?.close(); renderedVersion = -1; renderedChat = -1; }
  const previousStatus = room?.status, previousBattle = room?.game?.battle?.id;
  room = next; offset = next.serverTime - Date.now();
  agentInvites.contextChanged(next);
  if(room.role==='player')bootActive = { code: next.code, edition: next.edition };
  const url = new URL(location.href); url.searchParams.set('room', room.code); if(room.role==='spectator')url.searchParams.set('watch','1');else url.searchParams.delete('watch');history.replaceState(null, '', url);
  if (renderedVersion !== room.version || changed || audienceChanged) { renderRoom(); renderedVersion = room.version; }
  renderChat(); chat.hidden = false;
  if (((previousStatus === 'waiting' || changed) && room.status === 'playing') || (next.game?.battle && previousBattle !== next.game.battle.id)) {
    chat.classList.add('collapsed'); $('#chat-toggle').setAttribute('aria-expanded', 'false'); $('#chat-badge').textContent = '展开';
  }
  if (!events || changed) startEvents();
  tickClock();
}
function startEvents() {
  events?.close();
  events = new EventSource(`${api}/rooms/${room.code}/events?account=${encodeURIComponent(user.id)}`);
  events.onmessage = event => {
    try { receiveRoom(JSON.parse(event.data)); connection(); } catch { connection('正在重新读取房间状态…'); }
  };
  events.onerror = () => connection('正在重新连接并同步已保存的对局状态；请稍候。');
  events.addEventListener('removed', async event => {
    let reason;try{reason=JSON.parse(event.data).reason;}catch{}
    leaveView();toast(reason==='spectating-disabled'?TEXT.watchClosedNow:'你已离开房间。');try{await loadLobby();}catch{}
  });
  events.addEventListener('closed',async()=>{leaveView();try{await loadLobby();}catch{}toast(TEXT.roomDissolved);});
  events.addEventListener('expired', () => { const dot=user?.kind==='dot';leaveView();user=null;renderLogin();if(dot)showAgentLogout();toast(dot?TEXT.agentExpired:'登录已过期，请重新登录。'); });
}
function heading() {
  return `<div class="room-heading"><div><div class="eyebrow">${edition === 'ng' ? 'NG' : 'STANDARD'} · ${room.status === 'waiting' ? 'WAITING FOR FRIENDS' : 'A SHARED CHRONICLE'}</div><h1>${esc(room.title)}</h1><div class="room-meta"><span class="room-code">${room.code}</span>　${MP_RULES.maps[room.map].name} · ${room.turnSeconds} 秒/回合</div></div><div class="heading-actions"><button id="invite" class="secondary">复制邀请</button><button id="leave-room" class="danger">离开房间</button></div></div>`;
}
async function copyInvite() {
  try { await navigator.clipboard.writeText(location.href); toast('邀请链接已复制；设有访问密码的房间请另行告知对方密码。'); }
  catch { toast(`房间号：${room.code}`); }
}
function leaveRoom() {
  const explanation=room.role==='spectator'?TEXT.watchLeave:room.status === 'playing' && myPlayer()?.alive?COPY.leaveExplanation:'确认离开这个房间？';
  ask('离开房间',explanation+(room.createdByMe?'\n\n'+TEXT.creatorLeaveHint:'')+(canInviteDot()&&(room.isHost||room.role==='player')?'\n\n'+TEXT.agentLeftHint:''),()=>mutate('leave'));
}
function changeWatchPermission() {
  const allowSpectators=!room.allowSpectators,update=()=>mutate('watch-settings',{allowSpectators});
  if(allowSpectators)update();else ask(TEXT.watchSettingsTitle,TEXT.watchDisableConfirm,update);
}
function becomeSpectatorHost() {
  ask(TEXT.hostObserveButton,TEXT.hostObserveConfirm,()=>mutate('host-role',{role:'spectator'}));
}
function dissolveRoom() {ask(TEXT.dissolveButton,TEXT.dissolveConfirm,()=>mutate('dissolve'));}
function renameAgent() {
  if(user?.kind!=='dot')return;
  const input=document.createElement('input');
  input.id='agent-nickname';input.maxLength=24;input.required=true;input.value=user.name;
  input.setAttribute('aria-label',TEXT.agentNickname);
  ask(TEXT.agentRenameTitle,TEXT.agentRenameHint,async()=>{
    try {
      const result=await request('/agent/profile',{name:input.value,requestId:crypto.randomUUID()});
      user=result.user||(await request('/boot')).user;updateAccount();
      if(result.room)receiveRoom(result.room);
      toast(TEXT.agentRenamed);
    } catch(error){toast(error.message);}
  });
  $('#confirm-copy').append(input);input.focus();input.select();
}
function renderRoom() {
  if (room.status !== 'waiting') {
    if (!gameUI) gameUI = new MultiplayerUI(main, { action: action => sendAction(action), toast, pending: () => pending,
      resume: () => mutate('resume'), invite: copyInvite, leave: leaveRoom,
      canInviteDot, canManageInvites, dot:openInviteManager, join: () => mutate('join',{band:'togenashi'}),
      watchSettings:changeWatchPermission,observe:becomeSpectatorHost,
      dissolve:dissolveRoom,isAgent:()=>user?.kind==='dot',rename:renameAgent,
      chat: () => { chat.classList.remove('collapsed'); document.body.classList.remove('mp-chat-unread'); $('#chat-toggle').setAttribute('aria-expanded','true'); $('#chat-badge').textContent='−'; $('#chat-text').focus(); } });
    gameUI.render(room); return;
  }
  const focused=main.querySelector('#room-settings-form')?.contains(document.activeElement)
    ?{name:document.activeElement.name,start:document.activeElement.selectionStart,end:document.activeElement.selectionEnd}:null;
  const scroll=main.querySelector('.cs-leaf')?.scrollTop||0;
  gameUI?.suspend();
  main.innerHTML = mangaPage({ title: '联机房间', lead: bandRoster((mySeat()||room.seats[0])?.band||'togenashi')[0], ribbon: room.code,
    line: room.isHost&&room.role==='spectator'?TEXT.hostSpectatorStartHint:room.role==='spectator'?TEXT.watchWaiting:UI_COPY.waitingLine, paper: heading() + waitingView(), cls: 'mp-waiting-page' });
  $('#invite').onclick = copyInvite; $('#leave-room').onclick = leaveRoom; bindWaiting();
  if(main.querySelector('.cs-leaf'))main.querySelector('.cs-leaf').scrollTop=scroll;
  if(focused&&!pending) {
    const next=$('#room-settings-form')?.elements.namedItem(focused.name);
    if(next){next.focus({preventScroll:true});if(typeof next.setSelectionRange==='function')next.setSelectionRange(focused.start,focused.end);}
  }
}
function waitingView() {
  const draft=roomSettingsDraft?.code===room.code?roomSettingsDraft:room;
  const settings=room.isHost?`<details class="mp-room-settings" open><summary>${TEXT.roomSettingsTitle}</summary>
    <p class="form-hint">${TEXT.roomSettingsHint}</p><form id="room-settings-form" class="form-grid">
    <label>房间名称<input name="title" maxlength="30" required value="${esc(draft.title)}"></label>
    <label>有限地图<select name="map">${Object.entries(MP_RULES.maps).map(([key,value])=>`<option value="${key}"${key===draft.map?' selected':''}>${esc(value.name)}</option>`).join('')}</select></label>
    <div class="form-row"><label>${TEXT.playerSeatsLabel}<select name="capacity">${[2,3,4].map(n=>`<option value="${n}"${n===Number(draft.capacity)?' selected':''}>${n}</option>`).join('')}</select></label>
    <label>回合时限<select name="turnSeconds">${[90,120,180].map(n=>`<option value="${n}"${n===Number(draft.turnSeconds)?' selected':''}>${n} 秒</option>`).join('')}</select></label></div>
    <button type="submit">${TEXT.saveRoomSettings}</button></form></details>`:'';
  const hostControls=room.isHost?`<button id="start-game"${!room.seats.every(s=>s.ready)?' disabled':''}>开始对局</button>
    <button id="toggle-watch" class="secondary">${room.allowSpectators?TEXT.watchDisableButton:TEXT.watchEnableButton}</button>
    ${room.role==='player'?`<button id="host-observe" class="secondary">${TEXT.hostObserveButton}</button>`:''}
    `:'';
  return `<div class="waiting-layout"><section class="panel"><h2>等大家就位</h2>
    <p class="form-hint">${room.allowSpectators?TEXT.watchOpenBadge:TEXT.watchClosedBadge}</p>
    ${room.hostRole==='spectator'?`<p>${esc(room.hostName)} · ${TEXT.hostSpectatorBadge}${room.isHost?' · 你':''}</p>`:''}
    <div class="seats">${Array.from({ length: room.capacity }, (_, index) => {
    const seat = room.seats[index];
    if (!seat) return '<article class="seat-card seat-empty">✦　等待朋友加入</article>';
    return `<article class="seat-card ${seat.ready ? 'ready' : ''}"><img src="${portrait(bandRoster(seat.band)[0])}" alt=""><div><h3>${esc(seat.name)}${seat.id === room.me ? ' · 你' : ''}</h3><small>${esc(bandName(seat.band))}${seat.agent?' · '+esc(TEXT.agentBadge)+(seat.agentRef?' #'+esc(seat.agentRef):''):''}</small><span class="${seat.ready ? 'ready-label' : 'muted'}">${seat.ready ? '已准备' : '尚未准备'}${seat.id === room.hostId ? ' · 房主' : ''}</span></div>${room.isHost && seat.id !== room.me ? `<button class="danger kick" data-kick="${seat.id}">移出</button>` : ''}</article>`;
  }).join('')}</div><div class="waiting-controls">${room.role==='spectator'?`<p>${room.isHost?TEXT.hostSpectatorWaiting:TEXT.watchWaiting}</p><button id="watch-join">${TEXT.watchJoin}</button>`:`<label>我的阵容${bandSelect(mySeat().band, 'room-band')}</label><button id="ready-button" class="${mySeat().ready ? 'secondary' : ''}">${mySeat().ready ? '取消准备' : '准备好了'}</button>`}${hostControls}${room.canDissolve?`<button id="dissolve-room" class="danger">${TEXT.dissolveButton}</button>`:''}<p class="muted">${room.hostRole==='spectator'?TEXT.hostSpectatorStartHint:COPY.waitingRules}</p><p>${esc(formatAccess('watchCount',{count:room.spectators||0}))}</p>${canManageInvites()?`<button id="invite-dot">${canInviteDot()&&(room.isHost||room.role==='player')?TEXT.agentTitle:TEXT.myInvites}</button>`:''}${user.kind==='dot'?`<button id="rename-agent">${TEXT.agentRenameTitle}</button>`:''}</div>${settings}</section>
    <section class="panel"><h2>这一局怎么打</h2><ul class="room-rules"><li>每位玩家开局拥有 7 格领土、45 金币、45 补给与 18 人军队。每轮拥有 3 次行动指令。</li><li>各阵容固定包含先锋、游击、卫戍、鼓舞各一人，属性与数值统一。不足四人的作品由罪袋军官补齐。</li><li>前 2 轮为休战期，不可进攻其他玩家。每支军队每轮限发起一次进攻；兵力与建筑均设有限额。</li><li>${COPY.leaveExplanation}</li><li>攻占敌方首都直接淘汰该玩家；第 40 轮结束时按领土、首都与军队积分决胜，同分并列。</li><li>${COPY.takeoverRules}</li></ul></section></div>`;
}
function bindWaiting() {
  if($('#watch-join')) {
    $('#watch-join').disabled=room.seats.length>=room.capacity;
    $('#watch-join').onclick=()=>mutate('join',{band:'togenashi'});
  }
  if($('#ready-button'))$('#ready-button').onclick = () => mutate('ready', { ready: !mySeat().ready });
  if($('[name="room-band"]'))$('[name="room-band"]').onchange = event => mutate('settings', { band: event.target.value });
  if ($('#start-game')) $('#start-game').onclick = () => mutate('start');
  for (const button of main.querySelectorAll('[data-kick]')) button.onclick = () => ask('移出玩家', '移出玩家后，房间内所有已准备的成员需要重新确认准备。', () => mutate('kick', { seat: button.dataset.kick }));
  if($('#invite-dot'))$('#invite-dot').onclick=openInviteManager;
  if($('#toggle-watch'))$('#toggle-watch').onclick=changeWatchPermission;
  if($('#host-observe'))$('#host-observe').onclick=becomeSpectatorHost;
  if($('#dissolve-room'))$('#dissolve-room').onclick=dissolveRoom;
  if($('#rename-agent'))$('#rename-agent').onclick=renameAgent;
  const settings=$('#room-settings-form');
  if(settings) {
    settings.oninput=settings.onchange=()=>{
      roomSettingsDraft={code:room.code,...Object.fromEntries(new FormData(settings))};
    };
    settings.onsubmit=event=>{
      event.preventDefault();const data=Object.fromEntries(new FormData(settings));
      data.capacity=Number(data.capacity);data.turnSeconds=Number(data.turnSeconds);mutate('room-settings',data);
    };
  }
}
const sendAction = action => mutate('action', { action });
function renderChat() {
  if (!room || renderedChat === room.chatSeq) return;
  const list = $('#messages'), bottom = list.scrollHeight - list.scrollTop - list.clientHeight < 60;
  list.innerHTML = room.chat.map(m => `<div class="message${m.system ? ' system' : ''}">${m.system ? '' : `<b>${esc(m.name)}${m.seat && m.seat === room.me ? ' · 你' : ''}${m.spectator?' · '+TEXT.watchChatBadge:''}${m.host?' · '+TEXT.hostBadge:''}${m.agent?' · '+TEXT.agentBadge+(m.agentRef?' #'+esc(m.agentRef):''):''}</b>`}<time>${new Date(m.at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</time><p>${esc(m.text)}</p></div>`).join('');
  if (bottom || renderedChat < 0) list.scrollTop = list.scrollHeight;
  if (chat.classList.contains('collapsed') && renderedChat >= 0) { $('#chat-badge').textContent = '新消息'; document.body.classList.add('mp-chat-unread'); }
  renderedChat = room.chatSeq;
}
$('#chat-form').addEventListener('submit', async event => {
  event.preventDefault(); if (!room) return;
  const input = $('#chat-text'), text = input.value.trim(); if (!text) return;
  const button = $('#chat-form button'); if (button.disabled) return; button.disabled = true;
  try {
    const result = await request(`/rooms/${room.code}/chat`, { text, requestId: crypto.randomUUID() });
    input.value = ''; receiveRoom(result.room);
  } catch (error) { toast(error.message); } finally { button.disabled = false; }
});
$('#chat-toggle').onclick = () => {
  const collapsed = chat.classList.toggle('collapsed');
  $('#chat-toggle').setAttribute('aria-expanded', String(!collapsed));
  $('#chat-badge').textContent = collapsed ? '展开' : '−';
  if (!collapsed) document.body.classList.remove('mp-chat-unread');
  if (!collapsed) $('#messages').scrollTop = $('#messages').scrollHeight;
};
function tickClock() {
  if (!$('#countdown') || !room?.deadline) return;
  const seconds = Math.max(0, Math.ceil((room.deadline - Date.now() - offset) / 1000));
  $('#countdown').textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
async function start() {
  $(`#edition-${edition}`).classList.add('active');
  if (innerWidth < 1000) { chat.classList.add('collapsed'); $('#chat-toggle').setAttribute('aria-expanded', 'false'); $('#chat-badge').textContent = '展开'; }
  const incoming = new URLSearchParams(location.hash.slice(1)).get('dot');
  if(incoming) {
    $('#edition-ng').hidden=true;
    $('#account').textContent=TEXT.agentEntryTitle;
    const url=new URL(location.href);url.hash='';history.replaceState(null,'',url);
    main.innerHTML=mangaPage({title:TEXT.agentEntryTitle,lead:bandRoster('togenashi')[0],line:TEXT.agentLoginHint,
      paper:`<p class="form-hint">${esc(TEXT.agentEntryHint)}</p><p id="agent-invitation-info">${TEXT.agentChecking}</p>
        <label>${TEXT.agentNickname}<input id="agent-entry-name" maxlength="24" required autocomplete="off" disabled></label>
        <button id="agent-enter" disabled>${TEXT.agentEnter}</button>`,cls:'mp-lobby-page'});
    try {
      const {invitation}=await request('/agent/invite-info',{token:incoming});
      $('#agent-invitation-info').textContent=formatAccess('agentInvitationFor',{name:invitation.name,ref:invitation.ref,title:invitation.roomTitle,code:invitation.code});
      $('#agent-entry-name').value=invitation.name;$('#agent-entry-name').disabled=false;$('#agent-enter').disabled=false;
    } catch(error){$('#agent-invitation-info').textContent=error.message;return;}
    $('#agent-enter').onclick=async()=>{
      $('#agent-enter').disabled=true;
      try {
        const redeemed=await request('/agent/redeem',{token:incoming,name:$('#agent-entry-name').value});user=(await request('/boot')).user;updateAccount();
        let result;
        try {result=await request(`/rooms/${redeemed.code}/join`,{band:'togenashi',requestId:crypto.randomUUID()});}
        catch(error) {if(error.code!=='room-full'&&error.code!=='already-in-room')throw error;result=await request(`/rooms/${redeemed.code}/watch`,{requestId:crypto.randomUUID()});}
        receiveRoom(result.room);
      } catch(error) {toast(error.message);if($('#agent-enter'))$('#agent-enter').disabled=false;}
    };
    return;
  }
  try {
    const boot = await request('/boot'); user = boot.user; bootActive = boot.activeRoom;
    updateAccount();
    const invited = new URL(location.href).searchParams.get('room');
    if (invited) await openRoom(invited.toUpperCase(),new URL(location.href).searchParams.get('watch')==='1');
    else if (boot.activeRoom?.edition === edition) await openRoom(boot.activeRoom.code);
    else await loadLobby();
  } catch (error) {
    if (!['login-required','agent-session-ended'].includes(error.code)) {
      main.innerHTML = `<section class="panel login-panel"><h2>暂时没连上雾海</h2><p>${esc(error.message)}</p><button id="retry">重新连接</button></section>`;
      $('#retry').onclick = () => location.reload();
    }
  }
}
setInterval(tickClock, 1000);
setInterval(() => { if (room && events?.readyState !== EventSource.OPEN) refreshRoom(); else if (!room && user) refreshRooms(); }, 7000);
setInterval(async () => {
  if (!user || document.hidden) return;
  try { await request('/boot'); } catch {}
}, 30000);
document.addEventListener('visibilitychange', async () => {
  if (document.hidden || !user) return;
  try {
    const boot = await request('/boot');
    if (boot.user.id !== user.id) { leaveView(); main.inert = true; connection('账号已切换，请刷新后继续。'); }
    else if (room) await refreshRoom();
  } catch {}
});
window.addEventListener('hashchange',()=>{
  if(new URLSearchParams(location.hash.slice(1)).has('dot')) {
    if(agentInvites.dialog.open)agentInvites.dialog.close();
    leaveView();user=null;start();
  }
});
start();

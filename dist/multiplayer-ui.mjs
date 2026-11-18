import { WorldMap } from './map.mjs?v=1118-1603';
import { BattleUI } from './battle-ui.mjs?v=1118-1603';
import { icon } from './icons.mjs?v=1118-1603';
import { morph } from './morph.mjs?v=1118-1603';
import { tacticalOptions, tacticalThreat, tacticalAttackReach, tacticalStatus } from './battle.mjs?v=1118-1603';
import { applyGameAction, adjacent, incomeFor, score, battlePlayer, MP_RULES, ROLE_NAMES, bandName } from './multiplayer-engine.mjs?v=1118-1603';
import { readSocial, readAffinity, readDiplomacy, interactionText, isTruce } from './multiplayer-interactions.mjs?v=1118-1603';
import { COPY, UI_COPY, ACCESS_COPY as TEXT, formatUi, formatAccess } from './multiplayer-copy.mjs?v=1118-1603';
import { presentationState, characterView, mangaPage, portraitUrl, esc } from './multiplayer-view.mjs?v=1118-1603';

const buildingNames = { capital: '首都', farm: '农田', mine: '矿场', fort: '要塞' };
const terrainNames = { plains: '平原', forest: '林地', hills: '丘陵' };
const slots = [[.5, -.866], [1, 0], [.5, .866], [-.5, .866], [-1, 0], [-.5, -.866]];
const frame = () => `<div class="app-shell">
  <section class="map-stage" aria-label="世界地图"><canvas id="world-map" aria-label="六角世界地图。拖拽移动，滚轮缩放，点击地块展开操作。" tabindex="0"></canvas></section>
  <section class="flower" id="flower" aria-label="地块详情与操作" hidden></section>
  <section class="army-panel" id="army-panel" aria-label="编队：成员、带兵与行军" hidden></section>
  <button class="leader" id="leader" aria-label="打开领军角色"><img id="leader-portrait" alt=""></button>
  <button class="nameplate" id="nameplate" aria-label="打开同伴"></button>
  <section class="goals ink-box" id="goals" aria-label="联机对局"></section>
  <section class="ledger" id="ledger" aria-label="国库"></section>
  <button class="ticker" id="ticker" aria-label="打开编年史"></button>
  <nav class="tabs" aria-label="主导航">${[['recruit','征募'],['heroes','同伴'],['flag','诸国'],['scroll','内政'],['gear','房间'],['help','指南']].map(([glyph,label]) =>
    `<button class="tab${glyph === 'heroes' ? ' hot' : ''}" data-nav="${glyph}" data-label="${label}" aria-label="${label}"><span>${icon(glyph)}</span></button>`).join('')}</nav>
  <div class="view-tools"><div class="lever" role="group" aria-label="地图图层">${[['terrain','地貌'],['force','军情'],['yield','收益'],['political','疆域'],['diplomacy','外交']].map(([layer,label])=>`<button data-layer="${layer}" class="${layer==='terrain'?'active':''}">${label}</button>`).join('')}</div>
  <label class="zoom"><span>缩放</span><input id="zoom" type="range" min=".42" max="2.8" step=".01" value="1" aria-label="地图缩放"></label>
  <div class="mini-row"><button class="mini" id="find-army" aria-label="定位编队">${icon('sword')}</button><button class="mini" id="center-map" aria-label="回到首都">${icon('target')}</button></div></div>
  <nav class="army-rail" id="army-rail" aria-label="军队"></nav>
  <button class="dial" id="end-turn" aria-label="结束回合"></button>
  <div class="mp-live-state" id="mp-live-state" role="status" aria-live="polite"></div>
</div>`;

export class MultiplayerUI {
  constructor(main, context) {
    this.main = main; this.context = context; this.room = null; this.view = presentationState(null);
    this.selection = null; this.armyOpen = false; this.target = null; this.ringPage = null; this.sheet = null;
    this.modal = document.getElementById('modal');
    document.getElementById('close-modal').onclick = () => this.closeSheet();
    this.modal.addEventListener('cancel', event => { event.preventDefault(); this.closeSheet(); });
    this.keyHandler = event => {
      if (event.key === 'Escape' && this.room) {
        if (this.modal.open) this.closeSheet();
        else if (this.target) { this.target = null; this.renderArmy(); this.map.setRoute(null); }
        else this.clearSelection();
      }
    };
    document.addEventListener('keydown', this.keyHandler);
    this.battle = new BattleUI({
      getState: () => this.view, dispatch: () => ({ ok: false }),
      getOptions: (state,id) => tacticalOptions(state.battle,id),
      getThreat: (state,id) => tacticalThreat(state.battle,id),
      getReach: (state,id,at) => tacticalAttackReach(state.battle,id,at),
      getStatus: (state,id) => tacticalStatus(state.battle,id),
      portrait: portraitUrl, notify: text => context.toast(text), save: () => this.openSheet('room'),
      say: () => {}, sayTeam: () => false, pop: () => {}, coach: () => null,
      isSimulation: () => false,
    });
    // The original battle view stays intact; asynchronous commands wait for server confirmation.
    this.battle.act = action => this.battleAction(action);
    this.battle.retreatWarning = () => UI_COPY.retreatWarning;
    const renderBattle = this.battle.render.bind(this.battle);
    this.battle.render = () => { renderBattle(); this.decorateBattle(); };
  }
  observing() { return this.room?.role === 'spectator'; }
  me() { return this.room?.game.players.find(p => p.id === (this.observing() ? this.observerId : this.room.me)); }
  canOrder() {
    return !!this.room?.me && !this.observing() && this.room?.status === 'playing' && this.me()?.alive && this.room.game.turnId === this.room.me
      && !this.room.game.battle && this.room.seats.find(s => s.id === this.room.me)?.control !== 'ai';
  }
  canBattle() {
    return !!this.room?.me && !this.observing() && this.room?.status === 'playing' && battlePlayer(this.room.game) === this.room.me
      && this.room.seats.find(s => s.id === this.room.me)?.control !== 'ai';
  }
  legal(action) {
    if (this.observing()) return TEXT.watchReadOnly;
    if (!this.canOrder() && action.type !== 'respondOffer') return UI_COPY.noTurn;
    try { applyGameAction(this.room.game,this.room.me,action); return ''; } catch (error) { return error.message; }
  }
  async command(action) {
    const reason = this.legal(action);
    if (reason) { this.context.toast(reason); return; }
    await this.context.action(action);
  }
  mount() {
    this.main.innerHTML = frame();
    this.map = new WorldMap(this.main.querySelector('#world-map'), {
      onSelect: key => this.selectTile(key), onSelectArmy: key => {
        if (key !== this.me()?.army.key) return false;
        this.selectArmy(); return true;
      }, onBackground: () => this.clearSelection(), onView: () => { this.positionFlower(); this.layoutHud(); },
      armyFaces: key => this.room?.game.players.filter(p=>p.alive && p.army.key===key).flatMap(p=>p.army.heroes.map(portraitUrl)) || [],
      stationFaces: () => [], atWarWith: id => !isTruce(this.room.game,this.room.me,id),
      tileYield: key => {const tile=this.room?.game.tiles[key];return tile?.owner?{gold:1+(tile.building==='mine'?tile.level*4:0),supply:1+(tile.building==='farm'?tile.level*4:0)}:null;},
      tilePeople: () => ({need:0,limit:MP_RULES.maxGarrison}),
    });
    for (const button of this.main.querySelectorAll('[data-nav]')) button.onclick = () => {
      const route = { recruit:'recruit', heroes:'heroes', flag:'countries', scroll:'admin', gear:'room', help:'guide' }[button.dataset.nav];
      this.openSheet(route);
    };
    this.$('leader').onclick = () => this.openSheet('hero',this.me().id,this.me().army.heroes[0].id);
    this.$('nameplate').onclick = () => this.openSheet('heroes');
    this.$('ticker').onclick = () => this.openSheet('chronicle');
    this.$('find-army').onclick = () => this.selectArmy();
    this.$('center-map').onclick = () => { this.clearSelection(); this.map.centerOn(this.me().capital); };
    this.$('zoom').oninput = event => this.map.zoomTo(Number(event.target.value));
    for (const button of this.main.querySelectorAll('[data-layer]')) button.onclick = () => {
      this.map.setLayer(button.dataset.layer);
      for (const item of this.main.querySelectorAll('[data-layer]')) item.classList.toggle('active',item===button);
    };
    this.$('end-turn').onclick = () => this.command({type:'endTurn'});
    this.hudObserver = new ResizeObserver(() => this.layoutHud());
    this.hudObserver.observe(this.$('ledger'));
  }
  $(id) { return this.main.querySelector(`#${id}`); }
  render(room) {
    const changed = this.room?.code !== room.code || this.room?.role !== room.role;
    if(changed)this.closeSheet();
    const enteringBattle = room.game.battle && this.room?.game.battle?.id !== room.game.battle.id;
    if(enteringBattle && [room.game.battle.attackerId,room.game.battle.defenderId].includes(room.me))this.closeSheet();
    if (changed || !room.game.players.some(p=>p.id===this.observerId))
      this.observerId = (room.game.players.find(p=>p.alive)||room.game.players[0]).id;
    this.room = room; this.view = presentationState(room,this.observerId);
    if (!this.map || !this.main.querySelector('#world-map')) this.mount();
    document.body.classList.add('mp-game');
    const me = this.me(), game = room.game, hero = characterView(me.army.heroes[0],me.id), income = incomeFor(game,me);
    this.map.setState(this.view);
    this.map.setDiplomacy(Object.fromEntries(game.players.map(p=>[p.id,p.id===me.id?'#ffc83d':isTruce(game,me.id,p.id)?'#7ecc9c':'#f0452f'])));
    if (changed) { this.map.zoomTo(innerWidth < 720 ? .8 : 1.1).centerOn(innerWidth < 720 ? me.army.key : '0,0'); this.selection=null; this.armyOpen=false; this.target=null; }
    this.$('leader-portrait').src = portraitUrl(hero);
    this.$('leader-portrait').alt = hero.name;
    this.$('nameplate').innerHTML = `<b>${esc(hero.name)}</b><small>${this.observing()?TEXT.watchingBadge:'领军'}</small>`;
    morph(this.$('ledger'), `<div class="purse"><span class="coin"><img src="assets/icons/gold.webp" alt="金币"></span><b>${me.gold}</b><em>+${income.gold}</em></div>
      <div class="purse"><span class="coin"><img src="assets/icons/food.webp" alt="粮"></span><b>${me.supply}</b><em>${income.supply>=0?'+':''}${income.supply}</em></div>
      <p class="census"><span>领土 ${Object.values(game.tiles).filter(t=>t.owner===me.id).length}</span><span>军队 ${me.army.troops}/40</span><span>同伴 ${me.army.heroes.length}</span></p>`);
    const actor = game.players.find(p=>p.id===(battlePlayer(game)||game.turnId));
    const controlled = room.seats.find(s=>s.id===room.me)?.control === 'ai' && me.alive && room.status==='playing';
    const offers = readSocial(game).offers.filter(o=>o.to===room.me&&o.expires>=game.round&&game.players.some(p=>p.id===o.from&&p.alive));
    morph(this.$('goals'), `<h3>${this.observing()?`${room.isHost?TEXT.hostSpectatorBadge:TEXT.watchTitle} · `:''}第 ${game.round} 轮 <button id="room-shortcut">${esc(room.code)}</button></h3><p>${esc(MP_RULES.maps[room.map].name)} · ${game.round<=2?'休战期':'领土争夺'}</p>
      <p>${this.canOrder()?esc(formatUi('myTurn',{ap:game.ap})):esc(formatUi('waitingTurn',{actor:actor?.name||''}))}</p>
      <p><span id="countdown"></span>${controlled?` <button id="resume-control" class="mp-inline">${COPY.resumeButton}</button>`:''}${offers.length?` <button id="incoming-offers" class="mp-inline">来信 ${offers.length}</button>`:''}</p>`);
    this.$('room-shortcut').onclick = () => this.openSheet('room');
    if(this.$('resume-control')) this.$('resume-control').onclick=()=>this.context.resume();
    if(this.$('incoming-offers')) this.$('incoming-offers').onclick=()=>this.openSheet('offers');
    morph(this.$('army-rail'), `<button class="rail" aria-label="选择编队"><i><img src="${portraitUrl(hero)}" alt=""></i><b>${me.army.heroes.length}</b><small>位</small></button>`);
    this.$('army-rail').querySelector('button').onclick=()=>this.selectArmy();
    this.$('ticker').textContent = game.log.at(-1)?.text || UI_COPY.mapHint;
    const C=2*Math.PI*62;
    morph(this.$('end-turn'), `<svg class="ring" viewBox="0 0 142 142">${Array.from({length:3},(_,i)=>`<circle class="seg ${i<game.ap&&game.turnId===me.id?'on':''}" cx="71" cy="71" r="62" stroke-dasharray="${C/3-7} ${C-C/3+7}" stroke-dashoffset="${-i*C/3-3}"></circle>`).join('')}</svg><span class="core"><small>联机 · ${this.observing()?TEXT.watchTitle:'回合'}</small><b>${game.round}</b><em>${this.observing()?TEXT.watchingBadge:this.canOrder()?`余 ${game.ap} 令`:'等待回合'}</em></span>`);
    this.$('end-turn').disabled = !this.canOrder();
    if (game.battle) this.clearSelection();
    else { this.updateHints(); if(this.armyOpen)this.renderArmy(); else if(this.selection)this.renderFlower(); }
    this.battle.render();
    if(room.status==='finished'&&this.sheet?.kind!=='result')this.openSheet('result');
    else if(this.sheet)this.renderSheet();
    this.layoutHud();
  }
  layoutHud() {
    if(!this.room||!this.map||!this.$('ledger'))return;
    const mobile=innerWidth<=720,tools=this.main.querySelector('.view-tools'),rail=this.$('army-rail');
    let y=this.$('ledger').getBoundingClientRect().bottom+6;
    if(mobile) {
      const goal=this.$('goals').getBoundingClientRect();
      if(tools.getBoundingClientRect().left<goal.right+4)y=Math.max(y,goal.bottom+6);
      tools.style.top=`${y}px`; y=tools.getBoundingClientRect().bottom+6;
    } else tools.style.top='';
    rail.style.top=`${y}px`;
    document.documentElement.style.setProperty('--mp-chat-top',`${rail.getBoundingClientRect().bottom+8}px`);
  }
  decorateBattle() {
    if(!this.room?.game.battle)return;
    const root=this.battle.root,allowed=this.canBattle(),game=this.room.game;
    const heading=root.querySelector('.b-top small');
    if(heading&&this.observing())heading.textContent=`${TEXT.watchingBadge} · ${heading.textContent}`;
    root.classList.toggle('mp-watching',!allowed);
    for(const command of ['auto','retreat','end']) for(const button of root.querySelectorAll(`[data-battle-command="${command}"]`)) button.disabled=!allowed;
    for(const button of root.querySelectorAll('[data-battle-command="auto"]')) button.dataset.label=UI_COPY.autoTurn;
    for(const button of root.querySelectorAll('[data-battle-command="save"]')) {button.dataset.label='房间';button.setAttribute('aria-label','房间');}
    const actor=game.players.find(p=>p.id===battlePlayer(game));
    const log=root.querySelector('.b-log');
    if(log&&!allowed)log.textContent=this.room.seats.find(s=>s.id===this.room.me)?.control==='ai'
      ?COPY.resumeRequired:formatUi('battleWaiting',{actor:actor?.name||''});
  }
  setBusy(busy) { this.modal.inert=busy; this.battle.root.inert=busy; }
  updateHints() {
    const me=this.me(), game=this.room.game;
    const claim=new Set(),attack=new Set();
    if(this.armyOpen&&this.canOrder()) for(const key of adjacent(game.tiles[me.army.key])) {
      if(!game.tiles[key]||this.legal({type:'moveArmy',key}))continue;
      (game.tiles[key].owner&&game.tiles[key].owner!==me.id?attack:claim).add(key);
    }
    this.map.setHints({claim,attack}); this.map.setArmy(this.armyOpen?me.army.key:null);
    this.map.setRoute(this.target?{from:me.army.key,to:this.target,kind:game.tiles[this.target]?.owner&&game.tiles[this.target].owner!==me.id?'attack':'move'}:null);
  }
  clearSelection() {
    this.selection=null; this.armyOpen=false; this.target=null; this.ringPage=null;
    if(this.map) { this.map.select(null).setArmy(null).setRoute(null).setHints({});this.$('flower').hidden=true;this.$('army-panel').hidden=true; }
    document.body.classList.remove('army-open','mp-detail-open');
  }
  selectTile(key) {
    if(this.room.game.battle)return;
    if(this.armyOpen) {
      if(this.observing()) {this.clearSelection();this.selectTile(key);return;}
      if(key===this.me().army.key){this.target=null;this.renderArmy();this.updateHints();return;}
      if(!adjacent(this.room.game.tiles[this.me().army.key]).includes(key)){this.context.toast(UI_COPY.notAdjacent);return;}
      this.target=key;this.map.select(key);this.renderArmy();this.updateHints();return;
    }
    this.selection=key;this.ringPage=null;this.map.select(key);document.body.classList.add('mp-detail-open');
    this.renderFlower();
    const mobile=innerWidth<=720;
    this.map.panIntoView(key,{left:mobile?105:220,right:mobile?105:220,top:mobile?210:180,bottom:mobile?300:210});
  }
  selectArmy(target=null) {
    if(this.room.game.battle)return;
    this.selection=null;this.$('flower').hidden=true;this.armyOpen=true;this.target=target;
    document.body.classList.add('army-open','mp-detail-open');
    this.map.setArmy(this.me().army.key).select(this.me().army.key);
    this.map.centerOn(this.me().army.key); this.updateHints();this.renderArmy();
  }
  renderArmy() {
    const me=this.me(),target=this.room.game.tiles[this.target],attack=target?.owner&&target.owner!==me.id;
    const reason=target?this.legal({type:'moveArmy',key:target.key}):'';
    const box=this.$('army-panel');box.hidden=false;
    morph(box,`<div class="ap-in"><header class="ap-head"><span class="ap-flag"><img src="${portraitUrl(me.army.heroes[0])}" alt=""></span><h3>编队<small>${esc(me.army.key)}</small></h3>
      <span class="ap-state">${me.army.troops} 人</span><button class="ap-mini" id="army-tile">地块</button><button class="tag-close" id="army-close" aria-label="收起编队">${icon('close')}</button></header>
      <div class="ap-crew"><div class="ap-row march" aria-label="编队成员">${me.army.heroes.map(h=>`<button class="mp-crew" data-hero="${esc(h.id)}"><img src="${portraitUrl(h)}" alt="${esc(h.name)}"><small>${esc(h.name)}</small></button>`).join('')}</div></div>
      <p class="mp-army-note">${esc(UI_COPY.armyHint)}</p>
      <div class="ap-order${attack?' attack':''}"><div class="ap-goal">${target?`<h4>${attack?'进攻':'行军'} → ${esc(target.key)}</h4><p>1 指令 · 2 补给</p>${reason?`<p class="alarm">${esc(reason)}</p>`:''}`:`<p>${esc(UI_COPY.mapHint)}</p>`}</div>
      ${target?`<button class="ap-go cs-burst${attack?' red':''}" id="army-go" ${reason?'disabled':''}><span>${attack?UI_COPY.attackConfirm:UI_COPY.moveConfirm}</span></button>`:''}</div></div>`);
    box.querySelector('#army-close').onclick=()=>this.clearSelection();
    box.querySelector('#army-tile').onclick=()=>{const key=me.army.key;this.clearSelection();this.selectTile(key);};
    for(const button of box.querySelectorAll('[data-hero]'))button.onclick=()=>this.openSheet('hero',me.id,button.dataset.hero);
    if(box.querySelector('#army-go'))box.querySelector('#army-go').onclick=async()=>{
      const to=this.target; await this.command({type:'moveArmy',key:to});
      if(this.me().army.key===to) {this.target=null;this.updateHints();this.renderArmy();}
    };
  }
  positionFlower() {
    if(!this.selection||!this.map)return;
    const point=this.map.screenOf(this.selection);if(!point)return;
    const flower=this.$('flower');flower.style.left=`${point.x}px`;flower.style.top=`${point.y}px`;
  }
  renderFlower() {
    const game=this.room.game,tile=game.tiles[this.selection],own=tile?.owner===this.room.me;
    if(!tile){this.clearSelection();return;}
    const box=this.$('flower'), build=buildingNames[tile.building]||'';
    let actions;
    if(this.observing()) actions=[
      {label:'诸国',glyph:'flag',run:()=>this.openSheet(tile.owner?'country':'countries',tile.owner)},
      {label:'驻扎',glyph:'heroes',run:()=>this.openSheet('station',tile.owner,null,tile.key)},
    ];
    else if(this.ringPage==='build') actions=[
      {label:'农田',glyph:'farm',action:{type:'build',key:tile.key,building:'farm'}},
      {label:'返回',glyph:'undo',run:()=>{this.ringPage=null;this.renderFlower();}},
      {label:'矿场',glyph:'mine',action:{type:'build',key:tile.key,building:'mine'}},
      {label:'要塞',glyph:'fort',action:{type:'build',key:tile.key,building:'fort'}},
    ];
    else if(this.ringPage==='army') actions=[
      {label:'整编',glyph:'heroes',action:{type:'muster',key:tile.key}},
      {label:'驻军',glyph:'shield',action:{type:'garrison',key:tile.key}},
      {label:'返回',glyph:'undo',run:()=>{this.ringPage=null;this.renderFlower();}},
    ];
    else if(own) actions=[
      {label:'征募',glyph:'recruit',note:'12金 8粮',action:{type:'recruit',key:tile.key}},
      {label:'建设▸',glyph:'castle',run:()=>{this.ringPage='build';this.renderFlower();}},
      {label:'推荐',glyph:'spark',action:{type:'build',key:tile.key,building:tile.building||'farm'}},
      {label:'军务▸',glyph:'shield',run:()=>{this.ringPage='army';this.renderFlower();}},
      {label:'编队',glyph:'sword',run:()=>this.selectArmy()},
      {label:'驻扎',glyph:'heroes',run:()=>this.openSheet('station',tile.owner,null,tile.key)},
    ];
    else actions=[
      {label:tile.owner?'进攻':'开拓',glyph:'sword',run:()=>this.selectArmy(tile.key)},
      {label:'诸国',glyph:'flag',run:()=>this.openSheet(tile.owner?'country':'countries',tile.owner)},
      {label:'外交',glyph:'handshake',run:()=>this.openSheet(tile.owner?'country':'countries',tile.owner)},
    ];
    const reasons=actions.map(a=>a.action?this.legal(a.action):'');
    morph(box,`<div class="ring-hub"><b>${esc(tile.key)}</b><small>${esc(terrainNames[tile.terrain])}</small></div>
      ${actions.map((a,i)=>`<button class="petal${i===0?' primary':''}" data-petal="${i}" style="--x:calc(var(--s) * ${slots[i][0]});--y:calc(var(--s) * ${slots[i][1]});--n:${i}" aria-disabled="${!!reasons[i]}">${icon(a.glyph)}<b>${a.label}</b><small>${esc(reasons[i]?this.shortReason(reasons[i]):a.note||'')}</small></button>`).join('')}
      <div class="tag"><h3>${esc(tile.key)} · ${esc(terrainNames[tile.terrain])}</h3><p class="sub">${esc(game.players.find(p=>p.id===tile.owner)?.name||'无主领土')}${build?` · ${build} ${tile.level} 级`:''}</p><p class="nums">驻军 ${tile.troops}${this.me().army.key===tile.key?` · 军队 ${this.me().army.troops}`:''}</p>${this.ringPage?`<p class="say">${this.ringPage==='build'?'农田 18 金 / 4 粮 · 矿场 18 金 / 4 粮 · 要塞 22 金 / 6 粮':'整编与驻军各消耗 1 指令'}</p>`:''}<button class="tag-close" id="flower-close" aria-label="关闭地块">${icon('close')}</button></div>`);
    box.hidden=false;this.positionFlower();
    box.querySelector('#flower-close').onclick=()=>this.clearSelection();
    for(const button of box.querySelectorAll('[data-petal]'))button.onclick=()=>{
      const i=Number(button.dataset.petal),a=actions[i];
      if(reasons[i])this.context.toast(reasons[i]);else if(a.action)this.command(a.action);else a.run();
    };
  }
  shortReason(reason) {
    if(/金币/.test(reason))return '金币不够';
    if(/补给/.test(reason))return '补给不足';
    if(/指令/.test(reason))return '没指令了';
    if(/回合/.test(reason))return '等待回合';
    if(/上限|达到/.test(reason))return '已达上限';
    return '查看原因';
  }
  openSheet(kind,owner=this.me().id,heroId=null,key=null) {
    this.sheet={kind,owner,heroId,key};document.body.classList.add('mp-sheet-open');this.renderSheet();
    if(!this.modal.open)this.modal.show();
  }
  closeSheet() {this.modal.close();this.sheet=null;document.body.classList.remove('mp-sheet-open');}
  actionButton(label,action,cost='',glyph='spark') {
    if(this.observing())return '';
    const reason=this.legal(action);
    return `<button class="hx cs-offer${reason?' off':' on'}" data-command="${esc(JSON.stringify(action))}" aria-disabled="${!!reason}" data-reason="${esc(reason)}">${icon(glyph)}<b>${esc(label)}</b><small>${esc(reason?this.shortReason(reason):cost)}</small></button>`;
  }
  incomingOffers() {
    const game=this.room.game;
    return readSocial(game).offers.filter(o=>o.to===this.room.me&&o.expires>=game.round&&game.players.some(p=>p.id===o.from&&p.alive))
      .map(o=>`<div class="mp-letter"><b>${esc(game.players.find(p=>p.id===o.from)?.name)} · ${o.kind==='peace'?COPY.peaceButton:COPY.tradeButton}</b><div class="mp-actions">${this.actionButton(COPY.acceptButton,{type:'respondOffer',offerId:o.id,accept:true},'','check')}${this.actionButton(COPY.rejectButton,{type:'respondOffer',offerId:o.id,accept:false},'','close')}</div></div>`).join('');
  }
  renderSheet() {
    const {kind,owner,heroId,key}=this.sheet,game=this.room.game,me=this.me();
    const player=game.players.find(p=>p.id===owner)||me;
    const hero=characterView(player.army.heroes.find(h=>h.id===heroId)||player.army.heroes[0],player.id);
    let title='',paper='',line=UI_COPY.mapHint,lead=hero;
    const roster=p=>`<div class="mp-roster">${p.army.heroes.map(h=>`<button class="fig" data-profile="${esc(h.id)}" data-owner="${p.id}"><img src="${portraitUrl(h)}" alt="${esc(h.name)}"><b>${esc(h.name)}</b><small>${ROLE_NAMES[h.role]}</small></button>`).join('')}</div>`;
    if(kind==='hero') {
      title=hero.name;line=this.observing()?TEXT.watchHint:UI_COPY.interactionHint;
      const own=player.id===me.id;
      paper=`<div class="mp-hero-switch">${player.army.heroes.map(h=>`<button class="cs-peer" data-profile="${esc(h.id)}" data-owner="${player.id}" aria-label="${esc(h.name)}"><img src="${portraitUrl(h)}" alt=""></button>`).join('')}</div><h3>${esc(hero.name)} <small>${esc(ROLE_NAMES[hero.role])}</small></h3>
        <div class="mp-stats"><span>攻击 <b>${hero.stats.attack}</b></span><span>防御 <b>${hero.stats.defense}</b></span><span>亲近 <b>${readAffinity(game,me.id,player.id,hero.sourceId)}</b></span></div>
        <div class="mp-actions">${this.actionButton(COPY.talkButton,{type:'talk',targetId:player.id,characterId:hero.sourceId},'+3','chat')}${this.actionButton(COPY.giftButton,{type:'gift',targetId:player.id,characterId:hero.sourceId},'10 金 / 1 令','heart')}
        ${own?['attack','defense'].map(stat=>this.actionButton(stat==='attack'?COPY.trainAttackButton:COPY.trainDefenseButton,{type:'train',targetId:player.id,characterId:hero.sourceId,stat},'20 金 / 8 粮 / 1 令',stat==='attack'?'sword':'shield')).join(''):''}</div><p class="form-hint">${esc(COPY.interactionRules)}</p>
        <button class="small-button secondary" data-country="${player.id}">${esc(player.name)} · 诸国</button>${this.eventsHtml()}`;
    } else if(kind==='heroes') {title='同伴';paper=roster(me);line=UI_COPY.interactionHint;lead=characterView(me.army.heroes[0],me.id);}
    else if(kind==='countries') {
      title='诸国';
      paper=`<div class="mp-countries">${game.players.map(p=>`<button class="mp-country" data-country="${p.id}" style="--c:${this.view.factions[p.id].color}"><img src="${portraitUrl(p.army.heroes[0])}" alt=""><div><h3>${esc(p.name)}</h3><p>${esc(bandName(p.band))}</p><small>${esc(formatUi('countryInfo',{lands:Object.values(game.tiles).filter(t=>t.owner===p.id).length,army:p.army.troops,score:score(game,p)}))} · ${p.alive?(this.room.seats.find(s=>s.id===p.id)?.control==='ai'?COPY.aiBadge:''): '已淘汰'}</small></div></button>`).join('')}</div>${this.incomingOffers()}`;
    } else if(kind==='country') {
      title='会谈';line=UI_COPY.interactionHint;
      const relation=readDiplomacy(game,me.id,player.id);
      paper=`<h3>${esc(player.name)}</h3><p class="form-hint">${esc(bandName(player.band))} · 好感 ${relation.favor}</p>${roster(player)}
        ${player.id!==me.id?`<div class="mp-actions">${[['visit',COPY.visitButton,'1 令'],['diplomaticGift',COPY.diplomaticGiftButton,'20 金 / 1 令'],['offerPeace',COPY.peaceButton,'1 令'],['offerTrade',COPY.tradeButton,'1 令']].map(([type,label,cost])=>this.actionButton(label,{type,targetId:player.id},cost,'handshake')).join('')}</div><p class="form-hint">${esc(COPY.diplomacyRules)}</p>`:''}${this.incomingOffers()}${this.eventsHtml()}`;
    } else if(kind==='room') {
      title=UI_COPY.roomTitle;line=this.observing()?TEXT.watchHint:formatUi('roomSheetLine',{code:this.room.code});
      paper=`<h3>${esc(this.room.title)}</h3><p class="mp-room-code">${this.room.code}</p><p class="form-hint">${esc(formatAccess('watchCount',{count:this.room.spectators||0}))} · ${this.room.allowSpectators?TEXT.watchOpenBadge:TEXT.watchClosedBadge}</p>
        ${this.room.hostRole==='spectator'?`<p>${esc(this.room.hostName)} · ${TEXT.hostSpectatorBadge}${this.room.isHost?' · 你':''}</p>`:''}
        ${this.observing()?`<label>${TEXT.watchPerspective}<select id="watch-perspective">${game.players.map(p=>`<option value="${p.id}"${p.id===me.id?' selected':''}>${esc(p.name)}</option>`).join('')}</select></label>`:''}
        <div class="mp-members">${this.room.seats.map(s=>`<p>${esc(s.name)}${s.id===this.room.me?' · 你':''}<small>${s.agent?TEXT.agentBadge+(s.agentRef?' #'+esc(s.agentRef):'')+' · ':''}${s.control==='ai'?COPY.aiBadge:s.online?'在线':''}</small></p>`).join('')}</div>
        <div class="mp-actions plain">${!this.observing()&&this.room.seats.find(s=>s.id===me.id)?.control==='ai'&&me.alive&&this.room.status==='playing'?`<button id="room-resume" class="small-button">${COPY.resumeButton}</button>`:''}
        ${this.observing()&&this.room.status==='playing'?`<button id="watch-join" class="small-button"${this.room.seats.some(s=>s.control==='ai'&&game.players.some(p=>p.id===s.id&&p.alive))?'':' disabled'}>${TEXT.watchJoin}</button>`:''}
        ${this.room.isHost?`<button id="toggle-watch" class="small-button secondary">${this.room.allowSpectators?TEXT.watchDisableButton:TEXT.watchEnableButton}</button>${!this.observing()?`<button id="host-observe" class="small-button secondary">${TEXT.hostObserveButton}</button>`:''}`:''}
        ${this.context.canManageInvites()?`<button id="invite-dot" class="small-button">${this.context.canInviteDot()&&(!this.observing()||this.room.isHost)?TEXT.agentTitle:TEXT.myInvites}</button>`:''}
        ${this.room.canDissolve?`<button id="dissolve-room" class="small-button danger">${TEXT.dissolveButton}</button>`:''}
        ${this.context.isAgent()?`<button id="rename-agent" class="small-button secondary">${TEXT.agentRenameTitle}</button>`:''}
        <button id="invite" class="small-button">复制邀请</button><button id="show-chat" class="small-button secondary">房间频道</button><button id="room-guide" class="small-button secondary">指南</button><button id="leave-room" class="small-button danger">离开房间</button></div><p class="form-hint">${esc(this.observing()?TEXT.watchLeave:COPY.leaveExplanation)}</p>`;
    } else if(kind==='offers') {title='来信';line=COPY.noBattleTreaty;paper=this.incomingOffers()||`<p class="pg-empty">${COPY.noOffers}</p>`;}
    else if(kind==='admin') {
      title='内政';const income=incomeFor(game,me);line=UI_COPY.mapRules;
      paper=`<h3>国库</h3><div class="mp-stats"><span>金币 <b>${me.gold}</b><small>+${income.gold}/轮</small></span><span>补给 <b>${me.supply}</b><small>${income.supply>=0?'+':''}${income.supply}/轮</small></span><span>军队 <b>${me.army.troops}/40</b></span></div><h4>建设</h4><p class="form-hint">${esc(UI_COPY.mapHint)}</p><div class="mp-lands">${Object.values(game.tiles).filter(t=>t.owner===me.id).map(t=>`<button class="small-button secondary" data-land="${t.key}">${t.key} · ${buildingNames[t.building]||terrainNames[t.terrain]}${t.level?` ${t.level} 级`:''}</button>`).join('')}</div>`;
    } else if(kind==='station') {
      title='驻扎';const tile=game.tiles[key];line=UI_COPY.mapHint;
      paper=`<h3>${esc(key)} · 驻军 ${tile?.troops||0}</h3>${player.army.key===key?roster(player):''}<p class="form-hint">${esc(player.name)}</p>`;
    } else if(kind==='recruit') {
      title='征募';line=UI_COPY.recruitHint;
      const tile=game.tiles[me.army.key];
      paper=`<h3>${esc(tile.key)} · 军队 ${me.army.troops}/40</h3><div class="mp-actions">${this.actionButton('征募6人',{type:'recruit',key:tile.key},'12 金 / 8 粮 / 1 令','recruit')}</div><p class="form-hint">${esc(UI_COPY.recruitHint)}</p>`;
    } else if(kind==='chronicle') {title='编年史';paper=`${this.eventsHtml()}<div class="timeline">${game.log.slice().reverse().map(e=>`<div class="timeline-item"><small>第 ${e.round} 轮</small>${esc(e.text)}</div>`).join('')}</div>`;}
    else if(kind==='result') {
      title='战局结算';line=formatUi('finishedLine',{winner:game.players.filter(p=>game.winners.includes(p.id)).map(p=>p.name).join('、')||'平局'});
      paper=`<h3>${esc(line)}</h3><div class="mp-stats">${game.players.map(p=>`<span>${esc(p.name)}<b>${score(game,p)} 分</b></span>`).join('')}</div><button id="leave-room" class="small-button">离开房间</button>`;
    } else {title='指南';paper=`<h3>联机对局</h3>${[UI_COPY.mapHint,UI_COPY.armyHint,UI_COPY.mapRules,UI_COPY.recruitHint,COPY.takeoverRules,COPY.interactionRules,COPY.diplomacyRules].map(text=>`<p class="form-hint">${esc(text)}</p>`).join('')}`;}
    if(this.observing()&&['hero','country','heroes','recruit'].includes(kind))line=TEXT.watchHint;
    document.getElementById('modal-title').textContent=title;
    document.getElementById('modal-purse').textContent=`金币 ${me.gold} · 补给 ${me.supply} · ${game.turnId===me.id?game.ap:0} 指令`;
    const body=document.getElementById('modal-body'),scroll=body.querySelector('.cs-leaf')?.scrollTop||0;
    morph(body,mangaPage({title,ribbon:player.name,lead,line,paper,cls:'mp-sheet'}));
    if(body.querySelector('.cs-leaf'))body.querySelector('.cs-leaf').scrollTop=scroll;
    for(const button of body.querySelectorAll('[data-profile]'))button.onclick=()=>this.openSheet('hero',button.dataset.owner,button.dataset.profile);
    for(const button of body.querySelectorAll('[data-country]'))button.onclick=()=>this.openSheet('country',button.dataset.country);
    for(const button of body.querySelectorAll('[data-land]'))button.onclick=()=>{this.closeSheet();this.clearSelection();this.map.centerOn(button.dataset.land);this.selectTile(button.dataset.land);};
    for(const button of body.querySelectorAll('[data-command]'))button.onclick=()=>button.dataset.reason?this.context.toast(button.dataset.reason):this.command(JSON.parse(button.dataset.command));
    if(body.querySelector('#invite'))body.querySelector('#invite').onclick=()=>this.context.invite();
    if(body.querySelector('#leave-room'))body.querySelector('#leave-room').onclick=()=>this.context.leave();
    if(body.querySelector('#show-chat'))body.querySelector('#show-chat').onclick=()=>this.context.chat();
    if(body.querySelector('#room-guide'))body.querySelector('#room-guide').onclick=()=>this.openSheet('guide');
    if(body.querySelector('#room-resume'))body.querySelector('#room-resume').onclick=()=>this.context.resume();
    if(body.querySelector('#invite-dot'))body.querySelector('#invite-dot').onclick=()=>this.context.dot();
    if(body.querySelector('#watch-join'))body.querySelector('#watch-join').onclick=()=>this.context.join();
    if(body.querySelector('#toggle-watch'))body.querySelector('#toggle-watch').onclick=()=>this.context.watchSettings();
    if(body.querySelector('#host-observe'))body.querySelector('#host-observe').onclick=()=>this.context.observe();
    if(body.querySelector('#dissolve-room'))body.querySelector('#dissolve-room').onclick=()=>this.context.dissolve();
    if(body.querySelector('#rename-agent'))body.querySelector('#rename-agent').onclick=()=>this.context.rename();
    if(body.querySelector('#watch-perspective'))body.querySelector('#watch-perspective').onchange=event=>{
      this.observerId=event.target.value;this.sheet.owner=this.observerId;this.clearSelection();this.render(this.room);this.map.centerOn(this.me().army.key);
    };
  }
  eventsHtml() {
    return `<div class="timeline mp-interactions">${readSocial(this.room.game).events.filter(e=>this.observing()||e.actor===this.room.me||e.target===this.room.me).slice(-12).reverse().map(e=>`<div class="timeline-item"><small>第 ${e.round} 轮</small>${esc(interactionText(e,this.room.me))}</div>`).join('')}</div>`;
  }
  async battleAction(action) {
    if(!this.canBattle()||this.context.pending()) {this.context.toast(UI_COPY.noTurn);return {ok:false};}
    if(action.type==='battleAuto'&&this.room.game.battleContext.versus)action={...action,type:'battleAutoTurn'};
    const selected=this.battle.selectedId,version=this.room.version;
    await this.context.action(action);
    if(this.room.version>version) {
      this.battle.clearPreview();this.battle.confirmRetreat=false;
      const unit=this.view.battle?.units.find(u=>u.id===selected);
      if(unit?.acted)this.battle.nextReady(1,false);
      this.battle.render();
    }
    return {ok:true};
  }
  suspend() {
    this.closeSheet();this.hudObserver?.disconnect();this.map?.destroy();this.map=null;this.room=null;this.view=presentationState(null);
    if(this.main.querySelector('.app-shell'))this.battle.render();else {this.battle.root.hidden=true;document.body.classList.remove('in-battle');}
    document.body.classList.remove('mp-game','army-open','mp-detail-open');
  }
}

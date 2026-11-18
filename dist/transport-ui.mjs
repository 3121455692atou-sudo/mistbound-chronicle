import * as E from './engine.mjs?v=1118-1603';
import { C } from './campaign-copy.mjs?v=1118-1603';
import { usableAirport, parkedPlanes, AIRCRAFT_MODELS, SHIP_MODELS, aircraftQuote, shipQuote, shipRoute, flightQuote, flightPath } from './transport.mjs?v=1118-1603';
import { mobilityOf } from './campaign.mjs?v=1118-1603';
const boardQuote=(...args)=>E.boardQuote(...args);

export function transportPanel(ctx, selected = null) {
  const { getState, dispatch, esc, focusTile, closeModal, show, toast, placeField } = ctx, state = getState();
  const $ = id => document.getElementById(id), own = Object.values(state.tiles).filter(t => t.ownerId === state.playerId), airports = Object.values(state.tiles).filter(t => usableAirport(state,t.key)), yards = own.filter(t => t.building === 'shipyard');
  const draft=selected&&typeof selected==='object'?selected:{airportKey:selected,yardKey:selected},airportKey=airports.find(t=>t.key===draft.airportKey)?.key||airports[0]?.key||null,yardKey=yards.find(t=>t.key===draft.yardKey)?.key||yards[0]?.key||null;
  const selectedShip = draft.shipId||(typeof selected==='string'?state.tiles[selected]?.shipId:null), fleet = Object.values(state.campaign.ships).filter(s => s.ownerId === state.playerId);
  const field = (id, label, options) => `<label class="field">${esc(label)}<select id="${id}">${options}</select></label>`;
  const option = (id, name, value) => `<option value="${esc(id)}" ${id === value ? 'selected' : ''}>${esc(name)}</option>`;
  const command = (id, label) => `<button id="${id}" class="small-button">${esc(label)}</button>`;
  const read=(title,kicker,paper,setup)=>ctx.openReading(title,kicker,ctx.mangaPage({cls:'campaign-page',title,lead:getState().characters[getState().activeHeroId],line:[C.launch,C.flying].includes(title)?C.airportOnly:C.shipIndependent,paper}),()=>{$('modal').className='screen sheet-mode page-screen';setup?.();});
  const hasNative = own.some(t => [...t.field, ...t.garrison].some(id => mobilityOf(state, id).air));
  const html = `<h4>${esc(C.aircraftInventory)}</h4><p class="form-hint">${esc(airports.length?C.airportOnly:C.vehicleNoAirport)}</p><p class="form-hint">${esc(C.flightStats)}</p>
    <div class="form-row">${placeField('transport-airport-pick',C.airport,airportKey)}${field('transport-plane-model', C.planeModel, Object.values(AIRCRAFT_MODELS).map(m => option(m.id, m.name, draft.planeModel)).join(''))}<label class="field">${esc(C.planeCount)}<input id="transport-plane-count" type="number" min="1" max="12" value="${draft.count||1}" /></label></div>
    <div id="transport-plane-inventory" class="status-box" role="status"></div><div id="transport-plane-price" class="form-hint"></div><div class="form-actions">${command('transport-buy-plane', C.buyPlane)}${command('transport-flight-form', C.launch)}${hasNative ? command('transport-native-form', C.air + C.launch) : ''}</div>
    <h4>${esc(C.buildShip)}</h4><p class="form-hint">${esc(yards.length?C.shipIndependent:C.vehicleNoShipyard)}</p><div class="form-row">${placeField('transport-yard-pick',C.shipyardName,yardKey)}${field('transport-ship-model', C.shipModel, Object.values(SHIP_MODELS).map(m => option(m.id, m.name, draft.shipModel)).join(''))}</div><div id="transport-ship-price" class="form-hint"></div>${command('transport-build-ship', C.buildShip)}
    <h4>${esc(C.fleet)}</h4><div class="campaign-fleet">${fleet.map(s => { const t = state.tiles[s.key], m = SHIP_MODELS[s.modelId]; return `<article class="campaign-city"><img class="building-thumb" src="assets/buildings/ship.webp" alt="" /><div><h4>${esc(m.name)} <small>${esc(s.id)} · ${esc(s.key)}</small></h4><p>${C.speed} ${m.speed} · ${C.passengers} ${t.troops + t.field.length + t.garrison.length}/${m.capacity}${s.goal ? ' → ' + esc(s.goal) : ''}</p><button class="cs-link" data-open-ship="${esc(s.id)}">${esc(C.armyOrders)} →</button><button class="cs-link" data-locate-ship="${esc(s.key)}">${esc(C.fleetLocate)} →</button></div></article>`; }).join('')}</div>
    <h4>${esc(C.flying)}</h4><div class="campaign-flights">${Object.values(state.campaign.flights).filter(f => f.ownerId === state.playerId).map(f => `<article class="campaign-subject"><h4>${esc(f.id)} <small>${esc(f.key)} → ${esc(f.toKey)}</small></h4><p>${f.pilotIds.map(id => esc(state.characters[id].name)).join('、')} · ${C.speed} ${f.speed}</p>${f.blocked ? `<p class="alarm">${esc(f.blocked)}</p>` : ''}<button class="cs-link" data-open-flight="${esc(f.id)}">${esc(C.divert)} →</button></article>`).join('')}</div>`;
  const run = (action, redo, reviewed=state) => {
    if(getState()!==reviewed||getState().revision!==reviewed.revision){toast(C.invalidAction,true);return {ok:false};}
    const result = dispatch({...action,expectedRevision:reviewed.revision});
    if (result?.ok) { if (getState().battle) closeModal(); else redo?.(result); }
    return result;
  };
  function bind() {
    const saved=()=>({...draft,airportKey,yardKey,planeModel:$('transport-plane-model').value,shipModel:$('transport-ship-model').value,count:Number($('transport-plane-count').value)});
    $('transport-airport-pick').onclick=()=>{const keep=saved();ctx.pickTile({label:C.airport,initial:airportKey,eligible:t=>usableAirport(getState(),t.key),onPick:key=>show('transport',{...keep,airportKey:key}),onCancel:()=>show('transport',keep)});};
    $('transport-yard-pick').onclick=()=>{const keep=saved();ctx.pickTile({label:C.shipyardName,initial:yardKey,eligible:t=>t.ownerId===getState().playerId&&t.building==='shipyard',onPick:key=>show('transport',{...keep,yardKey:key}),onCancel:()=>show('transport',keep)});};
    const planeQuote = () => aircraftQuote(getState(), airportKey, $('transport-plane-model').value, Number($('transport-plane-count').value));
    const updatePlanes = () => {
      const key = airportKey, q = planeQuote(), planes = parkedPlanes(getState(), key);
      $('transport-plane-inventory').innerHTML = `<b>${esc(C.parked)} ${planes.length}</b>${planes.map(p=>`<p>${esc(p.id)} ${esc(AIRCRAFT_MODELS[p.modelId].name)} <button class="small-button secondary" data-scrap-plane="${esc(p.id)}">${esc(C.scrapVehicle)}</button></p>`).join('')}`;
      document.querySelectorAll('[data-scrap-plane]').forEach(b=>b.onclick=()=>run({type:'scrapAircraft',vehicleId:b.dataset.scrapPlane},()=>show('transport',{...saved(),airportKey:key})));
      $('transport-plane-price').textContent = (q.model?.description||'')+' · '+(q.reason || `${q.cost.gold} ${C.gold} · ${q.cost.supply} ${C.supply} · ${q.cost.ap} ${C.actions}`);
      $('transport-buy-plane').disabled = !q.enabled; $('transport-flight-form').disabled = !key || !planes.length;
    };
$('transport-plane-model').onchange = updatePlanes; $('transport-plane-count').oninput = updatePlanes; updatePlanes();
    $('transport-buy-plane').onclick = () => run(planeQuote().action, () => show('transport', airportKey));
    $('transport-flight-form').onclick = () => flightForm(airportKey, false);
    if ($('transport-native-form')) $('transport-native-form').onclick=()=>ctx.pickTile({label:C.air,eligible:t=>t.ownerId===getState().playerId&&[...t.field,...t.garrison].some(id=>mobilityOf(getState(),id).air),onPick:key=>flightForm(key,true),onCancel:()=>show('transport',draft)});
    const boatQuote = () => shipQuote(getState(), yardKey, $('transport-ship-model').value);
    const updateShip = () => { const q = boatQuote(); $('transport-ship-price').textContent = (q.model?.description||'')+' · '+(q.reason || `${q.cost.gold} ${C.gold} · ${q.cost.supply} ${C.supply} · ${q.cost.ap} ${C.actions}`); $('transport-build-ship').disabled = !q.enabled; };
$('transport-ship-model').onchange = updateShip; updateShip();
    $('transport-build-ship').onclick = () => run(boatQuote().action, () => show('transport', yardKey));
    document.querySelectorAll('[data-open-ship]').forEach(b => b.onclick = () => shipForm(b.dataset.openShip));
    document.querySelectorAll('[data-locate-ship]').forEach(b => b.onclick = () => { closeModal(); focusTile(b.dataset.locateShip); });
    document.querySelectorAll('[data-open-flight]').forEach(b => b.onclick = () => flightForm(null, false, b.dataset.openFlight));
    if(selectedShip)shipForm(selectedShip);else if(draft.flightId)flightForm(null,false,draft.flightId);
  }
  function flightForm(fromKey, native = false, flightId = null, draft={}) {
    const s=getState(),runHere=(action,redo)=>run(action,redo,s);
    const flight = s.campaign.flights[flightId], source = s.tiles[fromKey], loiter = draft.loiter ?? flight?.loiter ?? false;
    const destinationTiles = Object.values(s.tiles).filter(t => loiter ? t.discovered && t.key !== (flight?.key || fromKey) : (flight?.native || native ? t.ownerId === s.playerId && s.terrainTypes[t.terrainId].passable : usableAirport(s, t.key)) && t.key !== (flight?.fromKey || fromKey));
    const destinationKeys = new Set(destinationTiles.map(t => t.key));
    const destinationKey=destinationTiles.find(t=>t.key===(draft.toKey||flight?.toKey))?.key||null;
    const pilots = source ? [...source.field, ...source.garrison,...(s.campaign.airportGuests[fromKey]||[])].filter(id => s.characterOwners[id] === s.playerId && !s.captives[id] && (!native || mobilityOf(s, id).air)) : [], planes = source ? parkedPlanes(s, fromKey) : [];
    const enemies=flight?Object.values(s.campaign.flights).filter(other=>other.ownerId!==s.playerId&&s.relations[[s.playerId,other.ownerId].sort().join('|')]?.status==='war'&&Math.max(Math.abs(s.tiles[flight.key].q-s.tiles[other.key].q),Math.abs(s.tiles[flight.key].r-s.tiles[other.key].r),Math.abs(s.tiles[flight.key].q+s.tiles[flight.key].r-s.tiles[other.key].q-s.tiles[other.key].r))<=1):[];
    const slots = flight ? '' : pilots.map(id => `<label class="campaign-country"><input type="checkbox" data-flight-pilot="${esc(id)}" ${draft.pilotIds?.includes(id)?'checked':''} /><b>${esc(s.characters[id].name)}</b>${native ? '' : `<select aria-label="${esc(s.characters[id].name)} ${esc(C.aircraft)}" data-pilot-plane="${esc(id)}"><option value="">—</option>${planes.map(p => option(p.id, `${p.id} ${AIRCRAFT_MODELS[p.modelId].name}`, draft.pilotPlanes?.[id])).join('')}</select>`}</label>`).join('');
    read(flight?C.flying:C.launch, '', `<div class="comic-sheet"><div class="comic-banner"><div><b>${esc(flight?C.flying:C.launch)} · ${esc(flight?.id || fromKey)}</b><p>${esc(native || flight?.native ? C.objectiveDetail : C.airportOnly)}</p></div></div><div class="form-row">${field('flight-mission',C.flightMission,option('landing',C.airportLanding,loiter?'patrol':'landing')+option('patrol',C.patrol,loiter?'patrol':'landing'))}</div><p class="form-hint">${esc(loiter?C.patrolDetail:flight?C.flightWaitingDetail:C.flightStats)}</p>${flight ? `<p>${flight.pilotIds.map(id => esc(s.characters[id].name)).join('、')}</p>${enemies.map(other=>{const blocked=E.getWarAccessReason(s,s.playerId,other.ownerId);return `<p>${esc(s.factions[other.ownerId]?.name)} · ${esc(other.key)} · ${other.pilotIds.map(id=>esc(s.characters[id].name)).join('、')} · ${other.native?esc(C.air):other.planeIds.map(id=>esc(AIRCRAFT_MODELS[s.campaign.planes[id].modelId].name)).join(' / ')} · 2 ${esc(C.actions)} <button class="small-button" ${blocked||s.ap<2||s.factions[s.playerId].supply<2||flight.foughtTurn===s.turn?'disabled':''} data-intercept-flight="${esc(other.id)}">${esc(C.airBattle)}</button>${blocked?`<span class="form-hint">${esc(blocked)}</span>`:''}</p>`;}).join('')}` : slots}<div class="form-row">${placeField('flight-destination-pick',loiter?C.airspace:C.airDestination,destinationKey)}</div><div id="flight-preview" class="status-box" role="status"></div><div class="form-actions">${command('flight-launch', flight ? C.divert : C.launch)}</div></div>`, () => {
      const quote = () => {
        const pilotIds = [...document.querySelectorAll('[data-flight-pilot]:checked')].map(n => n.dataset.flightPilot), planeIds = pilotIds.map(id => [...document.querySelectorAll('[data-pilot-plane]')].find(n => n.dataset.pilotPlane === id)?.value).filter(Boolean);
        return flightQuote(getState(), fromKey, destinationKey, pilotIds, planeIds, native, id => mobilityOf(getState(), id).air, loiter);
      };
      const update = () => { if (flight) { $('flight-preview').textContent = flight.blocked || (loiter?C.patrolDetail:flight?C.flightWaitingDetail:C.flightStats); $('flight-launch').disabled=!destinationKey; return; } const q = quote(); $('flight-preview').textContent = q.reason || `${C.speed} ${q.speed} · ${q.turns} 回合 · ${q.cost.supply} ${C.supply}`; $('flight-launch').disabled = !q.enabled; };
      document.querySelectorAll('[data-intercept-flight]').forEach(b=>b.onclick=()=>runHere({type:'interceptFlight',flightId,enemyFlightId:b.dataset.interceptFlight}));
      document.querySelectorAll('[data-flight-pilot],[data-pilot-plane]').forEach(n => n.onchange = update);
      const saved=()=>({loiter,toKey:destinationKey,pilotIds:[...document.querySelectorAll('[data-flight-pilot]:checked')].map(n=>n.dataset.flightPilot),pilotPlanes:Object.fromEntries([...document.querySelectorAll('[data-pilot-plane]')].map(n=>[n.dataset.pilotPlane,n.value]))});
      $('flight-mission').onchange=()=>flightForm(fromKey,native,flightId,{...saved(),loiter:$('flight-mission').value==='patrol'});
      $('flight-destination-pick').onclick=()=>{const keep=saved();ctx.pickTile({label:loiter?C.airspace:C.destinationAirport,initial:destinationKey,eligible:t=>destinationKeys.has(t.key),preview:key=>{const path=flightPath(getState(),flight?.key||fromKey,key);return {enabled:Boolean(path),path:path||[],reason:path?'':C.objectiveInvalid};},onPick:key=>flightForm(fromKey,native,flightId,{...keep,toKey:key}),onCancel:()=>flightForm(fromKey,native,flightId,keep)});};update();
      $('flight-launch').onclick = () => runHere(flight ? { type: 'divertFlight', flightId, toKey: destinationKey, loiter } : quote().action, () => show('transport', fromKey));
    });
  }
  function shipForm(id,draft={}) {
    const s=getState(),runHere=(action,redo)=>run(action,redo,s);
    const ship = s.campaign.ships[id], boat = s.tiles[ship?.key]; if (!ship || !boat) return;
    const shores = Object.values(s.tiles).filter(t => t.discovered && s.terrainTypes[t.terrainId].passable && Math.max(Math.abs(t.q - boat.q), Math.abs(t.r - boat.r), Math.abs(t.q + t.r - boat.q - boat.r)) === 1), oceans = Object.values(s.tiles).filter(t => t.discovered && t.terrainId === 'ocean' && t.key !== ship.key), model = SHIP_MODELS[ship.modelId];
    const shoreKey=shores.find(t=>t.key===draft.shoreKey)?.key||shores[0]?.key||null,destinationKey=draft.toKey||ship.goal||null;
    read(C.fleet, '', `<div class="comic-sheet"><div class="comic-banner"><img class="building-thumb" src="assets/buildings/ship.webp" alt="" /><div><b>${esc(model.name)} · ${esc(ship.key)}</b><p>${esc(C.shipIndependent)}</p></div></div><p>${C.passengers} ${boat.troops + boat.field.length + boat.garrison.length}/${model.capacity} · ${C.speed} ${model.speed}</p><p class="form-hint">${esc(C.shipBoardDetail)}</p><p class="form-hint">${esc(C.shoreLandingDetail)}</p><div class="form-row">${placeField('ship-shore-pick',C.dock,shoreKey)}${field('ship-transfer-kind', C.passengers, option('board', C.board, draft.kind||'board') + option('unload', C.shoreLanding, draft.kind||'board'))}<label class="field">${esc(C.troopCount)}<input id="ship-transfer-troops" type="number" min="0" max="${model.capacity}" value="${draft.troops||0}" /></label></div><div id="ship-transfer-people" class="campaign-countries"></div><div id="ship-transfer-preview" class="status-box" role="status"></div>${command('ship-transfer-go', C.confirm)}
      <h4>${esc(C.sail)}</h4><p class="form-hint">${esc(C.shipSailDetail)}</p><div class="form-row">${placeField('ship-destination-pick',C.objective,destinationKey)}${field('ship-mode', C.armyOrders, option('main', C.mainArmy, ship.mode) + option('free', C.freeArmy, ship.mode))}</div><div id="ship-route-preview" class="status-box" role="status"></div><div class="form-actions">${command('ship-sail-go', C.sail)}${command('ship-goal-go', C.objective)}${command('ship-mode-go', C.armyOrders)}${command('ship-goal-cancel', C.clearRoute)}</div><p class="form-hint">${esc(C.scrapVehicleDetail)}</p>${command('ship-scrap',C.scrapVehicle)}</div>`, () => {
      const isUnload = () => $('ship-transfer-kind').value === 'unload';
      const quote = () => {
        const state=getState(),ids=[...document.querySelectorAll('[data-ship-person]:checked')].map(n=>n.dataset.shipPerson),troops=Number($('ship-transfer-troops').value),shore=state.tiles[shoreKey];
        if(!isUnload()||shore?.ownerId===state.playerId)return boardQuote(state,id,shoreKey,ids,troops,isUnload());
        const attack=shore?.ownerId?E.previewAttack(state,boat.key,shoreKey,troops,ids):null;
        const reason=attack?attack.reason||attack.error:!shore||troops<1||troops>boat.troops||ids.length+troops===0||boat.foughtTurn===state.turn||state.ap<2||state.factions[state.playerId].supply<2?C.shoreInvalid:'';
        return {enabled:!reason,reason,people:boat.troops+boat.field.length,capacity:model.capacity,cost:{ap:2,supply:2},action:{type:'shoreLanding',shipId:id,shoreKey,characterIds:ids,troops}};
      };
      const preview = () => { const q = quote(); $('ship-transfer-preview').textContent = q.reason || `${C.passengers} ${q.people}/${q.capacity}`; $('ship-transfer-go').disabled = !q.enabled; };
      const people = () => {
        const from = isUnload() ? boat : s.tiles[shoreKey];
        $('ship-transfer-people').innerHTML = [...(from?.field || []), ...(from?.garrison || [])].map(who => `<label class="campaign-country"><input type="checkbox" data-ship-person="${esc(who)}" ${draft.characterIds?.includes(who)?'checked':''} /><b>${esc(s.characters[who].name)}</b></label>`).join('');
        document.querySelectorAll('[data-ship-person]').forEach(n => n.onchange = preview); preview();
      };
$('ship-transfer-kind').onchange = people; $('ship-transfer-troops').oninput = preview; people();
      $('ship-transfer-go').onclick = () => runHere(quote().action, () => shipForm(id));
      const route = () => { const q = E.getShipVoyageQuote(getState(), id, destinationKey); $('ship-route-preview').textContent = `${C.speed} ${model.speed} · ${q.turns} 回合 · ${q.cost.ap} ${C.actions} · ${q.cost.supply} ${C.supply}${q.reason?' · '+q.reason:''}`; $('ship-sail-go').disabled = !q.enabled; $('ship-goal-go').disabled = q.path.length<2; };
      const saved=()=>({shoreKey,toKey:destinationKey,kind:$('ship-transfer-kind').value,troops:Number($('ship-transfer-troops').value),characterIds:[...document.querySelectorAll('[data-ship-person]:checked')].map(n=>n.dataset.shipPerson)});
      $('ship-shore-pick').onclick=()=>{const keep=saved();ctx.pickTile({label:C.dock,initial:shoreKey,eligible:t=>shores.some(n=>n.key===t.key),onPick:key=>shipForm(id,{...keep,shoreKey:key,characterIds:[]}),onCancel:()=>shipForm(id,keep)});};
      $('ship-destination-pick').onclick=()=>{const keep=saved();ctx.pickTile({label:C.sail,initial:destinationKey,eligible:t=>t.discovered&&t.terrainId==='ocean'&&t.key!==ship.key,preview:key=>{const q=E.getShipVoyageQuote(getState(),id,key);return {...q,enabled:q.path.length>1};},onPick:key=>shipForm(id,{...keep,toKey:key}),onCancel:()=>shipForm(id,keep)});};route();
      $('ship-sail-go').onclick = () => runHere({ type: 'sailShip', shipId: id, toKey: destinationKey }, () => shipForm(id));
      $('ship-goal-go').onclick = () => runHere({ type: 'setShipGoal', shipId: id, toKey: destinationKey }, () => shipForm(id));
      $('ship-goal-cancel').onclick = () => runHere({ type: 'setShipGoal', shipId: id, toKey: null }, () => shipForm(id));
      $('ship-scrap').disabled=Boolean(boat.troops+boat.field.length+boat.garrison.length);$('ship-scrap').onclick=()=>runHere({type:'scrapShip',vehicleId:id},()=>show('transport'));
      $('ship-mode-go').onclick = () => runHere({ type: 'setShipMode', shipId: id, mode: $('ship-mode').value }, () => shipForm(id));
    });
  }
  return { html, bind };
}

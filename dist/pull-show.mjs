/* The card show for a recruit pull: cards are dealt face down, the strong ones glow, then each one turns over.
   A girl stops the show for her own entrance. A tap hurries everything along, and she still gets her moment. */
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PAUSE = { N: 130, R: 180, SR: 340, SSR: 540 }, TEASE = { N: 180, R: 240, SR: 480, SSR: 820, girl: 980 };
const ORDER = ['N', 'R', 'SR', 'SSR', 'girl'], GAP = 8, RATIO = .72;
let cancelRunning = null;

export function deckHtml(picks, serial) {
  return `<div class="deck" id="deck-${serial}">${picks.map((pick, i) => `<div class="pcard ${pick.girl ? 'girl' : 'sazai'}" data-rank="${pick.rank}" style="--glow:${esc(pick.glow)};--n:${i}"><span class="pcard-in"><span class="pcard-back"><i>奏</i></span><span class="pcard-front"><img src="${esc(pick.img)}" alt="" /><em>${pick.girl ? '★' : esc(pick.rank)}</em><b>${esc(pick.name)}</b></span></span></div>`).join('')}</div>`;
}

/** Lays cards out to fill the room there is: two rows of five on a wide stage, 3-4-3 on a tall one. */
function arrange(root) {
  const deck = root.querySelector('.deck');
  if (!deck) return; // the screen moved on while a resize was still queued
  const cards = [...deck.children];
  // The deck owns a separate flow stage; information below never subtracts its room.
  deck.style.bottom = '8px';
  const w = deck.clientWidth, h = deck.clientHeight;
  if (!w || !h) return;
  const rows = cards.length === 1 ? [1] : w / h > 1.05 ? [5, 5] : [3, 4, 3], widest = Math.max(...rows);
  const fit = cards.length === 1 ? w * .7 : (w - GAP * (widest - 1)) / widest;
  const cw = Math.floor(Math.min(fit, (h - GAP * (rows.length - 1)) / rows.length * RATIO)), ch = Math.floor(cw / RATIO);
  deck.style.setProperty('--cw', `${cw}px`); deck.style.setProperty('--ch', `${ch}px`);
  deck.style.setProperty('--sx', `${Math.round((w - cw) / 2)}px`); deck.style.setProperty('--sy', `${h + 30}px`);
  let n = 0;
  rows.forEach((count, r) => {
    const left = (w - count * cw - (count - 1) * GAP) / 2, top = (h - rows.length * ch - (rows.length - 1) * GAP) / 2 + r * (ch + GAP);
    for (let c = 0; c < count; c++, n++) { cards[n].style.setProperty('--x', `${Math.round(left + c * (cw + GAP))}px`); cards[n].style.setProperty('--y', `${Math.round(top)}px`); }
  });
}

export function playPull(root, picks, { sound = () => {} } = {}) {
  cancelRunning?.();
  const deck = root.querySelector('.deck'), cards = [...deck.children], meet = root.querySelector('.meet');
  const best = picks.reduce((a, p) => { const r = p.girl ? 'girl' : p.rank; return ORDER.indexOf(r) > ORDER.indexOf(a) ? r : a; }, 'N');
  let timer = 0, pending = null, rushing = false, next = 0, awaiting = null, readyAt = 0;
  const events = new AbortController(), watcher = new ResizeObserver(() => arrange(root));
  const cancel = () => { clearTimeout(timer); pending = null; awaiting = null; events.abort(); watcher.disconnect(); if (cancelRunning === cancel) cancelRunning = null; };
  cancelRunning = cancel;
  const wait = (ms, step) => {
    pending = step; clearTimeout(timer);
    timer = setTimeout(() => { pending = null; if (root.isConnected && root.closest('dialog')?.open !== false) step(); else cancel(); }, ms);
  };
  const flash = () => { root.classList.remove('flash'); void root.offsetWidth; root.classList.add('flash'); };
  const finish = () => { root.classList.remove('playing'); root.classList.add('played'); cancel(); watcher.observe(deck); };

  function entrance(pick) {
    meet.style.setProperty('--glow', pick.glow);
    meet.innerHTML = `<i class="speed-lines"></i><div class="stagehand shadow"><img src="${esc(pick.img)}" alt="" /></div>`;
    meet.hidden = false;
    wait(rushing ? 200 : 680, () => {
      meet.querySelector('.stagehand').classList.remove('shadow'); flash(); sound('meet');
      meet.insertAdjacentHTML('beforeend', `<span class="rankword">相遇！</span><p class="sayline">${esc(pick.line)}</p><small class="meet-go">点一下继续</small>`);
      readyAt = performance.now() + 320;
      awaiting = () => { awaiting = null; meet.hidden = true; meet.innerHTML = ''; wait(rushing ? 60 : 180, flip); };
    });
  }
  function flip() {
    if (next >= picks.length) return finish();
    const pick = picks[next], card = cards[next]; next++;
    card.classList.add('open');
    if (pick.girl || pick.rank === 'SR' || pick.rank === 'SSR') { card.classList.add('hit'); flash(); }
    sound(pick.girl || pick.rank === 'SSR' ? 'ssr' : pick.rank === 'SR' ? 'rare' : 'flip');
    if (pick.girl) wait(rushing ? 140 : 420, () => entrance(pick));
    else wait(rushing ? 26 : PAUSE[pick.rank], flip);
  }
  root.addEventListener('click', event => {
    if (event.target.closest?.('.pull-row')) return;
    if (awaiting) { if (performance.now() >= readyAt) awaiting(); return; }
    rushing = true; root.classList.add('rushed');
    if (pending) { const step = pending; pending = null; clearTimeout(timer); step(); }
  }, { signal: events.signal });

  arrange(root); watcher.observe(deck); sound('deal');
  wait(picks.length * 45 + 340, () => {
    root.style.setProperty('--glow', cards[picks.findIndex(p => (p.girl ? 'girl' : p.rank) === best)].style.getPropertyValue('--glow'));
    root.classList.add('tease'); if (best !== 'N' && best !== 'R') { flash(); sound('rare'); }
    wait(rushing ? 60 : TEASE[best], flip);
  });
}

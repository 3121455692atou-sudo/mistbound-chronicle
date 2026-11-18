import {fallbackPortrait} from './ui-model.mjs?v=1118-1603';
import {MapRegionIndex, collectNationLands} from './map-region-index.mjs?v=1118-1603';
import {buildingLabelModel, layoutBuildingLabels} from './map-building-ui.mjs?v=1118-1603';
import {controlAt} from './campaign.mjs?v=1118-1603';
import {territoryOwner} from './waters.mjs?v=1118-1603';
/*
 * Mistbound Chronicle — a dependency-free canvas atlas.
 * Rendering only: every rule and every state mutation belongs to the engine.
 */

const SQRT3 = Math.sqrt(3);
const SIZE = 40;
const LABEL_RISE = 50;
const TERRITORY_WASH = .2, GLOW_DEPTH = .62, GLOW_SCALE = 1.5;
const nationTint = faction => faction?.isPlayer ? '#ffcf6b' : faction?.color || '#f2b84b';
const MIN_ZOOM = 0.42;
const MAX_ZOOM = 2.8;
const EDGE_NEIGHBORS = [[1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1]];
const TILT = .72; // Board tilt: rows are squashed, heights stay upright.
const CORNERS = Array.from({ length: 6 }, (_, i) => {
  const a = Math.PI / 180 * (i * 60 - 90);
  return [Math.cos(a), Math.sin(a) * TILT];
});
const SERIF = '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", system-ui, sans-serif';
const SANS = 'Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
const ASSET_ROOT = new URL('./assets/', import.meta.url).href;
const TERRAIN_ART = ['plains', 'meadow', 'forest', 'pine', 'jungle', 'hills', 'mountain', 'desert', 'oasis', 'wetland', 'tundra', 'snow', 'volcanic', 'ruins', 'coast', 'lake', 'salt', 'crystal'];
const KIND_ART = { savanna: 'plains', marsh: 'wetland', water: 'lake', river: 'lake', farm: 'plains', volcano: 'volcanic', badlands: 'hills', orchard: 'forest' };
const PALETTE = {
  meadow: '#a6bb83', forest: '#658975', pine: '#688478', hills: '#b5b27b',
  mountain: '#9bada5', snow: '#cfddd8', tundra: '#a6b9a8', desert: '#d4bf89',
  savanna: '#bdbb7b', marsh: '#82a89b', water: '#7caab2', coast: '#a7c4b5',
  river: '#a2bd97', farm: '#c2ba78', ruins: '#b6b495', crystal: '#a5b4b8',
  volcano: '#9b8b80', badlands: '#bfa082', oasis: '#c7bd8e', orchard: '#9db483',
};

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
function finite(n, fallback = 0) { return Number.isFinite(Number(n)) ? Number(n) : fallback; }
function hash(q, r, salt = 0) {
  let n = Math.imul(q | 0, 374761393) ^ Math.imul(r | 0, 668265263) ^ Math.imul(salt | 0, 1442695041);
  n = Math.imul(n ^ n >>> 13, 1274126177);
  return ((n ^ n >>> 16) >>> 0) / 4294967295;
}
function parseColor(color, fallback = '#9caf95') {
  if (typeof color !== 'string') return parseColor(fallback, '#9caf95');
  const raw = color.trim();
  let m = /^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.exec(raw);
  if (m) {
    let hex = m[1];
    if (hex.length === 3) hex = [...hex].map(c => c + c).join('');
    return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
  }
  m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i.exec(raw);
  if (m) return m.slice(1, 4).map(v => clamp(Number(v), 0, 255));
  return color === fallback ? [156, 175, 149] : parseColor(fallback, '#9caf95');
}
function mix(a, b, amount) {
  const ca = parseColor(a), cb = parseColor(b);
  return `rgb(${ca.map((v, i) => Math.round(v + (cb[i] - v) * amount)).join(',')})`;
}
/** Whether a box centred on (x, y) reaches into the quiet circle, or under the info card beside it. */
const touchesCircle = (circle, x, y, w, h) => {
  const dx = Math.max(Math.abs(circle.x - x) - w / 2, 0), dy = Math.max(Math.abs(circle.y - y) - h / 2, 0), card = circle.card;
  return dx * dx + dy * dy < circle.r * circle.r || Boolean(card && x + w / 2 > card.left && x - w / 2 < card.right && y + h / 2 > card.top && y - h / 2 < card.bottom);
};
function hexPath(ctx, x = 0, y = 0, radius = SIZE) {
  ctx.beginPath();
  CORNERS.forEach(([cx, cy], i) => i ? ctx.lineTo(x + cx * radius, y + cy * radius) : ctx.moveTo(x + cx * radius, y + cy * radius));
  ctx.closePath();
}
function path(ctx, points, fill, stroke, width = 1) {
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) i ? ctx.lineTo(...points[i]) : ctx.moveTo(...points[i]);
  if (fill) { ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function ellipse(ctx, x, y, rx, ry, fill, stroke, width = 1) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function roundRect(ctx, x, y, w, h, radius = 5) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}
function terrainKind(type = {}) {
  const v = `${type.id || ''} ${type.name || ''} ${type.icon || ''}`.toLowerCase();
  if (/volcan|lava|熔|火山/.test(v)) return 'volcano';
  if (/crystal|magic|水晶|晶|灵脉/.test(v)) return 'crystal';
  if (/ruin|ancient|遗迹|废墟/.test(v)) return 'ruins';
  if (/oasis|绿洲/.test(v)) return 'oasis';
  if (/orchard|果园/.test(v)) return 'orchard';
  if (/farm|wheat|crop|田|麦|耕/.test(v)) return 'farm';
  if (/river|河流|河谷|河/.test(v)) return 'river';
  if (/coast|beach|滩|海岸|浅滩/.test(v)) return 'coast';
  if (/water|ocean|lake|sea|海|湖|水域/.test(v)) return 'water';
  if (/snow|ice|glaci|雪|冰/.test(v)) return 'snow';
  if (/tundra|冻土|苔原/.test(v)) return 'tundra';
  if (/pine|taiga|conifer|针叶|松林/.test(v)) return 'pine';
  if (/forest|wood|jungle|rainforest|森林|树林|雨林|密林/.test(v)) return 'forest';
  if (/mountain|peak|山脉|高山|峭|山峰|矿山/.test(v)) return 'mountain';
  if (/hill|丘陵|丘|高地/.test(v)) return 'hills';
  if (/swamp|marsh|wetland|沼泽|湿地/.test(v)) return 'marsh';
  if (/desert|dune|沙漠|沙丘/.test(v)) return 'desert';
  if (/badland|canyon|荒地|峡谷|戈壁/.test(v)) return 'badlands';
  if (/savanna|steppe|草甸|草原/.test(v)) return 'savanna';
  return 'meadow';
}
/** Painted art for a terrain. Mod terrains borrow the closest built-in painting. */
export function terrainArt(type = {}) {
  if (TERRAIN_ART.includes(type.id)) return type.id;
  const kind = terrainKind(type);
  return KIND_ART[kind] || (TERRAIN_ART.includes(kind) ? kind : 'plains');
}
function hexToWorld(q, r) { return { x: SQRT3 * SIZE * (q + r / 2), y: SIZE * 1.5 * r * TILT }; }
function worldToHex(x, rawY) {
  const y = rawY / TILT;
  const q = (SQRT3 / 3 * x - y / 3) / SIZE, r = 2 * y / 3 / SIZE;
  const s = -q - r;
  let rq = Math.round(q), rr = Math.round(r), rs = Math.round(s);
  const qd = Math.abs(rq - q), rd = Math.abs(rr - r), sd = Math.abs(rs - s);
  if (qd > rd && qd > sd) rq = -rr - rs;
  else if (rd > sd) rr = -rq - rs;
  return { q: rq, r: rr, key: `${rq},${rr}` };
}

function drawTree(ctx, x, y, size, pine = false, autumn = false) {
  ctx.save(); ctx.translate(x, y);
  ellipse(ctx, 1, size * .31, size * .42, size * .16, 'rgba(35,58,44,.15)');
  path(ctx, [[0, 3], [0, -size * .4]], null, '#5b6450', 1.7);
  if (pine) {
    path(ctx, [[-size * .46, 0], [0, -size * 1.25], [size * .46, 0]], '#365f52', '#31564b', .6);
    path(ctx, [[-size * .4, -size * .35], [0, -size * 1.35], [size * .3, -size * .35]], '#527e66');
    path(ctx, [[0, -size * 1.3], [-size * .3, -size * .45], [0, -size * .58]], '#87a085');
  } else {
    const green = autumn ? '#a8a36a' : '#547a59';
    ellipse(ctx, -size * .23, -size * .45, size * .42, size * .48, '#42694e', '#3d614c', .65);
    ellipse(ctx, size * .25, -size * .4, size * .39, size * .45, green, '#42674d', .55);
    ellipse(ctx, 0, -size * .77, size * .46, size * .47, green, '#42674d', .6);
    ctx.beginPath(); ctx.arc(-size * .08, -size * .83, size * .25, Math.PI * 1.03, Math.PI * 1.8);
    ctx.strokeStyle = autumn ? '#d3c783' : '#98ae7d'; ctx.lineWidth = .95; ctx.stroke();
  }
  ctx.restore();
}
function drawMountain(ctx, x, y, width, height, snow = true, warm = false) {
  const left = warm ? '#af9273' : '#b4c0b7';
  const right = warm ? '#947d67' : '#7f9990';
  path(ctx, [[x - width / 2, y], [x - 1, y - height], [x + width / 2, y]], left, warm ? '#857967' : '#728e83', .8);
  path(ctx, [[x - 1, y - height], [x + width / 2, y], [x + width * .06, y], [x - 3, y - height * .56]], right);
  if (snow) {
    path(ctx, [[x - 1, y - height], [x + width * .2, y - height * .58], [x + 1, y - height * .64], [x - 3, y - height * .52], [x - width * .21, y - height * .59]], '#ecede0');
  }
  path(ctx, [[x - width * .44, y + 2], [x + width * .4, y + 2]], null, 'rgba(72,88,72,.15)', 1.1);
}
function drawGrass(ctx, x, y, color = '#708b58', length = 4) {
  ctx.strokeStyle = color; ctx.lineWidth = .8;
  ctx.beginPath(); ctx.moveTo(x - 2.6, y); ctx.lineTo(x - 4.2, y - length);
  ctx.moveTo(x, y); ctx.lineTo(x + .8, y - length - 1.5);
  ctx.moveTo(x + 2.5, y); ctx.lineTo(x + 4, y - length * .7); ctx.stroke();
}
function drawPalm(ctx, x, y, size = 14) {
  ctx.strokeStyle = '#7f7854'; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 3, y - size / 2, x + 1, y - size); ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * .43 + Math.PI * .1;
    ctx.beginPath(); ctx.moveTo(x + 1, y - size); ctx.quadraticCurveTo(x + 1 + Math.cos(a) * 7, y - size - 5, x + 1 + Math.cos(a) * 10, y - size + Math.sin(a) * 4);
    ctx.strokeStyle = i % 2 ? '#557c58' : '#75935a'; ctx.lineWidth = 2; ctx.stroke();
  }
}
function drawArt(ctx, kind, variant) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const jitter = (n, span = 3) => (hash(variant + n, n * 13, 71) - .5) * span;
  if (kind === 'forest' || kind === 'pine') {
    const locations = [[-13, -9], [11, -7], [-22, 7], [-2, 5], [19, 11], [-6, 20]];
    for (let i = 0; i < locations.length; i++) drawTree(ctx, locations[i][0] + jitter(i), locations[i][1], 11 + jitter(i + 7, 4), kind === 'pine');
  } else if (kind === 'mountain' || kind === 'snow') {
    drawMountain(ctx, 10, 9, 29, 33, true);
    drawMountain(ctx, -10, 15, 33, 40, true);
    drawMountain(ctx, 19, 18, 23, 23, true);
    if (kind === 'snow') {
      path(ctx, [[-23, 23], [-10, 20], [0, 24], [20, 22]], null, '#f0f2e7', 1.2);
      ellipse(ctx, -21, -9, 4, 1, 'rgba(239,243,233,.8)');
    }
  } else if (kind === 'hills') {
    for (const [x, y, w, h] of [[-7, -4, 24, 13], [12, 11, 25, 17], [-15, 18, 22, 13]]) {
      ctx.beginPath(); ctx.moveTo(x - w, y + 4); ctx.quadraticCurveTo(x - w * .15, y - h, x + w, y + 4);
      ctx.fillStyle = '#a6aa70'; ctx.fill(); ctx.strokeStyle = '#7d9267'; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - w * .6, y + 1); ctx.quadraticCurveTo(x, y - h * .47, x + w * .5, y + 1);
      ctx.strokeStyle = '#d7d19a'; ctx.lineWidth = .9; ctx.stroke();
    }
    drawGrass(ctx, -18, -1, '#7d8f62', 3);
  } else if (kind === 'desert' || kind === 'badlands') {
    for (let i = 0; i < 4; i++) {
      const y = -18 + i * 12;
      ctx.beginPath(); ctx.moveTo(-28 + i % 2 * 4, y + 4); ctx.bezierCurveTo(-7, y - 13, 6, y - 4, 28 - i % 2 * 6, y + 3);
      ctx.strokeStyle = kind === 'badlands' ? '#997e65' : '#aa975f'; ctx.lineWidth = .9; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-21, y + 7); ctx.bezierCurveTo(-5, y - 6, 5, y + 1, 20, y + 6);
      ctx.strokeStyle = '#e9d5a3'; ctx.lineWidth = .9; ctx.stroke();
    }
    if (kind === 'badlands') {
      path(ctx, [[-14, 6], [-9, -7], [4, -7], [9, 6]], '#ae896a', '#8b7761', .8);
      path(ctx, [[-9, -7], [4, -7], [6, -3], [-11, -3]], '#d1ac83');
    }
  } else if (kind === 'water' || kind === 'coast' || kind === 'river') {
    if (kind === 'river') {
      ctx.beginPath(); ctx.moveTo(-18, -36); ctx.bezierCurveTo(20, -20, -23, 5, 12, 38);
      ctx.strokeStyle = '#d8d5ab'; ctx.lineWidth = 15; ctx.stroke();
      ctx.strokeStyle = '#6f9fa6'; ctx.lineWidth = 11; ctx.stroke();
      ctx.strokeStyle = 'rgba(221,239,226,.65)'; ctx.lineWidth = 1.2; ctx.stroke();
      drawGrass(ctx, -19, 13); drawGrass(ctx, 20, -12);
    } else {
      if (kind === 'coast') {
        ctx.beginPath(); ctx.moveTo(-36, -28); ctx.quadraticCurveTo(9, -23, -11, 3); ctx.quadraticCurveTo(-26, 19, 8, 40); ctx.lineTo(-40, 40); ctx.closePath();
        ctx.fillStyle = '#c6cc9b'; ctx.fill(); ctx.strokeStyle = '#e2ddba'; ctx.lineWidth = 2.5; ctx.stroke();
        drawGrass(ctx, -21, -9, '#879969', 3);
      }
      for (let i = 0; i < 5; i++) {
        const y = -22 + i * 11, x = (i % 2 ? -21 : -12) + jitter(i, 7);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 6, y - 3, x + 10, y + 3, x + 16, y); ctx.bezierCurveTo(x + 21, y - 3, x + 26, y + 3, x + 29, y);
        ctx.strokeStyle = i % 2 ? 'rgba(230,239,221,.65)' : 'rgba(69,122,132,.34)'; ctx.lineWidth = 1; ctx.stroke();
      }
      if (variant % 3 === 0 && kind === 'water') {
        path(ctx, [[-14, -9], [-10, -11], [-6, -9]], null, 'rgba(239,244,229,.8)', 1.1);
        path(ctx, [[10, 9], [13, 7], [16, 9]], null, 'rgba(239,244,229,.7)', 1);
      }
    }
  } else if (kind === 'marsh') {
    for (const [x, y, rx, ry] of [[-9, -11, 17, 6], [9, 9, 20, 7], [-15, 23, 9, 3]]) {
      ellipse(ctx, x, y, rx, ry, '#77a1a0', '#abc3ac', .8);
      path(ctx, [[x - rx * .4, y + 1], [x + rx * .5, y + 1]], null, '#c0d2bd', .8);
    }
    for (const [x, y] of [[-20, 1], [18, -7], [4, 20], [-10, -14]]) drawGrass(ctx, x, y, '#5d8061', 7);
  } else if (kind === 'farm') {
    ctx.save(); ctx.translate(0, 1); ctx.rotate(-.32);
    path(ctx, [[-22, -18], [20, -18], [20, 18], [-22, 18]], '#cbb775', '#a0915b', .8);
    for (let i = -15; i <= 15; i += 6) {
      path(ctx, [[i, -15], [i, 15]], null, '#967f4e', 1.3);
      path(ctx, [[i + 2, -15], [i + 2, 15]], null, '#e6d395', 1.4);
      for (let j = -10; j < 15; j += 8) drawGrass(ctx, i + 1, j, '#9b9b57', 2.5);
    }
    ctx.restore();
  } else if (kind === 'ruins') {
    ellipse(ctx, 0, 15, 23, 6, 'rgba(82,87,68,.15)');
    path(ctx, [[-19, 12], [-19, -6], [-12, -6], [-12, 12]], '#c5c6ab', '#8c9680', .9);
    path(ctx, [[6, 13], [6, -21], [15, -21], [15, 13]], '#c7c9ae', '#8c9680', .9);
    path(ctx, [[-16, -8], [-13, -23], [7, -23], [13, -17], [6, -14], [-8, -17], [-9, -6]], '#d7d7bb', '#8c9680', .9);
    path(ctx, [[9, -20], [13, -18], [13, 11], [9, 13]], '#9da98f');
    path(ctx, [[-24, 17], [-20, 11], [-12, 13], [-10, 18]], '#afb79c', '#8c9680', .8);
    drawGrass(ctx, 19, 18, '#7b9065', 5); drawGrass(ctx, -8, 17, '#7b9065', 4);
  } else if (kind === 'crystal') {
    ellipse(ctx, 0, 16, 22, 7, 'rgba(76,103,106,.18)');
    for (const [x, y, w, h] of [[-14, 12, 12, 23], [3, 14, 17, 39], [17, 17, 11, 24]]) {
      path(ctx, [[x - w / 2, y - h * .75], [x, y - h], [x + w / 2, y - h * .75], [x + w / 2, y], [x, y + 4], [x - w / 2, y]], '#89b4b5', '#648f98', .8);
      path(ctx, [[x, y - h], [x + w / 2, y - h * .75], [x + w / 2, y], [x, y + 4]], '#678e9e');
      path(ctx, [[x, y - h], [x - w / 2, y - h * .75], [x, y - h * .67]], '#d8e4d3');
      path(ctx, [[x - w / 2 + 2, y - h * .68], [x - w / 2 + 2, y - 3]], null, '#c2dbce', 1);
    }
    path(ctx, [[-21, -12], [-17, -12]], null, '#e7ecd7', .7); path(ctx, [[-19, -14], [-19, -10]], null, '#e7ecd7', .7);
  } else if (kind === 'volcano') {
    path(ctx, [[-28, 20], [-7, -20], [5, -23], [28, 20]], '#897f73', '#6b7067', .9);
    path(ctx, [[3, -22], [28, 20], [4, 20], [-3, 3]], '#69776d');
    ellipse(ctx, -1, -19, 8, 3, '#d49a68', '#746d5b', 1);
    path(ctx, [[1, -16], [6, -7], [2, 0], [9, 13]], null, '#d7a06b', 2.2);
    ctx.beginPath(); ctx.moveTo(-1, -25); ctx.bezierCurveTo(-10, -29, 6, -34, 0, -38); ctx.strokeStyle = 'rgba(224,222,198,.55)'; ctx.lineWidth = 4; ctx.stroke();
  } else if (kind === 'oasis') {
    ellipse(ctx, 0, 9, 24, 12, '#a6b98b', '#d8ca9a', 1.3);
    ellipse(ctx, 1, 9, 17, 8, '#7ba9a7', '#d2dcc0', .9);
    drawPalm(ctx, -16, 4, 16); drawPalm(ctx, 15, 7, 18);
    path(ctx, [[-5, 12], [8, 12]], null, '#c4d9ca', 1);
  } else if (kind === 'orchard') {
    for (const [x, y] of [[-15, -4], [13, -4], [-15, 18], [13, 18]]) {
      drawTree(ctx, x, y, 12, false, true);
      ellipse(ctx, x - 4, y - 8, 1.5, 1.5, '#c98d63'); ellipse(ctx, x + 3, y - 12, 1.5, 1.5, '#c98d63');
    }
  } else if (kind === 'tundra') {
    path(ctx, [[-27, 2], [-14, -3], [-1, 2], [11, 0], [28, 5]], null, '#cfd8be', 1);
    path(ctx, [[-22, 15], [-7, 11], [7, 17], [22, 14]], null, '#cfd8be', 1);
    drawTree(ctx, -13, 10, 9, true); drawTree(ctx, 10, -7, 8, true);
    drawGrass(ctx, 17, 17, '#7f967e', 3);
  } else {
    for (let i = 0; i < 8; i++) {
      const x = (hash(variant + 3, i, 16) - .5) * 48, y = (hash(variant + 1, i, 92) - .5) * 41;
      drawGrass(ctx, x, y, kind === 'savanna' ? '#929753' : '#749464', 3.2);
      if (i % 3 === 0) ellipse(ctx, x - 3, y - 6, 1.15, 1.15, '#e6ddae');
    }
    ctx.beginPath(); ctx.moveTo(-29, 19); ctx.quadraticCurveTo(-1, 10, 26, 18);
    ctx.strokeStyle = 'rgba(227,230,187,.55)'; ctx.lineWidth = .9; ctx.stroke();
    if (kind === 'savanna' && variant % 3 === 0) drawTree(ctx, 8, 5, 11, false, true);
  }
}

function drawCastle(ctx, color = '#527f72') {
  ellipse(ctx, 0, 12, 26, 8, 'rgba(33,54,45,.2)');
  path(ctx, [[-20, 10], [-20, -12], [-10, -12], [-10, 9]], '#d4d3b9', '#657d6c', .9);
  path(ctx, [[10, 10], [10, -12], [20, -12], [20, 10]], '#c9cbb3', '#657d6c', .9);
  path(ctx, [[-25, -11], [-15, -25], [-5, -11]], mix(color, '#344c41', .28), '#526c5c', .8);
  path(ctx, [[5, -11], [15, -25], [25, -11]], mix(color, '#344c41', .28), '#526c5c', .8);
  path(ctx, [[-11, 12], [-11, -25], [11, -25], [11, 12]], '#e6dfc4', '#687d69', .9);
  path(ctx, [[4, -25], [11, -25], [11, 12], [4, 12]], '#bdc2a7');
  path(ctx, [[-16, -24], [0, -39], [16, -24]], mix(color, '#334e42', .17), '#526c5c', .9);
  path(ctx, [[0, -39], [16, -24], [4, -24]], mix(color, '#203f36', .35));
  ctx.fillStyle = '#597763'; ctx.fillRect(-3, -19, 5, 7); ctx.fillStyle = '#e3c68f'; ctx.fillRect(-2, -18, 2, 4);
  ctx.beginPath(); ctx.moveTo(-5, 12); ctx.lineTo(-5, 4); ctx.arc(0, 4, 5, Math.PI, 0); ctx.lineTo(5, 12); ctx.closePath(); ctx.fillStyle = '#637460'; ctx.fill();
  path(ctx, [[0, -39], [0, -49]], null, '#6c7860', 1);
  path(ctx, [[1, -49], [13, -46], [1, -42]], color, '#e1d3a7', .6);
  for (const x of [-17, 14]) { ctx.fillStyle = '#657c65'; ctx.fillRect(x, -6, 3, 5); }
  path(ctx, [[-22, 13], [22, 13]], null, '#eee4c7', 1.3);
}
function drawBuilding(ctx, building, color) {
  const id = String(typeof building === 'object' ? building?.id || building?.type || building?.name || '' : building || '').toLowerCase();
  if (!id) return;
  ctx.save(); ctx.translate(0, 1);
  ellipse(ctx, 0, 13, 16, 5, 'rgba(52,70,49,.18)');
  if (/fort|tower|堡|哨|防/.test(id)) {
    path(ctx, [[-11, 12], [-11, -17], [11, -17], [11, 12]], '#d3d1b7', '#647962', .9);
    ctx.fillStyle = '#d3d1b7'; ctx.strokeStyle = '#647962'; ctx.lineWidth = .8;
    for (const x of [-11, -2, 7]) { ctx.fillRect(x, -23, 4, 7); ctx.strokeRect(x, -23, 4, 7); }
    ctx.fillStyle = '#5c7660'; ctx.fillRect(-3, -9, 6, 9);
    path(ctx, [[-15, 13], [15, 13]], null, '#e3dcc0', 1);
  } else if (/garden/.test(id)) {
    // Garden has no supplied painting. Keep an honest small field fallback.
    path(ctx, [[-19, 11], [-11, -1], [19, -1], [11, 13]], '#947752', '#4c4938', 1);
    for (const [x, y] of [[-10, 5], [0, 5], [10, 5]]) drawGrass(ctx, x, y, '#b4dc86', 6);
  } else if (/quarry|矿/.test(id)) {
    path(ctx, [[-18, 12], [-11, -3], [0, -14], [17, 11]], '#969b84', '#697e68', .9);
    path(ctx, [[-7, 12], [-7, -1], [7, -1], [7, 12]], '#526b58', '#cbc6a0', 2.5);
    path(ctx, [[0, -17], [14, -2]], null, '#695f49', 2);
    path(ctx, [[-4, -11], [8, -22]], null, '#d0d2bd', 2.4);
  } else if (/port|dock|港/.test(id)) {
    path(ctx, [[-21, 10], [20, 10]], null, '#7a7961', 4);
    path(ctx, [[-15, 5], [-15, 17]], null, '#7a7961', 2);
    path(ctx, [[12, 5], [12, 17]], null, '#7a7961', 2);
    path(ctx, [[-5, 2], [-5, -24]], null, '#6d7962', 1.5);
    path(ctx, [[-4, -23], [13, 1], [-4, -2]], '#eee0b7', '#8c987c', .8);
    path(ctx, [[-14, 1], [13, 1], [8, 6], [-10, 6]], '#796a52');
  } else {
    path(ctx, [[-13, 12], [-13, -5], [12, -5], [12, 12]], '#ddd5b2', '#71816a', .9);
    path(ctx, [[-18, -4], [-1, -20], [18, -4]], /mine|market|商|市/.test(id) ? '#b69365' : mix(color, '#4f6c51', .5), '#6f7e62', .9);
    ctx.fillStyle = '#73816a'; ctx.fillRect(-3, 2, 6, 10); ctx.fillStyle = '#abbd93'; ctx.fillRect(-10, 1, 4, 4);
    if (/farm|农|田/.test(id)) { drawGrass(ctx, -21, 14, '#9b965a', 6); drawGrass(ctx, 22, 14, '#9b965a', 6); }
    if (/academy|研究|学|灯塔/.test(id)) { ellipse(ctx, 0, -18, 4, 4, '#d8c585', '#7d8769', .8); }
  }
  ctx.restore();
}

/* ---- 2.5D tiles: one flat color, one big shape, a height that means something. ---- */
const TERRAIN_STYLE = {
  plains: { top: '#d9b95f', h: 6, prop: 'grass' }, meadow: { top: '#c79adf', h: 6, prop: 'flowers' },
  forest: { top: '#2e7a57', h: 8, prop: 'trees' }, pine: { top: '#1c5560', h: 10, prop: 'pines' },
  jungle: { top: '#159078', h: 8, prop: 'palms' }, hills: { top: '#bb7a3e', h: 14, prop: 'mounds' },
  mountain: { top: '#76819f', h: 20, prop: 'peaks' }, desert: { top: '#efbc73', h: 4, prop: 'dunes' },
  oasis: { top: '#efbc73', h: 4, prop: 'pool' }, wetland: { top: '#4b7c86', h: 2, prop: 'reeds' },
  tundra: { top: '#a7bbc6', h: 7, prop: 'stones' }, snow: { top: '#eef3fb', h: 9, prop: 'drifts' },
  volcanic: { top: '#3a3140', h: 16, prop: 'volcano' }, ruins: { top: '#a99a84', h: 7, prop: 'columns' },
  coast: { top: '#ecdba9', h: 2, prop: 'shore' }, ocean: { top: '#28648b', h: 0, prop: 'ripples' }, lake: { top: '#2b7cc8', h: 0, prop: 'ripples' },
  salt: { top: '#f4dcdc', h: 3, prop: 'cracks' }, crystal: { top: '#5a3d96', h: 9, prop: 'shards' },
};
const FOG_STYLE = { top: '#1c2642', h: 0, prop: 'clouds' };
const SPRITE_W = 96, SPRITE_H = 156, SPRITE_ANCHOR = 118;
// Large screens get fewer backing pixels per point: frame time follows pixel count, not game state.
const MAX_CANVAS_PIXELS = 3400000;
const terrainStyle = type => {
  const id = terrainArt(type), base = TERRAIN_STYLE[id];
  return TERRAIN_ART.includes(type?.id) ? base : { ...base, top: `rgb(${parseColor(type?.color, base.top).join(',')})` };
};
export const terrainTop = type => terrainStyle(type).top;

function tree(ctx, x, y, s, fill, shade) {
  ellipse(ctx, x, y + 1, s * .62, s * .24, 'rgba(5,10,18,.32)');
  path(ctx, [[x - 1.3, y], [x - 1.3, y - s * .5], [x + 1.3, y - s * .5], [x + 1.3, y]], '#4a3320');
  ellipse(ctx, x, y - s * .95, s * .62, s * .68, fill);
  ellipse(ctx, x + s * .16, y - s * .82, s * .44, s * .5, shade);
  ellipse(ctx, x - s * .2, y - s * 1.14, s * .22, s * .18, 'rgba(255,255,255,.2)');
}
function pine(ctx, x, y, s, fill, shade) {
  ellipse(ctx, x, y + 1, s * .5, s * .2, 'rgba(5,10,18,.32)');
  path(ctx, [[x - s * .55, y - s * .15], [x, y - s * 1.75], [x + s * .55, y - s * .15]], fill);
  path(ctx, [[x, y - s * 1.75], [x + s * .55, y - s * .15], [x + s * .05, y - s * .15]], shade);
}
function peak(ctx, x, y, w, h, light, dark, cap) {
  path(ctx, [[x - w / 2, y], [x, y - h], [x + w / 2, y]], light);
  path(ctx, [[x, y - h], [x + w / 2, y], [x + w * .06, y]], dark);
  if (cap) path(ctx, [[x - w * .17, y - h * .66], [x, y - h], [x + w * .17, y - h * .66], [x + w * .05, y - h * .58], [x - w * .04, y - h * .68]], '#f6f9ff');
}
function drawProp(ctx, prop, seed) {
  const jig = (n, span) => (hash(seed + n, n * 7, 31) - .5) * span;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (prop === 'grass') {
    ctx.strokeStyle = '#a57f2b'; ctx.lineWidth = 2.2;
    for (const [x, y] of [[-18, -5], [12, -10], [-3, 7], [20, 7]]) { ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x - 5, y - 6); ctx.moveTo(x, y); ctx.lineTo(x, y - 8); ctx.moveTo(x + 4, y); ctx.lineTo(x + 5, y - 6); ctx.stroke(); }
  } else if (prop === 'flowers') {
    for (const [x, y, c] of [[-18, -6, '#ff7fb0'], [-3, -13, '#fff1c9'], [15, -6, '#ff7fb0'], [-9, 7, '#fff1c9'], [8, 9, '#ff9fd0'], [23, 6, '#fff1c9']]) { ellipse(ctx, x, y, 4.2, 3.1, c); ellipse(ctx, x, y, 1.5, 1.1, '#e0a020'); }
  } else if (prop === 'trees') {
    for (const [x, y, s] of [[-13, -7, 15], [13, -9, 15], [0, 2, 18], [-20, 10, 13], [20, 10, 13]]) tree(ctx, x + jig(x, 3), y, s, '#3f9c6d', '#2a7652');
  } else if (prop === 'pines') {
    for (const [x, y, s] of [[-14, -6, 13], [14, -8, 13], [0, 3, 16], [-21, 11, 11], [20, 11, 11]]) pine(ctx, x + jig(x, 3), y, s, '#2a7a84', '#134e59');
  } else if (prop === 'palms') {
    for (const [x, y, s] of [[-13, -5, 16], [14, -7, 16], [0, 8, 18]]) tree(ctx, x, y, s, '#1fb394', '#0f7f6c');
    for (const [x, y] of [[-23, 6], [21, 8], [-1, -14]]) ellipse(ctx, x, y, 3.6, 2.8, '#ff4fa0');
  } else if (prop === 'mounds') {
    for (const [x, y, w, h] of [[-13, -2, 30, 15], [14, -8, 26, 13], [3, 12, 32, 16]]) {
      ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.quadraticCurveTo(x, y - h * 2, x + w / 2, y); ctx.closePath(); ctx.fillStyle = '#d4934d'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(x, y - h); ctx.quadraticCurveTo(x + w * .34, y - h * .8, x + w / 2, y); ctx.lineTo(x + w * .08, y); ctx.closePath(); ctx.fillStyle = '#99602c'; ctx.fill();
    }
  } else if (prop === 'peaks') {
    peak(ctx, 16, -2, 34, 34, '#a9b4cf', '#5e6a8a', true); peak(ctx, -15, 2, 36, 38, '#b7c1da', '#646f90', true); peak(ctx, 3, 16, 50, 56, '#c8d1e6', '#6b7699', true);
  } else if (prop === 'dunes') {
    ctx.lineWidth = 3;
    for (const [y, c] of [[-13, '#c98a3f'], [-1, '#d99a4a'], [11, '#c98a3f']]) { ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-27, y + 3); ctx.quadraticCurveTo(-9, y - 8, 4, y); ctx.quadraticCurveTo(14, y + 5, 27, y - 2); ctx.stroke(); }
  } else if (prop === 'pool') {
    ellipse(ctx, 0, 2, 20, 12, '#d9c07a'); ellipse(ctx, 0, 2, 17, 9.5, '#1fa8c9'); ellipse(ctx, -5, 0, 7, 2.5, 'rgba(255,255,255,.35)');
    tree(ctx, -19, -5, 12, '#1fb394', '#0f7f6c'); tree(ctx, 20, 4, 12, '#1fb394', '#0f7f6c');
  } else if (prop === 'reeds') {
    for (const [x, y, rx, ry] of [[-11, -7, 13, 6], [12, 2, 15, 7], [-9, 13, 10, 4]]) ellipse(ctx, x, y, rx, ry, '#1f4f63');
    ctx.strokeStyle = '#e0b84f'; ctx.lineWidth = 2;
    for (const [x, y] of [[-24, 3], [-2, 3], [25, -7], [8, -11], [12, 16]]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 2, y - 11); ctx.moveTo(x + 3, y); ctx.lineTo(x + 4, y - 9); ctx.stroke(); }
  } else if (prop === 'stones') {
    for (const [x, y, s] of [[-14, -5, 8], [13, -8, 7], [2, 8, 10], [22, 9, 5], [-23, 10, 5]]) { ellipse(ctx, x, y, s, s * .68, '#7d8ea0'); ellipse(ctx, x - s * .2, y - s * .22, s * .55, s * .32, '#c6d4de'); }
  } else if (prop === 'drifts') {
    for (const [x, y, w] of [[-13, -4, 30], [13, 8, 32]]) { ellipse(ctx, x, y, w / 2, 8, '#cddcf0'); ellipse(ctx, x - 2, y - 2, w / 2 - 3, 6.2, '#ffffff'); }
  } else if (prop === 'volcano') {
    path(ctx, [[-27, 16], [-9, -32], [9, -32], [27, 16]], '#5b4a55'); path(ctx, [[3, -32], [9, -32], [27, 16], [8, 16]], '#3f3340');
    ellipse(ctx, 0, -32, 9, 3.4, '#ff7a1f'); path(ctx, [[-2, -31], [2, -31], [6, -12], [1, -8], [5, 8], [-1, 8], [-3, -10], [1, -14]], '#ff9a2e');
  } else if (prop === 'columns') {
    ellipse(ctx, 0, 6, 25, 11, '#c9bba4'); ellipse(ctx, 0, 6, 17, 7, '#a99a84');
    for (const [x, y, h] of [[-19, 5, 25], [-7, -3, 31], [8, -3, 20], [19, 5, 28]]) { path(ctx, [[x - 4, y], [x - 4, y - h], [x + 4, y - h], [x + 4, y]], '#e8dcc6'); path(ctx, [[x + 1, y], [x + 1, y - h], [x + 4, y - h], [x + 4, y]], '#a8977c'); }
  } else if (prop === 'shore') {
    ctx.save(); hexPath(ctx, 0, 0, SIZE - .8); ctx.clip();
    path(ctx, [[-42, 40], [-42, -6], [-14, -2], [4, 10], [12, 40]], '#1fa8c9'); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(-42, -6); ctx.lineTo(-14, -2); ctx.lineTo(4, 10); ctx.lineTo(12, 40); ctx.stroke();
    ctx.restore();
  } else if (prop === 'ripples') {
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2.4;
    for (const [x, y] of [[-14, -9], [9, -3], [-8, 9], [15, 11]]) { ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.quadraticCurveTo(x - 4, y - 4, x, y); ctx.quadraticCurveTo(x + 4, y + 4, x + 8, y); ctx.stroke(); }
  } else if (prop === 'cracks') {
    ctx.strokeStyle = '#c99a9f'; ctx.lineWidth = 1.7;
    for (const pts of [[[-26, -3], [-11, -9], [1, -2], [15, -10], [27, -4]], [[-11, -9], [-9, -19]], [[1, -2], [-3, 9], [-17, 11]], [[-3, 9], [9, 15], [20, 9], [15, -10]]]) path(ctx, pts, null, '#c99a9f', 1.7);
    ellipse(ctx, 6, 5, 6, 3.2, '#f0a5ae');
  } else if (prop === 'shards') {
    for (const [x, y, w, h] of [[-15, 8, 13, 26], [14, 10, 13, 30], [0, 15, 18, 46]]) {
      path(ctx, [[x - w / 2, y - h * .72], [x, y - h], [x + w / 2, y - h * .72], [x + w / 2, y], [x, y + 3], [x - w / 2, y]], '#c774ff');
      path(ctx, [[x, y - h], [x + w / 2, y - h * .72], [x + w / 2, y], [x, y + 3]], '#7f3fc4');
      path(ctx, [[x, y - h], [x - w / 2, y - h * .72], [x - w * .1, y - h * .68]], '#f2d6ff');
    }
  } else if (prop === 'clouds') {
    for (const [x, y, rx, ry] of [[-12, -5, 15, 7], [9, -9, 12, 5.5], [8, 7, 17, 7]]) ellipse(ctx, x, y, rx, ry, 'rgba(165,188,228,.2)');
  }
}
/** Draws a tile with its top face centered on 0,0 (before lifting). */
function drawHexTile(ctx, style, seed = 0, withProp = true) {
  const { top, h } = style, base = 5, hx = CORNERS[2][0] * SIZE, hy = CORNERS[2][1] * SIZE, by = CORNERS[3][1] * SIZE;
  ctx.save(); ctx.translate(0, -h);
  const inset = SIZE - .9, a = CORNERS.map(([x, y]) => [x * inset, y * inset]), down = h + base;
  path(ctx, [a[2], a[3], [a[3][0], a[3][1] + down], [a[2][0], a[2][1] + down]], mix(top, '#080c18', .46));
  path(ctx, [a[3], a[4], [a[4][0], a[4][1] + down], [a[3][0], a[3][1] + down]], mix(top, '#080c18', .62));
  hexPath(ctx, 0, 0, inset); ctx.fillStyle = top; ctx.fill();
  ctx.strokeStyle = mix(top, '#ffffff', .34); ctx.lineWidth = 1.1; ctx.stroke();
  if (withProp) drawProp(ctx, style.prop, seed);
  ctx.restore();
}
const thumbs = new Map();
/** Same tile the board draws, as an image for the panels. Mod colors stay data, never markup. */
export function terrainThumb(type) {
  const style = type ? terrainStyle(type) : FOG_STYLE, key = `${style.prop}|${style.top}`;
  if (!thumbs.has(key)) {
    const canvas = document.createElement('canvas'); canvas.width = SPRITE_W * 2; canvas.height = SPRITE_W * 2;
    const ctx = canvas.getContext('2d'); ctx.scale(2, 2); ctx.translate(SPRITE_W / 2, 62);
    drawHexTile(ctx, style, 1);
    thumbs.set(key, canvas.toDataURL('image/png'));
  }
  return thumbs.get(key);
}

export class WorldMap {
  constructor(canvas, options = {}) {
    if (!canvas || typeof canvas.getContext !== 'function') throw new TypeError('WorldMap requires a canvas element.');
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) throw new Error('Canvas 2D is unavailable.');
    this.options = options;
    this.state = { tiles: {}, terrainTypes: {}, factions: {} };
    this.camera = { x: 0, y: 0, zoom: 1 };
    this.layer = 'terrain'; this.selected = null; this.hovered = null; this.calm = false;
    this._glows = new Map(); this.upgradable = new Set(); this.diplomacy = {};
    this.width = 1; this.height = 1; this.dpr = 1;
    this._tiles = []; this._tileLookup = new Map(); this._sprites = new Map(); this._pointers = new Map();
    this._regions = new MapRegionIndex(this._tiles); this._nationLands = new Map();
    this._frame = null; this._dead = false; this._viewDirty = false; this._gesture = null;
    this._listeners = []; this._scaledArt = new Map(); this._art = new Map(); this._yieldCache = new Map(); this.hints = { explore: new Set(), claim: new Set(), attack: new Set() };
    this.army = null; this.route = null; this.orders = []; this._banners = []; this._peopleCache = new Map();
    this._loadArt();
    canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.style.display = 'block';
    canvas.style.touchAction = 'none'; canvas.style.userSelect = 'none'; canvas.style.cursor = 'grab';
    if (!canvas.hasAttribute('tabindex')) canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    if (!canvas.hasAttribute('aria-label')) canvas.setAttribute('aria-label', '可拖动、缩放和选择地块的六角世界地图');
    this._listen(canvas, 'pointerdown', e => this._pointerDown(e));
    this._listen(canvas, 'pointermove', e => this._pointerMove(e));
    this._listen(canvas, 'pointerup', e => this._pointerUp(e));
    this._listen(canvas, 'pointercancel', e => this._pointerUp(e, true));
    this._listen(canvas, 'lostpointercapture', e => { if (this._pointers.has(e.pointerId)) this._pointerUp(e, true); });
    this._listen(canvas, 'pointerleave', () => { if (!this._pointers.size) this._setHover(null); });
    this._listen(canvas, 'wheel', e => this._wheel(e), { passive: false });
    this._listen(canvas, 'keydown', e => this._keyDown(e));
    if (typeof ResizeObserver !== 'undefined') {
      this._observer = new ResizeObserver(() => this._resize());
      this._observer.observe(canvas);
    } else this._listen(window, 'resize', () => this._resize());
    this._resize();
  }

  setState(state) {
    if (this._dead) return;
    this.state = state || { tiles: {}, terrainTypes: {}, factions: {} };
    this._tileLookup.clear(); this._tiles = []; this._yieldCache.clear(); this._peopleCache?.clear();
    const entries = this.state.tiles instanceof Map ? this.state.tiles.entries() : Object.entries(this.state.tiles || {});
    for (const [entryKey, tile] of entries) {
      if (!tile || typeof tile !== 'object') continue;
      const coords = String(tile.key || entryKey).split(',');
      const q = finite(tile.q, Number(coords[0])), r = finite(tile.r, Number(coords[1]));
      if (!Number.isInteger(q) || !Number.isInteger(r)) continue;
      const position = hexToWorld(q, r), key = `${q},${r}`;
      const visible = tile.discovered !== false;
      const lift = visible ? terrainStyle(this.state.terrainTypes?.[tile.terrainId] || {}).h : 0;
      const record = { tile, q, r, key, ...position, visible, lift };
      this._tiles.push(record); this._tileLookup.set(key, record);
    }
    for (const record of this._tiles) record.frontier = !record.visible && EDGE_NEIGHBORS.some(([dq, dr]) => this._tileLookup.get(`${record.q + dq},${record.r + dr}`)?.visible);
    this._tiles.sort((a, b) => a.y - b.y || a.x - b.x);
    this._regions = new MapRegionIndex(this._tiles);
    this._nationLands = collectNationLands(this._tiles);
    if (this.selected && !this._tileLookup.has(this.selected)) this.selected = null;
    if (this.hovered && !this._tileLookup.has(this.hovered)) this._setHover(null);
    this._requestDraw();
  }

  /** Tiles the player can act on right now, computed by the caller from the engine's own actions. */
  setHints(hints) {
    this.hints = { explore: hints?.explore || new Set(), claim: hints?.claim || new Set(), attack: hints?.attack || new Set() };
    this._requestDraw();
    return this;
  }

  setPicking(value) { this.picking=Boolean(value);this._requestDraw();return this; }
  /** Gold frames drawn above the art: where a ring form's people come from (集结 / 会师). */
  setMarks(keys) { this.marks = new Set(keys || []); this._requestDraw(); return this; }

  setUpgradable(keys) { this.upgradable = new Set(keys || []); this._requestDraw(); return this; }

  /** A built-up realm reads better without a stamp on every roof: calm maps keep the small building stamps for close zooms. */
  setCalm(value) { this.calm = Boolean(value); this._requestDraw(); return this; }

  setDiplomacy(colors) { this.diplomacy = colors || {}; this._requestDraw(); return this; }

  select(key) {
    this.selected = key == null ? null : String(key);
    this._requestDraw();
    return this;
  }

  /** The army (编队) the player is commanding: its tile gets a gold ring and its banner stands out. */
  setArmy(key) { this.army = key == null ? null : String(key); this._requestDraw(); return this; }

  /** An order being looked at: an arrow from the army to where it would go. kind: 'move' | 'attack' | 'far'.
   * A far order also carries the tiles it walks through (`path`) and where it rests each night (`stops`). */
  setRoute(route) {
    this.route = route && route.from && route.to ? { from: String(route.from), to: String(route.to), kind: ['attack', 'far', 'road'].includes(route.kind) ? route.kind : 'move',
      path: Array.isArray(route.path) ? route.path.map(String) : null, stops: Array.isArray(route.stops) ? route.stops.map(String) : [], rest: Array.isArray(route.rest) && route.rest.length > 1 ? route.rest.map(String) : null } : null;
    this._requestDraw(); return this;
  }

  /** Standing march orders: each is drawn as a dotted trail from where the army is to where it is going. */
  setOrders(orders) { this.orders = Array.isArray(orders) ? orders.filter(order => Array.isArray(order?.path) && order.path.length > 1).map(order => ({ key: String(order.key), toKey: String(order.toKey), path: order.path.map(String), stops: (order.stops || []).map(String) })) : []; this._requestDraw(); return this; }

  /** Where an army banner is drawn on screen (for tutorial arrows), or null when it is not shown. */
  bannerOf(key) { const hit = (this._banners || []).find(item => item.key === String(key)); return hit ? { x: (hit.x0 + hit.x1) / 2, y: (hit.y0 + hit.y1) / 2, top: hit.y0, bottom: hit.y1 } : null; }

  centerOn(key = '0,0') {
    let position = this._tileLookup.get(String(key));
    if (!position) {
      const [q, r] = String(key).split(',').map(Number);
      if (!Number.isFinite(q) || !Number.isFinite(r)) return this;
      position = hexToWorld(q, r);
    }
    const offset = this.options.focusOffset?.({ width: this.width, height: this.height }) || { x: 0, y: 0 };
    this.camera.x = position.x - finite(offset.x, 0) / this.camera.zoom;
    this.camera.y = position.y - finite(offset.y, 0) / this.camera.zoom;
    this._viewDirty = true; this._requestDraw();
    return this;
  }

  /** Where a tile's raised top sits on screen, so DOM overlays can stick to it. */
  screenOf(key) {
    const record = this._tileLookup.get(String(key));
    if (!record) return null;
    const { x, y, zoom } = this.camera;
    return { x: this.width / 2 + (record.x - x) * zoom, y: this.height / 2 + (record.y - record.lift - y) * zoom, zoom };
  }

  /** Glides just far enough to bring a tile inside the given screen margins. */
  panIntoView(key, { left = 0, right = 0, top = 0, bottom = 0 } = {}) {
    const point = this.screenOf(key);
    if (!point) return this;
    const dx = point.x < left ? left - point.x : point.x > this.width - right ? this.width - right - point.x : 0;
    const dy = point.y < top ? top - point.y : point.y > this.height - bottom ? this.height - bottom - point.y : 0;
    return this.glideBy(dx, dy);
  }

  /** Slides everything on the map by this many screen pixels. */
  glideBy(dx, dy) {
    if (!dx && !dy) return this;
    const from = { ...this.camera }, to = { x: from.x - dx / from.zoom, y: from.y - dy / from.zoom }, started = performance.now();
    cancelAnimationFrame(this._glide);
    const step = now => {
      const t = Math.min(1, (now - started) / 240), ease = 1 - (1 - t) ** 3;
      this.camera.x = from.x + (to.x - from.x) * ease; this.camera.y = from.y + (to.y - from.y) * ease;
      this._viewDirty = true; this._requestDraw();
      if (t < 1 && !this._dead) this._glide = requestAnimationFrame(step);
    };
    this._glide = requestAnimationFrame(step);
    return this;
  }

  zoomTo(value) { this._zoomAt(value, this.width / 2, this.height / 2); return this; }

  zoomBy(factor) {
    if (Number.isFinite(Number(factor)) && Number(factor) > 0) this._zoomAt(this.camera.zoom * Number(factor), this.width / 2, this.height / 2);
    return this;
  }

  setLayer(layer) { this.layer = ['political', 'yield', 'diplomacy', 'force', 'control', 'people'].includes(layer) ? layer : 'terrain'; this._requestDraw(); return this; }

  getViewport() {
    const { x, y, zoom } = this.camera;
    return {
      x, y, zoom, width: this.width, height: this.height,
      center: { x, y },
      bounds: { left: x - this.width / zoom / 2, right: x + this.width / zoom / 2, top: y - this.height / zoom / 2, bottom: y + this.height / zoom / 2 },
    };
  }

  destroy() {
    if (this._dead) return;
    this._dead = true;
    if (this._frame !== null) cancelAnimationFrame(this._frame);
    this._observer?.disconnect();
    for (const [target, name, listener, options] of this._listeners) target.removeEventListener(name, listener, options);
    for (const id of this._pointers.keys()) { try { this.canvas.releasePointerCapture(id); } catch {} }
    this._pointers.clear(); this._sprites.clear(); this._tileLookup.clear(); this._listeners = [];
  }

  _loadArt() {
    const load = (name, path) => {
      const image = new Image();
      image.onload = () => { if (!this._dead) { this._art.set(name, image); this._requestDraw(); } };
      image.src = ASSET_ROOT + path;
    };
    for (const id of ['workshop', 'factory', 'bank', 'centralbank', 'hanginggardens', 'greatlibrary', 'grandbazaar', 'greatlighthouse', 'ironcitadel', 'starstage']) load(`building:${id}`, `buildings/${id}.webp`);
    for (const id of ['capital', 'home', 'farm', 'mine', 'fort', 'quarry', 'lumber', 'port', 'camp', 'ship', 'airplane', 'wonder', 'city', 'shipyard', 'airfield', 'administrativehall']) load(`building:${id}`, `buildings/${id}.webp`);
    for (const id of ['food', 'gold']) load(`icon:${id}`, `icons/${id}.webp`);
    this._faces = new Map();
    document.fonts?.ready.then(() => this._requestDraw());
  }

  _listen(target, name, listener, options) { target.addEventListener(name, listener, options); this._listeners.push([target, name, listener, options]); }

  _resize() {
    if (this._dead) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width), height = Math.max(1, rect.height), dpr = clamp(Math.min(window.devicePixelRatio || 1, Math.sqrt(MAX_CANVAS_PIXELS / (width * height))), 1, 3);
    if (width !== this.width || height !== this.height || dpr !== this.dpr) {
      this.width = width; this.height = height; this.dpr = dpr;
      this.canvas.width = Math.round(width * dpr); this.canvas.height = Math.round(height * dpr);
      this._viewDirty = true;
    }
    this._requestDraw();
  }

  _eventPoint(e) { const rect = this.canvas.getBoundingClientRect(); return { x: e.clientX - rect.left, y: e.clientY - rect.top }; }
  _screenToWorld(x, y) { return { x: this.camera.x + (x - this.width / 2) / this.camera.zoom, y: this.camera.y + (y - this.height / 2) / this.camera.zoom }; }
  _hitTest(x, y) {
    if (this.camera.zoom >= .8) for (const key of this.upgradable) { if (!this._tileLookup.get(key)?.visible) continue; const point = this.screenOf(key); if (point && Math.hypot(x - point.x - 23 * this.camera.zoom, y - point.y + 15 * this.camera.zoom) < 15) return key; }
    // Raised tiles own the pixels of their lifted top, so test the nearest tiles front to back.
    const p = this._screenToWorld(x, y), h = worldToHex(p.x, p.y), halfW = SQRT3 / 2 * SIZE, halfH = SIZE * TILT;
    const near = [[0, 0], [-1, 0], [1, 0], [0, -1], [1, -1], [-1, 1], [0, 1], [1, 1], [-1, 2], [0, 2]].map(([dq, dr]) => this._tileLookup.get(`${h.q + dq},${h.r + dr}`)).filter(Boolean).sort((a, b) => b.y - a.y);
    for (const record of near) {
      const dx = Math.abs(p.x - record.x) / halfW, dy = Math.abs(p.y - (record.y - record.lift)) / halfH;
      if (dx <= 1 && dx * .5 + dy <= 1) return record.key;
    }
    return this._tileLookup.has(h.key) ? h.key : null;
  }

  /** The player's army banner under a screen point, topmost first. Banners are bigger than they look, for thumbs. */
  _hitBanner(x, y) {
    const list = this._banners || [];
    for (let i = list.length - 1; i >= 0; i--) { const b = list[i]; if (b.tap && x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1) return b.key; }
    return null;
  }

  _hitFlight(x, y) {
    return (this._flightHits || []).find(b => x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1)?.id || null;
  }

  _pointerDown(e) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || (e.button !== undefined && e.button !== 0 && e.button !== 1)) return;
    e.preventDefault();
    this.canvas.focus({ preventScroll: true });
    const p = this._eventPoint(e);
    this._pointers.set(e.pointerId, { ...p, startX: p.x, startY: p.y, cameraX: this.camera.x, cameraY: this.camera.y, moved: false, selectOnRelease: e.button !== 1, startKey: this._hitTest(p.x, p.y), startBanner: this._hitBanner(p.x, p.y) });
    try { this.canvas.setPointerCapture(e.pointerId); } catch {}
    this.canvas.style.cursor = 'grabbing';
    if (this._pointers.size >= 2) this._startPinch();
  }

  _startPinch() {
    const [a, b] = [...this._pointers.values()];
    if (!a || !b) return;
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    this._gesture = { distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), zoom: this.camera.zoom, anchor: this._screenToWorld(mid.x, mid.y) };
    for (const p of this._pointers.values()) p.moved = true;
  }

  _pointerMove(e) {
    const p = this._eventPoint(e), pointer = this._pointers.get(e.pointerId);
    if (!pointer) { const banner = this._hitBanner(p.x, p.y); this._setHover(banner || this._hitTest(p.x, p.y)); return; }
    pointer.x = p.x; pointer.y = p.y;
    if (Math.hypot(p.x - pointer.startX, p.y - pointer.startY) > 5) pointer.moved = true;
    if (this._pointers.size >= 2 && this._gesture) {
      const [a, b] = [...this._pointers.values()], mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const zoom = clamp(this._gesture.zoom * Math.hypot(a.x - b.x, a.y - b.y) / this._gesture.distance, MIN_ZOOM, MAX_ZOOM);
      this.camera.zoom = zoom;
      this.camera.x = this._gesture.anchor.x - (mid.x - this.width / 2) / zoom;
      this.camera.y = this._gesture.anchor.y - (mid.y - this.height / 2) / zoom;
    } else {
      this.camera.x = pointer.cameraX - (p.x - pointer.startX) / this.camera.zoom;
      this.camera.y = pointer.cameraY - (p.y - pointer.startY) / this.camera.zoom;
    }
    this._setHover(null); this._viewDirty = true; this._requestDraw();
  }

  _pointerUp(e, cancelled = false) {
    const pointer = this._pointers.get(e.pointerId);
    if (!pointer) return;
    const wasSingle = this._pointers.size === 1;
    this._pointers.delete(e.pointerId);
    try { if (this.canvas.hasPointerCapture(e.pointerId)) this.canvas.releasePointerCapture(e.pointerId); } catch {}
    if (this._pointers.size === 1) {
      const remaining = [...this._pointers.values()][0];
      remaining.startX = remaining.x; remaining.startY = remaining.y;
      remaining.cameraX = this.camera.x; remaining.cameraY = this.camera.y; remaining.moved = true;
      this._gesture = null;
    } else if (this._pointers.size >= 2) this._startPinch();
    else this._gesture = null;
    const end = this._eventPoint(e);
    // Some devices coalesce the last move. Release distance must also veto a
    // click, and a middle-button pan must never select a march destination.
    const releasedInPlace = Math.hypot(end.x - pointer.startX, end.y - pointer.startY) <= 5;
    if (!cancelled && !e.defaultPrevented && wasSingle && !pointer.moved && pointer.selectOnRelease && releasedInPlace) {
      const banner = pointer.startBanner && this._hitBanner(end.x, end.y) === pointer.startBanner ? pointer.startBanner : null;
      const key = this._hitTest(end.x, end.y);
      const flight = this._hitFlight(end.x, end.y);
      if (flight && this.options.onSelectFlight?.(flight)) { /* the aircraft took the tap */ }
      else if (banner && this.options.onSelectArmy?.(banner)) { /* the banner took the tap */ }
      else if (key === pointer.startKey) {
        if (key) { this.select(key); this.options.onSelect?.(key); } else this.options.onBackground?.();
      }
    }
    if (!this._pointers.size) this.canvas.style.cursor = this.hovered ? 'pointer' : 'grab';
  }

  _setHover(key) {
    if (this.hovered === key) return;
    this.hovered = key;
    if (!this._pointers.size) this.canvas.style.cursor = key ? 'pointer' : 'grab';
    this.options.onHover?.(key);
    this._requestDraw();
  }

  _zoomAt(target, sx, sy) {
    if (this._dead) return;
    const anchor = this._screenToWorld(sx, sy), zoom = clamp(target, MIN_ZOOM, MAX_ZOOM);
    this.camera.zoom = zoom;
    this.camera.x = anchor.x - (sx - this.width / 2) / zoom;
    this.camera.y = anchor.y - (sy - this.height / 2) / zoom;
    // A wheel event during a drag must not make the next pointer move jump.
    for (const p of this._pointers.values()) { p.startX = p.x; p.startY = p.y; p.cameraX = this.camera.x; p.cameraY = this.camera.y; p.moved = true; }
    if (this._pointers.size >= 2) this._startPinch();
    this._viewDirty = true; this._requestDraw();
  }

  _wheel(e) {
    if(e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.defaultPrevented||(e.target&&e.target!==this.canvas)||!Number.isFinite(e.deltaY)||e.deltaY===0)return;
    const pos=this._eventPoint(e),units=e.deltaMode===1?16:e.deltaMode===2?this.height:1;
    const target=clamp(this.camera.zoom*Math.exp(-e.deltaY*units*.0014),MIN_ZOOM,MAX_ZOOM);
    if(target===this.camera.zoom)return;
    e.preventDefault();
    this._zoomAt(target,pos.x,pos.y);
  }

  _keyDown(e) {
    if(e.ctrlKey||e.metaKey||e.altKey||e.defaultPrevented||e.isComposing||(e.target&&e.target!==this.canvas))return;
    const step = 62 / this.camera.zoom;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      e.preventDefault(); this.camera.x += moves[e.key][0]; this.camera.y += moves[e.key][1]; this._viewDirty = true; this._requestDraw();
    } else if (['+', '=', '-', '_', 'Home'].includes(e.key)) {
      e.preventDefault(); e.key === 'Home' ? this.centerOn() : this.zoomBy(e.key === '-' || e.key === '_' ? .82 : 1.22);
    }
  }

  _requestDraw() {
    if (this._dead || this._frame !== null) return;
    this._frame = requestAnimationFrame(() => { this._frame = null; if (!this._dead) this._draw(); });
  }

  /** Tile art pre-rendered at about the size it will appear, so drawing it is a plain copy. */
  _spriteScale() { return clamp(Math.ceil(this.camera.zoom * this.dpr * 2) / 2, 1, 3); }

  /** A shrunken copy of large art, cached per on-screen size. Resampling big images every frame is what hurts. */
  _scaled(name, image, width, height) {
    const w = Math.max(1, Math.ceil(width * this.camera.zoom * this.dpr)), h = Math.max(1, Math.ceil(height * this.camera.zoom * this.dpr)), key = `${name}@${w}x${h}`;
    let copy = this._scaledArt.get(key);
    if (!copy) {
      copy = document.createElement('canvas'); copy.width = w; copy.height = h;
      const ctx = copy.getContext('2d'); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(image, 0, 0, w, h);
      if (this._scaledArt.size > 300) this._scaledArt.delete(this._scaledArt.keys().next().value);
      this._scaledArt.set(key, copy);
    }
    return copy;
  }

  _sprite(style, seed, withProp) {
    const scale = this._spriteScale(), key = `${style.prop}|${style.top}|${withProp ? seed : 'flat'}|${scale}`;
    if (this._sprites.has(key)) return this._sprites.get(key);
    const canvas = document.createElement('canvas');
    canvas.width = SPRITE_W * scale; canvas.height = SPRITE_H * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale); ctx.translate(SPRITE_W / 2, SPRITE_ANCHOR);
    drawHexTile(ctx, style, seed, withProp);
    if (this._sprites.size > 240) this._sprites.delete(this._sprites.keys().next().value);
    this._sprites.set(key, canvas);
    return canvas;
  }

  _stamp(ctx, record, style, seed, withProp) {
    ctx.drawImage(this._sprite(style, seed, withProp), record.x - SPRITE_W / 2, record.y - SPRITE_ANCHOR, SPRITE_W, SPRITE_H);
  }

  _tileBase(ctx, record) {
    if (!record.visible) {
      ctx.save(); ctx.globalAlpha = this.hints.explore.has(record.key) ? 1 : record.frontier ? .72 : .4;
      this._stamp(ctx, record, FOG_STYLE, 0, true); ctx.restore();
      return;
    }
    const { tile, q, r } = record;
    const type = this.state.terrainTypes?.[tile.terrainId] || {}, style = terrainStyle(type);
    const owner = territoryOwner(this.state, tile), faction = this.state.factions?.[owner];
    const quiet = this.layer !== 'terrain' || tile.isCapital || tile.building;
    this._stamp(ctx, record, style, hash(q, r, 14) > .5 ? 1 : 2, !quiet);
    let wash = null;
    if (this.layer === 'political') wash = faction ? [faction.color, .78] : ['#0a0e1a', .62];
    else if (this.layer === 'force') wash = faction ? [faction.color, faction.isPlayer ? .5 : .66] : ['#0a0e1a', .55];
    else if (this.layer === 'diplomacy') wash = owner ? [this.diplomacy[owner] || '#8391a6', .78] : ['#0a0e1a', .45];
    else if (this.layer === 'yield') wash = ['#0a0e1a', .6];
    else if (this.layer === 'people') { const k = Math.min(1, finite(tile.troops) / 40); wash = tile.ownerId && !tile.shipId ? [`hsl(${Math.round(34 - k * 6)} ${Math.round(42 + k * 40)}% ${Math.round(15 + k * 43)}%)`, .86] : ['#0a0e1a', .66]; }
    else if (this.layer === 'control') wash = tile.ownerId && !tile.shipId ? [`hsl(${Math.round(controlAt(this.state, tile).value * 115)} 38% 48%)`, .84] : ['#0a0e1a', .7];
    else wash = owner ? [nationTint(faction), TERRITORY_WASH] : ['#0a0e1a', .2];
    if (wash) { hexPath(ctx, record.x, record.y - record.lift, SIZE - .9); ctx.globalAlpha = wash[1]; ctx.fillStyle = wash[0]; ctx.fill(); ctx.globalAlpha = 1; }
    if (tile.road) {
      ctx.save(); ctx.strokeStyle = '#e7cf97'; ctx.lineWidth = 3; ctx.setLineDash([3, 2]);
      for (const [dq, dr] of EDGE_NEIGHBORS) { const next = this._tileLookup.get(`${q + dq},${r + dr}`); if (!next?.visible || !next.tile.road) continue; ctx.beginPath(); ctx.moveTo(record.x, record.y - record.lift); ctx.lineTo((record.x + next.x) / 2, (record.y - record.lift + next.y - next.lift) / 2); ctx.stroke(); }
      ctx.setLineDash([]); ellipse(ctx, record.x, record.y - record.lift + 9, 4, 2, '#f9e4b5', '#584d36', 1); ctx.restore();
    }
    const bridge = this.state.campaign?.bridges?.[tile.bridgeId];
    if (bridge) {
      const index = bridge.path.indexOf(tile.key), cy = record.y - record.lift;
      ctx.save(); ctx.lineCap = 'butt';
      for (const key of [bridge.path[index - 1], bridge.path[index + 1]]) {
        const next = this._tileLookup.get(key); if (!next) continue;
        const mx = (record.x + next.x) / 2, my = (cy + next.y - next.lift) / 2;
        ctx.setLineDash([]); ctx.strokeStyle = '#584d36'; ctx.lineWidth = 15;
        ctx.beginPath(); ctx.moveTo(record.x, cy); ctx.lineTo(mx, my); ctx.stroke();
        ctx.strokeStyle = '#e7cf97'; ctx.lineWidth = 11; ctx.stroke();
        ctx.strokeStyle = '#8e754f'; ctx.lineWidth = 10; ctx.setLineDash([1, 5]); ctx.stroke();
      }
      ctx.restore();
    }
    const canal = this.state.campaign?.canals?.[tile.key];
    if (canal) {
      ctx.save();
      const open = canal.status === 'open', cy = record.y - record.lift;
      const mouths = [];
      EDGE_NEIGHBORS.forEach(([dq, dr], i) => {
        const next = this._tileLookup.get(`${q + dq},${r + dr}`);
        if (next?.tile?.terrainId !== 'ocean' && !this.state.campaign?.canals?.[`${q + dq},${r + dr}`]) return;
        const a = CORNERS[i], b = CORNERS[(i + 1) % 6];
        mouths.push([record.x + (a[0] + b[0]) * .5 * (SIZE - 1.5), cy + (a[1] + b[1]) * .5 * (SIZE - 1.5)]);
      });
      ctx.lineCap = 'round';
      for (const [mx, my] of mouths) {
        ctx.strokeStyle = '#123149'; ctx.lineWidth = 8.5; ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(record.x, cy); ctx.lineTo(mx, my); ctx.stroke();
        ctx.strokeStyle = open ? '#2da9e3' : '#8ad2f0'; ctx.lineWidth = 5; if (!open) ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(record.x, cy); ctx.lineTo(mx, my); ctx.stroke();
      }
      ctx.setLineDash([]);
      ellipse(ctx, record.x, cy, 5.5, 3.5, open ? '#dff6ff' : '#f5d98e', '#123149', 1.4);
      ctx.restore();
    }
    if (tile.cutSince !== undefined) {
      // Land out of touch with its capital is struck through in red.
      ctx.save(); hexPath(ctx, record.x, record.y - record.lift, SIZE - 1.5); ctx.clip();
      ctx.strokeStyle = 'rgba(240,69,47,.62)'; ctx.lineWidth = 5; ctx.beginPath();
      for (let i = -SIZE * 2; i < SIZE * 2; i += 15) { ctx.moveTo(record.x + i - SIZE, record.y - record.lift + SIZE); ctx.lineTo(record.x + i + SIZE, record.y - record.lift - SIZE); }
      ctx.stroke(); ctx.restore();
    }
  }

  _borders(ctx, record) {
    const { tile, q, r, x, y, visible, lift } = record;
    const owner = territoryOwner(this.state, tile);
    if (!visible || !owner) return;
    const faction = this.state.factions?.[owner];
    if (!faction) return;
    const radius = SIZE - 1;
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath();
    let edges = 0;
    EDGE_NEIGHBORS.forEach(([dq, dr], i) => {
      const neighbor = this._tileLookup.get(`${q + dq},${r + dr}`);
      if (neighbor?.visible && territoryOwner(this.state, neighbor.tile) === owner) return;
      const a = CORNERS[i], b = CORNERS[(i + 1) % 6];
      ctx.moveTo(x + a[0] * radius, y - lift + a[1] * radius); ctx.lineTo(x + b[0] * radius, y - lift + b[1] * radius); edges++;
      if (this.layer === 'terrain') {
        const glow = this._edgeGlow(nationTint(faction), i), w = glow.width / GLOW_SCALE, h = glow.height / GLOW_SCALE;
        ctx.drawImage(glow, x - w / 2, y - lift - h / 2, w, h);
      }
    });
    if (edges) {
      ctx.strokeStyle = 'rgba(5,7,14,.92)'; ctx.lineWidth = faction.isPlayer ? 9 : 5.8; ctx.stroke();
      ctx.strokeStyle = nationTint(faction); ctx.lineWidth = faction.isPlayer ? 5.6 : 3.6; ctx.stroke();
    }
    if (faction.isPlayer) {
      // The front line: edges facing a nation we are at war with.
      ctx.beginPath(); let front = 0;
      EDGE_NEIGHBORS.forEach(([dq, dr], i) => {
        const neighbor = this._tileLookup.get(`${q + dq},${r + dr}`), adjacentOwner = neighbor?.visible ? territoryOwner(this.state, neighbor.tile) : null;
        if (!adjacentOwner || adjacentOwner === owner || !this.options.atWarWith?.(adjacentOwner)) return;
        const a = CORNERS[i], b = CORNERS[(i + 1) % 6];
        ctx.moveTo(x + a[0] * radius, y - lift + a[1] * radius); ctx.lineTo(x + b[0] * radius, y - lift + b[1] * radius); front++;
      });
      if (front) { ctx.strokeStyle = '#f0452f'; ctx.lineWidth = 4.2; ctx.setLineDash([9, 7]); ctx.stroke(); ctx.setLineDash([]); }
    }
    ctx.restore();
  }

  /** A soft band of a nation's colour running in from one edge of a tile, so a country reads as one shape from far away. */
  _edgeGlow(color, edge) {
    const key = `${color}:${edge}`;
    let art = this._glows.get(key);
    if (art) return art;
    art = document.createElement('canvas');
    art.width = Math.ceil(SIZE * 2.2 * GLOW_SCALE); art.height = Math.ceil(SIZE * 2.2 * GLOW_SCALE);
    const ctx = art.getContext('2d'), a = CORNERS[edge], b = CORNERS[(edge + 1) % 6];
    const mx = (a[0] + b[0]) / 2 * SIZE, my = (a[1] + b[1]) / 2 * SIZE, length = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    let nx = -(b[1] - a[1]) / length, ny = (b[0] - a[0]) / length;
    if (nx * mx + ny * my > 0) { nx = -nx; ny = -ny; }
    ctx.translate(art.width / 2, art.height / 2); ctx.scale(GLOW_SCALE, GLOW_SCALE);
    hexPath(ctx, 0, 0, SIZE - .9); ctx.clip();
    // Paint the fade as plain alpha, then pour the colour into it: any CSS colour works and no browser muddies the middle.
    const fade = ctx.createLinearGradient(mx, my, mx + nx * SIZE * GLOW_DEPTH, my + ny * SIZE * GLOW_DEPTH);
    fade.addColorStop(0, 'rgba(0,0,0,.8)'); fade.addColorStop(.45, 'rgba(0,0,0,.34)'); fade.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fade; ctx.fillRect(-SIZE * 1.2, -SIZE * 1.2, SIZE * 2.4, SIZE * 2.4);
    ctx.globalCompositeOperation = 'source-in'; ctx.fillStyle = color; ctx.fillRect(-SIZE * 1.2, -SIZE * 1.2, SIZE * 2.4, SIZE * 2.4);
    this._glows.set(key, art);
    return art;
  }

  /** Shared extents let compact building annotations yield to atlas country names. */
  _nationNameLayout(ctx, quiet) {
    const lands = this._nationLands || collectNationLands(this._tiles), labels = [], { zoom } = this.camera;
    for (const [id, land] of lands) {
      const faction = this.state.factions?.[id];
      if (!faction) continue;
      const x = land.x / land.n, y = land.y / land.n, size = clamp(13 + Math.sqrt(land.n) * 5, 15, 38) / clamp(zoom, .75, 1.5), text = String(faction.name);
      ctx.font = `${size}px ${SERIF}`;
      const w = ctx.measureText(text).width;
      const box = {x:(x-this.camera.x)*zoom,y:(y-this.camera.y)*zoom,w:w*zoom,h:size*1.3*zoom};
      if (quiet && touchesCircle(quiet,box.x,box.y,box.w,box.h)) continue;
      labels.push({x,y,size,text,box:{...box,w:box.w+size*.22*zoom}});
    }
    return labels;
  }

  /** On the borders map each country's name lies across its land, the way a printed atlas does it. */
  _nationNames(ctx, quiet) {
    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    for (const {x,y,size,text} of this._nationNameLayout(ctx,quiet)) {
      ctx.font = `${size}px ${SERIF}`;
      ctx.lineWidth = size * .22; ctx.strokeStyle = 'rgba(5,7,14,.88)'; ctx.strokeText(text, x, y);
      ctx.fillStyle = '#ffffff'; ctx.fillText(text, x, y);
    }
    ctx.restore();
  }

  _hint(ctx, record, kind) {
    const { x, lift } = record, y = record.y - lift;
    ctx.save();
    hexPath(ctx, x, y, SIZE - 3.6);
    if (kind === 'explore') {
      ctx.strokeStyle = 'rgba(140,200,242,.68)'; ctx.lineWidth = 1.6; ctx.stroke();
      if (this.camera.zoom > .5) {
        ctx.font = `23px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(214,234,250,.78)'; ctx.fillText('?', x, y + 1);
      }
    } else if (kind === 'claim') {
      hexPath(ctx, x, y, SIZE - 6); ctx.setLineDash([6, 6]); ctx.lineCap = 'round'; ctx.lineWidth = 3.4; ctx.strokeStyle = 'rgba(5,7,14,.7)'; ctx.stroke();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.9; ctx.stroke();
    } else {
      ctx.fillStyle = 'rgba(240,69,47,.3)'; ctx.fill();
      ctx.strokeStyle = '#05070e'; ctx.lineWidth = 7; ctx.stroke();
      ctx.strokeStyle = '#ff5a3c'; ctx.lineWidth = 4.2; ctx.stroke();
    }
    ctx.restore();
  }

  _mark(ctx, record) {
    const { x, lift } = record, y = record.y - lift;
    ctx.save(); hexPath(ctx, x, y, SIZE - 4); ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(5,7,14,.78)'; ctx.lineWidth = 6.5; ctx.stroke();
    ctx.strokeStyle = '#ffd34d'; ctx.lineWidth = 3.4; ctx.stroke();
    ctx.restore();
  }

  _yieldLabel(ctx, record) {
    if (!record.visible) return;
    const value = this._yieldOf(record);
    if (!value || (!value.supply && !value.gold)) return;
    const scale = clamp(1 / this.camera.zoom, .85, 1.3);
    ctx.save(); ctx.translate(record.x, record.y - record.lift); ctx.scale(scale, scale);
    this._yieldIcons(ctx, value, 20, scale);
    ctx.restore();
  }

  _yieldOf(record) {
    if (!this._yieldCache.has(record.key)) this._yieldCache.set(record.key, this.options.tileYield?.(record.key) || null);
    return this._yieldCache.get(record.key);
  }

  _pieces(ctx, record) {
    if (!record.visible) return;
    const { x, tile } = record, y = record.y - record.lift, faction = this.state.factions?.[tile.ownerId], color = faction?.color || '#c9b07a';
    const zoom = this.camera.zoom;
    ctx.save(); ctx.translate(x, y);
    const buildingId = tile.shipId ? 'ship' : tile.isCapital ? (faction?.isPlayer ? 'home' : 'capital') : this.state.campaign?.cities?.[tile.key] ? 'city' : tile.building ? String(tile.building).toLowerCase() : null;
    const art = buildingId && this.layer === 'terrain' && this._art.get(`building:${buildingId}`);
    if (art) {
      const width = tile.isCapital ? (faction?.isPlayer ? 88 : 64) : 56, height = width * art.height / art.width, top = 7 - height;
      // Grounded: a wide soft shadow sits right under the walls, so nothing seems to hover.
      ellipse(ctx, 2, 0, width * .54, width * .27, 'rgba(5,7,14,.34)');
      ellipse(ctx, 1, -1, width * .44, width * .2, 'rgba(5,7,14,.34)');
      ctx.drawImage(this._scaled(`building:${buildingId}`, art, width, height), -width / 2, top, width, height);
      if (tile.isCapital && !faction?.isPlayer) {
        path(ctx, [[0, top + 6], [0, top - 13]], null, '#f5eedf', 1.5);
        path(ctx, [[.7, top - 13], [16, top - 8.5], [.7, top - 4]], color, '#05070e', .7);
      }
    } else if (buildingId && this.layer === 'terrain') { if (tile.isCapital || buildingId==='city') drawCastle(ctx, color); else if(tile.building) drawBuilding(ctx, tile.building, color); }
    ctx.restore();
  }

  _flightMarkers(ctx) {
    this._flightHits = [];
    const placed = new Map();
    for (const flight of Object.values(this.state.campaign?.flights || {})) {
      const record = this._tileLookup.get(flight.key);
      if (!record || !record.visible) continue;
      const offset = placed.get(flight.key) || 0; placed.set(flight.key, offset + 1);
      const x = record.x + offset * 38, y = record.y - record.lift - 78, scale = 1 / this.camera.zoom;
      const art = this._art.get('building:airplane');
      ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
      ellipse(ctx, 0, 0, 24, 19, this.state.factions[flight.ownerId]?.color || '#ffd464', '#0d0d16', 2);
      if (art && !flight.native) ctx.drawImage(art, -30, -21, 60, 40);
      else {
        const hero = this.state.characters[flight.pilotIds[0]], face = hero && this.options.characterFace?.(hero.id) && this._face(this.options.characterFace(hero.id));
        if (face?.complete && face.naturalWidth) { ctx.save(); ctx.beginPath();ctx.arc(0,0,17,0,Math.PI*2);ctx.clip();ctx.drawImage(face,-17,-17,34,48);ctx.restore(); }
        else { ctx.fillStyle='#0d0d16';ctx.font='bold 20px sans-serif';ctx.textAlign='center';ctx.fillText('↟',0,7); }
      }
      ctx.restore();
      const sx = this.width / 2 + (x - this.camera.x) * this.camera.zoom, sy = this.height / 2 + (y - this.camera.y) * this.camera.zoom;
      this._flightHits.push({ id: flight.id, x0: sx - 27, x1: sx + 27, y0: sy - 23, y1: sy + 23 });
    }
  }

  _face(url) {
    if (this._faces.has(url)) return this._faces.get(url);
    const image = new Image();
    image.onload = () => this._requestDraw();
    image.onerror = () => { image.onerror = null; const id = /portraits\/([^/]+)\//.exec(url)?.[1], hero = this.state.characters?.[id]; image.src = fallbackPortrait(hero?.name || '军士', hero?.color); };
    image.src = url; this._faces.set(url, image);
    return image;
  }

  /** The circle around the selected tile that name plates and other tiles' markers stay out of, relative to the camera, in screen pixels. */
  _quiet() {
    const record = this.selected && this._tileLookup.get(this.selected);
    if (!record) return null;
    const { x, y, zoom } = this.camera;
    const card = this.options.quietBox?.(), w = this.width / 2, h = this.height / 2;
    return { x: (record.x - x) * zoom, y: (record.y - record.lift - y) * zoom, r: Math.max(SIZE * zoom, finite(this.options.quietRadius?.(), 0)), card: card && { left: card.left - w, right: card.right - w, top: card.top - h, bottom: card.bottom - h } };
  }

  /** Crowded markers give way: girls and capitals first. Head counts are small and only show up close. */
  _cullBadges(visible) {
    const zoom = this.camera.zoom, scale = clamp(1 / zoom, .8, 1.1) * zoom, items = [];
    for (const record of visible) {
      if (!record.visible || this.layer === 'yield' || this.layer === 'people') continue;
      const tile = record.tile, faces = this.options.armyFaces?.(tile.key) || [], stay = this.options.stationFaces?.(tile.key) || [], duty = this.options.dutyFace?.(tile.key) || null;
      if (!faces.length && !stay.length && !duty && !(finite(tile.troops) > 0 && tile.key === this.selected)) continue;
      const mine = !!this.state.factions?.[tile.ownerId]?.isPlayer;
      const rank = tile.key === this.army ? 10 : tile.key === this.selected ? 9 : mine && faces.length ? 8 : mine && (stay.length || duty) ? 7 : tile.isCapital ? 6 : this.hints.attack.has(tile.key) ? 5 : faces.length ? 4 : mine ? 3 : 1;
      items.push({ key: tile.key, rank, troops: finite(tile.troops), x: (record.x - this.camera.x) * zoom, y: (record.y - record.lift - (faces.length ? 26 : 8) - this.camera.y) * zoom, w: (faces.length ? 34 : stay.length ? 40 : duty ? 22 : 30) * scale, h: (faces.length ? 48 : stay.length ? (duty ? 40 : 22) : duty ? 22 : 15) * scale });
    }
    items.sort((a, b) => b.rank - a.rank || b.troops - a.troops || a.key.localeCompare(b.key));
    const placed = [], shown = new Set(), quiet = this._quiet();
    for (const item of items) {
      if (zoom < .62 && item.rank < 6) continue;
      if (quiet && item.key !== this.selected && item.key !== this.army && touchesCircle(quiet, item.x, item.y, item.w, item.h)) continue;
      if (placed.some(other => Math.abs(other.x - item.x) < (other.w + item.w) / 2 && Math.abs(other.y - item.y) < (other.h + item.h) / 2)) continue;
      placed.push(item); shown.add(item.key);
    }
    return shown;
  }

  _faceCrop(url, image, size) {
    const px = Math.max(8, Math.ceil(size * this.camera.zoom * this.dpr)), key = `face:${url}@${px}`;
    let copy = this._scaledArt.get(key);
    if (!copy) {
      copy = document.createElement('canvas'); copy.width = copy.height = px;
      const ctx = copy.getContext('2d'), sw = image.naturalWidth * .5;
      ctx.imageSmoothingQuality = 'high'; ctx.drawImage(image, image.naturalWidth * .24, image.naturalHeight * .025, sw, sw, 0, 0, px, px);
      this._scaledArt.set(key, copy);
    }
    return copy;
  }

  /** A face cut into a circle, framed. */
  _faceDisc(ctx, url, fx, fy, r, scale, ring, width = 1.8) {
    const image = this._face(url);
    ctx.save(); ctx.beginPath(); ctx.arc(fx, fy, r, 0, Math.PI * 2); ctx.fillStyle = '#efe8d6'; ctx.fill(); ctx.clip();
    if (image.complete && image.naturalWidth) ctx.drawImage(this._faceCrop(url, image, r * 2 * scale), fx - r, fy - r, r * 2, r * 2);
    ctx.restore();
    ctx.beginPath(); ctx.arc(fx, fy, r, 0, Math.PI * 2); ctx.strokeStyle = ring; ctx.lineWidth = width; ctx.stroke();
  }

  /**
   * What stands on a tile. An army (编队: girls marching, with the Sazai who go with them) flies a
   * banner with its lead girl's face, like a unit flag: tap the banner to command the army, tap the
   * ground to work the tile. Girls only stationed here sit as small faces. The head count of the tile
   * shows up on the selected tile.
   */
  _troops(ctx, record) {
    const { x, tile } = record, y = record.y - record.lift, faction = this.state.factions?.[tile.ownerId], troops = finite(tile.troops);
    const faces = this.options.armyFaces?.(tile.key) || [], stay = this.options.stationFaces?.(tile.key) || [], zoom = this.camera.zoom;
    const mine = !!faction?.isPlayer, native = !tile.ownerId, color = faction?.color || '#9aa0ae', scale = clamp(1 / zoom, .8, 1.1);
    const duty = mine ? this.options.dutyFace?.(tile.key) || null : null;
    const elite = tile.elite || {}, glow = elite.SSR ? '#ffc83d' : elite.SR ? '#c77dff' : elite.R ? '#5aa9ff' : null;
    const moved = mine && tile.marchedTurn === this.state.turn, commanded = tile.key === this.army;
    ctx.save(); ctx.translate(x, y - 2); ctx.scale(scale, scale);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const plate = troops > 0 && tile.key === this.selected && !faces.length, h = 20;
    if (plate) {
      if (moved) ctx.globalAlpha = .72;
      const label = String(Math.floor(troops));
      ctx.save(); ctx.translate(0, -24);
      ctx.font = `800 13px ${SANS}`;
      const w = Math.max(38, ctx.measureText(label).width + 28), left = -w / 2;
      roundRect(ctx, left, -h / 2, w, h, 10); ctx.fillStyle = mine ? '#ffcf6b' : native ? '#3b4050' : '#080b14'; ctx.fill();
      ctx.strokeStyle = mine ? '#080b14' : color; ctx.lineWidth = 1.6; ctx.stroke();
      if (glow) { roundRect(ctx, left - 2, -h / 2 - 2, w + 4, h + 4, 12); ctx.strokeStyle = glow; ctx.lineWidth = 1.6; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(left + 10, 0, 7.5, 0, Math.PI * 2); ctx.fillStyle = '#fbf7ec'; ctx.fill(); ctx.strokeStyle = '#080b14'; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.font = `800 9px ${SANS}`; ctx.fillStyle = '#14141c'; ctx.fillText('罪', left + 10, .5);
      ctx.font = `800 13px ${SANS}`; ctx.fillStyle = mine ? '#2a1a03' : '#ffffff'; ctx.fillText(label, left + 19 + (w - 21) / 2 - 1, .5);
      ctx.restore(); ctx.globalAlpha = 1;
    }
    if (faces.length) {
      // The banner: a swallow-tailed flag on a short pole, the lead girl's face on it, the count of girls on a corner.
      const W = 30, top = -50, bottom = -12, fill = mine ? '#ffcf6b' : color, ink = '#080b14';
      if (moved) ctx.globalAlpha = .58;
      ctx.beginPath(); ctx.moveTo(0, bottom + 3); ctx.lineTo(0, 0); ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, bottom + 3); ctx.lineTo(0, -1); ctx.strokeStyle = fill; ctx.lineWidth = 1.4; ctx.stroke();
      const flag = () => { ctx.beginPath(); ctx.moveTo(-W / 2, top); ctx.lineTo(W / 2, top); ctx.lineTo(W / 2, bottom); ctx.lineTo(0, bottom - 6); ctx.lineTo(-W / 2, bottom); ctx.closePath(); };
      if (commanded) { flag(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 7; ctx.stroke(); }
      flag(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 2.2; ctx.stroke();
      if (glow) { ctx.beginPath(); ctx.moveTo(-W / 2 + 3, bottom - 3); ctx.lineTo(0, bottom - 8.5); ctx.lineTo(W / 2 - 3, bottom - 3); ctx.strokeStyle = glow; ctx.lineWidth = 2.4; ctx.stroke(); }
      this._faceDisc(ctx, faces[0], 0, top + 15, 11.5, scale, ink, 2);
      if (faces.length > 1) {
        const bx = W / 2 - 1, by = top + 1;
        ctx.beginPath(); ctx.arc(bx, by, 7.5, 0, Math.PI * 2); ctx.fillStyle = ink; ctx.fill(); ctx.strokeStyle = fill; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.font = `800 9px ${SANS}`; ctx.fillStyle = '#fff'; ctx.fillText(`+${faces.length - 1}`, bx, by + .5);
      }
      if (moved) { ctx.globalAlpha = 1; ctx.font = `800 9px ${SANS}`; const tx = -W / 2 - 1, ty = top + 1; ctx.beginPath(); ctx.arc(tx, ty, 7, 0, Math.PI * 2); ctx.fillStyle = '#3b4050'; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fillText('歇', tx, ty + .5); }
      // Screen box for taps: never smaller than a fingertip.
      const k = scale * zoom, cx = this.width / 2 + (x - this.camera.x) * zoom, cy = this.height / 2 + (y - 2 - this.camera.y) * zoom;
      // Grow upward, never down over the tile itself: the ground below the flag still opens the tile.
      const halfW = Math.max(20, (W / 2 + 4) * k), y1 = cy + (bottom + 2) * k, y0 = Math.min(cy + (top - 4) * k, y1 - 40);
      this._banners.push({ key: tile.key, tap: mine, x0: cx - halfW, x1: cx + halfW, y0, y1 });
    } else if (stay.length) {
      const shown = stay.slice(0, 3), r = 8, gap = 13, top = plate ? -h / 2 - 24 - r : duty ? -24 : -2;
      if (moved) ctx.globalAlpha = .72;
      shown.forEach((url, i) => this._faceDisc(ctx, url, (i - (shown.length - 1) / 2) * gap, top, r, scale, mine ? '#ffcf6b' : color, 1.6));
      if (stay.length > 3) {
        const fx = (shown.length - 1) / 2 * gap + r + 2, fy = top - 6;
        ctx.beginPath(); ctx.arc(fx, fy, 6.5, 0, Math.PI * 2); ctx.fillStyle = '#080b14'; ctx.fill();
        ctx.font = `800 8px ${SANS}`; ctx.fillStyle = '#fff'; ctx.fillText(`+${stay.length - 3}`, fx, fy + .5);
      }
    }
    if (duty) {
      // 差事: the girl working this tile, under the head count (beside the pole when an army stands here), with her job's first character.
      const dx = faces.length ? 17 : 0, dy = -3, r = 8.5;
      ctx.globalAlpha = 1;
      this._faceDisc(ctx, duty.url, dx, dy, r, scale, '#7fe0b0', 2);
      const mx = dx + r * .78, my = dy + r * .72;
      ctx.beginPath(); ctx.arc(mx, my, 6.5, 0, Math.PI * 2); ctx.fillStyle = '#10121c'; ctx.fill(); ctx.strokeStyle = '#7fe0b0'; ctx.lineWidth = 1.3; ctx.stroke();
      ctx.font = `800 8.5px ${SANS}`; ctx.fillStyle = '#ffffff'; ctx.fillText(duty.mark || '差', mx, my + .5);
    }
    ctx.restore();
  }

  /** 人口 layer: how many Sazai live on each tile, and on your own land the girls standing there (编队、驻扎、差事). */
  _population(ctx, record) {
    const { tile } = record, troops = finite(tile.troops), zoom = this.camera.zoom;
    if (!record.visible || tile.shipId || (!tile.ownerId && troops <= 0) || zoom < .4) return;
    const faction = this.state.factions?.[tile.ownerId], mine = !!faction?.isPlayer, girls = mine ? this.options.tileGirls?.(tile.key) || [] : [];
    const scale = clamp(1 / zoom, .75, 1.25), label = String(Math.floor(troops)), h = 20;
    ctx.save(); ctx.translate(record.x, record.y - record.lift - (girls.length ? 9 : 0)); ctx.scale(scale, scale);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `800 13px ${SANS}`;
    const w = Math.max(40, ctx.measureText(label).width + 30), left = -w / 2;
    roundRect(ctx, left, -h / 2, w, h, 10); ctx.fillStyle = mine ? '#fff6d8' : tile.ownerId ? '#10121c' : '#3b4050'; ctx.fill();
    ctx.strokeStyle = mine ? '#10121c' : faction?.color || '#9aa0ae'; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.beginPath(); ctx.arc(left + 10, 0, 7.5, 0, Math.PI * 2); ctx.fillStyle = mine ? '#10121c' : '#fbf7ec'; ctx.fill();
    ctx.font = `800 9px ${SANS}`; ctx.fillStyle = mine ? '#fff6d8' : '#14141c'; ctx.fillText('罪', left + 10, .5);
    ctx.font = `800 13px ${SANS}`; ctx.fillStyle = mine ? '#10121c' : '#ffffff'; ctx.fillText(label, left + 19 + (w - 21) / 2 - 1, .5);
    if (girls.length) {
      const shown = girls.slice(0, 3), r = 8, gap = 15, top = h / 2 + 4 + r;
      shown.forEach((url, i) => this._faceDisc(ctx, url, (i - (shown.length - 1) / 2) * gap, top, r, scale, '#ffcf6b', 1.6));
      if (girls.length > 3) {
        const fx = (shown.length - 1) / 2 * gap + r + 8;
        ctx.beginPath(); ctx.arc(fx, top, 7, 0, Math.PI * 2); ctx.fillStyle = '#10121c'; ctx.fill(); ctx.strokeStyle = '#ffcf6b'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.font = `800 8px ${SANS}`; ctx.fillStyle = '#fff'; ctx.fillText(`+${girls.length - 3}`, fx, top + .5);
      }
    }
    ctx.restore();
  }

  /** The commanded army's tile: a gold double ring, unlike the white ring of a selected tile. */
  _armyRing(ctx, key) {
    const r = this._tileLookup.get(key);
    if (!r) return;
    ctx.save();
    hexPath(ctx, r.x, r.y - r.lift, SIZE - 1.6);
    ctx.fillStyle = 'rgba(255,200,61,.16)'; ctx.fill();
    ctx.strokeStyle = 'rgba(5,7,14,.9)'; ctx.lineWidth = 8; ctx.stroke();
    ctx.strokeStyle = '#ffc83d'; ctx.lineWidth = 4.4; ctx.stroke();
    hexPath(ctx, r.x, r.y - r.lift, SIZE - 7.5); ctx.strokeStyle = 'rgba(255,233,170,.9)'; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.restore();
  }

  /** The order being looked at: a fat arrow from the army to the target, white to march, red to attack. */
  /** A trail through tile centres: ink underlay, dashed colour on top, a dot where the army rests each night, a pennant at the end. */
  _trail(ctx, path, stops, color, strong) {
    const points = path.map(key => this._tileLookup.get(key)).filter(Boolean).map(record => [record.x, record.y - record.lift]);
    if (points.length < 2) return;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha = strong ? 1 : .72;
    const line = () => { ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); };
    line(); ctx.strokeStyle = 'rgba(5,7,14,.82)'; ctx.lineWidth = strong ? 8 : 5.5; ctx.stroke();
    line(); ctx.setLineDash(strong ? [2, 9] : [1, 8]); ctx.strokeStyle = color; ctx.lineWidth = strong ? 4.4 : 3; ctx.stroke(); ctx.setLineDash([]);
    stops.forEach((key, index) => {
      const record = this._tileLookup.get(key); if (!record) return;
      const x = record.x, y = record.y - record.lift, last = index === stops.length - 1;
      if (last) {
        // The destination: a small pennant planted in the tile.
        ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.lineTo(x, y - 17); ctx.strokeStyle = 'rgba(5,7,14,.95)'; ctx.lineWidth = 3.4; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + 1, y - 17); ctx.lineTo(x + 15, y - 12); ctx.lineTo(x + 1, y - 6); ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = 'rgba(5,7,14,.95)'; ctx.lineWidth = 1.6; ctx.stroke();
      } else if (strong) {
        ctx.beginPath(); ctx.arc(x, y, 8.5, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = 'rgba(5,7,14,.95)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.font = `800 10px ${SANS}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#10121c'; ctx.fillText(String(index + 1), x, y + .5);
      } else { ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = 'rgba(5,7,14,.9)'; ctx.lineWidth = 1.4; ctx.stroke(); }
    });
    ctx.restore();
  }

  /** Every standing order, faint; the commanded army's own order is drawn by _route. */
  _orders(ctx) {
    for (const order of this.orders || []) if (order.key !== this.army) this._trail(ctx, order.path, order.stops, '#ffd98a', false);
  }

  /** How many people live on a tile, readable from far away: the 军情 layer's whole point. */
  _people(ctx, record) {
    const { tile } = record, troops = finite(tile.troops), zoom = this.camera.zoom;
    if (!record.visible || !tile.ownerId || troops <= 0 || zoom < .42) return;
    const faction = this.state.factions?.[tile.ownerId], mine = !!faction?.isPlayer;
    if (!this._peopleCache.has(record.key)) this._peopleCache.set(record.key, mine ? this.options.tilePeople?.(record.key) || null : null);
    const info = this._peopleCache.get(record.key), short = mine && info && troops < info.need, over = mine && info?.limit !== undefined && troops > info.limit;
    // Close up, your own pills also say how many the tile can feed (补给上限); over it, the pill turns gold.
    const cap = mine && info?.limit !== undefined && (over || zoom >= 1.15) ? `/${info.limit}` : '';
    const mark = tile.isCapital ? '都' : tile.building === 'fort' ? '堡' : '', label = String(Math.floor(troops)) + cap, scale = clamp(1 / zoom, .72, 1.25);
    ctx.save(); ctx.translate(record.x, record.y - record.lift + 13); ctx.scale(scale, scale);
    ctx.font = `800 13px ${SANS}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const w = Math.max(26, ctx.measureText(label).width + (mark ? 30 : 14)), h = 19;
    roundRect(ctx, -w / 2, -h / 2, w, h, 9.5); ctx.fillStyle = mine ? (over ? '#ffc83d' : short ? '#ffb7a3' : '#fff6d8') : '#10121c'; ctx.fill();
    ctx.strokeStyle = mine ? '#10121c' : faction?.color || '#ffffff'; ctx.lineWidth = 1.6; ctx.stroke();
    if (mark) {
      ctx.beginPath(); ctx.arc(-w / 2 + 10, 0, 7.5, 0, Math.PI * 2); ctx.fillStyle = mine ? '#10121c' : faction?.color || '#ffffff'; ctx.fill();
      ctx.font = `800 9px ${SANS}`; ctx.fillStyle = mine ? '#fff6d8' : '#10121c'; ctx.fillText(mark, -w / 2 + 10, .5); ctx.font = `800 13px ${SANS}`;
    }
    ctx.fillStyle = mine ? (short ? '#8f1d0c' : '#10121c') : '#ffffff'; ctx.fillText(label, mark ? 8 : 0, .5);
    ctx.restore();
  }

  /** A road being planned: a packed-earth band with a centre line, and a gold stud on every tile that still needs paving. */
  _roadTrail(ctx, path) {
    const records = path.map(key => this._tileLookup.get(key)).filter(Boolean);
    if (!records.length) return;
    const points = records.map(record => [record.x, record.y - record.lift]);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (points.length > 1) {
      const line = () => { ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); };
      line(); ctx.strokeStyle = 'rgba(5,7,14,.85)'; ctx.lineWidth = 11; ctx.stroke();
      line(); ctx.strokeStyle = '#c4934c'; ctx.lineWidth = 6.5; ctx.stroke();
      line(); ctx.setLineDash([6, 7]); ctx.strokeStyle = '#fff4cf'; ctx.lineWidth = 1.8; ctx.stroke(); ctx.setLineDash([]);
    }
    records.forEach((record, index) => {
      if (record.tile.road) return;
      const [x, y] = points[index];
      ctx.beginPath(); ctx.arc(x, y, 6.5, 0, Math.PI * 2); ctx.fillStyle = '#ffcf4a'; ctx.fill(); ctx.strokeStyle = 'rgba(5,7,14,.95)'; ctx.lineWidth = 2; ctx.stroke();
    });
    ctx.restore();
  }

  _route(ctx) {
    if (this.route?.kind === 'road' && this.route.path?.length) { this._roadTrail(ctx, this.route.path); return; }
    if (this.route?.kind === 'far' && this.route.rest) {
      // A plan that runs into land not open yet: the walkable part bold, the rest a faint trail to the pennant.
      this._trail(ctx, this.route.rest, this.route.stops.filter(key => this.route.rest.includes(key)), '#ffb36b', true);
      if (this.route.path?.length > 1) this._trail(ctx, this.route.path, [], '#ffffff', true);
      return;
    }
    if (this.route?.kind === 'far' && this.route.path?.length > 1) { this._trail(ctx, this.route.path, this.route.stops, '#ffffff', true); return; }
    const a = this._tileLookup.get(this.route?.from), b = this._tileLookup.get(this.route?.to);
    if (!a || !b) return;
    const ax = a.x, ay = a.y - a.lift, bx = b.x, by = b.y - b.lift, d = Math.hypot(bx - ax, by - ay);
    if (d < 1) return;
    const ux = (bx - ax) / d, uy = (by - ay) / d, nx = -uy, ny = ux, bend = Math.min(26, d * .18);
    const sx = ax + ux * 16, sy = ay + uy * 16, ex = bx - ux * 14, ey = by - uy * 14, mx = (sx + ex) / 2 + nx * bend, my = (sy + ey) / 2 + ny * bend;
    const tx = ex - mx, ty = ey - my, tl = Math.hypot(tx, ty) || 1, hx = tx / tl, hy = ty / tl;
    const color = this.route.kind === 'attack' ? '#ff5a3c' : '#ffffff';
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [width, stroke] of [[11, 'rgba(5,7,14,.85)'], [5.5, color]]) {
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(mx, my, ex - hx * 9, ey - hy * 9); ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke();
    }
    const head = (grow, fill) => { ctx.beginPath(); ctx.moveTo(ex + hx * grow, ey + hy * grow); ctx.lineTo(ex - hx * (15 + grow) + -hy * (10 + grow), ey - hy * (15 + grow) + hx * (10 + grow)); ctx.lineTo(ex - hx * (15 + grow) + hy * (10 + grow), ey - hy * (15 + grow) - hx * (10 + grow)); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
    head(3, 'rgba(5,7,14,.85)'); head(0, color);
    ctx.restore();
  }

  /** Shared measuring/painting metrics keep building labels away from real yields. */
  _yieldMetrics(ctx, value, size) {
    const groups = [['icon:food', value.supply], ['icon:gold', value.gold]].filter(([, amount]) => amount > 0);
    const step = size * .78, gap = size * .15;
    ctx.font = `800 ${Math.round(size * .8)}px ${SANS}`;
    const widths = groups.map(([name, amount]) => !this._art.get(name) ? ctx.measureText(`${name === 'icon:food' ? '粮' : '金'}${amount}`).width + 5 : amount >= 5 ? size + ctx.measureText(String(amount)).width + 2 : amount > 1 ? step * 2 : step);
    return {groups,step,gap,widths,total:widths.reduce((sum,width)=>sum+width,0)+Math.max(0,groups.length-1)*gap};
  }

  /** One icon per point in the middle of the hex; from five up, a single icon with the number beside it. */
  _yieldIcons(ctx, value, size, scale = 1) {
    const {groups, step, gap, widths, total} = this._yieldMetrics(ctx, value, size);
    const spots = { 1: [[0, 0]], 2: [[-.5, 0], [.5, 0]], 3: [[-.5, .42], [.5, .42], [0, -.42]], 4: [[-.5, -.42], [.5, -.42], [-.5, .42], [.5, .42]] };
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    let cursor = -total / 2;
    groups.forEach(([name, amount], index) => {
      const art = this._art.get(name), left = cursor, cx = cursor + widths[index] / 2;
      cursor += widths[index] + gap;
      if (!art) { ctx.fillStyle = name === 'icon:food' ? '#d6e6ad' : '#ffcf6b'; ctx.textAlign = 'center'; ctx.fillText(`${name === 'icon:food' ? '粮' : '金'}${amount}`, cx, .5); ctx.textAlign = 'left'; return; }
      const image = this._scaled(name, art, size * scale, size * scale);
      if (amount >= 5) {
        ctx.drawImage(image, left, -size / 2, size, size);
        ctx.lineWidth = 2.6; ctx.strokeStyle = '#080b14'; ctx.strokeText(String(amount), left + size + 1, .5);
        ctx.fillStyle = '#fff'; ctx.fillText(String(amount), left + size + 1, .5);
      } else for (const [dx, dy] of spots[amount]) ctx.drawImage(image, cx + dx * step - size / 2, dy * step - size / 2, size, size);
    });
  }

  _miniYield(ctx, record) {
    if (!record.visible || this.camera.zoom < .85 || this.layer !== 'terrain' || (record.key !== this.selected && record.key !== this.hovered)) return;
    const value = this._yieldOf(record);
    if (!value || (!value.supply && !value.gold)) return;
    const scale = clamp(1 / this.camera.zoom, .8, 1);
    ctx.save(); ctx.translate(record.x, record.y - record.lift + SIZE * .3); ctx.scale(scale, scale);
    this._yieldIcons(ctx, value, 13, scale);
    ctx.restore();
  }

  /** The plate rests on its own castle at a steady screen size, and stands aside for the selected tile. */
  _capitalLabel(ctx, record, quiet) {
    const { tile, x } = record, zoom = this.camera.zoom;
    if (!record.visible || !tile.isCapital || zoom < .5) return;
    const faction = this.state.factions?.[tile.ownerId];
    const text = String(tile.name || faction?.name || '首都');
    // An army banner stands on the capital: the name goes above the flag, never over her face.
    const labelScale = clamp(1 / zoom, .62, 1.6), banner = (this.options.armyFaces?.(tile.key) || []).length ? 52 * clamp(1 / zoom, .8, 1.1) + 6 + 14 * labelScale : 0;
    const y = record.y - record.lift - Math.max(LABEL_RISE, banner);
    ctx.save(); ctx.translate(x, y); ctx.scale(labelScale, labelScale);
    ctx.font = `14px ${SERIF}`; const w = Math.min(170, ctx.measureText(text).width + 16);
    if (quiet && touchesCircle(quiet, (x - this.camera.x) * zoom, (y - this.camera.y) * zoom, w * labelScale * zoom, 27 * labelScale * zoom)) { ctx.restore(); return; }
    roundRect(ctx, -w / 2, -14, w, 27, 6);
    ctx.fillStyle = faction?.isPlayer ? '#ffcf6b' : '#080b14'; ctx.fill();
    ctx.fillStyle = faction?.isPlayer ? '#2a1a03' : faction?.color || '#f2b84b'; ctx.fillRect(-w / 2 + 6, 10, w - 12, 2.4);
    ctx.fillStyle = faction?.isPlayer ? '#2a1a03' : '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, -1, w - 12);
    ctx.restore();
  }

  /** Buildings in front can hide the near edge of the selection, so that edge is drawn again over them. */
  _frontEdge(ctx, key) {
    const r = this._tileLookup.get(key);
    if (!r) return;
    ctx.save();
    ctx.beginPath(); ctx.rect(r.x - SIZE * 1.2, r.y - r.lift, SIZE * 2.4, SIZE * 1.4); ctx.clip();
    hexPath(ctx, r.x, r.y - r.lift, SIZE - 1.6);
    ctx.strokeStyle = 'rgba(5,7,14,.9)'; ctx.lineWidth = 7.5; ctx.stroke();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.8; ctx.stroke();
    ctx.restore();
  }

  _highlight(ctx, key, selected = false) {
    const r = this._tileLookup.get(key);
    if (!r) return;
    ctx.save();
    hexPath(ctx, r.x, r.y - r.lift, SIZE - 1.6);
    if (selected) {
      ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fill();
      ctx.strokeStyle = 'rgba(5,7,14,.9)'; ctx.lineWidth = 7.5; ctx.stroke();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.8; ctx.stroke();
    } else {
      ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.92)'; ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.restore();
  }

  /** A small ink stamp is category information, never a replacement for faction colour. */
  _buildingToken(ctx, model, x, y, radius) {
    const r = radius;
    ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round';
    if (model.shape === 'round') { ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); }
    else {
      const shapes = {
        plot: [[-1,-.8],[1,-.8],[1,.8],[-1,.8]],
        roof: [[-1,-.45],[0,-1],[1,-.45],[1,.85],[-1,.85]],
        ticket: [[-1,-.9],[1,-.9],[.72,0],[1,.9],[-1,.9],[-.72,0]],
        diamond: [[0,-1.1],[1.1,0],[0,1.1],[-1.1,0]],
        hex: [[-.55,-1],[.55,-1],[1,0],[.55,1],[-.55,1],[-1,0]],
        tent: [[0,-1.15],[1.1,.85],[-1.1,.85]],
        shield: [[-1,-.9],[1,-.9],[.85,.4],[0,1.1],[-.85,.4]],
      };
      path(ctx, shapes[model.shape].map(([px,py])=>[px*r,py*r]));
      ctx.closePath();
    }
    ctx.fillStyle = model.accent; ctx.fill(); ctx.strokeStyle = '#10121c'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.font = `800 ${Math.round(r * 1.22)}px ${SANS}`; ctx.fillStyle = '#10121c';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(model.glyph, 0, model.shape === 'tent' ? r * .23 : .5);
    ctx.restore();
  }

  /** Reserve real marker extents, then reveal names/levels only when space allows. */
  _buildingLabels(ctx, visible, armyBadges, quiet) {
    const zoom = this.camera.zoom, items = [], reserved = [];
    const screen = record => ({x: (record.x - this.camera.x) * zoom, y: (record.y - record.lift - this.camera.y) * zoom});
    ctx.save();
    if (this.layer === 'political' || this.layer === 'diplomacy') reserved.push(...this._nationNameLayout(ctx,quiet).map(label=>label.box));
    for (const record of visible) {
      if (!record.visible) continue;
      const p = screen(record), tile = record.tile;
      if (armyBadges.has(record.key)) {
        const faces = this.options.armyFaces?.(tile.key) || [], stay = this.options.stationFaces?.(tile.key) || [], scale = clamp(1 / zoom, .8, 1.1) * zoom;
        const plate = finite(tile.troops) > 0 && record.key === this.selected && !faces.length;
        ctx.font = `800 13px ${SANS}`;
        const plateW = Math.max(38, ctx.measureText(String(Math.floor(finite(tile.troops)))).width + 28);
        if (plate) reserved.push({x:p.x,y:p.y - 2*zoom - 24*scale,w:plateW*scale+5,h:24*scale});
        if (faces.length) reserved.push({x:p.x,y:p.y-2*zoom-31*scale,w:36*scale,h:46*scale});
        if (this.options.dutyFace?.(tile.key)) reserved.push({x:p.x+(faces.length?17*scale:0),y:p.y-2*zoom-3*scale,w:22*scale,h:22*scale});
        else if (stay.length) {
          const w = (Math.min(3,stay.length)-1)*13 + 20 + (stay.length>3?15:0);
          reserved.push({x:p.x+(stay.length>3?7*scale:0),y:p.y-2*zoom-(plate?43*scale:0),w:w*scale,h:20*scale});
        }
      }
      if (this.layer === 'people' && (tile.ownerId || finite(tile.troops) > 0) && !tile.shipId) {
        const scale = clamp(1 / zoom, .75, 1.25) * zoom, girls = this.state.factions?.[tile.ownerId]?.isPlayer ? (this.options.tileGirls?.(tile.key) || []).length : 0;
        reserved.push({x:p.x,y:p.y-(girls?2:0)*scale,w:52*scale,h:(girls?44:22)*scale});
      }
      if (this.upgradable.has(record.key) && this.layer !== 'force' && this.layer !== 'people') {
        const scale = zoom < .8 && record.key !== this.selected ? .55 : zoom < 1 ? .8 : 1;
        reserved.push({x:p.x+23*zoom,y:p.y-15*zoom,w:24*scale,h:24*scale});
      }
      const miniYield = this.layer === 'terrain' && zoom >= .85 && (record.key === this.selected || record.key === this.hovered);
      if (this.layer === 'yield' || miniYield) {
        // Measure the same authoritative yield and assets used by _yieldIcons.
        const value = this._yieldOf(record), size = miniYield ? 13 : 20;
        if (value && (value.supply || value.gold)) {
          const scale = (miniYield ? clamp(1/zoom,.8,1) : clamp(1/zoom,.85,1.3))*zoom;
          const metrics = this._yieldMetrics(ctx,value,size);
          reserved.push({x:p.x,y:p.y+(miniYield?SIZE*.3*zoom:0),w:metrics.total*scale+4,h:size*1.7*scale+4});
        }
      }
      if (tile.isCapital && zoom >= .5 && this.layer !== 'political' && this.layer !== 'diplomacy') {
        const faction = this.state.factions?.[tile.ownerId], text = String(tile.name || faction?.name || '首都');
        ctx.font = `14px ${SERIF}`;
        const scale = clamp(1/zoom,.62,1.6)*zoom, w = Math.min(170,ctx.measureText(text).width+16)*scale;
        const box = {x:p.x,y:p.y-LABEL_RISE*zoom,w,h:27*scale};
        if (!quiet || !touchesCircle(quiet,box.x,box.y,box.w,box.h)) reserved.push(box);
      }
      const selected = record.key === this.selected, hovered = record.key === this.hovered;
      const model = buildingLabelModel(tile,{visible:record.visible,zoom,layer:this.layer,focused:selected||hovered});
      if (!model) continue;
      if (this.calm && !selected && !hovered && !model.states.length && zoom < 1.3) continue;
      const radius = zoom < .7 && !selected && !hovered ? 7 : 9;
      const suffix = model.compactState || model.compactLevel;
      const compactW = radius*2.3 + (suffix ? 9 : 0), compactH = radius*2.3;
      const compact = [15,24].map(offset=>({x:p.x,y:p.y+offset*zoom,w:compactW,h:compactH,detail:false,radius,suffix}));
      const options = [];
      if (model.detail) {
        ctx.font = `800 12px ${SANS}`;
        const w = ctx.measureText(model.text).width + 33, h = 25;
        const y = selected || hovered ? p.y + SIZE*TILT*zoom + h/2 + 5 : p.y + 15*zoom;
        options.push({x:p.x,y,w,h,detail:true,radius:9});
        if (selected || hovered) {
          const dx = SQRT3/2*SIZE*zoom + w/2 + 7;
          options.push({x:p.x+dx,y:p.y+15*zoom,w,h,detail:true,radius:9});
          options.push({x:p.x-dx,y:p.y+15*zoom,w,h,detail:true,radius:9});
        }
      }
      options.push(...compact);
      items.push({key:record.key,selected,hovered,model,anchor:p,rank:selected?100:hovered?90:tile.isCapital?60:30,options});
    }
    const card = quiet?.card;
    const labelQuiet = quiet && {...quiet,card:card&&{x:(card.left+card.right)/2,y:(card.top+card.bottom)/2,w:card.right-card.left,h:card.bottom-card.top}};
    const labels = layoutBuildingLabels(items,{reserved,quiet:labelQuiet,bounds:{left:-this.width/2+3,right:this.width/2-3,top:-this.height/2+3,bottom:this.height/2-3}});
    // Paint in screen pixels. These annotations have no hit boxes: the existing
    // raised hex and upgrade marker continue to be the only selection targets.
    for (const label of labels) {
      ctx.save(); ctx.translate(this.camera.x+label.x/zoom,this.camera.y+label.y/zoom); ctx.scale(1/zoom,1/zoom);
      if (label.detail) {
        if (label.selected || label.hovered) {
          const side = Math.sign(label.x-label.anchor.x);
          const line = side ? [[label.anchor.x-label.x+side*SQRT3/2*SIZE*zoom,0],[-side*label.w/2,0]] : [[0,label.anchor.y-label.y+SIZE*TILT*zoom],[0,-label.h/2]];
          path(ctx, line, null, '#fff8e9', 3.5);
          path(ctx, line, null, '#10121c', 1.3);
        }
        roundRect(ctx,-label.w/2+2,-label.h/2+2,label.w,label.h,3); ctx.fillStyle = '#10121c'; ctx.fill();
        roundRect(ctx,-label.w/2,-label.h/2,label.w,label.h,3); ctx.fillStyle = '#fff8e9'; ctx.fill(); ctx.strokeStyle = '#10121c'; ctx.lineWidth = 1.8; ctx.stroke();
        this._buildingToken(ctx,label.model,-label.w/2+13,0,9);
        ctx.font = `800 12px ${SANS}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#10121c'; ctx.fillText(label.model.text,-label.w/2+27,.5);
      } else {
        const tokenX = label.suffix ? -4.5 : 0;
        this._buildingToken(ctx,label.model,tokenX,0,label.radius);
        if (label.suffix) {
          roundRect(ctx,tokenX+label.radius*.55,-7,12,14,3); ctx.fillStyle = '#fff8e9'; ctx.fill(); ctx.strokeStyle = '#10121c'; ctx.lineWidth = 1.2; ctx.stroke();
          ctx.font = `800 10px ${SANS}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#10121c'; ctx.fillText(label.suffix,tokenX+label.radius*.55+6,.5);
        }
      }
      ctx.restore();
    }
    ctx.restore();
    return labels;
  }

  /** A persistent actionable upgrade marker, with the same keys as the keyboard queue. */
  _upBadge(ctx, record) {
    if (!record.visible || !this.upgradable.has(record.key) || this.layer === 'force' || this.layer === 'people') return;
    const scale = (this.camera.zoom < .8 && record.key !== this.selected ? .55 : this.camera.zoom < 1 ? .8 : 1) / this.camera.zoom;
    ctx.save(); ctx.translate(record.x + 23, record.y - record.lift - 15); ctx.scale(scale, scale);
    ellipse(ctx, 0, 0, 11, 11, '#ffd464', '#172534', 2);
    path(ctx, [[-4, 1], [0, -4], [4, 1]], null, '#172534', 2.4);
    path(ctx, [[0, -3], [0, 5]], null, '#172534', 2.4); ctx.restore();
  }

  _draw() {
    const ctx = this.ctx, { zoom, x, y } = this.camera;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.imageSmoothingQuality = 'low';
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.save(); ctx.translate(this.width / 2, this.height / 2); ctx.scale(zoom, zoom); ctx.translate(-x, -y);
    const halfW = this.width / zoom / 2 + SIZE * 2, halfH = this.height / zoom / 2 + SIZE * 3;
    const visible = this._regions.query(x, y, halfW, halfH);
    // Back to front, so a raised tile covers what stands behind it.
    for (const tile of visible) {
      this._tileBase(ctx, tile);
      this._borders(ctx, tile);
      // What can be acted on shows on the working layers; a commanded army's reach shows on every layer.
      if (this.layer === 'terrain' || this.layer === 'force' || this.army || this.picking) for (const kind of ['explore', 'claim', 'attack']) if (this.hints[kind].has(tile.key)) this._hint(ctx, tile, kind);
    }
    if (this.hovered && this.hovered !== this.selected && this.hovered !== this.army) this._highlight(ctx, this.hovered);
    if (this.army) this._armyRing(ctx, this.army);
    if (this.selected) this._highlight(ctx, this.selected, true);
    for (const tile of visible) this._pieces(ctx, tile);
    if (this.marks?.size) for (const tile of visible) if (this.marks.has(tile.key)) this._mark(ctx, tile);
    if (this.selected) this._frontEdge(ctx, this.selected);
    if (this.orders?.length) this._orders(ctx);
    if (this.route) this._route(ctx);
    this._banners = [];
    const badges = this._cullBadges(visible);
    if (this.layer === 'force') for (const tile of visible) this._people(ctx, tile);
    if (this.layer === 'people') for (const tile of visible) this._population(ctx, tile);
    for (const tile of visible) this._miniYield(ctx, tile);
    for (const tile of visible) if (badges.has(tile.key)) this._troops(ctx, tile);
    if (this.layer === 'yield') for (const tile of visible) this._yieldLabel(ctx, tile);
    const quiet = this._quiet();
    if (this.layer === 'political' || this.layer === 'diplomacy') this._nationNames(ctx, quiet);
    else for (const tile of visible) this._capitalLabel(ctx, tile, quiet);
    this._buildingLabels(ctx, visible, badges, quiet);
    for (const tile of visible) this._upBadge(ctx, tile);
    if (this.layer === 'control') for (const record of visible) if (record.visible && record.tile.ownerId && !record.tile.shipId) {
      ctx.save(); ctx.translate(record.x, record.y - record.lift + 18); ctx.scale(1 / zoom, 1 / zoom);
      ctx.font = `800 13px ${SANS}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#0d0d16'; ctx.lineWidth = 3;
      const label = `${controlAt(this.state, record.tile).percent}%`;
      ctx.strokeText(label, 0, 0); ctx.fillStyle = '#fff8e2'; ctx.fillText(label, 0, 0); ctx.restore();
    }
    this._flightMarkers(ctx);
    ctx.restore();
    if (this._viewDirty) { this._viewDirty = false; this.options.onView?.(this.getViewport()); }
  }
}

export default WorldMap;

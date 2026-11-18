/**
 * Discord login and cloud saves on the public site.
 *
 * Players who are not logged in keep their save in this browser only, exactly as before; nothing here
 * sends it anywhere. A logged-in player's save also goes to the account service on the VPS, bound to
 * their Discord account (game "sfw", slot "auto"). The service and the ng gate live in ../account/.
 * Every request is same-origin /account/*, so the session cookie stays HttpOnly and no CORS is involved.
 */
export const ACCOUNT_BASE = '/account';
export const CLOUD_GAME = 'sfw';
export const CLOUD_SLOT = 'auto';
const ID_RE = /^\d{5,25}$/;
const AVATAR_RE = /^(a_)?[0-9a-f]{32}$/;
const isJson = response => /application\/json/.test(response.headers.get('content-type') || '');
const signedOut = { login: false, user: null, ng: null };

/** {login, user, ng}: login says whether to offer the button at all; user is set only when logged in. */
export async function fetchAccount(fetchImpl = globalThis.fetch) {
  try {
    const response = await fetchImpl(`${ACCOUNT_BASE}/me`, { credentials: 'same-origin', cache: 'no-store', headers: { accept: 'application/json' } });
    if (!response.ok || !isJson(response)) return signedOut;
    const body = await response.json();
    const raw = body?.user;
    const user = raw && ID_RE.test(String(raw.id))
      ? { id: String(raw.id), name: String(raw.name || '旅人').slice(0, 40), avatar: AVATAR_RE.test(String(raw.avatar || '')) ? raw.avatar : null }
      : null;
    return { login: Boolean(body?.login), user, ng: user && /^https?:\/\/[^\s"'<>]+$/.test(String(body.ng || '')) ? String(body.ng) : null };
  } catch { return signedOut; }
}
export const loginHref = () => `${ACCOUNT_BASE}/login?to=ng`;
export async function logoutAccount(fetchImpl = globalThis.fetch) {
  try { return (await fetchImpl(`${ACCOUNT_BASE}/logout`, { method: 'POST', credentials: 'same-origin' })).ok; } catch { return false; }
}
export function avatarUrl(user, size = 64) {
  if (!user || !ID_RE.test(String(user.id))) return '';
  if (user.avatar) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  return `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(user.id) >> 22n) % 6n)}.png`;
}

/** Enough about a game to compare two copies without loading either. */
export const cloudMeta = (state, savedAt = Date.now()) => ({ seed: state?.seed ?? null, playerId: state?.playerId ?? null, turn: state?.turn ?? 0, revision: state?.revision || 0, savedAt });
const sameWorld = (a, b) => Boolean(a && b && a.seed === b.seed && a.playerId === b.playerId);
export const sameStamp = (a, b) => sameWorld(a, b) && (a.turn || 0) === (b.turn || 0) && (a.revision || 0) === (b.revision || 0);

/**
 * How the cloud copy and this browser's game relate, three-way against what was last synced here:
 *   'push' upload this browser's game · 'pull' take the cloud game · 'ask' let the player choose · 'same' nothing to do.
 * remote = {updatedAt, meta} | null, local = stamp of this browser's game | null, marker = {updatedAt, stamp} | null.
 */
export function planSync(remote, local, marker = null) {
  if (!remote) return local ? 'push' : 'same';
  if (!local) return 'pull';
  if (marker && marker.updatedAt === remote.updatedAt) return sameStamp(local, marker.stamp) ? 'same' : 'push';
  if (marker && sameStamp(local, marker.stamp)) return 'pull';
  // First sync in this browser, or both sides moved on: progress decides within one world.
  if (!sameWorld(remote.meta, local)) return 'ask';
  const order = item => [item.turn || 0, item.revision || 0];
  const [rt, rr] = order(remote.meta), [lt, lr] = order(local);
  if (rt !== lt) return rt > lt ? 'pull' : 'push';
  if (rr !== lr) return rr > lr ? 'pull' : 'push';
  return 'same';
}

/** What this browser last agreed with the cloud on, per Discord account. */
export function syncMarker(storage, userId) {
  const key = `mistbound.cloud.v1.${userId}`;
  return {
    read() { try { const value = JSON.parse(storage?.getItem(key) || 'null'); return value && typeof value.updatedAt === 'number' ? value : null; } catch { return null; } },
    write(updatedAt, stamp) { try { storage?.setItem(key, JSON.stringify({ updatedAt, stamp })); } catch {} },
  };
}

/**
 * Talks to /account/saves/<game>/<slot>. Uploads are debounced and always name the version they replace,
 * so a save made meanwhile on another device comes back as a conflict instead of being overwritten.
 * status: idle · pending · saving · synced · error · conflict · signed-out
 */
export function createCloudSync({ fetchImpl = globalThis.fetch, game = CLOUD_GAME, slot = CLOUD_SLOT, delay = 6000, onChange = () => {}, onSaved = () => {} } = {}) {
  const url = `${ACCOUNT_BASE}/saves/${game}/${slot}`;
  let base = null, timer = null, payloadFn = null, running = null, retry = 15000;
  // held: the conflict came from comparing at login (the player is being asked), not from a refused upload.
  const sync = { status: 'idle', conflict: null, held: false, updatedAt: null, lastMeta: null };
  const set = (status, extra = {}) => { Object.assign(sync, { status, ...extra }); onChange(sync); };
  const json = (method, body) => ({ method, credentials: 'same-origin', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body) });

  async function remote() {
    try {
      const response = await fetchImpl(`${ACCOUNT_BASE}/saves/${game}`, { credentials: 'same-origin', cache: 'no-store' });
      if (response.status === 401) { set('signed-out'); return { ok: false }; }
      if (!response.ok || !isJson(response)) return { ok: false };
      const found = (await response.json()).saves?.find(item => item.slot === slot) || null;
      return { ok: true, save: found ? { updatedAt: found.updatedAt, meta: found.meta || {} } : null };
    } catch { return { ok: false }; }
  }
  async function download() {
    try {
      const response = await fetchImpl(url, { credentials: 'same-origin', cache: 'no-store' });
      if (!response.ok || !isJson(response)) return { ok: false };
      const body = await response.json();
      return typeof body.data === 'string' ? { ok: true, data: body.data, meta: body.meta || {}, updatedAt: body.updatedAt } : { ok: false };
    } catch { return { ok: false }; }
  }
  async function upload(payload, againstBase = base) {
    set('saving');
    try {
      const response = await fetchImpl(url, json('PUT', { data: payload.data, meta: payload.meta, base: againstBase }));
      const body = isJson(response) ? await response.json() : {};
      if (response.ok) { base = body.updatedAt; retry = 15000; onSaved(body.updatedAt, payload.meta); set('synced', { updatedAt: body.updatedAt, lastMeta: payload.meta, conflict: null, held: false }); return { ok: true, updatedAt: body.updatedAt }; }
      if (response.status === 409) { set('conflict', { conflict: body.current || null, held: false }); return { ok: false, conflict: body.current || null }; }
      if (response.status === 401) { set('signed-out'); return { ok: false }; }
      set('error'); return { ok: false, status: response.status };
    } catch { set('error'); return { ok: false }; }
  }
  async function flush() {
    clearTimeout(timer); timer = null;
    if (running) await running;
    const make = payloadFn; payloadFn = null;
    if (!make || sync.status === 'conflict' || sync.status === 'signed-out') return;
    const payload = make();
    if (!payload) { if (sync.status === 'pending') set('synced'); return; }
    running = upload(payload).finally(() => { running = null; });
    const result = await running;
    if (!result.ok && !result.conflict && sync.status === 'error') { payloadFn = make; timer = setTimeout(flush, retry); retry = Math.min(retry * 2, 240000); }
  }
  return {
    sync, remote, download, upload, flush,
    /** Accept a version as the one this browser now agrees with (after a pull, a push, or a choice). */
    settle(updatedAt) { base = updatedAt; set('synced', { updatedAt, conflict: null, held: false }); },
    /** Stop uploading until the player picks between this browser's game and the cloud one. */
    hold(current) { clearTimeout(timer); timer = null; payloadFn = null; set('conflict', { conflict: current || null, held: true }); },
    schedule(make) {
      if (sync.status === 'conflict' || sync.status === 'signed-out') return;
      payloadFn = make; clearTimeout(timer); timer = setTimeout(flush, delay);
      if (sync.status !== 'saving') set('pending');
    },
    stop() { clearTimeout(timer); timer = null; payloadFn = null; set('idle'); },
  };
}

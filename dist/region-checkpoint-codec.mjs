/** Exact v1 regional checkpoint codec; storage adapters own durability/publication. */
import { deserializeGame, RULES_VERSION } from './engine.mjs?v=1118-1603';

const MAGIC = 'mistbound-region-checkpoint', VERSION = 1, REGION_SIZE = 16;
const MAX_BYTES = 64 * 1024 * 1024, MAX_TOTAL_BYTES = 96 * 1024 * 1024, MAX_TILES = 8000, MAX_BLOBS = MAX_TILES * 4 + 4;
const HASH = /^[a-f0-9]{64}$/;
const requireThat = (condition, message) => { if (!condition) throw new Error(message); };
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const own = (value, key) => Object.hasOwn(value, key);
const integer = (value, min, max) => Number.isSafeInteger(value) && value >= min && value <= max;
const put = (target, key, value) => Object.defineProperty(target, key, { value, enumerable: true, writable: true, configurable: true });
const digest = value => { requireThat(typeof value === 'string' && HASH.test(value), 'Invalid checkpoint/blob digest.'); return value; };
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });
const encode = value => encoder.encode(JSON.stringify(value));
export const ARCHIVE_MAX_BYTES = MAX_BYTES;
/** WebCrypto requires a supporting secure context. No silent weak-hash fallback. */
export async function webSha256(bytes) {
  requireThat(globalThis.crypto?.subtle?.digest, 'SHA-256 WebCrypto capability is unavailable.');
  const result = new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', bytes));
  return Array.from(result, byte => byte.toString(16).padStart(2, '0')).join('');
}
function bytesOf(bytes, expectedBytes) {
  requireThat(bytes instanceof Uint8Array && bytes.byteLength <= MAX_BYTES, 'Archive file is not bounded bytes.');
  if (expectedBytes !== undefined) requireThat(bytes.byteLength === expectedBytes, 'Archive dependency length mismatch.');
  return new Uint8Array(bytes);
}
function decode(bytes) {
  let text;
  try { text = decoder.decode(bytes); } catch { throw new Error('Invalid archive UTF-8.'); }
  const value = JSON.parse(text);
  requireThat(JSON.stringify(value) === text, 'Non-canonical archive JSON or duplicate member.');
  return value;
}
export async function encodeRegionCheckpoint({ text, writeBlob, readBlob, sha256 = webSha256 } = {}) {
  requireThat(typeof text === 'string' && text.length <= 20000000 && encoder.encode(text).length <= MAX_BYTES, 'Save must be bounded JSON text.');
  requireThat(typeof writeBlob === 'function' && typeof readBlob === 'function' && typeof sha256 === 'function', 'Checkpoint callbacks are required.');
  const sha = async bytes => digest(await sha256(new Uint8Array(bytes)));
  const loaded = deserializeGame(text); requireThat(loaded.ok, loaded.error);
  const state = loaded.state, exact = JSON.stringify(state);
  const dependencies = new Map(); let totalBytes = 0;
  async function emit(kind, payload) {
    const bytes = encode(payload), hash = await sha(bytes);
    if (!dependencies.has(hash)) {
      totalBytes += bytes.length;
      requireThat(bytes.length <= MAX_BYTES && totalBytes <= MAX_TOTAL_BYTES && dependencies.size < MAX_BLOBS, 'Checkpoint exceeds archive limits.');
      await writeBlob(hash, bytes);
      dependencies.set(hash, [hash, bytes.length, kind]);
    }
    return hash;
  }
  async function snapshot(world, depth = 0) {
    requireThat(depth <= 1 && world.history.length <= (depth ? 0 : 3), 'Unsupported undo nesting.');
    const fields = [];
    for (const [key, value] of Object.entries(world)) {
      if (key === 'tiles') {
        const regions = new Map(), order = Object.keys(value);
        requireThat(order.length <= MAX_TILES, 'Too many authoritative tiles.');
        for (const tileKey of order) {
          const tile = value[tileKey], q = Math.floor(tile.q / REGION_SIZE), r = Math.floor(tile.r / REGION_SIZE), regionKey = `${q},${r}`;
          const region = regions.get(regionKey) || { q, r, rows: [] };
          region.rows.push([tileKey, tile]); regions.set(regionKey, region);
        }
        const references = [];
        for (const { q, r, rows } of regions.values()) references.push([q, r, await emit('region', ['tile-region', VERSION, q, r, rows]), rows.length]);
        fields.push([key, ['tiles', order, references]]);
      } else if (key === 'history') {
        const references = [];
        for (const previous of value) references.push(await snapshot(previous, depth + 1));
        fields.push([key, ['history', references]]);
      } else fields.push([key, ['value', value]]);
    }
    return emit('snapshot', ['world-snapshot', VERSION, fields]);
  }
  const rootSnapshot = await snapshot(state);
  const manifest = [MAGIC, VERSION, { regionSize: REGION_SIZE, rulesVersion: RULES_VERSION, stateSha256: await sha(encoder.encode(exact)), stateChars: exact.length, root: rootSnapshot, dependencies: [...dependencies.values()] }];
  const bytes = encode(manifest), checkpoint = await sha(bytes);
  // Read every immutable dependency back before making the new root manifest visible.
  for (const [hash, size] of dependencies.values()) requireThat(await sha(bytesOf(await readBlob(hash, size), size)) === hash, 'Dependency readback failed.');
  return { checkpoint, bytes, stateSha256: manifest[2].stateSha256, dependencies: [...dependencies.values()], dependencyBytes: totalBytes, manifestBytes: bytes.length };
}

export async function decodeRegionCheckpoint({ checkpoint, manifestBytes, readBlob, sha256 = webSha256 } = {}) {
  digest(checkpoint); manifestBytes = bytesOf(manifestBytes);
  requireThat(typeof readBlob === 'function' && typeof sha256 === 'function', 'Checkpoint callbacks are required.');
  const sha = async bytes => digest(await sha256(new Uint8Array(bytes)));
  requireThat(await sha(manifestBytes) === checkpoint, 'Checkpoint manifest digest mismatch.');
  const manifest = decode(manifestBytes);
  requireThat(Array.isArray(manifest) && manifest.length === 3 && manifest[0] === MAGIC && manifest[1] === VERSION && object(manifest[2]), 'Unsupported checkpoint format.');
  const info = manifest[2];
  requireThat(Object.keys(info).join('|') === 'regionSize|rulesVersion|stateSha256|stateChars|root|dependencies', 'Invalid checkpoint header.');
  requireThat(info.regionSize === REGION_SIZE && info.rulesVersion === RULES_VERSION && integer(info.stateChars, 1, 20000000), 'Checkpoint rules/limits unsupported.');
  digest(info.stateSha256); digest(info.root);
  requireThat(Array.isArray(info.dependencies) && info.dependencies.length > 0 && info.dependencies.length <= MAX_BLOBS, 'Invalid dependency count.');
  const dependencies = new Map(), visited = new Set(); let totalBytes = 0;
  for (const row of info.dependencies) {
    requireThat(Array.isArray(row) && row.length === 3 && integer(row[1], 1, MAX_BYTES) && ['snapshot', 'region'].includes(row[2]), 'Invalid dependency.');
    const hash = digest(row[0]); requireThat(!dependencies.has(hash), 'Duplicate dependency.');
    dependencies.set(hash, row); totalBytes += row[1];
  }
  requireThat(totalBytes <= MAX_TOTAL_BYTES, 'Checkpoint dependency budget exceeded.');
  async function fetch(hash, kind) {
    digest(hash); const row = dependencies.get(hash);
    requireThat(row && row[2] === kind, 'Missing or wrong-kind dependency declaration.');
    const bytes = bytesOf(await readBlob(hash, row[1]), row[1]);
    requireThat(await sha(bytes) === hash, 'Dependency digest mismatch.'); visited.add(hash);
    return decode(bytes);
  }
  // Bound expanded JSON, not just unique stored blobs: repeated Undo references
  // must not amplify one legal-sized blob beyond the declared full-state budget.
  let expandedChars = 0;
  const countExpanded = chars => { expandedChars += chars; requireThat(expandedChars <= info.stateChars, 'Restored state character budget exceeded.'); };
  async function snapshot(hash, depth = 0) {
    requireThat(depth <= 1, 'Unsupported undo nesting.');
    countExpanded(2); // world braces

    const data = await fetch(hash, 'snapshot');
    requireThat(Array.isArray(data) && data.length === 3 && data[0] === 'world-snapshot' && data[1] === VERSION && Array.isArray(data[2]), 'Invalid snapshot.');
    const world = {}, keys = new Set();
    for (const row of data[2]) {
      requireThat(Array.isArray(row) && row.length === 2 && typeof row[0] === 'string' && Array.isArray(row[1]) && !keys.has(row[0]), 'Duplicate or invalid snapshot field.');
      const [key, entry] = row; countExpanded((keys.size ? 1 : 0) + JSON.stringify(key).length + 1); keys.add(key);
      if (key === 'tiles') {
        requireThat(entry.length === 3 && entry[0] === 'tiles' && Array.isArray(entry[1]) && entry[1].length <= MAX_TILES && Array.isArray(entry[2]) && entry[2].length <= MAX_TILES, 'Invalid tile index.');
        const [ , order, references ] = entry; countExpanded(2 + Math.max(0, order.length - 1));
        const orderSet = new Set(order), tiles = new Map(), regions = new Set();
        requireThat(orderSet.size === order.length && order.every(key => typeof key === 'string'), 'Duplicate or invalid ordered tile key.');
        for (const reference of references) {
          requireThat(Array.isArray(reference) && reference.length === 4 && integer(reference[0], -625, 625) && integer(reference[1], -625, 625) && integer(reference[3], 1, REGION_SIZE * REGION_SIZE), 'Invalid region reference.');
          const [q, r, hash, count] = reference, regionKey = `${q},${r}`;
          requireThat(!regions.has(regionKey), 'Duplicate region.'); regions.add(regionKey);
          const region = await fetch(hash, 'region');
          requireThat(Array.isArray(region) && region.length === 5 && region[0] === 'tile-region' && region[1] === VERSION && region[2] === q && region[3] === r && Array.isArray(region[4]) && region[4].length === count, 'Region header/count mismatch.');
          for (const row of region[4]) {
            requireThat(Array.isArray(row) && row.length === 2 && typeof row[0] === 'string' && object(row[1]), 'Invalid tile row.');
            const [key, tile] = row;
            requireThat(!tiles.has(key) && orderSet.has(key) && integer(tile.q, -10000, 10000) && integer(tile.r, -10000, 10000) && key === `${tile.q},${tile.r}` && tile.key === key, 'Duplicate, missing or inconsistent tile.');
            requireThat(Math.floor(tile.q / REGION_SIZE) === q && Math.floor(tile.r / REGION_SIZE) === r, 'Tile assigned to wrong region.');
            countExpanded(JSON.stringify(key).length + 1 + JSON.stringify(tile).length);
            tiles.set(key, tile);
          }
        }
        requireThat(tiles.size === order.length, 'Missing indexed tile.');
        const ordered = {}; for (const key of order) put(ordered, key, tiles.get(key)); put(world, key, ordered);
      } else if (key === 'history') {
        requireThat(entry.length === 2 && entry[0] === 'history' && Array.isArray(entry[1]) && entry[1].length <= (depth ? 0 : 3), 'Invalid undo references.');
        countExpanded(2 + Math.max(0, entry[1].length - 1));
        const history = []; for (const hash of entry[1]) history.push(await snapshot(hash, depth + 1)); put(world, key, history);
      } else {
        requireThat(entry.length === 2 && entry[0] === 'value', 'Invalid metadata field.'); countExpanded(JSON.stringify(entry[1]).length); put(world, key, entry[1]);
      }
    }
    return world;
  }
  const state = await snapshot(info.root), text = JSON.stringify(state);
  requireThat(visited.size === dependencies.size, 'Checkpoint contains unreferenced dependencies.');
  requireThat(text.length === info.stateChars && await sha(encoder.encode(text)) === info.stateSha256, 'Restored state/order digest mismatch.');
  const loaded = deserializeGame(text); requireThat(loaded.ok, `Restored game invalid: ${loaded.error}`);
  requireThat(JSON.stringify(loaded.state) === text, 'Game validation changed restored state.');
  return { checkpoint, state, text, stateSha256: info.stateSha256, dependencies: info.dependencies, dependencyBytes: totalBytes, manifestBytes: manifestBytes.length, verified: true };
}


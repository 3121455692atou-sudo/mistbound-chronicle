const MiB = 1024 * 1024;
const MAX_IMAGES = 4096;
const MAX_TOTAL = 512 * MiB;
const MAX_IMAGE = 32 * MiB;
const MAX_MANIFEST = MiB;
const PASSWORD = 'Cornelia';
const IMAGE_TYPES = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };

function fail(code = 'invalid') {
  throw Object.assign(new Error(code), { code });
}

function pathType(path) {
  const extension = path.split('.').pop().toLowerCase();
  return Object.hasOwn(IMAGE_TYPES, extension) ? IMAGE_TYPES[extension] : undefined;
}

async function readEntry(entry, type, signal) {
  const chunks = [];
  let actual = 0;
  const sink = new WritableStream({
    write(bytes) {
      actual += bytes.byteLength;
      if (actual > entry.uncompressedSize) fail();
      chunks.push(bytes);
    },
  });
  await entry.getData(sink, { signal, checkCrc32: true, checkOverlappingEntry: true });
  if (actual !== entry.uncompressedSize) fail();
  return new Blob(chunks, { type });
}

async function verifyImage(blob) {
  const bytes = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
  if (blob.type === 'image/png' && [137,80,78,71,13,10,26,10].every((n, i) => bytes[i] === n)) return;
  if (blob.type === 'image/jpeg' && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return;
  const header = String.fromCharCode(...bytes);
  if (blob.type === 'image/webp' && header.startsWith('RIFF') && header.slice(8) === 'WEBP') return;
  fail();
}

async function readManifest(entry, paths, signal) {
  const blob = await readEntry(entry, 'application/json', signal);
  const manifest = JSON.parse(await blob.text());
  if (manifest?.format !== 'mistbound-art-pack' || manifest.version !== 1) fail('unsupported');
  const hashes = manifest.files;
  if (!hashes || typeof hashes !== 'object' || Array.isArray(hashes) ||
      Object.keys(hashes).length !== paths.length ||
      !paths.every(path => Object.hasOwn(hashes, path) && /^[a-fA-F0-9]{64}$/.test(hashes[path]))) fail();
  return hashes;
}

export async function readArtPack(file, { signal } = {}) {
  if (!file?.size) fail();
  if (file.size > MAX_TOTAL) fail('limit');
  // Keep the ZIP decoder off the game's normal startup path.
  const { ZipReader, BlobReader } = await import('./vendor/zipjs/zip-core-external.min.js');
  const zip = new ZipReader(new BlobReader(file), { password: PASSWORD, strictness: 'strict', useWebWorkers: false });
  try {
    const entries = new Map();
    const paths = [];
    let total = 0;
    let count = 0;
    for await (const entry of zip.getEntriesGenerator()) {
      signal?.throwIfAborted();
      if (++count > MAX_IMAGES * 3 + 32) fail('limit');
      const path = entry.filename;
      if (path.length > 1024 || /^[a-z]:/i.test(path) || /[\\\u0000-\u001f]/.test(path)) fail();
      const parts = (entry.directory ? path.replace(/\/$/, '') : path).split('/');
      if (parts.some(p => !p || p === '.' || p === '..')) fail();
      if (entry.symlink) fail();
      if (entry.directory || parts.includes('__MACOSX') || parts.some(p => p.startsWith('.'))) continue;
      if (entries.has(path)) fail();
      if (!Number.isSafeInteger(entry.uncompressedSize) || entry.uncompressedSize <= 0) fail();
      if (path === 'manifest.json') {
        if (entry.uncompressedSize > MAX_MANIFEST) fail('limit');
      } else {
        if (!pathType(path)) fail();
        total += entry.uncompressedSize;
        paths.push(path);
        if (entry.uncompressedSize > MAX_IMAGE || total > MAX_TOTAL || paths.length > MAX_IMAGES) fail('limit');
      }
      entries.set(path, entry);
    }
    if (!paths.length) fail();
    const manifest = entries.get('manifest.json');
    const hashes = manifest && await readManifest(manifest, paths, signal);
    paths.sort();
    const images = [];
    for (const path of paths) {
      signal?.throwIfAborted();
      const blob = await readEntry(entries.get(path), pathType(path), signal);
      await verifyImage(blob);
      if (hashes) {
        const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
        const hex = Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('');
        if (hex !== hashes[path].toLowerCase()) fail();
      }
      images.push({ path, blob });
    }
    return { name: file.name || 'ZIP', paths, images };
  } finally {
    await zip.close();
  }
}

// A separate database keeps binary media out of every save/export/cloud-sync path.
let opening;
function database() {
  if (!opening) {
    opening = new Promise((resolve, reject) => {
      const request = indexedDB.open('mistbound-art-packs', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('images');
        request.result.createObjectStore('state');
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => { db.close(); opening = undefined; };
        resolve(db);
      };
    }).catch(error => { opening = undefined; throw error; });
  }
  return opening;
}

async function get(store, key) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const request = db.transaction(store).objectStore(store).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const activeArtPack = () => get('state', 'active');
export const artPackImage = path => get('images', path);

export async function replaceArtPack(pack) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['state', 'images'], 'readwrite');
    tx.oncomplete = resolve;
    tx.onabort = () => reject(tx.error || new Error('storage'));
    try {
      const images = tx.objectStore('images');
      const state = tx.objectStore('state');
      images.clear();
      if (pack) {
        for (const { path, blob } of pack.images) images.put(blob, path);
        state.put({ name: pack.name, paths: pack.paths }, 'active');
      } else {
        state.delete('active');
      }
    } catch (error) {
      tx.abort();
      reject(error);
    }
  });
}

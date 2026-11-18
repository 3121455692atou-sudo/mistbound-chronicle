import { artCopy as text } from './art-pack-copy.mjs?v=1118-1603';
import { activeArtPack, artPackImage, readArtPack, replaceArtPack } from './art-pack.mjs?v=1118-1603';

function caption(key, values) {
  return text[key].replace(/\{(\w+)\}/g, (_, name) => String(values[name]));
}

export function artPackPanel() {
  return `<details class="menu-more art-pack" id="art-pack-panel">
    <summary>${text.section}</summary>
    <p class="form-hint">${text.help}</p>
    <input type="file" accept=".zip,application/zip" data-pack="file" hidden>
    <div class="form-actions">
      <button type="button" class="small-button secondary" data-pack="choose">${text.choose}</button>
      <button type="button" class="small-button" data-pack="confirm" hidden>${text.confirm}</button>
      <button type="button" class="small-button secondary" data-pack="cancel" hidden>${text.cancel}</button>
    </div>
    <p class="form-hint" data-pack="status" role="status" aria-live="polite"></p>
    <div data-pack="gallery" hidden>
      <figure><img data-pack="image" alt=""><figcaption data-pack="position"></figcaption></figure>
      <div class="form-actions">
        <button type="button" class="small-button secondary" data-pack="previous">${text.previous}</button>
        <button type="button" class="small-button secondary" data-pack="next">${text.next}</button>
        <button type="button" class="small-button secondary" data-pack="remove">${text.remove}</button>
      </div>
    </div>
  </details>`;
}

export function bindArtPack(panel) {
  if (!panel) return;
  const el = Object.fromEntries(Array.from(panel.querySelectorAll('[data-pack]'), node => [node.dataset.pack, node]));
  const events = new AbortController();
  let reading, pending, installed, busy = false, epoch = 0, view = 0, index = 0, imageURL;
  const alive = id => !events.signal.aborted && panel.open && id === epoch;
  const status = value => { el.status.textContent = value; };
  const installedLabel = () => installed ? caption('active', { name: installed.name, count: installed.paths.length }) : text.empty;
  function releaseImage() {
    ++view;
    el.image.removeAttribute('src');
    if (imageURL) URL.revokeObjectURL(imageURL);
    imageURL = undefined;
  }
  function controls() {
    el.choose.disabled = busy;
    el.confirm.hidden = !pending;
    el.confirm.disabled = busy;
    el.cancel.hidden = !pending;
    el.cancel.disabled = busy;
    el.gallery.hidden = !installed;
    el.remove.disabled = busy || !!pending;
    el.previous.disabled = !installed || index === 0;
    el.next.disabled = !installed || index + 1 >= installed.paths.length;
  }
  async function showImage() {
    releaseImage();
    controls();
    if (!installed || !panel.open) return;
    const ticket = view;
    const path = installed.paths[index];
    el.position.textContent = caption('position', { index: index + 1, count: installed.paths.length });
    el.image.alt = path.split('/').pop();
    try {
      const blob = await artPackImage(path);
      if (ticket !== view) return;
      if (!blob) throw new Error('missing image');
      imageURL = URL.createObjectURL(blob);
      el.image.src = imageURL;
    } catch {
      if (ticket === view) status(text.imageError);
    }
  }
  async function refresh(id, message) {
    try {
      const pack = await activeArtPack();
      if (!alive(id)) return;
      installed = pack;
      index = 0;
      status(message || installedLabel());
      await showImage();
    } catch {
      if (alive(id)) status(text.storage);
    }
  }
  function reset() {
    ++epoch;
    reading?.abort();
    reading = undefined;
    pending = installed = undefined;
    busy = false;
    el.file.value = '';
    releaseImage();
    controls();
  }
  async function select() {
    const file = el.file.files[0];
    el.file.value = '';
    if (!file || busy) return;
    const id = ++epoch;
    reading = new AbortController();
    pending = undefined;
    busy = true;
    controls();
    status(text.checking);
    try {
      const pack = await readArtPack(file, { signal: reading.signal });
      if (!alive(id)) return;
      pending = pack;
      status(caption('ready', { name: pack.name, count: pack.paths.length }));
    } catch (error) {
      if (alive(id)) status(['limit', 'unsupported'].includes(error.code) ? text[error.code] : text.invalid);
    } finally {
      if (alive(id)) { busy = false; reading = undefined; controls(); }
    }
  }
  async function write(pack) {
    if (busy) return;
    const id = ++epoch;
    busy = true;
    controls();
    status(text.writing);
    try {
      await replaceArtPack(pack);
      if (!alive(id)) return;
      pending = undefined;
      await refresh(id, pack ? undefined : text.removed);
    } catch {
      if (alive(id)) status(text.storage);
    } finally {
      if (alive(id)) { busy = false; controls(); }
    }
  }
  const on = (node, event, fn) => node.addEventListener(event, fn, { signal: events.signal });
  on(panel, 'toggle', () => {
    reset();
    if (panel.open) refresh(epoch);
  });
  on(el.choose, 'click', () => el.file.click());
  on(el.file, 'change', select);
  on(el.confirm, 'click', () => { if (pending) write(pending); });
  on(el.cancel, 'click', () => { pending = undefined; status(installedLabel()); controls(); });
  on(el.remove, 'click', () => { if (installed) write(null); });
  on(el.previous, 'click', () => { if (index > 0) { --index; showImage(); } });
  on(el.next, 'click', () => { if (installed && index + 1 < installed.paths.length) { ++index; showImage(); } });
  on(el.image, 'error', () => { if (imageURL) status(text.imageError); });
  if (panel.open) refresh(epoch);
  return () => { events.abort(); reset(); };
}

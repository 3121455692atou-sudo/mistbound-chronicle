import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { ZipWriter, BlobWriter, BlobReader, TextReader } from '../dist/vendor/zipjs/zip-core-external.min.js';
import { readArtPack } from '../dist/art-pack.mjs';
import { artPackPanel } from '../dist/art-pack-ui.mjs';

// A one-pixel PNG keeps these tests independent of the game's art.
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WlOT6cAAAAASUVORK5CYII=', 'base64');
const sha = createHash('sha256').update(png).digest('hex');
async function fixture({ password, zipCrypto, manifest, bytes = png } = {}) {
  const zip = new ZipWriter(new BlobWriter(), { useWebWorkers: false, level: 0, password, zipCrypto });
  await zip.add('illustrations/one.png', new BlobReader(new Blob([bytes])));
  if (manifest) await zip.add('manifest.json', new TextReader(JSON.stringify(manifest)));
  return new File([await zip.close()], 'illustrations.zip');
}

test('ordinary art needs no import and the full disclosure row starts closed', () => {
  const html = artPackPanel();
  assert.match(html, /<details[^>]*><summary>|<details[^>]*>\s*<summary>/);
  assert.doesNotMatch(html, /<details[^>]*\bopen\b/);
  assert.doesNotMatch(html, /password|https?:\/\//i);
});

for (const [name, options] of [
  ['plain', {}],
  ['AES', { password: 'Cornelia' }],
  ['ZipCrypto', { password: 'Cornelia', zipCrypto: true }],
]) {
  test(`reads a local ${name} archive with the same game controls`, async () => {
    const pack = await readArtPack(await fixture(options));
    assert.deepEqual(pack.paths, ['illustrations/one.png']);
    assert.equal(pack.images[0].blob.type, 'image/png');
    assert.deepEqual(Buffer.from(await pack.images[0].blob.arrayBuffer()), png);
  });
}

test('verifies the version and every declared SHA-256 before returning a pack', async () => {
  const manifest = { format: 'mistbound-art-pack', version: 1, files: { 'illustrations/one.png': sha } };
  assert.equal((await readArtPack(await fixture({ manifest }))).images.length, 1);
  await assert.rejects(readArtPack(await fixture({ manifest: { ...manifest, version: 9 } })), { code: 'unsupported' });
  await assert.rejects(readArtPack(await fixture({ manifest: { ...manifest, files: { 'illustrations/one.png': '0'.repeat(64) } } })), { code: 'invalid' });
});

test('rejects an unreadable archive or a file mislabeled as artwork', async () => {
  await assert.rejects(readArtPack(await fixture({ password: 'other' })));
  await assert.rejects(readArtPack(await fixture({ bytes: new Uint8Array([1, 2, 3]) })), { code: 'invalid' });
});

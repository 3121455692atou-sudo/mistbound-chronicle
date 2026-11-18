import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { once } from 'node:events';
import { createSessionServer } from '../account/vps-session.mjs';

const secret = 'local-regression-session-secret-32-characters';
const token = (changes = {}, key = secret) => {
  const body = Buffer.from(JSON.stringify({
    v: 1, sub: '123456789012345678', exp: Math.floor(Date.now() / 1000) + 60, ...changes,
  })).toString('base64url');
  return `${body}.${createHmac('sha256', key).update(body).digest('base64url')}`;
};

test('local session gate preserves the NG signed-cookie rules', async t => {
  const server = createSessionServer(secret).listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}/session`;
  for (const [name, cookie, status] of [
    ['guest', '', 401],
    ['valid session among unrelated cookies', `other=a; mb_session=${token()}; extra=b`, 204],
    ['wrong signing key', `mb_session=${token({}, 'wrong-key')}`, 401],
    ['expired session', `mb_session=${token({ exp: 1 })}`, 401],
    ['wrong account shape', `mb_session=${token({ sub: '../asset' })}`, 401],
    ['wrong version', `mb_session=${token({ v: 2 })}`, 401],
    ['wrong expiry shape', `mb_session=${token({ exp: '9999999999' })}`, 401],
    ['cookie name must match', `x_mb_session=${token()}`, 401],
    ['first matching cookie owns the result', `mb_session=broken; mb_session=${token()}`, 401],
  ]) await t.test(name, async () => {
    const response = await fetch(url, { headers: { cookie } });
    assert.equal(response.status, status);
    assert.equal(await response.text(), '');
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
  });
  for (const [path, method] of [['/other', 'GET'], ['/session', 'POST']]) {
    const response = await fetch(new URL(path, url), { method, headers: { cookie: `mb_session=${token()}` } });
    assert.equal(response.status, 404);
  }
  assert.throws(() => createSessionServer('short'), /SESSION_SECRET/);
});

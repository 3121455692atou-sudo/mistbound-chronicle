// The mistbound-gate Worker: relays /account/* to the VPS account service and nothing else.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, statSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handle } from '../account/gate-core.mjs';

const ENV = { PROXY_SECRET: 'gate-proxy-secret-0123456789', ORIGIN_BASE: 'https://tomoko.galbands.com/_mistbound', PUBLIC_ORIGIN: 'https://mistbound.galbands.com', NG_HOST: 'ng.mistbound.galbands.com' };
const recorder = (respond = () => new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } })) => {
  const calls = [];
  const impl = async (input, init) => { calls.push({ input, init }); return respond(input, init); };
  return { impl, calls };
};

test('/account/* is relayed to the VPS with the proxy secret, only the account cookies, and no redirect following', async () => {
  const upstream = recorder(() => new Response(null, { status: 302, headers: { location: 'https://discord.com/oauth2/authorize?x=1', 'set-cookie': 'mb_oauth=s.ng.n; Path=/account', server: 'nginx' } }));
  for (const host of ['mistbound.galbands.com', 'ng.mistbound.galbands.com']) {
    const response = await handle(new Request(`https://${host}/account/login?to=ng`, { headers: { cookie: 'mb_session=abc; _ga=tracker; mb_oauth=s.ng.n', 'cf-connecting-ip': '198.51.100.7', accept: 'text/html' } }), ENV, upstream.impl);
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), 'https://discord.com/oauth2/authorize?x=1');
    assert.deepEqual(response.headers.getSetCookie(), ['mb_oauth=s.ng.n; Path=/account']);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('server'), null);
    const call = upstream.calls.at(-1);
    assert.equal(call.input, 'https://tomoko.galbands.com/_mistbound/account/login?to=ng');
    assert.equal(call.init.redirect, 'manual');
    assert.equal(call.init.headers.get('x-mb-proxy'), ENV.PROXY_SECRET);
    assert.equal(call.init.headers.get('x-mb-client-ip'), '198.51.100.7');
    assert.equal(call.init.headers.get('x-mb-host'), host);
    assert.equal(call.init.headers.get('cookie'), 'mb_session=abc; mb_oauth=s.ng.n');
  }
  const body = JSON.stringify({ data: '{}', meta: {} });
  await handle(new Request('https://mistbound.galbands.com/account/saves/sfw/auto', { method: 'PUT', body, headers: { 'content-type': 'application/json', origin: 'https://mistbound.galbands.com' } }), ENV, upstream.impl);
  const put = upstream.calls.at(-1);
  assert.equal(put.init.method, 'PUT');
  assert.equal(new TextDecoder().decode(put.init.body), body);
  assert.equal(put.init.headers.get('origin'), 'https://mistbound.galbands.com');
});

test('when the VPS is down, login quietly returns home and the API says unavailable', async () => {
  const down = recorder(() => { throw new TypeError('fetch failed'); });
  const login = await handle(new Request('https://mistbound.galbands.com/account/login'), ENV, down.impl);
  assert.equal(login.status, 302);
  assert.equal(login.headers.get('location'), 'https://mistbound.galbands.com/');
  const broken = recorder(() => new Response('bad gateway', { status: 502 }));
  const callback = await handle(new Request('https://mistbound.galbands.com/account/callback?code=1&state=2'), ENV, broken.impl);
  assert.equal(callback.headers.get('location'), 'https://mistbound.galbands.com/');
  assert.equal((await handle(new Request('https://mistbound.galbands.com/account/me'), ENV, down.impl)).status, 503);
  assert.equal((await handle(new Request('https://mistbound.galbands.com/account/me'), { ...ENV, PROXY_SECRET: '' }, down.impl)).status, 503);
});

test('anything that is not /account/* on our two hosts is not served, and there is no ng gate', async () => {
  const origin = recorder();
  for (const url of ['https://mistbound-gate.example.workers.dev/account/me', 'https://mistbound.galbands.com/', 'https://ng.mistbound.galbands.com/', 'https://ng.mistbound.galbands.com/app.mjs', 'https://mistbound.galbands.com/accounts']) {
    assert.equal((await handle(new Request(url), ENV, origin.impl)).status, 404, url);
  }
  assert.equal(origin.calls.length, 0);
});

test('set-discord.py writes the three Discord values from stdin and refuses malformed ones', () => {
  const dir = mkdtempSync(join(tmpdir(), 'mb-discord-')), file = join(dir, 'account.env');
  const script = fileURLToPath(new URL('../account/vps/set-discord.py', import.meta.url));
  writeFileSync(file, 'SESSION_SECRET=keep-me\nDISCORD_CLIENT_ID=\nDISCORD_CLIENT_SECRET=\n');
  const run = input => spawnSync('python3', ['-I', script], { input, env: { ...process.env, MB_ACCOUNT_ENV: file }, encoding: 'utf8' });
  try {
    const ok = run('1400000000000000000\nAbcdefGhijkl_mnop-1234567890\n1150000000000000001\n');
    assert.equal(ok.status, 0, ok.stderr);
    assert.doesNotMatch(ok.stdout + ok.stderr, /Abcdef/, 'the secret is never printed');
    assert.equal(readFileSync(file, 'utf8'), 'SESSION_SECRET=keep-me\nDISCORD_CLIENT_ID=1400000000000000000\nDISCORD_CLIENT_SECRET=AbcdefGhijkl_mnop-1234567890\nDISCORD_ROLE_ID=1150000000000000001\n');
    assert.equal(statSync(file).mode & 0o777, 0o600);
    for (const bad of ['abc\nAbcdefGhijkl_mnop-1234567890\n1150000000000000001\n', '1400000000000000000\nshort\n1150000000000000001\n', '1400000000000000000\nAbcdefGhijkl_mnop-1234567890\n1134557553011998840x\n']) {
      const refused = run(bad);
      assert.notEqual(refused.status, 0);
    }
    assert.match(readFileSync(file, 'utf8'), /DISCORD_CLIENT_ID=1400000000000000000/, 'a refused input leaves the file alone');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

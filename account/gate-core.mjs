/**
 * The mistbound-gate Worker, kept free of Worker-only globals so tests can run it in Node.
 *
 * It does one thing: relay /account/* (Discord login, cloud saves) to the account service on the VPS,
 * with the proxy secret, the client address and only the two account cookies. mistbound-bridge (the
 * Custom Domain Worker of mistbound.galbands.com) hands it those paths through its GATE service binding.
 * ng.mistbound.galbands.com is accepted too, so the ng site can route its own /account/* here the same way.
 * The NG entrance Worker checks the shared session before forwarding.
 */
const FORWARDED_COOKIES = new Set(['mb_session', 'mb_oauth']);
const FORWARDED_HEADERS = ['accept', 'content-type', 'origin', 'user-agent', 'x-mb-expected-account'];

function keepCookies(header) {
  return String(header || '').split(';').map(part => part.trim())
    .filter(part => FORWARDED_COOKIES.has(part.slice(0, Math.max(0, part.indexOf('='))))).join('; ');
}
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

export async function handle(request, env, fetchImpl) {
  const url = new URL(request.url);
  const hosts = new Set([new URL(env.PUBLIC_ORIGIN).hostname, env.NG_HOST || 'ng.mistbound.galbands.com']);
  if (!hosts.has(url.hostname) || !(url.pathname === '/account' || url.pathname.startsWith('/account/'))) return new Response('Not found', { status: 404 });
  const home = `${env.PUBLIC_ORIGIN}/`;
  // Login and its callback are page loads: any failure quietly lands on the home page, never on an error.
  const navigation = url.pathname === '/account/login' || url.pathname === '/account/callback';
  if (!env.ORIGIN_BASE || !env.PROXY_SECRET) return navigation ? Response.redirect(home, 302) : json(503, { error: 'unavailable' });
  const headers = new Headers({ 'x-mb-proxy': env.PROXY_SECRET, 'x-mb-client-ip': request.headers.get('cf-connecting-ip') || '', 'x-mb-host': url.hostname });
  for (const name of FORWARDED_HEADERS) { const value = request.headers.get(name); if (value) headers.set(name, value); }
  const cookie = keepCookies(request.headers.get('cookie'));
  if (cookie) headers.set('cookie', cookie);
  const init = { method: request.method, headers, redirect: 'manual' };
  if (request.method !== 'GET' && request.method !== 'HEAD') init.body = await request.arrayBuffer();
  let upstream;
  try { upstream = await fetchImpl(`${env.ORIGIN_BASE}${url.pathname}${url.search}`, init); }
  catch { return navigation ? Response.redirect(home, 302) : json(503, { error: 'unavailable' }); }
  if (upstream.status >= 500 && navigation) return Response.redirect(home, 302);
  const response = new Response(upstream.body, upstream);
  response.headers.set('cache-control', 'no-store');
  response.headers.delete('server');
  return response;
}

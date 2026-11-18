// NG requests always cross this Worker, including static assets and saves.
const ACCOUNT_PATH = /^\/account(?:\/|$)/;
const ASSET_HEADERS = ['accept', 'accept-language', 'range', 'if-range'];
const RESPONSE_HEADERS = ['content-type', 'content-range', 'accept-ranges', 'content-disposition', 'content-security-policy', 'x-content-type-options'];
const REDIRECTS = new Set([301, 302, 303, 307, 308]);
const encoder = new TextEncoder();

function decode64(part) {
  return Uint8Array.from(atob(part.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
}

export async function hasSession(cookie, secret, now = Math.floor(Date.now() / 1000)) {
  if (!secret || secret.length < 32) return false;
  const token = (cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith('mb_session='))?.slice(11);
  if (!token || token.length > 2048 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{43}$/.test(token)) return false;
  const [body, signature] = token.split('.');
  try {
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    if (!await crypto.subtle.verify('HMAC', key, decode64(signature), encoder.encode(body))) return false;
    const session = JSON.parse(new TextDecoder().decode(decode64(body)));
    return session?.v === 1 && typeof session.sub === 'string' && /^\d{5,25}$/.test(session.sub)
      && Number.isSafeInteger(session.exp) && session.exp > now;
  } catch {
    return false;
  }
}

const privateHeaders = () => new Headers({
  'cache-control': 'private, no-store',
  'referrer-policy': 'no-referrer',
  'x-robots-tag': 'noindex, nofollow',
});

function statusPage(request, code, message) {
  const headers = privateHeaders();
  headers.set('content-type', 'text/html; charset=utf-8');
  return new Response(request.method === 'HEAD' ? null : `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>${message}</title><p>${message}</p></html>`, { status: code, headers });
}

export async function handleNg(request, env, fetchAsset = fetch) {
  const url = new URL(request.url);
  if (url.hostname !== env.NG_HOST) return new Response(null, { status: 404 });
  const account = ACCOUNT_PATH.test(url.pathname);
  if (!await hasSession(request.headers.get('cookie'), env.SESSION_SECRET)) {
    if (account) {
      const headers = privateHeaders();
      headers.set('content-type', 'application/json; charset=utf-8');
      return new Response(request.method === 'HEAD' ? null : '{"error":"login-required"}', { status: 401, headers });
    }
    return statusPage(request, 403, '不拥有权限');
  }
  try {
    if (account) {
      // The relay also checks account ownership for saves. Keep the original Origin.
      return await env.GATE.fetch(request);
    }
    if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405, headers: privateHeaders() });
    if (!env.NG_ORIGIN_SECRET || env.NG_ORIGIN_SECRET.length < 32) return statusPage(request, 503, '暂时无法访问');
    const origin = new URL(env.NG_PAGES_ORIGIN);
    origin.pathname = url.pathname;
    origin.search = url.search;
    const headers = new Headers({ 'X-MB-NG-Origin': env.NG_ORIGIN_SECRET });
    for (const name of ASSET_HEADERS) if (request.headers.has(name)) headers.set(name, request.headers.get(name));
    const upstream = await fetchAsset(origin, { method: request.method, headers, redirect: 'manual' });
    if (REDIRECTS.has(upstream.status)) {
      const location = upstream.headers.get('location');
      if (!location) return statusPage(request, 503, '暂时无法访问');
      const target = new URL(location, origin);
      if (target.origin !== origin.origin) return statusPage(request, 503, '暂时无法访问');
      const rewritten = new URL(url);
      rewritten.pathname = target.pathname;
      rewritten.search = target.search;
      rewritten.hash = target.hash;
      const responseHeaders = privateHeaders();
      responseHeaders.set('location', rewritten.href);
      return new Response(null, { status: upstream.status, headers: responseHeaders });
    }
    if (upstream.status === 401 || upstream.status === 403 || upstream.status >= 500) return statusPage(request, 503, '暂时无法访问');
    const responseHeaders = privateHeaders();
    for (const name of RESPONSE_HEADERS) if (upstream.headers.has(name)) responseHeaders.set(name, upstream.headers.get(name));
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch {
    return statusPage(request, 503, '暂时无法访问');
  }
}

export default { fetch: (request, env) => handleNg(request, env) };

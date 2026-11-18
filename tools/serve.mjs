#!/usr/bin/env node
/**
 * A small local static server; no dependency installation is needed.
 * `--account http://127.0.0.1:18531` also relays /account/* (Discord login, cloud saves) to a local
 * account service, e.g. tools/account-dev.mjs, the way the gate Worker does on the real site.
 */
import { createServer, request as httpRequest } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const portIndex = process.argv.indexOf('--port');
const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : 4173);
const hostIndex = process.argv.indexOf('--host');
const host = hostIndex >= 0 ? process.argv[hostIndex + 1] : '127.0.0.1';
if (!Number.isInteger(port) || port < 1 || port > 65535 || !host) {
  process.stderr.write('用法：node tools/serve.mjs [--port 4173] [--host 127.0.0.1]\n');
  process.exit(1);
}
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.wasm': 'application/wasm', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};
const accountIndex = process.argv.indexOf('--account');
const account = accountIndex >= 0 ? new URL(process.argv[accountIndex + 1]) : null;
function relayAccount(request, response) {
  const headers = { ...request.headers, host: account.host, 'x-mb-client-ip': request.socket.remoteAddress || '' };
  const upstream = httpRequest({ hostname: account.hostname, port: account.port, path: request.url, method: request.method, headers }, reply => {
    response.writeHead(reply.statusCode || 502, reply.headers);
    reply.pipe(response);
  });
  upstream.on('error', () => { if (!response.headersSent) response.writeHead(503, { 'Content-Type': 'application/json' }); response.end('{"error":"unavailable"}'); });
  request.pipe(upstream);
}
const server = createServer(async (request, response) => {
  if (account && /^\/account(\/|\?|$)/.test(request.url || '')) { relayAccount(request, response); return; }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = resolve(root, `.${path}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403); response.end('Forbidden'); return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    response.writeHead(error instanceof URIError ? 400 : 404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(error instanceof URIError ? 'Bad URL' : 'Not found');
  }
});
server.on('error', error => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
server.listen(port, host, () => process.stdout.write(`Mistbound Chronicle: http://${host}:${port}\n`));

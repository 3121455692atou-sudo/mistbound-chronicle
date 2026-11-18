#!/usr/bin/env node
// Local nginx authorization only; use the existing NG session contract.
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hasSession } from './ng-worker.mjs';

export function createSessionServer(secret) {
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET is required');
  const server = createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'private, no-store');
    response.setHeader('Content-Length', '0');
    if (request.url !== '/session' || !['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(404).end(); return;
    }
    try {
      response.writeHead(await hasSession(request.headers.cookie, secret) ? 204 : 401).end();
    } catch {
      response.writeHead(503).end();
    }
  });
  server.headersTimeout = 10000;
  server.requestTimeout = 10000;
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createSessionServer(process.env.SESSION_SECRET);
  server.listen(Number(process.env.MB_SESSION_PORT || 18532), '127.0.0.1');
  const stop = () => server.close(() => process.exit(0));
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
}

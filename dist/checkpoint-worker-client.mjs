/** Explicit opt-in client. Never imports the engine or reads live game/save state. */
import {WORKER_PROTOCOL, validName, validateRequest, validateResponse} from './checkpoint-worker-protocol.mjs?v=1118-1603';

function failure(message, phase, request, dispatched = false) {
  return Object.assign(new Error(message), {phase, operation: request?.op, requestId: request?.id,
    committed: request?.op === 'save' && dispatched ? null : false, verified: false});
}

/** Transport seam for deterministic tests. Normal callers use openWorkerRegionCheckpoints. */
export function connectCheckpointWorker({worker, name, session, signal, requestTimeoutMs = 120000}) {
  let nextId = 0, pending, closed = false, ready = false;
  const listeners = [];
  const listen = (event, fn) => { worker.addEventListener(event, fn); listeners.push([event, fn]); };
  function cleanup(job) { clearTimeout(job.timer); job.signal?.removeEventListener('abort', job.abort); }
  function stop(phase = 'closed', message = 'Checkpoint worker connection closed. A dispatched save may have committed.') {
    if (closed) return;
    closed = true; ready = false;
    for (const [type, listener] of listeners) worker.removeEventListener(type, listener);
    try { worker.terminate(); } catch { /* termination failure cannot prove rollback */ }
    if (pending) {
      const job = pending; pending = undefined; cleanup(job);
      job.reject(failure(message, phase, job.request, job.dispatched));
    }
  }
  listen('error', () => stop('worker-error', 'Checkpoint worker failed. A dispatched save has unknown commit status.'));
  listen('messageerror', () => stop('messageerror', 'Checkpoint worker response could not be decoded. A dispatched save has unknown commit status.'));
  listen('message', event => {
    const job = pending, response = event.data;
    // A stale/foreign response cannot settle a newer request or connection.
    if (closed || !job || response?.session !== session || response?.id !== job.request.id) return;
    let result;
    try { result = validateResponse(response, job.request); }
    catch { stop('protocol', 'Invalid checkpoint worker response. A dispatched save has unknown commit status.'); return; }
    pending = undefined; cleanup(job);
    if (response.ok) { if (job.request.op === 'open') ready = true; job.resolve(result); }
    else {
      job.reject(Object.assign(new Error(result.message), result, {operation: job.request.op, requestId: job.request.id}));
      if (job.request.op === 'open') stop();
    }
  });
  function request(op, payload, requestSignal) {
    const request = {protocol: WORKER_PROTOCOL, session, id: ++nextId, op, payload};
    if (closed) return Promise.reject(failure('Checkpoint worker connection is closed.', 'closed', request));
    if (pending) return Promise.reject(failure('Only one checkpoint request may be active; no snapshot is queued.', 'busy', request));
    if (op !== 'open' && !ready) return Promise.reject(failure('Checkpoint worker is not ready.', 'open', request));
    try {
      validateRequest(request);
      if (!Number.isInteger(requestTimeoutMs) || requestTimeoutMs < 1 || requestTimeoutMs > 300000) throw Error('Request timeout must be1..300000ms.');
    } catch (error) { return Promise.reject(failure(error.message, 'input', request)); }
    if (requestSignal?.aborted) return Promise.reject(failure('Checkpoint request was canceled before dispatch.', 'cancelled', request));
    return new Promise((resolve, reject) => {
      const job = {request, resolve, reject, signal: requestSignal, dispatched: false};
      job.abort = () => stop('cancelled', 'Checkpoint connection canceled. A dispatched save has unknown commit status.');
      pending = job;
      job.timer = setTimeout(() => stop('timeout', 'Checkpoint worker timed out. A dispatched save has unknown commit status; no retry was made.'), requestTimeoutMs);
      requestSignal?.addEventListener('abort', job.abort, {once: true});
      // Conservative even if postMessage throws: never infer absence of commit from transport failure.
      job.dispatched = true;
      try { worker.postMessage(request); }
      catch { stop('transport', 'Cannot dispatch checkpoint request. Commit status of a save is unknown.'); }
    });
  }
  const read = (checkpoint, {signal} = {}) => request('read', {checkpoint}, signal);
  const api = Object.freeze({name,
    save: (text, {signal} = {}) => request('save', {text}, signal),
    list: ({limit = 100, after, signal} = {}) => request('list', after === undefined ? {limit} : {limit, after}, signal),
    read,
    exportText: (checkpoint, options) => read(checkpoint, options).then(result => result.text),
    close: () => stop(),
  });
  return request('open', {name}, signal).then(() => api, error => { stop(); throw error; });
}

/** One dedicated same-origin module Worker per explicit connection, no automatic retry. */
export function openWorkerRegionCheckpoints({name, signal, requestTimeoutMs = 120000} = {}) {
  if (!validName(name)) return Promise.reject(failure('A dedicated checkpoint database name is required.', 'input'));
  if (signal?.aborted) return Promise.reject(failure('Checkpoint open was canceled before dispatch.', 'cancelled'));
  if (typeof globalThis.Worker !== 'function' || !globalThis.crypto?.randomUUID) return Promise.reject(failure('Module Worker / secure random capability is unavailable.', 'capability'));
  let worker;
  try { worker = new Worker(new URL(`./checkpoint-worker.mjs?protocol=${WORKER_PROTOCOL}`, import.meta.url), {type: 'module', name: 'mistbound-explicit-checkpoints'}); }
  catch { return Promise.reject(failure('Cannot create checkpoint module Worker.', 'open')); }
  return connectCheckpointWorker({worker, name, session: crypto.randomUUID().replaceAll('-', ''), signal, requestTimeoutMs});
}

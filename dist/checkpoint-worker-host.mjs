/** Worker-side dispatch. The adapter argument is a deterministic test seam, not a fallback. */
import {WORKER_PROTOCOL, validIdentity, validateRequest, validateResult, wireError} from './checkpoint-worker-protocol.mjs?v=1118-1603';

export function createCheckpointWorkerHost({open, post, fatal}) {
  let session, lastId = 0, db, busy = false, closed = false;
  function close() {
    if (closed) return;
    closed = true;
    db?.close();
  }
  function respond(request, body) {
    if (closed) return;
    try { post({protocol: WORKER_PROTOCOL, session: request.session, id: request.id, op: request.op, ...body}); }
    catch (error) { close(); fatal(error); }
  }
  async function handle(request) {
    if (closed || !validIdentity(request)) return;
    // Each dedicated Worker accepts one connection identity for its entire life.
    if (session !== undefined && request.session !== session) return;
    if (request.id <= lastId) return; // duplicate/late requests never write twice
    if (session === undefined) session = request.session;
    lastId = request.id;
    let ownsBusy = false;
    try {
      validateRequest(request);
      if (busy) throw Object.assign(Error('Only one checkpoint request may be active.'), {phase: 'busy', committed: false});
      if (request.op === 'open' ? db !== undefined : db === undefined) throw Object.assign(Error('Checkpoint connection is not ready or was already opened.'), {phase: 'open', committed: false});
      busy = ownsBusy = true;
      let result;
      switch (request.op) {
        case 'open': {
          const opened = await open(request.payload);
          if (closed) { opened.close(); return; }
          db = opened; result = {name: db.name}; break;
        }
        case 'save': {
          const saved = await db.save(request.payload.text);
          result = {checkpoint: saved.checkpoint, stateSha256: saved.stateSha256, verified: saved.verified, committed: saved.committed,
            dependencyCount: saved.dependencies.length, dependencyBytes: saved.dependencyBytes}; break;
        }
        case 'list': {
          const rows = await db.list(request.payload);
          result = rows.map(row => ({checkpoint: row.checkpoint, stateSha256: row.stateSha256, verified: false})); break;
        }
        case 'read': {
          const read = await db.read(request.payload.checkpoint);
          // Full codec validation has completed. Send text OR state, never both.
          result = {checkpoint: read.checkpoint, stateSha256: read.stateSha256, verified: read.verified,
            text: read.text, stateChars: read.text.length, dependencyCount: read.dependencies.length, dependencyBytes: read.dependencyBytes,
            // Derive only from the codec's verified state, never raw list/caller metadata.
            summary: {turn: read.state.turn, revision: read.state.revision, seed: read.state.seed, historyLength: read.state.history.length}}; break;
        }
      }
      validateResult(request.op, result, request.payload);
      respond(request, {ok: true, result});
    } catch (error) { respond(request, {ok: false, error: wireError(error, request.op)}); }
    finally { if (ownsBusy) busy = false; }
  }
  return Object.freeze({handle, close});
}

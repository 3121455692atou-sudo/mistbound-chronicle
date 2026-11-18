/** Narrow, bounded messages only. This is not a second checkpoint format. */
// v2 adds bounded verified display metadata to read replies. No v1 downgrade.
export const WORKER_PROTOCOL = 2;
export const MAX_TEXT_CHARS = 20000000;
export const MAX_DEPENDENCIES = 32004;
export const MAX_DEPENDENCY_BYTES = 96 * 1024 * 1024;
const HASH = /^[a-f0-9]{64}$/;
const SESSION = /^[a-f0-9]{32}$/;
const NAME = /^mistbound-checkpoints-[a-zA-Z0-9_-]{1,100}$/;
const OPS = new Set(['open', 'save', 'list', 'read']);
const requireThat = (condition, message) => { if (!condition) throw Error(message); };
export function shape(value, keys, optional = []) {
  requireThat(value !== null && typeof value === 'object' && !Array.isArray(value), 'Invalid message object.');
  const actual = Object.keys(value);
  requireThat(actual.length >= keys.length && actual.length <= keys.length + optional.length &&
    keys.every(key => Object.hasOwn(value, key)) && actual.every(key => keys.includes(key) || optional.includes(key)), 'Unexpected message fields.');
}
export function validName(name) { return typeof name === 'string' && NAME.test(name); }
export function validHash(hash) { return typeof hash === 'string' && HASH.test(hash); }
export function validText(text) { return typeof text === 'string' && text.length > 0 && text.length <= MAX_TEXT_CHARS; }
export function validateCheckpointSummary(summary) {
  shape(summary, ['turn', 'revision', 'seed', 'historyLength']);
  requireThat(Number.isSafeInteger(summary.turn) && summary.turn >= 1 &&
    Number.isSafeInteger(summary.revision) && summary.revision >= 0 &&
    typeof summary.seed === 'string' && summary.seed.length <= 128 &&
    Number.isInteger(summary.historyLength) && summary.historyLength >= 0 && summary.historyLength <= 3,
  'Invalid verified checkpoint summary.');
  return summary;
}
export function validIdentity(message) {
  return message !== null && typeof message === 'object' && message.protocol === WORKER_PROTOCOL &&
    typeof message.session === 'string' && SESSION.test(message.session) &&
    Number.isSafeInteger(message.id) && message.id > 0 && OPS.has(message.op);
}
export function validateRequest(message) {
  shape(message, ['protocol', 'session', 'id', 'op', 'payload']);
  requireThat(validIdentity(message), 'Invalid checkpoint request identity.');
  const p = message.payload;
  switch (message.op) {
    case 'open': shape(p, ['name']); requireThat(validName(p.name), 'A dedicated checkpoint database name is required.'); break;
    case 'save':
      shape(p, ['text']); requireThat(validText(p.text), 'Save must be bounded full JSON text.');
      // <=20M UTF16 code units implies <=60M UTF8 bytes, below codec's64MiB bound.
      // Do not allocate/scan a second giant UTF8 buffer on the UI thread.
      break;
    case 'list':
      shape(p, ['limit'], ['after']);
      requireThat(Number.isInteger(p.limit) && p.limit >= 1 && p.limit <= 1000, 'List limit must be1..1000.');
      requireThat(!Object.hasOwn(p, 'after') || validHash(p.after), 'Invalid list cursor.'); break;
    case 'read': shape(p, ['checkpoint']); requireThat(validHash(p.checkpoint), 'Invalid checkpoint digest.'); break;
  }
  return message;
}
function metadata(result) {
  requireThat(validHash(result.checkpoint) && validHash(result.stateSha256) && result.verified === true, 'Invalid verified checkpoint metadata.');
  requireThat(Number.isInteger(result.dependencyCount) && result.dependencyCount > 0 && result.dependencyCount <= MAX_DEPENDENCIES, 'Invalid dependency count.');
  requireThat(Number.isInteger(result.dependencyBytes) && result.dependencyBytes > 0 && result.dependencyBytes <= MAX_DEPENDENCY_BYTES, 'Invalid dependency bytes.');
}
export function validateResult(op, result, payload) {
  switch (op) {
    case 'open': shape(result, ['name']); requireThat(result.name === payload.name && validName(result.name), 'Wrong checkpoint database.'); break;
    case 'save':
      shape(result, ['checkpoint', 'stateSha256', 'verified', 'committed', 'dependencyCount', 'dependencyBytes']);
      metadata(result); requireThat(result.committed === true, 'Save is not committed and verified.'); break;
    case 'read':
      shape(result, ['checkpoint', 'stateSha256', 'verified', 'text', 'stateChars', 'dependencyCount', 'dependencyBytes', 'summary']);
      metadata(result); validateCheckpointSummary(result.summary);
      requireThat(result.checkpoint === payload.checkpoint && validText(result.text) && result.stateChars === result.text.length, 'Invalid verified text response.'); break;
    case 'list':
      requireThat(Array.isArray(result) && result.length <= payload.limit, 'Invalid listing length.');
      { let previous = payload.after;
        for (const row of result) {
          shape(row, ['checkpoint', 'stateSha256', 'verified']);
          requireThat(validHash(row.checkpoint) && validHash(row.stateSha256) && row.verified === false &&
            (previous === undefined || row.checkpoint > previous), 'Invalid unverified listing metadata.');
          previous = row.checkpoint;
        }
      } break;
  }
  return result;
}
export function validateResponse(message, request) {
  shape(message, ['protocol', 'session', 'id', 'op', 'ok', message.ok === true ? 'result' : 'error']);
  requireThat(validIdentity(message) && message.session === request.session && message.id === request.id && message.op === request.op && typeof message.ok === 'boolean', 'Invalid response identity.');
  if (message.ok) return validateResult(message.op, message.result, request.payload);
  const e = message.error;
  shape(e, ['message', 'phase', 'committed', 'verified'], ['checkpoint', 'stateSha256']);
  requireThat(typeof e.message === 'string' && e.message.length <= 512 && typeof e.phase === 'string' && e.phase.length <= 32 &&
    [true, false, null].includes(e.committed) && e.verified === false &&
    (!Object.hasOwn(e, 'checkpoint') || validHash(e.checkpoint)) && (!Object.hasOwn(e, 'stateSha256') || validHash(e.stateSha256)), 'Invalid checkpoint error.');
  return e;
}
export function wireError(error, op) {
  const e = {
    message: typeof error?.message === 'string' ? error.message.slice(0, 512) : 'Checkpoint worker failed.',
    phase: typeof error?.phase === 'string' ? error.phase.slice(0, 32) : 'worker',
    // An unclassified save failure might follow commit. Never invent rollback.
    committed: op === 'save' ? (typeof error?.committed === 'boolean' ? error.committed : null) : false,
    verified: false,
  };
  for (const key of ['checkpoint', 'stateSha256']) if (validHash(error?.[key])) e[key] = error[key];
  return e;
}

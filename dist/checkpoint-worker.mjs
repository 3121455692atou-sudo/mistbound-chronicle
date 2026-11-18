/** Dedicated module Worker. No UI, network, localStorage, migration or new database fallback. */
import {openBrowserRegionCheckpoints} from './browser-region-checkpoints.mjs?v=1118-1603';
import {createCheckpointWorkerHost} from './checkpoint-worker-host.mjs?v=1118-1603';

const host = createCheckpointWorkerHost({
  open: openBrowserRegionCheckpoints,
  post: message => self.postMessage(message),
  fatal: error => { setTimeout(() => { throw error; }, 0); },
});
self.addEventListener('message', event => { void host.handle(event.data); });
self.addEventListener('messageerror', () => {
  host.close();
  // Deliberately surface a native Worker error so the client settles every request.
  setTimeout(() => { throw Error('Checkpoint worker could not deserialize its request.'); }, 0);
});

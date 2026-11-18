// Entry for the mistbound-gate Worker (see gate-core.mjs for what it does and wrangler.toml for its routes).
import { handle } from './gate-core.mjs';

export default {
  fetch: (request, env) => handle(request, env, fetch),
};

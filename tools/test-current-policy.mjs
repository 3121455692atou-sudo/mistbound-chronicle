// Exact named historical exclusions; test bodies and old expectations remain intact.
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const exclusions = JSON.parse(readFileSync(new URL('../docs/testing/historical-policy-exclusions.json', import.meta.url), 'utf8'));
assert.equal(exclusions.length, 45);
assert.equal(new Set(exclusions.map(row => row.name)).size, 45);
const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const skip = '--test-skip-pattern=^(?:' + exclusions.map(row => escape(row.name)).join('|') + ')$';
// This file contains only the listed historical aggregate. Omit its empty file
// rather than letting Node count a filtered file-load as a passed test.
const files = readdirSync(new URL('../tests/', import.meta.url)).filter(name => name.endsWith('.test.mjs') && name !== 'battle-handover.test.mjs').sort().map(name => 'tests/' + name);
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('MISTBOUND_') && !['GAME_ROOT','BALANCE_GROWTH_REPORT'].includes(key)));
const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', skip, ...files, 'tools/cli.test.mjs'], {cwd: root, env, stdio: 'inherit'});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;

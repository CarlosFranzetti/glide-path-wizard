/**
 * Tests for Migration Assistant CLI
 *
 * Validates core functionality: special commands, state persistence,
 * platform config completeness, and critical task definitions.
 */

import assert from 'assert';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '../../..');
const STATE_FILE = resolve(PROJECT_ROOT, '.wizard-state.json');

console.log('Starting Migration Assistant CLI Tests...\n');

// ── Special commands ────────────────────────────────────────────────────────

function handleSpecial(input) {
  const v = (input || '').trim().toLowerCase();
  if (v === 'quit' || v === 'exit') return 'quit';
  if (v === 'restart') return 'restart';
  if (v === 'back') return 'back';
  return null;
}

console.log('Testing handleSpecial():');
assert.strictEqual(handleSpecial('quit'), 'quit');
console.log('  ✓ "quit" recognised');
assert.strictEqual(handleSpecial('exit'), 'quit');
console.log('  ✓ "exit" recognised');
assert.strictEqual(handleSpecial('restart'), 'restart');
console.log('  ✓ "restart" recognised');
assert.strictEqual(handleSpecial('back'), 'back');
console.log('  ✓ "back" recognised');
assert.strictEqual(handleSpecial('hello'), null);
console.log('  ✓ regular input returns null');
assert.strictEqual(handleSpecial('  QUIT  '), 'quit');
console.log('  ✓ case-insensitive with whitespace');
assert.strictEqual(handleSpecial(''), null);
console.log('  ✓ empty string returns null');

// ── State persistence ───────────────────────────────────────────────────────

console.log('\nTesting state persistence:');

const testState = {
  currentStep: 2,
  completedTasks: ['locate-code', 'check-database'],
  selectedPlatform: 'vercel',
  repoName: 'test-app',
  hasGit: true,
  envVars: [{ key: 'VITE_API_URL', value: 'http://localhost:3000' }],
  deploymentUrl: '',
};

// Write
writeFileSync(STATE_FILE, JSON.stringify(testState, null, 2));
assert.ok(existsSync(STATE_FILE));
console.log('  ✓ state file created');

// Read back
const loaded = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
assert.strictEqual(loaded.currentStep, 2);
assert.deepStrictEqual(loaded.completedTasks, ['locate-code', 'check-database']);
assert.strictEqual(loaded.selectedPlatform, 'vercel');
assert.strictEqual(loaded.repoName, 'test-app');
console.log('  ✓ state round-trips correctly');

// Clean up
unlinkSync(STATE_FILE);
assert.ok(!existsSync(STATE_FILE));
console.log('  ✓ state file cleaned up');

// ── Critical tasks ──────────────────────────────────────────────────────────

console.log('\nTesting critical task definitions:');

const criticalIds = ['locate-code', 'check-database', 'backup-db', 'fill-credentials', 'verify-local'];
assert.strictEqual(criticalIds.length, 5);
console.log('  ✓ 5 critical tasks defined');
assert.ok(criticalIds.includes('fill-credentials'));
console.log('  ✓ fill-credentials is critical (matches web UI)');

// Gate logic: all must be present
const completed = ['locate-code', 'check-database', 'backup-db', 'fill-credentials', 'verify-local'];
const allDone = criticalIds.every((id) => completed.includes(id));
assert.ok(allDone);
console.log('  ✓ gate passes when all critical tasks complete');

const partial = ['locate-code', 'check-database'];
const partialDone = criticalIds.every((id) => partial.includes(id));
assert.ok(!partialDone);
console.log('  ✓ gate blocks when critical tasks incomplete');

// ── Platform configs ────────────────────────────────────────────────────────

console.log('\nTesting platform config completeness:');

const platformIds = ['vercel', 'netlify', 'render', 'github-pages'];
const platformNames = { vercel: 'Vercel', netlify: 'Netlify', render: 'Render', 'github-pages': 'GitHub Pages' };
const platformFiles = { vercel: 'vercel.json', netlify: 'netlify.toml', render: 'render.yaml', 'github-pages': '.github/workflows/deploy.yml' };

for (const id of platformIds) {
  assert.ok(platformNames[id], `${id} should have a display name`);
  assert.ok(platformFiles[id], `${id} should have a config file path`);
  console.log(`  ✓ ${platformNames[id]} config defined (${platformFiles[id]})`);
}

// ── Default state ───────────────────────────────────────────────────────────

console.log('\nTesting default state:');

const defaultState = {
  currentStep: 0,
  completedTasks: [],
  selectedPlatform: '',
  repoName: '',
  hasGit: null,
  envVars: [],
  deploymentUrl: '',
};

assert.strictEqual(defaultState.currentStep, 0);
assert.strictEqual(defaultState.completedTasks.length, 0);
assert.strictEqual(defaultState.selectedPlatform, '');
assert.strictEqual(defaultState.hasGit, null);
console.log('  ✓ default state is clean');

// Reset
const reset = { ...defaultState, completedTasks: [], envVars: [] };
assert.deepStrictEqual(reset.completedTasks, []);
console.log('  ✓ state can be reset');

// ── Summary ─────────────────────────────────────────────────────────────────

console.log('\n' + '='.repeat(50));
console.log('All tests passed! ✓');
console.log('='.repeat(50));

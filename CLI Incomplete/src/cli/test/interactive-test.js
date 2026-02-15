#!/usr/bin/env node

/**
 * Interactive smoke test for the Migration Assistant CLI.
 * Spawns the wizard and feeds scripted inputs to verify end-to-end flow.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting Migration Assistant CLI interactive test...\n');

const wizardPath = join(__dirname, '..', 'wizard.js');

const wizard = spawn('node', [wizardPath, '--reset'], {
  stdio: ['pipe', 'pipe', 'pipe'],
});

// Scripted inputs for a full run-through:
// Step 1 (Pre-Migration): answer y/n for each task, then continue
// Step 2 (GitHub): git status, repo name, visibility, confirm
// Step 3 (Platform): select Vercel
// Step 4 (Deployment): skip adding vars, confirm deployed, enter URL, verify checks
const inputs = [
  // Resume prompt won't appear due to --reset
  // Step 1: Pre-Migration — critical tasks (5), recommended (3), optional (2), then gate
  'y', 'y', 'y', 'y', 'y',         // 5 critical tasks
  'n', 'n', 'n',                     // 3 recommended tasks (skip)
  'n', 'n',                           // 2 optional tasks (skip)
  // Step 2: GitHub Setup
  '2',                                // "Yes, I already have Git"
  'my-test-app',                      // repo name
  '1',                                // Private
  'y',                                // confirmed push
  // Step 3: Platform Selection
  '1',                                // Vercel (recommended)
  // Step 4: Deployment
  'n',                                // don't add env var
  'y',                                // completed deployment
  'https://my-test-app.vercel.app',   // deployment URL
  'y', 'y', 'y', 'y', 'y',          // 5 verification checks
];

let inputIndex = 0;
let outputBuffer = '';

wizard.stdout.on('data', (data) => {
  const output = data.toString();
  outputBuffer += output;
  process.stdout.write(output);

  // Feed next input when we see a prompt character
  if (inputIndex < inputs.length && (output.includes('): ') || output.includes('? '))) {
    setTimeout(() => {
      if (inputIndex < inputs.length) {
        wizard.stdin.write(inputs[inputIndex] + '\n');
        inputIndex++;
      }
    }, 150);
  }
});

wizard.stderr.on('data', (data) => {
  process.stderr.write(data);
});

wizard.on('close', (code) => {
  console.log(`\n\nWizard exited with code ${code}`);

  const checks = [
    { name: 'Welcome header', test: outputBuffer.includes('Migration Assistant') },
    { name: 'Step 1 shown', test: outputBuffer.includes('Pre-Migration') },
    { name: 'Step 2 shown', test: outputBuffer.includes('GitHub') },
    { name: 'Step 3 shown', test: outputBuffer.includes('Platform') },
    { name: 'Step 4 shown', test: outputBuffer.includes('Deploy') },
    { name: 'Vercel selected', test: outputBuffer.includes('Vercel') },
    { name: 'Summary shown', test: outputBuffer.includes('Migration Complete') },
    { name: 'Repo name in output', test: outputBuffer.includes('my-test-app') },
  ];

  console.log('\n' + '='.repeat(60));
  console.log('Interactive Test Results:');
  console.log('='.repeat(60));

  let passed = 0;
  for (const check of checks) {
    const status = check.test ? '✓ PASS' : '✗ FAIL';
    console.log(`  ${status}: ${check.name}`);
    if (check.test) passed++;
  }

  console.log('='.repeat(60));
  console.log(`${passed}/${checks.length} checks passed`);
  console.log('='.repeat(60));

  process.exit(passed === checks.length ? 0 : 1);
});

wizard.on('error', (error) => {
  console.error(`Failed to start wizard: ${error}`);
  process.exit(1);
});

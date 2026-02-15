#!/usr/bin/env node

/**
 * Demo / overview of the Migration Assistant CLI
 */

console.log('='.repeat(70));
console.log('MIGRATION ASSISTANT — CLI COMPANION');
console.log('='.repeat(70));

console.log('\nA command-line wizard that mirrors the web UI\'s 4-step workflow.\n');

console.log('Usage:');
console.log('  npm run wizard                  Display-only mode (default)');
console.log('  npm run wizard -- --execute     Execute commands with confirmation');
console.log('  npm run wizard -- --reset       Clear saved progress and start fresh');

console.log('\nWorkflow (same as web UI):');
console.log('  Step 1: Pre-Migration     — Checklist, credentials, backups');
console.log('  Step 2: GitHub Setup      — Repo creation, git init / push');
console.log('  Step 3: Platform Selection— Vercel / Netlify / Render / GitHub Pages');
console.log('  Step 4: Deployment        — Config files, env vars, verification');

console.log('\nFeatures:');
console.log('  - Session persistence — quit and resume later');
console.log('  - --execute mode — run git/npm commands with confirmation');
console.log('  - Navigation — "back", "restart", "quit" at any prompt');
console.log('  - Critical task gate — must complete all before proceeding');
console.log('  - PROJECT_CREDENTIALS.txt integration');
console.log('  - Platform-specific config file generation');
console.log('  - Post-deployment verification checklist');

console.log('\nFiles:');
console.log('  src/cli/wizard.js              Main CLI application');
console.log('  src/cli/test/wizard.test.js    Unit tests');
console.log('  src/cli/test/demo.js           This overview');
console.log('  .wizard-state.json             Session state (gitignored)');
console.log('  PROJECT_CREDENTIALS.txt        Secrets template (gitignored)');

console.log('\nTesting:');
console.log('  npm run test:cli               Run unit tests');
console.log('  npm run wizard                 Run the wizard interactively');

console.log('\n' + '='.repeat(70));
console.log('Run "npm run wizard" to start.');
console.log('='.repeat(70) + '\n');

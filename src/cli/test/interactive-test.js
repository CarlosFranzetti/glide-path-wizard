#!/usr/bin/env node

/**
 * Interactive test script for the CLI wizard
 * This simulates a complete wizard session for testing
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting CLI Wizard Interactive Test...\n');

// Path to the wizard
const wizardPath = join(__dirname, '..', 'wizard.js');

// Spawn the wizard process
const wizard = spawn('node', [wizardPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
});

// Test inputs in sequence
const inputs = [
  '',                        // Press enter to continue
  'John Doe',               // Name
  'john@example.com',       // Email
  'Test Project',           // Project name
  '1',                      // Project type (Web Application)
  '1',                      // Language (JavaScript/TypeScript)
  '1',                      // Package manager (npm)
  'yes',                    // CI/CD
  'yes',                    // Testing
  'no',                     // Docker
];

let inputIndex = 0;
let outputBuffer = '';

// Handle stdout
wizard.stdout.on('data', (data) => {
  const output = data.toString();
  outputBuffer += output;
  process.stdout.write(output);
  
  // Send next input after a short delay
  if (inputIndex < inputs.length) {
    setTimeout(() => {
      wizard.stdin.write(inputs[inputIndex] + '\n');
      inputIndex++;
    }, 100);
  }
});

// Handle stderr
wizard.stderr.on('data', (data) => {
  console.error(`Error: ${data}`);
});

// Handle process exit
wizard.on('close', (code) => {
  console.log(`\n\nWizard exited with code ${code}`);
  
  // Verify the output contains expected elements
  const checks = [
    { name: 'Welcome message', test: outputBuffer.includes('Welcome to Glide Path Wizard') },
    { name: 'User information step', test: outputBuffer.includes('Step 1: User Information') },
    { name: 'Project configuration step', test: outputBuffer.includes('Step 2: Project Configuration') },
    { name: 'Environment setup step', test: outputBuffer.includes('Step 3: Environment Setup') },
    { name: 'Additional features step', test: outputBuffer.includes('Step 4: Additional Features') },
    { name: 'Summary section', test: outputBuffer.includes('Configuration Summary') },
    { name: 'Name in summary', test: outputBuffer.includes('John Doe') },
    { name: 'Email in summary', test: outputBuffer.includes('john@example.com') },
    { name: 'Project name in summary', test: outputBuffer.includes('Test Project') },
    { name: 'Success message', test: outputBuffer.includes('Configuration complete!') },
  ];
  
  console.log('\n' + '='.repeat(60));
  console.log('Test Results:');
  console.log('='.repeat(60));
  
  let passCount = 0;
  checks.forEach(check => {
    const status = check.test ? '✓ PASS' : '✗ FAIL';
    console.log(`${status}: ${check.name}`);
    if (check.test) passCount++;
  });
  
  console.log('='.repeat(60));
  console.log(`${passCount}/${checks.length} checks passed`);
  console.log('='.repeat(60));
  
  if (passCount === checks.length) {
    console.log('\n✓ All tests passed!');
    process.exit(0);
  } else {
    console.log('\n✗ Some tests failed!');
    process.exit(1);
  }
});

// Handle errors
wizard.on('error', (error) => {
  console.error(`Failed to start wizard: ${error}`);
  process.exit(1);
});

// Start by sending the first input
setTimeout(() => {
  if (inputIndex < inputs.length) {
    wizard.stdin.write(inputs[inputIndex] + '\n');
    inputIndex++;
  }
}, 500);

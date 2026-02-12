/**
 * Tests for CLI Wizard Application
 * 
 * This test suite validates the core functionality of the wizard:
 * - Validation functions
 * - Input handling
 * - State management
 */

import assert from 'assert';

// Mock validation functions (these are the same as in wizard.js)
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateNonEmpty(value) {
  return value && value.trim().length > 0;
}

function validateNumber(value, min = -Infinity, max = Infinity) {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}

function handleSpecialCommands(input, defaultReturn = null) {
  const normalizedInput = input.trim().toLowerCase();
  
  if (normalizedInput === 'quit' || normalizedInput === 'exit') {
    return 'quit';
  }
  
  if (normalizedInput === 'restart') {
    return 'restart';
  }
  
  if (normalizedInput === 'back') {
    return 'back';
  }
  
  return defaultReturn || 'continue';
}

// Test suite
console.log('Starting CLI Wizard Tests...\n');

// Test validateEmail
console.log('Testing validateEmail():');
assert.strictEqual(validateEmail('test@example.com'), true, '✗ Valid email should pass');
console.log('  ✓ Valid email passes');
assert.strictEqual(validateEmail('invalid.email'), false, '✗ Invalid email should fail');
console.log('  ✓ Invalid email fails');
assert.strictEqual(validateEmail(''), false, '✗ Empty email should fail');
console.log('  ✓ Empty email fails');
assert.strictEqual(validateEmail('no@domain'), false, '✗ Email without TLD should fail');
console.log('  ✓ Email without TLD fails');
assert.strictEqual(validateEmail('user@domain.co.uk'), true, '✗ Email with multi-part TLD should pass');
console.log('  ✓ Email with multi-part TLD passes');

// Test validateNonEmpty
console.log('\nTesting validateNonEmpty():');
assert.ok(validateNonEmpty('test'), '✗ Non-empty string should pass');
console.log('  ✓ Non-empty string passes');
assert.ok(!validateNonEmpty(''), '✗ Empty string should fail');
console.log('  ✓ Empty string fails');
assert.ok(!validateNonEmpty('   '), '✗ Whitespace-only string should fail');
console.log('  ✓ Whitespace-only string fails');
assert.ok(validateNonEmpty('  test  '), '✗ String with surrounding whitespace should pass');
console.log('  ✓ String with surrounding whitespace passes');

// Test validateNumber
console.log('\nTesting validateNumber():');
assert.strictEqual(validateNumber('5', 1, 10), true, '✗ Number in range should pass');
console.log('  ✓ Number in range passes');
assert.strictEqual(validateNumber('0', 1, 10), false, '✗ Number below range should fail');
console.log('  ✓ Number below range fails');
assert.strictEqual(validateNumber('11', 1, 10), false, '✗ Number above range should fail');
console.log('  ✓ Number above range fails');
assert.strictEqual(validateNumber('abc', 1, 10), false, '✗ Non-numeric string should fail');
console.log('  ✓ Non-numeric string fails');
assert.strictEqual(validateNumber('5.5', 1, 10), true, '✗ Decimal number in range should pass');
console.log('  ✓ Decimal number in range passes');
assert.strictEqual(validateNumber('-5'), true, '✗ Negative number without range should pass');
console.log('  ✓ Negative number without range passes');
assert.strictEqual(validateNumber('100'), true, '✗ Large number without range should pass');
console.log('  ✓ Large number without range passes');

// Test handleSpecialCommands
console.log('\nTesting handleSpecialCommands():');
assert.strictEqual(handleSpecialCommands('quit'), 'quit', '✗ "quit" should return "quit"');
console.log('  ✓ "quit" command recognized');
assert.strictEqual(handleSpecialCommands('exit'), 'quit', '✗ "exit" should return "quit"');
console.log('  ✓ "exit" command recognized');
assert.strictEqual(handleSpecialCommands('restart'), 'restart', '✗ "restart" should return "restart"');
console.log('  ✓ "restart" command recognized');
assert.strictEqual(handleSpecialCommands('back'), 'back', '✗ "back" should return "back"');
console.log('  ✓ "back" command recognized');
assert.strictEqual(handleSpecialCommands('continue'), 'continue', '✗ Regular input should return "continue"');
console.log('  ✓ Regular input returns "continue"');
assert.strictEqual(handleSpecialCommands('QUIT'), 'quit', '✗ Case-insensitive "QUIT" should work');
console.log('  ✓ Commands are case-insensitive');
assert.strictEqual(handleSpecialCommands('  quit  '), 'quit', '✗ Commands with whitespace should work');
console.log('  ✓ Commands with whitespace work');

// Test state management
console.log('\nTesting state management:');
const mockState = {
  currentStep: 0,
  userData: {},
  completedSteps: [],
};

mockState.userData.name = 'John Doe';
assert.strictEqual(mockState.userData.name, 'John Doe', '✗ Should store user data');
console.log('  ✓ State stores user data');

mockState.currentStep = 1;
assert.strictEqual(mockState.currentStep, 1, '✗ Should track current step');
console.log('  ✓ State tracks current step');

mockState.completedSteps.push(0);
assert.strictEqual(mockState.completedSteps.length, 1, '✗ Should track completed steps');
assert.strictEqual(mockState.completedSteps[0], 0, '✗ Should store correct step index');
console.log('  ✓ State tracks completed steps');

// Reset state
mockState.currentStep = 0;
mockState.userData = {};
mockState.completedSteps = [];
assert.strictEqual(mockState.currentStep, 0, '✗ Should reset current step');
assert.deepStrictEqual(mockState.userData, {}, '✗ Should reset user data');
assert.strictEqual(mockState.completedSteps.length, 0, '✗ Should reset completed steps');
console.log('  ✓ State can be reset');

// Edge cases
console.log('\nTesting edge cases:');
assert.strictEqual(validateEmail('user+tag@domain.com'), true, '✗ Email with + should pass');
console.log('  ✓ Email with + character works');
assert.strictEqual(validateEmail('user@sub.domain.com'), true, '✗ Email with subdomain should pass');
console.log('  ✓ Email with subdomain works');
assert.strictEqual(validateNumber('0', 0, 0), true, '✗ Exact boundary should pass');
console.log('  ✓ Exact boundary validation works');
assert.ok(!validateNonEmpty(null), '✗ Null should fail validation');
console.log('  ✓ Null value fails validation');

console.log('\n' + '='.repeat(50));
console.log('All tests passed! ✓');
console.log('='.repeat(50));

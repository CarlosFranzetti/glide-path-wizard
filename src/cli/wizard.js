#!/usr/bin/env node

/**
 * Glide Path Wizard - CLI Application
 * 
 * A command-line wizard that guides users through various steps,
 * providing clear instructions, validation, and error handling.
 */

import readline from 'readline';
import { stdin, stdout, exit } from 'process';

// ANSI color codes for better terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Readline interface for user input
 */
const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

/**
 * State management for the wizard
 */
const wizardState = {
  currentStep: 0,
  userData: {},
  completedSteps: [],
};

/**
 * Promisified question function for readline
 * @param {string} query - The question to ask the user
 * @returns {Promise<string>} - User's answer
 */
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

/**
 * Print colored text to the console
 * @param {string} text - Text to print
 * @param {string} color - Color code
 */
function print(text, color = colors.reset) {
  console.log(`${color}${text}${colors.reset}`);
}

/**
 * Print a section header
 * @param {string} title - Section title
 */
function printHeader(title) {
  console.log('\n' + '='.repeat(60));
  print(`  ${title}`, colors.bright + colors.cyan);
  console.log('='.repeat(60) + '\n');
}

/**
 * Print a success message
 * @param {string} message - Success message
 */
function printSuccess(message) {
  print(`✓ ${message}`, colors.green);
}

/**
 * Print an error message
 * @param {string} message - Error message
 */
function printError(message) {
  print(`✗ ${message}`, colors.red);
}

/**
 * Print a warning message
 * @param {string} message - Warning message
 */
function printWarning(message) {
  print(`⚠ ${message}`, colors.yellow);
}

/**
 * Print an info message
 * @param {string} message - Info message
 */
function printInfo(message) {
  print(`ℹ ${message}`, colors.blue);
}

/**
 * Clear the console screen
 */
function clearScreen() {
  console.clear();
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate non-empty string
 * @param {string} value - Value to validate
 * @returns {boolean} - True if valid
 */
function validateNonEmpty(value) {
  return value && value.trim().length > 0;
}

/**
 * Validate number within range
 * @param {string} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} - True if valid
 */
function validateNumber(value, min = -Infinity, max = Infinity) {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}

/**
 * Step 1: Welcome and Introduction
 */
async function welcomeStep() {
  clearScreen();
  printHeader('Welcome to Glide Path Wizard');
  
  print('This wizard will guide you through setting up your project configuration.', colors.dim);
  print('You can quit at any time by typing "quit" or "exit".', colors.dim);
  print('Type "restart" to restart the wizard from the beginning.', colors.dim);
  print('Type "back" to go to the previous step.\n', colors.dim);
  
  const answer = await question('Press Enter to continue or type "quit" to exit: ');
  return handleSpecialCommands(answer, 'continue');
}

/**
 * Step 2: Collect User Information
 */
async function userInfoStep() {
  printHeader('Step 1: User Information');
  
  print('Let\'s start by collecting some basic information about you.\n');
  
  // Name
  let name = '';
  while (!validateNonEmpty(name)) {
    name = await question('What is your name? ');
    const command = handleSpecialCommands(name);
    if (command !== 'continue') return command;
    
    if (!validateNonEmpty(name)) {
      printError('Name cannot be empty. Please try again.');
    }
  }
  wizardState.userData.name = name;
  printSuccess(`Hello, ${name}!`);
  
  // Email
  let email = '';
  while (!validateEmail(email)) {
    email = await question('What is your email address? ');
    const command = handleSpecialCommands(email);
    if (command !== 'continue') return command;
    
    if (!validateEmail(email)) {
      printError('Invalid email format. Please try again.');
    }
  }
  wizardState.userData.email = email;
  printSuccess(`Email recorded: ${email}`);
  
  return 'continue';
}

/**
 * Step 3: Project Configuration
 */
async function projectConfigStep() {
  printHeader('Step 2: Project Configuration');
  
  print('Now, let\'s configure your project settings.\n');
  
  // Project name
  let projectName = '';
  while (!validateNonEmpty(projectName)) {
    projectName = await question('What is your project name? ');
    const command = handleSpecialCommands(projectName);
    if (command !== 'continue') return command;
    
    if (!validateNonEmpty(projectName)) {
      printError('Project name cannot be empty. Please try again.');
    }
  }
  wizardState.userData.projectName = projectName;
  printSuccess(`Project name: ${projectName}`);
  
  // Project type
  print('\nSelect your project type:');
  print('1. Web Application');
  print('2. Mobile Application');
  print('3. Desktop Application');
  print('4. Command-Line Tool');
  
  let projectType = '';
  while (!validateNumber(projectType, 1, 4)) {
    projectType = await question('Enter your choice (1-4): ');
    const command = handleSpecialCommands(projectType);
    if (command !== 'continue') return command;
    
    if (!validateNumber(projectType, 1, 4)) {
      printError('Please enter a number between 1 and 4.');
    }
  }
  
  const types = ['Web Application', 'Mobile Application', 'Desktop Application', 'Command-Line Tool'];
  wizardState.userData.projectType = types[parseInt(projectType) - 1];
  printSuccess(`Project type: ${wizardState.userData.projectType}`);
  
  return 'continue';
}

/**
 * Step 4: Environment Setup
 */
async function environmentSetupStep() {
  printHeader('Step 3: Environment Setup');
  
  print('Let\'s configure your development environment.\n');
  
  // Programming language
  print('Select your primary programming language:');
  print('1. JavaScript/TypeScript');
  print('2. Python');
  print('3. Java');
  print('4. Go');
  print('5. Other');
  
  let language = '';
  while (!validateNumber(language, 1, 5)) {
    language = await question('Enter your choice (1-5): ');
    const command = handleSpecialCommands(language);
    if (command !== 'continue') return command;
    
    if (!validateNumber(language, 1, 5)) {
      printError('Please enter a number between 1 and 5.');
    }
  }
  
  const languages = ['JavaScript/TypeScript', 'Python', 'Java', 'Go', 'Other'];
  wizardState.userData.language = languages[parseInt(language) - 1];
  printSuccess(`Primary language: ${wizardState.userData.language}`);
  
  // Package manager
  if (wizardState.userData.language === 'JavaScript/TypeScript') {
    print('\nSelect your package manager:');
    print('1. npm');
    print('2. yarn');
    print('3. pnpm');
    
    let packageManager = '';
    while (!validateNumber(packageManager, 1, 3)) {
      packageManager = await question('Enter your choice (1-3): ');
      const command = handleSpecialCommands(packageManager);
      if (command !== 'continue') return command;
      
      if (!validateNumber(packageManager, 1, 3)) {
        printError('Please enter a number between 1 and 3.');
      }
    }
    
    const managers = ['npm', 'yarn', 'pnpm'];
    wizardState.userData.packageManager = managers[parseInt(packageManager) - 1];
    printSuccess(`Package manager: ${wizardState.userData.packageManager}`);
  }
  
  return 'continue';
}

/**
 * Step 5: Additional Features
 */
async function additionalFeaturesStep() {
  printHeader('Step 4: Additional Features');
  
  print('Would you like to enable additional features?\n');
  
  // CI/CD
  const cicd = await question('Enable CI/CD integration? (yes/no): ');
  const command = handleSpecialCommands(cicd);
  if (command !== 'continue') return command;
  
  wizardState.userData.cicd = cicd.toLowerCase() === 'yes' || cicd.toLowerCase() === 'y';
  if (wizardState.userData.cicd) {
    printSuccess('CI/CD will be enabled');
  } else {
    printInfo('CI/CD will not be enabled');
  }
  
  // Testing
  const testing = await question('Set up automated testing? (yes/no): ');
  const command2 = handleSpecialCommands(testing);
  if (command2 !== 'continue') return command2;
  
  wizardState.userData.testing = testing.toLowerCase() === 'yes' || testing.toLowerCase() === 'y';
  if (wizardState.userData.testing) {
    printSuccess('Testing framework will be configured');
  } else {
    printInfo('Testing framework will not be configured');
  }
  
  // Docker
  const docker = await question('Use Docker for containerization? (yes/no): ');
  const command3 = handleSpecialCommands(docker);
  if (command3 !== 'continue') return command3;
  
  wizardState.userData.docker = docker.toLowerCase() === 'yes' || docker.toLowerCase() === 'y';
  if (wizardState.userData.docker) {
    printSuccess('Docker configuration will be included');
  } else {
    printInfo('Docker will not be configured');
  }
  
  return 'continue';
}

/**
 * Handle special commands (quit, exit, restart, back)
 * @param {string} input - User input
 * @param {string} defaultReturn - Default return value if no special command
 * @returns {string} - Command action
 */
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

/**
 * Display summary of collected information
 */
function displaySummary() {
  printHeader('Configuration Summary');
  
  print('Here\'s a summary of your configuration:\n');
  
  print(`Name: ${wizardState.userData.name}`, colors.bright);
  print(`Email: ${wizardState.userData.email}`, colors.bright);
  print(`Project Name: ${wizardState.userData.projectName}`, colors.bright);
  print(`Project Type: ${wizardState.userData.projectType}`, colors.bright);
  print(`Primary Language: ${wizardState.userData.language}`, colors.bright);
  
  if (wizardState.userData.packageManager) {
    print(`Package Manager: ${wizardState.userData.packageManager}`, colors.bright);
  }
  
  print(`CI/CD: ${wizardState.userData.cicd ? 'Enabled' : 'Disabled'}`, colors.bright);
  print(`Testing: ${wizardState.userData.testing ? 'Enabled' : 'Disabled'}`, colors.bright);
  print(`Docker: ${wizardState.userData.docker ? 'Enabled' : 'Disabled'}`, colors.bright);
  
  printSuccess('\nConfiguration complete!');
  print('\nYour project is ready to be set up with these settings.');
}

/**
 * Main wizard flow
 */
async function runWizard() {
  // Define wizard steps
  const steps = [
    welcomeStep,
    userInfoStep,
    projectConfigStep,
    environmentSetupStep,
    additionalFeaturesStep,
  ];
  
  try {
    while (wizardState.currentStep < steps.length) {
      const step = steps[wizardState.currentStep];
      const result = await step();
      
      if (result === 'quit') {
        printWarning('\nWizard cancelled by user.');
        rl.close();
        exit(0);
      } else if (result === 'restart') {
        printInfo('\nRestarting wizard...');
        wizardState.currentStep = 0;
        wizardState.userData = {};
        wizardState.completedSteps = [];
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      } else if (result === 'back') {
        if (wizardState.currentStep > 0) {
          wizardState.currentStep--;
          printInfo('\nGoing back to previous step...');
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          printWarning('Already at the first step.');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        continue;
      }
      
      wizardState.completedSteps.push(wizardState.currentStep);
      wizardState.currentStep++;
    }
    
    // Display final summary
    displaySummary();
    
    rl.close();
    exit(0);
  } catch (error) {
    printError(`\nAn error occurred: ${error.message}`);
    rl.close();
    exit(1);
  }
}

// Start the wizard
runWizard();

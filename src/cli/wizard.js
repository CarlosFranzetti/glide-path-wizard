#!/usr/bin/env node

/**
 * Migration Assistant - CLI Companion
 *
 * Interactive command-line wizard that walks users through the same 4-step
 * migration workflow as the web UI:
 *   1. Pre-Migration  — checklist, credentials, backups
 *   2. GitHub Setup   — repo creation, git init / push
 *   3. Platform Selection — Vercel / Netlify / Render / GitHub Pages
 *   4. Deployment     — config files, env vars, verification
 *
 * Usage:
 *   npm run wizard                 # display-only mode (default)
 *   npm run wizard -- --execute    # execute shell commands with confirmation
 *   npm run wizard -- --reset      # clear saved progress and start fresh
 */

import readline from 'readline';
import { stdin, stdout, exit } from 'process';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '../..');
const STATE_FILE = resolve(PROJECT_ROOT, '.wizard-state.json');

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const EXECUTE_MODE = args.includes('--execute');
const RESET_FLAG = args.includes('--reset');

// ---------------------------------------------------------------------------
// ANSI colours
// ---------------------------------------------------------------------------
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// ---------------------------------------------------------------------------
// Readline
// ---------------------------------------------------------------------------
const rl = readline.createInterface({ input: stdin, output: stdout });

function ask(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// ---------------------------------------------------------------------------
// Print helpers
// ---------------------------------------------------------------------------
function print(text, colour = c.reset) {
  console.log(`${colour}${text}${c.reset}`);
}
function header(title) {
  const line = '═'.repeat(60);
  console.log(`\n${c.cyan}${line}${c.reset}`);
  print(`  ${title}`, c.bold + c.cyan);
  console.log(`${c.cyan}${line}${c.reset}\n`);
}
function subheader(title) {
  console.log(`\n${c.bold}  ── ${title} ──${c.reset}\n`);
}
function ok(msg) { print(`  ✓ ${msg}`, c.green); }
function err(msg) { print(`  ✗ ${msg}`, c.red); }
function warn(msg) { print(`  ⚠ ${msg}`, c.yellow); }
function info(msg) { print(`  ℹ ${msg}`, c.blue); }
function dim(msg) { print(`  ${msg}`, c.dim); }
function codeBlock(code) {
  console.log(`${c.dim}  ┌${'─'.repeat(56)}┐${c.reset}`);
  for (const line of code.split('\n')) {
    console.log(`${c.dim}  │${c.reset} ${c.white}${line}${c.reset}`);
  }
  console.log(`${c.dim}  └${'─'.repeat(56)}┘${c.reset}`);
}

// ---------------------------------------------------------------------------
// Special commands
// ---------------------------------------------------------------------------
function handleSpecial(input) {
  const v = (input || '').trim().toLowerCase();
  if (v === 'quit' || v === 'exit') return 'quit';
  if (v === 'restart') return 'restart';
  if (v === 'back') return 'back';
  return null;
}

// ---------------------------------------------------------------------------
// Input helpers
// ---------------------------------------------------------------------------
async function askYN(prompt, defaultYes = true) {
  const hint = defaultYes ? 'Y/n' : 'y/N';
  while (true) {
    const raw = await ask(`  ${prompt} (${hint}): `);
    const s = handleSpecial(raw);
    if (s) return s;
    const v = raw.trim().toLowerCase();
    if (v === '' ) return defaultYes;
    if (v === 'y' || v === 'yes') return true;
    if (v === 'n' || v === 'no') return false;
    err('Please answer y or n.');
  }
}

async function askChoice(prompt, options) {
  console.log();
  for (let i = 0; i < options.length; i++) {
    const tag = options[i].recommended ? ` ${c.green}(Recommended)${c.reset}` : '';
    print(`  ${i + 1}. ${c.bold}${options[i].name}${c.reset}${tag} — ${options[i].desc}`);
  }
  console.log();
  while (true) {
    const raw = await ask(`  ${prompt} (1-${options.length}): `);
    const s = handleSpecial(raw);
    if (s) return s;
    const n = Number(raw);
    if (Number.isInteger(n) && n >= 1 && n <= options.length) return n - 1;
    err(`Enter a number between 1 and ${options.length}.`);
  }
}

async function askText(prompt, validate) {
  while (true) {
    const raw = await ask(`  ${prompt}: `);
    const s = handleSpecial(raw);
    if (s) return s;
    const v = raw.trim();
    if (validate && !validate(v)) continue;
    return v;
  }
}

// ---------------------------------------------------------------------------
// Command execution
// ---------------------------------------------------------------------------
function runCmd(cmd) {
  try {
    const out = execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf-8', stdio: 'pipe' });
    return { ok: true, output: out.trim() };
  } catch (e) {
    return { ok: false, output: (e.stderr || e.message || '').trim() };
  }
}

async function showOrExec(label, cmd) {
  if (!EXECUTE_MODE) {
    info(`${label}:`);
    codeBlock(cmd);
    return null;
  }
  info(`${label}:`);
  codeBlock(cmd);
  const go = await askYN(`Execute this command now?`);
  if (go === true) {
    const result = runCmd(cmd);
    if (result.ok) {
      ok('Command succeeded.');
      if (result.output) dim(result.output);
    } else {
      err('Command failed.');
      if (result.output) dim(result.output);
    }
    return result;
  }
  if (typeof go === 'string') return go; // special command
  info('Skipped.');
  return null;
}

// ---------------------------------------------------------------------------
// State persistence
// ---------------------------------------------------------------------------
const defaultState = () => ({
  currentStep: 0,
  completedTasks: [],
  selectedPlatform: '',
  repoName: '',
  hasGit: null,
  envVars: [],
  deploymentUrl: '',
});

function loadState() {
  try {
    if (existsSync(STATE_FILE)) {
      return { ...defaultState(), ...JSON.parse(readFileSync(STATE_FILE, 'utf-8')) };
    }
  } catch { /* ignore corrupt file */ }
  return defaultState();
}

function saveState(state) {
  try { writeFileSync(STATE_FILE, JSON.stringify(state, null, 2)); } catch { /* ignore */ }
}

function clearState() {
  try { if (existsSync(STATE_FILE)) unlinkSync(STATE_FILE); } catch { /* ignore */ }
}

let state = defaultState();

// ---------------------------------------------------------------------------
// STEP 1 — Pre-Migration Checklist
// ---------------------------------------------------------------------------
const criticalTasks = [
  { id: 'locate-code', title: 'Locate your project code', desc: 'Ensure you have your project source code on your local machine.' },
  { id: 'check-database', title: 'Check for database usage', desc: 'Verify if your application uses a database (Supabase, PostgreSQL, etc.).' },
  { id: 'backup-db', title: 'Export database & env variables', desc: 'If applicable, back up your database and environment variables.' },
  { id: 'fill-credentials', title: 'Fill out PROJECT_CREDENTIALS.txt', desc: 'Complete the credentials template in your project root with all logins, secrets & deps.' },
  { id: 'verify-local', title: 'Verify local development works', desc: 'Confirm the app runs correctly on your machine (npm run dev).' },
];

const recommendedTasks = [
  { id: 'document-integrations', title: 'Document third-party integrations', desc: 'Catalog npm dependencies with npm ls --depth=0.' },
  { id: 'create-documentation', title: 'Create migration documentation', desc: 'Collect database, env, dependencies, and API info into a file.' },
  { id: 'test-locally', title: 'Test application locally', desc: 'Run npm install && npm test.' },
];

const optionalTasks = [
  { id: 'create-backup', title: 'Create project backup (ZIP)', desc: 'Archive your project excluding node_modules.' },
  { id: 'review-deps', title: 'Review dependencies for compatibility', desc: 'Run npm outdated && npm audit.' },
];

async function preMigrationStep() {
  header('Step 1 of 4 — Pre-Migration Checklist');

  print('  Complete these tasks before migrating to ensure a smooth transition.', c.dim);
  print('  Tasks marked [CRITICAL] must be done before you can proceed.\n', c.dim);

  // Credentials file notice
  console.log(`  ${c.red}┌${'─'.repeat(54)}┐${c.reset}`);
  console.log(`  ${c.red}│${c.reset} ${c.bold}PROJECT_CREDENTIALS.txt${c.reset} is in your project root.      ${c.red}│${c.reset}`);
  console.log(`  ${c.red}│${c.reset} Fill it in with all logins, API keys, and secrets.     ${c.red}│${c.reset}`);
  console.log(`  ${c.red}│${c.reset} It's in .gitignore — it will ${c.bold}never${c.reset} be committed.       ${c.red}│${c.reset}`);
  console.log(`  ${c.red}└${'─'.repeat(54)}┘${c.reset}\n`);

  // Show helpful commands
  if (EXECUTE_MODE) {
    const dbCheck = await askYN('Run database detection scan? (grep -r "DATABASE" .)', false);
    if (dbCheck === true) {
      const r1 = runCmd('grep -r "DATABASE" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.env" 2>/dev/null || true');
      const r2 = runCmd('grep -r "SUPABASE" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.env" 2>/dev/null || true');
      if (r1.output || r2.output) {
        warn('Database references found:');
        if (r1.output) dim(r1.output);
        if (r2.output) dim(r2.output);
      } else {
        ok('No database references found.');
      }
    } else if (typeof dbCheck === 'string') return dbCheck;
  } else {
    info('Useful commands to check for database usage:');
    codeBlock('grep -r "DATABASE" .\ngrep -r "SUPABASE" .');
    console.log();
    info('Back up environment variables:');
    codeBlock('printenv | grep -E \'^(VITE_|SUPABASE_|API_)\' > .env.backup');
    console.log();
  }

  // Walk through critical tasks
  subheader('Critical Tasks (all required)');
  for (const task of criticalTasks) {
    const already = state.completedTasks.includes(task.id);
    const status = already ? `${c.green}[done]${c.reset}` : `${c.red}[CRITICAL]${c.reset}`;
    print(`  ${status} ${c.bold}${task.title}${c.reset}`);
    dim(`     ${task.desc}`);

    if (!already) {
      const done = await askYN(`Have you completed this task?`, false);
      if (typeof done === 'string') return done;
      if (done) {
        state.completedTasks.push(task.id);
        ok('Marked complete.');
      } else {
        warn('You\'ll need to complete this before proceeding.');
      }
    }
  }

  // Recommended tasks
  subheader('Recommended Tasks');
  for (const task of recommendedTasks) {
    const already = state.completedTasks.includes(task.id);
    const status = already ? `${c.green}[done]${c.reset}` : `${c.yellow}[recommended]${c.reset}`;
    print(`  ${status} ${task.title}`);
    dim(`     ${task.desc}`);
    if (!already) {
      const done = await askYN(`Completed?`, false);
      if (typeof done === 'string') return done;
      if (done) { state.completedTasks.push(task.id); ok('Marked complete.'); }
    }
  }

  // Optional tasks
  subheader('Optional Tasks');
  for (const task of optionalTasks) {
    const already = state.completedTasks.includes(task.id);
    const status = already ? `${c.green}[done]${c.reset}` : `${c.dim}[optional]${c.reset}`;
    print(`  ${status} ${task.title}`);
    dim(`     ${task.desc}`);
    if (!already) {
      const done = await askYN(`Completed?`, false);
      if (typeof done === 'string') return done;
      if (done) { state.completedTasks.push(task.id); ok('Marked complete.'); }
    }
  }

  // Gate: all critical tasks
  const missing = criticalTasks.filter((t) => !state.completedTasks.includes(t.id));
  if (missing.length > 0) {
    console.log();
    err('The following critical tasks are incomplete:');
    for (const t of missing) err(`  - ${t.title}`);
    console.log();
    const force = await askYN('Continue anyway? (not recommended)', false);
    if (typeof force === 'string') return force;
    if (!force) {
      info('Complete the critical tasks and run the wizard again.');
      return 'quit';
    }
  } else {
    console.log();
    ok('All critical tasks complete!');
  }

  saveState(state);
  return 'continue';
}

// ---------------------------------------------------------------------------
// STEP 2 — GitHub Setup
// ---------------------------------------------------------------------------
async function githubSetupStep() {
  header('Step 2 of 4 — GitHub Repository Setup');

  print('  Create a GitHub repository and push your code.\n', c.dim);

  // Git status check
  info('Check your current git status:');
  codeBlock('git status\ngit remote -v');

  if (EXECUTE_MODE) {
    const r = runCmd('git status 2>&1');
    if (r.ok) {
      if (r.output.includes('not a git repository')) {
        info('Git is NOT initialized in this project.');
        state.hasGit = false;
      } else {
        ok('Git is already initialized.');
        state.hasGit = true;
        dim(r.output.split('\n').slice(0, 3).join('\n'));
      }
    } else {
      state.hasGit = false;
    }
  } else {
    const gitChoice = await askChoice('Does your project already have Git initialized?', [
      { name: 'No', desc: 'I need to initialize Git (first time)' },
      { name: 'Yes', desc: 'I already have Git, just need to push' },
    ]);
    if (typeof gitChoice === 'string') return gitChoice;
    state.hasGit = gitChoice === 1;
  }

  // Repo name
  console.log();
  const repoName = await askText('Repository name (e.g. my-app)', (v) => {
    if (!v) { err('Repository name cannot be empty.'); return false; }
    return true;
  });
  if (typeof repoName === 'string' && ['quit','restart','back'].includes(repoName)) return repoName;
  state.repoName = repoName;
  ok(`Repository: ${repoName}`);

  // Visibility
  const vis = await askChoice('Repository visibility:', [
    { name: 'Private', desc: 'Only you can see this repository' },
    { name: 'Public', desc: 'Anyone can see this repository' },
  ]);
  if (typeof vis === 'string') return vis;
  const isPrivate = vis === 0;
  ok(`Visibility: ${isPrivate ? 'Private' : 'Public'}`);

  // Show create-repo link
  console.log();
  info('Create a new repository at:');
  print(`  ${c.bold}https://github.com/new${c.reset}`);
  print(`  Name: ${c.bold}${repoName}${c.reset}, ${isPrivate ? 'Private' : 'Public'}\n`);

  // Git commands
  subheader(state.hasGit ? 'Push to GitHub' : 'Initialize Git & Push');

  if (!state.hasGit) {
    const r = await showOrExec('Initialize git', 'git init');
    if (typeof r === 'string') return r;
    await showOrExec('Stage all files', 'git add .');
    await showOrExec('Initial commit', 'git commit -m "Initial commit"');
    await showOrExec('Add remote', `git remote add origin https://github.com/USERNAME/${repoName}.git`);
    await showOrExec('Push to main', 'git push -u origin main');
  } else {
    await showOrExec('Add remote (or update)', `git remote add origin https://github.com/USERNAME/${repoName}.git`);
    await showOrExec('Rename branch to main (if needed)', 'git branch -M main');
    await showOrExec('Push to main', 'git push -u origin main');
  }

  // Troubleshooting
  console.log();
  subheader('Common Issues');
  dim('• Authentication failed → use a Personal Access Token instead of password');
  dim('• Branch "master" vs "main" → git branch -M main');
  dim('• Remote already exists → git remote set-url origin <url>');

  // Confirmation
  console.log();
  const confirmed = await askYN('Have you created the repo and pushed your code?');
  if (typeof confirmed === 'string') return confirmed;
  if (!confirmed) {
    warn('Complete the GitHub setup before continuing.');
    const skip = await askYN('Continue anyway?', false);
    if (typeof skip === 'string') return skip;
    if (!skip) return 'back';
  } else {
    ok('GitHub setup complete!');
  }

  saveState(state);
  return 'continue';
}

// ---------------------------------------------------------------------------
// STEP 3 — Platform Selection
// ---------------------------------------------------------------------------
const platforms = [
  {
    id: 'vercel', name: 'Vercel', recommended: true,
    desc: 'Best for React/Vite apps with automatic deployments',
    features: ['Zero-config deployment', 'Edge Functions', 'Preview deployments', 'Custom domains', 'Built-in analytics', 'Serverless functions'],
    url: 'https://vercel.com/new',
  },
  {
    id: 'netlify', name: 'Netlify', recommended: false,
    desc: 'Great for static sites and JAMstack apps',
    features: ['Zero-config deployment', 'Edge Functions', 'Preview deployments', 'Custom domains', 'Built-in forms', 'Serverless functions'],
    url: 'https://app.netlify.com/start',
  },
  {
    id: 'render', name: 'Render', recommended: false,
    desc: 'Full-stack platform with databases and cron jobs',
    features: ['Zero-config deployment', 'Managed databases', 'Preview deployments', 'Custom domains', 'Background workers', 'Cron jobs'],
    url: 'https://dashboard.render.com/new/static',
  },
  {
    id: 'github-pages', name: 'GitHub Pages', recommended: false,
    desc: 'Free hosting for static sites from your repo',
    features: ['Zero-config deployment', 'Custom domains', 'HTTPS included'],
    url: 'https://github.com',
  },
];

async function platformSelectionStep() {
  header('Step 3 of 4 — Choose Your Platform');

  const choice = await askChoice('Select your hosting platform:', platforms);
  if (typeof choice === 'string') return choice;

  const platform = platforms[choice];
  state.selectedPlatform = platform.id;
  ok(`Selected: ${platform.name}`);

  // Show features
  console.log();
  subheader(`${platform.name} Features`);
  for (const f of platform.features) {
    print(`  ${c.green}✓${c.reset} ${f}`);
  }

  console.log();
  info(`Dashboard: ${platform.url}`);

  saveState(state);
  return 'continue';
}

// ---------------------------------------------------------------------------
// STEP 4 — Deployment
// ---------------------------------------------------------------------------
const platformConfigs = {
  vercel: {
    name: 'Vercel',
    file: 'vercel.json',
    url: 'https://vercel.com/new',
    config: `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}`,
  },
  netlify: {
    name: 'Netlify',
    file: 'netlify.toml',
    url: 'https://app.netlify.com/start',
    config: `[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`,
  },
  render: {
    name: 'Render',
    file: 'render.yaml',
    url: 'https://dashboard.render.com/new/static',
    config: `services:
  - type: web
    name: my-app
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html`,
  },
  'github-pages': {
    name: 'GitHub Pages',
    file: '.github/workflows/deploy.yml',
    url: 'https://github.com',
    config: `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist`,
  },
};

async function deploymentStep() {
  const cfg = platformConfigs[state.selectedPlatform] || platformConfigs.vercel;
  header(`Step 4 of 4 — Deploy to ${cfg.name}`);

  // Credentials reminder
  console.log(`  ${c.blue}┌${'─'.repeat(54)}┐${c.reset}`);
  console.log(`  ${c.blue}│${c.reset} Reference your ${c.bold}PROJECT_CREDENTIALS.txt${c.reset} to copy      ${c.blue}│${c.reset}`);
  console.log(`  ${c.blue}│${c.reset} env vars & API keys into the platform dashboard.     ${c.blue}│${c.reset}`);
  console.log(`  ${c.blue}└${'─'.repeat(54)}┘${c.reset}\n`);

  // Build configuration
  subheader(`Build Configuration — ${cfg.file}`);
  info(`Add this file to your project root:`);
  codeBlock(cfg.config);

  if (EXECUTE_MODE) {
    const write = await askYN(`Write ${cfg.file} to your project root?`);
    if (typeof write === 'string') return write;
    if (write) {
      try {
        const filePath = resolve(PROJECT_ROOT, cfg.file);
        // Ensure directory exists for github-pages workflow
        if (cfg.file.includes('/')) {
          const dir = dirname(filePath);
          execSync(`mkdir -p "${dir}"`);
        }
        writeFileSync(filePath, cfg.config + '\n');
        ok(`Created ${cfg.file}`);
      } catch (e) {
        err(`Failed to create ${cfg.file}: ${e.message}`);
      }
    }
  }

  // Don't forget to commit
  console.log();
  info('After creating the config file:');
  codeBlock(`git add ${cfg.file}\ngit commit -m "Add deployment config"\ngit push`);

  // Environment variables
  subheader('Environment Variables');
  info(`Set these in the ${cfg.name} dashboard:`);
  console.log();

  if (state.envVars.length === 0) {
    state.envVars.push({ key: 'VITE_API_URL', value: '' });
  }

  // Show current vars
  for (const ev of state.envVars) {
    print(`  ${c.bold}${ev.key}${c.reset} = ${ev.value || c.dim + '(not set)' + c.reset}`);
  }

  // Add more?
  let addMore = true;
  while (addMore) {
    console.log();
    const add = await askYN('Add an environment variable?', false);
    if (typeof add === 'string') return add;
    if (!add) { addMore = false; break; }

    const key = await askText('Variable name (e.g. VITE_API_URL)', (v) => {
      if (!v) { err('Name cannot be empty.'); return false; }
      return true;
    });
    if (typeof key === 'string' && ['quit','restart','back'].includes(key)) return key;

    const value = await askText('Value', () => true);
    if (typeof value === 'string' && ['quit','restart','back'].includes(value)) return value;

    state.envVars.push({ key, value });
    ok(`Added: ${key}`);
  }

  // Deploy
  subheader('Deploy');
  info(`Open the ${cfg.name} dashboard to deploy:`);
  print(`  ${c.bold}${cfg.url}${c.reset}\n`);

  const deployed = await askYN('Have you completed the deployment?', false);
  if (typeof deployed === 'string') return deployed;

  if (deployed) {
    // Deployment URL
    const url = await askText('Enter your deployment URL (e.g. https://my-app.vercel.app)', (v) => {
      if (!v) { err('URL cannot be empty.'); return false; }
      return true;
    });
    if (typeof url === 'string' && ['quit','restart','back'].includes(url)) return url;
    state.deploymentUrl = url;

    // Post-deployment verification
    subheader('Post-Deployment Verification');
    const checks = [
      'Site loads without errors',
      'Navigation and routing work',
      'Environment variables are working',
      'Database connections work (if applicable)',
      'Key features work as expected',
    ];
    let allGood = true;
    for (const check of checks) {
      const result = await askYN(check);
      if (typeof result === 'string') return result;
      if (result) {
        ok(check);
      } else {
        warn(`Issue: ${check}`);
        allGood = false;
      }
    }

    if (!allGood) {
      console.log();
      subheader('Troubleshooting');
      dim(`• Check build logs on ${cfg.name} dashboard`);
      dim('• Verify environment variables are set correctly');
      dim('• Ensure build command and output directory match your local setup');
      dim('• Check that all dependencies are in package.json');
      dim(`• Review ${cfg.name} documentation for troubleshooting`);
    }
  } else {
    info('Come back to finish deployment later. Your progress is saved.');
  }

  saveState(state);
  return 'continue';
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
function displaySummary() {
  const cfg = platformConfigs[state.selectedPlatform] || platformConfigs.vercel;
  header('Migration Complete!');

  print('  Here\'s a summary of your migration:\n');

  print(`  Platform:       ${c.bold}${cfg.name}${c.reset}`);
  print(`  Repository:     ${c.bold}${state.repoName || '(not set)'}${c.reset}`);
  print(`  Deployment URL: ${c.bold}${state.deploymentUrl || '(not set)'}${c.reset}`);
  print(`  Config File:    ${c.bold}${cfg.file}${c.reset}`);
  console.log();
  print(`  Tasks Completed: ${c.bold}${state.completedTasks.length}${c.reset}`);
  print(`  Env Variables:   ${c.bold}${state.envVars.length}${c.reset}`);

  console.log();
  ok('Your application has been migrated successfully!');
  console.log();
  if (state.deploymentUrl) {
    print(`  ${c.bold}View your live app:${c.reset} ${state.deploymentUrl}`);
  }
  info('Your credentials are stored in PROJECT_CREDENTIALS.txt (never committed).');
  console.log();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function runWizard() {
  // Handle --reset
  if (RESET_FLAG) {
    clearState();
    ok('Progress cleared. Starting fresh.\n');
  }

  // Load state
  state = loadState();

  // Welcome
  console.clear();
  header('Migration Assistant — CLI');

  if (EXECUTE_MODE) {
    print(`  Mode: ${c.bold}${c.yellow}EXECUTE${c.reset} — commands will run with your confirmation.`, c.yellow);
  } else {
    print(`  Mode: ${c.bold}Display only${c.reset} — commands are shown for you to copy/run.`);
    dim('  Use --execute flag to run commands directly.');
  }
  dim('  Type "quit" to exit, "back" to go back, "restart" to start over.');
  dim('  Progress is saved automatically between sessions.\n');

  // Resume?
  if (state.currentStep > 0) {
    info(`Previous progress found — you were on Step ${state.currentStep + 1} of 4.`);
    const resume = await askYN('Resume where you left off?');
    if (typeof resume === 'string') {
      if (resume === 'quit') { rl.close(); exit(0); }
    }
    if (resume === false) {
      state = defaultState();
      clearState();
      ok('Starting fresh.');
    }
  }

  const steps = [
    preMigrationStep,
    githubSetupStep,
    platformSelectionStep,
    deploymentStep,
  ];

  try {
    while (state.currentStep < steps.length) {
      const step = steps[state.currentStep];
      const result = await step();

      if (result === 'quit') {
        saveState(state);
        console.log();
        info('Progress saved. Run "npm run wizard" to resume later.');
        rl.close();
        exit(0);
      } else if (result === 'restart') {
        info('Restarting wizard...');
        state = defaultState();
        clearState();
        await new Promise(r => setTimeout(r, 500));
        continue;
      } else if (result === 'back') {
        if (state.currentStep > 0) {
          state.currentStep--;
          saveState(state);
          info('Going back...');
          await new Promise(r => setTimeout(r, 300));
        } else {
          warn('Already at the first step.');
        }
        continue;
      }

      state.currentStep++;
      saveState(state);
    }

    displaySummary();
    clearState(); // Clean up state file on completion
    rl.close();
    exit(0);
  } catch (error) {
    saveState(state);
    err(`\nAn error occurred: ${error.message}`);
    info('Progress saved. Run "npm run wizard" to resume.');
    rl.close();
    exit(1);
  }
}

runWizard();

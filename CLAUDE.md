# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Vite dev server on localhost:8080
npm run build            # Production build → dist/
npm run lint             # ESLint
npm run test             # Vitest (single run)
npm run test:watch       # Vitest watch mode
npm run wizard           # CLI migration wizard (display-only)
npm run wizard -- --execute  # CLI with command execution
npm run wizard -- --reset    # Clear CLI saved progress
npm run test:cli         # CLI unit tests
```

## Architecture

This is a dual-interface migration wizard — a React/Vite web app and a Node.js CLI — both guiding users through the same 4-step workflow:

1. **Pre-Migration** — checklist with critical/recommended/optional tasks, credentials file
2. **GitHub Setup** — repo creation, git init/push
3. **Platform Selection** — Vercel, Netlify, Render, or GitHub Pages
4. **Deployment** — platform-specific config, env vars, post-deploy verification

### Web App

Entry: `src/main.tsx` → `App.tsx` → `pages/Index.tsx` → `components/wizard/MigrationWizard.tsx`

`MigrationWizard` is the orchestrator. It owns all state via `useWizardPersistence()` (localStorage-backed) and renders one of four step components based on `currentStep`. Steps receive callbacks (`onNext`, `onBack`) and are wrapped in Framer Motion's `AnimatePresence` for transitions.

Step gating: PreMigrationStep requires 5 critical task IDs (`locate-code`, `check-database`, `backup-db`, `fill-credentials`, `verify-local`) before enabling the continue button. PlatformSelectionStep requires a selection. DeploymentStep requires a deployment URL for verification.

`ErrorBoundary` (class component) wraps the entire app in `App.tsx`.

### CLI

Entry: `src/cli/wizard.js` — fully self-contained, no transpilation needed (ES modules, Node 18+).

Four async step functions mirror the web steps. Reads `--execute` flag from `process.argv` to optionally run shell commands with confirmation (via `execSync`). State persists to `.wizard-state.json` in the project root. Same critical task gate logic as the web UI.

### Shared concepts

Both interfaces use identical state shape: `{ currentStep, completedTasks, selectedPlatform, repoName, ... }`. Platform config templates (vercel.json, netlify.toml, render.yaml, deploy.yml) are duplicated in each interface. `PROJECT_CREDENTIALS.txt` is a gitignored template for logins/secrets/dependencies referenced by both.

## Key Patterns

- **Path alias:** `@/*` → `./src/*` (tsconfig + vite config)
- **Styling:** Tailwind utility classes only; HSL-based design tokens in `src/index.css`; `cn()` from `src/lib/utils.ts` for conditional class merging (clsx + tailwind-merge)
- **UI components:** shadcn/ui (Radix primitives) in `src/components/ui/`; icons from lucide-react
- **Wizard components:** `src/components/wizard/` — `ChecklistSection` renders task lists with importance badges and collapsible code blocks via `CodeBlock`
- **TypeScript:** Lenient config (strict: false, no strict null checks). Props interfaces named `{ComponentName}Props`.

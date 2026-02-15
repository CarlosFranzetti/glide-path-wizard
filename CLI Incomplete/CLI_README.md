# Glide Path Wizard CLI Companion (Reference)

This folder contains a terminal-based companion wizard that mirrors the deployment flow.

## Important status

- This CLI is currently stored in `CLI Incomplete/` as a reference implementation.
- The main supported experience is the web wizard in this repository root.
- Use this CLI if you prefer terminal prompts, or want to study the flow logic.

## Who this helps

- Beginners who want a guided checklist in terminal form
- Developers who want a script-like deployment walkthrough

## File location

- Entry script: `CLI Incomplete/src/cli/wizard.js`

## Run it

From the repository root:

```bash
node "CLI Incomplete/src/cli/wizard.js"
```

Optional flags:

```bash
node "CLI Incomplete/src/cli/wizard.js" --execute
node "CLI Incomplete/src/cli/wizard.js" --reset
```

- `--execute`: asks before running suggested shell commands
- `--reset`: clears saved CLI progress

## CLI step flow

1. `Pre-Migration Checklist`
2. `GitHub Repository Setup`
3. `Platform Selection`
4. `Deployment and Verification`

## Beginner notes

- You can type `quit`, `exit`, `back`, or `restart` at prompts.
- Progress is saved to `.wizard-state.json` in the project root.
- `PROJECT_CREDENTIALS.txt` is intended for private migration notes and should stay out of git.
- Verify each command output before moving to the next step.

## Safety reminders

- Never commit API keys, passwords, or tokens.
- Store secrets in host environment variable settings.
- Confirm your production URL and one core user flow after deployment.

## Suggested checks before shipping

```bash
npm run lint
npm run test
npm run build
```

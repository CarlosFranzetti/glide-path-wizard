# CLI Companion Summary (Current)

## What this document is

This is a concise status summary for the terminal companion wizard in `CLI Incomplete/src/cli/wizard.js`.

## Current position

- The web wizard is the primary user experience for this repository.
- The CLI companion exists as a reference/incomplete companion in `CLI Incomplete/`.
- The CLI follows a 4-step deployment flow aligned with the same beginner-safe goals:
  1. Pre-migration checklist
  2. GitHub setup
  3. Host/platform selection
  4. Deployment + verification

## Why keep it

- Useful for terminal-first workflows
- Useful as a readable example of guided prompt logic
- Useful for future extraction into a dedicated CLI package

## Beginner-first behavior captured

- Explicit step-by-step prompts
- Actionable validation and warnings
- Special navigation commands (`quit`, `exit`, `back`, `restart`)
- Persistent progress via `.wizard-state.json`

## Safety model

- Encourages environment variables for secrets
- Calls out credential handling through `PROJECT_CREDENTIALS.txt`
- Uses post-deployment verification prompts before completion

## Suggested next evolution

1. Move CLI out of `CLI Incomplete/` into a dedicated package folder.
2. Add npm scripts specifically for CLI run/test/demo.
3. Add CI checks for CLI tests independently from the web app.
4. Keep text prompts synchronized with web wizard copy updates.

# Glide Path Wizard

Beginner-friendly deployment guidance for React/Vite projects.

## What this project is

Glide Path Wizard is a step-by-step web wizard that helps you deploy safely:

1. `Project Readiness` (check local app + protect secrets)
2. `Repository Setup` (create GitHub repo + push code)
3. `Deploy and Verify` (choose host + confirm production works)

The wizard is designed for people who are new to deployment and want clear, practical instructions.

## Who this is for

- First-time deployers
- Developers who want a checklist instead of guesswork
- Teams that want a consistent release flow

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:8080/`.

## Beginner flow details

### Step 1: Project Readiness

Goal: catch blockers before deployment.

- Confirm app runs locally
- List required environment variables
- Make sure `.env`/secrets are not tracked by git

### Step 2: Repository Setup

Goal: get your project safely on GitHub.

- Enter GitHub username and repository name
- Choose whether git is already initialized
- Run generated commands in your project folder
- Confirm the GitHub repository URL shows your files

### Step 3: Deploy and Verify

Goal: publish your app and validate key production behavior.

- Pick a host (Vercel is the easiest default for many React/Vite apps)
- Copy build/output settings
- Add environment variables in host dashboard
- Verify URL, routes, env-dependent features, and one core user flow

## Supported hosts

- Vercel
- Netlify
- Render
- GitHub Pages
- Cloudflare Pages
- Railway

## Commands

```bash
npm run dev
npm run test
npm run lint
npm run build
```

## Notes

- Progress is saved in browser `localStorage`.
- This wizard provides guidance and checklists; it does not auto-deploy by itself.
- Keep secrets in environment variables, never in committed source files.

## Extra docs

- CLI companion docs: `CLI Incomplete/CLI_README.md`
- Historical CLI implementation notes: `CLI Incomplete/CLI_IMPLEMENTATION_SUMMARY.md`

# Migration Assistant

A step-by-step wizard to help you migrate your web projects to production hosting platforms.

## Prerequisites

Before starting the migration process, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** installed on your machine - [Download here](https://git-scm.com/downloads)
- **npm** or **yarn** package manager (comes with Node.js)
- A **GitHub account** - [Sign up here](https://github.com/signup)
- Your **project source code** on your local machine
- Access to your **environment variables** (if applicable)
- Access to your **database** (if applicable)

### Verify Prerequisites

Run these commands to verify your setup:

```bash
# Check Node.js version
node --version  # Should be v18 or higher

# Check npm version
npm --version

# Check Git installation
git --version

# Check if you're logged into Git
git config --global user.name
git config --global user.email
```

If Git user is not configured:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Migration Workflow

The migration process is structured into **4 phases**:

---

## Step 1: Pre-Migration

**Prepare your project for migration**

Before starting the migration, complete these essential preparation tasks:

### Critical Tasks (Required)

| Task | Description | Commands |
|------|-------------|----------|
| **Locate your project code** | Ensure you have your project source code on your local machine | If local: ✅ you're ready<br>If remote: download/export from your platform<br>If ZIP: extract to a folder |
| **Verify local development works** | Confirm your application runs correctly on your machine | `npm install`<br>`npm run dev`<br>Test in browser |
| **Check for database usage** | Verify if your application uses a database | Check for `DATABASE_URL`, `SUPABASE_URL` in `.env` files<br>`grep -r "DATABASE" .` |
| **Backup database & environment variables** | If you have a database, export it along with environment variables | `pg_dump -f backup.sql` or platform-specific export<br>`printenv | grep -E '^(VITE_|API_|DATABASE_)' > .env.backup` |

### Recommended Tasks

| Task | Description | Commands |
|------|-------------|----------|
| **Document third-party integrations** | List all APIs, services, and integrations your app uses | `npm ls --depth=0` to see dependencies<br>Document API keys and services manually |
| **Create migration documentation** | Collect all database, env variables, dependencies into one file | See the wizard for a complete script |

### Optional Tasks

| Task | Description | Commands |
|------|-------------|----------|
| **Create project backup** | Create a backup ZIP file before making changes | `zip -r project-backup.zip . -x "node_modules/*"` |
| **Review dependencies for compatibility** | Check that all npm packages are up-to-date and compatible | `npm outdated`<br>`npm update`<br>`npm audit` |

---

## Step 2: GitHub Setup

**Create and configure repository**

Set up a GitHub repository to host your project code.

### Step-by-Step Guide

#### 1. Check your Git status

Before creating a GitHub repository, check if your project already has Git initialized:

```bash
# Check Git status
git status
```

**If you see "not a git repository":** You'll need to initialize Git (see commands below)

**If you see branch info:** You already have Git! Check for existing remotes:

```bash
git remote -v
```

#### 2. Create a new repository on GitHub

- Visit [github.com/new](https://github.com/new)
- Choose repository name
- Select visibility (Private or Public)
- **Important:** Do NOT initialize with README (you'll push existing code)

#### 3. Push your code to GitHub

**If you don't have Git initialized yet:**

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit"

# Add remote origin (replace username and repo-name)
git remote add origin https://github.com/username/repo-name.git

# Push to main branch
git push -u origin main
```

**If you already have Git initialized:**

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/username/repo-name.git

# Push to GitHub
git push -u origin main

# If you need to rename branch to 'main':
git branch -M main
git push -u origin main
```

#### 4. Verify your code is on GitHub

Visit `https://github.com/username/repo-name` and confirm:
- ✅ All your files are visible
- ✅ Your commits are showing
- ✅ The code matches your local version

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Authentication failed** | Use a Personal Access Token instead of password ([GitHub Docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)) |
| **Branch 'master' vs 'main'** | Rename with `git branch -M main` |
| **Remote already exists** | Change it with `git remote set-url origin <new-url>` |
| **Large files rejected** | Add them to `.gitignore` or use Git LFS |

---

## Step 3: Platform Selection

**Choose your hosting platform**

Select where you want to deploy your application. Consider your project's needs:

### Platform Comparison

| Platform | Best For | Free Tier | Key Features |
|----------|----------|-----------|--------------|
| **Vercel** ⭐ | React/Next.js apps | ✅ Yes | Zero-config deployment, Edge Functions, Preview deployments, Built-in analytics |
| **Netlify** | Static sites, JAMstack | ✅ Yes | Zero-config deployment, Edge Functions, Built-in forms, Preview deployments |
| **Render** | Full-stack apps | ✅ Yes | Managed databases, Background workers, Cron jobs, Preview deployments |
| **GitHub Pages** | Simple static sites | ✅ Always free | Zero-config deployment, Custom domains, HTTPS included |

### Detailed Platform Guide

#### Vercel (Recommended for React/Vite)
**Best for:** React, Next.js, or Vite projects
- ✅ Automatic optimizations for performance
- ✅ Instant preview deployments for every push
- ✅ Built-in serverless functions
- ✅ Free SSL certificates and custom domains
- 💰 Free tier: 100GB bandwidth, unlimited personal projects

**Choose Vercel if:**
- You're deploying a React or Next.js application
- You need serverless functions
- You want automatic preview deployments for pull requests

#### Netlify
**Best for:** Static sites and JAMstack applications
- ✅ Built-in form handling out of the box
- ✅ Serverless functions support
- ✅ Split testing and branch deploys
- ✅ Automatic HTTPS and global CDN
- 💰 Free tier: 100GB bandwidth, 300 build minutes/month

**Choose Netlify if:**
- You're building a static site or JAMstack app
- You need form handling without a backend
- You want simple CI/CD workflows

#### Render
**Best for:** Full-stack applications with backend needs
- ✅ Managed PostgreSQL databases
- ✅ Background workers and cron jobs
- ✅ Docker support
- ✅ Private networking between services
- 💰 Free tier: Static sites free, web services after trial

**Choose Render if:**
- You need a PostgreSQL database
- You have background jobs or scheduled tasks
- You want a complete full-stack platform

#### GitHub Pages
**Best for:** Simple static sites and documentation
- ✅ Free hosting directly from GitHub repository
- ✅ Automatic deployment on push
- ✅ Custom domain support with HTTPS
- ⚠️ Static content only (no serverless functions)
- 💰 Always free

**Choose GitHub Pages if:**
- You're hosting a portfolio or documentation site
- You don't need any backend functionality
- You want the simplest free hosting option

---

## Step 4: Deployment

**Configure and deploy your app**

### 1. Add Build Configuration

Add the appropriate configuration file to your project root:

#### Vercel (`vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

#### Netlify (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Render (`render.yaml`)
```yaml
services:
  - type: web
    name: my-app
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

#### GitHub Pages (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to GitHub Pages

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
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**After creating the config file:**
```bash
# Commit and push the configuration
git add .
git commit -m "Add deployment configuration"
git push
```

### 2. Configure Environment Variables

Add your environment variables in your platform's dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Your API endpoint URL | `https://api.example.com` |
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@host:5432/db` |
| `API_KEY` | Third-party API keys | Your API key value |

**Security Note:** Never commit sensitive keys to Git. Always use environment variables.

### 3. Deploy Your Application

1. **Connect GitHub repository** to your chosen platform
2. **Configure build settings** (usually auto-detected from config file)
3. **Add environment variables** in platform dashboard
4. **Trigger deployment** (automatic on push or manual)

### 4. Verify Deployment

After deployment completes, verify everything works:

#### Critical Checks
- [ ] **Site loads without errors** - Check browser console
- [ ] **Navigation works** - Test all routes and links
- [ ] **Environment variables work** - API calls succeed
- [ ] **Database connections work** - Data loads correctly (if applicable)
- [ ] **Key features work** - Test critical user workflows

#### Test Your Deployment URL
Visit your deployment URL and thoroughly test your application:
- Vercel: `https://your-app.vercel.app`
- Netlify: `https://your-app.netlify.app`
- Render: `https://your-app.onrender.com`
- GitHub Pages: `https://username.github.io/repo-name`

### Troubleshooting Common Issues

| Issue | Solution |
|-------|----------|
| **Build fails** | Check build logs for errors; verify Node.js version matches local |
| **Environment variables not working** | Ensure they're set in platform dashboard; restart deployment |
| **404 on routes** | Add SPA routing configuration (rewrites/redirects in config) |
| **Blank page** | Check browser console; verify output directory is correct |
| **API calls fail** | Check CORS settings; verify API URLs in environment variables |
| **Dependencies missing** | Ensure all deps are in `package.json`, not just `devDependencies` |

### Platform-Specific Dashboards

- **Vercel:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **Netlify:** [app.netlify.com](https://app.netlify.com)
- **Render:** [dashboard.render.com](https://dashboard.render.com)
- **GitHub Pages:** Settings → Pages in your repository

---

## Common Issues & Solutions

### Git Issues

**"Permission denied (publickey)"**
- Solution: Set up SSH keys or use HTTPS with a Personal Access Token
- [GitHub SSH Guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

**"fatal: remote origin already exists"**
```bash
# Remove existing remote
git remote remove origin

# Add your new remote
git remote add origin https://github.com/username/repo.git
```

**"Updates were rejected because the remote contains work that you do not have"**
```bash
# Pull remote changes first
git pull origin main --rebase

# Or force push (⚠️ use with caution)
git push -f origin main
```

### Build Issues

**"Module not found" errors during build**
- Ensure all dependencies are in `package.json` under `dependencies`, not `devDependencies`
- Run `npm install` to verify packages install correctly

**"Out of memory" errors**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**Build works locally but fails on platform**
- Check Node.js version matches between local and platform
- Verify build command in platform settings matches `package.json`

### Deployment Issues

**404 errors on page refresh**
- Add SPA routing configuration (rewrites/redirects) to your platform config
- See Step 4 configurations above

**Environment variables not working**
- Remember to prefix client-side variables with `VITE_` (for Vite projects)
- Restart/redeploy after adding environment variables
- Check variable names don't have typos

**Blank white page after deployment**
- Check browser console for errors
- Verify `outputDirectory` in config matches your build output (usually `dist` or `build`)
- Ensure base path is configured correctly if deploying to subdirectory

---

## Getting Help

If you encounter issues not covered here:

1. **Check build logs** on your hosting platform
2. **Review platform documentation:**
   - [Vercel Docs](https://vercel.com/docs)
   - [Netlify Docs](https://docs.netlify.com/)
   - [Render Docs](https://render.com/docs)
   - [GitHub Pages Docs](https://docs.github.com/en/pages)
3. **Search GitHub Issues** for similar problems
4. **Ask for help** in platform community forums or Discord servers

---

## Technology Stack

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI component library
- **shadcn/ui** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

---

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

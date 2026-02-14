# 🧙‍♂️ Glide Path Wizard

> 🚀 Your friendly migration toolkit for deploying web projects with ease!

A comprehensive project setup and migration toolkit featuring both a web-based wizard 🌐 and CLI interface ⌨️.

## ✨ Components

### 🌐 Migration Assistant (Web)
Step-by-step web wizard to migrate your projects to production hosting platforms.

### ⌨️ CLI Wizard
Interactive terminal-based wizard for project configuration and setup.  
📖 [Full CLI Documentation](CLI_README.md)

## 🚀 Quick Start

### Web Application
```bash
npm install
npm run dev
```

### CLI Wizard
```bash
npm install
npm run wizard
```

## 📋 Prerequisites

Ensure you have:

- ✅ **Node.js** (v18+) - [Download](https://nodejs.org/)
- ✅ **Git** - [Download](https://git-scm.com/downloads)
- ✅ **GitHub account** - [Sign up](https://github.com/signup)
- ✅ **Project source code** on your local machine

### Verify Setup
```bash
node --version  # Should be v18+
npm --version
git --version
```

---

## 🗺️ Migration Workflow

### 📦 Step 1: Pre-Migration

**Prepare your project**

| Priority | Task | Quick Check |
|----------|------|-------------|
| 🔴 Critical | Project code ready | Local folder with all files |
| 🔴 Critical | Local dev works | `npm install && npm run dev` |
| 🔴 Critical | Check database | Look for `DATABASE_URL` in `.env` |
| 🟡 Important | Backup database | `pg_dump -f backup.sql` |
| 🟢 Optional | Create backup | `zip -r backup.zip . -x "node_modules/*"` |

---

### 🐙 Step 2: GitHub Setup

**Create and configure repository**

#### 1️⃣ Check Git Status
```bash
git status  # Check if Git is initialized
git remote -v  # Check for existing remotes
```

#### 2️⃣ Create GitHub Repository
- Visit [github.com/new](https://github.com/new)
- Choose name and visibility
- ⚠️ **Don't** initialize with README

#### 3️⃣ Push Your Code
```bash
# If Git not initialized:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo-name.git
git push -u origin main

# If Git already initialized:
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
```

💡 **Pro Tip:** Add `.env` to `.gitignore` to protect secrets!
```bash
echo ".env" >> .gitignore
```

---

### 🎯 Step 3: Platform Selection

**Choose your hosting platform**

| Platform | Best For | Free Tier | Top Features |
|----------|----------|-----------|--------------|
| **Vercel** ⭐ | React/Next.js | ✅ 100GB | Auto-deploy, Edge Functions, Analytics |
| **Netlify** 🦋 | Static/JAMstack | ✅ 100GB | Forms, Split testing, Edge Functions |
| **Render** 🔧 | Full-stack | ✅ Limited | PostgreSQL, Background jobs, Docker |
| **GitHub Pages** 📄 | Simple static | ✅ Unlimited | Direct from repo, Zero config |

#### Quick Decision Guide

- 🎯 **React/Vite app?** → Choose Vercel
- 📝 **Static site with forms?** → Choose Netlify
- 🗄️ **Need a database?** → Choose Render
- 📚 **Portfolio/docs?** → Choose GitHub Pages

---

### 🚢 Step 4: Deployment

**Configure and deploy**

#### 1️⃣ Add Configuration File

Choose your platform and add the config file:

<details>
<summary>⚡ <b>Vercel</b> - vercel.json</summary>

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
</details>

<details>
<summary>🦋 <b>Netlify</b> - netlify.toml</summary>

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
</details>

<details>
<summary>🔧 <b>Render</b> - render.yaml</summary>

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
</details>

<details>
<summary>📄 <b>GitHub Pages</b> - .github/workflows/deploy.yml</summary>

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
</details>

**Commit the config:**
```bash
git add .
git commit -m "Add deployment configuration"
git push
```

#### 2️⃣ Deploy

1. 🔗 Connect your GitHub repo to the platform
2. ⚙️ Configure build settings (auto-detected from config)
3. 🔐 Add environment variables in platform dashboard
4. 🚀 Deploy!

#### 3️⃣ Verify Deployment ✅

Test your live site:
- 🌐 Site loads without errors
- 🧭 Navigation works
- 🔌 API calls succeed
- 🗄️ Database connects (if applicable)

**Platform Dashboards:**
- Vercel: [vercel.com/dashboard](https://vercel.com/dashboard)
- Netlify: [app.netlify.com](https://app.netlify.com)
- Render: [dashboard.render.com](https://dashboard.render.com)
- GitHub Pages: Settings → Pages in your repo

---

## 🆘 Common Issues

| Problem | Quick Fix |
|---------|-----------|
| 🔴 Build fails | Check Node.js version matches local |
| 🔒 Auth failed | Use Personal Access Token ([Guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)) |
| 🔄 404 on refresh | Add SPA routing config (see deployment configs above) |
| ⚪ Blank page | Check browser console; verify output directory |
| 🔌 API fails | Check CORS & environment variables |
| 📦 Module not found | Move deps from `devDependencies` to `dependencies` |

---

## 💡 Getting Help

1. 📊 **Check build logs** on your platform
2. 📚 **Read the docs**: [Vercel](https://vercel.com/docs) • [Netlify](https://docs.netlify.com/) • [Render](https://render.com/docs) • [GitHub Pages](https://docs.github.com/en/pages)
3. 🔍 **Search GitHub Issues**
4. 💬 **Ask the community** in platform forums/Discord

---

## 🧙‍♂️ CLI Wizard Features

The CLI wizard provides:

- 🎨 **Interactive terminal interface** with color-coded output
- 📝 **Step-by-step guidance** through configuration
- ✅ **Input validation** for all inputs
- 🔄 **Navigation controls**: quit, restart, go back anytime
- 🧩 **Modular architecture** for easy extension

### Run CLI
```bash
npm run wizard
```

📖 **Full documentation:** [CLI_README.md](CLI_README.md)

---

<div align="center">

Made with ❤️ and ☕

**[Report Bug](../../issues)** • **[Request Feature](../../issues)**

</div>

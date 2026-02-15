# 🧙 Glide Path Wizard

> 🚀 A guided web wizard for deploying your app without unnecessary complexity.

## ✨ What You Get

A step-by-step deployment assistant focused on the essentials:

1. ✅ **Project Readiness**
2. 🐙 **Repository Setup**
3. 🌍 **Deploy and Verify**

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🧭 Wizard Flow

### 1) ✅ Project Readiness
Check the core blockers before deployment:

- App runs locally
- Required env vars are known
- Secrets are not tracked by git

### 2) 🐙 Repository Setup
Create and connect your GitHub repository, then push your code.

- Enter GitHub username + repo name
- Choose whether git is already initialized
- Run generated commands and confirm push

### 3) 🌍 Deploy and Verify
Pick a host, apply settings, deploy, and verify key production checks.

- Build command + output directory
- Environment variable setup
- Production URL + route verification
- Core user flow smoke test

## ☁️ Supported Hosts

| Host | Best For | Highlights |
|---|---|---|
| **Vercel** ⚡ | React/Vite/Next apps | Fast previews, simple setup |
| **Netlify** 🦋 | Static/JAMstack apps | Easy static deploy workflow |
| **Render** 🔧 | Full-stack apps | Good service-oriented hosting |
| **GitHub Pages** 📄 | Docs/portfolio static sites | Repo-based free static hosting |
| **Cloudflare Pages** ☁️ | Static + edge delivery | Global CDN and edge integrations |
| **Railway** 🚂 | Full-stack/runtime apps | Quick service deploy experience |

## 🛠 Development

```bash
npm run dev
npm run test
npm run lint
npm run build
```

## 🧪 Quality Checks

Before shipping changes:

```bash
npm run lint
npm run test
npm run build
```

## 🔐 Notes

- Wizard progress is stored in browser `localStorage`.
- Keep secret values in environment variables, not in committed files.

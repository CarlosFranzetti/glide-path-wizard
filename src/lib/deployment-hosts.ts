export type DeploymentHostId =
  | "vercel"
  | "netlify"
  | "render"
  | "github-pages"
  | "cloudflare-pages"
  | "railway";

export interface DeploymentHostConfig {
  id: DeploymentHostId;
  name: string;
  description: string;
  bestFor: string;
  deployUrl: string;
  pricing: string;
  features: { name: string; included: boolean }[];
  buildCommand: string;
  outputDirectory: string;
  configFile?: string;
  configSnippet?: string;
  envNote: string;
}

export const DEPLOYMENT_HOSTS: DeploymentHostConfig[] = [
  {
    id: "vercel",
    name: "Vercel",
    description: "Easiest default for React/Vite projects with quick setup and previews.",
    bestFor: "Beginner-friendly React/Vite frontends",
    deployUrl: "https://vercel.com/new",
    pricing: "Free tier available",
    features: [
      { name: "Preview deployments", included: true },
      { name: "Custom domains", included: true },
      { name: "Serverless/Edge support", included: true },
      { name: "Managed DB included", included: false },
    ],
    buildCommand: "npm run build",
    outputDirectory: "dist",
    configFile: "vercel.json",
    configSnippet: `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}`,
    envNote: "Add your VITE_* values in Project Settings -> Environment Variables.",
  },
  {
    id: "netlify",
    name: "Netlify",
    description: "Simple static hosting with reliable SPA redirects.",
    bestFor: "Frontend-only static sites",
    deployUrl: "https://app.netlify.com/start",
    pricing: "Free tier available",
    features: [
      { name: "Preview deployments", included: true },
      { name: "Custom domains", included: true },
      { name: "Forms support", included: true },
      { name: "Managed DB included", included: false },
    ],
    buildCommand: "npm run build",
    outputDirectory: "dist",
    configFile: "netlify.toml",
    configSnippet: `[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`,
    envNote: "Set your variables in Site configuration -> Environment variables.",
  },
  {
    id: "render",
    name: "Render",
    description: "Good option if your project includes backend services.",
    bestFor: "Full-stack projects with API/server services",
    deployUrl: "https://dashboard.render.com/new",
    pricing: "Free tier available",
    features: [
      { name: "Background jobs", included: true },
      { name: "Custom domains", included: true },
      { name: "Managed DB options", included: true },
      { name: "Edge runtime", included: false },
    ],
    buildCommand: "npm run build",
    outputDirectory: "dist",
    configFile: "render.yaml",
    configSnippet: `services:
  - type: web
    name: my-app
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html`,
    envNote: "Set variables under Environment for the service in the Render dashboard.",
  },
  {
    id: "github-pages",
    name: "GitHub Pages",
    description: "Free static hosting directly from your GitHub repository.",
    bestFor: "Docs, portfolios, and simple static websites",
    deployUrl: "https://github.com",
    pricing: "Always free",
    features: [
      { name: "Free static hosting", included: true },
      { name: "Custom domains", included: true },
      { name: "Preview deployments", included: false },
      { name: "Backend/runtime support", included: false },
    ],
    buildCommand: "npm run build",
    outputDirectory: "dist",
    configFile: ".github/workflows/deploy.yml",
    configSnippet: `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist`,
    envNote: "Configure required values in repository Settings -> Secrets and variables.",
  },
  {
    id: "cloudflare-pages",
    name: "Cloudflare Pages",
    description: "Fast global static hosting with built-in CDN delivery.",
    bestFor: "Static SPAs that need fast global delivery",
    deployUrl: "https://dash.cloudflare.com/?to=/:account/pages",
    pricing: "Free tier available",
    features: [
      { name: "Global edge CDN", included: true },
      { name: "Custom domains", included: true },
      { name: "Preview deployments", included: true },
      { name: "Managed DB included", included: false },
    ],
    buildCommand: "npm run build",
    outputDirectory: "dist",
    configSnippet: `# Cloudflare Pages build settings
Framework preset: None (for Vite)
Build command: npm run build
Build output directory: dist
Node version: 18+`,
    envNote: "Set variables in your Pages project -> Settings -> Environment variables.",
  },
  {
    id: "railway",
    name: "Railway",
    description: "Simple deploy flow for apps that include running backend services.",
    bestFor: "Projects needing backend/runtime services",
    deployUrl: "https://railway.com/new",
    pricing: "Usage-based",
    features: [
      { name: "Service-based deploy", included: true },
      { name: "Runtime env management", included: true },
      { name: "Managed databases", included: true },
      { name: "Static-only optimization", included: false },
    ],
    buildCommand: "npm run build",
    outputDirectory: "dist",
    configSnippet: `# Railway static frontend (example)
Build command: npm run build
Start command: npx serve dist

# For full-stack apps, set your server start command instead.`,
    envNote: "Configure variables for each Railway service before deployment.",
  },
];

export const DEPLOYMENT_HOSTS_BY_ID = Object.fromEntries(
  DEPLOYMENT_HOSTS.map((host) => [host.id, host]),
) as Record<DeploymentHostId, DeploymentHostConfig>;

export function isDeploymentHostId(value: string): value is DeploymentHostId {
  return DEPLOYMENT_HOSTS.some((host) => host.id === value);
}

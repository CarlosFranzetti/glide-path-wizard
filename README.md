# Lovable Migration Assistant

A step-by-step wizard to help you migrate your Lovable projects to production hosting platforms.

## Migration Workflow

The migration process is structured into **4 phases**:

---

## Step 1: Pre-Migration

**Prepare your project for migration**

Before starting the migration, complete these essential preparation tasks:

### Critical Tasks (Required)

| Task | Description | Commands |
|------|-------------|----------|
| **Export your code from Lovable** | Download your project as a ZIP file from the Lovable dashboard | Upload via the wizard interface |
| **Backup database & environment variables** | Export your Supabase database and save all environment variables | `supabase db dump -f backup.sql`<br>`printenv \| grep -E '^(VITE_\|SUPABASE_\|API_)' > .env.backup` |

### Recommended Tasks

| Task | Description | Commands |
|------|-------------|----------|
| **Document third-party integrations** | List all APIs, services, and integrations your app uses | Manual documentation |
| **Test application locally** | Ensure your app runs correctly in a local development environment | `npm install`<br>`npm run dev`<br>`npm test` |

### Optional Tasks

| Task | Description | Commands |
|------|-------------|----------|
| **Review dependencies for compatibility** | Check that all npm packages are up-to-date and compatible | `npm outdated`<br>`npm update`<br>`npm audit` |

---

## Step 2: GitHub Setup

**Create and configure repository**

Set up a GitHub repository to host your migrated project code.

### Tasks

1. **Create a new repository on GitHub**
   - Choose repository name
   - Select visibility (Private or Public)
   - Initialize without README (you'll push existing code)

2. **Initialize and push your code**

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit from Lovable migration"

# Add remote origin
git remote add origin https://github.com/username/your-repo-name.git

# Push to main branch
git push -u origin main
```

---

## Step 3: Platform Selection

**Choose your hosting platform**

Select where you want to deploy your migrated application.

### Platform Comparison

| Platform | Best For | Free Tier | Key Features |
|----------|----------|-----------|--------------|
| **Vercel** ⭐ | React/Next.js apps | ✅ Yes | Zero-config deployment, Edge Functions, Preview deployments, Built-in analytics |
| **Netlify** | Static sites, JAMstack | ✅ Yes | Zero-config deployment, Edge Functions, Built-in forms, Preview deployments |
| **Render** | Full-stack apps | ✅ Yes | Managed databases, Background workers, Cron jobs, Preview deployments |
| **GitHub Pages** | Simple static sites | ✅ Always free | Zero-config deployment, Custom domains, HTTPS included |

### Platform Details

#### Vercel (Recommended)
- Best for React/Next.js apps with automatic deployments and edge functions
- Automatic optimizations for performance
- Instant preview deployments for every push

#### Netlify
- Great for static sites and JAMstack applications
- Built-in form handling out of the box
- Serverless functions support

#### Render
- Perfect if you need databases and background jobs
- Full-stack platform with managed PostgreSQL
- Cron job scheduling

#### GitHub Pages
- Ideal for simple static sites with no backend requirements
- Free hosting directly from your GitHub repository
- Limited to static content only

---

## Step 4: Deployment

**Configure and deploy your app**

### Build Configuration

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

### Environment Variables

Configure your environment variables in your chosen platform's dashboard:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your API endpoint URL |
| `VITE_SUPABASE_URL` | Supabase project URL (if applicable) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key (if applicable) |

### Deploy

1. Connect your GitHub repository to your chosen platform
2. Configure build settings (usually auto-detected)
3. Add environment variables
4. Deploy!

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

---

## Project Info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

**Use Lovable**: Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

**Use your preferred IDE**: Clone this repo and push changes. Changes will sync to Lovable.

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run dev
```

## Deployment

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share → Publish.

## Custom Domain

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

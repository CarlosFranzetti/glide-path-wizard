import { useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Check,
  ExternalLink,
  Settings,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CodeBlock from "../CodeBlock";

interface DeploymentStepProps {
  onBack: () => void;
  selectedPlatform: string;
}

interface EnvVar {
  key: string;
  value: string;
  visible: boolean;
}

const platformConfigs: Record<string, { name: string; deployUrl: string; configCode: string }> = {
  vercel: {
    name: "Vercel",
    deployUrl: "https://vercel.com/new",
    configCode: `// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}`,
  },
  netlify: {
    name: "Netlify",
    deployUrl: "https://app.netlify.com/start",
    configCode: `# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`,
  },
  render: {
    name: "Render",
    deployUrl: "https://dashboard.render.com/new/static",
    configCode: `# render.yaml
services:
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
  "github-pages": {
    name: "GitHub Pages",
    deployUrl: "https://github.com",
    configCode: `# .github/workflows/deploy.yml
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
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist`,
  },
};

const DeploymentStep = ({ onBack, selectedPlatform }: DeploymentStepProps) => {
  const [envVars, setEnvVars] = useState<EnvVar[]>([
    { key: "VITE_API_URL", value: "", visible: false },
  ]);
  const [isDeployed, setIsDeployed] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const config = platformConfigs[selectedPlatform] || platformConfigs.vercel;

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "", visible: false }]);
  };

  const removeEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const updateEnvVar = (index: number, field: "key" | "value", value: string) => {
    const updated = [...envVars];
    updated[index][field] = value;
    setEnvVars(updated);
  };

  const toggleVisibility = (index: number) => {
    const updated = [...envVars];
    updated[index].visible = !updated[index].visible;
    setEnvVars(updated);
  };

  if (isDeployed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8 py-8"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/20"
          >
            <PartyPopper className="h-12 w-12 text-success" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-foreground"
          >
            Deployment Initiated! 🚀
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-lg text-muted-foreground max-w-md"
          >
            Your application is being deployed to {config.name}.
          </motion.p>
        </div>

        {/* Post-Deployment Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          <div className="bg-muted/50 p-4 border-b border-border flex items-center gap-3">
            <Check className="h-5 w-5 text-foreground" />
            <span className="font-medium text-foreground">Post-Deployment Verification</span>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Before celebrating, verify everything works correctly:
            </p>
            
            {/* Deployment URL input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Your deployment URL:
              </label>
              <div className="flex gap-2">
                <Input
                  value={deploymentUrl}
                  onChange={(e) => setDeploymentUrl(e.target.value)}
                  placeholder="https://your-app.vercel.app"
                  className="flex-1"
                />
                {deploymentUrl && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(deploymentUrl, "_blank")}
                    className="gap-2"
                  >
                    Open
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3 pt-4">
              <p className="text-sm font-medium text-foreground">Verify these critical items:</p>
              <div className="space-y-2.5">
                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <input type="checkbox" className="mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Site loads without errors</p>
                    <p className="text-xs text-muted-foreground">Check browser console for errors</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <input type="checkbox" className="mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Navigation and routing work</p>
                    <p className="text-xs text-muted-foreground">Test all pages and links</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <input type="checkbox" className="mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Environment variables are working</p>
                    <p className="text-xs text-muted-foreground">API calls and external services function</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <input type="checkbox" className="mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Database connections work (if applicable)</p>
                    <p className="text-xs text-muted-foreground">Test data loading and updates</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <input type="checkbox" className="mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Key features work as expected</p>
                    <p className="text-xs text-muted-foreground">Test critical user workflows</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="mt-6 p-4 rounded-lg bg-warning/5 border border-warning/30">
              <p className="text-sm font-medium text-foreground mb-2">⚠️ If Something's Wrong:</p>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• Check build logs on {config.name} dashboard</li>
                <li>• Verify environment variables are set correctly</li>
                <li>• Ensure build command and output directory match your local setup</li>
                <li>• Check that all dependencies are in package.json</li>
                <li>• Review {config.name} documentation for troubleshooting</li>
              </ul>
            </div>

            {/* Mark as verified */}
            <div className="flex items-center justify-center pt-4">
              <button
                onClick={() => setIsVerified(true)}
                disabled={!deploymentUrl}
                className="flex items-center gap-2 rounded-lg border-2 border-success/30 bg-success/5 px-6 py-3 text-success hover:bg-success/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-5 w-5" />
                <span className="font-medium">Everything works! Mark as complete</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Success message */}
        {isVerified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <h3 className="text-2xl font-bold text-success mb-3">
              Migration Complete! 🎉
            </h3>
            <p className="text-muted-foreground mb-6">
              Your application is live and verified on {config.name}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="hero" size="lg" className="gap-2" onClick={() => window.open(deploymentUrl, "_blank")}>
                View Your Live App
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => setIsDeployed(false)}>
                Back to Settings
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Deploy to {config.name}
        </h2>
        <p className="mt-2 text-muted-foreground">
          Configure your deployment settings and launch your application.
        </p>
      </div>

      {/* Platform configuration */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="bg-muted/50 p-4 border-b border-border flex items-center gap-3">
          <Settings className="h-5 w-5 text-foreground" />
          <span className="font-medium text-foreground">Build Configuration</span>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Add this configuration file to your project root, commit it, and push to GitHub:
            </p>
            <CodeBlock code={config.configCode} language="yaml" />
          </div>
          
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-sm font-medium text-foreground mb-2">📝 Don't forget:</p>
            <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>Create the config file in your project root</li>
              <li>Commit: <code className="text-xs bg-background px-1 rounded">git add . && git commit -m "Add deployment config"</code></li>
              <li>Push: <code className="text-xs bg-background px-1 rounded">git push</code></li>
            </ol>
          </div>
        </div>
      </div>

      {/* Environment variables */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="bg-muted/50 p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-foreground" />
            <span className="font-medium text-foreground">Environment Variables</span>
          </div>
          <Button variant="outline" size="sm" onClick={addEnvVar} className="gap-1">
            <Plus className="h-4 w-4" />
            Add Variable
          </Button>
        </div>
        <div className="p-6 space-y-3">
          {envVars.map((envVar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Input
                value={envVar.key}
                onChange={(e) => updateEnvVar(index, "key", e.target.value)}
                placeholder="VARIABLE_NAME"
                className="font-mono flex-1"
              />
              <span className="text-muted-foreground">=</span>
              <div className="relative flex-1">
                <Input
                  type={envVar.visible ? "text" : "password"}
                  value={envVar.value}
                  onChange={(e) => updateEnvVar(index, "value", e.target.value)}
                  placeholder="value"
                  className="font-mono pr-10"
                />
                <button
                  onClick={() => toggleVisibility(index)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {envVar.visible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <button
                onClick={() => removeEnvVar(index)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Deploy action */}
      <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
        <Rocket className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Ready to Launch?
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Click the button below to open {config.name} and complete your deployment.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="hero"
            size="xl"
            onClick={() => window.open(config.deployUrl, "_blank")}
            className="gap-2"
          >
            Deploy to {config.name}
            <ExternalLink className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Completion */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => setIsDeployed(true)}
          className="flex items-center gap-2 rounded-lg border-2 border-success/30 bg-success/5 px-6 py-3 text-success hover:bg-success/10 transition-colors"
        >
          <Check className="h-5 w-5" />
          <span className="font-medium">I've completed the deployment</span>
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </motion.div>
  );
};

export default DeploymentStep;

import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Github, ExternalLink, Check, ArrowRight, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CodeBlock from "../CodeBlock";

interface GitHubSetupStepProps {
  onNext: () => void;
  onBack: () => void;
}

const GitHubSetupStep = ({ onNext, onBack }: GitHubSetupStepProps) => {
  const [repoName, setRepoName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);
  const [hasGit, setHasGit] = useState<boolean | null>(null);

  const checkGitCommands = `# Check if your project already has Git initialized
git status

# If you see "not a git repository":
# ➡️ You need to initialize Git (see commands below)

# If you see branch info and file status:
# ➡️ You already have Git! Check if you have a remote:
git remote -v

# If you see a GitHub URL:
# ➡️ Your code might already be on GitHub!`;

  const initCommandsNoGit = `# Initialize git repository (first time)
git init

# Add all files to Git
git add .

# Create your first commit
git commit -m "Initial commit"

# Add your new GitHub repository as remote
git remote add origin https://github.com/username/${repoName || "my-project"}.git

# Push to main branch
git push -u origin main`;

  const initCommandsHasGit = `# If you already have commits but no remote:
git remote add origin https://github.com/username/${repoName || "my-project"}.git
git push -u origin main

# If you already have a remote but need to change it:
git remote set-url origin https://github.com/username/${repoName || "my-project"}.git
git push -u origin main

# If you need to rename your branch to 'main':
git branch -M main
git push -u origin main`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">GitHub Repository Setup</h2>
        <p className="mt-2 text-muted-foreground">
          Create a new GitHub repository to host your migrated project.
        </p>
      </div>

      {/* Git Status Check */}
      <div className="rounded-xl border border-warning/30 bg-warning/5 overflow-hidden">
        <div className="bg-warning/10 p-4 border-b border-warning/30 flex items-center gap-3">
          <FolderGit2 className="h-5 w-5 text-warning" />
          <span className="font-medium text-foreground">Check Your Git Status</span>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            First, let's check if your project already has Git initialized:
          </p>
          <CodeBlock code={checkGitCommands} language="bash" />
          
          <div className="pt-2">
            <p className="text-sm font-medium text-foreground mb-3">
              Does your project already have Git initialized?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setHasGit(false)}
                className={`flex-1 rounded-lg border-2 px-4 py-3 transition-all ${
                  hasGit === false
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-medium text-foreground">No, I need to initialize Git</p>
                <p className="text-xs text-muted-foreground mt-1">
                  First time using Git with this project
                </p>
              </button>
              <button
                onClick={() => setHasGit(true)}
                className={`flex-1 rounded-lg border-2 px-4 py-3 transition-all ${
                  hasGit === true
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-medium text-foreground">Yes, I already have Git</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Just need to push to GitHub
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Repository Configuration */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="bg-muted/50 p-4 border-b border-border flex items-center gap-3">
          <Github className="h-5 w-5 text-foreground" />
          <span className="font-medium text-foreground">Repository Settings</span>
        </div>
        <div className="p-6 space-y-6">
          {/* Repo name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Repository Name
            </label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">github.com/username/</span>
              <Input
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="my-migrated-app"
                className="max-w-xs"
              />
            </div>
          </div>

          {/* Visibility toggle */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Visibility
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setIsPrivate(true)}
                className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${
                  isPrivate
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    isPrivate ? "border-primary bg-primary" : "border-border"
                  }`}
                />
                <div className="text-left">
                  <p className="font-medium text-foreground">Private</p>
                  <p className="text-sm text-muted-foreground">Only you can see this repository</p>
                </div>
              </button>
              <button
                onClick={() => setIsPrivate(false)}
                className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${
                  !isPrivate
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    !isPrivate ? "border-primary bg-primary" : "border-border"
                  }`}
                />
                <div className="text-left">
                  <p className="font-medium text-foreground">Public</p>
                  <p className="text-sm text-muted-foreground">Anyone can see this repository</p>
                </div>
              </button>
            </div>
          </div>

          {/* Create repo button */}
          <div className="flex items-center gap-4">
            <Button
              variant="hero"
              className="gap-2"
              onClick={() => window.open("https://github.com/new", "_blank")}
            >
              <Github className="h-4 w-4" />
              Create Repository on GitHub
              <ExternalLink className="h-4 w-4" />
            </Button>
            <button
              onClick={() => setSetupComplete(!setupComplete)}
              className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 transition-all ${
                setupComplete
                  ? "border-success bg-success/10 text-success"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  setupComplete ? "border-success bg-success" : "border-current"
                }`}
              >
                {setupComplete && <Check className="h-3 w-3 text-success-foreground" />}
              </div>
              <span className="text-sm font-medium">I've created the repository</span>
            </button>
          </div>
        </div>
      </div>

      {/* Git Commands */}
      {hasGit !== null && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/50 p-4 border-b border-border flex items-center gap-3">
            <FolderGit2 className="h-5 w-5 text-foreground" />
            <span className="font-medium text-foreground">
              {hasGit ? "Push Your Code to GitHub" : "Initialize Git & Push to GitHub"}
            </span>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              {hasGit 
                ? "Run these commands in your project directory to push to your new GitHub repository:"
                : "Run these commands in your project directory to initialize Git and push to GitHub:"
              }
            </p>
            <CodeBlock 
              code={hasGit ? initCommandsHasGit : initCommandsNoGit} 
              language="bash" 
            />
            
            {/* Troubleshooting tips */}
            <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
              <p className="text-sm font-medium text-foreground mb-2">💡 Common Issues:</p>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• <strong>Authentication failed:</strong> Use a Personal Access Token instead of password</li>
                <li>• <strong>Branch 'master' vs 'main':</strong> Use <code className="text-xs bg-background px-1 rounded">git branch -M main</code> to rename</li>
                <li>• <strong>Remote already exists:</strong> Use <code className="text-xs bg-background px-1 rounded">git remote set-url origin &lt;url&gt;</code></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Verification */}
      {setupComplete && (
        <div className="rounded-xl border border-success/30 bg-success/5 p-6">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Verify Your Code is on GitHub
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Before continuing, make sure you can see your code at:
              </p>
              <a
                href={`https://github.com/username/${repoName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                https://github.com/username/{repoName}
                <ExternalLink className="h-3 w-3" />
              </a>
              <p className="text-sm text-muted-foreground mt-3">
                ✅ Can you see your files and commits? Great! You're ready to continue.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="hero"
          size="lg"
          onClick={onNext}
          disabled={!setupComplete || !repoName || hasGit === null}
        >
          Continue to Platform Selection
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default GitHubSetupStep;

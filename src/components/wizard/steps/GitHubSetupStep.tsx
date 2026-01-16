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

  const initCommands = `# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit from Lovable migration"

# Add remote origin
git remote add origin https://github.com/username/${repoName || "my-project"}.git

# Push to main branch
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
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="bg-muted/50 p-4 border-b border-border flex items-center gap-3">
          <FolderGit2 className="h-5 w-5 text-foreground" />
          <span className="font-medium text-foreground">Initialize & Push Your Code</span>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Run these commands in your project directory to push your code to GitHub:
          </p>
          <CodeBlock code={initCommands} language="bash" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="hero"
          size="lg"
          onClick={onNext}
          disabled={!setupComplete || !repoName}
        >
          Continue to Platform Selection
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default GitHubSetupStep;

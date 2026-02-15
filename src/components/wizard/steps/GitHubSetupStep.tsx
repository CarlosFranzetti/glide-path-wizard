import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Github,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CodeBlock from "../CodeBlock";

interface GitHubSetupStepProps {
  onNext: () => void;
  onBack: () => void;
}

const GitHubSetupStep = ({ onNext, onBack }: GitHubSetupStepProps) => {
  const [githubUsername, setGithubUsername] = useState("");
  const [repoName, setRepoName] = useState("");
  const [hasGit, setHasGit] = useState<boolean | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);

  const owner = githubUsername || "username";
  const repository = repoName || "my-app";

  const commands = useMemo(() => {
    if (hasGit) {
      return `# Existing git repository\ngit remote -v\ngit remote add origin https://github.com/${owner}/${repository}.git\n# If remote already exists, use:\n# git remote set-url origin https://github.com/${owner}/${repository}.git\n\ngit push -u origin main`;
    }

    return `# Initialize and push\ngit init\ngit add .\ngit commit -m "Initial commit"\ngit branch -M main\ngit remote add origin https://github.com/${owner}/${repository}.git\ngit push -u origin main`;
  }, [hasGit, owner, repository]);

  const checks = {
    identity: githubUsername.trim().length > 0,
    repo: repoName.trim().length > 0,
    gitChoice: hasGit !== null,
    pushed: setupComplete,
  };

  const canContinue = Object.values(checks).every(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">Repository Setup</h2>
        <p className="mt-2 text-muted-foreground">
          We will create a GitHub repo and make sure your code is pushed correctly.
        </p>
      </div>

      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Step flow</p>
            <p>1) Enter GitHub username + repo name</p>
            <p>2) Pick whether git already exists locally</p>
            <p>3) Run the generated commands and confirm the push</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              GitHub username
            </label>
            <Input
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="octocat"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Repository name
            </label>
            <Input
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="my-app"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.open("https://github.com/login", "_blank")}
          >
            <Github className="h-4 w-4" />
            GitHub Login
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.open("https://github.com/new", "_blank")}
          >
            Create Repo
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-foreground">
            Does this project already have git initialized?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setHasGit(true)}
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                hasGit === true
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              Yes, it already has git
            </button>
            <button
              onClick={() => setHasGit(false)}
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                hasGit === false
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              No, initialize git
            </button>
          </div>
        </div>
      </div>

      {hasGit !== null && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border bg-muted/50 p-4">
            <p className="font-medium text-foreground">Run these commands</p>
          </div>
          <div className="p-6">
            <CodeBlock code={commands} language="bash" />
            <div className="mt-4 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground space-y-2">
              <p>
                Confirm your repo URL is reachable:
                <a
                  className="ml-1 text-primary hover:underline"
                  href={`https://github.com/${owner}/${repository}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/{owner}/{repository}
                </a>
              </p>
              <p>
                If push auth fails, use a GitHub Personal Access Token instead of password.
              </p>
            </div>
            <button
              onClick={() => setSetupComplete((value) => !value)}
              className={`mt-4 rounded-lg border px-4 py-2 text-sm transition-colors ${
                setupComplete
                  ? "border-success bg-success/10 text-success"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {setupComplete ? "Repository push confirmed" : "I pushed the repository"}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-success/20 bg-success/5 p-4">
        <p className="text-sm font-medium text-foreground mb-2">Main checks before continue</p>
        <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
          <div className="flex items-center gap-2">
            <Check className={`h-4 w-4 ${checks.identity ? "text-success" : "text-muted-foreground"}`} />
            GitHub username entered
          </div>
          <div className="flex items-center gap-2">
            <Check className={`h-4 w-4 ${checks.repo ? "text-success" : "text-muted-foreground"}`} />
            Repository name entered
          </div>
          <div className="flex items-center gap-2">
            <Check className={`h-4 w-4 ${checks.gitChoice ? "text-success" : "text-muted-foreground"}`} />
            Git status selected
          </div>
          <div className="flex items-center gap-2">
            <Check className={`h-4 w-4 ${checks.pushed ? "text-success" : "text-muted-foreground"}`} />
            Repository push confirmed
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button variant="hero" size="lg" onClick={onNext} disabled={!canContinue}>
          Continue to Deploy and Verify
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default GitHubSetupStep;

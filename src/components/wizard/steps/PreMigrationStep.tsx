import { motion } from "framer-motion";
import { CheckCircle2, CircleHelp, GitBranch, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChecklistSection from "../ChecklistSection";

interface PreMigrationStepProps {
  onNext: () => void;
  completedTasks: string[];
  onToggleTask: (taskId: string) => void;
}

const readinessTasks = [
  {
    id: "run-local",
    title: "Run the app locally",
    description: "Install dependencies and confirm the app starts without blocking errors.",
    importance: "critical" as const,
    code: "npm install\nnpm run dev",
  },
  {
    id: "confirm-env",
    title: "Confirm required environment variables",
    description: "Write down the variables you must set in your host dashboard.",
    importance: "critical" as const,
    code: "# Example\n# VITE_API_URL\n# VITE_AUTH_DOMAIN\n# DATABASE_URL (server-side only)",
  },
  {
    id: "protect-secrets",
    title: "Verify secrets are not tracked by git",
    description: "Ensure `.env` and secret files are ignored before pushing.",
    importance: "critical" as const,
    code: "git status\ncat .gitignore",
  },
  {
    id: "backup-optional",
    title: "Create an optional snapshot backup",
    description: "Create a quick archive before changing deployment settings.",
    importance: "optional" as const,
    code: "zip -r backup.zip . -x \"node_modules/*\" -x \".git/*\"",
  },
];

const requiredTaskIds = ["run-local", "confirm-env", "protect-secrets"];

const PreMigrationStep = ({
  onNext,
  completedTasks,
  onToggleTask,
}: PreMigrationStepProps) => {
  const criticalTasksComplete = requiredTaskIds.every((id) =>
    completedTasks.includes(id),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">Project Readiness</h2>
        <p className="mt-2 text-muted-foreground">
          We will check the main prerequisites before touching deployment.
        </p>
      </div>

      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">How this step works</h3>
            <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
              <li>Confirm the app runs locally (this catches most blockers early).</li>
              <li>List your production environment variables.</li>
              <li>Double-check secrets are excluded from git before pushing.</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div>
            <h3 className="font-semibold text-foreground">Main things to check</h3>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>• Local app starts and core page loads.</li>
              <li>• You know which env vars belong in hosting settings.</li>
              <li>• No API keys or passwords appear in tracked files.</li>
            </ul>
          </div>
        </div>
      </div>

      <ChecklistSection
        title="Readiness Checklist"
        description="Complete the critical tasks to unlock the next step"
        icon={<CheckCircle2 className="h-5 w-5" />}
        tasks={readinessTasks}
        completedTasks={completedTasks}
        onToggleTask={onToggleTask}
      />

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Progress is saved locally in your browser.</span>
        </div>
        <Button
          variant="hero"
          size="lg"
          onClick={onNext}
          disabled={!criticalTasksComplete}
        >
          Continue to Repository Setup
          <GitBranch className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PreMigrationStep;

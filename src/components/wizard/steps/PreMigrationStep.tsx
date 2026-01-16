import { motion } from "framer-motion";
import { Download, FileCode, GitBranch, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUploadZone from "../FileUploadZone";
import ChecklistSection from "../ChecklistSection";

interface PreMigrationStepProps {
  onNext: () => void;
  completedTasks: string[];
  onToggleTask: (taskId: string) => void;
  onFileUpload: (file: File) => void;
}

const preMigrationTasks = [
  {
    id: "export-code",
    title: "Export your code from Lovable",
    description: "Download your project as a ZIP file from the Lovable dashboard",
    importance: "critical" as const,
  },
  {
    id: "backup-db",
    title: "Backup database & environment variables",
    description: "Export your Supabase database and save all environment variables",
    importance: "critical" as const,
    code: `# Export Supabase database
supabase db dump -f backup.sql

# List all env variables
printenv | grep -E '^(VITE_|SUPABASE_|API_)' > .env.backup`,
  },
  {
    id: "document-integrations",
    title: "Document third-party integrations",
    description: "List all APIs, services, and integrations your app uses",
    importance: "recommended" as const,
  },
  {
    id: "test-locally",
    title: "Test application locally",
    description: "Ensure your app runs correctly in a local development environment",
    importance: "recommended" as const,
    code: `# Install dependencies
npm install

# Start development server
npm run dev

# Run tests if available
npm test`,
  },
  {
    id: "review-deps",
    title: "Review dependencies for compatibility",
    description: "Check that all npm packages are up-to-date and compatible",
    importance: "optional" as const,
    code: `# Check for outdated packages
npm outdated

# Update packages
npm update

# Check for security vulnerabilities
npm audit`,
  },
];

const PreMigrationStep = ({
  onNext,
  completedTasks,
  onToggleTask,
  onFileUpload,
}: PreMigrationStepProps) => {
  const criticalTasksComplete = ["export-code", "backup-db"].every((id) =>
    completedTasks.includes(id)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Pre-Migration Checklist</h2>
        <p className="mt-2 text-muted-foreground">
          Complete these tasks before migrating to ensure a smooth transition.
        </p>
      </div>

      {/* File Upload */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Upload Your Lovable Export
        </h3>
        <FileUploadZone onFileSelect={onFileUpload} />
      </div>

      {/* Checklist */}
      <ChecklistSection
        title="Preparation Tasks"
        description="Essential tasks before starting the migration"
        icon={<FileCode className="h-5 w-5" />}
        tasks={preMigrationTasks}
        completedTasks={completedTasks}
        onToggleTask={onToggleTask}
      />

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Your data is never uploaded to our servers</span>
        </div>
        <Button
          variant="hero"
          size="lg"
          onClick={onNext}
          disabled={!criticalTasksComplete}
        >
          Continue to GitHub Setup
          <GitBranch className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PreMigrationStep;

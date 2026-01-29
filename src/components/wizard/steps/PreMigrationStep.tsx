import { motion } from "framer-motion";
import { FileCode, GitBranch, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChecklistSection from "../ChecklistSection";

interface PreMigrationStepProps {
  onNext: () => void;
  completedTasks: string[];
  onToggleTask: (taskId: string) => void;
}

const preMigrationTasks = [
  {
    id: "export-code",
    title: "Export your project code",
    description: "Download or clone your project source code as a ZIP file",
    importance: "critical" as const,
  },
  {
    id: "check-database",
    title: "Check for database usage",
    description: "Verify if your application uses a database (Supabase, PostgreSQL, etc.)",
    importance: "critical" as const,
    code: `# Check your project for database configuration
# Look for these files/folders:
# - supabase/ folder
# - Database connection strings in .env files
# - Keywords: DATABASE_URL, SUPABASE_URL, PG_CONNECTION

# Common locations to check:
cat .env
cat .env.local
grep -r "DATABASE" .
grep -r "SUPABASE" .`,
  },
  {
    id: "backup-db",
    title: "Export database & environment variables (if applicable)",
    description: "If you found a database, export it along with all environment variables",
    importance: "critical" as const,
    code: `# Export Supabase database
supabase db dump -f backup.sql

# List all env variables
printenv | grep -E '^(VITE_|SUPABASE_|API_)' > .env.backup`,
  },
  {
    id: "document-integrations",
    title: "Document third-party integrations",
    description: "Use npm commands to explore and document all dependencies",
    importance: "recommended" as const,
    code: `# Here are the useful npm commands to see dependencies,
# from "quick peek" to "deep detective mode" 🕵️‍♂️

# 1️⃣ List installed dependencies (basic)
npm ls
# Shows the full dependency tree (can be... a lot 😅)

# Limit the depth:
npm ls --depth=0
# ➡️ Just your direct dependencies (sanity saver)

# 2️⃣ See dependencies from package.json
npm pkg get dependencies
npm pkg get devDependencies
# Clean, no installs involved

# 3️⃣ Check a specific package's dependency tree
npm ls react
# Or with depth control:
npm ls react --depth=1

# 4️⃣ See outdated dependencies
npm outdated
# Shows:
# - Current version
# - Wanted version
# - Latest version
# (a.k.a. "how behind am I really?")

# 5️⃣ Find why a package exists (very useful)
npm explain <package-name>
# Example:
npm explain lodash
# ➡️ Tells you which package pulled it in and why

# 6️⃣ Global dependencies (if needed)
npm ls -g --depth=0`,
  },
  {
    id: "create-documentation",
    title: "Create a migration documentation file",
    description: "Collect all database, env, dependencies, and API information into a single file",
    importance: "recommended" as const,
    code: `# Create a comprehensive migration documentation file

# Step 1: Create the file
touch migration-documentation.txt

# Step 2: Add database backup info
echo "=== DATABASE BACKUP ===" >> migration-documentation.txt
echo "Backup created: $(date)" >> migration-documentation.txt
ls -lh backup.sql >> migration-documentation.txt
echo "" >> migration-documentation.txt

# Step 3: Add environment variables
echo "=== ENVIRONMENT VARIABLES ===" >> migration-documentation.txt
cat .env.backup >> migration-documentation.txt
echo "" >> migration-documentation.txt

# Step 4: Add direct dependencies
echo "=== DIRECT DEPENDENCIES ===" >> migration-documentation.txt
npm ls --depth=0 >> migration-documentation.txt
echo "" >> migration-documentation.txt

# Step 5: Add outdated packages
echo "=== OUTDATED PACKAGES ===" >> migration-documentation.txt
npm outdated >> migration-documentation.txt
echo "" >> migration-documentation.txt

# Step 6: Add detailed explanations for key packages
# (You'll need to run this for each major package)
echo "=== PACKAGE EXPLANATIONS ===" >> migration-documentation.txt
echo "--- React ---" >> migration-documentation.txt
npm explain react >> migration-documentation.txt
echo "" >> migration-documentation.txt
echo "--- Vite ---" >> migration-documentation.txt
npm explain vite >> migration-documentation.txt
echo "" >> migration-documentation.txt

# Step 7: Document APIs and services manually
echo "=== THIRD-PARTY APIS & SERVICES ===" >> migration-documentation.txt
echo "List your APIs, authentication services, payment processors, etc." >> migration-documentation.txt
echo "" >> migration-documentation.txt

# Optional: Search for API endpoints in code
echo "=== API ENDPOINTS FOUND IN CODE ===" >> migration-documentation.txt
grep -r "https://" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v "node_modules" >> migration-documentation.txt

# View the final documentation
cat migration-documentation.txt`,
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
    id: "create-zip",
    title: "Create project archive",
    description: "ZIP your project folder for backup and transfer (after all checks are complete)",
    importance: "recommended" as const,
    code: `# Create a ZIP archive of your project
# Make sure to exclude node_modules and other unnecessary files

# On macOS/Linux:
zip -r project-backup.zip . -x "node_modules/*" -x ".git/*" -x "dist/*" -x "build/*"

# On Windows (PowerShell):
# Compress-Archive -Path . -DestinationPath project-backup.zip -Exclude node_modules,dist,build,.git

# Verify the archive was created
ls -lh project-backup.zip`,
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
}: PreMigrationStepProps) => {
  const criticalTasksComplete = ["check-database", "backup-db"].every((id) =>
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

      {/* Documentation Notice */}
      <div className="rounded-xl border border-warning/30 bg-warning/5 p-6">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-warning mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Documentation Best Practice
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Create a comprehensive <strong>migration-documentation.txt</strong> file containing:
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>Database backup information and env variables</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>Complete dependency tree and package explanations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>All third-party APIs and services used</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>API endpoints found in your codebase</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              This file will be invaluable during deployment and troubleshooting! 📝
            </p>
          </div>
        </div>
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
          <span>Your data stays local and secure</span>
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

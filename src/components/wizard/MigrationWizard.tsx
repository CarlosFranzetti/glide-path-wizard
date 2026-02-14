import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ProgressIndicator from "./ProgressIndicator";
import PreMigrationStep from "./steps/PreMigrationStep";
import GitHubSetupStep from "./steps/GitHubSetupStep";
import PlatformSelectionStep from "./steps/PlatformSelectionStep";
import DeploymentStep from "./steps/DeploymentStep";
import { useWizardPersistence } from "@/hooks/use-wizard-persistence";

const steps = [
  {
    id: 1,
    title: "Pre-Migration",
    description: "Prepare your project for migration",
  },
  {
    id: 2,
    title: "GitHub Setup",
    description: "Create and configure repository",
  },
  {
    id: 3,
    title: "Platform Selection",
    description: "Choose your hosting platform",
  },
  {
    id: 4,
    title: "Deployment",
    description: "Configure and deploy your app",
  },
];

const MigrationWizard = () => {
  const {
    currentStep,
    completedTasks,
    selectedPlatform,
    hasExistingProgress,
    setCurrentStep,
    setCompletedTasks,
    setSelectedPlatform,
    resetWizard,
  } = useWizardPersistence();

  const [showResumeDialog, setShowResumeDialog] = useState(hasExistingProgress);

  const handleToggleTask = (taskId: string) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Resume Progress Dialog */}
      <AlertDialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resume Previous Progress?</AlertDialogTitle>
            <AlertDialogDescription>
              You were on <strong>Step {currentStep}: {steps[currentStep - 1]?.title}</strong> with{" "}
              {completedTasks.length} task{completedTasks.length !== 1 ? "s" : ""} completed.
              Would you like to continue where you left off?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                resetWizard();
                setShowResumeDialog(false);
              }}
            >
              Start Fresh
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowResumeDialog(false)}>
              Resume Progress
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Migration Assistant</h1>
              <p className="text-xs text-muted-foreground">Deploy to Production</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </div>
            {/* Reset button with confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Reset progress"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset All Progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear all completed tasks, selections, and return you to Step 1.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={resetWizard}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
          {/* Sidebar with progress */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 font-semibold text-foreground">Progress</h2>
              <ProgressIndicator steps={steps} currentStep={currentStep} />
            </div>
          </aside>

          {/* Main content area */}
          <div className="min-h-[600px]">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <PreMigrationStep
                  key="step-1"
                  onNext={nextStep}
                  completedTasks={completedTasks}
                  onToggleTask={handleToggleTask}
                />
              )}
              {currentStep === 2 && (
                <GitHubSetupStep
                  key="step-2"
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {currentStep === 3 && (
                <PlatformSelectionStep
                  key="step-3"
                  onNext={nextStep}
                  onBack={prevStep}
                  onSelectPlatform={setSelectedPlatform}
                />
              )}
              {currentStep === 4 && (
                <DeploymentStep
                  key="step-4"
                  onBack={prevStep}
                  selectedPlatform={selectedPlatform}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MigrationWizard;

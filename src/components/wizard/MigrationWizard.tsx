import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket } from "lucide-react";
import ProgressIndicator from "./ProgressIndicator";
import PreMigrationStep from "./steps/PreMigrationStep";
import GitHubSetupStep from "./steps/GitHubSetupStep";
import PlatformSelectionStep from "./steps/PlatformSelectionStep";
import DeploymentStep from "./steps/DeploymentStep";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");

  const handleToggleTask = (taskId: string) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    handleToggleTask("export-code");
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
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

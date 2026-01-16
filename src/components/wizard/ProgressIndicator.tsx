import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const ProgressIndicator = ({ steps, currentStep }: ProgressIndicatorProps) => {
  return (
    <div className="relative">
      {/* Progress line */}
      <div className="absolute left-6 top-6 h-[calc(100%-48px)] w-0.5 bg-border" />
      <motion.div
        className="absolute left-6 top-6 w-0.5 gradient-hero origin-top"
        initial={{ height: 0 }}
        animate={{ height: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      <div className="space-y-6">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <motion.div
              key={step.id}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Step circle */}
              <motion.div
                className={cn(
                  "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted && "border-primary bg-primary",
                  isActive && "border-primary bg-primary/10 shadow-glow",
                  !isCompleted && !isActive && "border-border bg-background"
                )}
                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-primary-foreground" />
                ) : (
                  <span
                    className={cn(
                      "text-sm font-bold",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.id}
                  </span>
                )}
              </motion.div>

              {/* Step content */}
              <div className="pt-2">
                <h3
                  className={cn(
                    "font-semibold transition-colors",
                    isActive && "text-foreground",
                    isCompleted && "text-primary",
                    !isCompleted && !isActive && "text-muted-foreground"
                  )}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;

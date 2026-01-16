import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";

interface Task {
  id: string;
  title: string;
  description: string;
  importance: "critical" | "recommended" | "optional";
  code?: string;
}

interface ChecklistSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tasks: Task[];
  completedTasks: string[];
  onToggleTask: (taskId: string) => void;
}

const importanceConfig = {
  critical: {
    label: "Critical",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  recommended: {
    label: "Recommended",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  optional: {
    label: "Optional",
    className: "bg-muted text-muted-foreground border-border",
  },
};

const ChecklistSection = ({
  title,
  description,
  icon,
  tasks,
  completedTasks,
  onToggleTask,
}: ChecklistSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const completedCount = tasks.filter((t) =>
    completedTasks.includes(t.id)
  ).length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-4 p-5 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-medium text-foreground">
              {completedCount}/{tasks.length}
            </span>
            <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full gradient-hero"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      {/* Tasks */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="divide-y divide-border">
              {tasks.map((task) => {
                const isCompleted = completedTasks.includes(task.id);
                const isTaskExpanded = expandedTask === task.id;
                const config = importanceConfig[task.importance];

                return (
                  <div key={task.id} className="bg-background/50">
                    <div className="flex items-start gap-4 p-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all",
                          isCompleted
                            ? "border-primary bg-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-medium transition-all",
                              isCompleted && "line-through text-muted-foreground"
                            )}
                          >
                            {task.title}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase",
                              config.className
                            )}
                          >
                            {config.label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      </div>

                      {/* Expand button */}
                      {task.code && (
                        <button
                          onClick={() =>
                            setExpandedTask(isTaskExpanded ? null : task.id)
                          }
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Info className="h-3.5 w-3.5" />
                          {isTaskExpanded ? "Hide" : "Show"} code
                        </button>
                      )}
                    </div>

                    {/* Code block */}
                    <AnimatePresence>
                      {isTaskExpanded && task.code && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden px-4 pb-4"
                        >
                          <CodeBlock code={task.code} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChecklistSection;

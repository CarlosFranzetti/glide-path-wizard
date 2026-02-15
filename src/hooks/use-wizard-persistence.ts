import { useState, useEffect, useCallback } from "react";
import {
  type DeploymentHostId,
  isDeploymentHostId,
} from "@/lib/deployment-hosts";

const STORAGE_KEY = "migration-wizard-state";
const MAX_STEP = 3;

interface WizardState {
  currentStep: number;
  completedTasks: string[];
  selectedPlatform: DeploymentHostId | "";
  repoName: string;
  lastUpdated: number;
}

const defaultState: WizardState = {
  currentStep: 1,
  completedTasks: [],
  selectedPlatform: "",
  repoName: "",
  lastUpdated: Date.now(),
};

function clampStep(step: number): number {
  if (step < 1) return 1;
  if (step > MAX_STEP) return MAX_STEP;
  return step;
}

function loadState(): WizardState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;

    const parsed = JSON.parse(stored) as Partial<WizardState>;
    const rawStep = typeof parsed.currentStep === "number" ? parsed.currentStep : 1;
    const selectedPlatform =
      typeof parsed.selectedPlatform === "string" && isDeploymentHostId(parsed.selectedPlatform)
        ? parsed.selectedPlatform
        : "";

    return {
      ...defaultState,
      ...parsed,
      currentStep: clampStep(rawStep),
      completedTasks: Array.isArray(parsed.completedTasks) ? parsed.completedTasks : [],
      selectedPlatform,
      repoName: typeof parsed.repoName === "string" ? parsed.repoName : "",
    };
  } catch {
    return defaultState;
  }
}

function saveState(state: WizardState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, lastUpdated: Date.now() }),
    );
  } catch {
    // Storage full or unavailable.
  }
}

export function useWizardPersistence() {
  const [state, setState] = useState<WizardState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setCurrentStep = useCallback(
    (step: number | ((prev: number) => number)) => {
      setState((prev) => ({
        ...prev,
        currentStep: clampStep(typeof step === "function" ? step(prev.currentStep) : step),
      }));
    },
    [],
  );

  const setCompletedTasks = useCallback(
    (tasks: string[] | ((prev: string[]) => string[])) => {
      setState((prev) => ({
        ...prev,
        completedTasks:
          typeof tasks === "function" ? tasks(prev.completedTasks) : tasks,
      }));
    },
    [],
  );

  const setSelectedPlatform = useCallback((platform: DeploymentHostId | "") => {
    setState((prev) => ({ ...prev, selectedPlatform: platform }));
  }, []);

  const setRepoName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, repoName: name }));
  }, []);

  const resetWizard = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasExistingProgress =
    state.currentStep > 1 ||
    state.completedTasks.length > 0 ||
    state.selectedPlatform !== "";

  return {
    currentStep: state.currentStep,
    completedTasks: state.completedTasks,
    selectedPlatform: state.selectedPlatform,
    repoName: state.repoName,
    hasExistingProgress,
    setCurrentStep,
    setCompletedTasks,
    setSelectedPlatform,
    setRepoName,
    resetWizard,
  };
}

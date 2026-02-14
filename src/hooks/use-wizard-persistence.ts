import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "migration-wizard-state";

interface WizardState {
  currentStep: number;
  completedTasks: string[];
  selectedPlatform: string;
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

function loadState(): WizardState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;
    const parsed = JSON.parse(stored) as WizardState;
    // Validate shape
    if (
      typeof parsed.currentStep !== "number" ||
      !Array.isArray(parsed.completedTasks) ||
      typeof parsed.selectedPlatform !== "string"
    ) {
      return defaultState;
    }
    return parsed;
  } catch {
    return defaultState;
  }
}

function saveState(state: WizardState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, lastUpdated: Date.now() })
    );
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function useWizardPersistence() {
  const [state, setState] = useState<WizardState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setCurrentStep = useCallback((step: number | ((prev: number) => number)) => {
    setState((prev) => ({
      ...prev,
      currentStep: typeof step === "function" ? step(prev.currentStep) : step,
    }));
  }, []);

  const setCompletedTasks = useCallback(
    (tasks: string[] | ((prev: string[]) => string[])) => {
      setState((prev) => ({
        ...prev,
        completedTasks:
          typeof tasks === "function" ? tasks(prev.completedTasks) : tasks,
      }));
    },
    []
  );

  const setSelectedPlatform = useCallback((platform: string) => {
    setState((prev) => ({ ...prev, selectedPlatform: platform }));
  }, []);

  const setRepoName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, repoName: name }));
  }, []);

  const resetWizard = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasExistingProgress = state.currentStep > 1 || state.completedTasks.length > 0;

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

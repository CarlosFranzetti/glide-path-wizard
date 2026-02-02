import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MigrationWizard from "@/components/wizard/MigrationWizard";

describe("MigrationWizard", () => {
  it("renders the first step with a disabled continue button", () => {
    render(<MigrationWizard />);

    expect(screen.getByText("Migration Assistant")).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: /continue to github setup/i });
    expect(continueButton).toBeDisabled();
  });
});

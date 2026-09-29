import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test/axe";
import { Button } from "./Button";

describe("Button", () => {
  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
  });

  it("is disabled and marked busy while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards refs and extra props", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} variant="danger" data-testid="del">
        Delete
      </Button>
    );
    expect(ref.current).toBe(screen.getByTestId("del"));
    expect(ref.current).toHaveClass("ui-button--danger");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button loading>Saving</Button>
      </>
    );
    await expectNoA11yViolations(container);
  });
});

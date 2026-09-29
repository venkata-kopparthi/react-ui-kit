import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "../test/axe";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("links the label, hint and error to the input", () => {
    render(<TextField label="Email" hint="We'll never share it." error="Enter a valid email." />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("We'll never share it. Enter a valid email.");
  });

  it("has no aria-invalid or description when there is nothing to describe", () => {
    render(<TextField label="Name" />);
    const input = screen.getByLabelText("Name");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("gives each field a unique id", () => {
    render(
      <>
        <TextField label="First" />
        <TextField label="Last" />
      </>
    );
    expect(screen.getByLabelText("First").id).not.toBe(screen.getByLabelText("Last").id);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <>
        <TextField label="Email" required hint="Work email" />
        <TextField label="Password" type="password" error="Too short" />
      </>
    );
    await expectNoA11yViolations(container);
  });
});

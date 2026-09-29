import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test/axe";
import { Tabs } from "./Tabs";

const tabs = [
  { id: "overview", label: "Overview", content: "Overview content" },
  { id: "billing", label: "Billing", content: "Billing content", disabled: true },
  { id: "team", label: "Team", content: "Team content" },
  { id: "logs", label: "Logs", content: "Logs content" },
];

describe("Tabs", () => {
  it("shows the first tab and only makes the selected tab focusable", () => {
    render(<Tabs label="Settings" tabs={tabs} />);
    const overview = screen.getByRole("tab", { name: "Overview" });
    expect(overview).toHaveAttribute("aria-selected", "true");
    expect(overview).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Team" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tabpanel", { name: "Overview" })).toHaveTextContent("Overview content");
  });

  it("moves with arrow keys, skips disabled tabs and wraps around", async () => {
    const onChange = vi.fn();
    render(<Tabs label="Settings" tabs={tabs} onChange={onChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Overview" }));

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Team" })).toHaveFocus();
    expect(screen.getByRole("tabpanel", { name: "Team" })).toBeVisible();

    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();

    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Logs" })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith("logs");
  });

  it("supports Home and End", async () => {
    render(<Tabs label="Settings" tabs={tabs} defaultTab="team" />);
    await userEvent.click(screen.getByRole("tab", { name: "Team" }));
    await userEvent.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Logs" })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Tabs label="Settings" tabs={tabs} />);
    await expectNoA11yViolations(container);
  });
});

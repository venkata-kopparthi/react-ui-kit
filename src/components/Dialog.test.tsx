import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test/axe";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

function Example({ onClose = () => {} }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
    onClose();
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete project</Button>
      <Dialog
        open={open}
        onClose={close}
        title="Delete project?"
        description="This can't be undone."
        footer={
          <>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button variant="danger">Delete</Button>
          </>
        }
      />
    </>
  );
}

describe("Dialog", () => {
  it("opens with focus inside and is labelled by its title", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Delete project" }));

    const dialog = screen.getByRole("dialog", { name: "Delete project?" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription("This can't be undone.");
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  });

  it("keeps Tab focus inside the dialog", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Delete project" }));

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Delete" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Delete" })).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const onClose = vi.fn();
    render(<Example onClose={onClose} />);
    const trigger = screen.getByRole("button", { name: "Delete project" });
    await userEvent.click(trigger);

    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes on backdrop click unless dismissible is false", async () => {
    const onClose = vi.fn();
    const { rerender } = render(<Dialog open onClose={onClose} title="Hi" />);
    await userEvent.click(document.querySelector(".ui-dialog__backdrop")!);
    expect(onClose).toHaveBeenCalledOnce();

    rerender(<Dialog open onClose={onClose} title="Hi" dismissible={false} />);
    await userEvent.click(document.querySelector(".ui-dialog__backdrop")!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("has no accessibility violations", async () => {
    render(<Dialog open onClose={() => {}} title="Settings" description="Update your preferences." />);
    await expectNoA11yViolations(document.body);
  });
});

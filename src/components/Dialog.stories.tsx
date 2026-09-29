import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { TextField } from "./TextField";

const meta = {
  title: "Dialog",
  component: Dialog,
  args: { open: false, onClose: () => {}, title: "Delete project?" },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete project
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Delete project?"
          description="The project and its 14 environments will be removed. This can't be undone."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </>
          }
        />
      </>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Invite teammate</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Invite teammate"
          dismissible={false}
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Send invite</Button>
            </>
          }
        >
          <TextField label="Email" type="email" hint="They'll get a link that expires in 7 days." />
        </Dialog>
      </>
    );
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";

const meta = {
  title: "TextField",
  component: TextField,
  args: { label: "Email", placeholder: "you@company.com" },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}>{Story()}</div>],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: "Use your work email.", required: true } };
export const WithError: Story = {
  args: { defaultValue: "venkata@", error: "Enter a full email address, like name@company.com." },
};

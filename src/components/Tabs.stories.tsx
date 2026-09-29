import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./Tabs";

const meta = {
  title: "Tabs",
  component: Tabs,
  args: {
    label: "Project settings",
    tabs: [
      { id: "general", label: "General", content: "Project name, region and default branch." },
      { id: "members", label: "Members", content: "Who has access and what they can do." },
      { id: "billing", label: "Billing", content: "Plan and invoices.", disabled: true },
      { id: "danger", label: "Danger zone", content: "Transfer or delete the project." },
    ],
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const StartOnMembers: Story = { args: { defaultTab: "members" } };

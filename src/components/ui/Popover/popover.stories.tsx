import type { Meta, StoryObj } from "@storybook/react";
import Popover from ".";

const meta = {
  title: "UI/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "popover title",
    openElement: "open element or text",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "popover content",
  },
};

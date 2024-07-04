import Checkbox from "@/components/ui/Checkbox";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "checkbox",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "checkboxinoin",
  },
};

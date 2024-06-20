import Input from "@/components/ui/Input";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Input/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "label:",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "input",
  },
};

export const DefaultWithError: Story = {
  args: {
    errorMessage: "error message",
    name: "input with error",
  },
};

export const DefaultWithMask: Story = {
  args: {
    errorMessage: "error message",
    name: "input date (mm/yy)",
    mask: "__/__",
    placeholder: "mm/yy",
  },
};

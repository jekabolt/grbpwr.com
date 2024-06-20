import type { Meta, StoryObj } from "@storybook/react";
import Input from "@/components/ui/Input";

const meta = {
  title: "Input/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "default",
    label: "label",
    type: "text",
    name: "input",
  },
};

export const DefaultWithError: Story = {
  args: {
    id: "default-with-error",
    label: "label",
    type: "text",
    errorMessage: "error message",
    name: "input",
  },
};

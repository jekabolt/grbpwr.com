import Input from "@/components/ui/Input";
import { InputStyle } from "@/components/ui/Input/styles";
import type { Meta, StoryObj } from "@storybook/react";

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
    style: InputStyle.simple,
    label: "label",
    type: "text",
  },
};

export const DefaultWithError: Story = {
  args: {
    style: InputStyle.simple,
    label: "label",
    type: "text",
    errorMessage: "error message",
  },
};

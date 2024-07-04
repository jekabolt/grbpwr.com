import Input from "@/components/ui/Input";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "input",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultWithError: Story = {
  args: {
    // todo: add error props
    name: "input with error",
  },
};

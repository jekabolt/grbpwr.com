import type { Meta, StoryObj } from "@storybook/react";
import InputMask from ".";

const meta = {
  title: "InputMask/InputMask",
  component: InputMask,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "label:",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InputMask>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "input",
    mask: "__/__",
    placeholder: "mm/yy",
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import InputMask from ".";

const meta = {
  title: "UI/InputMask",
  component: InputMask,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "input",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InputMask>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mask: "__/__",
    placeholder: "mm/yy",
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { ButtonStyle } from "@/components/ui/Button/styles";
import Button from "@/components/ui/Button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  args: {
    style: ButtonStyle.default,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "default button",
  },
};

export const BigButton: Story = {
  args: {
    style: ButtonStyle.bigButton,
    children: "big button",
  },
};

export const UnderlinedButton: Story = {
  args: {
    style: ButtonStyle.underlinedButton,
    children: "underlined button",
  },
};

export const SimpleButton: Story = {
  args: {
    style: ButtonStyle.simpleButton,
    children: "simple button",
  },
};

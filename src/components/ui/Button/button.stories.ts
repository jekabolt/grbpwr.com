import type { Meta, StoryObj } from "@storybook/react";
import { LinkStyle } from "@/components/ui/Button/styles";
import Button from "@/components/ui/Button";

const meta = {
  title: "Button/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { href: "/" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    style: LinkStyle.default,
    children: "default button",
  },
};

export const BigButton: Story = {
  args: {
    style: LinkStyle.bigButton,
    children: "big button",
  },
};

export const UnderlinedButton: Story = {
  args: {
    style: LinkStyle.underlinedButton,
    children: "underlined button",
  },
};

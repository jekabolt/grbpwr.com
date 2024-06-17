import Checkbox from "@/components/ui/Checkbox";
import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxStyle } from "./styles";

const meta = {
  title: "Checkbox/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "default",
    style: CheckboxStyle.default,
    label: "checkbox label",
    name: "checkbox",
  },
};

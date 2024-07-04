import type { Meta, StoryObj } from "@storybook/react";
import Select from "@/components/ui/Select";

const meta = {
  title: "Select/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
  args: {
    label: "label:",
    items: [
      { label: "item 1", value: "1" },
      { label: "item 2", value: "2" },
      { label: "item 3", value: "3" },
      { label: "item 4", value: "4" },
      { label: "item 5", value: "5" },
    ],
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "select",
  },
};

export const DefaultWithError: Story = {
  args: {
    name: "select with error",
    errorMessage: "error message",
  },
};

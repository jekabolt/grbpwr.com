import type { Meta, StoryObj } from "@storybook/react";
import RadioGroup from ".";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
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
    name: "radio group",
    items: [
      { label: "item 1", value: "1" },
      { label: "item 2", value: "2" },
    ],
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultWithError: Story = {
  args: {
    // todo: add error props
    name: "radio group with error",
  },
};

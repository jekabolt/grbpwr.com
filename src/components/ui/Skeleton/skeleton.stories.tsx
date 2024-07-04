import type { Meta, StoryObj } from "@storybook/react";
import { CartProductsSkeleton } from ".";

const meta = {
  title: "UI/Skeleton",
  // todo: allow to create multiple skeletons and present them here
  component: CartProductsSkeleton,
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
  tags: ["autodocs"],
} satisfies Meta<typeof CartProductsSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

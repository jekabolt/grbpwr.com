import type { Preview } from "@storybook/react";
import React from "react";
import { FeatureMono } from "../src/fonts";
import { cn } from "../src/lib/utils";

import "../src/app/globals.css";

function ThemeDecorator(Story) {
  return (
    // TO-DO fix apply fonts for storybook
    <div className={cn("lightTheme", FeatureMono.className)}>
      <Story />
    </div>
  );
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [ThemeDecorator],
};

export default preview;

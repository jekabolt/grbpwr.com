import React from "react";
import type { Preview } from "@storybook/react";

import "../src/app/globals.css";

function ThemeDecorator(Story) {
  return (
    <div className="lightTheme">
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

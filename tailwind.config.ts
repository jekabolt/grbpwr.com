import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        bgColor: "var(--background)",
        textColor: "var(--text)",
        buttonTextColor: "var(--button-text)",
        highlightTextColor: "var(--highlight-text)",
        errorColor: "var(--error)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;

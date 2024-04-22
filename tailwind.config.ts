import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      screens: {
        "2xl": "1440px",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;

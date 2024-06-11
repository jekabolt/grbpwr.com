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
  plugins: [require("@tailwindcss/typography")],
};

module.exports = config;

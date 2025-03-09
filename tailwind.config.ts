const config = {
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        textColor: "var(--text)",
        textInactiveColor: "var(--inactive)",
        bgColor: "var(--background)",
        highlightColor: "var(--highlight)",
        errorColor: "var(--error)",
        buttonTextColor: "var(--button-text)",
        visitedLinkColor: "var(--visited-link)",
        acidColor: "var(--text-select)",
        overlay: "var(--overlay)",
      },
      fontSize: {
        textGiantSize: "var(--text-giant)",
        textGiantSmallSize: "var(--text-giant-small)",
        textBaseSize: "var(--text-base)",
      },
      keyframes: {
        loading: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' }
        },
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

module.exports = config;

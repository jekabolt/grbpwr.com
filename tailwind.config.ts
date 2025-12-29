const config = {
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        textColor: "var(--text)",
        textInactiveColor: "var(--inactive)",
        textInactiveColorAlpha: "var(--inactive-alpha)",
        bgColor: "var(--background)",
        highlightColor: "var(--highlight)",
        errorColor: "var(--error)",
        buttonTextColor: "var(--button-text)",
        visitedLinkColor: "var(--visited-link)",
        acidColor: "var(--text-select)",
        inverted: "var(--inverted)",
        overlay: "var(--overlay)",
      },
      fontSize: {
        textGiantSize: "var(--text-giant)",
        textGiantSmallSize: "var(--text-giant-small)",
        textBaseSize: "var(--text-base)",
      },
      keyframes: {
        loading: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "loading-reverse": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "infinite-loading": {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        threshold: {
          "0%": {
            filter: "grayscale(100%) contrast(200%) brightness(0.5)",
          },
          "100%": {
            filter: "grayscale(0%) contrast(100%) brightness(1)",
          },
        },
        "threshold-with-highlight": {
          "0%": {
            filter: "grayscale(100%) contrast(200%) brightness(0.5)",
          },
          "50%": {
            filter: "grayscale(50%) contrast(150%) brightness(0.75)",
          },
          "100%": {
            filter: "grayscale(0%) contrast(100%) brightness(1)",
          },
        },
      },
      animation: {
        threshold: "threshold 0.4s ease-out forwards",
        "threshold-highlight": "threshold-with-highlight 0.4s ease-out forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

module.exports = config;

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
        "highlight-flash": {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "0.6" },
        },
        "modal-fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "modal-fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
        "caret-blink": {
          "0%, 50%": { opacity: "1" },
          "50.01%, 100%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1s step-end infinite",
        threshold: "threshold 0.4s ease-out forwards",
        "threshold-highlight":
          "threshold-with-highlight 0.4s ease-out forwards",
        "highlight-flash": "highlight-flash 0.6s ease-out forwards",
        "modal-fade-in": "modal-fade-in 0.2s ease-out both",
        "modal-fade-out": "modal-fade-out 0.15s ease-in both",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

module.exports = config;

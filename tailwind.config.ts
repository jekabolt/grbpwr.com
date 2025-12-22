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
        "dialog-open": {
          "0%": {
            transform: "scale(1)",
            filter: "grayscale(0%) contrast(100%)",
          },
          "50%": {
            transform: "scale(1)",
            filter: "grayscale(100%) contrast(1000%) hue-rotate(220deg) saturate(150%)",
          },
          "100%": {
            transform: "scale(1)",
            filter: "grayscale(100%) contrast(1000%) hue-rotate(220deg) saturate(150%)",
          },
        },
        "overlay-fade-in": {
          "0%": { opacity: "0" },
          "50%": { opacity: "0.5" },
          "100%": { opacity: "1" },
        },
        "overlay-fade-in-reverse": {
          "0%": { opacity: "1" },
          "50%": { opacity: "0.5" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "dialog-open": "dialog-open 0.4s ease-out forwards",
        "overlay-fade-in": "overlay-fade-in 0.4s ease-out forwards",
        "dialog-close": "dialog-open 0.4s ease-in reverse forwards",
        "overlay-fade-out": "overlay-fade-in-reverse 0.4s ease-in forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

module.exports = config;

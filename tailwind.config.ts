/** @type {import('tailwindcss').Config} */

export default {
  theme: {
    extend: {
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
};

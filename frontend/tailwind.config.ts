import type { Config } from "tailwindcss";

// U-Fox brand palette (team brand sheet): #0B1F4D · #2563EB · #60A5FA · #E0F2FE · #FFFFFF
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B1F4D",
        brand: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
          light: "#60A5FA",
          soft: "#E8F2FE",
          tint: "#F4F9FF",
        },
        sky: {
          DEFAULT: "#EEF6FF",
          deep: "#E0F2FE",
          line: "#BBD8FB",
        },
        ink: {
          DEFAULT: "#0B1F4D",
          body: "#36486E",
          muted: "#4A5B80",
          faint: "#7D8DAD",
        },
        line: {
          DEFAULT: "#E6EEF9",
          subtle: "#F1F5FB",
        },
        sun: {
          DEFAULT: "#FFC83D",
          soft: "#FFF4D1",
          ink: "#7A5200",
        },
        chat: "#9BE07A",
        linegreen: "#06C755",
        income: "#12804F",
        expense: "#B42318",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "var(--font-sans)", "cursive"],
      },
      keyframes: {
        wiggle: { "0%,100%": { transform: "rotate(-3deg)" }, "50%": { transform: "rotate(3deg)" } },
        bob: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        pop: { "0%": { transform: "scale(.6)", opacity: "0" }, "70%": { transform: "scale(1.06)", opacity: "1" }, "100%": { transform: "scale(1)" } },
        typing: { "0%,60%,100%": { transform: "translateY(0)", opacity: ".4" }, "30%": { transform: "translateY(-4px)", opacity: "1" } },
      },
      animation: {
        wiggle: "wiggle .5s ease-in-out 2",
        bob: "bob 4s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        pop: "pop .35s ease-out both",
        typing: "typing 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

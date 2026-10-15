import type { Config } from "tailwindcss";

// Palette adapted from the MarketRadar design.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#13294B",
        brand: {
          DEFAULT: "#1F5FBF",
          dark: "#174A96",
          light: "#6FA8DC",
          soft: "#EAF2FC",
          tint: "#F5F9FF",
        },
        ink: {
          DEFAULT: "#13294B",
          body: "#33415A",
          muted: "#46546B",
          faint: "#5A667A",
        },
        line: {
          DEFAULT: "#E3E8EF",
          subtle: "#F1F4F8",
        },
        income: "#15803D",
        expense: "#B91C1C",
      },
      fontFamily: {
        sans: ["var(--font-prompt)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

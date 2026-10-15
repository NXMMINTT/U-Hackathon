import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        income: "#1DB446",
        expense: "#E03C3C",
      },
    },
  },
  plugins: [],
};

export default config;

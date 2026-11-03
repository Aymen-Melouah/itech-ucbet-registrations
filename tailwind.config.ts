import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dim: "rgba(255,255,255,.68)",
        line: "rgba(255,255,255,.78)",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        arabic: ["var(--font-cairo)", "var(--font-outfit)", "sans-serif"],
      },
      backgroundImage: {
        chevron:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='9' viewBox='0 0 14 9'%3E%3Cpath d='M1 1.5l6 6 6-6' fill='none' stroke='white' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
export default config;

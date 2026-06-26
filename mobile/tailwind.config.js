/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ===== Primary: Pink (WellMom brand color, replaces ErgoAlert's sky blue) =====
        primary: {
          DEFAULT: "#EC4899", // main brand pink — buttons, active tab, primary CTA
          dark: "#BE185D",    // headings, "WellMom" title text
          light: "#FBCFE8",   // light pink backgrounds, soft cards
        },
        // ===== Secondary: Purple accent (Self-Assessment icon, supporting headings) =====
        secondary: {
          DEFAULT: "#7C3AED",
          light: "#EDE9FE",
        },
        background: "#FFF5F9", // app background — soft pink tint
        surface: "#FFFFFF",     // card background
        border: "#F3D4E3",
        "text-primary": "#1F2937",
        "text-secondary": "#6B7280",
        // ===== Risk category colors (self-assessment result) =====
        "risk-low": "#16A34A",
        "risk-low-bg": "#DCFCE7",
        "risk-medium": "#F59E0B",
        "risk-medium-bg": "#FEF3C7",
        "risk-high": "#DC2626",
        "risk-high-bg": "#FEE2E2",
      },
    },
  },
  plugins: [],
};

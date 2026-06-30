/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ===== "Serene Glow" — design system dari Stitch AI, DESIGN.md jadi source of truth =====
        primary: {
          DEFAULT: "#B10E6B",
          container: "#D23284", // aksen lebih terang / gradient end
        },
        secondary: {
          DEFAULT: "#712AE2",
          container: "#8A4CFC",
        },
        background: "#FFF8F8",
        surface: "#FFFFFF",
        "surface-container": "#FFE8EE",
        "surface-container-low": "#FFF0F3",
        outline: "#8B7079",
        "outline-variant": "#DEBEC8",
        "text-primary": "#25181D",
        "text-secondary": "#574048",
        // ===== Risk category colors — traffic-light hijau/kuning/merah (medium TETAP amber) =====
        "risk-low": "#136B00",
        "risk-medium": "#B45309",
        "risk-high": "#BA1A1A",
      },
      borderRadius: {
        card: "24px",
        input: "16px",
      },
    },
  },
  plugins: [],
};


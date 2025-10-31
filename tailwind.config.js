/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#818cf8", // soft, pastel-like for hover or backgrounds
          DEFAULT: "#4F46E5", // main indigo, strong and professional
          dark: "#3730a3", // deep indigo for focus or active states
        },
        secondary: {
          light: "#f9a8d4", // soft pink for hover backgrounds or inputs
          DEFAULT: "#EC4899", // main vibrant pink
          dark: "#be185d", // rich pink/magenta for active states
        },
        accent: {
          light: "#fcd34d", // soft yellow for highlights
          DEFAULT: "#F59E0B", // bright amber for CTA, badges
          dark: "#b45309", // deep amber for hover/active states
        },
      },
    },
  },
  plugins: [],
};

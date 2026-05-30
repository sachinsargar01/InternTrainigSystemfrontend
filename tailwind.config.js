/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // tailwind.config.js
    extend: {
      keyframes: {
        scaleIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        scaleIn: "scaleIn 0.3s ease-out",
        fadeIn: "fadeIn 0.3s ease-in",
      },
    },
  },
  plugins: [],
};

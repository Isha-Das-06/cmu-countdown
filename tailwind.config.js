/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        "neon-cyan": "#00f3ff",
        "neon-purple": "#bc13fe",
      },
      fontFamily: {
        sans: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Orbitron", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "gradient-move": {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
      },
      animation: {
        "gradient-move": "gradient-move 15s ease infinite",
      },
    },
  },
  plugins: [],
};

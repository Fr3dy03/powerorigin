/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F4F1EA",
        surface: "#FFFCF7",
        forest: "#0F6670",
        deepgreen: "#102A43",
        leaf: "#2CB8A6",
        sage: "#DDEEEF",
        amber: "#E8894A",
        graphite: "#243447",
        secondary: "#667587",
        borderc: "#D7DEE5",
        critical: "#C9514A",
      },
      fontFamily: {
        heading: ["Manrope", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

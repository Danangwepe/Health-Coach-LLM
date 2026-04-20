/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:   ["Geist", "system-ui", "sans-serif"],
        serif:  ["Instrument Serif", "Georgia", "serif"],
      },
      colors: {
        brand: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted:   "#f8f8f7",
          border:  "#e8e7e4",
        },
      },
    },
  },
  plugins: [],
}

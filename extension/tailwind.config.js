/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        playwrite: ["Playwrite CU", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        comorant: ["Cormorant Garamond", "sans-serif"],
        pompiere: ["Pompiere", "sans-serif"],
        Teko: ["Teko", "sans-serif"],
      },
    },
  },
  plugins: [],
};

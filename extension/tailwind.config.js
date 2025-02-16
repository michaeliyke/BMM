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
      fontSize: {
        "xs/1": ".75rem", // 12px
        "xs/2": ".6875rem", // 11px
        "xs/3": ".625rem", // 10px
        "xs/4": ".5625rem", // 9px
        "xs/5": ".25rem", // 4px
        "xs/6": ".125rem", // 2px
        "xs/7": ".0625rem", // 1px
        "xs/8": ".03125rem", // 0.5px
        "xs/9": ".015625rem", // 0.25px
        "sm/1": ".9375rem", // 15px
        "sm/2": ".875rem", // 14px
        "sm/3": ".8125rem", // 13px
      },
      colors: {
        "light-blue": "#3A8DFF",
        "dark-blue": "#0B1E3F",
        "light-gray": "#F5F7FA",
        "dark-gray": "#7E8AA2",
        "light-yellow": "#FFD15C",
        "dark-yellow": "#FFB800",
        "light-red": "#FF5C5C",
        "dark-red": "#FF0000",
        "light-green": "#00D68F",
        "dark-green": "#00B887",
        "light-purple": "#8A63D2",
        "dark-purple": "#6D28D9",
        "light-pink": "#FF7C7C",
        "dark-pink": "#FF1D1D",
      },
      boxShadow: {
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      spacing: {
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
      },
      zIndex: {
        "-1": "-1",
      },
    },
    plugins: [],
  },
};

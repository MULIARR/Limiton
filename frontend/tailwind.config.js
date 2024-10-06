const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        normalGray: '#6a6b6c',
        lightGray: '#8f9092',
        darkGray: '#4c4c4c',
        modal: '#141516',
        modalElement: '#202022',
        darkSpace: '#07080a',
        customGreen: '#13cc7e',
        card: '#0b0c0e',
        cardBorder: '#262626',
        customRed: '#d43636',
        toast: "#ffffff",
        toastBorder: "#0b0c0c",
        DeDust: "#ffb304",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}


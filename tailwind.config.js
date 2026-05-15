/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel Decorative', 'serif'],
        questrial: ['Questrial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
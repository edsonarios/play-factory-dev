/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors:{
        plyrColor: '#00b2ff'
      },
      borderColor:{
        plyrColor: '#00b2ff'
      }
    },
  },
  plugins: [],
}

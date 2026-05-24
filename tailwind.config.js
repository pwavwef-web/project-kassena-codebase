/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        kassena: {
          green: '#14532d',
          gold: '#caa54a',
          orange: '#c96a2d',
          cream: '#f5eddc',
          bg: '#fffaf0',
        },
      },
    },
  },
  plugins: [],
}

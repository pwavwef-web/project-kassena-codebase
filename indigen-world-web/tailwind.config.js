/** @type {import('tailwindcss').Config} */
// Indigen World web — minimal brand token set. Extend, do not fork wholesale.
// The full legacy design system lives in docs/project-kasena-web/design-system.md.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0c172a',
        cream: '#f7f3ec',
        indigo: {
          DEFAULT: '#2d3a8c',
          600: '#2d3a8c',
          700: '#222c6e',
        },
        terracotta: {
          DEFAULT: '#c0573b',
          600: '#c0573b',
        },
        gold: '#d8a44a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

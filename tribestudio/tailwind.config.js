/** @type {import('tailwindcss').Config} */
// TribeStudio — workspace UI tokens (starter). Slightly cooler/neutral palette
// than the public site, tuned for dense dashboard surfaces.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0c172a',
        surface: '#f4f5f7',
        panel: '#ffffff',
        indigo: {
          DEFAULT: '#2d3a8c',
          600: '#2d3a8c',
          700: '#222c6e',
        },
        terracotta: '#c0573b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

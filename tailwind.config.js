/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        /* Legacy app palette — preserved so existing app screens keep working. */
        kassena: {
          indigo: '#1E365D',
          terracotta: '#B65A3A',
          kente: '#D4A017',
          plaster: '#F7F2E7',
          green: '#14532d',
          gold: '#caa54a',
          orange: '#c96a2d',
          cream: '#f5eddc',
          bg: '#fffaf0',
          dark: '#0f172a',
        },
        /* Project Kasena marketing brand system — full tonal scales. */
        indigo: {
          50: '#f2f6fc',
          100: '#e3ebf6',
          200: '#c3d4ea',
          300: '#90b0d6',
          400: '#5784bd',
          500: '#3461a1',
          600: '#274c85',
          700: '#1e365d',
          800: '#1a2f4f',
          900: '#152741',
          950: '#0c172a',
        },
        terracotta: {
          50: '#fcf4f0',
          100: '#f8e5db',
          200: '#f0c8b6',
          300: '#e5a387',
          400: '#d87a55',
          500: '#b65a3a',
          600: '#a14a2e',
          700: '#853a26',
          800: '#6b3022',
          900: '#572a1f',
          950: '#2f130e',
        },
        kente: {
          50: '#fdfaec',
          100: '#fbf1c6',
          200: '#f6e08a',
          300: '#f0c847',
          400: '#ebb01f',
          500: '#d69b00',
          600: '#b87b03',
          700: '#935907',
          800: '#7a460d',
          900: '#683a11',
          950: '#3d1f05',
        },
        savannah: {
          50: '#eff7f1',
          100: '#d8ecdd',
          200: '#b3d9bf',
          300: '#83bd96',
          400: '#519c6c',
          500: '#327f50',
          600: '#245c3b',
          700: '#1e4c32',
          800: '#193c29',
          900: '#143123',
          950: '#0a1b14',
        },
        cream: {
          DEFAULT: '#fbf7ee',
          50: '#fefdfa',
          100: '#fbf7ee',
          200: '#f5ecd8',
          300: '#ecdcbb',
          400: '#dfc593',
        },
        charcoal: {
          DEFAULT: '#111827',
          light: '#1f2937',
          muted: '#374151',
        },
        sand: {
          50: '#faf8f4',
          100: '#f3efe6',
          200: '#e7e0d1',
          300: '#d4c8b2',
          400: '#b8a888',
          500: '#9c8a68',
          600: '#7d6e51',
          700: '#615543',
          800: '#43392d',
          900: '#2a231b',
        },
      },
      fontFamily: {
        display: [
          '"Sora Variable"',
          '"Inter Variable"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        sans: [
          '"Inter Variable"',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        /* Kasem text — Inter Variable carries the African Latin Extended glyphs
           (Ɛ ɛ Ŋ ŋ Ɔ ɔ) plus the acute-accent vowels. */
        kasem: [
          '"Inter Variable"',
          'Inter',
          '"Noto Sans"',
          'ui-sans-serif',
          'sans-serif',
        ],
      },
      fontSize: {
        /* Fluid type scale (clamp). */
        'fluid-sm': ['clamp(0.85rem, 0.82rem + 0.15vw, 0.95rem)', { lineHeight: '1.6' }],
        'fluid-base': ['clamp(1rem, 0.96rem + 0.2vw, 1.125rem)', { lineHeight: '1.65' }],
        'fluid-lg': ['clamp(1.15rem, 1.05rem + 0.5vw, 1.4rem)', { lineHeight: '1.55' }],
        'fluid-xl': ['clamp(1.35rem, 1.2rem + 0.8vw, 1.85rem)', { lineHeight: '1.4' }],
        'fluid-2xl': ['clamp(1.7rem, 1.4rem + 1.5vw, 2.6rem)', { lineHeight: '1.2' }],
        'fluid-3xl': ['clamp(2.1rem, 1.6rem + 2.6vw, 3.6rem)', { lineHeight: '1.08' }],
        'fluid-4xl': ['clamp(2.6rem, 1.9rem + 3.6vw, 4.8rem)', { lineHeight: '1.02' }],
        'fluid-5xl': ['clamp(3rem, 2rem + 5vw, 6rem)', { lineHeight: '0.98' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      maxWidth: {
        prose: '68ch',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(17, 24, 39, 0.04), 0 4px 16px rgba(17, 24, 39, 0.06)',
        card: '0 2px 4px rgba(17, 24, 39, 0.04), 0 12px 32px rgba(30, 54, 93, 0.08)',
        lifted: '0 18px 48px rgba(30, 54, 93, 0.16)',
        glow: '0 0 0 1px rgba(214, 155, 0, 0.4), 0 8px 32px rgba(214, 155, 0, 0.22)',
        'inner-line': 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      },
      transitionTimingFunction: {
        emphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'emphasized-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      animation: {
        /* Legacy app animations — preserved. */
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-up-delayed': 'slideUp 0.5s ease-out 0.1s forwards',
        'slide-up-delayed-2': 'slideUp 0.5s ease-out 0.2s forwards',
        'slide-up-delayed-3': 'slideUp 0.5s ease-out 0.3s forwards',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        /* Marketing motion. */
        marquee: 'marquee 38s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        float: 'float 7s ease-in-out infinite',
        aurora: 'aurora 16s ease-in-out infinite alternate',
        shimmer: 'shimmer 2.4s linear infinite',
        'spin-slow': 'spin 26s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        aurora: {
          '0%': { transform: 'translate3d(-4%, -2%, 0) scale(1)', opacity: '0.55' },
          '100%': { transform: 'translate3d(4%, 3%, 0) scale(1.12)', opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(rgba(30,54,93,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(30,54,93,0.05) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}

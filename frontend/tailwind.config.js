/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ayurveda: {
          green: {
            50: '#f0fbf7',
            105: '#dcfef1',
            100: '#d9f5ea',
            200: '#b5ecd7',
            300: '#81deb9',
            400: '#46ca96',
            500: '#1b9d67', // A much smoother, richer Ayurvedic green
            605: '#169d67',
            600: '#128657',
            700: '#0c6d46',
            800: '#0a593a',
            900: '#084830',
          },
          saffron: {
            50: '#fdf8eb',
            100: '#faebd0',
            200: '#f5d59e',
            300: '#efba63',
            400: '#e89932',
            500: '#d97706', // Beautiful, rich saffron amber (less harsh than pure orange)
            600: '#b45309',
            700: '#923e12',
            800: '#78300f',
            900: '#63250f',
          },
          clay: {
            50: '#faf8f6',
            100: '#f3ece7',
            200: '#e4d5cc',
            300: '#ccb4a3',
            400: '#b08f77',
            500: '#9b765d',
            605: '#169d67',
            600: '#8d654d',
            700: '#75513d',
            800: '#604334',
            900: '#50392d',
          },
          cream: '#faf7e6',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        serif: ['Lora', 'Playfair Display', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}

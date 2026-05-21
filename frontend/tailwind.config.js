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
            50: '#f1f8f5',
            100: '#dcefe5',
            200: '#bce0cd',
            300: '#8ec9ab',
            400: '#5da983',
            500: '#3c8c65', // Main Ayurvedic green
            600: '#2e704f',
            700: '#255a40',
            800: '#1f4834',
            900: '#1a3c2c',
          },
          saffron: {
            50: '#fffbf0',
            100: '#feeed1',
            200: '#fcdba0',
            300: '#fac265',
            400: '#f7a233',
            500: '#f2851c', // Main Saffron Orange
            600: '#d96c14',
            700: '#b45212',
            800: '#8f4014',
            900: '#753513',
          },
          clay: {
            50: '#faf8f6',
            100: '#f3ece7',
            200: '#e4d5cc',
            300: '#ccb4a3',
            400: '#b08f77',
            500: '#9b765d',
            600: '#8d654d',
            700: '#75513d',
            800: '#604334',
            900: '#50392d',
          }
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

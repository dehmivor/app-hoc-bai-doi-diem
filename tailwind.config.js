/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0284c7',
          700: '#0369a1',
        },
        coin: {
          light: '#fef08a',
          DEFAULT: '#eab308',
          dark: '#ca8a04',
        },
        streak: {
          light: '#ffedd5',
          DEFAULT: '#f97316',
          dark: '#c2410c',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'bounce-short': 'bounce 0.8s ease-in-out 2',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 12px rgba(234, 179, 8, 0.6))' },
          '50%': { opacity: 0.8, filter: 'drop-shadow(0 0 4px rgba(234, 179, 8, 0.2))' },
        }
      }
    },
  },
  plugins: [],
}

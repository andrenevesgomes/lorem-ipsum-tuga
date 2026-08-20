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
        tuga: {
          green: '#046A38',
          red: '#DA291C',
          gold: '#FFD700',
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'siuuu': 'siuuu 0.6s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'carimbo': 'carimbo 0.4s ease-out',
      },
      keyframes: {
        siuuu: {
          '0%, 100%': { transform: 'scale(1) rotate(0)' },
          '25%': { transform: 'scale(1.2) rotate(-5deg)' },
          '50%': { transform: 'scale(1.2) rotate(5deg)' },
          '75%': { transform: 'scale(1.1) rotate(-5deg)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        carimbo: {
          '0%': { transform: 'scale(1.7) rotate(-14deg)', opacity: '0' },
          '55%': { transform: 'scale(0.82) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        snavyo: {
          background: '#F5F0FF',
          lavender: '#EDE3FF',
          purple: '#7550B8',
          'purple-dark': '#35204F',
          gold: '#D4AF62',
          white: '#FFFFFF',
          'text-main': '#29213A',
          'text-secondary': '#81768F',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        luxury: '0 12px 40px -12px rgba(117, 80, 184, 0.16)',
        gold: '0 0 24px rgba(212, 175, 98, 0.30)',
      },
      borderRadius: {
        premium: '1rem',
        'premium-xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
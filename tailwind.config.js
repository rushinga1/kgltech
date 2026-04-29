/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: '#00A1DE',
          green: '#20603D',
          yellow: '#FAD201',
          gold: '#E5BE01',
        },
      },
      boxShadow: {
        soft: '0 20px 45px -25px rgba(15, 23, 42, 0.15)',
        premium: '0 30px 60px -15px rgba(15, 23, 42, 0.12)',
        glass: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseBadge: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'pulse-badge': 'pulseBadge 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
};

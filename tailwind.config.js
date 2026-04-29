/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#00A1DE',
          green: '#20603D',
          yellow: '#FAD201',
          gold: '#E5BE01',
        },
      },
      boxShadow: {
        soft: '0 20px 45px -25px rgba(15, 23, 42, 0.35)',
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

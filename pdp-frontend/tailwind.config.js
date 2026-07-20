/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Kerala Ayurveda brand palette — earthy, Ayurvedic greens and golds
        ka: {
          green: {
            50:  '#f2f7f2',
            100: '#dceedd',
            200: '#b8dcba',
            300: '#87c28a',
            400: '#559f5a',
            500: '#3a7d3f',
            600: '#2e6332',
            700: '#264f29',
            800: '#1f3f22',
            900: '#19321c',
          },
          gold: {
            50:  '#fdf9ec',
            100: '#faf0c9',
            200: '#f4df8e',
            300: '#edc94d',
            400: '#e5b426',
            500: '#c9961a',
            600: '#a77514',
            700: '#855711',
            800: '#6b4312',
            900: '#583614',
          },
          cream: '#faf6ef',
          bark:  '#4a3728',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(58,125,63,0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(58,125,63,0)' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'bounce-in': {
          '0%':   { opacity: '0', transform: 'scale(0.6)' },
          '60%':  { opacity: '1', transform: 'scale(1.15)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up-fade': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up':        'fade-up 0.4s ease-out both',
        'fade-in':        'fade-in 0.3s ease-out both',
        'fade-in-slow':   'fade-in 0.6s ease-out both',
        shimmer:          'shimmer 1.8s linear infinite',
        'pulse-ring':     'pulse-ring 1.8s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.35s ease-out both',
        'scale-in':       'scale-in 0.3s ease-out both',
        'bounce-in':      'bounce-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'slide-up-fade':  'slide-up-fade 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};

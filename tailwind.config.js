/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#5B4FE9',
          dark: '#4A3FD4',
          light: '#EEF0FF',
        },
        navy: {
          DEFAULT: '#1E1B4B',
          dark: '#17144A',
        },
        surface: '#F8FAFC',
        border: '#E2E8F0',
        txt: {
          primary: '#1A1A2E',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        gold: '#F59E0B',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
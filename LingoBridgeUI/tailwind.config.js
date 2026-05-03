/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'req-pop': { from: { opacity: '0', transform: 'translateY(-8px) scale(0.98)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
        'spin-smooth': { to: { transform: 'rotate(360deg)' } },
        'blink': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
        'pulse-glow': { '0%,100%': { boxShadow: '0 0 0 0 rgba(99,102,241,0.45)' }, '50%': { boxShadow: '0 0 0 10px rgba(99,102,241,0)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.25s ease both',
        'req-pop': 'req-pop 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'spin': 'spin-smooth 0.9s linear infinite',
        'blink': 'blink 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
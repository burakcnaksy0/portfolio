/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6ff',
          300: '#a4b8ff',
          400: '#7c92ff',
          500: '#5a6aff',
          600: '#4147f5',
          700: '#3535e0',
          800: '#2d2db5',
          900: '#292a8f',
          950: '#1a1a5e',
        },
        accent: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        surface: {
          DEFAULT: '#0f0f1a',
          card:    '#16162a',
          border:  '#2d2d4d',
        }
      },
      animation: {
        'fade-in':     'fadeIn 0.5s ease-in-out',
        'slide-up':    'slideUp 0.4s ease-out',
        'glow':        'glow 2s ease-in-out infinite alternate',
        'float':       'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        glow:    { '0%': { boxShadow: '0 0 5px #5a6aff40' }, '100%': { boxShadow: '0 0 20px #5a6aff80, 0 0 40px #5a6aff40' } },
        float:   { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}

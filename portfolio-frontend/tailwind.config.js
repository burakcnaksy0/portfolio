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
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        surface: {
          DEFAULT: '#020617',
          card:    '#0f172a',
          border:  '#1e293b',
        }
      },
      animation: {
        'fade-in':       'fadeIn 0.6s ease-out',
        'slide-up':      'slideUp 0.5s ease-out',
        'slide-down':    'slideDown 0.4s ease-out',
        'glow':          'glow 2s ease-in-out infinite alternate',
        'float':         'float 4s ease-in-out infinite',
        'float-slow':    'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 5s ease-in-out infinite',
        'spin-slow':     'spin-slow 20s linear infinite',
        'gradient':      'gradientShift 4s ease infinite',
        'pulse-glow':    'dotPulse 2s ease-in-out infinite',
        'scale-in':      'scaleIn 0.5s ease-out',
        'border-glow':   'borderGlow 4s ease infinite',
      },
      keyframes: {
        fadeIn:  {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow:    {
          '0%':   { boxShadow: '0 0 5px rgba(99,102,241,0.25)' },
          '100%': { boxShadow: '0 0 20px rgba(99,102,241,0.5), 0 0 40px rgba(99,102,241,0.25)' },
        },
        float:   {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(12px)' },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(99,102,241,0.15)',
        'glow':    '0 0 30px rgba(99,102,241,0.2)',
        'glow-lg': '0 0 60px rgba(99,102,241,0.3)',
        'glass':   '0 8px 32px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

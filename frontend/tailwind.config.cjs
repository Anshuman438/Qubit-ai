/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink:      '#0D0D0D',
        cream:    '#F5F0E8',
        volt:     '#FFEC5C',
        lavender: '#AFA9EC',
        mint:     '#5DCAA5',
        peach:    '#F0997B',
        rose:     '#F09595',
        sky:      '#85B7EB',
      },
      boxShadow: {
        'nb':       '4px 4px 0px #0D0D0D',
        'nb-sm':    '3px 3px 0px #0D0D0D',
        'nb-lg':    '6px 6px 0px #0D0D0D',
        'nb-xl':    '8px 8px 0px #0D0D0D',
        'nb-hover': '2px 2px 0px #0D0D0D',
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderWidth: {
        '2.5': '2.5px',
      },
      borderRadius: {
        'nb': '6px',
      },
      keyframes: {
        'slide-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.85)' },
        },
      },
      animation: {
        'slide-in-up': 'slide-in-up 0.35s ease forwards',
        'float':       'float 3s ease-in-out infinite',
        'pulse-dot':   'pulse-dot 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
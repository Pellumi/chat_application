/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        move: {
          '0%, 49.99%': { opacity: '0', zIndex: '1' },
          '50%, 100%': { opacity: '1', zIndex: '5' },
        },
      },
      animation: {
        move: 'move 0.6s',
      },
      boxShadow:{
        'custom-shadow': '0 5px 15px rgba(0, 0, 0, 0.35)'
      },
      transitionProperty: {
        'all': 'all'
      },
      transitionDuration: {
        '600': '600ms'
      },
      transitionTimingFunction: {
        'in-out': 'ease-in-out'
      },
      colors: {
        seeThrough: '#000000bf',
        fadedBg: '#424242',
        primary: '#ed500a',
        secondary: '#161b22',
        bg_color: '#0b0e14',
        acc_color: '#30363d',
        text_color: '#565360',
        label: '#848d85',
        neutral: '#164cd6',
        danger: '#b62324',
        lightLabel: '#dedede'
      }
    },
  },
  plugins: [],
}
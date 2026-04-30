/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          black: '#010101',
          bg1: '#030303',
          bg2: '#080808',
          bg3: '#0d0d0d',
          bg4: '#111111',
          accent: '#c9a84c',
          'accent-bright': '#e2c06b',
          'accent-dim': '#a08535',
          gray: {
            100: '#f5f5f5', 200: '#e5e5e5', 300: '#cccccc',
            400: '#999999', 500: '#777777', 600: '#555555',
            700: '#333333', 800: '#1a1a1a', 900: '#0a0a0a',
          }
        },
        gradient: {
          start: '#FA93FA',
          mid: '#C967E8',
          end: '#983AD6',
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FA93FA, #C967E8, #983AD6)',
        'text-gradient': 'linear-gradient(to right, #ffffff, #FA93FA, #C967E8)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
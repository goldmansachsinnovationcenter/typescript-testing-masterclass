/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF00FF', // Neon pink
          dark: '#CC00CC',
          light: '#FF66FF',
        },
        secondary: {
          DEFAULT: '#00FFFF', // Neon blue
          dark: '#00CCCC',
          light: '#66FFFF',
        },
        accent: {
          DEFAULT: '#00FF00', // Neon green
          dark: '#00CC00',
          light: '#66FF66',
        },
        background: {
          DEFAULT: '#121212', // Dark charcoal
          dark: '#000000', // Black
          light: '#1E1E1E',
        },
        foreground: {
          DEFAULT: '#FFFFFF', // White
          dark: '#EEEEEE',
          light: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}

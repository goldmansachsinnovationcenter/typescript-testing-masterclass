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
          DEFAULT: '#0070f3',
          dark: '#0050b3',
          light: '#3291ff',
        },
        secondary: {
          DEFAULT: '#7928ca',
          dark: '#4c0993',
          light: '#9e56fc',
        },
        background: {
          DEFAULT: '#f9fafb',
          dark: '#111',
        },
        foreground: {
          DEFAULT: '#333',
          dark: '#fff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

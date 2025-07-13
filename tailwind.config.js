/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f8f0',
          100: '#dcf0dc',
          200: '#bce0bc',
          300: '#8cc98c',
          400: '#5aa85a',
          500: '#4a7c59',
          600: '#2d5016',
          700: '#254012',
          800: '#1f330f',
          900: '#1a2b0d',
        }
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Elegant Golf Palette
        golf: {
          dark: '#1A3021',      // Deep Forest Green
          primary: '#2D5A3F',   // Classic Fairway Green
          accent: '#C5A059',    // Gold/Brass accents
          cream: '#FDFCF8',     // High-contrast background
          light: '#E8EEDF',     // Soft sage for secondary elements
        }
      },
      fontFamily: {
        // If you want that "Country Club" look, Serif headers are key
        serif: ['Playfair Display', 'serif'], 
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3B873E',
          dark: '#2C6A2F',
          light: '#6FBF73',
          gray: '#edf2ee',
        },
      },
      fontFamily: {
        sans: ['"Roboto"', '"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

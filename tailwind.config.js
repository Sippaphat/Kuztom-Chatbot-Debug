/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'msn-purple': '#3A2C58',
        'msn-gray': '#D4D0C8',
        'msn-border': '#808080',
        'msn-blue': '#008080',
      },
      boxShadow: {
        'msn-inner': 'inset 1px 1px 0px #fff, inset -1px -1px 0px #fff',
      }
    },
  },
  plugins: [],
};

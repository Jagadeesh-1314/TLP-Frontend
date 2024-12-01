/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'slideDown': 'slideDown 0.2s ease-out forwards',
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
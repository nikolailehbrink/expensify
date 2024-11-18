/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'bottom-2': '0 2px 0 rgba(0, 0, 0, 0.1)',
        'bottom-4': '0 4px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}

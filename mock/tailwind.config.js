/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bank-primary': '#8B1538',
        'bank-secondary': '#A91D3A',
        'bank-accent': '#C73659',
        'bank-light': '#F5E6E8',
        'bank-dark': '#5C0E24',
        'bank-success': '#10b981',
        'bank-warning': '#f59e0b',
        'bank-danger': '#ef4444',
        'ku-crimson': '#8B1538',
        'ku-crimson-light': '#A91D3A',
        'ku-crimson-dark': '#5C0E24',
        'ku-gray': '#4A4A4A',
        'ku-gray-light': '#F5F5F5',
      }
    },
  },
  plugins: [],
}

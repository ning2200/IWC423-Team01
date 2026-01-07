/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bank-primary': '#1e3a5f',
        'bank-secondary': '#2563eb',
        'bank-accent': '#0ea5e9',
        'bank-success': '#10b981',
        'bank-warning': '#f59e0b',
        'bank-danger': '#ef4444',
      }
    },
  },
  plugins: [],
}

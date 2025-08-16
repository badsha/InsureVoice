/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        idra: {
          blue: '#2563eb',
          green: '#059669',
          red: '#dc2626',
          amber: '#d97706',
          gray: '#6b7280',
        },
        status: {
          open: '#ef4444',
          review: '#f59e0b',
          pending: '#3b82f6',
          resolved: '#10b981',
          closed: '#6b7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
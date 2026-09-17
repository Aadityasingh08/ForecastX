/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#d9e2ee',
          200: '#b8c9df',
          300: '#8baacb',
          400: '#5c87b4',
          500: '#3e6a9d',
          600: '#2f5280',
          700: '#274368',
          800: '#1e3450',
          900: '#0f2942',
          950: '#0a1a2c',
        },
        forecast: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          hover: '#f1f5f9',
          navy: '#0f2942',
          blue: '#1d4ed8',
          accent: '#2563eb',
          safe: '#10b981',
          warning: '#f59e0b',
          severe: '#ef4444',
          subtle: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'float': '0 4px 12px 0 rgba(15, 41, 66, 0.08)',
      }
    },
  },
  plugins: [],
}

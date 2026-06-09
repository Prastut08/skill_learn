/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefbf8',
          100: '#dff7f2',
          300: '#7dd3c7',
          500: '#14b8a6',
          700: '#0f766e'
        },
        glass: 'rgba(255,255,255,0.6)'
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'glass-lg': '0 8px 30px rgba(12,15,25,0.12)'
      }
    }
  },
  plugins: [],
}

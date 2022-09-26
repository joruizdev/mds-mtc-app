/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        mont: 'Montserrat'
      },
      colors: {
        'mds-blue-dark': '#242e48',
        'mds-blue': '#2c70b6',
        'mds-yellow': '#e4a72b'
      }
    }
  },
  plugins: []
}

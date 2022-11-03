/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        mont: 'Montserrat',
        robotoMono: 'Roboto Mono',
        ptSans: 'PT Sans',
        nunito: 'Nunito'
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

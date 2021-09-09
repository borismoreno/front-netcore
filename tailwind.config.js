module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primarycolor: '#F9A826',
      }
    },
  },
  variants: {
    extend: {
      width: ['hover', 'focus'],
    },
    opacity: ({ after }) => after(['disabled'])
  },
  plugins: [],
}

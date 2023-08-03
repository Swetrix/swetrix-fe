const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.html', './src/**/*.jsx', './src/**/*.tsx', './src/**/*.js', './src/**/*.ts'],
})
const cssnano = require('cssnano')({
  preset: 'default',
})

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? [purgecss, cssnano] : []),
  },
}

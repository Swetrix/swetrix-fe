module.exports = {
  resolve: {
    fallback: {
      fs: false,
      zlib: require.resolve('browserify-zlib'),
      util: false,
    }
  }
}

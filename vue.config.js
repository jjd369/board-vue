module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        logLevel: 'debug',
        changeOrigin: true,
        // pathRewrite: { '/api': '' },
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/scss/variables.scss";`,
      },
    },
  },
}

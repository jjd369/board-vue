const path = require('path')

module.exports = {
  outputDir: path.resolve(__dirname, '../backend2/public'),
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

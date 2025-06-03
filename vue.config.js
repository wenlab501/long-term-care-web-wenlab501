const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/donkey-fever-analysis/',
  devServer: {
    host: '0.0.0.0',
    port: 8080
  }
})

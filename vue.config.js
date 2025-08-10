const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: '/long-term-care-web/',
  transpileDependencies: true,
  devServer: {
    port: 8080,
    host: 'localhost',
  },
});

const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: '/long-term-care-web-wenlab501/',
  transpileDependencies: true,
  devServer: {
    port: 8080,
    host: 'localhost',
  },
});

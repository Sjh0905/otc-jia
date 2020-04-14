'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/c2c': {
        // target: 'http://192.168.2.166:8080/', //欧
        // target: 'http://192.168.2.166:8090/', //欧二号
        // target: 'http://192.168.2.131:8100/',  //玉光
        // target: 'http://192.168.2.147:8090/', //晓东
        // target: 'http://192.168.2.157:8090/', //海潮
        // target: 'http://52.195.14.223:8090/', //测试环境
        // target:'http://192.168.0.97:8090', //中秋本机测试环境
        // target:'http://10.111.12.42:8090', //中秋本机测试环境
        target: 'https://otc.highdefi.com/',
        // target: 'https://otc.815ex.com/',
        // target: 'https://valuepay.815ex.com/',
        // target:'http://47.90.18.189:8090', //本地测试环境
          //  target:'https://52.195.14.223:8090', //正式环境
        changeOrigin: true,
        // pathRewrite: {//TODO:连接测试用这个
        //   '^/c2c': ''
        // },
        pathRewrite: {//TODO:连接生产用这个
          '^/c2c': 'c2c'
        }
      },
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    // host: 'b.btcdo.org', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */


    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}

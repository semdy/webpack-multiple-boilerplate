'use strict'

const path = require('path')
const resolve = (entry) => path.resolve(__dirname, '..', '..', entry)

module.exports = {
  libraryDir: 'lib',
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    cssSourceMap: false,
    pxtorem: false
  },
  build: {
    env: require('./prod.env'),
    srcRoot: resolve('src'),
    assetsRoot: resolve('dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: true,
    productionGzip: false,
    pxtorem: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
}

'use strict'

const path = require('path')
const glob = require('glob')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const utils = require('./utils')
const config = require('./config')
const isProd = process.env.NODE_ENV === 'production'

let HTMLPlugins = []
let Entries = {}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function getEntryDir() {
  let globPath = 'src/pages/**/*.{html,njk,pug,ejs}'
  // compat for both windows and mac system path
  let pathDir = 'src(\/|\\\\)'
  let files = glob.sync(globPath)
  let dirname
  let entries = []
  for (let i = 0; i < files.length; i++) {
    dirname = path.dirname(files[i])
    entries.push({
      html: files[i],
      dir: dirname.replace(new RegExp('^' + pathDir), '')
    })
  }
  return entries
}

getEntryDir()
  .forEach((page) => {
    let moduleName = page.dir.split('/').pop()
    const htmlPlugin = new HTMLWebpackPlugin({
      filename: `${moduleName}.html`,
      template: path.resolve(__dirname, `../${page.html}`),
      chunks: [moduleName, 'manifest', 'vendor', 'common']
    })
    HTMLPlugins.push(htmlPlugin)
    Entries[moduleName] = path.resolve(__dirname, `../src/${page.dir}/index.js`)
  })

function getLibs() {
  let globPath = `src/${config.libraryDir}/**/*.*`
  let files = glob.sync(globPath)
  let libsArr = []
  files.forEach(v => {
    libsArr.push('./' + v)
  })
  return libsArr
}

let libsDir = getLibs()
if (libsDir.length > 0) {
  Entries['common'] = libsDir
}

module.exports = {
  entry: Entries,
  output: {
    pathinfo: true,
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: isProd
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.html', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  externals: {
    'jquery': 'window.jQuery || window.Zepto'
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      // {
      //   test: /.js$/,
      //   enforce: 'post',
      //   loader: 'es3ify-loader',
      //   exclude: /node_modules/
      // },
      {
        test: /\.pug$/,
        loader: ['html-withimg-loader', 'html-loader', 'pug-html-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.ejs$/,
        loader: ['html-withimg-loader', 'html-loader', 'ejs-html-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.njk$/,
        loader: ['html-loader', 'njk-html-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(htm|html)$/i,
        loader: ['html-withimg-loader', 'html-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        exclude: /node_modules/,
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.svg(\?.*)?$/,
        include: resolve('src/assets/icons'),
        exclude: /node_modules/,
        loader: 'svg-sprite-loader'
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        exclude: /node_modules/,
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        exclude: /node_modules/,
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ],
  },
  plugins: [
    ...HTMLPlugins
  ]
}

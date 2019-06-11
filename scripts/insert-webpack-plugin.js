const fs = require('fs')
const path = require('path')
const UglifyJS = require("uglify-js")

function InsertWebpackPlugin(options) {
  this.options = options
}

InsertWebpackPlugin.prototype.apply = function(compiler) {
  const pathInfo = path.join(__dirname, '../node_modules/object-defineproperty-ie8/index.js')
  compiler.plugin('compilation', function(compilation, options) {
    compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {
      try {
        let inlineData = fs.readFileSync(pathInfo, 'utf8')
        inlineData = UglifyJS.minify(`(function(){${inlineData}})()`, { ie8: true }).code || ''
        htmlPluginData.html = htmlPluginData.html.replace('</head>', `\n<script>${inlineData}</script>\n</head>`)
        callback(null, htmlPluginData)
      } catch (e) {
        callback(null, htmlPluginData)
        console.error(e.message, e.stack)
      }
    })
  })
}

module.exports = InsertWebpackPlugin

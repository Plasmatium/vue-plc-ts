'use strict'
const merge = require('webpack-merge')
const dev_config = require('./webpack.dev.conf')

module.exports = merge(dev_config, {
  devtool: 'inline-cheap-module-source-map'
})
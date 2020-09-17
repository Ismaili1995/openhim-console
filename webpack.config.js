const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const isProduction = /prod/i.test(process.env.NODE_ENV || 'dev')

if (isProduction) {
  console.log('Creating production bundle')
}

const config = {
  entry: './app/scripts/index',
  mode: isProduction ? 'production' : 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css', '.html'],
    alias: {
      'morris.js': path.resolve(__dirname, 'node_modules/morris.js/morris.js'),
      '~': path.resolve(__dirname, 'app')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.html$/,
        include: [path.resolve(__dirname, 'app')],
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: isProduction
            }
          }
        ]
      },
      {
        test: /.jsx?$/,
        include: [path.resolve(__dirname, 'app')],
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: isProduction,
                sourceMap: true
              }
            }
          ]
        })
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: [path.join(__dirname, 'app')],
    compress: true,
    port: 9000,
    watchContentBase: true
  },
  target: 'web',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new HtmlWebpackPlugin({
      template: 'app/template.html'
    }),
    new ExtractTextPlugin('styles.css'),
    new CopyWebpackPlugin([
      { from: 'app/404.html' },
      { from: 'app/favicon.ico' },
      { from: 'app/robots.txt' },
      {
        context: 'app/config',
        from: '*',
        to: 'config/'
      }
    ])
  ]
}

if (isProduction) {
  config.plugins.push(new MinifyPlugin({
    consecutiveAdds: false,
    guards: false,
    mangle: false,
    simplify: false
  }, {
    comments: false
  }))
}

module.exports = config

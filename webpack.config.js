const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/images', to: 'images' },
      { from: './src/index.html', to: 'index.html' },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src/styles'),
        ],
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg)$/,
        include: [
          path.resolve(__dirname, 'src/images'),
        ],
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: 'images/[name].[ext]',
          },
        }],
      },
    ],
  },
};

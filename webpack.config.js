const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  
  entry: './src/index.js', // наша стартовая точка
  output: {
    filename: 'main.js', 
    path: path.resolve(__dirname, 'docs'), 
    publicPath: '', 
    clean: true 
  },
  mode: 'development',
  devServer: {
    static: './dist',
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'//hsih
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i, // если это CSS-файл
        use: ['style-loader', 'css-loader'], // обрабатываем стилями
      }
    ]
  }
};
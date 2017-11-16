const path = require('path');

module.exports = {
  entry : './src/app.jsx',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'build/'),
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel-loader' }
    ]
  },
  resolve:{
   	  extensions : [".webpack.js", ".web.js", ".jsx",".js"]
  },
};

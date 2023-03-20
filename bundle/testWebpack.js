const option = require('./webpack.config')
const webpack = require('./webpack');
const compile = webpack(option);
compile.run()
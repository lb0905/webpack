const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/assets'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, './src/assets'),
            publicPath: '/static'
        },
        port: 3000,

    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 80 * 1024
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' })
    ]
}
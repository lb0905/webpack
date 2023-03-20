const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const TerserPlugin  = require('terser-webpack-plugin')

const RunPlugin = require('./plugins/runPlugin');

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname),
    entry: {
        page1: './src/index.js',
        page2: './src/index.js',
    },
    // entry: './src/index.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        // filename: '[name].[hash:10].js',
        filename: '[name].js',
        publicPath: '/assets'
    },
    // optimization: {
    //     minimize: true,
    //     minimizer: [
    //         new CssMinimizerPlugin(),
    //         new TerserPlugin(),
    //     ]
    // },
    devServer: {
        static: {
            directory: path.join(__dirname, './src/assets'),
            publicPath: '/static'
        },
        port: 3000,

    },
    module: {
        rules: [
            // {
            //     test: /\.css$/i,
            //     use: [MiniCssExtractPlugin.loader, 'css-loader']
            // },
            // {
            //     test: /\.(png|jpg)$/i,
            //     use: [
            //         {
            //             loader: 'url-loader',
            //             options: {
            //                 limit: 80 * 1024
            //             }
            //         }
            //     ]
            // },
            {
                test: /\.js$/i, use: path.resolve(__dirname, 'loaders', 'loader1.js')
            }
        ]
    },
    plugins: [
        // new MiniCssExtractPlugin(),
        // new HtmlWebpackPlugin({ template: './src/index.html' }),
        // new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["**/*"] })
        new RunPlugin()
    ]
}
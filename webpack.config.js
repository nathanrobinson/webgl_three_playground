const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    devtool: 'inline-source-map',
    mode: "development",
    devServer: {
        contentBase: './dist',
        port: 4433
    },
    plugins: [
        new CleanWebpackPlugin(['dist/*']),
        new HtmlWebpackPlugin({title: 'Development'})
    ],
    module:{
        rules:[
            {
                test:/\.(s*)css$/,
                use:['style-loader','css-loader', 'sass-loader']
            },
            {
                test: /\.(glsl|vs|fs)$/,
                loader: 'shader-loader'
            }
        ]
    },
    output: {
        publicPath: '',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
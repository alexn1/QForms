const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const tsConfigCustom = require('./tsconfig.custom.json');
const { mode, resolve } = require('./webpack.helper');

module.exports = {
    devtool: false,
    mode: mode(),
    resolve: resolve(),
    entry: './src/frontend/index/main.ts',
    output: {
        clean: true,
        path: path.resolve(__dirname, './dist/frontend/index/public'),
        filename: 'js/bundle.[contenthash].js',
    },
    module: {
        rules: [
            /* {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        onlyCompileBundledFiles: true,
                        ...tsConfigCustom,
                    },
                },
            }, */
            {
                test: /\.tsx?$/,
                loader: 'esbuild-loader',
                options: {
                    tsconfig: './tsconfig.custom.json',
                    keepNames: true,
                },
            },
            {
                test: /\.less$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
            },
        ],
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    keep_classnames: true,
                },
            }),
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/bundle.[contenthash].css',
        }),
    ],
    node: {
        global: false,
    },
};

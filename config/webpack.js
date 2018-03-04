// webpack imports
var webpack = require('webpack')
var process = require('process')
var HtmlWebpackPlugin = require('html-webpack-plugin')
// local imports
var projectPaths = require('./projectPaths')

var entry = [projectPaths.clientEntry]

// the initial set of plugins
var plugins = [
    new HtmlWebpackPlugin({
        template: 'client/index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.EnvironmentPlugin({
        NODE_ENV: process.env.NODE_ENV || 'dev',
    }),
]
// if we are building for production
if (process.env.NODE_ENV !== 'production') {
    // add the webpack dev server config
    entry = ['webpack-dev-server/client?http://0.0.0.0:8080', 'webpack/hot/only-dev-server'].concat(entry)
}

// export webpack configuration object
module.exports = {
    entry: entry,
    output: {
        path: projectPaths.buildDir,
        filename: 'client.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: projectPaths.sourceDir,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|ttf)$/,
                loader: 'url-loader',
                query: { limit: 10000000 },
            },
        ],
    },
    resolve: {
        extensions: ['.jsx', '.js'],
        modules: [projectPaths.sourceDir, projectPaths.rootDir, 'node_modules'],
    },
    plugins: plugins,
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devServer: {
        proxy: {
            '/latex': {
                target: 'http://localhost:8081/latex',
            },
        },
    },
}

// end of file

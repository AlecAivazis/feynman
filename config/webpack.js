// webpack imports
var webpack = require('webpack')
var process = require('process')
var HtmlWebpackPlugin = require('html-webpack-plugin')
// local imports
var projectPaths = require('./projectPaths')

// default to using development configuration
var devtool = 'inline-source-map'

// the initial set of plugins
var plugins = [
    new HtmlWebpackPlugin({
        template: 'src/index.html'
    })
]
// if we are building for production
if (process.env.NODE_ENV === 'production') {
    // remove sourcemaps
    devtool = ''

    // use production plugins
    plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
    )
}

// export webpack configuration object
module.exports = {
    entry: projectPaths.clientEntry,
    output: {
        path: projectPaths.buildDir,
        filename: 'client.js',
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: [
                    'babel?extends='+projectPaths.babelConfig,
                    'ts',
                ],
                include: projectPaths.sourceDir,
            }, {
                test: /\.css$/,
                loaders: ['style', 'css'],
            }, {
                test: /\.(png|jpg|ttf)$/,
                loader: 'url',
                query: {limit: 10000000},
            },

        ],
    },
    resolve: {
        extensions: ['', '.jsx', '.js', ".ts", ".tsx"],
        root: [
            projectPaths.sourceDir,
            projectPaths.rootDir,
        ],
    },
    eslint: {
        configFile: projectPaths.eslintConfig,
        failOnError: true,
    },
    ts: {
        configFileName: projectPaths.tsConfig,
    },
    plugins: plugins,
    devtool: devtool,
}


// end of file

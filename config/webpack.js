// webpack imports
var webpack = require('webpack')
var process = require('process')
var HtmlWebpackPlugin = require('html-webpack-plugin')
// local imports
var projectPaths = require('./projectPaths')

// default to using development configuration
var devtool = ''

var entry = [projectPaths.clientEntry]

// the initial set of plugins
var plugins = [
    new HtmlWebpackPlugin({
        template: 'client/index.html'
    })
]
// if we are building for production
if (process.env.NODE_ENV === 'production') {
    // use production plugins
    plugins.push(
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
    )
} else {
    // use source maps
    devtool = 'inline-source-map'

    // add the webpack dev server config
    entry = [
        'webpack-dev-server/client?http://0.0.0.0:8080',
        'webpack/hot/only-dev-server',
    ].concat(entry)
}

// export webpack configuration object
module.exports = {
    entry: entry,
    output: {
        path: projectPaths.buildDir,
        filename: 'client.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                include: projectPaths.sourceDir,
                query: {
                    extends: projectPaths.babelConfig
                }
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

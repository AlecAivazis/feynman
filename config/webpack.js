// webpack imports
var webpack = require('webpack')
var axis = require('axis')
var process = require('process')
// local imports
var projectPaths = require('./projectPaths')



// default to using development configuration
var devtool = 'source-map'

// the initial set of plugins
var plugins = []
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
                test: /\.jsx?$/,
                loader: 'babel',
                include: projectPaths.sourceDir,
                query: {
                    extends: projectPaths.babelConfig,
                }
            }, {
                test: /\.css$/,
                loaders: ['style', 'css'],
            }, {
                test: /\.(png|jpg|ttf)$/,
                loader: 'url',
                query: {limit: 10000000},
            }, {
                test: /\.styl$/,
                loader: 'style!css!stylus?paths=node_modules',
            }

        ],
    },
    resolve: {
        extensions: ['', '.jsx', '.js', '.coffee'],
        root: [
            projectPaths.sourceDir,
            projectPaths.rootDir,
        ],
    },
    eslint: {
        configFile: projectPaths.eslintConfig,
        failOnError: true,
    },
    stylus: {
      use: [axis()]
    },
    plugins: plugins,
    devtool: devtool,
}


// end of file

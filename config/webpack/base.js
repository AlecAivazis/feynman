// webpack imports
var webpack = require('webpack')
var axis = require('axis')
var process = require('process')
// local imports
var projectPaths = require('../projectPaths')



// default to using development configuration
// var devtool = 'source-map'
var plugins = []

if (process.env.NODE_ENV === 'production') {
    // use production configuration instead
    plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
    )
}
console.log(process.env)

// export webpack configuration object
module.exports = {
    output: {
        path: projectPaths.buildDir,
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                include: projectPaths.sourceDir,
            }, {
                test: /\.css$/,
                loaders: ['style', 'css'],
            }, {
                test: /\.(png|jpg|ttf)$/,
                loader: 'url',
                query: {limit: 10000000},
            }, {
                test: /\.coffee$/,
                loader: 'coffee',
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
}


// end of file

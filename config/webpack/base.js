// webpack imports
var webpack = require('webpack')
// local imports
var projectPaths = require('../projectPaths')


// default to using development configuration
var devtool = 'source-map'
var plugins = []

// export webpack configuration object
module.exports = {
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
            },
        ],
    },
    resolve: {
        extensions: ['', '.jsx', '.js'],
        root: [
            projectPaths.sourceDir,
            projectPaths.rootDir,
        ],
    },
    eslint: {
        configFile: projectPaths.eslintConfig,
        failOnError: true,
    },
    devtool: devtool,
}


// end of file

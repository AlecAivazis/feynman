// node imports
var fs = require('fs')
// third party imports
var webpack = require('webpack')
// local imports
var projectPaths = require('../projectPaths')
var baseConfig = require(projectPaths.webpackBaseConfig)


// dict of node modules to treat as externals
// reference: http://jlongster.com/Backend-Apps-with-Webpack--Part-I
var nodeModules = fs.readdirSync('node_modules')
    // filter out the .bin dir
    .filter(function (dir) {
        return dir !== '.bin'
    })
    // create the data structure desired by webpack
    .reduce(function (state, dir) {
        var dummy = {}
        dummy[dir] = 'commonjs ' + dir

        return Object.assign({}, state, dummy)
    }, {})



module.exports = Object.assign({}, baseConfig, {
    entry: {
        server: projectPaths.serverEntry
    },
    target: 'node',
    // don't bundle node modules
    externals: nodeModules,
    node: {
        console: true,
        global: true,
        process: true,
        Buffer: true,
        __dirname: true,
        __filename: true,
        path: true,
    },
})


// end of file

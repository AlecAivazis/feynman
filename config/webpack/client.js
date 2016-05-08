// local imports
var projectPaths = require('../projectPaths')
var baseConfig = require(projectPaths.webpackBaseConfig)


module.exports = Object.assign({}, baseConfig, {
    // additional client configuration goes here
    entry: {
        client: projectPaths.clientEntry
    },
})


// end of file

/**
 * Provides a single, consistent place for js files to get
 * relevant paths, globs, etc pertaining to the project structure.
 */

// node imports
var path = require('path')

var rootDir = path.join(__dirname, '..')
var configDir = path.join(rootDir, 'config')
var buildDir = path.join(rootDir, 'build')
var sourceDir = path.join(rootDir, 'client')
var clientEntry = path.join(sourceDir, 'index.jsx')
var clientBuild = path.join(buildDir, 'client.js')
var indexTemplate = path.join(sourceDir, 'index.html')

module.exports = {
    // directories
    rootDir: rootDir,
    sourceDir: sourceDir,
    buildDir: buildDir,
    // entry points
    clientEntry: clientEntry,
    // built files
    clientBuild: clientBuild,
    indexTemplate: indexTemplate,
    // globs
    clientBuildGlob: path.join(clientBuild, '*'),
    testGlob: path.join(sourceDir, "**", "*test.js"),
    // configuration files
    eslintConfig: path.join(configDir, 'eslint.js'),
    karmaConfig: path.join(configDir, 'karma.js'),
    webpackConfig: path.join(configDir, 'webpack.js'),
    babelConfig: path.join(configDir, 'babel.json'),
    tsConfig: path.join(configDir, 'tsconfig.json'),
}

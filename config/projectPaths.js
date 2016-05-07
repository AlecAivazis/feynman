/**
 * Provides a single, consistent place for js files to get
 * relevant paths, globs, etc pertaining to the project structure.
 */

// node imports
var path = require('path')


var rootDir = path.join(__dirname, '..')
var configDir = path.join(rootDir, 'config')
var buildDir = path.join(rootDir, 'build')
var sourceDir = path.join(rootDir, 'src')
var clientDir = path.join(sourceDir, 'client')
var serverDir = path.join(sourceDir, 'client')
var webpackDir = path.join(configDir, 'webpack')
var clientEntry = path.join(clientDir, 'index.js')
var clientLibDir = path.join(clientDir, 'lib')
var assetsDir = path.join(serverDir, 'assets')
var templatesDir = path.join(serverDir, 'templates')
var serverEntry = path.join(serverDir, 'index.js')
var clientBuild = path.join(buildDir, 'client.js')
var serverBuild = path.join(buildDir, 'server.js')
var imagesDir = path.join(assetsDir, 'images')


module.exports = {
    // directories
    rootDir: rootDir,
    sourceDir: sourceDir,
    buildDir: buildDir,
    templatesDir: templatesDir,
    assetsDir: assetsDir,
    clientLibDir: clientLibDir,
    // entry points
    clientEntry: clientEntry,
    serverEntry: serverEntry,
    // built files
    clientBuild: clientBuild,
    serverBuild: serverBuild,
    favicon: path.join(imagesDir, 'favicon.png'),
    // globs
    clientBuildGlob: path.join(clientBuild, '*'),
    serverBuildGlob: path.join(serverBuild, '*'),
    // configuration files
    eslintConfig: path.join(configDir, 'eslint.json'),
    karmaConfig: path.join(configDir, 'karma.js'),
    webpackBaseConfig: path.join(webpackDir, 'base.js'),
    webpackClientConfig: path.join(webpackDir, 'client.js'),
    webpackServerConfig: path.join(webpackDir, 'server.js'),
}

/**
 * Provides a single, consistent place for js files to get
 * relevant paths, globs, etc pertaining to the project structure.
 */

// node imports
var path = require('path')


var rootDir = path.join(__dirname, '..')
var configDir = path.join(rootDir, 'config')
var sourceDir = path.join(rootDir, 'src')
var clientDir = path.join(sourceDir, 'client')
var serverDir = path.join(sourceDir, 'server')
var webpackDir = path.join(configDir, 'webpack')
var clientEntry = path.join(clientDir, 'index.js')
var assetsDir = path.join(serverDir, 'static')
var buildDir = assetsDir
var styleDir = path.join(assetsDir, 'styles')
var templatesDir = path.join(serverDir, 'templates')
var serverEntry = path.join(serverDir, 'index.js')
var clientBuild = path.join(buildDir, 'client.js')
var serverBuild = path.join(buildDir, 'server.js')
var imagesDir = path.join(assetsDir, 'images')
var latexTemplateDir = path.join(templatesDir, 'latex')


module.exports = {
    // directories
    rootDir: rootDir,
    sourceDir: sourceDir,
    buildDir: buildDir,
    templatesDir: templatesDir,
    assetsDir: assetsDir,
    clientDir: clientDir,
    // entry points
    clientEntry: clientEntry,
    serverEntry: serverEntry,
    // style files
    defaultStyle: path.join(styleDir, 'default.styl'),
    overlayStyle: path.join(styleDir, 'overlay.styl'),
    // built files
    clientBuild: clientBuild,
    serverBuild: serverBuild,
    favicon: path.join(imagesDir, 'favicon.png'),
    // globs
    clientBuildGlob: path.join(clientBuild, '*'),
    serverBuildGlob: path.join(serverBuild, '*'),
    equationTemplatePath: path.join(latexTemplateDir, 'string.tex'),
    errorTemplatePath: path.join(latexTemplateDir, 'string.tex'),
    // configuration files
    eslintConfig: path.join(configDir, 'eslint.json'),
    karmaConfig: path.join(configDir, 'karma.js'),
    webpackConfig: path.join(configDir, 'webpack.js'),
    babelConfig: path.join(configDir, 'babelrc.json'),
}

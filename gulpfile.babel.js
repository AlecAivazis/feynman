// third party imports
import gulp from 'gulp'
import del from 'del'
import webpack from 'webpack-stream'
import named from 'vinyl-named'
import env from 'gulp-env'
import shell from 'gulp-shell'
import minifyCSS from 'gulp-minify-css'
import concat from 'gulp-concat'
import karma from 'karma'
// local imports
import {
    buildDir,
    serverBuild,
    clientBuildGlob,
    serverBuildGlob,
    clientEntry,
    serverEntry,
    cssGlob,
    webpackClientConfig as webpackClientConfigPath,
    webpackServerConfig as webpackServerConfigPath,
    karmaConfig as karmaConfigPath,
} from './config/projectPaths'
const webpackClientConfig = require(webpackClientConfigPath)
const webpackServerConfig = require(webpackServerConfigPath)


/**
 * Default to watching client and server, and runing server.
 */
gulp.task('default', ['watch-client', 'watch-server', 'runserver'])


/**
 * Run the development server.
 */
gulp.task('runserver', shell.task(`nodemon ${serverBuild} 4000`))


/**
 * Build client entry point.
 */
gulp.task('build-client', ['clean-client'], () => {
    return gulp.src(clientEntry)
        .pipe(named(() => 'client'))
        .pipe(webpack(webpackClientConfig))
        .pipe(gulp.dest(buildDir))
})


/**
 * Build server entry point.
 */
gulp.task('build-server', ['clean-server'], () => {
    return gulp.src(serverEntry)
        .pipe(named(() => 'server'))
        .pipe(webpack(webpackServerConfig))
        .pipe(gulp.dest(buildDir))
})


/**
 * Build both server and client files
 */
gulp.task('build', ['build-server', 'build-client'])


/**
 * Build both server and client files for production
 */
gulp.task('build-production', ['build-server-production', 'build-client-production'])

/**
 * Watch client entry point.
 */
gulp.task('watch-client', ['clean-client'], () => {
    const config = {
        ...webpackClientConfig,
        watch: true,
    }

    return gulp.src(clientEntry)
        .pipe(named(() => 'client'))
        .pipe(webpack(config))
        .pipe(gulp.dest(buildDir))
})


/**
 * Watch server entry point.
 */
gulp.task('watch-server', ['clean-server'], () => {
    const config = {
        ...webpackServerConfig,
        watch: true,
    }

    return gulp.src(serverEntry)
        .pipe(named(() => 'server'))
        .pipe(webpack(config))
        .pipe(gulp.dest(buildDir))
})


/**
 * Build client entry point for production.
 */
gulp.task('build-client-production', ['clean-client'], () => {
    // set environment variable
    env({
        vars: {
            NODE_ENV: 'production',
        },
    })
    // build client
    return gulp.src(clientEntry)
        .pipe(named())
        .pipe(webpack(webpackClientConfig))
        .pipe(gulp.dest(buildDir))
})


/**
 * Build server entry point for production.
 */
gulp.task('build-server-production', ['clean-server'], () => {
    // set environment variable
    env({
        vars: {
            NODE_ENV: 'production',
        },
    })
    // build server
    return gulp.src(serverEntry)
        .pipe(named())
        .pipe(webpack(webpackServerConfig))
        .pipe(gulp.dest(buildDir))
})


/**
 * Remove all ouptut files from previous client builds.
 */
gulp.task('clean-client', () => {
    del.sync(clientBuildGlob)
})


/**
 * Remove all ouptut files from previous server builds.
 */
gulp.task('clean-server', () => {
    del.sync(serverBuildGlob)
})


/**
 * Run the test suite once.
 */
gulp.task('test', (cb) => {
    const server = new karma.Server({
        configFile: karmaConfigPath,
        singleRun: true
    }, () => cb())

    server.start()
})


/**
 * Watch source and tests for changes, run tests on change.
 */
gulp.task('tdd', () => {
    const server = new karma.Server({
        configFile: karmaConfigPath,
    })

    server.start()
})


// end of file

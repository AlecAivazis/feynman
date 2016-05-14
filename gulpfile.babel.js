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
import {argv} from 'yargs'
// local imports
import {
    buildDir,
    clientBuildGlob,
    clientEntry,
    cssGlob,
    webpackConfig as webpackConfigPath,
    karmaConfig as karmaConfigPath,
} from './config/projectPaths'
const webpackConfig = require(webpackConfigPath)




/**
 * Default to watching client and server, and runing server.
 */
gulp.task('default', ['watch-client'])


const port = argv.port || 4000
gulp.task('runserver', shell.task(`python3 src/server/app.py --port ${port}`))

/**
 * Build client entry point.
 */
gulp.task('build-client', ['clean-client'], () => {
    return gulp.src(clientEntry)
        .pipe(named(() => 'client'))
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(buildDir))
})



/**
 * Build both server and client files
 */
gulp.task('build', ['build-client'])


/**
 * Build both server and client files for production
 */
gulp.task('build-production', ['build-client-production'])

/**
 * Watch client entry point.
 */
gulp.task('watch-client', ['clean-client'], () => {
    const config = {
        ...webpackConfig,
        watch: true,
    }

    return gulp.src(clientEntry)
        .pipe(named(() => 'client'))
        .pipe(webpack(config))
        .pipe(gulp.dest(buildDir))
})


/**
 * Build client entry point for production.
 */
gulp.task('build-client-production', ['clean-client'], () => {
    // build client
    return gulp.src(clientEntry)
        .pipe(named())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(buildDir))
})


/**
 * Remove all ouptut files from previous client builds.
 */
gulp.task('clean-client', () => {
    del.sync(clientBuildGlob)
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

// third party imports
import express from 'express'
import compression from 'compression'
import logger from 'morgan'
import serveStatic from 'serve-static'
// local imports
import {
    buildDir,
    assetsDir,
    templatesDir,
    clientLibDir,
    favicon as faviconPath,
} from 'config/projectPaths'
import {renderLaTeX} from './handlers'


const app = express()


/* Application-wide Settings */

// use jade for html templating
app.set('view engine', 'jade')
// set directory in which to search for html templates
app.set('views', templatesDir)


/* Application-wide Middleware */

// add the favicon
// log requests
app.use(logger('dev'))
// compress responses
app.use(compression())
/* Routing */

// route static files to build and assets dirs
app.use('/static', serveStatic(buildDir), serveStatic(assetsDir), serveStatic(clientLibDir))
app.get('/latex', renderLaTeX)
app.get('/', (req, res) => res.render('index.jade'))

export default app

// fix node land
import 'babel-polyfill'
// external imports
import {argv} from 'yargs'
// local imports
import app from './server'


// interpret first arg from command line as port number
const portArg = parseInt(argv.port || 8000)
// port to listen on
const port = isValidPort(portArg) ? portArg : 8000


/* eslint-disable no-console */
// listen on given port
app.listen(port, () => console.log(`[${new Date()}] Now listening on port: ${port}`))
/* eslint-enable no-console */


function isValidPort(p) {
    return p > 0 && p <= 65535
}

// fix node land
import 'babel-polyfill'
// node imports
import process from 'process'
// local imports
import app from './server'


// interpret first arg from command line as port number
const portArg = parseInt(process.argv[2], 10)
// port to listen on
const port = isValidPort(portArg) ? portArg : 8000


/* eslint-disable no-console */
// listen on given port
app.listen(port, () => console.log(`[${new Date()}] Now listening on port: ${port}`))
/* eslint-enable no-console */


function isValidPort(p) {
    return p > 0 && p <= 65535
}

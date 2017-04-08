// local imports
import { COMMIT } from '../types'

export default msg => ({
    type: COMMIT,
    payload: msg,
})

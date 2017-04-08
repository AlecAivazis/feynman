// local imports
import { GOTO } from '../types'

export default sha => ({
    type: GOTO,
    payload: sha,
})

// local imports
import { WITH_COMMIT } from '../types'

export default (action, message) => ({
    type: WITH_COMMIT,
    payload: {
        action,
        message,
    },
})

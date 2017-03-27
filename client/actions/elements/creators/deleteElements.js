// local imports
import { DELETE_ELEMENTS } from '../types'

export default (...targets) => ({
    type: DELETE_ELEMENTS,
    payload: targets
})
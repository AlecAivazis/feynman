// local imports
import { SET_ELEMENT_ATTRS } from '../types'

export default (...updates) => ({
    type: SET_ELEMENT_ATTRS,
    payload: updates,
})

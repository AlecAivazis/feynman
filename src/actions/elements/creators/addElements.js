// local imports
import { ADD_ELEMENT } from 'actions/elements'

export default (...configs) => ({
    type: ADD_ELEMENT,
    payload: configs,
})
// local imports
import { ADD_PROPAGATOR } from 'actions/elements'

export default (...configs) => ({
    type: ADD_PROPAGATOR,
    payload: configs,
})
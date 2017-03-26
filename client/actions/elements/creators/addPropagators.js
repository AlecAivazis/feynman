// local imports
import { ADD_PROPAGATORS } from 'actions/elements'

export default (...propagators)  => ({
    type: ADD_PROPAGATORS,
    payload: propagators,
})
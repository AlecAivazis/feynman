// local imports
import { ADD_ANCHORS } from 'actions/elements'

export default (...anchors) => ({
    type: ADD_ANCHORS,
    payload: anchors,
})

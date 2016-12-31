// local imports
import { MOVE_ANCHORS } from 'actions/elements'

export default (...anchors) => ({
    type: MOVE_ANCHORS,
    payload: anchors,
})

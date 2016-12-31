// local imports
import { SET_ANCHOR_LOCATIONS } from 'actions/elements'

export default (...anchors) => ({
    type: SET_ANCHOR_LOCATIONS,
    payload: anchors,
})

// local imports
import { PLACE_ELEMENTS } from 'actions/elements'

export default (...elements) => ({
    type: PLACE_ELEMENTS,
    payload: elements,
})

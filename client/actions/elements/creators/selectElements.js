// local imports
import { SELECT_ELEMENTS } from 'actions/elements'

export default (...selection) => ({
    type: SELECT_ELEMENTS,
    payload: selection,
})

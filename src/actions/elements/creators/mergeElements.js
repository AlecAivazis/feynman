// local imports
import { MERGE_ELEMENTS } from 'actions/elements'

export default (id) => ({
    type: MERGE_ELEMENTS,
    payload: id,
})

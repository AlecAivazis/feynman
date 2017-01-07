// local imports
import { MERGE_ELEMENTS } from 'actions/elements'

export default (id, select=false) => ({
    type: MERGE_ELEMENTS,
    payload: {
        id,
        select,
    }
})

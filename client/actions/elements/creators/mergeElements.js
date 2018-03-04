// local imports
import { MERGE_ELEMENTS } from 'actions/elements'

export default (source, select = false) => ({
    type: MERGE_ELEMENTS,
    payload: {
        source,
        select,
    },
})

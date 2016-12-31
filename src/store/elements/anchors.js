// local imports
import { ADD_ANCHORS } from 'actions/elements'

// the reducer that manages just the propagator state but has reference
// to the entire element state reducer (must return just the propagator slice)
export default (state, {type, payload}) => {
    // if the payload corresponds to a new propagator
    if (type === ADD_ANCHORS) {
        // get the current list of anchors
        const { anchors } = state
        console.log(anchors)

        // a local copy of the state to mutate
        const local = { ...anchors }

        // loop over every propagator we are supposed to add
        for (const {id, ...anchor} of payload) {
            // if there is already an anchor with that id
            if (local[id]) {
                throw new Error(`There already is an anchor with id ${payload.id}`)
            }

            // add the anchor to the local store
            local[id] = anchor
        }

        // add the payload to the list of propagators
        return local
    }

    return state.anchors
}

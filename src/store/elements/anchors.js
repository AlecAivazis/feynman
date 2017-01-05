// exteranl imports
import _ from 'lodash'
// local imports
import { ADD_ANCHORS, SET_ANCHOR_LOCATIONS } from 'actions/elements'

export const noIdErr = "cannot set location of anchor without explicit id"

// the reducer that manages just the anchor state but has reference
// to the entire element state reducer (must return just the propagator slice)
export default (state, {type, payload}) => {
    // if the payload corresponds to a new propagator
    if (type === ADD_ANCHORS) {
        // a local copy of the state to mutate
        const local = _.cloneDeep(state.anchors)

        // loop over every propagator we are supposed to add
        for (const anchor of payload) {
            // if there is already an anchor with that id
            if (local[anchor.id]) {
                throw new Error(`There already is an anchor with id ${payload.id}`)
            }

            // add the anchor to the local store
            local[anchor.id] = anchor
        }

        // return the mutated state
        return local
    }

    return state.anchors
}

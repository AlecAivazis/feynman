// exteranl imports
import _ from 'lodash'
// local imports
import { ADD_ANCHORS, ALIGN_SELECTED_ANCHORS  } from 'actions/elements'

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

    // if the action indicates we need to align the selected anchors
    else if (type === ALIGN_SELECTED_ANCHORS) {
        const selection = state.selection.anchors 
        // if there are no selected anchors
        if (selection.length === 0 ) {
            // don't do anything
            return state.anchors
        }

        // get the lense appropriate for the direction
        const lense = {
            horizontal: 'y',
            vertical: 'x'
        }[payload]

        // if we were given an invalid direction
        if (!lense) {
            // yell loudly
            throw new Error(`Cannot align anchors in the ${payload} direction.`)
        }

        // a local copy of the state to mutate
        const local = _.cloneDeep(state.anchors)

        // the average value of the appropriate attribute
        const average = selection
                             // first we need a reference to each selected anchor entity
                             .map(selected => state.anchors[selected])
                             // grab the appropriate attribute
                             .map(anch => anch[lense])
                             // add up the total and divide by the length to compute the avg
                             .reduce((a,b) => a + b, 0) / selection.length

        // return the local copy
        return _.mapValues(local, 
            val => selection.includes(val.id) ? {...val, [lense]: average} : val
        )
    }

    return state.anchors
}

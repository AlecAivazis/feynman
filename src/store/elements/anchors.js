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
        const anchors = Object.values(local)

        // the average value of the appropriate attribute
        const average = anchors.map(anch => anch[lense])
                               .reduce((a,b) => a + b, 0) / anchors.length

        // return the local copy
        return _.mapValues(local, 
            val => ({...val, [lense]: average})
        )
    }

    return state.anchors
}

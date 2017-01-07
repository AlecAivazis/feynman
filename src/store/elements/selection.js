// exteranl imports
import _ from 'lodash'
// local imports
import { SELECT_ELEMENTS, CLEAR_SELECTION, } from 'actions/elements'

export const noIdErr = "cannot set location of anchor without explicit id"

export const initialState = {
    anchors: [],
    propagators: []
}

// the reducer slice that manages just the selection state but has reference
// to the entire element state reducer (must return just the propagator slice)
export default (state=initialState, {type, payload}) => {

    // if the payload represents a new selection
    if (type === SELECT_ELEMENTS) {
        // the payload is a list of objects with id and type fields
        return (
            _.chain(payload)
            .cloneDeep()
            .map(selected => {
                // if there is no element by that type and id
                if (!state[selected.type][selected.id]) {
                    throw new Error(`Could not find ${selected.type} with id ${selected.id}`)
                }
                // pass this item through
                return selected
            })
            .groupBy('type')
            .mapValues(val => val.map(({id}) => id))
            .value()
        )
    }

    // if the action indicates we need to clear the selection
    if (type === CLEAR_SELECTION) {
        // return an empty state
        return _.cloneDeep(initialState)
    }

    // return the previous selection
    return state.selection
}

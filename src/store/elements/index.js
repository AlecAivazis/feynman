// external imports
import _ from 'lodash'
// local imports
import propagatorsPartial from './propagators'
import anchorsPartial from './anchors'
import { SELECT_ELEMENTS, CLEAR_SELECTION, MERGE_ELEMENTS } from 'actions/elements'

// the initial state of elements
export const initialState = {
    anchors: {},
    propagators: [],
    constraints: [],
    texts: [],
    selection: [],
}
// state.propagators.concat(payload)

export default (state = initialState, {type, payload}) => {

    // if the payload represents a new selection
    if (type === SELECT_ELEMENTS) {
        // make a deep copy of the state that we can play with
        const local = _.cloneDeep(state)
        // clear the selection
        local.selection = payload.map(selected => {
            // if there is no element by that type and id
            if (!state[selected.type][selected.id]) {
                throw new Error(`Could not find ${selected.type} with id ${selected.id}`)
            }
            // pass this item through
            return selected
        })

        // return the local copy
        return local
    }

    // if the action indicates we need to clear the selection
    if (type === CLEAR_SELECTION) {
        // make a deep copy of the state that we can play with
        const local = _.cloneDeep(state)
        // clear the selection
        local.selection = []
        // return the new state
        return local
    }

    // if the action indicates we need to dedupe the elements
    if (type === MERGE_ELEMENTS) {
        // make a deep copy of the state that we can play with
        const local = _.cloneDeep(state)

        // make a unique list of anchors
        local.anchors = _.uniqWith(Object.values(local.anchors),
            // where "unique" is defined as matching x and y values
            ({x:x1, y:y1}, {x:x2, y:y2}) => x1 === x2 && y1 === y2
        )

        // return the new state
        return local
    }


    // return the updated state
    return {
        ...state,
        anchors: anchorsPartial(state, {type, payload}),
        propagators: propagatorsPartial(state, {type, payload})
    }
}

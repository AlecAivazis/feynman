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
        // the payload is the id of the anchor we need to merge with
        const sourceId = payload

        // make a deep copy of the state that we can play with
        const local = _.cloneDeep(state)
        const source = local.anchors[sourceId]

        // if the payload is undefined or there isn't an anchor with that id
        if (!source) {
            throw new Error(`Could not find anchor with id ${sourceId}`)
        }

        // a list of duplicated elements
        const dupes = []

        // for each anchor
        for (const anchor of Object.values(local.anchors)) {
            // if the anchor is in the same location as our target
            if (anchor.id !== sourceId &&
                    anchor.x === source.x && anchor.y === source.y) {
                // add the anchor's id to the list
                dupes.push(anchor.id)
            }
        }

        // if there are any dupes
        if (dupes.length > 0) {
            // visit each propagator to replace anchor references
            for (const propagator of local.propagators) {
                // if anchor1 is a reference to this element
                if (propagator.anchor1 === sourceId) {
                    // then the anchor1 needs to become the element replacing the source
                    propagator.anchor1 = dupes[0]
                // otherwise if anchor2 is a reference to this element
                } else if (propagator.anchor2 === sourceId) {
                    // then the anchor2 needs to become the element replacing the source
                    propagator.anchor2 = dupes[0]
                }
            }

            // remove the entry in the anchors object for the original anchor
            Reflect.deleteProperty(local.anchors, sourceId)
        }

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

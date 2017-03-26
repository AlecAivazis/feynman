// external imports
import _ from 'lodash'
// local imports
import propagatorsPartial from './propagators'
import anchorsPartial from './anchors'
import selectionPartial, {initialState as initialSelection} from './selection'
import {
    MERGE_ELEMENTS,
    SET_ELEMENT_ATTRS,
    DELETE_ELEMENTS,
    CLEAR_ELEMENTS,
    DELETE_SELECTION
} from 'actions/elements'
import { flatMap } from 'utils'

// the initial state of elements
export const initialState = {
    anchors: {},
    propagators: {},
    constraints: [],
    texts: [],
    selection: {},
}

export default (state = initialState, {type, payload}) => {

    // if the action indicates we need to dedupe the elements
    if (type === MERGE_ELEMENTS) {
        // the payload is the id of the anchor we need to merge with
        const {id:sourceId, select=false} = payload

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

        // the element we are going to merge onto
        const mergeTarget = dupes[0]

        // if there are any dupes
        if (dupes.length > 0) {
            // visit each propagator to replace anchor references
            for (const propagator of Object.values(local.propagators)) {
                // if anchor1 is a reference to this element
                if (propagator.anchor1 === sourceId) {
                    // then the anchor1 needs to become the element replacing the source
                    propagator.anchor1 = mergeTarget
                // otherwise if anchor2 is a reference to this element
                } else if (propagator.anchor2 === sourceId) {
                    // then the anchor2 needs to become the element replacing the source
                    propagator.anchor2 = mergeTarget
                }
            }

            // remove the entry in the anchors object for the original anchor
            Reflect.deleteProperty(local.anchors, sourceId)

            // if we are supposed to select the resulting element
            if (select) {
                // use the mergeTarget as the only selection
                local.selection.anchors = [mergeTarget]
            }
        }

        // return the new state
        return local
    }

    // if the payload represents updates in various element attributes
    if (type === SET_ELEMENT_ATTRS) {
        // create a copy we can play with
        const local = _.cloneDeep(state)
        // go through each mutation
        for (const {type, id, ...attrs} of payload) {
            // save a reference to the entry we are going to update
            const target = local[type][id]
            // update the appropriate element with the new attrs
            local[type][id] = {
                ...target,
                ...attrs
            }
        }

        // return the local copy
        return local
    }

    // if we need to clear the current collection of elements
    if (type === CLEAR_ELEMENTS) {
        // return the initial state
        return initialState
    }

    // if the payload represents an element to remove
    if (type === DELETE_ELEMENTS) {
        // create a copy we can play with
        const local = _.cloneDeep(state)
        // go over every delete order
        for (const {id, type} of payload) {

            // if there is an element with that id
            if (!local[type] || !local[type][id]) {
                throw new Error(`Can't find ${type} with id ${id}`)
            }

            // remove the original
            Reflect.deleteProperty(local[type], id)

            // if we have a selection of this type
            if (local.selection[type]) {
                // remove the id from the selection
                local.selection[type] = local.selection[type].filter(i => i !== id)
            }

            // if the element is an anchor
            if (type === 'anchors') {
                // only save keep the propagators that don't refer to the anchor
                local.propagators = _.pickBy(local.propagators,
                    ({anchor1, anchor2}) => anchor1 !== id && anchor2 !== id
                )
            }
        }

        // return our copy
        return local
    }

    // if the action indicates we need to delete the selection
    if (type === DELETE_SELECTION) {
        // create a copy we can play with
        const local = _.cloneDeep(state)

        // the selected elements
        const selectedAnchors = local.selection.anchors || []
        const selectedPropagators = local.selection.propagators || []


        // create labeled lists of selected elements
        const anchors = selectedAnchors.map(id => ({id, type: 'anchors'}))
        const propagators = selectedPropagators.map(id => ({id, type: 'propagators'}))

        // the list of propagators we need to include because of related anchors
        const relatedProps = flatMap(selectedAnchors,
            id => (
                // the list of propagators with this id
                (Object.values(local.propagators) || [])
                       .filter(({anchor1, anchor2}) => [anchor1, anchor2].includes(id))
                       .map(({id}) => ({id, type: 'propagators'}))
            )
        )

        // for each element we have to delete
        for (const {type, id} of [...anchors, ...propagators, ...relatedProps]) {
            // if that element still exists
            if (local[type][id]) {
                // remove the element
                Reflect.deleteProperty(local[type], id)
            }
        }

        // clear the selection
        local.selection = initialSelection
        // we're done here
        return local
    }

    // return the updated state
    return {
        ...state,
        anchors: anchorsPartial(state, {type, payload}),
        propagators: propagatorsPartial(state, {type, payload}),
        selection: selectionPartial(state, {type, payload}),
    }
}

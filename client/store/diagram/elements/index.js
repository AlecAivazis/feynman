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
    DELETE_SELECTION,
    ADD_ELEMENTS,
} from 'actions/elements'
import { flatMap } from 'utils'

// the initial state of elements
export const initialState = {
    anchors: {},
    propagators: {},
    text: {},
    selection: {},
    shapes: {},
}
import Shape from 'interface/Diagram/Shape'
const defaultR = Shape.defaultProps.r

export default (state = initialState, {type, payload}) => {

    // if the action indicates we need to dedupe the elements
    if (type === MERGE_ELEMENTS) {

        // make a deep copy of the state that we can play with
        const local = _.cloneDeep(state)

        // the list of unique anchors
        const uniqAnchors = {}
        // a map of old anchor ids to their replacement
        const anchorReplaceMap = {}

        // check anchors for "conflicts"
        for (const anchor of Object.values(local.anchors)) {
            // since an anchor is defined in this context by its location we
            // need to see if there is another anchor with the same location
            // in the unique list
            const match = Object.values(uniqAnchors).find(({x, y}) => anchor.x === x && anchor.y === y)
            // if there was a such match
            if (match) {
               // then we have to replace references to this anchor with the unique one
               anchorReplaceMap[anchor.id] = match.id
            }
            // otherwise there was no match
            else {
                // then add the anchor to the list
                uniqAnchors[anchor.id] = anchor
            }
        }

        // assign the unique set of anchors to the local copy
        local.anchors = uniqAnchors

        // each anchor can be constrained by at most one shape, so loop over anchors first
        // so we can break when we find a shape
        for (const anchor of Object.values(local.anchors)) {
            // try to find a parton that overlaps
            const shapeMatch = Object.values(local.shapes).find(({kind, x,  y, r = defaultR}) =>{
                // compute the distance between the anchor and the shape
                const dx = anchor.x - x
                const dy = anchor.y - y
                // if we are looking at a parton and the point is within our radius
                return kind === 'parton' && Math.sqrt(dx*dx + dy*dy) <= r
            })
            // if there is a match
            if (shapeMatch) {
                // constrain the anchor to the shape
                anchor.constraint = shapeMatch.id
            }
        }

        // we might have to clean up references in propagators
        for (const propagator of Object.values(local.propagators)) {
            // if the propagators anchor1 needs to be replaced
            if (anchorReplaceMap[propagator.anchor1]) {
                // assign the appropriate replacement
                propagator.anchor1 = anchorReplaceMap[propagator.anchor1]
            }
            // if the propagators anchor2 needs to be replaced
            if (anchorReplaceMap[propagator.anchor2]) {
                // assign the appropriate replacement
                propagator.anchor2 = anchorReplaceMap[propagator.anchor2]
            }
        }

        // // the payload is the id of the anchor we need to merge with
        const {source:from, select=false} = payload
        if (select && from.type === 'anchors') {
            if (!from.id) {
                throw new Error("Cannot select anchor after merging from an undefined element.")
            }

            // the element to select
            const element = anchorReplaceMap[from.id]  || from.id
            // use the mergeTarget as the only selection
            local.selection.anchors = [element]
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

    // if the action indicates an element to be added
    if (type === ADD_ELEMENTS) {
        // create a copy we can play with
        const local = _.cloneDeep(state)

        // pull the type of the element out of each entry
        for (const {type, ...element} of payload) {
            // add the element to the store
            local[type][element.id] = {
                ...element,
                type,
            }
        }

        // return our local copy
        return local
    }

    // if the action indicates we need to delete the selection
    if (type === DELETE_SELECTION) {
        // create a copy we can play with
        const local = _.cloneDeep(state)

        // the selected elements
        const selectedAnchors = local.selection.anchors || []
        const selectedPropagators = local.selection.propagators || []
        const selectedText = local.selection.text || []
        const selectedShapes = local.selection.shapes || []

        // create labeled lists of selected elements
        const anchors = selectedAnchors.map(id => ({id, type: 'anchors'}))
        const propagators = selectedPropagators.map(id => ({id, type: 'propagators'}))
        const text = selectedText.map(id => ({id, type: 'text'}))
        const shapes = selectedShapes.map(id => ({id, type: "shapes"}))

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
        for (const {type, id} of [...anchors, ...propagators, ...relatedProps, ...text, ...shapes]) {
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

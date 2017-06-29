// external imports
import _ from 'lodash'
// local imports
import infoReducer from './info'
import elementsReducer from './elements'
import { MOVE_SELECTED_ELEMENTS, SNAP_SELECTED_ELEMENTS } from 'actions/elements'
import { round, fixPositionToGrid } from 'utils'

const initialState = {}

export default (state = initialState, {type, payload}) => {

    if (type === MOVE_SELECTED_ELEMENTS) {
        // create a copy of the element state we can play with
        const local = _.cloneDeep(state.elements)

        // the anchors to move
        const anchors = local.selection.anchors ? [...local.selection.anchors] : []

        // if there are selected propagators
        if (local.selection.propagators) {
            // go over every propagator
            for (const id of local.selection.propagators) {
                // get the anchors associated with that propagator
                const { anchor1, anchor2 } = local.propagators[id]
                // add the propgators anchors to the list of anchors we have to move
                anchors.push(anchor1, anchor2)
            }
        }

        // loop over every selected anchor
        for (const id of _.uniq(anchors)) {
            // save a reference to the assocaited element
            const element = local.anchors[id]
            // if the anchor is not fixed
            if (!element.fixed) {
                // move the element according to the payload
                element.x += payload.x ? round(payload.x, state.info.gridSize) : 0
                element.y += payload.y ? round(payload.y, state.info.gridSize) : 0
            }
        }

        // if there are any text elements to move
        if (local.selection.text) {
            // go over every text element
            for (const id of local.selection.text) {
                // add the move to the element
                local.text[id].x += payload.x || 0
                local.text[id].y += payload.y || 0
            }
        }

        // if there are any shapes to move
        if(local.selection.shapes) {
            // go over every shapes element
            for (const id of local.selection.shapes) {
                // add the move to the element
                local.shapes[id].x += payload.x || 0
                local.shapes[id].y += payload.y || 0
            }
        }

        return {
            ...state,
            elements: local
        }
    }

    // if we need to snap the selected elements to the grid
    if (type === SNAP_SELECTED_ELEMENTS) {
        // create a copy we can play with
        const local = _.cloneDeep(state)

        // make a flat list of the full selection with type label
        const selection = _.flatMap(Object.keys(local.elements.selection),
            type => (
                local.elements.selection[type].map(id => ({id, type}))
            )
        )

        // go over every selected element
        for (const {type, id} of selection) {
            // if the element is a propagator
            if (type === 'propagators') {
                // we have to snap both anchors of a propagator
                const { anchor1, anchor2 } = local.elements[type][id]

                // check if the anchor is fixed
                for (const id of [anchor1, anchor2]) {
                    // the actual anchor object
                    const anchor = local.elements.anchors[id]

                    // if the anchor is fixed dont do anything else
                    if (anchor.fixed) continue

                    // calculate the snapped location for the anchor
                    const newLoc = fixPositionToGrid(anchor, local.info.gridSize)

                    // update the anchor to match the new location
                    local.elements.anchors[id].x = newLoc.x
                    local.elements.anchors[id].y = newLoc.y
                }
            }
            // otherwise all other elements get snapped the same
            else {
                // update the particular element to match the grid
                const newLoc = fixPositionToGrid({
                    x: local.elements[type][id].x,
                    y: local.elements[type][id].y,
                }, local.info.gridSize)

                // update the element to match the new location
                local.elements[type][id].x = newLoc.x
                local.elements[type][id].y = newLoc.y
            }
        }

        // return the local copy
        return local
    }

    return {
        ...state,
        elements: elementsReducer(state.elements, {type, payload}),
        info: infoReducer(state.info, {type, payload})
    }
}

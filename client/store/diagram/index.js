// external imports
import _ from 'lodash'
// local imports
import infoReducer from './info'
import elementsReducer from './elements'
import { MOVE_SELECTED_ELEMENTS } from 'actions/elements'
import { round } from 'utils'

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

    return {
        ...state,
        elements: elementsReducer(state.elements, {type, payload}),
        info: infoReducer(state.info, {type, payload})
    }
}

// local imports
import {
    SET_TITLE,
    TOGGLE_GRID,
    SET_GRID_SIZE,
    TOGGLE_HOTKEYS,
    TOGGLE_HISTORY,
    TOGGLE_ANCHORS,
    TOGGLE_PATTERN_MODAL,
    TOGGLE_PATTERN_INITIAL_VIS,
    TOGGLE_EXPORT_MODAL,
    PAN_DIAGRAM,
    SET_ZOOM,
    ZOOM_OUT,
    ZOOM_IN,
} from 'actions/info'

export const maxZoom = 2
export const minZoom = 0.5

// the default state
export const initialState = {
    title: 'An Example Diagram',
    showGrid: true,
    gridSize: 50,
    showAnchors: true,
    showHistory: false,
    showHotkeys: true,
    showExportModal: false,
    showPatternModal: true, // this must reflect the initial value of `patternModalInitalVis`
    patternModalInitalVis: true,
    pan: {
        x: 0,
        y: 0,
    },
    zoomLevel: 1,
}

// return the diagram reducer
export default (state = initialState, {type, payload}) => {

    // if the action means we should toggle the grid
    if (type === TOGGLE_GRID) {
        // invert the {showGrid} state variable
        return {
            ...state,
            showGrid: !state.showGrid,
        }
    }

    // if the action indicates a change in title
    if (type === SET_TITLE) {
        // change the title
        return {
            ...state,
            title: payload,
        }
    }

    // if the action indicates a change in grid size
    if (type === SET_GRID_SIZE) {
        // change the grid size
        return {
            ...state,
            gridSize: payload
        }
    }

    // if the action indicates we should toggle the hotkeys
    if (type === TOGGLE_HOTKEYS) {
        // change the hotkey visibility
        return {
            ...state,
            showHotkeys: !state.showHotkeys
        }
    }

    // if the action indicates we should toggle the history
    if (type === TOGGLE_HISTORY) {
        // change the history visibility
        return {
            ...state,
            showHistory: !state.showHistory
        }
    }

    // if the action indicates we should toggle the anchors
    if (type === TOGGLE_ANCHORS) {
        // invert the anchor visibility
        return {
            ...state,
            showAnchors: !state.showAnchors,
        }
    }

    // if the action indicates we should toggle the pattern modal
    if (type === TOGGLE_PATTERN_MODAL) {
        // invert the anchor visibility
        return {
            ...state,
            showPatternModal: !state.showPatternModal,
        }
    }

    // if the action indicated we should toggle the initial visibility of the pattern modal
    if (type === TOGGLE_PATTERN_INITIAL_VIS) {
        // invert the internal state
        return {
            ...state,
            patternModalInitalVis: !state.patternModalInitalVis
        }
    }

    // if the action indicates we should toggle the export modal
    if (type === TOGGLE_EXPORT_MODAL) {
        // invert the export modal visibility
        return {
            ...state,
            showExportModal: !state.showExportModal,
        }
    }

    // if the action indicates we need to pan the diagram
    if (type === PAN_DIAGRAM) {
        // add the partial pan to our current state
        return {
            ...state,
            pan: {
                x: state.pan.x + (payload.x || 0),
                y: state.pan.y + (payload.y || 0),
            }
        }
    }

    // if the action specifies the zoom level
    if(type === SET_ZOOM) {
        return {
            ...state,
            // make sure we save what we got
            zoomLevel: payload
        }
    }

    // if the action designates we need to zoom in
    if(type === ZOOM_IN) {
        return {
            ...state,
            // make sure we don't go past the max
            zoomLevel: Math.min(state.zoomLevel + .1, maxZoom)
        }
    }

    // if the action designates we need to zoom out
    if(type === ZOOM_OUT) {
        return {
            ...state,
            zoomLevel: Math.max(state.zoomLevel - .1, minZoom)
        }
    }

    // its an action we don't recognize
    return state
}

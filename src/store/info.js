// local imports
import {
    SET_TITLE,
    TOGGLE_GRID,
    SET_GRID_SIZE,
    TOGGLE_HOTKEYS,
    TOGGLE_ANCHORS,
} from 'actions/info'

// the default state
export const initialState = {
    title: 'An Example Diagram',
    showGrid: true,
    gridSize: 50,
    showAnchors: true,
    showHistory: false,
    showHotkeys: true,
    selected: []
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

    // if the action indicates we should toggle the anchors
    if (type === TOGGLE_ANCHORS) {
        // invert the anchor visibility
        return {
            ...state,
            showAnchors: !state.showAnchors,
        }
    }

    // its an action we don't recognize
    return state
}

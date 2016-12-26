// local imports
import { SET_TITLE, TOGGLE_GRID, SET_GRID_SIZE } from 'actions/diagram'

// the default state
export const initialState = {
    title: 'An Example Diagram',
    showGrid: true,
    gridSize: 50,
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
        /// change the grid size
        return {
            ...state,
            gridSize: payload
        }
    }

    // its an action we don't recognize
    return state
}

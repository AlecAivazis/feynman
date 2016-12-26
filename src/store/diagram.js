// local imports
import { SET_TITLE, TOGGLE_GRID } from 'actions/diagram'

// the default state
export const initialState = {
    title: 'An Example Diagram',
    showGrid: true,
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

    // its an action we don't recognize
    return state
}

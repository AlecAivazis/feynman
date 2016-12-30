// local imports
import { ADD_ELEMENT } from 'actions/elements'

// the initial state of elements
export const initialState = []

export default (state = initialState, {type, payload}) => {
    // if the action corresponds to a new element
    if (type === ADD_ELEMENT) {
        // add the payload as an element
        return state.concat(payload)
    }
    // its an action we don't recognize
    return state
}

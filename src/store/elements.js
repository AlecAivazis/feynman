// local imports
import { ADD_PROPAGATOR } from 'actions/elements'

// the initial state of elements
export const initialState = {
    anchors: [],
    propagators: [],
    constraints: [],
    texts: [],
}

export default (state = initialState, {type, payload}) => {
    // if the action corresponds to a new element
    if (type === ADD_PROPAGATOR) {
        // add the payload as an element
        return {
            ...state,
            propagators: state.propagators.concat(payload)
        }
    }
    // its an action we don't recognize
    return state
}

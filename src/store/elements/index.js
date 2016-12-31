// local imports
import propagatorsPartial from './propagators'
import anchorsPartial from './anchors'

// the initial state of elements
export const initialState = {
    anchors: {},
    propagators: [],
    constraints: [],
    texts: [],
}
// state.propagators.concat(payload)

export default (state = initialState, {type, payload}) => ({
    ...state,
    anchors: anchorsPartial(state, {type, payload}),
    propagators: propagatorsPartial(state, {type, payload})
})

// external imports
import { Map, Stack, fromJS } from 'immutable'

// history is implemented as a store enhancer (higher-order reducer)
export default function historyEnhancer(reducer) {
    // the reducer's initial state
    const wrappedInitial = reducer({}, undefined)
    // the initial state of the enhanced reducer
    const initialState = {
        history: Map({
            head: 1,
            log: Stack.of([fromJS(wrappedInitial)])
        })
    }

    return (state = initialState, action) => {
        // the next state of the store
        const next = reducer(state, action)

        // mix the history state into the wrapped reducer
        return {
            ...state,
            ...next,
        }
    }
}

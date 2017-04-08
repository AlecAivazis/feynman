// external imports
import { Map, Stack, fromJS } from 'immutable'
// local imports
import {
    COMMIT,
    UNDO,
    REDO,
    GOTO,
} from 'actions/history'

// the default configuration
const defaultConfig = {
    initialMessage: ''
}

// history is implemented as a store enhancer (higher-order reducer)
export default function historyEnhancer(reducer, config = defaultConfig) {
    // the reducer's initial state
    const wrappedInitial = reducer(undefined, {})
    // the initial state of the enhanced reducer
    const initialState = {
        history: Map({
            head: 0,
            log: Stack.of(
                Map({
                    message: config.initialMessage,
                    state: fromJS(wrappedInitial),
                })
            )
        })
    }

    return ({history: oldHistory, ...state} = initialState, {type, payload}) => {

        // the next state of the store
        const next = reducer(state, {type, payload})

        // if we have to commit a new state to the log
        if (type === COMMIT) {
            // the new entry in the commit log
            const entry = Map({
                message: payload,
                state,
            })
            // the current head
            const head = oldHistory.get('head')
            // the log after the commit needs to include this entry and clear everything after
            const log = oldHistory.get('log')
                            // clear everything after the current head
                            .slice(0, head + 1)
                            .push(entry)

            // return the previous state with the current one appended to the log
            return {
                ...state,
                history: oldHistory
                            .set('head', head + 1)
                            .set('log', log)
            }
        }

        // we didn't change anything so just pass along whatever the wrapper reducer gave us
        return {
            ...next,
            history: oldHistory,
        }
    }
}

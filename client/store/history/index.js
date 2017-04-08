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
                    state: wrappedInitial,
                })
            )
        })
    }

    return ({history, ...state} = initialState, {type, payload}) => {

        // the next state of the store
        const next = reducer(state, {type, payload})

        // if we have to commit a new state to the log
        if (type === COMMIT) {
            const newHead = Math.max(history.get('head') - 1, 0)
            // the new entry in the commit log
            const entry = Map({
                message: payload,
                state,
            })

            // the log after the commit needs to include this entry and clear everything after
            const log = history.get('log').push(entry)

            // return the previous state with the current one appended to the log
            return {
                ...next,
                history: history
                            .set('head', newHead)
                            .set('log', log)
            }
        }

        // if we have to step back in history
        if (type === UNDO) {
            // the current head
            const newHead = history.get('head') + 1
            // retrieve the appropriate entry in the log
            const entry = history.get('log').get(newHead)
            // get the state stored within
            const state = entry.get('state')

            // return the appropriate state and decrement the head
            return {
                ...state,
                history: history.set('head', newHead)
            }
        }

        // if we have to go forward in history
        if (type === REDO) {
            // the current head
            const newHead = history.get('head') - 1
            // retrieve the appropriate entry in the log
            const entry = history.get('log').get(newHead)
            // get the state stored within
            const state = entry.get('state')

            // return the appropriate state and decrement the head
            return {
                ...state,
                history: history.set('head', newHead)
            }
        }

        // if we have to go to a specific commit
        if (type === GOTO) {
            // retrieve the appropriate entry in the log
            const entry = history.get('log').get(payload)
            // get the state stored within
            const state = entry.get('state')

            // return the appropriate state and decrement the head
            return {
                ...state,
                history: history.set('head', payload)
            }

        }


        // we didn't change anything so just pass along whatever the wrapper reducer gave us
        return {
            ...next,
            history: history,
        }
    }
}

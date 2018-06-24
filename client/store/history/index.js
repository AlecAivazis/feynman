// external imports
import { Map, Stack, fromJS } from 'immutable'
import _ from 'lodash'
// local imports
import { COMMIT, UNDO, REDO, GOTO } from 'actions/history'

// the default configuration
const defaultConfig = {
    initialMessage: '',
}

// history is implemented as a store enhancer (higher-order reducer)
export default function historyEnhancer(reducer, config = defaultConfig) {
    // the reducer's initial state
    const wrappedInitial = reducer(undefined, {})
    // the initial state of the enhanced reducer
    const initialState = {
        history: {
            head: 0,
            log: [],
        },
    }

    return ({ history, ...state } = initialState, { type, payload }) => {
        // the user's state
        const userState = Object.values(state).length > 0 ? state : undefined
        // the next state of the store
        const next = reducer(userState, { type, payload })

        // if we have to commit a new state to the log
        if (type === COMMIT) {
            // the new entry in the commit log
            const entry = {
                message: payload,
                state: _.cloneDeep(state),
            }
            // the log after the commit needs to include this entry and clear everything after
            // add the entry to the first of the current location in the log
            const log = [entry, ..._.cloneDeep(history.log).splice(history.head)]
            // return the previous state with the current one appended to the log (head goes to 0)
            return {
                ...next,
                history: {
                    head: 0,
                    log,
                },
            }
        }

        // if we have to step back in history
        if (type === UNDO) {
            // the current head
            const head = history.head
            const newHead = head === history.log.length - 1 ? head : head + 1
            // retrieve the appropriate entry in the log
            const entry = history.log[newHead]
            // get the state stored within
            const state = _.cloneDeep(entry.state)

            // return the appropriate state and decrement the head
            return {
                ...state,
                history: {
                    ...history,
                    head: newHead,
                },
            }
        }

        // if we have to go forward in history
        if (type === REDO) {
            // the current head
            const head = history.head
            const newHead = head > 0 ? head - 1 : 0
            // retrieve the appropriate entry in the log
            const entry = history.log[newHead]

            // if we passed the end of time
            if (!entry) {
                return {
                    ...next,
                    history,
                }
            }

            // get the state stored within
            const state = _.cloneDeep(entry.state)

            // return the appropriate state and decrement the head
            return {
                ...state,
                history: {
                    ...history,
                    head: newHead,
                },
            }
        }

        // if we have to go to a specific commit
        if (type === GOTO) {
            // retrieve the appropriate entry in the log
            const entry = history.log[payload]
            // get the state stored within
            const state = _.cloneDeep(entry.state)

            // return the appropriate state and decrement the head
            return {
                ...state,
                history: {
                    ...history,
                    head: payload,
                },
            }
        }

        // we didn't change anything so just pass along whatever the wrapper reducer gave us
        return {
            ...next,
            history: history,
        }
    }
}

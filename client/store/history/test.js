// external impots
import { Stack, Map, fromJS } from 'immutable'
// local imports
import historyEnhancer from '.'
import { commit, undo, redo, goto } from 'actions/history'

describe('Reducers', () => {
    describe('History Store Enhancer', () => {
        // the initial state of our mock wrapped reducer
        const reducerInitial = {hello: 'world'}
        // the reducer to wrap
        const reducer = (state=reducerInitial, {type, payload}) => type === 'test' ? ({...state, hello: payload}) : state
        const reducerAction = payload => ({type: 'test', payload})
        // wrap the reducer
        const wrapped = historyEnhancer(reducer)

        // the initial state of the reducer being tested
        let initial

        beforeEach(() => {
            // the initial state
            initial = wrapped(undefined, {})
        })

        test('silently wraps a reducer', () => {
            const wrappedState = wrapped(reducerInitial, reducerAction('moon'))
            const reducerState = reducer(reducerInitial, reducerAction('moon'))
            // make sure the result is the same as the unwrapped version
            expect(wrappedState).toMatchObject(reducerState)
        })

        test('head and log accomodate reducer initial state', () => {
            expect(initial.history).toEqual(Map({
                head: 0,
                log: Stack.of([
                    Map({
                        message: '',
                        state: fromJS(reducerInitial),
                    })
                ])
            }))
        })

        test('committing a new state bumps the head and adds the current state to the log', () => {
            // mutate the state
            const mutated = wrapped(initial, reducerAction('after'))
            // pull out the history from the state before the commit
            const {history, ...before} = mutated

            // commit the new state
            const committed = wrapped(mutated, commit('test msg'))

            // the head of the log
            const headIndex = committed.history.get('head')
            const head = committed.history.get('log').get(head)

            // make sure the head has been increased
            expect(headIndex).toEqual(1)
            // make sure the head of the log has the right state
            expect(head.get('state')).toMatchObject(before)
        })

        test('undo reduces the head by one', () => {
            // undo
            const undoState = wrapped(initial, undo())
            // commit the new state (slightly sloppy but avoids false positive test suite)
            const committed = wrapped(undoState, commit('test msg'))
            // the head of the log
            const head = committed.history.get('head')

            // make sure the head has been increased
            expect(head).toEqual(1)
        })

        test('redo bumps the head bumps the head by one', function() {
            // perform the redo
            const redoState = wrapped(initial, redo())
            // the head of the log
            const head = redoState.history.get('head')

            // make sure the head has been increased (this wont exist so dont go further)
            expect(head).toEqual(1)
        })

        test('goto sets the head to a specific index', () => {
            // perform the redo
            const redoState = wrapped(initial, goto(2))
            // the head of the log
            const head = redoState.history.get('head')

            // make sure the head has been increased (this wont exist so dont go further)
            expect(head).toEqual(2)
        })
    })
})

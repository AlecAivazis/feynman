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
                log: Stack.of(
                    Map({
                        message: '',
                        state: fromJS(reducerInitial),
                    })
                )
            }))
        })

        test('can set initial message', () => {
            // wrap the reducer
            const reducerWithMessage = historyEnhancer(reducer, {initialMessage: "hello"})
            initial = reducerWithMessage(undefined, {})

            expect(initial.history).toEqual(Map({
                head: 0,
                log: Stack.of(
                    Map({
                        message: "hello",
                        state: fromJS(reducerInitial),
                    })
                )
            }))
        })

        test('committing a new state bumps the head and adds the current state to the log', () => {
            // mutate the state and commit it
            const mutated = wrapped(initial, reducerAction('after'))
            // save the user state before we committed
            const { history: _, ...before } = mutated
            const { history } = wrapped(mutated, commit('test msg'))

            // the head of the log
            const headIndex = history.get('head')
            const head = history.get('log').peek(headIndex)

            // make sure the head has been increased
            expect(headIndex).toEqual(1)
            // make sure the head of the log has the right state
            expect(head.get('state')).toMatchObject(before)
        })

        test('undo reduces the head by one and mutates the state', () => {
            // perform a mutation
            const mutated = wrapped(initial, reducerAction('moon'))
            const {history: _, ...state} = mutated

            // commit the new state and return to the original location
            const committed = wrapped(mutated, commit('test msg'))
            const {history, ...undoState} = wrapped(committed, undo())

            // make sure we are back where we started
            expect(undoState).toEqual(reducerInitial)
            // make sure the head has been increased (this wont exist so dont go further)
            expect(history.get('head')).toEqual(1)
        })

        test('redo bumps the head bumps the head by one and mutates the state', function() {
            // perform a mutation
            const mutated = wrapped(initial, reducerAction('moon'))
            const {history: _, ...state} = mutated

            // commit the new state, return to the original location, and then move forward one
            const committed = wrapped(mutated, commit('test msg'))
            const undoState = wrapped(committed, undo())
            const {history, ...redoState} = wrapped(undoState, redo())

            // make sure the head has been increased (this wont exist so dont go further)
            expect(history.get('head')).toEqual(2)
            // make sure we are back where we belong
            expect(redoState).toEqual(state)
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

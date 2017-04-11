// external impots
import { Stack, Map, fromJS } from 'immutable'
import _ from 'lodash'
// local imports
import historyEnhancer from '.'
import { commit, undo, redo, goto } from 'actions/history'

describe('Reducers', () => {
    describe('History Store Enhancer', () => {
        // the initial state of our mock wrapped reducer
        const reducerInitial = {innerState: 'world'}
        // the reducer to wrap
        const reducer = (state=reducerInitial, {type, payload}) => type === 'test' ? ({...state, innerState: payload}) : state
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

        test('committing appends the current state to the log', () => {
            // mutate the state and commit it
            const middle = wrapped(initial, reducerAction('middle state'))
            const committed = wrapped(middle, commit('test msg'))

            // mutate the state and commit it
            let final = wrapped(committed, reducerAction('final state'))
            const { state, history } = wrapped(final, commit('test msg2'))

            // make sure the head still points to the most recent value
            expect(history.get('head')).toEqual(0)
            // and that the rest of the log
            expect(history.get('log').get(1).get('state')).toMatchObject(
                _.omit(committed, 'history')
            )
            expect(history.get('log').get(0).get('state')).toMatchObject(
                _.omit(state, 'history')
            )
        })

        test('undo bumps the head by one and mutates the state', () => {
            // perform a mutation
            const mutated = wrapped(initial, reducerAction('moon'))
            // commit the new state and return to the original location
            const committed = wrapped(mutated, commit('test msg'))

            const mutated2 = wrapped(committed, reducerAction('moon2'))
            const committed2 = wrapped(mutated2, commit('test msg2'))

            const {history, ...undoState} = wrapped(committed2, undo())

            // make sure we are back where we started
            expect(undoState).toEqual(_.omit(committed, 'history'))

            // make sure the head has been increased (this wont exist so dont go further)
            expect(history.get('head')).toEqual(1)
        })

        test('redo reduces the head bumps the head by one and mutates the state', function() {
            // commit the initial state
            const committed = wrapped(initial, commit('test msg'))
            // perform a mutation
            const mutated = wrapped(committed, reducerAction('moon'))

            // commit the new state, return to the original location, and then move forward one
            const committed2 = wrapped(mutated, commit('test msg'))
            const undoState = wrapped(committed2, undo())

            const {history, ...redoState} = wrapped(undoState, redo())

            // make sure the head has been increased back to the most recent change
            expect(history.get('head')).toEqual(0)
            // make sure we are back where we belong
            expect(redoState).toEqual(_.omit(mutated, 'history'))
        })

        test('goto sets the head to a specific index', () => {
            // perform and commit a mutation
            const mutated = wrapped(initial, reducerAction('first state'))
            const committed = wrapped(mutated, commit('first msg'))
            // perform and commit a mutation
            const mutated2 = wrapped(committed, reducerAction('second state'))
            const committed2 = wrapped(mutated2, commit('second msg'))
            // perform and commit a mutation
            const mutated3 = wrapped(committed2, reducerAction('third state'))
            const committed3 = wrapped(mutated3, commit('third msg'))

            // go to the state 2 commits ago
            const gotoState = wrapped(committed3, goto(2))
            // the head of the log
            const head = gotoState.history.get('head')

            // make sure the head has been set
            expect(head).toEqual(2)
            // make sure the state of the reducer is what we expect
            expect(_.omit(gotoState, 'history')).toMatchObject(_.omit(committed, 'history'))
        })

        test('gracefully handles undoing before the dawn of time', () => {
            const committed = wrapped(initial, commit('first msg'))
            // undo when when there isn't anything before
            const undoState = wrapped(committed, undo())

            // stanity check
            expect(undoState.history.get('head')).toEqual(0)

            // one more undo, this is before the start of time
            const undoStateFinal = wrapped(undoState, undo())

            // make sure the head has been set
            expect(undoStateFinal.history.get('head')).toEqual(0)
        })

        test('gracefully handles redoing before the end of time', () => {
            const committed = wrapped(initial, commit('first msg'))
            const committed2 = wrapped(committed, commit('first msg'))
            // undo when when there isn't anything before
            const undoState = wrapped(committed2, undo())
            // redo when when there isn't anything after
            const redoState = wrapped(undoState, redo())
            const redoState2 = wrapped(redoState, redo())

            // make sure the head has been set
            expect(redoState2.history.get('head')).toEqual(0)
        })

        test('committing removes the future log', () => {
            // perform and commit a mutation
            const mutated = wrapped(initial, reducerAction('first state'))
            const committed = wrapped(mutated, commit('first msg'))
            // perform and commit a mutation
            const mutated2 = wrapped(committed, reducerAction('second state'))
            const committed2 = wrapped(mutated2, commit('second msg'))
            // perform and commit a mutation
            const mutated3 = wrapped(committed2, reducerAction('third state'))
            const committed3 = wrapped(mutated3, commit('third msg'))

            // perform 2 undos
            const undo1 = wrapped(committed3, undo())
            const undo2 = wrapped(undo1, undo())

            // perform and commit a mutation
            const mutated4 = wrapped(undo2, reducerAction('fourh state'))
            const { history } = wrapped(mutated4, commit('fourh msg'))

            // make sure there is only 2 commits in the log
            expect(history.get('log').size).toEqual(2)
            // and that we're still looking at the most recent
            expect(history.get('head')).toEqual(0)
        })
    })
})

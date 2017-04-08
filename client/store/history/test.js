// external impots
import { Stack, Map, fromJS } from 'immutable'
// local imports
import historyEnhancer from '.'

describe('Reducers', () => {
    describe('History Store Enhancer', () => {
        // the initial state of our mock wrapped reducer
        const reducerInitial = {hello: 'world'}
        // the reducer to wrap
        const reducer = (state, action) => reducerInitial
        // wrap the reducer
        const wrapped = historyEnhancer(reducer)

        // the initial state of the reducer being tested
        let initial

        beforeEach(() => {
            // the initial state
            initial = wrapped()
        })

        test('silently wraps a reducer', () => {
            // make sure the result is the same as the unwrapped version
            expect(wrapped('hello', 'world')).toMatchObject(reducer('hello', 'world'))
        })

        test('injects the history state alongside the underlying store', () => {
            // make sure there is an underlying history entry
            expect(initial).toMatchObject({
                history: {},
            })
        })

        test('head and log accomodate reducer initial state', () => {
            expect(initial.history).toEqual(Map({
                head: 1,
                log: Stack.of([fromJS(reducerInitial)])
            }))
        })

        test('committing a new state bumps the head and adds the current state to the log', () => {

        })
    })
})

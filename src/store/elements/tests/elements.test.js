// local imports
import { createStore } from 'store'
import reducer, { initialState } from '..'


describe('Reducers', function() {

    describe('Elements reducer', function() {
        it('has a reasonable default', function() {
            // pass an undefined current state
            const val = reducer(undefined, {type: "init"})
            // expect the default initial state
            expect(val).to.deep.equal(initialState)
        })
    })
})

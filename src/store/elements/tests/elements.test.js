// local imports
import { createStore } from 'store'
import reducer from '..'


describe('Reducers', function() {

    describe('Elements reducer', function() {
        it('has a default value', function() {
            // pass an undefined current state
            const val = reducer(undefined, {type: "init"})
            // expect the default initial state
            expect(val).to.exist
        })
    })
})

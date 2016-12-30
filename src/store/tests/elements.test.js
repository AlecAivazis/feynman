// external imports
import {combineReducers, createStore} from 'redux'
// local imports
import reducer, { initialState } from '../elements'


describe('Elements reducer', function() {
    it('has a reasonable default', function() {
        // pass an undefined current state
        const val = reducer(undefined, {type: "init"})
        // expect the default initial state
        expect(val).to.deep.equal(initialState)
    })
})
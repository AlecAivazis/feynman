// external imports
import {combineReducers, createStore} from 'redux'
// local imports
import diagramReducer, { initialState } from '../diagram'

describe('diagram reducer', function() {
    it('has a reasonable default', function() {
        // pass an undefined current state
        const val = diagramReducer(undefined, {type: "init"})
        // expect the default initial state
        expect(val).to.deep.equal(initialState)
    })
})

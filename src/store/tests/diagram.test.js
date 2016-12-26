// external imports
import {combineReducers, createStore} from 'redux'
// local imports
import diagramReducer, { initialState } from '../diagram'
import { setDiagramTitle, toggleGrid } from 'actions/diagram'

describe('the diagram reducer', function() {
    it('should have a reasonable default', function() {
        // pass an undefined current state
        const val = diagramReducer(undefined, {type: "init"})
        // expect the default initial state
        expect(val).to.deep.equal(initialState)
    })


})

describe('action creators', function() {
    it('can create an action to change diagram title', function() {

    })

    it('can create an action to change toggle the grid', function() {

    })
})

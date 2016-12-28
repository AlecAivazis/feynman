// external imports
import {combineReducers, createStore} from 'redux'
// local imports
import diagramReducer, { initialState } from '../info'
import {
    setDiagramTitle,
    toggleGrid,
    setGridSize,
    toggleHotkeys,
    toggleAnchors,
} from 'actions/info'

describe('info reducer', function() {
    it('has a reasonable default', function() {
        // pass an undefined current state
        const val = diagramReducer(undefined, {type: "init"})
        // expect the default initial state
        expect(val).to.deep.equal(initialState)
    })

    it('responds to the SET_TITLE action', function() {
        // create an action corresponding to changing the title
        const action = setDiagramTitle('hello')
        // get the mutated state after changing the title
        const state = diagramReducer(undefined, action)
        // make sure the title matches the expectation
        expect(state.title).to.equal('hello')
    })

    it('responds to the TOGGLE_GRID action', function() {
        // create an action corresponding to toggling the grid
        const action = toggleGrid()
        // get the mutated state after toggling the grid
        const state = diagramReducer(undefined, action)
        // make sure the title matches the expectation
        expect(state.showGrid).to.equal(!initialState.showGrid)
    })

    it('responds to the SET_GRID_SIZE action', function() {
        // create an action corresponding to the set grid size
        const action = setGridSize(20)
        // get the mutated state after changing the grid size
        const state = diagramReducer(undefined, action)
        // make sure the title matches the expectation
        expect(state.gridSize).to.equal(20)

    })

    it('responds to the TOGGLE_HOTKEYS action', function() {
        // create an action corresponding to toggling the grid
        const action = toggleHotkeys()
        // get the mutated state after toggling the grid
        const state = diagramReducer(undefined, action)
        // make sure the title matches the expectation
        expect(state.showHotkeys).to.equal(!initialState.showHotkeys)
    })

    it('responds to the TOGGLE_ANCHORS action', function(){
        // create an action corresponding to toggling the grid
        const action = toggleAnchors()
        // get the mutated state after toggling the grid
        const state = diagramReducer(undefined, action)
        // make sure the title matches the expectation
        expect(state.showAnchors).to.equal(!initialState.showAnchors)
    })
})

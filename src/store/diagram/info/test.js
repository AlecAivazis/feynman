// external imports
import {combineReducers, createStore} from 'redux'
// local imports
import reducer, { initialState } from '../info'
import {
    setDiagramTitle,
    toggleGrid,
    setGridSize,
    toggleHotkeys,
    toggleAnchors,
    togglePatternModal,
    toggleExportModal,
    TOGGLE_PATTERN_INITIAL_VIS, // there is only a thunk for this action so 
} from 'actions/info'           // import the type directly

describe('Reducers', function() {
    describe('Info reducer', function() {
        it('has a reasonable default', function() {
            // pass an undefined current state
            const val = reducer(undefined, {type: "init"})
            // expect the default initial state
            expect(val).to.deep.equal(initialState)
        })

        it('responds to the SET_TITLE action', function() {
            // create an action corresponding to changing the title
            const action = setDiagramTitle('hello')
            // get the mutated state after changing the title
            const state = reducer(undefined, action)
            // make sure the title matches the expectation
            expect(state.title).to.equal('hello')
        })

        it('responds to the TOGGLE_GRID action', function() {
            // create an action corresponding to toggling the grid
            const action = toggleGrid()
            // get the mutated state after toggling the grid
            const state = reducer(undefined, action)
            // make sure the title matches the expectation
            expect(state.showGrid).to.equal(!initialState.showGrid)
        })

        it('responds to the SET_GRID_SIZE action', function() {
            // create an action corresponding to the set grid size
            const action = setGridSize(20)
            // get the mutated state after changing the grid size
            const state = reducer(undefined, action)
            // make sure the title matches the expectation
            expect(state.gridSize).to.equal(20)

        })

        it('responds to the TOGGLE_HOTKEYS action', function() {
            // create an action corresponding to toggling the grid
            const action = toggleHotkeys()
            // get the mutated state after toggling the grid
            const state = reducer(undefined, action)
            // make sure the title matches the expectation
            expect(state.showHotkeys).to.equal(!initialState.showHotkeys)
        })

        it('responds to the TOGGLE_ANCHORS action', function() {
            // create an action corresponding to toggling the grid
            const action = toggleAnchors()
            // get the mutated state after toggling the grid
            const state = reducer(undefined, action)
            // make sure the title matches the expectation
            expect(state.showAnchors).to.equal(!initialState.showAnchors)
        })

        it('responds to the TOGGLE_PATTERN_MODAL action', function() {
            // create an action corresponding to toggling the pattern modal
            const action = togglePatternModal()
            // get the mutated state after toggling the pattern modal
            const state = reducer(undefined, action)
            // make sure the title matches the expectation
            expect(state.showPatternModal).to.equal(!initialState.showPatternModal)
        })

        it('responds to the TOGGLE_PATTERN_INITIAL_VIS action', function() {
            // create an action corresponding to toggle the initial visibility of the pattern modal
            const action = {
                type: TOGGLE_PATTERN_INITIAL_VIS,
            }
            // get the mutated state after toggling the visibility
            const mutated = reducer(undefined, action) 
            // make sure the internal state flipped
            expect(mutated.patternModalInitalVis).to.equal(!initialState.patternModalInitalVis)
        })

        it('responds to the TOGGLE_EXPORT_MODAL action', function() {
            // create the action to toggle the xport modal
            const action = toggleExportModal()
            // get the state after toggling the modal
            const state = reducer(undefined, action)
            // make sure the state look like we expect
            expect(state.showExportModal).to.equal(!initialState.showExportModal)
        })
    })
})

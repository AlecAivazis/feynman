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
    panDiagram,
    zoomIn,
    zoomOut,
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

        describe('panning', function() {
            it('incrementally pans', function() {
                // get the state of the reducer after panning
                const state = reducer(undefined, panDiagram({x: 10, y: 5}))
                // make sure the state updated as expected
                expect(state.pan).to.deep.equal({x: 10, y: 5})

                // pan again
                const secondPan = reducer(state, panDiagram({x: -10, y: -5}))
                // make sure we added teh results
                expect(secondPan.pan).to.deep.equal({x: 0, y: 0})
            })
        })

        describe('zoom', function() {
            it('responds to the ZOOM_IN action', function() {
                // zoom in from the initial state
                const zoomed = reducer(undefined, zoomIn())
                // make sure we incremented the zoom level correctly
                expect(zoomed.zoomLevel).to.equal(1.1)
                // zoom in again
                const zoomed2 = reducer(zoomed, zoomIn())
                // make sure we incremented the zoom level correctly
                expect(zoomed2.zoomLevel.toFixed(1)).to.equal(1.2.toFixed(1))
            })

            it('responds to the ZOOM_OUT action', function() {
                // zoom out from the initial state
                const zoomed = reducer(undefined, zoomOut())
                // make sure we incremented the zoom level correctly
                expect(zoomed.zoomLevel).to.deep.equal(0.9)
                // zoom out again
                const zoomed2 = reducer(zoomed, zoomOut())
                // make sure we incremented the zoom level correctly
                expect(zoomed2.zoomLevel).to.deep.equal(0.8)
            })

            it('responds to both zooms', function() {
                // zoom out from the initial state
                const zoomed = reducer(undefined, zoomOut())
                // zoom out again
                const zoomed2 = reducer(zoomed, zoomIn())
                // make sure we incremented the zoom level correctly
                expect(zoomed2.zoomLevel).to.deep.equal(1)
            })

            it('does not zoom in past 2', function() {
                // zoom in from the initial state
                const zoomed = reducer(undefined, zoomIn())
                // zoom in again
                const zoomed2 = reducer(zoomed, zoomIn())
                const zoomed3 = reducer(zoomed2, zoomIn())
                const zoomed4 = reducer(zoomed3, zoomIn())
                const zoomed5 = reducer(zoomed4, zoomIn())
                const zoomed6 = reducer(zoomed5, zoomIn())
                const zoomed7 = reducer(zoomed6, zoomIn())
                const zoomed8 = reducer(zoomed7, zoomIn())
                const zoomed9 = reducer(zoomed8, zoomIn())
                const zoomed10 = reducer(zoomed9, zoomIn())
                const zoomed11 = reducer(zoomed10, zoomIn())

                // make sure we didn't go above 2
                expect(zoomed11.zoomLevel.toFixed(1)).to.equal(2.0.toFixed(1))
            })

            it('does not zoom out past 0.5', function () {
                // zoom in from the initial state
                const zoomed = reducer(undefined, zoomOut())
                // zoom in again
                const zoomed2 = reducer(zoomed, zoomOut())
                const zoomed3 = reducer(zoomed2, zoomOut())
                const zoomed4 = reducer(zoomed3, zoomOut())
                const zoomed5 = reducer(zoomed4, zoomOut())
                const zoomed6 = reducer(zoomed5, zoomOut())
                const zoomed7 = reducer(zoomed6, zoomOut())
                const zoomed8 = reducer(zoomed7, zoomOut())
                const zoomed9 = reducer(zoomed8, zoomOut())
                const zoomed10 = reducer(zoomed9, zoomOut())
                const zoomed11 = reducer(zoomed10, zoomOut())

                // make sure we didn't go above 2
                expect(zoomed11.zoomLevel.toFixed(1)).to.equal(0.5.toFixed(1))
            })
        })
    })
})

import sinon from 'sinon'
import 'babel-polyfill'
// local imports
import {
    setDiagramTitle, SET_TITLE,
    toggleGrid, TOGGLE_GRID,
    setGridSize, SET_GRID_SIZE,
    toggleHotkeys, TOGGLE_HOTKEYS,
    toggleAnchors, TOGGLE_ANCHORS,
    selectElements, SELECT_ELEMENTS,
    togglePatternModal, TOGGLE_PATTERN_MODAL,
    togglePatternModalInitialVis, TOGGLE_PATTERN_INITIAL_VIS,
    toggleExportModal, TOGGLE_EXPORT_MODAL,
    panDiagram, PAN_DIAGRAM,
    setZoom, SET_ZOOM,
    zoomIn, ZOOM_IN,
    zoomOut, ZOOM_OUT,
} from 'actions/info'
import { fieldName } from '../creators/togglePatternModalInitialVis'
import LocalStorageMock from './storage.js'
import { createStore } from 'store'


describe('Action Creators', function() {
    describe('Info', function() {
        it('change diagram title', function() {
            // the title to change the diagram to
            const title = 'hello'

            // make sure the action is expected
            expect(setDiagramTitle(title)).toEqual({
                type: SET_TITLE,
                payload: title,
            })
        })

        it('pan diagram', function() {
            // the pan for the diagram
            const pan = {x: 10}

            // make sure the action is expected
            expect(panDiagram(pan)).toEqual({
                type: PAN_DIAGRAM,
                payload: pan,
            })
        })

        it('toggle the grid', function() {
            // all we care about is the type
            expect(togglePatternModal()).toEqual({
                type: TOGGLE_PATTERN_MODAL,
            })
        })

        it('toggle the grid', function() {
            // all we care about is the type
            expect(toggleGrid()).toEqual({
                type: TOGGLE_GRID,
            })
        })

        it('toggle the export modal', function() {
            // all we care about is the type
            expect(toggleExportModal()).toEqual({
                type: TOGGLE_EXPORT_MODAL,
            })
        })

        it('set the grid size', function() {
            // the new size for the grid
            const size = 20

            // all we care about is the type
            expect(setGridSize(size)).toEqual({
                type: SET_GRID_SIZE,
                payload: size
            })
        })

        it('toggle the hotkeys', function() {
            // all we care about is the type
            expect(toggleHotkeys()).toEqual({
                type: TOGGLE_HOTKEYS,
            })
        })

        it('toggle the anchors', function() {
            // all we care about is the type
            expect(toggleAnchors()).toEqual({
                type: TOGGLE_ANCHORS,
            })
        })

        it('zoom set', function(){
            expect(setZoom(1.0)).toEqual({
                type: SET_ZOOM,
                payload: 1.0,
            })
        })

        it('zoom in', function(){
            expect(zoomIn()).toEqual({
                type: ZOOM_IN,
            })
        })

        it('zoom out', function(){
            expect(zoomOut()).toEqual({
                type: ZOOM_OUT,
            })
        })

        describe('Toggle Pattern Initial Visibility Thunk', function() {

            // some mocks, fixtures, and spies
            let store, storage, thunk, dispatch
            beforeEach(function() {
                // a store to pass to the Thunk
                store = createStore()
                // a mocked local storage to pass to the thunk factory
                storage = new LocalStorageMock()
                // create an instance of the thunk with the mocked storage
                thunk = togglePatternModalInitialVis(storage)
                // we need a dispatch we can check against
                dispatch = jest.fn()
            })

            it('inverts the current state in local storage', function() {
                // call the thunk
                thunk(dispatch, store.getState)

                // make sure dispatch was called with the correct action
                expect(dispatch).toHaveBeenCalledWith({
                    type: TOGGLE_PATTERN_INITIAL_VIS,
                })
            })

            it('inverts the current state in local storage', function() {
                // call the thunk
                thunk(dispatch, store.getState)

                // make sure dispatch was called with the correct action
                expect(storage.getItem(fieldName)).toEqual(
                    !store.getState().diagram.info.patternModalInitalVis
                )
            })
        })
    })
})

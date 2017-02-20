// local imports
import {
    setDiagramTitle, SET_TITLE,
    toggleGrid, TOGGLE_GRID,
    setGridSize, SET_GRID_SIZE,
    toggleHotkeys, TOGGLE_HOTKEYS,
    toggleAnchors, TOGGLE_ANCHORS,
    selectElements, SELECT_ELEMENTS,
    togglePatternModal, TOGGLE_PATTERN_MODAL,
} from 'actions/info'


describe('Action Creators', function() {
    describe('Info', function() {
        it('change diagram title', function() {
            // the title to change the diagram to
            const title = 'hello'

            // make sure the action is expected
            expect(setDiagramTitle(title)).to.deep.equal({
                type: SET_TITLE,
                payload: title,
            })
        })

        it('toggle the grid', function() {
            // all we care about is the type
            expect(togglePatternModal()).to.deep.equal({
                type: TOGGLE_PATTERN_MODAL,
            })
        })

        it('toggle the grid', function() {
            // all we care about is the type
            expect(toggleGrid()).to.deep.equal({
                type: TOGGLE_GRID,
            })
        })

        it('set the grid size', function() {
            // the new size for the grid
            const size = 20

            // all we care about is the type
            expect(setGridSize(size)).to.deep.equal({
                type: SET_GRID_SIZE,
                payload: size
            })
        })

        it('toggle the hotkeys', function() {
            // all we care about is the type
            expect(toggleHotkeys()).to.deep.equal({
                type: TOGGLE_HOTKEYS,
            })
        })

        it('toggle the anchors', function() {
            // all we care about is the type
            expect(toggleAnchors()).to.deep.equal({
                type: TOGGLE_ANCHORS,
            })
        })
    })
})

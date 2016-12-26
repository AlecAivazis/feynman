// local imports
import {
    setDiagramTitle, SET_TITLE,
    toggleGrid, TOGGLE_GRID,
    setGridSize, SET_GRID_SIZE,
} from 'actions/info'


describe('info action creators', function() {
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
})

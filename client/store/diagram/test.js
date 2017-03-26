// local imports
import reducer from '.'
import {
    moveSelectedElements,
    addAnchors,
    addPropagators,
    selectElements,
    setElementAttrs,
} from 'actions/elements'
import { setGridSize } from 'actions/info'
import { createStore } from 'store'
import { round } from 'utils'

describe('Reducers', function() {
    describe('Diagram', function() {
        // a store to test with
        let store
        // with one anchor
        const initialAnchor = {
            id: 1,
            x: 50,
            y: 50
        }

        beforeEach(function() {
            // start with a fresh store
            store = createStore()
        })

        it('has the info reducer', function() {
            expect(store.getState().diagram.info).to.exist
        })

        it('has the elements reducer', function() {
            expect(store.getState().diagram.elements).to.exist
        })

        describe("Moving elements", function() {

            it("can move selected anchors", function(){
                // the anchors we are going to start off with
                const anchors = [
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                    },
                    {
                        id: 3,
                        x: 500,
                        y: 100
                    }
                ]

                // start off with some anchors
                const initialState = reducer(undefined, addAnchors(...anchors))

                // select a subset of the anchors
                const selectedState = reducer(initialState, selectElements(
                    {
                        type: 'anchors',
                        id: 1,
                    },
                    {
                        type: 'anchors',
                        id: 2,
                    }
                ))

                // the move to issue on the selected anchors
                const move = {
                    x: 50,
                    y: 50,
                }

                // move the selected anchors
                const movedState = reducer(selectedState, moveSelectedElements(move))

                // make sure the selected anchors were moved
                expect(movedState.elements.anchors[1].x).to.equal(anchors[0].x + move.x)
                expect(movedState.elements.anchors[1].y).to.equal(anchors[0].y + move.y)
                expect(movedState.elements.anchors[2].x).to.equal(anchors[1].x + move.x)
                expect(movedState.elements.anchors[2].y).to.equal(anchors[1].y + move.y)
                // make sure the non-selected anchor wasn't moved
                expect(movedState.elements.anchors[3].x).to.equal(anchors[2].x)
                expect(movedState.elements.anchors[3].y).to.equal(anchors[2].y)
            })

            it('can move selected propagators', function() {
                // the anchors we are going to start off with
                const anchors = [
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                    },
                    {
                        id: 3,
                        x: 500,
                        y: 100
                    }
                ]

                // start off with some anchors
                const initialState = reducer(undefined, addAnchors(...anchors))

                // add a propagator connecting the two
                const propagatorState = reducer(initialState, addPropagators(
                    {
                        id: 1,
                        kind: 'fermion',
                        anchor1: 1,
                        anchor2: 2,
                    }
                ))

                // select the propagator
                const selectedState = reducer(propagatorState, selectElements(
                    {
                        type: 'propagators',
                        id: 1,
                    }
                ))

                // the amount of move the propagator
                const move = {
                    x: 50,
                    y: 50,
                }

                // move the propagator
                const movedState = reducer(selectedState, moveSelectedElements(move))

                // make sure the appropriate anchors were moved
                expect(movedState.elements.anchors[1].x).to.equal(anchors[0].x + move.x)
                expect(movedState.elements.anchors[1].y).to.equal(anchors[0].y + move.y)
                expect(movedState.elements.anchors[2].x).to.equal(anchors[1].x + move.x)
                expect(movedState.elements.anchors[2].y).to.equal(anchors[1].y + move.y)
                // make sure the non-selected anchor wasn't moved
                expect(movedState.elements.anchors[3].x).to.equal(anchors[2].x)
                expect(movedState.elements.anchors[3].y).to.equal(anchors[2].y)
            })

            it("can move with partial payload", function() {
                // the anchors we are going to start off with
                const anchors = [
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                    }
                ]

                // start off with some anchors
                const initialState = reducer(undefined, addAnchors(...anchors))

                // select a subset of the anchors
                const selectedState = reducer(initialState, selectElements(
                    {
                        type: 'anchors',
                        id: 1,
                    },
                ))

                // the move to issue on the selected anchors
                const move = {
                    x: 50,
                }

                // move the selected anchors
                const movedState = reducer(selectedState, moveSelectedElements(move))

                // make sure the selected anchors were moved
                expect(movedState.elements.anchors[1].x).to.equal(anchors[0].x + move.x)
                expect(movedState.elements.anchors[1].y).to.equal(anchors[0].y)
            })

            it('moving selected elements does not affect pinned anchors', function() {
                // the anchors we are going to start off with
                const anchors = [
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                    }
                ]

                // start off with some anchors
                const initialState = reducer(undefined, addAnchors(...anchors))
                // pin the anchor we just created
                const pinnedState = reducer(initialState, setElementAttrs({type: 'anchors', id: 1, fixed: true}))

                // select a subset of the anchors
                const selectedState = reducer(pinnedState, selectElements(
                    {
                        type: 'anchors',
                        id: 1,
                    },
                ))

                // the move to issue on the selected anchors
                const move = {
                    x: 50,
                }

                // move the selected anchors
                const movedState = reducer(selectedState, moveSelectedElements(move))

                // make sure the selected anchors were moved
                expect(movedState.elements.anchors[1].x).to.equal(anchors[0].x)
                expect(movedState.elements.anchors[1].y).to.equal(anchors[0].y)
            })

            it('moving an element snaps to grid', function() {
                // the anchors we are going to start off with
                const anchors = [
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                    }
                ]

                // start off with some anchors
                const initialState = reducer(undefined, addAnchors(...anchors))

                // select a subset of the anchors
                const selectedState = reducer(initialState, selectElements(
                    {
                        type: 'anchors',
                        id: 1,
                    },
                ))

                // the move to issue on the selected anchors
                const move = {
                    x: 48,
                }

                // move the selected anchors
                const movedState = reducer(selectedState, moveSelectedElements(move))

                // make sure the selected anchors were moved
                expect(movedState.elements.anchors[1].x).to.equal(round(anchors[0].x + move.x, movedState.info.gridSize))
                expect(movedState.elements.anchors[1].y).to.equal(anchors[0].y)
            })

            it('moving an anchor with no grid works as expected', function() {
                // start off with a diagram with no grid
                const diagram = reducer(undefined, setGridSize(0))

                // the anchors we are going to start off with
                const anchors = [
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                    }
                ]

                // add some anchors
                const anchorState = reducer(diagram, addAnchors(...anchors))

                // select a subset of the anchors
                const selectedState = reducer(anchorState, selectElements(
                    {
                        type: 'anchors',
                        id: 1,
                    },
                ))

                // set the grid size to zero

                // the move to issue on the selected anchors
                const move = {
                    x: 48,
                }

                // move the selected anchors
                const movedState = reducer(selectedState, moveSelectedElements(move))

                // make sure the selected anchors were moved
                expect(movedState.elements.anchors[1].x).to.equal(anchors[0].x + move.x)
                expect(movedState.elements.anchors[1].y).to.equal(anchors[0].y)
            })
        })

    })
})

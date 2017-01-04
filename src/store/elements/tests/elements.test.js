// local imports
import { createStore } from 'store'
import reducer from '..'
import {
    selectElements,
    addAnchors,
    clearSelection,
    mergeElements,
    addPropagators
} from 'actions/elements'


describe('Reducers', function() {

    describe('Elements reducer', function() {
        it('has a default value', function() {
            // pass an undefined current state
            const val = reducer(undefined, {type: "init"})
            // expect the default initial state
            expect(val).to.exist
        })

        it('responds to the SELECT_ELEMENTS action', function() {
            // add some anchors
            const addAction = addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 100,
                },
                {
                    id: 2,
                    x: 100,
                    y: 100,
                }
            )
            const state = reducer(undefined, addAction)

            // the selection
            const selection = [
                {
                    type: 'anchors',
                    id: 1
                },
                {
                    type: 'anchors',
                    id: 2
                }
            ]
            // create an action to fire
            const selectAction = selectElements(...selection)

            // pass the action to the reducer in the intermediate state
            const val = reducer(state, selectAction)

            // make sure the selection is present
            expect(val.selection).to.deep.equal(selection)
        })

        it('throws an error if selecting an anchor that doesn\'t exist', function() {
            // the selection
            const selection = [
                {
                    type: 'anchors',
                    id: 1
                },
            ]
            // the action to throw
            const action = selectElements(...selection)

            expect(() => reducer(undefined, action)).to.throw(Error)
        })

        it('responds to the CLEAR_SELECTION action', function() {
            // add some anchors
            const addAction = addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 100,
                }
            )
            const actionState = reducer(undefined, addAction)
            // add some anchors
            const selectAction = selectElements(
                {
                    type: 'anchors',
                    id: 1,
                }
            )
            const state = reducer(actionState, selectAction)
            // sanity check
            expect(state.selection).to.have.length(1)

            // clear the selection
            const clearedState = reducer(state, clearSelection())

            // make sure the selection is emtpy
            expect(clearedState.selection).to.have.length(0)
        })

        it('merges anchors that are located at the same location', function() {
            // the location of the conflict
            const coords = {
                x: 50,
                y: 50,
            }
            // start off with some anchors
            const anchorState = reducer(undefined, addAnchors(
                {
                    id: 1,
                    ...coords,
                },
                {
                    id: 2,
                    ...coords,
                },
                {
                    id: 3,
                    x: 300,
                    y: 500,
                }
            ))

            // tell the reducer to merge itself
            const mergedState = reducer(anchorState, mergeElements(1))

            // make sure there are only two anchors left
            expect(Object.values(mergedState.anchors)).to.have.length(2)

            // make sure the first entry does not exist
            expect(mergedState.anchors[2].x).to.equal(coords.x)
            expect(mergedState.anchors[2].y).to.equal(coords.y)
            // make sure the second is valid
            expect(mergedState.anchors[1]).to.not.exist
            // make sure the third was left untouched
            expect(mergedState.anchors[3].x).to.equal(300)
            expect(mergedState.anchors[3].y).to.equal(500)
        })

        it('replaces anchor references when merging', function() {
            // the location of the conflict
            const coords = {
                x: 50,
                y: 50,
            }

            // start off with some anchors
            const anchorState = reducer(undefined, addAnchors(
                {
                    id: 1,
                    ...coords,
                },
                {
                    id: 2,
                    ...coords,
                },
                {
                    id: 3,
                    x: 300,
                    y: 500,
                }
            ))

            // add a propagator
            const propagatorState = reducer(anchorState, addPropagators(
                {
                    type: 'fermion',
                    anchor1: 2,
                    anchor2: 3
                }
            ))

            // tell the store to merge elements onto anchor 1
            const mergedState = reducer(propagatorState, mergeElements(1))

            // since that should replace anchor 1, the propagotr's anchor1 value should be 2
            expect(mergedState.propagators[0].anchor1).to.equal(2)
        })

        it('barfs if merging onto an undefined id', function() {
            expect(() => reducer(undefined, mergeElements(undefined))).to.throw(Error)
        })

        it('barfs if merging onto a non-existant id', function() {
            expect(() => reducer(undefined, mergeElements(1))).to.throw(Error)
        })
    })
})

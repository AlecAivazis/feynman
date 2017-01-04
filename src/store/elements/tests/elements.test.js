// local imports
import { createStore } from 'store'
import reducer from '..'
import { selectElements, addAnchors, clearSelection, mergeElements } from 'actions/elements'


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
            const mergedState = reducer(anchorState, mergeElements())

            // make sure there are only two anchors left
            expect(mergedState.anchors).to.have.length(2)
            // a list of anchors
            const anchors = Object.values(mergedState.anchors)

            // a utility to verify the identity of an anchor
            const verify = loc => loc.x === coords.x && loc.y === coords.y

            // if we couldn't verify either anchor
            if (!verify(anchors[0]) && !verify(anchors[1])) {
                // the test failed
                throw new Error("Could not find matching anchor - was probaly not merged.")
            }


        })
    })
})

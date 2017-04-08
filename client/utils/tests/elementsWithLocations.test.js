// local imports
import { createStore } from 'store'
import { addAnchors, addPropagators, addElements } from 'actions/elements'
import { elementsWithLocations } from '..'

describe('Utils', function() {
    describe('Elements with Location', function() {
        it('can generate the correct concrete locations for non-constrained propagators', function() {
            // a store to test with
            const store = createStore()

            // add some anchors to the store
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 100,
                },
                {
                    id: 2,
                    x: 100,
                    y: 100
                }
            ))

            // add a propagator that links the two
            store.dispatch(addPropagators({
                kind: 'em',
                id: 1,
                anchor1: 1,
                anchor2: 2,
            }))

            expect(elementsWithLocations(store.getState().diagram.elements)).to.deep.equal({
                anchors: [
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
                ],
                propagators: [
                    {
                        kind: 'em',
                        id: 1,
                        anchor1: 1,
                        anchor2: 2,
                        x1: 50,
                        y1: 100,
                        x2: 100,
                        y2: 100,
                    }
                ]
            })
        })

        it('constrains anchors to their appropriate shapes', function() {
            // a store to test with
            const store = createStore()

            // add a shape to constrain the anchor
            store.dispatch(addElements({
                type: 'shapes',
                id: 1,
                x: 50,
                y: 50,
                r: 50
            }))

            // add an anchor that will b e constrained to the shape
            store.dispatch(addAnchors({
                id: 1,
                x: 110,
                y: 100,
                constraint: 1,
            }))

            expect(elementsWithLocations(store.getState().diagram.elements)).to.deep.equal({
                anchors: [
                    {
                        id: 1,
                        x: 100,
                        y: 100,
                        constraint: 1,
                    },
                ],
                propagators: [],
            })
        })

    })
})
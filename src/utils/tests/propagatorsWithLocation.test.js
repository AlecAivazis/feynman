// local imports
import { createStore } from 'store'
import { addAnchors, addPropagators } from 'actions/elements'
import { propagatorsWithLocation } from '..'

describe('Interface Components', function() {
    describe('Diagram Element', function() {
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

            expect(propagatorsWithLocation(store.getState().diagram.elements)).to.deep.equal([
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
            ])
        })

    })
})
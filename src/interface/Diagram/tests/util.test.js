// local imports
import { createStore } from 'store'
import { addAnchors, addPropagators } from 'actions/elements'
import { propagatorsWithLocation } from '../util'

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
                type: 'em',
                anchor1: 1,
                anchor2: 2,
            }))

            expect(propagatorsWithLocation(store.getState().elements)).to.deep.equal([
                {
                    type: 'em',
                    x1: 50,
                    y1: 100,
                    x2: 100,
                    y2: 100,
                }
            ])
        })
    })
})
// local imports
import { createStore } from 'store'
import reducer, { initialState } from '..'
import { addPropagators, addAnchors } from 'actions/elements'


describe('Reducers', function() {

    describe('Elements reducer', function() {

        it('responds to the ADD_PROPAGATORS action', function() {
            // a store to test with
            const store = createStore()
            // add the anchors to the store
            store.dispatch(addAnchors(
                { id: 1, x: 50, y: 100},
                { id: 2, x: 50, y: 100}
            ))

            // the configuration for the element to add to the reducer
            const propagator = {
                type: 'fermion',
                anchor1: 1,
                anchor2: 2,
            }
            // add the propagator to the store
            store.dispatch(addPropagators(propagator))

            // make sure the state matches expectation
            expect(store.getState().elements.propagators).to.deep.equal(initialState.propagators.concat([propagator]))
        })

        it('barfs when adding a propagator that refers to a non-existing anchor', function() {
            // a store to test with
            const store = createStore()
            // add a propagator

            // the configuration for the element to add to the reducer
            const propagator = {
                type: 'fermion',
                anchor1: 1,
                anchor2: 2,
            }

            // make sure the state matches expectation
            expect( () => store.dispatch(addPropagators(propagator))).to.throw(Error)
        })
    })
})

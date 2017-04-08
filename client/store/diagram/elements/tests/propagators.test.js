// local imports
import { createStore } from 'store'
import reducer, { initialState } from '..'
import { addPropagators, addAnchors } from 'actions/elements'


describe('Reducers', () => {
    describe('Elements reducer', () => {
        describe('Propagators', () => {

            test('responds to the ADD_PROPAGATORS action', () => {
                // a store to test with
                const store = createStore()
                // add the anchors to the store
                store.dispatch(addAnchors(
                    { id: 1, x: 50, y: 100},
                    { id: 2, x: 50, y: 100}
                ))

                // the configuration for the element to add to the reducer
                const propagator = {
                    id: 1,
                    kind: 'fermion',
                    anchor1: 1,
                    anchor2: 2,
                }
                // add the propagator to the store
                store.dispatch(addPropagators(propagator))

                // make sure the state matches expectation
                expect(store.getState().diagram.elements.propagators).toEqual(
                    {
                        ...initialState.propagators,
                        1: propagator
                    }
                )
            })

            test('barfs when adding a propagator that refers to a non-existing anchor', () => {
                // a store to test with
                const store = createStore()
                // add a propagator

                // the configuration for the element to add to the reducer
                const propagator = {
                    id: 1,
                    kind: 'fermion',
                    anchor1: 1,
                    anchor2: 2,
                }

                // make sure the state matches expectation
                expect( () => store.dispatch(addPropagators(propagator))).toThrow(Error)
            })

            test('barfs when adding a propagator with no type', () => {
                // a store to test with
                const store = createStore()
                // add the anchors to the store
                store.dispatch(addAnchors(
                    { id: 1, x: 50, y: 100},
                    { id: 2, x: 50, y: 100}
                ))

                // the configuration for the element to add to the reducer
                const propagator = {
                    id: 1,
                    anchor1: 1,
                    anchor2: 2,
                }

                // make sure the state matches expectation
                expect( () => store.dispatch(addPropagators(propagator))).toThrow(Error)
            })

            test('barfs when adding a propagator with no id', () => {
                // a store to test with
                const store = createStore()
                // add the anchors to the store
                store.dispatch(addAnchors(
                    { id: 1, x: 50, y: 100},
                    { id: 2, x: 50, y: 100}
                ))

                // the configuration for the element to add to the reducer
                const propagator = {
                    kind: 'fermion',
                    anchor1: 1,
                    anchor2: 2,
                }
                // add the propagator to the store
                expect(() => store.dispatch(addPropagators(propagator))).toThrow(Error)

            })
        })
    })
})

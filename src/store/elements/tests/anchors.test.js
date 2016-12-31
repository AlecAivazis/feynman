// local imports
import { createStore } from 'store'
import reducer, { initialState } from '..'
import { addAnchors } from 'actions/elements'


describe('Reducers', function() {

    describe('Elements reducer', function() {

        it('responds to the ADD_ANCHOR reducer', function() {
            // a store to test with
            const store = createStore()

            // the anchor to test
            const anchor = {
                id: 1,
                x: 50,
                y: 100,
            }

            // add the propagator to the store
            store.dispatch(addAnchors(anchor))

            // make sure the state matches expectation
            expect(store.getState().elements.anchors).to.deep.equal({
                1: {
                    x: 50,
                    y: 100
                }
            })
        })

        it('can add multiple reducers with ADD_ANCHOR', function() {
            // a store to test with
            const store = createStore()

            // the anchor to test
            const anchors = [
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
            ]

            // add the propagator to the store
            store.dispatch(addAnchors(...anchors))

            // make sure the state matches expectation
            expect(store.getState().elements.anchors).to.deep.equal({
                1: {
                    x: 50,
                    y: 100
                },
                2: {
                    x: 100,
                    y: 100
                }
            })
        })

        it('barfs if there is an anchor id conflict', function() {
            // a store to test with
            const store = createStore()

            // the non-conflicting anchor to add
            store.dispatch(addAnchors({
                id: 1,
                x: 50,
                y: 100,
            }))

            // the action to add the id-conflicting anchor
            const action = () => store.dispatch(addAnchors({
                id: 1,
                x: 100,
                y: 100,
            }))

            // make sure the id-conflicting action throws an error
            expect(action).to.throw(Error)
        })
    })
})

// local imports
import { createStore } from 'store'
import reducer, { initialState } from '..'
import { addAnchors, setAnchorLocations } from 'actions/elements'
import { noIdErr } from '../anchors'

describe('Reducers', function() {

    describe('Elements reducer', function() {

        describe('Anchors', function() {
            // a store to test with
            let store
            // with one anchor
            const initialAnchor = {
                id: 1,
                x: 50,
                y: 100
            }

            beforeEach(function() {
                // start with a fresh store
                store = createStore()
                // add a single propagator to the store
                store.dispatch(addAnchors(initialAnchor))
            })

            it('responds to the ADD_ANCHOR reducer', function() {
                // make sure the state matches expectation
                expect(store.getState().elements.anchors).to.deep.equal({
                    1: {
                        x: 50,
                        y: 100,
                        id: 1,
                    }
                })
            })

            it('can add multiple anchors with ADD_ANCHOR', function() {
                // the anchor to test
                const anchors = [
                    {
                        id: 2,
                        x: 50,
                        y: 100,
                    },
                    {
                        id: 3,
                        x: 100,
                        y: 100
                    }
                ]

                // add the propagator to the store
                store.dispatch(addAnchors(...anchors))

                // make sure the state matches expectation
                expect(store.getState().elements.anchors).to.deep.equal({
                    [initialAnchor.id]: initialAnchor,
                    [anchors[0].id]: anchors[0],
                    [anchors[1].id]: anchors[1],
                })
            })

            it('barfs if there is an anchor id conflict', function() {

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
})

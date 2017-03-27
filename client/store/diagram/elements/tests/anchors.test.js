// local imports
import { createStore } from 'store'
import reducer, { initialState } from '..'
import { addAnchors, setAnchorLocations, selectElements, alignSelectedAnchors } from 'actions/elements'
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
                y: 50
            }

            beforeEach(function() {
                // start with a fresh store
                store = createStore()
                // add a single propagator to the store
                store.dispatch(addAnchors(initialAnchor))
            })

            it('responds to the ADD_ANCHOR reducer', function() {
                // make sure the state matches expectation
                expect(store.getState().diagram.elements.anchors).to.deep.equal({
                    [initialAnchor.id]: initialAnchor
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
                expect(store.getState().diagram.elements.anchors).to.deep.equal({
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

            it('can vertically align selected anchors', function() {
                // add the propagator to the store
                store.dispatch(addAnchors(
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                    }
                ))

                // select anchors 1 and 2
                store.dispatch(selectElements({type: 'anchors', id: 1}, {type: 'anchors', id: 2}))

                // vertically align the selected anchors
                store.dispatch(alignSelectedAnchors('vertical'))

                // the state of the store after the mutations
                const { anchors } = store.getState().diagram.elements

                // the expected location should be right in between the two
                const expected = (100 + initialAnchor.x) / 2

                // expect both anchors to have moved to the midpoint
                expect(anchors[1].x).to.equal(expected)
                expect(anchors[2].x).to.equal(expected)
            })

            it('can horizontally align selected anchors', function() {
                // add the propagator to the store
                store.dispatch(addAnchors(
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                    },
                    {
                        id: 3,
                        x: 500,
                        y: 500,
                    }
                ))

                // select anchors 1 and 2
                store.dispatch(selectElements({type: 'anchors', id: 1}, {type: 'anchors', id: 2}))

                // vertically align the selected anchors
                store.dispatch(alignSelectedAnchors('horizontal'))

                // the state of the store after the mutations
                const { anchors } = store.getState().diagram.elements

                // the expected location should be right in between the two
                const expected = (100 + initialAnchor.y) / 2

                // expect both anchors to have moved to the midpoint
                expect(anchors[1].y).to.equal(expected)
                expect(anchors[2].y).to.equal(expected)
                // and the third anchor to not have moved
                expect(anchors[3].y).to.equal(500)
            })

            it('barfs if aligning in an invalid direction', function() {
                expect(() => store.dispatch(alignSelectedAnchors('foo'))).to.throw(Error)
            })

        })
    })
})

// local imports
import elementsInRegion from '../elementsInRegion'
import { createStore } from 'store'
import { addAnchors, addPropagators, addElements } from 'actions/elements'

describe('Utils', function() {
    describe("Elements in Region", function() {
        it('can locate anchors within a given region', function() {
            // a store to test with
            const store = createStore()

            // add some anchors
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 100
                },
                {
                    id: 2,
                    x: 100,
                    y: 200
                },
                {
                    id: 3,
                    x: 1000,
                    y: 100
                },
            ))

            // the region we are looking in
            const region = {
                // this is actually upper left in the diagram coordinate system
                point1: {
                    x: 0,
                    y: 0,
                },
                // this is actually lower right in the diagram coordinate system
                point2: {
                    x: 300,
                    y: 300,
                }
            }

            // figure out the elements in the region
            const inside = elementsInRegion({elements: store.getState().diagram.elements, region})

            // make sure the result is what we expect
            expect(inside).toEqual([{type: "anchors", id: 1}, {type: "anchors", id: 2}])
        })

        it('can locate propagators within a given region', function() {
            // a store to test with
            const store = createStore()

            // add some anchors
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 100
                },
                {
                    id: 2,
                    x: 100,
                    y: 200
                },
                {
                    id: 3,
                    x: 1000,
                    y: 100
                },
                {
                    id: 4,
                    x: 1000,
                    y: 2000
                },
            ))

            // add propagators between the two sets of anchors
            store.dispatch(addPropagators(
                {
                    id: 1,
                    kind: 'fermion',
                    anchor1: 1,
                    anchor2: 2
                },
                {
                    id: 2,
                    kind: 'fermion',
                    anchor1: 3,
                    anchor2: 4
                },
            ))

            // the region we are looking in
            const region = {
                // this is actually upper left in the diagram coordinate system
                point1: {
                    x: 50,
                    y: 110,
                },
                // this is actually lower right in the diagram coordinate system
                point2: {
                    x: 100,
                    y: 290,
                }
            }

            // figure out the elements in the region
            const inside = elementsInRegion({elements: store.getState().diagram.elements, region})

            // make sure the result is what we expect
            expect(inside).toEqual([{type: "propagators", id: 1}])
        })

        it('can locate text elements within a given region', function() {
            // a store to test with
            const store = createStore()

            // add some text elements
            store.dispatch(addElements(
                {
                    id: 1,
                    type: 'text',
                    x: 50,
                    y: 100,
                    value: 'hello'
                },
                {
                    id: 2,
                    type: 'text',
                    x: 0,
                    y: 100,
                    value: 'hello'
                },
            ))


            // the region we are looking in
            const region = {
                // this is actually upper left in the diagram coordinate system
                point1: {
                    x: 40,
                    y: 90,
                },
                // this is actually lower right in the diagram coordinate system
                point2: {
                    x: 100,
                    y: 290,
                }
            }

            // figure out the elements in the region
            const inside = elementsInRegion({elements: store.getState().diagram.elements, region})

            // make sure the result is what we expect
            expect(inside).toEqual([{type: "text", id: 1}])
        })
    })
})

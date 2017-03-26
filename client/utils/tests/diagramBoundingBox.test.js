// local imports
import elementsInRegion from '../elementsInRegion'
import { createStore } from 'store'
import { addAnchors, addPropagators } from 'actions/elements'
import { diagramBoundingBox } from '..'

describe('Utils', function() {
    describe("Diagram Bounding Box", function() {
        it('can compute the bounding box of a collection of anchors', function() {
            // a store to test with
            const store = createStore()

            // the anchors to add to the store
            const anchors = [
                {
                    id: 1,
                    x: 50,
                    y: 100
                },
                {
                    id: 2,
                    x: 1000,
                    y: 100
                },
            ]

            // add some anchors
            store.dispatch(addAnchors(...anchors))

            // compute the bounding box for the diagram
            const bb = diagramBoundingBox(store.getState().diagram.elements)

            // make sure each anchor is contained in the bounding box
            for (const anchor of anchors) {
                // make sure that the x value is contained in the box
                expect(anchor.x).to.be.above(bb.x1)
                expect(anchor.x).to.be.below(bb.x2)
                // make sure that the y value is contained in the box
                expect(anchor.y).to.be.above(bb.y1)
                expect(anchor.y).to.be.below(bb.y2)
            }
        })

        it('includes dimensions', function() {
            // a store to test with
            const store = createStore()

            // the anchors to add to the store
            const anchors = [
                {
                    id: 1,
                    x: 50,
                    y: 50
                },
                {
                    id: 2,
                    x: 1000,
                    y: 100
                },
            ]

            // add some anchors
            store.dispatch(addAnchors(...anchors))

            // compute the bounding box for the diagram
            const bb = diagramBoundingBox(store.getState().diagram.elements)

            // make suree there is a height and width at least as big as the known value
            expect(bb.width).to.be.at.least(anchors[1].x - anchors[0].x)
            expect(bb.height).to.be.at.least(anchors[1].y - anchors[0].y)
        })
    })
})

// local imports
import { createStore } from 'store'
import { addAnchors } from 'actions/elements'
import { generateElementId } from '..'
import range from '../range'

describe('Utils', function() {
    describe('Generate Element Id Util', function() {
        it('can generate a unique id from an empty state', function() {
            // create a store to test with
            const { anchors } = createStore().getState().diagram.elements
            // generate an id for the anchor
            const id = generateElementId(anchors)

            // make sure the id is not taken
            expect(anchors[id]).to.not.exist
        })

        it('can generate a non-conflicting id with a non-empty state', function() {
            // create a state to test with
            const store = createStore()

            // generate a set of 1000 anchors
            const testAnchors = range(1000).map(() => ({
                // with a random id
                id: Math.random() * 10000,
                x: 50,
                y: 50,
            }))

            // add an anchor to the state
            store.dispatch(addAnchors(...testAnchors))
            const { anchors } = store.getState().diagram.elements

            // generate an id for the anchor
            const id = generateElementId(anchors)

            // make sure the id is not taken
            expect(anchors[id]).to.not.exist
        })

        it('can generate multiple unique ids', function() {
            // create a state to test with
            const { anchors } = createStore().getState().diagram.elements

            // the numer of unique ids to create
            const nIds = 5
            // create a set out of the result of calling the utility
            const ids = new Set(generateElementId(anchors, nIds))

            // make sure we have the correct number of unique ids
            expect(ids.size).to.equal(nIds)

        })
    })
})
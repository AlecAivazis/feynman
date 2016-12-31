// local imports
import { createStore } from 'store'
import { addAnchors } from 'actions/elements'
import generateAnchorId from '../generateAnchorId'
import range from '../range'

describe('Utils', function() {
    describe('Generate Anchor Id Util', function() {
        it('can generate a unique id from an empty state', function() {
            // create a store to test with
            const store = createStore()
            // generate an id for the anchor
            const id = generateAnchorId(store)

            // make sure the id is not taken
            expect(store.getState().elements.anchors[id]).to.not.exist
        })

        it('can generate a non-conflicting id with a non-empty state', function() {
            // create a store to test with
            const store = createStore()

            // generate a set of 1000 anchors
            const anchors = range(1000).map(i => ({
                // with a random id
                id: Math.random() * 10000,
                x: 50,
                y: 50,
            }))

            // add an anchor to the store
            store.dispatch(addAnchors(...anchors))

            // generate an id for the anchor
            const id = generateAnchorId(store)

            // make sure the id is not taken
            expect(store.getState().elements.anchors[id]).to.not.exist
        })
    })
})
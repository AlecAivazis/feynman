// external imports
import { put } from 'redux-saga/effects'
// local imports
import { addAnchors } from 'actions/elements'
import placeAnchor from '../placeAnchor'

describe('Sagas', function() {
    describe('Place Elements', function() {
        describe('Anchors', function() {
            it('can place an anchor', function() {
                // the description of the anchor to create
                const desc = {
                    id: 1,
                    x: 75,
                    y: 80
                }

                // get the generator
                const gen = placeAnchor(desc)
                // the only thing we have to do is create the anchor
                expect(gen.next().value).to.deep.equal(
                    put(addAnchors(desc))
                )

                // make sure there isn't anything left
                expect(gen.next().done).to.be.true
            })
        })
    })
})

// external imports
import { put } from 'redux-saga/effects'
// local imports
import { addAnchors } from 'actions/elements'
import placeAnchor from '../placeAnchor'

describe('Sagas', () => {
    describe('Place Elements', () => {
        describe('Anchors', () => {
            test('can place an anchor', () => {
                // the description of the anchor to create
                const desc = {
                    id: 1,
                    x: 75,
                    y: 80
                }

                // get the generator
                const gen = placeAnchor(desc)
                // the only thing we have to do is create the anchor
                expect(gen.next().value).toEqual(
                    put(addAnchors(desc))
                )

                // make sure there isn't anything left
                expect(gen.next().done).toBeTruthy()
            })
        })
    })
})

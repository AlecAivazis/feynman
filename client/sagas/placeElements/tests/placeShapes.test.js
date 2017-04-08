// external imports
import { put } from 'redux-saga/effects'
// local imports
import { addElements } from 'actions/elements'
import placeShapes from '../placeShapes'

describe('Sagas', function() {
    describe('Place Elements', function() {
        describe('Shape', function() {
            it('can place a shape element', function() {
                // the description of the anchor to create
                const desc = {
                    id: 1,
                    x: 75,
                    y: 80,
                    kind: "parton",
                }

                // get the generator
                const gen = placeShapes(desc)
                // the only thing we have to do is create the anchor
                expect(gen.next().value).to.deep.equal(
                    put(addElements({
                        type: 'shapes',
                        ...desc,
                    }))
                )

                // make sure there isn't anything left
                expect(gen.next().done).to.be.true
            })
        })
    })
})

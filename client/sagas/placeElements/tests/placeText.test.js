// external imports
import { put } from 'redux-saga/effects'
// local imports
import { addElements } from 'actions/elements'
import placeText from '../placeText'

describe('Sagas', () => {
    describe('Place Elements', () => {
        describe('Text', () => {
            test('can place a text element', () => {
                // the description of the anchor to create
                const desc = {
                    id: 1,
                    x: 75,
                    y: 80,
                    value: "hello",
                }

                // get the generator
                const gen = placeText(desc)
                // the only thing we have to do is create the anchor
                expect(gen.next().value).toEqual(
                    put(addElements({
                        type: 'text',
                        ...desc,
                    }))
                )

                // make sure there isn't anything left
                expect(gen.next().done).toBeTruthy
            })
        })
    })
})

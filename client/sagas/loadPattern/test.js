// external imports
import { put } from 'redux-saga/effects'
// local imports
import { loadPatternWorker } from '.'
import { loadPattern, placeElement, clearElements } from 'actions/elements'

describe('Sagas', () => {
    describe('Load Pattern', () => {
        test('loads a pattern over the current state', () => {
            // the description of the anchor to create
            const desc = {
                elements: "hello"
            }

            // get the generator
            const gen = loadPatternWorker(loadPattern(desc))

            // the first thing to do is clear all visible elements
            expect(gen.next().value).toEqual(
                put(clearElements())
            )

            // the next thing is to place the elements
            expect(gen.next().value).toEqual(
                put(placeElement(desc.elements))
            )

            // make sure there isn't anything left
            expect(gen.next().done).toBeTruthy()
        })
    })
})

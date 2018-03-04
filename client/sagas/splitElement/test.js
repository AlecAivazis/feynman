// external imports
import { select, put } from 'redux-saga/effects'
// local imports
import { constrainLocationToShape } from 'utils'
import { splitElement, commit, ADD_ANCHORS, ADD_PROPAGATOR, UPDATE_ELEMENT } from 'actions/elements'
import { splitElementWorker } from '.'

describe('Sagas', () => {
    describe('Split Element', () => {
        test('gracefully handles unrecognized elements', () => {
            // the element to split
            const element = {
                type: 'foo',
            }

            // the location to split at
            const location = {
                x: 50,
                y: 105,
            }

            // create the generator responding to the action
            const gen = splitElementWorker(splitElement({ element, location }))

            // make sure we're done
            expect(gen.next().done).toBeTruthy()
        })
    })
})

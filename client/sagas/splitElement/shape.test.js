// external imports
import { select, put } from 'redux-saga/effects'
// local imports
import { constrainLocationToShape } from 'utils'
import { splitElement, ADD_ANCHORS, ADD_PROPAGATOR, UPDATE_ELEMENT, SELECT_ELEMENTS } from 'actions/elements'
import { splitElementWorker } from '.'

describe('Sagas', () => {
    describe('Split Element', () => {
        test('can split a shape', () => {
            // the element to split
            const element = {
                kind: 'parton',
                id: 1,
                x: 50,
                y: 50,
                r: 50,
            }

            // the location to split at
            const location = {
                x: 50,
                y: 105,
            }

            // create the generator responding to the action
            const gen = splitElementWorker(splitElement({ element, location, type: 'shapes' }))

            // *sigh* tightly couple this test to internal access to store state
            expect(gen.next().value).toBeDefined()

            // first, two anchors need to be created at the constrained location
            const anchorCreateAction = gen.next().value
            // sanity check
            expect(anchorCreateAction.PUT).toBeDefined()

            // the two anchors that we just created
            const anchors = anchorCreateAction.PUT.action.payload

            // make sure we made two anchors
            expect(anchors).toHaveLength(2)

            // one of them should be constrained
            expect(anchors.filter(({ constraint }) => constraint === element.id)).toHaveLength(1)
            // the ids of the anchors
            const ids = anchors.map(({ id }) => id)

            // we then need to create a propagator between the two anchors
            const propagatorCreateAction = gen.next().value
            // sanity check
            expect(propagatorCreateAction.PUT).toBeDefined()

            // the propagator we created
            expect(propagatorCreateAction.PUT.action.payload).toHaveLength(1)
            const propagator = propagatorCreateAction.PUT.action.payload[0]

            // make sure the two anchors are the ones we just made
            expect(propagator.anchor1).not.toEqual(propagator.anchor2)
            expect(ids.includes(propagator.anchor1)).toBeTruthy()
            expect(ids.includes(propagator.anchor2)).toBeTruthy()

            // and we leave with the anchor we created selected
            const selectAction = gen.next().value
            // sanity check
            expect(selectAction.PUT).toBeDefined()

            // make sure we selected the right anchor
            const { type: selectType, payload: selectPayload } = selectAction.PUT.action
            expect(selectType).toEqual(SELECT_ELEMENTS)
            expect(selectPayload).toEqual([
                {
                    type: 'anchors',
                    id: propagator.anchor2,
                },
            ])

            // make sure we're done
            expect(gen.next().done).toBeTruthy()
        })
    })
})

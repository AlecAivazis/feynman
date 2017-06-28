// external imports
import { select, put } from 'redux-saga/effects'
// local imports
import { constrainLocationToShape } from 'utils'
import { splitElement, ADD_ANCHORS, ADD_PROPAGATORS, SET_ELEMENT_ATTRS, SELECT_ELEMENTS } from 'actions/elements'
import { splitElementWorker } from '.'

describe('Sagas', () => {
    describe('Split Element', () => {
        test('anchor', () => {
            // the element to split
            const element = {
                id: 1,
                x: 50,
                y: 50,
            }

            // the location to split at
            const location = {
                x: 50,
                y: 50,
            }
            // create the generator that splits the propagators
            const gen = splitElementWorker(
                splitElement({element, location, type: "anchors"})
            )

            // *sigh* tightly couple this test to internal access to store state
            expect(gen.next().value).toBeDefined()

            // the first thing we have to do is create a new anchor
            const createAnchorAction = gen.next().value
            // sanity check
            expect(createAnchorAction.PUT).toBeDefined()

            // make sure we actually made an anchor
            const { type: anchorType, payload: newAnchor } = createAnchorAction.PUT.action
            expect(anchorType).toEqual(ADD_ANCHORS)
            expect(newAnchor[0]).toMatchObject({
                x: 50,
                y: 50,
            })

            // then we have to make a propagator joining the two
            const createPropagatorAction = gen.next().value
            // sanity check
            expect(createPropagatorAction.PUT).toBeDefined()

            // make sure we made a prop joining the two anchors
            const { type: propagatorType, payload: newPropagator } = createPropagatorAction.PUT.action
            expect(propagatorType).toEqual(ADD_PROPAGATORS)
            expect(newPropagator[0]).toMatchObject({
                anchor1: element.id,
                anchor2: newAnchor[0].id,
                kind: 'fermion',
            })

            // then we need to select the newly created anchor
            const selectAnchorAction = gen.next().value
            // sanity check
            expect(selectAnchorAction.PUT).toBeDefined()

            // make sure we selected the right anchor
            const { type: selectType, payload: selection } = selectAnchorAction.PUT.action
            expect(selectType).toEqual(SELECT_ELEMENTS)
            expect(selection).toEqual([{
                id: newAnchor[0].id,
                type: 'anchors',
            }])

            // then we're done
            expect(gen.next().done).toBeTruthy()
        })
    })
})

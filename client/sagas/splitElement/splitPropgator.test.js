// external imports
import { select, put } from 'redux-saga/effects'
// local imports
import { constrainLocationToShape } from 'utils'
import { splitElement, ADD_ANCHORS, ADD_PROPAGATOR, UPDATE_ELEMENT } from 'actions/elements'
import { splitElementWorker } from '.'

describe('Sagas', () => {
    describe('Split Element', () => {
        test('can split a straight propagator', () => {
            // the element to split
            const element = {
                type: 'propagator',
                kind: 'fermion',
                id: 1,
                anchor1: 1,
                anchor2: 2,
            }

            // the location to split at
            const location = {
                x: 75,
                y: 75,
            }

            // *sigh* tightly couple this test to internal access to store state
            expect(gen.next().value).toBeDefined()

            // create the generator that splits the propagators
            const gen = splitElementWorker(splitElement({element, location}))

            // the first thing w ehave to do is create two anchors at the split points

            // grab the first action dispatched
            const anchorCreateAction = gen.next().value
            // sanity check
            expect(anchorCreateAction.PUT).toBeDefined()

            // the actual action dispatched
            let { type: type1, payload: newAnchors } = anchorCreateAction.PUT.action

            // make sure we are creating the right elements
            expect(type1).toEqual(ADD_ANCHORS)
            // make sure we made two anchors
            expect(newAnchors).toHaveLength(2)
            // and they're both located at the split location
            for (const anchor of newAnchors) {
                expect(anchor).toEqual(location)
            }

            // label the anchors for cleaner references
            const middleAnchor = newAnchors[0]
            const dragAnchor = newAnchors[1]

            // we then need to change the reference of the original element
            // to join with the anchor in the middle
            const updatePropAction = gen.next().value

            // sanity check
            expect(updatePropAction.PUT).toBeDefined()

            // the actual action dispatched
            const {type: type2, payload: propUpdate} = updatePropAction.PUT.action

            // make sure the action updates a prop
            expect(type2).toEqual(UPDATE_ELEMENT)
            // the propagator needs to update the original element
            expect(propUpdate).toEqual({
                id: element.id,
                type: 'propagators',
                anchor1: element.anchor1,
                anchor2: middleAnchor.id,
            })

            // we then need to create a propagator between the two anchors
            const propagatorCreateAction = gen.next().value
            // sanity check
            expect(propagatorCreateAction.PUT).toBeDefined()

            // the actual action dispatched
            const { type: type3, payload: newProps } = propagatorCreateAction.PUT.action

            // make sure we are trying to create a propagator
            expect(type3).toEqual(ADD_PROPAGATOR)
            // we should be making two propagators
            expect(newProps).toHaveLength(2)

            // one should be connecting the two anchors we just made
            expect(
                newProps.find(prop => prop.anchor1 === middleAnchor.id && prop.anchor2 === dragAnchor.id)
            ).toHaveLength(1)

            // and the other should connect the original anchor2 and the new anchor in the middle
            expect(
                newProps.find(prop => prop.anchor1 === element.anchor2 && prop.anchor2 === middleAnchor.id)
            ).toHaveLength(1)

            // make sure we're done
            expect(gen.next().done).toBeTruthy()
        })
    })
})

// external imports
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
// local imports
import { addAnchors, addPropagators } from 'actions/elements'
import { createStore } from 'store'
import { elementsWithLocations } from 'utils'
import Diagram from 'interface/Diagram'
import locationForLabel from './locationForLabel'
import relLocForLabel from './relLocForLabel'

describe('Interface Components', () => {
    describe('Diagram Element', () => {

        test('can compute the location for a label for a propagator', () => {
            // a store to start out with
            const store = createStore()
            // create some anchors
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 100,
                },
                {
                    id: 2,
                    x: 100,
                    y: 200
                }
            ))

            // add a propagator connecting the anchors
            store.dispatch(addPropagators({
                id: 1,
                kind: 'fermion',
                anchor1: 1,
                anchor2: 2,
                label: 'a'
            }))

            // we grab the location from a propgator with dereferenced anchors
            const propagator = elementsWithLocations(store.getState().diagram.elements).propagators[0]

            // get the location for the label
            const location = locationForLabel({
                ...propagator,
                distance: propagator.labelDistance,
                location: propagator.labelLocation,
            })

            // make sure its a valid location
            expect(location.x).toBeDefined()
            expect(location.y).toBeDefined()
        })

        test('can compute the relative coordinates for a label given diagram coordiantes', () => {

            // a store to start out with
            const store = createStore()
            // create some anchors
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 100,
                },
                {
                    id: 2,
                    x: 100,
                    y: 200
                }
            ))

            // add a propagator connecting the anchors
            store.dispatch(addPropagators({
                id: 1,
                kind: 'fermion',
                anchor1: 1,
                anchor2: 2,
                label: 'a'
            }))

            // we grab the location from a propgator with dereferenced anchors
            const propagator = elementsWithLocations(store.getState().diagram.elements).propagators[0]

            // get the location for the label
            const location = relLocForLabel({x: 75, y: 150}, propagator)

            // make sure its a valid location
            expect(location.labelDistance).toBeDefined()
            expect(location.labelLocation).toBeDefined()
        })

        test('can compute the relative coordinates for a label given diagram coordiantes', () => {
            // a store to start out with
            const store = createStore()
            // create some anchors
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 100,
                },
                {
                    id: 2,
                    x: 100,
                    y: 200
                }
            ))

            // add a propagator connecting the anchors
            store.dispatch(addPropagators({
                id: 1,
                kind: 'fermion',
                anchor1: 1,
                anchor2: 2,
                label: 'a'
            }))

            // we grab the location from a propgator with dereferenced anchors
            const propagator = elementsWithLocations(store.getState().diagram.elements).propagators[0]

            // get the location for the label
            const location = relLocForLabel({x: 75, y: 150}, propagator)

            // make sure its a valid location
            expect(location.labelDistance).toBeDefined()
            expect(location.labelLocation).toBeDefined()
        })

        test('can compute the location for a label for a propagator', () => {
            // a store to start out with
            const store = createStore()
            // create some anchors
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 100,
                },
                {
                    id: 2,
                    x: 100,
                    y: 200
                }
            ))

            // add a propagator connecting the anchors
            store.dispatch(addPropagators({
                id: 1,
                kind: 'fermion',
                anchor1: 1,
                anchor2: 2,
                label: 'a'
            }))

            // we grab the location from a propgator with dereferenced anchors
            const propagator = elementsWithLocations(store.getState().diagram.elements).propagators[0]

            // get the location for the label
            const location = locationForLabel(propagator)

            // make sure its a valid location
            expect(location.x).toBeDefined()
            expect(location.y).toBeDefined()
        })
    })
})

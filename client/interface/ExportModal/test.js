// external imports
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
// local imports
import { createStore } from 'store'
import { addAnchors, addPropagators } from 'actions/elements'
import ExportModal from '.'
import LatexPropagator from './Propagator'

describe('Interface Components', () => {
    describe('Export Modal', () => {
        let store, wrapper, anchors
        beforeEach(function() {
            anchors = {
                1: {
                    id: 1,
                    x: 50,
                    y: 100,
                },
                2: {
                    id: 2,
                    x: 100,
                    y: 200
                }
            }
            // create a store to test with
            store = createStore()
            // add the anchors to the store
            store.dispatch(addAnchors(...Object.values(anchors)))
            // and a propagator connecting them
            store.dispatch(addPropagators({
                kind: 'fermion',
                id: 1,
                anchor1: 1,
                anchor2: 2
            }))

            // mount the component
            wrapper = mount(
                <Provider store={store}>
                    <ExportModal />
                </Provider>
            )
        })

        test('Creates a LatexPropagator for each element in the store', () => {
            // make sure there are as many propagators rendered
            expect(wrapper.find(LatexPropagator)).toHaveLength(
                // as there are in the store
                Object.values(store.getState().diagram.elements.propagators).length
            )
        })

        test('Passes the anchor location to rendered propagators', () => {
            // the props passed to the propagator
            const props = wrapper.find(LatexPropagator).props()

            // make sure the coordinates were injected to the propagator
            expect(props.x1).toEqual(anchors[1].x)
            expect(props.y1).toEqual(anchors[1].y)
            expect(props.x2).toEqual(anchors[2].x)
            expect(props.y2).toEqual(anchors[2].y)
        })
    })
})

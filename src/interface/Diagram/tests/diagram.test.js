// external imports
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
// local imports
import { createStore } from 'store'
import { toggleGrid } from 'actions/info'
import { addPropagators, addAnchors } from 'actions/elements'
import { initialState } from 'store/elements'
import Diagram from '..'
import Propagator from '../Propagator'
import Grid from '../Grid'

describe('Interface Components', function() {

    describe('Diagram', function() {

        it('shows the grid when the store says so', function() {
            // create a verion of the store
            const store = createStore()
            // if the grid is supposed to be hidden
            if (!store.getState().info.showGrid) {
                // show the grid
                store.dispatch(toggleGrid())
            }

            // render the diagram in the wrapper
            const wrapper = mount(
                <Provider store={store}>
                    <Diagram/>
                </Provider>
            )

            // make sure there is a grid
            expect(wrapper.find(Grid)).to.have.length(1)
        })

        it('hides the grid when the store says so', function() {
            // create a verion of the store
            const store = createStore()
            // if the grid is supposed to be shown
            if (store.getState().info.showGrid) {
                // hide the grid
                store.dispatch(toggleGrid())
            }

            // render the diagram in the wrapper
            const wrapper = mount(
                <Provider store={store}>
                    <Diagram/>
                </Provider>
            )

            // make sure there is a grid
            expect(wrapper.find(Grid)).to.have.length(0)
        })

        it('produces a propagator for each propgator in the store', function() {
            // create a store to test with
            const store = createStore()

            // add some anchors
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 50,
                },
                {
                    id: 2,
                    x: 100,
                    y: 1000,
                }
            ))

            // add an element to the store
            store.dispatch(addPropagators(
                {
                    type: 'invalid1',
                    anchor1: 1,
                    anchor2: 2,
                },
                {
                    type: 'invalid2',
                    anchor1: 1,
                    anchor2: 2,
                }
            ))

            // render the diagram in the wrapper
            const wrapper = mount(
                <Provider store={store}>
                    <Diagram/>
                </Provider>
            )
            // the expected number of propagators
            const expected = initialState.propagators.length + 2

            // make sure there are two fermions in the diagram
            expect(wrapper.find(Propagator)).to.have.length(expected)
        })
    })
})

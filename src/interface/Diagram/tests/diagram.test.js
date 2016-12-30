// external imports
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
// local imports
import { createStore } from 'store'
import { toggleGrid } from 'actions/info'
import { addElements } from 'actions/elements'
import Diagram from '..'
import Fermion from '../Fermion'
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

        it('produces a diagram element for each element', function() {
            // create a store to test with
            const store = createStore()

            // the elements to add
            const elements = [
                {
                    type: 'fermion',
                    x1: 0,
                    y1: 0,
                    x2: 50,
                    y2: 100,
                },
                {
                    type: 'fermion',
                    x1: 100,
                    y1: 1000,
                    x2: 150,
                    y2: 200,
                },
            ]

            // add an element to the store
            store.dispatch(addElements(...elements))

            // render the diagram in the wrapper
            const wrapper = mount(
                <Provider store={store}>
                    <Diagram/>
                </Provider>
            )

            // make sure there are two fermions in the diagram
            expect(wrapper.find(Fermion)).to.have.length(2)
        })
    })
})

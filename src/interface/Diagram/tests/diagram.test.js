// external imports
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
// local imports
import { createStore } from 'store'
import { toggleGrid } from 'actions/info'
import Diagram from '..'
import Grid from '../Grid'

describe('Diagram Components', function() {

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
            // if the grid is supposed to be hidden
            if (store.getState().info.showGrid) {
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
            expect(wrapper.find(Grid)).to.have.length(0)
        })

        it('produces a diagram element for each element')
    })
})

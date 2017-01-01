// external imports
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
// local imports
import { createStore } from 'store'
import { addAnchors, selectElements } from 'actions/elements'
import Toolbar from '..'
import SelectionSummary from '../SelectionSummary'

describe('Interface Components', function() {
    describe('Toolbar', function() {
        it('shows an SelectionSummary when there is an anchor selected', function() {
            // a store to test with
            const store = createStore()
            // add an anchor
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 50
                }
            ))

            // render the toolbar
            const wrapper = mount(
                <Provider store={store}>
                    <Toolbar/>
                </Provider>
            )

            // expect there to be no anchor summaries
            expect(wrapper.find(SelectionSummary)).to.have.length(0)

            // select the anchors
            store.dispatch(selectElements({
                type: 'anchors',
                id: 1
            }))

            // expect there to be an anchor summary
            expect(wrapper.find(SelectionSummary)).to.have.length(1)
        })
    })
})
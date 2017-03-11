// external imports
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
// local imports
import Title from '..'
import { createStore } from 'store'
import { setDiagramTitle } from 'actions/info'

describe('Interface Components', function() {

    describe('Title Component', function() {
        it('shows the title of the diagram', function() {
            // create a store to test with
            const store = createStore()
            // the title of the diagram
            const title = "test title"

            // set the title of the store
            store.dispatch(setDiagramTitle(title))

            // render the component
            const wrapper = mount(
                <Provider store={store}>
                    <Title/>
                </Provider>
            )

            // make sure there is a title element with the correct text
            expect(wrapper.containsMatchingElement(
                <h1>
                    {title}
                </h1>
            )).to.be.true
        })
    })
})
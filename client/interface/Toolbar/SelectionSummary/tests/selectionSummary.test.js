// external imports
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
// local imports
import { createStore } from 'store'
import { addAnchors, selectElements, addPropagators } from 'actions/elements'
import SelectionSummary from '..'
import AnchorSummary from '../AnchorSummary'
import PropagatorSummary from '../PropagatorSummary'
import { RedButton } from 'components'

describe('Interface Components', function() {
    describe('Toolbar', function() {
        describe('Selection Summary', function() {
            it('hides the anchor and propagator delete buttons on heterogenous selections', function() {
                // a store to test with
                const store = createStore()

                // add some anchors
                store.dispatch(addAnchors(
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                    }
                ))

                // and a propagator
                store.dispatch(addPropagators({
                    id: 1,
                    kind: 'fermion',
                    anchor1: 1,
                    anchor2: 2
                }))

                // select an anchor and a propagator
                store.dispatch(selectElements(
                    {
                        type: 'propagators',
                        id: 1,
                    },
                    {
                        type: 'anchors',
                        id: 1
                    }
                ))

                // mount the summary with the given selection
                const wrapper = mount(
                    <Provider store={store}>
                        <SelectionSummary
                            selection={store.getState().diagram.elements.selection}
                        />
                    </Provider>
                )

                const anchorSummary = wrapper.find(AnchorSummary)
                // make sure there is an anchor summary preset
                expect(anchorSummary).to.exist
                // make sure the showDelete props is false
                expect(anchorSummary.props().showDelete).to.be.false


                const propagatorSummary = wrapper.find(PropagatorSummary)
                // make sure there is an anchor summary preset
                expect(propagatorSummary).to.exist
                // make sure the showDelete props is false
                expect(propagatorSummary.props().showDelete).to.be.false

                // make sure there is only one red button visible
                expect(wrapper.find(RedButton)).to.have.length(1)
            })
        })
    })
})

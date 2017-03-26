// external imports
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
// local imports
import { createStore } from 'store'
import { addAnchors, addPropagators, selectElements } from 'actions/elements'
import Toolbar from '..'
import PropagatorSummary from '..'
import FermionSummary from '../FermionSummary'
import ElectroWeakSummary from '../ElectroWeakSummary'
import GluonSummary from '../GluonSummary'

describe('Interface Components', function() {
    describe('PropagatorSummary', function() {
        it("shows a fermion summary when there is a fermion selected", function() {
            // create a store to test
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
                    y: 150,
                },
            ))
            // connect them with propagators
            store.dispatch(addPropagators(
                {
                    id: 1,
                    anchor1: 1,
                    anchor2: 2,
                    kind: 'fermion',
                }
            ))

            // select the propagator
            store.dispatch(selectElements({type: 'propagators', id: 1}))

            // mount the propagator summary
            const wrapper = mount(
                <Provider store={store}>
                    <PropagatorSummary propagators={store.getState().diagram.elements.selection.propagators}/>
                </Provider>
            )

            // make sure there is a fermion summary
            expect(wrapper.find(FermionSummary)).to.have.length(1)
        })

        it("shows a electroweak summary when there is a em propagator selected", function() {
            // create a store to test
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
                    y: 150,
                },
            ))
            // connect them with propagators
            store.dispatch(addPropagators(
                {
                    id: 1,
                    anchor1: 1,
                    anchor2: 2,
                    kind: 'em',
                }
            ))

            // select the propagator
            store.dispatch(selectElements({type: 'propagators', id: 1}))

            // mount the propagator summary
            const wrapper = mount(
                <Provider store={store}>
                    <PropagatorSummary propagators={store.getState().diagram.elements.selection.propagators}/>
                </Provider>
            )

            // make sure there is a fermion summary
            expect(wrapper.find(ElectroWeakSummary)).to.have.length(1)
        })

        it("shows a electroweak summary when there is a em propagator selected", function() {
            // create a store to test
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
                    y: 150,
                },
            ))
            // connect them with propagators
            store.dispatch(addPropagators(
                {
                    id: 1,
                    anchor1: 1,
                    anchor2: 2,
                    kind: 'gluon',
                }
            ))

            // select the propagator
            store.dispatch(selectElements({type: 'propagators', id: 1}))

            // mount the propagator summary
            const wrapper = mount(
                <Provider store={store}>
                    <PropagatorSummary propagators={store.getState().diagram.elements.selection.propagators}/>
                </Provider>
            )

            // make sure there is a fermion summary
            expect(wrapper.find(GluonSummary)).to.have.length(1)
        })
    })
})
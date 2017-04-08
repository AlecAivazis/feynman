// external imports
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
// local imports
import { createStore } from 'store'
import { addAnchors, addPropagators, selectElements } from 'actions/elements'
import Toolbar from '.'
import PropagatorSummary from '.'
import FermionSummary from './FermionSummary'
import ElectroWeakSummary from './ElectroWeakSummary'
import GluonSummary from './GluonSummary'
import { Input } from 'components'

describe('Interface Components', () => {
    describe('PropagatorSummary', () => {
        test('shows a fermion summary when there is a fermion selected', () => {
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
            expect(wrapper.find(FermionSummary)).toHaveLength(1)
        })

        test('shows a electroweak summary when there is a em propagator selected', () => {
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
            expect(wrapper.find(ElectroWeakSummary)).toHaveLength(1)
        })

        test('shows a gluon summary when there is a gluon propagator selected', () => {
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
            expect(wrapper.find(GluonSummary)).toHaveLength(1)
        })

        test('hides the label input when there are multiple propgators selected', () => {
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
                {
                    id: 3,
                    x: 150,
                    y: 200,
                },
                {
                    id: 4,
                    x: 300,
                    y: 450,
                },
            ))
            // connect them with propagators
            store.dispatch(addPropagators(
                {
                    id: 1,
                    anchor1: 1,
                    anchor2: 2,
                    kind: 'gluon',
                    label: 'g'
                },
                {
                    id: 2,
                    anchor1: 3,
                    anchor2: 4,
                    kind: 'gluon',
                    label: 'g'
                }
            ))

            // select the propagator
            store.dispatch(selectElements(
                {type: 'propagators', id: 1},
                {type: 'propagators', id: 2}
            ))

            // mount the propagator summary
            const wrapper = mount(
                <Provider store={store}>
                    <PropagatorSummary propagators={store.getState().diagram.elements.selection.propagators}/>
                </Provider>
            )

            // find the input in the toolbar
            const input = wrapper.find(Input)

            // sanity check
            expect(input).toHaveLength(0)
        })
    })
})

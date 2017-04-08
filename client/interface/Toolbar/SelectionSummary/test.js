// external imports
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
// local imports
import { createStore } from 'store'
import { addAnchors, selectElements, addPropagators, addElements } from 'actions/elements'
import SelectionSummary from '.'
import AnchorSummary from './AnchorSummary'
import PropagatorSummary from './PropagatorSummary'
import TextSummary from './TextSummary'
import ShapeSummary from './ShapeSummary'
import { RedButton } from 'components'

describe('Interface Components', () => {
    describe('Toolbar', () => {
        describe('Selection Summary', () => {
            test('hides the anchor and propagator delete buttons on heterogenous selections', () => {
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
                // make sure the showDelete props is false
                expect(anchorSummary.props().showDelete).not.toBeTruthy


                const propagatorSummary = wrapper.find(PropagatorSummary)
                // make sure there is an anchor summary preset
                expect(propagatorSummary).toBeDefined()
                // make sure the showDelete props is false
                expect(propagatorSummary.props().showDelete).not.toBeTruthy

                // make sure there is only one red button visible
                expect(wrapper.find(RedButton)).toHaveLength(1)
            })

            test('hides the text delete button when there is a multiple kinds of selection', () => {
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
                store.dispatch(addElements({
                    id: 1,
                    type: 'text',
                    value: "hello",
                    x: 50,
                    y: 50
                }))

                // select an anchor and a propagator
                store.dispatch(selectElements(
                    {
                        type: 'text',
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
                // make sure the showDelete props is false
                expect(anchorSummary.props().showDelete).not.toBeTruthy


                const textSummary = wrapper.find(TextSummary)
                // make sure the showDelete props is false
                expect(textSummary.props().showDelete).not.toBeTruthy

                // make sure there is only one red button visible
                expect(wrapper.find(RedButton)).toHaveLength(1)
            })

            test('shows an anchor summary when there is one selected', () => {
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

                // select an anchor and a propagator
                store.dispatch(selectElements(
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
                expect(anchorSummary).toHaveLength(1)
            })

            test('shows a propagator summary when there is one selected', () => {
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
                ))

                // mount the summary with the given selection
                const wrapper = mount(
                    <Provider store={store}>
                        <SelectionSummary
                            selection={store.getState().diagram.elements.selection}
                        />
                    </Provider>
                )

                const summary = wrapper.find(PropagatorSummary)
                // make sure there is an anchor summary preset
                expect(summary).toHaveLength(1)
            })

            test('shows a text summary when there is one selected', () => {
                // a store to test with
                const store = createStore()

                // and a propagator
                store.dispatch(addElements({
                    type: 'text',
                    value: 'fermion',
                    x: 50,
                    y: 100,
                    id: 1,
                }))

                // select an anchor and a propagator
                store.dispatch(selectElements(
                    {
                        type: 'text',
                        id: 1,
                    },
                ))

                // mount the summary with the given selection
                const wrapper = mount(
                    <Provider store={store}>
                        <SelectionSummary
                            selection={store.getState().diagram.elements.selection}
                        />
                    </Provider>
                )

                const summary = wrapper.find(TextSummary)
                // make sure there is an anchor summary preset
                expect(summary).toHaveLength(1)
            })

            test('shows a shape summary when there is one selected', () => {
                // a store to test with
                const store = createStore()

                // and a propagator
                store.dispatch(addElements({
                    type: 'shapes',
                    value: 'fermion',
                    x: 50,
                    y: 100,
                    id: 1,
                }))

                // select an anchor and a propagator
                store.dispatch(selectElements(
                    {
                        type: 'shapes',
                        id: 1,
                    },
                ))

                // mount the summary with the given selection
                const wrapper = mount(
                    <Provider store={store}>
                        <SelectionSummary
                            selection={store.getState().diagram.elements.selection}
                        />
                    </Provider>
                )

                const summary = wrapper.find(ShapeSummary)
                // make sure there is an anchor summary preset
                expect(summary).toHaveLength(1)
            })
        })
    })
})

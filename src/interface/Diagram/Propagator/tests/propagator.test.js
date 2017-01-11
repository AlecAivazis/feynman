// external imports
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
// local imports
import { addAnchors, addPropagators } from 'actions/elements'
import { createStore } from 'store'
import Diagram from 'interface/Diagram'
import Propagator, {Propagator as PropComponent} from '..'
import Fermion from '../Fermion'
import ElectroWeak from '../ElectroWeak'

describe('Interface Components', function() {
    describe('Diagram Element', function() {

        it('renders an ElectroWeak', function() {
            const store = createStore()

            // render a fermion through the diagram element
            const wrapper = mount(
                <Provider store={store}>
                    <Propagator type="em" />
                </Provider>
            )
            // make sure there is a fermion
            expect(wrapper.find(ElectroWeak)).to.have.length(1)
        })

        it('renders a Fermion', function() {
            const store = createStore()

            // render a fermion through the diagram element
            const wrapper = mount(
                <Provider store={store}>
                    <Propagator type="fermion" />
                </Provider>
            )
            // make sure there is a fermion
            expect(wrapper.find(Fermion)).to.have.length(1)
        })

        it('passes default config onto the rendered propagator', function() {
            const store = createStore()

            // render a fermion through the diagram element
            const wrapper = mount(
                <Provider store={store}>
                    <Propagator type="fermion" />
                </Provider>
            )
            // make sure there is a fermion
            const fermion = wrapper.find(Fermion)

            // the default configuration
            const defaultConfig = PropComponent.defaultProps
            const props = fermion.props()

            // go over each default configuration
            for (const config of Object.keys(defaultConfig)) {
                // make sure the prop matches the default value
                expect(props[config]).to.equal(defaultConfig[config])
            }
        })

        it('renders with selected prop equal true when appropriate', function() {
            // a store to start out with
            const store = createStore()
            // create some anchors
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 100,
                },
                {
                    id: 2,
                    x: 100,
                    y: 200
                }
            ))

            // add a propagator connecting the anchors
            store.dispatch(addPropagators({
                id: 1,
                type: 'fermion',
                anchor1: 1,
                anchor2: 2,
            }))

            // render a fermion through the diagram element
            const wrapper = mount(
                <Provider store={store}>
                    <Diagram />
                </Provider>
            )
            // make sure there is a fermion
            const fermion = wrapper.find(Fermion)

            // the default configuration
            const defaultConfig = PropComponent.defaultProps
            const props = fermion.props()
        })

        it('can be selected with click', function() {// a store to start out with
            const store = createStore()
            // create some anchors
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 100,
                },
                {
                    id: 2,
                    x: 100,
                    y: 200
                }
            ))

            // add a propagator connecting the anchors
            store.dispatch(addPropagators({
                id: 1,
                type: 'fermion',
                anchor1: 1,
                anchor2: 2,
            }))

            // render a fermion through the diagram element
            const wrapper = mount(
                <Provider store={store}>
                    <Diagram />
                </Provider>
            )

            // click on the propagator
            wrapper.find(Fermion).simulate('mousedown')

            expect(store.getState().elements.selection.propagators).to.deep.equal([1])
        })
    })
})

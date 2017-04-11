// external imports
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
// local imports
import { addAnchors, addPropagators } from 'actions/elements'
import { createStore } from 'store'
import Diagram from 'interface/Diagram'
import Propagator, {Propagator as CoreProp} from '.'
import Fermion from './Fermion'
import ElectroWeak from './ElectroWeak'
import Gluon from './Gluon'
import locationForLabel from './locationForLabel'
import { elementsWithLocations } from 'utils'
import { Text } from 'components'
import relLocForLabel from './relLocForLabel'

describe('Interface Components', () => {
    describe('Diagram Element', () => {

        test('renders an ElectroWeak', () => {
            const store = createStore()

            // render a fermion through the diagram element
            const wrapper = mount(
                <Provider store={store}>
                    <Propagator kind="em" />
                </Provider>
            )
            // make sure there is a fermion
            expect(wrapper.find(ElectroWeak)).toHaveLength(1)
        })

        test('renders a Fermion', () => {
            const store = createStore()

            // render a fermion through the diagram element
            const wrapper = mount(
                <Provider store={store}>
                    <Propagator kind="fermion" />
                </Provider>
            )
            // make sure there is a fermion
            expect(wrapper.find(Fermion)).toHaveLength(1)
        })

        test('renders a gluon', () => {
            const store = createStore()

            // render a fermion through the diagram element
            const wrapper = mount(
                <Provider store={store}>
                    <Propagator kind="gluon" />
                </Provider>
            )
            // make sure there is a fermion
            expect(wrapper.find(Gluon)).toHaveLength(1)

        })

        test('passes default config onto the rendered propagator', () => {
            const store = createStore()

            // render a fermion through the diagram element
            const wrapper = mount(
                <Provider store={store}>
                    <Propagator kind="fermion" />
                </Provider>
            )
            // make sure there is a fermion
            const fermion = wrapper.find(Fermion)

            // the default configuration
            const defaultConfig = CoreProp.defaultProps
            const props = fermion.props()

            // go over each default configuration
            for (const config of Object.keys(defaultConfig)) {
                // if the config pertains to the label
                if (config.match(/label/)) {
                    // move along
                    continue
                }
                // make sure the prop matches the default value
                expect(props[config]).toEqual(defaultConfig[config])
            }
        })

        test('renders with selected prop equal true when appropriate', () => {
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
                kind: 'fermion',
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
            const defaultConfig = Propagator.defaultProps
            const props = fermion.props()
        })

        test('can be selected with click', () => {
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
                kind: 'fermion',
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

            expect(store.getState().diagram.elements.selection.propagators).toEqual([1])
        })

        test('can compute the location for a label for a propagator', () => {
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
                kind: 'fermion',
                anchor1: 1,
                anchor2: 2,
                label: 'a'
            }))

            // we grab the location from a propgator with dereferenced anchors
            const propagator = elementsWithLocations(store.getState().diagram.elements).propagators[0]

            // get the location for the label
            const location = locationForLabel(propagator)

            // make sure its a valid location
            expect(location.x).toBeDefined()
            expect(location.y).toBeDefined()
        })

        test('doesn\'t render a propagator if there is no distance to draw', function() {// a store to start out with
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
                    x: 50,
                    y: 100,
                }
            ))

            // add a propagator connecting the anchors
            store.dispatch(addPropagators({
                id: 1,
                kind: 'fermion',
                anchor1: 1,
                anchor2: 2,
                label: 'a'
            }))

            // render a fermion through the diagram element
            const wrapper = mount(
                <Provider store={store}>
                    <Diagram />
                </Provider>
            )

            // make sure there is no text
            expect(wrapper.find(Text)).toHaveLength(0)
        })

        test('can compute the relative coordinates for a label given diagram coordiantes', () => {

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
                kind: 'fermion',
                anchor1: 1,
                anchor2: 2,
                label: 'a'
            }))

            // we grab the location from a propgator with dereferenced anchors
            const propagator = elementsWithLocations(store.getState().diagram.elements).propagators[0]

            // get the location for the label
            const location = relLocForLabel({x: 75, y: 150}, propagator)

            // make sure its a valid location
            expect(location.labelDistance).toBeDefined()
            expect(location.labelLocation).toBeDefined()
        })

        test('shows a label for the element if there is a value', () => {
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
                kind: 'fermion',
                anchor1: 1,
                anchor2: 2,
                label: 'a'
            }))

            // render a fermion through the diagram element
            const wrapper = mount(
                <Provider store={store}>
                    <Diagram />
                </Provider>
            )

            // find the label
            const label = wrapper.find(Text)

            // sanity check
            expect(label).toHaveLength(1)

            // we grab the location from a propgator with dereferenced anchors
            const propagator = elementsWithLocations(store.getState().diagram.elements).propagators[0]
            // the expected location for the label
            const labelLocation = locationForLabel(propagator)

            // the props we passed the label
            const labelProps = label.props()

            // make sure it was passed the right props
            expect(labelProps.x).toEqual(labelLocation.x)
            expect(labelProps.y).toEqual(labelLocation.y)
            expect(labelProps.children).toEqual('a')
        })
    })
})

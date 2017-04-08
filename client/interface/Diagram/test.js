// external imports
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import _ from 'lodash'
import SvgMatrix from 'svg-matrix'
// local imports
import { createStore } from 'store'
import { toggleGrid, toggleAnchors, setGridSize, panDiagram } from 'actions/info'
import { addPropagators, addAnchors, selectElements, addElements } from 'actions/elements'
import { initialState } from 'store/diagram/elements'
import Diagram, { exportDiagramImageEvent } from '.'
import Propagator from './Propagator'
import Grid from './Grid'
import Anchor from './Anchor'
import Text from './Text'
import Shape from './Shape'


// a diagram wrapped in the right context
const Test = (props) => (
     <Provider {...props}>
        <Diagram/>
    </Provider>
)

describe('Interface Components', () => {

    describe('Diagram', () => {

        test('shows the grid when the store says so', () => {
            // create a verion of the store
            const store = createStore()
            // if the grid is supposed to be hidden
            if (!store.getState().diagram.info.showGrid) {
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
            expect(wrapper.find(Grid)).toHaveLength(1)
        })

        test('hides the grid when the store says so', () => {
            // create a verion of the store
            const store = createStore()
            // if the grid is supposed to be shown
            if (store.getState().diagram.info.showGrid) {
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
            expect(wrapper.find(Grid)).toHaveLength(0)
        })

        test('hides the grid when the gridSize is zero', () => {
            // create a verion of the store
            const store = createStore()
            // make sure the grid would show otherwise
            if (!store.getState().diagram.info.showGrid) {
                // show the grid
                store.dispatch(toggleGrid())
            }

            // set the grid size to zero
            store.dispatch(setGridSize(0))

            // render the diagram in the wrapper
            const wrapper = mount(
                <Provider store={store}>
                    <Diagram/>
                </Provider>
            )

            // make sure there is a grid
            expect(wrapper.find(Grid)).toHaveLength(0)
        })

        test('produces a propagator for each entry in the store', () => {
            // create a store to test with
            const store = createStore()

            // add some anchors
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 50,
                },
                {
                    id: 2,
                    x: 100,
                    y: 1000,
                }
            ))

            // add an element to the store
            store.dispatch(addPropagators(
                {
                    kind: 'invalid1',
                    id: 1,
                    anchor1: 1,
                    anchor2: 2,
                },
                {
                    kind: 'invalid2',
                    id: 2,
                    anchor1: 1,
                    anchor2: 2,
                }
            ))

            // render the diagram in the wrapper
            const wrapper = mount(<Test store={store}/>)
            // the expected number of propagators
            const expected = Object.values(initialState.propagators).length + 2

            // make sure there are two fermions in the diagram
            expect(wrapper.find(Propagator)).toHaveLength(expected)
        })

        test('renders Anchors when appropriate', () => {
            // create a verion of the store
            const store = createStore()
            // if anchors are supposed to be hidden
            if (!store.getState().diagram.info.showAnchors) {
                // make sure the anchors are shown
                store.dispatch(toggleAnchors())
            }

            // add some anchors
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 50,
                },
                {
                    id: 2,
                    x: 100,
                    y: 1000,
                }
            ))

            // render the diagram in the wrapper
            const wrapper = mount(<Test store={store}/>)

            // make sure there are two Anchors in the diagram
            expect(wrapper.find(Anchor)).toHaveLength(2)
        })

        test('clicking on diagram clears selection', () => {
            // create a verion of the store
            const store = createStore()

            // add some anchors
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 50,
                },
                {
                    id: 2,
                    x: 100,
                    y: 1000,
                }
            ))

            // select the element
            store.dispatch(selectElements({type: 'anchors', id:1}))

            // render the diagram in the wrapper
            const wrapper = mount(<Test store={store}/>)

            // click on the diagram
            wrapper.find(Diagram).simulate('mouseDown')

            // make sure the selection is clear
            expect(store.getState().diagram.elements.selection.anchors).toHaveLength(0)
        })

        test('passes selected state onto the appropriate anchor components', () => {
            // create a verion of the store
            const store = createStore()

            // add some anchors
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 50,
                },
            ))

            // select the element
            // store.dispatch(selectElements({type: 'anchors', id:1}))

            // render the diagram in the wrapper
            const wrapper = mount(<Test store={store}/>)

            // make sure the anchor was told to render selected
            expect(wrapper.find(Anchor).props().selected).toBeTruthy
        })

        test('passes selected state onto the appropriate propagator components', () => {
            // create a verion of the store
            const store = createStore()

            // add some anchors
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 50,
                },
                {
                    id: 2,
                    x: 100,
                    y: 1000,
                }
            ))

            // and some propagators
            store.dispatch(addPropagators(
                {
                    id: 1,
                    kind: 'fermion',
                    anchor1: 1,
                    anchor2: 2,
                }
            ))

            // select the element
            store.dispatch(selectElements({type: 'propagators', id:1}))

            // render the diagram in the wrapper
            const wrapper = mount(<Test store={store}/>)

            // find the anchor corresponding to the selected element
            const anchor = wrapper.find(Propagator)

            // make sure such an element exist
            expect(anchor).not.toHaveLength(0)

            // make sure the anchor was told to render selected
            expect(anchor.props().selected).toBeTruthy
        })

        test('passes selected state onto the appropriate text components', () => {
            // create a verion of the store
            const store = createStore()

            // add some anchors
            store.dispatch(addElements(
                {
                    id: 1,
                    type: 'text',
                    value: 'hello',
                    x: 50,
                    y: 50
                },
            ))

            // select the element
            store.dispatch(selectElements({type: 'text', id:1}))

            // render the diagram in the wrapper
            const wrapper = mount(<Test store={store}/>)

            // find the anchor corresponding to the selected element
            const anchor = wrapper.find(Text)

            // make sure such an element exist
            expect(anchor).not.toHaveLength(0)

            // make sure the anchor was told to render selected
            expect(anchor.props().selected).toBeTruthy
        })

        test('has the transform to accomodate the diagram pan', () => {
            // create a verion of the store
            const store = createStore()

            // pan the diagram in the postive x direction
            store.dispatch(panDiagram({x: 10}))

            // render the diagram in the wrapper
            const wrapper = mount(<Test store={store}/>)

            // find the svg element
            const svg = wrapper.find('g.diagram')

            // make sure the svg element has the transform prop to match the pan
            expect(svg.props().transform).toEqual(
               SvgMatrix().translate(10).transformString
            )
        })

        test('renders text elements for each entry in the store', () => {
            // create a verion of the store
            const store = createStore()

            // add some anchors
            store.dispatch(addElements(
                {
                    type: 'text',
                    value: 'hello',
                    id: 1,
                    x: 50,
                    y: 50,
                },
                {
                    type: 'text',
                    value: 'goodbye',
                    id: 2,
                    x: 500,
                    y: 50,
                }
            ))

            // render the diagram in the wrapper
            const wrapper = mount(<Test store={store}/>)

            // make sure there are two text elements
            expect(wrapper.find(Text)).toHaveLength(2)
        })

        test('renders a shape for each entry in the store', () => {
            // create a verion of the store
            const store = createStore()

            // add some anchors
            store.dispatch(addElements(
                {
                    type: 'shapes',
                    id: 1,
                    x: 50,
                    y: 50,
                    r: 10,
                },
                {
                    type: 'shapes',
                    id: 2,
                    x: 500,
                    y: 50,
                    r: 10,
                }
            ))

            // render the diagram in the wrapper
            const wrapper = mount(<Test store={store}/>)

            // make sure there are two text elements
            expect(wrapper.find(Shape)).toHaveLength(2)

        })
    })
})

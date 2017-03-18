// external imports
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import _ from 'lodash'
import sinon from 'sinon'
// local imports
import { createStore } from 'store'
import { toggleGrid, toggleAnchors, setGridSize } from 'actions/info'
import { addPropagators, addAnchors, selectElements } from 'actions/elements'
import { initialState } from 'store/diagram/elements'
import Diagram, { exportDiagramImageEvent } from '..'
import Propagator from '../Propagator'
import Grid from '../Grid'
import Anchor from '../Anchor'


// a diagram wrapped in the right context
const Test = (props) => (
     <Provider {...props}>
        <Diagram/>
    </Provider>
)

describe('Interface Components', function() {

    describe('Diagram', function() {

        it('shows the grid when the store says so', function() {
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
            expect(wrapper.find(Grid)).to.have.length(1)
        })

        it('hides the grid when the store says so', function() {
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
            expect(wrapper.find(Grid)).to.have.length(0)
        })

        it('hides the grid when the gridSize is zero', function() {
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
            expect(wrapper.find(Grid)).to.have.length(0)
        })

        it('produces a propagator for each entry in the store', function() {
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
            expect(wrapper.find(Propagator)).to.have.length(expected)
        })

        it('renders Anchors when appropriate', function() {
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
            expect(wrapper.find(Anchor)).to.have.length(2)
        })

        it('clicking on diagram clears selection', function() {
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
            expect(store.getState().diagram.elements.selection.anchors).to.have.length(0)
        })

        it('passes selected state onto the appropriate anchor components', function() {
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

            // find the anchor corresponding to the selected element
            const anchor = wrapper.find(Anchor).findWhere(ele => {
                return ele.name() === 'Anchor' && ele.props().id == 1
            })

            // make sure such an element exist
            expect(anchor).to.not.have.length(0)

            // make sure the anchor was told to render selected
            expect(anchor.props().selected).to.be.true
        })
    })
})

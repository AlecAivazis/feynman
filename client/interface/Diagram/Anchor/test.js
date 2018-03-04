// external imports
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
// local imports
import { sidebarWidth } from 'interface/Sidebar/styles'
import Diagram from 'interface/Diagram'
import { createStore } from 'store'
import { addAnchors, selectElements } from 'actions/elements'
import { relativePosition, fixPositionToGrid } from 'utils'
import ConnectedAnchor, { Anchor } from '.'

// a test component
const Test = props => (
    <Provider {...props}>
        <Diagram />
    </Provider>
)

describe('Interface Components', () => {
    describe('Anchor', () => {
        test('clicking on the anchor selects it', () => {
            // a store to test with
            const store = createStore()
            // add an anchor
            store.dispatch(
                addAnchors({
                    id: 1,
                    x: 50,
                    y: 50,
                })
            )
            // mount the anchor/diagram combo
            const wrapper = mount(<Test store={store} />)

            // find the anchor and click it
            wrapper.find(ConnectedAnchor).simulate('mouseDown')

            // make sure there is only one selected element
            expect(store.getState().diagram.elements.selection.anchors).toEqual([1])
        })

        test('gets mounted with default config', () => {
            // a store to test with
            const store = createStore()
            // add an anchor
            store.dispatch(
                addAnchors({
                    id: 1,
                    x: 50,
                    y: 50,
                })
            )
            // mount the anchor/diagram combo
            const wrapper = mount(<Test store={store} />)

            // find the anchor component
            const anchor = wrapper.find('circle')
            // save a reference to its props
            const props = anchor.props()

            // the default config
            const defaultConfig = Anchor.defaultProps

            // go over each default configuration
            for (const config of Object.keys(defaultConfig)) {
                // fixed isn't passed as styling
                if (config === 'fixed') continue

                // make sure the prop matches the default value
                expect(props[config]).toEqual(defaultConfig[config])
            }
        })

        test('clicking on a group of selected anchors does not deselect the group', () => {
            // a store to test with
            const store = createStore()
            // add an anchor
            store.dispatch(
                addAnchors(
                    {
                        id: 1,
                        x: 50,
                        y: 50,
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                    }
                )
            )

            // select the anchors
            store.dispatch(selectElements({ type: 'anchors', id: 1 }, { type: 'anchors', id: 2 }))

            // mount the anchor/diagram combo
            const wrapper = mount(<Test store={store} />)

            // click on one of the selected anchors
            wrapper
                .find(ConnectedAnchor)
                .at(0)
                .simulate('mouseDown')

            // make sure the selection has both entries still
            expect(store.getState().diagram.elements.selection.anchors).toEqual([1, 2])
        })
    })
})

// external imports
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
// local imports
import { addAnchors } from 'actions/elements'
import { commit } from 'actions/history'
import { createStore } from 'store'
import HistorySummary from '.'
import Entry from './Entry'

const Test = (props) => (
     <Provider {...props}>
        <HistorySummary/>
    </Provider>
)

describe('Interface Components', () => {
    describe('Sidebar', () => {
        describe('History Summary', () => {
            test('shows a history entry in the summary for each commit', () => {
                // a store to test with
                const store = createStore()

                // add some anchors
                store.dispatch(addAnchors({
                    id: 1,
                    x: 50,
                    y: 100,
                }))
                // commit the current state
                store.dispatch(commit('initial state'))

                // add some anchors
                store.dispatch(addAnchors({
                    id: 2,
                    x: 100,
                    y: 200,
                }))
                // commit the current state
                store.dispatch(commit('second state'))

                // mount the test
                const wrapper = mount(<Test store={store} />)

                // make sure there is enough entry
                expect(wrapper.find(Entry)).toHaveLength(2)

                // make sure the find one wraps an entry with the right message
                expect(wrapper.find(Entry).at(0).props().children.message).toEqual('second state')
                expect(wrapper.find(Entry).at(1).props().children.message).toEqual('initial state')
            })
        })
    })
})

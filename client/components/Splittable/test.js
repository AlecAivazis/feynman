// external imports
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
// local imports
import { createStore } from 'store'
import Splittable from '../Splittable'

describe('"Reusable" Components', () => {
    describe('Splittable', () => {
        test('renders its child', () => {
            // render a wrapped div
            const wrapper = mount(
                <Provider store={createStore()}>
                    <Splittable>
                        <div>
                            hello
                        </div>
                    </Splittable>
                </Provider>
            )

            // make sure there is a div in the view
            expect(wrapper.find('div')).toHaveLength(1)
        })

        test('barfs if there are multiple children', () => {
            // render a splittable around two divs
            const wrapper = () => mount(
                <Provider store={createStore()}>
                    <Splittable>
                        <div>
                            hello
                        </div>
                        <div>
                            hello
                        </div>
                    </Splittable>
                </Provider>
            )

            // make sure that fails
            expect(wrapper).toThrow(Error)
        })
    })
})

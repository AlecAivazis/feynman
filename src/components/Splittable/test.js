// external imports
import React from 'react'
import { mount } from 'enzyme'
// local imports
import Splittable from '../Splittable'

describe('"Reusable" Components', function() {
    describe('Splittable', function() {
        it('renders its child', function() {
            // render a wrapped div
            const wrapper = mount(
                <Splittable>
                    <div>
                        hello
                    </div>
                </Splittable>
            )

            // make sure there is a div in the view
            expect(wrapper.find('div')).to.have.length(1)
        })

        it('barfs if there are multiple children', function() {
            // render an element drag over two divs
            const wrapper = () => mount(
                <Splittable>
                    <div>
                        hello
                    </div>
                    <div>
                        hello
                    </div>
                </Splittable>
            )

            // make sure that fails
            expect(wrapper).to.throw(Error)
        })
    })
})
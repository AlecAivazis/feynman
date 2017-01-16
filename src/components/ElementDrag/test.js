// external imports
import React from 'react'
import { mount } from 'enzyme'
// local imports
import ElementDrag from '../ElementDrag'

describe('"Reusable" Components', function() {
    describe('ElementDrag', function() {
        it('renders its child', function() {
            // render a wrapped div
            const wrapper = mount(
                <ElementDrag>
                    <div>
                        hello
                    </div>
                </ElementDrag>
            )

            // make sure there is a div in the view
            expect(wrapper.find('div')).to.have.length(1)
        })

        it('barfs if there are multiple children', function() {
            // render an element drag over two divs
            const wrapper = () => mount(
                <ElementDrag>
                    <div>
                        hello
                    </div>
                    <div>
                        hello
                    </div>
                </ElementDrag>
            )

            // make sure that fails
            expect(wrapper).to.throw(Error)
        })
    })
})
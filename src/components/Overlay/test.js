// external imports
import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
// local imports
import Overlay from '.'
import Header from './Header'

describe('"Reusable" Components', function() {
    describe('Overlay', function() {
        it('clicking on the background calls hide', function() {
            // a spy to track if hide is called
            const spy = sinon.spy()

            // mount the overlay
            const wrapper = shallow(
                <Overlay hide={spy}>
                    foo
                </Overlay>
            )

            // click the root level element
            wrapper.find('aside').simulate('click')

            // make sure the spy was called
            spy.should.have.been.called
        })

        it('clicking on the content does not call hide', function() {
            // a spy to track if hide is called
            const spy = sinon.spy()

            // mount the overlay
            const wrapper = shallow(
                <Overlay hide={spy}>
                    foo
                </Overlay>
            )

            // click the content
            wrapper.find('section').simulate('click')

            // make sure the spy was called
            spy.should.not.have.been.called
        })

        it('places addon prop in the dom', function() {
            // the addon to the pass to the overlay
            const Foo = () => <div/>
            // we have to pass an instanstiated component
            const addon = <Foo />

            // a spy to track if hide is called
            const spy = sinon.spy()

            // mount the overlay
            const wrapper = mount(
                <Overlay hide={spy} addon={addon}>
                    foo
                </Overlay>
            )

            // make sure the addon was rendere
            expect(wrapper.find(Foo)).to.have.length(1)
        })
    })
})

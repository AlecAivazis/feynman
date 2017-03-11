// external imports
import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
// local imports
import ColorPicker, { Picker, colors } from '.'

describe('"Reusable" Components', function() {
    describe('Color picker', function() {
        it('starts off hidden', function() {
            // render the color picker
            const wrapper = mount(
                <ColorPicker />
            )

            // make sure there is no Picker visible
            expect(wrapper.find(Picker)).to.have.length(0)
        })

        it('becomes visible when the user clicks on the thumbnail', function() {
            // render the color picker
            const wrapper = mount(
                <ColorPicker />
            )

            // click on the thumbnail
            wrapper.find('.colorThumbnail').simulate('click')

            // make sure there is no Picker visible
            expect(wrapper.find(Picker)).to.have.length(1)
        })

        it('passes the correct value to the onChange handler', function() {
            // the color to test against
            const color = colors[0]

            // something to inspect what's passed to the onChange handler
            const spy = sinon.spy()

            // render the color picker
            const wrapper = mount(
                <ColorPicker onChange={spy}/>
            )

            // click on the thumbnail to show the swatches
            wrapper.find('.colorThumbnail').simulate('click')
            // click on the first swatch to select its color
            wrapper.find('Swatch').at(0).simulate('click')

            // make sure the spy was correctly called
            spy.should.have.been.calledWith(color)
        })
    })
})

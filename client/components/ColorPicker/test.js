// external imports
import React from 'react'
import { mount } from 'enzyme'
// local imports
import ColorPicker, { Picker, colors } from '.'

describe('"Reusable" Components', () => {
    describe('Color picker', () => {
        test('starts off hidden', () => {
            // render the color picker
            const wrapper = mount(<ColorPicker />)

            // make sure there is no Picker visible
            expect(wrapper.find(Picker)).toHaveLength(0)
        })

        test('becomes visible when the user clicks on the thumbnail', () => {
            // render the color picker
            const wrapper = mount(<ColorPicker />)

            // click on the thumbnail
            wrapper.find('.colorThumbnail').simulate('click')

            // make sure there is no Picker visible
            expect(wrapper.find(Picker)).toHaveLength(1)
        })

        test('passes the correct value to the onChange handler', () => {
            // the color to test against
            const color = colors[0]

            // something to inspect what's passed to the onChange handler
            const spy = jest.fn()

            // render the color picker
            const wrapper = mount(<ColorPicker onChange={spy} />)

            // click on the thumbnail to show the swatches
            wrapper.find('.colorThumbnail').simulate('click')
            // click on the first swatch to select its color
            wrapper
                .find('Swatch')
                .at(0)
                .simulate('click')

            // make sure the spy was correctly called
            expect(spy).toHaveBeenCalledWith(color)
        })
    })
})

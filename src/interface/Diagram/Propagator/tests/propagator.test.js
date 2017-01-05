// external imports
import React from 'react'
import { shallow } from 'enzyme'
// local imports
import Propagator from '..'
import Fermion from '../Fermion'
import ElectroWeak from '../ElectroWeak'

describe('Interface Components', function() {
    describe('Diagram Element', function() {

        it('renders an ElectroWeak', function() {
            // render a fermion through the diagram element
            const wrapper = shallow(<Propagator type="em" />)
            // make sure there is a fermion
            expect(wrapper.find(ElectroWeak)).to.have.length(1)
        })

        it('renders a Fermion', function() {
            // render a fermion through the diagram element
            const wrapper = shallow(<Propagator type="fermion" />)
            // make sure there is a fermion
            expect(wrapper.find(Fermion)).to.have.length(1)
        })

        it('passes default config onto the rendered propagator', function() {
            // render a fermion through the diagram element
            const wrapper = shallow(<Propagator type="fermion" />)
            // make sure there is a fermion
            const fermion = wrapper.find(Fermion)

            // the default configuration
            const defaultConfig = Propagator.defaultProps
            const props = fermion.props()

            // go over each default configuration
            for (const config of Object.keys(defaultConfig)) {
                // make sure the prop matches the default value
                expect(props[config]).to.equal(defaultConfig[config])
            }

        })
    })
})

// external imports
import React from 'react'
import { shallow } from 'enzyme'
// local imports
import DiagramElement from '../element'
import Fermion from '../Fermion'
import ElectroWeak from '../ElectroWeak'

describe('Interface Components', function() {
    describe('Diagram Element', function() {

        it('can render a Fermion', function() {
            // render a fermion through the diagram element
            const wrapper = shallow(<DiagramElement type="fermion" />)
            // make sure there is a fermion
            expect(wrapper.find(Fermion)).to.have.length(1)
        })

        it('can render an ElectroWeak', function() {
            // render a fermion through the diagram element
            const wrapper = shallow(<DiagramElement type="em" />)
            // make sure there is a fermion
            expect(wrapper.find(ElectroWeak)).to.have.length(1)
        })
    })
})

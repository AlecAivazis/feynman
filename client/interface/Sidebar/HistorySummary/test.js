// external imports
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import _ from 'lodash'
import SvgMatrix from 'svg-matrix'
// local imports
import { createStore } from 'store'
import { toggleGrid, toggleAnchors, setGridSize, panDiagram } from 'actions/info'
import { addPropagators, addAnchors, selectElements, addElements } from 'actions/elements'
import { initialState } from 'store/diagram/elements'
import Diagram, { exportDiagramImageEvent } from '.'
import Propagator from './Propagator'
import Grid from './Grid'
import Anchor from './Anchor'
import Text from './Text'
import Shape from './Shape'


// a diagram wrapped in the right context
const Test = (props) => (
     <Provider {...props}>
        <Diagram/>
    </Provider>
)

describe('Interface Components', () => {
    describe('Sidebar', () => {
        describe('History Summary', () => {

        })
    })
})

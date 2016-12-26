// external imports
import React from 'react'
import { connect } from 'react-redux'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
// local imports
import { Label } from 'components'
import { setGridSize } from 'actions/info'
import { element as elementStyle } from '../styles'

const GridSizeControl = ({info, dispatch, ...unusedProps}) => (
    <div {...unusedProps}>
        <Label style={elementStyle}>grid</Label>
        <Slider
            min={0}
            max={100}
            step={10}
            value={info.gridSize}
            onChange={value => dispatch(setGridSize(value))}
        />
    </div>
)

const selector = ({info}) => ({info})
export default connect(selector)(GridSizeControl)

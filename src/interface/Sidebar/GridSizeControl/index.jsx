// external imports
import React from 'react'
import { connect } from 'react-redux'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
// local imports
import './slider.css'
import styles from './styles'
import { Label } from 'components'
import { setGridSize } from 'actions/info'

// this had to be a class-based component for slider (attaches a ref)
class SliderHandle extends React.Component {
    render() {
        // pull out the used props
        const { offset } = this.props

        // render the component
        return (
            <span style={{...styles.slider, left: `${offset}%`}}>
                <span style={styles.innerSlider} />
            </span>
        )
    }
}

const GridSizeControl = ({info, dispatch, style, ...unusedProps}) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
        <div style={styles.header}>
            <Label>grid</Label>
            <span style={styles.sizeIndicator}>
                {info.gridSize}
            </span>
        </div>
        <div style={styles.sliderContainer}>
            <Slider
                min={0}
                max={100}
                step={10}
                value={info.gridSize}
                handle={<SliderHandle />}
                onChange={value => dispatch(setGridSize(value))}
            />
        </div>
    </div>
)

const selector = ({info}) => ({info})
export default connect(selector)(GridSizeControl)

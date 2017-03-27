// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import { Label, Slider } from 'components'
import { setZoom } from 'actions/info'

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

const ZoomLevelControl = ({info, dispatch, style, ...unusedProps}) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
        <div style={styles.header}>
            <Label>zoom</Label>
            <span style={styles.levelIndicator}>
                {info.zoomLevel.toFixed(1)}
            </span>
        </div>
        <div style={styles.sliderContainer}>
            <Slider
                step={.1}
                min={0.5}
                max={2}
                value={info.zoomLevel}
                onChange={value => dispatch(setZoom(value))}
            />
        </div>
    </div>
)

const selector = ({diagram: {info}}) => ({info})
export default connect(selector)(ZoomLevelControl)

// external imports
import React from 'react'
import RcSlider from 'rc-slider'
import 'rc-slider/assets/index.css'
// local imports
import styles from './styles'
import './slider.css'

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

const Slider = ({ min, max, step, style, ...unusedProps }) => (
    <RcSlider
        min={min}
        max={max}
        step={step}
        handle={<SliderHandle />}
        { ...unusedProps }
    />
)

export default Slider

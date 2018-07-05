// external imports
import React from 'react'
import RcSlider from 'rc-slider'
import 'rc-slider/assets/index.css'
// local imports
import styles from './styles'
import './slider.css'

const Slider = ({ min, max, step, style, ...unusedProps }) => (
    <RcSlider min={min} max={max} step={step} handle={SliderHandle} {...unusedProps} />
)

const SliderHandle = ({ offset }) => (
    <span style={{ ...styles.slider, left: `${offset}%` }}>
        <span style={styles.innerSlider} />
    </span>
)

export default Slider

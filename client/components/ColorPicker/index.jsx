// external imports
import React from 'react'
import { TwitterPicker } from 'react-color'
import liftC, { toggleState } from 'react-liftc'
// local imports
import styles from './styles'

// the color options
export const colors =  [
    '#ff6900',
    '#fcb900',
    '#7bdcb5',
    '#00d084',
    '#8ed1fc',
    '#0693e3',
    '#abb8C3',
    '#eb144c',
    '#f78da7',
    '#9900ef'
]

const ColorPicker = ({
    style, color,
    onChange,
    state:active,
    toggle,
    ...unusedProps }) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
        <div
            className="colorThumbnail"
            onClick={toggle}
            style={{...styles.thumbnail, backgroundColor: color}}
        />
        {active && (
            <div style={styles.pickerContainer}>
                <TwitterPicker
                    style={style}
                    color={color}
                    colors={colors}
                    triangle="top-right"
                    onChange={({hex}) => onChange(hex)}
                    onChangeComplete={toggle}
                />
            </div>
        )}
    </div>
)

export const Picker = TwitterPicker

export default liftC(toggleState)(ColorPicker)

// external imports
import React from 'react'
// local imports
import styles from './styles'

const PaletteItem = ({style, ...unusedProps}) => (
    <div style={{...styles.paletteItem, ...style}} {...unusedProps}>
        hello
    </div>
)

export default PaletteItem

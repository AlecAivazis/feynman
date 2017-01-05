// external imports
import React from 'react'
// local imports
import styles from './styles'

const ItemPalette = ({ style, ...unusedProps }) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
         The item palette
    </div>
)

export default ItemPalette

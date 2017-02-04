// external imports
import React from 'react'
// local imports
import styles from './styles'
import PaletteItem from './paletteItem'

const ItemPalette = ({ style, ...unusedProps }) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
         <h1 style={styles.header}>
            item palette
         </h1>
         <h2 style={styles.subHeader}>
            Drag and drop items to add them to a canvas
         </h2>
         <div style={styles.palette}>
            <PaletteItem />
            <PaletteItem />
            <PaletteItem />
            <PaletteItem />
            <PaletteItem />
            <PaletteItem />
         </div>
    </div>
)

export default ItemPalette

// external imports
import React from 'react'
// local imports
import styles from './styles'
import PaletteItem from './paletteItem'
import {circle, gluon, line, dashed, em, text} from './images'

const ItemPalette = ({ style, ...unusedProps }) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
         <h1 style={styles.header}>
            item palette
         </h1>
         <h2 style={styles.subHeader}>
            Drag and drop items to add them to a canvas
         </h2>
         <div style={styles.palette}>
            <PaletteItem image={circle}/>
            <PaletteItem 
                item={{type: "propagators", kind: "gluon"}} 
                image={gluon}
            />
            <PaletteItem image={dashed}/>
            <PaletteItem image={line}/>
            <PaletteItem image={em}/>
            <PaletteItem image={text}/>
         </div>
    </div>
)

export default ItemPalette

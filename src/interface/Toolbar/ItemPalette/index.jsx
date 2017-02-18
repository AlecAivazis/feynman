// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import PaletteItem from './paletteItem'
import {circle, gluon, line, dashed, em, text} from './images'
import { generateElementId } from 'utils'

// this function returns the element spec for propagator of the given type
const propagatorSpec = ({kind, elements, info:{gridSize}}) => ({x, y}) => {
    // we need two unique anchor ids
    const [anchor1, anchor2] = generateElementId(elements.anchors, 2)

    // return the spec description
    return {
        type: 'propagators',
        id: generateElementId(elements.propagators),
        kind,
        anchor1: {
            id: anchor1,
            x: 50,
            y: 100,
        },
        anchor2: {
            id: anchor2,
            x: 100,
            y: 200,
        }
    }
}

const ItemPalette = ({ style, info, dispatch, elements, ...unusedProps }) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
         <h1 style={styles.header}>
            item palette
         </h1>
         <h2 style={styles.subHeader}>
            Drag and drop items to add them to a canvas
         </h2>
         <div style={styles.palette}>
            <PaletteItem image={circle} element={propagatorSpec({kind: "gluon", info, elements})}/>
            <PaletteItem image={gluon} element={propagatorSpec({kind: "gluon", info, elements})}/>
            <PaletteItem image={dashed} element={propagatorSpec({kind: "dashed", info, elements})}/>
            <PaletteItem image={line} element={propagatorSpec({kind: "line", info, elements})}/>
            <PaletteItem image={em} element={propagatorSpec({kind: "em", info, elements})}/>
            <PaletteItem image={text} element={propagatorSpec({kind: "em", info, elements})}/>
         </div>
    </div>
)

const selector = ({info, elements}) => ({info, elements})
export default connect(selector)(ItemPalette)

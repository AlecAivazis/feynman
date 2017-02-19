// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import PaletteItem from './paletteItem'
import {circle, gluon, line, dashed, em, text} from './images'

const ItemPalette = ({ style, info, dispatch, elements, setShadow, onMouseDown, ...unusedProps }) => {
    
    // a local component to dry up code
    const Item = ({...props}) => (
        <PaletteItem onMouseDown={onMouseDown} {...props}/>
    )

    return (
        <div style={{...styles.container, ...style}} {...unusedProps}>
            <h1 style={styles.header}>
                item palette
            </h1>
            <h2 style={styles.subHeader}>
                Drag and drop items to add them to a canvas
            </h2>
            <div style={styles.palette}>
                <Item image={circle} type="propagators" config={{kind: "gluon"}} />
                <Item image={gluon} type="propagators" config={{kind: "gluon"}} />
                <Item image={dashed} type="propagators" config={{kind: "dashed"}} />
                <Item image={line} type="propagators" config={{kind: "line"}} />
                <Item image={em} type="propagators" config={{kind: "em"}} />
                <Item image={text} type="propagators" config={{kind: "em"}} />
            </div>
        </div>
    )
}

const selector = ({info, elements}) => ({info, elements})
export default connect(selector)(ItemPalette)

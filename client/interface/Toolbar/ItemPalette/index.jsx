// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import PaletteItem from './paletteItem'
import { Button } from 'components'
import {circle, gluon, line, dashed, em, text} from './images'
import { togglePatternModal } from 'actions/info'


const ItemPalette = ({ togglePatterns, style, onMouseDown, ...unusedProps }) => {

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
                <Item image={circle} config={{type: "propagators", kind: "gluon"}} />
                <Item image={gluon} config={{type: "propagators", kind: "gluon"}} />
                <Item image={dashed} config={{type: "propagators", kind: "dashed"}} />
                <Item image={line} config={{type: "propagators", kind: "fermion"}} />
                <Item image={em} config={{type: "propagators", kind: "em"}} />
                <Item image={text} config={{type: "propagators", kind: "em"}} />
            </div>
            <div style={styles.patternButtonContainer}>
                <Button onClick={togglePatterns} style={styles.patternButton}>
                    Show Patterns
                </Button>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    togglePatterns: () => dispatch(togglePatternModal())
})

export default connect(null, mapDispatchToProps)(ItemPalette)

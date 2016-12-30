// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import Grid from './Grid'
import DiagramElement from './element'

const Diagram = ({info, elements, style}) => {
    // figure out if we need to style to fit the grid or not
    const elementStyle = info.showGrid ? styles.containerWithGrid : styles.containerWithoutGrid

    // render the various components of the diagram
    return (
        <svg style={{...elementStyle, ...style}}>
            {info.showGrid && <Grid/>}
            {elements.propagators.map((element, i) => <DiagramElement {...element} key={i}/>)}
        </svg>
    )
}

const selector = ({ info, elements }) => ({info, elements})
export default connect(selector)(Diagram)

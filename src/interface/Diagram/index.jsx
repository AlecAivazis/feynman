// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import Grid from './Grid'
import Propagator from './Propagator'

const Diagram = ({info, elements, style}) => {
    // figure out if we need to style to fit the grid or not
    const elementStyle = info.showGrid ? styles.containerWithGrid : styles.containerWithoutGrid

    // figure the concrete locations for each propgators (dereference the anchors)
    const propgators = elements.propagators.map(({anchor1, anchor2, ...propagator}) => {
        // get the location for the two anchors (guarunteed to exist by the reducer)
        const anch1 = elements.anchors[anchor1]
        const anch2 = elements.anchors[anchor2]

        // add the anchor positions to the propagator config
        return {
            ...propagator,
            x1: anch1.x,
            y1: anch1.y,
            x2: anch2.x,
            y2: anch2.y,
        }
    })

    // render the various components of the diagram
    return (
        <svg style={{...elementStyle, ...style}}>
            {info.showGrid && <Grid/>}
            {elements.propagators.map((element, i) => <Propagator {...element} key={i}/>)}
        </svg>
    )
}

const selector = ({ info, elements }) => ({info, elements})
export default connect(selector)(Diagram)

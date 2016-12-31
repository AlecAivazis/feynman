// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import Grid from './Grid'
import Propagator from './Propagator'
import Anchor from './Anchor'
import { propagatorsWithLocation } from './util'

const Diagram = ({info, elements, style}) => {
    // figure out if we need to style to fit the grid or not
    const elementStyle = info.showGrid ? styles.containerWithGrid : styles.containerWithoutGrid

    // figure the concrete locations for each propgators (dereference the anchors)
    const propagators = propagatorsWithLocation(elements)

    // the list of anchors
    const anchors = Object.keys(elements.anchors).map(anchorId => {
        // retrieve the anchor
        const anchor = elements.anchors[anchorId]

        // render the component
        return <Anchor {...anchor} key={anchor.id}/>
    })

    // render the various components of the diagram
    return (
        <svg style={{...elementStyle, ...style}}>
            {info.showGrid && <Grid/>}
            {propagators.map((element, i) => <Propagator {...element} key={i}/>)}
            {info.showAnchors && anchors}
        </svg>
    )
}

const selector = ({ info, elements }) => ({info, elements})
export default connect(selector)(Diagram)

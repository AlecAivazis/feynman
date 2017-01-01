// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import Grid from './Grid'
import Propagator from './Propagator'
import Anchor from './Anchor'
import { propagatorsWithLocation } from './util'
import { clearSelection } from 'actions/elements'

const _handleClick = dispatch => (event) => {
    // only fire for clicks originating on the diagram
    if (event.target.nodeName === 'svg') {
        dispatch(clearSelection())
    }
}

const Diagram = ({info, elements, dispatch, style}) => {
    // figure out if we need to style to fit the grid or not
    const elementStyle = info.showGrid ? styles.containerWithGrid : styles.containerWithoutGrid

    // figure the concrete locations for each propgators (dereference the anchors)
    const propagators = propagatorsWithLocation(elements)

    // render the various components of the diagram
    return (
        <svg style={{...elementStyle, ...style}} onMouseDown={_handleClick(dispatch)}>
            {info.showGrid && info.gridSize > 0 && <Grid/>}
            {propagators.map((element, i) => <Propagator {...element} key={i}/>)}
            {info.showAnchors && Object.values(elements.anchors).map(anchor => <Anchor {...anchor} key={anchor.id} />)}
        </svg>
    )
}

const selector = ({ info, elements }) => ({info, elements})
export default connect(selector)(Diagram)

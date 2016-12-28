// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import Grid from './Grid'

const Diagram = ({info, style}) => {
    // figure out if we need to style to fit the grid or not
    const elementStyle = info.showGrid ? styles.containerWithGrid : styles.containerWithoutGrid

    return (
        <svg style={{...elementStyle, ...style}}>
            {info.showGrid && <Grid/>}
        </svg>
    )
}

const selector = ({ info }) => ({info})
export default connect(selector)(Diagram)

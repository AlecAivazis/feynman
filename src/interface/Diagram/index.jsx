// external imports
import React from 'react'
// local imports
import styles from './styles'
import Grid from './Grid'

const Diagram = ({style}) => (
    <svg style={{...styles.container, ...style}}>
        <Grid/>
    </svg>
)

export default Diagram

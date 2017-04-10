// external imports
import React from 'react'
// local imports
import styles from './styles'

const Row = ({style, ...unusedProps}) => (
    <div style={{...styles.container, ...style}} {...unusedProps}/>
)

export default Row

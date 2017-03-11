// external imports
import React from 'react'
// local imports
import styles from './styles'

const Code = ({style, ...unused}) => (
    <div {...unused} style={{...styles.container, ...style}}/>
)

export default Code

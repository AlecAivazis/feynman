// external imports
import React from 'react'
// local imports
import Row from '../Row'
import styles from './styles'

const ButtonRow = ({style, ...unusedProps}) => (
    <Row style={{...styles.container, ...style}} {...unusedProps}/>
)

export default ButtonRow

// external imports
import React from 'react'
// local imports
import styles from './styles'

const Alert = ({style, ...unused}) => (
    <div style={{...styles.container, ...style}} {...unused}/>
)

export default Alert

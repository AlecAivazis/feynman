// external imports
import React from 'react'
// local imports
import styles from './styles'

const Input = ({style, ...unusedProps}) => (
    <input style={{...styles.input, ...style}} {...unusedProps}/>
)

export default Input

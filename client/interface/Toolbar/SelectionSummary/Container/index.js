// external imports
import React from 'react'
// local imports
import styles from './styles'

const SelectionContainer = ({ style, ...unused }) => <div style={{ ...styles.container, ...style }} {...unused} />

export default SelectionContainer

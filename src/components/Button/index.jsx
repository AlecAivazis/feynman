// external imports
import React from 'react'
// local imports
import styles from './styles'

const Button = ({ style, children, ...unusedProps }) => (
    <button style={{...styles.container, ...style}} {...unusedProps} >
        {children}
    </button>
)

export default Button

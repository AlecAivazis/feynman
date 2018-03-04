// external imports
import React from 'react'
// local imports
import styles from './styles'

const Input = ({ style, onKeyDown, ...unusedProps }) => (
    <input
        style={{ ...styles.input, ...style }}
        onKeyDown={evt => {
            evt.stopPropagation()
        }}
        {...unusedProps}
    />
)

Input.defaultProps = {
    onKeyDown: () => {},
}

export default Input

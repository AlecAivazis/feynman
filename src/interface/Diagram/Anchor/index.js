// external imports
import React from 'react'
// local imports
import styles from './styles'

const Anchor = ({ x, y, style, ...unusedProps }) => (
    <circle
        {...{...styles.container, ...style}}
        {...unusedProps}
        cx={x}
        cy={y}
        r={5}
    />
)

export default Anchor

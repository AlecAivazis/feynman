// external imports
import React from 'react'
// local imports
import styles from './styles'

const Fermion = ({ x1, y1, x2, y2, style, info, ...unusedProps }) => (
    <path
        {...{...styles.container, ...style}}
        {...unusedProps}
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
    />
)

export default Fermion

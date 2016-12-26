// external imports
import React from 'react'
// local imports
import styles from './styles'

const Toolbar = ({style, ...unusedProps}) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
        this is the toolbar
    </div>
)

export default Toolbar

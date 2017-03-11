// external imports
import React from 'react'
// local imports
import styles from './styles'

const OverlayHeader = ({children, style, addon, hide, ...unusedProps}) => (
    <div {...unusedProps} style={{...styles.container, ...style}}>
        <div style={styles.close} onClick={hide}>
            x
        </div>
        <div style={styles.title}>
            {children}
        </div>
        <div style={styles.addon}>
            {addon}
        </div>
    </div>
)

export default OverlayHeader

import React from 'react'
// local imports
import { Collapsible } from 'components'
import styles from './styles'

const Hotkey = ({ style, action, trigger }) => (
    <div style={{...styles.container, ...style}}>
        <span style={styles.action}>{action}:</span>
        <span style={styles.trigger}>{trigger}</span>
    </div>
)

export default Hotkey

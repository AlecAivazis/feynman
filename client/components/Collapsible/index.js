// external imports
import React from 'react'
import { BooleanState } from 'quark-web'
// local imports
import styles from './styles'
import { Label } from 'components'

const Collapsible = ({ active, toggle, children, title, style, ...unusedProps }) => (
    <div style={{ ...styles.container, ...style }} {...unusedProps}>
        <div style={styles.header}>
            <div style={styles.title}>{title}</div>
            <div style={styles.toggle} onClick={toggle}>
                {active ? 'hide' : 'show'}
            </div>
        </div>
        {active && children}
    </div>
)

export default Collapsible

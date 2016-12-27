// external imports
import React from 'react'
import liftC, { toggleState } from 'react-liftc'
// local imports
import styles from './styles'
import { Label } from 'components'

const Collapsible = ({state:inactive, toggle, children, title, style, ...unusedProps}) => (
    <div style={{...styles.container, style}} {...unusedProps}>
        <div style={styles.header}>
            <div style={styles.title}>
                {title}
            </div>
            <div style={styles.toggle} onClick={toggle}>
                {!inactive ? 'hide' : 'show'}
            </div>
        </div>
        {!inactive && children}
    </div>
)

export default liftC(toggleState)(Collapsible)

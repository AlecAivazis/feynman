// external
import React from 'react'
// local imports
import { Label } from 'components'
import styles from './styles'

const Sidebar = ({style}) => (
    <aside style={{...styles.container, ...style}}>
        <Label>title</Label>
        <Label>grid</Label>
        <Label>history</Label>
        <Label>hostkeys</Label>
    </aside>
)

export default Sidebar

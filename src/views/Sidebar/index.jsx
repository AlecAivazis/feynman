// external
import React from 'react'
// local imports
import {Label} from 'components'
import styles from './styles'

const Diagram = ({style}) => (
    <aside style={{...styles.container, ...style}}>
        <Label>sidebar</Label>
    </aside>
)

export default Diagram

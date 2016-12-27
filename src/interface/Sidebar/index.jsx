// external
import React from 'react'
// local imports
import { setDiagramTitle } from 'actions/info'
import { Label, Input } from 'components'
import TitleControl from './TitleControl'
import GridSizeControl from './GridSizeControl'
import styles from './styles'


const Sidebar = ({style, dispatch, info}) => (
    <aside style={{...styles.container, ...style}}>
        <TitleControl />
        <GridSizeControl style={styles.element}/>
        <Label style={styles.element}>history</Label>
        <Label style={styles.element}>hostkeys</Label>
    </aside>
)

export default Sidebar

// external
import React from 'react'
// local imports
import { setDiagramTitle } from 'actions/info'
import { Label, Input } from 'components'
import styles from './styles'
import TitleControl from './TitleControl'
import GridSizeControl from './GridSizeControl'
import HotkeySummary from './HotkeySummary'


const Sidebar = ({style, dispatch, info}) => (
    <aside style={{...styles.container, ...style}}>
        <TitleControl style={styles.element} />
        <GridSizeControl style={styles.elementWithBorder}/>
        <Label style={styles.elementWithBorder}>history</Label>
        <HotkeySummary style={styles.elementWithBorder} />
    </aside>
)

export default Sidebar

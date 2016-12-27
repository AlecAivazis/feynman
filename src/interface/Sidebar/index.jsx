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
        <TitleControl />
        <GridSizeControl style={styles.element}/>
        <Label style={styles.element}>history</Label>
        <HotkeySummary />
    </aside>
)

export default Sidebar

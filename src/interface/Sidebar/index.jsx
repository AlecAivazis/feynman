// external
import React from 'react'
// local imports
import { setDiagramTitle } from 'actions/info'
import { Label, Input } from 'components'
import styles from './styles'
import TitleControl from './TitleControl'
import GridSizeControl from './GridSizeControl'
import HotkeySummary from './HotkeySummary'
import HistorySummary from './HistorySummary'
import ButtonGrid from './ButtonGrid'

const Sidebar = ({style, dispatch, info}) => (
    <aside style={{...styles.container, ...style}}>
        <TitleControl style={styles.element} />
        <GridSizeControl style={styles.element}/>
        <ButtonGrid style={styles.elementWithBorder} />
        <HistorySummary style={styles.elementWithBorder} />
        <HotkeySummary style={styles.element} />
    </aside>
)

export default Sidebar

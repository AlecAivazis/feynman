// external
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { setDiagramTitle } from 'actions/diagram'
import { Label, Input } from 'components'
import styles from './styles'

const Sidebar = ({style, dispatch, diagram}) => (
    <aside style={{...styles.container, ...style}}>
        <div style={styles.sidebarContainer}>
            <Label>title</Label>
            <Input
                value={diagram.title}
                onChange={({target}) => dispatch(setDiagramTitle(target.value))}
            />
        </div>
        <Label>grid</Label>
        <Label>history</Label>
        <Label>hostkeys</Label>
    </aside>
)

// the sidebar needs the diagram information
const selector = ({diagram}) => ({diagram})
// export the connected component
export default connect(selector)(Sidebar)

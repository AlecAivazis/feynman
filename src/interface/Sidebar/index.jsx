// external
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { setDiagramTitle } from 'actions/info'
import { Label, Input } from 'components'
import styles from './styles'

const Sidebar = ({style, dispatch, info}) => (
    <aside style={{...styles.container, ...style}}>
        <div style={styles.sidebarContainer}>
            <Label>title</Label>
            <Input
                value={info.title}
                onChange={({target}) => dispatch(setDiagramTitle(target.value))}
            />
        </div>
        <Label>grid</Label>
        <Label>history</Label>
        <Label>hostkeys</Label>
    </aside>
)

const selector = ({info}) => ({info})
// export the connected component
export default connect(selector)(Sidebar)

// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import { ToggleButton } from 'components'
import { toggleGrid, toggleAnchors } from 'actions/info'

const ButtonGrid = ({ style, info, dispatch, ...unusedProps }) => (
    <div style={{...styles.container, ...style}}>
        <ToggleButton
            active={info.showGrid}
            activeText="Hide Grid"
            inactiveText="Show Grid"
            onClick={() => dispatch(toggleGrid())}
        />
        <ToggleButton
            active={info.showAnchors}
            activeText="Hide Anchors"
            inactiveText="Show Anchors"
            onClick={() => dispatch(toggleAnchors())}
        />
    </div>
)

const selector = ({info}) => ({info})
export default connect(selector)(ButtonGrid)

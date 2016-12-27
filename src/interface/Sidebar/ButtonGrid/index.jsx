// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import { ToggleButton } from 'components'
import { toggleGrid } from 'actions/info'

const ButtonGrid = ({ style, info, dispatch, ...unusedProps }) => (
    <div style={{...styles.container, ...style}}>
        <ToggleButton
            active={info.showGrid}
            activeText="Hide Grid"
            inactiveText="Show Grid"
            onClick={() => dispatch(toggleGrid())}
        />
        <ToggleButton
            active={true}
            activeText="Hide Anchors"
            inactiveText="Show Anchors"
        />
    </div>
)

const selector = ({info}) => ({info})
export default connect(selector)(ButtonGrid)

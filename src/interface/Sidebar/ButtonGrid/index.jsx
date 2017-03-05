// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import { ToggleButton, Button } from 'components'
import { toggleGrid, toggleAnchors, toggleExportModal } from 'actions/info'

const ButtonGrid = ({ 
    style,
    info,
    toggleGrid,
    toggleAnchors,
    openExportModal,
    ...unusedProps 
}) => (
    <div style={{...styles.container, ...style}}>
        <div style={styles.buttonRow}>
            <ToggleButton
                style={styles.leftButton}
                active={info.showGrid}
                activeText="Hide Grid"
                inactiveText="Show Grid"
                onClick={toggleGrid}
            />
            <ToggleButton
                active={info.showAnchors}
                activeText="Hide Anchors"
                inactiveText="Show Anchors"
                onClick={toggleAnchors}
            />
        </div>
        <div style={styles.bottomRow}>
            <Button style={styles.leftButton}>
                Export PNG
            </Button>
            <Button onClick={openExportModal}>
                LaTeX
            </Button>
        </div>
    </div>
)

const selector = ({info}) => ({info})
const mapDispatchToProps = dispatch => ({
    openExportModal: () => dispatch(toggleExportModal()),
    toggleAnchors: () => dispatch(toggleAnchors()),
    toggleGrid: () => dispatch(toggleGrid()),
})
export default connect(selector, mapDispatchToProps)(ButtonGrid)

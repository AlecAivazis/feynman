// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import { ToggleButton, Button } from 'components'
import { toggleGrid, toggleAnchors, toggleExportModal } from 'actions/info'
import { exportDiagramImageEvent } from 'interface/Diagram'

// the function to call to export the diagram as an image
const exportDiagramAsImage = () => {
    window.dispatchEvent(new Event(exportDiagramImageEvent))
}

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
            <Button style={styles.leftButton} onClick={exportDiagramAsImage}>
                Export PNG
            </Button>
            <Button onClick={openExportModal}>
                LaTeX
            </Button>
        </div>
    </div>
)

const selector = ({diagram: {info}}) => ({info})
const mapDispatchToProps = dispatch => ({
    openExportModal: () => dispatch(toggleExportModal()),
    toggleAnchors: () => dispatch(toggleAnchors()),
    toggleGrid: () => dispatch(toggleGrid()),
})
export default connect(selector, mapDispatchToProps)(ButtonGrid)

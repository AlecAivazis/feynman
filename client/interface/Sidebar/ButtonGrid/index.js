// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import { ToggleButton, Button } from 'components'
import { toggleGrid, toggleAnchors, toggleExportModal } from 'actions/info'
import { exportDiagramImageEvent } from 'interface/Diagram'
import { latexConfig } from 'utils'


const exportUrl = elements => `/diagram?string=${latexConfig(elements)}`

const ButtonGrid = ({
    style,
    info,
    toggleGrid,
    toggleAnchors,
    openExportModal,
    elements,
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
            <a href={exportUrl(elements)} target="_blank">
                <Button style={styles.leftButton}>
                    Export PNG
                </Button>
            </a>
            <Button onClick={openExportModal}>
                LaTeX
            </Button>
        </div>
    </div>
)

const selector = ({diagram: {info, elements}}) => ({info, elements})
const mapDispatchToProps = dispatch => ({
    openExportModal: () => dispatch(toggleExportModal()),
    toggleAnchors: () => dispatch(toggleAnchors()),
    toggleGrid: () => dispatch(toggleGrid()),
})
export default connect(selector, mapDispatchToProps)(ButtonGrid)

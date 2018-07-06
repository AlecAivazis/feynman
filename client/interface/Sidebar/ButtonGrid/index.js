// external imports
import React from 'react'
import { connect } from 'react-redux'
import { FilePicker } from 'quark-web'
// local imports
import styles from './styles'
import { ToggleButton, Button } from 'components'
import { toggleGrid, toggleAnchors, toggleExportModal } from 'actions/info'
import { saveDiagram as save, loadDiagram as load } from 'actions/elements'
import { commit as commitWithMsg } from 'actions/history'
import { latexConfig } from 'utils'

const pngURL = elements => `/latex/diagram?string=${latexConfig(elements)}`
const pdfURL = elements => `/latex/pdf?string=${latexConfig(elements)}`

const ButtonGrid = ({
    style,
    info,
    toggleGrid,
    commit,
    saveDiagram,
    loadDiagram,
    toggleAnchors,
    openExportModal,
    elements,
    ...unusedProps
}) => (
    <div style={{ ...styles.container, ...style }}>
        <div style={{ ...styles.buttonRow, justifyContent: 'center' }}>
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
                style={styles.centerButton}
            />
        </div>
        <div style={styles.buttonRow}>
            <a href={pngURL(elements)} target="_blank" download={`${info.title || 'feynman'}.png`}>
                <Button style={styles.leftButton}>Export PNG</Button>
            </a>
            <a href={pdfURL(elements)} target="_blank" download={`${info.title || 'feynman'}.pdf`}>
                <Button style={styles.leftButton}>PDF</Button>
            </a>
            <Button onClick={openExportModal}>LaTeX</Button>
        </div>
        <div style={styles.buttonRow}>
            <Button style={styles.leftButton} onClick={saveDiagram}>
                Save Diagram
            </Button>
            <FilePicker
                extensions={['json']}
                onError={console.log}
                onChange={files => {
                    // the file we are going to treat as the persisted diagram
                    const file = files[0]

                    // create a new file reader
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        // the result should be a valid json object
                        const diagram = JSON.parse(reader.result)

                        loadDiagram(diagram)

                        commit(`loaded diagram: ${diagram.title}`)
                    }

                    // start reading the file
                    reader.readAsText(file)
                }}
            >
                <Button style={styles.leftButton}>Load Diagram</Button>
            </FilePicker>
        </div>
    </div>
)

const selector = ({ diagram: { info, elements } }) => ({ info, elements })
const mapDispatchToProps = dispatch => ({
    openExportModal: () => dispatch(toggleExportModal()),
    toggleAnchors: () => dispatch(toggleAnchors()),
    toggleGrid: () => dispatch(toggleGrid()),
    saveDiagram: () => dispatch(save()),
    loadDiagram: payload => dispatch(load(payload)),
    commit: msg => dispatch(commitWithMsg(msg)),
})
export default connect(
    selector,
    mapDispatchToProps
)(ButtonGrid)

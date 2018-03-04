// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { elementsWithLocations, diagramBoundingBox, propagatorConfig, shapeConfig, textConfig } from 'utils'
import { Overlay, Code, Button } from 'components'
import { toggleExportModal } from 'actions/info'
import styles from './styles'

// the link for the corresponding latex package
const latexPackageLocation = 'https://storage.googleapis.com/aivazis-static-assets/feynman/feynman.sty'

const ExportModal = ({ elements, hideModal }) => {
    const bb = diagramBoundingBox(elements)
    return (
        <Overlay title="Export to LaTeX" hide={hideModal} style={styles.container}>
            Add this to your preamble
            <Code>\usepackage{'{feynman}'}</Code>
            Here's your diagram:
            <Code>
                \begin{'{feynman}'} <br />
                {elementsWithLocations(elements).propagators.map((propagator, i) => (
                    <div key={i}>&nbsp;&nbsp;&nbsp;&nbsp;{propagatorConfig(propagator, bb)}</div>
                ))}
                {Object.values(elements.shapes).map((shape, i) => (
                    <div key={i}>&nbsp;&nbsp;&nbsp;&nbsp;{shapeConfig(shape, bb)}</div>
                ))}
                {Object.values(elements.text).map((text, i) => (
                    <div key={i}>&nbsp;&nbsp;&nbsp;&nbsp;{textConfig(text, bb)}</div>
                ))}
                \end{'{feynman}'}
                <br />
            </Code>
            <div style={styles.buttonRow}>
                <Button onClick={hideModal} style={styles.closeButton}>
                    Close
                </Button>
                <a href={latexPackageLocation}>
                    <Button>Download LaTeX package</Button>
                </a>
            </div>
        </Overlay>
    )
}

const mapDispatchToProps = dispatch => ({
    hideModal: () => dispatch(toggleExportModal()),
})
const selector = ({ diagram: { elements } }) => ({ elements })
export default connect(selector, mapDispatchToProps)(ExportModal)

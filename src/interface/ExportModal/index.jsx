// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { propagatorsWithLocation } from 'utils'
import { Overlay, Code, Button } from 'components'
import { toggleExportModal } from 'actions/info'
import styles from './styles'
import LatexPropagator from './Propagator'

const ExportModal = ({elements, hideModal}) => (
    <Overlay title="Export to LaTeX" hide={hideModal}  style={styles.container}>
        Add this to your preamble
        <Code>
            \usepackage{'{feynman}'}
        </Code>
        Here's your diagram:
        <Code>
            \begin{'{feynman}'} <br/>
            {propagatorsWithLocation(elements).map(propagator => (
                <LatexPropagator 
                    {...propagator} 
                    key={propagator.id}
                />
            ))}
            \end{'{feynman}'}<br/>
        </Code>
        <div style={styles.buttonRow}>
            <Button onClick={hideModal} style={styles.closeButton}>
                Close
            </Button>
            <Button>
                Download LaTeX package
            </Button>
        </div>
    </Overlay>
)


const mapDispatchToProps = dispatch => ({
    hideModal: () => dispatch(toggleExportModal())
})
const selector = ({elements}) => ({elements})
export default connect(selector, mapDispatchToProps)(ExportModal)

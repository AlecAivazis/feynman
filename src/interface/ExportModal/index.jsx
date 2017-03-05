// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { Overlay, Code } from 'components'
import { toggleExportModal } from 'actions/info'
import styles from './styles'

const ExportModal = ({elements, hideModal}) => (
    <Overlay title="Export to LaTeX" hide={hideModal}  style={styles.container}>
        Add this to your preamble
        <Code>
            \usepackage{'{feynman}'}
        </Code>
        Here's your diagram:
        <Code>
            \begin{'{feynman}'} <br/>
            {elements.propagators && Object.values(elements.propagators).map(propagator => (
                <div key={propagator.id}>
                    &nbsp;v&nbsp;&nbsp;&nbsp;\{propagator.type}[hello]
                </div>
            ))}
            \end{'{feynman}'}<br/>
        </Code>

    </Overlay>
)

const mapDispatchToProps = dispatch => ({
    hideModal: () => dispatch(toggleExportModal())
})
const selector = ({elements}) => ({elements})
export default connect(selector, mapDispatchToProps)(ExportModal)

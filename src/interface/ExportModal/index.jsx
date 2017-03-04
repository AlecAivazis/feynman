// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { Overlay } from 'components'
import { toggleExportModal } from 'actions/info'
import styles from './styles'

const ExportModal = ({hideModal}) => (
    <Overlay title="Export to LaTeX" hide={hideModal}  style={styles.container}>
        hello
    </Overlay>
)

const mapDispatchToProps = dispatch => ({
    hideModal: () => dispatch(toggleExportModal())
})

export default connect(null, mapDispatchToProps)(ExportModal)

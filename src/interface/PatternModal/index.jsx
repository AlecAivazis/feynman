// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { Overlay } from 'components'
import { togglePatternModal } from 'actions/info'

const PatternModal = ({hideOverlay}) => (
    <Overlay
        title="Select starting template..."
        hide={hideOverlay}
        addon="addon"
    >
        hello
    </Overlay>
)

const mapDispatchToProps = dispatch => ({
    hideOverlay: () => dispatch(togglePatternModal())
})
export default connect(null, mapDispatchToProps)(PatternModal)

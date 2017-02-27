// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import Choice from './Choice'
import patterns from './patterns'
import styles from './styles'
import { Overlay } from 'components'
import { togglePatternModal } from 'actions/info'

const PatternModal = ({hideOverlay}) => (
    <Overlay
        title="Select starting template..."
        hide={hideOverlay}
        style={styles.overlay}
        contentStyle={styles.overlayContent}
    >
        {patterns.map((pattern, i) => <Choice {...pattern} hideOverlay={hideOverlay} key={i}/>)}
    </Overlay>
)

const mapDispatchToProps = dispatch => ({
    hideOverlay: () => dispatch(togglePatternModal())
})
export default connect(null, mapDispatchToProps)(PatternModal)

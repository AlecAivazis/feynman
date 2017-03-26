// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import Choice from './Choice'
import patterns from './patterns'
import styles from './styles'
import { Overlay, Checkbox } from 'components'
import { togglePatternModal, togglePatternModalInitialVis } from 'actions/info'

const Addon = ({toggleInitialState, checked}) => (
    <div onClick={toggleInitialState} style={styles.addon}>
        show at startup
        <Checkbox checked={checked} style={styles.checkbox}/>
    </div>
)

const PatternModal = ({info, hideOverlay, toggleInitialState}) => (
    <Overlay
        title="Select starting template..."
        hide={hideOverlay}
        style={styles.overlayContent}
        addon={
            <Addon
                checked={info.patternModalInitalVis}
                toggleInitialState={toggleInitialState}
            />
        }
    >
        {patterns.map((pattern, i) => <Choice {...pattern} hideOverlay={hideOverlay} key={i}/>)}
    </Overlay>
)

const selector = ({diagram: {info}}) => ({info})
const mapDispatchToProps = dispatch => ({
    hideOverlay: () => dispatch(togglePatternModal()),
    toggleInitialState: () => dispatch(
        togglePatternModalInitialVis(window.localStorage)
    ),
})
export default connect(selector, mapDispatchToProps)(PatternModal)

// external imports
import React from 'react'
import { BooleanState } from 'quark-web'
import { connect } from 'react-redux'
// local imports
import { loadPattern } from 'actions/elements'
import { commit } from 'actions/history'
import styles from './styles'

const PatternChoice = ({ load, hideOverlay, name, elements, commitWithMsg, preview: Preview }) => (
    <BooleanState>
        {({ state, toggle }) => (
            <div
                style={state ? styles.hoverContainer : styles.container}
                onMouseOver={toggle}
                onMouseOut={toggle}
                onClick={() => {
                    // load the associated pattern
                    load({ name, elements })
                    // commit the state after loading the pattern
                    commitWithMsg(`rendered canvas with ${name} pattern`)
                    // hide the overlay
                    hideOverlay()
                }}
            >
                <div style={styles.title}>{name}</div>
                <Preview style={styles.preview} />
            </div>
        )}
    </BooleanState>
)

const mapDispatchToProps = dispatch => ({
    load: pattern => dispatch(loadPattern(pattern)),
    commitWithMsg: msg => dispatch(commit(msg)),
})

export default connect(
    null,
    mapDispatchToProps
)(PatternChoice)

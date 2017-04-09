// external imports
import React from 'react'
import liftC, { toggleState } from 'react-liftc'
import { connect } from 'react-redux'
// local imports
import { loadPattern } from 'actions/elements'
import { commit } from 'actions/history'
import styles from './styles'

const PatternChoice = ({load, hideOverlay, name, state, toggle, elements, commitWithMsg, image}) => (
    <div
        style={state ? styles.hoverContainer : styles.container}
        onMouseOver={toggle}
        onMouseOut={toggle}
        onClick={() => {
            // load the associated pattern
            load({name, elements})
            // commit the state after loading the pattern
            commitWithMsg(`rendered canvas with ${name} pattern`)
            // hide the overlay
            hideOverlay()
        }}
    >
        <div style={styles.title}>
            {name}
        </div>
        <img src={image} style={styles.image}/>
    </div>
)

// wrap the choice in a state
const withState = liftC(toggleState)(PatternChoice)

const mapDispatchToProps = dispatch => ({
    load: pattern => dispatch(loadPattern(pattern)),
    commitWithMsg: msg => dispatch(commit(msg)),
})

export default connect(null, mapDispatchToProps)(withState)

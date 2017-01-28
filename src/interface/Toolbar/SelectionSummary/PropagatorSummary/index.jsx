// external imports
import React from 'react'
// local imports
import Header from '../Header'
import styles from './styles'

const PropagatorSummary = ({propagators}) => {
    // figure out if the entity needs to be pluralized
    const propagator = propagators.length > 1 ? 'propagators' : 'propagator'

    // render the component
    return (
        <div>
            <Header>
                {`${propagators.length} ${propagator} selected`}
            </Header>
        </div>
    )
}

export default PropagatorSummary

// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { propagatorConfig } from 'utils'

const LatexPropagator = propagator => (
    <div>
        &nbsp;&nbsp;&nbsp;&nbsp;{propagatorConfig(propagator)}
    </div>
)

export default LatexPropagator

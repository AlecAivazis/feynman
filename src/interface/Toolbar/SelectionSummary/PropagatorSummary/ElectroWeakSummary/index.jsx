// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { Button } from 'components'
import { ButtonRow } from '../..'

const PropagatorSummary = ({direction=1, setAttrs, ...unusedProps}) => (
    <ButtonRow>
        <Button style={{width: '100%'}} onClick={() => setAttrs({direction: -direction})}>
            Invert Amplitude
        </Button>
    </ButtonRow>
)

export default PropagatorSummary

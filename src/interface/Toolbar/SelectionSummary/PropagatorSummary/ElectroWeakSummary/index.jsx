// external imports
import React from 'react'
// local imports
import { Button } from 'components'
import { ButtonRow } from '../..'
import ElectroWeak from 'interface/Diagram/Propagator/ElectroWeak'

const defaults = ElectroWeak.defaultProps

const PropagatorSummary = ({direction=defaults.direction, setAttrs, ...unusedProps}) => (
    <ButtonRow>
        <Button style={{width: '100%'}} onClick={() => setAttrs({direction: -direction})}>
            Invert Amplitude
        </Button>
    </ButtonRow>
)

export default PropagatorSummary

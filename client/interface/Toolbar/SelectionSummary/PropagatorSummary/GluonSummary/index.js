// external imports
import React from 'react'
// local imports
import { Button, ToggleButton } from 'components'
import { ButtonRow, MultiRow } from '../..'
import styles from './styles'
import Gluon from 'interface/Diagram/Propagator/Gluon'

const defaults = Gluon.defaultProps

const GluonSummary = ({
    setAttrs,
    commit,
    endcaps = defaults.endcaps,
    direction = defaults.direction,
    ...unusedProps
}) => (
    <MultiRow>
        <ButtonRow>
            <Button
                style={styles.button}
                onClick={() => setAttrs({ direction: -direction }, 'inverted loop direction')}
            >
                Invert Loop Direction
            </Button>
        </ButtonRow>
        <ButtonRow>
            <ToggleButton
                style={styles.button}
                onClick={() => setAttrs({ endcaps: !endcaps }, `made gluon endcaps ${endcaps ? 'visible' : 'hidden'}`)}
                active={endcaps}
                activeText="Hide End Caps"
                inactiveText="Draw End Caps"
            />
        </ButtonRow>
    </MultiRow>
)

export default GluonSummary

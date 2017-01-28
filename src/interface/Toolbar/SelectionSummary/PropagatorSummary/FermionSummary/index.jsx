// external imports
import React from 'react'
// local imports
import styles from './styles'
import { ButtonRow } from '../..'
import { Button, ToggleButton } from 'components'
import Fermion from 'interface/Diagram/Propagator/Fermion'

const FermionSummary = ({setAttrs, arrow=Fermion.defaultProps.arrow, style, anchor1, anchor2, ...unusedProps}) => (
    arrow !== 0 ? (
        <ButtonRow style={{...styles.container, ...style}} {...unusedProps}>
            <Button style={styles.hideButton} onClick={() => setAttrs({arrow: 0})}>
                Hide Arrow
            </Button>
            <Button style={styles.flipButton} onClick={() => setAttrs({arrow: 0-arrow})}>
                Flip
            </Button>
        </ButtonRow>
    ):(
        <ButtonRow style={style} {...unusedProps}>
            <Button onClick={() => setAttrs({arrow: 1})} style={styles.showButton}>
                Show Arrow
            </Button>
        </ButtonRow>
    )
)

export default FermionSummary

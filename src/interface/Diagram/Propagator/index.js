// external imports
import React from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
// local imports
import styles from './styles'
import Fermion from './Fermion'
import ElectroWeak from './ElectroWeak'
import { EventListener, Splittable } from 'components'

const Propagator = ({
    strokeWidth=2, stroke="black", selected=false,
    type, ...element
}) => {
    // a mapping of element type to component
    const Component = {
        fermion: Fermion,
        em: ElectroWeak,
    }[type]

    if (typeof Component === 'undefined') {
        return null
    }

    // use the selected styling when appropriate
    const styling = selected ? styles.selected : {}

    return (
        <Splittable
            element="propagators"
            id={element.id}
        >
            <Component
                strokeWidth={strokeWidth}
                stroke={stroke}
                selected={selected}
                {...element}
                {...styling}
                selected={selected}
            />
        </Splittable>
    )
}

export default Propagator

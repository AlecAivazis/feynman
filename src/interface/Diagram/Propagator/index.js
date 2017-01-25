// external imports
import React from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
// local imports
import styles from './styles'
import Fermion from './Fermion'
import ElectroWeak from './ElectroWeak'
import { EventListener, Splittable } from 'components'
import { fixPositionToGrid } from 'utils'

export function splitPropagator({id, elements}) {
    return id
}

const Propagator = ({type, selected, id, info, ...element}) => {
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
            type="propagators"
            id={id}
            split={splitPropagator}
            onMoveStart={() => {
                // compute the fixed locations of each anchor
                const anchor1 = fixPositionToGrid(element.anchor1, info.gridSize)
                console.log(anchor1)
            }}
        >
            <Component
                selected={selected}
                {...element}
                {...styling}
                selected={selected}
            />
        </Splittable>
    )
}


const selector = ({info}) => ({info})

Propagator.defaultProps = {
    strokeWidth: 2,
    stroke: "black",
    selected: false
}

export default connect(selector)(Propagator)

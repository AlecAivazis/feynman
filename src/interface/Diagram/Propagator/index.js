// external imports
import React from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
// local imports
import styles from './styles'
import Fermion from './Fermion'
import ElectroWeak from './ElectroWeak'
import { EventListener, Splittable } from 'components'

export function splitPropagator(id, store) {

}

export default function Propagator ({type, selected, ...element}) {
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
            element={element}
            location={({anchor1}, {anchors}) => {
                // grab the x and y coordinates
                const { x, y } = anchors[anchor1]

                return {x, y}
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

Propagator.defaultProps = {
    strokeWidth: 2,
    stroke: "black",
    selected: false
}

// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import Fermion from './Fermion'
import ElectroWeak from './ElectroWeak'
import { EventListener, Splittable } from 'components'
import { fixPositionToGrid } from 'utils'
import { setElementAttrs } from 'actions/elements'

const Propagator = ({type, selected, id, info, elements, dispatch, ...element}) => {
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
            split={split}
            snap={snap({
                dispatch,
                ...element,
                elements,
                info
            })}
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

export function split({id, elements}) {
    return id
}

const snap = ({ dispatch, anchor1, anchor2, elements, info:{gridSize}}) => () => {
    // compute the new location for anchor1
    const anchor1Loc = fixPositionToGrid(elements.anchors[anchor1], gridSize)
    const anchor2Loc = fixPositionToGrid(elements.anchors[anchor2], gridSize)

    // update the new location for the anchors
    dispatch(setElementAttrs(
        {
            type: 'anchors',
            id: anchor1,
            ...anchor1Loc,
        },
        {
            type: 'anchors',
            id: anchor2,
            ...anchor2Loc,
        }
    ))

}

const selector = ({elements, info}) => ({elements, info})
export default connect(selector)(Propagator)

// external imports
import React from 'react'
// local imports
import styles from './styles'
import Fermion from './Fermion'
import ElectroWeak from './ElectroWeak'
import Gluon from './Gluon'
import Dashed from './Dashed'
import { Splittable } from 'components'
import Label from './Label'

export const Propagator = ({
    kind,
    selected,
    id,
    labelDistance,
    labelLocation,
    label,
    ...element
}) => {
    // a mapping of element kind to component
    const Component = {
        fermion: Fermion,
        em: ElectroWeak,
        dashed: Dashed,
        gluon: Gluon,
    }[kind]

    if (typeof Component === 'undefined') {
        return null
    }

    // use the selected styling when appropriate
    const styling = selected ? styles.selected : {}

    // compute the distance for the label
    const dx = element.x1 - element.x2
    const dy = element.y1 - element.y2
    const distance = Math.sqrt((dx*dx) + (dy*dy))
    // if the distance is too small to show anything meaninful
    if (distance < 5) {
        // don't render anything
        return null
    }

    return (
        <g>
            {label && (
                <Label
                    location={labelLocation}
                    distance={labelDistance}
                    element={{...element, id}}
                >
                    {label}
                </Label>
            )}
            <Splittable element={{...element, id}} type="propagators">
                <Component
                    selected={selected}
                    {...element}
                    {...styling}
                    selected={selected}
                />
            </Splittable>
        </g>
    )
}

export const defaultProps = {
    strokeWidth: 2,
    stroke: "black",
    selected: false,
    labelDistance: 30,
    labelLocation: 0.5,
    label: "",
}

Propagator.defaultProps = defaultProps

export default Propagator

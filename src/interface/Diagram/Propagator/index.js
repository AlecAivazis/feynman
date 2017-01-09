// external imports
import React from 'react'
// local imports
import Fermion from './Fermion'
import ElectroWeak from './ElectroWeak'

const Propagator = ({type, ...element}) => {
    // a mapping of element type to component
    const Component = {
        fermion: Fermion,
        em: ElectroWeak,
    }[type]

    if (typeof Component === 'undefined') {
        return null
    }

    // return the appropriate component
    return (
        <g>
            <Component {...element} />
        </g>
    )
}

Propagator.defaultProps = {
    strokeWidth: 2,
    stroke: 'black',
}

export default Propagator

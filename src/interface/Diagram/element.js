// external imports
import React from 'react'
// local imports
import Fermion from './Fermion'
import ElectroWeak from './ElectroWeak'

const DiagramElement = ({type, ...element}) => {
    // a mapping of element type to component
    const Component = {
        fermion: Fermion,
        em: ElectroWeak,
    }[type]

    if (typeof Component === 'undefined') {
        return null
    }

    // return the appropriate component
    return <Component {...element} />
}

export default DiagramElement

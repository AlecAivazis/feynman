// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { selectElements } from 'actions/elements'
import styles from './styles'
import Fermion from './Fermion'
import ElectroWeak from './ElectroWeak'

export const Propagator = ({type, selected, ...element}) => {
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

    // return the appropriate component
    return Component && (
        <g>
            <Component {...element} {...styling}/>
        </g>
    )
}

Propagator.defaultProps = {
    strokeWidth: 2,
    stroke: 'black',
    selected: false,
}

const mapDispatchToProps = (dispatch, props) => ({
    selectPropagator: () => dispatch(selectElements({type: 'propagators', id: props.id}))
})

export default connect(null, mapDispatchToProps)(Propagator)

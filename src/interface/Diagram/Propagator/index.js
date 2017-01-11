// external imports
import React from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
// local imports
import { selectElements } from 'actions/elements'
import styles from './styles'
import Fermion from './Fermion'
import ElectroWeak from './ElectroWeak'

export class Propagator extends React.Component {

    state = {
        point: null
    }

    static defaultProps = {
        strokeWidth: 2,
        stroke: 'black',
        selected: false,
    }

    render() {
        // grab used props
        const {
            type,
            selected,
            selectPropagator,
            set,
            state,
            ...element
        } = this.props

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
            <g onMouseDown={this._mouseDown}>
                <Component {...element} {...styling} selected={selected}/>
            </g>
        )
    }

    @autobind
    _mouseDown(event) {
        // select the propagator
        this.props.selectPropagator()
    }
}

const mapDispatchToProps = (dispatch, props) => ({
    selectPropagator: () => dispatch(selectElements({type: 'propagators', id: props.id})),
    moveSelectedElements: move => dispatch(moveSelectedElements(move)),
})

const selector = ({elements}) => ({elements})

export default connect(selector, mapDispatchToProps)(Propagator)

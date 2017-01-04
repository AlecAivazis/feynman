// external imports
import React from 'react'
import { DragSource } from 'react-dnd'
import { connect } from 'react-redux'
import _ from 'lodash'
// local imports
import { relativePosition, fixPositionToGrid } from 'utils'
import { sidebarWidth } from 'interface/Sidebar/styles'
import { setAnchorLocations, selectElements } from 'actions/elements'
import styles from './styles'
import { anchorDragType } from '../constants'

class Anchor extends React.Component {

    state = {
        mouseDown: false,
    }

    constructor(...args) {
        super(...args)

        // function binds
        this._mouseDown = this._mouseDown.bind(this)
        this._mouseMove = _.throttle(this._mouseMove.bind(this), 20)
        this._mouseUp = this._mouseUp.bind(this)
    }

    componentWillMount() {
        // attach a listener to mouse movements
        this.moveListener = window.addEventListener('mousemove', this._mouseMove)
        this.upListener = window.addEventListener('mouseup', this._mouseUp)
    }

    componentWillUnmount() {
        // remove the listener
        window.removeEventListener(this.moveListener)
        window.removeEventListener(this.upListener)
    }

    _mouseDown(event){
        // don't bubble
        event.stopPropagation()
        // track the state of the mouse
        this.setState({
            mouseDown: true
        })

        // select the component
        this.props.selectAnchor()
    }

    _mouseMove(event) {
        // don't bubble
        event.stopPropagation()
        // if the mouse is down
        if (this.state.mouseDown) {
            // get the relative position of the mouse
            const pos = relativePosition({
                x: event.clientX,
                y: event.clientY
            })

            // update the anchor
            this.props.setAnchorLocations({
                id: this.props.id,
                ...pos,
            })
        }
    }

    _mouseUp(event){
        // don't bubble
        event.stopPropagation()
        // track the state of the mouse
        this.setState({
            mouseDown: false
        })
    }

    render() {
        const { x, y, style, dispatch, selected }  = this.props

        // get any required styling
        const styling = selected ? styles.selected : styles.notSelected

        return (
            <circle
                {...{...styling, ...style}}
                onMouseDown={this._mouseDown}
                cx={x}
                cy={y}
                r={5}
            />
        )
    }
}

// the anchor will need
const mapDispatchToProps = (dispatch, props) => ({
    // to set its own location
    setAnchorLocations: loc => dispatch(setAnchorLocations(loc)),
    selectAnchor: () => dispatch(selectElements({type: 'anchors', id: props.id}))
})
// the anchor needs to know the grid size
const mapStateToProps = ({info}) => ({info})

export default connect(mapStateToProps, mapDispatchToProps)(Anchor)

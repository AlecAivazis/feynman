// external imports
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
// local imports
import { relativePosition, fixPositionToGrid, generateAnchorId } from 'utils'
import { sidebarWidth } from 'interface/Sidebar/styles'
import {
    setElementAttrs,
    selectElements,
    addAnchors,
    addPropagators,
    mergeElements,
    clearSelection,
} from 'actions/elements'
import styles from './styles'


export class Anchor extends React.Component {

    static defaultProps = {
        r: 5,
        fill: 'black',
        fixed: false,
    }

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
        window.removeEventListener('mousemove', this.moveListener)
        window.removeEventListener('mouseup', this.upListener)
    }

    _mouseDown(event){
        // don't bubble
        event.stopPropagation()

        // grab used props
        let { id, selectAnchor, info, elements, addAnchor, addPropagator } = this.props

        // if the drag started with the alt key
        if (event.altKey) {
            // we are going to create a new anchor

            // first, we need an id for the anchor
            // note: this will also make sure we are dragging the right one
            id = generateAnchorId(elements.anchors)

            // figure out the current location for the anchor
            const pos = fixPositionToGrid(relativePosition({
                x: event.clientX,
                y: event.clientY
            }), info.gridSize)

            // create the new anchor
            addAnchor({
                id,
                ...pos,
            })

            // create a propagator linking the two anchors
            addPropagator({
                type: 'fermion',
                anchor1: this.props.id,
                anchor2: id,
            })
        }

        this.setState({
            // track the state of the mouse
            mouseDown: true,
            // make sure we are dragging the right element
            moveTarget: id
        })

        // select the appropriate component
        selectAnchor(id)
    }

    _mouseMove(event) {
        // don't bubble
        event.stopPropagation()
        // if the mouse is down
        if (this.state.mouseDown && !this.props.fixed) {
            // get the used props
            const { info, x, y } = this.props

            // get the relative position of the mouse
            const pos = fixPositionToGrid(relativePosition({
                x: event.clientX,
                y: event.clientY
            }), info.gridSize)

            // if its different than our current location
            if (pos.x != x || pos.y != y) {
                // update the anchor's location
                this.props.setAnchorLocations({
                    id: this.state.moveTarget,
                    ...pos,
                })
            }
        }
    }

    _mouseUp(event){
        // don't bubble
        event.stopPropagation()
        // if we were tracking the state of the mouse
        if (this.state.mouseDown) {
            // save the id of the element we are moving
            const { moveTarget } = this.state

            // track the state of the mouse
            this.setState({
                // clear the drag target
                moveTarget: null,
                // we are no longer holding the mouse down
                mouseDown: false
            })

            // tell the store to clean up any overlapping elements (and select the resulting element)
            this.props.mergeElements(moveTarget, true)
        }
    }

    render() {
        const {
            x,
            y,
            dispatch,
            selected,
            r,
            fill,
            fixed,
        }  = this.props

        // get any required styling
        let styling = selected ? styles.selected : styles.notSelected
        // if the anchor is fixed, mixin the fixed with
        styling = fixed ? {...styles.fixed, ...styling} : styling

        return (
            <circle
                onMouseDown={this._mouseDown}
                cx={x}
                cy={y}
                r={r}
                fill={fill}
                {...styling}
            />
        )
    }
}

// the anchor will need
const mapDispatchToProps = (dispatch, props) => ({
    // to set its own location
    setAnchorLocations: ({id, x, y}) => dispatch(setElementAttrs({type: 'anchors', id, x, y})),
    // select a given anchor
    selectAnchor: (id=props.id) => dispatch(selectElements({type: 'anchors', id})),
    // add new anchors to the diagram
    addAnchor: anchor => dispatch(addAnchors(anchor)),
    // add new propagators to the diagram
    addPropagator: propagator => dispatch(addPropagators(propagator)),
    // tell the store to merge overlapping elements
    mergeElements: (id, select) => dispatch(mergeElements(id, select)),
})
// the anchor needs access to the diagram info and elements reducers
const mapStateToProps = ({info, elements}) => ({info, elements})

export default connect(mapStateToProps, mapDispatchToProps)(Anchor)

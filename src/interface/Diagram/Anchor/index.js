// external imports
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
// local imports
import { relativePosition, fixPositionToGrid, generateElementId } from 'utils'
import { sidebarWidth } from 'interface/Sidebar/styles'
import {
    moveSelectedElements,
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

        // save a reference to the list of selected anchors
        const selectedAnchors = elements.selection.anchors

        // if the drag started with the alt key
        if (event.altKey) {
            // we are going to create a new anchor

            // first, we need an id for the anchor
            // note: this will also make sure we are dragging the right one
            id = generateElementId(elements.anchors)

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
                id: generateElementId(elements.propagators),
                anchor1: this.props.id,
                anchor2: id,
            })

            // select the anchor
            selectAnchor(id)
        }

        // if this element is already part of the selection
        else if (selectedAnchors && selectedAnchors.indexOf(id) > -1 ) {
           // there's nothing new to do (the drag will move the group)
        }

        // otherwise we are moving a non-selected anchor
        else {
            // select the anchor
            selectAnchor(id)
        }

        // regardless of what action we are taking on this drag, we have to
        this.setState({
            // track the state of the mouse
            mouseDown: true,
            moveTarget: id,
        })
    }

    _mouseMove(event) {
        // don't bubble
        event.stopPropagation()
        // if the mouse is down
        if (this.state.mouseDown) {
            // the location of the mouse in the diagram's coordinate space
            const mouse = fixPositionToGrid(relativePosition({
                x: event.clientX,
                y: event.clientY,
            }), this.props.info.gridSize)

            // save a reference to the anchor we are moving
            const anchor = this.props.elements.anchors[this.state.moveTarget]

            // if the mouse is at a different spot than the anchor (when rounded)
            if (mouse.x !== anchor.x || mouse.y !== anchor.y) {
                // compute the delta
                const delta = {
                    x: mouse.x - anchor.x,
                    y: mouse.y - anchor.y,
                }

                // move all of the selected anchors by the same amount we've moved the mouse
                this.props.moveSelectedAnchors(delta)
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
    // to move itself and other anchors
    moveSelectedAnchors: move => dispatch(moveSelectedElements(move)),
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

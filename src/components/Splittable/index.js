// external imports
import React from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
// local imports
import { relativePosition, fixPositionToGrid, generateElementId } from 'utils'
import { selectElements, mergeElements, moveSelectedElements } from 'actions/elements'
import { throttle, round } from 'utils'
import { EventListener } from 'components'

class Splittable extends React.Component {

    static propsTypes = {
        element: React.PropTypes.string.isRequired,
        split: React.PropTypes.func.isRequired,
        type: React.PropTypes.string.isRequired
    }

    static defaultProps = {
        split: id => id, // default, don't split anything
        snap: () => {}
    }

    state = {
        origin: null,
        moveTarget: null,
        distanceToMove: null
    }

    @autobind
    _mouseDown(event) {
        // stop the event from bubbling up
        event.stopPropagation()

        // grab the used props
        let {
            elements,
            type,
            split,
            id,
            selectElement,
            info,
            location,
            snap,
        } = this.props

        // save a reference to the selected elements
        const selected = elements.selection[type]

        const origin = {
            x: event.clientX,
            y: event.clientY,
        }

        // if the element is already part of the selector
        if (selected && selected.indexOf(id) > -1 ) {

        }

        // otherwise we are moving a non-selected anchor
        else {
            // if the altkey was held when the drag started
            if (event.altKey) {
                // let the user do what they want (they will return the id to follow)
                id = split({id, ...origin})
            }

            // select appropriate element
            selectElement(id)
        }

        // regardless of what action we are taking on this drag, we have to
        this.setState({
            // track the current location of the mouse
            origin,
            // and the id of the element we are moving
            moveTarget: id
        })
    }

    @autobind
    _mouseMove(event) {
        // stop the event from bubbling up
        event.stopPropagation()

        // get the used props
        const { type, info, moveSelectedElements, snap } = this.props
        const { origin, distanceToMove } = this.state
        // if the mouse is down
        if (origin) {
            // make sure the anchor starts from the grid
            snap()

            // the location of the mouse in the diagram's coordinate space
            const mouse = {
                x: event.clientX, 
                y: event.clientY,
            }

            // compute the difference between the mouse's current location and the previous one
            const delta = {
                x: mouse.x - origin.x,
                y: mouse.y - origin.y,
            }


            // the amount to move (this will be halved)
            let grid
            // the minimum amount to wait before moving
            let snapMove = {}

            // if there is a grid
            if (info.gridSize > 0) {
                grid = info.gridSize
                snapMove = {
                    x: round(delta.x, grid),
                    y: round(delta.y, grid),
                }
            }
            // otherwise there is no grid
            else {
                grid = 2
                snapMove = {
                    x: Math.abs(delta.x), // this minus sign is accounted for on line 137
                    y: Math.abs(delta.y)
                }
            }

            // the location to move to
            const fixed = {...origin}

            // if we have moved the mouse enough in the x direction
            if (Math.abs(delta.x) > grid/2) {
                // add one grid to element
                fixed.x += snapMove.x
            }

            // if we have moved the mouse enough in the x direction
            if (Math.abs(delta.y) >= grid/2) {
                // add one grid to element
                fixed.y += snapMove.y
            }

            const fixedDelta = {
                x: fixed.x - origin.x,
                y: fixed.y - origin.y,
            }
            // move the selected anchors
            moveSelectedElements(fixedDelta)

            // save the current location for the next time we move the element
            this.setState({
                origin: fixed,
            })
        }
    }

    @autobind
    _mouseUp(event) {
        // stop the event from bubbling up
        event.stopPropagation()

        // used state
        const { origin, moveTarget } = this.state
        const { mergeElements, type } = this.props

        // if this component was being dragged
        if (origin && type === 'anchors') {
            // tell the store to clean up any overlapping elements (and select the resulting element)
            mergeElements(moveTarget, true)
        }

        // track the state of the mouse
        this.setState({
            // clear the drag target
            moveTarget: null,
            // we are no longer holding the mouse down
            origin: false
        })
    }

    componentDidMount() {
        this._mouseMove({stopPropagation() {}})
    }

    render() {
        const { children:child, ...unusedProps } = this.props

        return (
            <g onMouseDown={this._mouseDown}>
                <EventListener event="mousemove">
                    {this._mouseMove}
                </EventListener>
                <EventListener event="mouseup">
                    {this._mouseUp}
                </EventListener>
                {React.Children.only(child)}
            </g>
        )
    }
}

const selector = ({elements, info}) => ({elements, info})
const mapDispatchToProps = (dispatch, props) => ({
    selectElement: id => dispatch(selectElements({type: props.type, id})),
    moveSelectedElements: move => dispatch(moveSelectedElements(move)),
    // tell the store to merge overlapping elements
    mergeElements: (id, select) => dispatch(mergeElements(id, select)),

})
export default connect(selector, mapDispatchToProps)(Splittable)

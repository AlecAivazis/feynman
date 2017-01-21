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
        split: React.PropTypes.func.isRequired
    }

    static defaultProps = {
        split: id => id // default, don't split anything
    }

    state = {
        origin: null,
        moveTarget: null,
        elementOrigin: null
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
            element:{id, ...element},
            selectElement,
            info,
            location,
        } = this.props

        // save a reference to the selected elements
        const selected = elements.selection[type]

        // if the element is already part of the selector
        if (selected && selected.indexOf(id) > -1 ) {

        }

        // otherwise we are moving a non-selected anchor
        else {
            // if the altkey was held when the drag started
            if (event.altkey) {
                // let the user do what they want (they will return the id to follow)
                id = split(id)
            }

            // select appropriate element
            selectElement(id)
        }

        // regardless of what action we are taking on this drag, we have to
        this.setState({
            // track the current location of the mouse
            origin: {
                x: event.clientX,
                y: event.clientY,
            },
            // and the id of the element we are moving
            moveTarget: id
        }, () => console.log(this.state.origin))
    }

    @autobind
    @throttle(20)
    _mouseMove(event) {
        // stop the event from bubbling up
        event.stopPropagation()

        // get the used props
        const { type, info, moveSelectedElements } = this.props
        const { origin } = this.state

        // if the mouse is down
        if (origin) {
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

            // move the selected anchors
            moveSelectedElements(delta)

            // save the current location for the next time we move the element
            this.setState({
                origin: mouse
            })
        }
    }

    @autobind
    _mouseUp(event) {
        // stop the event from bubbling up
        event.stopPropagation()

        // used state
        const { origin, moveTarget } = this.state
        const { mergeElements } = this.props

        // if this component was being dragged
        if (origin) {
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

    render() {
        const { children, ...unusedProps } = this.props

        return (
            <g onMouseDown={this._mouseDown}>
                <EventListener event="mousemove">
                    {this._mouseMove}
                </EventListener>
                <EventListener event="mouseup">
                    {this._mouseUp}
                </EventListener>
                {React.Children.only(children)}
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

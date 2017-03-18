// external imports
import React from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
// local imports
import { relativePosition, fixPositionToGrid, generateElementId } from 'utils'
import { selectElements, mergeElements, moveSelectedElements, setElementAttrs } from 'actions/elements'
import { throttle, fixDeltaToGrid, round } from 'utils'
import { EventListener } from 'components'
import { snapAnchor, snapPropagator } from './snap'

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
        moveType: null
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
                const splitResult = split({id, ...relativePosition(origin)})
                id = splitResult.id
                type = splitResult.type
            }

            // select appropriate element
            selectElement({id, type})
        }

        // regardless of what action we are taking on this drag, we have to
        this.setState({
            // track the current location of the mouse
            origin,
            // and the id of the element we are moving
            moveTarget: id,
            moveType: type,
        })
    }

    @autobind
    _mouseMove(event) {
        // stop the event from bubbling up
        event.stopPropagation()

        // get the used props
        const { type, info, elements, setElementAttrs, moveSelectedElements } = this.props
        const { origin, moveTarget, moveType } = this.state
        // if the mouse is down
        if (origin) {

            // the mapping of type to snap utils
            const snap = {
                'anchors': snapAnchor,
                'propagators': snapPropagator,
            }[moveType]

            // if we are moving an element that we need to snap to the grid first
            if (snap) {
                // make sure the anchor starts from the grid
                snap({id: moveTarget, elements,  info, setElementAttrs})
            }


            // the location of the mouse in the diagram's coordinate space
            const mouse = {
                x: event.clientX, 
                y: event.clientY,
            }


            // the location to move to
            const fixed = fixDeltaToGrid({origin, next: mouse, info})
            const delta = {
                x: fixed.x - origin.x,
                y: fixed.y - origin.y,
            }

            // move the selected anchors
            moveSelectedElements(delta)
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
        const { origin, moveTarget, moveType } = this.state
        const { mergeElements } = this.props

        // if this component was being dragged
        if (origin && moveType === 'anchors') {
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

const selector = ({diagram: {elements, info}}) => ({elements, info})
const mapDispatchToProps = (dispatch, props) => ({
    selectElement: ({id, type}) => dispatch(selectElements({type, id})),
    moveSelectedElements: move => dispatch(moveSelectedElements(move)),
    // tell the store to merge overlapping elements
    mergeElements: (id, select) => dispatch(mergeElements(id, select)),
    // update particular attributes of elements
    setElementAttrs: (...attrs) => dispatch(setElementAttrs(...attrs)),

})
export default connect(selector, mapDispatchToProps)(Splittable)

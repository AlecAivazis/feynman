// external imports
import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
// local imports
import { relativePosition, fixPositionToGrid, generateElementId } from 'utils'
import { selectElements, mergeElements, moveSelectedElements, setElementAttrs } from 'actions/elements'
import { commit } from 'actions/history'
import { throttle, fixDeltaToGrid, round } from 'utils'
import { EventListener } from 'components'
import { snapElement, snapPropagator } from './snap'

class Splittable extends React.Component {

    static propsTypes = {
        element: PropTypes.string.isRequired,
        split: PropTypes.func.isRequired,
        type: PropTypes.string.isRequired
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
        // we need to track if we created a new element
        let action = null

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
                const splitResult = split({id, ...relativePosition(origin, info)})
                // if the resulting id is different
                if (splitResult.id !== id) {
                    // we created a new element
                    action = 'create'
                }

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
            // track our action
            action,
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
                'propagators': snapPropagator,
            }[moveType] || snapElement

            // make sure the element starts from the grid
            snap({id: moveTarget, elements,  info, setElementAttrs, type: moveType})

            // the location of the mouse in the diagram's coordinate space
            const mouse = {
                x: event.clientX,
                y: event.clientY,
            }

            // the location to move to
            const fixed = fixDeltaToGrid({origin, next: mouse, info})
            const delta = {
                x: (fixed.x - origin.x) / info.zoomLevel,
                y: (fixed.y - origin.y ) / info.zoomLevel,
            }

            // move the selected anchors
            moveSelectedElements(delta)
            // save the current location for the next time we move the element
            this.setState({
                origin: fixed,
                action: this.state.action !== 'create' ? 'move' : 'create'
            })
        }
    }

    @autobind
    _mouseUp(event) {
        // stop the event from bubbling up
        event.stopPropagation()

        // used state
        const { action, moveTarget, moveType, origin } = this.state
        // if this component was being dragged
        if (origin && moveTarget && moveType) {
            this.props.mergeElements()
            // log the appropriate commit message
            if (action === 'move') {
                this.props.commitWithMessage(`moved ${moveType}`)
            } else if (action === 'create') {
                this.props.commitWithMessage(`added a branch to ${moveType}`)
            }
        }

        // track the state of the mouse
        this.setState({
            // clear the drag target
            moveTarget: null,
            moveType: null,
            // we are no longer holding the mouse down
            origin: false,
            created: false,
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
    mergeElements: (...args) => dispatch(mergeElements(...args)),
    // update particular attributes of elements
    setElementAttrs: (...attrs) => dispatch(setElementAttrs(...attrs)),
    commitWithMessage: msg => dispatch(commit(msg)),

})
export default connect(selector, mapDispatchToProps)(Splittable)

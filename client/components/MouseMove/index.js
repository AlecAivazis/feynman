// external imports
import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
// local imports
import { EventListener } from 'components'
import { fixDeltaToGrid } from 'utils'

class MouseMove extends React.Component {
    static propTypes = {
        down: PropTypes.func,
        up: PropTypes.func,
        move: PropTypes.func,
    }

    static defaultProps = {
        round: false,
        down: () => {},
        up: () => {},
        move: () => {},
    }

    state = {
        origin: null,
    }

    render() {
        return (
            <g>
                <EventListener event="mousemove">{this._move}</EventListener>
                <EventListener event="mouseup">{this._up}</EventListener>
                {React.cloneElement(this.props.children, {
                    onMouseDown: this._down,
                })}
            </g>
        )
    }

    @autobind
    _down(event) {
        this.setState(
            {
                origin: {
                    x: event.clientX,
                    y: event.clientY,
                },
            },
            this.props.down
        )
    }

    @autobind
    _up(event) {
        // if we're holding the mouse down
        if (this.state.origin) {
            // clear the origin
            this.setState({ origin: null }, this.props.up)
        }
    }

    @autobind
    _move(event) {
        // save a reference to the origin in case we need it later
        const { origin } = this.state
        // if we are holding the mouse down
        if (origin) {
            // the location of the mouse in the diagram's coordinate space
            const mouse = {
                x: event.clientX,
                y: event.clientY,
            }

            // grab the required meta data
            const { info, round } = this.props
            // the location to move to
            const next = fixDeltaToGrid({ origin, next: mouse, info, round })
            const delta = {
                x: (next.x - origin.x) / info.zoomLevel,
                y: (next.y - origin.y) / info.zoomLevel,
            }

            // call the callback
            this.props.move({ origin, next, delta })

            // update the place we're dragging from
            this.setState({ origin: next })
        }
    }
}

const selector = ({ diagram: { info } }) => ({ info })
export default connect(selector)(MouseMove)

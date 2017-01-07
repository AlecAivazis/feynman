// external imports
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
// local imports
import styles from './styles'
import Grid from './Grid'
import Propagator from './Propagator'
import Anchor from './Anchor'
import SelectionRectangle from './SelectionRectangle'
import { propagatorsWithLocation } from './util'
import { relativePosition } from 'utils'
import { clearSelection } from 'actions/elements'

class Diagram extends React.Component {
    // the diagram component keeps track of the placement of the user's selection rectangle
    // using 2 points
    state = {
        point1: null,
        point2: null,
    }

    render() {
        // grab the used props
        const {info, elements, dispatch, selection, style} = this.props
        // figure out if we need to style to fit the grid or not
        const elementStyle = info.showGrid ? styles.containerWithGrid : styles.containerWithoutGrid

        // figure the concrete locations for each propgators (dereference the anchors)
        const propagators = propagatorsWithLocation(elements)

        // render the various components of the diagram
        return (
            <svg style={{...elementStyle, ...style}} onMouseDown={this._mouseDown} >
                {info.showGrid && info.gridSize > 0 && <Grid/>}
                {propagators.map((element, i) => <Propagator {...element} key={i}/>)}
                {info.showAnchors && Object.values(elements.anchors).map(anchor => (
                    <Anchor {...anchor}
                        selected={selection.anchors && selection.anchors.includes(anchor.id)}
                        key={anchor.id}
                    />
                ))}
                { this.state.point1 && this.state.point2 && (
                    <SelectionRectangle {...this.state} />
                )}
            </svg>
        )
    }

    componentDidMount() {
        document.addEventListener('mousemove', this._mouseMove)
        document.addEventListener('mouseup', this._mouseUp)
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this._mouseMove)
        document.removeEventListener('mouseup', this._mouseUp)
    }

    _mouseDown(event) {
        // only fire for clicks originating on the diagram
        if (event.target.nodeName === 'svg') {
            // remove the previous selection
            this.props.dispatch(clearSelection())
            // start the selection rectangle
            this.setState({
                point1: relativePosition({
                    x: event.clientX,
                    y: event.clientY,
                })
            })
        }
    }

    _mouseMove(event) {
        // only fire for moves originating on the diagram when we are building the selection rectangle
        if (this.state.point1) {
            // start the selection rectangle
            this.setState({
                point2: relativePosition({
                    x: event.clientX,
                    y: event.clientY,
                })
            })

        }
    }

    _mouseUp(event) {
        // only fire for moves originating on the diagram when we are building the selection rectangle
        if (this.state.point1) {
            // clear the rectangle the selection rectangle
            this.setState({
                point1: null,
                point2: null,
            })

        }
    }

    constructor(...args) {
        super(...args)

        // function binds
        this._mouseDown = this._mouseDown.bind(this)
        this._mouseUp = this._mouseUp.bind(this)
        this._mouseMove = this._mouseMove.bind(this)
    }
}

const selector = ({ info, elements }) => ({
    info,
    elements,
    // get a list of each id in each selection type
    selection: elements.selection,
})
export default connect(selector)(Diagram)

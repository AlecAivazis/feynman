// external imports
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import autobind from 'autobind-decorator'
// local imports
import styles from './styles'
import Grid from './Grid'
import Propagator from './Propagator'
import Anchor from './Anchor'
import SelectionRectangle from './SelectionRectangle'
import { propagatorsWithLocation } from './util'
import { relativePosition, elementsInRegion } from 'utils'
import { clearSelection, selectElements } from 'actions/elements'

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

                {/* order matters here (last shows up on top) */}

                {info.showGrid && info.gridSize > 0 && <Grid/>}
                {propagators.map((element, i) => (
                    <Propagator
                        {...element}
                        key={i}
                        selected={selection.propagators && selection.propagators.includes(element.id)}
                    />
                ))}
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

    @autobind
    _mouseDown(event) {
        // only fire for clicks originating on the diagram
        if (event.target.nodeName === 'svg') {
            // remove the previous selection
            this.props.clearSelection()
            // start the selection rectangle
            this.setState({
                point1: relativePosition({
                    x: event.clientX,
                    y: event.clientY,
                })
            })
        }
    }

    @autobind
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

            // select the elements in the region
            this.props.selectElements(
                ...elementsInRegion({
                    elements: this.props.elements,
                    region: this.state,
                })
            )

        }
    }

    @autobind
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
}

const selector = ({ info, elements }) => ({
    info,
    elements,
    // get a list of each id in each selection type
    selection: elements.selection,
})

const mapDispatchToProps = dispatch => ({
    selectElements: (...elements) => dispatch(selectElements(...elements)),
    clearSelection: () => dispatch(clearSelection()),
})
export default connect(selector, mapDispatchToProps)(Diagram)

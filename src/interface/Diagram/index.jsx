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
import { propagatorsWithLocation } from 'utils'
import {
    relativePosition,
    elementsInRegion,
    generateElementId,
    fixPositionToGrid
} from 'utils'
import { EventListener } from 'components'
import {
    clearSelection,
    selectElements,
    addAnchors,
    addPropagators,
    setElementAttrs as setAttrs,
    deleteSelection,
} from 'actions/elements'
import PatternModal from '../PatternModal'

class Diagram extends React.Component {
    // the diagram component keeps track of the placement of the user's selection rectangle
    // using 2 points
    state = {
        point1: null,
        point2: null,
        newElement: false
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
                { this.state.point1 && this.state.point2 && !this.state.newElement && (
                    <SelectionRectangle {...this.state} />
                )}

                {/* Event listeners */}

                <EventListener event="mousemove">
                    {this._mouseMove}
                </EventListener>
                <EventListener event="mouseup">
                    {this._mouseUp}
                </EventListener>
                <EventListener event="keydown">
                   {this._keyPress}
                </EventListener>
            </svg>
        )
    }

    @autobind
    _mouseDown(event) {
        // only fire for clicks originating on the diagram
        if (event.target.nodeName !== 'svg') {
            return
        }

        // used props
        const { elements, info, addPropagators, addAnchors } = this.props

        // figure out where we clicked in the diagram
        const loc = relativePosition({
            x: event.clientX,
            y: event.clientY,
        })

        // remove the previous selection
        this.props.clearSelection()
        // start the selection rectangle
        this.setState({
            point1: loc
        })

        // if the alt key was being held down
        if (event.altKey) {
            // we'll need two anchor ids
            const [clickAnchor, dragAnchor] = generateElementId(elements.anchors, 2)
            // and a propagator id
            const propagatorId = generateElementId(elements.propagators)

            // fix the location to the grid
            const fixed = fixPositionToGrid(loc, info.gridSize)

            // create two anchors where we click
            addAnchors(
                {
                    id: clickAnchor,
                    ...fixed,
                },
                {
                    id: dragAnchor,
                    ...fixed,
                },
            )

            // and an anchor connecting the two
            addPropagators(
                {
                    kind: 'fermion',
                    id: propagatorId,
                    anchor1: clickAnchor,
                    anchor2: dragAnchor,
                }
            )

            // make sure we move the element
            this.setState({
                newElement: dragAnchor
            })
        }
    }

    @autobind
    _mouseMove(event) {
        // grab the used props
        const { setElementAttrs, info } = this.props

        // only fire for moves originating on the diagram when we are building the selection rectangle
        if (!this.state.point1) {
            return
        }

        // compute the relative position of the mouse
        const point2 = relativePosition({
            x: event.clientX,
            y: event.clientY,
        })


        // save the second point
        this.setState({point2}, () => {
            // if we are not creating a new element
            if (!this.state.newElement) {
                // select the elements in the region
                this.props.selectElements(
                    ...elementsInRegion({
                        elements: this.props.elements,
                        region: this.state
                    })
                )
            // otherwise we are creating a new element
            } else {
                // move the drag anchor to match the mouse
                setElementAttrs({
                    type: 'anchors',
                    id: this.state.newElement,
                    ...fixPositionToGrid(
                        this.state.point2, info.gridSize
                    )
                })
            }
        })
    }

    @autobind
    _mouseUp(event) {
        // only fire for moves originating on the diagram when we are building the selection rectangle
        if (this.state.point1) {
            // clear the rectangle the selection rectangle
            this.setState({
                point1: null,
                point2: null,
                newElement: null,
            })

        }
    }

    @autobind
    _keyPress(event) {
        // if the user pressed the backspace or the delete key respectively
        if ([8,46].includes(event.which)) {
            // delete the selected elements
            this.props.deleteSelectedElements()
        }
    }
}

const selector = ({ info, elements }) => ({
    info,
    elements,
    selection: elements.selection,
})

const mapDispatchToProps = dispatch => ({
    selectElements: (...elements) => dispatch(selectElements(...elements)),
    clearSelection: () => dispatch(clearSelection()),
    addAnchors: (...anchors) => dispatch(addAnchors(...anchors)),
    addPropagators: (...props) => dispatch(addPropagators(...props)),
    setElementAttrs: (...attrs) => dispatch(setAttrs(...attrs)),
    deleteSelectedElements: () => dispatch(deleteSelection())
})
export default connect(selector, mapDispatchToProps)(Diagram)

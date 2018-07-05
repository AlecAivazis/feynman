// external imports
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import autobind from 'autobind-decorator'
import SvgMatrix from 'svg-matrix'
import { EventListener } from 'quark-web'
// local imports
import styles from './styles'
import Grid from './Grid'
import Propagator from './Propagator'
import Anchor from './Anchor'
import Text from './Text'
import Shape from './Shape'
import SelectionRectangle from './SelectionRectangle'
import {
    relativePosition,
    elementsInRegion,
    generateElementId,
    fixPositionToGrid,
    elementsWithLocations,
    diagramBoundingBox,
    dataUrlToBlob,
    svgToDataURL,
} from 'utils'
import {
    clearSelection,
    selectElements,
    addAnchors,
    addPropagators,
    setElementAttrs as setAttrs,
    deleteSelection,
    mergeElements,
} from 'actions/elements'
import { panDiagram as panDiagramAction, zoomIn as zoomInAction, zoomOut as zoomOutAction } from 'actions/info'
import PatternModal from '../PatternModal'
import { undo, redo, withCommit, commit } from 'actions/history'
import DiagramPatterns from './Patterns'

class Diagram extends React.Component {
    state = {
        // the points we've created during mouse interactions ( a list of {id, location} )
        points: [],

        // the last known mouse location during drag
        origin: null,

        // keyboard trackers
        spacebarPressed: false,
        altPressed: false,
    }

    render() {
        // grab the used props
        const { info, elements, dispatch, selection, style } = this.props
        // figure out if we need to style to fit the grid or not
        const elementStyle = info.showGrid ? styles.containerWithGrid : styles.containerWithoutGrid

        // figure the concrete locations for each propgators (dereference the anchors)
        const { propagators, anchors } = elementsWithLocations(elements)

        // render the various components of the diagram
        return (
            <svg ref={ele => (this.diagram = ele)} style={{ ...elementStyle, ...style }} onMouseDown={this._mouseDown}>
                <DiagramPatterns />

                {/* wrap the whole diagram in a group so we can apply the diagram pan and zoom */}
                <g transform={this.transformString} className="diagram">
                    {/* order matters here (last shows up on top) */}
                    {info.showGrid && info.gridSize > 0 && <Grid />}
                    {Object.values(elements.text).map(element => (
                        <Text
                            {...element}
                            key={element.id}
                            selected={selection.text && selection.text.includes(element.id)}
                        />
                    ))}
                    {Object.values(elements.shapes).map(element => (
                        <Shape
                            {...element}
                            selected={selection.shapes && selection.shapes.includes(element.id)}
                            key={element.id}
                        />
                    ))}
                    {propagators.map(element => (
                        <Propagator
                            {...element}
                            key={element.id}
                            selected={selection.propagators && selection.propagators.includes(element.id)}
                        />
                    ))}
                    {info.showAnchors &&
                        anchors.map(anchor => (
                            <Anchor
                                {...anchor}
                                selected={selection.anchors && selection.anchors.includes(anchor.id)}
                                key={anchor.id}
                            />
                        ))}

                    {/* only show the selection rectangle when we have 2 points and we didn't make a new one */}
                    {this.state.points.length === 2 &&
                        !this.state.points[0].id && (
                            <SelectionRectangle
                                point1={relativePosition(this.state.origin, this.props.info)}
                                point2={this.state.points[1].location}
                            />
                        )}
                </g>

                {/* mouse movement (selection rectangle and element creation) */}
                <EventListener event="mousemove">{this._mouseMove}</EventListener>
                <EventListener event="mouseup">{this._mouseUp}</EventListener>

                {/* track the state of the spacebar for panning and alt for element creation */}
                <EventListener event="keydown">{this._keyPress}</EventListener>
                <EventListener event="keyup">{this._keyUp}</EventListener>

                {/* when the user scrolls */}
                <EventListener event="mousewheel">{this._mouseWheel}</EventListener>
            </svg>
        )
    }

    get transformString() {
        const { x, y } = this.props.info.pan
        return SvgMatrix()
            .translate(x, y)
            .scale(this.props.info.zoomLevel).transformString
    }

    @autobind
    _mouseDown(event) {
        // only fire for clicks originating on the diagram
        if (event.target.nodeName !== 'svg') {
            return
        }

        // remove the previous selection
        this.props.clearSelection()

        // figure out where we clicked in the diagram
        const loc = relativePosition(
            {
                x: event.clientX,
                y: event.clientY,
            },
            this.props.info
        )
        // fix the location to the grid
        const location = fixPositionToGrid(loc, this.props.info.gridSize)

        // the id we would assign to a point if we make one here
        let id = null

        // if the alt key is down
        if (this.state.altPressed) {
            // we need to make an anchor at the first location

            // grab the used props
            const { elements, info, addPropagators, addAnchors } = this.props

            // generate an id for the new anchor
            id = generateElementId(elements.anchors)

            // add the actual anchor where we clicked
            addAnchors({
                id,
                ...location,
            })
        }

        // save the coordinates of where the mouse down occured
        this.setState({
            points: [{ id, location }],
            // make sure drag delta start from this location
            origin: {
                x: event.clientX,
                y: event.clientY,
            },
        })
    }

    @autobind
    _mouseMove(event) {
        // grab the used props
        const { setElementAttrs, info } = this.props

        // only continue if we started dragging on this element
        if (this.state.points.length === 0) {
            return
        }

        // if we are holding spacebar
        if (this.state.spacebarPressed) {
            this._panDiagram(event)
        } else {
            // otherwise just create the selection rectangle like normal
            this._handleMove(event)
        }
    }

    @autobind
    _mouseUp(event) {
        // pull out used state
        let { points } = this.state
        const { info } = this.props

        // only continue if we started dragging on this element
        if (points.length > 0) {
            // if we created any new elements we need to commit the new state
            if (points[0].id) {
                // the kind of object we created
                let kind = 'propagator'

                // fix the location of each point to the grid so we can compare
                points = points.map(pt => ({ ...pt, location: fixPositionToGrid(pt.location, info.gridSize) }))

                // if there is only one point or two that will be merged
                if (
                    points.length === 1 ||
                    (points.length === 2 &&
                        points[0].location.x === points[1].location.x &&
                        points[0].location.y === points[1].location.y)
                ) {
                    // then we made a single anchor
                    kind = 'anchor'
                }

                // perform the commit
                this.props.commit(`added ${kind} to diagram`)

                // clean up anything we left behind
                this.props.merge()
            }

            // clear the trackers assciated with drag interactions
            this.setState({
                points: [],
                origin: null,
            })
        }
    }

    @autobind
    _keyPress(event) {
        // if the key that was pressed was the spacebar, we haven't pressed teh spacebar yet, and we aren't dragging something
        if (event.which === 32 && !this.state.spacebarPressed && !this.state.points.length > 0) {
            event.preventDefault()
            this.setState({
                spacebarPressed: true,
            })
        } else if (event.which === 18 && !this.state.altPressed && !this.state.points.length > 0) {
            // if the alt key was pressed before we have created any other points
            event.preventDefault()
            this.setState({
                altPressed: true,
            })
        } else if ([8, 46].includes(event.which)) {
            // if the user pressed the backspace or the delete key respectively
            event.preventDefault()
            // if we have any elements selected
            if (Object.values(this.props.selection).filter(arr => arr.length > 0).length > 0) {
                // delete the selected elements and commit the change
                this.props.withCommit(deleteSelection(), 'removed selected elements')
            }
        } else if (event.ctrlKey && event.which === 90) {
            // if the user pressed ctrl+z
            event.preventDefault()
            // if they actually pressed shift + ctrl + z
            if (event.shiftKey) {
                this.props.redo()
                // otherwise they just pressed ctrl + x
            } else {
                this.props.undo()
            }
        }
    }

    @autobind
    _keyUp(event) {
        this.setState({
            spacebarPressed: false,
            altPressed: false,
        })
    }

    @autobind
    _handleMove(event) {
        // the points we've added so far
        let points = [...this.state.points]
        // set the location of the second
        points[1] = {
            id: points[1] ? points[1].id : null,
            location: relativePosition(
                {
                    x: event.clientX,
                    y: event.clientY,
                },
                this.props.info
            ),
        }

        // if we created an anchor on the first click and we haven't made a matching on yet
        if (this.state.points.length === 1 && points[0].id) {
            // grab used props
            const { elements, addAnchors, addPropagators, selectElements } = this.props

            // generate an id for the new anchor
            const id = generateElementId(elements.anchors)
            const { location } = points[1]

            // create the actual anchor element
            addAnchors({
                id,
                ...location,
            })

            // select the anchor we are dragging
            selectElements({ id, type: 'anchors' })

            // generate an id for the new propagator
            const propagatorId = generateElementId(elements.propagators)

            // and a propagator to join the two
            addPropagators({
                kind: 'fermion',
                id: propagatorId,
                anchor1: points[0].id,
                anchor2: id,
            })

            // save the propagator id for next time
            points[1].id = id
        }

        // save the second point
        this.setState({ points }, () => {
            // if we are dragging the selection rectangle
            if (!points[0].id) {
                // select the elements in the region
                this.props.selectElements(
                    ...elementsInRegion({
                        elements: this.props.elements,
                        region: {
                            point1: relativePosition(this.state.origin, this.props.info),
                            point2: points[1].location,
                        },
                    })
                )
            } else {
                // otherwise we are creating a new element
                // move the new anchor to match the mouse
                this.props.setElementAttrs({
                    type: 'anchors',
                    id: points[1].id,
                    ...fixPositionToGrid(points[1].location, this.props.info.gridSize),
                })
            }
        })
    }

    @autobind
    _panDiagram(event) {
        // compute the relative position of the mouse
        const point2 = {
            x: event.clientX,
            y: event.clientY,
        }

        // the difference we've moved
        const pan = {
            x: point2.x - this.state.origin.x,
            y: point2.y - this.state.origin.y,
        }

        // pan the diagram the match the mouse movement
        this.props.panDiagram(pan)

        // update the origin
        this.setState({ origin: point2 })
    }

    @autobind
    _mouseWheel(event) {
        // only fire for clicks originating on the diagram
        if (event.target.nodeName !== 'svg') {
            return
        }
        // don't scroll
        event.stopPropagation()
        event.preventDefault()

        // if the user scrolled up
        if (event.wheelDelta / 120 > 0) {
            // zoom in
            this.props.zoomIn()
            // otherwise we scrolled down
        } else {
            // zoom the diagram out
            this.props.zoomOut()
        }
    }
}

const selector = ({ diagram: { info, elements } }) => ({
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
    panDiagram: pan => dispatch(panDiagramAction(pan)),
    zoomIn: () => dispatch(zoomInAction()),
    zoomOut: () => dispatch(zoomOutAction()),
    redo: () => dispatch(redo()),
    undo: () => dispatch(undo()),
    commit: msg => dispatch(commit(msg)),
    withCommit: (action, msg) => dispatch(withCommit(action, msg)),
    merge: () => dispatch(mergeElements()),
})
export default connect(
    selector,
    mapDispatchToProps
)(Diagram)

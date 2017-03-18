// external imports
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import autobind from 'autobind-decorator'
import { saveAs } from 'file-saver'
// local imports
import styles from './styles'
import Grid from './Grid'
import Propagator from './Propagator'
import Anchor from './Anchor'
import SelectionRectangle from './SelectionRectangle'
import {
    relativePosition,
    elementsInRegion,
    generateElementId,
    fixPositionToGrid,
    propagatorsWithLocation,
    diagramBoundingBox,
    dataUrlToBlob
} from 'utils'
import 'utils/svgDataUrl'
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

export const exportDiagramImageEvent = 'export-diagram-image'

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
            <svg ref={ele => this.diagram = ele} style={styles.diagram} style={{...elementStyle, ...style}} onMouseDown={this._mouseDown}>

                {/* wrap the whole diagram in a group so we can transform the diagram when exporting */}
                <g className="diagram">
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
                </g>

                { this.state.point1 && this.state.point2 && !this.state.newElement && (
                    <SelectionRectangle {...this.state} />
                )}

                {/* Mouse Movement (selection rectangle and element creation) */}
                <EventListener event="mousemove">
                    {this._mouseMove}
                </EventListener>
                <EventListener event="mouseup">
                    {this._mouseUp}
                </EventListener>
                <EventListener event="keydown">
                {this._keyPress}
                </EventListener>

                {/* When we need to export the diagram as an image */}
                <EventListener event={exportDiagramImageEvent}>
                    {this._exportDiagram}
                </EventListener>
            </svg>
        )
    }

    @autobind
    async _exportDiagram() {
        // if we are testing and shouldn't actually produce an image
        if (this.props.testingSpy) {
            // call the spy
            this.props.testingSpy()
            // don't do anything else
            return
        }

        // the svg node containing the diagram
        const diagram = this.diagram.cloneNode(true)

        // computing the bounding box for the diagram
        const bb = diagramBoundingBox(this.props.elements)
        // remove the grey coloring in the grid
        diagram.style['backgroundColor'] = "rgba(0,0,0,0)"

        // the elements to remove from the diagram
        const removeTargets = [
            ...diagram.getElementsByClassName("grid"),
            ...diagram.getElementsByClassName("anchor"),
        ]

        // visit each target
        for (const target of removeTargets) {
            // remove it from the exported image
            target.parentNode.removeChild(target)
        }

        // add the dimensional attribtues to the diagram so the resulting image
        // has the correct size
        diagram.setAttribute('x1', bb.x1)
        diagram.setAttribute('y1', bb.y1)
        diagram.setAttribute('width', bb.width)
        diagram.setAttribute('height', bb.height)

        // move the actual diagram into the viewport of the image
        diagram.getElementsByClassName('diagram')[0]
               .setAttribute('transform', `translate(-${bb.x1}, -${bb.y1})`)

        // export the diagram as a png
        const dataUrl = await diagram.toDataURL("image/png")

        // save the data url as a png
        saveAs(dataUrlToBlob(dataUrl), "diagram.png")
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

const selector = ({diagram: { info, elements }}) => ({
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

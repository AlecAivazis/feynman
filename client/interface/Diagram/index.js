// external imports
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import autobind from 'autobind-decorator'
import { saveAs } from 'file-saver'
import SvgMatrix from 'svg-matrix'
// local imports
import { brightBlue } from 'colors'
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
import { EventListener } from 'components'
import {
    clearSelection,
    selectElements,
    addAnchors,
    addPropagators,
    setElementAttrs as setAttrs,
    deleteSelection,
} from 'actions/elements'
import { panDiagram as panDiagramAction, zoomIn as zoomInAction, zoomOut as zoomOutAction } from 'actions/info'
import PatternModal from '../PatternModal'
import { undo, redo, withCommit, commit } from 'actions/history'

export const exportDiagramImageEvent = 'export-diagram-image'

class Diagram extends React.Component {
    // the diagram component keeps track of the placement of the user's selection rectangle
    // using 2 points
    state = {
        point1: null,
        point2: null,
        newElement: false,
        spacebarPressed: false,
        origin: null,
    }

    render() {
        // grab the used props
        const {info, elements, dispatch, selection, style} = this.props
        // figure out if we need to style to fit the grid or not
        const elementStyle = info.showGrid ? styles.containerWithGrid : styles.containerWithoutGrid

        // figure the concrete locations for each propgators (dereference the anchors)
        const { propagators, anchors } = elementsWithLocations(elements)

        // render the various components of the diagram
        return (
            <svg
                ref={ele => this.diagram = ele}
                style={{...elementStyle, ...style}}
                onMouseDown={this._mouseDown}
            >
                {/* patterns used in the application */}
                <pattern x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" id="pattern-parton-lines" viewBox="0 0 10 10">
                    <path
                        d="M10-5-10,15M15,0,0,15M0-5-20,15"
                        fill="none"
                        stroke="#b8b8b8"
                        style={{strokeWidth: 2}}
                    />
                </pattern>
                <pattern x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" id="pattern-parton-lines-selected" viewBox="0 0 10 10">
                    <path
                        d="M10-5-10,15M15,0,0,15M0-5-20,15"
                        fill="none"
                        stroke={brightBlue}
                        style={{strokeWidth: 2}}
                    />
                </pattern>

                {/* wrap the whole diagram in a group so we can transform the diagram when exporting */}
                <g className="diagram" transform={this.transformString}>
                    {/* order matters here (last shows up on top) */}
                    {info.showGrid && info.gridSize > 0 && <Grid/>}
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
                    {info.showAnchors && anchors.map(anchor => (
                        <Anchor {...anchor}
                            selected={selection.anchors && selection.anchors.includes(anchor.id)}
                            key={anchor.id}
                        />
                    ))}

                    { this.state.point1 && this.state.point2 && !this.state.newElement && (
                        <SelectionRectangle {...this.state}/>
                    )}
                </g>

                {/* mouse movement (selection rectangle and element creation) */}
                <EventListener event="mousemove">
                    {this._mouseMove}
                </EventListener>
                <EventListener event="mouseup">
                    {this._mouseUp}
                </EventListener>

                {/* when we need to export the diagram as an image */}
                <EventListener event={exportDiagramImageEvent}>
                    {this._exportDiagram}
                </EventListener>

                {/* track the state of the spacebar for panning and alt for element creation */}
                <EventListener event="keydown">
                    {this._keyPress}
                </EventListener>
                <EventListener event="keyup">
                    {this._keyUp}
                </EventListener>

                {/* when the user scrolls */}
                <EventListener event="mousewheel">
                    {this._mouseWheel}
                </EventListener>
            </svg>
        )
    }

    get transformString() {
        const {x , y} = this.props.info.pan
        return SvgMatrix()
                .translate(x, y)
                .scale(this.props.info.zoomLevel)
                .transformString
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
            ...diagram.getElementsByClassName("selectionRectangle"),
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

        // for each image in the diagram we're exporting
        for (const img of diagram.getElementsByTagName('image')) {
            const image = new Image(img)
            console.log(image)
            image.setAttribute('href', img.href)
            const canvas = document.createElement('CANVAS')
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            const dataURL = canvas.toDataURL("image/png")
            console.log(dataURL)
            // img.href = dataURL
            img.setAttribute('xlink:href', dataURL)
            img.setAttribute('href', dataURL)
        }

        console.log(diagram)

        // export the diagram as a png
        const dataUrl = await svgToDataURL(diagram, "image/png")

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
        }, this.props.info)

        // remove the previous selection
        this.props.clearSelection()
        // start the selection rectangle
        this.setState({
            point1: loc,
            origin: {
                x: event.clientX,
                y: event.clientY,
            }
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

            this.props.commit("added element to diagram")

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

        // only continue if we started dragging on this element
        if (!this.state.point1) {
            return
        }

        // if we are holding spacebar
        if (this.state.spacebarPressed) {
            this._panDiagram(event)
        }
        // otherwise just create the selection rectangle like normal
        else {
            this._drawRectangle(event)
        }
    }

    @autobind
    _mouseUp(event) {
        // only continue if we started dragging on this element
        if (this.state.point1) {
            // clear the rectangle the selection rectangle
            this.setState({
                point1: null,
                point2: null,
                newElement: null,
                origin: null,
            })
        }
    }

    @autobind
    _keyPress(event) {
        // if the key that was pressed was the spacebar, we haven't pressed teh spacebar yet, and we aren't dragging something
        if (event.which === 32 && !this.state.spacebarPressed && !this.state.point1){
            event.preventDefault()
            this.setState({
                spacebarPressed: true
            })
        // if the user pressed the backspace or the delete key respectively
        } else if ([8,46].includes(event.which)) {
            event.preventDefault()
            // if we have any elements selected
            if(Object.values(this.props.selection).filter(arr => arr.length > 0).length > 0) {
                // delete the selected elements and commit the change
                this.props.withCommit(deleteSelection(), 'removed selected elements')
            }
        }
        // if the user pressed ctrl+z
        if (event.ctrlKey && event.which === 90) {
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
            spacebarPressed: false
        })
    }

    @autobind
    _drawRectangle(event) {
        // compute the relative position of the mouse
        const point2 = relativePosition({
            x: event.clientX,
            y: event.clientY,
        }, this.props.info)


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
                this.props.setElementAttrs({
                    type: 'anchors',
                    id: this.state.newElement,
                    ...fixPositionToGrid(
                        this.state.point2, this.props.info.gridSize
                    )
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
        this.setState({origin: point2})
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
    panDiagram: pan => dispatch(panDiagramAction(pan)),
    zoomIn: () => dispatch(zoomInAction()),
    zoomOut: () => dispatch(zoomOutAction()),
    redo: () => dispatch(redo()),
    undo: () => dispatch(undo()),
    commit: msg => dispatch(commit(msg)),
    withCommit: (action, msg) => dispatch(withCommit(action, msg)),
})
export default connect(selector, mapDispatchToProps)(Diagram)

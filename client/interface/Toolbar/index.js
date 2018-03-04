// external imports
import React from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
// local imports
import styles, { toolbarWidth } from './styles'
import SelectionSummary from './SelectionSummary'
import ItemPalette from './ItemPalette'
import Footer from './Footer'
import { EventListener } from 'components'
import * as specMap from './specs'
import {
    placeElement,
    selectElements,
    deleteElements,
    clearSelection,
    moveSelectedElements,
    mergeElements,
} from 'actions/elements'
import { commit } from 'actions/history'
import { togglePatternModal } from 'actions/info'
import { fixDeltaToGrid, relativePosition, generateElementId, round } from 'utils'
import { anchorsInSpec } from './utils'

// WARNING: This component is is way more complicated that originally thought necessary.
//          This is because the ItemPalette's state is wiped when the dragged out element
//          is selected, which forces this component to maintain the shadow and item creation state
class Toolbar extends React.Component {
    // the initial state
    state = {
        shadow: { show: false, image: null },
        mouseOrigin: null,
        elementDragConfig: null,
        dragElement: null,
    }

    render() {
        // grab the used props
        const { style, selection, togglePatterns, ...unusedProps } = this.props

        return (
            <div style={{ ...styles.container, ...style }}>
                {Object.values(selection).some(({ length }) => length > 0) ? (
                    <SelectionSummary selection={selection} />
                ) : (
                    <ItemPalette onMouseDown={this._mouseDown} />
                )}
                <Footer />

                {/* the image to show while dragging (and over the toolbar) */}
                {this.state.shadow.show && (
                    <img
                        src={this.state.shadow.image}
                        style={{
                            ...{ top: this.state.mouseOrigin.y, left: this.state.mouseOrigin.x },
                            ...styles.shadow,
                        }}
                    />
                )}

                <EventListener event="mousemove">{this._mouseMove}</EventListener>
                <EventListener event="mouseup">{this._mouseUp}</EventListener>
            </div>
        )
    }

    @autobind
    _mouseDown({ event, image, config }) {
        this.setState({
            shadow: {
                show: true,
                image,
            },
            mouseOrigin: {
                x: event.clientX,
                y: event.clientY,
            },
            elementDragConfig: config,
        })
    }

    @autobind
    _mouseUp(event) {
        // if we deposited an item
        if (this.state.mouseOrigin && !this.state.shadow.show) {
            // clean up any changes we left behind
            this.props.mergeAnchors()

            // commit the state
            this.props.commitWithMessage(`placed ${this.state.elementDragConfig.type} from item palette.`)
        }

        // clear any references we made while dragging
        this.setState({
            mouseOrigin: null,
            shadow: { show: false, image: null },
            elementDragConfig: null,
            dragElement: null,
        })
    }

    @autobind
    _mouseMove(event) {
        // the origin
        const origin = this.state.mouseOrigin
        const { info } = this.props
        // if the mouse is down
        if (origin) {
            // compute the location of the mouse
            let pos = {
                x: event.clientX,
                y: event.clientY,
            }

            // hide the shadow if the mouse is still over the toolbar
            const showShadow = pos.x >= window.innerWidth - toolbarWidth
            // save a reference to the current element we are dragging
            let { dragElement } = this.state

            // if we are not showing the shadow
            if (!showShadow) {
                // if we don't have an element to drag
                if (!dragElement) {
                    // grab the used props
                    const { info, elements } = this.props
                    // grab the type of the element we dragged
                    const { type, ...config } = this.state.elementDragConfig

                    // make sure its a valid type
                    if (!elements[type]) {
                        throw new Error('Encounted unknown type ' + type)
                    }

                    // find the spec for the element
                    let spec = specMap[type] || specMap.element

                    // track that we have created an element
                    dragElement = spec({ ...relativePosition(pos, info), info, elements, config, type })
                    // create one with the appropriate spec
                    this.props.placeElement(dragElement.element)
                    // select the element we just created
                    this.props.selectElement(dragElement.select || dragElement.element)
                }

                // the fixed target
                const fixed = fixDeltaToGrid({
                    origin,
                    next: pos,
                    info: this.props.info,
                })
                // the distance to move
                const fixedDelta = {
                    x: (fixed.x - origin.x) / info.zoomLevel,
                    y: (fixed.y - origin.y) / info.zoomLevel,
                }

                // if there is a non-zero distance to move
                if (Math.abs(fixedDelta.x) > 0 || Math.abs(fixedDelta.y) > 0) {
                    // move the selected anchors
                    this.props.moveSelectedElements(fixedDelta)
                }

                // make sure we measure relative to the fixed location
                pos = fixed
            } else {
                // otherwise we are showing the shadow
                // if we still have an element attached
                if (this.state.dragElement) {
                    // clear the current selection
                    this.props.clearSelection()
                    // delete it
                    this.props.deleteElements(...(this.state.dragElement.remove || [this.state.dragElement.element]))

                    // clear the drag element state
                    dragElement = null
                }
            }

            // update the state to accomodate the mouse movement
            this.setState({
                // update the location of the mouse
                mouseOrigin: pos,
                shadow: {
                    ...this.state.shadow,
                    show: showShadow,
                },
                dragElement,
            })
        }
    }
}

const selector = ({ diagram: { elements, info } }) => ({ elements, info, selection: elements.selection })
const mapDispatchToProps = dispatch => ({
    placeElement: element => dispatch(placeElement(element)),
    selectElement: element => dispatch(selectElements(element)),
    deleteElements: (...elements) => dispatch(deleteElements(...elements)),
    clearSelection: () => dispatch(clearSelection()),
    moveSelectedElements: move => dispatch(moveSelectedElements(move)),
    mergeAnchors: element => dispatch(mergeElements(element)),
    commitWithMessage: msg => dispatch(commit(msg)),
})
export default connect(selector, mapDispatchToProps)(Toolbar)

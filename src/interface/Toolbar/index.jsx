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
import { propagatorSpec } from './specs'
import { placeElement, selectElements, deleteElements, clearSelection } from 'actions/elements'

// WARNING: This component is is way more complicated that originally thought necessary.
//          This is because the ItemPalette's state is wiped when the dragged out element 
//          is selected, which forces this component to maintain the shadow and item creation state
class Toolbar extends React.Component {
    // the initial state
    state = {
        shadow: {show: false, image: null},
        mouseOrigin: null,
        elementDragConfig: null
    }

    render() {
        // grab the used props
        const { style, selection, ...unusedProps } = this.props

        return (
            <div style={{...styles.container, ...style}}>
                {Object.values(selection).some(({length}) => length > 0)
                    ? <SelectionSummary selection={selection}/>
                    : <ItemPalette onMouseDown={this._mouseDown}/>
                }
                <Footer />

                {/* the image to show while dragging (and over the toolbar) */}
                {this.state.shadow.show && (
                    <img 
                        src={this.state.shadow.image}
                        style={{
                            ...{top: this.state.mouseOrigin.y, left: this.state.mouseOrigin.x},
                            ...styles.shadow, 
                        }} 
                    />
                )}

                <EventListener event="mousemove">
                    {this._mouseMove}
                </EventListener>
                <EventListener event="mouseup">
                    {this._mouseUp}
                </EventListener>
            </div>
        )
    }

    @autobind
    _mouseDown({event, image, config}) {
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
        this.setState({
            mouseOrigin: null, 
            shadow: {show: false, image: null},
            elementDragConfig: null
        })
    }

    @autobind
    _mouseMove(event) {
        // if the mouse is down
        if (this.state.mouseOrigin) {
            // compute the location of the mouse
            const pos = {
                x: event.clientX,
                y: event.clientY
            }

            // hide the shadow if the mouse is still over the toolbar
            const showShadow = pos.x >= window.innerWidth - toolbarWidth
            // save a reference to the current element we are dragging
            let { dragElement } = this.state
            // grab the used props
            const { info, elements } = this.props
        
            // grab the type of the element we dragged
            const { type, ...config } = this.state.elementDragConfig

            // if we are not showing the shadow
            if (!showShadow) {
                // if we don't have an element to drag
                if (!this.state.dragElement) {
                    // track that we have created an element
                    dragElement = specMap[type]({...pos, info, elements, config})

                    // create one with the appropriate spec
                    this.props.placeElement(dragElement.element)
                    // select the element we just created
                    this.props.selectElement(dragElement.select)
                }

                // move the element we just created

            }
            // otherwise we are showing the shadow
            else {
                // if we still have an element attached
                if (this.state.dragElement) {
                    // clear the current selection
                    this.props.clearSelection()
                    // delete it
                    this.props.deleteElements(...this.state.dragElement.remove)

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
                dragElement
            })
        }
    }
}

// a dispatch table of element table to spec function
const specMap = {
    propagators: propagatorSpec,
}

const selector = ({elements, info}) => ({elements, info, selection: elements.selection})
const mapDispatchToProps = dispatch => ({
    placeElement: element => dispatch(placeElement(element)),
    selectElement: element => dispatch(selectElements(element)),
    deleteElements: (...elements) => dispatch(deleteElements(...elements)),
    clearSelection: () => dispatch(clearSelection())
})
export default connect(selector, mapDispatchToProps)(Toolbar)

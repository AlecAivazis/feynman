// external imports
import React from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import { EventListener } from 'components'
import { relativePosition , throttle } from 'utils'
import { toolbarWidth } from 'interface/Toolbar/styles'
import { deleteSelection, placeElement, selectElements } from 'actions/elements'

const initialState = {
    mouseDown: false,
    shadow: false,
    origin: null,
    dragElement: null,
}

class PaletteItem extends React.Component {

    static propTypes = {
        style: React.PropTypes.string,
        image: React.PropTypes.string,
        element: React.PropTypes.func.isRequired
    }

    state = initialState

    render() {
        // grab used props
        const { style, image, deleteSelectedElements, element, placeElement, selectElements, ...unusedProps } = this.props

        return (
            <div style={{...styles.paletteItem, ...style}} {...unusedProps} onMouseDown={this._mouseDown}>
                {/* the static image */}
                <img style={styles.image} src={image}/>

                {/* the image to show while dragging (and over the toolbar) */}
                {this.state.shadow && <img style={{...styles.shadow, ...this.state.shadow}} src={image}/>}

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
    _mouseDown(event) {
        // track the state of the mouse
        this.setState({mouseDown: true, shadow: {
            left: event.clientX,
            top: event.clientY
        }})
    }

    @autobind
    _mouseMove(event) {
        // if the mouse is down
        if (this.state.mouseDown) {
            // if the mouse is over the toolbar
            if (event.clientX > window.innerWidth - toolbarWidth) {
                // if we were previously over the diagram, but now we are over the toolbar
                if (!this.state.shadow && this.state.dragElement) {
                    // delete the element we just made
                    this.props.deleteSelectedElements()
                    // make sure to track that we are no longer dragging an element
                    this.setState({dragElement: false})
                }

                // otherwise we are just moving the shadow within the toolbar
                else {
                    // update the location of the shadow
                    this.setState({
                        shadow: {
                            left: event.clientX,
                            top: event.clientY
                        }
                    })
                }
            } 
        
            // otherwise we are just moving the mouse over the diagram
            else {
                // if there is a shadow and we are moving onto the diagram for the first time
                if (this.state.shadow && !this.state.dragElement) {
                    // compute the relative location of the mouse
                    const origin = relativePosition({
                        x: event.clientX,
                        y: event.clientY
                    })

                    // create the appropriate element and get its description
                    const dragElement = this.props.placeElement(this.props.element(origin))

                    // select the element
                    this.props.selectElements(...dragElement.payload)
                    // hide the shadow and hold onto the element we just made so we can move it later
                    // BUG: this element disappears when the created element is selected, i have to move the state of the dragElement
                    //      and which item paletteItem it came from in the ItemPalette component
                    this.setState({shadow: false, dragElement, origin}) 
                }
            }
        }
    }

    @autobind
    _mouseUp(event) {
        // make sure we know the mouse isn't down
        this.setState(initialState)
    }
}

const mapDispatchToProps = dispatch => ({
    deleteSelectedElements: () => dispatch(deleteSelection()),
    selectElements: (elements) => dispatch(selectElements(elements)),
    placeElement: element => dispatch(placeElement(element)),
})

export default connect(null, mapDispatchToProps)(PaletteItem)

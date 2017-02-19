// external imports
import React from 'react'
import { connect } from 'react-redux'
import liftC from 'react-liftc'
import autobind from 'autobind-decorator'
// local imports
import styles, { toolbarWidth } from './styles'
import SelectionSummary from './SelectionSummary'
import ItemPalette from './ItemPalette'
import Footer from './Footer'
import { EventListener } from 'components'


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
                    <img style={{...styles.shadow, ...this.state.mouseOrigin}} src={this.state.shadow.image}/>
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
                top: event.clientY,
                left: event.clientX
            },
            elementDragConfig: config,
        })
    }

    @autobind
    _mouseUp(event) {
        this.setState({
            mouseOrigin: false, 
            shadow: {show: false, image: null},
            elementDragConfig: null
        })
    }

    @autobind
    _mouseMove(event) {
        if (this.state.mouseOrigin) {
            // compute the location of the mouse
            const pos = {
                x: event.clientX,
                y: event.clientY
            }

            // update the state to accomodate the mouse movement
            this.setState({
                // update the location of the mouse in css-position friendly terms
                mouseOrigin: {
                    top: pos.y,
                    left: pos.x
                },
                // hide the shadow if the mouse is still over the toolbar
                shadow: {
                    ...this.state.shadow,
                    show: pos.x >= window.innerWidth - toolbarWidth,
                }
            })
        }
    }
}

const selector = ({elements}) => ({selection: elements.selection})
export default connect(selector)(Toolbar)

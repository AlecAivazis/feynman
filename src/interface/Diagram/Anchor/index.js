// external imports
import React from 'react'
import { DragSource } from 'react-dnd'
// local imports
import styles from './styles'
import { anchorDragType } from '../constants'

const Anchor = ({ x, y, style, connectDragSource, ...unusedProps }) => connectDragSource(
    <circle
        {...{...styles.container, ...style}}
        {...unusedProps}
        cx={x}
        cy={y}
        r={5}
    />
)

// the definition of the drag type
const dragSource = {
    // returns the data describing the dragged element
    beginDrag(props) {
        // for now, just hold onto the id
        return {
            id: props.id
        }
    },

    // when dragging
    isDragging(props, monitor) {
        // console.log(monitor.getClientOffset())
    }
}

// the drag event selector
const selector = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
})

export default DragSource(anchorDragType, dragSource, selector)(Anchor)

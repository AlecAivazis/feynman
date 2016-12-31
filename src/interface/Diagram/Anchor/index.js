// external imports
import React from 'react'
import { DragSource } from 'react-dnd'
import { connect } from 'react-redux'
import _ from 'lodash'
// local imports
import { relativePosition } from 'utils'
import { sidebarWidth } from 'interface/Sidebar/styles'
import { setAnchorLocations } from 'actions/elements'
import styles from './styles'
import { anchorDragType } from '../constants'

class Anchor extends React.Component {
    componentWillReceiveProps({ monitor, x, y, id, item, clientOffset }) {
        // if the client offset is different than the location
        if (item && item.id === id && clientOffset && !_.isEqual(clientOffset, {x, y})) {
            // update the redux store
            this.props.setAnchorLocations({
                id: this.props.id,
                ...relativePosition(clientOffset),
            })
        }
    }

    render() {
        const { x, y, style, connectDragSource, clientOffset}  = this.props

        return connectDragSource(
            <circle
                {...{...styles.container, ...style}}
                cx={x}
                cy={y}
                r={5}
            />
        )
    }
}

// the definition of the drag type
const dragSource = {
    // returns the data describing the dragged element
    beginDrag(props) {
        console.log(props)
        // for now, just hold onto the id
        return {
            id: props.id
        }
    },

    isDragging(props, monitor) {
        return monitor.getItem().id === props.id
    }
}

// the drag event selector
const dragSelector = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    clientOffset: monitor.getClientOffset(),
    item: monitor.getItem(),
})

// wrap the anchor in the draggable interface
export const DraggableAnchor = DragSource(anchorDragType, dragSource, dragSelector)(Anchor)

// the anchor will need
const mapDispatchToProps = dispatch => ({
    // to set its own location
    setAnchorLocations: loc => dispatch(setAnchorLocations(loc))
})

export default connect(null, mapDispatchToProps)(DraggableAnchor)

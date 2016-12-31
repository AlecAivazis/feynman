// external imports
import React from 'react'
import { DragSource } from 'react-dnd'
import { connect } from 'react-redux'
import _ from 'lodash'
// local imports
import { relativePosition, fixPositionToGrid } from 'utils'
import { sidebarWidth } from 'interface/Sidebar/styles'
import { setAnchorLocations } from 'actions/elements'
import styles from './styles'
import { anchorDragType } from '../constants'

class Anchor extends React.Component {
    componentWillReceiveProps({ x, y, id, info, item, clientOffset }) {
        // if the item or clientIffset aren't defined or we are moving another item
        if (!clientOffset || !item || item.id !== id) {
            // don't do anything
            return
        }

        // round the mouse location to the grid
        const client = relativePosition(fixPositionToGrid(clientOffset, info.gridSize))
        // round the store's location to the grid
        const store = fixPositionToGrid({x, y}, info.gridSize)

        // if the client offset is different than the location
        if (client.x !== store.x || client.y !== store.y) {
            // update the redux store
            this.props.setAnchorLocations({
                id: this.props.id,
                ...fixPositionToGrid(
                    relativePosition(clientOffset),
                    info.gridSize
                ),
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
        // for now, just hold onto the id
        return {
            id: props.id
        }
    },
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
// the anchor needs to know the grid size
const mapStateToProps = ({info}) => ({info})

export default connect(mapStateToProps, mapDispatchToProps)(DraggableAnchor)

// external imports
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
// local imports
import { Splittable } from 'components'
import { relativePosition, fixPositionToGrid, generateElementId } from 'utils'
import { sidebarWidth } from 'interface/Sidebar/styles'
import styles from './styles'

const Anchor = ({
    x,
    y,
    selected,
    r,
    fill,
    fixed,
    id,
}) => {

    // get any required styling
    let styling = selected ? styles.selected : styles.notSelected
    // if the anchor is fixed, mixin the fixed with
    styling = fixed ? {...styles.fixed, ...styling} : styling

    return (
        <Splittable
            type="anchors"
            id={id}
        >
            <circle
                cx={x}
                cy={y}
                r={r}
                fill={fill}
                {...styling}
            />
        </Splittable>
    )
}

Anchor.defaultProps = {
    r: 5,
    fill: 'black',
    fixed: false,
}

const splitAnchor = () => {
    // don't bubble
    event.stopPropagation()

    // grab used props
    let { id, selectAnchor, info, elements, addAnchor, addPropagator } = this.props

    // save a reference to the list of selected anchors
    const selectedAnchors = elements.selection.anchors

    // if the drag started with the alt key
    if (event.altKey) {
        // we are going to create a new anchor

        // first, we need an id for the anchor
        // note: this will also make sure we are dragging the right one
        id = generateElementId(elements.anchors)

        // figure out the current location for the anchor
        const pos = fixPositionToGrid(relativePosition({
            x: event.clientX,
            y: event.clientY
        }), info.gridSize)

        // create the new anchor
        addAnchor({
            id,
            ...pos,
        })

        // create a propagator linking the two anchors
        addPropagator({
            type: 'fermion',
            id: generateElementId(elements.propagators),
            anchor1: this.props.id,
            anchor2: id,
        })

        // select the anchor
        selectAnchor(id)
    }
}

export default Anchor

// external imports
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
// local imports
import { Splittable } from 'components'
import { relativePosition, fixPositionToGrid, generateElementId } from 'utils'
import { sidebarWidth } from 'interface/Sidebar/styles'
import { addAnchors, addPropagators, setElementAttrs } from 'actions/elements'
import styles from './styles'

export const Anchor = ({
    x,
    y,
    selected,
    r,
    fill,
    fixed,
    id,
    selectAnchor,
    info,
    elements,
    addAnchor,
    addPropagator,
    snapAnchor,
}) => {
    // get any required styling
    let styling = selected ? styles.selected : styles.notSelected
    // if the anchor is fixed, mixin the fixed with
    styling = fixed ? {...styles.fixed, ...styling} : styling

    return (
        <Splittable
            type="anchors"
            id={id}
            split={splitAnchor({
                selectAnchor,
                info,
                elements,
                addAnchor,
                addPropagator
            })}
        >
            <circle
                className="anchor" // used to remove the elements during export
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

const splitAnchor = ({ info, elements, addAnchor, addPropagator }) => ({id, x, y}) => {
    // we are going to create a new anchor connected to the origin

    // first, we need an id for the anchor
    const newAnchorId = generateElementId(elements.anchors)

    // figure out the current location for the anchor
    const pos = fixPositionToGrid({x, y}, info.gridSize)

    // create the new anchor
    addAnchor({
        id: newAnchorId,
        ...pos,
    })

    // create a propagator linking the two anchors
    addPropagator({
        kind: 'fermion',
        id: generateElementId(elements.propagators),
        anchor1: id,
        anchor2: newAnchorId,
    })

    return {
        type: 'anchors',
        id: newAnchorId
    }
}

const selector = ({diagram: {info, elements}}) => ({info, elements})
const mapDispatchToProps = (dispatch, {x, y}) => ({
    addAnchor: anchors => dispatch(addAnchors(anchors)),
    addPropagator: propagators => dispatch(addPropagators(propagators)),
    snapAnchor: grid => id => dispatch(
        setElementAttrs({type: 'anchors', id, ...fixPositionToGrid({x, y}, grid)})
    )
})
export default connect(selector, mapDispatchToProps)(Anchor)

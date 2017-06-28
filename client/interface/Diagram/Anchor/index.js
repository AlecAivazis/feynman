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
}) => {
    // get any required styling
    let styling = selected ? styles.selected : styles.notSelected
    // if the anchor is fixed, mixin the fixed with
    styling = fixed ? {...styles.fixed, ...styling} : styling

    return (
        <Splittable type="anchors" element={{x, y, id}}>
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

export default Anchor

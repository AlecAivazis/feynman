// external imports
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
// local imports
import { Splittable } from 'components'
import { splitElement } from 'actions/elements'
import Parton from './Parton'
import { generateElementId } from 'utils'

// a mapping of shape type to component to render
const shapeMap = {
    parton: Parton
}

export const Shape = ({kind, dispatch, elements, ...element}) => {
    const Component = shapeMap[kind]
    return (
        <Splittable
            type="shapes"
            id={element.id}
            split={split({
                dispatch,
                element: {...element, kind},
                elements
            })}
        >
            <Component {...element}/>
        </Splittable>
    )
}

const split = ({dispatch, element, elements}) => ({id, x, y}) => {
    // the id of the anchor to select at the end
    const anchorId = generateElementId(elements.anchors)
    // split the shape attached to the anchor
    dispatch(splitElement({
        element,
        location: {x, y},
        connectTo: anchorId,
    }))
    return {
        type: 'anchors',
        id: anchorId
    }
}

Shape.propTypes = {
    kind: PropTypes.string,
    color: PropTypes.string,
    r: PropTypes.number,
}

Shape.defaultProps = {
    kind: "parton",
    color: "black",
    r: 25,
}

const selector = ({diagram: {elements} }) => ({elements})
export default connect(selector)(Shape)

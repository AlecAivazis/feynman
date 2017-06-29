// external imports
import React from 'react'
import PropTypes from 'prop-types'
// local imports
import { Splittable } from 'components'
import Parton from './Parton'

// a mapping of shape type to component to render
const shapeMap = {
    parton: Parton
}

export const Shape = ({kind, dispatch, ...element}) => {
    const Component = shapeMap[kind]
    return (
        <Splittable type="shapes" element={{...element, kind}}>
            <Component {...element}/>
        </Splittable>
    )
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

export default Shape

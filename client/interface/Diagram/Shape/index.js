// external imports
import React from 'react'
// local imports
import { Splittable } from 'components'
import Parton from './Parton'

// a mapping of shape type to component to render
const shapeMap = {
    parton: Parton
}

const Shape = ({kind, ...element}) => {
    const Component = shapeMap[kind]
    return (
        <Splittable type="shapes" id={element.id}>
            <Component {...element}/>
        </Splittable>
    )
}

Shape.propTypes = {
    kind: React.PropTypes.string,
    color: React.PropTypes.string,
    r: React.PropTypes.number,
}

Shape.defaultProps = {
    kind: "parton",
    color: "black",
    r: 20,
}

export default Shape

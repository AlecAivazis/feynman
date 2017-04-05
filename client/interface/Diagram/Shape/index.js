// external imports
import React from 'react'
// local imports
import Parton from './Parton'

// a mapping of shape type to component to render
const shapeMap = {
    parton: Parton
}

const Shape = ({kind, ...unused}) => {
    const Component = shapeMap[kind]
    return <Component {...unused}/>
}

Shape.propTypes = {
    kind: React.PropTypes.string,
}

Shape.defaultProps = {
    kind: "parton"
}

export default Shape

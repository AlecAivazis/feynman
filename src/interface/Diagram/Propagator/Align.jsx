// external imports
import React from 'react'
import SvgMatrix from 'svg-matrix'

const Align = ({x1, y1, x2, y2, length, ...unusedProps}) => {
    const dx = x2 - x1
    const dy = y2 - y1
    const actual = Math.sqrt(dx*dx + dy*dy)
    // compute the angle we need to rotate the propagator to line up correctly
    const angle = Math.atan2(dy, dx) * 180/Math.PI

    // the transform matrix to line the propagator up to the anchors
    const scaleFactor = actual / length
    const transform = SvgMatrix()
                        .rotate(angle, x1, y1)
                        .scale(scaleFactor, scaleFactor, x1, y1)
    return (
        <g transform={transform.transformString} {...unusedProps}/>
    )
}

export default Align

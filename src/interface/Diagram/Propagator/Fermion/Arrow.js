// external imports
import React from 'react'

const FermionArrow = ({ x1, y1, x2, y2, strokeWidth, flip=false, ...unusedProps}) => {
    // some points in space
    const x = (x1 + x2) / 2
    const y = (y1 + y2) / 2
    let dx = x1 - x2
    let dy = y1 - y2

    // make sure there is a line to show
    if (dx === 0 && dy === 0) {
        return null
    }

    // compute some needed lengtghs
    const A = 6 * strokeWidth / 1.4 // a dimensionless quantity to scale the arrow by
    const halfHeight = A * Math.sqrt(3) / 2
    const halfBase = A * 3 / 4

    // the angle the line forces
    let angle = Math.atan(dy/dx) * 180/Math.PI

    // if we need to flip the arrow for consistency
    if (dx >= 0 ) {
        // then do so
        angle += 180
    }

    // add a little bit to accomodate the triangle's original orientation
    angle += 90

    // if we are supposed to flip the original direction
    if (flip) {
        angle += 180
    }

    // render the arrow
    return (
        <polygon
            transform={`rotate(${angle}, ${x}, ${y})`}
            {...unusedProps}
            points={`${x},${y-halfHeight} ${x+halfBase},${y+halfHeight} ${x-halfBase}, ${y+halfHeight}`}
        />
    )
}

export default FermionArrow

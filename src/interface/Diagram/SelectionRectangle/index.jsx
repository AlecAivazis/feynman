// external imports
import React from 'react'
// local imports
import styles from './styles'

const SelectionRectangle = ({ point1, point2 }) => {

    // compute the dimentions of the rectangle
    const width = Math.abs(point2.x-point1.x)
    const height = Math.abs(point2.y-point1.y)

    // figure out the transform to align the rectangle with the user's mouse
    const transform = [1, 0, 0, 1, 0, 0]

    // if the origin is to the right of the mouse
    if (point1.x > point2.x) {
        // we need to move the rectangle to the left by its width
        transform[4] = -width
    }

    // if the origin is above the rectangle
    if (point1.y > point2.y) {
        // we need to translate the rectangle down by its height
        transform[5] = -height
    }

    return (
        <rect
            {...point1}
            {...styles.rectangle}
            width={width}
            height={height}
            transform={`matrix(${transform.join(',')})`}
        />
    )
}

export default SelectionRectangle

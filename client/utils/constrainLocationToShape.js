import { Shape } from 'interface/Diagram/Shape'

const constrainLocationToShape = ({ location, shape }) => {
    // if we are constrained the location to a circular shape
    if (['parton'].includes(shape.kind)) {
        // pull out the shape attributes that we'll need
        const { r = Shape.defaultProps.r, x, y } = shape
        // compute the distance between the location and the shape
        const dx = location.x - x
        const dy = location.y - y
        // and the slow of the line joining the two
        const m = dy / dx

        // calculate the distance from the center of the shape
        const translate = {
            x: Math.sqrt(r * r / (1 + m * m)),
            y: m * Math.sqrt(r * r / (1 + m * m)),
        }

        // apply the right translations in the appropriate quadrant
        if (dx > 0) {
            return {
                x: x + translate.x,
                y: y + translate.y,
            }
        } else if (dx < 0) {
            return {
                x: x - translate.x,
                y: y - translate.y,
            }
        } else {
            return {
                x,
                y: dy > 0 ? y + r : y - r,
            }
        }
    }
}

export default constrainLocationToShape

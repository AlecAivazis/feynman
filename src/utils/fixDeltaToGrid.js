// local imports
import { round } from 'utils'

export default function computeFixedDelta({origin, next, info: { zoomLevel, gridSize }}) {

    // if there is no grid
    if (gridSize === 0) {
        // just move along
        return next
    }

    // convert the grid size into viewport coordinates
    const spacing = gridSize * zoomLevel

    // compute the difference between the mouse's current location and the previous one
    const delta = {
        x: next.x - origin.x,
        y: next.y - origin.y,
    }

    // the location to move to
    const fixed = {...origin}

    // if we have moved the mouse enough in the x direction
    if (Math.abs(delta.x) >= spacing / 2) {
        // add one spacing to element
        fixed.x += round(delta.x, spacing)
    }

    // if we have moved the mouse enough in the x direction
    if (Math.abs(delta.y) >= spacing / 2) {
        // add one spacing to element
        fixed.y += round(delta.y, spacing)
    }

    return fixed
}

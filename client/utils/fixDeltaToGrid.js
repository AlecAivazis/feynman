// local imports
import { round } from 'utils'

export default function computeFixedDelta({origin, next, round=true, info: { zoomLevel, gridSize }}) {

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

    // round the delta to match the grid
    fixed.x += round(delta.x, spacing)
    fixed.y += round(delta.y, spacing)

    return fixed
}

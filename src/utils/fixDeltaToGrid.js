// local imports
import { round } from 'utils'

export default function computeFixedDelta({origin, next, info: { zoomLevel, gridSize }}) {

    // the first thing we have to do is incorporate the zoomLevel
    const target = {
        x: next.x / zoomLevel,
        y: next.y / zoomLevel,
    }

    // if there is no grid
    if (gridSize === 0) {
        // just move along
        return target
    }
    // otherwise there is a grid to accomodate
    else {
        // compute the difference between the mouse's current location and the previous one
        const delta = {
            x: target.x - origin.x,
            y: target.y - origin.y,
        }

        // the location to move to
        const fixed = {...origin}

        // if we have moved the mouse enough in the x direction
        if (Math.abs(delta.x) > gridSize / 2) {
            // add one gridSize to element
            fixed.x += round(delta.x, gridSize)
        }

        // if we have moved the mouse enough in the x direction
        if (Math.abs(delta.y) >= gridSize / 2) {
            // add one gridSize to element
            fixed.y += round(delta.y, gridSize)
        }

        return fixed
    }
}

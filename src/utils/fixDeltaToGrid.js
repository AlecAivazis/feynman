// local imports
import { round } from 'utils'

export default function computeFixedDelta({origin, next, info}) {
    // compute the difference between the mouse's current location and the previous one
    const delta = {
        x: next.x - origin.x,
        y: next.y - origin.y,
    }

    // the amount to move (this will be halved)
    let grid
    // the minimum amount to wait before moving
    let snapMove = {}

    // if there is a grid
    if (info.gridSize > 0) {
        grid = info.gridSize
        // move the element in units of the grid size
        snapMove = {
            x: round(delta.x, grid),
            y: round(delta.y, grid),
        }
    }
    // otherwise there is no grid
    else {
        grid = 2
        // move the element to the mouse's location
        snapMove = {
            x: delta.x, 
            y: delta.y
        }
    }

    // the location to move to
    const fixed = {...origin}

    // if we have moved the mouse enough in the x direction
    if (Math.abs(delta.x) > grid/2) {
        // add one grid to element
        fixed.x += snapMove.x
    }

    // if we have moved the mouse enough in the x direction
    if (Math.abs(delta.y) >= grid/2) {
        // add one grid to element
        fixed.y += snapMove.y
    }

    return fixed
}

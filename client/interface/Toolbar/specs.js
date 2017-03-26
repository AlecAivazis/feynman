// this file contains the functions that map the mouse's location to elements specs
// to be interpretted by the placeElement saga

// local imports
import { generateElementId, ceil } from 'utils'

export const propagatorSpec = ({x, y, info, elements, config}) => {
    // compute two anchor ids to use
    const [anchor1, anchor2] = generateElementId(elements.anchors, 2)
    // compute a propagator id to use
    const propagatorId = generateElementId(elements.propagators)

    // the lower right corner of the bounding box
    const upper = {
        x: ceil(x, info.gridSize),
        y: ceil(y, info.gridSize),
    }

    const lower = {
        x: upper.x - info.gridSize,
        y: upper.y - info.gridSize
    }

    // return the element spec
    return {
        // the element saga to create the propagator
        element: {
            type: "propagators",
            id: propagatorId,
            ...config,
            anchor1: {
                id: anchor1,
                x: lower.x,
                y: upper.y,
            },
            anchor2: {
                id: anchor2,
                x: upper.x,
                y: lower.y,
            }
        },
        // select the propagator we created when we're done
        select: {
            type: 'propagators',
            id: propagatorId,
        },
        // remove the anchors to undo the action
        remove: [
            {
                type: "anchors",
                id: anchor1,
            },
            {
                type: "anchors",
                id: anchor2,
            }
        ]
    }
}

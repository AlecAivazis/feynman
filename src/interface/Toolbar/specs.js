// this file contains the functions that map the mouse's location to elements specs
// to be interpretted by the placeElement saga

// external imports
import { generateElementId } from 'utils'

export const propagatorSpec = ({x, y, info, elements, config}) => {
    // compute two anchor ids to use
    const [anchor1, anchor2] = generateElementId(elements.anchors, 2)
    // compute a propagator id to use
    const propagatorId = generateElementId(elements.propagators)

    // return the element spec
    return {
        // the element saga to create the propagator
        element: {
            type: "propagators",
            id: propagatorId,
            ...config,
            anchor1: {
                id: anchor1,
                x: 50,
                y: 100,
            },
            anchor2: {
                id: anchor2,
                x: 100,
                y: 100
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

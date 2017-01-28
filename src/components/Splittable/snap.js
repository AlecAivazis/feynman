// local imports
import { fixPositionToGrid } from 'utils'

export const snapAnchor = ({id, elements, info, setElementAttrs}) => (
    setElementAttrs({
        id,
        type: 'anchors',
        ...fixPositionToGrid(elements.anchors[id], info.gridSize),
    })
)

export const snapPropagator = ({ setElementAttrs, elements, info:{gridSize}, id}) => {
    // get the anchors assocaited with the propagator we need to snap
    const {anchor1: anchor1Id, anchor2: anchor2Id} = elements.propagators[id]

    // save references to the two anchors
    const anchor1 = elements.anchors[anchor1Id]
    const anchor2 = elements.anchors[anchor2Id]
    
    // the list of changes
    const moves = []

    // if the first anchor is not fixed
    if (!anchor1.fixed) {
        // compute the new location for anchor1
        const anchor1Loc = fixPositionToGrid(anchor1, gridSize)

        // then update its location
        moves.push({
            type: 'anchors',
            id: anchor1Id,
            ...anchor1Loc,
        })
    }
    
    // if the second anchor is not fixed
    if (!anchor2.fixed) {
        // compute the new location for anchor2
        const anchor2Loc = fixPositionToGrid(anchor2, gridSize)

        // then update its location
        moves.push({
            type: 'anchors',
            id: anchor2Id,
            ...anchor2Loc,
        })
    }

    // update the new location for the anchors
    setElementAttrs(...moves)
}

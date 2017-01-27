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
    const {anchor1, anchor2} = elements.propagators[id]
    // compute the new location for anchor1
    const anchor1Loc = fixPositionToGrid(elements.anchors[anchor1], gridSize)
    const anchor2Loc = fixPositionToGrid(elements.anchors[anchor2], gridSize)

    // update the new location for the anchors
    setElementAttrs(
        {
            type: 'anchors',
            id: anchor1,
            ...anchor1Loc,
        },
        {
            type: 'anchors',
            id: anchor2,
            ...anchor2Loc,
        }
    )
}

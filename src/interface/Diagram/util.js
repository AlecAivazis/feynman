
// propagatorsWithLocation returns the list of propagator configuration
// with concrete (dereferenced) values
export const propagatorsWithLocation = elements => elements.propagators.map(
    ({anchor1, anchor2, ...propagator}) => {
        // get the location for the two anchors (guarunteed to exist by the reducer)
        const anch1 = elements.anchors[anchor1]
        const anch2 = elements.anchors[anchor2]

        // add the anchor positions to the propagator config
        return {
            ...propagator,
            x1: anch1.x,
            y1: anch1.y,
            x2: anch2.x,
            y2: anch2.y,
        }
    }
)

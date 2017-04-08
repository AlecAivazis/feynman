import constrainLocationToShape from './constrainLocationToShape'

// elementsWithLocations returns the list of elements configuration
// with concrete (dereferenced) values. This means that first anchors are
// constrained to any shapes, and then propagators are provided locations
// between the appropriate anchors
const elementsWithLocations = elements => {

    // the anchors in our diagram are potentially constrained
    const anchors = Object.values(elements.anchors).reduce(
       (prev, next) => {
            // the function to apply to the constraint
            let coordinates = {x: next.x, y: next.y}

            // if the anchor is constrained to a shape
            if (next.constraint) {
                // use the constrained location instead
                coordinates = constrainLocationToShape({
                    location: coordinates,
                    shape: elements.shapes[next.constraint],
                })
            }

            return {
                ...prev,
                [next.id]: {
                    ...next,
                    ...coordinates
                }
            }
        }
    , {})

    return {
        anchors: Object.values(anchors),
        propagators: Object.values(elements.propagators).map(
            ({anchor1, anchor2, ...propagator}) => {
                // get the location for the two anchors (guarunteed to exist by the reducer)
                const anch1 = anchors[anchor1]
                const anch2 = anchors[anchor2]

                // add the anchor positions to the propagator config
                return {
                    ...propagator,
                    anchor1,
                    anchor2,
                    x1: anch1.x,
                    y1: anch1.y,
                    x2: anch2.x,
                    y2: anch2.y,
                }
            }
        )
    }
}

export default elementsWithLocations

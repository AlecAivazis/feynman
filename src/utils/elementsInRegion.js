// external imports
import _ from 'lodash'

// :muscle:
const flatMap = function(arr, lambda) {
    return Array.prototype.concat.apply([], arr.map(lambda));
};

// this function returns a reference to the elements within a region
const elementsInRegion = ({elements, region:{point1, point2}}) => {
    // save a reference to the anchors
    const anchors = elements.anchors

    // figure out the lower left ( really upper left corner)
    const lowerLeft = {}
    lowerLeft.x = point1.x < point2.x ? point1.x : point2.x
    lowerLeft.y = point1.y < point2.y ? point1.y : point2.y

    // figure out the upper right ( really lower left corner)
    const upperRight = {}
    upperRight.x = point1.x > point2.x ? point1.x : point2.x
    upperRight.y = point1.y > point2.y ? point1.y : point2.y

    // return each type of element
    const res =  flatMap(Object.keys(elements),
        // mapped to a list of elements of that type that are inside that region (will be flattened)
        type => Object.values(elements[type]).reduce((prev, {id, ...rest}) => {
            // the summary of the element
            const element = {id, type}

            // if we are looking at an anchor
            if (type === 'anchors') {
                // for the anchor to be selected, its coordinates must fall within the region
                if (rest.x > lowerLeft.x && rest.x < upperRight.x
                        && rest.y > lowerLeft.y && rest.y < upperRight.y) {
                    // add the element to the list
                    prev.push(element)
                }

                // return the previous list
                return prev
            }
        }, [])
    ).filter(id => id)

    return res
}

export default elementsInRegion

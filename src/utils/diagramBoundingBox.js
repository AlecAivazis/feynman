// the padding to give the diagram
const padding = 10

export default function diagramBoundingBox(elements) {
    // the object to return
    const bb = {}

    // diagram bounding boxes are primarily defined by the anchors
    for (const {x, y} of Object.values(elements.anchors)) {
        // if the anchor is less than the lowest value of the bounding boxes
        // or we haven't set a value yet
        if (!bb.x1 || x < bb.x1) {
            // this anchor defines the lower bound of the bounding box
            bb.x1 = x 
        }
        // and so on...
        if (!bb.x2 || x > bb.x2) {
            bb.x2 = x
        }
        if (!bb.y1 || y < bb.y1) {
            bb.y1 = y
        }
        if (!bb.y2 || y > bb.y2) {
            bb.y2 = y
        } 
    }

    // add a padding to the bounding box
    bb.x1 -= padding
    bb.y1 -= padding
    bb.x2 += padding
    bb.y2 += padding

    return {
        ...bb,
        width: Math.abs(bb.x2 - bb.x1),
        height: Math.abs(bb.y2 - bb.y1)
    }
}

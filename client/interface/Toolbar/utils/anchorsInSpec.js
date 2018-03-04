export default function anchorsInSpec(doc) {
    // if we were passed a null doc
    if (doc === null) {
        // return an empty list
        return []
    }

    // grab the used information
    const { type, ...spec } = doc.element

    // if the spec is a propagator
    if (type === 'propagators') {
        // there are two anchors in a propagator labeled anchor1 and anchor2
        return [spec.anchor1, spec.anchor2]
    } else {
        // otherwise its a type we don't recognize
        return []
    }
}

import range from './range'

// this function returns a unique id for an anchor from the given store
const generateAnchorId = state => {
    // the list of known anchor id
    const anchors = Object.keys(state.elements.anchors)

    // create our first candidate
    let candidate = Math.floor(Math.random() * 10000)
    // while there is still a conflict
    while (anchors.includes(candidate)) {
        // generate another random id
        candidate = Math.floor(Math.random() * 10000)
    }
    // the candidate is unique

    // return the candidate
    return candidate
}

const generateMultipleAnchorIds = (state, n=1) => {
    // the list of ids
    const ids = []

    // generate the right number of ids
    for (const i of range(n)) {
        // create a candidate
        let candidate = generateAnchorId(state)
        // while there is a conflict with ids we've already generated
        while (ids.includes(candidate)) {
            // generate a new id
            candidate = generateAnchorId(state)
        }
        // the candidate is garunteed unique, add it to the list
        ids.push(candidate)
    }

    return n === 1 ? ids[0] : ids
}

export default generateMultipleAnchorIds
import range from './range'

// this function returns a unique id for an anchor from the given store
const generateAnchorId = store => {
    // the list of known anchor id
    const anchors = Object.keys(store.getState().elements.anchors)

    // create our first candidate
    let candidate = Math.random() * 10000
    // while there is still a conflict
    while (anchors.includes(candidate)) {
        // generate another random id
        candidate = Math.random() * 10000
    }
    // the candidate is unique

    // return the candidate
    return candidate
}

const generateMultipleAnchorIds = (store, n=1) => {
    // the list of ids
    const ids = []

    // generate the right number of ids
    for (const i of range(n)) {
        // create a candidate
        let candidate = generateAnchorId(store)
        // while there is a conflict with ids we've already generated
        while (ids.includes(candidate)) {
            // generate a new id
            candidate = generateAnchorId(store)
        }
        // the candidate is garunteed unique, add it to the list
        ids.push(candidate)
    }

    return n === 1 ? ids[0] : ids
}

export default generateMultipleAnchorIds
import range from './range'

// this function returns a unique id for an anchor from the given store
const generateElementId = anchors => {
    // create our first candidate
    let candidate = Math.floor(Math.random() * 10000)
    // while there is still a conflict
    while (anchors[candidate]) {
        // generate another random id
        candidate = Math.floor(Math.random() * 10000)
    }
    // the candidate is unique

    // return the candidate
    return candidate
}

const generateMultipleElementIds = (anchors, n=1) => {
    // the list of ids
    const ids = []

    // generate the right number of ids
    for (const i of range(n)) {
        // create a candidate
        let candidate = generateElementId(anchors)
        // while there is a conflict with ids we've already generated
        while (ids.includes(candidate)) {
            // generate a new id
            candidate = generateElementId(anchors)
        }
        // the candidate is garunteed unique, add it to the list
        ids.push(candidate)
    }

    return n === 1 ? ids[0] : ids
}

export default generateMultipleElementIds
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

export default generateAnchorId
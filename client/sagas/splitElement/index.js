// external imports
import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'
// local imports
import { SPLIT_ELEMENT } from 'actions/elements'
import splitShape from './splitShape'

// a map of element type to the split function
const splitMap = {
    shapes: splitShape,
}

export function* splitElementWorker({type, payload: {element, location}}) {
    // try to get the appropriate handler for the element type
    const splitFn = splitMap[element.type]
    // if there is a function to call
    if(splitFn) {
        // padd the element and location along
        yield* splitFn({element, location})
    }
}


// this saga loads a particular pattern
export default function* splitElement() {
    // whenever we want to load a pattern onto the diagram
    yield takeEvery(SPLIT_ELEMENT, splitElementWorker)
}

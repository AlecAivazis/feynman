// external imports
import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'
// local imports
import { SPLIT_ELEMENT } from 'actions/elements'
import shape from './shape'
import propagator from './propagator'

// a map of element type to the split function
const splitMap = {
    shapes: shape,
    propagators: propagator,
}

export function* splitElementWorker({type, payload: {type: elementType, element, location}}) {
    // try to get the appropriate handler for the element type
    const splitFn = splitMap[elementType]

    // if there is a function to call
    if(splitFn) {
        // pass the element and location to the appropriate function
        yield* splitFn({element, location})
    }
}


// this saga loads a particular pattern
export default function* splitElement() {
    // whenever we want to load a pattern onto the diagram
    yield takeEvery(SPLIT_ELEMENT, splitElementWorker)
}

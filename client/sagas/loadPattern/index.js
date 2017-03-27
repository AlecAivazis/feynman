// external imports
import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'
// local imports
import { placeElement, clearElements } from 'actions/elements'
import { LOAD_PATTERN } from 'actions/elements/types'

export function* loadPatternWorker({type, payload:{elements}}) {
    // first thing to do is clear the current diagram
    yield put(clearElements())

    // load the element
    yield put(placeElement(elements))
}


// this saga loads a particular pattern
export default function* loadPattern() {
    // whenever we want to load a pattern onto the diagram
    yield takeEvery(LOAD_PATTERN, loadPatternWorker)
}

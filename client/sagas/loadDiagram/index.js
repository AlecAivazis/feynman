// external imports
import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'
// local imports
import { LOAD_DIAGRAM, loadPattern } from 'actions/elements'
import { setDiagramTitle } from 'actions/info'

export function* loadDiagramWorker({ type, payload: { elements, title } }) {
    // load the pattern specified in the diagram
    yield put(loadPattern({ elements }))

    // set the diagram title to match
    yield put(setDiagramTitle(title))
}

// this saga loads a particular diagram
export default function* loadDiagram() {
    // whenever we want to load a Diagram onto the diagram
    yield takeEvery(LOAD_DIAGRAM, loadDiagramWorker)
}

// external imports
import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'
import _ from 'lodash'
// local imports
import { LOAD_DIAGRAM, loadPattern } from 'actions/elements'
import { setDiagramTitle } from 'actions/info'
import { commit } from 'actions/history'

const convertObjectToArray = obj =>
    Object.keys(obj)
        .reduce((prev, key) => {
            const newList = [...prev]
            newList[key] = obj[key]

            return newList
        }, [])
        .filter(Boolean)

export function* loadDiagramWorker({ type, payload: { elements, title } }) {
    const diagramElements = Object.keys(elements).reduce(
        (prev, key) => ({
            ...prev,
            [key]: convertObjectToArray(elements[key]),
        }),
        { type: 'pattern' }
    )

    // load the pattern specified in the diagram
    yield put(loadPattern({ elements: diagramElements }))

    // set the diagram title to match
    yield put(setDiagramTitle(title))
}

// this saga loads a particular diagram
export default function* loadDiagram() {
    // whenever we want to load a Diagram onto the diagram
    yield takeEvery(LOAD_DIAGRAM, loadDiagramWorker)
}

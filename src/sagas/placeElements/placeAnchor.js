// external imports
import { put } from 'redux-saga/effects'
// local imports
import { addAnchors } from 'actions/elements'

export default function* createAnchor(...anchors) {

    // next we have to create a propagator between the two anchors
    yield put(addAnchors(...anchors))
}

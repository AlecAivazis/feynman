// external imports
import { put } from 'redux-saga/effects'
// local imports
import { addAnchors, addPropagators } from 'actions/elements'

export default function* createPropagator({ anchor1, anchor2, ...element }) {
    // first thing to do is create both anchors
    yield put(addAnchors(anchor1, anchor2))

    // next we have to create a propagator between the two anchors
    yield put(addPropagators({
        ...element,
        anchor1: anchor1.id,
        anchor2: anchor2.id,
    }))
}

// external imports
import { put } from 'redux-saga/effects'
// local imports
import { addElements } from 'actions/elements'

export default function* createText(...texts) {
    // next we have to create a propagator between the two texts
    yield put(addElements(...texts.map(text => ({type: "text", ...text}))))
}

// external imports
import { put } from 'redux-saga/effects'
// local imports
import { addElements } from 'actions/elements'

export default function* createShapes(...shapes) {
    yield put(addElements(...shapes.map(shape => ({ type: 'shapes', ...shape }))))
}

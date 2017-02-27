// local imports
import placeElements from './placeElements'
import loadPattern from './loadPattern'

export default function* rootSaga() {
    yield [
        placeElements(),
        loadPattern(),
    ]
}

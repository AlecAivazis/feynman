// local imports
import placeElements from './placeElements'
import loadPattern from './loadPattern'
import withCommit from './withCommit'
import splitElement from './splitElement'

export default function* rootSaga() {
    yield [
        placeElements(),
        loadPattern(),
        withCommit(),
        splitElement(),
    ]
}

// local imports
import placeElements from './placeElements'
import loadPattern from './loadPattern'
import withCommit from './withCommit'

export default function* rootSaga() {
    yield [
        placeElements(),
        loadPattern(),
        withCommit(),
    ]
}

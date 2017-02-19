// local imports
import placeElements from './placeElements'

export default function* rootSaga() {
    yield [
        placeElements(),
    ]
}

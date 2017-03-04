// local imports
import placeElements from './placeElements'
import loadPattern from './loadPattern'
import togglePatternInitialVis from './togglePatternInitialVis'

export default function* rootSaga() {
    yield [
        placeElements(),
        loadPattern(),
        togglePatternInitialVis(),
    ]
}

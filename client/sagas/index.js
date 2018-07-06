// local imports
import placeElements from './placeElements'
import loadPattern from './loadPattern'
import withCommit from './withCommit'
import splitElement from './splitElement'
import loadDiagram from './loadDiagram'

export default function* rootSaga() {
    yield [placeElements(), loadPattern(), withCommit(), splitElement(), loadDiagram()]
}

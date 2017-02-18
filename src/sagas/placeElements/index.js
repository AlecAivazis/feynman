// external imports
import { takeEvery } from 'redux-saga'
// local imports
import { PLACE_ELEMENTS } from 'actions/elements/types'
import placePropagator from './placePropagator'

// the dispatch table mapping element type to the saga that creates it
const dispatch = {
    propagators: placePropagator
}

// this saga creates an element for each element description passed
export default function* placeElement() {
    // whenever we want to create a propagator around a particular point
    yield takeEvery(PLACE_ELEMENTS, function* ({type, payload}) {
        // for each element we have to create
        for (const {type, ...element} of payload) {
            // create the element
            yield dispatch[type](element)
        }
    })
}

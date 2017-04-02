// external imports
import { takeEvery } from 'redux-saga'
// local imports
import { PLACE_ELEMENTS } from 'actions/elements/types'
import placePropagator from './placePropagator'
import placeAnchor from './placeAnchor'
import placeText from './placeText'
import { flatMap } from 'utils'

// the dispatch table mapping element type to the saga that creates it
const dispatch = {
    propagators: placePropagator,
    anchors: placeAnchor,
    text: placeText,
}

export function* placeElementWorker({type:action, payload: {type, ...element}}) {
    // if we are rendering a single element
    if (type !== "pattern") {
        // create the element
        yield* dispatch[type](element)
    }
    // otherwise we are rendering more than one element
    else {
        // get the anchors we have to create from any propagator specs
        const associatedAnchors = element.propagators ? flatMap(element.propagators,
            // turn the list of propagators into a list of their non-number anchors
            propagator => [propagator.anchor1, propagator.anchor2].filter(anchor => !isFinite(anchor))
        ) : []

        // the anchors to add
        const anchors = element.anchors ? [...element.anchors, ...associatedAnchors] : associatedAnchors

        // if there are anchors to add
        if (anchors.length > 0) {
            // add all of the anchors
            yield* dispatch.anchors(...anchors)
        }

        // if there are propagators
        if (element.propagators) {
            // and the propagators
            yield* dispatch.propagators(...element.propagators.map(prop => ({
                ...prop,
                // make sure we only pass the ids into the next factory so that we don't duplicate
                anchor1: prop.anchor1.id || prop.anchor1,
                anchor2: prop.anchor2.id || prop.anchor2,
            })))
        }

        // if there are text elements to add
        if (element.text) {
            // add the text elements
            yield* dispatch.text(...element.text)
        }
    }
}

// this saga creates an element for each element description passed
export default function* placeElement() {
    // whenever we want to create a propagator around a particular point
    yield takeEvery(PLACE_ELEMENTS, placeElementWorker)
}

// external imports
import { put } from 'redux-saga/effects'
// local imports
import { flatMap } from 'utils'
import { addAnchors, addPropagators } from 'actions/elements'

export default function* createPropagator(...propagators) {
    // figure out if there are any anchors to create
    const anchors = flatMap(propagators, 
        // find the non-numeric anchors
        ({anchor1, anchor2}) => [anchor1, anchor2].filter(anchor => !isFinite(anchor))
    )

    // if there are anchors to create
    if (anchors.length > 0) {
        // create the anchors
        yield put(addAnchors(...anchors))
    }

    // next we have to create a propagator between the two anchors
    yield put(addPropagators(...propagators.map(prop => ({
        ...prop,
        anchor1: prop.anchor1.id || prop.anchor1,
        anchor2: prop.anchor2.id || prop.anchor2,
    }))))
}

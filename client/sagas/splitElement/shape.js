// external imports
import { select, put } from 'redux-saga/effects'
// local imports
import { addElements, selectElements } from 'actions/elements'
import { constrainLocationToShape, generateElementId } from 'utils'

export default function* splitShape({ element, location }) {
    // the current state
    const state = (yield select(state => state.diagram.elements)) || {
        anchors: {},
        propagators: {},
    }

    // compute the constrained location
    const constrained = constrainLocationToShape({ shape: element, location })

    // generate 2 anchor ids
    const [anchor1, anchor2] = generateElementId(state.anchors, 2)

    // and a propagator id
    const propagator = generateElementId(state.propagators)

    // if there isn't an id of the shape
    if (!element.id) {
        throw new Error('Could not find id of shape to split')
    }

    // the first thing we have to do is create 2 anchors
    yield put(
        addElements(
            {
                type: 'anchors',
                id: anchor1,
                ...constrained,
                constraint: element.id,
            },
            {
                type: 'anchors',
                id: anchor2,
                ...constrained,
            }
        )
    )

    // create a propagator between the two anchors
    yield put(
        addElements({
            type: 'propagators',
            kind: 'fermion',
            id: propagator,
            anchor1,
            anchor2,
        })
    )

    // when we're done, select the anchor we split off of the shape
    yield put(selectElements({ type: 'anchors', id: anchor2 }))
}

// external imports
import { select, put } from 'redux-saga/effects'
// local imports
import { addAnchors, addPropagators, selectElements, setElementAttrs } from 'actions/elements'
import { generateElementId } from 'utils'

export default function* splitPropagator({ element, location }) {
    // the current state
    const elements = (yield select(state => state.diagram.elements)) || {
        anchors: {},
        propagators: {
            [element.id]: {
                anchor1: 1,
                anchor2: 2,
            },
        },
    }

    // we need two unique ids for the split and the branch
    const [splitAnchorId, branchAnchorId] = generateElementId(elements.anchors, 2)

    // get the anchors assocaited with the propagator we need to snap
    const { anchor1, anchor2 } = elements.propagators[element.id]

    // create both anchors on the mouses current location
    yield put(
        addAnchors(
            {
                id: splitAnchorId,
                ...location,
            },
            {
                id: branchAnchorId,
                ...location,
            }
        )
    )

    // the old line will go between the split and anchor1
    yield put(
        setElementAttrs({
            id: element.id,
            type: 'propagators',
            anchor1,
            anchor2: splitAnchorId,
        })
    )

    // similarly, we need two ids of propagators
    const [newPropagatorId, branchPropagatorId] = generateElementId(elements.propagators, 2)

    // create a new propagator between the split and anchor2, and the split and the branching one
    yield put(
        addPropagators(
            {
                id: newPropagatorId,
                kind: 'fermion',
                anchor1: splitAnchorId,
                anchor2,
            },
            {
                id: branchPropagatorId,
                kind: 'fermion',
                anchor1: splitAnchorId,
                anchor2: branchAnchorId,
            }
        )
    )

    // when we're done, select the anchor we split off of the shape
    yield put(selectElements({ type: 'anchors', id: branchAnchorId }))
}

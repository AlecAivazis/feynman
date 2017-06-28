// external imports
import { select, put } from 'redux-saga/effects'
// local imports
import { addAnchors, addPropagators, selectElements } from 'actions/elements'
import { generateElementId, fixPositionToGrid } from 'utils'

export default function* splitAnchor({element, location}) {
    // get the current state so we can create some IDs
    const state = (yield select(({diagram: {elements, info}}) => ({elements, info}))) || {
        elements: {
            anchors: {},
            propagators: {},
        },
        info: {
            gridSize: 50,
        }
    }

    // we are going to create a new anchor connected to the origin

    // first, we need an id for the anchor
    const newAnchorId = generateElementId(state.elements.anchors)

    // figure out the current location for the anchor
    const pos = fixPositionToGrid(location, state.info.gridSize)

    // create the new anchor
    yield put(addAnchors({
        id: newAnchorId,
        ...pos,
    }))

    // create a propagator linking the two anchors
    yield put(addPropagators({
        kind: 'fermion',
        id: generateElementId(state.elements.propagators),
        anchor1: element.id,
        anchor2: newAnchorId,
    }))

    // select the anchor we just made
    yield put(selectElements({
        type: "anchors",
        id: newAnchorId,
    }))
}

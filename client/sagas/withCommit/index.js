// external imports
import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'
// local imports
import { commit, WITH_COMMIT } from 'actions/history'

export function* withCommitWorker({ type, payload }) {
    // grab the action and message
    const { action, message } = payload

    // first apply the action
    yield put(action)
    // commit the state of the store after the action
    yield put(commit(message))
}

// this saga loads a particular pattern
export default function* withCommit() {
    // whenever we want to load a pattern onto the diagram
    yield takeEvery(WITH_COMMIT, withCommitWorker)
}

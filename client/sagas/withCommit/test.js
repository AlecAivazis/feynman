// external imports
import { put } from 'redux-saga/effects'
// local imports
import { withCommit, commit } from 'actions/history'
import { withCommitWorker } from '.'

describe('Sagas', () => {
    describe('With Commit', () => {
        test('dispatches the provided action and commits it with message', () => {
            // the action to dispatch
            const action = { hello: 'world' }
            // the message to commit with
            const msg = 'hello'

            // the generator wrapping the action
            const gen = withCommitWorker(withCommit(action, msg))

            // make sure the first thing we do is dispatch the action
            expect(gen.next().value).toEqual(put(action))
            // then make sure we commit the state after the action
            expect(gen.next().value).toEqual(put(commit(msg)))
            // we should be done
            expect(gen.next().done).toBeTruthy()
        })
    })
})

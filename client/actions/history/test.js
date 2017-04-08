// local imports
import {
    commit,   COMMIT,
    goto,     GOTO,
    undo,     UNDO,
    redo,     REDO,
} from 'actions/history'

describe('Action Creators', function() {
    describe('History', function() {
        it('can commit the store with a message', function() {
            expect(commit('hello world')).toEqual({
                type: COMMIT,
                payload: 'hello world'
            })
        })

        it('can goto a specific commit', function() {
            expect(goto(123)).toEqual({
                type: GOTO,
                payload: 123
            })
        })

        it('can undo history', function() {
            expect(undo()).toEqual({
                type: UNDO,
            })
        })

        it('can redo history', function() {
            expect(redo()).toEqual({
                type: REDO,
            })
        })
    })
})

// local imports
import { createStore } from 'store'

describe('Reducers', function() {
    describe('Browser reducer', function() {
        it('has width attribute', function() {
            // create a store to test with
            const mock = createStore()

            // make sure the width attribute exists
            expect(mock.getState().browser.width).to.exist
        })

        it('has height attribute', function() {
            // create a store to test with
            const mock = createStore()

            // make sure the height attribute exists
            expect(mock.getState().browser.height).to.exist
        })
    })
})
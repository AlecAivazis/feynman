// local imports
import { createStore } from 'store'

describe('Reducers', () => {
    describe('Browser reducer', () => {
        test('has width attribute', () => {
            // create a store to test with
            const mock = createStore()

            // make sure the width attribute exists
            expect(mock.getState().browser.width).toEqual(window.innerWidth)
        })

        test('has height attribute', () => {
            // create a store to test with
            const mock = createStore()

            // make sure the height attribute exists
            expect(mock.getState().browser.height).toEqual(window.innerHeight)
        })
    })
})

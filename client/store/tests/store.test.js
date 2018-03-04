// local imports
import store, { createStore } from '..'

describe('Application store', () => {
    test('is a valid redux store', () => {
        const store = createStore()
        expect(store.getState()).toBeDefined()
    })

    describe('Factory', () => {
        test('produces an app store', () => {
            // create a mock store
            const mockStore = createStore()
            // make sure it has the info reducer
            expect(mockStore.getState().diagram.elements.propagators).toBeDefined()
        })
    })
})

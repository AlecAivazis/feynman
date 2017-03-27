// local imports
import store, { createStore } from '..'


describe('Application store', function() {
    it('is a valid redux store', function() {
        const store = createStore()
        expect(store.getState()).to.exist
    })

    describe('Factory', function() {
        it('produces an app store', function() {
            // create a mock store
            const mockStore = createStore()
            // make sure it has the info reducer
            expect(mockStore.getState().diagram.elements.propagators).to.exist
        })
    })
})

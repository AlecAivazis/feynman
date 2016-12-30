// local imports
import store, { createStore } from '..'


describe('Application store', function() {
    it('is a valid redux store', function() {
        expect(store.getState()).to.exist
    })

    it('has the info reducer', function() {
        expect(store.getState().info).to.exist
    })

    it('has the elements reducer', function() {
        expect(store.getState().elements).to.exist
    })

    describe('Factory', function() {
        it('produces an app store', function() {
            // create a mock store
            const mockStore = createStore()
            // make sure it has the info reducer
            expect(mockStore.getState().info).to.exist
        })
    })
})

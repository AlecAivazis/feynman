// local imports
import store, { createStore } from '..'


describe('Application store', function() {
    it('Is a valid redux store', function() {
        expect(store.getState()).to.exist
    })

    it('Has the info reducer', function() {
        expect(store.getState().info).to.exist
    })

    it('Has the elements reducer', function() {
        expect(store.getState().elements).to.exist
    })

    describe('Factory', function() {
        it('Produces an app store', function() {
            // create a mock store
            const mockStore = createStore()
            // make sure it has the info reducer
            expect(mockStore.getState().info).to.exist
        })
    })
})

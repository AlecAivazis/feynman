// local imports
import Storage from './storage'

describe('Action Creators', function() {
    describe('Info', function() {
        describe('Storage mock', function() {
            it('can set field', function() {
                // instantiate a storage object to test
                const storage = new Storage()
                // update a field
                storage.setItem("hello", "world")
                // make sure we updated the internal data structure
                expect(storage.value.hello).to.equal('world')
            })

            it('can retrieve fields', function() {
                // instantiate a storage object to test
                const storage = new Storage()
                // update an internal field
                storage.value.hello = "world"
                // make sure we updated the internal data structure
                expect(storage.getItem("hello")).to.equal('world')
            })

            it("can be cleared", function() {
                // instantiate a storage object to test
                const storage = new Storage()
                // update the internal data structure
                storage.value.hello = "world"
                // clear the storage object
                storage.clear()
                // make sure the field updated is empty
                expect(storage.getItem("hello")).to.not.exist
            })
        })
    })
})
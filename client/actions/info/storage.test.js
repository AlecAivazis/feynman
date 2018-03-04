// local imports
import Storage from './storage'

describe('Action Creators', () => {
    describe('Info', () => {
        describe('Storage mock', () => {
            test('can set field', () => {
                // instantiate a storage object to test
                const storage = new Storage()
                // update a field
                storage.setItem('hello', 'world')
                // make sure we updated the internal data structure
                expect(storage.value.hello).toEqual('world')
            })

            test('can retrieve fields', () => {
                // instantiate a storage object to test
                const storage = new Storage()
                // update an internal field
                storage.value.hello = 'world'
                // make sure we updated the internal data structure
                expect(storage.getItem('hello')).toEqual('world')
            })

            test('can be cleared', () => {
                // instantiate a storage object to test
                const storage = new Storage()
                // update the internal data structure
                storage.value.hello = 'world'
                // clear the storage object
                storage.clear()
                // make sure the field updated is empty
                expect(storage.getItem('hello')).not.toBeDefined()
            })
        })
    })
})

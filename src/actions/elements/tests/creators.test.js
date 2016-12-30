// local imports
import { addElement, ADD_ELEMENT } from '..'

describe('Action Creators', function() {
    describe('Element action creators', function() {
        it('add element', function() {
            // the configuration for the element
            const config = {
                foo: 'bar'
            }
            // generate the action
            const action = addElement(config)

            // make sure the structure matches the expectation
            expect(action).to.deep.equal({
                type: ADD_ELEMENT,
                payload: config,
            })

        })

    })
})
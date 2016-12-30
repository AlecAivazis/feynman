// local imports
import { addElements, ADD_ELEMENT } from '..'

describe('Action Creators', function() {
    describe('Element action creators', function() {
        it('add single element', function() {
            // the configuration for the element
            const config = {
                foo: 'bar'
            }
            // generate the action
            const action = addElements(config)

            // make sure the structure matches the expectation
            expect(action).to.deep.equal({
                type: ADD_ELEMENT,
                payload: [config],
            })
        })

        it('add multiple elements', function() {
            // the configuration for the element
            const configs = [
                {
                    foo: 'bar'
                },
                {
                    bar: 'baz'
                }
            ]
            // generate the action
            const action = addElements(...configs)

            // make sure the structure matches the expectation
            expect(action).to.deep.equal({
                type: ADD_ELEMENT,
                payload: configs,
            })
        })

    })
})
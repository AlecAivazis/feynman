// local imports
import { addPropagators, ADD_PROPAGATOR } from '..'

describe('Action Creators', function() {
    describe('Propagator action creators', function() {
        it('add single element', function() {
            // the configuration for the element
            const config = {
                foo: 'bar'
            }
            // generate the action
            const action = addPropagators(config)

            // make sure the structure matches the expectation
            expect(action).to.deep.equal({
                type: ADD_PROPAGATOR,
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
            const action = addPropagators(...configs)

            // make sure the structure matches the expectation
            expect(action).to.deep.equal({
                type: ADD_PROPAGATOR,
                payload: configs,
            })
        })

    })
})
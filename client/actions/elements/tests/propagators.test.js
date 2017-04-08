// local imports
import { addPropagators, ADD_PROPAGATORS } from '..'


describe('Action Creators', function() {
    describe('Elements', function() {
        describe('Propagators', function() {
            it('add single propagator', function() {
                // the configuration for the propagator
                const propagator = {
                    anchor1: 1,
                    anchor2: 2,
                }

                // make sure the action reflects the expectation
                expect(addPropagators(propagator)).toEqual({
                    type: ADD_PROPAGATORS,
                    payload: [propagator],
                })
            })

            it('add multiple propagators', function() {
                // the configuration for the propagator
                const propagators = [
                    {
                        anchor1: 1,
                        anchor2: 2,
                    },
                    {
                        anchor1: 1,
                        anchor2: 2,
                    }
                ]

                // make sure the action reflects the expectation
                expect(addPropagators(...propagators)).toEqual({
                    type: ADD_PROPAGATORS,
                    payload: propagators,
                })
            })
        })
    })
})
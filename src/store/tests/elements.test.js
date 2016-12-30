// external imports
import {combineReducers, createStore} from 'redux'
// local imports
import reducer, { initialState } from '../elements'
import { addPropagators } from 'actions/elements'


describe('Reducers', function() {

    describe('Propgators reducer', function() {
        it('has a reasonable default', function() {
            // pass an undefined current state
            const val = reducer(undefined, {type: "init"})
            // expect the default initial state
            expect(val).to.deep.equal(initialState)
        })

        it('responds to the ADD_PROPAGATORS action', function() {
            // the configuration for the element to add to the reducer
            const config = {
                type: 'fermion',
                x1: 0,
            }
            // create an action corresponding to a new element to add to the list
            const action = addPropagators(config)

            // get the new state after adding it to the reducer
            const state = reducer(undefined, action)

            // make sure the state matches expectation
            expect(state.propagators).to.deep.equal(initialState.propagators.concat([config]))
        })
    })
})

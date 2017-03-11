// external imports
import _ from 'lodash'
// local imports
import { ADD_PROPAGATORS } from 'actions/elements'

// the reducer that manages just the propagator state but has reference
// to the entire element state reducer (must return just the propagator slice)
export default (state, {type, payload}) => {
    // if the payload corresponds to a new propagator
    if (type === ADD_PROPAGATORS) {
        // make a local copy to mess with
        const local = _.cloneDeep(state.propagators)

        // get the current list of anchors
        const { anchors } = state

        // loop over every propagator we are supposed to add
        for (const propagator of payload) {
            // if there is no type
            if(!propagator.kind) {
                throw new Error("Could not add propagator without type")
            }

            // if there is no anchor matching anchor1
            if (!anchors[propagator.anchor1]) {
                throw new Error(`Could not attach propagator to anchor1 with id ${propagator.anchor1}`)
            }

            // if there is no anchor matching anchor2
            if (!anchors[propagator.anchor2]) {
                throw new Error(`Could not attach propagator to anchor2 with id ${propagator.anchor2}`)
            }

            // there is no id
            if (!propagator.id) {
                throw new Error("Cannot add propagator to store withour an id")
            }

            // if there is already a propagator with that id
            if (local[propagator.id]) {
                throw new Error(`Cannot create propagator with id - ${propagator.id} that is already taken.`)
            }

            // save a refernce to the propagator locally
            local[propagator.id] = propagator
        }

        // the propagators are safe to add to the state

        // add the payload to the list of propagators
        return local
    }

    return state.propagators
}

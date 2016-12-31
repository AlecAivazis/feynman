// local imports
import { ADD_PROPAGATORS } from 'actions/elements'

// the reducer that manages just the propagator state but has reference
// to the entire element state reducer (must return just the propagator slice)
export default (state, {type, payload}) => {
    // if the payload corresponds to a new propagator
    if (type === ADD_PROPAGATORS) {
        // get the current list of anchors
        const { anchors } = state

        // loop over every propagator we are supposed to add
        for (const propagator of payload) {
            // if there is no anchor matching anchor1
            if (!anchors[propagator.anchor1]) {
                throw new Error(`Could not attach propagator to anchor1 with id ${propagator.anchor1}`)
            }

            // if there is no anchor matching anchor2
            if (!anchors[propagator.anchor2]) {
                throw new Error(`Could not attach propagator to anchor2 with id ${propagator.anchor2}`)
            }
        }

        // the propagators are safe to add to the state

        // add the payload to the list of propagators
        return [
            ...state.propagators,
            ...payload
        ]
    }

    return state.propagators
}

// local imports
import { TOGGLE_PATTERN_INITIAL_VIS } from 'actions/info/types'


// the name of the field containing the initial pattern visibility
export const fieldName = '@feynman/show_pattern_modal'

export default storage => (dispatch, getState) => {
    // the current value
    const current = getState().diagram.info.patternModalInitalVis

    // invert the value
    storage.setItem(fieldName, !current)

    // we're done so let the store catch up (dispatch the appropriate action)
    dispatch({
        type: TOGGLE_PATTERN_INITIAL_VIS
    })
}

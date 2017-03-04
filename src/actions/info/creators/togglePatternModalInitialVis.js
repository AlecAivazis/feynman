// local imports
import { TOGGLE_PATTERN_INITIAL_VIS } from 'actions/info/types'


// the name of the field containing the initial pattern visibility
export const fieldName = '@feynman/show_pattern_modal'

// I actually need to export a thunk factory so I can pass different storage
// objects in tests vs in "production".
export default storage => (dispatch, getState) => {
    // the current value
    const current = getState().info.patternModalInitalVis

    // invert the value
    storage.setItem(fieldName, !current)
    
    // we're done so let the store catch up (dispatch the appropriate action)
    dispatch({
        type: TOGGLE_PATTERN_INITIAL_VIS
    })
}

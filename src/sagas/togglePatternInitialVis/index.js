// external imports
import { takeEvery } from 'redux-saga'
// local imports
import { TOGGLE_PATTERN_INITAL_VIS } from 'actions/info/types'

// this saga toggles the initial visibility of the pattern modal
export default function* togglePatternInitalVis() {
    // whenever we want to toggle the initial pattern visibility
    yield takeEvery(TOGGLE_PATTERN_INITAL_VIS, function* ({type, payload}) {
        console.log('hello')
    })
}

// externals
import { createStore, combineReducers } from 'redux'
// locals
import info from './info'

// create the reducer
const reducer = combineReducers({
    info,
})

// create the store from the reducer
export default createStore(reducer)

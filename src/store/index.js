// externals
import { createStore, combineReducers } from 'redux'
// locals
import diagram from './diagram'

// create the reducer
const reducer = combineReducers({
    diagram,
})

// create the store from the reducer
export default createStore(reducer)

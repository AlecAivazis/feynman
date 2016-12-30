// externals
import { createStore as createReduxStore, combineReducers } from 'redux'
import { responsiveStoreEnhancer, calculateResponsiveState } from 'redux-responsive'
// locals
import info from './info'
import browser from './browser'
import elements from './elements'

// create the reducer
const reducer = combineReducers({
    info,
    browser,
    elements,
})

export const createStore = () => createReduxStore(reducer, responsiveStoreEnhancer)
// create the store from the reducer
const store = createStore(reducer, responsiveStoreEnhancer)

// make sure we track the window as it changes size
window.addEventListener('resize', () =>
    // updaate the redux store
    store.dispatch(calculateResponsiveState(window))
)

export default store
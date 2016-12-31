// externals
import { createStore as createReduxStore, combineReducers, compose, applyMiddleware } from 'redux'
import { responsiveStoreEnhancer, calculateResponsiveState } from 'redux-responsive'
import thunk from 'redux-thunk'
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

export const createStore = () => createReduxStore(
    reducer,
    compose(
        applyMiddleware(thunk),
        responsiveStoreEnhancer,
    )
)
// create the store from the reducer
const store = createStore()

// make sure we track the window as it changes size
window.addEventListener('resize', () =>
    // updaate the redux store
    store.dispatch(calculateResponsiveState(window))
)

export default store

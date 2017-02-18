// externals
import { createStore as createReduxStore, combineReducers, compose, applyMiddleware } from 'redux'
import { responsiveStoreEnhancer, calculateResponsiveState } from 'redux-responsive'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
// locals
import info from './info'
import browser from './browser'
import elements from './elements'
import DevTools from 'components/DevTools'
import sagas from 'sagas'

// create the reducer
const reducer = combineReducers({
    info,
    browser,
    elements,
})

// the saga middleware
const sagaMiddleware = createSagaMiddleware()

export const createStore = () => createReduxStore(
    reducer,
    compose(
        applyMiddleware(thunk, sagaMiddleware),
        responsiveStoreEnhancer,
        // DevTools.instrument(),
    )
)
// create the store from the reducer
const store = createStore()

// attach the saga middleware to the availible sagas
sagaMiddleware.run(sagas)

// make sure we track the window as it changes size
window.addEventListener('resize', () =>
    // update the redux store
    store.dispatch(calculateResponsiveState(window))
)

export default store

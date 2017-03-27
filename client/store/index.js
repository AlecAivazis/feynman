// externals
import { createStore as createReduxStore, combineReducers, compose, applyMiddleware } from 'redux'
import { responsiveStoreEnhancer, calculateResponsiveState } from 'redux-responsive'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
// locals
import browser from './browser'
import diagram from './diagram'
import sagas from 'sagas'

// create the reducer
const reducer = combineReducers({
    diagram,
    browser,
})

// the saga middleware
const sagaMiddleware = createSagaMiddleware()

export const createStore = () => createReduxStore(
    reducer,
    compose(
        applyMiddleware(sagaMiddleware, thunk),
        responsiveStoreEnhancer,
    )
)
// create the store from the reducer
const store = createStore()

// attach the saga middleware to the availible sagas
sagaMiddleware.run(sagas)

// make sure we track the window as it changes size (so the grid can grow/shrink)
window.addEventListener('resize', () =>
    // update the redux store
    store.dispatch(calculateResponsiveState(window))
)

export default store

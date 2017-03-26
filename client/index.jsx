// external imports
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from 'react-redux'
import 'babel-polyfill'
// local imports
import App from './interface'
import store from './store'

import { placeElement } from 'actions/elements'
import { fieldName } from 'actions/info/creators/togglePatternModalInitialVis'
import { togglePatternModal, TOGGLE_PATTERN_INITIAL_VIS } from 'actions/info'

// check if the user has an opinion on the initial visibility of the pattern modal
// parsing as if json because local storage only stores strings 🤦
const showPatternModal = JSON.parse(window.localStorage.getItem(fieldName))
if (showPatternModal !== null) {
    // the current state of the store
    const initialVisibility = store.getState().diagram.info.patternModalInitalVis
    // if the user wants something different than what the store thinks
    if (showPatternModal !== initialVisibility) {
        // invert the store's notion of the internal visibility
        store.dispatch({
            type: TOGGLE_PATTERN_INITIAL_VIS
        })
        // toggle the actual modal
        store.dispatch(togglePatternModal())
    }
}

ReactDOM.render((
    <Provider store={store}>
        <App/>
    </Provider>
), document.getElementById("app"))

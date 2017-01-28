// external imports
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from 'react-redux'
import 'babel-polyfill'
// local imports
import App from './interface'
import store from './store'

import { addAnchors, addPropagators, selectElements } from 'actions/elements'

store.dispatch(addAnchors(
    {
        id: 1,
        x: 25,
        y: 100,
    },
    {
        id: 2,
        x: 100,
        y: 200,
    },
    {
        id: 3,
        x: 400,
        y: 200,
    },
))

store.dispatch(addPropagators(
    {
        type: 'fermion',
        id: 1,
        anchor1: 1,
        anchor2: 2,
    },
    {
        type: 'fermion',
        id: 2,
        anchor1: 1,
        anchor2: 3,
    }
))

window.store = store

store.dispatch(selectElements(
    {
        type: 'propagators',
        id: 1
    }
))

ReactDOM.render((
    <Provider store={store}>
        <App/>
    </Provider>
), document.getElementById("app"))

// external imports
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from 'react-redux'
import 'babel-polyfill'
// local imports
import App from './interface'
import store from './store'

import { addAnchors, addPropagators } from 'actions/elements'

store.dispatch(addAnchors(
    {
        id: 1,
        x: 50,
        y: 100,
    },
    {
        id: 2,
        x: 100,
        y: 200,
    }
))

store.dispatch(addPropagators(
    {
        type: 'fermion',
        anchor1: 1,
        anchor2: 2,
    }
))

ReactDOM.render((
    <Provider store={store}>
        <App/>
    </Provider>
), document.getElementById("app"))

// external imports
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from 'react-redux'
import 'babel-polyfill'
// local imports
import App from './interface'
import store from './store'

import { placeElement } from 'actions/elements'
import { togglePatternModal } from 'actions/info'

store.dispatch(placeElement({
    type: "pattern",
    anchors: [
        {
            id: 1,
            x: 50,
            y: 100,
        },
        {
            id: 2,
            x: 100,
            y: 150,
        },
        {
            id: 3,
            x: 400,
            y: 200,
        }
    ],
    propagators: [
        {
            kind: 'gluon',
            id: 1,
            anchor1: 1,
            anchor2: 2,
        },
        {
            kind: 'fermion',
            id: 2,
            anchor1: 1,
            anchor2: 3,
        }
    ]
}))

store.dispatch(togglePatternModal())

ReactDOM.render((
    <Provider store={store}>
        <App/>
    </Provider>
), document.getElementById("app"))

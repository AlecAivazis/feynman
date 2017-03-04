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

ReactDOM.render((
    <Provider store={store}>
        <App/>
    </Provider>
), document.getElementById("app"))

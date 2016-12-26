// external imports
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from 'react-redux'
// local imports
import { App } from './views'
import store from './store'

ReactDOM.render((
    <Provider store={store}>
        <App/>
    </Provider>
), document.getElementById("app"))
